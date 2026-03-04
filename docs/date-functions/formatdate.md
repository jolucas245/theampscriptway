---
title: FormatDate
sidebar_label: FormatDate
description: Formata uma string como valor de data, permitindo personalizar o formato de exibição de datas e horários.
---

# FormatDate

## Descrição

A função `FormatDate` formata uma string de data em um formato específico de exibição. No dia a dia de SFMC no Brasil, você vai usar bastante para converter datas que vêm das Data Extensions (geralmente em formato americano ou ISO) para o padrão brasileiro DD/MM/AAAA. Ela retorna a data formatada como string, e se você não passar nenhum parâmetro além da data, ela usa as configurações de locale da sua Business Unit.

## Sintaxe

```ampscript
FormatDate(dateString, dateFormat, timeFormat, localeCode)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| dateString | string | Sim | A string de data que você quer formatar. |
| dateFormat | string | Não | Formato a aplicar na data. Pode ser um padrão customizado (ex: `"dd/MM/yyyy"`) ou um dos valores predefinidos: `"S"` (formato curto do locale), `"L"` (formato longo do locale), `"ISO"` (ISO 8601) ou `"RFC"` (RFC 1123). |
| timeFormat | string | Não | Formato a aplicar no horário (ex: `"H:mm:ss"`, `"hh:mm tt"`). |
| localeCode | string | Não | Código de locale para formatação (ex: `"pt_BR"`, `"ja_JP"`). |

## Exemplo básico

Formatando a data de nascimento de um cliente para exibição no padrão brasileiro em um e-mail de aniversário:

```ampscript
%%[
SET @dataNascimento = "1990-03-15"
SET @dataFormatada = FormatDate(@dataNascimento, "dd/MM/yyyy")
]%%

Olá, João Silva! Sua data de nascimento cadastrada é: %%=v(@dataFormatada)=%%
```

**Saída:**
```
Olá, João Silva! Sua data de nascimento cadastrada é: 15/03/1990
```

## Exemplo avançado

Em uma régua de relacionamento da Lojas Vitória, exibindo a data e horário de uma compra recente com formato completo em português, além de gerar um timestamp ISO para um link de rastreamento:

```ampscript
%%[
SET @dataCompra = "2024-08-05T13:41:23-06:00"

/* Data por extenso com dia da semana */
SET @dataExtenso = FormatDate(@dataCompra, "ddddd, d MMMM yyyy", "H:mm:ss", "pt_BR")

/* Formato curto para locale brasileiro */
SET @dataCurta = FormatDate(@dataCompra, "S", "", "pt_BR")

/* Formato longo para locale brasileiro */
SET @dataLonga = FormatDate(@dataCompra, "L", "", "pt_BR")

/* Timestamp ISO para sistemas */
SET @dataISO = FormatDate(@dataCompra, "ISO")

/* Formato customizado DD/MM/AAAA com horário 24h */
SET @dataHora = FormatDate(@dataCompra, "dd/MM/yyyy", "HH:mm")
]%%

Lojas Vitória - Confirmação de Compra

Data da compra: %%=v(@dataExtenso)=%%
Resumo: %%=v(@dataCurta)=%%
Data completa: %%=v(@dataLonga)=%%
Referência: %%=v(@dataHora)=%%
ID Rastreamento: %%=v(@dataISO)=%%
```

**Saída:**
```
Lojas Vitória - Confirmação de Compra

