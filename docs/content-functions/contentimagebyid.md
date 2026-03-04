---
title: ContentImageById
sidebar_label: ContentImageById
description: Retorna uma tag img completa a partir do ID de uma imagem armazenada no Content Builder, com suporte a imagem fallback.
---

# ContentImageById

## Descrição

Retorna uma tag `<img>` completa cujo atributo `src` aponta para uma imagem do Content Builder, identificada pelo seu ID. A tag gerada já inclui os atributos `title`, `alt`, `border="0"` e um `thid` com o ID interno da imagem. É muito útil quando você precisa inserir imagens dinâmicas em e-mails — como banners de campanha, logos de parceiros ou imagens de produtos — garantindo que, se a imagem principal não for encontrada, um fallback será exibido no lugar.

## Sintaxe

```ampscript
ContentImageById(imageExternalId, defaultImageExternalId)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| imageExternalId | String | Sim | O ID da imagem no Content Builder que você deseja exibir. |
| defaultImageExternalId | String | Sim | O ID de uma imagem fallback no Content Builder. Será usada caso a imagem do primeiro parâmetro não seja encontrada. |

## Exemplo básico

Exibindo o banner principal de uma campanha da MegaStore, com um banner genérico como fallback caso o banner da campanha seja removido do Content Builder.

```ampscript
%%[
VAR @bannerCampanha
SET @bannerCampanha = ContentImageById("38201", "10050")
]%%

%%=v(@bannerCampanha)=%%
```

**Saída:**
```html
<img src="https://image.s11.sfmc-content.com/lib/fe3a/m/1/banner-megastore-verao.jpg" alt="Promoção de Verão MegaStore" title="Promoção de Verão MegaStore" border="0" thid="38201" />
```

## Exemplo avançado

Em uma régua de relacionamento da Lojas Vitória, cada categoria de produto tem um banner próprio armazenado no Content Builder. O ID do banner vem de uma Data Extension. Se o banner da categoria não existir mais, um banner institucional padrão é exibido. Além disso, extraímos apenas a URL da imagem com [RegExMatch](../string-functions/regexmatch.md) para usar como background em uma `<td>`.

```ampscript
%%[
VAR @categoriaBannerId, @bannerFallbackId, @imgTag, @imgUrl

SET @categoriaBannerId = Lookup("DE_Categorias", "BannerContentId", "CategoriaId", "CAT-042")
SET @bannerFallbackId = "10050"

SET @imgTag = ContentImageById(@categoriaBannerId, @bannerFallbackId)

/* Extraindo apenas a URL do src para uso como background */
SET @imgUrl = RegExMatch(@imgTag, 'src="([^"]+)"', 1)
]%%

<!-- Usando a tag img completa -->
<div class="hero-banner">
  %%=v(@imgTag)=%%
</div>

<!-- Usando apenas a URL como background -->
<table role="presentation" width="600">
  <tr>
    <td background="%%=v(@imgUrl)=%%" style="background-size:cover; height:300px;">
      <h1 style="color:#fff; padding:20px;">Ofertas Lojas Vitória</h1>
    </td>
  </tr>
</table>
```

**Saída:**
```html
<!-- Usando a tag img completa -->
<div class="hero-banner">
  <img src="https://image.s11.sfmc-content.com/lib/fe3a/m/1/banner-cat042-eletro.jpg" alt="Eletrônicos Lojas Vitória" title="Eletrônicos Lojas Vitória" border="0" thid="72415" />
</div>

<!-- Usando apenas a URL como background -->
<table role="presentation" width="600">
  <tr>
    <td background="https://image.s11.sfmc-content.com/lib/fe3a/m/1/banner-cat042-eletro.jpg" style="background-size:cover; height:300px;">
      <h1 style="color:#fff; padding:20px;">Ofertas Lojas Vitória</h1>
    </td>
  </tr>
</table>
```

## Observações

> **⚠️ Atenção:** Essa função funciona **exclusivamente com imagens no Content Builder**. Ela não funciona com blocos de imagem (image blocks). Se você tem conteúdo organizado em blocos, considere usar [ContentBlockById](../content-functions/contentblockbyid.md) em vez desta função.

> **💡 Dica:** Se você precisa apenas da URL da imagem (e não da tag `<img>` completa), use [RegExMatch](../string-functions/regexmatch.md) para extrair o valor do atributo `src` do HTML retornado, como demonstrado no exemplo avançado.

> **💡 Dica:** O segundo parâmetro (fallback) é obrigatório, então sempre tenha uma imagem padrão cadastrada no Content Builder para servir como reserva. Isso é especialmente importante em réguas automatizadas de longo prazo, onde imagens de campanhas antigas podem ser excluídas do Content Builder com o tempo.

## Funções relacionadas

- [ContentImageByKey](../content-functions/contentimagebykey.md) — mesma função, mas usando a External Key da imagem em vez do ID
- [ImageById](../content-functions/imagebyid.md) — retorna uma tag `<img>` a partir do ID de uma imagem no portfólio clássico
- [ContentBlockById](../content-functions/contentblockbyid.md) — retorna o conteúdo de um bloco do Content Builder pelo ID
- [RegExMatch](../string-functions/regexmatch.md) — útil para extrair apenas a URL do `src` da tag retornada
- [Image](../content-functions/image.md) — retorna uma tag `<img>` a partir do portfólio clássico