---
title: SetStateMscrmRecord
sidebar_label: SetStateMscrmRecord
description: Define o estado (state) e status de um registro no Microsoft Dynamics CRM a partir do AMPscript.
---

<!-- generated-by-script -->

# SetStateMscrmRecord

## Descrição

A função `SetStateMscrmRecord` permite alterar o estado (state) e o status de um registro no Microsoft Dynamics CRM diretamente pelo AMPscript. É útil quando você precisa ativar ou inativar registros do CRM como parte de um fluxo de automação no Marketing Cloud — por exemplo, desativar uma conta de cliente que cancelou o serviço ou reativar um contato após uma reconversão. A função **não retorna nenhum valor**. Importante: algumas entidades, como Opportunity, exigem requisições especiais do CRM para alterar o estado, e essa função **não funciona** para essas entidades.

## Sintaxe

```ampscript
SetStateMscrmRecord(recordGuid, entityName, stateToSet, statusToSet)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| recordGuid | string | Sim | O GUID (identificador único) do registro no Dynamics CRM cujo estado será alterado. |
| entityName | string | Sim | O nome da entidade no Microsoft Dynamics CRM (ex: `account`, `contact`, `lead`). |
| stateToSet | string | Sim | O estado a ser definido para o registro. Valores aceitos: `active` ou `inactive`. |
| statusToSet | string | Sim | O status a ser definido para o registro. Valores aceitos: `0`, `1` ou `-1`. O valor `-1` redefine o status para o valor padrão da entidade. |

## Exemplo básico

Neste exemplo, uma conta (account) no Dynamics CRM é inativada. Imagine que a "Conecta Telecom" precisa desativar automaticamente contas de clientes que solicitaram cancelamento:

```ampscript
%%[
VAR @guidConta
SET @guidConta = "A1B2C3D4-E5F6-7890-ABCD-EF1234567890"

SetStateMscrmRecord(@guidConta, "account", "inactive", "-1")
]%%
```

**Saída:**

```
(Sem saída visível — a função não retorna valor. O registro da conta no Dynamics CRM é alterado para o estado inativo com status padrão.)
```

## Exemplo avançado

Cenário real: a "FarmaRede" tem um programa de fidelidade integrado com o Dynamics CRM. Quando um cliente não faz compras há mais de 12 meses, o sistema envia um e-mail de aviso e inativa o registro de contato no CRM. Caso o contato ainda esteja ativo, a inativação é executada:

```ampscript
%%[
VAR @guidContato, @nomeCliente, @rows, @estado

SET @guidContato = AttributeValue("DynamicsContactId")
SET @nomeCliente = AttributeValue("NomeCliente")

/* Busca o estado atual do contato no Dynamics CRM */
SET @rows = RetrieveMscrmRecords("contact", "statecode,fullname", "contactid", @guidContato)

IF RowCount(@rows) > 0 THEN
  SET @estado = Field(Row(@rows, 1), "statecode")

  IF @estado == "active" THEN
    /* Inativa o contato no Dynamics CRM */
    SetStateMscrmRecord(@guidContato, "contact", "inactive", "-1")
]%%

Olá, %%=v(@nomeCliente)=%%!

Notamos que você não realiza compras na FarmaRede há mais de 12 meses.
Seu cadastro no programa de fidelidade foi temporariamente desativado.

Para reativar, acesse: www.farmarede.com.br/fidelidade/reativar

%%[
  ELSE
]%%

Olá, %%=v(@nomeCliente)=%%! Seu cadastro já se encontra inativo.

%%[
  ENDIF
ELSE
]%%

Não foi possível localizar seu cadastro. Entre em contato pelo (11) 3333-4444.

%%[
ENDIF
]%%
```

**Saída (para um contato ativo chamado João Silva):**

```
Olá, João Silva!

Notamos que você não realiza compras na FarmaRede há mais de 12 meses.
Seu cadastro no programa de fidelidade foi temporariamente desativado.

Para reativar, acesse: www.farmarede.com.br/fidelidade/reativar
```

## Observações

- A função **não retorna nenhum valor**. Não é possível atribuí-la a uma variável para verificar sucesso ou falha diretamente.
- **Não funciona para todas as entidades.** Algumas entidades do Dynamics CRM, como `Opportunity`, exigem requisições especiais para mudança de estado e não são compatíveis com essa função.
- Os valores aceitos para `stateToSet` são apenas `active` ou `inactive`. Qualquer outro valor pode gerar erro.
- Os valores aceitos para `statusToSet` são `0`, `1` ou `-1`. Use `-1` quando quiser simplesmente redefinir o status para o padrão da entidade, sem se preocupar com o código específico.
- O `recordGuid` precisa ser um GUID válido existente no Dynamics CRM. Se o registro não existir, a função pode falhar silenciosamente ou gerar erro.
- Essa função requer que a integração entre o Marketing Cloud e o Microsoft Dynamics CRM esteja configurada e ativa na sua conta.
- Por ser uma função específica do Microsoft Dynamics CRM, ela tem uso restrito a cenários onde essa integração existe. Se você usa Salesforce CRM (Sales Cloud), veja as [funções Salesforce](../salesforce-functions/createsalesforceobject.md) em vez desta.
- Considere usar [RaiseError](../utility-functions/raiseerror.md) em conjunto para tratar possíveis falhas no fluxo de e-mail.

## Funções relacionadas

- [CreateMscrmRecord](../microsoft-dynamics-crm-functions/createmscrmrecord.md) — Cria um novo registro no Microsoft Dynamics CRM.
- [UpdateMscrmRecords](../microsoft-dynamics-crm-functions/updatemscrmrecords.md) — Atualiza campos de registros existentes no Dynamics CRM.
- [UpsertMscrmRecord](../microsoft-dynamics-crm-functions/upsertmscrmrecord.md) — Insere ou atualiza um registro no Dynamics CRM.
- [RetrieveMscrmRecords](../microsoft-dynamics-crm-functions/retrievemscrmrecords.md) — Recupera registros do Dynamics CRM com base em filtros.
- [RetrieveMscrmRecordsFetchXml](../microsoft-dynamics-crm-functions/retrievemscrmrecordsfetchxml.md) — Recupera registros do Dynamics CRM usando FetchXML.
- [AddMscrmListMember](../microsoft-dynamics-crm-functions/addmscrmlistmember.md) — Adiciona um membro a uma lista de marketing no Dynamics CRM.
- [DescribeMscrmEntities](../microsoft-dynamics-crm-functions/describemscrmentities.md) — Retorna informações sobre as entidades disponíveis no Dynamics CRM.
- [DescribeMscrmEntityAttributes](../microsoft-dynamics-crm-functions/describemscrmentityattributes.md) — Retorna os atributos de uma entidade do Dynamics CRM.
- [RaiseError](../utility-functions/raiseerror.md) — Gera um erro customizado, útil para tratamento de exceções.