Data da compra: Monday, 5 August 2024 13:41:23
Resumo: 05/08/2024
Data completa: 5 de agosto de 2024
Referência: 05/08/2024 19:41
ID Rastreamento: 2024-08-05T13:41:23.0000000-06:00
```

## Tabela de formatação

Referência rápida dos elementos de formatação disponíveis:

| Elemento | Padrão | Exemplo (para 05/08/2024 20:00:05 PM -06:00) |
|---|---|---|
| **Ano** | `y` ou `yy` | 24 |
| | `yyy` ou `yyyy` | 2024 |
| **Mês** | `M` | 8 |
| | `MM` | 08 |
| | `MMM` | Aug |
| | `MMMM` | August |
| **Dia** | `d` | 6 |
| | `dd` | 06 |
| | `dddd` | Sat |
| | `ddddd` | Saturday |
| **Hora (12h)** | `h` | 8 |
| | `hh` | 08 |
| **Hora (24h)** | `H` | 8 |
| | `HH` | 20 |
| **Minuto** | `m` | 0 |
| | `mm` | 00 |
| **Segundo** | `s` | 5 |
| | `ss` | 05 |
| **AM/PM** | `t` | P |
| | `tt` | PM |
| **Offset** | `z` | -6 |
| | `zz` | -06 |
| | `zzz` | -06:00 |

## Formatos de entrada aceitos

A função aceita datas de entrada nos seguintes formatos:

- **ISO 8601 timestamp:** `2024-08-05T13:41:23-06:00`
- **ISO 8601 date:** `2024-08-05`
- **Notação americana:** `8/5/2024 1:41 PM`
- **Formato por extenso:** `5 August 2024` ou `August 5, 2024`
- **Data e hora:** `2024-08-05 1:41:23 PM`
- **Somente hora:** `1:41 PM`
- **Notação chinesa/japonesa:** `2024年8月5日`
- **Notação coreana:** `2024년 8월 5일`

> **⚠️ Atenção:** A função **não aceita** os seguintes formatos de entrada:
> - Datas com sufixo ordinal no dia (ex: `August 5th, 2024` ou `5th August 2024`)
> - Notação numérica little-endian (ex: `5/8/2024` para representar 5 de agosto) — isso é particularmente importante no Brasil, onde costumamos escrever dia/mês/ano. A string `5/8/2024` será interpretada como **8 de maio**, não 5 de agosto
> - Nomes de meses em idiomas que não sejam inglês (ex: `5 agosto 2024` não funciona)
> - Numerais que não sejam arábicos ocidentais
> - Calendários que não sejam o gregoriano

## Observações

- Se você não passar nenhum parâmetro além do `dateString`, a função formata a data de acordo com as configurações de locale da sua Business Unit no Marketing Cloud.

- Os formatos predefinidos `"S"` (curto) e `"L"` (longo) dependem do `localeCode` informado. Use `"pt_BR"` para obter formatos adequados ao público brasileiro.

> **💡 Dica:** No Brasil, a armadilha mais comum é passar datas no formato `DD/MM/AAAA` como entrada. A função interpreta barras no padrão americano (mês/dia/ano). Para evitar problemas, sempre armazene e passe datas no formato ISO (`AAAA-MM-DD`) e use `FormatDate` apenas na **saída** para exibir no formato brasileiro.

> **⚠️ Atenção:** Os nomes de dias e meses por extenso (como `ddddd` e `MMMM`) são gerados no idioma do locale. Para exibir "segunda-feira" e "agosto" em vez de "Monday" e "August", passe o `localeCode` como `"pt_BR"`.

> **💡 Dica:** Para combinar data formatada com outras informações em uma única string, use [Concat](../string-functions/concat.md). Para trabalhar com a data/hora atual do sistema, combine com [Now](../date-functions/now.md) ou [SystemDate](../date-functions/systemdate.md).

## Funções relacionadas

- [Now](../date-functions/now.md) — retorna a data/hora atual, útil para formatar o momento do envio
- [SystemDate](../date-functions/systemdate.md) — retorna a data do sistema sem ajuste de fuso
- [GetSendTime](../date-functions/getsendtime.md) — retorna a data/hora do envio
- [DateAdd](../date-functions/dateadd.md) — adiciona intervalos a uma data antes de formatá-la
- [DateDiff](../date-functions/datediff.md) — calcula a diferença entre duas datas
- [DatePart](../date-functions/datepart.md) — extrai partes específicas de uma data
- [DateParse](../date-functions/dateparse.md) — converte uma string em objeto de data
- [StringToDate](../date-functions/stringtodate.md) — converte string em data
- [SystemDateToLocalDate](../date-functions/systemdatetolocaldate.md) — converte data do sistema para fuso local
- [LocalDateToSystemDate](../date-functions/localdatetosystemdate.md) — converte data local para fuso do sistema
- [Format](../string-functions/format.md) — formatação genérica de strings
- [Concat](../string-functions/concat.md) — concatena strings, útil para montar textos com datas formatadas