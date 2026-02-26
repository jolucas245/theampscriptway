---
title: Add
sidebar_label: Add
description: Retorna a soma de dois números, podendo ser inteiros ou decimais, positivos ou negativos.
---

# Add

## Descrição

A função `Add()` soma dois números e retorna o resultado. Simples assim! Você pode passar números inteiros ou decimais, positivos ou negativos — ela vai devolver a soma dos dois. É super útil pra calcular totais em emails, somar pontos de fidelidade, adicionar frete ao valor de um pedido, calcular cashback e qualquer outro cenário onde você precisa somar valores dinamicamente no Marketing Cloud.

## Sintaxe

```ampscript
Add(número1, número2)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| número1 | Número | Sim | O primeiro número a ser somado. Pode ser inteiro ou decimal, positivo ou negativo. |
| número2 | Número | Sim | O segundo número a ser somado. Pode ser inteiro ou decimal, positivo ou negativo. |

## Exemplo básico

Imagine que você quer mostrar o valor total de um pedido somando o preço dos produtos com o frete:

```ampscript
%%[
VAR @valorProdutos, @frete, @totalPedido

SET @valorProdutos = 249.90
SET @frete = 18.50
SET @totalPedido = Add(@valorProdutos, @frete)
]%%

Valor dos produtos: R$ %%=FormatNumber(@valorProdutos, "N2")=%%
Frete: R$ %%=FormatNumber(@frete, "N2")=%%
Total do pedido: R$ %%=FormatNumber(@totalPedido, "N2")=%%
```

**Saída:**
```
Valor dos produtos: R$ 249,90
Frete: R$ 18,50
Total do pedido: R$ 268,40
```

## Exemplo avançado

Aqui um cenário real de programa de fidelidade: o cliente da **MegaStore** fez uma compra e ganhou pontos bônus. Vamos buscar o saldo atual na Data Extension, somar os pontos da compra e mostrar tudo num email personalizado:

```ampscript
%%[
VAR @nomeCliente, @pontosAtuais, @pontosCompra, @pontosBônus, @pontosGanhos, @novoSaldo

SET @nomeCliente = AttributeValue("PrimeiroNome")
SET @pontosAtuais = Lookup("Fidelidade_MegaStore", "SaldoPontos", "EmailAssinante", emailaddr)
SET @pontosCompra = 350
SET @pontosBônus = 150

/* Primeiro soma os pontos da compra com o bônus */
SET @pontosGanhos = Add(@pontosCompra, @pontosBônus)

/* Depois soma o total ganho com o saldo atual */
SET @novoSaldo = Add(@pontosAtuais, @pontosGanhos)
]%%

Olá, %%=v(@nomeCliente)=%%! 🎉

Sua compra na MegaStore rendeu pontos:

Pontos pela compra: %%=FormatNumber(@pontosCompra, "N0")=%%
Bônus Dia das Mães: %%=FormatNumber(@pontosBônus, "N0")=%%
Total de pontos ganhos: %%=FormatNumber(@pontosGanhos, "N0")=%%

Saldo anterior: %%=FormatNumber(@pontosAtuais, "N0")=%%
Novo saldo: %%=FormatNumber(@novoSaldo, "N0")=%%

%%[
IF @novoSaldo >= 1000 THEN
]%%
🎁 Parabéns! Você já pode trocar seus pontos por descontos em www.megastore.com.br/pontos
%%[
ENDIF
]%%
```

**Saída** (considerando que o cliente João tinha 520 pontos):
```
Olá, João! 🎉

Sua compra na MegaStore rendeu pontos:

Pontos pela compra: 350
Bônus Dia das Mães: 150
Total de pontos ganhos: 500

Saldo anterior: 520
Novo saldo: 1.020

🎁 Parabéns! Você já pode trocar seus pontos por descontos em www.megastore.com.br/pontos
```

## Observações

- A função aceita **apenas dois parâmetros**. Se você precisa somar mais de dois valores, encadeie chamadas: `Add(Add(valor1, valor2), valor3)`.
- Funciona com números **inteiros e decimais** (ex: `Add(10, 3.5)` retorna `13.5`).
- Aceita **números negativos**. Se quiser subtrair usando `Add`, basta passar um valor negativo como segundo parâmetro (ex: `Add(100, -30)` retorna `70`), mas pra isso é melhor usar a função [Subtract](../math-functions/subtract.md).
- Se algum dos parâmetros for uma string que não pode ser convertida em número, a função vai gerar um erro no momento do envio.
- Funciona em todos os contextos do Marketing Cloud: emails, CloudPages, SMS e Landing Pages.
- Pra somar valores vindos de uma Data Extension, lembre-se que o [Lookup](../data-extension-functions/lookup.md) retorna string — mas o AMPscript faz a conversão implícita pra número quando necessário.

## Funções relacionadas

- [Subtract](../math-functions/subtract.md) — Subtrai um número de outro
- [Multiply](../math-functions/multiply.md) — Multiplica dois números
- [Divide](../math-functions/divide.md) — Divide um número por outro
- [Mod](../math-functions/mod.md) — Retorna o resto de uma divisão
- [Round](../math-functions/round.md) — Arredonda um número para um número específico de casas decimais
- [FormatNumber](../string-functions/formatnumber.md) — Formata um número para exibição (ótimo pra combinar com Add)
- [FormatCurrency](../string-functions/formatcurrency.md) — Formata um número como valor monetário