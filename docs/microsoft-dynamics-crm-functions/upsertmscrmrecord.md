---
title: UpsertMscrmRecord
sidebar_label: UpsertMscrmRecord
description: Faz upsert (atualiza ou cria) um registro no Microsoft Dynamics CRM a partir do AMPscript.
---

<!-- generated-by-script -->

# UpsertMscrmRecord

## Descrição

A função `UpsertMscrmRecord` faz um **upsert** em um registro do Microsoft Dynamics CRM — ou seja, ela primeiro tenta buscar um registro existente com base nos filtros que você informar. Se encontrar, atualiza esse registro com os novos valores. Se não encontrar nenhum registro correspondente, cria um novo. Os resultados da busca são ordenados por um campo e direção que você define, e apenas o primeiro registro retornado é considerado para atualização. A função retorna o **GUID** do registro atualizado ou criado.

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
| entityName | string | Sim | Nome da entidade no Microsoft Dynamics CRM onde o upsert será realizado (ex: `account`, `contact`, `lead`). |
| sortField | string | Sim | Campo usado para ordenar os resultados da busca. |
| sortType | string | Sim | Direção da ordenação. Valores aceitos: `ASC` (crescente) ou `DESC` (decrescente). |
| numPairsForRetrieve | string | Sim | Número de pares nome-valor usados para filtrar/buscar registros existentes. |
| filterAttributeName | string | Sim | Nome do atributo usado como filtro na busca. Repita esse par (nome e valor) de acordo com o número informado em `numPairsForRetrieve`. |
| filterAttributeValue | string | Sim | Valor do atributo usado como filtro na busca. |
| numPairsForUpdate | string | Sim | Número de pares nome-valor usados para atualizar (ou criar) o registro. |
| updateAttributeName | string | Sim | Nome do atributo a ser atualizado ou definido na criação do registro. Repita esse par de acordo com `numPairsForUpdate`. |
| updateAttributeValue | string | Sim | Valor do atributo a ser atualizado ou definido na criação do registro. |

## Exemplo básico

Imagine que a **Conecta Telecom** usa o Dynamics CRM para gerenciar contas de clientes corporativos. Você quer garantir que a conta "Conecta Telecom" exista e tenha a cidade correta. Se já existir, atualiza; se não, cria.

```ampscript
%%[
  VAR @resultado

  SET @resultado = UpsertMscrmRecord(
    "account",
    "createdon", "DESC",
    1, "name", "Conecta Telecom",
    1, "address1_city", "São Paulo"
  )
]%%

GUID do registro: %%=V(@resultado)=%%
```

**Saída:**
```
GUID do registro: a1b2c3d4-e5f6-7890-abcd-ef1234567890
```

Aqui, a função busca uma conta (`account`) onde `name` é "Conecta Telecom", ordena pelo campo `createdon` de forma decrescente (pega a mais recente). Se encontrar, atualiza `address1_city` para "São Paulo". Se não encontrar, cria um novo registro com `name` = "Conecta Telecom" e `address1_city` = "São Paulo".

## Exemplo avançado

Agora um cenário mais completo: o **Banco Meridional** precisa manter os dados de contatos de leads atualizados no Dynamics CRM. Durante uma campanha de Dia das Mães, um formulário em CloudPage coleta informações do lead. O código abaixo faz o upsert usando múltiplos pares de filtro e atualização.

```ampscript
%%[
  VAR @email, @nome, @telefone, @cidade, @guidRegistro

  SET @email = "maria.santos@email.com.br"
  SET @nome = "Maria Santos"
  SET @telefone = "(11) 99876-5432"
  SET @cidade = "Campinas"

  /* 
    Busca pelo email do lead (1 par de filtro).
    Ordena por createdon DESC para pegar o mais recente.
    Atualiza (ou cria) com 3 pares: nome completo, telefone e cidade.
  */
  SET @guidRegistro = UpsertMscrmRecord(
    "lead",
    "createdon", "DESC",
    1, "emailaddress1", @email,
    3,
    "fullname", @nome,
    "telephone1", @telefone,
    "address1_city", @cidade
  )

  IF NOT Empty(@guidRegistro) THEN
]%%

<p>Olá, %%=V(@nome)=%%! Seus dados foram atualizados com sucesso.</p>
<p>Aproveite nossa promoção de Dia das Mães com cashback de R$ 50,00!</p>
<p>ID do registro: %%=V(@guidRegistro)=%%</p>

%%[ ELSE ]%%

<p>Ocorreu um erro ao processar seus dados. Tente novamente.</p>

%%[ ENDIF ]%%
```

