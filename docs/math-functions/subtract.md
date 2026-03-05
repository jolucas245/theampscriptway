---
title: Subtract
sidebar_label: Subtract
description: Subtrai o segundo número do primeiro e retorna a diferença entre eles.
---

# Subtract

## Descrição

A função `Subtract` subtrai o segundo parâmetro do primeiro e retorna a diferença entre os dois valores. É útil para cálculos como descontos em preços, diferença de pontos em programas de fidelidade, cálculo de saldo restante e qualquer operação de subtração dentro dos seus e-mails, CloudPages ou automações no SFMC. Os parâmetros podem ser números inteiros ou decimais, positivos ou negativos.

## Sintaxe

```ampscript
Subtract(minuend, subtrahend)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| minuend | Número | Sim | O número inicial, de onde será subtraído o valor. |
| subtrahend | Número | Sim | O número a ser subtraído do primeiro parâmetro. |

## Exemplo básico

Calculando o valor de um produto da MegaStore após aplicar um desconto fixo:

```ampscript
%%[
VAR @precoOriginal, @desconto, @precoFinal

SET @precoOriginal = 299.90
SET @desconto = 50
SET @precoFinal = Subtract(@precoOriginal, @desconto)
]%%

Preço original: R$ %%=FormatNumber(@precoOriginal, "N2")=%%
Desconto: R$ %%=FormatNumber(@desconto, "N2")=%%
Você paga: R$ %%=FormatNumber(@precoFinal, "N2")=%%
```

**Saída:**
```
Preço original: R$ 299,90
Desconto: R$ 50,00
Você paga: R$ 249,90
```

## Exemplo avançado

E-mail de régua de relacionamento do programa de fidelidade da Lojas Vitória, mostrando ao cliente quantos pontos faltam para resgatar um prêmio e o saldo após uma compra recente:

```ampscript
%%[
VAR @nome, @pontosAtuais, @pontosUsados, @saldoPontos, @metaResgate, @pontosFaltando

SET @nome = "Maria Santos"
SET @pontosAtuais = 4800
SET @pontosUsados = 1200
SET @metaResgate = 5000

SET @saldoPontos = Subtract(@pontosAtuais, @pontosUsados)
SET @pontosFaltando = Subtract(@metaResgate, @saldoPontos)
]%%

Olá, %%=V(@nome)=%%!

Seu saldo atual: %%=FormatNumber(@pontosAtuais, "N0")=%% pontos
Pontos usados na última troca: %%=FormatNumber(@pontosUsados, "N0")=%% pontos
Saldo restante: %%=FormatNumber(@saldoPontos, "N0")=%% pontos

%%[ IF @pontosFaltando > 0 THEN ]%%
Faltam apenas %%=FormatNumber(@pontosFaltando, "N0")=%% pontos para você resgatar seu próximo prêmio!
%%[ ELSE ]%%
Parabéns! Você já pode resgatar seu prêmio!
%%[ ENDIF ]%%
```

**Saída:**
```
Olá, Maria Santos!

Seu saldo atual: 4.800 pontos
Pontos usados na última troca: 1.200 pontos
Saldo restante: 3.600 pontos

Faltam apenas 1.400 pontos para você resgatar seu próximo prêmio!
```

## Observações

- A função aceita números inteiros e decimais, tanto positivos quanto negativos. Se o subtrahend for maior que o minuend, o resultado será negativo - o que é útil para identificar saldo devedor ou déficit de pontos, por exemplo.

- Subtrair um número negativo equivale a uma soma. Por exemplo, `Subtract(100, -50)` retorna `150`.

> **💡 Dica:** Para cálculos de preço com centavos (muito comum com Real), use a função [FormatNumber](../string-functions/formatnumber.md) ou [FormatCurrency](../string-functions/formatcurrency.md) para exibir o resultado com duas casas decimais e formatação brasileira.

## Funções relacionadas

- [Add](../math-functions/add.md) - soma dois números (operação inversa)
- [Multiply](../math-functions/multiply.md) - multiplica dois números
- [Divide](../math-functions/divide.md) - divide dois números
- [Mod](../math-functions/mod.md) - retorna o resto da divisão
- [FormatNumber](../string-functions/formatnumber.md) - formata o resultado numérico para exibição
- [FormatCurrency](../string-functions/formatcurrency.md) - formata valores monetários