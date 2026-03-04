---
title: LookupOrderedRows
sidebar_label: LookupOrderedRows
description: Busca linhas de uma Data Extension com ordenação por uma ou mais colunas, em ordem ascendente ou descendente.
---

# LookupOrderedRows

## Descrição

A função `LookupOrderedRows` busca registros em uma Data Extension e retorna os resultados **ordenados** pela coluna (ou colunas) que você especificar, em ordem ascendente (`ASC`) ou descendente (`DESC`). Se os valores de busca não forem encontrados, ela retorna um rowset vazio. A busca é **case-insensitive** — ou seja, não diferencia maiúsculas de minúsculas.

Essa é uma das funções mais úteis no dia a dia de SFMC quando você precisa, por exemplo, mostrar os últimos pedidos de um cliente, os produtos mais caros de uma categoria ou o histórico de transações mais recente — tudo já ordenado, sem depender de SQL.

## Sintaxe

```ampscript
LookupOrderedRows(dataExt, numRows, sortColumn, searchColumn1, searchValue1, ...)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `dataExt` | string | Sim | Nome da Data Extension onde os dados serão buscados. |
| `numRows` | número | Sim | Quantidade de linhas a retornar. Se o valor for menor que 1, retorna todas as linhas, até o máximo de 2.000. |
| `sortColumn` | string | Sim | Coluna de ordenação, seguida de um espaço e `ASC` (crescente) ou `DESC` (decrescente). O valor é case-insensitive. Para ordenar por múltiplas colunas, separe-as com vírgula. Exemplo: `"Nome ASC, DataCompra DESC"`. |
| `searchColumn1` | string | Sim | Nome da coluna usada como filtro de busca. Case-insensitive. |
| `searchValue1` | string | Sim | Valor a procurar na coluna de filtro. Case-insensitive. Você pode adicionar pares extras de coluna/valor de busca ao final. |

## Exemplo básico

Buscando os 3 pedidos mais recentes de um cliente na Data Extension "Pedidos", ordenados por data decrescente — cenário clássico de e-mail transacional com histórico de compras.

```ampscript
%%[

SET @emailCliente = "joao.silva@email.com.br"
SET @pedidos = LookupOrderedRows(
  "Pedidos",
  3,
  "DataPedido DESC",
  "Email", @emailCliente
)

IF RowCount(@pedidos) > 0 THEN
  FOR @i = 1 TO RowCount(@pedidos) DO
    SET @linha = Row(@pedidos, @i)
    SET @numeroPedido = Field(@linha, "NumeroPedido")
    SET @data = FormatDate(Field(@linha, "DataPedido"), "dd/MM/yyyy")
    SET @valor = Field(@linha, "ValorTotal")
]%%

Pedido: %%=v(@numeroPedido)=%% | Data: %%=v(@data)=%% | Valor: R$ %%=v(@valor)=%%

%%[
  NEXT @i
ELSE
]%%

Nenhum pedido encontrado.

%%[
ENDIF
]%%
```

**Saída:**
```
Pedido: 98432 | Data: 15/06/2025 | Valor: R$ 1.299,90
Pedido: 97210 | Data: 02/06/2025 | Valor: R$ 349,50
Pedido: 96801 | Data: 28/05/2025 | Valor: R$ 89,90
```

## Exemplo avançado

Montando uma tabela HTML com os 5 produtos mais caros de uma categoria para um e-mail promocional da MegaStore, ordenados por preço decrescente e nome ascendente em caso de empate.

```ampscript
%%[

SET @categoria = "Eletrônicos"
SET @produtos = LookupOrderedRows(
  "Catalogo_Produtos",
  5,
  "Preco DESC, NomeProduto ASC",
  "Categoria", @categoria,
  "Disponivel", "Sim"
)

IF RowCount(@produtos) > 0 THEN
]%%

