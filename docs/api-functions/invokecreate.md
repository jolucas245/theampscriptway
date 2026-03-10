---
title: InvokeCreate
sidebar_label: InvokeCreate
description: Invoca o método Create em um objeto da API do SFMC e retorna um código de status indicando o resultado da operação.
---

# InvokeCreate

## Descrição

A função `InvokeCreate` executa o método Create em um objeto da API do Marketing Cloud, permitindo que você crie registros diretamente via AMPscript sem precisar de chamadas REST/SOAP externas. Ela retorna um código de status da API e também popula variáveis com a mensagem de status e o código de erro, o que facilita bastante o tratamento de exceções. É essencial para cenários como disparo de Triggered Sends programáticos, criação de Data Extensions ou qualquer operação de criação disponível na API do SFMC.

## Sintaxe

```ampscript
InvokeCreate(apiObject, statusMessage, errorCode, createOptionsObject)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| apiObject | API Object | Sim | O objeto da API que você quer criar. Deve ser montado previamente com [CreateObject](../api-functions/createobject.md) e ter suas propriedades definidas com [SetObjectProperty](../api-functions/setobjectproperty.md). |
| statusMessage | Variável AMPscript | Sim | Variável que vai armazenar a mensagem de status retornada pela API após a tentativa de criação. |
| errorCode | Variável AMPscript | Sim | Variável que vai armazenar o código de erro retornado pela API. |
| createOptionsObject | API Object | Não | Um objeto `CreateOptions` da API, para configurações adicionais na operação de criação. |

## Exemplo básico

Disparando uma Triggered Send para enviar um e-mail transacional de confirmação de pedido para um cliente da MegaStore.

```ampscript
%%[
/* Cria o objeto TriggeredSendDefinition */
SET @tsDef = CreateObject("TriggeredSendDefinition")
SetObjectProperty(@tsDef, "CustomerKey", "megastore_confirmacao_pedido")

/* Cria o objeto TriggeredSend */
SET @ts = CreateObject("TriggeredSend")
SetObjectProperty(@ts, "TriggeredSendDefinition", @tsDef)

/* Cria o Subscriber que vai receber o disparo */
SET @subscriber = CreateObject("Subscriber")
SetObjectProperty(@subscriber, "EmailAddress", "joao.silva@email.com.br")
SetObjectProperty(@subscriber, "SubscriberKey", "joao.silva@email.com.br")

/* Adiciona o subscriber ao TriggeredSend */
AddObjectArrayItem(@ts, "Subscribers", @subscriber)

/* Invoca a criação e captura o retorno */
SET @statusCode = InvokeCreate(@ts, @statusMsg, @errorCode)

IF @statusCode == "OK" THEN
  Output(Concat("Disparo realizado com sucesso para João Silva."))
ELSE
  Output(Concat("Erro: ", @statusMsg, " | Código: ", @errorCode))
ENDIF
]%%
```

**Saída (em caso de sucesso):**
```
Disparo realizado com sucesso para João Silva.
```

**Saída (em caso de erro):**
```
Erro: Object reference not set to an instance of an object. | Código: 2
```

## Exemplo avançado

Cenário de régua de relacionamento da Conecta Telecom: ao acessar uma CloudPage de upgrade de plano, o sistema dispara um e-mail transacional com os dados do novo plano, incluindo atributos personalizados passados via Triggered Send.

```ampscript
%%[
/* Dados do cliente vindos da CloudPage */
SET @email = RequestParameter("email")
SET @nome = RequestParameter("nome")
SET @plano = RequestParameter("plano")
SET @valor = RequestParameter("valor")

/* Monta a TriggeredSendDefinition */
SET @tsDef = CreateObject("TriggeredSendDefinition")
SetObjectProperty(@tsDef, "CustomerKey", "conecta_upgrade_plano")

/* Monta o TriggeredSend */
SET @ts = CreateObject("TriggeredSend")
SetObjectProperty(@ts, "TriggeredSendDefinition", @tsDef)

/* Monta o Subscriber */
SET @subscriber = CreateObject("Subscriber")
SetObjectProperty(@subscriber, "EmailAddress", @email)
SetObjectProperty(@subscriber, "SubscriberKey", @email)

/* Adiciona atributos personalizados ao subscriber */
SET @attrNome = CreateObject("Attribute")
SetObjectProperty(@attrNome, "Name", "PrimeiroNome")
SetObjectProperty(@attrNome, "Value", @nome)
AddObjectArrayItem(@subscriber, "Attributes", @attrNome)

SET @attrPlano = CreateObject("Attribute")
SetObjectProperty(@attrPlano, "Name", "NomePlano")
SetObjectProperty(@attrPlano, "Value", @plano)
AddObjectArrayItem(@subscriber, "Attributes", @attrPlano)

SET @attrValor = CreateObject("Attribute")
SetObjectProperty(@attrValor, "Name", "ValorMensal")
SetObjectProperty(@attrValor, "Value", @valor)
AddObjectArrayItem(@subscriber, "Attributes", @attrValor)

/* Adiciona o subscriber ao TriggeredSend */
AddObjectArrayItem(@ts, "Subscribers", @subscriber)

/* Executa a criação */
SET @statusCode = InvokeCreate(@ts, @statusMsg, @errorCode)

IF @statusCode == "OK" THEN
  Output(Concat("E-mail de upgrade enviado para ", @nome, " (", @email, ")."))
  Output(Concat("<br>Plano: ", @plano, " - R$ ", @valor, "/mês"))
ELSE
  Output(Concat("Falha no disparo. Status: ", @statusCode))
  Output(Concat("<br>Mensagem: ", @statusMsg))
  Output(Concat("<br>Código de erro: ", @errorCode))
ENDIF
]%%
```

**Saída (em caso de sucesso):**
```
E-mail de upgrade enviado para Maria Santos (maria.santos@email.com.br).
Plano: Conecta Ultra 300MB - R$ 149,90/mês
```

**Saída (em caso de erro):**
```
Falha no disparo. Status: Error
Mensagem: TriggeredSendDefinition não encontrada ou inativa.
Código de erro: 180
```

## Observações

- A função `InvokeCreate` retorna um código de status da API. Sempre verifique esse retorno para garantir que a operação foi concluída - nunca assuma que deu certo sem checar.

- As variáveis de `statusMessage` e `errorCode` são populadas automaticamente pela função. Você precisa declará-las como variáveis AMPscript comuns (com `SET` ou apenas referenciando com `@`), e elas serão preenchidas após a execução.

> **💡 Dica:** Sempre monte o fluxo completo na ordem correta: primeiro crie os objetos com [CreateObject](../api-functions/createobject.md), depois defina as propriedades com [SetObjectProperty](../api-functions/setobjectproperty.md), adicione itens de array com [AddObjectArrayItem](../api-functions/addobjectarrayitem.md) quando necessário, e só então chame `InvokeCreate`. Pular qualquer etapa geralmente resulta em erros genéricos difíceis de depurar.

> **⚠️ Atenção:** O quarto parâmetro (`createOptionsObject`) é opcional e aceita um objeto `CreateOptions` da API. Use-o apenas se precisar configurar opções avançadas de criação. Na maioria dos cenários de Triggered Send do dia a dia, os três primeiros parâmetros são suficientes.

> **💡 Dica:** No tratamento de erros, exiba tanto o `statusCode` retornado pela função quanto o `@statusMsg` e `@errorCode`. Essa combinação de informações facilita muito a identificação do problema quando algo dá errado - especialmente em CloudPages onde você pode renderizar o feedback na tela durante o desenvolvimento.

## Funções relacionadas

- [CreateObject](../api-functions/createobject.md) - cria a instância do objeto da API que será passado para `InvokeCreate`
- [SetObjectProperty](../api-functions/setobjectproperty.md) - define as propriedades do objeto antes de invocar a criação
- [AddObjectArrayItem](../api-functions/addobjectarrayitem.md) - adiciona itens em propriedades de array do objeto (como Subscribers)
- [InvokeUpdate](../api-functions/invokeupdate.md) - invoca o método Update em um objeto da API
- [InvokeDelete](../api-functions/invokedelete.md) - invoca o método Delete em um objeto da API
- [InvokeRetrieve](../api-functions/invokeretrieve.md) - invoca o método Retrieve para consultar objetos da API
- [InvokeExecute](../api-functions/invokeexecute.md) - invoca o método Execute em um objeto da API
- [InvokePerform](../api-functions/invokeperform.md) - invoca o método Perform em um objeto da API
- [RaiseError](../utility-functions/raiseerror.md) - útil para interromper a execução quando o `InvokeCreate` retorna erro crítico