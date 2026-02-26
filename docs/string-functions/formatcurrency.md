---
title: FormatCurrency
sidebar_label: FormatCurrency
description: Formata um número como valor monetário, aplicando o símbolo da moeda, separadores de milhar e decimal conforme o locale informado.
---

<!-- generated-by-script -->

# FormatCurrency

## Descrição

A função `FormatCurrency` pega um número e formata ele como valor monetário, aplicando automaticamente o símbolo da moeda, os separadores de milhar e decimal de acordo com o locale (código de cultura) que você informar. É perfeita para exibir preços, saldos, cashback e qualquer valor em dinheiro nos seus e-mails, CloudPages e SMS. Ela retorna uma string já formatada, pronta pra exibir pro assinante. Se você trabalha com campanhas internacionais ou precisa mostrar valores em Real (R$), essa função resolve tudo com uma linha de código.

## Sintaxe

```ampscript
FormatCurrency(numero, codigoCultura [, casasDecimais] [, simboloMoeda])
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| numero | string ou number | Sim | O número que você quer formatar. A função assume que o ponto (`.`) é o separador decimal. Se passar como string, vírgulas são interpretadas como separador de milhar. |
| codigoCultura | string | Sim | O código de locale para formatação. Aceita formato POSIX (ex: `pt_BR`) ou BCP 47 (ex: `pt-BR`). Define o símbolo da moeda, separadores e posição do símbolo. |
| casasDecimais | number | Não | Quantidade de casas decimais no resultado. Se não informado, usa 2 casas por padrão (pode variar conforme o locale, ex: Japão usa 0). **Obrigatório** se você for usar o parâmetro `simboloMoeda`. |
| simboloMoeda | string | Não | Símbolo de moeda personalizado. Sobrescreve o símbolo padrão do locale informado. Para usar este parâmetro, você **precisa** informar o `casasDecimais` também. |

## Exemplo básico

Imagine que você está enviando um e-mail de confirmação de pedido da **MegaStore** e quer mostrar o valor total formatado em Reais:

```ampscript
%%[
  VAR @valorPedido
  SET @valorPedido = 1589.90
]%%

Olá, João! Seu pedido foi confirmado.

Valor total: %%=FormatCurrency(@valorPedido, "pt_BR")=%%

Obrigado por comprar na MegaStore!
```

**Saída:**
```
Olá, João! Seu pedido foi confirmado.

Valor total: R$ 1.589,90

Obrigado por comprar na MegaStore!
```

## Exemplo avançado

Cenário: a **Lojas Vitória** está rodando uma campanha de Black Friday com cashback. Você precisa mostrar o valor do produto, o desconto e o cashback — todos formatados corretamente. O valor do cashback usa um símbolo personalizado pra deixar mais claro:

```ampscript
%%[
  VAR @nomeCliente, @valorOriginal, @desconto, @valorFinal, @cashback

  SET @nomeCliente = "Maria Santos"
  SET @valorOriginal = 2499.99
  SET @desconto = 500.00
  SET @valorFinal = Subtract(@valorOriginal, @desconto)
  SET @cashback = Multiply(@valorFinal, 0.10)
]%%

Fala, %%=v(@nomeCliente)=%%! 🎉

A Black Friday da Lojas Vitória chegou com tudo!

Produto: Smart TV 55" UltraVision
De: %%=FormatCurrency(@valorOriginal, "pt_BR")=%%
Por: %%=FormatCurrency(@valorFinal, "pt_BR")=%%

💰 Cashback de %%=FormatCurrency(@cashback, "pt_BR", 2, "R$")=%% direto na sua conta!

Frete grátis acima de R$ 299,00. Aproveite!
```

**Saída:**
```
Fala, Maria Santos! 🎉

A Black Friday da Lojas Vitória chegou com tudo!

Produto: Smart TV 55" UltraVision
De: R$ 2.499,99
Por: R$ 1.999,99

💰 Cashback de R$200,00 direto na sua conta!

Frete grátis acima de R$ 299,00. Aproveite!
```

### Exemplo com múltiplos locales

Se a sua empresa atende clientes em diferentes países, você pode usar o mesmo valor e formatar conforme o locale de cada assinante:

```ampscript
%%[
  VAR @valor, @locale
  SET @valor = 1234.555
  SET @locale = AttributeValue("PreferredLocale")
]%%

