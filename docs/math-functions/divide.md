---
title: Divide
sidebar_label: Divide
description: Retorna o resultado da divisão do primeiro parâmetro pelo segundo parâmetro.
---

# Divide

## Descrição

A função `Divide()` divide um número (dividendo) por outro (divisor) e retorna o quociente. É super útil quando você precisa fazer cálculos de desconto, rateio de valores, cálculo de parcelas ou qualquer divisão dentro dos seus e-mails, CloudPages ou automações no Marketing Cloud. Ela aceita números inteiros ou decimais, positivos ou negativos.

## Sintaxe

```ampscript
Divide(dividendo, divisor)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| dividendo | Número | Sim | O número que será dividido (numerador). Pode ser inteiro ou decimal, positivo ou negativo. |
| divisor | Número | Sim | O número pelo qual o dividendo será dividido (denominador). Pode ser inteiro ou decimal, positivo ou negativo. |

## Exemplo básico

Imagine que você quer mostrar o valor de cada parcela de um produto no e-mail:

```ampscript
%%[
VAR @precoTotal, @numeroParcelas, @valorParcela

SET @precoTotal = 599.90
SET @numeroParcelas = 10
SET @valorParcela = Divide(@precoTotal, @numeroParcelas)
]%%

Aproveite! 10x de R$ %%=v(@valorParcela)=%% sem juros!
```

**Saída:**
```
Aproveite! 10x de R$ 59.99 sem juros!
```

## Exemplo avançado

Cenário real: um programa de cashback da loja fictícia **MegaStore**. O cliente acumulou pontos e você quer mostrar no e-mail quanto isso equivale em reais (cada 100 pontos = R$ 1,00), além de calcular a porcentagem de cashback em relação ao total gasto:

```ampscript
%%[
VAR @nomeCliente, @pontosAcumulados, @totalGasto, @valorCashback, @percentualCashback

SET @nomeCliente = AttributeValue("PrimeiroNome")
SET @pontosAcumulados = AttributeValue("PontosAcumulados")
SET @totalGasto = AttributeValue("TotalGastoUltimos30Dias")

/* Converte pontos em reais: cada 100 pontos = R$ 1,00 */
SET @valorCashback = Divide(@pontosAcumulados, 100)

/* Calcula o percentual de cashback sobre o total gasto */
SET @percentualCashback = Round(Multiply(Divide(@valorCashback, @totalGasto), 100), 1)
]%%

Olá, %%=v(@nomeCliente)=%%! 🎉

Você acumulou %%=v(@pontosAcumulados)=%% pontos no programa MegaStore Fidelidade.

Isso equivale a R$ %%=FormatNumber(@valorCashback, "N2")=%% em cashback!

%%[ IF @totalGasto > 0 THEN ]%%
Seu cashback representa %%=v(@percentualCashback)=%%% do que você gastou nos últimos 30 dias.
%%[ ENDIF ]%%

Resgate agora em www.megastore.com.br/cashback
```

**Saída (para um cliente com 4.500 pontos e R$ 1.200,00 gastos):**
```
Olá, Carlos! 🎉

Você acumulou 4500 pontos no programa MegaStore Fidelidade.

Isso equivale a R$ 45,00 em cashback!

Seu cashback representa 3.8% do que você gastou nos últimos 30 dias.

Resgate agora em www.megastore.com.br/cashback
```

## Observações

- **Divisão por zero:** Tome muito cuidado! Se o divisor for `0`, a função vai gerar um erro em tempo de execução. Sempre valide o divisor antes de usar `Divide()`. Você pode usar a função [IIF](../utility-functions/iif.md) ou um bloco `IF` para verificar antes de dividir.
- **Números decimais:** A função aceita números decimais tanto no dividendo quanto no divisor. O resultado também pode ser decimal.
- **Números negativos:** Funciona normalmente com valores negativos. Dividir um número positivo por um negativo (ou vice-versa) retorna um resultado negativo, como esperado.
- **Formatação do resultado:** O resultado retornado pode ter muitas casas decimais. Para exibir valores monetários formatados (ex: R$ 59,99), combine com [FormatNumber](../string-functions/formatnumber.md) ou [FormatCurrency](../string-functions/formatcurrency.md).
- **Arredondamento:** Se você precisa controlar as casas decimais do resultado, use [Round](../math-functions/round.md), [Floor](../math-functions/floor.md) ou [Ceiling](../math-functions/ceiling.md) no valor retornado.
- **Dica prática:** Para calcular parcelas em cenários de e-commerce, lembre-se de que a divisão pode gerar resultados com muitas casas decimais (ex: `Divide(100, 3)` = 33.333...). Arredonde antes de exibir para o cliente.

## Funções relacionadas

- [Add](../math-functions/add.md) — Soma dois números
- [Subtract](../math-functions/subtract.md) — Subtrai o segundo número do primeiro
- [Multiply](../math-functions/multiply.md) — Multiplica dois números
- [Mod](../math-functions/mod.md) — Retorna o resto da divisão entre dois números
- [Round](../math-functions/round.md) — Arredonda um número para o número de casas decimais especificado
- [Floor](../math-functions/floor.md) — Arredonda um número para baixo (inteiro mais próximo menor ou igual)
- [Ceiling](../math-functions/ceiling.md) — Arredonda um número para cima (inteiro mais próximo maior ou igual)
- [FormatNumber](../string-functions/formatnumber.md) — Formata um número em uma string com padrão específico
- [FormatCurrency](../string-functions/formatcurrency.md) — Formata um número como valor monetário