---
title: GetSocialPublishUrlByName
sidebar_label: GetSocialPublishUrlByName
description: Retorna o código HTML para compartilhamento de uma região de conteúdo em uma rede social, usando o nome da rede como referência.
---

# GetSocialPublishUrlByName

## Descrição

Retorna o código HTML necessário para compartilhar uma região de conteúdo em uma rede social suportada, identificando a rede pelo nome. Essa função é usada em conjunto com o recurso **Social Forward** do Marketing Cloud Engagement. É útil quando você quer incluir botões de compartilhamento social nos seus e-mails — por exemplo, permitir que o assinante compartilhe uma promoção da sua loja no Facebook ou LinkedIn.

## Sintaxe

```ampscript
GetSocialPublishURLByName(socialNetworkName, countryCode, contentRegion [, socialNetworkParamKey, socialNetworkParamValue, ...])
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| socialNetworkName | String | Sim | Nome da rede social (ex: "Facebook", "Twitter", "LinkedIn"). |
| countryCode | String | Sim | Código ISO do país (ex: "BR" para Brasil). |
| contentRegion | String | Sim | Nome da região de conteúdo a ser compartilhada na rede social. |
| socialNetworkParamKey | String | Não | Chave de um parâmetro adicional a ser passado para a rede social de destino. |
| socialNetworkParamValue | String | Não | Valor do parâmetro adicional correspondente à chave. Você pode passar múltiplos pares chave-valor adicionando-os ao final da função. |

## Redes sociais suportadas

A função suporta as seguintes redes sociais:

- Del.icio.us
- Digg
- Facebook
- Google
- Google+
- LinkedIn
- Microsoft
- MySpace
- ShareThis
- StumbleUpon
- Twitter
- Yahoo

> **⚠️ Atenção:** Várias dessas redes sociais já não estão mais ativas desde 2023 (como Google+, Digg, StumbleUpon, Del.icio.us e MySpace). Na prática, as opções mais relevantes para o mercado brasileiro são **Facebook**, **Twitter** e **LinkedIn**.

## Exemplo básico

Adicionando um botão de compartilhamento no Facebook em um e-mail promocional da MegaStore:

```ampscript
%%=GetSocialPublishURLByName("Facebook", "BR", "PromocaoBlackFriday")=%%
```

**Saída:**
```html
<!-- Código HTML gerado automaticamente para o botão de compartilhamento no Facebook -->
```

## Exemplo avançado

E-mail de uma campanha de indicação da Conecta Telecom, com botões de compartilhamento em múltiplas redes sociais e parâmetros extras para rastreamento:

```ampscript
%%[
VAR @shareFacebook, @shareTwitter, @shareLinkedIn, @nomeCliente

SET @nomeCliente = AttributeValue("PrimeiroNome")

SET @shareFacebook = GetSocialPublishURLByName(
  "Facebook",
  "BR",
  "CampanhaIndique",
  "utm_source", "facebook",
  "utm_medium", "social"
)

SET @shareTwitter = GetSocialPublishURLByName(
  "Twitter",
  "BR",
  "CampanhaIndique",
  "utm_source", "twitter",
  "utm_medium", "social"
)

SET @shareLinkedIn = GetSocialPublishURLByName(
  "LinkedIn",
  "BR",
  "CampanhaIndique",
  "utm_source", "linkedin",
  "utm_medium", "social"
)
]%%

Olá, %%=v(@nomeCliente)=%%! Compartilhe essa oferta com seus amigos:

%%=v(@shareFacebook)=%%
%%=v(@shareTwitter)=%%
%%=v(@shareLinkedIn)=%%
```

**Saída:**
```
Olá, João! Compartilhe essa oferta com seus amigos:

<!-- Código HTML do botão Facebook com parâmetros utm_source=facebook e utm_medium=social -->
<!-- Código HTML do botão Twitter com parâmetros utm_source=twitter e utm_medium=social -->
<!-- Código HTML do botão LinkedIn com parâmetros utm_source=linkedin e utm_medium=social -->
```

## Observações

- A função **depende do recurso Social Forward** estar habilitado na sua conta do Marketing Cloud. Sem ele, a função não vai gerar o resultado esperado.
- Você pode passar **múltiplos pares chave-valor** como parâmetros adicionais — basta adicioná-los sequencialmente ao final da chamada da função. Isso é muito útil para adicionar parâmetros UTM de rastreamento.
- A diferença entre esta função e [GetSocialPublishUrl](../social-functions/getsocialpublishurl.md) é que aqui você referencia a rede social pelo **nome** (string), o que torna o código mais legível.

> **💡 Dica:** No mercado brasileiro, os botões de compartilhamento social em e-mail marketing são mais comuns em campanhas de indicação (member-get-member) e lançamentos de produto. Lembre-se de que o código ISO do Brasil é `"BR"`.

> **⚠️ Atenção:** A região de conteúdo (`contentRegion`) precisa existir e estar configurada previamente no seu template. Se o nome estiver incorreto, o HTML de compartilhamento não será gerado corretamente.

## Funções relacionadas

- [GetSocialPublishUrl](../social-functions/getsocialpublishurl.md) — versão que identifica a rede social por ID em vez do nome.
- [GetPublishedSocialContent](../social-functions/getpublishedsocialcontent.md) — recupera conteúdo já publicado em rede social.