---
title: HTTPRequestHeader
sidebar_label: HTTPRequestHeader
description: Recupera o valor de um cabeçalho HTTP de uma requisição feita a uma landing page ou CloudPage.
---

<!-- generated-by-script -->

# HTTPRequestHeader

## Descrição

A função `HTTPRequestHeader` recupera o valor de um cabeçalho (header) de uma requisição HTTP feita a uma landing page. Isso é útil quando você precisa identificar informações sobre o navegador, idioma ou outras características do visitante que acessou sua página. A função retorna o valor do cabeçalho solicitado como uma string. Você só pode usar essa função para recuperar cabeçalhos HTTP padrão definidos na [RFC 7231](https://www.rfc-editor.org/rfc/rfc7231).

## Sintaxe

```ampscript
HTTPRequestHeader("headerToRetrieve")
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| headerToRetrieve | String | Sim | O nome do cabeçalho HTTP que você deseja recuperar da requisição (ex: "User-Agent", "Accept-Language", "Host", etc.). Deve ser um cabeçalho padrão da RFC 7231. |

## Exemplo básico

Imagine que a **Lojas Vitória** quer exibir uma mensagem personalizada na CloudPage dependendo do navegador do visitante. Vamos recuperar o cabeçalho `User-Agent`:

```ampscript
%%[
VAR @userAgent
SET @userAgent = HTTPRequestHeader("User-Agent")
]%%

<p>Bem-vindo à Lojas Vitória!</p>
<p>Seu navegador: %%=v(@userAgent)=%%</p>
```

**Saída:**
```
Bem-vindo à Lojas Vitória!
Seu navegador: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36
```

## Exemplo avançado

Aqui a **MegaStore** quer detectar o idioma preferido do visitante na CloudPage de promoção da Black Friday e exibir conteúdo em português ou inglês. Além disso, registra o acesso em uma Data Extension para análise posterior:

```ampscript
%%[
VAR @idioma, @userAgent, @host, @conteudo, @emailAssinante

SET @idioma = HTTPRequestHeader("Accept-Language")
SET @userAgent = HTTPRequestHeader("User-Agent")
SET @host = HTTPRequestHeader("Host")
SET @emailAssinante = RequestParameter("email")

/* Verifica se o idioma preferido contém pt-BR */
IF IndexOf(@idioma, "pt-BR") > 0 THEN
  SET @conteudo = "🔥 Black Friday MegaStore! Frete grátis acima de R$299 e cashback de até R$150. Aproveite!"
ELSE
  SET @conteudo = "🔥 MegaStore Black Friday! Free shipping over R$299 and cashback up to R$150. Shop now!"
ENDIF

/* Registra o acesso na Data Extension para análise */
IF NOT Empty(@emailAssinante) THEN
  InsertDE(
    "Log_Acessos_CloudPage",
    "Email", @emailAssinante,
    "UserAgent", @userAgent,
    "Idioma", @idioma,
    "Host", @host,
    "DataAcesso", Now()
  )
ENDIF
]%%

<h1>%%=v(@conteudo)=%%</h1>

%%[ IF IndexOf(Lowercase(@userAgent), "mobile") > 0 THEN ]%%
  <p>📱 Baixe o app MegaStore e ganhe R$25 de desconto no primeiro pedido!</p>
%%[ ELSE ]%%
  <p>💻 Acesse www.megastore.com.br e confira todas as ofertas da Black Friday!</p>
%%[ ENDIF ]%%
```

**Saída (visitante brasileiro em dispositivo mobile):**
```
🔥 Black Friday MegaStore! Frete grátis acima de R$299 e cashback de até R$150. Aproveite!
📱 Baixe o app MegaStore e ganhe R$25 de desconto no primeiro pedido!
```

## Observações

- **Funciona apenas em landing pages e CloudPages.** Essa função **não funciona** no contexto de envio de e-mails ou SMS. Ela depende de uma requisição HTTP feita por um navegador.
- Você só pode recuperar cabeçalhos HTTP **padrão** definidos na [RFC 7231](https://www.rfc-editor.org/rfc/rfc7231). Cabeçalhos personalizados (custom headers) não são suportados.
- Se o cabeçalho solicitado não existir na requisição, a função pode retornar uma string vazia. É uma boa prática usar [Empty](../utility-functions/empty.md) para verificar antes de usar o valor.
- Os cabeçalhos mais comuns que você pode recuperar incluem: `User-Agent`, `Accept-Language`, `Accept`, `Host`, `Referer`, entre outros definidos na RFC 7231.
- O valor retornado é uma string. Se precisar fazer comparações, considere usar [Lowercase](../string-functions/lowercase.md) ou [Uppercase](../string-functions/uppercase.md) para normalizar o texto.
- Essa função é muito semelhante à [RequestHeader](../http-functions/requestheader.md). Verifique a documentação de ambas para entender qual se aplica melhor ao seu cenário.

## Funções relacionadas

- [RequestHeader](../http-functions/requestheader.md) — Função similar para recuperar cabeçalhos HTTP de requisições
- [RequestParameter](../sites-functions/requestparameter.md) — Recupera parâmetros da query string ou do corpo da requisição
- [QueryParameter](../sites-functions/queryparameter.md) — Recupera parâmetros da URL da página
- [CloudPagesURL](../sites-functions/cloudpagesurl.md) — Gera URLs seguras para CloudPages com parâmetros criptografados
- [RedirectTo](../http-functions/redirectto.md) — Redireciona o visitante para outra URL
- [Lowercase](../string-functions/lowercase.md) — Converte texto para minúsculas, útil para comparar valores de cabeçalhos
- [IndexOf](../string-functions/indexof.md) — Localiza uma substring dentro de um texto, útil para analisar valores de cabeçalhos
- [Empty](../utility-functions/empty.md) — Verifica se um valor está vazio antes de usá-lo
- [InsertDE](../data-extension-functions/insertde.md) — Insere registros em uma Data Extension para logar acessos