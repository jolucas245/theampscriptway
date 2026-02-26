---
title: RetrieveMscrmRecords
sidebar_label: RetrieveMscrmRecords
description: Recupera registros de entidades do Microsoft Dynamics CRM diretamente via AMPscript no Marketing Cloud.
---

# RetrieveMscrmRecords

## Descrição

A função `RetrieveMscrmRecords` permite que você recupere dados de entidades do Microsoft Dynamics CRM diretamente dentro do Marketing Cloud. Ela funciona de forma parecida com um `SELECT` em SQL: você informa a entidade, os campos que quer trazer, e um filtro simples com campo, operador e valor. O retorno é um rowset (conjunto de linhas) que você pode percorrer com `RowCount`, `Row` e `Field`, exatamente como faz com `LookupRows` em Data Extensions. É muito útil quando você precisa personalizar e-mails ou CloudPages com dados que estão no Dynamics CRM sem precisar sincronizar tudo antes para uma Data Extension.

## Sintaxe

```ampscript
RetrieveMscrmRecords(entityName, fieldsToRetrieve, queryFieldName, queryFieldOperator, queryFieldValue)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| entityName | String | Sim | Nome da entidade do Microsoft Dynamics CRM de onde os registros serão recuperados (ex: `"contact"`, `"account"`, `"lead"`). |
| fieldsToRetrieve | String | Sim | Lista de campos a serem retornados, separados por vírgula (ex: `"firstname,lastname,emailaddress1"`). |
| queryFieldName | String | Sim | Nome do campo usado como filtro na consulta. |
| queryFieldOperator | String | Sim | Operador de comparação usado no filtro (ex: `"eq"` para igual). |
| queryFieldValue | String | Sim | Valor a ser comparado no campo de filtro. |

## Exemplo básico

Imagine que o **Banco Meridional** quer enviar um e-mail personalizado para todos os contatos com sobrenome "Santos" que estão no Dynamics CRM. Você recupera os dados e exibe nome, sobrenome e ID de cada contato.

```ampscript
%%[

SET @registros = RetrieveMscrmRecords(
  "contact",
  "contactid,firstname,lastname",
  "lastname", "eq", "Santos"
)

]%%

Contatos encontrados:

%%[

FOR @i = 1 TO RowCount(@registros) DO

  SET @linha = Row(@registros, @i)
  SET @primeiroNome = Field(@linha, "firstname")
  SET @sobrenome = Field(@linha, "lastname")
  SET @idContato = Field(@linha, "contactid")

]%%

Nome: %%=v(@primeiroNome)=%% %%=v(@sobrenome)=%%
ID: %%=v(@idContato)=%%

%%[ NEXT @i ]%%
```

**Saída:**
```
Contatos encontrados:

Nome: Maria Santos
ID: a1b2c3d4-e5f6-7890-abcd-ef1234567890

Nome: João Santos
ID: f9e8d7c6-b5a4-3210-fedc-ba0987654321
```

## Exemplo avançado

Agora um cenário mais completo: a **Conecta Telecom** quer enviar um e-mail de cobrança personalizado. O sistema busca no Dynamics CRM os dados do contato pelo e-mail, e monta uma mensagem com nome completo formatado e um fallback caso o contato não seja encontrado.

```ampscript
%%[

VAR @registros, @totalRegistros, @primeiroNome, @sobrenome, @nomeCompleto, @telefone, @emailBusca

SET @emailBusca = AttributeValue("EmailAddress")

SET @registros = RetrieveMscrmRecords(
  "contact",
  "contactid,firstname,lastname,telephone1",
  "emailaddress1", "eq", @emailBusca
)

SET @totalRegistros = RowCount(@registros)

IF @totalRegistros > 0 THEN

  SET @linha = Row(@registros, 1)
  SET @primeiroNome = Field(@linha, "firstname")
  SET @sobrenome = Field(@linha, "lastname")
  SET @telefone = Field(@linha, "telephone1")

  /* Formata o nome com ProperCase para garantir capitalização correta */
  SET @nomeCompleto = Concat(
    ProperCase(@primeiroNome),
    " ",
    ProperCase(@sobrenome)
  )

  IF Empty(@telefone) THEN
    SET @telefone = "não cadastrado"
  ENDIF

]%%

Olá, %%=v(@nomeCompleto)=%%!

