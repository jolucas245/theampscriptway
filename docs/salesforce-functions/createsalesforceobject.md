---
title: CreateSalesforceObject
sidebar_label: CreateSalesforceObject
description: Cria um registro em um objeto do Sales Cloud ou Service Cloud e retorna o ID do registro criado.
---

<!-- generated-by-script -->

# CreateSalesforceObject

## Descrição

A função `CreateSalesforceObject` cria um novo registro em um objeto do Salesforce (Sales Cloud ou Service Cloud) e retorna o ID (18 caracteres) do registro recém-criado. Para usá-la, é **obrigatório** ter o Marketing Cloud Connect configurado e integrado com o seu org Salesforce. A função faz uma requisição SOAP ao seu org, e essas requisições **não** contam nos limites de uso de API do org. É ideal para cenários onde você precisa criar leads, casos de suporte, oportunidades ou qualquer outro registro no Salesforce diretamente a partir de um e-mail, CloudPage ou automação no Marketing Cloud.

## Sintaxe

```ampscript
CreateSalesforceObject(objectName, numFields, fieldName1, fieldValue1 [, fieldName2, fieldValue2, ...])
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| objectName | String | Sim | O nome da API do objeto do Salesforce onde o registro será criado (ex: `"Lead"`, `"Contact"`, `"Case"`, `"Opportunity"`, objeto customizado como `"Pedido__c"`). |
| numFields | Inteiro | Sim | O número de campos que serão inseridos. Esse número **deve corresponder** exatamente à quantidade de pares nome-valor informados na função. |
| fieldName1 | String | Sim | O nome da API do campo no objeto do Salesforce. |
| fieldValue1 | String | Sim | O valor a ser inserido no campo correspondente. |
| fieldNameN, fieldValueN | String | Não | Pares adicionais de nome e valor de campo. Você pode adicionar quantos pares forem necessários. |

## Exemplo básico

Criando um Lead no Salesforce apenas com o campo de e-mail:

```ampscript
%%[
VAR @novoLeadId

SET @novoLeadId = CreateSalesforceObject(
  "Lead", 1,
  "Email", "joao.silva@email.com.br"
)
]%%

Lead criado com sucesso! ID: %%=v(@novoLeadId)=%%
```

**Saída:**
```
Lead criado com sucesso! ID: 00Q5f000005mRKaEAM
```

## Exemplo avançado

Imagine que a **Lojas Vitória** está com uma campanha de Dia das Mães numa CloudPage. Quando o cliente preenche um formulário de interesse, o sistema cria um Lead completo no Salesforce com os dados capturados e registra a origem da campanha:

```ampscript
%%[
VAR @nome, @sobrenome, @email, @telefone, @empresa, @leadId

/* Captura os dados do formulário na CloudPage */
SET @nome = RequestParameter("nome")
SET @sobrenome = RequestParameter("sobrenome")
SET @email = RequestParameter("email")
SET @telefone = RequestParameter("telefone")
SET @empresa = RequestParameter("empresa")

IF NOT Empty(@nome) AND NOT Empty(@email) THEN

  SET @leadId = CreateSalesforceObject(
    "Lead", 7,
    "FirstName", @nome,
    "LastName", @sobrenome,
    "Email", @email,
    "Phone", @telefone,
    "Company", @empresa,
    "LeadSource", "CloudPage - Dia das Maes 2025",
    "Description", Concat("Lead capturado via campanha Dia das Maes - Lojas Vitoria em ", FormatDate(Now(), "dd/MM/yyyy HH:mm"))
  )

  /* Registra o ID na Data Extension para controle interno */
  InsertDE(
    "Leads_Campanha_Maes", 
    "LeadId", @leadId, 
    "Email", @email, 
    "DataCriacao", Now()
  )
]%%

<h2>Obrigado, %%=v(@nome)=%%!</h2>
<p>Seu cadastro foi realizado com sucesso. Em breve nossa equipe da Lojas Vitória entra em contato.</p>
<p>Seu protocolo: %%=v(@leadId)=%%</p>

%%[ ELSE ]%%

<p>Por favor, preencha todos os campos obrigatórios.</p>

