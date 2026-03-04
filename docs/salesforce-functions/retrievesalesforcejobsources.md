---
title: RetrieveSalesforceJobSources
sidebar_label: RetrieveSalesforceJobSources
description: Retorna um rowset com informações sobre as fontes de dados (sources) utilizadas em um envio do Salesforce, incluindo SourceID, SourceType e IsInclusionSource.
---

# RetrieveSalesforceJobSources

## Descrição

Retorna um rowset contendo informações sobre as fontes de dados usadas em um envio (send) do Salesforce. Para cada fonte, o rowset traz os valores de **SourceID**, **SourceType** e **IsInclusionSource** referentes ao Job ID informado. Essa função é útil quando você precisa auditar ou registrar quais listas, relatórios ou campanhas do Salesforce CRM foram utilizadas como fonte em um determinado envio — algo comum em operações que integram Sales Cloud com Marketing Cloud.

## Sintaxe

```ampscript
RetrieveSalesforceJobSources(jobId)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| jobId | Número | Sim | O Job ID numérico do envio Salesforce sobre o qual você quer recuperar as informações de fontes. |

## Exemplo básico

Recuperando as fontes de um envio do Salesforce para exibir em uma página de auditoria da Conecta Telecom.

```ampscript
%%[
SET @jobId = 123456
SET @fontes = RetrieveSalesforceJobSources(@jobId)

FOR @i = 1 TO RowCount(@fontes) DO
  SET @linha = Row(@fontes, @i)
  SET @sourceId = Field(@linha, "SourceID")
  SET @sourceType = Field(@linha, "SourceType")
  SET @isInclusion = Field(@linha, "IsInclusionSource")

  OutputLine(Concat("Fonte: ", @sourceId, " | Tipo: ", @sourceType, " | Inclusão: ", @isInclusion))
NEXT @i
]%%
```

**Saída:**
```
Fonte: 00Q5e000001AbCdEFG | Tipo: Report | Inclusão: true
Fonte: 00Q5e000002XyZwVUT | Tipo: List | Inclusão: false
```

## Exemplo avançado

Cenário de auditoria para a equipe de CRM do Banco Brasilão: ao acessar uma CloudPage interna, o analista informa o Job ID e visualiza um resumo formatado de todas as fontes utilizadas no envio, diferenciando fontes de inclusão e exclusão.

```ampscript
%%[
SET @jobId = RequestParameter("jobId")

IF NOT Empty(@jobId) THEN
  SET @fontes = RetrieveSalesforceJobSources(@jobId)
  SET @totalFontes = RowCount(@fontes)

  IF @totalFontes > 0 THEN
    OutputLine(Concat("<h2>Auditoria do Job #", @jobId, "</h2>"))
    OutputLine(Concat("<p>Total de fontes encontradas: ", @totalFontes, "</p>"))
    OutputLine("<table border='1' cellpadding='5'>")
    OutputLine("<tr><th>SourceID</th><th>Tipo</th><th>Categoria</th></tr>")

    FOR @i = 1 TO @totalFontes DO
      SET @linha = Row(@fontes, @i)
      SET @sourceId = Field(@linha, "SourceID")
      SET @sourceType = Field(@linha, "SourceType")
      SET @isInclusion = Field(@linha, "IsInclusionSource")

      IF @isInclusion == "true" THEN
        SET @categoria = "Inclusão"
      ELSE
        SET @categoria = "Exclusão"
      ENDIF

      OutputLine(Concat("<tr><td>", @sourceId, "</td><td>", @sourceType, "</td><td>", @categoria, "</td></tr>"))
    NEXT @i

    OutputLine("</table>")
  ELSE
    OutputLine("<p>Nenhuma fonte encontrada para este Job ID.</p>")
  ENDIF
ELSE
  OutputLine("<p>Informe um Job ID válido na URL. Ex: ?jobId=123456</p>")
ENDIF
]%%
```

**Saída:**
```
Auditoria do Job #123456
Total de fontes encontradas: 2

| SourceID               | Tipo   | Categoria |
|------------------------|--------|-----------|
| 00Q5e000001AbCdEFG     | Report | Inclusão  |
| 00Q5e000002XyZwVUT     | List   | Exclusão  |
```

## Observações

> **⚠️ Atenção:** A função **não** retorna informações sobre o status do job em si. Ela retorna dados mesmo que o job tenha sido cancelado. Por isso, **não use** `RetrieveSalesforceJobSources` para verificar se um envio foi concluído com sucesso. Para esse tipo de validação, você precisa de outros mecanismos.

- O rowset retornado contém três campos por linha: **SourceID**, **SourceType** e **IsInclusionSource**.
- Use [RowCount](../data-extension-functions/rowcount.md) para verificar se o rowset tem registros antes de iterar, evitando erros em jobs sem fontes.
- Use [Row](../data-extension-functions/row.md) e [Field](../data-extension-functions/field.md) para acessar os valores de cada linha do rowset retornado.

## Funções relacionadas

- [RetrieveSalesforceObjects](../salesforce-functions/retrievesalesforceobjects.md) — recupera registros de objetos do Salesforce CRM
- [CreateSalesforceObject](../salesforce-functions/createsalesforceobject.md) — cria registros em objetos do Salesforce CRM
- [UpdateSingleSalesforceObject](../salesforce-functions/updatesinglesalesforceobject.md) — atualiza um registro no Salesforce CRM
- [LongSfid](../salesforce-functions/longsfid.md) — converte Salesforce IDs de 15 para 18 caracteres
- [RowCount](../data-extension-functions/rowcount.md) — conta registros em um rowset
- [Row](../data-extension-functions/row.md) — acessa uma linha específica de um rowset
- [Field](../data-extension-functions/field.md) — extrai o valor de um campo de uma linha do rowset