<table style="width:100%; border-collapse:collapse;">
  <tr style="background-color:#003366; color:#ffffff;">
    <th style="padding:8px; text-align:left;">#</th>
    <th style="padding:8px; text-align:left;">Produto</th>
    <th style="padding:8px; text-align:right;">Preço</th>
  </tr>

%%[
  FOR @i = 1 TO RowCount(@produtos) DO
    SET @linha = Row(@produtos, @i)
    SET @nome = Field(@linha, "NomeProduto")
    SET @preco = Field(@linha, "Preco")
    SET @sku = Field(@linha, "SKU")

    IF Mod(@i, 2) == 0 THEN
      SET @bgColor = "#f2f2f2"
    ELSE
      SET @bgColor = "#ffffff"
    ENDIF
]%%

  <tr style="background-color:%%=v(@bgColor)=%%;">
    <td style="padding:8px;">%%=v(@i)=%%</td>
    <td style="padding:8px;">%%=v(@nome)=%% (%%=v(@sku)=%%)</td>
    <td style="padding:8px; text-align:right;">R$ %%=v(@preco)=%%</td>
  </tr>

%%[
  NEXT @i
]%%

</table>

%%[
ELSE
]%%

<p>Nenhum produto disponível nesta categoria no momento.</p>

%%[
ENDIF
]%%
```

**Saída:**
```html
#  Produto                              Preço
1  Smart TV 65" 4K (SKU-8821)           R$ 4.599,90
2  Notebook Pro i7 (SKU-7703)           R$ 3.899,00
3  Console GameMax (SKU-6650)           R$ 2.499,90
4  Fone Bluetooth Elite (SKU-5512)      R$ 899,90
5  Smartwatch Pulse (SKU-4401)          R$ 649,00
```

## Observações

> **⚠️ Atenção:** O limite máximo de retorno é **2.000 linhas**. Mesmo que você passe um valor menor que 1 no parâmetro `numRows` (o que faz a função tentar retornar tudo), ela nunca vai ultrapassar esse teto. Se a sua Data Extension tem mais registros que isso, considere filtros mais específicos ou use SQL via Query Activity.

> **💡 Dica:** Diferente da [LookupRows](../data-extension-functions/lookuprows.md), que retorna linhas sem qualquer garantia de ordem, a `LookupOrderedRows` é a escolha certa sempre que a sequência dos dados importa — rankings, históricos, listas de "mais recentes" ou "mais caros".

> **💡 Dica:** Você pode ordenar por **múltiplas colunas** separando-as com vírgula no parâmetro `sortColumn`. Isso é muito útil para desempates — por exemplo, `"Cidade ASC, Nome ASC"` ordena primeiro por cidade e, dentro da mesma cidade, por nome.

- A função é **case-insensitive** tanto nos nomes das colunas de busca quanto nos valores procurados. Se você precisa de busca sensível a maiúsculas/minúsculas, use [LookupOrderedRowsCS](../data-extension-functions/lookuporderedrowscs.md).

- Sempre valide o retorno com [RowCount](../data-extension-functions/rowcount.md) antes de iterar, pois a função retorna um rowset vazio quando não encontra resultados.

## Funções relacionadas

- [Lookup](../data-extension-functions/lookup.md) — retorna o valor de uma única coluna de uma única linha.
- [LookupRows](../data-extension-functions/lookuprows.md) — retorna múltiplas linhas, mas **sem ordenação**.
- [LookupRowsCS](../data-extension-functions/lookuprowscs.md) — versão case-sensitive do `LookupRows`.
- [LookupOrderedRowsCS](../data-extension-functions/lookuporderedrowscs.md) — versão case-sensitive do `LookupOrderedRows`.
- [Row](../data-extension-functions/row.md) — extrai uma linha específica de um rowset.
- [Field](../data-extension-functions/field.md) — extrai o valor de uma coluna de uma linha.
- [RowCount](../data-extension-functions/rowcount.md) — conta quantas linhas existem em um rowset.