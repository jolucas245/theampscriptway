---
title: BuildRowsetFromJson
sidebar_label: BuildRowsetFromJson
description: Carrega dados JSON em um rowset para uso programático em e-mails e CloudPages.
---

# BuildRowsetFromJson

## Descrição

Transforma dados JSON em um rowset que você pode percorrer e exibir no seu conteúdo. É a função ideal quando você precisa consumir respostas de APIs (via [HTTPGet](../http-functions/httpget.md) ou [HTTPPost](../http-functions/httppost.md)) ou trabalhar com dados JSON armazenados em Data Extensions — cenários cada vez mais comuns em réguas de relacionamento que integram com sistemas externos. A função é executada no momento do envio para e-mails e no carregamento para CloudPages.

## Sintaxe

```ampscript
BuildRowsetFromJson(@jsonData, @jsonPathExpression, @boolReturnEmptyOnError)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| jsonData | string | Sim | Os dados JSON que você quer processar. Não pode ser um objeto JSON simples (ex: `{"nome": "João"}`) — precisa conter um array ou estrutura mais complexa. |
| jsonPathExpression | string | Sim | A expressão JSONPath que define quais dados extrair do JSON. Aceita notação de ponto (dot notation) ou colchetes (bracket notation). Não suporta expressões de filtro JSONPath. |
| boolReturnEmptyOnError | boolean | Sim | Se `true` (ou `1`), retorna um rowset vazio quando há erro de sintaxe no JSON ou na expressão JSONPath. Se `false` (ou `0`), lança uma exceção quando ocorre erro. |

## Exemplo básico

Imagine que você tem um JSON com os pedidos recentes de um cliente e quer listar os produtos no e-mail de confirmação da MegaStore.

```ampscript
%%[

SET @json = '{"pedido": {"itens": [{"produto": "Notebook Gamer", "preco": "4299.90"}, {"produto": "Mouse sem fio", "preco": "149.90"}, {"produto": "Mochila para notebook", "preco": "189.90"}]}}'

SET @rowset = BuildRowsetFromJson(@json, "$.pedido.itens", 1)

FOR @i = 1 TO RowCount(@rowset) DO
  SET @row = Row(@rowset, @i)
  SET @produto = Field(@row, "produto")
  SET @preco = Field(@row, "preco")
  Output(Concat(@produto, " - R$ ", @preco))
  Output("<br>")
NEXT @i

]%%
```

**Saída:**
```
Notebook Gamer - R$ 4299.90
Mouse sem fio - R$ 149.90
Mochila para notebook - R$ 189.90
```

## Exemplo avançado

Cenário real: você consome uma API que retorna dados de filiais da FarmaRede e precisa montar uma tabela HTML no e-mail com as lojas mais próximas do cliente, incluindo tratamento de erro e validação de dados vazios.

```ampscript
%%[

SET @json = '{"rede": "FarmaRede", "filiais": [{"nome": "FarmaRede Centro", "cidade": "São Paulo", "telefone": "(11) 3333-4444", "horario": "08h-22h"}, {"nome": "FarmaRede Paulista", "cidade": "São Paulo", "telefone": "(11) 3555-6666", "horario": "24h"}, {"nome": "FarmaRede Savassi", "cidade": "Belo Horizonte", "telefone": "(31) 3222-7777", "horario": "07h-23h"}]}'

SET @filiais = BuildRowsetFromJson(@json, "$.filiais", 1)
SET @total = RowCount(@filiais)

IF @total > 0 THEN
]%%

<table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse; width:100%;">
  <tr style="background-color:#2E7D32; color:#ffffff;">
    <th>Filial</th>
    <th>Cidade</th>
    <th>Telefone</th>
    <th>Horário</th>
  </tr>

%%[
  FOR @i = 1 TO @total DO
    SET @row = Row(@filiais, @i)
    SET @nome = Field(@row, "nome")
    SET @cidade = Field(@row, "cidade")
    SET @telefone = Field(@row, "telefone")
    SET @horario = Field(@row, "horario")

    IF Empty(@horario) THEN
      SET @horario = "Consulte a loja"
    ENDIF
]%%

  <tr>
    <td>%%=V(@nome)=%%</td>
    <td>%%=V(@cidade)=%%</td>
    <td>%%=V(@telefone)=%%</td>
    <td>%%=V(@horario)=%%</td>
  </tr>

