---
title: GetSocialPublishUrlByName
sidebar_label: GetSocialPublishUrlByName
description: Retorna código HTML para compartilhar uma região de conteúdo em uma rede social suportada, usando o nome da rede social.
---

<!-- generated-by-script -->

# GetSocialPublishUrlByName

## Descrição

A função `GetSocialPublishUrlByName` retorna código HTML que permite compartilhar uma região de conteúdo específica em uma rede social suportada. Ela é usada em conjunto com o recurso **Social Forward** do Marketing Cloud Engagement. Você passa o nome da rede social, um código de país ISO, o nome da região de conteúdo e, opcionalmente, pares de chave-valor como parâmetros adicionais para a rede social de destino. O retorno é um trecho HTML pronto para ser inserido no e-mail.

## Sintaxe

```ampscript
GetSocialPublishUrlByName(socialNetworkName, countryCode, contentRegion)
GetSocialPublishUrlByName(socialNetworkName, countryCode, contentRegion, socialNetworkParamKey, socialNetworkParamValue)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| socialNetworkName | String | Sim | Nome da rede social de destino (ex: "Facebook", "Twitter", "LinkedIn"). |
| countryCode | String | Sim | Código de país no padrão ISO (ex: "BR" para Brasil, "US" para Estados Unidos). |
| contentRegion | String | Sim | Nome da região de conteúdo (Content Area) que será compartilhada na rede social. |
| socialNetworkParamKey | String | Não | Chave de um parâmetro adicional a ser passado para a rede social de destino. |
| socialNetworkParamValue | String | Não | Valor correspondente à chave do parâmetro adicional. |

> Você pode passar múltiplos pares de chave-valor adicionando-os ao final da função.

## Redes sociais suportadas

A função suporta as seguintes redes sociais (a lista inclui algumas que foram descontinuadas até 2023, mas é mantida aqui por completude):

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

## Exemplo básico

Imagine que a **Lojas Vitória** quer permitir que assinantes compartilhem uma promoção de Dia das Mães no Facebook:

```ampscript
%%[
VAR @linkFacebook
SET @linkFacebook = GetSocialPublishUrlByName("Facebook", "BR", "PromoçãoDiaDasMães")
]%%

<h2>Promoção Dia das Mães - Lojas Vitória</h2>
<p>Frete grátis acima de R$299! Compartilhe com quem você ama:</p>

<a href="%%=RedirectTo(@linkFacebook)=%%">
  Compartilhar no Facebook
</a>
```

**Saída:**
```html
<h2>Promoção Dia das Mães - Lojas Vitória</h2>
<p>Frete grátis acima de R$299! Compartilhe com quem você ama:</p>

<a href="[URL gerada pelo Social Forward para Facebook]">
  Compartilhar no Facebook
</a>
```

## Exemplo avançado

Agora, a **MegaStore** quer oferecer botões de compartilhamento para Facebook, LinkedIn e Twitter em uma campanha de Black Friday, passando parâmetros adicionais para rastreamento:

```ampscript
%%[
VAR @linkFacebook, @linkLinkedIn, @linkTwitter, @nomeCliente

SET @nomeCliente = AttributeValue("PrimeiroNome")
SET @nomeCliente = IIF(Empty(@nomeCliente), "Cliente", @nomeCliente)

/* Compartilhamento no Facebook com parâmetro de campanha */
SET @linkFacebook = GetSocialPublishUrlByName(
  "Facebook",
  "BR",
  "BlackFriday2024",
  "utm_source", "facebook",
  "utm_campaign", "blackfriday2024"
)

/* Compartilhamento no LinkedIn */
SET @linkLinkedIn = GetSocialPublishUrlByName(
  "LinkedIn",
  "BR",
  "BlackFriday2024",
  "utm_source", "linkedin",
  "utm_campaign", "blackfriday2024"
)

/* Compartilhamento no Twitter */
SET @linkTwitter = GetSocialPublishUrlByName(
  "Twitter",
  "BR",
  "BlackFriday2024",
  "utm_source", "twitter",
  "utm_campaign", "blackfriday2024"
)
]%%

