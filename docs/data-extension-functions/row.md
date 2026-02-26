---
title: Row
sidebar_label: Row
description: Retorna uma linha específica de um rowset ou array com base na posição informada.
---

# Row

## Descrição

A função `Row()` extrai uma linha específica de um rowset (conjunto de linhas) ou array. Você passa o rowset e o número da posição da linha que quer acessar, e ela retorna essa linha como um objeto. É uma função essencial no dia a dia do AMPscript, porque quase sempre que você busca dados com funções como `LookupRows()` ou `BuildRowsetFromJson()`, precisa usar `Row()` para acessar cada linha individualmente — e depois combinar com `Field()` para pegar o valor de um campo específico.

## Sintaxe

```ampscript
Row(rowset, rowPosition)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| rowset | string | Sim | O rowset (conjunto de linhas) ou array de onde você quer extrair uma linha. |
| rowPosition | string | Sim | O número da linha que você quer retornar. A primeira linha é a posição **1** (não zero). |

## Exemplo básico

Imagine que você tem uma Data Extension chamada **Pedidos** com os pedidos de cada cliente. Você quer exibir os dados do primeiro pedido encontrado.

```ampscript
%%[
SET @cpf = "123.456.789-00"
SET @rowset = LookupRows("Pedidos", "CPF", @cpf)
SET @row = Row(@rowset, 1)
SET @numeroPedido = Field(@row, "NumeroPedido")
SET @valorTotal = Field(@row, "ValorTotal")
]%%

Olá! Seu pedido nº %%=v(@numeroPedido)=%% no valor de R$ %%=v(@valorTotal)=%% está sendo preparado.
```

**Saída:**
```
Olá! Seu pedido nº 98754 no valor de R$ 259,90 está sendo preparado.
```

## Exemplo avançado

Vamos a um cenário real: a **MegaStore** quer enviar um e-mail de Dia das Mães mostrando os 3 últimos produtos visualizados pelo cliente. Os dados vêm de uma Data Extension chamada **ProdutosVisualizados**, e queremos listar todos eles dinamicamente.

```ampscript
%%[
SET @email = AttributeValue("EmailAddress")
SET @rowset = LookupOrderedRows("ProdutosVisualizados", 3, "DataVisualizacao DESC", "Email", @email)
SET @totalLinhas = RowCount(@rowset)

IF @totalLinhas > 0 THEN
]%%

<h2>Que tal presentear sua mãe com algo que você já estava de olho? 💐</h2>
<table>
  <tr>
    <th>Produto</th>
    <th>Preço</th>
  </tr>

%%[
  FOR @i = 1 TO @totalLinhas DO
    SET @row = Row(@rowset, @i)
    SET @nomeProduto = Field(@row, "NomeProduto")
    SET @preco = Field(@row, "Preco")
    SET @urlProduto = Field(@row, "URL")
]%%

  <tr>
    <td><a href="%%=RedirectTo(@urlProduto)=%%">%%=v(@nomeProduto)=%%</a></td>
    <td>R$ %%=FormatNumber(@preco, "N2")=%%</td>
  </tr>

%%[
  NEXT @i
]%%

</table>
<p>Frete grátis acima de R$ 299,00! Aproveite 🎁</p>

%%[ ELSE ]%%

<p>Confira nossas ofertas especiais de Dia das Mães em <a href="https://www.megastore.com.br/diadasmaes">www.megastore.com.br</a>!</p>

%%[ ENDIF ]%%
```

**Saída (exemplo com 3 produtos):**
```
Que tal presentear sua mãe com algo que você já estava de olho? 💐

Produto                     | Preço
Bolsa Couro Milano          | R$ 389,90
Kit Perfume Floral          | R$ 179,50
Relógio Classic Rose        | R$ 459,00

Frete grátis acima de R$ 299,00! Aproveite 🎁
```

### Exemplo com JSON

A função `Row()` também funciona perfeitamente com rowsets criados a partir de JSON, usando `BuildRowsetFromJson()`. Aqui um exemplo de cashback da **Conecta Telecom**:

```ampscript
%%[
SET @json = '[{"Mes":"Janeiro","Cashback":25.50},{"Mes":"Fevereiro","Cashback":18.90},{"Mes":"Março","Cashback":32.00}]'
SET @rowset = BuildRowsetFromJson(@json, "$.*")
SET @primeiraLinha = Row(@rowset, 1)
SET @mesCashback = Field(@primeiraLinha, "Mes")
SET @valorCashback = Field(@primeiraLinha, "Cashback")
]%%

No mês de %%=v(@mesCashback)=%% você ganhou R$ %%=v(@valorCashback)=%% de cashback!
```

**Saída:**
```
No mês de Janeiro você ganhou R$ 25.50 de cashback!
```

## Observações

- **A contagem começa em 1**, não em 0. A primeira linha do rowset é `Row(@rowset, 1)`.
- `Row()` retorna um objeto de linha. Para acessar o valor de um campo específico dessa linha, você precisa usar a função [Field](../data-extension-functions/field.md) em seguida.
- Se você tentar acessar uma posição que não existe no rowset (por exemplo, `Row(@rowset, 5)` quando só existem 3 linhas), vai ocorrer um erro. Sempre use [RowCount](../data-extension-functions/rowcount.md) para verificar quantas linhas existem antes de iterar.
- A função funciona com rowsets retornados por diversas funções, como [LookupRows](../data-extension-functions/lookuprows.md), [LookupOrderedRows](../data-extension-functions/lookuporderedrows.md), [BuildRowsetFromJson](../content-functions/buildrowsetfromjson.md), [BuildRowsetFromXml](../content-functions/buildrowsetfromxml.md) e [BuildRowsetFromString](../content-functions/buildrowsetfromstring.md).
- Funciona em todos os contextos do SFMC: e-mails, CloudPages, SMS, etc.
- Quando usar dentro de um loop `FOR`, combine com [RowCount](../data-extension-functions/rowcount.md) para definir o limite do loop e `Row(@rowset, @i)` para percorrer cada linha.

## Funções relacionadas

- [Field](../data-extension-functions/field.md) — Extrai o valor de um campo específico a partir de uma linha retornada por `Row()`.
- [RowCount](../data-extension-functions/rowcount.md) — Retorna o número total de linhas em um rowset.
- [LookupRows](../data-extension-functions/lookuprows.md) — Busca múltiplas linhas de uma Data Extension, retornando um rowset para usar com `Row()`.
- [LookupOrderedRows](../data-extension-functions/lookuporderedrows.md) — Busca múltiplas linhas com ordenação, retornando um rowset.
- [LookupRowsCS](../data-extension-functions/lookuprowscs.md) — Versão case-sensitive do `LookupRows()`.
- [LookupOrderedRowsCS](../data-extension-functions/lookuporderedrowscs.md) — Versão case-sensitive do `LookupOrderedRows()`.
- [BuildRowsetFromString](../content-functions/buildrowsetfromstring.md) — Cria um rowset a partir de uma string delimitada.
- [BuildRowsetFromJson](../content-functions/buildrowsetfromjson.md) — Cria um rowset a partir de dados JSON.
- [BuildRowsetFromXml](../content-functions/buildrowsetfromxml.md) — Cria um rowset a partir de dados XML.
- [Lookup](../data-extension-functions/lookup.md) — Busca um único valor de uma Data Extension (quando você não precisa de um rowset completo).