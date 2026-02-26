---
title: RetrieveSalesforceObjects
sidebar_label: RetrieveSalesforceObjects
description: Recupera dados de objetos do Salesforce CRM diretamente via AMPscript, retornando um rowset com os registros que correspondem aos critérios de filtro especificados.
---

<!-- generated-by-script -->

# RetrieveSalesforceObjects

## Descrição

A função `RetrieveSalesforceObjects` busca informações de objetos do Salesforce CRM (Sales Cloud ou Service Cloud) e retorna os resultados em formato de rowset. Para usá-la, você precisa ter o **Marketing Cloud Connect** configurado e integrado com seu org Salesforce. É muito útil quando você quer personalizar e-mails ou CloudPages com dados que estão no CRM — como informações de contatos, oportunidades, cases, ou qualquer objeto padrão ou customizado.

Os resultados são limitados a **1.000 linhas** para evitar impacto na performance de envio de e-mails. Quando chamada, a função faz uma requisição SOAP para o seu org Salesforce, mas essas requisições **não contam** nos limites de uso de API do seu org.

## Sintaxe

```ampscript
RetrieveSalesforceObjects(
  objectName,
  fieldsToRetrieve,
  queryFieldName1, queryFieldOperator1, queryFieldValue1
  [, queryFieldName2, queryFieldOperator2, queryFieldValue2, ...]
)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| objectName | String | Sim | Nome da API do objeto do Salesforce de onde você quer buscar os dados (ex: `"Contact"`, `"Lead"`, `"Account"`, `"Opportunity"`, `"Objeto_Custom__c"`). |
| fieldsToRetrieve | String | Sim | Lista de campos separados por vírgula que você quer recuperar (ex: `"FirstName,LastName,Email"`). |
| queryFieldName | String | Sim | Nome do campo usado como filtro na consulta. |
| queryFieldOperator | String | Sim | Operador de comparação para o filtro (ex: `"="`, `">"`, `"<"`, `">="`, `"<="`, `"!="`, `"like"`). |
| queryFieldValue | String | Sim | Valor a ser comparado no filtro. |

> Você pode adicionar **conjuntos adicionais** de filtros (queryFieldName, queryFieldOperator, queryFieldValue) como parâmetros extras. Quando há múltiplos filtros, eles são combinados com lógica **AND** (ou seja, todos os critérios precisam ser verdadeiros).

## Exemplo básico

Imagine que a **Conecta Telecom** quer personalizar um e-mail com o nome e telefone do contato que está no Salesforce CRM. O contato é identificado pelo e-mail do assinante:

```ampscript
%%[

SET @email = AttributeValue("EmailAddress")

SET @registros = RetrieveSalesforceObjects(
  "Contact",
  "FirstName,LastName,Phone",
  "Email", "=", @email
)

IF RowCount(@registros) > 0 THEN
  SET @linha = Row(@registros, 1)
  SET @nome = Field(@linha, "FirstName")
  SET @sobrenome = Field(@linha, "LastName")
  SET @telefone = Field(@linha, "Phone")
ELSE
  SET @nome = "Cliente"
  SET @sobrenome = ""
  SET @telefone = ""
ENDIF

]%%

Olá, %%=v(@nome)=%% %%=v(@sobrenome)=%%!

%%[ IF NOT Empty(@telefone) THEN ]%%
Seu telefone cadastrado é: %%=v(@telefone)=%%
%%[ ENDIF ]%%
```

**Saída:**
```
Olá, Maria Santos!

Seu telefone cadastrado é: (11) 99876-5432
```

## Exemplo avançado

A **Lojas Vitória** quer enviar um e-mail para seus vendedores com a lista de oportunidades abertas acima de R$ 50.000 na região Sudeste. Cada vendedor recebe apenas as oportunidades da sua região:

```ampscript
%%[

SET @ownerEmail = AttributeValue("EmailAddress")

/* Busca o ID do vendedor no Salesforce pelo e-mail */
SET @usuarios = RetrieveSalesforceObjects(
  "User",
  "Id,Name",
  "Email", "=", @ownerEmail
)

IF RowCount(@usuarios) > 0 THEN
  SET @userId = Field(Row(@usuarios, 1), "Id")
  SET @nomeVendedor = Field(Row(@usuarios, 1), "Name")

  /* Busca oportunidades abertas do vendedor com valor acima de R$ 50.000 */
  SET @oportunidades = RetrieveSalesforceObjects(
    "Opportunity",
    "Name,Amount,StageName,CloseDate",
    "OwnerId", "=", @userId,
    "StageName", "!=", "Closed Won",
    "Amount", ">", "50000"
  )

  SET @totalOps = RowCount(@oportunidades)

]%%

Olá, %%=v(@nomeVendedor)=%%!

%%[ IF @totalOps > 0 THEN ]%%

