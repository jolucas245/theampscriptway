---
title: Floor
sidebar_label: Floor
description: Arredonda um número decimal para baixo, retornando o maior inteiro que seja menor ou igual ao valor informado.
---

# Floor

## Descrição

A função `Floor` arredonda um número decimal **para baixo**, retornando o maior número inteiro que seja menor ou igual ao valor informado. Em outras palavras, ela "desce" até o inteiro mais próximo. É super útil quando você precisa truncar casas decimais sem arredondar para cima — por exemplo, para calcular quantidades inteiras de parcelas, níveis de programa de pontos ou quantidades de produtos que cabem em um orçamento.

## Sintaxe

```ampscript
Floor(numero)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| numero | Número | Sim | O valor numérico (decimal ou inteiro) que será arredondado para baixo. |

## Exemplo básico

Imagine que você precisa mostrar quantas parcelas inteiras um cliente já pagou, baseado no percentual pago de um financiamento:

```ampscript
%%[
VAR @valorTotal, @valorPago, @parcelasDecimal, @parcelasCompletas
SET @valorTotal = 1200.00
SET @valorPago = 850.00
SET @parcelasDecimal = Divide(@valorPago, 100)
SET @parcelasCompletas = Floor(@parcelasDecimal)
]%%

Você já completou %%=v(@parcelasCompletas)=%% de 12 parcelas!
```

**Saída:**
```
Você já completou 8 de 12 parcelas!
```

## Exemplo avançado

Cenário real: a **MegaStore** tem um programa de pontos onde a cada R$ 25,00 gastos o cliente acumula 1 ponto. Você quer mostrar no e-mail quantos pontos o cliente ganhou na última compra e qual o nível dele no programa:

```ampscript
%%[
VAR @nomeCliente, @valorCompra, @pontosGanhos, @pontosAcumulados, @nivel

SET @nomeCliente = AttributeValue("PrimeiroNome")
SET @valorCompra = AttributeValue("ValorUltimaCompra")
SET @pontosAcumulados = AttributeValue("PontosAcumulados")

/* Cada R$ 25 gastos = 1 ponto */
SET @pontosGanhos = Floor(Divide(@valorCompra, 25))

/* Atualiza total de pontos */
SET @pontosAcumulados = Add(@pontosAcumulados, @pontosGanhos)

/* Define o nível: a cada 100 pontos, sobe um nível */
VAR @nivelNumero
SET @nivelNumero = Floor(Divide(@pontosAcumulados, 100))

IF @nivelNumero >= 5 THEN
  SET @nivel = "Diamante"
ELSEIF @nivelNumero >= 3 THEN
  SET @nivel = "Ouro"
ELSEIF @nivelNumero >= 1 THEN
  SET @nivel = "Prata"
ELSE
  SET @nivel = "Bronze"
ENDIF
]%%

Olá, %%=v(@nomeCliente)=%%! 🎉

Na sua última compra de R$ %%=FormatCurrency(@valorCompra, "pt-BR", 2)=%%, você ganhou %%=v(@pontosGanhos)=%% ponto(s)!

Seu total acumulado: %%=v(@pontosAcumulados)=%% pontos
Seu nível atual: %%=v(@nivel)=%%

%%[ IF @nivel != "Diamante" THEN ]%%
Faltam %%=v(Subtract(Multiply(Add(@nivelNumero, 1), 100), @pontosAcumulados))=%% pontos para o próximo nível!
%%[ ENDIF ]%%
```

**Saída (exemplo para Maria Santos com compra de R$ 289,90 e 245 pontos acumulados):**
```
Olá, Maria! 🎉

Na sua última compra de R$ 289,90, você ganhou 11 ponto(s)!

Seu total acumulado: 256 pontos
Seu nível atual: Prata

Faltam 44 pontos para o próximo nível!
```

## Observações

- `Floor` sempre arredonda **para baixo**, inclusive com números negativos. Por exemplo, `Floor(-3.2)` retorna `-4`, não `-3` — porque `-4` é o maior inteiro menor ou igual a `-3.2`.
- Se o valor informado já for um número inteiro, a função retorna o próprio valor sem alteração.
- Não confunda com [Round](../math-functions/round.md), que arredonda para o inteiro mais próximo (para cima ou para baixo), nem com [Ceiling](../math-functions/ceiling.md), que sempre arredonda **para cima**.
- Certifique-se de que o parâmetro seja um valor numérico válido. Passar texto ou valor nulo pode gerar erro no processamento do e-mail.
- Funciona em todos os contextos do SFMC: e-mails, CloudPages, SMS e Landing Pages.

## Funções relacionadas

- [Ceiling](../math-functions/ceiling.md) — Arredonda um número para cima, retornando o menor inteiro maior ou igual ao valor informado.
- [Round](../math-functions/round.md) — Arredonda um número para o inteiro mais próximo, considerando as casas decimais.
- [Divide](../math-functions/divide.md) — Divide dois números; muito usada em conjunto com `Floor` para calcular quantidades inteiras.
- [Mod](../math-functions/mod.md) — Retorna o resto de uma divisão; útil junto com `Floor` para calcular sobras.
- [FormatNumber](../string-functions/formatnumber.md) — Formata um número com casas decimais e separadores personalizados.
- [FormatCurrency](../string-functions/formatcurrency.md) — Formata um número como valor monetário.
- [Multiply](../math-functions/multiply.md) — Multiplica dois números; complementar ao `Floor` em cálculos de pontos e parcelas.