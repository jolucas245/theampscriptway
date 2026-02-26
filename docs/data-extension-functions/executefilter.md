---
title: ExecuteFilter
sidebar_label: ExecuteFilter
description: Executa um filtro de dados (Data Filter) e retorna um rowset não ordenado com os resultados filtrados de uma Data Extension.
---

# ExecuteFilter

## Descrição

A função `ExecuteFilter` executa um filtro de dados (Data Filter) previamente criado no Marketing Cloud e retorna um rowset (conjunto de linhas) não ordenado com os registros que atendem aos critérios do filtro. Essa função funciona **somente com filtros baseados em Data Extensions** — não funciona com filtros baseados em atributos de perfil. É uma alternativa prática quando você já tem um filtro configurado na interface e quer reutilizar essa lógica no AMPscript, sem precisar reescrever as condições manualmente.

## Sintaxe

```ampscript
ExecuteFilter(dataFilterExternalId)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| dataFilterExternalId | String | Sim | O External ID (chave externa) do filtro de dados que você quer executar. Você encontra esse valor nas propriedades do Data Filter dentro do Marketing Cloud. |

**Retorno:** Um rowset (conjunto de linhas) não ordenado contendo os registros que satisfazem os critérios do filtro.

## Exemplo básico

Imagine que você tem uma Data Extension chamada **"ProgramaFidelidade"** com os seguintes dados:

| ClienteId | Nome | Sobrenome | Pontos | Nivel | Cidade |
|---|---|---|---|---|---|
| 1 | João | Silva | 92374 | 2 | São Paulo |
| 2 | Maria | Santos | 201042 | 1 | Campinas |
| 3 | Carlos | Oliveira | 69311 | 3 | Curitiba |
| 4 | Ana | Ferreira | 23999 | 4 | Belo Horizonte |
| 5 | Pedro | Costa | 15123 | 4 | São Paulo |

Você também criou um Data Filter chamado **"ProgramaFidelidade_50k_ou_mais"** (External Key: `a1b2c3d4-56ef-7890-abcd-1234567890ef`) que filtra todos os registros com **Pontos >= 50000**.

```ampscript
%%[

VAR @rows, @rowCount, @filterExtId

SET @filterExtId = "a1b2c3d4-56ef-7890-abcd-1234567890ef"
SET @rows = ExecuteFilter(@filterExtId)
SET @rowCount = RowCount(@rows)

IF @rowCount > 0 THEN
  FOR @counter = 1 TO @rowCount DO

    VAR @row, @clienteId, @nome, @sobrenome, @pontos, @cidade

    SET @row = Row(@rows, @counter)
    SET @clienteId = Field(@row, "ClienteId")
    SET @nome = Field(@row, "Nome")
    SET @sobrenome = Field(@row, "Sobrenome")
    SET @pontos = Field(@row, "Pontos")
    SET @cidade = Field(@row, "Cidade")

]%%

<tr>
  <td>%%=v(@counter)=%%</td>
  <td>%%=v(@clienteId)=%%</td>
  <td>%%=v(@nome)=%%</td>
  <td>%%=v(@sobrenome)=%%</td>
  <td>%%=FormatNumber(@pontos, "N0")=%%</td>
  <td>%%=v(@cidade)=%%</td>
</tr>

%%[
  NEXT @counter
ENDIF
]%%
```

**Saída:**

| # | ClienteId | Nome | Sobrenome | Pontos | Cidade |
|---|---|---|---|---|---|
| 1 | 1 | João | Silva | 92.374 | São Paulo |
| 2 | 2 | Maria | Santos | 201.042 | Campinas |
| 3 | 3 | Carlos | Oliveira | 69.311 | Curitiba |

## Exemplo avançado

Cenário real: a **Conecta Telecom** tem um programa de pontos e quer criar uma CloudPage que lista os clientes com 50 mil pontos ou mais, mostrando uma mensagem personalizada de acordo com o nível de fidelidade e incluindo um link para resgate de prêmios.

Data Extension **"FidelidadeConecta"**:

| ClienteId | Nome | Sobrenome | CPF | Pontos | Nivel | Cidade | Email |
|---|---|---|---|---|---|---|---|
| 1 | João | Silva | 123.456.789-00 | 92374 | Ouro | São Paulo | joao@email.com |
| 2 | Maria | Santos | 987.654.321-00 | 201042 | Diamante | Campinas | maria@email.com |
| 3 | Carlos | Oliveira | 456.789.123-00 | 69311 | Prata | Curitiba | carlos@email.com |
| 4 | Ana | Ferreira | 321.654.987-00 | 23999 | Bronze | Belo Horizonte | ana@email.com |
| 5 | Pedro | Costa | 654.321.987-00 | 15123 | Bronze | São Paulo | pedro@email.com |

Data Filter **"FidelidadeConecta_Acima50k"** (External Key: `f7e8d9c0-12ab-34cd-56ef-789012345678`) — filtra Pontos >= 50000.

```ampscript
%%[

VAR @rows, @rowCount, @filterExtId

SET @filterExtId = "f7e8d9c0-12ab-34cd-56ef-789012345678"
SET @rows = ExecuteFilter(@filterExtId)
SET @rowCount = RowCount(@rows)

IF @rowCount > 0 THEN
]%%

<h2>Clientes elegíveis para resgate de prêmios — Conecta Telecom</h2>
<p>Total de clientes encontrados: %%=v(@rowCount)=%%</p>

<table border="1" cellpadding="8">
  <tr>
    <th>#</th>
    <th>Nome Completo</th>
    <th>Nível</th>
    <th>Pontos</th>
    <th>Valor em R$</th>
    <th>Mensagem</th>
  </tr>

