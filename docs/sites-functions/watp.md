---
title: WATP
sidebar_label: WATP
description: Representa um placeholder ordinal para valores de parâmetros dentro de strings WAT configuradas pelo Suporte da Marketing Cloud.
---

# WATP

## Descrição

A função `WATP` (WAT Parameter) representa um placeholder posicional para valores de parâmetros dentro de strings WAT. Ela **não funciona de forma independente** - só pode ser usada como parte de uma configuração de string WAT criada pelo Suporte da Salesforce Marketing Cloud. O resultado da `WATP` é incluído na saída gerada pela chamada da função [WAT](../content-functions/wat.md).

## Sintaxe

```ampscript
WATP(ordinal)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| ordinal | Número | Sim | Valor ordinal que representa a posição do parâmetro na string WAT. O primeiro parâmetro é `1`, o segundo é `2`, e assim por diante. |

## Exemplo básico

Configuração de string WAT para gerar um link de verificação de e-mail de um cliente, com o endereço tratado e codificado para URL.

```ampscript
/* Configuração da string WAT (feita pelo Suporte MC): */
/* verifyParams,?verify=%%=URLEncode(Lowercase(Trim(WATP(1))))=%% */

/* No e-mail, a função WAT é chamada passando o valor do parâmetro: */
/* Veja a função WAT para o uso completo */
```

**Saída (dentro da string WAT processada):**
```
?verify=joao.silva%40megastore.com.br
```

## Exemplo avançado

Configuração de string WAT com múltiplos parâmetros para montar um link personalizado com nome e sobrenome do cliente, útil em réguas de boas-vindas ou confirmação de cadastro.

```ampscript
/* Configuração da string WAT (feita pelo Suporte MC): */
/* nameParams,?fName=%%=URLEncode(WATP(1))=%%&lName=%%=URLEncode(WATP(2))=%% */

/* WATP(1) recebe o primeiro valor passado na chamada WAT (ex: "Maria") */
/* WATP(2) recebe o segundo valor passado na chamada WAT (ex: "Santos") */

/* Veja a função WAT para entender como os valores são passados */
```

**Saída (dentro da string WAT processada):**
```
?fName=Maria&lName=Santos
```

## Observações

> **⚠️ Atenção:** A função `WATP` **não pode ser usada de forma independente** no seu código AMPscript. Ela só funciona dentro de strings WAT que são configuradas diretamente pelo Suporte da Salesforce Marketing Cloud. Você não consegue criar essas configurações por conta própria - é necessário abrir um chamado com o suporte.

- A numeração dos parâmetros é ordinal e começa em `1`. O primeiro valor passado na chamada [WAT](../content-functions/wat.md) corresponde a `WATP(1)`, o segundo a `WATP(2)`, e assim por diante.
- Dentro da configuração da string WAT, você pode combinar `WATP` com outras funções AMPscript como [URLEncode](../string-functions/urlencode.md), [Lowercase](../string-functions/lowercase.md) e [Trim](../string-functions/trim.md) para tratar os valores antes de incluí-los na URL final.
- Para entender o fluxo completo de como os valores chegam até os placeholders `WATP`, consulte a documentação da função [WAT](../content-functions/wat.md).

## Funções relacionadas

- [WAT](../content-functions/wat.md) - função principal que processa as strings WAT onde `WATP` é utilizada
- [URLEncode](../string-functions/urlencode.md) - comumente usada junto com `WATP` para codificar valores em URLs
- [Lowercase](../string-functions/lowercase.md) - normalização de texto dentro das strings WAT
- [Trim](../string-functions/trim.md) - remoção de espaços em valores passados como parâmetros
- [CloudPagesURL](../sites-functions/cloudpagesurl.md) - alternativa mais comum para geração de URLs parametrizadas sem depender do suporte