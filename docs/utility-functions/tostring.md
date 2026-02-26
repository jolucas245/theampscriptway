---
title: ToString
sidebar_label: ToString
description: Converte um valor numérico ou de outro tipo para sua representação em texto (string) no AMPscript.
---

# ToString

## Descrição

A função `ToString` converte um valor para sua representação em formato de texto (string). É super útil quando você precisa garantir que um número, booleano ou outro tipo de dado seja tratado como texto — por exemplo, para concatenar com outras strings, exibir valores formatados ou passar parâmetros que exigem tipo string. A função retorna uma string com a representação textual do valor informado.

## Sintaxe

```ampscript
ToString(valor)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| valor | Qualquer | Sim | O valor que você quer converter para string. Pode ser um número, booleano ou outro tipo de dado. |

## Exemplo básico

```ampscript
%%[
VAR @pontos, @pontosTexto
SET @pontos = 1500
SET @pontosTexto = ToString(@pontos)
]%%

Você tem %%=v(@pontosTexto)=%% pontos no nosso programa de fidelidade.
```

**Saída:**
```
Você tem 1500 pontos no nosso programa de fidelidade.
```

## Exemplo avançado

Imagine que a **MegaStore** quer enviar um e-mail de cashback pro cliente. O valor do cashback vem de um cálculo e precisa ser concatenado com o símbolo de moeda:

```ampscript
%%[
VAR @nomeCliente, @valorCompra, @percentualCashback, @cashback, @cashbackTexto, @mensagem

SET @nomeCliente = "João Silva"
SET @valorCompra = 450
SET @percentualCashback = 10
SET @cashback = Divide(Multiply(@valorCompra, @percentualCashback), 100)
SET @cashbackTexto = ToString(@cashback)
SET @mensagem = Concat("Parabéns, ", @nomeCliente, "! Você ganhou R$ ", @cashbackTexto, " de cashback na sua compra de R$ ", ToString(@valorCompra), " na MegaStore.")
]%%

%%=v(@mensagem)=%%

%%[
/* Exemplo com verificação condicional usando o valor convertido */
VAR @flagAtivo, @statusTexto
SET @flagAtivo = 1
SET @statusTexto = ToString(@flagAtivo)

IF @statusTexto == "1" THEN
]%%
✅ Seu cashback já está disponível para uso!
%%[ ELSE ]%%
⏳ Seu cashback está sendo processado.
%%[ ENDIF ]%%
```

**Saída:**
```
Parabéns, João Silva! Você ganhou R$ 45 de cashback na sua compra de R$ 450 na MegaStore.

✅ Seu cashback já está disponível para uso!
```

## Observações

- A função `ToString` é especialmente útil quando você precisa garantir que o tipo do dado seja string antes de usar em comparações ou concatenações.
- Se o valor passado já for uma string, a função simplesmente retorna o mesmo valor.
- Para formatar números com casas decimais, separadores de milhar ou formato de moeda, considere usar as funções [Format](../string-functions/format.md), [FormatNumber](../string-functions/formatnumber.md) ou [FormatCurrency](../string-functions/formatcurrency.md) em vez de `ToString`, pois elas oferecem mais controle sobre a formatação.
- Cuidado com valores nulos: se o valor for nulo, o comportamento pode não ser o esperado. Considere usar [IsNull](../utility-functions/isnull.md) ou [Empty](../utility-functions/empty.md) para validar antes de converter.
- A documentação oficial da Salesforce para esta função está limitada. O comportamento descrito aqui é baseado no uso prático observado no Marketing Cloud.

## Funções relacionadas

- [Format](../string-functions/format.md) — formata valores usando padrões de formatação específicos
- [FormatNumber](../string-functions/formatnumber.md) — formata números com casas decimais e separadores
- [FormatCurrency](../string-functions/formatcurrency.md) — formata valores como moeda
- [Concat](../string-functions/concat.md) — concatena múltiplas strings em uma só
- [V](../utility-functions/v.md) — retorna o valor de uma variável para exibição inline
- [Output](../utility-functions/output.md) — escreve o valor de uma variável na saída do conteúdo
- [IsNull](../utility-functions/isnull.md) — verifica se um valor é nulo antes de processá-lo
- [Empty](../utility-functions/empty.md) — verifica se um valor está vazio