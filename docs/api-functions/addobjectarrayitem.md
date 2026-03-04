---
title: AddObjectArrayItem
sidebar_label: AddObjectArrayItem
description: Adiciona um objeto a uma propriedade de array dentro de um objeto da API do Marketing Cloud.
---

# AddObjectArrayItem

## Descrição

A função `AddObjectArrayItem` adiciona um item a uma propriedade de array dentro de um objeto da API do Marketing Cloud Engagement. É uma função essencial quando você está construindo objetos complexos via AMPscript que possuem propriedades do tipo array — como, por exemplo, adicionar atributos a um subscriber ou itens a uma lista. Você vai usar essa função em conjunto com [CreateObject](../api-functions/createobject.md) e [SetObjectProperty](../api-functions/setobjectproperty.md) para montar objetos completos antes de invocar operações da API.

## Sintaxe

```ampscript
AddObjectArrayItem(apiObject, arrayProperty, itemToAdd)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| apiObject | API Object | Sim | O objeto da API que contém o array que você quer modificar. |
| arrayProperty | String | Sim | O nome da propriedade de array que vai receber o novo item. |
| itemToAdd | String | Sim | O item a ser adicionado ao array. |

## Exemplo básico

Adicionando um atributo personalizado ao objeto Subscriber — neste caso, o nome da cidade de um cliente da Lojas Vitória.

```ampscript
%%[
VAR @subscriber, @attribute

SET @subscriber = CreateObject("Subscriber")
SetObjectProperty(@subscriber, "EmailAddress", "joao.silva@email.com.br")
SetObjectProperty(@subscriber, "SubscriberKey", "joao.silva@email.com.br")

SET @attribute = CreateObject("Attribute")
SetObjectProperty(@attribute, "Name", "Cidade")
SetObjectProperty(@attribute, "Value", "São Paulo")

AddObjectArrayItem(@subscriber, "Attributes", @attribute)
]%%
```

**Saída:**
```
O atributo "Cidade" com valor "São Paulo" é adicionado ao array Attributes do objeto @subscriber.
```

## Exemplo avançado

Cenário real de régua de relacionamento: ao cadastrar um novo subscriber via AMPscript, você precisa passar múltiplos atributos de perfil de uma só vez — nome, cidade e telefone do cliente da Conecta Telecom.

```ampscript
%%[
VAR @subscriber, @attrNome, @attrCidade, @attrTelefone

SET @subscriber = CreateObject("Subscriber")
SetObjectProperty(@subscriber, "EmailAddress", "maria.santos@conectatelecom.com.br")
SetObjectProperty(@subscriber, "SubscriberKey", "maria.santos@conectatelecom.com.br")

/* Atributo: Nome */
SET @attrNome = CreateObject("Attribute")
SetObjectProperty(@attrNome, "Name", "NomeCompleto")
SetObjectProperty(@attrNome, "Value", "Maria Santos")
AddObjectArrayItem(@subscriber, "Attributes", @attrNome)

/* Atributo: Cidade */
SET @attrCidade = CreateObject("Attribute")
SetObjectProperty(@attrCidade, "Name", "Cidade")
SetObjectProperty(@attrCidade, "Value", "Curitiba")
AddObjectArrayItem(@subscriber, "Attributes", @attrCidade)

/* Atributo: Telefone */
SET @attrTelefone = CreateObject("Attribute")
SetObjectProperty(@attrTelefone, "Name", "Telefone")
SetObjectProperty(@attrTelefone, "Value", "(41) 99999-9999")
AddObjectArrayItem(@subscriber, "Attributes", @attrTelefone)

/* Agora o objeto @subscriber está pronto para ser usado com InvokeCreate */
VAR @statusCode, @statusMsg
SET @statusCode = InvokeCreate(@subscriber, @statusMsg, @errorCode)
]%%
```

**Saída:**
```
O objeto @subscriber é montado com três atributos (NomeCompleto, Cidade e Telefone) no array Attributes, pronto para ser criado via InvokeCreate.
```

## Observações

> **💡 Dica:** Cada item que você adiciona ao array precisa ser um objeto criado separadamente com [CreateObject](../api-functions/createobject.md). Você não consegue passar uma string simples diretamente — primeiro crie o objeto, defina suas propriedades com [SetObjectProperty](../api-functions/setobjectproperty.md) e só então use `AddObjectArrayItem` para inseri-lo no array.

> **💡 Dica:** Você pode chamar `AddObjectArrayItem` várias vezes no mesmo array do mesmo objeto. Cada chamada adiciona um novo item ao final do array, como mostrado no exemplo avançado.

> **⚠️ Atenção:** Essa função não tem valor de retorno documentado. Ela modifica o objeto da API diretamente. Certifique-se de que o objeto pai (apiObject) e o item a ser adicionado já foram criados antes de chamar a função.

## Funções relacionadas

- [CreateObject](../api-functions/createobject.md) — cria o objeto da API que será manipulado
- [SetObjectProperty](../api-functions/setobjectproperty.md) — define propriedades simples no objeto
- [InvokeCreate](../api-functions/invokecreate.md) — executa a criação do objeto na API após montá-lo
- [InvokeUpdate](../api-functions/invokeupdate.md) — executa a atualização de um objeto na API
- [InvokeRetrieve](../api-functions/invokeretrieve.md) — recupera objetos da API