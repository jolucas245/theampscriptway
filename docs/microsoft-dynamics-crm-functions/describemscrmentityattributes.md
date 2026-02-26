---
title: DescribeMscrmEntityAttributes
sidebar_label: DescribeMscrmEntityAttributes
description: Recupera informações sobre os atributos de uma entidade do Microsoft Dynamics CRM, incluindo nome lógico, nome de exibição, tipo e opções disponíveis.
---

<!-- generated-by-script -->

# DescribeMscrmEntityAttributes

## Descrição

A função `DescribeMscrmEntityAttributes` recupera informações detalhadas sobre os atributos (campos) de uma entidade específica do Microsoft Dynamics CRM. Para cada atributo, ela retorna o nome lógico, o nome de exibição, o tipo do campo e se ele é obrigatório. Se o atributo for do tipo Boolean, status, picklist ou state, a função também retorna uma lista separada por vírgulas com as opções e seus valores de exibição. É muito útil quando você precisa descobrir dinamicamente a estrutura de uma entidade do CRM — por exemplo, para construir formulários dinâmicos em CloudPages ou para documentar os campos disponíveis.

## Sintaxe

```ampscript
DescribeMscrmEntityAttributes(entityName)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|--------|-------------|-----------|
| entityName | String | Sim | O nome da entidade do Microsoft Dynamics CRM da qual você quer recuperar os atributos. Exemplo: `"lead"`, `"contact"`, `"account"`. |

## Retorno

Retorna um rowset (conjunto de linhas) onde cada linha representa um atributo da entidade. Cada linha contém os seguintes campos acessíveis via função [Field](../data-extension-functions/field.md):

| Campo | Descrição |
|-------|-----------|
| `Name` | Nome lógico do atributo |
| `DisplayName` | Nome de exibição do atributo |
| `Type` | Tipo do atributo (ex: String, Boolean, Picklist, DateTime, etc.) |
| `Required` | Se o campo é obrigatório |
| `Options` | Lista separada por vírgulas com as opções disponíveis (para Boolean, status, picklist e state) |

## Exemplo básico

Vamos supor que a **Conecta Telecom** integrou o Dynamics CRM com o Marketing Cloud e quer listar todos os atributos da entidade `lead` para entender quais campos estão disponíveis:

```ampscript
%%[

VAR @fields_rs, @counter, @field_name, @field_displayname, @field_type, @field_required, @field_options

SET @fields_rs = DescribeMscrmEntityAttributes("lead")

FOR @counter = 1 TO RowCount(@fields_rs) DO

  SET @field_name = Field(Row(@fields_rs, @counter), 'Name')
  SET @field_displayname = Field(Row(@fields_rs, @counter), 'DisplayName')
  SET @field_type = Field(Row(@fields_rs, @counter), 'Type')
  SET @field_required = Field(Row(@fields_rs, @counter), 'Required')
  SET @field_options = Field(Row(@fields_rs, @counter), 'Options')

]%%

Campo: %%=V(@field_name)=%% | Exibição: %%=V(@field_displayname)=%% | Tipo: %%=V(@field_type)=%% | Obrigatório: %%=V(@field_required)=%% | Opções: %%=V(@field_options)=%%

%%[ NEXT @counter ]%%
```

**Saída:**
```
Campo: firstname | Exibição: Nome | Tipo: String | Obrigatório: Sim | Opções:
Campo: lastname | Exibição: Sobrenome | Tipo: String | Obrigatório: Sim | Opções:
Campo: emailaddress1 | Exibição: Email | Tipo: String | Obrigatório: Não | Opções:
Campo: telephone1 | Exibição: Telefone Comercial | Tipo: String | Obrigatório: Não | Opções:
Campo: leadsourcecode | Exibição: Origem do Lead | Tipo: Picklist | Obrigatório: Não | Opções: 1,Anúncio;2,Funcionário;3,Feira;4,Indicação;5,Site
Campo: donotphone | Exibição: Não Ligar | Tipo: Boolean | Obrigatório: Não | Opções: 0,Permitir;1,Não Permitir
```

## Exemplo avançado

Imagine que a **Lojas Vitória** precisa construir uma CloudPage que exibe uma tabela HTML formatada apenas com os campos do tipo `Picklist` da entidade `contact`, para que o time de marketing saiba quais opções estão disponíveis nos dropdowns do CRM:

```ampscript
%%[

VAR @fields_rs, @counter, @field_name, @field_displayname, @field_type, @field_required, @field_options

SET @fields_rs = DescribeMscrmEntityAttributes("contact")

]%%

