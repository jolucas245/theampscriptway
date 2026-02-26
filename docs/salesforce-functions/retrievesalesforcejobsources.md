---
title: RetrieveSalesforceJobSources
sidebar_label: RetrieveSalesforceJobSources
description: Retorna um rowset com informações sobre as fontes (sources) de um envio do Salesforce, incluindo SourceID, SourceType e IsInclusionSource.
---

<!-- generated-by-script -->

# RetrieveSalesforceJobSources

## Descrição

A função `RetrieveSalesforceJobSources` retorna um rowset contendo informações sobre as fontes de dados utilizadas em um envio (send) do Salesforce. Para cada fonte, o rowset traz os valores de **SourceID**, **SourceType** e **IsInclusionSource** associados ao Job ID informado. Essa função é útil quando você precisa auditar ou exibir quais listas, grupos ou Data Extensions foram usados como origem de um envio específico feito via Salesforce (Sales/Service Cloud). Importante: ela **não** retorna informações sobre o status do job em si — inclusive retorna dados mesmo se o job foi cancelado, então não use essa função para verificar se um envio foi concluído com sucesso.

## Sintaxe

```ampscript
RetrieveSalesforceJobSources(jobId)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|--------|-------------|-----------|
| jobId | Número | Sim | O ID numérico do job de envio do Salesforce sobre o qual você quer recuperar informações das fontes. |

## Retorno

A função retorna um **rowset** (conjunto de linhas) onde cada linha contém os seguintes campos:

| Campo | Descrição |
|-------|-----------|
| SourceID | O identificador da fonte de dados usada no envio. |
| SourceType | O tipo da fonte (por exemplo, lista, grupo, Data Extension, etc.). |
| IsInclusionSource | Indica se a fonte é de inclusão (`True`) ou de exclusão (`False`) no envio. |

## Exemplo básico

Imagine que a equipe de marketing da **Conecta Telecom** disparou uma campanha de reativação de clientes inativos pelo Salesforce e você quer saber quais fontes de dados foram usadas nesse envio (Job ID: 84521).

```ampscript
%%[
VAR @jobSources, @sourceCount, @counter, @row, @sourceID, @sourceType, @isInclusion

SET @jobSources = RetrieveSalesforceJobSources(84521)
SET @sourceCount = RowCount(@jobSources)

IF @sourceCount > 0 THEN
  FOR @counter = 1 TO @sourceCount DO
    SET @row = Row(@jobSources, @counter)
    SET @sourceID = Field(@row, "SourceID")
    SET @sourceType = Field(@row, "SourceType")
    SET @isInclusion = Field(@row, "IsInclusionSource")
]%%

SourceID: %%=v(@sourceID)=%%
SourceType: %%=v(@sourceType)=%%
IsInclusionSource: %%=v(@isInclusion)=%%
---

%%[ NEXT @counter ]%%
%%[ ELSE ]%%

Nenhuma fonte encontrada para este job.

%%[ ENDIF ]%%
```

**Saída:**
```
SourceID: 12345
SourceType: List
IsInclusionSource: True
---
SourceID: 67890
SourceType: List
IsInclusionSource: False
---
```

## Exemplo avançado

Agora vamos a um cenário mais completo. A **Lojas Vitória** usa uma CloudPage interna para a equipe de CRM consultar detalhes de envios realizados via Salesforce. O usuário informa o Job ID via query string e a página exibe as fontes de dados com formatação amigável, incluindo se a fonte foi usada para inclusão ou exclusão de destinatários.

```ampscript
%%[
VAR @jobId, @jobSources, @sourceCount, @counter
VAR @row, @sourceID, @sourceType, @isInclusion, @tipoLabel

SET @jobId = RequestParameter("jobId")

IF Empty(@jobId) THEN
  RaiseError("Erro: Informe o parâmetro jobId na URL.", true)
ENDIF

SET @jobSources = RetrieveSalesforceJobSources(@jobId)
SET @sourceCount = RowCount(@jobSources)
]%%

<h2>Fontes do Envio - Job ID: %%=v(@jobId)=%%</h2>
<p>Total de fontes encontradas: %%=v(@sourceCount)=%%</p>

