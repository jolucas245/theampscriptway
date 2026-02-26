---
title: SetSmsConversationNextKeyword
sidebar_label: SetSmsConversationNextKeyword
description: Define a próxima keyword de conversação SMS para direcionar o fluxo da conversa com o contato no MobileConnect.
---

<!-- generated-by-script -->

# SetSmsConversationNextKeyword

## Descrição

A função `SetSmsConversationNextKeyword` define qual será a próxima keyword (palavra-chave) usada no fluxo de conversação SMS, sem iniciar uma nova conversa. Basicamente, ela redireciona a conversa atual para um caminho diferente baseado em uma keyword que você especificar. É super útil quando você quer criar fluxos de SMS interativos e ramificados — por exemplo, quando o cliente responde uma mensagem e você quer levá-lo para uma próxima etapa específica. A keyword não é aplicada imediatamente: ela só entra em vigor quando o contato enviar a próxima mensagem.

## Sintaxe

```ampscript
SetSmsConversationNextKeyword(originationNumber, destinationNumber, keyword)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| originationNumber | String | Sim | O número de telefone usado no MobileConnect (short code ou long code) — é o número de origem da sua empresa. |
| destinationNumber | String | Sim | O número de telefone do contato, incluindo o código do país (ex: `5511999998888`). |
| keyword | String | Sim | A palavra-chave que será definida como próximo passo na conversação SMS. |

## Exemplo básico

Imagine que a **Conecta Telecom** tem um fluxo de SMS onde, após o cliente confirmar interesse em um plano, a conversa é direcionada para a keyword `PLANOS` para apresentar as opções disponíveis:

```ampscript
%%[
VAR @shortCode, @telefoneCliente, @proximaKeyword

SET @shortCode = "28456"
SET @telefoneCliente = "5511999887766"
SET @proximaKeyword = "PLANOS"

SetSmsConversationNextKeyword(@shortCode, @telefoneCliente, @proximaKeyword)
]%%
Ótimo! Quando você enviar sua próxima mensagem, vamos te mostrar nossos planos disponíveis.
```

**Saída (SMS enviado ao cliente):**
```
Ótimo! Quando você enviar sua próxima mensagem, vamos te mostrar nossos planos disponíveis.
```

Quando o cliente responder qualquer coisa, a conversa será processada pela keyword `PLANOS` automaticamente.

## Exemplo avançado

Agora um cenário mais completo: a **FarmaRede** tem um programa de fidelidade por SMS. O cliente envia `PONTOS` e recebe o saldo. Dependendo da quantidade de pontos, o fluxo é direcionado para keywords diferentes — `RESGATAR` se tiver pontos suficientes ou `ACUMULAR` se precisar juntar mais:

```ampscript
%%[
VAR @shortCode, @telefoneCliente, @pontos, @proximaKeyword, @nomeCliente

SET @shortCode = "49300"
SET @telefoneCliente = "5521988776655"

/* Busca dados do cliente na Data Extension */
SET @rows = LookupRows("Programa_Fidelidade", "Telefone", @telefoneCliente)

IF RowCount(@rows) > 0 THEN
  SET @row = Row(@rows, 1)
  SET @nomeCliente = Field(@row, "Nome")
  SET @pontos = Field(@row, "Pontos")

  IF @pontos >= 500 THEN
    SET @proximaKeyword = "RESGATAR"
    SET @mensagem = Concat("Oi, ", @nomeCliente, "! Você tem ", Format(@pontos, "#,##0"), " pontos. Você já pode trocar por descontos! Responda qualquer coisa para ver as opções de resgate.")
  ELSE
    SET @proximaKeyword = "ACUMULAR"
    SET @mensagem = Concat("Oi, ", @nomeCliente, "! Você tem ", Format(@pontos, "#,##0"), " pontos. Faltam ", Subtract(500, @pontos), " pontos para resgatar prêmios. Responda qualquer coisa para ver como acumular mais rápido!")
  ENDIF

  SetSmsConversationNextKeyword(@shortCode, @telefoneCliente, @proximaKeyword)

  /* Registra a interação */
  InsertDE("Log_Interacoes_SMS", "Telefone", @telefoneCliente, "Data", Now(), "Keyword_Atual", "PONTOS", "Proxima_Keyword", @proximaKeyword, "Pontos_No_Momento", @pontos)
ELSE
  SET @mensagem = "Não encontramos seu cadastro no programa de fidelidade FarmaRede. Envie CADASTRO para se inscrever!"
  SetSmsConversationNextKeyword(@shortCode, @telefoneCliente, "CADASTRO")
ENDIF

Output(v(@mensagem))
]%%
```

**Saída (SMS para cliente com 720 pontos):**
```
Oi, Maria Santos! Você tem 720 pontos. Você já pode trocar por descontos! Responda qualquer coisa para ver as opções de resgate.
```

**Saída (SMS para cliente com 180 pontos):**
```
Oi, Carlos Oliveira! Você tem 180 pontos. Faltam 320 pontos para resgatar prêmios. Responda qualquer coisa para ver como acumular mais rápido!
```

## Observações

- **Exclusivo do MobileConnect**: essa função só pode ser usada dentro do contexto do MobileConnect. Não funciona em emails, CloudPages ou Journey Builder fora do SMS.
- **Não funciona com templates baseados em conversação**: você **não pode** usar essa função com templates de Double Opt-In ou Info Capture do MobileConnect.
- **A keyword não é aplicada imediatamente**: a mudança de keyword só entra em vigor quando o contato enviar a próxima mensagem SMS. Ou seja, a função "agenda" o próximo caminho, mas não dispara nada sozinha.
- **Código do país obrigatório**: o parâmetro `destinationNumber` precisa incluir o código do país. Para números brasileiros, use o prefixo `55` (ex: `5511999998888`).
- **A keyword precisa existir**: a keyword informada no terceiro parâmetro deve estar previamente configurada no MobileConnect. Se a keyword não existir, o comportamento pode ser inesperado.
- **Diferente de `CreateSmsConversation`**: enquanto `CreateSmsConversation` inicia uma nova conversa do zero, `SetSmsConversationNextKeyword` apenas redireciona o fluxo da conversa já existente para outra keyword.

## Funções relacionadas

- [CreateSmsConversation](../sms-functions/createsmsconversation.md) — Inicia uma nova conversação SMS com um contato no MobileConnect.
- [EndSmsConversation](../sms-functions/endsmsconversation.md) — Encerra a conversação SMS ativa com um contato.
- [Lookup](../data-extension-functions/lookup.md) — Busca um valor em uma Data Extension, útil para consultar dados do contato durante o fluxo SMS.
- [LookupRows](../data-extension-functions/lookuprows.md) — Retorna múltiplas linhas de uma Data Extension para cenários mais complexos.
- [InsertDE](../data-extension-functions/insertde.md) — Insere registros em uma Data Extension para logar interações SMS.
- [Concat](../string-functions/concat.md) — Concatena strings para montar mensagens SMS dinâmicas.
- [IsPhoneNumber](../utility-functions/isphonenumber.md) — Valida se um valor é um número de telefone válido.