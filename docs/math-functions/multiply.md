---
title: Multiply
sidebar_label: Multiply
description: Retorna o produto da multiplicação de dois números.
---

# Multiply

## Descrição

A função `Multiply` multiplica dois números e retorna o produto entre eles. É muito útil no dia a dia de SFMC para calcular valores de pedidos (preço × quantidade), aplicar taxas, calcular descontos em campanhas de e-mail marketing e montar réguas de relacionamento com valores personalizados. Os números podem ser inteiros ou decimais, positivos ou negativos.

## Sintaxe

```ampscript
Multiply(number1, number2)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| number1 | Número | Sim | O primeiro número a ser multiplicado. |
| number2 | Número | Sim | O segundo número a ser multiplicado. |

## Exemplo básico

Calculando o valor total de um item no carrinho para um e-mail de carrinho abandonado da MegaStore:

```ampscript
%%[
VAR @preco, @quantidade, @total

SET @preco = 49.90
SET @quantidade = 3
SET @total = Multiply(@preco, @quantidade)
]%%

Produto: Camiseta Básica
Preço unitário: R$ 49,90
Quantidade: %%=V(@quantidade)=%%
Total do item: R$ %%=FormatNumber(@total, "N2")=%%
```

**Saída:**
```
Produto: Camiseta Básica
Preço unitário: R$ 49,90
Quantidade: 3
Total do item: R$ 149,70
```

## Exemplo avançado

E-mail transacional do Supermercados Bela Vista com cálculo de subtotal, desconto percentual e valor final do pedido:

```ampscript
%%[
VAR @subtotal, @percentualDesconto, @valorDesconto, @totalFinal

SET @precoUnitario = 29.90
SET @quantidade = 5
SET @subtotal = Multiply(@precoUnitario, @quantidade)

/* Desconto de 15% para clientes do programa de fidelidade */
SET @percentualDesconto = 0.15
SET @valorDesconto = Multiply(@subtotal, @percentualDesconto)
SET @totalFinal = Subtract(@subtotal, @valorDesconto)
]%%

Olá, Maria Santos!

Resumo do seu pedido:
- Azeite Extra Virgem 500ml
- Preço unitário: R$ 29,90
- Quantidade: %%=V(@quantidade)=%%
- Subtotal: R$ %%=FormatNumber(@subtotal, "N2")=%%

🎉 Desconto Fidelidade Bela Vista: 15%
- Você economizou: R$ %%=FormatNumber(@valorDesconto, "N2")=%%
- Total a pagar: R$ %%=FormatNumber(@totalFinal, "N2")=%%
```

**Saída:**
```
Olá, Maria Santos!

Resumo do seu pedido:
- Azeite Extra Virgem 500ml
- Preço unitário: R$ 29,90
- Quantidade: 5
- Subtotal: R$ 149,50

🎉 Desconto Fidelidade Bela Vista: 15%
- Você economizou: R$ 22,43
- Total a pagar: R$ 127,08
```

## Observações

- A função aceita números inteiros e decimais, tanto positivos quanto negativos. Isso é útil quando você precisa, por exemplo, multiplicar por um valor negativo para representar estornos ou créditos.

> **💡 Dica:** Para exibir valores monetários em e-mails, combine `Multiply` com [FormatNumber](../string-functions/formatnumber.md) para garantir que o resultado sempre apareça com duas casas decimais — evitando que um total como `R$ 149.5` apareça sem o zero final.

> **⚠️ Atenção:** A função trabalha apenas com dois parâmetros por vez. Se você precisa multiplicar três ou mais valores (por exemplo, preço × quantidade × taxa), encadeie as chamadas: `Multiply(Multiply(@preco, @quantidade), @taxa)`.

## Funções relacionadas

- [Add](../math-functions/add.md) — soma dois números
- [Subtract](../math-functions/subtract.md) — subtrai dois números
- [Divide](../math-functions/divide.md) — divide dois números
- [Mod](../math-functions/mod.md) — retorna o resto da divisão entre dois números
- [Round](../math-functions/round.md) — arredonda um número
- [FormatNumber](../string-functions/formatnumber.md) — formata números para exibição
- [FormatCurrency](../string-functions/formatcurrency.md) — formata valores como moeda