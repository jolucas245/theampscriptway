---
title: LocalDateToSystemDate
sidebar_label: LocalDateToSystemDate
description: Converte uma data/hora no fuso local da conta Marketing Cloud para o horário do sistema (CST/UTC-6).
---

# LocalDateToSystemDate

## Descrição

Converte uma string de data/hora no fuso horário local da sua conta Marketing Cloud para o horário do sistema. O horário do sistema é o North American Central Standard Time (UTC-6), **sem** ajuste para horário de verão. O fuso local é o configurado na sua conta SFMC em Setup — no caso de contas brasileiras, geralmente configurado para o horário de Brasília (UTC-3).

## Sintaxe

```ampscript
LocalDateToSystemDate(timeToConvert)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| timeToConvert | string | Sim | A string de data/hora no fuso local que você deseja converter para o horário do sistema. |

## Exemplo básico

Convertendo o horário local de Brasília para o horário do sistema (CST) ao registrar o momento de abertura de um e-mail da Lojas Vitória:

```ampscript
%%[
SET @horaLocal = Now()
SET @horaSistema = LocalDateToSystemDate(@horaLocal)
]%%

Hora local da sua conta: %%=v(@horaLocal)=%%
Hora do sistema (CST): %%=v(@horaSistema)=%%
```

**Saída:**
```
Hora local da sua conta: 25/06/2025 10:30:00
Hora do sistema (CST): 25/06/2025 07:30:00
```

## Exemplo avançado

Cenário real: a MegaStore precisa gravar em uma Data Extension o horário do sistema (CST) para manter consistência nos logs de interação, independentemente do fuso configurado na conta. O e-mail exibe a hora local para o cliente, mas o registro usa a hora do sistema.

```ampscript
%%[
SET @nomeCliente = "Maria Santos"
SET @horaLocalAtual = Now()
SET @horaSistemaAtual = LocalDateToSystemDate(@horaLocalAtual)

/* Exibe a hora local para a cliente */
SET @horaFormatada = FormatDate(@horaLocalAtual, "dd/MM/yyyy", "HH:mm")

/* Registra no log com hora do sistema para padronização */
InsertDE(
  "Log_Interacoes",
  "NomeCliente", @nomeCliente,
  "HoraLocal", @horaLocalAtual,
  "HoraSistema", @horaSistemaAtual,
  "Tipo", "Abertura de Email"
)
]%%

Olá, %%=v(@nomeCliente)=%%. Este e-mail foi gerado em %%=v(@horaFormatada)=%%.
```

**Saída:**
```
Olá, Maria Santos. Este e-mail foi gerado em 25/06/2025 10:30.
```

## Observações

> **⚠️ Atenção:** O horário do sistema (CST) é fixo em UTC-6 e **não** se ajusta para horário de verão. Isso significa que a diferença entre o horário de Brasília e o horário do sistema será sempre a mesma (3 horas), independentemente da época do ano. Leve isso em conta ao calcular intervalos de tempo.

> **💡 Dica:** Essa função é essencial quando você precisa comparar timestamps de diferentes fontes no SFMC. Como o sistema opera internamente em CST, converter para o horário do sistema antes de gravar em Data Extensions garante consistência nos dados — especialmente útil em réguas de relacionamento que dependem de cálculos precisos com [DateDiff](../date-functions/datediff.md) ou [DateAdd](../date-functions/dateadd.md).

> **💡 Dica:** Para fazer o caminho inverso — converter do horário do sistema para o horário local da conta — use [SystemDateToLocalDate](../date-functions/systemdatetolocaldate.md).

## Funções relacionadas

- [SystemDateToLocalDate](../date-functions/systemdatetolocaldate.md) — faz a conversão inversa, do horário do sistema para o horário local
- [Now](../date-functions/now.md) — retorna a data/hora atual
- [SystemDate](../date-functions/systemdate.md) — retorna a data/hora do sistema diretamente
- [FormatDate](../date-functions/formatdate.md) — formata datas para exibição
- [DateDiff](../date-functions/datediff.md) — calcula a diferença entre duas datas
- [DateAdd](../date-functions/dateadd.md) — adiciona intervalos a uma data