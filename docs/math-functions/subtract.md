---
title: Subtract
sidebar_label: Subtract
description: Retorna o resultado da subtração do segundo parâmetro a partir do primeiro parâmetro.
---

<!-- generated-by-script -->

# Subtract

## Descrição

A função `Subtract()` subtrai o segundo número do primeiro número e retorna a diferença entre eles. É o equivalente a fazer uma conta de "menos" em AMPscript. Você pode usar essa função para calcular descontos, saldo restante, diferença de pontos, troco, e qualquer cenário onde precise subtrair valores. Aceita números inteiros e decimais, tanto positivos quanto negativos.

## Sintaxe

```ampscript
Subtract(minuendo, subtraendo)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| minuendo | Número | Sim | O número inicial, de onde será subtraído o valor. |
| subtraendo | Número | Sim | O número que será subtraído do minuendo. |

## Exemplo básico

Um e-commerce calculando o valor com desconto de um produto:

```ampscript
%%[
VAR @precoOriginal, @desconto, @precoFinal

SET @precoOriginal = 299.90
SET @desconto = 50.00
SET @precoFinal = Subtract(@precoOriginal, @desconto)
]%%

Preço original: R$ %%=FormatNumber(@precoOriginal, "N2")=%%
Desconto: - R$ %%=FormatNumber(@desconto, "N2")=%%
Você paga: R$ %%=FormatNumber(@precoFinal, "N2")=%%
```

**Saída:**
```
Preço original: R$ 299,90
Desconto: - R$ 50,00
Você paga: R$ 249,90
```

## Exemplo avançado

Cenário real de um programa de fidelidade da **Conecta Telecom**, onde o cliente resgata pontos e você precisa mostrar o saldo atualizado no e-mail de confirmação:

```ampscript
%%[
VAR @nomeCliente, @pontosAtuais, @pontosResgatados, @saldoRestante
VAR @valorFatura, @creditoResgate, @valorAPagar

SET @nomeCliente = AttributeValue("PrimeiroNome")
SET @pontosAtuais = Lookup("Programa_Pontos", "SaldoPontos", "SubscriberKey", _subscriberkey)
SET @pontosResgatados = Lookup("Programa_Pontos", "PontosResgatados", "SubscriberKey", _subscriberkey)
SET @valorFatura = Lookup("Faturas", "ValorTotal", "SubscriberKey", _subscriberkey)
SET @creditoResgate = Divide(@pontosResgatados, 100) /* cada 100 pontos = R$ 1,00 */

SET @saldoRestante = Subtract(@pontosAtuais, @pontosResgatados)
SET @valorAPagar = Subtract(@valorFatura, @creditoResgate)

/* Garante que o valor a pagar não fique negativo */
IF @valorAPagar < 0 THEN
  SET @valorAPagar = 0
ENDIF
]%%

Olá, %%=v(@nomeCliente)=%%! 👋

Aqui está o resumo do seu resgate de pontos Conecta:

🏆 Saldo anterior: %%=FormatNumber(@pontosAtuais, "N0")=%% pontos
🔄 Pontos resgatados: %%=FormatNumber(@pontosResgatados, "N0")=%% pontos
✅ Novo saldo: %%=FormatNumber(@saldoRestante, "N0")=%% pontos

💰 Valor da fatura: R$ %%=FormatNumber(@valorFatura, "N2")=%%
💚 Crédito do resgate: - R$ %%=FormatNumber(@creditoResgate, "N2")=%%
📋 Valor a pagar: R$ %%=FormatNumber(@valorAPagar, "N2")=%%

%%[ IF @saldoRestante >= 500 THEN ]%%
Você ainda tem pontos suficientes para mais resgates! Acesse: www.conectatelecom.com.br/pontos
%%[ ENDIF ]%%
```

**Saída:**
```
Olá, Carlos! 👋

Aqui está o resumo do seu resgate de pontos Conecta:

🏆 Saldo anterior: 3.200 pontos
🔄 Pontos resgatados: 1.500 pontos
✅ Novo saldo: 1.700 pontos

💰 Valor da fatura: R$ 189,90
💚 Crédito do resgate: - R$ 15,00
📋 Valor a pagar: R$ 174,90

Você ainda tem pontos suficientes para mais resgates! Acesse: www.conectatelecom.com.br/pontos
```

## Observações

- A função aceita números **inteiros e decimais**, tanto positivos quanto negativos.
- Se você subtrair um número negativo, o resultado será uma soma. Por exemplo, `Subtract(100, -20)` retorna `120`. Isso é matemática pura: subtrair um negativo é o mesmo que somar.
- `Subtract()` retorna apenas o resultado numérico. Para formatar como moeda brasileira (com vírgula e duas casas decimais), combine com [FormatNumber](../string-functions/formatnumber.md) ou [FormatCurrency](../string-functions/formatcurrency.md).
- Se algum dos parâmetros não for um número válido, a função vai gerar um erro. Valide os dados antes de usar, especialmente quando os valores vêm de Data Extensions ou atributos de perfil.
- Para cenários onde o valor pode ser nulo, use [IsNull](../utility-functions/isnull.md) ou [IsNullDefault](../utility-functions/isnulldefault.md) para tratar antes de passar para `Subtract()`.
- A função aceita exatamente **dois parâmetros**. Se precisar subtrair mais de um valor, encadeie chamadas: `Subtract(Subtract(@valor, @desconto1), @desconto2)`.

## Funções relacionadas

- [Add](../math-functions/add.md) — Soma dois números. Operação inversa da subtração.
- [Multiply](../math-functions/multiply.md) — Multiplica dois números. Útil para calcular percentuais de desconto.
- [Divide](../math-functions/divide.md) — Divide dois números. Útil para converter pontos em reais, por exemplo.
- [Abs](../math-functions/abs.md) — Retorna o valor absoluto de um número. Útil quando a subtração pode resultar em negativo e você quer só a diferença.
- [Round](../math-functions/round.md) — Arredonda o resultado para um número específico de casas decimais.
- [FormatNumber](../string-functions/formatnumber.md) — Formata o resultado numérico para exibição (ex: separador de milhar e casas decimais).
- [FormatCurrency](../string-functions/formatcurrency.md) — Formata valores como moeda para exibição em e-mails.
- [Lookup](../data-extension-functions/lookup.md) — Busca valores em Data Extensions para usar nos cálculos.
- [IsNullDefault](../utility-functions/isnulldefault.md) — Define um valor padrão caso o dado seja nulo, evitando erros na subtração.