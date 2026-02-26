---
title: Format
sidebar_label: Format
description: Formata strings como datas, moedas, números e percentuais, com suporte a formatos customizados e códigos de cultura (locale).
---

# Format

## Descrição

A função `Format` formata uma string de acordo com um formato especificado, usando padrões compatíveis com C#. Ela é extremamente versátil: você pode usá-la para formatar datas (com nomes de dia e mês por extenso), valores monetários, números decimais, percentuais, notação científica e muito mais. Você também pode passar um código de cultura (locale) para adaptar a saída a um idioma ou país específico — perfeito para exibir valores em Reais (R$) ou datas no formato brasileiro. Retorna uma string formatada.

## Sintaxe

```ampscript
Format(stringToFormat, outputFormat)
Format(stringToFormat, outputFormat, dataFormat)
Format(stringToFormat, outputFormat, dataFormat, cultureCode)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| stringToFormat | String | Sim | A string que você quer formatar. |
| outputFormat | String | Sim | O formato de saída compatível com C# a ser aplicado na string. Pode ser um código de formato (como `C`, `N`, `P`) ou um padrão customizado de data (como `dd/MM/yyyy`). |
| dataFormat | String | Não | O tipo de dado da string. Valores aceitos: `Date` ou `Number`. |
| cultureCode | String | Não | Um código de cultura (locale) para aplicar à formatação (ex: `pt-BR`, `en-US`, `hi-IN`). |

### Códigos de formato numérico

| Código | Formato de saída |
|---|---|
| C | Moeda (Currency) |
| D | Decimal |
| E | Notação científica |
| F | Ponto fixo (Fixed-point) |
| G | Geral |
| N | Número com separadores de milhar |
| P | Percentual |

### Elementos de formato de data customizado

| Elemento | Exemplo (para 05/08/2024, segunda-feira, 20:00:05, fuso -03:00) |
|---|---|
| `d` | 5 |
| `dd` | 05 |
| `ddd` | seg (abreviação do dia) |
| `dddd` | segunda-feira (nome completo do dia) |
| `M` | 8 |
| `MM` | 08 |
| `MMM` | ago (abreviação do mês) |
| `MMMM` | agosto (nome completo do mês) |
| `y` | 24 |
| `yy` | 24 |
| `yyy` / `yyyy` | 2024 |
| `h` | 8 (12h) |
| `hh` | 08 (12h) |
| `H` | 20 (24h) |
| `HH` | 20 (24h) |
| `m` | 0 |
| `mm` | 00 |
| `s` | 5 |
| `ss` | 05 |
| `t` | P |
| `tt` | PM |
| `z` | -3 |
| `zz` | -03 |
| `zzz` | -03:00 |

## Exemplo básico

Cenário: você quer exibir o valor total do pedido de um cliente no formato de moeda brasileira (R$).

```ampscript
%%[
  SET @valorPedido = "1549.90"
  SET @valorFormatado = Format(@valorPedido, "C", "Number", "pt-BR")
]%%

Olá, João! O valor total do seu pedido é %%=v(@valorFormatado)=%%.
```

**Saída:**
```
Olá, João! O valor total do seu pedido é R$ 1.549,90.
```

## Exemplo avançado

Cenário: a Lojas Vitória está enviando um e-mail de confirmação de compra na Black Friday. O e-mail precisa exibir a data da compra formatada no padrão brasileiro, o valor com desconto em Reais, e o percentual de desconto aplicado.

```ampscript
%%[
  SET @nomeCliente = "Maria Santos"
  SET @dataCompra = "2024-11-29 14:35:00"
  SET @valorOriginal = 899.90
  SET @percentualDesconto = 0.25
  SET @valorDesconto = Multiply(@valorOriginal, Subtract(1, @percentualDesconto))

  /* Formata a data no padrão brasileiro com dia da semana por extenso */
  SET @dataFormatada = Format(@dataCompra, "dddd, dd 'de' MMMM 'de' yyyy 'às' HH:mm", "Date", "pt-BR")

  /* Formata o valor como moeda brasileira */
  SET @valorOriginalFormatado = Format(@valorOriginal, "C", "Number", "pt-BR")
  SET @valorFinalFormatado = Format(@valorDesconto, "C", "Number", "pt-BR")

  /* Formata o percentual de desconto */
  SET @descontoFormatado = Format(@percentualDesconto, "P0", "Number", "pt-BR")
]%%

Olá, %%=v(@nomeCliente)=%%!

Sua compra na Lojas Vitória foi confirmada! 🎉

📅 Data: %%=v(@dataFormatada)=%%
💰 Valor original: %%=v(@valorOriginalFormatado)=%%
🏷️ Desconto Black Friday: %%=v(@descontoFormatado)=%%
✅ Valor pago: %%=v(@valorFinalFormatado)=%%

