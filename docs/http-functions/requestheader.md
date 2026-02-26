---
title: RequestHeader
sidebar_label: RequestHeader
description: Recupera o valor de um cabeçalho HTTP de uma requisição feita a uma landing page no Marketing Cloud.
---

<!-- generated-by-script -->

# RequestHeader

## Descrição

A função `RequestHeader` recupera o valor de um cabeçalho HTTP padrão a partir de uma requisição feita a uma landing page (CloudPage). Ela é útil quando você precisa identificar informações sobre o navegador, idioma preferido ou outros dados enviados pelo cliente HTTP no momento do acesso. Você só pode usar essa função para recuperar cabeçalhos HTTP padrão definidos na [RFC 7231](https://datatracker.ietf.org/doc/html/rfc7231). A função retorna o valor do cabeçalho solicitado como uma string.

## Sintaxe

```ampscript
RequestHeader("headerToRetrieve")
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| headerToRetrieve | String | Sim | O nome do cabeçalho HTTP padrão (RFC 7231) que você deseja recuperar da requisição. |

## Exemplo básico

Imagine que você tem uma CloudPage da **Lojas Vitória** e quer exibir qual navegador o cliente está usando para acessar a página:

```ampscript
%%[
  VAR @userAgent
  SET @userAgent = RequestHeader("User-Agent")
]%%

<p>Seu navegador: %%=v(@userAgent)=%%</p>
```

**Saída:**
```
Seu navegador: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36
```

## Exemplo avançado

Aqui temos um cenário real: a **MegaStore** tem uma CloudPage de promoções de Black Friday e quer registrar em uma Data Extension o idioma preferido do visitante e o User-Agent, para depois analisar o perfil de acesso dos clientes. Além disso, a página exibe conteúdo diferente dependendo se o idioma preferido é português do Brasil:

```ampscript
%%[
  VAR @userAgent, @idioma, @emailAssinante, @ehBrasileiro

  SET @userAgent = RequestHeader("User-Agent")
  SET @idioma = RequestHeader("Accept-Language")
  SET @emailAssinante = RequestParameter("email")

  /* Registra os dados do acesso na DE "Log_Acessos_BlackFriday" */
  IF NOT Empty(@emailAssinante) THEN
    InsertDE(
      "Log_Acessos_BlackFriday",
      "Email", @emailAssinante,
      "UserAgent", @userAgent,
      "IdiomaPreferido", @idioma,
      "DataAcesso", Now()
    )
  ENDIF

  /* Verifica se o idioma contém pt-BR */
  IF IndexOf(@idioma, "pt-BR") > 0 THEN
    SET @ehBrasileiro = 1
  ELSE
    SET @ehBrasileiro = 0
  ENDIF
]%%

%%[ IF @ehBrasileiro == 1 THEN ]%%
  <h1>🔥 Black Friday MegaStore!</h1>
  <p>Frete grátis acima de R$ 299,00 para todo o Brasil!</p>
  <p>Use o cupom <strong>BLACKMEGA24</strong> e ganhe até R$ 150,00 de cashback.</p>
%%[ ELSE ]%%
  <h1>🔥 MegaStore Black Friday!</h1>
  <p>Free shipping on orders over R$ 299.00 within Brazil!</p>
  <p>Use coupon <strong>BLACKMEGA24</strong> for up to R$ 150.00 cashback.</p>
%%[ ENDIF ]%%

<p style="font-size: 11px; color: #999;">
  Navegador detectado: %%=v(@userAgent)=%%<br>
  Idioma preferido: %%=v(@idioma)=%%
</p>
```

**Saída (para um visitante brasileiro):**
```
🔥 Black Friday MegaStore!
Frete grátis acima de R$ 299,00 para todo o Brasil!
Use o cupom BLACKMEGA24 e ganhe até R$ 150,00 de cashback.

Navegador detectado: Mozilla/5.0 (Linux; Android 13; SM-A546E) AppleWebKit/537.36 ...
Idioma preferido: pt-BR,pt;q=0.9,en-US;q=0.8
```

## Observações

- **Funciona apenas em landing pages (CloudPages).** Essa função **não funciona** em emails, SMS ou outros contextos de envio. Ela depende de uma requisição HTTP ativa feita por um navegador.
- **Apenas cabeçalhos padrão da RFC 7231** podem ser recuperados. Cabeçalhos customizados (como `X-Custom-Header`) não são suportados por essa função.
- Se você passar o nome de um cabeçalho que não existe na requisição ou que não é um cabeçalho padrão da RFC 7231, a função pode retornar um valor vazio. Sempre use [Empty](../utility-functions/empty.md) para verificar antes de usar o valor.
- Os cabeçalhos mais comuns que você pode recuperar incluem: `User-Agent`, `Accept-Language`, `Accept`, `Accept-Encoding`, `Host`, `Referer`, entre outros definidos na RFC 7231.
- O valor retornado é uma **string**. Se precisar manipulá-lo, combine com funções de string como [IndexOf](../string-functions/indexof.md), [Substring](../string-functions/substring.md) ou [Lowercase](../string-functions/lowercase.md).
- Lembre-se que o conteúdo dos cabeçalhos HTTP é controlado pelo navegador/cliente do usuário e **pode ser manipulado**. Não confie cegamente nesses valores para decisões críticas de segurança.

## Funções relacionadas

- [HTTPGet](../http-functions/httpget.md) — Faz uma requisição HTTP GET para uma URL externa
- [HTTPPost](../http-functions/httppost.md) — Faz uma requisição HTTP POST para uma URL externa
- [RedirectTo](../http-functions/redirectto.md) — Redireciona o usuário para uma URL específica
- [RequestParameter](../sites-functions/requestparameter.md) — Recupera parâmetros de query string ou POST de uma landing page
- [QueryParameter](../sites-functions/queryparameter.md) — Recupera um parâmetro da query string da URL
- [CloudPagesURL](../sites-functions/cloudpagesurl.md) — Gera uma URL autenticada para uma CloudPage
- [Empty](../utility-functions/empty.md) — Verifica se um valor está vazio ou nulo
- [IndexOf](../string-functions/indexof.md) — Encontra a posição de uma substring dentro de uma string
- [Lowercase](../string-functions/lowercase.md) — Converte uma string para letras minúsculas