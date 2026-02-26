---
title: RegExMatch
sidebar_label: RegExMatch
description: Busca um padrão em uma string usando uma expressão regular (regex) e retorna o trecho correspondente.
---

# RegExMatch

## Descrição

A função `RegExMatch` permite buscar padrões dentro de uma string usando expressões regulares (regex). Ela é super útil quando você precisa validar, extrair ou identificar formatos específicos de texto — como CPFs, CEPs, cupons de desconto, códigos de rastreio, etc. Você passa a string de origem, o padrão regex, o grupo de captura que quer retornar e, opcionalmente, parâmetros como `IgnoreCase`. Se o padrão for encontrado, a função retorna o trecho correspondente; se não, retorna uma string vazia.

## Sintaxe

```ampscript
RegExMatch(sourceString, regExPattern, returnValue [, repeatParameter])
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| sourceString | String | Sim | A string onde a busca será realizada. |
| regExPattern | String | Sim | A expressão regular (regex) que define o padrão a ser buscado. |
| returnValue | String | Sim | O nome ou número ordinal do grupo de captura a ser retornado. Use `0` para retornar o match completo. |
| repeatParameter | String | Não | Opção adicional da enumeração .NET `RegexOptions`, como `IgnoreCase` ou `Multiline`. |

## Exemplo básico

Imagine que a **MegaStore** envia cupons de desconto por e-mail e precisa validar se o código do cupom tem entre 5 e 7 caracteres alfanuméricos antes de exibi-lo:

```ampscript
%%[
VAR @cupom, @regExMatch

SET @cupom = "NATAL23"
SET @regExMatch = RegExMatch(@cupom, "^[a-zA-Z0-9]{5,7}$", 0)

IF Length(@regExMatch) > 0 THEN
]%%

Seu cupom de desconto é: %%=v(@regExMatch)=%%

%%[ ELSE ]%%

Não encontramos um cupom válido para você.

%%[ ENDIF ]%%
```

**Saída:**
```
Seu cupom de desconto é: NATAL23
```

## Exemplo avançado — Extraindo CPF de um texto

Digamos que o **Banco Meridional** recebe dados em formato livre e precisa extrair o CPF do assinante para validação:

```ampscript
%%[
VAR @texto, @cpf

SET @texto = "Olá, meu nome é João Silva e meu CPF é 123.456.789-00. Preciso de ajuda."
SET @cpf = RegExMatch(@texto, "\d{3}\.\d{3}\.\d{3}-\d{2}", 0)

IF Length(@cpf) > 0 THEN
]%%

CPF identificado: %%=v(@cpf)=%%

%%[ ELSE ]%%

Nenhum CPF encontrado na mensagem.

%%[ ENDIF ]%%
```

**Saída:**
```
CPF identificado: 123.456.789-00
```

## Exemplo avançado — Removendo prefixos de nomes com Replace

A **Conecta Telecom** tem uma lista de clientes com prefixos variados (Sr., Sra., Dr., Dra.) e quer padronizar exibindo apenas o nome. Aqui combinamos `RegExMatch` com `Replace` para limpar os dados:

```ampscript
%%[
VAR @nomesRaw, @rows, @row, @nome, @nomeNormalizado, @regexPattern

SET @nomesRaw = "Sr. Carlos Oliveira, Sra. Maria Santos, Dr João Pereira, Dra. Ana Costa, Pedro Almeida"
SET @rows = BuildRowSetFromString(@nomesRaw, ",")
SET @regexPattern = "(Sr\.?\s|Sra\.?\s|Dr\.?\s|Dra\.?\s)"

IF RowCount(@rows) >= 1 THEN
  FOR @i = 1 TO RowCount(@rows) DO
    SET @row = Row(@rows, @i)
    SET @nome = Field(@row, 1)
    SET @nomeNormalizado = Replace(@nome, RegExMatch(@nome, @regexPattern, 0), "")
]%%

%%=v(@nomeNormalizado)=%%

