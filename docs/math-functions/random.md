---
title: Random
sidebar_label: Random
description: Retorna um número aleatório dentro de um intervalo definido por um limite inferior e um limite superior.
---

<!-- generated-by-script -->

# Random

## Descrição

A função `Random` gera um número aleatório dentro de um intervalo que você define. Você passa dois valores — um limite inferior e um limite superior — e a função retorna um número que pode ser **maior ou igual** ao menor valor e **menor ou igual** ao maior valor. A ordem dos parâmetros não importa: a função sempre identifica qual é o menor e qual é o maior automaticamente. É super útil para sorteios, cupons aleatórios, testes A/B, personalização dinâmica de conteúdo e qualquer cenário onde você precise de aleatoriedade.

## Sintaxe

```ampscript
Random(lowerBound, upperBound)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|------------|--------|-------------|-----------|
| lowerBound | Número | Sim | O menor número que a função pode retornar. Aceita inteiros e decimais, positivos ou negativos. |
| upperBound | Número | Sim | O maior número que a função pode retornar. Aceita inteiros e decimais, positivos ou negativos. |

## Exemplo básico

Um sorteio simples onde cada assinante recebe um número da sorte entre 1 e 1000:

```ampscript
%%[
SET @numeroSorte = Random(1, 1000)
]%%

Olá! Seu número da sorte é: %%=v(@numeroSorte)=%%
Guarde esse número — o resultado do sorteio será divulgado dia 25/12/2024!
```

**Saída:**
```
Olá! Seu número da sorte é: 472
Guarde esse número — o resultado do sorteio será divulgado dia 25/12/2024!
```

## Exemplo avançado

### Cupom de desconto aleatório para campanha de Dia das Mães

Neste cenário, a loja fictícia **Lojas Vitória** quer enviar um e-mail de Dia das Mães onde cada cliente recebe um desconto surpresa entre 5% e 30%, além de um código de cupom único gerado com base em um número aleatório:

```ampscript
%%[
SET @primeiroNome = AttributeValue("PrimeiroNome")
SET @desconto = Random(5, 30)
SET @codigoCupom = Concat("MAES2024-", Random(100000, 999999))

IF @desconto >= 25 THEN
  SET @mensagem = "Você teve SUPER SORTE! 🎉 Aproveite esse descontão!"
ELSEIF @desconto >= 15 THEN
  SET @mensagem = "Ótimo desconto pra você presentear quem você ama! 💝"
ELSE
  SET @mensagem = "Um presentinho especial da Lojas Vitória pra você! 🌷"
ENDIF
]%%

Olá, %%=v(@primeiroNome)=%%!

O Dia das Mães tá chegando e a Lojas Vitória preparou uma surpresa exclusiva pra você:

🎁 **%%=v(@desconto)=%% % de desconto** em todo o site!

%%=v(@mensagem)=%%

Use o cupom **%%=v(@codigoCupom)=%%** no checkout.
Válido até 12/05/2024 | Frete grátis acima de R$ 299,00

👉 www.lojasvitoria.com.br/diadasmaes
```

**Saída:**
```
Olá, Maria!

O Dia das Mães tá chegando e a Lojas Vitória preparou uma surpresa exclusiva pra você:

🎁 27% de desconto em todo o site!

Você teve SUPER SORTE! 🎉 Aproveite esse descontão!

Use o cupom MAES2024-584203 no checkout.
Válido até 12/05/2024 | Frete grátis acima de R$ 299,00

👉 www.lojasvitoria.com.br/diadasmaes
```

### Teste A/B de conteúdo com distribuição aleatória

A **Conecta Telecom** quer testar três variações de assunto de oferta para descobrir qual converte melhor:

```ampscript
%%[
SET @variante = Random(1, 3)

IF @variante == 1 THEN
  SET @oferta = "Ganhe 10 GB extras no seu plano por apenas R$ 9,90/mês!"
  SET @cta = "QUERO MAIS INTERNET"
ELSEIF @variante == 2 THEN
  SET @oferta = "Seu plano com cashback de R$ 25,00 todo mês. Que tal?"
  SET @cta = "QUERO CASHBACK"
ELSE
  SET @oferta = "Indique um amigo e ganhem R$ 50,00 cada em crédito!"
  SET @cta = "QUERO INDICAR"
ENDIF
]%%

