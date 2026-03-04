---
title: DescribeMscrmEntityAttributes
sidebar_label: DescribeMscrmEntityAttributes
description: Recupera informações sobre os atributos de uma entidade do Microsoft Dynamics CRM, incluindo nome lógico, nome de exibição e tipo de cada atributo.
---

# DescribeMscrmEntityAttributes

## Descrição

Recupera informações detalhadas sobre os atributos de uma entidade do Microsoft Dynamics CRM. Para cada atributo, a função retorna o nome lógico, o nome de exibição e o tipo. Se o atributo contiver um valor do tipo Boolean, status, picklist ou state, a função retorna também uma lista separada por vírgulas com as opções e seus valores de exibição.

É especialmente útil quando você precisa entender a estrutura de uma entidade do Dynamics CRM antes de montar integrações — por exemplo, para saber quais campos existem na entidade Lead ou Contact antes de usar funções como [RetrieveMscrmRecords](../microsoft-dynamics-crm-functions/retrievemscrmrecords.md) ou [CreateMscrmRecord](../microsoft-dynamics-crm-functions/createmscrmrecord.md).

## Sintaxe

```ampscript
DescribeMscrmEntityAttributes(entityName)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| entityName | String | Sim | Nome da entidade do Microsoft Dynamics CRM da qual você quer recuperar os atributos. |

## Exemplo básico

Neste exemplo, recuperamos os atributos da entidade **Lead** do Dynamics CRM e exibimos uma tabela com as informações de cada campo — cenário comum quando o Banco Brasilão precisa mapear os campos de leads vindos do CRM para disparos de e-mail.

```ampscript
%%[
VAR @rows, @row, @rowCount, @i
VAR @fieldName, @displayName, @fieldType, @isRequired, @fieldOptions

SET @rows = DescribeMscrmEntityAttributes("Lead")
SET @rowCount = RowCount(@rows)
]%%

<table border="1" cellpadding="5" cellspacing="0">
  <tr>
    <th>Nome do Campo</th>
    <th>Nome de Exibição</th>
    <th>Tipo</th>
    <th>Obrigatório</th>
    <th>Opções</th>
  </tr>
%%[
FOR @i = 1 TO @rowCount DO
  SET @row = Row(@rows, @i)
  SET @fieldName = Field(@row, "Name")
  SET @displayName = Field(@row, "DisplayName")
  SET @fieldType = Field(@row, "Type")
  SET @isRequired = Field(@row, "IsRequired")
  SET @fieldOptions = Field(@row, "Options")
]%%
  <tr>
    <td>%%=V(@fieldName)=%%</td>
    <td>%%=V(@displayName)=%%</td>
    <td>%%=V(@fieldType)=%%</td>
    <td>%%=V(@isRequired)=%%</td>
    <td>%%=V(@fieldOptions)=%%</td>
  </tr>
%%[
NEXT @i
]%%
</table>
```

**Saída:**
```
+------------------+-------------------+----------+-------------+-----------------------------+
| Nome do Campo    | Nome de Exibição  | Tipo     | Obrigatório | Opções                      |
+------------------+-------------------+----------+-------------+-----------------------------+
| firstname        | Primeiro Nome     | String   | false       |                             |
| lastname         | Sobrenome         | String   | true        |                             |
| leadsourcecode   | Origem do Lead    | Picklist | false       | 1,Web; 2,Telefone; 3,Email  |
| statecode        | Status            | State    | true        | 0,Ativo; 1,Qualificado      |
+------------------+-------------------+----------+-------------+-----------------------------+
```

## Exemplo avançado

A Conecta Telecom quer gerar uma página de diagnóstico em CloudPage que lista todos os campos da entidade **Contact** do Dynamics CRM, filtrando apenas os campos obrigatórios. Isso ajuda o time de CRM a validar se os dados enviados pela régua de relacionamento estão completos.

```ampscript
%%[
VAR @atributos, @total, @i
VAR @row, @nome, @exibicao, @tipo, @obrigatorio, @opcoes
VAR @contadorObrigatorios

SET @atributos = DescribeMscrmEntityAttributes("Contact")
SET @total = RowCount(@atributos)
SET @contadorObrigatorios = 0
]%%

<h2>Campos obrigatórios da entidade Contact - Conecta Telecom</h2>

