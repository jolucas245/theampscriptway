---
title: InvokePerform
sidebar_label: InvokePerform
description: Invoca o método Perform em um API Object do Marketing Cloud e retorna o código de status da API.
---

# InvokePerform

## Descrição

A função `InvokePerform` invoca o método **Perform** em um API Object do Marketing Cloud e retorna o código de status da API. Ela é usada quando você precisa executar uma ação sobre um objeto já criado — como iniciar ou parar uma campanha, disparar um envio ou qualquer outra ação suportada pelo tipo do objeto. O retorno é o código de status da operação (por exemplo, `"OK"`), e uma variável AMPscript captura a mensagem de status detalhada.

## Sintaxe

```ampscript
InvokePerform(@apiObject, "actionToPerform", @statusMessage)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| apiObject | API Object | Sim | O API Object sobre o qual o método Perform será invocado. |
| actionToPerform | String | Sim | A ação a ser executada. Os valores válidos variam conforme o tipo do objeto. |
| statusMessage | Variável AMPscript | Não | Variável AMPscript que armazena a mensagem de status retornada pela API. |

## Exemplo básico

Cenário onde uma campanha de e-mail marketing da MegaStore precisa ser interrompida via AMPscript — por exemplo, ao detectar que o estoque de uma promoção relâmpago acabou.

```ampscript
%%[

VAR @campaign, @statusCode, @statusMessage

SET @campaign = CreateObject("Campaign")
SetObjectProperty(@campaign, "Name", "Promocao Inverno MegaStore")

SET @statusCode = InvokePerform(@campaign, "stop", @statusMessage)

Output(Concat("Status: ", @statusCode))

]%%
```

**Saída:**
```
Status: OK
```

## Exemplo avançado

Em uma régua de relacionamento da Conecta Telecom, uma CloudPage de administração permite que o time de CRM pare uma campanha de retenção. O código verifica o status da operação e, caso falhe, exibe a mensagem de erro para diagnóstico.

```ampscript
%%[

VAR @campaign, @statusCode, @statusMessage

SET @campaign = CreateObject("Campaign")
SetObjectProperty(@campaign, "Name", "Retencao Clientes Conecta Telecom")

SET @statusCode = InvokePerform(@campaign, "stop", @statusMessage)

IF @statusCode == "OK" THEN
  Output(Concat("Campanha parada com sucesso. Status: ", @statusCode))
ELSE
  Output(Concat("Erro ao parar campanha. Status: ", @statusCode))
  Output(Concat("<br>Mensagem: ", @statusMessage))
ENDIF

]%%
```

**Saída (em caso de sucesso):**
```
Campanha parada com sucesso. Status: OK
```

**Saída (em caso de erro):**
```
Erro ao parar campanha. Status: Error
Mensagem: Campaign not found or insufficient permissions
```

## Observações

- O valor retornado por `InvokePerform` é o código de status da API (ex: `"OK"`). Sempre valide esse retorno antes de prosseguir com qualquer lógica dependente.

> **⚠️ Atenção:** Os valores válidos para o parâmetro `actionToPerform` variam conforme o tipo do API Object. Usar uma ação incompatível com o objeto resultará em erro.

> **💡 Dica:** Sempre capture a variável `@statusMessage` e use-a em tratamentos de erro. Quando algo dá errado, essa mensagem é a melhor pista para entender o que aconteceu — especialmente em automações que rodam sem supervisão.

- A função depende de um API Object previamente criado com [CreateObject](../api-functions/createobject.md) e configurado com [SetObjectProperty](../api-functions/setobjectproperty.md). Sem essas etapas, não há objeto sobre o qual executar a ação.

## Funções relacionadas

- [CreateObject](../api-functions/createobject.md) — cria o API Object que será usado no Perform
- [SetObjectProperty](../api-functions/setobjectproperty.md) — define propriedades no objeto antes de invocar a ação
- [AddObjectArrayItem](../api-functions/addobjectarrayitem.md) — adiciona itens a propriedades de array do objeto
- [InvokeCreate](../api-functions/invokecreate.md) — invoca o método Create em um API Object
- [InvokeUpdate](../api-functions/invokeupdate.md) — invoca o método Update em um API Object
- [InvokeDelete](../api-functions/invokedelete.md) — invoca o método Delete em um API Object
- [InvokeRetrieve](../api-functions/invokeretrieve.md) — invoca o método Retrieve em um API Object
- [InvokeExecute](../api-functions/invokeexecute.md) — invoca o método Execute em um API Object