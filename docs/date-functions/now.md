---
title: Now
sidebar_label: Now
description: Retorna o timestamp atual do sistema ou o horário de envio do e-mail, dependendo do parâmetro informado.
---

# Now

## Descrição

A função `Now` retorna a data e hora atuais do sistema do Salesforce Marketing Cloud. Ela é super útil quando você precisa personalizar conteúdo com base no momento atual — como exibir saudações de "Bom dia" ou "Boa noite", validar prazos de promoções ou registrar timestamps em Data Extensions. Se você passar o parâmetro `true`, o comportamento muda: em vez da hora atual, ela retorna o horário de início do job (em envios de lista/DE/manual) ou o horário de publicação da triggered send definition (em envios triggered/Journey Builder).

## Sintaxe

```ampscript
Now()
Now(boolPreserveEmailSentTime)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| boolPreserveEmailSentTime | Boolean | Não | Se `true`, retorna o horário de início do job de envio (para envios de lista/DE/manual) ou o horário de publicação da triggered send (para envios triggered/Journey). Se `false` ou omitido, retorna a data e hora atuais do sistema. O valor padrão é `false`. |

## Exemplo básico

```ampscript
%%[
VAR @agora
SET @agora = Now()
]%%

Data e hora atuais: %%=v(@agora)=%%
```

**Saída:**
```
Data e hora atuais: 6/15/2025 2:34:18 PM
```

## Exemplo avançado

Imagine que a **Lojas Vitória** está rodando uma campanha de Black Friday com preço especial até 29/11/2025 às 23:59. Queremos mostrar uma mensagem diferente se a promoção ainda estiver ativa e exibir uma saudação personalizada com base na hora do dia:

```ampscript
%%[
VAR @agora, @hora, @saudacao, @fimPromo, @nomeCliente

SET @agora = Now()
SET @hora = DatePart(@agora, "hour")
SET @nomeCliente = AttributeValue("PrimeiroNome")
SET @fimPromo = DateParse("2025-11-29T23:59:00")

/* Saudação baseada na hora atual */
IF @hora >= 5 AND @hora < 12 THEN
  SET @saudacao = "Bom dia"
ELSEIF @hora >= 12 AND @hora < 18 THEN
  SET @saudacao = "Boa tarde"
ELSE
  SET @saudacao = "Boa noite"
ENDIF
]%%

%%=v(@saudacao)=%%, %%=v(@nomeCliente)=%%! 🎉

%%[
IF DateDiff(@agora, @fimPromo, "D") >= 0 THEN
]%%

🔥 A Black Friday da Lojas Vitória ainda está rolando!
Aproveite até 70% de desconto + frete grátis acima de R$299,00.

Corre que acaba em %%=DateDiff(@agora, @fimPromo, "D")=%% dia(s)!

<a href="https://www.lojasvitoria.com.br/blackfriday">APROVEITAR AGORA</a>

%%[ ELSE ]%%

😢 Poxa, a Black Friday já acabou... Mas calma!
Cadastre-se para receber em primeira mão as ofertas de Natal.

<a href="https://www.lojasvitoria.com.br/natal">QUERO SABER DAS OFERTAS</a>

%%[ ENDIF ]%%
```

**Saída (supondo envio em 25/11/2025 às 10:15):**
```
Bom dia, Maria! 🎉

🔥 A Black Friday da Lojas Vitória ainda está rolando!
Aproveite até 70% de desconto + frete grátis acima de R$299,00.

Corre que acaba em 4 dia(s)!

APROVEITAR AGORA
```

### Exemplo com `Now(true)` — Registrando o horário do job

Se você quer garantir que todos os subscribers de um mesmo envio em lote recebam o mesmo timestamp (o início do job, e não o momento exato em que cada e-mail foi processado), use `Now(true)`:

```ampscript
%%[
VAR @horaJob, @horaAtual

SET @horaJob = Now(true)
SET @horaAtual = Now()

/* Registrar na DE de log */
InsertDE(
  "Log_Envios_Campanha",
  "EmailAddress", EmailAddress,
  "HorarioInicioJob", @horaJob,
  "HorarioProcessamento", @horaAtual,
  "Campanha", "BlackFriday2025"
)
]%%
```

**Saída na Data Extension `Log_Envios_Campanha`:**
```
EmailAddress: maria.santos@email.com.br
HorarioInicioJob: 11/25/2025 8:00:00 AM
HorarioProcessamento: 11/25/2025 8:03:47 AM
Campanha: BlackFriday2025
```

## Observações

- O horário retornado por `Now()` é sempre o **horário do sistema do Salesforce Marketing Cloud**, que utiliza o fuso horário **Central Standard Time (CST/CDT)**. Não é horário de Brasília! Para converter para o horário brasileiro, você pode usar [SystemDateToLocalDate](../date-functions/systemdatetolocaldate.md) ou [DateAdd](../date-functions/dateadd.md) para somar as horas necessárias.
- A tabela abaixo resume o comportamento de `Now()` e `GetSendTime()` em diferentes contextos:

| Função | Envio de lista/DE/manual | Envio triggered/Journey |
|---|---|---|
| `Now()` | Hora atual do sistema | Hora atual do sistema |
| `Now(true)` | Hora de início do job | Hora de publicação da triggered send |
| `GetSendTime()` | Hora em que o envio do subscriber individual foi concluído | Hora em que o envio do subscriber individual foi concluído |
| `GetSendTime(true)` | Hora de início do job | Hora de publicação da triggered send |

- Quando usada em **CloudPages**, a função `Now()` **sempre retorna a hora atual**, independentemente do valor do parâmetro `boolPreserveEmailSentTime`. Ou seja, `Now()` e `Now(true)` terão o mesmo resultado em CloudPages.
- Em **triggered sends**, cuidado com `Now(true)`: ela retorna o momento em que a triggered send definition foi publicada (ou republicada), **não** o momento em que o envio foi disparado. Isso pode gerar confusão se a publicação aconteceu dias atrás.
- Se você precisa do horário exato em que o e-mail de cada subscriber individual foi processado, use [GetSendTime](../date-functions/getsendtime.md) em vez de `Now()`.
- Para formatar a data retornada no padrão brasileiro (DD/MM/AAAA), combine com [FormatDate](../date-functions/formatdate.md): `FormatDate(Now(), "dd/MM/yyyy", "HH:mm:ss")`.

## Funções relacionadas

- [GetSendTime](../date-functions/getsendtime.md) — retorna o horário em que o envio individual do subscriber foi concluído
- [SystemDate](../date-functions/systemdate.md) — retorna a data do sistema (semelhante a `Now()`, porém apenas a data)
- [FormatDate](../date-functions/formatdate.md) — formata a data/hora retornada em um padrão específico (ex: DD/MM/AAAA)
- [DateAdd](../date-functions/dateadd.md) — adiciona ou subtrai intervalos de tempo a uma data (útil para ajuste de fuso horário)
- [DateDiff](../date-functions/datediff.md) — calcula a diferença entre duas datas
- [DatePart](../date-functions/datepart.md) — extrai uma parte específica da data (hora, dia, mês, etc.)
- [DateParse](../date-functions/dateparse.md) — converte uma string em um valor de data
- [SystemDateToLocalDate](../date-functions/systemdatetolocaldate.md) — converte a data do sistema para o fuso horário local configurado na conta