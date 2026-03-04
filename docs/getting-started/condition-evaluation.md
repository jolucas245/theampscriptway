---
title: Operadores e Condições
sidebar_label: Operadores e Condições
description: Operadores de comparação e de junção disponíveis para avaliar condições em AMPscript.
sidebar_position: 5
---

# Operadores e Condições

Antes de escrever condicionais complexas, é importante conhecer os operadores disponíveis no AMPscript — as ferramentas que permitem comparar valores e combinar múltiplas condições.

## Operadores de comparação

Use operadores de comparação para avaliar a relação entre dois valores. O resultado de uma comparação é sempre verdadeiro ou falso.

| Operador | Significado |
|----------|-------------|
| `==` | Igual a |
| `!=` | Diferente de |
| `>` | Maior que |
| `<` | Menor que |
| `>=` | Maior ou igual a |
| `<=` | Menor ou igual a |

Esses operadores são usados dentro de blocos `IF`. Por exemplo, verificar se o saldo de pontos de um cliente da Conecta Telecom é suficiente para um resgate:

```ampscript
%%[
SET @saldoPontos = Lookup('Fidelidade_DE', 'Saldo', 'Email', emailaddr)

IF @saldoPontos >= 1000 THEN
    SET @mensagem = 'Você tem pontos suficientes para resgatar um brinde!'
ENDIF
]%%
```

## Operadores de junção

Use `AND` e `OR` para combinar múltiplas condições em uma única avaliação.

| Operador | Comportamento |
|----------|---------------|
| `AND` | Ambas as condições precisam ser verdadeiras |
| `OR` | Basta uma das condições ser verdadeira |

```ampscript
%%[
SET @idade    = Lookup('Clientes_DE', 'Idade', 'Email', emailaddr)
SET @segmento = Lookup('Clientes_DE', 'Segmento', 'Email', emailaddr)

/* AND — as duas condições precisam ser verdadeiras */
IF @idade >= 18 AND @segmento == 'Premium' THEN
    SET @oferta = 'Acesso antecipado à coleção de inverno'
ENDIF

/* OR — basta uma ser verdadeira */
IF @segmento == 'Premium' OR @segmento == 'VIP' THEN
    SET @frete = 'grátis'
ENDIF
]%%
```

## Parênteses para controlar a avaliação

Quando você combina `AND` e `OR` na mesma expressão, use parênteses para deixar explícita a ordem de avaliação. Sem parênteses, o comportamento pode ser diferente do esperado.

```ampscript
%%[
SET @idade        = Lookup('Clientes_DE', 'Idade', 'Email', emailaddr)
SET @predisposicao = Lookup('Clientes_DE', 'Predisposicao', 'Email', emailaddr)

/*
  Atende se:
  - idade >= 30 E predisposição = "Alta"
  OU
  - idade >= 55 E predisposição = "Normal"
*/
IF (@idade >= 30 AND @predisposicao == 'Alta') OR
   (@idade >= 55 AND @predisposicao == 'Normal') THEN
    SET @elegivel = true
ENDIF
]%%
```

## O operador NOT

O `NOT` inverte o resultado de uma condição — o bloco é executado quando a condição for **falsa**.

```ampscript
%%[
SET @optOut = Lookup('Preferencias_DE', 'OptOutMarketing', 'Email', emailaddr)

/* Executa apenas se o cliente NÃO tiver optado por sair */
IF NOT @optOut == 'true' THEN
    SET @exibirOferta = true
ENDIF
]%%
```

> **💡 Dica:** `NOT` é especialmente útil combinado com funções como `Empty()` e `IsNull()`. Por exemplo: `IF NOT Empty(@cpf) THEN` executa somente quando o CPF estiver preenchido.

---

Com os operadores em mãos, você está pronto para construir condicionais completas. Veja [Condicionais](/docs/getting-started/conditionals) para a sintaxe completa de `IF`, `ELSEIF` e `ELSE`.
