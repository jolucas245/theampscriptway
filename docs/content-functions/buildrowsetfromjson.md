---
title: BuildRowsetFromJson
sidebar_label: BuildRowsetFromJson
description: Carrega dados JSON em um rowset para que você possa iterar e exibir o conteúdo dinamicamente em emails e CloudPages.
---

<!-- generated-by-script -->

# BuildRowsetFromJson

## Descrição

A função `BuildRowsetFromJson` transforma dados JSON em um rowset AMPscript, permitindo que você itere sobre os dados e insira o conteúdo dinamicamente no seu HTML. É super útil quando você recebe dados de uma API (via [HTTPGet](../http-functions/httpget.md) ou [HTTPPost](../http-functions/httppost.md)) ou quando tem um JSON armazenado em uma Data Extension e precisa extrair informações dele. A função é executada no momento do envio para mensagens e no momento do carregamento para CloudPages. Ela usa expressões JSONPath para navegar pela estrutura do JSON e retorna um rowset que você pode percorrer com [Row](../data-extension-functions/row.md) e [Field](../data-extension-functions/field.md).

## Sintaxe

```ampscript
BuildRowsetFromJson(jsonData, jsonPathExpression, boolReturnEmptyOnError)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| jsonData | String | Sim | Os dados JSON que você quer processar. Não pode ser um objeto JSON simples (plano, sem array). |
| jsonPathExpression | String | Sim | A expressão JSONPath que define quais dados extrair do JSON. Aceita notação de ponto (dot notation) e de colchetes (bracket notation). Não suporta expressões de filtro JSONPath. |
| boolReturnEmptyOnError | Boolean | Sim | Se `true` (1), retorna uma exceção quando ocorre um erro de sintaxe. Se `false` (0), retorna um rowset vazio quando há erro de sintaxe na função ou na expressão JSONPath. |

## Exemplo básico

Imagine que a **MegaStore** quer exibir as ofertas de Black Friday em um email. Os dados dos produtos estão em formato JSON:

```ampscript
%%[

SET @json = '{
  "campanha": "Black Friday MegaStore",
  "produtos": [
    {"nome": "Smart TV 55 polegadas", "precoOriginal": 3499.90, "precoBlackFriday": 2199.90},
    {"nome": "Notebook Ultra i7", "precoOriginal": 5299.00, "precoBlackFriday": 3899.00},
    {"nome": "Fone Bluetooth Pro", "precoOriginal": 349.90, "precoBlackFriday": 199.90}
  ]
}'

SET @rows = BuildRowsetFromJson(@json, "$.produtos", 0)

FOR @i = 1 TO RowCount(@rows) DO
  SET @row = Row(@rows, @i)
  SET @nome = Field(@row, "nome")
  SET @precoOriginal = Field(@row, "precoOriginal")
  SET @precoBlackFriday = Field(@row, "precoBlackFriday")
]%%

Produto: %%=v(@nome)=%%
De: R$ %%=v(@precoOriginal)=%% | Por: R$ %%=v(@precoBlackFriday)=%%

%%[ NEXT @i ]%%
```

**Saída:**
```
Produto: Smart TV 55 polegadas
De: R$ 3499.9 | Por: R$ 2199.9

Produto: Notebook Ultra i7
De: R$ 5299 | Por: R$ 3899

Produto: Fone Bluetooth Pro
De: R$ 349.9 | Por: R$ 199.9
```

Se você quiser extrair apenas os preços de Black Friday, pode apontar direto para a chave:

```ampscript
%%[
SET @precos = BuildRowsetFromJson(@json, "$.produtos[*].precoBlackFriday", 0)

FOR @i = 1 TO RowCount(@precos) DO
  SET @valor = Field(Row(@precos, @i), "Value")
]%%

R$ %%=v(@valor)=%%

