---
title: LookupOrderedRowsCS
sidebar_label: LookupOrderedRowsCS
description: Busca linhas de uma Data Extension com ordenação e comparação case-sensitive nos valores de busca.
---

# LookupOrderedRowsCS

## Descrição

Retorna linhas de uma Data Extension ordenadas de forma ascendente ou descendente com base em uma ou mais colunas que você especificar, fazendo a busca com **diferenciação entre maiúsculas e minúsculas** (case-sensitive). Se os valores de busca não forem encontrados, retorna um rowset vazio. É a versão case-sensitive da função [LookupOrderedRows](../data-extension-functions/lookuporderedrows.md) - use quando a distinção exata entre "Premium", "premium" e "PREMIUM" fizer diferença na sua lógica.

## Sintaxe

```ampscript
LookupOrderedRowsCS(dataExt, numRows, sortColumn, searchColumn1, searchValue1, ...)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `dataExt` | string | Sim | Nome da Data Extension que contém os dados que você quer consultar. |
| `numRows` | number | Sim | Número de linhas a retornar. Se o valor for menor que 1, retorna todas as linhas até o máximo de 2.000. |
| `sortColumn` | string | Sim | Coluna usada para ordenação, seguida de um espaço e `ASC` (ascendente) ou `DESC` (descendente). O valor é case-sensitive. Para múltiplas colunas, separe com vírgula (ex: `"Nome ASC, Data DESC"`). |
| `searchColumn1` | string | Sim | Nome da coluna onde a busca será feita. O valor é case-sensitive. |
| `searchValue1` | string | Sim | Valor a ser procurado na coluna especificada. O valor é case-sensitive. Você pode adicionar pares extras de coluna/valor ao final. |

## Exemplo básico

Buscando os 5 pedidos mais recentes de um cliente na categoria "Eletrônicos" (com case exato) em uma Data Extension de pedidos da MegaStore:

```ampscript
%%[

SET @rows = LookupOrderedRowsCS(
  "Pedidos_MegaStore",
  5,
  "DataPedido DESC",
  "Categoria", "Eletrônicos"
)

IF RowCount(@rows) > 0 THEN
  FOR @i = 1 TO RowCount(@rows) DO
    SET @row = Row(@rows, @i)
    SET @numeroPedido = Field(@row, "NumeroPedido")
    SET @produto = Field(@row, "Produto")
    SET @valor = Field(@row, "Valor")
    SET @data = Field(@row, "DataPedido")
]%%

Pedido #%%=V(@numeroPedido)=%% - %%=V(@produto)=%% - R$ %%=V(@valor)=%% (%%=FormatDate(@data, "dd/MM/yyyy")=%%)

%%[
  NEXT @i
ELSE
]%%

Nenhum pedido encontrado nesta categoria.

%%[
ENDIF
]%%
```

**Saída:**
```
Pedido #90210 - Smart TV 55" - R$ 3.299,90 (15/06/2025)
Pedido #90185 - Notebook Ultra - R$ 5.499,00 (10/06/2025)
Pedido #90102 - Fone Bluetooth Pro - R$ 449,90 (02/06/2025)
```

## Exemplo avançado

Montando uma tabela HTML dos últimos programas de fidelidade ativos de um cliente no Banco Brasilão, filtrando pelo status exato "Ativo" (case-sensitive) e ordenando por saldo de pontos e nome do programa:

```ampscript
%%[

SET @cpf = AttributeValue("CPF")
SET @programas = LookupOrderedRowsCS(
  "Programas_Fidelidade",
  0,
  "SaldoPontos DESC, NomePrograma ASC",
  "Status", "Ativo",
  "CPF", @cpf
)

SET @totalProgramas = RowCount(@programas)

IF @totalProgramas > 0 THEN
]%%

<table style="width:100%; border-collapse:collapse;">
  <tr style="background-color:#003366; color:#ffffff;">
    <th style="padding:8px; text-align:left;">#</th>
    <th style="padding:8px; text-align:left;">Programa</th>
    <th style="padding:8px; text-align:left;">Categoria</th>
    <th style="padding:8px; text-align:right;">Pontos</th>
    <th style="padding:8px; text-align:left;">Validade</th>
  </tr>