Identificamos uma fatura em aberto na sua conta da Conecta Telecom.

Telefone de contato: %%=v(@telefone)=%%

Para quitar seu débito com desconto de 10%%, acesse:
https://www.conectatelecom.com.br/faturas

Dúvidas? Ligue para 0800 123 4567.

%%[ ELSE ]%%

Olá, cliente!

Identificamos uma fatura em aberto. Entre em contato conosco pelo 0800 123 4567 para regularizar sua situação.

%%[ ENDIF ]%%
```

**Saída (quando o contato é encontrado):**
```
Olá, Carlos Oliveira!

Identificamos uma fatura em aberto na sua conta da Conecta Telecom.

Telefone de contato: (11) 99876-5432

Para quitar seu débito com desconto de 10%, acesse:
https://www.conectatelecom.com.br/faturas

Dúvidas? Ligue para 0800 123 4567.
```

**Saída (quando o contato não é encontrado):**
```
Olá, cliente!

Identificamos uma fatura em aberto. Entre em contato conosco pelo 0800 123 4567 para regularizar sua situação.
```

## Observações

- **Requer integração ativa com o Microsoft Dynamics CRM.** Essa função só funciona se a sua conta do Marketing Cloud estiver devidamente conectada ao Dynamics CRM. Sem essa configuração, a função vai gerar erro.
- **Função de nicho.** Se você usa Salesforce CRM (Sales Cloud / Service Cloud) em vez do Dynamics CRM, essa função **não** é para você — use [RetrieveSalesforceObjects](../salesforce-functions/retrievesalesforceobjects.md) no lugar.
- **O retorno é um rowset.** Você percorre os resultados usando [RowCount](../data-extension-functions/rowcount.md), [Row](../data-extension-functions/row.md) e [Field](../data-extension-functions/field.md), exatamente como faria com resultados de [LookupRows](../data-extension-functions/lookuprows.md).
- **Se nenhum registro for encontrado**, o `RowCount` retorna `0`. Sempre faça essa verificação antes de tentar acessar linhas para evitar erros no envio.
- **Os nomes de entidades e campos** devem corresponder exatamente aos nomes lógicos (logical names) do Dynamics CRM, que geralmente são em minúsculas (ex: `"contact"`, `"firstname"`, `"emailaddress1"`).
- **Cuidado com performance.** Consultas ao Dynamics CRM são feitas em tempo real durante o processamento do e-mail. Se a consulta retornar muitos registros ou o CRM estiver lento, isso pode impactar o tempo de envio.
- **Filtro simples.** A função suporta apenas um campo de filtro com um operador e um valor. Para consultas mais complexas com múltiplos filtros ou ordenação, considere usar [RetrieveMscrmRecordsFetchXml](../microsoft-dynamics-crm-functions/retrievemscrmrecordsfetchxml.md), que aceita FetchXML.

## Funções relacionadas

- [RetrieveMscrmRecordsFetchXml](../microsoft-dynamics-crm-functions/retrievemscrmrecordsfetchxml.md) — recupera registros do Dynamics CRM usando consultas FetchXML mais complexas
- [CreateMscrmRecord](../microsoft-dynamics-crm-functions/createmscrmrecord.md) — cria um novo registro em uma entidade do Dynamics CRM
- [UpdateMscrmRecords](../microsoft-dynamics-crm-functions/updatemscrmrecords.md) — atualiza registros existentes no Dynamics CRM
- [UpsertMscrmRecord](../microsoft-dynamics-crm-functions/upsertmscrmrecord.md) — insere ou atualiza um registro no Dynamics CRM
- [DescribeMscrmEntities](../microsoft-dynamics-crm-functions/describemscrmentities.md) — lista as entidades disponíveis no Dynamics CRM
- [DescribeMscrmEntityAttributes](../microsoft-dynamics-crm-functions/describemscrmentityattributes.md) — lista os atributos de uma entidade do Dynamics CRM
- [RowCount](../data-extension-functions/rowcount.md) — conta o número de linhas em um rowset retornado
- [Row](../data-extension-functions/row.md) — acessa uma linha específica de um rowset
- [Field](../data-extension-functions/field.md) — extrai o valor de um campo de uma linha do rowset
- [RetrieveSalesforceObjects](../salesforce-functions/retrievesalesforceobjects.md) — equivalente para Salesforce CRM (Sales/Service Cloud)