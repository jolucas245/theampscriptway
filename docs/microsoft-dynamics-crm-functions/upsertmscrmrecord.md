---
title: UpsertMscrmRecord
sidebar_label: UpsertMscrmRecord
description: Faz upsert (atualiza ou cria) um registro no Microsoft Dynamics CRM a partir do AMPscript.
---

# UpsertMscrmRecord

## Descrição

A função `UpsertMscrmRecord` busca um registro no Microsoft Dynamics CRM usando os filtros informados, ordena os resultados e, se encontrar um registro correspondente, atualiza-o com os valores fornecidos. Se não encontrar nenhum registro, ela cria um novo com os dados passados. A função retorna o GUID do registro atualizado ou criado — muito útil para manter dados sincronizados entre o Marketing Cloud e o Dynamics CRM sem precisar verificar manualmente se o registro já existe.

## Sintaxe

```ampscript
UpsertMscrmRecord(
  entityName,
  sortField,
  sortType,
  numPairsForRetrieve,
  filterAttributeName, filterAttributeValue,
  numPairsForUpdate,
  updateAttributeName, updateAttributeValue
)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| entityName | string | Sim | Nome da entidade no Microsoft Dynamics CRM onde o upsert será realizado. |
| sortField | string | Sim | Campo usado para ordenar os resultados da busca. |
| sortType | string | Sim | Direção da ordenação dos resultados. Valores aceitos: `ASC` (crescente) ou `DESC` (decrescente). |
| numPairsForRetrieve | string | Sim | Número de pares nome-valor usados para filtrar (buscar) os registros. |
| filterAttributeName | string | Sim | Nome do atributo usado como filtro na busca da entidade. |
| filterAttributeValue | string | Sim | Valor do atributo usado como filtro na busca da entidade. |
| numPairsForUpdate | string | Sim | Número de pares nome-valor usados para atualizar (ou criar) o registro. |
| updateAttributeName | string | Sim | Nome do atributo a ser atualizado (ou definido na criação) na entidade. |
| updateAttributeValue | string | Sim | Valor do atributo a ser atualizado (ou definido na criação) na entidade. |

## Exemplo básico

Neste cenário, a Lojas Vitória precisa garantir que a conta "LojasVitoria" exista no Dynamics CRM com a cidade correta. Se já existir, atualiza o registro mais recente; se não, cria um novo.

```ampscript
%%[
  VAR @resultado
  SET @resultado = UpsertMscrmRecord(
    "account",
    "createdon", "DESC",
    1,
    "name", "LojasVitoria",
    1,
    "address1_city", "São Paulo"
  )
]%%

GUID do registro: %%=V(@resultado)=%%
```

**Saída:**
```
GUID do registro: a1b2c3d4-e5f6-7890-abcd-ef1234567890
```

## Exemplo avançado

A Conecta Telecom usa o Dynamics CRM para gerenciar contas de clientes corporativos. Neste e-mail de confirmação, o sistema atualiza (ou cria) a conta do cliente no CRM com o telefone mais recente e exibe o identificador do registro ao time interno.

```ampscript
%%[
  VAR @nomeEmpresa, @telefone, @guidRegistro, @mensagem

  SET @nomeEmpresa = "Grupo Horizonte"
  SET @telefone = "(11) 99999-9999"

  SET @guidRegistro = UpsertMscrmRecord(
    "account",
    "createdon", "DESC",
    1,
    "name", @nomeEmpresa,
    2,
    "telephone1", @telefone,
    "address1_city", "Curitiba"
  )

  IF NOT Empty(@guidRegistro) THEN
    SET @mensagem = Concat("Conta '", @nomeEmpresa, "' sincronizada com sucesso. ID: ", @guidRegistro)
  ELSE
    SET @mensagem = Concat("Falha ao sincronizar a conta '", @nomeEmpresa, "' no CRM.")
  ENDIF
]%%

%%=V(@mensagem)=%%
```

**Saída:**
```
Conta 'Grupo Horizonte' sincronizada com sucesso. ID: f9e8d7c6-b5a4-3210-fedc-ba9876543210
```

## Observações

- A função primeiro busca registros com base nos pares de filtro, ordena pelo campo e direção especificados, e opera sobre o **primeiro registro** retornado. Se houver múltiplos registros que atendam ao filtro, apenas o primeiro (após a ordenação) será atualizado.

- O retorno é sempre o **GUID** do registro — seja ele atualizado ou recém-criado.

> **💡 Dica:** Use `sortType` como `DESC` em campos de data (como `createdon`) para garantir que o registro mais recente seja o atualizado, caso existam duplicatas.

> **⚠️ Atenção:** O parâmetro `numPairsForRetrieve` precisa corresponder exatamente à quantidade de pares nome-valor de filtro que você passar a seguir. O mesmo vale para `numPairsForUpdate` em relação aos pares de atualização. Se os números não baterem, o comportamento pode ser inesperado.

## Funções relacionadas

- [CreateMscrmRecord](../microsoft-dynamics-crm-functions/createmscrmrecord.md) — cria um registro no Dynamics CRM (sem verificar se já existe).
- [UpdateMscrmRecords](../microsoft-dynamics-crm-functions/updatemscrmrecords.md) — atualiza registros existentes no Dynamics CRM.
- [RetrieveMscrmRecords](../microsoft-dynamics-crm-functions/retrievemscrmrecords.md) — busca registros no Dynamics CRM.
- [RetrieveMscrmRecordsFetchXml](../microsoft-dynamics-crm-functions/retrievemscrmrecordsfetchxml.md) — busca registros usando FetchXML.
- [SetStateMscrmRecord](../microsoft-dynamics-crm-functions/setstatemscrmrecord.md) — altera o estado de um registro no Dynamics CRM.
- [UpsertDE](../data-extension-functions/upsertde.md) — função análoga de upsert, mas para Data Extensions do Marketing Cloud.