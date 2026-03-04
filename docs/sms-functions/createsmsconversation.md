---
title: CreateSmsConversation
sidebar_label: CreateSmsConversation
description: Cria uma conversa SMS com um contato no MobileConnect, definindo o próximo keyword da interação.
---

# CreateSmsConversation

## Descrição

Cria uma conversa SMS com um contato no MobileConnect, passando o número de origem (short code ou long code), o número do destinatário, o próximo keyword da conversa e a aplicação utilizada. É útil para iniciar fluxos conversacionais via SMS — como confirmações de pedido, pesquisas de satisfação ou interações de atendimento. A função retorna `true` em caso de sucesso e lança uma exceção em caso de falha.

## Sintaxe

```ampscript
CreateSmsConversation(originationNumber, destinationNumber, nextKeyword, app)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| originationNumber | string | Sim | Número de telefone usado no MobileConnect (short code ou long code) a partir do qual a conversa será iniciada. |
| destinationNumber | string | Sim | Número de telefone do contato, incluindo o código do país. |
| nextKeyword | string | Sim | Keyword que será definido como o próximo passo da conversa SMS. |
| app | string | Sim | Aplicação usada na conversa. Deve ser obrigatoriamente `MOBILECONNECT`. Qualquer outro valor resulta em erro. |

## Exemplo básico

Iniciando uma conversa SMS com um cliente da Conecta Telecom para confirmar uma solicitação de upgrade de plano.

```ampscript
%%[
VAR @resultado
SET @resultado = CreateSmsConversation("28456", "5511999998888", "CONFIRMAR_UPGRADE", "MOBILECONNECT")
]%%
```

**Saída:**
```
true
```

## Exemplo avançado

Cenário de régua de relacionamento da FarmaRede: ao processar um pedido, o sistema busca os dados do cliente em uma Data Extension e inicia uma conversa SMS para coletar a avaliação de satisfação com a entrega.

```ampscript
%%[
VAR @telefone, @shortCode, @nome, @resultado

SET @shortCode = "28456"
SET @nome = Lookup("Clientes_FarmaRede", "Nome", "ClienteID", _subscriberkey)
SET @telefone = Lookup("Clientes_FarmaRede", "Telefone", "ClienteID", _subscriberkey)

IF NOT Empty(@telefone) THEN
  SET @resultado = CreateSmsConversation(@shortCode, Concat("55", @telefone), "AVALIACAO_ENTREGA", "MOBILECONNECT")
ENDIF
]%%
```

**Saída:**
```
true
```

## Observações

> **⚠️ Atenção:** Essa função só pode ser usada no contexto do **MobileConnect**. Não funciona em e-mails, CloudPages ou outros canais.

> **⚠️ Atenção:** Você **não pode** usar `CreateSmsConversation` com templates baseados em conversa, como templates de **Double Opt-In** e **Info Capture**.

> **⚠️ Atenção:** O parâmetro `app` deve ser obrigatoriamente a string `MOBILECONNECT`. Qualquer outro valor vai gerar um erro.

> **⚠️ Atenção:** A função sempre retorna `true` quando bem-sucedida e lança uma **exceção** quando falha. Por esse motivo, a Salesforce recomenda **não usar essa função para tomada de decisão** (como em blocos `IF` que dependam do retorno para seguir caminhos diferentes).

- Lembre-se de incluir o código do país no `destinationNumber`. Para números brasileiros, adicione o prefixo `55` antes do DDD e número (ex: `5511999998888`).

## Funções relacionadas

- [EndSmsConversation](../sms-functions/endsmsconversation.md) — encerra uma conversa SMS ativa.
- [SetSmsConversationNextKeyword](../sms-functions/setsmsconversationnextkeyword.md) — altera o próximo keyword de uma conversa SMS já em andamento.
- [Lookup](../data-extension-functions/lookup.md) — útil para buscar o telefone do contato em uma Data Extension antes de iniciar a conversa.
- [Empty](../utility-functions/empty.md) — para validar se o número de telefone existe antes de chamar a função.
- [Concat](../string-functions/concat.md) — para montar o número completo com código do país.