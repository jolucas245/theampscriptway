---
title: RaiseError
sidebar_label: RaiseError
description: Interrompe o processamento de um e-mail para um subscriber (ou para o job inteiro) e gera uma mensagem de erro personalizada.
---

# RaiseError

## Descrição

A função `RaiseError` interrompe o processamento de um e-mail e exibe uma mensagem de erro personalizada. Você pode usá-la para pular apenas o subscriber atual (continuando o envio para os demais) ou para parar o job de envio inteiro. É ideal para tratar situações onde dados obrigatórios estão faltando — por exemplo, quando um código promocional não é encontrado ou quando um campo essencial está vazio. **Importante:** a Salesforce recomenda que você use essa função apenas para tratamento de erros, e **não** como método de segmentação de subscribers. Para segmentação, prefira query activities e listas de exclusão.

## Sintaxe

```ampscript
RaiseError(errorMessage)
RaiseError(errorMessage, boolSkipCurrentOnly)
RaiseError(errorMessage, boolSkipCurrentOnly, apiErrorCode, apiErrorNumber)
RaiseError(errorMessage, boolSkipCurrentOnly, apiErrorCode, apiErrorNumber, boolPreserveDataExt)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| errorMessage | String | Sim | A mensagem de erro que será exibida quando o erro for disparado. |
| boolSkipCurrentOnly | Boolean | Não | Se `true`, pula apenas o subscriber que causou o erro e continua o job para os demais. Se `false` (padrão), interrompe o job de envio inteiro. |
| apiErrorCode | String | Não | Um código de erro customizado definido por você, útil para integração via API. |
| apiErrorNumber | Number | Não | Um número de erro customizado definido por você, útil para integração via API. |
| boolPreserveDataExt | Boolean | Não | Se `true`, mantém as informações que foram escritas em Data Extensions (via InsertDE, UpdateDE, UpsertDE, DeleteDE) **antes** do erro ocorrer, mesmo que o subscriber seja pulado. Se `false`, essas informações não são preservadas. |

## Exemplo básico

Imagine que você está enviando um e-mail promocional da **Lojas Vitória** e precisa garantir que o subscriber tenha um nome cadastrado. Se o nome estiver vazio, o subscriber é pulado:

```ampscript
%%[
VAR @primeiroNome
SET @primeiroNome = AttributeValue("FirstName")

IF Empty(@primeiroNome) THEN
  RaiseError("Nome do subscriber vazio, pulando envio.", true)
ENDIF
]%%

Olá, %%=v(@primeiroNome)=%%! Aproveite nossas ofertas de Dia das Mães com frete grátis acima de R$299!
```

**Saída (quando o nome está preenchido):**
```
Olá, Maria! Aproveite nossas ofertas de Dia das Mães com frete grátis acima de R$299!
```

**Saída (quando o nome está vazio):**
```
O e-mail não é enviado para esse subscriber. A mensagem de erro "Nome do subscriber vazio, pulando envio." é registrada nos logs do job.
```

## Exemplo avançado

Cenário real: a **MegaStore** está enviando e-mails de Black Friday com cupons personalizados. O código busca o cupom na Data Extension `CuponsBlackFriday`. Se não encontrar, registra o erro em uma DE de log antes de pular o subscriber. As informações de log são preservadas mesmo com o erro:

```ampscript
%%[
VAR @cupomData, @codigoCupom, @valorDesconto, @subscriberKey, @emailAddr

SET @subscriberKey = _subscriberkey
SET @emailAddr = emailaddr

/* Busca o cupom do subscriber na DE */
SET @cupomData = LookupRows("CuponsBlackFriday", "SubscriberKey", @subscriberKey)

IF RowCount(@cupomData) > 0 THEN
  SET @codigoCupom = Field(Row(@cupomData, 1), "CodigoCupom")
  SET @valorDesconto = Field(Row(@cupomData, 1), "ValorDesconto")
ELSE
  /*
    Loga o erro em uma Data Extension antes de disparar o RaiseError.
    Essa é uma boa prática para facilitar o troubleshooting depois.
  */
  InsertDE(
    "LogErrosEnvio",
    "JobID", jobid,
    "EmailName", emailname_,
    "SubscriberKey", @subscriberKey,
    "EmailAddress", @emailAddr,
    "DataErro", Now(),
    "MotivoErro", "Cupom Black Friday nao encontrado"
  )

  /*
    Dispara o erro pulando apenas este subscriber.
    O quinto parâmetro (true) garante que o InsertDE acima
    seja preservado mesmo após o erro.
  */
  RaiseError("Cupom Black Friday nao encontrado para o subscriber.", true, "BF_NO_COUPON", 1001, true)
ENDIF
]%%

