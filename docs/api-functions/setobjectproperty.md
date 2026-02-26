---
title: SetObjectProperty
sidebar_label: SetObjectProperty
description: Define o valor de uma propriedade em um objeto API criado pela função CreateObject().
---

# SetObjectProperty

## Descrição

A função `SetObjectProperty` define o valor de uma propriedade em um objeto API que foi previamente criado com a função `CreateObject()`. Basicamente, depois de criar um objeto (como um Subscriber, uma DataExtension, um TriggeredSend, etc.), você usa `SetObjectProperty` para preencher cada propriedade desse objeto com os valores desejados. Essa função é essencial no fluxo de trabalho das funções SOAP API do AMPscript — você cria o objeto, define as propriedades e depois invoca uma ação (criar, atualizar, deletar) sobre ele.

## Sintaxe

```ampscript
SetObjectProperty(@apiObject, "propertyName", "propertyValue")
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|----------------|-----------|---------------|----------------|
| @apiObject | API Object | Sim | O objeto API criado pela função `CreateObject()` no qual você quer definir a propriedade. |
| propertyName | String | Sim | O nome da propriedade do objeto API que receberá o valor. |
| propertyValue | String | Sim | O valor que será atribuído à propriedade especificada. |

## Exemplo básico

Este exemplo cria um objeto Subscriber, define o endereço de e-mail e a chave do assinante:

```ampscript
%%[
VAR @sub
SET @sub = CreateObject("Subscriber")
SetObjectProperty(@sub, "EmailAddress", "joao.silva@email.com.br")
SetObjectProperty(@sub, "SubscriberKey", "joao.silva@email.com.br")
]%%
```

**Saída:**
```
(Sem saída visível — o objeto Subscriber é criado em memória com as propriedades EmailAddress e SubscriberKey definidas.)
```

## Exemplo avançado

Cenário real: a **Lojas Vitória** quer adicionar automaticamente um novo assinante a uma lista específica quando ele preenche um formulário em uma CloudPage de cadastro para receber ofertas de Black Friday. O código cria o objeto Subscriber, define suas propriedades e usa `InvokeCreate` para efetivar a criação:

```ampscript
%%[
VAR @sub, @list, @statusCode, @statusMsg

/* Captura os dados do formulário */
VAR @email, @nome
SET @email = RequestParameter("email")
SET @nome = RequestParameter("nome")

/* Cria o objeto Subscriber */
SET @sub = CreateObject("Subscriber")
SetObjectProperty(@sub, "EmailAddress", @email)
SetObjectProperty(@sub, "SubscriberKey", @email)

/* Cria o objeto SubscriberList para associar a uma lista */
SET @list = CreateObject("SubscriberList")
SetObjectProperty(@list, "ID", "12345")
SetObjectProperty(@list, "Status", "Active")

/* Adiciona a lista ao array de Lists do Subscriber */
AddObjectArrayItem(@sub, "Lists", @list)

/* Define atributos adicionais */
VAR @attr
SET @attr = CreateObject("Attribute")
SetObjectProperty(@attr, "Name", "NomeCompleto")
SetObjectProperty(@attr, "Value", @nome)
AddObjectArrayItem(@sub, "Attributes", @attr)

VAR @attrOrigem
SET @attrOrigem = CreateObject("Attribute")
SetObjectProperty(@attrOrigem, "Name", "Origem")
SetObjectProperty(@attrOrigem, "Value", "BlackFriday2024-CloudPage")
AddObjectArrayItem(@sub, "Attributes", @attrOrigem)

/* Invoca a criação do Subscriber */
SET @statusCode = InvokeCreate(@sub, @statusMsg, @errorCode)

IF @statusCode == "OK" THEN
  Output(Concat("Obrigado, ", @nome, "! Você está cadastrado para as ofertas de Black Friday da Lojas Vitória!"))
ELSE
  Output(Concat("Ops, ocorreu um erro: ", @statusMsg))
ENDIF
]%%
```

**Saída (caso de sucesso):**
```
Obrigado, Maria Santos! Você está cadastrado para as ofertas de Black Friday da Lojas Vitória!
```

**Saída (caso de erro):**
```
Ops, ocorreu um erro: [mensagem de erro retornada pelo sistema]
```

## Observações

- A função `SetObjectProperty` **não retorna nenhum valor** e **não gera saída visível**. Ela apenas atribui um valor a uma propriedade do objeto em memória.
- O objeto API precisa **obrigatoriamente** ter sido criado com `CreateObject()` antes de usar `SetObjectProperty`. Caso contrário, ocorrerá um erro.
- O nome da propriedade (`propertyName`) deve corresponder exatamente ao nome definido na API SOAP do Marketing Cloud. Nomes incorretos vão gerar erro na hora de invocar a ação (create, update, etc.).
- Você pode chamar `SetObjectProperty` múltiplas vezes no mesmo objeto para definir diferentes propriedades — cada chamada define uma propriedade por vez.
- Essa função faz parte do fluxo típico das funções SOAP API do AMPscript: **CreateObject → SetObjectProperty → AddObjectArrayItem (se necessário) → InvokeCreate/InvokeUpdate/InvokeDelete**.
- É usada principalmente em **CloudPages**, **Landing Pages** e em cenários de automação onde você precisa manipular objetos do Marketing Cloud diretamente via AMPscript (criar subscribers, disparar triggered sends, gerenciar Data Extensions via API, etc.).
- Cuidado com permissões: algumas operações de API exigem que a Business Unit tenha as devidas permissões habilitadas.

## Funções relacionadas

- [CreateObject](../api-functions/createobject.md) — Cria um objeto API em memória para ser manipulado com SetObjectProperty
- [AddObjectArrayItem](../api-functions/addobjectarrayitem.md) — Adiciona um item a uma propriedade de array de um objeto API
- [InvokeCreate](../api-functions/invokecreate.md) — Executa a criação do objeto API no Marketing Cloud
- [InvokeUpdate](../api-functions/invokeupdate.md) — Executa a atualização de um objeto API existente
- [InvokeDelete](../api-functions/invokedelete.md) — Executa a exclusão de um objeto API
- [InvokeRetrieve](../api-functions/invokeretrieve.md) — Recupera dados de objetos API do Marketing Cloud
- [InvokePerform](../api-functions/invokeperform.md) — Executa uma ação (como start ou stop) em um objeto API
- [RequestParameter](../sites-functions/requestparameter.md) — Captura parâmetros de formulários em CloudPages
- [Output](../utility-functions/output.md) — Exibe conteúdo na página ou e-mail