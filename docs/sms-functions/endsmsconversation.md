---
title: EndSmsConversation
sidebar_label: EndSmsConversation
description: Encerra uma conversa SMS ativa com um contato no MobileConnect.
---

# EndSmsConversation

## Descrição

Encerra uma conversa SMS ativa com um contato no MobileConnect. Você usa essa função quando precisa finalizar programaticamente uma interação por SMS que está em andamento — por exemplo, quando o contato já forneceu todas as informações necessárias ou quando você quer interromper o fluxo conversacional por alguma regra de negócio. A função retorna `true` em caso de sucesso e lança uma exceção em caso de falha.

## Sintaxe

```ampscript
EndSmsConversation("originationNumber", "destinationNumber")
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| originationNumber | String | Sim | O número de telefone (short code ou long code) usado no MobileConnect para enviar as mensagens. |
| destinationNumber | String | Sim | O número de telefone do contato, incluindo o código do país. |

## Exemplo básico

Encerrando uma conversa SMS com um contato após ele responder a uma pesquisa de satisfação da Conecta Telecom.

```ampscript
%%[
VAR @shortCode, @telefoneCliente

SET @shortCode = "28456"
SET @telefoneCliente = "5511999998888"

EndSmsConversation(@shortCode, @telefoneCliente)
]%%
```

**Saída:**
```
true
```

## Exemplo avançado

A FarmaRede coleta dados de cadastro via SMS (nome e CPF). Depois que o contato envia o CPF com sucesso, a conversa é encerrada e os dados são registrados em uma Data Extension.

```ampscript
%%[
VAR @shortCode, @telefoneCliente, @nome, @cpf

SET @shortCode = "48123"
SET @telefoneCliente = "5521988887777"
SET @nome = "Maria Santos"
SET @cpf = "123.456.789-00"

/* Registra os dados capturados na DE */
InsertDE(
  "CadastroSMS",
  "Telefone", @telefoneCliente,
  "Nome", @nome,
  "CPF", @cpf,
  "DataCadastro", Now()
)

/* Encerra a conversa após capturar todos os dados */
EndSmsConversation(@shortCode, @telefoneCliente)
]%%
```

**Saída:**
```
true
```

## Observações

- Essa função só pode ser usada no **MobileConnect**. Não funciona em e-mails, CloudPages ou outros contextos do Marketing Cloud.

- **Não** pode ser utilizada com templates baseados em conversa, como **Double Opt-In** e **Info Capture**.

- A conversa precisa estar ativa no momento da chamada. Você passa o short code ou long code de origem e o telefone do contato com código do país (para números brasileiros, prefixe com `55`).

> **⚠️ Atenção:** A função sempre retorna `true` quando bem-sucedida e lança uma **exceção** quando falha. Por esse motivo, a Salesforce recomenda **não usar o retorno dessa função para tomada de decisão** em lógicas condicionais. Se você precisa tratar falhas, considere estratégias de controle de erro ao redor da chamada.

> **💡 Dica:** Use essa função em conjunto com [CreateSmsConversation](../sms-functions/createsmsconversation.md) e [SetSmsConversationNextKeyword](../sms-functions/setsmsconversationnextkeyword.md) para construir fluxos conversacionais completos — iniciando, direcionando e encerrando a conversa de forma programática.

## Funções relacionadas

- [CreateSmsConversation](../sms-functions/createsmsconversation.md) — Cria uma nova conversa SMS com um contato.
- [SetSmsConversationNextKeyword](../sms-functions/setsmsconversationnextkeyword.md) — Define a próxima keyword esperada dentro de uma conversa SMS ativa.