<h2>Campos do tipo Picklist - Entidade Contact</h2>
<table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; font-family: Arial, sans-serif;">
  <tr style="background-color: #2E86C1; color: #FFFFFF;">
    <th>Nome do Campo</th>
    <th>Nome de Exibição</th>
    <th>Obrigatório</th>
    <th>Opções Disponíveis</th>
  </tr>

%%[

FOR @counter = 1 TO RowCount(@fields_rs) DO

  SET @field_name = Field(Row(@fields_rs, @counter), 'Name')
  SET @field_displayname = Field(Row(@fields_rs, @counter), 'DisplayName')
  SET @field_type = Field(Row(@fields_rs, @counter), 'Type')
  SET @field_required = Field(Row(@fields_rs, @counter), 'Required')
  SET @field_options = Field(Row(@fields_rs, @counter), 'Options')

  IF @field_type == "Picklist" THEN

]%%

  <tr>
    <td>%%=V(@field_name)=%%</td>
    <td>%%=V(@field_displayname)=%%</td>
    <td>%%=V(@field_required)=%%</td>
    <td>%%=V(@field_options)=%%</td>
  </tr>

%%[

  ENDIF

NEXT @counter

]%%

</table>
```

**Saída:**
```html
Campos do tipo Picklist - Entidade Contact

| Nome do Campo        | Nome de Exibição       | Obrigatório | Opções Disponíveis                                    |
|----------------------|------------------------|-------------|-------------------------------------------------------|
| preferredcontactmethodcode | Método de Contato Preferido | Não    | 1,Qualquer;2,Email;3,Telefone;4,WhatsApp             |
| customertypecode     | Tipo de Cliente         | Não         | 1,Pessoa Física;2,Pessoa Jurídica;3,Parceiro         |
| gendercode           | Gênero                  | Não         | 1,Masculino;2,Feminino;3,Não Informado               |
```

## Observações

- **Integração obrigatória**: Essa função só funciona se sua conta do Marketing Cloud estiver integrada com o Microsoft Dynamics CRM. Sem essa integração configurada, a função vai gerar erro.
- **Função específica para Dynamics CRM**: Se você usa Salesforce CRM (Sales Cloud), essa função **não** se aplica. Para Salesforce CRM, utilize as funções da família `RetrieveSalesforceObjects` e similares.
- **Nome da entidade**: Use o nome lógico da entidade (em minúsculas), como `"lead"`, `"contact"`, `"account"`, `"opportunity"` — e não o nome de exibição.
- **Campos de picklist e opções**: O campo `Options` retorna os valores no formato `valor,label;valor,label`. Isso é útil para montar dropdowns dinâmicos em CloudPages ou para validar dados antes de enviar ao CRM.
- **Performance**: Dependendo da quantidade de atributos da entidade, o rowset retornado pode ser grande. Use condicionais (como no exemplo avançado) para filtrar apenas os campos relevantes ao seu caso de uso.
- **Uso comum**: Essa função é mais utilizada em cenários de descoberta/documentação ou para construção dinâmica de formulários. Em emails transacionais do dia a dia, dificilmente você vai precisar dela.
- **Rowset vazio**: Se você passar um nome de entidade inexistente, a função pode retornar erro. Valide o nome da entidade antes de chamá-la.

## Funções relacionadas

- [DescribeMscrmEntities](../microsoft-dynamics-crm-functions/describemscrmentities.md) — Lista todas as entidades disponíveis no Dynamics CRM (complementar a esta função)
- [RetrieveMscrmRecords](../microsoft-dynamics-crm-functions/retrievemscrmrecords.md) — Recupera registros de uma entidade do Dynamics CRM
- [RetrieveMscrmRecordsFetchXml](../microsoft-dynamics-crm-functions/retrievemscrmrecordsfetchxml.md) — Recupera registros usando FetchXML para consultas mais complexas
- [CreateMscrmRecord](../microsoft-dynamics-crm-functions/createmscrmrecord.md) — Cria um novo registro em uma entidade do Dynamics CRM
- [UpdateMscrmRecords](../microsoft-dynamics-crm-functions/updatemscrmrecords.md) — Atualiza registros existentes no Dynamics CRM
- [UpsertMscrmRecord](../microsoft-dynamics-crm-functions/upsertmscrmrecord.md) — Insere ou atualiza um registro no Dynamics CRM
- [Row](../data-extension-functions/row.md) — Acessa uma linha específica de um rowset
- [RowCount](../data-extension-functions/rowcount.md) — Retorna a quantidade de linhas em um rowset
- [Field](../data-extension-functions/field.md) — Extrai o valor de um campo específico de uma linha do rowset