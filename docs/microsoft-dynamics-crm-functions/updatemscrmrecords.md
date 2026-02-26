---
title: UpdateMscrmRecords
sidebar_label: UpdateMscrmRecords
description: Atualiza um ou mais registros em uma entidade do Microsoft Dynamics CRM e retorna o número de registros atualizados com sucesso.
---

# UpdateMscrmRecords

## Descrição

A função `UpdateMscrmRecords` atualiza um ou mais registros em uma entidade do Microsoft Dynamics CRM. Você passa os GUIDs dos registros que quer alterar, junto com os nomes e valores dos atributos que devem ser atualizados. A função retorna o número de registros que foram atualizados com sucesso, o que é bem útil para validação e logging. Essa função exige que sua conta do Marketing Cloud tenha a integração com o Microsoft Dynamics CRM configurada.

## Sintaxe

```ampscript
UpdateMscrmRecords(entityName, guidsToUpdate, attributeName1, attributeValue1 [, attributeName2, attributeValue2, ...])
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|----------------|-----------|---------------|----------------|
| entityName | String | Sim | Nome da entidade do Microsoft Dynamics CRM que contém os registros a serem atualizados. |
| guidsToUpdate | String | Sim | Lista de GUIDs separados por vírgula, identificando os registros que serão atualizados. |
| attributeName1 | String | Sim | Nome do atributo a ser atualizado nos registros de destino. |
| attributeValue1 | String | Sim | Valor do atributo a ser definido nos registros de destino. |
| attributeNameN | String | Não | Nome de um atributo adicional a ser atualizado. Você pode passar quantos pares nome-valor precisar. |
| attributeValueN | String | Não | Valor do atributo adicional correspondente. |

## Exemplo básico

Imagine que a **Conecta Telecom** precisa atualizar a origem de alguns leads no Dynamics CRM para "Web", indicando que vieram de uma campanha digital:

```ampscript
%%[
SET @guid1 = "A1B2C3D4-E5F6-7890-ABCD-EF1234567890"
SET @guid2 = "B2C3D4E5-F6A7-8901-BCDE-F12345678901"
SET @guid3 = "C3D4E5F6-A7B8-9012-CDEF-123456789012"

SET @guids = Concat(@guid1, ",", @guid2, ",", @guid3)

SET @records_updated = UpdateMscrmRecords(
  "lead",
  @guids,
  "leadsourcecode", "Web"
)
]%%

Total de registros atualizados: %%=V(@records_updated)=%%
```

**Saída:**
```
Total de registros atualizados: 3
```

## Exemplo avançado

Agora um cenário mais completo: a **MegaStore** está rodando uma campanha de Black Friday e quer atualizar vários atributos de contatos no Dynamics CRM. Os leads que se cadastraram na landing page precisam ter a origem atualizada para "Campanha Black Friday", o tópico de interesse para "Ofertas Sazonais" e a descrição com a data da campanha:

```ampscript
%%[
/* GUIDs dos leads capturados na landing page da Black Friday */
SET @guid1 = "D4E5F6A7-B8C9-0123-DEFA-234567890ABC"
SET @guid2 = "E5F6A7B8-C9D0-1234-EFAB-3456789012CD"

SET @guids = Concat(@guid1, ",", @guid2)

/* Atualiza múltiplos atributos de uma vez */
SET @records_updated = UpdateMscrmRecords(
  "lead",
  @guids,
  "leadsourcecode", "Campanha Black Friday",
  "subject", "Ofertas Sazonais",
  "description", "Lead capturado na Black Friday 2024 - 29/11/2024"
)

IF @records_updated > 0 THEN
  SET @mensagem = Concat("Sucesso! ", V(@records_updated), " lead(s) atualizado(s) no Dynamics CRM.")
ELSE
  SET @mensagem = "Nenhum registro foi atualizado. Verifique os GUIDs informados."
ENDIF
]%%

%%=V(@mensagem)=%%
```

**Saída:**
```
Sucesso! 2 lead(s) atualizado(s) no Dynamics CRM.
```

## Observações

- **Integração obrigatória:** essa função só funciona se a sua conta do Salesforce Marketing Cloud estiver com a integração com o Microsoft Dynamics CRM devidamente configurada. Sem isso, a função vai falhar.
- **GUIDs separados por vírgula:** o parâmetro `guidsToUpdate` espera uma string com os GUIDs separados por vírgula. Você pode usar a função [Concat](../string-functions/concat.md) para montar essa lista dinamicamente.
- **Múltiplos atributos:** você pode atualizar vários atributos de uma vez só, bastando adicionar pares nome-valor ao final da chamada da função.
- **Valor de retorno:** a função retorna um número inteiro representando quantos registros foram atualizados com sucesso. Use esse valor para validação — se retornar 0, pode ser que os GUIDs estejam incorretos ou os registros não existam.
- **Uso em contexto:** essa função é voltada para cenários de integração com o Dynamics CRM. Se você trabalha com Salesforce CRM (Sales Cloud / Service Cloud), veja as funções específicas do Salesforce, como [UpdateSingleSalesforceObject](../salesforce-functions/updatesinglesalesforceobject.md).
- **Cuidado com volume:** ao atualizar muitos registros de uma vez, fique atento a possíveis limites de timeout e de chamadas à API do Dynamics CRM.
- **Verificação prévia:** é uma boa prática usar [RetrieveMscrmRecords](../microsoft-dynamics-crm-functions/retrievemscrmrecords.md) antes para confirmar que os registros existem e que os GUIDs estão corretos.

## Funções relacionadas

- [CreateMscrmRecord](../microsoft-dynamics-crm-functions/createmscrmrecord.md) — cria um novo registro em uma entidade do Dynamics CRM.
- [UpsertMscrmRecord](../microsoft-dynamics-crm-functions/upsertmscrmrecord.md) — insere ou atualiza um registro no Dynamics CRM (insert + update).
- [RetrieveMscrmRecords](../microsoft-dynamics-crm-functions/retrievemscrmrecords.md) — recupera registros de uma entidade do Dynamics CRM.
- [RetrieveMscrmRecordsFetchXml](../microsoft-dynamics-crm-functions/retrievemscrmrecordsfetchxml.md) — recupera registros usando FetchXML para consultas mais complexas.
- [SetStateMscrmRecord](../microsoft-dynamics-crm-functions/setstatemscrmrecord.md) — altera o estado de um registro no Dynamics CRM.
- [DescribeMscrmEntityAttributes](../microsoft-dynamics-crm-functions/describemscrmentityattributes.md) — lista os atributos disponíveis de uma entidade do Dynamics CRM.
- [AddMscrmListMember](../microsoft-dynamics-crm-functions/addmscrmlistmember.md) — adiciona um membro a uma lista de marketing no Dynamics CRM.
- [Concat](../string-functions/concat.md) — concatena strings, útil para montar a lista de GUIDs separados por vírgula.
- [V](../utility-functions/v.md) — exibe o valor de uma variável no conteúdo renderizado.