---
title: CreateSmsConversation
sidebar_label: CreateSmsConversation
description: Cria uma conversa SMS com um contato no MobileConnect, permitindo iniciar fluxos de interação por mensagens de texto.
---

<!-- generated-by-script -->

# CreateSmsConversation

## Descrição

A função `CreateSmsConversation` inicia uma conversa SMS com um contato dentro do MobileConnect. Você passa o número de origem (short code ou long code), o número do contato com código do país, a próxima keyword da conversa e a aplicação (`MOBILECONNECT`). Ela retorna `true` em caso de sucesso e lança uma exceção se falhar — por isso, a Salesforce recomenda **não usar** essa função para tomada de decisão no seu código.

## Sintaxe

```ampscript
CreateSmsConversation(originationNumber, destinationNumber, nextKeyword, app)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| originationNumber | String | Sim | Número de origem usado no MobileConnect (short code ou long code). |
| destinationNumber | String | Sim | Número de telefone do contato, incluindo o código do país (ex: `5511999999999`). |
| nextKeyword | String | Sim | A keyword que será definida como a próxima keyword da conversa. |
| app | String | Sim | A aplicação usada na conversa. **Deve ser** `MOBILECONNECT`. Qualquer outro valor gera um erro. |

## Exemplo básico

Imagine que a **Conecta Telecom** quer iniciar uma conversa SMS com um cliente para confirmar uma alteração de plano. O cliente responde com a keyword `CONFIRMAR` para prosseguir:

```ampscript
%%[

VAR @shortCode, @telefoneCliente, @proximaKeyword

SET @shortCode = "28456"
SET @telefoneCliente = "5511998765432"
SET @proximaKeyword = "CONFIRMAR"

CreateSmsConversation(@shortCode, @telefoneCliente, @proximaKeyword, "MOBILECONNECT")

]%%
```

**Saída:**
```
(Nenhuma saída visível — a conversa SMS é criada internamente no MobileConnect.
O sistema aguarda o contato responder com a keyword "CONFIRMAR".)
```

## Exemplo avançado

Agora um cenário mais completo: a **FarmaRede** está rodando uma campanha de Dia das Mães e quer iniciar uma conversa SMS personalizada. O número do cliente e a keyword são buscados de uma Data Extension, e o resultado é registrado em outra DE para controle:

```ampscript
%%[

VAR @shortCode, @telefoneCliente, @nomeCliente, @proximaKeyword, @resultado

SET @shortCode = "54321"

/* Busca dados do contato na Data Extension */
SET @row = LookupRows("Campanha_DiadasMaes", "StatusEnvio", "Pendente")

IF RowCount(@row) > 0 THEN
  SET @registro = Row(@row, 1)
  SET @nomeCliente = Field(@registro, "Nome")
  SET @telefoneCliente = Field(@registro, "Telefone")
  SET @proximaKeyword = "MAES2024"

  /* Garante que o telefone tem o código do país */
  IF IndexOf(@telefoneCliente, "55") != 1 THEN
    SET @telefoneCliente = Concat("55", @telefoneCliente)
  ENDIF

  /* Inicia a conversa SMS */
  CreateSmsConversation(@shortCode, @telefoneCliente, @proximaKeyword, "MOBILECONNECT")

  /* Registra o envio na DE de controle */
  UpsertDE(
    "Log_Conversas_SMS",
    "Telefone", @telefoneCliente,
    "Nome", @nomeCliente,
    "Keyword", @proximaKeyword,
    "DataInicio", FormatDate(Now(), "dd/MM/yyyy HH:mm"),
    "Status", "Conversa Iniciada"
  )

ENDIF

]%%
```

**Saída:**
```
(Nenhuma saída visível — a conversa SMS é iniciada com o contato e
o registro é salvo na DE "Log_Conversas_SMS" com status "Conversa Iniciada".
O sistema aguarda a resposta do cliente com a keyword "MAES2024".)
```

## Observações

- ⚠️ **Funciona APENAS no MobileConnect.** Você não pode usar essa função em emails, CloudPages, Journey Builder ou qualquer outro contexto do Marketing Cloud.
- ⚠️ **Não pode ser usada com templates baseados em conversa**, como Double Opt-In e Info Capture. Esses templates já possuem seus próprios fluxos de conversa.
- O parâmetro `app` **obrigatoriamente** deve ser a string `"MOBILECONNECT"`. Passar qualquer outro valor vai gerar um erro.
- O número de destino (`destinationNumber`) precisa incluir o **código do país**. Para números brasileiros, sempre prefixe com `55` (ex: `5511999887766`).
- A função **sempre retorna `true`** quando executada com sucesso. Em caso de falha, ela **lança uma exceção** em vez de retornar `false`. Por conta disso, a Salesforce recomenda **não usar essa função para lógica condicional** (como dentro de um `IF`).
- Se você precisa tratar erros, considere usar [RaiseError](../utility-functions/raiseerror.md) em combinação com validações prévias dos parâmetros antes de chamar a função.
- A keyword passada em `nextKeyword` deve estar previamente configurada no MobileConnect para que a conversa funcione corretamente.

## Funções relacionadas

- [EndSmsConversation](../sms-functions/endsmsconversation.md) — Encerra uma conversa SMS ativa com um contato.
- [SetSmsConversationNextKeyword](../sms-functions/setsmsconversationnextkeyword.md) — Altera a próxima keyword esperada em uma conversa SMS já em andamento.
- [Lookup](../data-extension-functions/lookup.md) — Busca um valor em uma Data Extension (útil para pegar o telefone do contato).
- [LookupRows](../data-extension-functions/lookuprows.md) — Retorna várias linhas de uma Data Extension para processar múltiplos contatos.
- [UpsertDE](../data-extension-functions/upsertde.md) — Insere ou atualiza registros em uma Data Extension (útil para logar as conversas).
- [Concat](../string-functions/concat.md) — Concatena strings (útil para montar o número com código do país).
- [RaiseError](../utility-functions/raiseerror.md) — Levanta um erro customizado (útil para tratamento de falhas).