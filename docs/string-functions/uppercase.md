---
title: Uppercase
sidebar_label: Uppercase
description: Converte todos os caracteres de uma string para letras maiúsculas.
---

# Uppercase

## Descrição

A função `Uppercase` converte todas as letras de uma string para maiúsculas. É muito útil no dia a dia de SFMC quando você precisa padronizar dados exibidos em e-mails — como códigos de cupom, siglas de estados, números de protocolo ou qualquer texto que precise aparecer em caixa alta. Retorna a string fornecida inteiramente em letras maiúsculas.

## Sintaxe

```ampscript
Uppercase(sourceString)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| sourceString | String | Sim | A string que será convertida para letras maiúsculas. |

## Exemplo básico

Exibindo o código de um cupom promocional em caixa alta, independente de como foi cadastrado na Data Extension:

```ampscript
%%[
SET @cupom = "primavera2024"
SET @cupomFormatado = Uppercase(@cupom)
]%%

Seu cupom exclusivo: %%=v(@cupomFormatado)=%%
```

**Saída:**
```
Seu cupom exclusivo: PRIMAVERA2024
```

## Exemplo avançado

Em uma régua de boas-vindas da Lojas Vitória, o nome do cliente e a sigla do estado são normalizados para exibição padronizada no e-mail. O nome vai em [ProperCase](../string-functions/propercase.md) e o estado em maiúsculas com `Uppercase`:

```ampscript
%%[
SET @nome = "maria santos"
SET @estado = "sp"
SET @protocolo = Concat("lv-", "2024-", "08745")

SET @nomeFormatado = ProperCase(@nome)
SET @estadoFormatado = Uppercase(@estado)
SET @protocoloFormatado = Uppercase(@protocolo)
]%%

Olá, %%=v(@nomeFormatado)=%%!

Sua compra foi confirmada para entrega em %%=v(@estadoFormatado)=%%.
Protocolo: %%=v(@protocoloFormatado)=%%
```

**Saída:**
```
Olá, Maria Santos!

Sua compra foi confirmada para entrega em SP.
Protocolo: LV-2024-08745
```

## Observações

> **💡 Dica:** `Uppercase` é ideal para padronizar códigos de cupom, siglas de estado (SP, RJ, MG) e números de protocolo em e-mails transacionais. Mesmo que o dado venha cadastrado de formas diferentes ("sp", "Sp", "sP"), o resultado será sempre consistente.

> **💡 Dica:** Se você precisa do comportamento inverso (tudo minúsculo), use [Lowercase](../string-functions/lowercase.md). Para capitalizar apenas a primeira letra de cada palavra (ideal para nomes de clientes), use [ProperCase](../string-functions/propercase.md).

## Funções relacionadas

- [Lowercase](../string-functions/lowercase.md) — converte a string para letras minúsculas
- [ProperCase](../string-functions/propercase.md) — capitaliza a primeira letra de cada palavra
- [Concat](../string-functions/concat.md) — concatena strings, útil para montar textos antes de converter
- [Trim](../string-functions/trim.md) — remove espaços extras antes e depois da string