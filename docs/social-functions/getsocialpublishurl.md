---
title: GetSocialPublishUrl
sidebar_label: GetSocialPublishUrl
description: Retorna código HTML com um link para compartilhar uma região de conteúdo em uma rede social compatível, usando o recurso Social Forward do Marketing Cloud.
---

<!-- generated-by-script -->

# GetSocialPublishUrl

## Descrição

A função `GetSocialPublishUrl` gera código HTML contendo um link que permite compartilhar uma região de conteúdo específica em uma rede social compatível. Ela é usada em conjunto com o recurso **Social Forward** do Marketing Cloud Engagement. Você passa o código numérico da rede social desejada e o nome da região de conteúdo, e a função retorna o HTML pronto para inserir no seu e-mail. Opcionalmente, você pode enviar pares de chave-valor como parâmetros extras para a rede social de destino.

## Sintaxe

```ampscript
GetSocialPublishUrl(socialNetworkCode, contentRegion)
GetSocialPublishUrl(socialNetworkCode, contentRegion, socialNetworkParamKey, socialNetworkParamValue, ...)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| socialNetworkCode | String | Sim | Código numérico da rede social de destino. Veja a tabela de códigos abaixo. |
| contentRegion | String | Sim | Nome da região de conteúdo (content area) que será compartilhada na rede social. |
| socialNetworkParamKey | String | Não | Chave de um parâmetro adicional a ser passado para a rede social de destino. |
| socialNetworkParamValue | String | Não | Valor do parâmetro adicional correspondente à chave informada. Você pode passar múltiplos pares chave-valor adicionando-os ao final da função. |

### Tabela de códigos das redes sociais

| Rede Social | Código |
|---|---|
| Facebook | 1 |
| Del.icio.us | 2 |
| Digg | 3 |
| MySpace | 4 |
| StumbleUpon | 5 |
| Google | 6 |
| Microsoft | 7 |
| Yahoo | 8 |
| LinkedIn | 9 |
| ShareThis | 10 |
| Twitter | 11 |
| Google+ | 15 |

## Exemplo básico

Imagine que a **Lojas Vitória** quer incluir no e-mail de Dia das Mães um botão para o assinante compartilhar a promoção no Facebook. A região de conteúdo chamada `PromoMaes2024` já foi criada no Marketing Cloud.

```ampscript
%%[
/* Gera o link de compartilhamento no Facebook (código 1) */
VAR @linkFacebook
SET @linkFacebook = GetSocialPublishUrl("1", "PromoMaes2024")
]%%

<table role="presentation" cellpadding="0" cellspacing="0">
  <tr>
    <td style="padding:10px;">
      <a href="%%=RedirectTo(@linkFacebook)=%%">
        Compartilhe no Facebook esta promoção de Dia das Mães!
      </a>
    </td>
  </tr>
</table>
```

**Saída:**
```html
<a href="[URL gerada pelo Social Forward para Facebook]">
  Compartilhe no Facebook esta promoção de Dia das Mães!
</a>
```

## Exemplo avançado

Agora a **MegaStore** quer oferecer compartilhamento em múltiplas redes sociais na campanha de Black Friday, passando parâmetros extras para rastreamento. A região de conteúdo se chama `BlackFriday2024`.

```ampscript
%%[
VAR @linkFacebook, @linkLinkedIn, @linkTwitter
VAR @nomeAssinante

SET @nomeAssinante = AttributeValue("PrimeiroNome")

/* Facebook com parâmetro de campanha */
SET @linkFacebook = GetSocialPublishUrl(
  "1",
  "BlackFriday2024",
  "utm_source", "facebook",
  "utm_campaign", "blackfriday_megastore"
)

/* LinkedIn */
SET @linkLinkedIn = GetSocialPublishUrl(
  "9",
  "BlackFriday2024",
  "utm_source", "linkedin",
  "utm_campaign", "blackfriday_megastore"
)

/* Twitter */
SET @linkTwitter = GetSocialPublishUrl(
  "11",
  "BlackFriday2024",
  "utm_source", "twitter",
  "utm_campaign", "blackfriday_megastore"
)
]%%