**Saída (quando o upsert funciona):**
```
Olá, Maria Santos! Seus dados foram atualizados com sucesso.
Aproveite nossa promoção de Dia das Mães com cashback de R$ 50,00!
ID do registro: f9e8d7c6-b5a4-3210-fedc-ba0987654321
```

## Observações

- **Integração obrigatória:** Essa função só funciona se a sua conta do Marketing Cloud estiver integrada com o Microsoft Dynamics CRM. Sem essa integração configurada, a função vai gerar erro.
- **Retorno:** A função retorna o **GUID** (identificador único global) do registro que foi atualizado ou criado no Dynamics CRM.
- **Lógica de busca:** A busca usa os pares de filtro para localizar registros. Os resultados são ordenados pelo `sortField` e `sortType`, e apenas o **primeiro registro** retornado é atualizado.
- **Criação automática:** Se nenhum registro for encontrado com os filtros informados, a função cria um novo registro. Nesse caso, tanto os valores de filtro quanto os valores de atualização são usados para compor o novo registro.
- **Múltiplos pares:** Você pode usar mais de um par nome-valor tanto para filtro quanto para atualização. Basta ajustar `numPairsForRetrieve` e `numPairsForUpdate` de acordo e listar os pares na sequência.
- **Contexto de uso:** Essa é uma função bastante específica para quem trabalha com Dynamics CRM. Se você usa Salesforce CRM (Sales Cloud/Service Cloud), veja as funções da família Salesforce como [CreateSalesforceObject](../salesforce-functions/createsalesforceobject.md).
- **Performance:** Chamadas ao Dynamics CRM são operações externas e podem impactar o tempo de processamento do seu e-mail ou CloudPage. Use com moderação em envios de alto volume.
- **Tratamento de erros:** É uma boa prática verificar se o retorno não está vazio com [Empty](../utility-functions/empty.md) antes de exibir o resultado, como mostrado no exemplo avançado.

## Funções relacionadas

- [CreateMscrmRecord](../microsoft-dynamics-crm-functions/createmscrmrecord.md) — cria um novo registro no Dynamics CRM (sem lógica de busca prévia)
- [UpdateMscrmRecords](../microsoft-dynamics-crm-functions/updatemscrmrecords.md) — atualiza registros existentes no Dynamics CRM
- [RetrieveMscrmRecords](../microsoft-dynamics-crm-functions/retrievemscrmrecords.md) — busca registros no Dynamics CRM
- [RetrieveMscrmRecordsFetchXml](../microsoft-dynamics-crm-functions/retrievemscrmrecordsfetchxml.md) — busca registros no Dynamics CRM usando FetchXML
- [SetStateMscrmRecord](../microsoft-dynamics-crm-functions/setstatemscrmrecord.md) — altera o estado de um registro no Dynamics CRM
- [AddMscrmListMember](../microsoft-dynamics-crm-functions/addmscrmlistmember.md) — adiciona um membro a uma lista de marketing no Dynamics CRM
- [DescribeMscrmEntities](../microsoft-dynamics-crm-functions/describemscrmentities.md) — lista as entidades disponíveis no Dynamics CRM
- [DescribeMscrmEntityAttributes](../microsoft-dynamics-crm-functions/describemscrmentityattributes.md) — lista os atributos de uma entidade do Dynamics CRM
- [UpsertDE](../data-extension-functions/upsertde.md) — faz upsert em Data Extensions (lógica similar, mas para dados internos do SFMC)
- [Empty](../utility-functions/empty.md) — verifica se um valor está vazio (útil para validar o retorno)