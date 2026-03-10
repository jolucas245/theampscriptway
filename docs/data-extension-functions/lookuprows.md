---
title: LookupRows
sidebar_label: LookupRows
description: Retorna um conjunto de linhas (rowset) de uma Data Extension com base em critérios de busca.
---

# LookupRows

## Descrição

A função `LookupRows` busca e retorna um conjunto de linhas (rowset) não ordenado de uma Data Extension, filtrando pelos critérios que você definir. É uma das funções mais usadas no dia a dia de SFMC - ideal para trazer múltiplos registros de um cliente, como histórico de pedidos, produtos comprados ou cupons disponíveis. A função retorna um rowset com até 2.000 linhas e a busca é **case-insensitive** (não diferencia maiúsculas de minúsculas).

## Sintaxe

```ampscript
LookupRows("dataExt", "searchColumn1", "searchValue1" [, "searchColumn2", "searchValue2" ...])
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| dataExt | string | Sim | Nome da Data Extension que contém os dados que você quer consultar. |
| searchColumn1 | string | Sim | Nome da coluna usada como filtro de busca. O valor é case-insensitive. |
| searchValue1 | string | Sim | Valor a ser buscado na coluna especificada para identificar as linhas. O valor é case-insensitive. |

> **💡 Dica:** Você pode adicionar pares extras de coluna e valor de busca ao final da chamada para refinar o filtro (searchColumn2/searchValue2, searchColumn3/searchValue3 etc.).

## Exemplo básico

Buscando todos os pedidos de um cliente na Data Extension "Pedidos" para exibir no e-mail de resumo mensal.

```ampscript
%%[
VAR @pedidos, @totalPedidos, @i, @pedido, @produto, @valor

SET @pedidos = LookupRows("Pedidos", "CPF", "123.456.789-00")
SET @totalPedidos = RowCount(@pedidos)

IF @totalPedidos > 0 THEN
  FOR @i = 1 TO @totalPedidos DO
    SET @pedido = Row(@pedidos, @i)
    SET @produto = Field(@pedido, "Produto")
    SET @valor = Field(@pedido, "Valor")
]%%

Produto: %%=v(@produto)=%% - R$ %%=v(@valor)=%%

%%[
  NEXT @i
ENDIF
]%%
```

**Saída:**
```
Produto: Smartphone Galaxy S24 - R$ 3.299,90
Produto: Capa Protetora - R$ 79,90
Produto: Carregador Turbo - R$ 149,90
```

## Exemplo avançado

Montando uma tabela HTML de cupons disponíveis para o cliente em um e-mail de régua de relacionamento da MegaStore, filtrando por cidade e status ativo.

```ampscript
%%[
VAR @cupons, @totalCupons, @i, @cupom, @codigo, @desconto, @validade

SET @cupons = LookupRows("Cupons_Ativos", "Cidade", "São Paulo", "Status", "Ativo")
SET @totalCupons = RowCount(@cupons)
]%%

%%[ IF @totalCupons > 0 THEN ]%%
<table style="width:100%; border-collapse:collapse;">
  <tr style="background-color:#2c3e50; color:#ffffff;">
    <th style="padding:10px;">Código</th>
    <th style="padding:10px;">Desconto</th>
    <th style="padding:10px;">Validade</th>
  </tr>
  %%[ FOR @i = 1 TO @totalCupons DO
    SET @cupom = Row(@cupons, @i)
    SET @codigo = Field(@cupom, "Codigo")
    SET @desconto = Field(@cupom, "Desconto")
    SET @validade = FormatDate(Field(@cupom, "DataValidade"), "dd/MM/yyyy")
  ]%%
  <tr>
    <td style="padding:10px; text-align:center;">%%=v(@codigo)=%%</td>
    <td style="padding:10px; text-align:center;">%%=v(@desconto)=%%</td>
    <td style="padding:10px; text-align:center;">%%=v(@validade)=%%</td>
  </tr>
  %%[ NEXT @i ]%%
</table>
%%[ ELSE ]%%
<p>Nenhum cupom disponível no momento para sua região.</p>
%%[ ENDIF ]%%
```

**Saída:**
```
Código         Desconto    Validade
MEGA20SP       20%         31/07/2025
FRETEGRATIS    Frete Free  15/08/2025
MEGAVIP10      R$ 10,00    30/09/2025
```

## Observações

> **⚠️ Atenção:** A função retorna no máximo **2.000 linhas**. Se a sua Data Extension pode ter mais registros que isso para um mesmo filtro, considere usar filtros mais específicos (adicionando mais pares coluna/valor) ou avalie o uso de [LookupOrderedRows](../data-extension-functions/lookuporderedrows.md) para controlar quais registros são retornados.

> **⚠️ Atenção:** O rowset retornado **não possui ordenação garantida**. Se a ordem dos registros importa (por data, valor etc.), use [LookupOrderedRows](../data-extension-functions/lookuporderedrows.md) em vez de `LookupRows`.

- A busca é **case-insensitive** - tanto os nomes das colunas quanto os valores buscados não diferenciam maiúsculas de minúsculas. Se você precisa de busca case-sensitive, use [LookupRowsCS](../data-extension-functions/lookuprowscs.md).

- Sempre valide o resultado com [RowCount](../data-extension-functions/rowcount.md) antes de iterar. Se nenhuma linha for encontrada, tentar acessar com [Row](../data-extension-functions/row.md) vai gerar erro.

- Para acessar os dados de cada linha retornada, use [Row](../data-extension-functions/row.md) para selecionar a linha e [Field](../data-extension-functions/field.md) para extrair o valor de uma coluna específica.

## Funções relacionadas

- [Lookup](../data-extension-functions/lookup.md) - retorna o valor de **uma única coluna** da primeira linha encontrada (quando você só precisa de um dado).
- [LookupRowsCS](../data-extension-functions/lookuprowscs.md) - versão **case-sensitive** do `LookupRows`.
- [LookupOrderedRows](../data-extension-functions/lookuporderedrows.md) - permite ordenar o rowset retornado por uma coluna e direção.
- [LookupOrderedRowsCS](../data-extension-functions/lookuporderedrowscs.md) - versão **case-sensitive** do `LookupOrderedRows`.
- [Row](../data-extension-functions/row.md) - acessa uma linha específica do rowset por índice.
- [RowCount](../data-extension-functions/rowcount.md) - retorna o número de linhas no rowset.
- [Field](../data-extension-functions/field.md) - extrai o valor de uma coluna de uma linha do rowset.