---
title: LookupOrderedRows
sidebar_label: LookupOrderedRows
description: Retorna linhas de uma Data Extension ordenadas de forma ascendente ou descendente com base em uma ou mais colunas especificadas.
---

<!-- generated-by-script -->

# LookupOrderedRows

## Descrição

A função `LookupOrderedRows` busca linhas em uma Data Extension e retorna os resultados ordenados (crescente ou decrescente) pela coluna que você definir. É perfeita pra quando você precisa mostrar dados numa ordem específica — como os pedidos mais recentes, os produtos mais caros ou os clientes com mais pontos. Se a busca não encontrar nenhum resultado, a função retorna um rowset vazio. A busca é **case-insensitive**, ou seja, não diferencia maiúsculas de minúsculas nos valores e nomes de colunas.

## Sintaxe

```ampscript
LookupOrderedRows("NomeDaDataExtension", numLinhas, "ColunaOrdenacao DIRECAO", "colunaFiltro1", "valorFiltro1" [, "colunaFiltro2", "valorFiltro2", ...])
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| dataExt | String | Sim | Nome da Data Extension de onde você quer buscar os dados. |
| numRows | Número | Sim | Número de linhas a retornar. Se passar um valor menor que 1 (ex: `0`), retorna todas as linhas, até o máximo de **2.000 linhas**. |
| sortColumn | String | Sim | Coluna usada para ordenação, seguida de um espaço e `ASC` (crescente) ou `DESC` (decrescente). Para ordenar por múltiplas colunas, separe por vírgula. Ex: `"Nome ASC, DataPedido DESC"`. Esse valor é case-insensitive. |
| searchColumn1 | String | Sim | Nome da coluna que será usada como filtro de busca. Case-insensitive. |
| searchValue1 | String | Sim | Valor a ser buscado na coluna de filtro. Case-insensitive. |
| searchColumnN / searchValueN | String | Não | Você pode adicionar quantos pares de coluna/valor quiser para refinar a busca. |

## Exemplo básico

Imagine que você tem uma Data Extension chamada **"Pedidos_Clientes"** com o histórico de compras de um e-commerce fictício chamado **Lojas Vitória**:

| PedidoID | EmailCliente | NomeCliente | ValorTotal | DataPedido | Status |
|---|---|---|---|---|---|
| 1001 | joao@email.com | João Silva | 459.90 | 2024-11-25 | Entregue |
| 1002 | joao@email.com | João Silva | 189.50 | 2024-12-01 | Entregue |
| 1003 | joao@email.com | João Silva | 1249.00 | 2024-12-15 | Enviado |
| 1004 | maria@email.com | Maria Santos | 320.00 | 2024-12-10 | Entregue |

Você quer exibir os **3 pedidos mais recentes** do João, ordenados por data decrescente:

```ampscript
%%[

VAR @pedidos, @totalLinhas

SET @pedidos = LookupOrderedRows(
  "Pedidos_Clientes",
  3,
  "DataPedido DESC",
  "EmailCliente", "joao@email.com"
)

SET @totalLinhas = RowCount(@pedidos)

IF @totalLinhas > 0 THEN

  FOR @i = 1 TO @totalLinhas DO

    VAR @linha, @pedidoId, @valor, @status
    SET @linha = Row(@pedidos, @i)
    SET @pedidoId = Field(@linha, "PedidoID")
    SET @valor = Field(@linha, "ValorTotal")
    SET @status = Field(@linha, "Status")

]%%

Pedido #%%=v(@pedidoId)=%% — R$ %%=v(@valor)=%% — %%=v(@status)=%%

%%[

  NEXT @i

ENDIF

]%%
```

**Saída:**
```
Pedido #1003 — R$ 1249.00 — Enviado
Pedido #1002 — R$ 189.50 — Entregue
Pedido #1001 — R$ 459.90 — Entregue
```

## Exemplo avançado

Agora um cenário mais completo: a **MegaStore** tem um programa de pontos e quer enviar um e-mail para cada cliente mostrando as **5 últimas transações de pontos** do mês, com uma tabela bonitinha em HTML. A Data Extension **"Historico_Pontos"** tem os seguintes dados:

| TransacaoID | EmailCliente | Descricao | Pontos | TipoOperacao | DataTransacao |
|---|---|---|---|---|---|
| 5001 | carlos@email.com | Compra - Fone Bluetooth | 450 | Credito | 2024-12-01 |
| 5002 | carlos@email.com | Resgate - Cupom R$50 | -500 | Debito | 2024-12-05 |
| 5003 | carlos@email.com | Compra - Camiseta | 120 | Credito | 2024-12-08 |
| 5004 | carlos@email.com | Bônus Natal 2x pontos | 120 | Credito | 2024-12-08 |
| 5005 | carlos@email.com | Compra - Mochila | 280 | Credito | 2024-12-12 |
| 5006 | carlos@email.com | Compra - Livro | 90 | Credito | 2024-12-18 |

```ampscript
%%[

VAR @emailAssinante, @transacoes, @totalTransacoes

SET @emailAssinante = AttributeValue("emailaddr")
SET @transacoes = LookupOrderedRows(
  "Historico_Pontos",
  5,
  "DataTransacao DESC, TransacaoID DESC",
  "EmailCliente", @emailAssinante,
  "TipoOperacao", "Credito"
)

SET @totalTransacoes = RowCount(@transacoes)

]%%

