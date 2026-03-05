---
title: Output
sidebar_label: Output
description: Exibe o resultado de uma função AMPscript dentro do conteúdo renderizado, permitindo imprimir valores dinamicamente dentro de blocos de código.
---

# Output

## Descrição

A função `Output` retorna o resultado de uma função AMPscript e insere esse resultado diretamente no conteúdo renderizado. Ela é essencial quando você está dentro de um bloco `%%[...]%%` e precisa imprimir algo no HTML - já que, dentro desses blocos, o conteúdo não é exibido automaticamente. A função **só aceita outra função AMPscript como parâmetro**; se você passar uma string literal ou qualquer outro valor direto, ela não produz nenhuma saída.

## Sintaxe

```ampscript
Output(value)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| value | Função AMPscript | Sim | A função cujo resultado será exibido no conteúdo renderizado. Deve ser uma função AMPscript (como `Concat()` ou `v()`), não um valor literal. |

## Exemplo básico

Exibindo o nome de um cliente dentro de um bloco de código AMPscript em um e-mail da Lojas Vitória:

```ampscript
%%[
SET @nome = "Maria Santos"
Output(v(@nome))
]%%
```

**Saída:**

```
Maria Santos
```

## Exemplo avançado

Montando uma mensagem personalizada para uma régua de boas-vindas, combinando `Output` com [`Concat`](../string-functions/concat.md) e [`v`](../utility-functions/v.md) para exibir diferentes trechos dinâmicos dentro de um único bloco de código:

```ampscript
%%[
SET @primeiroNome = "João"
SET @valorCredito = "R$ 150,00"
SET @loja = "MegaStore"

Output(Concat("Olá, ", v(@primeiroNome), "! Você ganhou um crédito de ", v(@valorCredito), " para usar na ", v(@loja), "."))
Output(Concat(" Aproveite essa oferta até 31/12/2025."))
]%%
```

**Saída:**

```
Olá, João! Você ganhou um crédito de R$ 150,00 para usar na MegaStore. Aproveite essa oferta até 31/12/2025.
```

## Observações

> **⚠️ Atenção:** A função `Output` **só funciona com funções AMPscript aninhadas** como parâmetro. Se você passar uma string literal diretamente - por exemplo, `Output("texto qualquer")` - nada será exibido. Para imprimir o valor de uma variável, envolva-a com `v()`: use `Output(v(@variavel))` e não `Output(@variavel)`.

- Fora de um bloco `%%[...]%%`, você pode exibir valores simplesmente usando a sintaxe inline `%%=v(@variavel)=%%`. A função `Output` é necessária justamente quando você está **dentro** de um bloco de código e precisa inserir conteúdo no HTML renderizado sem sair do bloco.

- Se você precisa que cada saída apareça em uma nova linha, considere usar [`OutputLine`](../utility-functions/outputline.md), que adiciona automaticamente uma quebra de linha após o conteúdo.

## Funções relacionadas

- [`V`](../utility-functions/v.md) - retorna o valor de uma variável; par natural do `Output` para exibir variáveis
- [`OutputLine`](../utility-functions/outputline.md) - semelhante ao `Output`, mas adiciona quebra de linha ao final
- [`Concat`](../string-functions/concat.md) - concatena strings; frequentemente usada dentro do `Output` para montar textos dinâmicos
- [`TreatAsContent`](../utility-functions/treatascontent.md) - processa uma string como se fosse conteúdo AMPscript renderizável