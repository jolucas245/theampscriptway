---
title: InvokeExecute
sidebar_label: InvokeExecute
description: Invoca o método Execute em um objeto da API do Marketing Cloud e retorna o código de status da operação.
---

<!-- generated-by-script -->

# InvokeExecute

## Descrição

A função `InvokeExecute` invoca o método **Execute** em um objeto da API (SOAP) do Marketing Cloud e retorna o código de status da operação. Ela é usada quando você precisa executar ações específicas da API que utilizam o método Execute, como registrar eventos de unsubscribe (`LogUnsubEvent`), iniciar automações, entre outros. O retorno é o código de status da API (por exemplo, `"OK"` para sucesso ou um código de erro), e você pode capturar também a mensagem de status e o ID da requisição em variáveis AMPscript.

## Sintaxe

```ampscript
InvokeExecute(@apiObject, @statusMessage, @requestId)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|----------------|-------------------|-------------|--------------------------------------------------------------|
| @apiObject | API Object | Sim | O objeto da API do Marketing Cloud sobre o qual o método Execute será invocado. |
| @statusMessage | Variável AMPscript | Não | Variável que armazena a mensagem de status retornada pela API. |
| @requestId | Variável AMPscript | Não | Variável que armazena o ID da requisição retornado pela API. |

## Retorno

Retorna o código de status da API como string (por exemplo, `"OK"` em caso de sucesso, ou um código de erro).

## Exemplo básico

Este exemplo registra um evento de unsubscribe (`LogUnsubEvent`) para um assinante que solicitou o descadastramento de uma lista da **Conecta Telecom**.

```ampscript
%%[
/* Cria o objeto LogUnsubEvent */
SET @logUnsub = CreateObject("ExecuteRequest")
SetObjectProperty(@logUnsub, "Name", "LogUnsubEvent")

/* Define o SubscriberKey do assinante */
SET @subscriberKey = "joao.silva@email.com.br"

/* Adiciona os parâmetros do evento */
SET @prop1 = CreateObject("APIProperty")
SetObjectProperty(@prop1, "Name", "SubscriberKey")
SetObjectProperty(@prop1, "Value", @subscriberKey)
AddObjectArrayItem(@logUnsub, "Parameters", @prop1)

SET @prop2 = CreateObject("APIProperty")
SetObjectProperty(@prop2, "Name", "EmailAddress")
SetObjectProperty(@prop2, "Value", "joao.silva@email.com.br")
AddObjectArrayItem(@logUnsub, "Parameters", @prop2)

SET @prop3 = CreateObject("APIProperty")
SetObjectProperty(@prop3, "Name", "Reason")
SetObjectProperty(@prop3, "Value", "Solicitacao via CloudPage - Conecta Telecom")
AddObjectArrayItem(@logUnsub, "Parameters", @prop3)

/* Executa o LogUnsubEvent */
SET @statusCode = InvokeExecute(@logUnsub, @statusMessage, @requestId)

IF @statusCode == "OK" THEN
  Output(Concat("Descadastramento realizado com sucesso para: ", @subscriberKey))
ELSE
  Output(Concat("Erro: ", @statusCode, " - ", @statusMessage))
ENDIF
]%%
```

**Saída (em caso de sucesso):**
```
Descadastramento realizado com sucesso para: joao.silva@email.com.br
```

## Exemplo avançado

Neste cenário mais robusto, uma CloudPage da **Lojas Vitória** processa o descadastramento de um assinante, trata erros específicos (como quando o assinante já está descadastrado) e registra o resultado em uma Data Extension de log.

```ampscript
%%[
/* Captura o e-mail via parâmetro da URL */
SET @email = RequestParameter("email")
SET @subscriberKey = RequestParameter("sk")

IF Empty(@email) OR Empty(@subscriberKey) THEN
  RaiseError("Parametros obrigatorios nao informados.", true)
ENDIF

/* Monta o objeto ExecuteRequest para LogUnsubEvent */
SET @logUnsub = CreateObject("ExecuteRequest")
SetObjectProperty(@logUnsub, "Name", "LogUnsubEvent")

/* SubscriberKey */
SET @paramSK = CreateObject("APIProperty")
SetObjectProperty(@paramSK, "Name", "SubscriberKey")
SetObjectProperty(@paramSK, "Value", @subscriberKey)
AddObjectArrayItem(@logUnsub, "Parameters", @paramSK)

/* EmailAddress */
SET @paramEmail = CreateObject("APIProperty")
SetObjectProperty(@paramEmail, "Name", "EmailAddress")
SetObjectProperty(@paramEmail, "Value", @email)
AddObjectArrayItem(@logUnsub, "Parameters", @paramEmail)

/* Reason */
SET @paramReason = CreateObject("APIProperty")
SetObjectProperty(@paramReason, "Name", "Reason")
SetObjectProperty(@paramReason, "Value", "Descadastro voluntario - Preference Center Lojas Vitoria")
AddObjectArrayItem(@logUnsub, "Parameters", @paramReason)

/* Executa a chamada */
SET @statusCode = InvokeExecute(@logUnsub, @statusMessage, @requestId)

/* 
  Trata o resultado: 
  - "OK" = sucesso
  - Verifica se já estava descadastrado (erro esperado)
*/
SET @sucesso = false

IF @statusCode == "OK" THEN
  SET @sucesso = true
  SET @resultado = "Descadastro realizado com sucesso"
ELSEIF IndexOf(@statusMessage, "already unsubscribed") > 0 THEN
  SET @sucesso = true
  SET @resultado = "Assinante ja estava descadastrado"
ELSE
  SET @resultado = Concat("Erro no descadastro: ", @statusCode, " - ", @statusMessage)
ENDIF

/* Registra o log na Data Extension */
InsertDE(
  "Log_Descadastro_Vitoria",
  "SubscriberKey", @subscriberKey,
  "EmailAddress", @email,
  "StatusCode", @statusCode,
  "StatusMessage", @statusMessage,
  "RequestId", @requestId,
  "Resultado", @resultado,
  "DataProcessamento", FormatDate(Now(), "dd/MM/yyyy HH:mm:ss")
)
]%%