<h1>Black Friday MegaStore 🔥</h1>

<p>Fala, %%=v(AttributeValue("FirstName"))=%%!</p>

<p>Seu cupom exclusivo de Black Friday chegou:</p>

<table style="border: 2px dashed #333; padding: 20px; text-align: center;">
  <tr>
    <td>
      <strong>Código:</strong> %%=v(@codigoCupom)=%%<br>
      <strong>Desconto:</strong> %%=FormatCurrency(@valorDesconto, "pt-BR", 2)=%%
    </td>
  </tr>
</table>

<p>Use no site <a href="https://www.megastore.com.br/blackfriday">www.megastore.com.br/blackfriday</a> até 30/11/2024.</p>
```

**Saída (quando o cupom é encontrado):**
```html
<h1>Black Friday MegaStore 🔥</h1>

<p>Fala, Carlos!</p>

<p>Seu cupom exclusivo de Black Friday chegou:</p>

<table style="border: 2px dashed #333; padding: 20px; text-align: center;">
  <tr>
    <td>
      <strong>Código:</strong> BF2024-CARLOS-7X9K<br>
      <strong>Desconto:</strong> R$50,00
    </td>
  </tr>
</table>

<p>Use no site <a href="https://www.megastore.com.br/blackfriday">www.megastore.com.br/blackfriday</a> até 30/11/2024.</p>
```

**Saída (quando o cupom NÃO é encontrado):**
```
O e-mail não é enviado para esse subscriber. O erro "Cupom Black Friday nao encontrado para o subscriber."
é registrado com código "BF_NO_COUPON" e número 1001. A linha de log na DE "LogErrosEnvio" é preservada.
```

## Observações

- **Valor padrão de `boolSkipCurrentOnly`:** Se você não informar o segundo parâmetro, o padrão é `false`, o que significa que **o job inteiro será interrompido**. Na grande maioria dos casos, você vai querer passar `true` para pular apenas o subscriber com problema.
- **Impacto no billing:** E-mails que não são enviados por causa do `RaiseError` **não são contabilizados** no consumo de e-mails da sua conta.
- **Impacto em métricas:** Apesar de não serem cobrados, esses e-mails **aparecem nos relatórios de tracking** como "not sent", pois o Marketing Cloud pré-processa os e-mails antes de tentar enviá-los.
- **Comportamento em Journeys:** Dentro de um Journey Builder, o `RaiseError` remove o subscriber apenas do envio específico onde o erro ocorreu. Ele **não** remove o subscriber de outros envios posteriores na mesma journey.
- **Não use para segmentação:** A Salesforce é bem clara nesse ponto — use query activities e listas de exclusão para filtrar subscribers. O `RaiseError` deve ser usado exclusivamente para tratamento de erros e dados faltantes.
- **Preservação de dados em DEs:** O parâmetro `boolPreserveDataExt` (5º parâmetro) se aplica a operações feitas com funções AMPscript como [InsertDE](../data-extension-functions/insertde.md), [UpdateDE](../data-extension-functions/updatede.md), [UpsertDE](../data-extension-functions/upsertde.md) e [DeleteDE](../data-extension-functions/deletede.md). Se você precisa manter o log de erros, lembre-se de passar `true` nesse parâmetro.
- **Boa prática:** Sempre registre informações em uma Data Extension de log **antes** de chamar `RaiseError`. Isso facilita muito o troubleshooting depois, especialmente em envios grandes.

## Funções relacionadas

- [Empty](../utility-functions/empty.md) — verifica se um valor é vazio, muito útil na condição antes do `RaiseError`
- [IsNull](../utility-functions/isnull.md) — verifica se um valor é nulo, outra condição comum antes de disparar um erro
- [IsNullDefault](../utility-functions/isnulldefault.md) — retorna um valor padrão caso o original seja nulo, alternativa ao `RaiseError` quando você quer um fallback
- [AttributeValue](../utility-functions/attributevalue.md) — recupera atributos do subscriber de forma segura (retorna string vazia em vez de erro se o atributo não existir)
- [InsertDE](../data-extension-functions/insertde.md) — insere dados em uma Data Extension, ideal para logar erros antes de chamar `RaiseError`
- [LookupRows](../data-extension-functions/lookuprows.md) — busca linhas em uma Data Extension, frequentemente usada com `RaiseError` para validar dados
- [RowCount](../data-extension-functions/rowcount.md) — conta as linhas retornadas por um lookup, útil para verificar se há dados antes de decidir se dispara o erro
- [IIF](../utility-functions/iif.md) — avaliação condicional inline, pode ser combinada com `RaiseError` em lógicas simples