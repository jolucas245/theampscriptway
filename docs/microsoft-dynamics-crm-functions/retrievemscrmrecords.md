---
title: RetrieveMscrmRecords
sidebar_label: RetrieveMscrmRecords
description: Recupera registros de entidades do Microsoft Dynamics CRM aplicando filtros por campo, operador e valor.
---

# RetrieveMscrmRecords

## Descrição

A função `RetrieveMscrmRecords` recupera dados de entidades do Microsoft Dynamics CRM diretamente via AMPscript. Você define a entidade, os campos que quer trazer e um filtro simples (campo, operador e valor) para buscar os registros desejados. É útil quando sua operação no Brasil integra o SFMC com o Dynamics CRM — por exemplo, para puxar dados de contatos ou oportunidades e personalizar e-mails de régua de relacionamento.

## Sintaxe

```ampscript
RetrieveMscrmRecords(entityName, fieldsToRetrieve, queryFieldName, queryFieldOperator, queryFieldValue)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| entityName | string | Sim | Nome da entidade do Microsoft Dynamics CRM da qual você quer recuperar registros (ex: `contact`, `account`, `lead`). |
| fieldsToRetrieve | string | Sim | Lista de campos a serem retornados, separados por vírgula. |
| queryFieldName | string | Sim | Nome do campo usado como filtro na consulta. |
| queryFieldOperator | string | Sim | Operador usado no filtro da consulta. |
| queryFieldValue | string | Sim | Valor a ser comparado no filtro. |

## Exemplo básico

Recuperando o ID, primeiro nome e sobrenome de contatos no Dynamics CRM cujo sobrenome é "Santos".

```ampscript
%%[
SET @registros = RetrieveMscrmRecords(
  "contact",
  "contactid,firstname,lastname",
  "lastname",
  "=",
  "Santos"
)

SET @totalRegistros = RowCount(@registros)

IF @totalRegistros > 0 THEN
  SET @linha = Row(@registros, 1)
  SET @contactId = Field(@linha, "contactid")
  SET @primeiroNome = Field(@linha, "firstname")
  SET @sobrenome = Field(@linha, "lastname")
]%%

Contato encontrado: %%=v(@primeiroNome)=%% %%=v(@sobrenome)=%%
ID: %%=v(@contactId)=%%

%%[ ELSE ]%%

Nenhum contato encontrado com sobrenome Santos.

%%[ ENDIF ]%%
```

**Saída:**
```
Contato encontrado: Maria Santos
ID: 3a8b2c4d-1234-5678-9abc-def012345678
```

## Exemplo avançado

Cenário de régua de relacionamento: você precisa buscar todos os contatos de uma cidade específica no Dynamics CRM para personalizar um e-mail de campanha regional da Lojas Vitória.

```ampscript
%%[
SET @contatos = RetrieveMscrmRecords(
  "contact",
  "contactid,firstname,lastname,emailaddress1,address1_city",
  "address1_city",
  "=",
  "São Paulo"
)

SET @total = RowCount(@contatos)

IF @total > 0 THEN
  FOR @i = 1 TO @total DO
    SET @linha = Row(@contatos, @i)
    SET @nome = Field(@linha, "firstname")
    SET @sobrenome = Field(@linha, "lastname")
    SET @email = Field(@linha, "emailaddress1")
    SET @cidade = Field(@linha, "address1_city")
]%%

<tr>
  <td>%%=v(@nome)=%% %%=v(@sobrenome)=%%</td>
  <td>%%=v(@email)=%%</td>
  <td>%%=v(@cidade)=%%</td>
</tr>

%%[
  NEXT @i
ELSE
]%%

<p>Nenhum contato encontrado em São Paulo.</p>

%%[ ENDIF ]%%
```

**Saída:**
```
Maria Santos    maria.santos@email.com.br    São Paulo
João Silva      joao.silva@email.com.br      São Paulo
Ana Lima        ana.lima@email.com.br         São Paulo
```

## Observações

- O resultado retornado é um rowset. Para iterar sobre os registros, use [RowCount](../data-extension-functions/rowcount.md), [Row](../data-extension-functions/row.md) e [Field](../data-extension-functions/field.md) — exatamente como faria com resultados de [LookupRows](../data-extension-functions/lookuprows.md).

> **⚠️ Atenção:** Essa função depende da integração entre o Marketing Cloud e o Microsoft Dynamics CRM estar configurada corretamente na sua conta. Sem o conector ativo, a chamada vai falhar.

> **💡 Dica:** Use nomes de entidade e campos exatamente como estão definidos no schema do seu Dynamics CRM. Nomes com capitalização ou grafia incorreta podem resultar em erro na consulta.

## Funções relacionadas

- [RetrieveMscrmRecordsFetchXml](../microsoft-dynamics-crm-functions/retrievemscrmrecordsfetchxml.md) — para consultas mais complexas usando FetchXML
- [CreateMscrmRecord](../microsoft-dynamics-crm-functions/createmscrmrecord.md) — para criar registros no Dynamics CRM
- [UpdateMscrmRecords](../microsoft-dynamics-crm-functions/updatemscrmrecords.md) — para atualizar registros existentes
- [UpsertMscrmRecord](../microsoft-dynamics-crm-functions/upsertmscrmrecord.md) — para inserir ou atualizar registros
- [DescribeMscrmEntities](../microsoft-dynamics-crm-functions/describemscrmentities.md) — para listar as entidades disponíveis
- [DescribeMscrmEntityAttributes](../microsoft-dynamics-crm-functions/describemscrmentityattributes.md) — para descobrir os campos de uma entidade
- [RowCount](../data-extension-functions/rowcount.md) — para contar registros no rowset retornado
- [Row](../data-extension-functions/row.md) — para acessar uma linha específica do rowset
- [Field](../data-extension-functions/field.md) — para extrair o valor de um campo de uma linha