%%[
  FOR @counter = 1 TO @rowCount DO

    VAR @row, @clienteId, @nome, @sobrenome, @pontos, @nivel, @nomeCompleto
    VAR @valorReais, @mensagem, @linkResgate

    SET @row = Row(@rows, @counter)
    SET @clienteId = Field(@row, "ClienteId")
    SET @nome = Field(@row, "Nome")
    SET @sobrenome = Field(@row, "Sobrenome")
    SET @pontos = Field(@row, "Pontos")
    SET @nivel = Field(@row, "Nivel")

    SET @nomeCompleto = Concat(ProperCase(@nome), " ", ProperCase(@sobrenome))

    /* Conversão: cada 1.000 pontos = R$ 5,00 */
    SET @valorReais = Divide(@pontos, 1000)
    SET @valorReais = Multiply(@valorReais, 5)

    SET @linkResgate = Concat("https://www.conectatelecom.com.br/resgate?id=", @clienteId)

    IF @nivel == "Diamante" THEN
      SET @mensagem = Concat("🌟 Parabéns, ", @nome, "! Você é Diamante e tem prioridade no resgate!")
    ELSEIF @nivel == "Ouro" THEN
      SET @mensagem = Concat("✨ Ótimo, ", @nome, "! Como cliente Ouro, você tem ofertas exclusivas.")
    ELSE
      SET @mensagem = Concat("👍 Olá, ", @nome, "! Você já pode resgatar seus prêmios.")
    ENDIF
]%%

  <tr>
    <td>%%=v(@counter)=%%</td>
    <td><a href="%%=RedirectTo(@linkResgate)=%%">%%=v(@nomeCompleto)=%%</a></td>
    <td>%%=v(@nivel)=%%</td>
    <td>%%=FormatNumber(@pontos, "N0")=%%</td>
    <td>%%=FormatCurrency(@valorReais, "pt-BR", 2)=%%</td>
    <td>%%=v(@mensagem)=%%</td>
  </tr>

%%[
  NEXT @counter
]%%

</table>

%%[
ELSE
]%%

<p>Nenhum cliente encontrado com 50.000 pontos ou mais no momento.</p>

%%[
ENDIF
]%%
```

**Saída:**

| # | Nome Completo | Nível | Pontos | Valor em R$ | Mensagem |
|---|---|---|---|---|---|
| 1 | João Silva | Ouro | 92.374 | R$ 461,87 | ✨ Ótimo, João! Como cliente Ouro, você tem ofertas exclusivas. |
| 2 | Maria Santos | Diamante | 201.042 | R$ 1.005,21 | 🌟 Parabéns, Maria! Você é Diamante e tem prioridade no resgate! |
| 3 | Carlos Oliveira | Prata | 69.311 | R$ 346,56 | 👍 Olá, Carlos! Você já pode resgatar seus prêmios. |

## Observações

- ⚠️ **Restrição de contexto:** Use esta função **somente** em CloudPages, Landing Pages, Microsites e mensagens SMS criadas no MobileConnect. Ela **não funciona em emails**.
- A função **só funciona com Data Filters baseados em Data Extensions**. Filtros baseados em atributos de perfil (Profile Attributes) não são suportados.
- O rowset retornado é **não ordenado** — ou seja, você não tem controle sobre a ordem dos registros. Se precisar de ordenação, considere usar [ExecuteFilterOrderedRows](../data-extension-functions/executefilterorderedrows.md).
- O parâmetro `dataFilterExternalId` é a **External Key** do Data Filter, não o nome. Você encontra essa chave acessando as propriedades do filtro na interface do Marketing Cloud (geralmente em **Email Studio > Subscribers > Data Filters**).
- Se o filtro não retornar nenhum resultado, o rowset ficará vazio. Sempre valide com [RowCount](../data-extension-functions/rowcount.md) antes de iterar os resultados para evitar erros.
- Como o filtro já é definido na interface do SFMC, se você precisar de critérios dinâmicos no código, considere usar [LookupRows](../data-extension-functions/lookuprows.md) ou [LookupOrderedRows](../data-extension-functions/lookuporderedrows.md) no lugar.
- Caso o External ID informado seja inválido ou o filtro não exista, a função vai gerar um erro em tempo de execução. É uma boa prática testar em sandbox antes de publicar.

## Funções relacionadas

- [ExecuteFilterOrderedRows](../data-extension-functions/executefilterorderedrows.md) — Igual ao `ExecuteFilter`, mas retorna os resultados ordenados por uma coluna específica.
- [LookupRows](../data-extension-functions/lookuprows.md) — Busca linhas em uma Data Extension com critérios definidos diretamente no código AMPscript.
- [LookupOrderedRows](../data-extension-functions/lookuporderedrows.md) — Busca linhas em uma Data Extension com critérios e ordenação definidos no código.
- [Row](../data-extension-functions/row.md) — Retorna uma linha específica de um rowset pelo índice.
- [RowCount](../data-extension-functions/rowcount.md) — Retorna o número de linhas em um rowset.
- [Field](../data-extension-functions/field.md) — Extrai o valor de um campo específico de uma linha do rowset.
- [FormatNumber](../string-functions/formatnumber.md) — Formata valores numéricos (útil para exibir pontos com separador de milhares).
- [FormatCurrency](../string-functions/formatcurrency.md) — Formata valores monetários no padrão de moeda desejado.
- [Concat](../string-functions/concat.md) — Concatena strings, útil para montar nomes completos e URLs dinâmicas.
- [ProperCase](../string-functions/propercase.md) — Converte texto para capitalização de nome próprio.
- [RedirectTo](../http-functions/redirectto.md) — Cria redirecionamentos rastreáveis para links dinâmicos.