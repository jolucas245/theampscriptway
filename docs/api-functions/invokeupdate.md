---
title: InvokeUpdate
sidebar_label: InvokeUpdate
description: Invoca o método Update da API SOAP do Marketing Cloud para atualizar um objeto da API diretamente via AMPscript.
---

<!-- generated-by-script -->

# InvokeUpdate

## Descrição

A função `InvokeUpdate` executa o método **Update** da API SOAP do Salesforce Marketing Cloud sobre um objeto da API previamente criado e configurado. Ela é usada quando você precisa atualizar registros de objetos do sistema — como Subscribers, Data Extensions gerenciadas via API, listas, entre outros — diretamente pelo AMPscript, sem precisar de uma chamada externa. A função retorna uma mensagem de status e, opcionalmente, um código de erro que você pode capturar em variáveis AMPscript para validar se a operação foi bem-sucedida.

## Sintaxe

```ampscript
InvokeUpdate(@apiObject, @statusMessage, @errorCode)
InvokeUpdate(@apiObject, @statusMessage, @errorCode, @updateOptions)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|----------------|-----------|---------------|----------------|
| apiObject | API Object | Sim | O objeto da API que será atualizado. Deve ser criado previamente com `CreateObject` e configurado com `SetObjectProperty`. |
| statusMessage | Variável AMPscript | Não | Variável que armazenará a mensagem de status retornada pela API após a execução. |
| errorCode | Variável AMPscript | Não | Variável que armazenará o código de erro retornado pela API. Se a execução for bem-sucedida, o valor será `0`. |
| updateOptions | API Object | Não | Um objeto `UpdateOptions` da API, criado com `CreateObject`, que permite configurar opções adicionais para a operação de update. |

## Exemplo básico

Neste exemplo, vamos atualizar o endereço de e-mail de um assinante (Subscriber) existente no Marketing Cloud. Imagine que o João Silva trocou de e-mail e precisamos atualizar o cadastro dele.

```ampscript
%%[
/* Cria o objeto Subscriber */
SET @sub = CreateObject("Subscriber")
SetObjectProperty(@sub, "SubscriberKey", "joao.silva.12345")
SetObjectProperty(@sub, "EmailAddress", "joao.silva.novo@email.com.br")

/* Executa o update */
SET @update_status = InvokeUpdate(@sub, @statusMsg, @errorCode)
]%%

Status: %%=v(@statusMsg)=%%
Código de erro: %%=v(@errorCode)=%%
```

**Saída:**
```
Status: OK
Código de erro: 0
```

## Exemplo avançado

Neste cenário mais completo, a **Conecta Telecom** precisa atualizar o e-mail de um assinante em uma Business Unit específica (conta filha) dentro de uma estrutura Enterprise. Isso é útil quando você trabalha com múltiplas BUs e precisa direcionar a atualização para a unidade correta.

```ampscript
%%[
/* Cria o objeto Subscriber */
SET @sub = CreateObject("Subscriber")
SetObjectProperty(@sub, "SubscriberKey", "maria.santos.67890")
SetObjectProperty(@sub, "EmailAddress", "maria.santos@conectatelecom.com.br")

/* Cria o objeto ClientID para especificar a Business Unit */
SET @clientId = CreateObject("ClientID")
SetObjectProperty(@clientId, "ID", "123456789")

/* Associa o ClientID ao Subscriber */
SetObjectProperty(@sub, "Client", @clientId)

/* Executa o update do assinante na BU específica */
SET @update_result = InvokeUpdate(@sub, @update_sub_status, @update_sub_errorcode)

/* Verifica o resultado */
IF @update_sub_errorcode == "0" THEN
  SET @mensagem = Concat("Cadastro de Maria Santos atualizado com sucesso na BU 123456789!")
ELSE
  SET @mensagem = Concat("Erro ao atualizar cadastro. Status: ", @update_sub_status, " | Código: ", @update_sub_errorcode)
ENDIF
]%%

%%=v(@mensagem)=%%

<br>
Detalhes técnicos:<br>
Status: %%=v(@update_sub_status)=%%<br>
Código de erro: %%=v(@update_sub_errorcode)=%%
```

**Saída (sucesso):**
```
Cadastro de Maria Santos atualizado com sucesso na BU 123456789!

Detalhes técnicos:
Status: OK
Código de erro: 0
```

## Observações

- A função `InvokeUpdate` trabalha com **objetos da API SOAP** do Marketing Cloud. Você precisa primeiro criar o objeto com [CreateObject](../api-functions/createobject.md) e definir suas propriedades com [SetObjectProperty](../api-functions/setobjectproperty.md) antes de chamar o update.
- Se a execução for **bem-sucedida**, o código de erro retornado será `0` e a mensagem de status indicará sucesso (ex: "OK").
- Se o objeto que você está tentando atualizar **não existir**, a API retornará um erro. Certifique-se de que o registro já existe antes de usar `InvokeUpdate`. Se não tiver certeza, considere usar uma lógica de verificação antes da chamada.
- O parâmetro `updateOptions` é **opcional** e permite configurar comportamentos adicionais da operação, como SaveOptions para controle de upsert. Na maioria dos casos de uso simples, você não vai precisar dele.
- Para associar um objeto filho (como `ClientID`) a um objeto pai (como `Subscriber`), use [SetObjectProperty](../api-functions/setobjectproperty.md) passando o objeto filho como valor da propriedade.
- Essa função é mais indicada para **operações sobre objetos do sistema** (Subscribers, Lists, etc.). Para atualizar registros em Data Extensions, geralmente é mais simples usar [UpdateDE](../data-extension-functions/updatede.md) ou [UpdateData](../data-extension-functions/updatedata.md).
- Fique atento ao **contexto de execução**: chamadas à API SOAP via AMPscript podem ter impacto na performance do envio, especialmente em volumes altos. Use com moderação em emails com grandes audiências.
- As variáveis de `statusMessage` e `errorCode` são extremamente úteis para **debug e logging**. Sempre capture esses valores para poder diagnosticar problemas.

## Funções relacionadas

- [CreateObject](../api-functions/createobject.md) — cria um objeto da API SOAP para uso com as funções Invoke
- [SetObjectProperty](../api-functions/setobjectproperty.md) — define propriedades em um objeto da API
- [AddObjectArrayItem](../api-functions/addobjectarrayitem.md) — adiciona itens a uma propriedade de array de um objeto da API
- [InvokeCreate](../api-functions/invokecreate.md) — invoca o método Create da API para criar novos registros
- [InvokeDelete](../api-functions/invokedelete.md) — invoca o método Delete da API para excluir registros
- [InvokeRetrieve](../api-functions/invokeretrieve.md) — invoca o método Retrieve da API para consultar registros
- [InvokeExecute](../api-functions/invokeexecute.md) — invoca o método Execute da API
- [InvokePerform](../api-functions/invokeperform.md) — invoca o método Perform da API
- [UpdateDE](../data-extension-functions/updatede.md) — atualiza registros em uma Data Extension (alternativa mais simples para DEs)
- [UpdateData](../data-extension-functions/updatedata.md) — atualiza dados em uma Data Extension usando nomes de coluna
- [UpsertDE](../data-extension-functions/upsertde.md) — insere ou atualiza registros em uma Data Extension
- [V](../utility-functions/v.md) — exibe o valor de uma variável AMPscript no conteúdo renderizado