<h1>Fala, %%=v(@nomeCliente)=%%! 🔥 Black Friday MegaStore</h1>
<p>Cashback de R$50 em compras acima de R$399. Compartilhe essa oferta:</p>

<table>
  <tr>
    <td>
      <a href="%%=RedirectTo(@linkFacebook)=%%">📘 Facebook</a>
    </td>
    <td>
      <a href="%%=RedirectTo(@linkLinkedIn)=%%">💼 LinkedIn</a>
    </td>
    <td>
      <a href="%%=RedirectTo(@linkTwitter)=%%">🐦 Twitter</a>
    </td>
  </tr>
</table>
```

**Saída:**
```html
<h1>Fala, Maria! 🔥 Black Friday MegaStore</h1>
<p>Cashback de R$50 em compras acima de R$399. Compartilhe essa oferta:</p>

<table>
  <tr>
    <td>
      <a href="[URL Social Forward Facebook com UTMs]">📘 Facebook</a>
    </td>
    <td>
      <a href="[URL Social Forward LinkedIn com UTMs]">💼 LinkedIn</a>
    </td>
    <td>
      <a href="[URL Social Forward Twitter com UTMs]">🐦 Twitter</a>
    </td>
  </tr>
</table>
```

## Observações

- **Recurso Social Forward obrigatório:** Essa função **só funciona** quando o recurso Social Forward está habilitado na sua conta do Marketing Cloud Engagement. Sem ele, a função não vai gerar os links corretamente.
- **Muitas redes sociais estão descontinuadas:** Redes como Del.icio.us, Digg, Google+, MySpace e StumbleUpon já não existem mais (até 2023). Na prática, as opções mais úteis hoje são **Facebook**, **LinkedIn** e **Twitter**.
- **Função de uso bem específico e pouco comum:** O recurso Social Forward é considerado legado dentro do SFMC. Se você precisa de compartilhamento social em e-mails hoje, muitos desenvolvedores preferem montar os links manualmente usando URLs de compartilhamento das próprias redes sociais (ex: `https://www.facebook.com/sharer/sharer.php?u=...`).
- **Múltiplos pares chave-valor:** Você pode adicionar quantos pares de `socialNetworkParamKey` e `socialNetworkParamValue` quiser ao final da chamada. Basta ir acrescentando na sequência.
- **Content Region:** O parâmetro `contentRegion` se refere ao nome de uma Content Area (Região de Conteúdo) criada no Marketing Cloud. Certifique-se de que o nome está correto e que a Content Area existe.
- **Código de país:** Use sempre o padrão ISO de duas letras. Para o Brasil, use `"BR"`.
- **Diferença para `GetSocialPublishUrl`:** A função `GetSocialPublishUrl` usa o **ID numérico** da rede social, enquanto `GetSocialPublishUrlByName` usa o **nome** da rede. Na maioria dos casos, usar o nome é mais legível e prático.

## Funções relacionadas

- [GetSocialPublishUrl](../social-functions/getsocialpublishurl.md) — Faz a mesma coisa, mas usa o ID numérico da rede social em vez do nome.
- [GetPublishedSocialContent](../social-functions/getpublishedsocialcontent.md) — Recupera conteúdo social já publicado.
- [ContentAreaByName](../content-functions/contentareabyname.md) — Retorna o conteúdo de uma Content Area pelo nome, útil para entender como funcionam as regiões de conteúdo.
- [RedirectTo](../http-functions/redirectto.md) — Usada para criar redirecionamentos rastreáveis nos links gerados.
- [AttributeValue](../utility-functions/attributevalue.md) — Recupera valores de atributos do assinante para personalização.
- [V](../utility-functions/v.md) — Exibe o valor de uma variável no HTML do e-mail.