%%[ NEXT @i ]%%
```

**Saída:**
```
R$ 2199.9
R$ 3899
R$ 199.9
```

> Repare: quando a expressão JSONPath aponta para **valores** específicos (e não objetos), o rowset retorna uma coluna chamada `Value`.

## Exemplo avançado

Aqui um cenário mais completo: a **Conecta Telecom** envia um email com o extrato de consumo do cliente, buscando os dados via API. O código faz validação, formatação de moeda e exibe uma mensagem de fallback caso não haja dados.

```ampscript
%%[

/* Simulando o JSON que viria de uma API ou DE */
SET @json = '{
  "cliente": "Maria Santos",
  "cpf": "123.456.789-00",
  "telefone": "(11) 99876-5432",
  "plano": "Conecta Max 200MB",
  "consumo": [
    {"mes": "10/2024", "descricao": "Plano mensal", "valor": 119.90, "desconto": 0},
    {"mes": "10/2024", "descricao": "Pacote adicional 50GB", "valor": 29.90, "desconto": 0},
    {"mes": "10/2024", "descricao": "Seguro celular", "valor": 14.90, "desconto": 5.00},
    {"mes": "10/2024", "descricao": "Cashback programa fidelidade", "valor": 0, "desconto": 12.50}
  ]
}'

SET @currency_locale = "pt-BR"

/* Extrair nome do cliente */
SET @nomeRows = BuildRowsetFromJson(@json, "$.cliente", 0)
IF RowCount(@nomeRows) > 0 THEN
  SET @nomeCliente = Field(Row(@nomeRows, 1), "Value")
ELSE
  SET @nomeCliente = "Cliente"
ENDIF

/* Extrair itens de consumo */
SET @rows = BuildRowsetFromJson(@json, "$.consumo", 0)

IF RowCount(@rows) > 0 THEN
]%%

<h2>Olá, %%=v(@nomeCliente)=%%! Aqui está seu extrato.</h2>

<table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse; width:100%;">
  <tr style="background-color:#1a237e; color:#ffffff;">
    <th>Mês</th>
    <th>Descrição</th>
    <th>Valor</th>
    <th>Desconto</th>
    <th>Total</th>
  </tr>

%%[
  SET @totalGeral = 0

  FOR @i = 1 TO RowCount(@rows) DO
    SET @row = Row(@rows, @i)
    SET @mes = Field(@row, "mes")
    SET @descricao = Field(@row, "descricao")
    SET @valor = Field(@row, "valor")
    SET @desconto = Field(@row, "desconto")

    /* Validar se valor é numérico */
    SET @patternNum = "^[0-9]"
    SET @matchValor = RegExMatch(@valor, @patternNum, 0)
    IF Empty(@matchValor) THEN
      SET @valor = 0
    ENDIF

    SET @matchDesconto = RegExMatch(@desconto, @patternNum, 0)
    IF Empty(@matchDesconto) THEN
      SET @desconto = 0
    ENDIF

    SET @totalItem = Subtract(@valor, @desconto)
    SET @totalGeral = Add(@totalGeral, @totalItem)

    SET @valorFmt = FormatCurrency(@valor, @currency_locale)
    SET @descontoFmt = FormatCurrency(@desconto, @currency_locale)
    SET @totalItemFmt = FormatCurrency(@totalItem, @currency_locale)
]%%

  <tr>
    <td>%%=v(@mes)=%%</td>
    <td>%%=v(@descricao)=%%</td>
    <td>%%=v(@valorFmt)=%%</td>
    <td>%%=v(@descontoFmt)=%%</td>
    <td><strong>%%=v(@totalItemFmt)=%%</strong></td>
  </tr>

%%[ NEXT @i ]%%

  <tr style="background-color:#e8eaf6;">
    <td colspan="4" style="text-align:right;"><strong>Total do mês:</strong></td>
    <td><strong>%%=FormatCurrency(@totalGeral, @currency_locale)=%%</strong></td>
  </tr>
</table>

<p style="margin-top:16px;">
  Dúvidas? Acesse <a href="https://www.conectatelecom.com.br/minha-conta">www.conectatelecom.com.br/minha-conta</a>
  ou ligue para 0800 123 4567.
</p>

%%[ ELSE ]%%

<h2>Olá! Não encontramos dados de consumo para este mês.</h2>
<p>
  Se você acredita que isso é um erro, entre em contato com a gente pelo
  telefone 0800 123 4567 ou acesse
  <a href="https://www.conectatelecom.com.br/suporte">nosso suporte</a>.
</p>

%%[ ENDIF ]%%
```

**Saída (renderizada):**

```
Olá, Maria Santos! Aqui está seu extrato.

