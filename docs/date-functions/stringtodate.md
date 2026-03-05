---
title: StringToDate
sidebar_label: StringToDate
description: Converte uma string de data em um objeto datetime .NET para uso em operações de data no AMPscript.
---

# StringToDate

## Descrição

Converte uma string de data em um objeto datetime do .NET. Essa função é essencial quando você recebe datas como texto (de Data Extensions, APIs ou parâmetros de URL) e precisa transformá-las em objetos de data reais para fazer cálculos, comparações ou formatações. Aceita diversos formatos de entrada, mas exige atenção especial porque **não suporta o formato brasileiro DD/MM/AAAA** - ela interpreta datas numéricas com barra no padrão americano (MM/DD/AAAA).

## Sintaxe

```ampscript
StringToDate(dateString)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| dateString | String | Sim | A string de data ou timestamp que será convertida em um objeto datetime .NET. Aceita diversos formatos como ISO 8601, notação americana, notação por extenso em inglês, entre outros. |

## Formatos suportados

| Formato | Exemplo |
|---------|---------|
| ISO 8601 timestamp | `2023-08-05T13:41:23-06:00` |
| ISO 8601 date | `2023-08-05` |
| Notação americana (data e hora) | `8/5/2023 1:41 PM` |
| Por extenso em inglês | `5 August 2023` ou `August 5, 2023` |
| Data e hora | `2023-08-05 1:41:23 PM` |
| Somente hora | `1:41 PM` |
| Notação chinesa/japonesa | `2023年8月5日` |
| Notação coreana | `2023년 8월 5일` |

## Formatos NÃO suportados

| Formato | Exemplo |
|---------|---------|
| Dia com sufixo ordinal | `August 5th, 2023` ou `5th August 2023` |
| Notação little-endian (DD/MM/AAAA) | `5/8/2023` para representar 5 de agosto |
| Nomes de meses em outros idiomas | `5 août 2023` |
| Numerais não ocidentais | `٢٠٢٣/٨/٥` |
| Calendários não-gregorianos | `18 Av, 5783` ou `18 Muharram, 1445` |

## Exemplo básico

Convertendo uma data no formato ISO 8601 (o formato mais seguro para uso no Brasil, já que evita ambiguidade entre dia e mês):

```ampscript
%%[
VAR @dataTexto, @dataObjeto

SET @dataTexto = "2024-03-15"
SET @dataObjeto = StringToDate(@dataTexto)
]%%

Data convertida: %%=V(@dataObjeto)=%%
```

**Saída:**
```
Data convertida: 3/15/2024 12:00:00 AM
```

## Exemplo avançado

Cenário de régua de relacionamento da Lojas Vitória: um e-mail de lembrete de vencimento de crédito. A data de vencimento vem de uma Data Extension como texto no formato ISO 8601 e precisa ser convertida para calcular os dias restantes e exibir no formato brasileiro:

```ampscript
%%[
VAR @nome, @dataVencimentoTexto, @dataVencimento, @hoje, @diasRestantes, @dataFormatada

SET @nome = "Maria Santos"
SET @dataVencimentoTexto = "2024-12-20T00:00:00-03:00"

SET @dataVencimento = StringToDate(@dataVencimentoTexto)
SET @hoje = Now()
SET @diasRestantes = DateDiff(@hoje, @dataVencimento, "D")
SET @dataFormatada = FormatDate(@dataVencimento, "dd/MM/yyyy")

IF @diasRestantes > 0 THEN
]%%

Olá, %%=V(@nome)=%%!

Seu crédito na Lojas Vitória vence em %%=V(@dataFormatada)=%%.
Faltam apenas %%=V(@diasRestantes)=%% dias. Aproveite antes que expire!

%%[
ELSE
]%%

Olá, %%=V(@nome)=%%!

Seu crédito na Lojas Vitória venceu em %%=V(@dataFormatada)=%%.
Renove agora e continue aproveitando condições especiais.

%%[
ENDIF
]%%
```

**Saída (supondo que hoje é 10/12/2024):**
```
Olá, Maria Santos!

Seu crédito na Lojas Vitória vence em 20/12/2024.
Faltam apenas 10 dias. Aproveite antes que expire!
```

## Observações

> **⚠️ Atenção:** A função **não suporta o formato brasileiro DD/MM/AAAA com barras**. Se você passar `05/08/2023`, ela vai interpretar como **5 de agosto** (formato americano MM/DD/AAAA), não como 8 de maio. E se passar `25/12/2024`, pode gerar erro, já que não existe mês 25. **Sempre use o formato ISO 8601 (`AAAA-MM-DD`) para evitar ambiguidade** - esse é o formato mais seguro para o cenário brasileiro.

> **💡 Dica:** Se seus dados vêm de sistemas brasileiros no formato `DD/MM/AAAA`, use [Replace](../string-functions/replace.md) e [Substring](../string-functions/substring.md) para reorganizar a string para o formato ISO antes de passar para `StringToDate`. Por exemplo, converta `15/03/2024` para `2024-03-15`.

> **💡 Dica:** Nomes de meses em português (como "agosto", "dezembro") **não são suportados**. Se precisar converter textos com nomes de meses, eles precisam estar em inglês (ex: `15 August 2024`).

- A função retorna um objeto datetime .NET, que pode ser usado diretamente com [FormatDate](../date-functions/formatdate.md), [DateAdd](../date-functions/dateadd.md), [DateDiff](../date-functions/datediff.md) e [DatePart](../date-functions/datepart.md).

## Funções relacionadas

- [FormatDate](../date-functions/formatdate.md) - formata o objeto datetime retornado para exibição (ex: `dd/MM/yyyy`)
- [DateParse](../date-functions/dateparse.md) - outra função para conversão de strings em datas
- [DateAdd](../date-functions/dateadd.md) - adiciona intervalos de tempo a uma data
- [DateDiff](../date-functions/datediff.md) - calcula a diferença entre duas datas
- [DatePart](../date-functions/datepart.md) - extrai partes específicas de uma data (dia, mês, ano)
- [Now](../date-functions/now.md) - retorna a data/hora atual
- [Replace](../string-functions/replace.md) - útil para reformatar strings de data antes da conversão
- [Substring](../string-functions/substring.md) - útil para extrair partes de strings de data