---
title: CreateMscrmRecord
sidebar_label: CreateMscrmRecord
description: Cria um registro em uma entidade do Microsoft Dynamics CRM e retorna o GUID do registro criado.
---

# CreateMscrmRecord

## Descrição

Cria um novo registro em uma entidade do Microsoft Dynamics CRM diretamente via AMPscript. Você informa a entidade, a quantidade de campos e os pares nome-valor dos atributos que quer preencher. A função retorna o **GUID** do registro recém-criado, o que é útil para rastrear ou referenciar esse registro em operações subsequentes.

## Sintaxe

```ampscript
CreateMscrmRecord(entityName, numFields, attributeName1, attributeValue1, ...)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| entityName | String | Sim | Nome da entidade do Microsoft Dynamics CRM onde o registro será criado. |
| numFields | Número | Sim | Quantidade de pares nome-valor de atributos que serão passados na chamada. |
| attributeName1 | String | Sim | Nome do primeiro atributo a ser preenchido no registro. |
| attributeValue1 | String | Sim | Valor do primeiro atributo a ser preenchido no registro. |
| attributeNameN | String | Não | Pares adicionais de nome-valor podem ser adicionados ao final da função (attributeName2, attributeValue2, attributeName3, attributeValue3...). |

## Exemplo básico

Criando um registro de contato no Dynamics CRM com nome, sobrenome e e-mail de um cliente brasileiro:

```ampscript
%%[
SET @guid = CreateMscrmRecord(
  "contact",
  3,
  "firstname", "João",
  "lastname", "Silva",
  "emailaddress1", "joao.silva@lojasvitoria.com.br"
)
]%%

Registro criado com GUID: %%=V(@guid)=%%
```

**Saída:**
```
Registro criado com GUID: a1b2c3d4-e5f6-7890-abcd-ef1234567890
```

## Exemplo avançado

Em uma régua de relacionamento do Banco Brasilão, ao capturar um lead via CloudPage, você cria o contato no Dynamics CRM e registra o GUID em uma Data Extension para rastreamento posterior:

```ampscript
%%[
VAR @nome, @sobrenome, @email, @telefone, @guidContato

SET @nome = "Maria"
SET @sobrenome = "Santos"
SET @email = "maria.santos@gmail.com"
SET @telefone = "(11) 99999-9999"

SET @guidContato = CreateMscrmRecord(
  "contact",
  4,
  "firstname", @nome,
  "lastname", @sobrenome,
  "emailaddress1", @email,
  "telephone1", @telefone
)

IF NOT Empty(@guidContato) THEN
  InsertDE(
    "CRM_Contatos_Criados",
    "GUID", @guidContato,
    "NomeCompleto", Concat(@nome, " ", @sobrenome),
    "Email", @email,
    "DataCriacao", FormatDate(Now(), "dd/MM/yyyy HH:mm")
  )
]%%

<p>Olá, %%=V(@nome)=%%. Seu cadastro foi registrado com sucesso!</p>
<p>Protocolo: %%=V(@guidContato)=%%</p>

%%[
ELSE
]%%

<p>Houve um problema ao registrar seu cadastro. Tente novamente.</p>

%%[
ENDIF
]%%
```

**Saída:**
```
Olá, Maria. Seu cadastro foi registrado com sucesso!
Protocolo: f9e8d7c6-b5a4-3210-fedc-ba9876543210
```

## Observações

- A função retorna o **GUID** do registro criado no Dynamics CRM. Guarde esse valor se precisar referenciar o registro depois — por exemplo, para atualizações com [UpdateMscrmRecords](../microsoft-dynamics-crm-functions/updatemscrmrecords.md) ou para associar a listas com [AddMscrmListMember](../microsoft-dynamics-crm-functions/addmscrmlistmember.md).

- O parâmetro `numFields` precisa corresponder exatamente à quantidade de pares nome-valor que você está passando. Se informar 3 mas passar apenas 2 pares, o comportamento pode ser imprevisível.

> **⚠️ Atenção:** Os nomes dos atributos devem corresponder exatamente aos nomes internos (schema names) da entidade no Dynamics CRM, não aos rótulos exibidos na interface. Confirme com o administrador do CRM os nomes corretos antes de montar o código.

> **💡 Dica:** Combine o GUID retornado com [InsertDE](../data-extension-functions/insertde.md) para manter um log local no Marketing Cloud dos registros criados. Isso facilita troubleshooting e auditorias sem precisar consultar o CRM toda vez.

## Funções relacionadas

- [AddMscrmListMember](../microsoft-dynamics-crm-functions/addmscrmlistmember.md) — adiciona um registro como membro de uma lista no Dynamics CRM.
- [UpdateMscrmRecords](../microsoft-dynamics-crm-functions/updatemscrmrecords.md) — atualiza registros existentes em uma entidade do Dynamics CRM.
- [UpsertMscrmRecord](../microsoft-dynamics-crm-functions/upsertmscrmrecord.md) — insere ou atualiza um registro no Dynamics CRM.
- [RetrieveMscrmRecords](../microsoft-dynamics-crm-functions/retrievemscrmrecords.md) — recupera registros de uma entidade do Dynamics CRM.
- [DescribeMscrmEntities](../microsoft-dynamics-crm-functions/describemscrmentities.md) — lista as entidades disponíveis no Dynamics CRM.
- [DescribeMscrmEntityAttributes](../microsoft-dynamics-crm-functions/describemscrmentityattributes.md) — lista os atributos de uma entidade do Dynamics CRM.