---
title: IIF
sidebar_label: IIF
description: Testa uma condição e retorna um valor se verdadeira ou outro se falsa, funcionando como um IF/ELSE inline.
---

# IIF

## Descrição

A função `IIF` avalia uma condição e retorna um entre dois valores possíveis: o segundo parâmetro se a condição for verdadeira, ou o terceiro se for falsa. É o equivalente a um IF/ELSE condensado em uma única linha, muito útil quando você precisa de uma decisão simples dentro de uma atribuição de variável ou diretamente no meio do HTML. No dia a dia de SFMC, você vai usar bastante para personalizar saudações, exibir ou ocultar trechos de conteúdo e tratar campos vazios vindos de Data Extensions.

## Sintaxe

```ampscript
IIF(condition, valueIfTrue, valueIfFalse)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| condition | String | Sim | A condição a ser testada. Pode ser qualquer função ou expressão que retorne verdadeiro ou falso. |
| valueIfTrue | String | Sim | O valor retornado quando a condição é verdadeira. |
| valueIfFalse | String | Sim | O valor retornado quando a condição é falsa. |

## Exemplo básico

Montando uma saudação personalizada para um e-mail da Lojas Vitória — se o campo `PrimeiroNome` estiver preenchido, cumprimenta pelo nome; caso contrário, usa um texto genérico.

```ampscript
%%[
SET @primeiroNome = AttributeValue("PrimeiroNome")
SET @saudacao = IIF(NOT Empty(@primeiroNome), Concat("Olá, ", @primeiroNome, "!"), "Olá!")
]%%

%%=V(@saudacao)=%%
```

**Saída (quando PrimeiroNome = "Maria"):**
```
Olá, Maria!
```

**Saída (quando PrimeiroNome está vazio):**
```
Olá!
```

## Exemplo avançado

Em uma régua de relacionamento do Banco Meridional, o e-mail precisa exibir a categoria do cliente com base no campo `Segmento` e construir uma frase de abertura completa combinando `IIF` com [Concat](../string-functions/concat.md) e [ProperCase](../string-functions/propercase.md).

```ampscript
%%[
SET @primeiroNome = AttributeValue("PrimeiroNome")
SET @segmento = AttributeValue("Segmento")

SET @nomeFormatado = IIF(
  NOT Empty(@primeiroNome),
  ProperCase(@primeiroNome),
  "Cliente"
)

SET @labelSegmento = IIF(
  @segmento == "PF_Premium",
  "Premium",
  "Essencial"
)

SET @mensagem = Concat(
  "Olá, ", @nomeFormatado, "! ",
  "Você faz parte do segmento ", @labelSegmento, " do Banco Meridional."
)
]%%

%%=V(@mensagem)=%%
```

**Saída (quando PrimeiroNome = "joão" e Segmento = "PF_Premium"):**
```
Olá, João! Você faz parte do segmento Premium do Banco Meridional.
```

**Saída (quando PrimeiroNome está vazio e Segmento = "PF_Basico"):**
```
Olá, Cliente! Você faz parte do segmento Essencial do Banco Meridional.
```

## Observações

> **💡 Dica:** A `IIF` é ideal para decisões binárias simples — um teste, dois caminhos. Quando você precisar avaliar múltiplas condições encadeadas, um bloco `IF / ELSEIF / ELSE / ENDIF` costuma ficar bem mais legível do que aninhar vários `IIF` uns dentro dos outros.

> **💡 Dica:** A condição passada no primeiro parâmetro pode ser qualquer função ou expressão que retorne verdadeiro ou falso. Combinar `IIF` com [Empty](../utility-functions/empty.md) é um padrão clássico para tratar campos que podem vir sem valor da Data Extension.

> **⚠️ Atenção:** Use [AttributeValue](../utility-functions/attributevalue.md) em vez de referenciar o campo diretamente ao montar a condição. Assim você evita erros caso o campo não exista no contexto de envio — `AttributeValue` retorna vazio em vez de estourar um erro.

## Funções relacionadas

- [Empty](../utility-functions/empty.md) — verifica se um valor está vazio, par natural do `IIF` para tratar campos ausentes.
- [IsNull](../utility-functions/isnull.md) — testa se um valor é nulo.
- [IsNullDefault](../utility-functions/isnulldefault.md) — retorna um valor padrão quando o campo é nulo.
- [Concat](../string-functions/concat.md) — concatena strings, muito usada junto com `IIF` para montar frases dinâmicas.
- [AttributeValue](../utility-functions/attributevalue.md) — recupera o valor de um atributo de forma segura.