---
title: InvokeRetrieve
sidebar_label: InvokeRetrieve
description: Invoca o método Retrieve em um objeto da API do Marketing Cloud e retorna a mensagem de status e o ID da requisição.
---

<!-- generated-by-script -->

# InvokeRetrieve

## Descrição

A função `InvokeRetrieve()` invoca o método **Retrieve** em um objeto da API do Marketing Cloud Engagement e retorna a mensagem de status da API junto com o ID da requisição. Você usa essa função quando precisa consultar dados de objetos internos da plataforma (como Subscribers, Data Extensions, Triggered Sends, etc.) diretamente via AMPscript, sem precisar fazer chamadas SOAP externas. É uma função avançada que trabalha em conjunto com outras funções da API como `CreateObject()`, `SetObjectProperty()` e `AddObjectArrayItem()` para montar e executar a requisição.

## Sintaxe

```ampscript
InvokeRetrieve(@retrieveRequest, @statusMessage, @requestId)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|----------------|-----------|---------------|----------------|
| apiObject | API Object | Sim | O objeto da API (geralmente um `RetrieveRequest`) no qual o método Retrieve será invocado. |
| statusMessage | Variável AMPscript | Sim | Uma variável AMPscript que armazenará a mensagem de status retornada pela API. |
| requestId | Variável AMPscript | Sim | Uma variável AMPscript que armazenará o ID da requisição retornado pela API. |

## Exemplo básico

Neste exemplo, vamos buscar um subscriber pelo endereço de e-mail usando `InvokeRetrieve()`. Primeiro criamos o objeto `RetrieveRequest`, definimos suas propriedades, configuramos um filtro simples e então executamos a consulta.

```ampscript
%%[
/* Cria o objeto RetrieveRequest */
SET @retrieveRequest = CreateObject("RetrieveRequest")

/* Define o tipo de objeto que queremos consultar */
SetObjectProperty(@retrieveRequest, "ObjectType", "Subscriber")

/* Define quais propriedades queremos retornar */
AddObjectArrayItem(@retrieveRequest, "Properties", "EmailAddress")
AddObjectArrayItem(@retrieveRequest, "Properties", "SubscriberKey")
AddObjectArrayItem(@retrieveRequest, "Properties", "Status")

/* Cria o filtro para buscar pelo e-mail */
SET @filterPart = CreateObject("SimpleFilterPart")
SetObjectProperty(@filterPart, "Property", "EmailAddress")
SetObjectProperty(@filterPart, "SimpleOperator", "equals")
AddObjectArrayItem(@filterPart, "Value", "joao.silva@email.com.br")

/* Aplica o filtro ao RetrieveRequest */
SetObjectProperty(@retrieveRequest, "Filter", @filterPart)

/* Executa o Retrieve */
SET @subscribers = InvokeRetrieve(@retrieveRequest, @statusMessage, @requestId)
]%%

Status da requisição: %%=v(@statusMessage)=%%
ID da requisição: %%=v(@requestId)=%%
```

**Saída:**
```
Status da requisição: OK
ID da requisição: a1b2c3d4-e5f6-7890-abcd-ef1234567890
```

## Exemplo avançado

Imagine que a **Conecta Telecom** quer criar uma CloudPage administrativa que lista os Triggered Send Definitions ativos na conta, para que a equipe de marketing consiga verificar quais comunicações automáticas estão rodando — como SMS de boas-vindas, e-mail de confirmação de plano, ou lembrete de fatura.

```ampscript
%%[
/* =============================================
   Conecta Telecom - Painel de Triggered Sends
   ============================================= */

/* Cria o RetrieveRequest para buscar TriggeredSendDefinition */
SET @rr = CreateObject("RetrieveRequest")
SetObjectProperty(@rr, "ObjectType", "TriggeredSendDefinition")

/* Propriedades que queremos retornar */
AddObjectArrayItem(@rr, "Properties", "Name")
AddObjectArrayItem(@rr, "Properties", "CustomerKey")
AddObjectArrayItem(@rr, "Properties", "TriggeredSendStatus")
AddObjectArrayItem(@rr, "Properties", "CreatedDate")

/* Filtra apenas os que estão ativos */
SET @filtro = CreateObject("SimpleFilterPart")
SetObjectProperty(@filtro, "Property", "TriggeredSendStatus")
SetObjectProperty(@filtro, "SimpleOperator", "equals")
AddObjectArrayItem(@filtro, "Value", "Active")

SetObjectProperty(@rr, "Filter", @filtro)

/* Executa a consulta */
SET @resultados = InvokeRetrieve(@rr, @statusMsg, @reqId)
SET @totalRegistros = RowCount(@resultados)
]%%

<h2>Conecta Telecom - Triggered Sends Ativos</h2>
<p>Status: %%=v(@statusMsg)=%% | Request ID: %%=v(@reqId)=%%</p>
<p>Total encontrado: %%=v(@totalRegistros)=%%</p>

