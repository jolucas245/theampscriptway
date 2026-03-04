---
title: SetSmsConversationNextKeyword
sidebar_label: SetSmsConversationNextKeyword
description: Define a próxima keyword do fluxo de conversação SMS no MobileConnect, redirecionando o caminho da conversa sem iniciar uma nova.
---

# SetSmsConversationNextKeyword

## Descrição

Define qual será a próxima keyword no fluxo de conversação SMS, redirecionando o caminho da conversa com base na resposta do contato. Essa função é útil quando você precisa desviar o fluxo de uma conversa SMS para outro caminho (outra keyword) sem criar uma conversa nova — por exemplo, quando o contato responde algo inesperado e você quer redirecioná-lo para um fluxo alternativo. A keyword não é aplicada imediatamente: ela só entra em vigor quando o contato enviar a próxima mensagem.

## Sintaxe

```ampscript
SetSmsConversationNextKeyword(originationNumber, destinationNumber, keyword)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| originationNumber | string | Sim | Número de telefone usado no MobileConnect (short code ou long code) para envio das mensagens. |
| destinationNumber | string | Sim | Número de telefone do contato, incluindo o código do país. |
| keyword | string | Sim | A keyword que será definida como próximo passo no fluxo de conversação. |

## Exemplo básico

Redirecionando um contato da Conecta Telecom para o fluxo de confirmação de plano após uma resposta via SMS.

```ampscript
%%[
SetSmsConversationNextKeyword("28455", "5511999998888", "CONFIRMAR_PLANO")
]%%
```

**Saída:**
```
A próxima keyword do fluxo de conversação para o número 5511999998888 será "CONFIRMAR_PLANO" quando o contato enviar a próxima mensagem.
```

## Exemplo avançado

Cenário de régua de atendimento da FarmaRede: dependendo da resposta do cliente, o fluxo SMS é redirecionado para consultar status de pedido ou falar com um atendente.

```ampscript
%%[
VAR @shortCode, @telefoneCliente, @resposta, @proximaKeyword

SET @shortCode = "28455"
SET @telefoneCliente = Concat("55", "11988887777")
SET @resposta = Uppercase(Trim(_MessageText))

IF @resposta == "PEDIDO" THEN
  SET @proximaKeyword = "STATUS_PEDIDO"
ELSEIF @resposta == "ATENDENTE" THEN
  SET @proximaKeyword = "FALAR_ATENDENTE"
ELSE
  SET @proximaKeyword = "MENU_PRINCIPAL"
ENDIF

SetSmsConversationNextKeyword(@shortCode, @telefoneCliente, @proximaKeyword)
]%%
```

**Saída:**
```
Se o cliente respondeu "PEDIDO", a próxima keyword será "STATUS_PEDIDO".
Se respondeu "ATENDENTE", será "FALAR_ATENDENTE".
Qualquer outra resposta redireciona para "MENU_PRINCIPAL".
A keyword só será aplicada quando o contato enviar a próxima mensagem.
```

## Observações

> **⚠️ Atenção:** Essa função só pode ser usada no **MobileConnect**. Não funciona em e-mails, CloudPages ou qualquer outro contexto do Marketing Cloud.

> **⚠️ Atenção:** A função **não pode** ser usada com templates baseados em conversação, como **Double Opt-In** e **Info Capture**. Se você está trabalhando com esses templates, será preciso usar outra abordagem.

> **💡 Dica:** A keyword definida por essa função **não é aplicada imediatamente**. Ela só entra em vigor quando o contato enviar a próxima mensagem SMS. Ou seja, você está preparando o próximo passo do fluxo, não executando uma ação instantânea.

> **💡 Dica:** O parâmetro `destinationNumber` precisa incluir o código do país. Para números brasileiros, lembre-se de incluir o prefixo `55` (ex: `5511999998888`). Usar a função [Concat](../string-functions/concat.md) para montar o número pode ajudar a manter o código mais organizado.

## Funções relacionadas

- [CreateSmsConversation](../sms-functions/createsmsconversation.md) — cria uma nova conversação SMS com o contato.
- [EndSmsConversation](../sms-functions/endsmsconversation.md) — encerra a conversação SMS ativa com o contato.
- [Concat](../string-functions/concat.md) — útil para montar o número de telefone com código do país.
- [Uppercase](../string-functions/uppercase.md) — normaliza a resposta do contato para comparação com keywords.
- [Trim](../string-functions/trim.md) — remove espaços extras da resposta do contato antes de processar.