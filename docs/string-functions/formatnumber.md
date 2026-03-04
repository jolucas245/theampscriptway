---
title: FormatNumber
sidebar_label: FormatNumber
description: Formata números como moeda, porcentagem, notação científica e outros tipos, com suporte a localização por cultura (locale).
---

# FormatNumber

## Descrição

A função `FormatNumber` formata um número em diversos tipos numéricos — moeda, decimal, porcentagem, notação científica, entre outros. Ela também converte números armazenados como string para o tipo numérico e permite arredondar valores para uma quantidade específica de casas decimais. No dia a dia de SFMC no Brasil, é essencial para exibir preços em e-mails promocionais, mostrar porcentagens de desconto e formatar valores financeiros respeitando o padrão brasileiro (vírgula decimal, separador de milhar com ponto) usando o código de cultura `pt_BR`.

## Sintaxe

```ampscript
FormatNumber(number, formatType [, cultureCode])
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| number | string ou number | Sim | O número que você quer formatar. A função assume que o número de entrada usa ponto (`.`) como separador decimal. |
| formatType | string | Sim | O tipo de formatação a aplicar. Valores aceitos: `C` (moeda), `D` (decimal), `E` (notação científica), `F` (casas decimais fixas, 2 por padrão), `G` (sem separador de milhar), `N` (com separador de milhar), `P` (porcentagem), `R` (round-trip), `X` (hexadecimal). Você pode adicionar um número após o código para indicar a precisão — por exemplo, `C2` para moeda com 2 casas decimais. |
| cultureCode | string | Não | Código de localização POSIX (ex: `pt_BR`, `en_US`, `de_DE`). Quando informado, o número é formatado seguindo as convenções daquela cultura. |

## Exemplo básico

Formatando o preço de um produto com separador de milhar e duas casas decimais para um e-mail da MegaStore:

```ampscript
%%[
VAR @preco, @precoFormatado
SET @preco = 1299.90
SET @precoFormatado = FormatNumber(@preco, "N2", "pt_BR")
]%%

Preço do produto: R$ %%=v(@precoFormatado)=%%
```

**Saída:**
```
Preço do produto: R$ 1.299,90
```

## Exemplo avançado

E-mail de régua de relacionamento do Banco Meridional informando o saldo do cliente, a variação percentual do investimento e o valor formatado como moeda — tudo localizado para o Brasil:

```ampscript
%%[
VAR @saldo, @rendimento, @totalInvestido, @percRendimento
VAR @saldoFmt, @percFmt, @moedaFmt

SET @saldo = "45750.836"
SET @rendimento = Divide(578, 45750.836)
SET @totalInvestido = 45750.836

/* Converter string para número formatado com separador de milhar */
SET @saldoFmt = FormatNumber(@saldo, "N2", "pt_BR")

/* Formatar como porcentagem */
SET @percFmt = FormatNumber(@rendimento, "P3", "pt_BR")

/* Formatar como moeda com cultura brasileira */
SET @moedaFmt = FormatNumber(@totalInvestido, "C2", "pt_BR")
]%%

Olá João,

Seu saldo atual: R$ %%=v(@saldoFmt)=%%
Valor do investimento: %%=v(@moedaFmt)=%%
Rendimento no período: %%=v(@percFmt)=%%
```

**Saída:**
```
Olá João,

Seu saldo atual: R$ 45.750,84
Valor do investimento: R$ 45.750,84
Rendimento no período: 1,263%
```

## Observações

- A função **assume que o número de entrada usa ponto (`.`) como separador decimal**. Se o valor vier de uma Data Extension com vírgula como decimal (comum em integrações com sistemas brasileiros), você precisará usar [Replace](../string-functions/replace.md) para trocar a vírgula por ponto antes de passar para `FormatNumber`.

- O código de precisão é adicionado logo após a letra do tipo de formatação, sem espaço. Por exemplo: `C2` para moeda com 2 casas, `N0` para número inteiro com separador de milhar, `P3` para porcentagem com 3 casas.

- O tipo `G` (general) é útil para **remover separadores de milhar** de números que chegam como string — por exemplo, quando você precisa fazer cálculos com um valor que veio formatado.

- O tipo `F` formata o número com um número fixo de casas decimais (duas por padrão quando não se especifica a precisão).

> **💡 Dica:** Para exibir valores monetários em e-mails no Brasil, use `FormatNumber(@valor, "C2", "pt_BR")` para obter a formatação completa com o símbolo da moeda e as convenções brasileiras. Se preferir controlar manualmente o prefixo `R$`, use `"N2"` com `"pt_BR"` e concatene o símbolo com [Concat](../string-functions/concat.md).

> **⚠️ Atenção:** O parâmetro `cultureCode` usa o padrão POSIX com underscore (ex: `pt_BR`), não o formato com hífen (`pt-BR`). Fique atento a isso para garantir que a localização funcione corretamente.

## Funções relacionadas

- [FormatCurrency](../string-functions/formatcurrency.md) — alternativa específica para formatação de moeda
- [Format](../string-functions/format.md) — formatação genérica de valores
- [Divide](../math-functions/divide.md) — para cálculos de divisão antes de formatar como porcentagem
- [Replace](../string-functions/replace.md) — útil para trocar vírgula por ponto antes de formatar
- [Concat](../string-functions/concat.md) — para montar strings combinando prefixos com valores formatados
- [Round](../math-functions/round.md) — arredondamento numérico como alternativa