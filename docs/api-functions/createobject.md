---
title: CreateObject
sidebar_label: CreateObject
description: Cria um objeto da API do Marketing Cloud Engagement para ser usado em chamadas SOAP API via AMPscript.
---

# CreateObject

## Descrição

A função `CreateObject` cria um objeto da API SOAP do Marketing Cloud Engagement. Pense nela como o primeiro passo para interagir com a API diretamente via AMPscript: você cria o objeto, define suas propriedades com `SetObjectProperty`, e depois executa uma ação (criar, atualizar, deletar, etc.) usando as funções `Invoke`. É importante saber que o objeto criado por `CreateObject` só persiste para **uma única chamada** de Invoke — ou seja, se você criar um objeto Subscriber e atualizá-lo com `InvokeUpdate`, não vai conseguir reutilizar esse mesmo objeto para um Triggered Send, por exemplo.

## Sintaxe

```ampscript
CreateObject(objectName)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|--------|-------------|-----------|
| objectName | String | Sim | O nome do objeto da API do Marketing Cloud que você quer criar. Exemplos: "Subscriber", "DataExtensionObject", "TriggeredSend", etc. |

## Retorno

Retorna uma referência ao objeto da API criado. Você armazena esse retorno em uma variável para depois definir propriedades e passá-lo para funções `Invoke`.

## Exemplo básico

Neste exemplo, criamos um objeto Subscriber na API do Marketing Cloud e definimos suas propriedades básicas:

```ampscript
%%[
VAR @sub, @statusCode, @statusMsg

SET @sub = CreateObject("Subscriber")
SetObjectProperty(@sub, "SubscriberKey", "joao.silva@email.com.br")
SetObjectProperty(@sub, "EmailAddress", "joao.silva@email.com.br")

SET @statusCode = InvokeCreate(@sub, @statusMsg, @errorCode)

IF @statusCode == "OK" THEN
  Output(Concat("Assinante criado com sucesso!"))
ELSE
  Output(Concat("Erro ao criar assinante: ", @statusMsg))
ENDIF
]%%
```

**Saída (em caso de sucesso):**
```
Assinante criado com sucesso!
```

## Exemplo avançado

Imagine que a **Conecta Telecom** quer adicionar novos assinantes a uma lista específica via uma CloudPage de cadastro. O cliente preenche um formulário com nome, e-mail e CPF, e o AMPscript cria o subscriber e o adiciona à lista do programa de pontos:

```ampscript
%%[
VAR @sub, @listSub, @list, @statusCode, @statusMsg, @errorCode
VAR @nome, @email, @cpf

/* Dados vindos do formulário da CloudPage */
SET @nome = RequestParameter("nome")
SET @email = RequestParameter("email")
SET @cpf = RequestParameter("cpf")

/* Cria o objeto Subscriber */
SET @sub = CreateObject("Subscriber")
SetObjectProperty(@sub, "SubscriberKey", @email)
SetObjectProperty(@sub, "EmailAddress", @email)

/* Cria o objeto da lista para associar o subscriber */
SET @list = CreateObject("SubscriberList")
SetObjectProperty(@list, "ID", "12345") /* ID da lista "Programa de Pontos Conecta" */
SetObjectProperty(@list, "Status", "Active")

/* Adiciona a lista como item do array de listas do subscriber */
AddObjectArrayItem(@sub, "Lists", @list)

/* Define atributos personalizados */
SetObjectProperty(@sub, "EmailTypePreference", "HTML")

/* Executa a criação via API */
SET @statusCode = InvokeCreate(@sub, @statusMsg, @errorCode)

IF @statusCode == "OK" THEN
  Output(Concat("Bem-vindo ao Programa de Pontos Conecta, ", @nome, "! "))
  Output(Concat("Seu cadastro com o e-mail ", @email, " foi realizado com sucesso."))
  Output(Concat(" Em breve você receberá ofertas exclusivas e poderá acumular pontos para trocar por descontos na sua fatura!"))
ELSE
  Output(Concat("Ops, tivemos um problema no cadastro. Erro: ", @statusMsg))
  Output(Concat(" Por favor, tente novamente ou entre em contato pelo (11) 3000-5000."))
ENDIF
]%%
```

**Saída (em caso de sucesso):**
```
Bem-vindo ao Programa de Pontos Conecta, João Silva! Seu cadastro com o e-mail joao.silva@email.com.br foi realizado com sucesso. Em breve você receberá ofertas exclusivas e poderá acumular pontos para trocar por descontos na sua fatura!
```

## Observações

- O objeto criado com `CreateObject` **só persiste para uma única chamada Invoke**. Depois que você usa ele em um `InvokeCreate`, `InvokeUpdate`, etc., ele não pode ser reutilizado em outra operação. Se precisar fazer outra ação, crie um novo objeto.
- O nome do objeto (`objectName`) precisa ser um nome válido da API SOAP do Marketing Cloud (ex: `"Subscriber"`, `"TriggeredSendDefinition"`, `"DataExtensionObject"`, `"List"`, `"SubscriberList"`, etc.). Se passar um nome inválido, a chamada vai falhar.
- `CreateObject` sozinho **não faz nada no Marketing Cloud**. Ele só cria o objeto na memória. Você precisa combiná-lo com `SetObjectProperty` para definir propriedades e depois chamar uma função `Invoke` para executar a ação de fato.
- Essa função é mais comumente usada em **CloudPages** e **Landing Pages** onde você precisa interagir com a API do Marketing Cloud diretamente. Em e-mails, o uso é possível mas menos comum e exige cuidado com performance.
- Objetos podem conter outros objetos como propriedades (arrays de objetos). Use [AddObjectArrayItem](../api-functions/addobjectarrayitem.md) para adicionar objetos filhos a propriedades de array.
- Essas funções de API são poderosas mas mais complexas do que as funções simples de Data Extension como `InsertDE` ou `UpdateDE`. Use as funções de API quando precisar de funcionalidades que as funções simples não oferecem (como gerenciar Subscribers, listas, Triggered Sends, etc.).

## Funções relacionadas

- [SetObjectProperty](../api-functions/setobjectproperty.md) — define uma propriedade no objeto criado com `CreateObject`
- [AddObjectArrayItem](../api-functions/addobjectarrayitem.md) — adiciona um item a uma propriedade de array do objeto
- [InvokeCreate](../api-functions/invokecreate.md) — executa a criação do objeto na API do Marketing Cloud
- [InvokeUpdate](../api-functions/invokeupdate.md) — executa a atualização de um objeto existente via API
- [InvokeDelete](../api-functions/invokedelete.md) — executa a exclusão de um objeto via API
- [InvokeRetrieve](../api-functions/invokeretrieve.md) — recupera objetos da API do Marketing Cloud
- [InvokeExecute](../api-functions/invokeexecute.md) — executa uma ação sobre um objeto da API
- [InvokePerform](../api-functions/invokeperform.md) — executa uma operação de perform sobre um objeto da API
- [InsertDE](../data-extension-functions/insertde.md) — alternativa mais simples para inserir dados em Data Extensions
- [UpsertDE](../data-extension-functions/upsertde.md) — alternativa mais simples para inserir/atualizar dados em Data Extensions
- [RequestParameter](../sites-functions/requestparameter.md) — captura parâmetros de formulários em CloudPages
- [RaiseError](../utility-functions/raiseerror.md) — levanta um erro customizado para tratamento de exceções