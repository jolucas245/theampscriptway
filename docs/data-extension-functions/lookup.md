---
title: Lookup
sidebar_label: Lookup
description: Retorna o valor de uma coluna específica de uma Data Extension com base em critérios de busca.
---

# Lookup

## Descrição

A função `Lookup` busca um valor específico dentro de uma Data Extension e retorna o conteúdo de uma coluna que você escolher. Você informa o nome da Data Extension, a coluna que quer retornar, a coluna de busca e o valor procurado. Se a busca encontrar mais de um resultado, a função retorna apenas o **primeiro valor encontrado** — por isso, o ideal é usá-la com colunas que tenham valores únicos (como um ID, CPF ou e-mail). Se precisar retornar múltiplas linhas, dê uma olhada nas funções `LookupRows` ou `LookupOrderedRows`.

## Sintaxe

```ampscript
Lookup("NomeDaDataExtension", "ColunaRetorno", "ColunaBusca1", "ValorBusca1" [, "ColunaBusca2", "ValorBusca2", ...])
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| dataExt | string | Sim | Nome da Data Extension que contém os dados que você quer consultar. |
| returnColumn | string | Sim | Nome da coluna da qual o valor será retornado. |
| searchColumn1 | string | Sim | Nome da coluna usada como critério de busca. **Case-sensitive** (diferencia maiúsculas de minúsculas). |
| searchValue1 | string | Sim | Valor que será procurado na coluna de busca. **Case-sensitive**. |
| searchColumn2, searchValue2, ... | string | Não | Você pode adicionar pares extras de coluna/valor para refinar a busca. |

## Exemplo básico

Imagine que você tem uma Data Extension chamada **"Clientes"** com os dados dos seus assinantes:

| CPF | Nome | Email | Cidade | Pontos |
|---|---|---|---|---|
| 123.456.789-00 | João Silva | joao@email.com | São Paulo | 1500 |
| 987.654.321-00 | Maria Santos | maria@email.com | Rio de Janeiro | 3200 |
| 456.789.123-00 | Carlos Oliveira | carlos@email.com | Belo Horizonte | 800 |

```ampscript
%%[
SET @cpfCliente = "987.654.321-00"
SET @nomeCliente = Lookup("Clientes", "Nome", "CPF", @cpfCliente)
]%%

Olá, %%=v(@nomeCliente)=%%! Bem-vindo(a) de volta.
```

**Saída:**
```
Olá, Maria Santos! Bem-vindo(a) de volta.
```

## Exemplo avançado

Cenário real: você está enviando um e-mail de campanha de **Dia das Mães** para clientes de uma loja virtual fictícia. Quer mostrar o saldo de pontos do programa de fidelidade e oferecer frete grátis acima de R$ 299. Os dados de pontos estão numa Data Extension separada chamada **"ProgramaFidelidade"**:

| ClienteID | Tier | Pontos | UltimaCompra |
|---|---|---|---|
| CLI-001 | Ouro | 4500 | 15/04/2025 |
| CLI-002 | Prata | 1200 | 02/03/2025 |
| CLI-003 | Bronze | 300 | 28/01/2025 |

E outra Data Extension chamada **"Cupons"** com ofertas segmentadas por tier:

| Tier | CodigoCupom | Desconto |
|---|---|---|
| Ouro | MAES25OFF | 25 |
| Prata | MAES15OFF | 15 |
| Bronze | MAES10OFF | 10 |

```ampscript
%%[
/* ID do cliente vem da DE de envio */
SET @clienteID = AttributeValue("ClienteID")

/* Busca dados do programa de fidelidade */
SET @tier = Lookup("ProgramaFidelidade", "Tier", "ClienteID", @clienteID)
SET @pontos = Lookup("ProgramaFidelidade", "Pontos", "ClienteID", @clienteID)

/* Busca o cupom correspondente ao tier do cliente */
SET @cupom = Lookup("Cupons", "CodigoCupom", "Tier", @tier)
SET @desconto = Lookup("Cupons", "Desconto", "Tier", @tier)

/* Calcula o valor em reais dos pontos (cada ponto = R$ 0,10) */
SET @valorPontos = Multiply(@pontos, 0.10)
SET @valorPontosFormatado = FormatCurrency(@valorPontos, "pt-BR", 2)

/* Verifica se o nome do tier está vazio */
SET @tierExibicao = IIF(Empty(@tier), "Participante", @tier)
]%%