Você tem %%=v(@totalOps)=%% oportunidade(s) aberta(s) acima de R$ 50.000:

%%[ FOR @i = 1 TO @totalOps DO

  SET @linha = Row(@oportunidades, @i)
  SET @nomeOp = Field(@linha, "Name")
  SET @valor = Field(@linha, "Amount")
  SET @estagio = Field(@linha, "StageName")
  SET @dataFech = Field(@linha, "CloseDate")

]%%
- %%=v(@nomeOp)=%% | R$ %%=FormatNumber(@valor, "N", 2)=%% | Estágio: %%=v(@estagio)=%% | Previsão: %%=FormatDate(@dataFech, "dd/MM/yyyy")=%%
%%[ NEXT @i ]%%

Acesse o CRM para atualizar suas oportunidades antes do fechamento mensal.

%%[ ELSE ]%%

Nenhuma oportunidade acima de R$ 50.000 encontrada no momento. Bora prospectar! 💪

%%[ ENDIF ]%%

%%[ ELSE ]%%

Não foi possível localizar seu cadastro no Salesforce. Entre em contato com o administrador.

%%[ ENDIF ]%%
```

**Saída:**
```
Olá, Carlos Oliveira!

Você tem 3 oportunidade(s) aberta(s) acima de R$ 50.000:

- Projeto Natal MegaStore | R$ 125.000,00 | Estágio: Negotiation | Previsão: 15/12/2024
- Contrato Anual FarmaRede | R$ 87.500,00 | Estágio: Proposal | Previsão: 20/12/2024
- Expansão Banco Meridional | R$ 210.000,00 | Estágio: Qualification | Previsão: 30/01/2025

Acesse o CRM para atualizar suas oportunidades antes do fechamento mensal.
```

## Observações

- **Requer Marketing Cloud Connect:** Essa função só funciona se o seu Marketing Cloud estiver integrado com o Sales Cloud ou Service Cloud via Marketing Cloud Connect. Sem essa integração, a função não vai funcionar.
- **Limite de 1.000 linhas:** O rowset retornado é limitado a 1.000 registros. Se a sua consulta retornar mais que isso, apenas os primeiros 1.000 serão incluídos. Planeje seus filtros para manter os resultados dentro desse limite.
- **Requisições SOAP, mas sem impacto no limite de API:** As chamadas feitas por essa função usam SOAP API, porém **não são contabilizadas** nos limites de uso de API do seu org Salesforce. Isso é ótimo, mas não abuse — cada chamada adiciona latência ao processamento.
- **Performance em envios:** Como cada execução faz uma chamada SOAP para o Salesforce, usar essa função em envios para grandes volumes pode deixar o processamento bem mais lento. Se possível, considere trazer os dados para uma Data Extension antes do envio usando Automation Studio ou Query Activities.
- **Múltiplos filtros usam AND:** Quando você passa mais de um conjunto de filtro, todos são combinados com lógica AND. Não existe suporte nativo para lógica OR nessa função.
- **Campos de relacionamento:** Use o nome da API do campo exatamente como ele aparece no Salesforce. Para objetos customizados, lembre-se do sufixo `__c` (ex: `"Regiao__c"`).
- **Rowset vazio:** Sempre verifique com `RowCount()` se a consulta retornou resultados antes de tentar acessar linhas com `Row()` e `Field()`. Caso contrário, você pode gerar erros no envio.
- **Use em conjunto com Row() e Field():** Os dados retornados vêm em formato rowset. Você precisa usar [Row](../data-extension-functions/row.md) para acessar uma linha e [Field](../data-extension-functions/field.md) para acessar o valor de um campo específico.

## Funções relacionadas

- [CreateSalesforceObject](../salesforce-functions/createsalesforceobject.md) — Cria um novo registro em um objeto do Salesforce CRM
- [UpdateSingleSalesforceObject](../salesforce-functions/updatesinglesalesforceobject.md) — Atualiza um registro existente em um objeto do Salesforce CRM
- [RetrieveSalesforceJobSources](../salesforce-functions/retrievesalesforcejobsources.md) — Recupera as fontes de dados de jobs do Salesforce
- [LongSfid](../salesforce-functions/longsfid.md) — Converte um Salesforce ID de 15 caracteres para o formato de 18 caracteres
- [Row](../data-extension-functions/row.md) — Acessa uma linha específica dentro de um rowset
- [Field](../data-extension-functions/field.md) — Recupera o valor de um campo específico dentro de uma linha
- [RowCount](../data-extension-functions/rowcount.md) — Retorna o número total de linhas em um rowset
- [LookupRows](../data-extension-functions/lookuprows.md) — Busca linhas em uma Data Extension (alternativa quando os dados já estão no Marketing Cloud)
- [AttributeValue](../utility-functions/attributevalue.md) — Recupera o valor de um atributo do assinante ou coluna da Data Extension de envio