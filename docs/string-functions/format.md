---
title: Format
sidebar_label: Format
description: Formata strings como datas, moedas, números e percentuais usando padrões compatíveis com C# e códigos de cultura.
---

# Format

## Descrição

A função `Format` aplica formatação a uma string, transformando-a em datas, moedas, números, percentuais e outros formatos. É uma das funções mais versáteis do AMPscript - com ela você consegue exibir valores monetários em Real (R$), datas no padrão brasileiro (DD/MM/AAAA) e números com separadores de milhar e decimal corretos para o Brasil. Retorna a string formatada conforme o padrão e o código de cultura especificados.

## Sintaxe

```ampscript
Format(stringToFormat, outputFormat [, dataFormat] [, cultureCode])
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| stringToFormat | string | Sim | A string à qual as regras de formatação serão aplicadas. |
| outputFormat | string | Sim | String de formato compatível com C# a ser aplicada ao valor. |
| dataFormat | string | Não | O tipo de dado da string. Valores aceitos: `Date` ou `Number`. |
| cultureCode | string | Não | Código de cultura para aplicar à formatação (ex: `pt-BR`, `en-US`). |

### Códigos de formato numérico

| Código | Formato de saída |
|---|---|
| C | Moeda (Currency) |
| D | Decimal |
| E | Notação científica |
| F | Ponto fixo (Fixed-point) |
| G | Geral |
| N | Número |
| P | Percentual |

### Elementos de formato de data personalizado

| Elemento | Descrição | Exemplo (para 05/08/2024 20:00:05 -06:00) |
|---|---|---|
| `y` | Ano sem zero à esquerda | 24 |
| `yy` | Ano com dois dígitos | 24 |
| `yyy` / `yyyy` | Ano completo | 2024 |
| `M` | Mês sem zero à esquerda | 8 |
| `MM` | Mês com zero à esquerda | 08 |
| `MMM` | Mês abreviado | Aug |
| `MMMM` | Mês por extenso | August |
| `d` | Dia sem zero à esquerda | 5 |
| `dd` | Dia com zero à esquerda | 05 |
| `ddd` | Dia da semana abreviado | Mon |
| `dddd` | Dia da semana por extenso | Monday |
| `h` | Hora (12h) sem zero | 8 |
| `hh` | Hora (12h) com zero | 08 |
| `H` | Hora (24h) sem zero | 8 |
| `HH` | Hora (24h) com zero | 20 |
| `m` | Minuto sem zero | 0 |
| `mm` | Minuto com zero | 00 |
| `s` | Segundo sem zero | 5 |
| `ss` | Segundo com zero | 05 |
| `t` | AM/PM abreviado | P |
| `tt` | AM/PM completo | PM |
| `z` | Offset UTC sem zero | -6 |
| `zz` | Offset UTC com zero | -06 |
| `zzz` | Offset UTC completo | -06:00 |

## Exemplo básico

Formatando um valor de pedido como moeda brasileira (Real) para um e-mail transacional da MegaStore:

```ampscript
%%[
SET @valorPedido = "1299.90"
SET @valorFormatado = Format(@valorPedido, "C", "Number", "pt-BR")
]%%

Valor do seu pedido: %%=v(@valorFormatado)=%%
```

**Saída:**
```
Valor do seu pedido: R$ 1.299,90
```

## Exemplo avançado

E-mail de confirmação de compra da Lojas Vitória, combinando formatação de data no padrão brasileiro, valor monetário e percentual de desconto:

```ampscript
%%[
SET @nomeCliente = "João Silva"
SET @dataCompra = Now()
SET @valorOriginal = "2499.90"
SET @desconto = "0.15"

/* Data no padrão brasileiro com dia da semana por extenso */
SET @dataFormatada = Format(@dataCompra, "dddd, dd/MM/yyyy", "Date", "pt-BR")

/* Horário da compra */
SET @horaFormatada = Format(@dataCompra, "HH:mm", "Date", "pt-BR")

/* Valor em Real */
SET @valorFormatado = Format(@valorOriginal, "C", "Number", "pt-BR")

/* Percentual de desconto */
SET @descontoFormatado = Format(@desconto, "P", "Number", "pt-BR")

/* Calculando valor final */
SET @valorFinal = Subtract(@valorOriginal, Multiply(@valorOriginal, @desconto))
SET @valorFinalFormatado = Format(@valorFinal, "C", "Number", "pt-BR")

/* Número do pedido formatado com zeros à esquerda */
SET @numeroPedido = "4587"
SET @pedidoFormatado = Format(@numeroPedido, "D8", "Number")
]%%

Olá, %%=v(@nomeCliente)=%%!

Compra realizada em %%=v(@dataFormatada)=%% às %%=v(@horaFormatada)=%%
Pedido nº %%=v(@pedidoFormatado)=%%

Valor original: %%=v(@valorFormatado)=%%
Desconto aplicado: %%=v(@descontoFormatado)=%%
Valor final: %%=v(@valorFinalFormatado)=%%
```

**Saída:**
```
Olá, João Silva!

Compra realizada em segunda-feira, 14/07/2025 às 10:35
Pedido nº 00004587

Valor original: R$ 2.499,90
Desconto aplicado: 15,00%
Valor final: R$ 2.124,92
```

## Observações

- O parâmetro `cultureCode` é essencial para o mercado brasileiro. Sem usar `"pt-BR"`, valores monetários virão com `$` em vez de `R$`, e os separadores de milhar/decimal ficarão no padrão americano (vírgula para milhar, ponto para decimal).

- Os formatos de data personalizados (`dd/MM/yyyy`, `dddd`, `MMMM` etc.) combinados com o culture code `"pt-BR"` retornam nomes de meses e dias da semana em português (ex: "segunda-feira", "julho").

> **💡 Dica:** Para exibir datas no padrão brasileiro, use `"dd/MM/yyyy"` - com `MM` maiúsculo para mês. Se usar `mm` minúsculo, vai trazer minutos em vez de mês. Esse é um erro clássico.

> **💡 Dica:** O formato `"C"` (Currency) com culture code `"pt-BR"` já cuida de tudo: símbolo R$, separador de milhar com ponto e decimal com vírgula. É mais prático do que montar a formatação manualmente com [Concat](../string-functions/concat.md).

> **⚠️ Atenção:** O parâmetro `dataFormat` aceita apenas `Date` ou `Number`. Se você passar um valor numérico sem especificar `"Number"` como `dataFormat`, o formato pode não ser aplicado corretamente.

> **💡 Dica:** Quando precisar apenas formatar moeda de forma simples, considere também a função [FormatCurrency](../string-functions/formatcurrency.md). Já para formatação numérica básica, veja [FormatNumber](../string-functions/formatnumber.md). A `Format` é mais poderosa porque aceita culture codes e padrões personalizados.

## Funções relacionadas

- [FormatCurrency](../string-functions/formatcurrency.md) - formatação simplificada de valores monetários
- [FormatNumber](../string-functions/formatnumber.md) - formatação simplificada de números
- [FormatDate](../date-functions/formatdate.md) - formatação específica para datas
- [Now](../date-functions/now.md) - retorna a data/hora atual do sistema
- [Concat](../string-functions/concat.md) - concatenação de strings para montar saídas compostas
- [Replace](../string-functions/replace.md) - substituição de caracteres em strings