<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Descadastro - Lojas Vitória</title>
</head>
<body>
  <div style="text-align:center; padding:40px; font-family:Arial,sans-serif;">
    %%[IF @sucesso == true THEN]%%
      <h1>Pronto, %%=v(@email)=%%!</h1>
      <p>Você foi descadastrado(a) das comunicações da Lojas Vitória.</p>
      <p>Sentiremos sua falta! Se mudar de ideia, visite 
        <a href="https://www.lojasvitoria.com.br/preferencias">nosso centro de preferências</a>.
      </p>
    %%[ELSE]%%
      <h1>Ops, algo deu errado</h1>
      <p>Não conseguimos processar seu descadastro neste momento.</p>
      <p>Por favor, tente novamente ou entre em contato pelo e-mail 
        <strong>atendimento@lojasvitoria.com.br</strong>.</p>
      <p><small>Código de referência: %%=v(@requestId)=%%</small></p>
    %%[ENDIF]%%
  </div>
</body>
</html>
```

**Saída (assinante descadastrado com sucesso):**
```
Pronto, joao.silva@email.com.br!
Você foi descadastrado(a) das comunicações da Lojas Vitória.
Sentiremos sua falta! Se mudar de ideia, visite nosso centro de preferências.
```

**Saída (assinante já descadastrado anteriormente):**
```
Pronto, joao.silva@email.com.br!
Você foi descadastrado(a) das comunicações da Lojas Vitória.
Sentiremos sua falta! Se mudar de ideia, visite nosso centro de preferências.
```

## Observações

- **Método Execute da API SOAP:** A função `InvokeExecute` corresponde ao método `Execute` da API SOAP do Marketing Cloud. Ela é usada para operações específicas que não se encaixam em Create, Update, Delete ou Retrieve — o caso mais comum é o `LogUnsubEvent`.
- **LogUnsubEvent:** O cenário mais frequente de uso dessa função é registrar programaticamente o descadastramento (unsubscribe) de assinantes, especialmente em CloudPages de Preference Center.
- **Tratamento de erros:** A operação é considerada bem-sucedida quando retorna `"OK"`. Porém, em cenários de `LogUnsubEvent`, é uma boa prática também tratar o caso em que o assinante já estava descadastrado, pois a API pode retornar um código de erro específico nessa situação — mas o resultado funcional é o mesmo.
- **Variáveis de saída:** Embora `@statusMessage` e `@requestId` não sejam obrigatórios, é altamente recomendável usá-los para fins de debug e log. O `@requestId` é especialmente útil para abrir chamados no suporte da Salesforce.
- **Contexto de execução:** Essa função funciona em emails, CloudPages e Landing Pages. Em CloudPages, é o cenário mais comum (formulários de descadastro ou preference centers).
- **Objeto ExecuteRequest:** Para usar `InvokeExecute`, você precisa criar um objeto do tipo `ExecuteRequest` usando [CreateObject](../api-functions/createobject.md) e configurar suas propriedades com [SetObjectProperty](../api-functions/setobjectproperty.md). Os parâmetros do request são adicionados como itens de array via [AddObjectArrayItem](../api-functions/addobjectarrayitem.md).
- **Função avançada:** Essa é uma função de nível avançado. Se você está começando com AMPscript, provavelmente não vai precisar dela no dia a dia. Para cenários simples de unsubscribe, o link de descadastro padrão do Marketing Cloud costuma ser suficiente.

## Funções relacionadas

- [CreateObject](../api-functions/createobject.md) — cria um objeto da API, necessário para montar o request que será executado
- [SetObjectProperty](../api-functions/setobjectproperty.md) — define propriedades no objeto da API (como `Name` do ExecuteRequest)
- [AddObjectArrayItem](../api-functions/addobjectarrayitem.md) — adiciona itens a arrays do objeto (como os parâmetros do LogUnsubEvent)
- [InvokeCreate](../api-functions/invokecreate.md) — invoca o método Create da API SOAP
- [InvokeUpdate](../api-functions/invokeupdate.md) — invoca o método Update da API SOAP
- [InvokeDelete](../api-functions/invokedelete.md) — invoca o método Delete da API SOAP
- [InvokeRetrieve](../api-functions/invokeretrieve.md) — invoca o método Retrieve da API SOAP
- [InvokePerform](../api-functions/invokeperform.md) — invoca o método Perform da API SOAP
- [RaiseError](../utility-functions/raiseerror.md) — levanta um erro e interrompe a execução, útil para validações
- [InsertDE](../data-extension-functions/insertde.md) — insere registros em Data Extensions, útil para logs de operações
- [RequestParameter](../sites-functions/requestparameter.md) — captura parâmetros de formulário ou query string em CloudPages