<table border="1" cellpadding="5" cellspacing="0">
  <tr>
    <th>#</th>
    <th>Campo</th>
    <th>Exibição</th>
    <th>Tipo</th>
    <th>Opções Disponíveis</th>
  </tr>
%%[
FOR @i = 1 TO @total DO
  SET @row = Row(@atributos, @i)
  SET @nome = Field(@row, "Name")
  SET @exibicao = Field(@row, "DisplayName")
  SET @tipo = Field(@row, "Type")
  SET @obrigatorio = Field(@row, "IsRequired")
  SET @opcoes = Field(@row, "Options")

  IF @obrigatorio == "true" THEN
    SET @contadorObrigatorios = Add(@contadorObrigatorios, 1)
]%%
  <tr>
    <td>%%=V(@contadorObrigatorios)=%%</td>
    <td>%%=V(@nome)=%%</td>
    <td>%%=V(@exibicao)=%%</td>
    <td>%%=V(@tipo)=%%</td>
    <td>%%=V(IIF(Empty(@opcoes), "—", @opcoes))=%%</td>
  </tr>
%%[
  ENDIF
NEXT @i
]%%
</table>

<p><strong>Total de campos obrigatórios:</strong> %%=V(@contadorObrigatorios)=%%</p>
<p><strong>Total geral de atributos:</strong> %%=V(@total)=%%</p>
```

**Saída:**
```
Campos obrigatórios da entidade Contact - Conecta Telecom

+---+---------------+-------------------+---------+------------------------------+
| # | Campo         | Exibição          | Tipo    | Opções Disponíveis           |
+---+---------------+-------------------+---------+------------------------------+
| 1 | lastname      | Sobrenome         | String  | —                            |
| 2 | statecode     | Status            | State   | 0,Ativo; 1,Inativo           |
| 3 | statuscode    | Razão do Status   | Status  | 1,Ativo; 2,Inativo           |
+---+---------------+-------------------+---------+------------------------------+

Total de campos obrigatórios: 3
Total geral de atributos: 47
```

## Observações

> **💡 Dica:** Use essa função como ferramenta de diagnóstico e documentação. Antes de construir integrações complexas com o Dynamics CRM, rode `DescribeMscrmEntityAttributes` em uma CloudPage para mapear todos os campos disponíveis, seus tipos e opções. Isso evita erros ao usar funções como [CreateMscrmRecord](../microsoft-dynamics-crm-functions/createmscrmrecord.md) ou [UpdateMscrmRecords](../microsoft-dynamics-crm-functions/updatemscrmrecords.md).

> **💡 Dica:** Para campos do tipo Boolean, status, picklist ou state, a função retorna uma lista separada por vírgulas com os valores numéricos e seus rótulos de exibição. Isso é muito útil para montar lógicas condicionais ou validar valores antes de gravar dados no CRM.

> **⚠️ Atenção:** Essa função depende da integração entre o Marketing Cloud e o Microsoft Dynamics CRM estar configurada corretamente. Se a conexão não estiver ativa, a função não retornará resultados.

## Funções relacionadas

- [DescribeMscrmEntities](../microsoft-dynamics-crm-functions/describemscrmentities.md) — lista todas as entidades disponíveis no Dynamics CRM (útil para descobrir o nome exato da entidade antes de consultar seus atributos)
- [RetrieveMscrmRecords](../microsoft-dynamics-crm-functions/retrievemscrmrecords.md) — recupera registros de uma entidade do CRM
- [RetrieveMscrmRecordsFetchXml](../microsoft-dynamics-crm-functions/retrievemscrmrecordsfetchxml.md) — recupera registros usando FetchXML para consultas mais complexas
- [CreateMscrmRecord](../microsoft-dynamics-crm-functions/createmscrmrecord.md) — cria registros no Dynamics CRM
- [UpdateMscrmRecords](../microsoft-dynamics-crm-functions/updatemscrmrecords.md) — atualiza registros existentes no CRM
- [UpsertMscrmRecord](../microsoft-dynamics-crm-functions/upsertmscrmrecord.md) — insere ou atualiza registros no CRM
- [Row](../data-extension-functions/row.md) — acessa uma linha específica do rowset retornado
- [RowCount](../data-extension-functions/rowcount.md) — conta o número de linhas no rowset
- [Field](../data-extension-functions/field.md) — extrai o valor de um campo específico de uma linha