%%[
  NEXT @i
ENDIF
]%%
```

**Saída:**
```
Carlos Oliveira
Maria Santos
João Pereira
Ana Costa
Pedro Almeida
```

## Exemplo avançado — Validando CEP brasileiro

A **FarmaRede** oferece frete grátis para compras acima de R$ 299,00, mas antes precisa validar se o CEP informado está no formato correto:

```ampscript
%%[
VAR @cep, @cepValido

SET @cep = "01310-100"
SET @cepValido = RegExMatch(@cep, "^\d{5}-\d{3}$", 0)

IF Length(@cepValido) > 0 THEN
]%%

CEP %%=v(@cepValido)=%% validado! Frete grátis para compras acima de R$ 299,00. 🎉

%%[ ELSE ]%%

O CEP informado não está em um formato válido. Use o formato 00000-000.

%%[ ENDIF ]%%
```

**Saída:**
```
CEP 01310-100 validado! Frete grátis para compras acima de R$ 299,00. 🎉
```

## Exemplo avançado — Usando IgnoreCase

Quando você não tem certeza se o texto virá em maiúsculas ou minúsculas, use o parâmetro `IgnoreCase`:

```ampscript
%%[
VAR @resposta, @match

SET @resposta = "sim, quero participar"
SET @match = RegExMatch(@resposta, "^SIM", 0, "IgnoreCase")

IF Length(@match) > 0 THEN
]%%

Oba! Você foi inscrito no programa de pontos da Lojas Vitória!

%%[ ELSE ]%%

Tudo bem, fica pra próxima!

%%[ ENDIF ]%%
```

**Saída:**
```
Oba! Você foi inscrito no programa de pontos da Lojas Vitória!
```

## Observações

- O `RegExMatch` utiliza o motor de expressões regulares do **.NET (System.Text.RegularExpressions)**. Então a sintaxe regex segue esse padrão — você pode consultar a [documentação oficial da Microsoft](https://learn.microsoft.com/dotnet/standard/base-types/regular-expressions) para referência.
- O parâmetro `returnValue` com valor `0` retorna o match completo. Valores maiores (`1`, `2`, etc.) retornam grupos de captura específicos definidos com parênteses na regex.
- Se o padrão **não** for encontrado, a função retorna uma string vazia. Sempre faça a verificação com `Length()` ou `Empty()` antes de usar o resultado.
- O parâmetro `repeatParameter` aceita qualquer valor da enumeração .NET `RegexOptions`, como `IgnoreCase`, `Multiline`, `Singleline`, entre outros.
- A combinação de `RegExMatch` com [Replace](../string-functions/replace.md) é muito poderosa para limpar e normalizar dados. A vantagem sobre a [ReplaceList](../string-functions/replacelist.md) é que regex lida com variações no texto (espaços extras, pontuação opcional, etc.), enquanto `ReplaceList` só substitui strings estáticas.
- Cuidado com regex muito complexas em envios de alto volume — elas podem impactar a performance do processamento.
- A função funciona em e-mails, CloudPages, SMS e Landing Pages.

## Funções relacionadas

- [Replace](../string-functions/replace.md) — substitui trechos de uma string; combina muito bem com `RegExMatch` para limpar dados.
- [ReplaceList](../string-functions/replacelist.md) — substitui múltiplas strings estáticas de uma vez (alternativa mais simples quando não precisa de regex).
- [IndexOf](../string-functions/indexof.md) — encontra a posição de uma substring (mais simples, sem regex).
- [Substring](../string-functions/substring.md) — extrai uma parte da string por posição e comprimento.
- [Length](../string-functions/length.md) — retorna o tamanho da string; útil para verificar se o `RegExMatch` retornou resultado.
- [Trim](../string-functions/trim.md) — remove espaços no início e fim da string.
- [Empty](../utility-functions/empty.md) — verifica se uma string está vazia; útil para checar o retorno do `RegExMatch`.
- [BuildRowsetFromString](../content-functions/buildrowsetfromstring.md) — transforma uma string delimitada em um rowset para iterar com `FOR`.