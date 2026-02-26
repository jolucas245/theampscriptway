---
title: LookupRows
sidebar_label: LookupRows
description: Retorna um conjunto de linhas (rowset) não ordenado de uma Data Extension com base em critérios de busca.
---

# LookupRows

## Descrição

A função `LookupRows` busca registros em uma Data Extension e retorna um conjunto de linhas (rowset) não ordenado que correspondem aos critérios de pesquisa informados. É uma das funções mais usadas no dia a dia do AMPscript — perfeita para quando você precisa trazer múltiplos registros de uma DE, como listar pedidos de um cliente, exibir produtos de uma categoria ou mostrar o histórico de pontos de um programa de fidelidade. A função pode retornar até **2.000 linhas** e a busca é **case-insensitive** (não diferencia maiúsculas de minúsculas).

## Sintaxe

```ampscript
LookupRows("NomeDaDataExtension", "colunaBusca1", "valorBusca1" [, "colunaBusca2", "valorBusca2", ...])
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| dataExt | String | Sim | Nome da Data Extension onde os dados serão buscados. |
| colunaBusca1 | String | Sim | Nome da coluna usada como critério de busca. O valor é case-insensitive. |
| valorBusca1 | String | Sim | Valor que será procurado na coluna especificada. O valor é case-insensitive. |
| colunaBusca2, valorBusca2, ... | String | Não | Pares adicionais de coluna/valor para refinar a busca. Você pode adicionar quantos pares precisar. |

## Exemplo básico

Imagine que você tem uma Data Extension chamada **"ProgramaFidelidade"** com os seguintes dados:

| ClienteId | Nome | Sobrenome | Pontos | Tier | Cidade |
|---|---|---|---|---|---|
| 1 | João | Silva | 85420 | Ouro | São Paulo |
| 2 | Maria | Santos | 192300 | Diamante | Rio de Janeiro |
| 3 | Carlos | Oliveira | 43100 | Prata | São Paulo |
| 4 | Ana | Ferreira | 18750 | Bronze | Curitiba |
| 5 | Pedro | Costa | 12300 | Bronze | São Paulo |

Este código busca todos os membros da cidade de São Paulo:

```ampscript
%%[

VAR @membrosSP, @totalLinhas

/* Busca os membros de São Paulo */
/* Repare que o nome da DE, coluna e valor não precisam respeitar maiúsculas/minúsculas */
SET @membrosSP = LookupRows("programafidelidade", "cidade", "são paulo")
SET @totalLinhas = RowCount(@membrosSP)

IF @totalLinhas > 0 THEN

]%%

<h3>Membros do programa em São Paulo:</h3>
<ul>

%%[

  FOR @i = 1 TO @totalLinhas DO

    VAR @linha, @clienteId, @nome, @sobrenome, @pontos
    SET @linha = Row(@membrosSP, @i)
    SET @clienteId = Field(@linha, "ClienteId")
    SET @nome = Field(@linha, "Nome")
    SET @sobrenome = Field(@linha, "Sobrenome")
    SET @pontos = Field(@linha, "Pontos")

]%%

  <li>%%=v(@nome)=%% %%=v(@sobrenome)=%% (ID %%=v(@clienteId)=%%) - Saldo: %%=v(@pontos)=%% pontos</li>

%%[

  NEXT @i

]%%

</ul>

%%[

ELSE

]%%

<p>Nenhum membro encontrado em São Paulo.</p>

%%[

ENDIF

]%%
```

**Saída:**
```
Membros do programa em São Paulo:
• João Silva (ID 1) - Saldo: 85420 pontos
• Carlos Oliveira (ID 3) - Saldo: 43100 pontos
• Pedro Costa (ID 5) - Saldo: 12300 pontos
```

> ⚠️ A ordem dos resultados **não é garantida**. As linhas podem aparecer em qualquer sequência.

## Exemplo avançado

Cenário real: um e-mail de **Dia das Mães** da loja fictícia **Lojas Vitória**. Você quer mostrar os últimos pedidos do cliente para sugerir que ele compre presentes semelhantes. A Data Extension **"Pedidos"** tem os campos: `PedidoId`, `EmailCliente`, `Produto`, `Valor`, `DataPedido`, `Categoria`.

```ampscript
%%[

VAR @emailCliente, @pedidos, @totalPedidos, @valorTotal

SET @emailCliente = AttributeValue("emailaddr")
SET @pedidos = LookupRows("Pedidos", "EmailCliente", @emailCliente, "Categoria", "Casa e Decoração")
SET @totalPedidos = RowCount(@pedidos)

]%%

<p>Olá! O Dia das Mães está chegando 💐</p>

%%[ IF @totalPedidos > 0 THEN ]%%

<p>Vimos que você já comprou itens de <strong>Casa e Decoração</strong> com a gente. Que tal presentear sua mãe com algo especial?</p>

<table style="width:100%; border-collapse:collapse;">
  <tr style="background-color:#f5f5f5;">
    <th style="padding:8px; text-align:left;">Pedido</th>
    <th style="padding:8px; text-align:left;">Produto</th>
    <th style="padding:8px; text-align:right;">Valor</th>
  </tr>

%%[

  SET @valorTotal = 0

  FOR @i = 1 TO @totalPedidos DO

    VAR @linha, @pedidoId, @produto, @valor
    SET @linha = Row(@pedidos, @i)
    SET @pedidoId = Field(@linha, "PedidoId")
    SET @produto = Field(@linha, "Produto")
    SET @valor = Field(@linha, "Valor")
    SET @valorTotal = Add(@valorTotal, @valor)

]%%

  <tr>
    <td style="padding:8px;">#%%=v(@pedidoId)=%%</td>
    <td style="padding:8px;">%%=v(@produto)=%%</td>
    <td style="padding:8px; text-align:right;">R$ %%=FormatNumber(@valor, "N2")=%%</td>
  </tr>