Seu saldo: %%=FormatCurrency(@valor, @locale)=%%
```

Resultados possíveis dependendo do locale do assinante:

| Locale | Saída |
|---|---|
| `pt_BR` | R$ 1.234,56 |
| `en_US` | $1,234.56 |
| `de_DE` | 1.234,56 € |
| `ja_JP` | ¥1,235 |
| `fr_FR` | 1 234,56 € |
| `es_MX` | $1,234.56 |

### Exemplo controlando casas decimais

O **Banco Meridional** quer mostrar o saldo da conta com 4 casas decimais (cenário de rendimento de investimento):

```ampscript
%%[
  VAR @rendimento
  SET @rendimento = 15876.4321
]%%

Seu rendimento acumulado: %%=FormatCurrency(@rendimento, "pt_BR", 4)=%%
```

**Saída:**
```
Seu rendimento acumulado: R$ 15.876,4321
```

### Exemplo com símbolo personalizado

A **Conecta Telecom** vende planos internacionais e precisa exibir um valor em dólar, mas formatado no padrão brasileiro:

```ampscript
%%[
  VAR @valorPlano
  SET @valorPlano = 49.90
]%%

Plano Internacional: %%=FormatCurrency(@valorPlano, "pt_BR", 2, "US$")=%%/mês
```

**Saída:**
```
Plano Internacional: US$49,90/mês
```

## Observações

- **Separador decimal na entrada:** A função **sempre** espera que o número de entrada use ponto (`.`) como separador decimal. Se o valor vier de uma Data Extension com vírgula como decimal (ex: `1234,56`), você vai precisar tratar antes com [Replace](../string-functions/replace.md) para trocar a vírgula por ponto.
- **Arredondamento:** Quando o número tem mais casas decimais do que o especificado (ou o padrão do locale), a função **arredonda** o valor. Ex: `1234.555` com 2 casas decimais vira `1.234,56` em `pt_BR`.
- **Casas decimais variam por locale:** Alguns locales têm 0 casas decimais por padrão. Por exemplo, `ja_JP` (Japão) e `ko_KR` (Coreia do Sul) arredondam para o inteiro mais próximo. Se quiser forçar casas decimais nesses casos, informe o terceiro parâmetro explicitamente.
- **Formatos POSIX e BCP 47:** Você pode usar tanto `pt_BR` (POSIX) quanto `pt-BR` (BCP 47). Ambos funcionam.
- **Símbolo personalizado exige casas decimais:** Se você quiser usar o quarto parâmetro (`simboloMoeda`), você **precisa** informar o terceiro parâmetro (`casasDecimais`). Não dá pra pular.
- **String como entrada:** Se passar o número como string (ex: `"1,234.56"`), a função entende que as vírgulas são separadores de milhar e o ponto é o decimal — padrão americano.
- **Valores nulos ou vazios:** Tome cuidado com valores nulos vindos de Data Extensions. Considere usar [IsNull](../utility-functions/isnull.md) ou [Empty](../utility-functions/empty.md) para validar antes de chamar a função.
- **Funciona em todos os contextos:** `FormatCurrency` pode ser usada em e-mails, CloudPages, SMS e Landing Pages sem restrições.

## Funções relacionadas

- [FormatNumber](../string-functions/formatnumber.md) — Formata números com separadores de milhar e casas decimais, sem símbolo de moeda.
- [Format](../string-functions/format.md) — Formatação genérica de valores (datas, números, etc.) usando padrões customizados.
- [Subtract](../math-functions/subtract.md) — Subtrai valores, útil para calcular descontos antes de formatar.
- [Multiply](../math-functions/multiply.md) — Multiplica valores, útil para calcular porcentagens de cashback.
- [Round](../math-functions/round.md) — Arredonda um número para um número específico de casas decimais.
- [Replace](../string-functions/replace.md) — Substitui caracteres em strings, útil para tratar separadores decimais antes de formatar.
- [Lookup](../data-extension-functions/lookup.md) — Busca valores em Data Extensions para depois formatar com FormatCurrency.
- [IsNull](../utility-functions/isnull.md) — Verifica se um valor é nulo antes de tentar formatar.
- [AttributeValue](../utility-functions/attributevalue.md) — Recupera atributos do assinante, como locale preferido, para usar na formatação.