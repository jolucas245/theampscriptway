---
title: LookupOrderedRowsCS
sidebar_label: LookupOrderedRowsCS
description: Retorna linhas de uma Data Extension ordenadas de forma ascendente ou descendente, com busca case-sensitive (diferencia maiúsculas de minúsculas).
---

# LookupOrderedRowsCS

## Descrição

A função `LookupOrderedRowsCS` busca linhas em uma Data Extension e retorna os resultados ordenados por uma ou mais colunas, em ordem ascendente (`ASC`) ou descendente (`DESC`). A diferença crucial dessa função é que ela é **case-sensitive** — ou seja, ela diferencia maiúsculas de minúsculas tanto nos nomes das colunas de busca quanto nos valores procurados. Se o valor na DE for `"Premium"` e você buscar por `"premium"`, a função **não** vai encontrar. Se nenhuma linha corresponder à busca, a função retorna um rowset vazio.

## Sintaxe

```ampscript
LookupOrderedRowsCS(dataExt, numRows, sortColumn, searchColumn1, searchValue1 [, searchColumn2, searchValue2, ...])
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| dataExt | string | Sim | Nome da Data Extension onde os dados serão buscados. |
| numRows | número | Sim | Quantidade de linhas a retornar. Se o valor for menor que 1 (ex: `0`), retorna todas as linhas encontradas, até o máximo de 2.000. |
| sortColumn | string | Sim | Coluna usada para ordenação, seguida de um espaço e `ASC` (ascendente) ou `DESC` (descendente). Esse valor é case-sensitive. Para ordenar por múltiplas colunas, separe-as com vírgula. Ex: `"Nome ASC, DataCompra DESC"`. |
| searchColumn1 | string | Sim | Nome da coluna onde a busca será feita. Esse valor é case-sensitive. |
| searchValue1 | string | Sim | Valor a ser procurado na coluna especificada. Esse valor é case-sensitive. |
| searchColumnN | string | Não | Colunas adicionais de busca (sempre em pares coluna/valor). |
| searchValueN | string | Não | Valores adicionais de busca correspondentes às colunas extras. |

## Exemplo básico

Imagine que você tem uma Data Extension chamada **"Pedidos_Clientes"** com os seguintes dados:

| PedidoID | NomeCliente | Email | Valor | Status | DataPedido |
|---|---|---|---|---|---|
| 1001 | João Silva | joao@email.com | 459.90 | Entregue | 15/03/2024 |
| 1002 | João Silva | joao@email.com | 129.90 | Entregue | 22/04/2024 |
| 1003 | Maria Santos | maria@email.com | 899.00 | Entregue | 10/05/2024 |
| 1004 | João Silva | joao@email.com | 1299.00 | Entregue | 01/06/2024 |
| 1005 | João silva | joaosilva2@email.com | 75.00 | Entregue | 05/06/2024 |

Queremos listar os pedidos do cliente **"João Silva"** (com S maiúsculo) ordenados pelo valor do pedido do maior para o menor:

```ampscript
%%[

VAR @pedidos, @totalLinhas
SET @pedidos = LookupOrderedRowsCS(
  "Pedidos_Clientes",
  0,
  "Valor DESC",
  "NomeCliente", "João Silva"
)

SET @totalLinhas = RowCount(@pedidos)

IF @totalLinhas > 0 THEN
  FOR @i = 1 TO @totalLinhas DO
    VAR @linha, @pedidoId, @valor, @dataPedido
    SET @linha = Row(@pedidos, @i)
    SET @pedidoId = Field(@linha, "PedidoID")
    SET @valor = Field(@linha, "Valor")
    SET @dataPedido = Field(@linha, "DataPedido")
]%%

Pedido #%%=v(@pedidoId)=%% — R$ %%=v(@valor)=%% — %%=v(@dataPedido)=%%

%%[
  NEXT @i
ENDIF

]%%
```

**Saída:**
```
Pedido #1004 — R$ 1299.00 — 01/06/2024
Pedido #1001 — R$ 459.90 — 15/03/2024
Pedido #1002 — R$ 129.90 — 22/04/2024
```

Repare que o pedido **#1005** de "João **s**ilva" (com "s" minúsculo) **não** aparece no resultado. Isso é o comportamento case-sensitive em ação.

## Exemplo avançado

Cenário real: a **MegaStore** quer enviar um e-mail de resumo para clientes do programa de fidelidade, mostrando os **3 últimos resgates de pontos** do nível **"Gold"** (exatamente com essa capitalização). A Data Extension **"Resgates_Pontos"** tem a seguinte estrutura:

| ResgateID | EmailCliente | NomeCliente | Nivel | PontosResgatados | Descricao | DataResgate |
|---|---|---|---|---|---|---|
| R001 | carlos@email.com | Carlos Oliveira | Gold | 5000 | Vale R$ 50 em compras | 2024-06-01 |
| R002 | carlos@email.com | Carlos Oliveira | Gold | 12000 | Frete grátis por 3 meses | 2024-05-15 |
| R003 | carlos@email.com | Carlos Oliveira | Gold | 3000 | Cupom R$ 30 FarmaRede | 2024-04-20 |
| R004 | carlos@email.com | Carlos Oliveira | Gold | 8000 | Ingresso cinema duplo | 2024-03-10 |
| R005 | ana@email.com | Ana Pereira | gold | 2000 | Vale R$ 20 | 2024-06-02 |

```ampscript
%%[

VAR @emailAssinante, @resgates, @totalResgates
SET @emailAssinante = AttributeValue("emailaddr")

/* Busca os 3 últimos resgates do nível "Gold" (case-sensitive) para o assinante */
SET @resgates = LookupOrderedRowsCS(
  "Resgates_Pontos",
  3,
  "DataResgate DESC",
  "EmailCliente", @emailAssinante,
  "Nivel", "Gold"
)

SET @totalResgates = RowCount(@resgates)

IF @totalResgates > 0 THEN
]%%

