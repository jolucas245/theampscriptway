---
title: Round
sidebar_label: Round
description: Arredonda um número para uma quantidade específica de casas decimais.
---

<!-- generated-by-script -->

# Round

## Descrição

A função `Round` arredonda um valor numérico para o número de casas decimais que você especificar. É super útil quando você precisa exibir valores monetários certinhos (como preços em Reais), calcular percentuais de desconto, ou formatar pontuações em programas de fidelidade. A função retorna o número arredondado de acordo com a precisão informada.

## Sintaxe

```ampscript
Round(número, casas_decimais)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|----------------|-----------|---------------|----------------|
| número | Número | Sim | O valor numérico que você deseja arredondar. |
| casas_decimais | Inteiro | Sim | O número de casas decimais para o arredondamento. |

## Exemplo básico

```ampscript
%%[
VAR @preco, @precoArredondado
SET @preco = 149.956
SET @precoArredondado = Round(@preco, 2)
]%%

Preço final: R$ %%=v(@precoArredondado)=%%
```

**Saída:**
```
Preço final: R$ 149.96
```

## Exemplo avançado

Imagine que a loja **MegaStore** está fazendo uma campanha de cashback onde o cliente recebe 7,5% do valor da última compra de volta. Você precisa calcular o cashback e exibir o valor arredondado bonitinho no e-mail:

```ampscript
%%[
VAR @nomeCliente, @valorCompra, @percentualCashback, @cashbackBruto, @cashbackFinal, @saldoAtual, @novoSaldo

SET @nomeCliente = AttributeValue("PrimeiroNome")
SET @valorCompra = Lookup("Compras", "ValorTotal", "EmailAssinante", emailaddr)
SET @saldoAtual = Lookup("Carteira", "Saldo", "EmailAssinante", emailaddr)
SET @percentualCashback = 7.5

/* Calcula o cashback */
SET @cashbackBruto = Divide(Multiply(@valorCompra, @percentualCashback), 100)
SET @cashbackFinal = Round(@cashbackBruto, 2)
SET @novoSaldo = Round(Add(@saldoAtual, @cashbackFinal), 2)
]%%

Oi, %%=v(@nomeCliente)=%%! 🎉

Sua compra de R$ %%=FormatNumber(@valorCompra, "N2")=%% na MegaStore gerou um cashback de %%=v(@percentualCashback)=%%!

💰 Valor do cashback: R$ %%=FormatNumber(@cashbackFinal, "N2")=%%
💳 Seu novo saldo na carteira: R$ %%=FormatNumber(@novoSaldo, "N2")=%%

Use seu saldo na próxima compra em www.megastore.com.br!
```

**Saída:**
```
Oi, Maria! 🎉

Sua compra de R$ 347,80 na MegaStore gerou um cashback de 7.5!

💰 Valor do cashback: R$ 26,09
💳 Seu novo saldo na carteira: R$ 58,41

Use seu saldo na próxima compra em www.megastore.com.br!
```

## Observações

- O arredondamento segue a regra padrão: valores de 5 ou mais na casa seguinte arredondam para cima, valores abaixo de 5 arredondam para baixo.
- Se você passar `0` como número de casas decimais, o resultado será um número inteiro arredondado.
- Para exibir valores monetários com formatação brasileira (vírgula como separador decimal), combine `Round` com [FormatNumber](../string-functions/formatnumber.md) ou [FormatCurrency](../string-functions/formatcurrency.md).
- Se o valor passado for nulo ou não numérico, a função pode gerar erro. Considere usar [IsNull](../utility-functions/isnull.md) ou [IsNullDefault](../utility-functions/isnulldefault.md) para tratar esses casos antes de chamar `Round`.
- `Round` é diferente de [Ceiling](../math-functions/ceiling.md) (que sempre arredonda para cima) e [Floor](../math-functions/floor.md) (que sempre arredonda para baixo) — essas duas não aceitam casas decimais.

## Funções relacionadas

- [Ceiling](../math-functions/ceiling.md) — arredonda um número sempre para cima (próximo inteiro maior).
- [Floor](../math-functions/floor.md) — arredonda um número sempre para baixo (próximo inteiro menor).
- [FormatNumber](../string-functions/formatnumber.md) — formata um número com padrão específico de exibição.
- [FormatCurrency](../string-functions/formatcurrency.md) — formata um número como valor monetário.
- [Divide](../math-functions/divide.md) — divide dois números (útil em cálculos que geram decimais).
- [Multiply](../math-functions/multiply.md) — multiplica dois números.
- [Add](../math-functions/add.md) — soma dois números.
- [Mod](../math-functions/mod.md) — retorna o resto da divisão entre dois números.