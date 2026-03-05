---
title: DescribeMscrmEntities
sidebar_label: DescribeMscrmEntities
description: Retorna os nomes lógicos e de exibição de todas as entidades de uma conta Microsoft Dynamics CRM.
---

# DescribeMscrmEntities

## Descrição

Retorna os nomes lógicos (logical names) e os nomes de exibição (display names) de todas as entidades disponíveis em uma conta Microsoft Dynamics CRM conectada ao Marketing Cloud. É útil quando você precisa fazer um inventário ou diagnóstico das entidades do CRM - por exemplo, para montar uma página administrativa em CloudPage que liste tudo que está disponível para integração. A função não recebe nenhum parâmetro.

## Sintaxe

```ampscript
DescribeMscrmEntities()
```

## Parâmetros

Esta função não possui parâmetros.

## Exemplo básico

Listando todas as entidades de uma conta Dynamics CRM conectada, exibindo o nome lógico e o nome de exibição de cada uma.

```ampscript
%%[
VAR @entidades, @totalEntidades, @i, @entidade, @nomLogico, @nomExibicao

SET @entidades = DescribeMscrmEntities()
SET @totalEntidades = RowCount(@entidades)

FOR @i = 1 TO @totalEntidades DO
  SET @entidade = Row(@entidades, @i)
  SET @nomLogico = Field(@entidade, "LogicalName")
  SET @nomExibicao = Field(@entidade, "DisplayName")
]%%

Nome lógico: %%=V(@nomLogico)=%% | Nome de exibição: %%=V(@nomExibicao)=%%<br>

%%[
NEXT @i
]%%
```

**Saída:**
```
Nome lógico: account | Nome de exibição: Conta
Nome lógico: contact | Nome de exibição: Contato
Nome lógico: lead | Nome de exibição: Lead
Nome lógico: opportunity | Nome de exibição: Oportunidade
...
```

## Exemplo avançado

Imagine que a equipe do Banco Brasilão precisa de uma CloudPage interna que liste todas as entidades do Dynamics CRM, filtrando apenas aquelas cujo nome de exibição contenha a palavra "Cliente", para facilitar o mapeamento de dados na integração com o Marketing Cloud.

```ampscript
%%[
VAR @entidades, @total, @i, @entidade, @nomLogico, @nomExibicao, @contadorExibidos

SET @entidades = DescribeMscrmEntities()
SET @total = RowCount(@entidades)
SET @contadorExibidos = 0
]%%

<h2>Entidades do Dynamics CRM - Banco Brasilão</h2>
<p>Total de entidades encontradas: %%=V(@total)=%%</p>

<table border="1" cellpadding="5">
  <tr>
    <th>#</th>
    <th>Nome Lógico</th>
    <th>Nome de Exibição</th>
  </tr>

%%[
FOR @i = 1 TO @total DO
  SET @entidade = Row(@entidades, @i)
  SET @nomLogico = Field(@entidade, "LogicalName")
  SET @nomExibicao = Field(@entidade, "DisplayName")

  IF IndexOf(@nomExibicao, "Cliente") > 0 THEN
    SET @contadorExibidos = Add(@contadorExibidos, 1)
]%%

  <tr>
    <td>%%=V(@contadorExibidos)=%%</td>
    <td>%%=V(@nomLogico)=%%</td>
    <td>%%=V(@nomExibicao)=%%</td>
  </tr>

%%[
  ENDIF
NEXT @i
]%%

</table>

<p>Entidades filtradas com "Cliente": %%=V(@contadorExibidos)=%%</p>
```

**Saída:**
```
Entidades do Dynamics CRM - Banco Brasilão
Total de entidades encontradas: 187

#   | Nome Lógico          | Nome de Exibição
1   | customeraddress      | Endereço do Cliente
2   | customerrelationship | Relacionamento do Cliente

Entidades filtradas com "Cliente": 2
```

## Observações

> **💡 Dica:** Essa função é excelente para fins de diagnóstico e documentação. Antes de usar funções como [RetrieveMscrmRecords](../microsoft-dynamics-crm-functions/retrievemscrmrecords.md) ou [CreateMscrmRecord](../microsoft-dynamics-crm-functions/createmscrmrecord.md), rode `DescribeMscrmEntities()` para confirmar quais entidades estão disponíveis e qual o nome lógico exato de cada uma.

> **⚠️ Atenção:** Como a função retorna **todas** as entidades da conta CRM, o volume de dados pode ser grande. Evite usá-la em contexto de envio de e-mail - prefira executá-la em uma CloudPage administrativa para consulta pontual.

- O retorno é um rowset que pode ser percorrido com [Row](../data-extension-functions/row.md) e [Field](../data-extension-functions/field.md), e contado com [RowCount](../data-extension-functions/rowcount.md).
- Para detalhar os atributos de uma entidade específica encontrada, use [DescribeMscrmEntityAttributes](../microsoft-dynamics-crm-functions/describemscrmentityattributes.md).

## Funções relacionadas

- [DescribeMscrmEntityAttributes](../microsoft-dynamics-crm-functions/describemscrmentityattributes.md) - retorna os atributos de uma entidade específica do Dynamics CRM
- [RetrieveMscrmRecords](../microsoft-dynamics-crm-functions/retrievemscrmrecords.md) - recupera registros de uma entidade do CRM
- [RetrieveMscrmRecordsFetchXml](../microsoft-dynamics-crm-functions/retrievemscrmrecordsfetchxml.md) - recupera registros usando FetchXML
- [CreateMscrmRecord](../microsoft-dynamics-crm-functions/createmscrmrecord.md) - cria um registro no Dynamics CRM
- [UpdateMscrmRecords](../microsoft-dynamics-crm-functions/updatemscrmrecords.md) - atualiza registros no CRM
- [UpsertMscrmRecord](../microsoft-dynamics-crm-functions/upsertmscrmrecord.md) - insere ou atualiza um registro no CRM
- [Row](../data-extension-functions/row.md) - acessa uma linha específica do rowset retornado
- [Field](../data-extension-functions/field.md) - extrai o valor de um campo de uma linha
- [RowCount](../data-extension-functions/rowcount.md) - conta o total de linhas no rowset