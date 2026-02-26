---
title: EndSmsConversation
sidebar_label: EndSmsConversation
description: Encerra uma conversa SMS ativa com um contato no MobileConnect.
---

# EndSmsConversation

## Descrição

A função `EndSmsConversation` encerra uma conversa SMS que está em andamento com um contato específico no MobileConnect. Você passa o número de origem (short code ou long code) e o número do contato, e a função finaliza a conversa ativa entre eles. Ela sempre retorna `true` em caso de sucesso e lança uma exceção em caso de falha — por isso, a Salesforce **não recomenda** usar o retorno dessa função para tomada de decisão em lógica condicional.

## Sintaxe

```ampscript
EndSmsConversation(originationNumber, destinationNumber)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| originationNumber | String | Sim | O número de telefone de origem (short code ou long code) usado no MobileConnect. |
| destinationNumber | String | Sim | O número de telefone do contato, incluindo o código do país (ex: `5511999998888`). |

## Exemplo básico

Imagine que a **Conecta Telecom** tem uma conversa SMS ativa com um cliente e precisa encerrá-la após confirmar uma informação:

```ampscript
%%[
/* Encerra a conversa SMS com o contato */
SET @resultado = EndSmsConversation("72345", "5511999998888")
]%%
```

**Saída:**
```
true
```

A conversa SMS entre o short code `72345` e o número `5511999998888` é encerrada com sucesso.

## Exemplo avançado

Cenário real: a **FarmaRede** usa um fluxo de SMS para coletar o CEP do cliente e calcular o frete. Depois de capturar a informação e salvar na Data Extension, a conversa precisa ser encerrada para que o contato possa interagir com outras keywords normalmente.

```ampscript
%%[
SET @shortCode = "54321"
SET @telefoneCliente = "5521988887777"
SET @cepInformado = [MSG(0).NOUN]

/* Valida se o CEP tem 8 dígitos */
SET @cepLimpo = Replace(@cepInformado, "-", "")

IF Length(@cepLimpo) == 8 THEN

  /* Salva o CEP na Data Extension */
  UpsertDE(
    "CEP_Clientes",
    "Telefone", @telefoneCliente,
    "CEP", @cepLimpo,
    "DataAtualizacao", Now()
  )

  /* Encerra a conversa SMS */
  SET @resultado = EndSmsConversation(@shortCode, @telefoneCliente)

  /* Responde ao cliente */
  SET @resposta = Concat("Obrigado! Seu CEP ", @cepInformado, " foi cadastrado. Frete grátis acima de R$299! Acesse www.farmarede.com.br")

ELSE

  /* CEP inválido - mantém a conversa ativa para nova tentativa */
  SET @resposta = "CEP inválido. Por favor, envie seu CEP no formato 00000-000."

ENDIF
]%%
%%=v(@resposta)=%%
```

**Saída (CEP válido):**
```
Obrigado! Seu CEP 01310-100 foi cadastrado. Frete grátis acima de R$299! Acesse www.farmarede.com.br
```

**Saída (CEP inválido):**
```
CEP inválido. Por favor, envie seu CEP no formato 00000-000.
```

## Observações

- ⚠️ **Funciona exclusivamente no MobileConnect.** Não tente usar essa função em emails, CloudPages ou outros contextos do Marketing Cloud — ela simplesmente não vai funcionar.
- ⚠️ **Não pode ser usada com templates baseados em conversação**, como templates de Double Opt-In e Info Capture. Nesses casos, o fluxo de conversa é gerenciado automaticamente pelo template.
- A função **sempre retorna `true`** quando executa com sucesso. Se algo der errado, ela lança uma exceção em vez de retornar `false`. Por causa disso, a Salesforce recomenda **não usar o retorno para lógica condicional** (como `IF EndSmsConversation(...) THEN`).
- O parâmetro `destinationNumber` precisa incluir o **código do país**. Para números brasileiros, use o prefixo `55` seguido do DDD e número (ex: `5511999998888`).
- Use essa função quando você quiser **liberar o contato** de uma conversa ativa, permitindo que ele interaja com outras keywords ou inicie novas conversas.
- Se não houver conversa ativa entre os números informados, a função lançará uma exceção.

## Funções relacionadas

- [CreateSmsConversation](../sms-functions/createsmsconversation.md) — Cria uma nova conversa SMS com um contato no MobileConnect.
- [SetSmsConversationNextKeyword](../sms-functions/setsmsconversationnextkeyword.md) — Define a próxima keyword esperada dentro de uma conversa SMS ativa.
- [UpsertDE](../data-extension-functions/upsertde.md) — Insere ou atualiza registros em uma Data Extension (útil para salvar dados capturados via SMS).
- [Lookup](../data-extension-functions/lookup.md) — Busca um valor em uma Data Extension (útil para consultar dados do contato durante a conversa).
- [RaiseError](../utility-functions/raiseerror.md) — Dispara um erro customizado, útil para tratamento de exceções em fluxos SMS.