%%[
  NEXT @i
]%%

</table>

%%[
ELSE
]%%

<p>Não encontramos filiais disponíveis no momento. Ligue para nossa central: <strong>(11) 4000-1234</strong>.</p>

%%[
ENDIF
]%%
```

**Saída:**
```
| Filial              | Cidade          | Telefone        | Horário        |
|---------------------|-----------------|-----------------|----------------|
| FarmaRede Centro    | São Paulo       | (11) 3333-4444  | 08h-22h        |
| FarmaRede Paulista  | São Paulo       | (11) 3555-6666  | 24h            |
| FarmaRede Savassi   | Belo Horizonte  | (31) 3222-7777  | 07h-23h        |
```

## Observações

> **⚠️ Atenção:** O valor do parâmetro `jsonData` **não pode** ser um objeto JSON simples como `{"nome": "João", "email": "joao@email.com.br"}`. O JSON precisa conter arrays ou estruturas mais complexas para que a função funcione corretamente.

- Quando a expressão JSONPath retorna **valores simples** (como só os preços de um array), o rowset conterá uma única coluna chamada `Value`.
- Quando a expressão JSONPath retorna **objetos**, cada campo do objeto vira uma coluna no rowset, com os respectivos valores. A exceção é quando o valor de um campo é um objeto ou array — nesses casos, o valor retornado será `JSON Object` ou `JSON Object Array`, respectivamente.
- A função **não suporta expressões de filtro** JSONPath.
- A expressão JSONPath aceita tanto **dot notation** (`$.pedido.itens`) quanto **bracket notation** (`$['pedido']['itens']`).

> **⚠️ Atenção:** Sobre o comportamento de erros — preste atenção na lógica do terceiro parâmetro:
> - Com `false` (ou `0`): a função **lança exceção** quando há erro de sintaxe no JSON ou no JSONPath. Use quando quiser que erros apareçam de forma explícita em desenvolvimento.
> - Com `true` (ou `1`): a função **retorna rowset vazio** em caso de erro. Use em produção para evitar que o e-mail quebre.

- Se a expressão JSONPath é válida mas não encontra dados no JSON, a função retorna um rowset vazio (independente do terceiro parâmetro).
- A função gera exceção quando: não recebe os 3 parâmetros obrigatórios, ou quando o terceiro parâmetro não é um número nem booleano.

> **💡 Dica:** Sempre use [RowCount](../data-extension-functions/rowcount.md) para verificar se o rowset retornou dados antes de iterar. Isso evita que o e-mail mostre uma tabela vazia ou quebre o layout — como demonstrado no exemplo avançado acima.

> **💡 Dica:** Combine `BuildRowsetFromJson` com [HTTPGet](../http-functions/httpget.md) para consumir APIs REST e renderizar os dados diretamente no e-mail. Um padrão muito comum em campanhas que puxam dados de catálogo, rastreamento de pedidos ou informações personalizadas em tempo real.

## Funções relacionadas

- [BuildRowsetFromString](../content-functions/buildrowsetfromstring.md) — para transformar strings delimitadas em rowset
- [BuildRowsetFromXml](../content-functions/buildrowsetfromxml.md) — para fazer o mesmo com dados XML
- [Row](../data-extension-functions/row.md) — para acessar uma linha específica do rowset
- [RowCount](../data-extension-functions/rowcount.md) — para contar as linhas retornadas
- [Field](../data-extension-functions/field.md) — para extrair o valor de uma coluna do rowset
- [Empty](../utility-functions/empty.md) — para validar campos vazios antes de exibir
- [HTTPGet](../http-functions/httpget.md) — para buscar dados JSON de APIs externas
- [HTTPPost](../http-functions/httppost.md) — para enviar e receber dados JSON via POST