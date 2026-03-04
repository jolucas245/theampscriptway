---
title: Now
sidebar_label: Now
description: Retorna a data e hora atual do sistema no momento da execução.
---

# Now

## Descrição

A função `Now` retorna o timestamp atual do sistema da Salesforce Marketing Cloud. É a forma mais comum de capturar "agora" dentro de um e-mail, CloudPage ou qualquer peça AMPscript — útil para exibir a data de envio, registrar timestamps em Data Extensions ou criar lógicas condicionais baseadas em horário (como saudações "Bom dia / Boa tarde / Boa noite"). Quando usada sem parâmetros, retorna a data e hora correntes; quando chamada com `true`, retorna o horário de início do job de envio (ou o horário de publicação, no caso de triggered/journey sends).

## Sintaxe

```ampscript
Now()
Now(boolPreserveEmailSentTime)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| boolPreserveEmailSentTime | Boolean | Não | Quando `true`, retorna o horário de início do job (list/DE/manual send) ou o horário de publicação da triggered send definition (triggered/journey send). Quando `false` ou omitido, retorna a data e hora atuais do sistema. O valor padrão é `false`. |

## Retorno

Retorna um valor de **data e hora**.

## Comparação: Now vs Now(true) vs GetSendTime

| Função | Após envio de lista, DE ou manual | Após triggered ou journey send |
|--------|-----------------------------------|-------------------------------|
| `Now()` | Hora atual do sistema | Hora atual do sistema |
| `Now(true)` | Hora de início do job | Hora de publicação do job |
| `GetSendTime()` | Hora em que o envio individual do subscriber foi concluído | Hora em que o envio individual do subscriber foi concluído |
| `GetSendTime(true)` | Hora de início do job | Hora de publicação do job |

## Exemplo básico

Exibindo a data e hora atual no corpo de um e-mail promocional da MegaStore:

```ampscript
%%[
VAR @agora
SET @agora = Now()
]%%

Este e-mail foi gerado em: %%=FormatDate(@agora, "dd/MM/yyyy", "HH:mm")=%%
```

**Saída:**
```
Este e-mail foi gerado em: 15/07/2025, 14:32
```

## Exemplo avançado

Saudação dinâmica baseada no horário e registro de timestamp de abertura em uma régua de relacionamento do Banco Meridional:

```ampscript
%%[
VAR @agora, @hora, @saudacao, @nomeCliente

SET @agora = Now()
SET @hora = DatePart(@agora, "hour")
SET @nomeCliente = ProperCase(AttributeValue("PrimeiroNome"))

IF @hora >= 5 AND @hora < 12 THEN
  SET @saudacao = "Bom dia"
ELSEIF @hora >= 12 AND @hora < 18 THEN
  SET @saudacao = "Boa tarde"
ELSE
  SET @saudacao = "Boa noite"
ENDIF

/* Registra o momento do envio na DE de histórico */
InsertDE(
  "Historico_Envios",
  "EmailAddress", EmailAddress,
  "NomeCliente", @nomeCliente,
  "DataEnvio", @agora,
  "Campanha", "Boas-vindas Conta Digital"
)
]%%

%%=v(@saudacao)=%%, %%=v(@nomeCliente)=%%!

Sua conta digital no Banco Meridional foi ativada com sucesso.
```

**Saída:**
```
Boa tarde, Maria!

Sua conta digital no Banco Meridional foi ativada com sucesso.
```

## Exemplo com Now(true)

Comparando o horário atual com o horário de início do job para mostrar quanto tempo levou o processamento num envio em massa da Conecta Telecom:

```ampscript
%%[
VAR @inicioJob, @agoraReal, @diffMinutos

SET @inicioJob = Now(true)
SET @agoraReal = Now()
SET @diffMinutos = DateDiff(@inicioJob, @agoraReal, "MI")
]%%

Início do envio: %%=FormatDate(@inicioJob, "dd/MM/yyyy", "HH:mm")=%%
Processado em: %%=FormatDate(@agoraReal, "dd/MM/yyyy", "HH:mm")=%%
Tempo de processamento: %%=v(@diffMinutos)=%% minuto(s)
```

**Saída:**
```
Início do envio: 15/07/2025, 14:00
Processado em: 15/07/2025, 14:47
Tempo de processamento: 47 minuto(s)
```

## Observações

> **⚠️ Atenção:** O horário retornado por `Now()` é o **horário do sistema da Salesforce Marketing Cloud (CST/CDT — Central Time dos EUA)**. Para exibir no fuso horário de Brasília (BRT), você precisa ajustar manualmente com [`DateAdd`](../date-functions/dateadd.md). Exemplo: `DateAdd(Now(), 3, "H")` para converter de CDT para BRT durante o horário de verão dos EUA — mas lembre-se de que essa diferença varia conforme daylight saving time americano.

> **⚠️ Atenção:** Em **triggered sends e journey sends**, o `Now(true)` não retorna o momento do envio individual — ele retorna o horário em que a **triggered send definition foi publicada**. Se você precisa do horário exato em que cada subscriber recebeu a mensagem, use [`GetSendTime()`](../date-functions/getsendtime.md).

> **⚠️ Atenção:** Quando usada em **CloudPages**, a função `Now()` sempre retorna a hora atual do sistema, **independentemente** do valor passado no parâmetro `boolPreserveEmailSentTime`. Ou seja, `Now(true)` se comporta igual a `Now()` em CloudPages.

> **💡 Dica:** Para saudações dinâmicas (Bom dia / Boa tarde / Boa noite), lembre-se de converter para o fuso horário do destinatário antes de avaliar a hora. Se toda a sua base é do Brasil, um simples [`DateAdd`](../date-functions/dateadd.md) resolve. Se tiver clientes em fusos diferentes, considere armazenar o fuso na Data Extension.

## Funções relacionadas

- [`GetSendTime`](../date-functions/getsendtime.md) — retorna o horário em que o envio individual de cada subscriber foi concluído
- [`SystemDate`](../date-functions/systemdate.md) — retorna a data atual do sistema (sem hora)
- [`FormatDate`](../date-functions/formatdate.md) — formata a data retornada por `Now()` no padrão desejado (ex: DD/MM/AAAA)
- [`DateAdd`](../date-functions/dateadd.md) — adiciona ou subtrai intervalos de tempo (útil para ajuste de fuso horário)
- [`DateDiff`](../date-functions/datediff.md) — calcula a diferença entre duas datas
- [`DatePart`](../date-functions/datepart.md) — extrai partes específicas da data (hora, minuto, dia, mês etc.)