%%[ IF @sourceCount > 0 THEN ]%%
<table border="1" cellpadding="8" cellspacing="0">
  <tr>
    <th>Fonte (SourceID)</th>
    <th>Tipo</th>
    <th>Inclusão ou Exclusão</th>
  </tr>
%%[
  FOR @counter = 1 TO @sourceCount DO
    SET @row = Row(@jobSources, @counter)
    SET @sourceID = Field(@row, "SourceID")
    SET @sourceType = Field(@row, "SourceType")
    SET @isInclusion = Field(@row, "IsInclusionSource")

    IF @isInclusion == "True" THEN
      SET @tipoLabel = "✅ Inclusão"
    ELSE
      SET @tipoLabel = "❌ Exclusão"
    ENDIF
]%%
  <tr>
    <td>%%=v(@sourceID)=%%</td>
    <td>%%=v(@sourceType)=%%</td>
    <td>%%=v(@tipoLabel)=%%</td>
  </tr>
%%[ NEXT @counter ]%%
</table>

%%[ ELSE ]%%
<p>Nenhuma fonte encontrada para o Job ID informado. Verifique se o ID está correto.</p>
%%[ ENDIF ]%%
```

**Saída (renderizada na CloudPage com jobId=84521):**
```
Fontes do Envio - Job ID: 84521
Total de fontes encontradas: 3

| Fonte (SourceID) | Tipo             | Inclusão ou Exclusão |
|-------------------|------------------|----------------------|
| 12345             | List             | ✅ Inclusão          |
| 23456             | DataExtension    | ✅ Inclusão          |
| 67890             | List             | ❌ Exclusão          |
```

## Observações

- Essa função **só funciona com envios feitos via Salesforce** (Sales Cloud ou Service Cloud integrados ao Marketing Cloud). Se você passar um Job ID de um envio feito diretamente pelo Marketing Cloud (sem integração Salesforce), o comportamento pode não ser o esperado.
- A função **não retorna o status do job**. Ela retorna dados inclusive para jobs cancelados. **Não use** `RetrieveSalesforceJobSources` para verificar se um envio foi concluído com sucesso.
- O parâmetro `jobId` deve ser um valor **numérico**. Se você estiver recebendo o valor como string (por exemplo, via `RequestParameter`), a conversão geralmente é feita de forma implícita pelo AMPscript.
- O rowset retornado pode conter **múltiplas linhas** — uma para cada fonte de dados associada ao envio. Use [RowCount](../data-extension-functions/rowcount.md) para saber quantas linhas existem e itere com um loop `FOR`.
- Use [Row](../data-extension-functions/row.md) e [Field](../data-extension-functions/field.md) para acessar os valores de cada linha do rowset retornado.
- Se o Job ID não existir ou não tiver fontes associadas, o rowset retornado terá zero linhas. Sempre valide com `RowCount` antes de iterar.
- Essa é uma função de nicho, usada principalmente em cenários de **auditoria, relatórios internos ou diagnóstico de envios** feitos pela integração Salesforce ↔ Marketing Cloud.

## Funções relacionadas

- [RetrieveSalesforceObjects](../salesforce-functions/retrievesalesforceobjects.md) — recupera registros de objetos do Salesforce CRM
- [CreateSalesforceObject](../salesforce-functions/createsalesforceobject.md) — cria um registro em um objeto do Salesforce CRM
- [UpdateSingleSalesforceObject](../salesforce-functions/updatesinglesalesforceobject.md) — atualiza um registro em um objeto do Salesforce CRM
- [LongSfid](../salesforce-functions/longsfid.md) — converte um Salesforce ID de 15 caracteres para o formato de 18 caracteres
- [Row](../data-extension-functions/row.md) — acessa uma linha específica de um rowset por índice
- [RowCount](../data-extension-functions/rowcount.md) — retorna a quantidade de linhas em um rowset
- [Field](../data-extension-functions/field.md) — recupera o valor de um campo específico de uma linha do rowset
- [RequestParameter](../sites-functions/requestparameter.md) — captura parâmetros de query string em CloudPages
- [RaiseError](../utility-functions/raiseerror.md) — gera um erro personalizado e interrompe a execução