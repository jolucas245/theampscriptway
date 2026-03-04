---
title: AddMscrmListMember
sidebar_label: AddMscrmListMember
description: Adiciona um registro (lead, contato ou conta) a uma lista de marketing do Microsoft Dynamics CRM.
---

# AddMscrmListMember

## Descrição

Adiciona um registro — como um lead, contato ou conta — a uma lista de marketing do Microsoft Dynamics CRM. Essa função é útil quando você precisa, a partir do Marketing Cloud, gerenciar a segmentação de listas diretamente no Dynamics CRM, por exemplo, incluindo clientes em listas de campanhas promocionais ou réguas de relacionamento controladas pelo CRM. A função não retorna valor.

## Sintaxe

```ampscript
AddMscrmListMember(@recordGuid, @listGuid)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| recordGuid | String | Sim | GUID do registro (lead, contato ou conta) que você quer adicionar à lista de marketing. |
| listGuid | String | Sim | GUID da lista de marketing do Dynamics CRM à qual o registro será adicionado. |

## Exemplo básico

Adicionando um contato da Lojas Vitória a uma lista de marketing de promoções sazonais no Dynamics CRM.

```ampscript
%%[

SET @recordGuid = "A1B2C3D4-E5F6-7890-ABCD-EF1234567890"
SET @listGuid = "F9E8D7C6-B5A4-3210-FEDC-BA0987654321"

AddMscrmListMember(@recordGuid, @listGuid)

]%%
```

**Saída:**
```
(Sem saída visível — a função não retorna valor. O registro é adicionado à lista no Dynamics CRM.)
```

## Exemplo avançado

Em uma régua de relacionamento do Banco Brasilão, ao enviar um e-mail de boas-vindas, o sistema busca o GUID do contato em uma Data Extension e o adiciona automaticamente à lista de marketing "Clientes Ativos" no Dynamics CRM.

```ampscript
%%[

SET @email = AttributeValue("EmailAddress")

SET @resultado = LookupRows("CRM_Contatos", "Email", @email)

IF RowCount(@resultado) > 0 THEN

  SET @linha = Row(@resultado, 1)
  SET @recordGuid = Field(@linha, "CRM_ContactGuid")
  SET @listGuid = "D4C3B2A1-9876-5432-ABCD-FEDCBA098765"

  AddMscrmListMember(@recordGuid, @listGuid)

ENDIF

]%%
```

**Saída:**
```
(Sem saída visível — se o contato for encontrado na Data Extension, ele é adicionado à lista "Clientes Ativos" no Dynamics CRM.)
```

## Observações

- A função não retorna valor, então você não consegue capturar um status de sucesso ou erro diretamente no AMPscript.

> **⚠️ Atenção:** Certifique-se de que os GUIDs informados são válidos e existem no Dynamics CRM. Um GUID incorreto ou inexistente pode causar falha silenciosa na execução.

> **💡 Dica:** Armazene os GUIDs do Dynamics CRM em uma Data Extension sincronizada. Assim, você pode usar funções como [Lookup](../data-extension-functions/lookup.md) ou [LookupRows](../data-extension-functions/lookuprows.md) para recuperar o GUID dinamicamente no momento do envio, como no exemplo avançado acima.

## Funções relacionadas

- [CreateMscrmRecord](../microsoft-dynamics-crm-functions/createmscrmrecord.md) — cria um novo registro no Dynamics CRM
- [RetrieveMscrmRecords](../microsoft-dynamics-crm-functions/retrievemscrmrecords.md) — recupera registros do Dynamics CRM
- [RetrieveMscrmRecordsFetchXml](../microsoft-dynamics-crm-functions/retrievemscrmrecordsfetchxml.md) — recupera registros usando FetchXML
- [UpdateMscrmRecords](../microsoft-dynamics-crm-functions/updatemscrmrecords.md) — atualiza registros no Dynamics CRM
- [UpsertMscrmRecord](../microsoft-dynamics-crm-functions/upsertmscrmrecord.md) — insere ou atualiza um registro no Dynamics CRM
- [SetStateMscrmRecord](../microsoft-dynamics-crm-functions/setstatemscrmrecord.md) — altera o estado de um registro no Dynamics CRM