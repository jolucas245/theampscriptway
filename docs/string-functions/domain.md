---
title: Domain
sidebar_label: Domain
description: Extrai o domínio de um endereço de e-mail, retornando tudo que vem depois do arroba (@).
---

# Domain

## Descrição

A função `Domain` recebe um endereço de e-mail e retorna a parte do domínio — ou seja, tudo que vem depois do `@`. É muito útil no dia a dia de SFMC quando você precisa segmentar ou personalizar conteúdo com base no provedor de e-mail do assinante (Gmail, Outlook, domínios corporativos etc.). A função retorna `null` quando o valor passado não contém `@` ou quando não é uma string.

## Sintaxe

```ampscript
Domain(emailAddress)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| emailAddress | String | Sim | O endereço de e-mail do qual você quer extrair o domínio. |

## Exemplo básico

Extraindo o domínio do e-mail de um cliente da Lojas Vitória para exibir no corpo do e-mail:

```ampscript
%%[
VAR @dominio
SET @dominio = Domain("joao.silva@gmail.com")
]%%

Seu provedor de e-mail: %%=v(@dominio)=%%
```

**Saída:**
```
Seu provedor de e-mail: gmail.com
```

## Exemplo avançado

Em uma régua de boas-vindas, você pode usar `Domain` junto com a string de personalização `emailaddr` para identificar se o assinante usa um e-mail corporativo e personalizar a comunicação de acordo:

```ampscript
%%[
VAR @dominio, @mensagem
SET @dominio = Domain(emailaddr)

IF @dominio == "gmail.com" OR @dominio == "hotmail.com" OR @dominio == "outlook.com" OR @dominio == "yahoo.com.br" THEN
  SET @mensagem = Concat("Vimos que você usa um e-mail pessoal (", @dominio, "). Que tal cadastrar seu e-mail corporativo para receber nossas propostas B2B?")
ELSE
  SET @mensagem = Concat("Ótimo! Identificamos que você representa a empresa com domínio ", @dominio, ". Confira nossas condições especiais para pessoa jurídica.")
ENDIF
]%%

%%=v(@mensagem)=%%
```

**Saída (para maria.santos@grupohorizonte.com.br):**
```
Ótimo! Identificamos que você representa a empresa com domínio grupohorizonte.com.br. Confira nossas condições especiais para pessoa jurídica.
```

## Observações

- Você pode usar `Domain` com a string de personalização do sistema `emailaddr`. Nesse caso, a função retorna o domínio do destinatário do envio atual. Por exemplo, se a mensagem for enviada para `pedro.rocha@conectatelecom.com.br` e o corpo contiver `%%=Domain(emailaddr)=%%`, o resultado será `conectatelecom.com.br`.

> **⚠️ Atenção:** Se o valor passado não contiver o caractere `@`, a função retorna `null`. Isso acontece, por exemplo, com strings sem arroba como `"salesforceexamplecom"`. Da mesma forma, valores não-string (como números) também retornam `null`. Exemplo: `Domain(123)` retorna `null`.

> **⚠️ Atenção:** Se o endereço de e-mail contiver mais de um `@`, a função retorna tudo que vem **depois do primeiro** `@`. Por exemplo, `Domain("vendas@loja@example")` retorna `loja@example`. Fique atento a dados sujos na sua Data Extension — vale a pena validar antes com [IsEmailAddress](../utility-functions/isemailaddress.md).

> **💡 Dica:** Combinar `Domain` com [Lowercase](../string-functions/lowercase.md) é uma boa prática para garantir comparações consistentes, já que um assinante pode ter cadastrado o e-mail como `João@GMAIL.COM`. Assim: `Lowercase(Domain(emailaddr))` sempre retorna o domínio em minúsculas.

## Funções relacionadas

- [Substring](../string-functions/substring.md) — para extrair partes específicas de uma string manualmente
- [IndexOf](../string-functions/indexof.md) — para localizar a posição de um caractere dentro de uma string
- [Lowercase](../string-functions/lowercase.md) — para normalizar o domínio em minúsculas antes de comparações
- [IsEmailAddress](../utility-functions/isemailaddress.md) — para validar se o valor é de fato um endereço de e-mail antes de extrair o domínio
- [Concat](../string-functions/concat.md) — para montar strings dinâmicas combinando o domínio com outros textos