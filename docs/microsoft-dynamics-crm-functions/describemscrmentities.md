---
title: DescribeMscrmEntities
sidebar_label: DescribeMscrmEntities
description: Retorna os nomes lógicos e de exibição de todas as entidades de uma conta do Microsoft Dynamics CRM.
---

<!-- generated-by-script -->

# DescribeMscrmEntities

## Descrição

A função `DescribeMscrmEntities` retorna um rowset (conjunto de linhas) contendo os nomes lógicos e os nomes de exibição de **todas** as entidades disponíveis em uma conta do Microsoft Dynamics CRM conectada ao Marketing Cloud. Ela é útil quando você precisa explorar ou listar as entidades do CRM dinamicamente — por exemplo, para criar uma página de diagnóstico ou para documentar quais entidades estão disponíveis na integração. Cada linha retornada possui dois campos: `Name` (nome lógico da entidade) e `DisplayName` (nome de exibição amigável).

## Sintaxe

```ampscript
DescribeMscrmEntities()
```

## Parâmetros

Essa função **não possui parâmetros**. Basta chamá-la para obter o rowset completo com todas as entidades do Dynamics CRM.

## Exemplo básico

Esse exemplo lista todas as entidades do Dynamics CRM conectado, mostrando o nome lógico e o nome de exibição de cada uma.

```ampscript
%%[

VAR @entities_rs, @entity_name, @entity_displayname, @counter

SET @entities_rs = DescribeMscrmEntities()

]%%

<h2>Lista de Entidades do CRM</h2>

%%[

FOR @counter = 1 TO RowCount(@entities_rs) DO

  SET @entity_name = Field(Row(@entities_rs, @counter), 'Name')
  SET @entity_displayname = Field(Row(@entities_rs, @counter), 'DisplayName')

]%%

<p>Nome da Entidade: %%=v(@entity_name)=%% | Nome de Exibição: %%=v(@entity_displayname)=%%</p>

%%[

NEXT @counter

]%%
```

**Saída:**
```
Lista de Entidades do CRM

Nome da Entidade: account | Nome de Exibição: Conta
Nome da Entidade: contact | Nome de Exibição: Contato
Nome da Entidade: lead | Nome de Exibição: Lead
Nome da Entidade: opportunity | Nome de Exibição: Oportunidade
Nome da Entidade: campaign | Nome de Exibição: Campanha
...
```

## Exemplo avançado

Imagine que a **Conecta Telecom** tem uma integração entre o Marketing Cloud e o Dynamics CRM. A equipe de TI quer criar uma CloudPage interna que liste todas as entidades do CRM e destaque quantas existem no total, para fins de auditoria e documentação da integração.

```ampscript
%%[

VAR @entities_rs, @entity_name, @entity_displayname, @counter, @totalEntidades

SET @entities_rs = DescribeMscrmEntities()
SET @totalEntidades = RowCount(@entities_rs)

]%%

<h1>Conecta Telecom — Auditoria de Entidades do Dynamics CRM</h1>
<p>Data da consulta: %%=FormatDate(Now(), "dd/MM/yyyy", "HH:mm")=%%</p>
<p>Total de entidades encontradas: <strong>%%=v(@totalEntidades)=%%</strong></p>

<table border="1" cellpadding="5" cellspacing="0">
  <tr>
    <th>#</th>
    <th>Nome Lógico (Name)</th>
    <th>Nome de Exibição (DisplayName)</th>
  </tr>

%%[

FOR @counter = 1 TO @totalEntidades DO

  SET @entity_name = Field(Row(@entities_rs, @counter), 'Name')
  SET @entity_displayname = Field(Row(@entities_rs, @counter), 'DisplayName')

]%%

  <tr>
    <td>%%=v(@counter)=%%</td>
    <td>%%=v(@entity_name)=%%</td>
    <td>%%=v(@entity_displayname)=%%</td>
  </tr>

%%[

NEXT @counter

]%%

</table>

<p style="margin-top:20px; color:#666;">
  Relatório gerado automaticamente via AMPscript — Conecta Telecom<br>
  Dúvidas? Entre em contato com a equipe de CRM: crm@conectatelecom.com.br
</p>
```

**Saída:**
```
Conecta Telecom — Auditoria de Entidades do Dynamics CRM

Data da consulta: 18/07/2025, 14:30
Total de entidades encontradas: 245

#   | Nome Lógico (Name)  | Nome de Exibição (DisplayName)
1   | account              | Conta
2   | contact              | Contato
3   | lead                 | Lead
4   | opportunity          | Oportunidade
5   | campaign             | Campanha
... | ...                  | ...
245 | customentity_plano   | Plano de Serviço
```

## Observações

- Essa função **não recebe nenhum parâmetro**. Qualquer argumento passado será ignorado ou causará erro.
- Requer uma **integração ativa entre o Salesforce Marketing Cloud e o Microsoft Dynamics CRM**. Sem essa conexão configurada, a função não vai funcionar.
- O rowset retornado contém dois campos por linha: `Name` (nome lógico/interno da entidade) e `DisplayName` (nome amigável de exibição).
- Use [RowCount](../data-extension-functions/rowcount.md), [Row](../data-extension-functions/row.md) e [Field](../data-extension-functions/field.md) para iterar e extrair os valores do rowset retornado.
- Essa função é específica para o **Microsoft Dynamics CRM**. Se você usa o Salesforce CRM (Sales Cloud), consulte as [funções Salesforce](../salesforce-functions/retrievesalesforceobjects.md) em vez destas.
- Por retornar **todas** as entidades da conta, o volume de dados pode ser grande. Evite usar essa função dentro de emails enviados em massa — ela é mais adequada para **CloudPages** ou páginas de diagnóstico/administração.
- Esta é uma função de nicho, usada apenas em contextos de integração com o Microsoft Dynamics CRM. Se sua organização não utiliza o Dynamics CRM, essa função não terá utilidade.

## Funções relacionadas

- [DescribeMscrmEntityAttributes](../microsoft-dynamics-crm-functions/describemscrmentityattributes.md) — retorna os atributos (campos) de uma entidade específica do Dynamics CRM
- [RetrieveMscrmRecords](../microsoft-dynamics-crm-functions/retrievemscrmrecords.md) — recupera registros de uma entidade do Dynamics CRM
- [RetrieveMscrmRecordsFetchXml](../microsoft-dynamics-crm-functions/retrievemscrmrecordsfetchxml.md) — recupera registros usando FetchXML do Dynamics CRM
- [CreateMscrmRecord](../microsoft-dynamics-crm-functions/createmscrmrecord.md) — cria um novo registro em uma entidade do Dynamics CRM
- [UpdateMscrmRecords](../microsoft-dynamics-crm-functions/updatemscrmrecords.md) — atualiza registros existentes no Dynamics CRM
- [UpsertMscrmRecord](../microsoft-dynamics-crm-functions/upsertmscrmrecord.md) — insere ou atualiza um registro no Dynamics CRM
- [RowCount](../data-extension-functions/rowcount.md) — conta o número de linhas em um rowset
- [Row](../data-extension-functions/row.md) — acessa uma linha específica de um rowset
- [Field](../data-extension-functions/field.md) — extrai o valor de um campo de uma linha do rowset