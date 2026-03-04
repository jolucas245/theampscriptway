---
title: SetStateMscrmRecord
sidebar_label: SetStateMscrmRecord
description: Define o estado (ativo/inativo) e o status de um registro no Microsoft Dynamics CRM diretamente via AMPscript.
---

# SetStateMscrmRecord

## Descrição

Define o estado e o status de um registro no Microsoft Dynamics CRM. Essa função é útil quando você precisa ativar ou inativar registros do Dynamics CRM diretamente a partir de uma comunicação ou automação no Marketing Cloud — por exemplo, desativar uma conta de cliente que solicitou cancelamento via uma CloudPage. A função não retorna valor.

> **⚠️ Atenção:** Algumas entidades do Dynamics CRM, como **Opportunity**, exigem requisições especiais do CRM para alterar seu estado. A função `SetStateMscrmRecord` **não funciona** para essas entidades.

## Sintaxe

```ampscript
SetStateMscrmRecord(recordGuid, entityName, stateToSet, statusToSet)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| recordGuid | string | Sim | O GUID do registro no Dynamics CRM que terá o estado alterado. |
| entityName | string | Sim | O nome da entidade no Microsoft Dynamics CRM (ex: "account", "contact"). |
| stateToSet | string | Sim | O estado a ser definido para o registro. Valores aceitos: `active` ou `inactive`. |
| statusToSet | string | Sim | O status a ser definido para o registro. Valores aceitos: `0`, `1` ou `-1`. O valor `-1` redefine o status para o valor padrão. |

## Exemplo básico

Inativando a conta de um cliente no Dynamics CRM — cenário típico de cancelamento de cadastro.

```ampscript
%%[
VAR @guidConta
SET @guidConta = "A1B2C3D4-E5F6-7890-ABCD-EF1234567890"

SetStateMscrmRecord(@guidConta, "account", "inactive", "-1")
]%%
```

**Saída:**
```
(nenhuma saída — a função não retorna valor, mas o registro da conta é definido como inativo no Dynamics CRM com o status padrão)
```

## Exemplo avançado

Em uma régua de relacionamento da Conecta Telecom, quando o cliente solicita o cancelamento do plano via CloudPage, o sistema busca o GUID da conta na Data Extension e inativa o registro no Dynamics CRM. Dependendo do motivo, define um status específico.

```ampscript
%%[
VAR @email, @rows, @guidConta, @motivo, @statusCrm

SET @email = AttributeValue("EmailAddress")
SET @motivo = RequestParameter("motivo")

SET @rows = LookupRows("CRM_Contas_Dynamics", "Email", @email)

IF RowCount(@rows) > 0 THEN
  SET @guidConta = Field(Row(@rows, 1), "AccountGuid")

  IF @motivo == "cancelamento_definitivo" THEN
    SET @statusCrm = "1"
  ELSE
    SET @statusCrm = "-1"
  ENDIF

  SetStateMscrmRecord(@guidConta, "account", "inactive", @statusCrm)
]%%

<p>Olá, seu pedido de cancelamento foi processado com sucesso.</p>

%%[
ELSE
]%%

<p>Não encontramos uma conta associada ao e-mail %%=V(@email)=%%.</p>

%%[
ENDIF
]%%
```

**Saída:**
```
Olá, seu pedido de cancelamento foi processado com sucesso.
```
*(Caso a conta seja encontrada na Data Extension, o registro no Dynamics CRM é inativado com o status correspondente ao motivo.)*

## Observações

- A função **não retorna valor**. Não tente atribuir o resultado a uma variável.
- O parâmetro `stateToSet` aceita **apenas** `active` ou `inactive`. Qualquer outro valor resultará em erro.
- O parâmetro `statusToSet` aceita **apenas** `0`, `1` ou `-1`. Use `-1` quando quiser que o CRM aplique o status padrão para aquele estado, sem se preocupar com o código específico.

> **⚠️ Atenção:** Entidades como **Opportunity** possuem fluxos de mudança de estado específicos no Dynamics CRM e **não são compatíveis** com essa função. Se você tentar usá-la com essas entidades, a operação falhará.

> **💡 Dica:** Antes de chamar `SetStateMscrmRecord`, é boa prática usar [RetrieveMscrmRecords](../microsoft-dynamics-crm-functions/retrievemscrmrecords.md) para confirmar que o registro existe e verificar seu estado atual — isso evita chamadas desnecessárias e facilita o tratamento de erros.

## Funções relacionadas

- [CreateMscrmRecord](../microsoft-dynamics-crm-functions/createmscrmrecord.md) — cria um novo registro no Dynamics CRM
- [UpdateMscrmRecords](../microsoft-dynamics-crm-functions/updatemscrmrecords.md) — atualiza campos de registros existentes
- [UpsertMscrmRecord](../microsoft-dynamics-crm-functions/upsertmscrmrecord.md) — insere ou atualiza um registro no Dynamics CRM
- [RetrieveMscrmRecords](../microsoft-dynamics-crm-functions/retrievemscrmrecords.md) — consulta registros no Dynamics CRM
- [RetrieveMscrmRecordsFetchXml](../microsoft-dynamics-crm-functions/retrievemscrmrecordsfetchxml.md) — consulta registros usando FetchXML
- [AddMscrmListMember](../microsoft-dynamics-crm-functions/addmscrmlistmember.md) — adiciona um membro a uma lista de marketing no Dynamics CRM