%%[
IF @totalRegistros > 0 THEN
]%%
<table border="1" cellpadding="5">
  <tr>
    <th>Nome</th>
    <th>Customer Key</th>
    <th>Status</th>
    <th>Data de Criação</th>
  </tr>
%%[
  FOR @i = 1 TO @totalRegistros DO
    SET @linha = Row(@resultados, @i)
    SET @nome = Field(@linha, "Name")
    SET @chave = Field(@linha, "CustomerKey")
    SET @status = Field(@linha, "TriggeredSendStatus")
    SET @dataCriacao = Field(@linha, "CreatedDate")
    SET @dataFormatada = FormatDate(@dataCriacao, "dd/MM/yyyy", "HH:mm")
]%%
  <tr>
    <td>%%=v(@nome)=%%</td>
    <td>%%=v(@chave)=%%</td>
    <td>%%=v(@status)=%%</td>
    <td>%%=v(@dataFormatada)=%%</td>
  </tr>
%%[
  NEXT @i
]%%
</table>
%%[
ELSE
]%%
<p>Nenhum Triggered Send ativo encontrado.</p>
%%[
ENDIF
]%%
```

**Saída:**
```
Conecta Telecom - Triggered Sends Ativos
Status: OK | Request ID: f8e7d6c5-b4a3-2109-8765-432109abcdef
Total encontrado: 3

| Nome                              | Customer Key          | Status | Data de Criação  |
|-----------------------------------|-----------------------|--------|------------------|
| Boas-vindas Novo Assinante        | boas_vindas_ts        | Active | 15/03/2024 09:30 |
| Confirmação Troca de Plano        | confirmacao_plano_ts  | Active | 22/06/2024 14:15 |
| Lembrete Fatura Vencendo          | lembrete_fatura_ts    | Active | 01/09/2024 08:00 |
```

## Observações

- **Função avançada:** `InvokeRetrieve()` faz parte do conjunto de funções SOAP API do AMPscript. É uma função de nível avançado que exige conhecimento dos objetos da API do Marketing Cloud (como `Subscriber`, `TriggeredSendDefinition`, `DataExtension`, `Email`, etc.).
- **Sempre usada em conjunto:** Você precisa usar [CreateObject](../api-functions/createobject.md), [SetObjectProperty](../api-functions/setobjectproperty.md) e [AddObjectArrayItem](../api-functions/addobjectarrayitem.md) para montar o `RetrieveRequest` antes de chamar `InvokeRetrieve()`.
- **Filtros:** Para adicionar condições de busca, crie um objeto `SimpleFilterPart` (ou `ComplexFilterPart` para filtros compostos) e atribua-o à propriedade `Filter` do `RetrieveRequest`.
- **Retorno:** A função retorna um rowset com os resultados. Use [RowCount](../data-extension-functions/rowcount.md) para contar os registros e [Row](../data-extension-functions/row.md) + [Field](../data-extension-functions/field.md) para iterar e extrair os valores.
- **Mensagem de status:** O parâmetro `statusMessage` recebe valores como `"OK"` em caso de sucesso ou mensagens de erro descritivas em caso de falha. Sempre verifique esse valor para tratamento de erros.
- **Request ID:** O `requestId` é útil para debugging e para abrir chamados com o suporte da Salesforce caso algo dê errado.
- **Contexto de uso:** Essa função funciona em emails, CloudPages e Landing Pages. Em CloudPages é especialmente útil para criar painéis administrativos e ferramentas internas.
- **Performance:** Consultas via `InvokeRetrieve()` podem ser mais lentas que funções como [Lookup](../data-extension-functions/lookup.md) ou [LookupRows](../data-extension-functions/lookuprows.md) para Data Extensions. Use-a quando precisar consultar objetos internos da plataforma que não estão acessíveis pelas funções de Data Extension.
- **Permissões:** Dependendo da configuração da sua Business Unit, algumas consultas podem ser restritas. Certifique-se de que a conta tem as permissões necessárias para acessar os objetos desejados.

## Funções relacionadas

- [CreateObject](../api-functions/createobject.md) — cria um objeto da API para uso com as funções SOAP
- [SetObjectProperty](../api-functions/setobjectproperty.md) — define uma propriedade em um objeto da API
- [AddObjectArrayItem](../api-functions/addobjectarrayitem.md) — adiciona um item a uma propriedade do tipo array em um objeto da API
- [InvokeCreate](../api-functions/invokecreate.md) — invoca o método Create em um objeto da API
- [InvokeUpdate](../api-functions/invokeupdate.md) — invoca o método Update em um objeto da API
- [InvokeDelete](../api-functions/invokedelete.md) — invoca o método Delete em um objeto da API
- [InvokeExecute](../api-functions/invokeexecute.md) — invoca o método Execute em um objeto da API
- [InvokePerform](../api-functions/invokeperform.md) — invoca o método Perform em um objeto da API
- [Row](../data-extension-functions/row.md) — extrai uma linha específica de um rowset retornado
- [RowCount](../data-extension-functions/rowcount.md) — conta o número de linhas em um rowset
- [Field](../data-extension-functions/field.md) — extrai o valor de um campo específico de uma linha