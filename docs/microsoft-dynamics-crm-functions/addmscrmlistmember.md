---
title: AddMscrmListMember
sidebar_label: AddMscrmListMember
description: Adiciona um registro (lead, contato ou conta) a uma lista de marketing do Microsoft Dynamics CRM.
---

<!-- generated-by-script -->

# AddMscrmListMember

## Descrição

A função `AddMscrmListMember` adiciona um registro — como um lead, contato ou conta — a uma lista de marketing do Microsoft Dynamics CRM. Você usa essa função quando precisa gerenciar a associação de registros a listas de marketing diretamente pelo Marketing Cloud, sem precisar entrar no Dynamics CRM manualmente. Isso é útil, por exemplo, para incluir automaticamente um contato em uma lista de campanha promocional após ele interagir com um e-mail. A função **não retorna nenhum valor**.

## Sintaxe

```ampscript
AddMscrmListMember(recordGuid, listGuid)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|------------|--------|-------------|-----------|
| recordGuid | String | Sim | O GUID (identificador único) do registro que você quer adicionar à lista de marketing. Pode ser um lead, contato ou conta do Dynamics CRM. |
| listGuid | String | Sim | O GUID (identificador único) da lista de marketing do Dynamics CRM onde o registro será adicionado. |

## Exemplo básico

Imagine que a **Conecta Telecom** quer adicionar um contato específico a uma lista de marketing de "Promoção Dia das Mães" no Dynamics CRM. Você já tem os GUIDs do contato e da lista:

```ampscript
%%[
VAR @guidContato, @guidLista

SET @guidContato = "A1B2C3D4-E5F6-7890-ABCD-EF1234567890"
SET @guidLista = "F9E8D7C6-B5A4-3210-FEDC-BA0987654321"

AddMscrmListMember(@guidContato, @guidLista)
]%%
```

**Saída:**
```
(Sem saída visível — a função não retorna valor. O contato é adicionado à lista de marketing no Dynamics CRM.)
```

## Exemplo avançado

Agora um cenário mais realista: a **FarmaRede** tem uma Data Extension chamada `DE_Leads_Campanha` com os GUIDs dos leads que demonstraram interesse na campanha de "Cashback de Natal". O objetivo é percorrer esses leads e adicioná-los a uma lista de marketing específica no Dynamics CRM.

```ampscript
%%[
VAR @linhas, @totalLinhas, @i, @guidLead, @guidLista

SET @guidLista = "D4C3B2A1-9876-5432-FEDC-BA1234567890"

SET @linhas = LookupRows("DE_Leads_Campanha", "Campanha", "Cashback Natal 2024")
SET @totalLinhas = RowCount(@linhas)

IF @totalLinhas > 0 THEN
  FOR @i = 1 TO @totalLinhas DO
    SET @guidLead = Field(Row(@linhas, @i), "LeadGuid")

    IF NOT Empty(@guidLead) THEN
      AddMscrmListMember(@guidLead, @guidLista)
    ENDIF
  NEXT @i
ENDIF
]%%
```

**Saída:**
```
(Sem saída visível — cada lead válido da Data Extension é adicionado à lista de marketing "Cashback Natal 2024" no Dynamics CRM.)
```

## Observações

- A função **não retorna nenhum valor**. Não tente atribuir o resultado a uma variável.
- Essa função **exige integração ativa entre o Salesforce Marketing Cloud e o Microsoft Dynamics CRM**. Se a integração não estiver configurada, a função vai falhar.
- Os GUIDs precisam ser válidos e existir no Dynamics CRM. Se você passar um GUID inválido ou inexistente, espere um erro na execução.
- O registro referenciado pelo `recordGuid` deve ser de um tipo compatível com a lista de marketing (lead, contato ou conta). Listas de marketing no Dynamics CRM são tipadas — uma lista de contatos só aceita contatos, por exemplo.
- Essa função é de **uso específico** para quem trabalha com Microsoft Dynamics CRM. Se você usa Salesforce CRM (Sales Cloud), veja as [funções de Salesforce CRM](../salesforce-functions/createsalesforceobject.md) em vez desta.
- Tome cuidado ao usar em loops com muitos registros — cada chamada faz uma operação no CRM, o que pode impactar performance e limites de API.

## Funções relacionadas

- [CreateMscrmRecord](../microsoft-dynamics-crm-functions/createmscrmrecord.md) — cria um novo registro no Microsoft Dynamics CRM
- [RetrieveMscrmRecords](../microsoft-dynamics-crm-functions/retrievemscrmrecords.md) — recupera registros do Dynamics CRM usando critérios de filtro
- [RetrieveMscrmRecordsFetchXml](../microsoft-dynamics-crm-functions/retrievemscrmrecordsfetchxml.md) — recupera registros do Dynamics CRM usando FetchXML
- [UpdateMscrmRecords](../microsoft-dynamics-crm-functions/updatemscrmrecords.md) — atualiza registros existentes no Dynamics CRM
- [UpsertMscrmRecord](../microsoft-dynamics-crm-functions/upsertmscrmrecord.md) — insere ou atualiza um registro no Dynamics CRM
- [SetStateMscrmRecord](../microsoft-dynamics-crm-functions/setstatemscrmrecord.md) — altera o estado de um registro no Dynamics CRM
- [DescribeMscrmEntities](../microsoft-dynamics-crm-functions/describemscrmentities.md) — lista as entidades disponíveis no Dynamics CRM
- [DescribeMscrmEntityAttributes](../microsoft-dynamics-crm-functions/describemscrmentityattributes.md) — lista os atributos de uma entidade do Dynamics CRM
- [LookupRows](../data-extension-functions/lookuprows.md) — busca linhas em uma Data Extension (útil para recuperar GUIDs armazenados)
- [Empty](../utility-functions/empty.md) — verifica se um valor está vazio (útil para validar GUIDs antes de usar)