Frete grátis para compras acima de R$299,00! Seu pedido se qualifica. 🚚

Obrigado por comprar com a gente!
Lojas Vitória — www.lojasvitoria.com.br
```

**Saída:**
```
Olá, Maria Santos!

Sua compra na Lojas Vitória foi confirmada! 🎉

📅 Data: sexta-feira, 29 de novembro de 2024 às 14:35
💰 Valor original: R$ 899,90
🏷️ Desconto Black Friday: 25%
✅ Valor pago: R$ 674,93

Frete grátis para compras acima de R$299,00! Seu pedido se qualifica. 🚚

Obrigado por comprar com a gente!
Lojas Vitória — www.lojasvitoria.com.br
```

## Mais exemplos

### Formatando números com separador de milhar

```ampscript
%%[
  SET @pontos = "158430"
  SET @pontosFormatados = Format(@pontos, "N0", "Number", "pt-BR")
]%%

Carlos, você tem %%=v(@pontosFormatados)=%% pontos no programa de fidelidade da FarmaRede!
```

**Saída:**
```
Carlos, você tem 158.430 pontos no programa de fidelidade da FarmaRede!
```

### Formatando data simples (DD/MM/AAAA)

```ampscript
%%[
  SET @dataVencimento = "2025-01-15"
  SET @dataFormatada = Format(@dataVencimento, "dd/MM/yyyy", "Date")
]%%

Sua fatura do Banco Meridional vence em %%=v(@dataFormatada)=%%.
```

**Saída:**
```
Sua fatura do Banco Meridional vence em 15/01/2025.
```

### Usando com dados de uma Data Extension

```ampscript
%%[
  SET @saldo = Lookup("Clientes_Conecta", "Saldo", "Email", emailaddr)
  SET @saldoFormatado = Format(@saldo, "C", "Number", "pt-BR")
]%%

Seu saldo de cashback na Conecta Telecom é de %%=v(@saldoFormatado)=%%.
```

**Saída:**
```
Seu saldo de cashback na Conecta Telecom é de R$ 47,50.
```

## Observações

- O parâmetro `outputFormat` segue as convenções de formatação do C#. Consulte a documentação da Microsoft sobre [NumberFormatInfo](https://learn.microsoft.com/dotnet/api/system.globalization.numberformatinfo) e [DateTimeFormatInfo](https://learn.microsoft.com/dotnet/api/system.globalization.datetimeformatinfo) para referência completa.
- Para formatar valores em Reais (R$), use o `cultureCode` como `"pt-BR"` junto com o formato `"C"` e o `dataFormat` como `"Number"`.
- O parâmetro `dataFormat` aceita apenas dois valores: `Date` ou `Number`. Se você não informar, o comportamento depende do formato passado em `outputFormat`.
- Ao usar formatos customizados de data, preste atenção na diferença entre `M` (mês) e `m` (minuto) — é case-sensitive!
- A diferença entre `h`/`hh` (formato 12 horas) e `H`/`HH` (formato 24 horas) é importante. O Brasil geralmente usa o formato 24 horas.
- Você pode incluir texto literal dentro do padrão de data envolvendo-o em aspas simples, como `'de'` ou `'às'`.
- Para exibir percentual sem casas decimais, use `"P0"`. Para duas casas, use `"P2"` ou simplesmente `"P"`.
- Se você precisa apenas formatar moeda de forma simples sem se preocupar com locale, considere usar [FormatCurrency](../string-functions/formatcurrency.md). Para formatação simples de números, considere [FormatNumber](../string-functions/formatnumber.md).
- A função `Format` é a mais flexível das três — use-a quando precisar de controle total sobre o formato de saída.

## Funções relacionadas

- [FormatCurrency](../string-functions/formatcurrency.md) — formata um valor como moeda de forma simplificada
- [FormatNumber](../string-functions/formatnumber.md) — formata um valor numérico de forma simplificada
- [FormatDate](../date-functions/formatdate.md) — formata datas com opções pré-definidas (short, long, etc.)
- [Now](../date-functions/now.md) — retorna a data e hora atuais do sistema
- [DatePart](../date-functions/datepart.md) — extrai uma parte específica de uma data (dia, mês, ano, etc.)
- [Concat](../string-functions/concat.md) — concatena strings (útil para montar textos formatados)
- [Multiply](../math-functions/multiply.md) — multiplica valores (útil para cálculos de desconto antes de formatar)
- [Subtract](../math-functions/subtract.md) — subtrai valores numéricos
- [Lookup](../data-extension-functions/lookup.md) — busca um valor em uma Data Extension para depois formatar
- [V](../utility-functions/v.md) — exibe o valor de uma variável inline no conteúdo