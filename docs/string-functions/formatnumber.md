---
title: FormatNumber
sidebar_label: FormatNumber
description: Formata um número como moeda, decimal, porcentagem, notação científica e outros tipos numéricos, com suporte a localização por cultura (locale).
---

<!-- generated-by-script -->

# FormatNumber

## Descrição

A função `FormatNumber` formata um número de acordo com um tipo numérico especificado, como moeda, decimal, porcentagem ou notação científica. Ela também é útil para converter números armazenados como string para o tipo numérico e para arredondar valores a uma quantidade específica de casas decimais. Você pode passar um código de cultura (locale) opcional para que o resultado siga as convenções de formatação de um país ou idioma específico — perfeito para campanhas com público internacional ou para exibir valores em Reais no formato brasileiro.

## Sintaxe

```ampscript
FormatNumber(numero, tipoFormato)
FormatNumber(numero, tipoFormato, codigoCultura)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| numero | String ou Número | Sim | O número que você quer formatar. A função assume que o ponto (`.`) é o separador decimal da entrada. |
| tipoFormato | String | Sim | O tipo de formatação a ser aplicado. Valores aceitos: `C` (moeda), `D` (decimal), `E` (notação científica), `F` (casas decimais fixas, 2 por padrão), `G` (sem separador de milhar), `N` (com separador de milhar), `P` (porcentagem), `R` (round-trip), `X` (hexadecimal). Você pode adicionar um número após a letra para indicar a precisão — ex: `C2`, `N3`, `F4`. |
| codigoCultura | String | Não | Código de locale POSIX (ex: `pt_BR`, `en_US`, `de_DE`). Quando informado, o resultado segue as convenções de formatação da cultura especificada. |

## Tipos de formato disponíveis

| Código | Descrição | Exemplo (entrada: `1234.5`) |
|---|---|---|
| `C` | Moeda | Depende do locale |
| `D` | Número decimal | Inteiro |
| `E` | Notação científica | `1.234500E+003` |
| `F` | Casas decimais fixas (padrão: 2) | `1234.50` |
| `G` | Geral (sem separador de milhar) | `1234.5` |
| `N` | Número com separador de milhar | `1,234.50` |
| `P` | Porcentagem | `123,450.00%` |
| `R` | Round-trip | Preserva a fidelidade numérica |
| `X` | Hexadecimal | Valor hexadecimal |

## Exemplo básico

Imagine que você precisa exibir o saldo de pontos de um cliente no programa de fidelidade da **MegaStore**. O valor vem da Data Extension sem formatação:

```ampscript
%%[
  VAR @pontos
  SET @pontos = 15487.6

  /* Formata com separador de milhar e 2 casas decimais */
  SET @pontosFormatado = FormatNumber(@pontos, "N2")
]%%

Olá! Você tem %%=v(@pontosFormatado)=%% pontos no programa MegaStore Fidelidade.
```

**Saída:**
```
Olá! Você tem 15,487.60 pontos no programa MegaStore Fidelidade.
```

## Exemplo avançado

Cenário: a **Lojas Vitória** está enviando um e-mail de Black Friday com o valor do cashback acumulado pelo cliente. Você quer exibir o valor formatado como moeda brasileira (R$), usando o locale `pt_BR`:

```ampscript
%%[
  VAR @nome, @cashback, @totalGasto, @percentualEconomia

  SET @nome = "Maria Santos"
  SET @cashback = 347.5
  SET @totalGasto = 2698.00

  /* Formata o cashback como moeda brasileira */
  SET @cashbackFormatado = FormatNumber(@cashback, "C2", "pt_BR")

  /* Calcula o percentual de economia */
  SET @percentual = Divide(@cashback, @totalGasto)
  SET @percentualFormatado = FormatNumber(@percentual, "P2", "pt_BR")

  /* Remove separador de milhar de um valor vindo como string */
  SET @valorString = "1234.56"
  SET @valorLimpo = FormatNumber(@valorString, "G")

  /* Formata total gasto com locale brasileiro */
  SET @totalFormatado = FormatNumber(@totalGasto, "C2", "pt_BR")
]%%

