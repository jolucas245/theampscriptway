---
title: Min
sidebar_label: Min
description: Retorna o menor valor entre dois ou mais números fornecidos como parâmetros.
---

<!-- generated-by-script -->

# Min

## Descrição

A função `Min` compara dois ou mais valores numéricos e retorna o **menor** entre eles. É super útil quando você precisa garantir um valor mínimo em cálculos, como definir o menor preço entre opções de produto, limitar descontos, ou encontrar o menor saldo entre contas de um cliente. A função aceita múltiplos parâmetros e avalia todos eles para retornar o de menor valor.

## Sintaxe

```ampscript
Min(valor1, valor2 [, valor3, ...])
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| valor1 | Número | Sim | Primeiro valor numérico a ser comparado. |
| valor2 | Número | Sim | Segundo valor numérico a ser comparado. |
| valorN | Número | Não | Valores adicionais para comparação. Você pode passar quantos quiser. |

**Retorno:** Número — o menor valor entre todos os parâmetros informados.

## Exemplo básico

Imagine que você quer mostrar o menor preço entre três opções de frete para o cliente:

```ampscript
%%[
VAR @freteNormal, @freteExpresso, @freteSedex, @menorFrete

SET @freteNormal = 32.90
SET @freteExpresso = 24.50
SET @freteSedex = 45.00

SET @menorFrete = Min(@freteNormal, @freteExpresso, @freteSedex)
]%%

O menor valor de frete disponível é: R$ %%=FormatNumber(@menorFrete, "N2")=%%
```

**Saída:**
```
O menor valor de frete disponível é: R$ 24,50
```

## Exemplo avançado

Cenário real: a **MegaStore** está rodando uma campanha de Dia das Mães onde o cliente ganha um desconto personalizado. O desconto é calculado como 15% do valor do carrinho, mas tem um teto máximo de R$ 100,00. Além disso, o cliente tem um saldo de cashback acumulado. O desconto final aplicado será o **menor** entre o desconto calculado, o teto máximo e o saldo de cashback — garantindo que nenhum limite seja ultrapassado.

```ampscript
%%[
VAR @nomeCliente, @valorCarrinho, @saldoCashback
VAR @descontoCalculado, @tetoMaximo, @descontoFinal

SET @nomeCliente = AttributeValue("PrimeiroNome")
SET @valorCarrinho = Lookup("Carrinho_Abandonado", "ValorTotal", "EmailAddress", EmailAddress)
SET @saldoCashback = Lookup("Programa_Cashback", "Saldo", "EmailAddress", EmailAddress)

SET @descontoCalculado = Multiply(@valorCarrinho, 0.15)
SET @tetoMaximo = 100.00

SET @descontoFinal = Min(@descontoCalculado, @tetoMaximo, @saldoCashback)

SET @valorFinal = Subtract(@valorCarrinho, @descontoFinal)
]%%

Olá, %%=v(@nomeCliente)=%%! 💐

Neste Dia das Mães, preparamos algo especial para você na MegaStore!

Valor do seu carrinho: R$ %%=FormatNumber(@valorCarrinho, "N2")=%%
Seu saldo de cashback: R$ %%=FormatNumber(@saldoCashback, "N2")=%%
Desconto calculado (15%): R$ %%=FormatNumber(@descontoCalculado, "N2")=%%

✅ Desconto aplicado: R$ %%=FormatNumber(@descontoFinal, "N2")=%%
💰 Valor final: R$ %%=FormatNumber(@valorFinal, "N2")=%%

Finalize sua compra em www.megastore.com.br e aproveite!
```

**Saída (exemplo para Maria Santos com carrinho de R$ 520,00 e cashback de R$ 78,00):**
```
Olá, Maria! 💐

Neste Dia das Mães, preparamos algo especial para você na MegaStore!

Valor do seu carrinho: R$ 520,00
Seu saldo de cashback: R$ 78,00
Desconto calculado (15%): R$ 78,00

✅ Desconto aplicado: R$ 78,00
💰 Valor final: R$ 442,00

Finalize sua compra em www.megastore.com.br e aproveite!
```

Nesse caso, o desconto de 15% daria R$ 78,00, o teto é R$ 100,00 e o cashback é R$ 78,00. O `Min` retorna R$ 78,00 — o menor entre os três.

## Observações

- A função precisa de **pelo menos dois parâmetros** numéricos para funcionar.
- Todos os parâmetros devem ser valores numéricos. Se você passar uma string que não possa ser convertida para número, a função pode gerar um erro no processamento do e-mail.
- A função funciona com números inteiros e decimais, incluindo valores negativos. Por exemplo, `Min(-5, -10, 3)` retorna `-10`.
- Se os valores vierem de uma Data Extension como texto, é uma boa prática garantir que sejam numéricos antes de usar o `Min`. Considere tratar possíveis nulos com [IsNull](../utility-functions/isnull.md) ou [IsNullDefault](../utility-functions/isnulldefault.md).
- A função `Min` é o oposto da função [Max](../math-functions/max.md) — juntas, elas são muito úteis para definir limites (piso e teto) em cálculos de desconto, pontos, cashback, etc.
- Funciona em todos os contextos do SFMC: e-mails, CloudPages, SMS e Landing Pages.

## Funções relacionadas

- [Max](../math-functions/max.md) — Retorna o **maior** valor entre dois ou mais números. O complemento perfeito do `Min`.
- [Abs](../math-functions/abs.md) — Retorna o valor absoluto de um número (remove o sinal negativo).
- [Round](../math-functions/round.md) — Arredonda um número para um número específico de casas decimais.
- [Floor](../math-functions/floor.md) — Arredonda um número para baixo, para o inteiro mais próximo.
- [Ceiling](../math-functions/ceiling.md) — Arredonda um número para cima, para o inteiro mais próximo.
- [Subtract](../math-functions/subtract.md) — Subtrai um valor de outro, útil para calcular valores finais após descontos.
- [Multiply](../math-functions/multiply.md) — Multiplica dois valores, ideal para calcular percentuais de desconto.
- [FormatNumber](../string-functions/formatnumber.md) — Formata números para exibição (casas decimais, separadores).
- [IIF](../utility-functions/iif.md) — Avaliação condicional inline, útil em conjunto com `Min` para lógica mais complexa.