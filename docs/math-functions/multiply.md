---
title: Multiply
sidebar_label: Multiply
description: Retorna o produto da multiplicação de dois números.
---

<!-- generated-by-script -->

# Multiply

## Descrição

A função `Multiply()` multiplica dois números e retorna o produto entre eles. É super útil para calcular valores totais em e-mails (tipo quantidade × preço unitário), aplicar descontos percentuais, converter pontos em reais e diversas outras operações matemáticas no dia a dia do Marketing Cloud. Você pode passar números inteiros ou decimais, positivos ou negativos.

## Sintaxe

```ampscript
Multiply(número1, número2)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| número1 | Número | Sim | O primeiro número a ser multiplicado. Pode ser inteiro ou decimal, positivo ou negativo. |
| número2 | Número | Sim | O segundo número a ser multiplicado. Pode ser inteiro ou decimal, positivo ou negativo. |

## Exemplo básico

Um cenário clássico: calcular o valor total de um item no carrinho multiplicando a quantidade pelo preço unitário.

```ampscript
%%[
VAR @quantidade, @precoUnitario, @total

SET @quantidade = 3
SET @precoUnitario = 89.90
SET @total = Multiply(@quantidade, @precoUnitario)
]%%

Você adicionou %%=v(@quantidade)=%% unidades ao carrinho.
Preço unitário: R$ %%=FormatNumber(@precoUnitario, "N2")=%%
Total do item: R$ %%=FormatNumber(@total, "N2")=%%
```

**Saída:**
```
Você adicionou 3 unidades ao carrinho.
Preço unitário: R$ 89,90
Total do item: R$ 269,70
```

## Exemplo avançado

Imagine um e-mail de programa de fidelidade da **Conecta Telecom**, onde o cliente acumulou pontos e você precisa mostrar quanto esses pontos valem em reais, além de calcular o desconto aplicado na próxima fatura.

```ampscript
%%[
VAR @nomeCliente, @pontosAcumulados, @valorPorPonto, @valorEmReais
VAR @valorFatura, @percentualDesconto, @valorDesconto, @faturaComeDesconto

/* Dados do cliente vindos da Data Extension */
SET @nomeCliente = Lookup("Clientes_Fidelidade", "NomeCliente", "Email", emailaddr)
SET @pontosAcumulados = Lookup("Clientes_Fidelidade", "Pontos", "Email", emailaddr)
SET @valorFatura = Lookup("Clientes_Fidelidade", "ValorFatura", "Email", emailaddr)

/* Cada ponto vale R$ 0.05 */
SET @valorPorPonto = 0.05
SET @valorEmReais = Multiply(@pontosAcumulados, @valorPorPonto)

/* Calcular desconto de 15% na fatura */
SET @percentualDesconto = 0.15
SET @valorDesconto = Multiply(@valorFatura, @percentualDesconto)
SET @faturaComeDesconto = Subtract(@valorFatura, @valorDesconto)
]%%

Olá, %%=ProperCase(@nomeCliente)=%%! 🎉

Confira o resumo do seu programa de pontos Conecta+:

🏆 Pontos acumulados: %%=FormatNumber(@pontosAcumulados, "N0")=%%
💰 Valor em reais: R$ %%=FormatNumber(@valorEmReais, "N2")=%%

Sua próxima fatura: R$ %%=FormatNumber(@valorFatura, "N2")=%%
Desconto exclusivo (15%): - R$ %%=FormatNumber(@valorDesconto, "N2")=%%
Valor com desconto: R$ %%=FormatNumber(@faturaComeDesconto, "N2")=%%

%%[ IF @pontosAcumulados >= 1000 THEN ]%%
🎁 Parabéns! Você pode trocar seus pontos por créditos na fatura.
Acesse: www.conectatelecom.com.br/fidelidade
%%[ ELSE ]%%
Faltam apenas %%=FormatNumber(Subtract(1000, @pontosAcumulados), "N0")=%% pontos para você resgatar créditos!
%%[ ENDIF ]%%
```

**Saída** (exemplo para Maria Santos com 1.250 pontos e fatura de R$ 179,90):
```
Olá, Maria Santos! 🎉

Confira o resumo do seu programa de pontos Conecta+:

🏆 Pontos acumulados: 1.250
💰 Valor em reais: R$ 62,50

Sua próxima fatura: R$ 179,90
Desconto exclusivo (15%): - R$ 26,99
Valor com desconto: R$ 152,92

🎁 Parabéns! Você pode trocar seus pontos por créditos na fatura.
Acesse: www.conectatelecom.com.br/fidelidade
```

## Observações

- A função aceita **números inteiros e decimais**, tanto positivos quanto negativos.
- Multiplicar por um número negativo retorna um resultado negativo (ex: `Multiply(10, -3)` retorna `-30`). Multiplicar dois negativos retorna um positivo (ex: `Multiply(-5, -4)` retorna `20`).
- Se você precisar multiplicar mais de dois números, encadeie chamadas: `Multiply(Multiply(@a, @b), @c)`.
- Para formatar o resultado como moeda brasileira (com vírgula e duas casas decimais), combine com [FormatNumber](../string-functions/formatnumber.md) ou [FormatCurrency](../string-functions/formatcurrency.md).
- Se algum dos parâmetros não for numérico ou for nulo, a função pode gerar erro no processamento do e-mail. Use [IsNull](../utility-functions/isnull.md) ou [IsNullDefault](../utility-functions/isnulldefault.md) para validar os valores antes de multiplicar.
- A função funciona em todos os contextos do Marketing Cloud: e-mails, CloudPages, SMS e landing pages.

## Funções relacionadas

- [Add](../math-functions/add.md) — Soma dois números.
- [Subtract](../math-functions/subtract.md) — Subtrai um número de outro.
- [Divide](../math-functions/divide.md) — Divide um número por outro.
- [Mod](../math-functions/mod.md) — Retorna o resto da divisão entre dois números.
- [Round](../math-functions/round.md) — Arredonda um número para um determinado número de casas decimais.
- [FormatNumber](../string-functions/formatnumber.md) — Formata um número em string com padrão específico.
- [FormatCurrency](../string-functions/formatcurrency.md) — Formata um número como moeda.
- [Power](../math-functions/power.md) — Eleva um número a uma potência (multiplicação repetida).