---
title: Row
sidebar_label: Row
description: Retorna uma linha específica de um rowset ou array a partir da posição informada.
---

# Row

## Descrição

A função `Row` extrai uma linha específica de um rowset ou array, com base na posição numérica que você indicar. É uma função essencial no dia a dia de SFMC porque quase sempre que você consulta dados com [LookupRows](../data-extension-functions/lookuprows.md) ou monta um rowset com [BuildRowsetFromString](../content-functions/buildrowsetfromstring.md), precisa acessar as linhas individualmente para trabalhar com os valores. Ela retorna um objeto de linha (row), que você depois combina com [Field](../data-extension-functions/field.md) para extrair campos específicos.

## Sintaxe

```ampscript
Row(@rowset, rowPosition)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| @rowset | String | Sim | O rowset ou array de onde a linha será extraída. |
| rowPosition | String | Sim | O número da linha que você quer retornar. A primeira linha é 1. |

## Exemplo básico

Buscando a primeira linha de um rowset com pedidos de um cliente da MegaStore:

```ampscript
%%[
SET @rowset = LookupRows("Pedidos", "EmailCliente", "joao.silva@gmail.com")
SET @row = Row(@rowset, 1)
SET @nomeProduto = Field(@row, "NomeProduto")
]%%

Seu último pedido: %%=v(@nomeProduto)=%%
```

**Saída:**
```
Seu último pedido: Smartphone Galaxy Ultra
```

## Exemplo avançado

Listando os três últimos pedidos de um cliente em um e-mail de régua de relacionamento da Lojas Vitória, combinando `Row` com [RowCount](../data-extension-functions/rowcount.md), [Field](../data-extension-functions/field.md) e [FormatCurrency](../string-functions/formatcurrency.md):

```ampscript
%%[
SET @pedidos = LookupOrderedRows("Pedidos", 3, "DataPedido DESC", "CPF", "123.456.789-00")
SET @totalPedidos = RowCount(@pedidos)

IF @totalPedidos > 0 THEN
]%%

<h2>Seus últimos pedidos, João!</h2>
<table>
  <tr>
    <th>Produto</th>
    <th>Valor</th>
    <th>Data</th>
  </tr>

%%[
  FOR @i = 1 TO @totalPedidos DO
    SET @row = Row(@pedidos, @i)
    SET @produto = Field(@row, "NomeProduto")
    SET @valor = FormatCurrency(Field(@row, "Valor"), "R$", 2)
    SET @data = FormatDate(Field(@row, "DataPedido"), "dd/MM/yyyy")
]%%

  <tr>
    <td>%%=v(@produto)=%%</td>
    <td>%%=v(@valor)=%%</td>
    <td>%%=v(@data)=%%</td>
  </tr>

%%[
  NEXT @i
]%%

</table>

%%[ ENDIF ]%%
```

**Saída:**
```
Seus últimos pedidos, João!

Produto                  | Valor        | Data
Notebook Pro 15          | R$ 4.299,90  | 15/06/2025
Fone Bluetooth ANC       | R$ 349,90    | 02/06/2025
Capa Protetora Premium   | R$ 89,90     | 28/05/2025
```

## Observações

> **⚠️ Atenção:** A primeira linha de um rowset é a posição **1**, não 0. Se você passar uma posição que não existe no rowset (por exemplo, pedir a linha 5 de um rowset com 3 registros), vai gerar erro. Sempre valide o número de linhas com [RowCount](../data-extension-functions/rowcount.md) antes de chamar `Row`.

> **💡 Dica:** `Row` sozinha não retorna um valor exibível - ela retorna um objeto de linha. Para acessar o dado de uma coluna específica, você sempre vai precisar combinar com [Field](../data-extension-functions/field.md). Pense nelas como uma dupla inseparável: `Row` seleciona a linha, `Field` seleciona a coluna.

> **💡 Dica:** Você pode usar `Row` com rowsets vindos de diversas origens: [LookupRows](../data-extension-functions/lookuprows.md), [LookupOrderedRows](../data-extension-functions/lookuporderedrows.md), [BuildRowsetFromString](../content-functions/buildrowsetfromstring.md), [BuildRowsetFromJson](../content-functions/buildrowsetfromjson.md) e [BuildRowsetFromXml](../content-functions/buildrowsetfromxml.md). O comportamento é o mesmo independentemente da origem.

## Funções relacionadas

- [Field](../data-extension-functions/field.md) - extrai o valor de um campo específico da linha retornada por `Row`
- [RowCount](../data-extension-functions/rowcount.md) - conta o número de linhas em um rowset (use antes de `Row` para evitar erros)
- [LookupRows](../data-extension-functions/lookuprows.md) - retorna um rowset a partir de uma Data Extension
- [LookupOrderedRows](../data-extension-functions/lookuporderedrows.md) - retorna um rowset ordenado a partir de uma Data Extension
- [BuildRowsetFromString](../content-functions/buildrowsetfromstring.md) - cria um rowset a partir de uma string delimitada
- [BuildRowsetFromJson](../content-functions/buildrowsetfromjson.md) - cria um rowset a partir de dados JSON