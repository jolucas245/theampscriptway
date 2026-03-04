---
title: CreateSalesforceObject
sidebar_label: CreateSalesforceObject
description: Cria um registro em um objeto do Sales Cloud ou Service Cloud e retorna o ID do registro criado.
---

# CreateSalesforceObject

## Descrição

Cria um novo registro em um objeto do Sales Cloud ou Service Cloud integrado via Marketing Cloud Connect, retornando o ID (Salesforce ID) do registro criado. É a função que você usa quando precisa, por exemplo, criar um Lead, um Case ou uma Oportunidade diretamente a partir de um e-mail, CloudPage ou automação no SFMC. Por baixo dos panos, ela dispara uma requisição SOAP para o seu org Salesforce.

## Sintaxe

```ampscript
CreateSalesforceObject(objectName, numFields, fieldName1, fieldValue1 [, fieldName2, fieldValue2, ...])
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| objectName | string | Sim | Nome da API do objeto do Salesforce onde o registro será criado (ex: "Lead", "Contact", "Case"). |
| numFields | string | Sim | Número de campos que serão inseridos. Deve corresponder exatamente à quantidade de pares nome-valor informados. |
| fieldName1 | string | Sim | Nome do campo a ser inserido no objeto. |
| fieldValue1 | string | Sim | Valor a ser inserido no campo correspondente. |
| fieldNameN, fieldValueN | string | Não | Pares adicionais de campo-valor. Você pode adicionar quantos pares forem necessários. |

## Exemplo básico

Criando um Lead no Salesforce com apenas o campo de e-mail, direto de uma ação no Marketing Cloud:

```ampscript
%%[
VAR @leadId
SET @leadId = CreateSalesforceObject("Lead", 1, "Email", "joao.silva@lojasvitoria.com.br")
]%%

Lead criado com ID: %%=V(@leadId)=%%
```

**Saída:**
```
Lead criado com ID: 00Q5g00000A1B2cDEF
```

## Exemplo avançado

Em uma régua de relacionamento de captação de leads, uma CloudPage coleta os dados do visitante e cria automaticamente um Lead no Sales Cloud com nome, sobrenome e e-mail — ideal para times comerciais que trabalham com follow-up rápido:

```ampscript
%%[
VAR @nome, @sobrenome, @email, @empresa, @novoLeadId

SET @nome = RequestParameter("nome")
SET @sobrenome = RequestParameter("sobrenome")
SET @email = RequestParameter("email")
SET @empresa = RequestParameter("empresa")

IF NOT Empty(@nome) AND NOT Empty(@sobrenome) AND NOT Empty(@email) THEN

  SET @novoLeadId = CreateSalesforceObject(
    "Lead", 5,
    "FirstName", @nome,
    "LastName", @sobrenome,
    "Email", @email,
    "Company", @empresa,
    "LeadSource", "CloudPage - Campanha Inverno 2025"
  )

ENDIF
]%%

%%[ IF NOT Empty(@novoLeadId) THEN ]%%
  <p>Obrigado, %%=V(@nome)=%% %%=V(@sobrenome)=%%! Seu cadastro foi realizado com sucesso.</p>
  <p>Protocolo: %%=V(@novoLeadId)=%%</p>
%%[ ELSE ]%%
  <p>Preencha todos os campos obrigatórios para continuar.</p>
%%[ ENDIF ]%%
```

**Saída:**
```
Obrigado, Maria Santos! Seu cadastro foi realizado com sucesso.
Protocolo: 00Q5g00000X7Y8zABC
```

## Observações

> **⚠️ Atenção:** Para usar esta função, é obrigatório ter o **Marketing Cloud Connect** configurado e ativo integrando seu Marketing Cloud ao Sales Cloud ou Service Cloud. Sem essa integração, a função não funciona.

> **⚠️ Atenção:** O valor de `numFields` precisa corresponder **exatamente** ao número de pares campo-valor que você informar. Se passar `3` mas listar apenas 2 pares, ou vice-versa, a função vai falhar.

> **⚠️ Atenção:** A Salesforce recomenda **minimizar o uso desta função em envios de e-mail**. Cada execução dispara uma requisição SOAP para o org Salesforce, e em envios grandes isso pode causar falha na conclusão do envio. Prefira usá-la em CloudPages, Landing Pages ou em envios com audiências menores e controladas.

> **💡 Dica:** As requisições SOAP geradas por esta função **não contam** nos limites de uso de API do seu org Salesforce — mas isso não significa que você deva abusar. O impacto está no tempo de processamento do envio, não na cota de API.

> **💡 Dica:** A função retorna o ID do registro criado. Guarde esse valor em uma variável para exibir como protocolo ao cliente, registrar em uma Data Extension com [InsertDE](../data-extension-functions/insertde.md), ou usar em operações subsequentes com [UpdateSingleSalesforceObject](../salesforce-functions/updatesinglesalesforceobject.md).

## Funções relacionadas

- [UpdateSingleSalesforceObject](../salesforce-functions/updatesinglesalesforceobject.md) — Atualiza um registro existente em um objeto do Salesforce.
- [RetrieveSalesforceObjects](../salesforce-functions/retrievesalesforceobjects.md) — Consulta registros de um objeto do Salesforce.
- [LongSfid](../salesforce-functions/longsfid.md) — Converte um Salesforce ID de 15 para 18 caracteres.
- [Empty](../utility-functions/empty.md) — Verifica se um valor está vazio (útil para validar antes de criar o registro).
- [RequestParameter](../sites-functions/requestparameter.md) — Captura parâmetros de formulário em CloudPages para alimentar a criação do registro.
- [InsertDE](../data-extension-functions/insertde.md) — Insere registros em Data Extensions (alternativa quando não precisa ir para o Sales/Service Cloud).