---
title: UpdateMscrmRecords
sidebar_label: UpdateMscrmRecords
description: Atualiza um ou mais registros em uma entidade do Microsoft Dynamics CRM e retorna o número de registros atualizados com sucesso.
---

# UpdateMscrmRecords

## Descrição

Atualiza um ou mais registros em uma entidade do Microsoft Dynamics CRM, permitindo modificar múltiplos atributos de uma só vez. Você passa uma lista de GUIDs separados por vírgula e a função aplica as alterações em todos eles, retornando o número de registros que foram atualizados com sucesso. É muito útil quando você precisa fazer atualizações em lote a partir de campanhas de e-mail marketing ou CloudPages que se integram com o Dynamics CRM.

## Sintaxe

```ampscript
UpdateMscrmRecords(entityName, guidsToUpdate, attributeName1, attributeValue1 [, attributeName2, attributeValue2 ...])
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| entityName | string | Sim | Nome da entidade do Microsoft Dynamics CRM que contém os registros a serem atualizados. |
| guidsToUpdate | string | Sim | Lista de GUIDs separados por vírgula identificando os registros que serão atualizados. |
| attributeName1 | string | Sim | Nome do atributo a ser atualizado nos registros de destino. |
| attributeValue1 | string | Sim | Valor do atributo a ser atualizado nos registros de destino. Você pode passar múltiplos pares nome-valor adicionando-os ao final da função (attributeName2, attributeValue2 ...). |

## Exemplo básico

Atualizando a origem do lead para "Web" em vários registros de leads capturados por uma campanha da Lojas Vitória.

```ampscript
%%[
VAR @numAtualizados

SET @numAtualizados = UpdateMscrmRecords(
  "lead",
  "a1b2c3d4-e5f6-7890-abcd-ef1234567890,b2c3d4e5-f6a7-8901-bcde-f12345678901,c3d4e5f6-a7b8-9012-cdef-123456789012",
  "leadsourcecode", "Web"
)
]%%

Registros atualizados: %%=V(@numAtualizados)=%%
```

**Saída:**
```
Registros atualizados: 3
```

## Exemplo avançado

Cenário de régua de relacionamento: após um cliente da Conecta Telecom preencher um formulário de interesse em um plano empresarial, o sistema atualiza os registros de contato no Dynamics CRM com a origem da campanha e a cidade informada.

```ampscript
%%[
VAR @guid1, @guid2, @listaGuids, @numAtualizados, @origemCampanha, @cidade

SET @guid1 = "d4e5f6a7-b8c9-0123-def0-456789abcdef"
SET @guid2 = "e5f6a7b8-c9d0-1234-ef01-56789abcdef0"
SET @listaGuids = Concat(@guid1, ",", @guid2)

SET @origemCampanha = "Campanha Plano Empresarial 2024"
SET @cidade = "São Paulo"

SET @numAtualizados = UpdateMscrmRecords(
  "contact",
  @listaGuids,
  "leadsourcecode", "Web",
  "campaignorigin", @origemCampanha,
  "address1_city", @cidade
)

IF @numAtualizados > 0 THEN
  Output(Concat("Sucesso! ", @numAtualizados, " contato(s) atualizado(s) no Dynamics CRM."))
ELSE
  Output("Nenhum registro foi atualizado. Verifique os GUIDs informados.")
ENDIF
]%%
```

**Saída:**
```
Sucesso! 2 contato(s) atualizado(s) no Dynamics CRM.
```

## Observações

- A função retorna o número de registros atualizados com sucesso. Utilize esse retorno para validar se a operação foi concluída conforme o esperado.

- Você pode passar múltiplos pares de atributo nome-valor, adicionando-os ao final da chamada da função. Isso permite atualizar vários campos de uma só vez sem precisar fazer múltiplas chamadas.

> **💡 Dica:** Use a função [Concat](../string-functions/concat.md) para montar dinamicamente a lista de GUIDs separados por vírgula, especialmente quando os identificadores vêm de consultas ou variáveis diferentes.

> **⚠️ Atenção:** Certifique-se de que os GUIDs informados existem na entidade especificada. Registros não encontrados não serão contabilizados no retorno.

## Funções relacionadas

- [CreateMscrmRecord](../microsoft-dynamics-crm-functions/createmscrmrecord.md) — cria um novo registro no Dynamics CRM
- [UpsertMscrmRecord](../microsoft-dynamics-crm-functions/upsertmscrmrecord.md) — insere ou atualiza um registro no Dynamics CRM
- [RetrieveMscrmRecords](../microsoft-dynamics-crm-functions/retrievemscrmrecords.md) — consulta registros no Dynamics CRM
- [RetrieveMscrmRecordsFetchXml](../microsoft-dynamics-crm-functions/retrievemscrmrecordsfetchxml.md) — consulta registros usando FetchXML
- [SetStateMscrmRecord](../microsoft-dynamics-crm-functions/setstatemscrmrecord.md) — altera o estado de um registro no Dynamics CRM
- [DescribeMscrmEntities](../microsoft-dynamics-crm-functions/describemscrmentities.md) — lista as entidades disponíveis no Dynamics CRM
- [DescribeMscrmEntityAttributes](../microsoft-dynamics-crm-functions/describemscrmentityattributes.md) — lista os atributos de uma entidade
- [Concat](../string-functions/concat.md) — útil para montar a lista de GUIDs dinamicamente