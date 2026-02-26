---
title: RegExReplace
sidebar_label: RegExReplace
description: Substitui partes de uma string que correspondem a um padrão de expressão regular (regex) por um valor de substituição especificado.
---

<!-- generated-by-script -->

# RegExReplace

## Descrição

A função `RegExReplace` busca dentro de uma string todas as ocorrências que correspondem a um padrão de expressão regular (regex) e substitui cada uma delas por um valor que você definir. É uma das funções mais poderosas do AMPscript para manipulação de texto, já que permite fazer substituições complexas baseadas em padrões — e não apenas em texto fixo. Use quando precisar limpar, formatar ou transformar dados que seguem um padrão específico, como remover caracteres especiais de CPFs, formatar telefones, sanitizar entradas de formulários ou extrair/reformatar trechos de texto.

## Sintaxe

```ampscript
RegExReplace(string, padraoRegex, substituicao)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| string | String | Sim | A string original onde a busca e substituição será realizada. |
| padraoRegex | String | Sim | O padrão de expressão regular (regex) usado para encontrar as correspondências na string. Utiliza a sintaxe de regex do .NET. |
| substituicao | String | Sim | O valor que substituirá cada ocorrência encontrada pelo padrão regex. Pode ser uma string vazia para remover as correspondências. Suporta referências de grupo de captura (como `$1`, `$2`, etc.). |

## Exemplo básico

Removendo todos os caracteres não numéricos de um CPF para salvar apenas os dígitos:

```ampscript
%%[
VAR @cpfOriginal, @cpfLimpo

SET @cpfOriginal = "123.456.789-00"
SET @cpfLimpo = RegExReplace(@cpfOriginal, "[^0-9]", "")
]%%

CPF original: %%=v(@cpfOriginal)=%%
CPF somente dígitos: %%=v(@cpfLimpo)=%%
```

**Saída:**
```
CPF original: 123.456.789-00
CPF somente dígitos: 12345678900
```

## Exemplo avançado

Imagine que você recebe números de telefone em diferentes formatos na sua Data Extension e precisa padronizar todos para o formato `(XX) XXXXX-XXXX` antes de exibir no e-mail:

```ampscript
%%[
VAR @telefoneRaw, @telefoneLimpo, @telefoneFormatado, @nomeCliente

SET @nomeCliente = "Maria Santos"
SET @telefoneRaw = AttributeValue("Telefone") /* Exemplo: "11999887766" ou "11 99988-7766" ou "(11)99988.7766" */

/* Passo 1: Remove tudo que não é dígito */
SET @telefoneLimpo = RegExReplace(@telefoneRaw, "[^\d]", "")

/* Passo 2: Formata usando grupos de captura — espera 11 dígitos (DDD + 9 dígitos) */
SET @telefoneFormatado = RegExReplace(@telefoneLimpo, "^(\d{2})(\d{5})(\d{4})$", "($1) $2-$3")
]%%

Olá, %%=v(@nomeCliente)=%%!

Seu telefone cadastrado: %%=v(@telefoneFormatado)=%%

Caso esteja incorreto, atualize seus dados em
www.conectatelecom.com.br/meucadastro
```

**Saída:**
```
Olá, Maria Santos!

Seu telefone cadastrado: (11) 99988-7766

Caso esteja incorreto, atualize seus dados em
www.conectatelecom.com.br/meucadastro
```

## Mais exemplos práticos

### Mascarando CPF em comunicações

Exibindo apenas os últimos 2 dígitos do CPF por questões de segurança (LGPD):

```ampscript
%%[
VAR @cpf, @cpfMascarado

SET @cpf = "123.456.789-00"

/* Remove formatação */
SET @cpf = RegExReplace(@cpf, "[^\d]", "")

/* Mascara tudo exceto os 2 últimos dígitos */
SET @cpfMascarado = RegExReplace(@cpf, "^(\d{9})(\d{2})$", "***.***.**9-$2")

/* Alternativa mais precisa: captura cada bloco */
SET @cpfMascarado = RegExReplace(@cpf, "^(\d{3})(\d{3})(\d{3})(\d{2})$", "***.***.***-$4")
]%%

