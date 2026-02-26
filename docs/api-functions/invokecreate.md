---
title: InvokeCreate
sidebar_label: InvokeCreate
description: Invoca o método Create em um objeto da API do Marketing Cloud e retorna um código de status da operação.
---

<!-- generated-by-script -->

# InvokeCreate

## Descrição

A função `InvokeCreate` executa o método **Create** da API SOAP do Marketing Cloud em um objeto de API previamente configurado. Ela retorna um código de status indicando se a criação foi bem-sucedida ou não, além de armazenar a mensagem de status e o código de erro em variáveis AMPscript que você define. É a função que você usa quando precisa criar registros diretamente via API de dentro do AMPscript — por exemplo, disparar um Triggered Send, criar uma Data Extension, ou registrar um subscriber programaticamente.

## Sintaxe

```ampscript
InvokeCreate(@apiObject, @statusMessage, @errorCode, @createOptionsObject)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| apiObject | API Object | Sim | O objeto de API que será criado. Deve ser previamente configurado com `CreateObject` e `SetObjectProperty`. |
| statusMessage | Variável AMPscript | Sim | Variável que armazenará a mensagem de status retornada pela API após a tentativa de criação. |
| errorCode | Variável AMPscript | Sim | Variável que armazenará o código de erro retornado pela API (caso ocorra algum problema). |
| createOptionsObject | API Object | Não | Um objeto `CreateOptions` da API, usado para definir opções adicionais para a operação de criação. |

## Valor de retorno

Retorna um **código de status da API** (string) indicando o resultado da operação — por exemplo, `"OK"` para sucesso ou `"Error"` para falha. As variáveis passadas como `statusMessage` e `errorCode` também são preenchidas com detalhes adicionais sobre o resultado.

## Exemplo básico

Neste exemplo, vamos disparar um Triggered Send para enviar um e-mail transacional de confirmação de pedido para um cliente da loja fictícia "MegaStore".

```ampscript
%%[
/* Cria o objeto TriggeredSendDefinition */
SET @tsDef = CreateObject("TriggeredSendDefinition")
SetObjectProperty(@tsDef, "CustomerKey", "confirmacao_pedido_megastore")

/* Cria o objeto Subscriber */
SET @sub = CreateObject("Subscriber")
SetObjectProperty(@sub, "EmailAddress", "joao.silva@email.com.br")
SetObjectProperty(@sub, "SubscriberKey", "joao.silva@email.com.br")

/* Cria o atributo com o nome do cliente */
SET @attrNome = CreateObject("Attribute")
SetObjectProperty(@attrNome, "Name", "NomeCliente")
SetObjectProperty(@attrNome, "Value", "João Silva")
AddObjectArrayItem(@sub, "Attributes", @attrNome)

/* Cria o atributo com o número do pedido */
SET @attrPedido = CreateObject("Attribute")
SetObjectProperty(@attrPedido, "Name", "NumeroPedido")
SetObjectProperty(@attrPedido, "Value", "PED-2024-78543")
AddObjectArrayItem(@sub, "Attributes", @attrPedido)

/* Cria o objeto TriggeredSend e associa a definição e o subscriber */
SET @ts = CreateObject("TriggeredSend")
SetObjectProperty(@ts, "TriggeredSendDefinition", @tsDef)
AddObjectArrayItem(@ts, "Subscribers", @sub)

/* Invoca a criação (disparo) */
SET @statusCode = InvokeCreate(@ts, @statusMsg, @errorCode)

IF @statusCode == "OK" THEN
  Output(Concat("E-mail disparado com sucesso para João Silva!"))
ELSE
  Output(Concat("Erro ao disparar: ", @statusMsg, " (Código: ", @errorCode, ")"))
ENDIF
]%%
```

**Saída (em caso de sucesso):**
```
E-mail disparado com sucesso para João Silva!
```

**Saída (em caso de erro):**
```
Erro ao disparar: Object reference not set to an instance of an object. (Código: 2)
```

## Exemplo avançado

Cenário real: uma CloudPage do programa de fidelidade "Conecta Pontos" da empresa fictícia "Conecta Telecom". Quando o cliente resgata pontos, a página dispara um e-mail transacional de confirmação do resgate, incluindo múltiplos atributos personalizados.

```ampscript
%%[
/* Dados vindos do formulário da CloudPage */
SET @email = RequestParameter("email")
SET @subscriberKey = RequestParameter("cpf")
SET @nomeCliente = RequestParameter("nome")
SET @pontosResgatados = RequestParameter("pontos")
SET @valorResgate = RequestParameter("valor")
SET @dataResgate = FormatDate(Now(), "dd/MM/yyyy")

/* ---- Monta o TriggeredSendDefinition ---- */
SET @tsDef = CreateObject("TriggeredSendDefinition")
SetObjectProperty(@tsDef, "CustomerKey", "resgate_pontos_conecta")

/* ---- Monta o Subscriber com atributos ---- */
SET @sub = CreateObject("Subscriber")
SetObjectProperty(@sub, "EmailAddress", @email)
SetObjectProperty(@sub, "SubscriberKey", @subscriberKey)

/* Atributo: Nome do cliente */
SET @attr1 = CreateObject("Attribute")
SetObjectProperty(@attr1, "Name", "NomeCliente")
SetObjectProperty(@attr1, "Value", @nomeCliente)
AddObjectArrayItem(@sub, "Attributes", @attr1)

/* Atributo: Pontos resgatados */
SET @attr2 = CreateObject("Attribute")
SetObjectProperty(@attr2, "Name", "PontosResgatados")
SetObjectProperty(@attr2, "Value", @pontosResgatados)
AddObjectArrayItem(@sub, "Attributes", @attr2)

/* Atributo: Valor em reais */
SET @attr3 = CreateObject("Attribute")
SetObjectProperty(@attr3, "Name", "ValorResgate")
SetObjectProperty(@attr3, "Value", Concat("R$ ", @valorResgate))
AddObjectArrayItem(@sub, "Attributes", @attr3)

/* Atributo: Data do resgate */
SET @attr4 = CreateObject("Attribute")
SetObjectProperty(@attr4, "Name", "DataResgate")
SetObjectProperty(@attr4, "Value", @dataResgate)
AddObjectArrayItem(@sub, "Attributes", @attr4)

/* ---- Monta o TriggeredSend ---- */
SET @ts = CreateObject("TriggeredSend")
SetObjectProperty(@ts, "TriggeredSendDefinition", @tsDef)
AddObjectArrayItem(@ts, "Subscribers", @sub)

/* ---- Invoca a criação ---- */
SET @statusCode = InvokeCreate(@ts, @statusMsg, @errorCode)

IF @statusCode == "OK" THEN
  /* Registra o sucesso na Data Extension de log */
  InsertDE(
    "Log_Resgates_Conecta",
    "CPF", @subscriberKey,
    "Email", @email,
    "NomeCliente", @nomeCliente,
    "PontosResgatados", @pontosResgatados,
    "ValorResgate", @valorResgate,
    "DataResgate", @dataResgate,
    "StatusEnvio", "Sucesso",
    "MensagemAPI", @statusMsg
  )
  Output(Concat("<p>Olá, ", @nomeCliente, "! Seu resgate de ", @pontosResgatados, " pontos (R$ ", @valorResgate, ") foi confirmado.</p>"))
  Output("<p>Você receberá um e-mail de confirmação em instantes.</p>")
ELSE
  /* Registra o erro no log */
  InsertDE(
    "Log_Resgates_Conecta",
    "CPF", @subscriberKey,
    "Email", @email,
    "NomeCliente", @nomeCliente,
    "PontosResgatados", @pontosResgatados,
    "ValorResgate", @valorResgate,
    "DataResgate", @dataResgate,
    "StatusEnvio", "Erro",
    "MensagemAPI", @statusMsg,
    "CodigoErro", @errorCode
  )
  Output(Concat("<p>Ops! Ocorreu um erro ao processar seu resgate. Código: ", @errorCode, "</p>"))
  Output(Concat("<p>Detalhe: ", @statusMsg, "</p>"))
  Output("<p>Por favor, tente novamente ou entre em contato com o SAC da Conecta Telecom: 0800 123 4567.</p>")
ENDIF
]%%
```

**Saída (em caso de sucesso):**
```
Olá, Maria Santos! Seu resgate de 5000 pontos (R$ 50,00) foi confirmado.
Você receberá um e-mail de confirmação em instantes.
```

**Saída (em caso de erro):**
```
Ops! Ocorreu um erro ao processar seu resgate. Código: 2
Detalhe: TriggeredSendDefinition not found or not active.
Por favor, tente novamente ou entre em contato com o SAC da Conecta Telecom: 0800 123 4567.
```

## Observações

- **Contexto de uso:** A função `InvokeCreate` funciona em e-mails, CloudPages, Landing Pages e SMS. Porém, o caso de uso mais comum é em **CloudPages** e **Landing Pages**, onde você precisa disparar ações programáticas (como Triggered Sends) a partir de interações do usuário.
- **Objetos de API obrigatórios:** Antes de chamar `InvokeCreate`, você precisa construir o objeto usando [CreateObject](../api-functions/createobject.md), configurar suas propriedades com [SetObjectProperty](../api-functions/setobjectproperty.md) e, quando necessário, adicionar itens de array com [AddObjectArrayItem](../api-functions/addobjectarrayitem.md).
- **Sempre valide o retorno:** Nunca assuma que a criação foi bem-sucedida. Sempre verifique o código de status retornado e trate os erros de forma adequada para o usuário.
- **Triggered Send Definition precisa estar ativa:** Se você estiver disparando um Triggered Send, a TriggeredSendDefinition referenciada pela `CustomerKey` precisa estar no status **Running** (ativa) no Marketing Cloud. Caso contrário, a chamada vai falhar.
- **Códigos de erro:** Os códigos de erro seguem o padrão da API SOAP do Marketing Cloud. Consulte a documentação oficial de [API Error Codes](https://developer.salesforce.com/docs/marketing/marketing-cloud/guide/error-handling.html) para detalhes.
- **O parâmetro `createOptionsObject` é opcional:** Use-o somente quando precisar definir opções avançadas de criação, como `SaveOptions` para controle de comportamento em caso de duplicatas.
- **Performance:** Chamadas via `InvokeCreate` fazem requisições à API SOAP por baixo dos panos. Em cenários de alto volume (como e-mails enviados para milhões de subscribers), evite usar essa função inline no corpo do e-mail — prefira usá-la em CloudPages ou Script Activities.
- **Permissões:** A Business Unit onde o código está sendo executado precisa ter permissões adequadas para criar o tipo de objeto de API em questão.

## Funções relacionadas

- [CreateObject](../api-functions/createobject.md) — Cria uma instância de um objeto da API SOAP para uso com as funções Invoke
- [SetObjectProperty](../api-functions/setobjectproperty.md) — Define propriedades em um objeto da API criado com CreateObject
- [AddObjectArrayItem](../api-functions/addobjectarrayitem.md) — Adiciona itens a propriedades do tipo array em objetos da API
- [InvokeUpdate](../api-functions/invokeupdate.md) — Invoca o método Update em um objeto da API
- [InvokeDelete](../api-functions/invokedelete.md) — Invoca o método Delete em um objeto da API
- [InvokeRetrieve](../api-functions/invokeretrieve.md) — Invoca o método Retrieve para buscar dados de objetos da API
- [InvokeExecute](../api-functions/invokeexecute.md) — Invoca o método Execute em um objeto da API
- [InvokePerform](../api-functions/invokeperform.md) — Invoca o método Perform em um objeto da API
- [InsertDE](../data-extension-functions/insertde.md) — Alternativa mais simples para inserir dados em Data Extensions (sem usar API SOAP)
- [RaiseError](../utility-functions/raiseerror.md) — Útil para interromper a execução e exibir erros customizados quando a criação falha