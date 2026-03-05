---
title: Redirect
sidebar_label: Redirect
description: Redireciona visitantes de uma landing page para uma URL diferente, retornando uma resposta HTTP 302.
---

# Redirect

## Descrição

A função `Redirect` redireciona visitantes de uma landing page para uma URL diferente. Quando executada, a página retorna uma resposta HTTP 302, e o cliente é automaticamente redirecionado para a nova URL. É muito útil em cenários onde você precisa direcionar o usuário para uma página específica com base em dados personalizados - por exemplo, redirecionar um cliente para sua área logada ou para uma oferta segmentada.

## Sintaxe

```ampscript
Redirect(@redirectUrl)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| redirectUrl | String | Sim | A URL para a qual o visitante será redirecionado. |

## Exemplo básico

Redirecionando o visitante de uma landing page para o site principal da loja:

```ampscript
%%[
Redirect("https://www.lojasvitoria.com.br")
]%%
```

**Saída:**
```
O visitante é redirecionado automaticamente (HTTP 302) para https://www.lojasvitoria.com.br
```

## Exemplo avançado

Um caso de uso comum é combinar `Redirect` com [Concat](../string-functions/concat.md) para passar parâmetros na query string. Neste exemplo, o subscriber key do cliente é concatenado à URL, permitindo que a página de destino identifique quem está acessando - útil em réguas de relacionamento onde você envia um e-mail com link para uma landing page personalizada:

```ampscript
%%[
VAR @subscriberKey, @urlRedirect

SET @subscriberKey = _subscriberkey

SET @urlRedirect = Concat(
  "https://www.lojasvitoria.com.br/ofertas?sk=",
  @subscriberKey
)

Redirect(@urlRedirect)
]%%
```

**Saída:**
```
O visitante é redirecionado automaticamente (HTTP 302) para https://www.lojasvitoria.com.br/ofertas?sk=joao.silva@email.com.br
(onde o valor de sk corresponde ao subscriber key do contato)
```

## Observações

> **⚠️ Atenção:** A função `Redirect` deve ser usada em landing pages (como CloudPages). Ela retorna uma resposta HTTP 302, ou seja, é um redirecionamento temporário - o navegador não faz cache dessa instrução.

> **💡 Dica:** Combinar `Redirect` com [Concat](../string-functions/concat.md) é o padrão mais comum no dia a dia. Você monta a URL dinamicamente com dados do subscriber e redireciona para uma página que já recebe esses parâmetros prontos. Isso é muito usado para páginas de preferências, confirmação de opt-in, ou redirecionamento condicional baseado em dados de uma Data Extension.

## Funções relacionadas

- [Concat](../string-functions/concat.md) - para montar URLs dinâmicas com parâmetros antes de redirecionar
- [RedirectTo](../http-functions/redirectto.md) - função de redirecionamento do contexto HTTP
- [CloudPagesURL](../sites-functions/cloudpagesurl.md) - para gerar URLs de CloudPages com parâmetros criptografados
- [RequestParameter](../sites-functions/requestparameter.md) - para capturar os parâmetros passados na URL de destino