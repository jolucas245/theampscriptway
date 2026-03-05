---
title: GetSocialPublishUrl
sidebar_label: GetSocialPublishUrl
description: Retorna o código HTML com a URL de compartilhamento de uma região de conteúdo em uma rede social suportada.
---

# GetSocialPublishUrl

## Descrição

A função `GetSocialPublishUrl` retorna código HTML para compartilhar uma região de conteúdo em uma rede social suportada. Ela é usada em conjunto com o recurso **Social Forward** do Marketing Cloud Engagement. Isso permite que você inclua nos seus e-mails links para que o destinatário compartilhe o conteúdo diretamente em redes sociais como Facebook, LinkedIn e Twitter.

## Sintaxe

```ampscript
GetSocialPublishURL(socialNetworkCode, contentRegion, socialNetworkParamKey, socialNetworkParamValue)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| socialNetworkCode | String | Sim | Código numérico da rede social de destino. Veja a tabela de códigos abaixo. |
| contentRegion | String | Sim | Nome da região de conteúdo (content region) que será compartilhada na rede social. |
| socialNetworkParamKey | String | Não | Chave de um parâmetro adicional a ser enviado para a rede social de destino. |
| socialNetworkParamValue | String | Não | Valor do parâmetro adicional correspondente à chave. Você pode passar múltiplos pares chave-valor adicionando-os ao final da função. |

### Códigos das redes sociais

| Rede Social | Código |
|-------------|--------|
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

> **⚠️ Atenção:** Muitas dessas redes sociais já foram desativadas (como Del.icio.us, Digg, MySpace, StumbleUpon e Google+). Na prática, os códigos mais relevantes hoje são **1** (Facebook), **9** (LinkedIn) e **11** (Twitter).

## Exemplo básico

Um e-mail promocional da Lojas Vitória que permite ao cliente compartilhar a oferta no Facebook:

```ampscript
%%[
VAR @urlFacebook
SET @urlFacebook = GetSocialPublishURL("1", "oferta_semanal")
]%%

<a href="%%=v(@urlFacebook)=%%">Compartilhe esta oferta no Facebook</a>
```

**Saída:**
```html
<a href="[URL gerada pelo Social Forward para Facebook]">Compartilhe esta oferta no Facebook</a>
```

## Exemplo avançado

A MegaStore quer incluir botões de compartilhamento para Facebook, LinkedIn e Twitter em um e-mail de campanha de Black Friday, passando parâmetros adicionais para a rede social:

```ampscript
%%[
VAR @urlFacebook, @urlLinkedIn, @urlTwitter

SET @urlFacebook = GetSocialPublishURL("1", "black_friday_2024", "hashtag", "BlackFridayMegaStore")
SET @urlLinkedIn = GetSocialPublishURL("9", "black_friday_2024")
SET @urlTwitter = GetSocialPublishURL("11", "black_friday_2024", "hashtags", "BlackFriday,MegaStore", "text", "Confira as ofertas da MegaStore!")
]%%

<table role="presentation" cellpadding="0" cellspacing="0">
  <tr>
    <td style="padding-right:10px;">
      <a href="%%=v(@urlFacebook)=%%" title="Compartilhar no Facebook">Facebook</a>
    </td>
    <td style="padding-right:10px;">
      <a href="%%=v(@urlLinkedIn)=%%" title="Compartilhar no LinkedIn">LinkedIn</a>
    </td>
    <td>
      <a href="%%=v(@urlTwitter)=%%" title="Compartilhar no Twitter">Twitter</a>
    </td>
  </tr>
</table>
```

**Saída:**
```html
<table role="presentation" cellpadding="0" cellspacing="0">
  <tr>
    <td style="padding-right:10px;">
      <a href="[URL Social Forward - Facebook]" title="Compartilhar no Facebook">Facebook</a>
    </td>
    <td style="padding-right:10px;">
      <a href="[URL Social Forward - LinkedIn]" title="Compartilhar no LinkedIn">LinkedIn</a>
    </td>
    <td>
      <a href="[URL Social Forward - Twitter]" title="Compartilhar no Twitter">Twitter</a>
    </td>
  </tr>
</table>
```

## Observações

- Esta função depende do recurso **Social Forward** estar habilitado na sua conta do Marketing Cloud Engagement. Sem ele, a função não vai gerar URLs válidas.
- Você pode passar **múltiplos pares chave-valor** de parâmetros adicionando-os sequencialmente ao final da chamada da função (como demonstrado no exemplo avançado com Twitter).
- O primeiro parâmetro (`socialNetworkCode`) deve ser passado como o **código numérico** da rede social (conforme a tabela acima), em formato string.

> **⚠️ Atenção:** A lista de redes sociais inclui diversas plataformas que já foram descontinuadas. Na prática, para campanhas no mercado brasileiro, concentre-se em Facebook (1), LinkedIn (9) e Twitter (11).

> **💡 Dica:** Se você preferir usar o **nome** da rede social ao invés do código numérico, confira a função `GetSocialPublishUrlByName`, que aceita o nome da rede como parâmetro.

## Funções relacionadas

- [GetSocialPublishUrlByName](../social-functions/getsocialpublishurlbyname.md) - mesma funcionalidade, mas usando o nome da rede social ao invés do código numérico.
- [GetPublishedSocialContent](../social-functions/getpublishedsocialcontent.md) - recupera conteúdo social já publicado.
- [ContentArea](../content-functions/contentarea.md) - trabalha com regiões de conteúdo que podem ser compartilhadas via Social Forward.
- [RedirectTo](../http-functions/redirectto.md) - útil para redirecionamentos de URLs geradas dinamicamente.