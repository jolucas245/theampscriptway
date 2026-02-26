---
title: LocalDateToSystemDate
sidebar_label: LocalDateToSystemDate
description: Converte uma data/hora do fuso horário local da sua conta Marketing Cloud para o horário do sistema (Central Standard Time, UTC-6).
---

# LocalDateToSystemDate

## Descrição

A função `LocalDateToSystemDate` converte uma string de data/hora do fuso horário local da sua conta no Marketing Cloud para o horário do sistema. O horário do sistema é o **North American Central Standard Time (UTC-6)**, e ele **não** faz ajuste automático para horário de verão (daylight saving time). O fuso local é aquele configurado nas preferências do seu usuário no Setup da sua conta Marketing Cloud. Essa função é essencial quando você precisa gravar ou comparar datas em um padrão único (o do sistema), especialmente quando sua conta está configurada para o fuso de Brasília (UTC-3) ou qualquer outro diferente do CST.

## Sintaxe

```ampscript
LocalDateToSystemDate(timeToConvert)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| timeToConvert | string | Sim | A string de data/hora no fuso horário local da sua conta que você deseja converter para o horário do sistema (CST/UTC-6). |

## Exemplo básico

Imagine que sua conta Marketing Cloud está configurada para o fuso de Brasília (UTC-3). Você quer saber qual é o horário do sistema correspondente a um horário local específico.

```ampscript
%%[
VAR @horaLocalBrasilia, @horaSistema

SET @horaLocalBrasilia = "12/25/2024 10:00:00 AM"
SET @horaSistema = LocalDateToSystemDate(@horaLocalBrasilia)
]%%

Horário local (Brasília): %%=v(@horaLocalBrasilia)=%%
Horário do sistema (CST): %%=v(@horaSistema)=%%
```

**Saída:**
```
Horário local (Brasília): 12/25/2024 10:00:00 AM
Horário do sistema (CST): 12/25/2024 7:00:00 AM
```

## Exemplo avançado

Cenário real: a **MegaStore** está rodando uma campanha de Black Friday e precisa registrar na Data Extension o momento exato em que o e-mail foi aberto (via impressão), usando o horário do sistema como padrão. Ao mesmo tempo, o e-mail mostra para o cliente o horário local (Brasília) e converte de volta para gravar no sistema.

```ampscript
%%[
VAR @horaAtualSistema, @horaLocalUsuario, @voltaParaSistema, @nomeCliente

/* Hora do sistema (CST) */
SET @horaAtualSistema = Now()

/* Converte para o fuso local da conta (ex: Brasília UTC-3) */
SET @horaLocalUsuario = SystemDateToLocalDate(@horaAtualSistema)

/* Converte de volta para o horário do sistema */
SET @voltaParaSistema = LocalDateToSystemDate(@horaLocalUsuario)

SET @nomeCliente = AttributeValue("PrimeiroNome")

/* Registra o horário do sistema na DE de log */
InsertDE(
  "LogAberturaBlackFriday",
  "EmailAddress", EmailAddress,
  "NomeCliente", @nomeCliente,
  "HorarioSistemaCST", @voltaParaSistema,
  "HorarioLocalBrasilia", FormatDate(@horaLocalUsuario, "dd/MM/yyyy HH:mm", "pt-BR"),
  "Campanha", "BlackFriday2024"
)
]%%

Olá, %%=v(@nomeCliente)=%%! 🎉

Você está conferindo nossas ofertas de Black Friday!

🕐 Hora da sua visualização: %%=FormatDate(@horaLocalUsuario, "dd/MM/yyyy", "")=%% às %%=FormatDate(@horaLocalUsuario, "HH:mm", "")=%% (horário de Brasília)

🛒 Aproveite: frete grátis em compras acima de R$299,00!
Acesse: www.megastore.com.br/blackfriday
```

**Saída:**
```
Olá, Maria Santos! 🎉

Você está conferindo nossas ofertas de Black Friday!

🕐 Hora da sua visualização: 29/11/2024 às 14:30 (horário de Brasília)

🛒 Aproveite: frete grátis em compras acima de R$299,00!
Acesse: www.megastore.com.br/blackfriday
```

## Observações

- O horário do sistema do Marketing Cloud é **sempre** Central Standard Time (UTC-6), e **não** se ajusta para horário de verão (daylight saving time). Isso significa que a diferença entre o horário do sistema e UTC permanece fixa o ano todo em -6 horas.
- O fuso horário local depende da configuração da sua conta em **Setup > Company Settings > Business Unit**. Se sua conta está configurada para Brasília (UTC-3), a diferença entre local e sistema será de 3 horas (Brasília está 3 horas à frente do CST).
- A função espera uma **string** como parâmetro. Se você passar um valor nulo ou uma string que não possa ser interpretada como data/hora, o comportamento pode ser inesperado. Use [IsNull](../utility-functions/isnull.md) ou [Empty](../utility-functions/empty.md) para validar antes.
- `LocalDateToSystemDate` é a operação inversa de `SystemDateToLocalDate`. Se você converter um valor com `SystemDateToLocalDate` e depois passar o resultado por `LocalDateToSystemDate`, deverá obter o valor original.
- Preste atenção especial quando o Brasil estiver em horário de verão (nos anos em que vigorou) — como o sistema CST **não** ajusta para DST, a diferença de horas entre o local e o sistema pode mudar se o fuso local da conta considerar DST.
- Essa função funciona em e-mails, CloudPages, SMS e Landing Pages — não há restrição de contexto documentada.

## Funções relacionadas

- [SystemDateToLocalDate](../date-functions/systemdatetolocaldate.md) — Faz a conversão inversa: converte do horário do sistema (CST) para o horário local da conta
- [Now](../date-functions/now.md) — Retorna a data/hora atual do sistema (CST)
- [SystemDate](../date-functions/systemdate.md) — Retorna a data do sistema sem o componente de hora
- [FormatDate](../date-functions/formatdate.md) — Formata uma data/hora em um padrão específico (útil para exibir no formato DD/MM/AAAA)
- [DateAdd](../date-functions/dateadd.md) — Adiciona um intervalo de tempo a uma data
- [DateDiff](../date-functions/datediff.md) — Calcula a diferença entre duas datas
- [GetSendTime](../date-functions/getsendtime.md) — Retorna o horário em que o envio foi iniciado