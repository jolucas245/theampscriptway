---
title: DatePart
sidebar_label: DatePart
description: Extrai uma parte específica (dia, mês, ano, hora ou minuto) de uma string de data ou timestamp.
---

# DatePart

## Descrição

Extrai uma parte específica de uma data — como o dia, mês, ano, hora ou minuto — a partir de uma string de data ou timestamp. É uma função essencial quando você precisa segmentar conteúdo com base em partes isoladas da data, como exibir uma mensagem diferente conforme o mês de aniversário do cliente ou montar lógicas condicionais baseadas no ano de cadastro. Retorna o valor numérico correspondente à parte extraída.

## Sintaxe

```ampscript
DatePart(dateString, datePart)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| dateString | string | Sim | String contendo uma data ou timestamp. |
| datePart | string | Sim | A parte da data que você quer extrair. Valores aceitos: `"Y"` (ano), `"M"` (mês), `"D"` (dia), `"H"` (hora) e `"MI"` (minutos). |

## Formatos de data suportados

A função aceita strings de data em diversos formatos:

| Formato | Exemplo |
|---------|---------|
| ISO 8601 timestamp | `2023-08-05T13:41:23-06:00` |
| ISO 8601 date | `2023-08-05` |
| Data e hora no padrão US | `8/5/2023 1:41 PM` |
| Formato por extenso (inglês) | `5 August 2023` ou `August 5, 2023` |
| Data e hora | `2023-08-05 1:41:23 PM` |
| Somente hora | `1:41 PM` |
| Notação chinesa/japonesa | `2023年8月5日` |
| Notação coreana | `2023년 8월 5일` |

> **⚠️ Atenção:** A função **não suporta** os seguintes formatos:
> - Dias com sufixo ordinal em inglês (`August 5th, 2023` ou `5th August 2023`)
> - Notação numérica little-endian (`5/8/2023` para representar 5 de agosto) — o formato numérico com barras é interpretado como padrão americano (mês/dia/ano)
> - Nomes de meses em idiomas que não sejam inglês (`5 août 2023`, `5 agosto 2023`)
> - Numerais que não sejam arábicos ocidentais (`٢٠٢٣/٨/٥`)
> - Calendários diferentes do gregoriano (`18 Av, 5783` ou `18 Muharram, 1445`)

## Exemplo básico

Extraindo o ano atual para exibir no rodapé de um e-mail da Lojas Vitória:

```ampscript
%%[
VAR @dataAtual, @anoAtual
SET @dataAtual = Now()
SET @anoAtual = DatePart(@dataAtual, "Y")
]%%

© %%=v(@anoAtual)=%% Lojas Vitória. Todos os direitos reservados.
```

**Saída:**
```
© 2025 Lojas Vitória. Todos os direitos reservados.
```

## Exemplo avançado

Personalizando um e-mail de aniversário na régua de relacionamento do Banco Brasilão, exibindo o mês e montando uma saudação com base no horário do envio:

```ampscript
%%[
VAR @dataNascimento, @mesAniversario, @diaAniversario
VAR @horaEnvio, @saudacao, @nomeMes

SET @dataNascimento = AttributeValue("DataNascimento")
SET @mesAniversario = DatePart(@dataNascimento, "M")
SET @diaAniversario = DatePart(@dataNascimento, "D")

SET @horaEnvio = DatePart(Now(), "H")

IF @horaEnvio < 12 THEN
  SET @saudacao = "Bom dia"
ELSEIF @horaEnvio < 18 THEN
  SET @saudacao = "Boa tarde"
ELSE
  SET @saudacao = "Boa noite"
ENDIF

IF @mesAniversario == 1 THEN
  SET @nomeMes = "janeiro"
ELSEIF @mesAniversario == 2 THEN
  SET @nomeMes = "fevereiro"
ELSEIF @mesAniversario == 3 THEN
  SET @nomeMes = "março"
ELSEIF @mesAniversario == 4 THEN
  SET @nomeMes = "abril"
ELSEIF @mesAniversario == 5 THEN
  SET @nomeMes = "maio"
ELSEIF @mesAniversario == 6 THEN
  SET @nomeMes = "junho"
ELSEIF @mesAniversario == 7 THEN
  SET @nomeMes = "julho"
ELSEIF @mesAniversario == 8 THEN
  SET @nomeMes = "agosto"
ELSEIF @mesAniversario == 9 THEN
  SET @nomeMes = "setembro"
ELSEIF @mesAniversario == 10 THEN
  SET @nomeMes = "outubro"
ELSEIF @mesAniversario == 11 THEN
  SET @nomeMes = "novembro"
ELSE
  SET @nomeMes = "dezembro"
ENDIF
]%%

%%=v(@saudacao)=%%, Maria Santos!

Dia %%=v(@diaAniversario)=%% de %%=v(@nomeMes)=%% é o seu dia especial! 🎂
O Banco Brasilão preparou uma condição exclusiva para você.
```

**Saída:**
```
Boa tarde, Maria Santos!

Dia 15 de março é o seu dia especial! 🎂
O Banco Brasilão preparou uma condição exclusiva para você.
```

## Observações

> **⚠️ Atenção:** Datas no formato brasileiro `DD/MM/AAAA` (como `05/08/2023`) serão interpretadas no padrão americano `MM/DD/AAAA`. Ou seja, `05/08/2023` será lido como **5 de agosto** (e não 8 de maio). Para datas onde o dia é maior que 12 (como `25/08/2023`), o comportamento pode ser imprevisível. Sempre converta suas datas para o formato ISO 8601 (`2023-08-05`) antes de usar `DatePart` para evitar ambiguidades.

> **💡 Dica:** Use `DatePart` com `"MI"` (e não `"M"`) para extrair minutos. O `"M"` extrai o mês. Essa é uma confusão comum que pode gerar bugs silenciosos nas suas comunicações.

> **💡 Dica:** Quando precisar apenas formatar a exibição de uma data (sem lógica condicional), considere usar [FormatDate](../date-functions/formatdate.md). Reserve `DatePart` para quando você precisa do valor numérico isolado para comparações e condicionais.

## Funções relacionadas

- [Now](../date-functions/now.md) — retorna a data e hora atuais (útil como input para `DatePart`)
- [FormatDate](../date-functions/formatdate.md) — formata a exibição de uma data
- [DateAdd](../date-functions/dateadd.md) — adiciona intervalos a uma data
- [DateDiff](../date-functions/datediff.md) — calcula a diferença entre duas datas
- [DateParse](../date-functions/dateparse.md) — converte uma string em objeto de data
- [StringToDate](../date-functions/stringtodate.md) — converte string para data
- [Format](../string-functions/format.md) — formatação genérica de valores