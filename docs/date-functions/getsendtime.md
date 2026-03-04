---
title: GetSendTime
sidebar_label: GetSendTime
description: Retorna o timestamp do início do job ou do momento em que o envio foi concluído para um subscriber individual, em Central Standard Time (CST).
---

# GetSendTime

## Descrição

A função `GetSendTime` retorna um timestamp relacionado ao envio de um e-mail — pode ser o horário em que o job começou (nível geral) ou o horário em que o envio foi concluído para aquele subscriber específico (nível individual). O valor retornado está sempre em **Central Standard Time (CST), sem horário de verão**. É especialmente útil quando você precisa registrar ou exibir o momento exato em que cada contato recebeu a comunicação, algo comum em réguas de relacionamento com SLAs de envio ou auditorias.

## Sintaxe

```ampscript
GetSendTime(boolAllSubscribers)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| boolAllSubscribers | Boolean | Não | Se `true`, retorna o horário de início do job (ou publish time). Se `false` (ou omitido), retorna o horário em que o envio foi concluído para o subscriber individual. O valor padrão é `false`. |

## Exemplo básico

Exibindo no e-mail da Lojas Vitória o horário em que a mensagem foi processada para aquele subscriber específico.

```ampscript
%%[
VAR @horaEnvio
SET @horaEnvio = GetSendTime()
]%%

Olá, João Silva!

Esta mensagem foi enviada para você em: %%=v(@horaEnvio)=%%
```

**Saída:**
```
Olá, João Silva!

Esta mensagem foi enviada para você em: 11/15/2024 3:42:18 PM
```

## Exemplo avançado

Cenário de auditoria da Conecta Telecom: o e-mail registra tanto o horário de início do job quanto o horário individual do subscriber, convertendo para o fuso de Brasília (CST + 3h em horário padrão dos EUA) e formatando no padrão brasileiro.

```ampscript
%%[
VAR @horaIndividual, @horaJob, @horaBrasiliaIndividual, @horaBrasiliaJob

/* Horário em que o envio completou para este subscriber (CST) */
SET @horaIndividual = GetSendTime()

/* Horário em que o job iniciou/foi publicado (CST) */
SET @horaJob = GetSendTime(true)

/* Convertendo CST para horário de Brasília (UTC-3 = CST+1 no horário padrão dos EUA) */
SET @horaBrasiliaIndividual = DateAdd(@horaIndividual, 1, "H")
SET @horaBrasiliaJob = DateAdd(@horaJob, 1, "H")
]%%

Conecta Telecom — Confirmação de envio

Prezado(a) %%=v(@primeiroNome)=%%,

Início da campanha: %%=FormatDate(@horaBrasiliaJob, "dd/MM/yyyy", "HH:mm:ss")=%%
Seu e-mail processado em: %%=FormatDate(@horaBrasiliaIndividual, "dd/MM/yyyy", "HH:mm:ss")=%%

%%[
VAR @diffMinutos
SET @diffMinutos = DateDiff(@horaJob, @horaIndividual, "MI")

IF @diffMinutos > 30 THEN
]%%
<p style="color:#cc0000;">⚠ Seu e-mail levou mais de 30 minutos para ser processado após o início do job.</p>
%%[ ENDIF ]%%
```

**Saída:**
```
Conecta Telecom — Confirmação de envio

Prezado(a) Maria,

Início da campanha: 15/11/2024 16:00:00
Seu e-mail processado em: 15/11/2024 16:42:18

⚠ Seu e-mail levou mais de 30 minutos para ser processado após o início do job.
```

## Observações

> **⚠️ Atenção:** O valor retornado está sempre em **Central Standard Time (CST) sem ajuste de horário de verão**. Para exibir no fuso de Brasília, você precisa fazer a conversão manualmente com [DateAdd](../date-functions/dateadd.md). A diferença entre CST e Brasília varia conforme o período do ano — fique atento.

- **Durante o envio** (enquanto o job está em execução), tanto `GetSendTime()` quanto `GetSendTime(true)` retornam o horário atual do sistema — comportamento idêntico a [Now](../date-functions/now.md).
- **Após um envio de lista, Data Extension ou envio manual:**
  - `GetSendTime()` (sem parâmetro ou `false`) → horário em que o envio completou para aquele subscriber individual.
  - `GetSendTime(true)` → horário de início do job.
- **Após um envio Triggered ou Journey:**
  - `GetSendTime()` → horário em que o envio completou para o subscriber individual.
  - `GetSendTime(true)` → horário de publicação (publish time) do job.

> **💡 Dica:** A diferença entre `GetSendTime()` e `Now()` só aparece **após** o envio (por exemplo, em uma open-time render ou preview). Durante o processamento do envio, ambas retornam o mesmo valor. Se você precisa sempre do horário atual do sistema independentemente do contexto, use [Now](../date-functions/now.md). Se precisa do horário real em que aquele subscriber foi processado, `GetSendTime()` é a escolha certa.

> **💡 Dica:** `GetSendTime(true)` e `Now(true)` retornam o mesmo valor — ambas trazem o horário de início/publicação do job. A diferença está na versão sem parâmetro: `GetSendTime()` congela o timestamp do subscriber, enquanto `Now()` sempre retorna o horário atual.

## Funções relacionadas

- [Now](../date-functions/now.md) — retorna o horário atual do sistema (ou o horário de início do job quando usada com `true`)
- [FormatDate](../date-functions/formatdate.md) — para formatar o timestamp retornado no padrão brasileiro DD/MM/AAAA
- [DateAdd](../date-functions/dateadd.md) — para converter o horário CST para o fuso de Brasília
- [DateDiff](../date-functions/datediff.md) — para calcular a diferença entre o início do job e o processamento individual
- [SystemDateToLocalDate](../date-functions/systemdatetolocaldate.md) — para conversão de fuso horário do sistema