---
title: RegExMatch
sidebar_label: RegExMatch
description: Busca um padrão em uma string usando expressões regulares e retorna o grupo correspondente.
---

# RegExMatch

## Descrição

A função `RegExMatch` busca um padrão dentro de uma string usando expressões regulares (regex). É extremamente útil no dia a dia de SFMC quando você precisa validar formatos de dados como CPF, CEP, telefone ou extrair partes específicas de um texto — situações comuns ao lidar com dados de clientes brasileiros que nem sempre vêm padronizados. Você passa a string, o padrão regex, o grupo de correspondência que quer retornar e, opcionalmente, parâmetros de repetição como `IgnoreCase` ou `Multiline`.

## Sintaxe

```ampscript
RegExMatch(sourceString, regExPattern, returnValue, repeatParameter)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| sourceString | string | Sim | A string onde a busca será realizada. |
| regExPattern | string | Sim | A expressão regular usada na busca. |
| returnValue | string | Sim | O nome ou ordinal do grupo de correspondência a ser retornado. |
| repeatParameter | string | Não | Parâmetro de repetição a ser aplicado. Aceita qualquer valor da enumeração .NET `RegexOptions`, como `IgnoreCase` e `Multiline`. |

## Exemplo básico

Validando se um código promocional informado pelo cliente contém entre 5 e 7 caracteres alfanuméricos:

```ampscript
%%[

SET @codigoPromo = "MEGA23"
SET @resultado = RegExMatch(@codigoPromo, "^[a-zA-Z0-9]{5,7}$", 0)

IF NOT EMPTY(@resultado) THEN

]%%

O código <b>%%=v(@resultado)=%%</b> é válido! Aproveite seu desconto na MegaStore.

%%[ ELSE ]%%

O código informado não é válido. Verifique e tente novamente.

%%[ ENDIF ]%%
```

**Saída:**
```
O código MEGA23 é válido! Aproveite seu desconto na MegaStore.
```

## Exemplo avançado

Removendo prefixos de tratamento (Sr., Sra., Dr., Dra.) dos nomes de clientes em um rowset para padronizar a saudação em uma campanha de e-mail da Lojas Vitória:

```ampscript
%%[

SET @nomes = BuildRowsetFromString("Sr. João Silva,Sra. Maria Santos,Dr. Carlos Mendes,Dra. Ana Lima,Pedro Rocha", ",")

FOR @i = 1 TO RowCount(@nomes) DO

  SET @linhaAtual = Field(Row(@nomes, @i), 1)
  SET @prefixo = RegExMatch(@linhaAtual, "^(Sr\.?a?|Sra\.?|Dr\.?a?|Dra\.?)\s+", 0, "IgnoreCase")

  IF NOT EMPTY(@prefixo) THEN
    SET @nomeLimpo = Replace(@linhaAtual, @prefixo, "")
  ELSE
    SET @nomeLimpo = @linhaAtual
  ENDIF

]%%

Olá, %%=v(@nomeLimpo)=%%! Confira as ofertas da Lojas Vitória.<br>

%%[ NEXT @i ]%%
```

**Saída:**
```
Olá, João Silva! Confira as ofertas da Lojas Vitória.
Olá, Maria Santos! Confira as ofertas da Lojas Vitória.
Olá, Carlos Mendes! Confira as ofertas da Lojas Vitória.
Olá, Ana Lima! Confira as ofertas da Lojas Vitória.
Olá, Pedro Rocha! Confira as ofertas da Lojas Vitória.
```

## Observações

- A `RegExMatch` utiliza o motor de expressões regulares do .NET, então a sintaxe de padrões segue essa especificação. Se você já trabalhou com regex em C# ou PowerShell, vai se sentir em casa.

- O parâmetro `returnValue` aceita o ordinal do grupo de captura. Use `0` para retornar a correspondência completa, `1` para o primeiro grupo entre parênteses, `2` para o segundo, e assim por diante.

- O parâmetro `repeatParameter` aceita valores da enumeração .NET `RegexOptions`. Os mais úteis no dia a dia são `IgnoreCase` (ignora maiúsculas/minúsculas) e `Multiline` (trata cada linha como início/fim separado).

> **💡 Dica:** Ao combinar `RegExMatch` com [Replace](../string-functions/replace.md), você consegue substituir trechos de texto baseados em padrões regex — algo que a [ReplaceList](../string-functions/replacelist.md) não faz, já que ela só trabalha com strings estáticas. Use regex quando os dados de origem tiverem variações e inconsistências (espaços extras, pontuação opcional, etc.).

> **⚠️ Atenção:** Se a expressão regular não encontrar correspondência na string, o retorno será vazio. Sempre valide o resultado com [Empty](../utility-functions/empty.md) antes de usar o valor, especialmente em réguas automatizadas onde dados inconsistentes são comuns.

## Funções relacionadas

- [RegExReplace](../string-functions/regexreplace.md) — substitui trechos com base em regex, sem precisar combinar `RegExMatch` + `Replace` manualmente
- [Replace](../string-functions/replace.md) — substituição simples de strings, ideal para combinar com `RegExMatch`
- [ReplaceList](../string-functions/replacelist.md) — substitui múltiplas strings estáticas de uma vez (sem suporte a regex)
- [IndexOf](../string-functions/indexof.md) — localiza a posição de uma substring (alternativa mais simples quando não precisa de regex)
- [Substring](../string-functions/substring.md) — extrai parte de uma string por posição
- [Trim](../string-functions/trim.md) — remove espaços em branco das extremidades