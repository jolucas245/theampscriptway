---
title: Power
sidebar_label: Power
description: Eleva um número a uma potência especificada, retornando o resultado da exponenciação.
---

<!-- generated-by-script -->

# Power

## Descrição

A função `Power` eleva um número base a uma potência (expoente) especificada. Em outras palavras, ela calcula base^expoente. É útil quando você precisa fazer cálculos exponenciais dentro do AMPscript — por exemplo, calcular juros compostos, progressões geométricas em programas de fidelidade, ou qualquer cenário onde um valor precisa ser elevado a uma potência.

## Sintaxe

```ampscript
Power(base, expoente)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| base | Número | Sim | O número que será elevado à potência. |
| expoente | Número | Sim | A potência à qual a base será elevada. |

## Exemplo básico

```ampscript
%%[
VAR @resultado
SET @resultado = Power(2, 3)
]%%

2 elevado a 3 = %%=v(@resultado)=%%
```

**Saída:**
```
2 elevado a 3 = 8
```

## Exemplo avançado

Imagine que o **Banco Meridional** precisa mostrar no e-mail de cada cliente a projeção do rendimento de um investimento com juros compostos. A fórmula de juros compostos é: `Montante = Capital × (1 + taxa)^períodos`.

```ampscript
%%[
/* Dados do cliente vindos da Data Extension */
VAR @nomeCliente, @capitalInicial, @taxaMensal, @meses
VAR @fatorCrescimento, @montanteFinal, @rendimento
VAR @montanteFormatado, @rendimentoFormatado, @capitalFormatado

SET @nomeCliente = "Carlos Oliveira"
SET @capitalInicial = 10000
SET @taxaMensal = 0.01  /* 1% ao mês */
SET @meses = 12

/* Calcula (1 + taxa)^meses */
SET @fatorCrescimento = Power(Add(1, @taxaMensal), @meses)

/* Montante = Capital * fator */
SET @montanteFinal = Multiply(@capitalInicial, @fatorCrescimento)

/* Rendimento = Montante - Capital */
SET @rendimento = Subtract(@montanteFinal, @capitalInicial)

/* Formata os valores */
SET @capitalFormatado = FormatCurrency(@capitalInicial, "pt-BR", 2)
SET @montanteFormatado = FormatCurrency(@montanteFinal, "pt-BR", 2)
SET @rendimentoFormatado = FormatCurrency(@rendimento, "pt-BR", 2)
]%%

Olá, %%=v(@nomeCliente)=%%!

Veja a projeção do seu investimento no Banco Meridional:

💰 Capital investido: R$ %%=v(@capitalFormatado)=%%
📅 Período: %%=v(@meses)=%% meses
📈 Taxa mensal: 1%
🎯 Montante projetado: R$ %%=v(@montanteFormatado)=%%
✅ Rendimento estimado: R$ %%=v(@rendimentoFormatado)=%%

Acesse www.bancomeridional.com.br/investimentos para saber mais!
```

**Saída:**
```
Olá, Carlos Oliveira!

Veja a projeção do seu investimento no Banco Meridional:

💰 Capital investido: R$ 10.000,00
📅 Período: 12 meses
📈 Taxa mensal: 1%
🎯 Montante projetado: R$ 11.268,25
✅ Rendimento estimado: R$ 1.268,25

Acesse www.bancomeridional.com.br/investimentos para saber mais!
```

## Observações

- A função retorna um valor numérico. Se precisar exibi-lo formatado (com decimais, separador de milhar etc.), combine com [FormatNumber](../string-functions/formatnumber.md) ou [FormatCurrency](../string-functions/formatcurrency.md).
- Usando expoente `0`, o resultado será `1` para qualquer base (exceto casos indefinidos matematicamente).
- Usando expoente `1`, o resultado será a própria base.
- Expoentes negativos retornam frações (ex: `Power(2, -1)` retorna `0.5`).
- Expoentes fracionários podem ser usados para calcular raízes (ex: `Power(27, 0.333333)` retorna aproximadamente `3`, equivalente à raiz cúbica).
- Cuidado com valores muito grandes — elevar números grandes a expoentes grandes pode gerar resultados enormes ou erros de overflow.
- Ambos os parâmetros são obrigatórios. Passar valores nulos ou não numéricos pode causar erro na renderização do e-mail.

## Funções relacionadas

- [Multiply](../math-functions/multiply.md) — multiplica dois números (útil para cálculos mais simples que não envolvem exponenciação)
- [Sqrt](../math-functions/sqrt.md) — calcula a raiz quadrada de um número (equivalente a `Power(n, 0.5)`)
- [Add](../math-functions/add.md) — soma dois números
- [Subtract](../math-functions/subtract.md) — subtrai um número de outro
- [Divide](../math-functions/divide.md) — divide um número por outro
- [Round](../math-functions/round.md) — arredonda o resultado para um número específico de casas decimais
- [FormatCurrency](../string-functions/formatcurrency.md) — formata valores numéricos como moeda para exibição