---
title: Add
sidebar_label: Add
description: Retorna a soma de dois números.
---

# Add

## Descrição

A função `Add` retorna a soma de dois números. É útil para cálculos em e-mails transacionais, como somar valores de produtos, calcular totais de pedidos ou acumular pontos em programas de fidelidade. Os números podem ser inteiros ou decimais, positivos ou negativos.

## Sintaxe

```ampscript
Add(number1, number2)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| number1 | Número | Sim | O primeiro número a ser somado. |
| number2 | Número | Sim | O segundo número a ser somado. |

## Exemplo básico

Somando o valor de um produto com a taxa de frete em um e-mail de confirmação de pedido da MegaStore:

```ampscript
%%[
VAR @valorProduto, @frete, @total

SET @valorProduto = 256
SET @frete = 512
SET @total = Add(@valorProduto, @frete)
]%%

Total do pedido: R$ %%=V(@total)=%%
```

**Saída:**
```
Total do pedido: R$ 768
```

## Exemplo avançado

Calculando o total de um pedido com subtotal, frete e desconto (valor negativo) em um e-mail de confirmação da Lojas Vitória, com formatação em reais:

```ampscript
%%[
VAR @subtotal, @frete, @desconto, @parcial, @total

SET @subtotal = 1249.90
SET @frete = 49.99
SET @desconto = -150.00

SET @parcial = Add(@subtotal, @frete)
SET @total = Add(@parcial, @desconto)
]%%

Olá, João Silva!

Subtotal: R$ %%=FormatNumber(@subtotal, "N2")=%%
Frete: R$ %%=FormatNumber(@frete, "N2")=%%
Desconto: R$ %%=FormatNumber(@desconto, "N2")=%%

Total: R$ %%=FormatNumber(@total, "N2")=%%
```

**Saída:**
```
Olá, João Silva!

Subtotal: R$ 1249.90
Frete: R$ 49.99
Desconto: R$ -150.00

Total: R$ 1149.89
```

> **💡 Dica:** A função `Add` aceita apenas dois parâmetros por chamada. Para somar três ou mais valores, encadeie chamadas como no exemplo acima - primeiro some dois valores, depois some o resultado com o próximo.

## Observações

- Os parâmetros podem ser números inteiros ou decimais, positivos ou negativos.
- Para somar mais de dois valores, você precisa encadear múltiplas chamadas de `Add`, já que a função aceita exatamente dois parâmetros.

> **⚠️ Atenção:** Combine `Add` com a função [FormatNumber](../string-functions/formatnumber.md) ou [FormatCurrency](../string-functions/formatcurrency.md) para exibir valores monetários formatados corretamente nos seus e-mails.

## Funções relacionadas

- [Subtract](../math-functions/subtract.md) - subtrai um número de outro
- [Multiply](../math-functions/multiply.md) - multiplica dois números
- [Divide](../math-functions/divide.md) - divide um número por outro
- [FormatNumber](../string-functions/formatnumber.md) - formata a exibição de números
- [FormatCurrency](../string-functions/formatcurrency.md) - formata valores como moeda