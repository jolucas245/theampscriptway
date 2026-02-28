---
title: HTTPGetWrap
sidebar_label: HTTPGetWrap
description: Faz uma requisição HTTP GET para uma URL e envolve o resultado em tags que permitem rastreamento de links pelo Marketing Cloud.
---

<!-- generated-by-script -->

# HTTPGetWrap

## Descrição

A função `HTTPGetWrap` faz uma requisição HTTP GET para a URL especificada e retorna o conteúdo da resposta, envolvendo automaticamente quaisquer links encontrados no conteúdo retornado com o wrapper de rastreamento de cliques do Marketing Cloud. Isso é útil quando você precisa incluir conteúdo externo em um e-mail e quer que os links nesse conteúdo sejam rastreados normalmente pelo sistema de tracking do SFMC. Basicamente, ela combina a funcionalidade do [HTTPGet](../http-functions/httpget.md) com o encapsulamento automático de URLs para rastreamento.

## Sintaxe

```ampscript
HTTPGetWrap(URL)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|--------|-------------|-----------|
| URL | String | Sim | A URL completa para a qual a requisição HTTP GET será feita. O conteúdo retornado terá seus links automaticamente encapsulados para rastreamento de cliques. |

## Exemplo básico

Imagine que a **Lojas Vitória** tem um serviço que gera banners HTML personalizados com ofertas do dia. Você quer incluir esse conteúdo no e-mail e garantir que os links sejam rastreados:

```ampscript
%%[
VAR @conteudoBanner
SET @conteudoBanner = HTTPGetWrap("https://api.lojasvitoria.com.br/banners/oferta-do-dia")
]%%

%%=v(@conteudoBanner)=%%
```

**Saída:**
```html
<a href="[link rastreado pelo SFMC]">
  <img src="https://cdn.lojasvitoria.com.br/banners/oferta-natal.jpg" alt="Oferta de Natal - Até 50% OFF" />
</a>
```

Os links retornados pelo endpoint são automaticamente encapsulados pelo sistema de rastreamento do Marketing Cloud.

## Exemplo avançado

Aqui, a **FarmaRede** busca um bloco de conteúdo personalizado de um serviço externo, passando dados do assinante na URL para que o conteúdo seja dinâmico. Os links no HTML retornado serão rastreados automaticamente:

```ampscript
%%[
VAR @email, @emailEncoded, @urlApi, @conteudoOfertas

SET @email = AttributeValue("EmailAddress")
SET @emailEncoded = URLEncode(@email)

/* Monta a URL com o e-mail do assinante para personalização */
SET @urlApi = Concat("https://api.farmarede.com.br/ofertas/personalizadas?email=", @emailEncoded)

/* Busca o conteúdo e envolve os links para rastreamento */
SET @conteudoOfertas = HTTPGetWrap(@urlApi)

IF NOT Empty(@conteudoOfertas) THEN
]%%

<div style="padding: 20px; background-color: #f5f5f5;">
  <h2 style="color: #2c7a3e;">🎯 Ofertas selecionadas pra você</h2>
  %%=v(@conteudoOfertas)=%%
</div>

%%[
ELSE
]%%

<div style="padding: 20px; background-color: #f5f5f5;">
  <h2 style="color: #2c7a3e;">🎯 Confira nossas ofertas</h2>
  <p>Acesse nosso site e veja as promoções da semana!</p>
  <a href="https://www.farmarede.com.br/ofertas">Ver ofertas</a>
</div>

%%[
ENDIF
]%%
```

**Saída (quando o serviço retorna conteúdo):**
```html
<div style="padding: 20px; background-color: #f5f5f5;">
  <h2 style="color: #2c7a3e;">🎯 Ofertas selecionadas pra você</h2>
  <p>Vitamina C 1000mg - De R$45,90 por <strong>R$29,90</strong></p>
  <a href="[link rastreado pelo SFMC]">Comprar agora</a>
  <p>Protetor Solar FPS 50 - De R$89,00 por <strong>R$59,90</strong></p>
  <a href="[link rastreado pelo SFMC]">Comprar agora</a>
</div>
```

## Observações

- **Diferença principal do HTTPGet:** A função `HTTPGetWrap` funciona de forma muito parecida com [HTTPGet](../http-functions/httpget.md), mas com a diferença crucial de que ela **encapsula automaticamente os links** encontrados no conteúdo retornado para que o Marketing Cloud consiga rastrear os cliques. Se você usar `HTTPGet` puro, os links no conteúdo retornado **não serão rastreados**.
- **Use em e-mails quando precisar de tracking:** Se o conteúdo externo será usado em um e-mail e contém links que você quer rastrear, prefira `HTTPGetWrap`. Se o rastreamento não importa (como em CloudPages ou processamento de dados), use [HTTPGet](../http-functions/httpget.md) mesmo.
- **Timeout e performance:** Assim como o `HTTPGet`, chamadas HTTP externas adicionam latência ao tempo de renderização do e-mail. Se o serviço externo estiver lento ou fora do ar, isso pode impactar o envio. Sempre tenha um conteúdo de fallback (como no exemplo avançado com `Empty()`).
- **Protocolo HTTPS:** Dê preferência a URLs com HTTPS para garantir segurança na comunicação.
- **Limitações de tamanho:** O conteúdo retornado deve ser compatível com o tamanho máximo permitido pelo Marketing Cloud para processamento de AMPscript.
- **Conteúdo retornado deve ser HTML válido:** Para que o encapsulamento de links funcione corretamente, o conteúdo retornado pelo endpoint deve conter links em formato HTML padrão (tags `<a href="...">`).
- **Cuidado com dados sensíveis na URL:** Evite passar dados sensíveis como CPF diretamente na query string. Prefira usar identificadores opacos ou tokens temporários.
- **Não confunda com WrapLongURL:** A função [WrapLongURL](../http-functions/wraplongurl.md) serve para lidar com URLs longas que podem quebrar em clientes de e-mail. `HTTPGetWrap` é sobre buscar conteúdo externo com rastreamento de links.

## Funções relacionadas

- [HTTPGet](../http-functions/httpget.md) — Faz uma requisição HTTP GET sem encapsular links para rastreamento
- [BeforeHTTPGet](../http-functions/beforehttpget.md) — Define conteúdo a ser exibido antes da chamada HTTP GET
- [AfterHTTPGet](../http-functions/afterhttpget.md) — Define conteúdo a ser exibido após a chamada HTTP GET
- [HTTPPost](../http-functions/httppost.md) — Faz uma requisição HTTP POST para uma URL
- [HTTPPost2](../http-functions/httppost2.md) — Faz uma requisição HTTP POST com mais opções de configuração
- [WrapLongURL](../http-functions/wraplongurl.md) — Encapsula URLs longas para evitar quebra em clientes de e-mail
- [URLEncode](../string-functions/urlencode.md) — Codifica uma string para uso seguro em URLs
- [TreatAsContent](../utility-functions/treatascontent.md) — Processa uma string como conteúdo AMPscript
- [Empty](../utility-functions/empty.md) — Verifica se um valor está vazio ou nulo
- [RedirectTo](../http-functions/redirectto.md) — Redireciona o usuário para uma URL específica