CPF cadastrado: %%=v(@cpfMascarado)=%%
```

**Saída:**
```
CPF cadastrado: ***.***.***-00
```

### Limpando HTML de um campo de texto

Removendo tags HTML de uma descrição de produto vinda de uma Data Extension:

```ampscript
%%[
VAR @descricaoHtml, @descricaoLimpa

SET @descricaoHtml = "<p>Camiseta <strong>100% algodão</strong>, tamanho M. <br/>Frete grátis acima de <b>R$299</b>!</p>"
SET @descricaoLimpa = RegExReplace(@descricaoHtml, "<[^>]+>", "")
]%%

%%=v(@descricaoLimpa)=%%
```

**Saída:**
```
Camiseta 100% algodão, tamanho M. Frete grátis acima de R$299!
```

### Formatando CEP

Adicionando o hífen em um CEP que está armazenado sem formatação:

```ampscript
%%[
VAR @cepRaw, @cepFormatado

SET @cepRaw = "01310100"
SET @cepFormatado = RegExReplace(@cepRaw, "^(\d{5})(\d{3})$", "$1-$2")
]%%

Seu CEP: %%=v(@cepFormatado)=%%
```

**Saída:**
```
Seu CEP: 01310-100
```

### Removendo espaços extras

Substituindo múltiplos espaços em branco por um único espaço:

```ampscript
%%[
VAR @textoSujo, @textoLimpo

SET @textoSujo = "João   Carlos    da   Silva"
SET @textoLimpo = RegExReplace(@textoSujo, "\s+", " ")
]%%

Nome: %%=v(@textoLimpo)=%%
```

**Saída:**
```
Nome: João Carlos da Silva
```

### Extraindo e reformatando data

Convertendo uma data no formato `AAAA-MM-DD` (comum em bancos de dados) para o formato brasileiro `DD/MM/AAAA`:

```ampscript
%%[
VAR @dataOriginal, @dataBR

SET @dataOriginal = "2025-05-15"
SET @dataBR = RegExReplace(@dataOriginal, "^(\d{4})-(\d{2})-(\d{2})$", "$3/$2/$1")
]%%

Data do pedido: %%=v(@dataBR)=%%
```

**Saída:**
```
Data do pedido: 15/05/2025
```

## Observações

- O padrão regex utiliza a **sintaxe de expressões regulares do .NET** (System.Text.RegularExpressions), já que o AMPscript roda sobre a plataforma .NET.
- A substituição é aplicada a **todas as ocorrências** encontradas na string, não apenas à primeira.
- Você pode usar **grupos de captura** com parênteses `()` no padrão e referenciá-los na string de substituição com `$1`, `$2`, `$3`, etc.
- Para **remover** as correspondências, passe uma string vazia `""` como terceiro parâmetro.
- Se o padrão regex for inválido, a função pode gerar um erro em tempo de execução. Teste sempre seus padrões antes de usar em envios de produção.
- Se a string de entrada for vazia ou nula, o comportamento pode variar. É uma boa prática usar [Empty](../utility-functions/empty.md) ou [IsNull](../utility-functions/isnull.md) para validar antes de chamar a função.
- Expressões regulares complexas podem impactar a performance do processamento, principalmente em envios de grande volume. Prefira padrões simples sempre que possível.
- Para substituições de texto fixo (sem padrões), prefira usar [Replace](../string-functions/replace.md), que é mais simples e performática.
- Funciona em todos os contextos do SFMC: e-mails, CloudPages, SMS e Landing Pages.

## Funções relacionadas

- [RegExMatch](../string-functions/regexmatch.md) — Busca e retorna a parte da string que corresponde a um padrão regex, sem substituir.
- [Replace](../string-functions/replace.md) — Substitui ocorrências de uma string fixa por outra (sem usar regex).
- [ReplaceList](../string-functions/replacelist.md) — Substitui múltiplos valores de uma só vez.
- [Trim](../string-functions/trim.md) — Remove espaços em branco do início e fim de uma string.
- [Substring](../string-functions/substring.md) — Extrai uma parte da string com base na posição e comprimento.
- [IndexOf](../string-functions/indexof.md) — Encontra a posição de um texto dentro de uma string.
- [Concat](../string-functions/concat.md) — Concatena múltiplas strings em uma só.
- [Length](../string-functions/length.md) — Retorna o tamanho de uma string.