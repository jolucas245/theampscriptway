---
title: InvokeUpdate
sidebar_label: InvokeUpdate
description: Executa o método Update em um objeto da API do SFMC, permitindo atualizar registros como Subscribers e outros objetos do sistema via AMPscript.
---

# InvokeUpdate

## Descrição

A função `InvokeUpdate` invoca o método Update em um objeto da API do Marketing Cloud. É a função que você usa quando precisa atualizar programaticamente objetos do sistema — como dados de um Subscriber — diretamente via AMPscript, sem precisar recorrer a chamadas SOAP externas. Após a execução, ela armazena a mensagem de status e o código de erro em variáveis AMPscript para que você possa validar se a operação foi bem-sucedida.

## Sintaxe

```ampscript
InvokeUpdate(apiObject, statusMessage, errorCode, updateOptions)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| apiObject | API object | Sim | O objeto da API que será atualizado. |
| statusMessage | Variável AMPscript | Não | Variável que armazena a mensagem de status retornada pela API. |
| errorCode | Variável AMPscript | Não | Variável que armazena o código de erro da resposta (se ocorrer algum). |
| updateOptions | API object | Não | Um objeto API do tipo UpdateOptions com opções adicionais para a operação de update. |

## Exemplo básico

Atualizando o e-mail de um subscriber existente no Marketing Cloud, associando-o a uma Business Unit específica.

```ampscript
%%[
VAR @subscriber, @clientId, @statusMsg, @errorCode

SET @subscriber = CreateObject("Subscriber")
SetObjectProperty(@subscriber, "EmailAddress", "joao.silva@lojasVitoria.com.br")
SetObjectProperty(@subscriber, "SubscriberKey", "JS-00012345")

SET @clientId = CreateObject("ClientID")
SetObjectProperty(@clientId, "ID", "5765432")
SetObjectProperty(@subscriber, "Client", @clientId)

SET @statusMsg = ""
SET @errorCode = ""

InvokeUpdate(@subscriber, @statusMsg, @errorCode)

IF @errorCode == "0" THEN
  Output(Concat("Sucesso! Status: ", @statusMsg))
ELSE
  Output(Concat("Erro ", @errorCode, ": ", @statusMsg))
ENDIF
]%%
```

**Saída:**
```
Sucesso! Status: OK
```

## Exemplo avançado

Cenário de régua de relacionamento: ao processar um e-mail de boas-vindas, você atualiza o endereço de e-mail do subscriber e vincula à Business Unit correta do Grupo Horizonte. O código valida o resultado e exibe uma mensagem apropriada.

```ampscript
%%[
VAR @sub, @cid, @statusMsg, @errorCode
VAR @novoEmail, @subscriberKey, @buId

SET @novoEmail = Lookup("Cadastros_Atualizados", "NovoEmail", "SubscriberKey", _subscriberkey)
SET @subscriberKey = _subscriberkey
SET @buId = "8891234"

IF NOT Empty(@novoEmail) THEN

  SET @sub = CreateObject("Subscriber")
  SetObjectProperty(@sub, "EmailAddress", @novoEmail)
  SetObjectProperty(@sub, "SubscriberKey", @subscriberKey)

  SET @cid = CreateObject("ClientID")
  SetObjectProperty(@cid, "ID", @buId)
  SetObjectProperty(@sub, "Client", @cid)

  SET @statusMsg = ""
  SET @errorCode = ""

  InvokeUpdate(@sub, @statusMsg, @errorCode)

  IF @errorCode == "0" THEN
    Output(Concat("E-mail do subscriber ", @subscriberKey, " atualizado para ", @novoEmail))
  ELSE
    Output(Concat("Falha ao atualizar subscriber ", @subscriberKey, " - Erro ", @errorCode, ": ", @statusMsg))
  ENDIF

ELSE
  Output("Nenhuma atualização de e-mail pendente para este subscriber.")
ENDIF
]%%
```

**Saída:**
```
E-mail do subscriber JS-00012345 atualizado para joao.novo@grupohorizonte.com.br
```

## Observações

- Quando a função executa com sucesso, o código de erro retornado é `0`. Sempre valide essa variável antes de prosseguir com qualquer lógica dependente da atualização.

> **⚠️ Atenção:** O objeto da API precisa ser criado com [CreateObject](../api-functions/createobject.md) e ter suas propriedades definidas com [SetObjectProperty](../api-functions/setobjectproperty.md) antes de ser passado para `InvokeUpdate`. Sem isso, a chamada não terá os dados necessários para a operação.

> **💡 Dica:** Use as variáveis `@statusMsg` e `@errorCode` para implementar tratamento de erros robusto. Em cenários de régua automatizada, isso evita que falhas silenciosas passem despercebidas — registre os erros em uma Data Extension de log para acompanhamento posterior.

## Funções relacionadas

- [CreateObject](../api-functions/createobject.md) — cria o objeto da API que será atualizado
- [SetObjectProperty](../api-functions/setobjectproperty.md) — define as propriedades do objeto antes do update
- [AddObjectArrayItem](../api-functions/addobjectarrayitem.md) — adiciona itens a arrays de objetos da API
- [InvokeCreate](../api-functions/invokecreate.md) — invoca o método Create em um objeto da API
- [InvokeDelete](../api-functions/invokedelete.md) — invoca o método Delete em um objeto da API
- [InvokeRetrieve](../api-functions/invokeretrieve.md) — invoca o método Retrieve em um objeto da API