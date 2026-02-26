---
title: CreateMscrmRecord
sidebar_label: CreateMscrmRecord
description: Cria um novo registro em uma entidade do Microsoft Dynamics CRM e retorna o GUID do registro criado.
---

<!-- generated-by-script -->

# CreateMscrmRecord

## Descrição

A função `CreateMscrmRecord` cria um novo registro em uma entidade do Microsoft Dynamics CRM diretamente a partir do AMPscript. Você passa o nome da entidade, a quantidade de campos que quer preencher e os pares de nome/valor para cada atributo. A função retorna o **GUID** (identificador único) do registro recém-criado, o que é super útil para referenciar esse registro em operações futuras.

## Sintaxe

```ampscript
CreateMscrmRecord(entityName, numFields, attributeName1, attributeValue1, ...)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|----------------|-----------|---------------|----------------|
| entityName | String | Sim | Nome da entidade do Microsoft Dynamics CRM onde o registro será criado (ex: `"contact"`, `"account"`, `"lead"`). |
| numFields | Número | Sim | Quantidade de pares nome/valor de atributos que serão passados na função. |
| attributeName1 | String | Sim | Nome do primeiro atributo a ser preenchido no registro. |
| attributeValue1 | String | Sim | Valor do primeiro atributo a ser preenchido no registro. |

> Você pode passar múltiplos pares de nome/valor adicionando-os ao final da função (`attributeName2`, `attributeValue2`, `attributeName3`, `attributeValue3`, etc.).

## Exemplo básico

Imagine que a **Conecta Telecom** precisa criar um contato no Dynamics CRM toda vez que um novo assinante se cadastra. Veja como fica:

```ampscript
%%[
  SET @nome = "João"
  SET @sobrenome = "Silva"
  SET @email = "joao.silva@email.com.br"

  SET @contact_guid = CreateMscrmRecord(
    "contact",
    3,
    "firstname", @nome,
    "lastname", @sobrenome,
    "emailaddress1", @email
  )
]%%

GUID do novo contato: %%=v(@contact_guid)=%%
```

**Saída:**
```
GUID do novo contato: a1b2c3d4-e5f6-7890-abcd-ef1234567890
```

## Exemplo avançado

Agora um cenário mais completo: a **Lojas Vitória** tem uma campanha de Dia das Mães e quer registrar leads no Dynamics CRM a partir de um formulário de CloudPage. Além de criar o registro, o código também salva o GUID em uma Data Extension para rastreamento.

```ampscript
%%[
  /* Captura dados do formulário da CloudPage */
  SET @primeiroNome = RequestParameter("nome")
  SET @ultimoNome = RequestParameter("sobrenome")
  SET @emailLead = RequestParameter("email")
  SET @telefoneLead = RequestParameter("telefone")
  SET @cpfLead = RequestParameter("cpf")

  /* Remove espaços extras dos campos */
  SET @primeiroNome = Trim(@primeiroNome)
  SET @ultimoNome = Trim(@ultimoNome)
  SET @emailLead = Trim(@emailLead)

  /* Valida se o e-mail é válido antes de criar o registro */
  IF IsEmailAddress(@emailLead) == "True" THEN

    /* Cria o lead no Dynamics CRM com 5 atributos */
    SET @lead_guid = CreateMscrmRecord(
      "lead",
      5,
      "firstname", @primeiroNome,
      "lastname", @ultimoNome,
      "emailaddress1", @emailLead,
      "telephone1", @telefoneLead,
      "description", Concat("Lead captado na campanha Dia das Mães 2025 - CPF: ", @cpfLead)
    )

    /* Salva o GUID na Data Extension para rastreamento interno */
    InsertDE(
      "Leads_DiaDasMaes",
      "Email", @emailLead,
      "NomeCompleto", Concat(@primeiroNome, " ", @ultimoNome),
      "CRM_GUID", @lead_guid,
      "Telefone", @telefoneLead,
      "CPF", @cpfLead,
      "DataCadastro", FormatDate(Now(), "dd/MM/yyyy HH:mm")
    )
]%%

