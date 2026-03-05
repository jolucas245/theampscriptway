---
title: InvokeRetrieve
sidebar_label: InvokeRetrieve
description: Invoca o método Retrieve em um API Object do Marketing Cloud e retorna a mensagem de status e o ID da requisição.
---

# InvokeRetrieve

## Descrição

A função `InvokeRetrieve` executa o método Retrieve em um API Object do Marketing Cloud Engagement, retornando a mensagem de status da API e o ID da requisição. É a função que você usa quando precisa consultar objetos do sistema (como subscribers, Data Extensions, listas, etc.) diretamente via API Objects dentro do AMPscript. Ela trabalha em conjunto com [`CreateObject`](../api-functions/createobject.md), [`SetObjectProperty`](../api-functions/setobjectproperty.md) e [`AddObjectArrayItem`](../api-functions/addobjectarrayitem.md) para montar e executar a consulta.

## Sintaxe

```ampscript
InvokeRetrieve(apiObject, statusMessage, requestId)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| apiObject | API Object | Sim | O API Object no qual o método Retrieve será invocado. |
| statusMessage | Variável AMPscript | Não | Variável que armazena a mensagem de status retornada pela API. |
| requestId | Variável AMPscript | Não | Variável que armazena o ID da requisição retornado pela API. |

## Exemplo básico

Consultando subscribers pelo endereço de e-mail para verificar um cliente da Lojas Vitória.

```ampscript
%%[
/* Cria o RetrieveRequest Object */
SET @rr = CreateObject("RetrieveRequest")

/* Define o tipo de objeto a ser consultado */
SetObjectProperty(@rr, "ObjectType", "Subscriber")

/* Adiciona as propriedades que queremos recuperar */
AddObjectArrayItem(@rr, "Properties", "EmailAddress")
AddObjectArrayItem(@rr, "Properties", "SubscriberKey")

/* Cria um filtro simples para buscar pelo e-mail */
SET @sfp = CreateObject("SimpleFilterPart")
SetObjectProperty(@sfp, "Property", "EmailAddress")
SetObjectProperty(@sfp, "SimpleOperator", "equals")
AddObjectArrayItem(@sfp, "Value", "joao.silva@lojasVitoria.com.br")

/* Aplica o filtro ao RetrieveRequest */
SetObjectProperty(@rr, "Filter", @sfp)

/* Executa o Retrieve */
SET @rows = InvokeRetrieve(@rr, @status, @requestId)

Output(Concat("Status: ", @status))
Output(Concat("<br>Request ID: ", @requestId))
]%%
```

**Saída:**
```
Status: OK
Request ID: a1b2c3d4-e5f6-7890-abcd-ef1234567890
```

## Exemplo avançado

Cenário de régua de relacionamento: uma CloudPage da Conecta Telecom precisa listar as Data Extensions disponíveis para um processo de validação de dados de clientes.

```ampscript
%%[
/* Cria o RetrieveRequest para buscar Data Extensions */
SET @rr = CreateObject("RetrieveRequest")
SetObjectProperty(@rr, "ObjectType", "DataExtension")

/* Propriedades que queremos recuperar */
AddObjectArrayItem(@rr, "Properties", "Name")
AddObjectArrayItem(@rr, "Properties", "CustomerKey")
AddObjectArrayItem(@rr, "Properties", "CreatedDate")

/* Filtro: buscar DEs cujo nome contém "Conecta" */
SET @sfp = CreateObject("SimpleFilterPart")
SetObjectProperty(@sfp, "Property", "Name")
SetObjectProperty(@sfp, "SimpleOperator", "like")
AddObjectArrayItem(@sfp, "Value", "Conecta%")

SetObjectProperty(@rr, "Filter", @sfp)

/* Executa o Retrieve */
SET @rows = InvokeRetrieve(@rr, @status, @requestId)

Output(Concat("Status da consulta: ", @status))
Output(Concat("<br>ID da requisicao: ", @requestId))

/* Itera pelos resultados, se houver */
IF RowCount(@rows) > 0 THEN
  FOR @i = 1 TO RowCount(@rows) DO
    SET @row = Row(@rows, @i)
    SET @nomeDe = Field(@row, "Name")
    SET @chave = Field(@row, "CustomerKey")
    Output(Concat("<br>DE: ", @nomeDe, " | Key: ", @chave))
  NEXT @i
ELSE
  Output("<br>Nenhuma Data Extension encontrada.")
ENDIF
]%%
```

**Saída:**
```
Status da consulta: OK
ID da requisicao: f9e8d7c6-b5a4-3210-fedc-ba0987654321
DE: Conecta_Clientes_SP | Key: conecta_clientes_sp
DE: Conecta_Historico_Faturas | Key: conecta_historico_faturas
```

## Observações

> **⚠️ Atenção:** A função `InvokeRetrieve` depende de um API Object do tipo `RetrieveRequest` corretamente montado. Antes de chamá-la, você precisa criar o objeto com [`CreateObject`](../api-functions/createobject.md), definir propriedades com [`SetObjectProperty`](../api-functions/setobjectproperty.md) e adicionar itens ao array com [`AddObjectArrayItem`](../api-functions/addobjectarrayitem.md). Sem essa preparação, a chamada não vai funcionar.

> **💡 Dica:** A mensagem de status e o request ID são muito úteis para debug. Armazene-os em variáveis e exiba durante o desenvolvimento - principalmente em CloudPages - para identificar rapidamente se a consulta foi bem-sucedida ou se houve algum erro na chamada à API.

- A função retorna a mensagem de status da API e o ID da requisição através das variáveis passadas como parâmetro.
- Use filtros (`SimpleFilterPart`) para restringir os resultados e evitar consultas muito amplas que possam impactar a performance.

## Funções relacionadas

- [`CreateObject`](../api-functions/createobject.md) - cria o API Object necessário para o RetrieveRequest
- [`SetObjectProperty`](../api-functions/setobjectproperty.md) - define propriedades no objeto criado
- [`AddObjectArrayItem`](../api-functions/addobjectarrayitem.md) - adiciona itens a arrays do objeto (Properties, Values, etc.)
- [`InvokeCreate`](../api-functions/invokecreate.md) - invoca o método Create em um API Object
- [`InvokeUpdate`](../api-functions/invokeupdate.md) - invoca o método Update em um API Object
- [`InvokeDelete`](../api-functions/invokedelete.md) - invoca o método Delete em um API Object
- [`InvokeExecute`](../api-functions/invokeexecute.md) - invoca o método Execute em um API Object
- [`InvokePerform`](../api-functions/invokeperform.md) - invoca o método Perform em um API Object
- [`Row`](../data-extension-functions/row.md) - recupera uma linha específica de um rowset
- [`RowCount`](../data-extension-functions/rowcount.md) - conta o número de linhas em um rowset
- [`Field`](../data-extension-functions/field.md) - recupera o valor de um campo em uma linha