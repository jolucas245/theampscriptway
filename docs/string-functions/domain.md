---
title: Domain
sidebar_label: Domain
description: Retorna a parte do domínio de um endereço de e-mail, ou seja, tudo que vem depois do arroba (@).
---

# Domain

## Descrição

A função `Domain()` extrai a parte do domínio de um endereço de e-mail — basicamente, tudo que vem depois do `@`. É super útil quando você precisa segmentar ou personalizar conteúdo com base no provedor de e-mail do assinante, como exibir mensagens diferentes para quem usa Gmail, Outlook, e-mail corporativo, etc. A função retorna `null` se o valor passado não contiver um `@` ou se não for uma string.

## Sintaxe

```ampscript
Domain(emailAddress)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| emailAddress | String | Sim | O endereço de e-mail do qual você quer extrair o domínio (a parte após o `@`). |

## Exemplo básico

```ampscript
%%[
VAR @dominio
SET @dominio = Domain("joao.silva@lojasvitoria.com.br")
]%%

O domínio do seu e-mail é: %%=v(@dominio)=%%
```

**Saída:**
```
O domínio do seu e-mail é: lojasvitoria.com.br
```

## Exemplo avançado

Imagine que a **MegaStore** quer personalizar o rodapé do e-mail de boas-vindas. Se o assinante usa um e-mail corporativo (não é Gmail, Hotmail, Yahoo, etc.), exibe uma mensagem especial sobre o programa B2B. Caso contrário, mostra o programa de pontos para pessoa física.

```ampscript
%%[
VAR @dominio, @mensagem

SET @dominio = Domain(emailaddr)

IF @dominio == "gmail.com" OR @dominio == "hotmail.com" OR @dominio == "outlook.com" OR @dominio == "yahoo.com.br" THEN
  SET @mensagem = Concat("Olá! Você sabia que no nosso programa de pontos MegaStore Fidelidade, a cada R$1,00 em compras você acumula 2 pontos? Aproveite o frete grátis acima de R$299!")
ELSEIF Empty(@dominio) THEN
  SET @mensagem = "Bem-vindo à MegaStore! Confira nossas ofertas."
ELSE
  SET @mensagem = Concat("Identificamos que você usa um e-mail corporativo (@", @dominio, "). Conheça nosso programa MegaStore Empresas com condições especiais e cashback de até R$500 por mês!")
ENDIF
]%%

%%=v(@mensagem)=%%
```

**Saída (para joao.silva@gmail.com):**
```
Olá! Você sabia que no nosso programa de pontos MegaStore Fidelidade, a cada R$1,00 em compras você acumula 2 pontos? Aproveite o frete grátis acima de R$299!
```

**Saída (para maria.santos@bancomeridional.com.br):**
```
Identificamos que você usa um e-mail corporativo (@bancomeridional.com.br). Conheça nosso programa MegaStore Empresas com condições especiais e cashback de até R$500 por mês!
```

## Observações

- Você pode usar `Domain()` junto com a string de personalização do sistema `emailaddr` para pegar o domínio do destinatário atual do envio. Exemplo: `%%=Domain(emailaddr)=%%`.
- Se o valor passado **não contiver** um `@`, a função retorna `null`.
- Se o valor passado **não for uma string** (por exemplo, um número como `123`), a função também retorna `null`.
- Se o e-mail contiver **mais de um `@`** (ex: `vendas@loja@exemplo.com`), a função retorna tudo após o **primeiro** `@`. No caso, retornaria `loja@exemplo.com`.
- Como a função pode retornar `null`, é uma boa prática usar [Empty](../utility-functions/empty.md) ou [IsNull](../utility-functions/isnull.md) para tratar esses cenários e evitar que o e-mail saia com espaços em branco ou erros.
- A função **não valida** se o endereço de e-mail é válido. Ela apenas extrai o texto após o `@`. Se você precisa validar o formato do e-mail, use [IsEmailAddress](../utility-functions/isemailaddress.md).

## Funções relacionadas

- [IsEmailAddress](../utility-functions/isemailaddress.md) — Valida se uma string é um endereço de e-mail válido. Ótima para usar em conjunto com `Domain()`.
- [Substring](../string-functions/substring.md) — Extrai parte de uma string por posição. Alternativa manual caso precise de mais controle.
- [IndexOf](../string-functions/indexof.md) — Encontra a posição de um caractere dentro de uma string. Útil se precisar localizar o `@` manualmente.
- [Lowercase](../string-functions/lowercase.md) — Converte para minúsculas. Útil para normalizar o domínio antes de comparações.
- [Concat](../string-functions/concat.md) — Concatena strings. Ideal para montar mensagens dinâmicas usando o domínio extraído.
- [Empty](../utility-functions/empty.md) — Verifica se um valor é vazio ou nulo. Use para tratar os casos em que `Domain()` retorna `null`.
- [IsNull](../utility-functions/isnull.md) — Verifica se um valor é nulo. Alternativa ao `Empty()` para checar o retorno da função.