<p>Obrigado, %%=v(@primeiroNome)=%%! Seu cadastro na promoção de Dia das Mães da Lojas Vitória foi realizado com sucesso.</p>
<p>Seu código de registro: %%=v(@lead_guid)=%%</p>
<p>Fique de olho no seu e-mail para receber ofertas exclusivas com frete grátis acima de R$299!</p>

%%[
  ELSE
]%%

<p>Ops! O e-mail informado não é válido. Por favor, tente novamente.</p>

%%[
  ENDIF
]%%
```

**Saída (caso e-mail válido):**
```
Obrigado, Maria! Seu cadastro na promoção de Dia das Mães da Lojas Vitória foi realizado com sucesso.
Seu código de registro: f9e8d7c6-b5a4-3210-fedc-ba9876543210
Fique de olho no seu e-mail para receber ofertas exclusivas com frete grátis acima de R$299!
```

## Observações

- **Requer integração configurada:** Para usar essa função, a integração entre o Marketing Cloud e o Microsoft Dynamics CRM precisa estar devidamente configurada na sua conta. Sem isso, a função vai gerar erro.
- **Retorno é um GUID:** O valor retornado é sempre o GUID (identificador único global) do registro criado no Dynamics CRM. Guarde esse valor se precisar fazer atualizações ou consultas futuras nesse registro.
- **O parâmetro `numFields` precisa ser exato:** O número informado em `numFields` deve corresponder exatamente à quantidade de pares nome/valor que você está passando. Se passar 3 mas informar 2, o comportamento pode ser inesperado.
- **Nomes de atributos são do CRM:** Os nomes dos atributos (`attributeName`) devem corresponder aos nomes internos (schema names) da entidade no Dynamics CRM, não aos rótulos exibidos na interface. Por exemplo, use `"emailaddress1"` e não `"E-mail Principal"`.
- **Função específica para Microsoft Dynamics CRM:** Essa função só funciona com Microsoft Dynamics CRM. Se você usa Salesforce CRM (Sales Cloud), veja a função [CreateSalesforceObject](../salesforce-functions/createsalesforceobject.md).
- **Cuidado com envios em massa:** Criar registros no CRM durante envios de e-mail em grande volume pode impactar a performance. Avalie se faz mais sentido usar essa função em CloudPages ou em envios segmentados menores.

## Funções relacionadas

- [UpdateMscrmRecords](../microsoft-dynamics-crm-functions/updatemscrmrecords.md) — Atualiza registros existentes em uma entidade do Dynamics CRM.
- [UpsertMscrmRecord](../microsoft-dynamics-crm-functions/upsertmscrmrecord.md) — Cria ou atualiza um registro no Dynamics CRM (insert + update).
- [RetrieveMscrmRecords](../microsoft-dynamics-crm-functions/retrievemscrmrecords.md) — Consulta e recupera registros de uma entidade do Dynamics CRM.
- [RetrieveMscrmRecordsFetchXml](../microsoft-dynamics-crm-functions/retrievemscrmrecordsfetchxml.md) — Consulta registros no Dynamics CRM usando FetchXML.
- [AddMscrmListMember](../microsoft-dynamics-crm-functions/addmscrmlistmember.md) — Adiciona um membro a uma lista de marketing no Dynamics CRM.
- [SetStateMscrmRecord](../microsoft-dynamics-crm-functions/setstatemscrmrecord.md) — Altera o estado de um registro no Dynamics CRM.
- [DescribeMscrmEntities](../microsoft-dynamics-crm-functions/describemscrmentities.md) — Lista as entidades disponíveis no Dynamics CRM.
- [DescribeMscrmEntityAttributes](../microsoft-dynamics-crm-functions/describemscrmentityattributes.md) — Lista os atributos de uma entidade específica do Dynamics CRM.
- [CreateSalesforceObject](../salesforce-functions/createsalesforceobject.md) — Equivalente para Salesforce CRM (Sales Cloud).
- [InsertDE](../data-extension-functions/insertde.md) — Insere registros em uma Data Extension do Marketing Cloud.