<h1>🌷 Especial Dia das Mães — Lojas Vitória</h1>

<p>Você é cliente <strong>%%=v(@tierExibicao)=%%</strong> do nosso programa de fidelidade!</p>

<p>Seu saldo atual: <strong>%%=v(@pontos)=%% pontos</strong> (equivalem a <strong>%%=v(@valorPontosFormatado)=%%</strong>).</p>

<p>Use o cupom <strong>%%=v(@cupom)=%%</strong> e ganhe <strong>%%=v(@desconto)=%%% de desconto</strong> em presentes para a mamãe!</p>

<p>🚚 Frete grátis em compras acima de R$ 299,00.</p>

<p>Acesse: <a href="https://www.lojasvitoria.com.br/diadasmaes">www.lojasvitoria.com.br/diadasmaes</a></p>
```

**Saída (para o cliente CLI-001):**
```
🌷 Especial Dia das Mães — Lojas Vitória

Você é cliente Ouro do nosso programa de fidelidade!

Seu saldo atual: 4500 pontos (equivalem a R$ 450,00).

Use o cupom MAES25OFF e ganhe 25% de desconto em presentes para a mamãe!

🚚 Frete grátis em compras acima de R$ 299,00.

Acesse: www.lojasvitoria.com.br/diadasmaes
```

## Observações

- A função retorna **apenas um valor** (uma única célula). Se a busca encontrar múltiplas linhas que atendem ao critério, apenas o primeiro resultado é retornado. Se você precisa de múltiplas linhas, use [LookupRows](../data-extension-functions/lookuprows.md) ou [LookupOrderedRows](../data-extension-functions/lookuporderedrows.md).
- Os nomes das **colunas de busca** (searchColumn) e os **valores de busca** (searchValue) são **case-sensitive** — ou seja, `"Ouro"` é diferente de `"ouro"`. Preste atenção nisso pra evitar dor de cabeça.
- Se nenhum resultado for encontrado, a função retorna uma **string vazia**. É uma boa prática usar [Empty](../utility-functions/empty.md) ou [IsNull](../utility-functions/isnull.md) para verificar o retorno antes de exibir qualquer coisa.
- Você pode adicionar **múltiplos pares** de coluna/valor de busca para criar filtros mais específicos. Por exemplo, buscar por `"Tier", "Ouro", "Cidade", "São Paulo"` ao mesmo tempo.
- O nome da Data Extension no primeiro parâmetro **não é case-sensitive**.
- Essa função funciona em **e-mails, CloudPages, SMS e Landing Pages** — basicamente em qualquer contexto onde AMPscript é suportado.
- Para buscas que respeitam maiúsculas e minúsculas também no nome da coluna de retorno, considere combinar com as variantes CS das funções de lookup.

## Funções relacionadas

- [LookupRows](../data-extension-functions/lookuprows.md) — Retorna uma ou mais linhas de uma Data Extension com base em critérios de busca.
- [LookupRowsCS](../data-extension-functions/lookuprowscs.md) — Versão case-sensitive do LookupRows.
- [LookupOrderedRows](../data-extension-functions/lookuporderedrows.md) — Retorna múltiplas linhas com possibilidade de ordenação por coluna.
- [LookupOrderedRowsCS](../data-extension-functions/lookuporderedrowscs.md) — Versão case-sensitive do LookupOrderedRows.
- [Row](../data-extension-functions/row.md) — Retorna uma linha específica de um rowset.
- [Field](../data-extension-functions/field.md) — Retorna o valor de um campo específico de uma linha de um rowset.
- [RowCount](../data-extension-functions/rowcount.md) — Retorna a quantidade de linhas de um rowset.
- [Empty](../utility-functions/empty.md) — Verifica se um valor está vazio, útil para tratar retornos do Lookup.
- [IsNullDefault](../utility-functions/isnulldefault.md) — Retorna um valor padrão caso o resultado seja nulo.
- [V](../utility-functions/v.md) — Exibe o valor de uma variável inline no conteúdo.
- [AttributeValue](../utility-functions/attributevalue.md) — Retorna o valor de um atributo do assinante ou coluna da DE de envio.