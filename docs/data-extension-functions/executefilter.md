---
title: ExecuteFilter
sidebar_label: ExecuteFilter
description: Executa um filtro de dados (Data Filter) e retorna um rowset não ordenado com os resultados filtrados de uma Data Extension.
---

# ExecuteFilter

## Descrição

A função `ExecuteFilter` executa um Data Filter previamente criado no Marketing Cloud e retorna um rowset não ordenado com os registros que atendem aos critérios do filtro. Ela funciona exclusivamente com filtros baseados em Data Extensions — não aceita filtros baseados em Profile Attributes. É uma boa opção quando você já tem filtros configurados na interface do SFMC e quer reaproveitá-los em CloudPages, landing pages, microsites ou mensagens SMS do MobileConnect.

## Sintaxe

```ampscript
ExecuteFilter(dataFilterExternalId)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| dataFilterExternalId | string | Sim | O External ID (chave externa) do Data Filter a ser executado. O filtro precisa estar baseado em uma Data Extension. |

## Exemplo básico

Imagine que você tem uma Data Extension chamada "ProgramaFidelidade" com dados de clientes da **MegaStore**, e um Data Filter configurado para retornar apenas clientes com 50.000 pontos ou mais. O External ID do filtro é `a3b8c1d2-55f0-4a12-9e3c-7890abcdef12`.

```ampscript
%%[

VAR @resultados, @totalLinhas, @i, @linha, @nome, @sobrenome, @pontos

SET @resultados = ExecuteFilter("a3b8c1d2-55f0-4a12-9e3c-7890abcdef12")
SET @totalLinhas = RowCount(@resultados)

IF @totalLinhas > 0 THEN
  FOR @i = 1 TO @totalLinhas DO
    SET @linha = Row(@resultados, @i)
    SET @nome = Field(@linha, "PrimeiroNome")
    SET @sobrenome = Field(@linha, "Sobrenome")
    SET @pontos = Field(@linha, "PontosRecompensa")
]%%

<p>%%=v(@nome)=%% %%=v(@sobrenome)=%% — %%=FormatNumber(@pontos, "N0")=%% pontos</p>

%%[
  NEXT @i
ELSE
]%%

<p>Nenhum cliente encontrado com 50.000 pontos ou mais.</p>

%%[
ENDIF
]%%
```

**Saída:**
```
João Silveira — 92.374 pontos
Maria Chatterjee — 201.042 pontos
Carlos Santos — 69.311 pontos
```

## Exemplo avançado

Cenário de régua de relacionamento: a **Lojas Vitória** quer exibir em uma CloudPage uma tabela ranqueada dos clientes premium do programa de fidelidade, mostrando a região e o nível de recompensa. O Data Filter já está configurado para retornar clientes com 50.000 pontos ou mais.

```ampscript
%%[

VAR @resultados, @totalLinhas, @i, @linha
VAR @clienteId, @nome, @sobrenome, @pontos, @regiao, @nivel

SET @resultados = ExecuteFilter("a3b8c1d2-55f0-4a12-9e3c-7890abcdef12")
SET @totalLinhas = RowCount(@resultados)

]%%

<h2>Clientes Premium — Programa Fidelidade Lojas Vitória</h2>

%%[ IF @totalLinhas > 0 THEN ]%%

<table border="1" cellpadding="8" cellspacing="0">
  <tr>
    <th>#</th>
    <th>ID</th>
    <th>Nome Completo</th>
    <th>Pontos</th>
    <th>Nível</th>
    <th>Região</th>
  </tr>

%%[
  FOR @i = 1 TO @totalLinhas DO
    SET @linha = Row(@resultados, @i)
    SET @clienteId = Field(@linha, "ClienteId")
    SET @nome = Field(@linha, "PrimeiroNome")
    SET @sobrenome = Field(@linha, "Sobrenome")
    SET @pontos = Field(@linha, "PontosRecompensa")
    SET @nivel = Field(@linha, "NivelRecompensa")
    SET @regiao = Field(@linha, "Regiao")
]%%

  <tr>
    <td>%%=v(@i)=%%</td>
    <td>%%=v(@clienteId)=%%</td>
    <td>%%=ProperCase(Concat(@nome, " ", @sobrenome))=%%</td>
    <td>%%=FormatNumber(@pontos, "N0")=%% pts</td>
    <td>
      %%[
        IF @nivel == 1 THEN
      ]%%
        🥇 Diamante
      %%[
        ELSEIF @nivel == 2 THEN
      ]%%
        🥈 Ouro
      %%[
        ELSEIF @nivel == 3 THEN
      ]%%
        🥉 Prata
      %%[
        ELSE
      ]%%
        Bronze
      %%[
        ENDIF
      ]%%
    </td>
    <td>%%=v(@regiao)=%%</td>
  </tr>

%%[
  NEXT @i
]%%

</table>

<p><strong>Total de clientes premium:</strong> %%=v(@totalLinhas)=%%</p>

%%[ ELSE ]%%

<p>Nenhum cliente atingiu a pontuação mínima de 50.000 pontos ainda.</p>

%%[ ENDIF ]%%
```

**Saída:**
```
Clientes Premium — Programa Fidelidade Lojas Vitória

#   ID   Nome Completo       Pontos       Nível          Região
1   1    João Silveira        92.374 pts   🥈 Ouro        São Paulo
2   2    Maria Chatterjee     201.042 pts  🥇 Diamante    Curitiba
3   3    Carlos Santos        69.311 pts   🥉 Prata       Belo Horizonte

Total de clientes premium: 3
```

## Observações

> **⚠️ Atenção:** A função `ExecuteFilter` só pode ser usada em **CloudPages**, **landing pages**, **microsites** e **mensagens SMS criadas no MobileConnect**. Ela **não funciona em e-mails**. Se você precisa filtrar dados em um e-mail, considere usar funções como [LookupRows](../data-extension-functions/lookuprows.md) ou [LookupOrderedRows](../data-extension-functions/lookuporderedrows.md).

> **⚠️ Atenção:** Essa função funciona **apenas** com Data Filters baseados em Data Extensions. Filtros baseados em Profile Attributes não são suportados.

- O rowset retornado **não é ordenado**. Se você precisa dos resultados em uma ordem específica, considere usar a função [ExecuteFilterOrderedRows](../data-extension-functions/executefilterorderedrows.md).
- O parâmetro que você passa é o **External ID** (chave externa) do Data Filter, não o nome dele. Você encontra esse valor nas propriedades do filtro dentro do Marketing Cloud.

> **💡 Dica:** Para iterar sobre os resultados, combine `ExecuteFilter` com [RowCount](../data-extension-functions/rowcount.md) para saber quantos registros vieram, [Row](../data-extension-functions/row.md) para acessar cada linha e [Field](../data-extension-functions/field.md) para extrair os valores de cada coluna.

## Funções relacionadas

- [ExecuteFilterOrderedRows](../data-extension-functions/executefilterorderedrows.md) — versão que retorna resultados ordenados
- [LookupRows](../data-extension-functions/lookuprows.md) — alternativa para buscar registros com critérios definidos inline
- [LookupOrderedRows](../data-extension-functions/lookuporderedrows.md) — busca com ordenação sem depender de Data Filters
- [RowCount](../data-extension-functions/rowcount.md) — conta o número de linhas no rowset retornado
- [Row](../data-extension-functions/row.md) — acessa uma linha específica do rowset
- [Field](../data-extension-functions/field.md) — extrai o valor de uma coluna em uma linha do rowset