<div style="font-family: Arial, sans-serif; padding: 20px;">
  <p>E aí, %%=v(@nomeAssinante)=%%! 🔥</p>
  <p>
    A Black Friday da MegaStore tá imperdível — frete grátis acima de R$299
    e cashback de até R$150! Compartilhe com a galera:
  </p>

  <table role="presentation" cellpadding="8" cellspacing="0">
    <tr>
      <td>
        <a href="%%=RedirectTo(@linkFacebook)=%%" style="color:#1877F2; text-decoration:none; font-weight:bold;">
          📘 Facebook
        </a>
      </td>
      <td>
        <a href="%%=RedirectTo(@linkLinkedIn)=%%" style="color:#0A66C2; text-decoration:none; font-weight:bold;">
          💼 LinkedIn
        </a>
      </td>
      <td>
        <a href="%%=RedirectTo(@linkTwitter)=%%" style="color:#1DA1F2; text-decoration:none; font-weight:bold;">
          🐦 Twitter
        </a>
      </td>
    </tr>
  </table>
</div>
```

**Saída:**
```html
<div style="font-family: Arial, sans-serif; padding: 20px;">
  <p>E aí, Maria! 🔥</p>
  <p>
    A Black Friday da MegaStore tá imperdível — frete grátis acima de R$299
    e cashback de até R$150! Compartilhe com a galera:
  </p>
  <table role="presentation" cellpadding="8" cellspacing="0">
    <tr>
      <td><a href="[URL Social Forward Facebook com utm_source=facebook]">📘 Facebook</a></td>
      <td><a href="[URL Social Forward LinkedIn com utm_source=linkedin]">💼 LinkedIn</a></td>
      <td><a href="[URL Social Forward Twitter com utm_source=twitter]">🐦 Twitter</a></td>
    </tr>
  </table>
</div>
```

## Observações

- **Recurso Social Forward obrigatório:** essa função só funciona quando o recurso **Social Forward** está habilitado na sua conta do Marketing Cloud Engagement. Sem ele, a função não vai gerar os links corretamente.
- **Muitas redes estão descontinuadas:** a lista de códigos inclui diversas redes sociais que **já não estão mais ativas desde 2023** (Del.icio.us, Digg, MySpace, StumbleUpon, Google+). Na prática, as opções mais relevantes hoje são **Facebook (1)**, **LinkedIn (9)** e **Twitter (11)**.
- **A região de conteúdo precisa existir:** o parâmetro `contentRegion` deve corresponder a uma **Content Area** previamente criada no Marketing Cloud. Se o nome estiver errado ou a região não existir, o link não vai funcionar como esperado.
- **Pares chave-valor adicionais:** você pode passar quantos pares de `socialNetworkParamKey` e `socialNetworkParamValue` quiser — basta adicioná-los ao final da chamada da função. Isso é útil para incluir parâmetros UTM ou outros dados de rastreamento.
- **Função de uso específico e pouco comum:** com a evolução do Marketing Cloud e a descontinuação de várias redes sociais da lista, essa função é **raramente utilizada** em implementações modernas. Avalie se atende às suas necessidades antes de usá-la.
- **Contexto de uso:** essa função é projetada para uso em **e-mails** enviados pelo Marketing Cloud. O código HTML gerado cria links clicáveis que direcionam o destinatário para a rede social escolhida com o conteúdo pré-carregado para compartilhamento.
- **Diferença para GetSocialPublishUrlByName:** enquanto `GetSocialPublishUrl` usa o **código numérico** da rede social, a função [GetSocialPublishUrlByName](../social-functions/getsocialpublishurlbyname.md) aceita o **nome** da rede social como string. Escolha a que ficar mais legível para o seu caso.

## Funções relacionadas

- [GetSocialPublishUrlByName](../social-functions/getsocialpublishurlbyname.md) — mesma funcionalidade, mas aceita o nome da rede social em vez do código numérico
- [GetPublishedSocialContent](../social-functions/getpublishedsocialcontent.md) — retorna conteúdo social já publicado
- [ContentAreaByName](../content-functions/contentareabyname.md) — recupera uma Content Area pelo nome, útil para trabalhar com regiões de conteúdo
- [ContentArea](../content-functions/contentarea.md) — insere uma Content Area pelo ID
- [RedirectTo](../http-functions/redirectto.md) — redireciona para uma URL, frequentemente usado em conjunto com links gerados por funções sociais
- [AttributeValue](../utility-functions/attributevalue.md) — recupera atributos do assinante para personalizar o conteúdo compartilhado
- [Concat](../string-functions/concat.md) — concatena strings, útil para montar parâmetros dinâmicos