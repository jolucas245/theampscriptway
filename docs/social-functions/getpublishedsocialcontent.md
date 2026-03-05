---
title: GetPublishedSocialContent
sidebar_label: GetPublishedSocialContent
description: Retorna o conteúdo publicado para compartilhamento em redes sociais com base no ID da região especificada.
---

# GetPublishedSocialContent

## Descrição

Retorna o conteúdo destinado a compartilhamento em redes sociais, identificado pelo ID da região (region ID) configurada no Marketing Cloud. Essa função é usada exclusivamente em **landing pages** ou no recurso **Social Forward**, que permite que assinantes compartilhem conteúdo de e-mails nas redes sociais. No contexto brasileiro, é útil quando você quer que o destinatário de uma campanha - por exemplo, uma promoção da MegaStore - compartilhe ofertas diretamente no Facebook ou Twitter a partir de uma landing page.

## Sintaxe

```ampscript
GetPublishedSocialContent(regionId)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| regionId | String | Sim | O ID da região (region ID) que identifica a área de conteúdo social configurada no Marketing Cloud. |

## Exemplo básico

Recuperando o conteúdo social de uma região configurada para uma campanha de compartilhamento da Lojas Vitória.

```ampscript
%%=GetPublishedSocialContent("SocialRegion")=%%
```

**Saída:**
```
[Conteúdo HTML/texto configurado na região "SocialRegion" para compartilhamento social]
```

## Exemplo avançado

Em uma landing page de campanha promocional da MegaStore, você pode recuperar o conteúdo social e combiná-lo com informações dinâmicas para personalizar a experiência de compartilhamento.

```ampscript
%%[
  VAR @conteudoSocial, @nomeCliente

  SET @nomeCliente = AttributeValue("PrimeiroNome")
  SET @conteudoSocial = GetPublishedSocialContent("PromoVeraoRegion")
]%%

<h2>Olá, %%=v(@nomeCliente)=%%!</h2>
<p>Compartilhe esta oferta com seus amigos:</p>
%%=v(@conteudoSocial)=%%
```

**Saída:**
```
Olá, Maria!
Compartilhe esta oferta com seus amigos:
[Conteúdo da região "PromoVeraoRegion" renderizado para compartilhamento social]
```

## Observações

> **⚠️ Atenção:** Esta função é para uso **exclusivamente em landing pages ou no recurso Social Forward**. Não utilize em e-mails enviados diretamente ou em CloudPages fora desse contexto - ela depende da infraestrutura de publicação social do Marketing Cloud para funcionar corretamente.

- O valor de `regionId` deve corresponder exatamente ao ID da região de conteúdo social configurada na sua conta. Verifique a grafia e o case do ID antes de publicar.
- O conteúdo retornado é aquele que foi previamente configurado e publicado na área de conteúdo social referenciada pelo region ID.

## Funções relacionadas

- [GetSocialPublishUrl](../social-functions/getsocialpublishurl.md) - retorna a URL de publicação social para uma rede específica.
- [GetSocialPublishUrlByName](../social-functions/getsocialpublishurlbyname.md) - retorna a URL de publicação social usando o nome da rede.
- [ContentBlockByName](../content-functions/contentblockbyname.md) - para recuperar blocos de conteúdo por nome quando precisar de conteúdo dinâmico em outros contextos.
- [RedirectTo](../http-functions/redirectto.md) - útil para redirecionar o usuário após interação na landing page social.