%%[ ENDIF ]%%
```

**Saída (quando o formulário é preenchido corretamente):**
```html
Obrigado, Maria!
Seu cadastro foi realizado com sucesso. Em breve nossa equipe da Lojas Vitória entra em contato.
Seu protocolo: 00Q5f000005mRKaEAM
```

### Exemplo com objeto customizado

Criando um registro de Case (caso de suporte) para a **Conecta Telecom** quando um assinante responde a um e-mail de pesquisa de satisfação com nota baixa:

```ampscript
%%[
VAR @nota, @contactId, @caseId, @emailAssinante

SET @nota = AttributeValue("NPS_Score")
SET @contactId = AttributeValue("SalesforceContactId")
SET @emailAssinante = AttributeValue("EmailAddress")

IF @nota < 7 THEN

  SET @caseId = CreateSalesforceObject(
    "Case", 5,
    "ContactId", @contactId,
    "Subject", Concat("NPS Detrator - Nota ", @nota, " - Conecta Telecom"),
    "Description", Concat("Cliente ", @emailAssinante, " deu nota ", @nota, " na pesquisa NPS enviada em ", FormatDate(Now(), "dd/MM/yyyy"), ". Necessario contato de retencao."),
    "Origin", "Email - Pesquisa NPS",
    "Priority", "High"
  )

]%%
<p>Recebemos seu feedback. Nossa equipe vai entrar em contato em até 24h.</p>
<p>Protocolo de atendimento: %%=v(@caseId)=%%</p>

%%[ ELSE ]%%

<p>Obrigado pela sua avaliação! Ficamos felizes com a sua nota.</p>

%%[ ENDIF ]%%
```

**Saída (para nota menor que 7):**
```
Recebemos seu feedback. Nossa equipe vai entrar em contato em até 24h.
Protocolo de atendimento: 5005f000009XyZaAAK
```

## Observações

- **Marketing Cloud Connect obrigatório:** essa função **só funciona** se o seu Marketing Cloud estiver integrado ao Sales Cloud ou Service Cloud via Marketing Cloud Connect. Sem essa integração, a função vai gerar erro.
- **Requisições SOAP:** cada chamada da função faz uma requisição SOAP ao seu org Salesforce. Essas requisições **não** contam nos limites de API do org, mas ainda assim têm impacto em performance.
- **Evite usar em envios em massa:** a Salesforce recomenda **minimizar** o uso dessa função em envios de e-mail em larga escala. Usar em sends muito grandes pode fazer o envio falhar ou não ser concluído. Prefira usar em CloudPages, formulários ou envios segmentados menores.
- **O parâmetro `numFields` precisa bater:** se você informar `numFields` como 3, precisa ter exatamente 3 pares de `fieldName`/`fieldValue`. Se o número não bater, a função vai dar erro.
- **Use os nomes de API dos campos:** os nomes dos campos precisam ser os **API Names** do Salesforce (ex: `"FirstName"`, `"LastName"`, `"Custom_Field__c"`), e não os labels exibidos na interface.
- **Campos obrigatórios do objeto:** o Salesforce pode exigir campos obrigatórios dependendo do objeto. Por exemplo, o objeto `Lead` geralmente exige `LastName` e `Company`. Se você não incluir campos obrigatórios, a criação do registro vai falhar.
- **Retorno:** a função retorna o ID do registro criado no Salesforce (formato de 18 caracteres). Você pode armazenar esse valor em uma variável para uso posterior.
- **Tratamento de erros:** considere usar [RaiseError](../utility-functions/raiseerror.md) para capturar cenários de falha e evitar que o subscriber veja uma mensagem de erro genérica.

## Funções relacionadas

- [UpdateSingleSalesforceObject](../salesforce-functions/updatesinglesalesforceobject.md) — Atualiza um registro existente em um objeto do Salesforce.
- [RetrieveSalesforceObjects](../salesforce-functions/retrievesalesforceobjects.md) — Recupera registros de um objeto do Salesforce com base em filtros.
- [LongSfid](../salesforce-functions/longsfid.md) — Converte um Salesforce ID de 15 caracteres para o formato de 18 caracteres.
- [InsertDE](../data-extension-functions/insertde.md) — Insere um registro em uma Data Extension (útil para gravar o ID retornado localmente).
- [UpsertDE](../data-extension-functions/upsertde.md) — Insere ou atualiza um registro em uma Data Extension.
- [RequestParameter](../sites-functions/requestparameter.md) — Captura parâmetros de formulários em CloudPages (muito usado em conjunto).
- [AttributeValue](../utility-functions/attributevalue.md) — Recupera o valor de um atributo do subscriber ou campo da Data Extension de envio.
- [Empty](../utility-functions/empty.md) — Verifica se um valor está vazio (ideal para validações antes de criar o registro).
- [Now](../date-functions/now.md) — Retorna a data e hora atuais (útil para registrar timestamps).
- [FormatDate](../date-functions/formatdate.md) — Formata datas para exibição ou inserção em campos.
- [Concat](../string-functions/concat.md) — Concatena strings (útil para montar descrições e assuntos dinâmicos).