| Mês     | Descrição                      | Valor    | Desconto | Total    |
|---------|--------------------------------|----------|----------|----------|
| 10/2024 | Plano mensal                   | R$119,90 | R$0,00   | R$119,90 |
| 10/2024 | Pacote adicional 50GB          | R$29,90  | R$0,00   | R$29,90  |
| 10/2024 | Seguro celular                 | R$14,90  | R$5,00   | R$9,90   |
| 10/2024 | Cashback programa fidelidade   | R$0,00   | R$12,50  | -R$12,50 |
|         |                       Total do mês:       | R$147,20 |
```

## Observações

- **O JSON de entrada não pode ser um objeto simples (plano).** Por exemplo, `{"nome": "João", "cidade": "São Paulo"}` sozinho não funciona. Você precisa que a expressão JSONPath resulte em um array ou em valores dentro de uma estrutura que contenha arrays.
- **Quando a expressão JSONPath retorna valores** (como `$.produtos[*].nome`), o rowset terá uma única coluna chamada `Value`. Use `Field(Row(@rows, @i), "Value")` para acessar.
- **Quando a expressão JSONPath retorna objetos** (como `$.produtos`), cada chave do objeto vira uma coluna no rowset, e você acessa pelo nome da chave (ex: `Field(@row, "nome")`).
- **Objetos ou arrays aninhados dentro dos resultados** aparecem como o texto `JSON Object` ou `JSON Object Array`, respectivamente — você não consegue acessar as propriedades internas diretamente. Nesse caso, precisaria de uma segunda chamada a `BuildRowsetFromJson` no valor serializado.
- **Filtros JSONPath não são suportados.** Expressões como `$.produtos[?(@.preco > 100)]` não vão funcionar.
- **Tratamento de erros:**
  - Se o terceiro parâmetro for `false` (0) e houver erro de sintaxe no JSON ou na expressão JSONPath, a função retorna um rowset vazio silenciosamente.
  - Se o terceiro parâmetro for `true` (1) e houver erro de sintaxe, a função lança uma exceção que vai quebrar o seu email/CloudPage.
  - Se o terceiro parâmetro contiver qualquer coisa que não seja um número ou boolean, sempre gera exceção.
- **Expressão JSONPath válida mas sem resultados** retorna um rowset vazio (sem linhas). Sempre use [RowCount](../data-extension-functions/rowcount.md) para verificar antes de iterar.
- **Notação suportada:** tanto dot notation (`$.produtos[0].nome`) quanto bracket notation (`$['produtos'][0]['nome']`).
- A função é executada no **momento do envio** (emails) e no **momento do carregamento** (CloudPages).
- Para JSON muito grandes ou complexos, fique de olho na performance. Se possível, simplifique o JSON antes de processá-lo.

## Funções relacionadas

- [BuildRowsetFromString](../content-functions/buildrowsetfromstring.md) — cria um rowset a partir de uma string delimitada (útil quando seus dados não estão em JSON)
- [BuildRowsetFromXml](../content-functions/buildrowsetfromxml.md) — mesma ideia, mas para dados em formato XML
- [Row](../data-extension-functions/row.md) — acessa uma linha específica do rowset retornado
- [RowCount](../data-extension-functions/rowcount.md) — conta quantas linhas existem no rowset (essencial para validação)
- [Field](../data-extension-functions/field.md) — extrai o valor de uma coluna específica de uma linha do rowset
- [HTTPGet](../http-functions/httpget.md) — busca dados de uma API externa (geralmente retorna JSON que você pode processar com BuildRowsetFromJson)
- [HTTPPost](../http-functions/httppost.md) — envia dados para uma API e recebe a resposta (frequentemente em JSON)
- [Empty](../utility-functions/empty.md) — verifica se um valor está vazio (útil para validar os dados extraídos)
- [V](../utility-functions/v.md) — exibe o valor de uma variável no HTML
- [RegExMatch](../string-functions/regexmatch.md) — valida valores com expressões regulares (útil para checar se um campo é numérico antes de formatar)
- [FormatCurrency](../string-functions/formatcurrency.md) — formata valores numéricos como moeda (R$ no nosso caso)