---
title: InvokeExecute
sidebar_label: InvokeExecute
description: Invoca o método Execute em um API Object do Marketing Cloud e retorna o código de status da API.
---

# InvokeExecute

## Descrição

A função `InvokeExecute` invoca o método Execute em um API Object do Marketing Cloud Engagement, retornando o código de status da API como resultado. É usada quando você precisa executar operações específicas da API que possuem o método Execute - como, por exemplo, registrar um evento de descadastro (LogUnsubEvent). Essa função é parte do fluxo de trabalho com API Objects via AMPscript, onde você primeiro cria o objeto com [CreateObject](../api-functions/createobject.md), configura suas propriedades com [SetObjectProperty](../api-functions/setobjectproperty.md) e então executa a ação com `InvokeExecute`.

## Sintaxe

```ampscript
InvokeExecute(@apiObject, @statusMessage, @requestId)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| @apiObject | API Object | Sim | O API Object sobre o qual o método Execute será invocado. |
| @statusMessage | Variável AMPscript | Não | Variável que armazena a mensagem de status retornada pela API. |
| @requestId | Variável AMPscript | Não | Variável que armazena o ID da requisição (request ID) retornado pela API. |

## Retorno

Retorna o código de status da API (status code) indicando o resultado da operação.

## Exemplo básico

Registrando um evento de descadastro (LogUnsubEvent) para um assinante da Conecta Telecom.

```ampscript
%%[
VAR @logUnsub, @statusCode, @statusMessage, @requestId

SET @logUnsub = CreateObject("ExecuteRequest")
SetObjectProperty(@logUnsub, "Name", "LogUnsubEvent")

VAR @subParam
SET @subParam = CreateObject("APIProperty")
SetObjectProperty(@subParam, "Name", "SubscriberKey")
SetObjectProperty(@subParam, "Value", "joao.silva@conectatelecom.com.br")
AddObjectArrayItem(@logUnsub, "Parameters", @subParam)

VAR @reasonParam
SET @reasonParam = CreateObject("APIProperty")
SetObjectProperty(@reasonParam, "Name", "Reason")
SetObjectProperty(@reasonParam, "Value", "Solicitação do cliente via central de preferências")
AddObjectArrayItem(@logUnsub, "Parameters", @reasonParam)

SET @statusCode = InvokeExecute(@logUnsub, @statusMessage, @requestId)
]%%

Status: %%=V(@statusCode)=%%
Mensagem: %%=V(@statusMessage)=%%
Request ID: %%=V(@requestId)=%%
```

**Saída:**
```
Status: OK
Mensagem: Log Unsub Event completed successfully.
Request ID: a1b2c3d4-e5f6-7890-abcd-ef1234567890
```

## Exemplo avançado

Cenário de uma CloudPage de descadastro para o Banco Brasilão, onde o assinante confirma que quer sair da lista. O código valida o resultado e trata o caso em que o assinante já estava descadastrado.

```ampscript
%%[
VAR @email, @logUnsub, @statusCode, @statusMessage, @requestId
VAR @subParam, @reasonParam

SET @email = RequestParameter("email")

IF Empty(@email) THEN
  RaiseError("E-mail não informado. Não é possível processar o descadastro.", true)
ENDIF

/* Cria o objeto ExecuteRequest para LogUnsubEvent */
SET @logUnsub = CreateObject("ExecuteRequest")
SetObjectProperty(@logUnsub, "Name", "LogUnsubEvent")

/* Parâmetro: SubscriberKey */
SET @subParam = CreateObject("APIProperty")
SetObjectProperty(@subParam, "Name", "SubscriberKey")
SetObjectProperty(@subParam, "Value", @email)
AddObjectArrayItem(@logUnsub, "Parameters", @subParam)

/* Parâmetro: EmailAddress */
VAR @emailParam
SET @emailParam = CreateObject("APIProperty")
SetObjectProperty(@emailParam, "Name", "EmailAddress")
SetObjectProperty(@emailParam, "Value", @email)
AddObjectArrayItem(@logUnsub, "Parameters", @emailParam)

/* Parâmetro: Reason */
SET @reasonParam = CreateObject("APIProperty")
SetObjectProperty(@reasonParam, "Name", "Reason")
SetObjectProperty(@reasonParam, "Value", "Descadastro via página de preferências - Banco Brasilão")
AddObjectArrayItem(@logUnsub, "Parameters", @reasonParam)

/* Executa o LogUnsubEvent */
SET @statusCode = InvokeExecute(@logUnsub, @statusMessage, @requestId)

/* Verifica se a operação foi bem-sucedida ou se já estava descadastrado */
IF @statusCode == "OK" THEN
  SET @resultado = "Pronto! Você foi descadastrado com sucesso das comunicações do Banco Brasilão."
ELSEIF IndexOf(@statusMessage, "already unsubscribed") > 0 THEN
  SET @resultado = "Você já estava descadastrado das nossas comunicações. Nenhuma ação adicional necessária."
ELSE
  SET @resultado = Concat("Não foi possível processar seu descadastro. Por favor, entre em contato pelo (11) 3000-1234. Erro: ", @statusMessage)
ENDIF
]%%

<h2>%%=V(@resultado)=%%</h2>
<p>Protocolo: %%=V(@requestId)=%%</p>
```

**Saída:**
```
Pronto! Você foi descadastrado com sucesso das comunicações do Banco Brasilão.
Protocolo: f8a3b1c2-d4e5-6789-abcd-0123456789ab
```

## Observações

- A função `InvokeExecute` é voltada para API Objects que possuem o método Execute. O caso de uso documentado é o `LogUnsubEvent`, usado para registrar eventos de descadastro programaticamente.

- O retorno da função é o código de status da API. Use as variáveis `@statusMessage` e `@requestId` para capturar detalhes adicionais sobre o resultado da operação - especialmente útil para logs e tratamento de erros.

> **💡 Dica:** Sempre capture o `@requestId` e exiba-o ao assinante como protocolo ou registre-o em uma Data Extension. Em caso de auditoria ou dúvida do cliente, esse ID permite rastrear exatamente o que aconteceu na plataforma.

> **⚠️ Atenção:** A operação pode ser considerada bem-sucedida tanto quando completa normalmente quanto quando o erro retornado indica que o assinante já estava descadastrado. Trate ambos os cenários no seu código para evitar exibir mensagens de erro desnecessárias ao usuário.

- Essa função faz parte de um fluxo que geralmente envolve [CreateObject](../api-functions/createobject.md) para criar o API Object, [SetObjectProperty](../api-functions/setobjectproperty.md) para definir propriedades e [AddObjectArrayItem](../api-functions/addobjectarrayitem.md) para adicionar itens a arrays do objeto.

## Funções relacionadas

- [CreateObject](../api-functions/createobject.md) - cria o API Object que será passado para `InvokeExecute`
- [SetObjectProperty](../api-functions/setobjectproperty.md) - define propriedades no API Object
- [AddObjectArrayItem](../api-functions/addobjectarrayitem.md) - adiciona itens a propriedades de array do objeto
- [InvokeCreate](../api-functions/invokecreate.md) - invoca o método Create em um API Object
- [InvokeUpdate](../api-functions/invokeupdate.md) - invoca o método Update em um API Object
- [InvokeDelete](../api-functions/invokedelete.md) - invoca o método Delete em um API Object
- [InvokeRetrieve](../api-functions/invokeretrieve.md) - invoca o método Retrieve em um API Object
- [InvokePerform](../api-functions/invokeperform.md) - invoca o método Perform em um API Object
- [RaiseError](../utility-functions/raiseerror.md) - interrompe a execução com mensagem de erro personalizada