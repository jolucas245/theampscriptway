---
title: GetSendTime
sidebar_label: GetSendTime
description: Retorna o timestamp do início ou término de um envio no nível do job ou do subscriber individual.
---

# GetSendTime

## Descrição

A função `GetSendTime` retorna um timestamp relacionado ao envio de um e-mail. Dependendo do parâmetro passado, ela pode retornar o horário em que o envio foi concluído para um subscriber individual ou o horário em que o job inteiro começou/foi publicado. O valor retornado está sempre em **Central Standard Time (CST)**, sem ajuste de horário de verão (daylight saving time). Ela é especialmente útil quando você precisa registrar ou exibir o momento exato em que cada subscriber recebeu a mensagem, ou quando precisa referenciar o horário de início do job para lógicas de personalização.

## Sintaxe

```ampscript
GetSendTime()
GetSendTime(boolAllSubscribers)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| boolAllSubscribers | Boolean | Não | Se `true`, retorna o horário de início do job (job start time) ou o horário de publicação (job publish time). Se `false` ou omitido, retorna o timestamp em que o envio foi concluído para o subscriber individual. O valor padrão é `false`. |

### Comportamento por contexto

| Função | Durante um envio | Após envio de lista, DE ou manual | Após envio triggered ou journey |
|---|---|---|---|
| `GetSendTime()` | Horário atual do sistema | Horário em que o envio foi concluído para o subscriber individual | Horário em que o envio foi concluído para o subscriber individual |
| `GetSendTime(true)` | Horário atual do sistema | Horário de início do job | Horário de publicação do job |

## Exemplo básico

Imagine que a **Lojas Vitória** quer registrar o horário exato em que cada cliente recebeu o e-mail da campanha de Black Friday:

```ampscript
%%[
VAR @horarioEnvio
SET @horarioEnvio = GetSendTime()
]%%

Olá, este e-mail foi enviado para você em: %%=FormatDate(@horarioEnvio, "dd/MM/yyyy HH:mm:ss")=%%
```

**Saída:**
```
Olá, este e-mail foi enviado para você em: 28/11/2024 14:32:17
```

## Exemplo avançado

A **Conecta Telecom** envia uma campanha de reativação para uma Data Extension com milhares de subscribers. Eles querem mostrar no e-mail tanto o horário de início do job quanto o horário individual de envio, e também gravar essas informações em uma DE de log para auditoria:

```ampscript
%%[
VAR @inicioJob, @horarioIndividual, @emailSubscriber, @nomeSubscriber

SET @inicioJob = GetSendTime(true)
SET @horarioIndividual = GetSendTime(false)
SET @emailSubscriber = AttributeValue("EmailAddress")
SET @nomeSubscriber = AttributeValue("PrimeiroNome")

/* Converte de CST para horário de Brasília (CST + 3h = BRT) */
VAR @horarioBrasilia
SET @horarioBrasilia = DateAdd(@horarioIndividual, 3, "H")

/* Registra o log na DE "LogEnvios" */
InsertDE(
  "LogEnvios",
  "EmailAddress", @emailSubscriber,
  "InicioJob", FormatDate(@inicioJob, "dd/MM/yyyy HH:mm:ss"),
  "HorarioEnvioIndividual", FormatDate(@horarioIndividual, "dd/MM/yyyy HH:mm:ss"),
  "HorarioBrasilia", FormatDate(@horarioBrasilia, "dd/MM/yyyy HH:mm:ss"),
  "Campanha", "Reativacao_Dezembro_2024"
)
]%%

Olá, %%=v(@nomeSubscriber)=%%! 👋

Sentimos sua falta na Conecta Telecom! Esta oferta especial foi preparada para você.

📧 Este e-mail foi enviado em: %%=FormatDate(@horarioBrasilia, "dd/MM/yyyy 'às' HH:mm")=%% (horário de Brasília)
🚀 A campanha iniciou em: %%=FormatDate(DateAdd(@inicioJob, 3, "H"), "dd/MM/yyyy 'às' HH:mm")=%% (horário de Brasília)

%%[
/* Verifica se o envio demorou mais de 2 horas para este subscriber */
VAR @diferencaMinutos
SET @diferencaMinutos = DateDiff(@inicioJob, @horarioIndividual, "MI")

IF @diferencaMinutos > 120 THEN
]%%
⚠️ Desculpe pela demora — tivemos um volume alto de envios hoje!
%%[ ENDIF ]%%
```

**Saída:**
```
Olá, Maria Santos! 👋

Sentimos sua falta na Conecta Telecom! Esta oferta especial foi preparada para você.

📧 Este e-mail foi enviado em: 15/12/2024 às 18:32 (horário de Brasília)
🚀 A campanha iniciou em: 15/12/2024 às 16:00 (horário de Brasília)

⚠️ Desculpe pela demora — tivemos um volume alto de envios hoje!
```

## Observações

- **Fuso horário CST:** O valor retornado está sempre em Central Standard Time (CST, UTC-6), **sem** ajuste para horário de verão. Se você precisa exibir no horário de Brasília (BRT, UTC-3), some 3 horas usando [DateAdd](../date-functions/dateadd.md). Fique atento: dependendo do horário de verão dos EUA, essa diferença pode variar.
- **Valor padrão:** Chamar `GetSendTime()` sem parâmetros é equivalente a `GetSendTime(false)` — retorna o timestamp individual do subscriber.
- **Durante o envio vs. após o envio:** Durante o processamento ativo de um envio, tanto `GetSendTime()` quanto `GetSendTime(true)` retornam o horário atual do sistema. Os valores específicos (horário individual e horário de início do job) só ficam disponíveis após a conclusão do envio.
- **Triggered sends e Journey Builder:** Em envios triggered ou de journey, `GetSendTime(true)` retorna o **horário de publicação** do job (não o horário de início), enquanto `GetSendTime(false)` retorna o horário em que o envio foi concluído para aquele subscriber específico.
- **Diferença em relação a `Now()`:** A função [Now](../date-functions/now.md) sem parâmetros **sempre** retorna o horário atual do sistema, mesmo após o envio. Já `GetSendTime()` sem parâmetros retorna o horário em que o envio foi concluído para o subscriber. Use `Now()` quando precisa do horário atual e `GetSendTime()` quando precisa do horário real do envio.
- **Contexto de uso:** Esta função é projetada para uso em e-mails. O comportamento em CloudPages ou outros contextos pode não ser o esperado, já que não há um "envio" associado.

## Funções relacionadas

- [Now](../date-functions/now.md) — retorna o horário atual do sistema ou o horário de início do job (com parâmetro `true`)
- [SystemDate](../date-functions/systemdate.md) — retorna a data/hora atual do sistema
- [FormatDate](../date-functions/formatdate.md) — formata valores de data/hora para exibição
- [DateAdd](../date-functions/dateadd.md) — adiciona ou subtrai intervalos de tempo a uma data (útil para converter fuso horário)
- [DateDiff](../date-functions/datediff.md) — calcula a diferença entre duas datas
- [DatePart](../date-functions/datepart.md) — extrai uma parte específica de uma data (dia, mês, hora, etc.)
- [InsertDE](../data-extension-functions/insertde.md) — insere registros em uma Data Extension (útil para logar horários de envio)