<h2>Olá, seus últimos resgates no programa MegaStore Fidelidade:</h2>
<table border="1" cellpadding="8" cellspacing="0">
  <tr>
    <th>#</th>
    <th>Descrição</th>
    <th>Pontos</th>
    <th>Data</th>
  </tr>

%%[
  FOR @i = 1 TO @totalResgates DO
    VAR @linha, @descricao, @pontos, @data
    SET @linha = Row(@resgates, @i)
    SET @descricao = Field(@linha, "Descricao")
    SET @pontos = Field(@linha, "PontosResgatados")
    SET @data = Field(@linha, "DataResgate")
    SET @dataFormatada = FormatDate(@data, "dd/MM/yyyy")
]%%

  <tr>
    <td>%%=v(@i)=%%</td>
    <td>%%=v(@descricao)=%%</td>
    <td>%%=FormatNumber(@pontos, "N0")=%%</td>
    <td>%%=v(@dataFormatada)=%%</td>
  </tr>

%%[
  NEXT @i
]%%

</table>

<p>Acesse <a href="https://www.megastore.com.br/fidelidade">www.megastore.com.br/fidelidade</a> para ver todos os seus resgates.</p>

%%[
ELSE
]%%

<p>Você ainda não tem resgates no programa MegaStore Fidelidade. Acumule pontos e aproveite!</p>

%%[
ENDIF
]%%
```

**Saída (para carlos@email.com):**

```
Olá, seus últimos resgates no programa MegaStore Fidelidade:

#  | Descrição                  | Pontos | Data
1  | Vale R$ 50 em compras      | 5.000  | 01/06/2024
2  | Frete grátis por 3 meses   | 12.000 | 15/05/2024
3  | Cupom R$ 30 FarmaRede      | 3.000  | 20/04/2024
```

Repare que a Ana Pereira (com nível `"gold"` minúsculo) **nunca** seria retornada por essa busca, pois a função diferencia `"Gold"` de `"gold"`.

## Observações

- **Case-sensitive em tudo**: tanto o nome da coluna de busca (`searchColumn`) quanto o valor buscado (`searchValue`) diferenciam maiúsculas de minúsculas. Se a coluna na DE se chama `"Status"` e você passar `"status"`, o comportamento pode ser inesperado. Preste muita atenção na capitalização.
- **O parâmetro `sortColumn` também é case-sensitive**: certifique-se de que o nome da coluna de ordenação está escrito exatamente como na Data Extension.
- **Limite de 2.000 linhas**: mesmo passando `0` para retornar tudo, o máximo absoluto é 2.000 linhas. Se precisar de mais, considere usar filtros mais específicos ou outra abordagem.
- **Rowset vazio**: se nenhuma linha for encontrada, a função retorna um rowset vazio. Sempre use [RowCount](../data-extension-functions/rowcount.md) para verificar antes de iterar, evitando erros no render do e-mail.
- **Múltiplas colunas de ordenação**: você pode ordenar por mais de uma coluna separando-as com vírgula, por exemplo: `"DataResgate DESC, PontosResgatados ASC"`.
- **Múltiplos critérios de busca**: você pode adicionar quantos pares de coluna/valor precisar ao final dos parâmetros. Todos os critérios funcionam com lógica AND (todas as condições precisam ser verdadeiras).
- **Quando usar a versão case-sensitive?** Use `LookupOrderedRowsCS` quando os dados na sua DE tiverem variações de capitalização significativas e você precisar buscar com exatidão. Exemplos comuns: códigos de produto, SKUs, identificadores que misturam maiúsculas e minúsculas. Se a diferenciação de caixa não importar, prefira a versão [LookupOrderedRows](../data-extension-functions/lookuporderedrows.md), que é mais permissiva.

## Funções relacionadas

- [LookupOrderedRows](../data-extension-functions/lookuporderedrows.md) — Mesma funcionalidade, mas **case-insensitive** (não diferencia maiúsculas/minúsculas). Use quando a capitalização não importar.
- [LookupRows](../data-extension-functions/lookuprows.md) — Retorna linhas sem ordenação e de forma case-insensitive.
- [LookupRowsCS](../data-extension-functions/lookuprowscs.md) — Retorna linhas sem ordenação, mas com busca case-sensitive.
- [Lookup](../data-extension-functions/lookup.md) — Retorna o valor de uma única coluna da primeira linha encontrada.
- [Row](../data-extension-functions/row.md) — Extrai uma linha específica de um rowset pelo índice.
- [RowCount](../data-extension-functions/rowcount.md) — Retorna a quantidade de linhas em um rowset.
- [Field](../data-extension-functions/field.md) — Extrai o valor de uma coluna específica de uma linha.
- [FormatDate](../date-functions/formatdate.md) — Formata datas para exibição (útil para mostrar datas no padrão DD/MM/AAAA).
- [FormatNumber](../string-functions/formatnumber.md) — Formata números com separadores de milhar e casas decimais.