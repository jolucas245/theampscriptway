---
title: Ceiling
sidebar_label: Ceiling
description: Arredonda um número decimal para cima, retornando o menor número inteiro que seja maior ou igual ao valor informado.
---

<!-- generated-by-script -->

# Ceiling

## Descrição

A função `Ceiling` arredonda um número decimal **para cima**, retornando o menor número inteiro que seja maior ou igual ao valor fornecido. Basicamente, ela sempre "sobe" para o próximo inteiro. É super útil quando você precisa garantir que um valor nunca fique abaixo de um limite — por exemplo, calcular parcelas, quantidade mínima de itens ou número de meses em um programa de fidelidade.

## Sintaxe

```ampscript
Ceiling(número)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| número | Número | Sim | O valor numérico (decimal ou inteiro) que você quer arredondar para cima. |

## Exemplo básico

```ampscript
%%[
VAR @valor, @resultado
SET @valor = 3.2
SET @resultado = Ceiling(@valor)
]%%

O valor arredondado para cima de %%=V(@valor)=%% é: %%=V(@resultado)=%%
```

**Saída:**
```
O valor arredondado para cima de 3.2 é: 4
```

## Exemplo avançado

Imagine que a **MegaStore** precisa calcular o número de parcelas de um pedido. O cliente pode parcelar em até 10x, mas cada parcela precisa ser de no mínimo R$ 50,00. A lógica é: divide o total por R$ 50,00 e arredonda para cima para garantir que nenhuma parcela fique abaixo desse valor mínimo.

```ampscript
%%[
VAR @nomeCliente, @totalPedido, @parcelaMinima, @maxParcelas
VAR @parcelasCalculadas, @numeroParcelas, @valorParcela

SET @nomeCliente = "Maria Santos"
SET @totalPedido = 427.50
SET @parcelaMinima = 50.00
SET @maxParcelas = 10

/* Calcula quantas parcelas são necessárias para manter o mínimo de R$ 50 */
SET @parcelasCalculadas = Ceiling(Divide(@totalPedido, @parcelaMinima))

/* Garante que não ultrapasse o máximo de 10 parcelas */
IF @parcelasCalculadas > @maxParcelas THEN
  SET @numeroParcelas = @maxParcelas
ELSE
  SET @numeroParcelas = @parcelasCalculadas
ENDIF

/* Calcula o valor de cada parcela */
SET @valorParcela = Divide(@totalPedido, @numeroParcelas)
]%%

Olá, %%=V(@nomeCliente)=%%! 🎉

Seu pedido de R$ %%=FormatNumber(@totalPedido, "N2")=%% pode ser parcelado em até %%=V(@numeroParcelas)=%%x.

Valor de cada parcela: R$ %%=FormatNumber(@valorParcela, "N2")=%%

Finalize sua compra em www.megastore.com.br/checkout
```

**Saída:**
```
Olá, Maria Santos! 🎉

Seu pedido de R$ 427,50 pode ser parcelado em até 9x.

Valor de cada parcela: R$ 47,50

Finalize sua compra em www.megastore.com.br/checkout
```

## Observações

- Se o valor passado já for um número inteiro (ex: `5.0` ou `5`), a função retorna o próprio valor sem alteração.
- Valores negativos também são arredondados **em direção ao zero** (para cima no sentido matemático). Por exemplo, `Ceiling(-3.7)` retorna `-3`, não `-4`.
- Certifique-se de que o parâmetro passado é numérico. Passar uma string não numérica pode gerar erro na renderização do e-mail.
- Funciona em todos os contextos do Marketing Cloud: e-mails, CloudPages, SMS e Landing Pages.
- Para arredondar **para baixo**, use a função [Floor](../math-functions/floor.md). Para arredondar para o inteiro mais próximo (regra padrão), use [Round](../math-functions/round.md).

## Funções relacionadas

- [Floor](../math-functions/floor.md) — Arredonda um número decimal para baixo (menor inteiro que seja menor ou igual ao valor).
- [Round](../math-functions/round.md) — Arredonda um número para o inteiro mais próximo ou para um número específico de casas decimais.
- [Divide](../math-functions/divide.md) — Divide dois números, muito usado em conjunto com `Ceiling` para cálculos de parcelas e proporções.
- [Multiply](../math-functions/multiply.md) — Multiplica dois números.
- [Mod](../math-functions/mod.md) — Retorna o resto de uma divisão, útil para verificar se um número é divisível por outro.
- [FormatNumber](../string-functions/formatnumber.md) — Formata um número para exibição com casas decimais e separadores.
- [FormatCurrency](../string-functions/formatcurrency.md) — Formata um valor como moeda para exibição.