Oi, %%=v(@nome)=%%! 🎉

Na Black Friday da Lojas Vitória, você já acumulou %%=v(@cashbackFormatado)=%% de cashback!

Seu total em compras: %%=v(@totalFormatado)=%%
Isso representa uma economia de %%=v(@percentualFormatado)=%% — nada mal, hein?

Valor processado internamente (sem milhar): %%=v(@valorLimpo)=%%
```

**Saída:**
```
Oi, Maria Santos! 🎉

Na Black Friday da Lojas Vitória, você já acumulou R$ 347,50 de cashback!

Seu total em compras: R$ 2.698,00
Isso representa uma economia de 12,88% — nada mal, hein?

Valor processado internamente (sem milhar): 1234.56
```

## Exemplo com notação científica e hexadecimal

```ampscript
%%[
  /* Notação científica com 3 casas de precisão */
  SET @cientifico = FormatNumber(98765.4321, "E3")

  /* Hexadecimal */
  SET @hexa = FormatNumber(255, "X")

  /* Casas decimais fixas — útil para exibir notas/avaliações */
  SET @nota = FormatNumber(4.7, "F1")
]%%

Científico: %%=v(@cientifico)=%%
Hexadecimal: %%=v(@hexa)=%%
Nota do produto: %%=v(@nota)=%% / 5.0
```

**Saída:**
```
Científico: 9.877E+004
Hexadecimal: FF
Nota do produto: 4.7 / 5.0
```

## Observações

- **Separador decimal na entrada:** A função sempre espera que a entrada use ponto (`.`) como separador decimal. Se o valor vier com vírgula da sua Data Extension, você vai precisar usar [Replace](../string-functions/replace.md) para trocar a vírgula por ponto antes de passar para o `FormatNumber`.
- **Precisão após o código de formato:** Você pode adicionar um número após a letra do tipo para controlar as casas decimais. Por exemplo, `C2` = moeda com 2 casas, `N0` = número com separador de milhar sem casas decimais, `F4` = 4 casas decimais fixas.
- **Locale `pt_BR`:** Quando você usa o código de cultura `pt_BR`, o resultado segue as convenções brasileiras — ponto como separador de milhar, vírgula como separador decimal e o símbolo `R$` para moeda.
- **Conversão de string para número:** Além de formatar, a função é útil para garantir que um valor armazenado como string seja tratado como número. Use o tipo `G` para uma conversão simples sem separadores de milhar.
- **Porcentagem (P):** O tipo `P` multiplica automaticamente o valor por 100 antes de exibir. Ou seja, se você passar `0.1288`, o resultado será `12.88%`. Não passe o valor já multiplicado por 100, senão o resultado será `12880.00%`.
- **Valores nulos ou vazios:** Tenha cuidado com valores nulos vindos de Data Extensions. Use [IsNull](../utility-functions/isnull.md) ou [Empty](../utility-functions/empty.md) para verificar antes de formatar, evitando erros no processamento.
- **Round-trip (R):** O tipo `R` garante que o valor formatado como string possa ser convertido de volta para número sem perda de precisão. É mais útil em cenários de processamento interno do que para exibição ao usuário.

## Funções relacionadas

- [FormatCurrency](../string-functions/formatcurrency.md) — Formata um número especificamente como moeda, sem necessidade de código de tipo
- [Format](../string-functions/format.md) — Formata valores usando padrões customizados de formatação
- [Round](../math-functions/round.md) — Arredonda um número para um número específico de casas decimais
- [Divide](../math-functions/divide.md) — Divide dois números (útil para calcular percentuais antes de formatar)
- [Multiply](../math-functions/multiply.md) — Multiplica dois números
- [Replace](../string-functions/replace.md) — Substitui caracteres em uma string (útil para trocar vírgula por ponto antes de formatar)
- [Concat](../string-functions/concat.md) — Concatena strings (para montar textos com valores formatados)