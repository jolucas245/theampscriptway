---
title: Redirect
sidebar_label: Redirect
description: Redireciona visitantes de uma landing page para uma URL diferente, retornando uma resposta HTTP 302.
---

# Redirect

## Descrição

A função `Redirect()` redireciona os visitantes de uma landing page (como uma CloudPage) para uma URL diferente. Quando executada, a página retorna uma resposta **HTTP 302** (redirecionamento temporário) e o visitante é automaticamente levado para a nova URL. É muito útil quando você precisa montar URLs dinâmicas — por exemplo, adicionando parâmetros personalizados como ID do cliente, código de cupom ou chave do assinante. Um caso de uso bem comum é combinar essa função com [Concat](../string-functions/concat.md) para construir a URL final com query parameters.

## Sintaxe

```ampscript
Redirect(redirectUrl)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|-------------|--------|-------------|-----------|
| redirectUrl | String | Sim | A URL completa para onde o visitante será redirecionado. |

## Exemplo básico

Imagine que você tem uma CloudPage que simplesmente redireciona o visitante para o site da sua loja fictícia:

```ampscript
%%[
Redirect("https://www.lojasvitoria.com.br/ofertas")
]%%
```

**Saída:**

```
O visitante é redirecionado automaticamente (HTTP 302) para:
https://www.lojasvitoria.com.br/ofertas
```

## Exemplo avançado

Aqui vai um cenário bem real: você está rodando uma campanha de **Black Friday** da Lojas Vitória e quer redirecionar cada cliente para uma página personalizada, passando a SubscriberKey e o código do cupom de desconto como parâmetros na URL. A CloudPage recebe esses dados, monta a URL dinâmica e redireciona o cliente:

```ampscript
%%[
SET @subscriberKey = AttributeValue("_subscriberkey")
SET @email = AttributeValue("EmailAddress")

/* Busca o cupom personalizado na Data Extension */
SET @cupom = Lookup("CuponsBlackFriday", "CodigoCupom", "SubscriberKey", @subscriberKey)

/* Monta a URL com os parâmetros dinâmicos */
SET @urlBase = "https://www.lojasvitoria.com.br/blackfriday/resgate"
SET @urlFinal = Concat(
  @urlBase,
  "?sk=", URLEncode(@subscriberKey),
  "&cupom=", URLEncode(@cupom),
  "&email=", URLEncode(@email)
)

Redirect(@urlFinal)
]%%
```

**Saída:**

```
O visitante é redirecionado (HTTP 302) para algo como:
https://www.lojasvitoria.com.br/blackfriday/resgate?sk=joao.silva%40email.com&cupom=BF2024VIT30&email=joao.silva%40email.com
```

### Outro exemplo: redirecionamento condicional

Você pode usar lógica condicional para redirecionar o cliente para páginas diferentes com base no seu nível no programa de fidelidade:

```ampscript
%%[
SET @subscriberKey = AttributeValue("_subscriberkey")
SET @nivel = Lookup("ProgramaFidelidade", "Nivel", "SubscriberKey", @subscriberKey)

IF @nivel == "Ouro" THEN
  SET @destino = "https://www.bancomeridional.com.br/fidelidade/ouro"
ELSEIF @nivel == "Prata" THEN
  SET @destino = "https://www.bancomeridional.com.br/fidelidade/prata"
ELSE
  SET @destino = "https://www.bancomeridional.com.br/fidelidade/cadastro"
ENDIF

Redirect(@destino)
]%%
```

**Saída:**

```
Se o cliente João Silva tem nível "Ouro", ele é redirecionado para:
https://www.bancomeridional.com.br/fidelidade/ouro
```

## Observações

- A função `Redirect()` deve ser utilizada em **landing pages** (CloudPages ou Microsites). Não use em e-mails — para links rastreáveis em e-mails, use [RedirectTo](../http-functions/redirectto.md).
- O redirecionamento retorna um **HTTP 302** (redirecionamento temporário), ou seja, o navegador do visitante é automaticamente levado para a nova URL.
- A função **não retorna nenhum valor**. Ela simplesmente executa o redirecionamento. Qualquer código HTML ou AMPscript **após** o `Redirect()` provavelmente não será renderizado para o visitante.
- Quando montar URLs dinâmicas, use [URLEncode](../string-functions/urlencode.md) nos valores dos parâmetros para garantir que caracteres especiais (como `@`, espaços, acentos) sejam codificados corretamente.
- É muito comum combinar `Redirect()` com [Concat](../string-functions/concat.md) para montar a URL final com query parameters, conforme mostrado no exemplo avançado.
- Certifique-se de que a URL passada é completa (incluindo `https://`). URLs relativas podem não funcionar como esperado.
- Se você precisar validar dados antes do redirecionamento, faça toda a lógica **antes** de chamar `Redirect()`.

## Funções relacionadas

- [RedirectTo](../http-functions/redirectto.md) — redireciona para uma URL em contexto de e-mail, com rastreamento de cliques
- [Concat](../string-functions/concat.md) — concatena strings, muito usada para montar a URL dinâmica antes do redirecionamento
- [URLEncode](../string-functions/urlencode.md) — codifica valores para uso seguro em URLs (query parameters)
- [CloudPagesURL](../sites-functions/cloudpagesurl.md) — gera uma URL criptografada para uma CloudPage, útil para links seguros em e-mails
- [RequestParameter](../sites-functions/requestparameter.md) — captura parâmetros passados na URL da landing page
- [QueryParameter](../sites-functions/queryparameter.md) — similar ao RequestParameter, recupera valores de query strings
- [Lookup](../data-extension-functions/lookup.md) — busca dados em Data Extensions, útil para montar URLs personalizadas antes do redirect
- [AttributeValue](../utility-functions/attributevalue.md) — recupera valores de atributos do assinante de forma segura