<h2>Suas últimas conquistas de pontos, Carlos! 🎉</h2>

%%[ IF @totalTransacoes > 0 THEN ]%%

<table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse; width:100%;">
  <tr style="background-color:#6C3FC5; color:#FFFFFF;">
    <th>Data</th>
    <th>Descrição</th>
    <th>Pontos</th>
  </tr>

%%[

  FOR @i = 1 TO @totalTransacoes DO

    VAR @linha, @descricao, @pontos, @dataTransacao
    SET @linha = Row(@transacoes, @i)
    SET @descricao = Field(@linha, "Descricao")
    SET @pontos = Field(@linha, "Pontos")
    SET @dataTransacao = FormatDate(Field(@linha, "DataTransacao"), "dd/MM/yyyy")

]%%

  <tr>
    <td>%%=v(@dataTransacao)=%%</td>
    <td>%%=v(@descricao)=%%</td>
    <td style="text-align:center; font-weight:bold; color:#2E7D32;">+%%=v(@pontos)=%%</td>
  </tr>

%%[

  NEXT @i

]%%

</table>

<p>Continue acumulando pontos em <a href="https://www.megastore.com.br/pontos">www.megastore.com.br/pontos</a>!</p>

%%[ ELSE ]%%

<p>Você ainda não acumulou pontos de crédito neste período. Que tal aproveitar nossas ofertas e começar a pontuar? Frete grátis acima de R$299!</p>

%%[ ENDIF ]%%
```

**Saída (para carlos@email.com):**
```html
Suas últimas conquistas de pontos, Carlos! 🎉

| Data       | Descrição                | Pontos |
|------------|--------------------------|--------|
| 18/12/2024 | Compra - Livro           | +90    |
| 12/12/2024 | Compra - Mochila         | +280   |
| 08/12/2024 | Bônus Natal 2x pontos    | +120   |
| 08/12/2024 | Compra - Camiseta        | +120   |
| 01/12/2024 | Compra - Fone Bluetooth  | +450   |
```

## Observações

- **Limite máximo de linhas:** Mesmo passando `0` para retornar todas as linhas, o máximo absoluto é **2.000 linhas**. Se a Data Extension tiver mais resultados, só as 2.000 primeiras (já ordenadas) serão retornadas.
- **Case-insensitive:** Tanto os nomes das colunas quanto os valores de busca não diferenciam maiúsculas de minúsculas. Se precisa de busca case-sensitive, use [LookupOrderedRowsCS](../data-extension-functions/lookuporderedrowscs.md).
- **Rowset vazio:** Se nenhuma linha corresponder aos filtros, a função retorna um rowset vazio. Sempre use [RowCount](../data-extension-functions/rowcount.md) para verificar antes de iterar, senão seu código pode gerar erro.
- **Ordenação por múltiplas colunas:** Você pode ordenar por várias colunas separando por vírgula dentro da mesma string, como `"DataPedido DESC, NomeCliente ASC"`.
- **Pares de filtro adicionais:** Você pode passar quantos pares de `searchColumn`/`searchValue` quiser após os parâmetros obrigatórios para refinar a busca. Todos os filtros funcionam como condição **AND** (ou seja, todas as condições precisam ser verdadeiras).
- **Uso com Row e Field:** Para extrair dados do rowset retornado, use [Row](../data-extension-functions/row.md) para acessar uma linha específica e [Field](../data-extension-functions/field.md) para acessar o valor de uma coluna dentro dessa linha.
- **Funciona em qualquer contexto do SFMC:** Pode ser usada em emails, CloudPages, SMS (blocos AMPscript) e Landing Pages sem restrições.
- **Performance:** Se você precisa apenas de um único valor de uma única linha, considere usar [Lookup](../data-extension-functions/lookup.md), que é mais simples e direto.

## Funções relacionadas

- [Lookup](../data-extension-functions/lookup.md) — Retorna o valor de uma única coluna da primeira linha que corresponder ao filtro.
- [LookupRows](../data-extension-functions/lookuprows.md) — Retorna linhas de uma Data Extension **sem ordenação definida**.
- [LookupRowsCS](../data-extension-functions/lookuprowscs.md) — Versão case-sensitive do LookupRows.
- [LookupOrderedRowsCS](../data-extension-functions/lookuporderedrowscs.md) — Versão case-sensitive do LookupOrderedRows, diferencia maiúsculas/minúsculas nos valores de busca.
- [Row](../data-extension-functions/row.md) — Acessa uma linha específica dentro de um rowset pelo índice.
- [RowCount](../data-extension-functions/rowcount.md) — Retorna a quantidade de linhas em um rowset.
- [Field](../data-extension-functions/field.md) — Extrai o valor de uma coluna específica de uma linha do rowset.
- [FormatDate](../date-functions/formatdate.md) — Formata datas para exibição (útil para mostrar datas no padrão DD/MM/AAAA).
- [FormatCurrency](../string-functions/formatcurrency.md) — Formata valores monetários (ótimo para exibir valores em R$).
- [AttributeValue](../utility-functions/attributevalue.md) — Recupera o valor de um atributo do assinante, útil para buscar o email do destinatário.