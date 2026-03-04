---
title: CreateObject
sidebar_label: CreateObject
description: Cria um objeto da API do Marketing Cloud Engagement para uso com funções de invocação como InvokeCreate e InvokeUpdate.
---

# CreateObject

## Descrição

Cria um objeto da API do Marketing Cloud Engagement. Essa função é o ponto de partida quando você precisa interagir diretamente com a API do SFMC via AMPscript — por exemplo, para criar subscribers, disparar triggered sends ou manipular Data Extensions pela camada de API. O objeto criado é usado em conjunto com funções como [SetObjectProperty](../api-functions/setobjectproperty.md), [AddObjectArrayItem](../api-functions/addobjectarrayitem.md) e as funções de invocação ([InvokeCreate](../api-functions/invokecreate.md), [InvokeUpdate](../api-functions/invokeupdate.md), etc.).

## Sintaxe

```ampscript
CreateObject("objectName")
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| objectName | String | Sim | Nome do objeto da API do Marketing Cloud Engagement que você deseja criar. |

## Exemplo básico

Criando um objeto Subscriber para cadastrar um novo contato da Lojas Vitória:

```ampscript
%%[
VAR @subscriber
SET @subscriber = CreateObject("Subscriber")
SetObjectProperty(@subscriber, "SubscriberKey", "joao.silva@lojasvitoria.com.br")
SetObjectProperty(@subscriber, "EmailAddress", "joao.silva@lojasvitoria.com.br")

VAR @statusCode, @statusMsg
SET @statusCode = InvokeCreate(@subscriber, @statusMsg, @errorCode)
]%%
```

**Saída:**
```
(O subscriber João Silva é criado na conta do Marketing Cloud. Nenhuma saída visível é renderizada no e-mail.)
```

## Exemplo avançado

Cenário de régua de boas-vindas: ao processar uma landing page de cadastro, você cria o subscriber e já o adiciona a uma lista específica de clientes do programa de fidelidade da MegaStore:

```ampscript
%%[
VAR @subscriber, @listObj, @statusCode, @statusMsg, @errorCode
VAR @email, @nome

SET @email = "maria.santos@megastore.com.br"
SET @nome = "Maria Santos"

/* Cria o objeto Subscriber */
SET @subscriber = CreateObject("Subscriber")
SetObjectProperty(@subscriber, "SubscriberKey", @email)
SetObjectProperty(@subscriber, "EmailAddress", @email)

/* Cria o objeto SubscriberList para associar a uma lista */
SET @listObj = CreateObject("SubscriberList")
SetObjectProperty(@listObj, "ID", "12345")
SetObjectProperty(@listObj, "Status", "Active")

/* Adiciona a lista ao subscriber */
AddObjectArrayItem(@subscriber, "Lists", @listObj)

/* Invoca a criação na API */
SET @statusCode = InvokeCreate(@subscriber, @statusMsg, @errorCode)

IF @statusCode == "OK" THEN
  Output(Concat("Bem-vinda, ", @nome, "! Cadastro realizado com sucesso."))
ELSE
  Output(Concat("Erro no cadastro: ", @statusMsg))
ENDIF
]%%
```

**Saída:**
```
Bem-vinda, Maria Santos! Cadastro realizado com sucesso.
```

## Observações

> **⚠️ Atenção:** Um objeto criado com `CreateObject` persiste apenas para **uma única chamada Invoke**. Isso significa que se você criar um objeto Subscriber e utilizá-lo com [InvokeUpdate](../api-functions/invokeupdate.md), por exemplo, não será possível reutilizar esse mesmo objeto para passá-lo a um Triggered Send. Para cada operação distinta, crie um novo objeto.

- `CreateObject` sozinha não faz nada no Marketing Cloud — ela apenas instancia o objeto em memória. Você precisa usar funções complementares como [SetObjectProperty](../api-functions/setobjectproperty.md) para definir propriedades e uma função de invocação para executar a ação.

## Funções relacionadas

- [SetObjectProperty](../api-functions/setobjectproperty.md) — define propriedades no objeto criado
- [AddObjectArrayItem](../api-functions/addobjectarrayitem.md) — adiciona itens a propriedades do tipo array no objeto
- [InvokeCreate](../api-functions/invokecreate.md) — executa a criação do objeto na API
- [InvokeUpdate](../api-functions/invokeupdate.md) — executa a atualização do objeto na API
- [InvokeDelete](../api-functions/invokedelete.md) — executa a exclusão do objeto na API
- [InvokeRetrieve](../api-functions/invokeretrieve.md) — recupera dados de objetos da API
- [InvokeExecute](../api-functions/invokeexecute.md) — executa ações sobre objetos da API
- [InvokePerform](../api-functions/invokeperform.md) — executa operações de perform sobre objetos da API