%%[

  NEXT @i

]%%

</table>

<p style="margin-top:12px;">
  Você já investiu <strong>R$ %%=FormatNumber(@valorTotal, "N2")=%%</strong> nessa categoria.
  Aproveite <strong>frete grátis acima de R$ 299,00</strong> para presentes de Dia das Mães!
</p>

<a href="https://www.lojasvitoria.com.br/dia-das-maes?cat=casa-decoracao" style="background-color:#d63384; color:#fff; padding:12px 24px; text-decoration:none; border-radius:4px;">
  Ver presentes para a mamãe 🎁
</a>

%%[ ELSE ]%%

<p>Temos presentes incríveis para o Dia das Mães a partir de R$ 49,90 com frete grátis acima de R$ 299,00!</p>

<a href="https://www.lojasvitoria.com.br/dia-das-maes" style="background-color:#d63384; color:#fff; padding:12px 24px; text-decoration:none; border-radius:4px;">
  Explorar presentes 🎁
</a>

%%[ ENDIF ]%%
```

**Saída (exemplo para um cliente com 3 pedidos na categoria):**
```
Olá! O Dia das Mães está chegando 💐

Vimos que você já comprou itens de Casa e Decoração com a gente.
Que tal presentear sua mãe com algo especial?

| Pedido  | Produto                   |     Valor |
|---------|---------------------------|-----------|
| #4521   | Jogo de Toalhas Premium   | R$ 189,90 |
| #4780   | Difusor de Aromas         |  R$ 79,90 |
| #5102   | Kit Velas Aromáticas      | R$ 129,90 |

Você já investiu R$ 399,70 nessa categoria.
Aproveite frete grátis acima de R$ 299,00 para presentes de Dia das Mães!

[Ver presentes para a mamãe 🎁]
```

## Observações

- **Limite de 2.000 linhas**: a função retorna no máximo 2.000 registros. Se a sua busca pode trazer mais do que isso, considere usar filtros adicionais (mais pares coluna/valor) para restringir os resultados, ou utilize a função [LookupOrderedRows](../data-extension-functions/lookuporderedrows.md) que também aceita um parâmetro de limite.
- **Resultados não ordenados**: os registros retornados não seguem nenhuma ordem específica. Se você precisa dos dados ordenados, use [LookupOrderedRows](../data-extension-functions/lookuporderedrows.md).
- **Case-insensitive**: tanto o nome da Data Extension, quanto os nomes das colunas e os valores de busca **não diferenciam** maiúsculas de minúsculas. Se você precisa de uma busca case-sensitive, use [LookupRowsCS](../data-extension-functions/lookuprowscs.md).
- **Rowset vazio**: se nenhum registro for encontrado, a função retorna um rowset vazio. Sempre use [RowCount](../data-extension-functions/rowcount.md) para verificar se há resultados antes de iterar, evitando erros no envio.
- **Múltiplos critérios**: você pode passar quantos pares de coluna/valor quiser para refinar a busca. Todos os critérios funcionam como **AND** (ou seja, todas as condições precisam ser verdadeiras).
- **Use com Row e Field**: para acessar os dados retornados, você precisa combinar `LookupRows` com [Row](../data-extension-functions/row.md) (para pegar uma linha específica do rowset) e [Field](../data-extension-functions/field.md) (para extrair o valor de uma coluna da linha).
- **Funciona em diversos contextos**: você pode usar `LookupRows` em emails, CloudPages, SMS e landing pages — não há restrição de contexto.
- **Nomes de Data Extension com pastas**: se a DE estiver dentro de uma pasta, você precisa informar apenas o nome da DE, não o caminho da pasta. Porém, se existirem DEs com o mesmo nome em pastas diferentes, pode haver ambiguidade — nesse caso, use o External Key da DE prefixado com `ENT.` para Business Units filhas.

## Funções relacionadas

- [Lookup](../data-extension-functions/lookup.md) — Retorna o valor de uma única coluna de um único registro (quando você só precisa de um dado específico).
- [LookupRowsCS](../data-extension-functions/lookuprowscs.md) — Versão case-sensitive do `LookupRows`, para quando a diferença entre maiúsculas e minúsculas importa.
- [LookupOrderedRows](../data-extension-functions/lookuporderedrows.md) — Semelhante ao `LookupRows`, mas permite ordenar os resultados por uma coluna e definir um limite de linhas.
- [LookupOrderedRowsCS](../data-extension-functions/lookuporderedrowscs.md) — Versão case-sensitive do `LookupOrderedRows`.
- [Row](../data-extension-functions/row.md) — Extrai uma linha específica de um rowset retornado por `LookupRows`.
- [Field](../data-extension-functions/field.md) — Extrai o valor de uma coluna específica de uma linha do rowset.
- [RowCount](../data-extension-functions/rowcount.md) — Retorna a quantidade de linhas em um rowset — essencial para verificar se a busca trouxe resultados.
- [DataExtensionRowCount](../data-extension-functions/dataextensionrowcount.md) — Retorna o total de registros de uma Data Extension inteira.
- [Empty](../utility-functions/empty.md) — Útil para verificar se um valor retornado está vazio antes de usá-lo.