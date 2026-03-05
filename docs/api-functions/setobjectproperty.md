---
title: SetObjectProperty
sidebar_label: SetObjectProperty
description: Define o valor de uma propriedade em um objeto da API criado com CreateObject.
---

# SetObjectProperty

## Descrição

A função `SetObjectProperty` define o valor de uma propriedade em um objeto da API do Marketing Cloud que foi previamente criado com a função [`CreateObject`](../api-functions/createobject.md). No dia a dia de SFMC, você vai usar essa função sempre que precisar montar objetos da API via AMPscript - por exemplo, para criar subscribers, disparar e-mails ou manipular Data Extensions diretamente pela API. Ela trabalha em conjunto com `CreateObject` e as funções de invocação como `InvokeCreate`.

## Sintaxe

```ampscript
SetObjectProperty(@apiObject, "propertyName", "propertyValue")
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| @apiObject | API Object | Sim | O objeto da API no qual você quer definir a propriedade. Deve ter sido criado previamente com `CreateObject`. |
| propertyName | String | Sim | O nome da propriedade que receberá o valor. |
| propertyValue | String | Sim | O valor que será atribuído à propriedade. |

## Exemplo básico

Criando um objeto Subscriber e definindo o endereço de e-mail de um cliente:

```ampscript
%%[
VAR @assinante
SET @assinante = CreateObject("Subscriber")
SetObjectProperty(@assinante, "EmailAddress", "joao.silva@lojasvitoria.com.br")
]%%
```

**Saída:**
```
(Nenhuma saída visível - o objeto @assinante agora possui a propriedade EmailAddress com o valor "joao.silva@lojasvitoria.com.br")
```

## Exemplo avançado

Montando um objeto Subscriber completo para adicionar um novo cliente da MegaStore à lista de assinantes via API, definindo múltiplas propriedades antes de invocar a criação:

```ampscript
%%[
VAR @assinante, @statusMsg, @errorCode

SET @assinante = CreateObject("Subscriber")
SetObjectProperty(@assinante, "EmailAddress", "maria.santos@megastore.com.br")
SetObjectProperty(@assinante, "SubscriberKey", "MS-2024-00458")

SET @statusMsg = InvokeCreate(@assinante, @createStatus, @errorCode)

IF @createStatus == "OK" THEN
  Output(Concat("Assinante criado com sucesso: ", "maria.santos@megastore.com.br"))
ELSE
  Output(Concat("Erro ao criar assinante. Status: ", @createStatus))
ENDIF
]%%
```

**Saída:**
```
Assinante criado com sucesso: maria.santos@megastore.com.br
```

## Observações

> **💡 Dica:** Você sempre vai usar `SetObjectProperty` em combinação com [`CreateObject`](../api-functions/createobject.md). Primeiro cria o objeto, depois define as propriedades uma a uma com `SetObjectProperty`, e por fim executa a ação desejada com funções como [`InvokeCreate`](../api-functions/invokecreate.md).

> **⚠️ Atenção:** O parâmetro `@apiObject` precisa ser um objeto válido criado por `CreateObject`. Se você tentar usar `SetObjectProperty` em uma variável que não seja um API Object, o código vai gerar erro.

> **💡 Dica:** Quando o objeto precisa de várias propriedades, chame `SetObjectProperty` uma vez para cada propriedade. Não existe sintaxe para definir múltiplas propriedades em uma única chamada - é uma chamada por propriedade.

## Funções relacionadas

- [`CreateObject`](../api-functions/createobject.md) - cria o objeto da API que será configurado com `SetObjectProperty`
- [`AddObjectArrayItem`](../api-functions/addobjectarrayitem.md) - adiciona itens a propriedades do tipo array no objeto
- [`InvokeCreate`](../api-functions/invokecreate.md) - executa a criação do objeto configurado na API
- [`InvokeUpdate`](../api-functions/invokeupdate.md) - executa a atualização de um objeto na API
- [`InvokeDelete`](../api-functions/invokedelete.md) - executa a exclusão de um objeto na API
- [`InvokeRetrieve`](../api-functions/invokeretrieve.md) - recupera dados de um objeto da API