%%[
  FOR @i = 1 TO @totalProgramas DO
    SET @row = Row(@programas, @i)
    SET @nome = Field(@row, "NomePrograma")
    SET @categoria = Field(@row, "Categoria")
    SET @pontos = Field(@row, "SaldoPontos")
    SET @validade = FormatDate(Field(@row, "DataValidade"), "dd/MM/yyyy")

    IF Mod(@i, 2) == 0 THEN
      SET @bgColor = "#f2f2f2"
    ELSE
      SET @bgColor = "#ffffff"
    ENDIF
]%%

  <tr style="background-color:%%=V(@bgColor)=%%;">
    <td style="padding:8px;">%%=V(@i)=%%</td>
    <td style="padding:8px;">%%=V(@nome)=%%</td>
    <td style="padding:8px;">%%=V(@categoria)=%%</td>
    <td style="padding:8px; text-align:right;">%%=FormatNumber(@pontos, "N0")=%%</td>
    <td style="padding:8px;">%%=V(@validade)=%%</td>
  </tr>

%%[
  NEXT @i
]%%

</table>

<p style="font-size:12px; color:#666;">
  Você participa de %%=V(@totalProgramas)=%% programa%%=IIF(@totalProgramas > 1, "s", "")=%% ativo%%=IIF(@totalProgramas > 1, "s", "")=%%.
</p>

%%[
ELSE
]%%

<p>Você ainda não possui programas de fidelidade ativos. Fale com seu gerente!</p>

%%[
ENDIF
]%%
```

**Saída:**
```
#   Programa              Categoria    Pontos    Validade
1   Brasilão Platinum    Cartão       45.280    31/12/2025
2   Brasilão Viagens     Viagens      12.750    30/06/2026
3   Cashback Brasilão    Compras       3.410    31/03/2026

Você participa de 3 programas ativos.
```

## Observações

> **⚠️ Atenção:** Esta função é **case-sensitive em todos os aspectos**: tanto os nomes das colunas de busca (`searchColumn`) quanto os valores buscados (`searchValue`) e a coluna de ordenação (`sortColumn`) diferenciam maiúsculas de minúsculas. Se na sua Data Extension o status está gravado como "ativo" e você busca por "Ativo", a função **não vai retornar** esses registros.

> **⚠️ Atenção:** O limite máximo de retorno é de **2.000 linhas**, mesmo que você passe um valor menor que 1 para `numRows`. Se a sua DE tem mais registros que isso, considere refinar os filtros adicionando mais pares de coluna/valor.

> **💡 Dica:** No mercado brasileiro é comum ter dados com inconsistência de capitalização (ex: "PREMIUM", "Premium", "premium") vindos de integrações diversas. Se você **não precisa** dessa distinção, prefira a versão [LookupOrderedRows](../data-extension-functions/lookuporderedrows.md) que é case-insensitive e mais tolerante. Use `LookupOrderedRowsCS` apenas quando a diferença de caixa for semanticamente relevante - por exemplo, códigos de SKU, siglas ou identificadores técnicos.

> **💡 Dica:** Para ordenar por múltiplas colunas, separe com vírgula dentro do mesmo parâmetro: `"SaldoPontos DESC, NomePrograma ASC"`. A ordenação segue a prioridade da esquerda para a direita.

## Funções relacionadas

- [LookupOrderedRows](../data-extension-functions/lookuporderedrows.md) - versão case-insensitive desta função
- [LookupRows](../data-extension-functions/lookuprows.md) - retorna linhas sem ordenação (case-insensitive)
- [LookupRowsCS](../data-extension-functions/lookuprowscs.md) - retorna linhas sem ordenação (case-sensitive)
- [Lookup](../data-extension-functions/lookup.md) - retorna um único valor de uma coluna
- [Row](../data-extension-functions/row.md) - acessa uma linha específica do rowset
- [RowCount](../data-extension-functions/rowcount.md) - conta o número de linhas no rowset
- [Field](../data-extension-functions/field.md) - extrai o valor de uma coluna de uma linha