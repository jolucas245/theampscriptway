---
title: ExecuteFilterOrderedRows
sidebar_label: ExecuteFilterOrderedRows
description: Executa um filtro de dados e retorna um rowset ordenado com os resultados filtrados de uma Data Extension.
---

# ExecuteFilterOrderedRows

## Descrição

Executa um filtro de dados (Data Filter) previamente criado no Marketing Cloud e retorna um rowset ordenado com os resultados. É a versão "com ordenação" da [ExecuteFilter](../data-extension-functions/executefilter.md) — você define por qual coluna quer ordenar e em qual direção (crescente ou decrescente). Funciona exclusivamente com filtros baseados em Data Extensions, não com profile attributes.

## Sintaxe

```ampscript
ExecuteFilterOrderedRows(dataFilterExternalId, numRows, sortColumn)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| dataFilterExternalId | String | Sim | External ID (chave externa) do filtro de dados a ser executado. O filtro precisa ser baseado em uma Data Extension. |
| numRows | Número | Sim | Número de linhas a retornar no rowset. Use `0` para retornar todos os resultados. Não há limite máximo de linhas. |
| sortColumn | String | Sim | Nome da coluna para ordenação, seguido de um espaço e `ASC` (crescente) ou `DESC` (decrescente). |

## Exemplo básico

Imagine um programa de fidelidade da **MegaStore** onde você precisa listar os clientes com mais de 50.000 pontos, ordenados do maior para o menor saldo, em uma CloudPage.

```ampscript
%%[

/* Executa o filtro "Clientes_50k_pontos" ordenando por PontosAcumulados decrescente */
SET @resultados = ExecuteFilterOrderedRows("c5a7e0d9-41e0-4068-bdcc-8766d7c1af94", 0, "PontosAcumulados DESC")

SET @totalLinhas = RowCount(@resultados)

IF @totalLinhas > 0 THEN

  FOR @i = 1 TO @totalLinhas DO

    SET @linha = Row(@resultados, @i)
    SET @nome = Field(@linha, "PrimeiroNome")
    SET @sobrenome = Field(@linha, "Sobrenome")
    SET @pontos = Field(@linha, "PontosAcumulados")

]%%

<p>%%=v(@i)=%%. %%=v(@nome)=%% %%=v(@sobrenome)=%% - %%=FormatNumber(@pontos, "N0")=%% pontos</p>

%%[

  NEXT @i

ENDIF

]%%
```

**Saída:**
```
1. Maria Santos - 201.042 pontos
2. João Silva - 92.374 pontos
3. Carlos Mendes - 69.311 pontos
```

## Exemplo avançado

Uma CloudPage da **Lojas Vitória** exibe o ranking dos top 5 clientes do programa de recompensas, com formatação de tabela HTML e destaque para o tier de cada membro.

```ampscript
%%[

SET @filtroId = "c5a7e0d9-41e0-4068-bdcc-8766d7c1af94"
SET @clientes = ExecuteFilterOrderedRows(@filtroId, 5, "PontosAcumulados DESC")
SET @total = RowCount(@clientes)

IF @total > 0 THEN

]%%

<h2>🏆 Ranking Lojas Vitória - Programa Fidelidade</h2>
<table border="1" cellpadding="8" cellspacing="0">
  <tr>
    <th>Posição</th>
    <th>Cliente</th>
    <th>Pontos</th>
    <th>Tier</th>
    <th>Cidade</th>
  </tr>

%%[

  FOR @i = 1 TO @total DO

    SET @linha = Row(@clientes, @i)
    SET @nome = Field(@linha, "PrimeiroNome")
    SET @sobrenome = Field(@linha, "Sobrenome")
    SET @pontos = Field(@linha, "PontosAcumulados")
    SET @tier = Field(@linha, "NivelRecompensa")
    SET @cidade = Field(@linha, "Cidade")

    /* Define o nome do tier com base no nível */
    SET @nomeTier = IIF(@tier == 1, "Diamante", IIF(@tier == 2, "Ouro", IIF(@tier == 3, "Prata", "Bronze")))

    /* Monta o nome completo */
    SET @nomeCompleto = Concat(@nome, " ", @sobrenome)

]%%

  <tr>
    <td>%%=v(@i)=%%</td>
    <td>%%=v(@nomeCompleto)=%%</td>
    <td>%%=FormatNumber(@pontos, "N0")=%% pts</td>
    <td>%%=v(@nomeTier)=%%</td>
    <td>%%=v(@cidade)=%%</td>
  </tr>

%%[

  NEXT @i

]%%

</table>

%%[

ELSE

]%%

<p>Nenhum cliente encontrado com pontuação suficiente.</p>

%%[

ENDIF

]%%
```

**Saída:**
```
🏆 Ranking Lojas Vitória - Programa Fidelidade

Posição | Cliente           | Pontos      | Tier      | Cidade
1       | Maria Santos      | 201.042 pts | Diamante  | São Paulo
2       | João Silva        | 92.374 pts  | Ouro      | Curitiba
3       | Carlos Mendes     | 69.311 pts  | Prata     | Belo Horizonte
```

## Observações

> **⚠️ Atenção:** Esta função funciona **apenas** em CloudPages, landing pages, microsites e mensagens SMS criadas no MobileConnect. Não use em e-mails — ela simplesmente não vai funcionar nesse contexto.

> **⚠️ Atenção:** O filtro de dados referenciado precisa ser baseado em uma Data Extension. Filtros baseados em profile attributes não são suportados por esta função.

> **💡 Dica:** O parâmetro `numRows` com valor `0` retorna todos os resultados do filtro. Se você precisa de um ranking (top 10, top 5), passe o número exato — isso deixa o código mais eficiente e evita processar linhas desnecessárias.

> **💡 Dica:** Se você precisa dos resultados filtrados mas **não** precisa de ordenação, use a [ExecuteFilter](../data-extension-functions/executefilter.md). Se precisa de ordenação mas quer filtrar diretamente por valores (sem um Data Filter pré-criado), considere [LookupOrderedRows](../data-extension-functions/lookuporderedrows.md).

## Funções relacionadas

- [ExecuteFilter](../data-extension-functions/executefilter.md) — mesma ideia, mas sem ordenação dos resultados
- [LookupOrderedRows](../data-extension-functions/lookuporderedrows.md) — busca ordenada direta na DE, sem depender de um Data Filter
- [Row](../data-extension-functions/row.md) — extrai uma linha específica do rowset retornado
- [RowCount](../data-extension-functions/rowcount.md) — conta quantas linhas o rowset contém
- [Field](../data-extension-functions/field.md) — extrai o valor de uma coluna de uma linha do rowset