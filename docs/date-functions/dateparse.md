---
title: DateParse
sidebar_label: DateParse
description: Converte uma string de data em um objeto DateTime, aceitando diversos formatos de entrada.
---

# DateParse

## Descrição

A função `DateParse` converte uma string que contém uma data ou timestamp em um objeto `DateTime` que o AMPscript consegue manipular. É essencial quando você recebe datas como texto de Data Extensions, APIs ou parâmetros de URL e precisa tratá-las como datas reais - para fazer cálculos com [DateAdd](../date-functions/dateadd.md), comparações com [DateDiff](../date-functions/datediff.md) ou formatação com [FormatDate](../date-functions/formatdate.md). Aceita diversos formatos de entrada, incluindo ISO 8601, notação americana e formatos por extenso em inglês.

## Sintaxe

```ampscript
DateParse(@dateString)
DateParse(@dateString, @boolUseUtc)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| dateString | String | Sim | String contendo uma data ou timestamp a ser convertida. |
| boolUseUtc | Boolean | Não | Se `true`, retorna a data/hora em UTC. Se `false`, usa o horário local definido na Business Unit. O valor padrão é `false`. |

## Formatos aceitos

A função aceita os seguintes formatos de data na string de entrada:

| Formato | Exemplo |
|---|---|
| ISO 8601 timestamp | `2023-08-05T13:41:23-06:00` |
| ISO 8601 date | `2023-08-05` |
| Data e hora (notação americana) | `8/5/2023 1:41 PM` |
| Por extenso (inglês) | `5 August 2023` ou `August 5, 2023` |
| Data e hora combinados | `2023-08-05 1:41:23 PM` |
| Apenas hora | `1:41 PM` |
| Notação chinesa/japonesa | `2023年8月5日` |
| Notação coreana | `2023년 8월 5일` |

> **⚠️ Atenção:** A função **não suporta** os seguintes formatos:
> - Dias com sufixo ordinal: `August 5th, 2023` ou `5th August 2023`
> - Notação numérica little-endian (DD/MM/AAAA): `5/8/2023` para representar 5 de agosto - a função interpreta como 8 de maio!
> - Nomes de meses em outros idiomas que não inglês: `5 août 2023`, `5 agosto 2023`
> - Numerais que não sejam arábicos ocidentais: `٢٠٢٣/٨/٥`
> - Calendários não-gregorianos: `18 Av, 5783` ou `18 Muharram, 1445`

## Exemplo básico

Convertendo uma data ISO 8601 vinda de uma Data Extension para exibir a hora atual em UTC em um e-mail da Lojas Vitória:

```ampscript
%%[
VAR @horaUtc
SET @horaUtc = DateParse(Now(), true)
]%%

Hora atual em UTC: %%=v(@horaUtc)=%%
```

**Saída:**
```
Hora atual em UTC: 8/5/2023 7:41:23 PM
```

## Exemplo avançado

Cenário real: a Conecta Telecom armazena a data de vencimento da fatura como texto no formato ISO 8601 na Data Extension. Você precisa converter essa string em data, calcular quantos dias faltam e exibir a informação formatada no e-mail de lembrete:

```ampscript
%%[
VAR @vencimentoTexto, @vencimentoData, @hoje, @diasRestantes, @dataFormatada

/* Data vinda da DE como texto no formato ISO 8601 */
SET @vencimentoTexto = "2024-07-15"
SET @vencimentoData = DateParse(@vencimentoTexto)

SET @hoje = Now()
SET @diasRestantes = DateDiff(@hoje, @vencimentoData, "D")
SET @dataFormatada = FormatDate(@vencimentoData, "dd/MM/yyyy")
]%%

Olá, João Silva!

Sua fatura da Conecta Telecom vence em %%=v(@dataFormatada)=%%.

%%[ IF @diasRestantes > 0 AND @diasRestantes <= 3 THEN ]%%
  ⚠️ Faltam apenas %%=v(@diasRestantes)=%% dia(s)! Não deixe para a última hora.
%%[ ELSEIF @diasRestantes <= 0 THEN ]%%
  🔴 Sua fatura já venceu. Regularize agora mesmo.
%%[ ELSE ]%%
  Você ainda tem %%=v(@diasRestantes)=%% dias para efetuar o pagamento.
%%[ ENDIF ]%%
```

**Saída:**
```
Olá, João Silva!

Sua fatura da Conecta Telecom vence em 15/07/2024.

Você ainda tem 12 dias para efetuar o pagamento.
```

## Observações

> **⚠️ Atenção:** Este é o ponto mais crítico para desenvolvedores no Brasil. O formato `DD/MM/AAAA` (little-endian) que usamos no dia a dia **não é suportado** pela `DateParse`. Se você passar `05/08/2024` esperando 5 de agosto, a função vai interpretar como **8 de maio**. Sempre converta suas datas para o formato ISO 8601 (`2024-08-05`) ou use a notação americana (`8/5/2024`) antes de passar para a função.

> **💡 Dica:** Se seus dados vêm de uma DE com datas no formato brasileiro (`DD/MM/AAAA`), use [Substring](../string-functions/substring.md) para extrair dia, mês e ano e remontar a string no formato ISO 8601 antes de passar para `DateParse`. Por exemplo: transforme `05/08/2024` em `2024-08-05`.

> **💡 Dica:** O parâmetro `boolUseUtc` é especialmente útil quando você precisa de consistência em operações que envolvem múltiplos fusos horários. Com `true`, a função ignora o fuso da Business Unit e retorna sempre em UTC - ideal para registrar timestamps de ações em Cloud Pages com [InsertDE](../data-extension-functions/insertde.md).

- Quando o parâmetro `boolUseUtc` não é informado, o padrão é `false`, ou seja, a função usa o horário local configurado na sua Business Unit.
- Nomes de meses por extenso funcionam apenas em inglês. `"5 August 2023"` funciona, mas `"5 agosto 2023"` não.

## Funções relacionadas

- [FormatDate](../date-functions/formatdate.md) - formata um objeto DateTime para exibição (use após o `DateParse` para mostrar a data em formato brasileiro)
- [DateAdd](../date-functions/dateadd.md) - adiciona ou subtrai intervalos de tempo a uma data
- [DateDiff](../date-functions/datediff.md) - calcula a diferença entre duas datas
- [DatePart](../date-functions/datepart.md) - extrai partes específicas de uma data (dia, mês, ano, hora)
- [Now](../date-functions/now.md) - retorna a data/hora atual da Business Unit
- [StringToDate](../date-functions/stringtodate.md) - outra função para converter strings em datas
- [LocalDateToSystemDate](../date-functions/localdatetosystemdate.md) - converte horário local para horário do sistema
- [SystemDateToLocalDate](../date-functions/systemdatetolocaldate.md) - converte horário do sistema para horário local