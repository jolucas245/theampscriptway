---
title: FormatCurrency
sidebar_label: FormatCurrency
description: Formata um número como valor monetário, aplicando o símbolo, separadores e casas decimais conforme o locale informado.
---

# FormatCurrency

## Descrição

A função `FormatCurrency` recebe um número e o formata como valor monetário de acordo com o locale (código de cultura) que você especificar. Ela aplica automaticamente o símbolo da moeda, os separadores de milhar e decimal, e o número de casas decimais padrão daquele locale. No dia a dia de SFMC no Brasil, é a forma mais prática de exibir preços, saldos e valores financeiros em e-mails e CloudPages já no formato `R$ 1.234,56` - sem precisar montar essa formatação na mão.

## Sintaxe

```ampscript
FormatCurrency(number, cultureCode [, decimalPlaces] [, currencySymbol])
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| number | String ou Number | Sim | O número que você quer formatar. A função assume que o ponto (`.`) é o separador decimal. Se passar como string, vírgulas são tratadas como separadores de milhar. |
| cultureCode | String | Sim | O código de locale para a formatação. Aceita formato POSIX (ex: `pt_BR`) ou BCP 47 (ex: `pt-BR`). Define o padrão de separadores, símbolo da moeda e posicionamento. |
| decimalPlaces | Number | Não* | Quantidade de casas decimais na saída. Se omitido, usa duas casas decimais (ou o padrão do locale - ex: Japão usa zero). *Obrigatório se você informar `currencySymbol`. |
| currencySymbol | String | Não | Símbolo monetário personalizado que substitui o padrão do locale. Ao informar este parâmetro, você **deve** informar também `decimalPlaces`. |

## Exemplo básico

Exibindo o preço de um produto em um e-mail promocional da MegaStore no formato brasileiro:

```ampscript
%%[
  VAR @preco
  SET @preco = 1299.90
]%%

Produto por apenas %%=FormatCurrency(@preco, "pt_BR")=%%!
```

**Saída:**
```
Produto por apenas R$ 1.299,90!
```

## Exemplo avançado

Em um e-mail de régua de relacionamento do Banco Brasilão, você precisa exibir o saldo do cliente e o rendimento mensal. O rendimento tem 4 casas decimais para maior precisão, e o saldo usa o símbolo customizado `BRL` para reforçar a moeda em contexto internacional:

```ampscript
%%[
  VAR @nomeCliente, @saldo, @rendimento, @saldoFormatado, @rendimentoFormatado

  SET @nomeCliente = "João Silva"
  SET @saldo = 45872.50
  SET @rendimento = 387.4567

  SET @saldoFormatado = FormatCurrency(@saldo, "pt_BR", 2, "BRL ")
  SET @rendimentoFormatado = FormatCurrency(@rendimento, "pt_BR", 4)
]%%

Olá, %%=v(@nomeCliente)=%%!

Seu saldo atual: %%=v(@saldoFormatado)=%%
Rendimento no mês: %%=v(@rendimentoFormatado)=%%
```

**Saída:**
```
Olá, João Silva!

Seu saldo atual: BRL 45.872,50
Rendimento no mês: R$ 387,4567
```

## Observações

> **💡 Dica:** Para o mercado brasileiro, use sempre `"pt_BR"` como locale. Isso já cuida de tudo: símbolo `R$`, ponto como separador de milhar e vírgula como decimal. Você não precisa montar essa formatação manualmente com [Replace](../string-functions/replace.md) ou [Concat](../string-functions/concat.md).

> **⚠️ Atenção:** A função espera que o número de entrada use **ponto como separador decimal**. Se o valor vier de uma Data Extension como string no formato brasileiro (`1.299,90`), a função não vai interpretar corretamente. Garanta que o valor esteja no formato `1299.90` antes de passar para `FormatCurrency`.

> **💡 Dica:** Alguns locales têm zero casas decimais por padrão (como `ja_JP` para o iene japonês). Se precisar forçar casas decimais nesses casos, informe explicitamente o terceiro parâmetro.

> **⚠️ Atenção:** Se você quiser personalizar o símbolo da moeda (4º parâmetro), é **obrigatório** informar também o número de casas decimais (3º parâmetro). Não é possível pular o terceiro e passar direto para o quarto.

## Funções relacionadas

- [FormatNumber](../string-functions/formatnumber.md) - formata números sem símbolo de moeda (percentuais, quantidades etc.)
- [Format](../string-functions/format.md) - formatação genérica de strings, datas e números
- [Concat](../string-functions/concat.md) - concatenação de strings, útil para montar textos com valores formatados
- [Multiply](../math-functions/multiply.md) - cálculos antes de formatar (ex: aplicar desconto no preço)
- [Subtract](../math-functions/subtract.md) - calcular diferenças de valores antes de exibir