%%=v(@oferta)=%%

[%%=v(@cta)=%%] → www.conectatelecom.com.br/ofertas
```

**Saída:**
```
Seu plano com cashback de R$ 25,00 todo mês. Que tal?

[QUERO CASHBACK] → www.conectatelecom.com.br/ofertas
```

### Sorteio de pontos bônus em programa de fidelidade

O **Banco Meridional** distribui pontos bônus aleatórios para incentivar o uso do cartão:

```ampscript
%%[
SET @nome = AttributeValue("NomeCompleto")
SET @pontosBase = Random(50, 500)
SET @multiplicador = Random(1, 3)
SET @pontosTotal = Multiply(@pontosBase, @multiplicador)
]%%

%%=v(@nome)=%%, você acaba de ganhar **%%=FormatNumber(@pontosTotal, "N0")=%%** pontos Meridional Rewards! 🏆

Esses pontos já estão disponíveis na sua conta.
Consulte seu saldo em www.bancomeridional.com.br/rewards
```

**Saída:**
```
João Silva, você acaba de ganhar 750 pontos Meridional Rewards! 🏆

Esses pontos já estão disponíveis na sua conta.
Consulte seu saldo em www.bancomeridional.com.br/rewards
```

## Observações

- **A ordem dos parâmetros não importa.** `Random(1, 100)` e `Random(100, 1)` funcionam da mesma forma — a função identifica automaticamente qual é o menor e qual é o maior.
- **Aceita números inteiros e decimais.** Você pode usar `Random(1.5, 9.7)`, por exemplo. O retorno também pode ser decimal nesse caso.
- **Aceita números negativos.** `Random(-10, 10)` é perfeitamente válido e retornará um número entre -10 e 10, inclusive.
- **O intervalo é inclusivo nas duas pontas.** O número retornado pode ser **igual** ao limite inferior ou **igual** ao limite superior.
- **Cada execução gera um valor diferente.** Se você chamar `Random` duas vezes no mesmo e-mail, cada chamada pode retornar um valor diferente.
- **O resultado muda a cada envio/renderização.** Se o mesmo e-mail for aberto novamente (em caso de conteúdo dinâmico via AmpScript em tempo de abertura), o valor pode ser diferente. Considere gravar o valor em uma Data Extension com [InsertDE](../data-extension-functions/insertde.md) ou [UpsertDE](../data-extension-functions/upsertde.md) se precisar manter o número consistente.
- **Para gerar números estritamente inteiros**, combine com [Floor](../math-functions/floor.md), [Ceiling](../math-functions/ceiling.md) ou [Round](../math-functions/round.md) caso esteja usando limites decimais.
- **Os dois parâmetros são obrigatórios.** Se você omitir um deles, a função retornará erro.

## Funções relacionadas

- [Add](../math-functions/add.md) — soma dois valores, útil para ajustar o resultado do Random
- [Multiply](../math-functions/multiply.md) — multiplica valores, ótimo para criar multiplicadores com o número aleatório
- [Mod](../math-functions/mod.md) — retorna o resto da divisão, útil para distribuir variantes de forma controlada
- [Floor](../math-functions/floor.md) — arredonda para baixo, útil para garantir um inteiro a partir do Random
- [Ceiling](../math-functions/ceiling.md) — arredonda para cima, outra forma de garantir inteiro
- [Round](../math-functions/round.md) — arredonda para o número mais próximo com controle de casas decimais
- [Min](../math-functions/min.md) — retorna o menor entre dois valores, útil para limitar o resultado
- [Max](../math-functions/max.md) — retorna o maior entre dois valores, útil para definir um piso mínimo
- [Concat](../string-functions/concat.md) — concatena strings, perfeito para gerar códigos de cupom com números aleatórios
- [FormatNumber](../string-functions/formatnumber.md) — formata números para exibição amigável
- [IIF](../utility-functions/iif.md) — condicional inline, útil para decisões rápidas baseadas no número gerado
- [UpsertDE](../data-extension-functions/upsertde.md) — grava dados em Data Extension, ideal para persistir o número sorteado