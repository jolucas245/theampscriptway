---
title: Divide
sidebar_label: Divide
description: Divide um número por outro e retorna o quociente da operação.
---

# Divide

## Descrição

A função `Divide` realiza a divisão de dois números, retornando o quociente entre eles. É útil no dia a dia de SFMC para calcular preços unitários, distribuir valores de parcelas, calcular médias de engajamento ou qualquer cenário onde você precise dividir valores dentro de um e-mail, CloudPage ou SMS. Aceita números inteiros e decimais, positivos ou negativos.

## Sintaxe

```ampscript
Divide(dividend, divisor)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| dividend | Número | Sim | O número inicial — o valor que será dividido. Pode ser inteiro ou decimal, positivo ou negativo. |
| divisor | Número | Sim | O número pelo qual o dividend será dividido. Pode ser inteiro ou decimal, positivo ou negativo. |

## Exemplo básico

Calculando o valor de cada parcela de um pedido na MegaStore:

```ampscript
%%[
VAR @totalPedido, @numeroParcelas, @valorParcela

SET @totalPedido = 1299.90
SET @numeroParcelas = 6
SET @valorParcela = Divide(@totalPedido, @numeroParcelas)
]%%

Seu pedido de R$ 1.299,90 foi aprovado em %%=v(@numeroParcelas)=%% parcelas de R$ %%=FormatNumber(@valorParcela, "N2")=%%.
```

**Saída:**
```
Seu pedido de R$ 1.299,90 foi aprovado em 6 parcelas de R$ 216,65.
```

## Exemplo avançado

Calculando o ticket médio de um cliente do Supermercados Bela Vista para personalizar a comunicação em uma régua de relacionamento:

```ampscript
%%[
VAR @nomeCliente, @totalGasto, @totalCompras, @ticketMedio, @mensagem

SET @nomeCliente = "Maria Santos"
SET @totalGasto = 4750.80
SET @totalCompras = 12
SET @ticketMedio = Divide(@totalGasto, @totalCompras)

IF @ticketMedio > 500 THEN
  SET @mensagem = "Você é cliente VIP! Aproveite 15% de desconto na sua próxima compra."
ELSEIF @ticketMedio > 200 THEN
  SET @mensagem = "Que tal conhecer nossas ofertas especiais da semana?"
ELSE
  SET @mensagem = "Confira nossos produtos com preços imperdíveis!"
ENDIF
]%%

Olá, %%=v(@nomeCliente)=%%!

Seu ticket médio nos últimos meses foi de R$ %%=FormatNumber(@ticketMedio, "N2")=%%.

%%=v(@mensagem)=%%
```

**Saída:**
```
Olá, Maria Santos!

Seu ticket médio nos últimos meses foi de R$ 395,90.

Que tal conhecer nossas ofertas especiais da semana?
```

## Observações

> **⚠️ Atenção:** Cuidado ao usar `Divide` quando o divisor puder ser zero — divisão por zero vai gerar erro na renderização. Sempre valide o divisor antes de executar a função, especialmente quando o valor vier de uma Data Extension ou de um campo preenchido pelo usuário.

```ampscript
%%[
IF @totalCompras > 0 THEN
  SET @ticketMedio = Divide(@totalGasto, @totalCompras)
ELSE
  SET @ticketMedio = 0
ENDIF
]%%
```

> **💡 Dica:** Como `Divide` retorna o quociente com casas decimais, combine com [FormatNumber](../string-functions/formatnumber.md) para exibir o valor formatado ao cliente. Para cálculos de parcelas em R$, isso é essencial para não mostrar valores com muitas casas decimais.

> **💡 Dica:** Se você precisa do resto da divisão (e não do quociente), use a função [Mod](../math-functions/mod.md).

## Funções relacionadas

- [Add](../math-functions/add.md) — soma dois números
- [Subtract](../math-functions/subtract.md) — subtrai dois números
- [Multiply](../math-functions/multiply.md) — multiplica dois números
- [Mod](../math-functions/mod.md) — retorna o resto da divisão
- [FormatNumber](../string-functions/formatnumber.md) — formata números para exibição