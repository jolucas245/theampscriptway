---
title: ImageById
sidebar_label: ImageById
description: Retorna uma tag img com o caminho de uma imagem do Content Builder a partir do seu ID, com suporte a imagem fallback.
---

# ImageById

## Descrição

A função `ContentImageById` retorna uma tag `<img>` completa apontando para uma imagem armazenada no Content Builder, localizada pelo seu ID. A tag gerada já inclui os atributos `title`, `alt`, `border="0"` e um `thid` com o ID da imagem. É muito útil quando você precisa inserir imagens dinâmicas em e-mails - por exemplo, banners personalizados por segmento ou imagens de produtos - e quer garantir que, se a imagem principal não for encontrada, um fallback seja exibido automaticamente.

> **⚠️ Atenção:** Essa função funciona **apenas com imagens no Content Builder**. Ela não funciona com blocos de imagem (image blocks).

## Sintaxe

```ampscript
ContentImageById(imageExternalId, defaultImageExternalId)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| imageExternalId | string | Sim | O ID da imagem no Content Builder que você deseja exibir. |
| defaultImageExternalId | string | Sim | O ID de uma imagem fallback no Content Builder. Será usada caso a imagem do primeiro parâmetro não seja encontrada. |

## Exemplo básico

Exibindo o banner principal de uma campanha promocional da MegaStore, com um banner genérico como fallback:

```ampscript
%%[
VAR @bannerCampanha
SET @bannerCampanha = ContentImageById("38274", "10001")
]%%

%%=v(@bannerCampanha)=%%
```

**Saída:**
```html
<img src="https://image.s11.sfmc-content.com/lib/fe3a/m/1/megastore-blackfriday-2024.jpg" alt="Promoção Black Friday MegaStore" title="Promoção Black Friday MegaStore" border="0" thid="38274" />
```

## Exemplo avançado

Em uma régua de relacionamento da Lojas Vitória, cada segmento de cliente recebe um banner diferente. O ID da imagem vem de uma Data Extension. Caso o registro não tenha um ID válido, o fallback garante que o e-mail não quebre. Além disso, usamos [RegExMatch](../string-functions/regexmatch.md) para extrair apenas a URL da imagem quando precisamos dela isolada (por exemplo, para usar como background em CSS inline).

```ampscript
%%[
VAR @idBanner, @idBannerFallback, @tagImagem, @urlImagem

SET @idBanner = Lookup("BannersPorSegmento", "ImagemId", "Segmento", "premium")
SET @idBannerFallback = "50001"

/* Gera a tag <img> completa */
SET @tagImagem = ContentImageById(@idBanner, @idBannerFallback)

/* Extrai apenas a URL do atributo src */
SET @urlImagem = RegExMatch(@tagImagem, 'src="([^"]+)"', 1)
]%%

<!-- Usando a tag completa -->
<div class="hero-banner">
  %%=v(@tagImagem)=%%
</div>

<!-- Usando só a URL como background -->
<table width="600" style="background-image: url('%%=v(@urlImagem)=%%');">
  <tr>
    <td style="padding: 40px; color: #ffffff; font-size: 24px;">
      Olá, aproveite as ofertas exclusivas para clientes Premium!
    </td>
  </tr>
</table>
```

**Saída:**
```html
<!-- Usando a tag completa -->
<div class="hero-banner">
  <img src="https://image.s11.sfmc-content.com/lib/fe3a/m/1/lojas-vitoria-premium.jpg" alt="Banner Premium Lojas Vitória" title="Banner Premium Lojas Vitória" border="0" thid="72035" />
</div>

<!-- Usando só a URL como background -->
<table width="600" style="background-image: url('https://image.s11.sfmc-content.com/lib/fe3a/m/1/lojas-vitoria-premium.jpg');">
  <tr>
    <td style="padding: 40px; color: #ffffff; font-size: 24px;">
      Olá, aproveite as ofertas exclusivas para clientes Premium!
    </td>
  </tr>
</table>
```

## Observações

- A função retorna uma tag `<img>` completa, não apenas a URL. Se você precisar **somente da URL**, use a função [RegExMatch](../string-functions/regexmatch.md) para extrair o valor do atributo `src`.
- A tag gerada inclui automaticamente os atributos `title`, `alt`, `border="0"` e `thid` (com o ID da imagem).
- O segundo parâmetro (imagem fallback) é **obrigatório**. Se a função não encontrar a imagem do primeiro parâmetro, ela retorna a tag `<img>` apontando para a imagem fallback.

> **⚠️ Atenção:** Essa função funciona **exclusivamente com imagens no Content Builder**. Não funciona com blocos de imagem (image blocks). Se você trabalha com imagens no Portfolio/Classic, considere outras abordagens.

> **💡 Dica:** Mantenha uma imagem genérica padrão no Content Builder (como o logo da sua marca) para usar sempre como fallback. Assim, mesmo que algum ID de imagem esteja incorreto ou desatualizado, o e-mail nunca vai renderizar quebrado.

## Funções relacionadas

- [ContentImageByKey](../content-functions/contentimagebykey.md) - mesma funcionalidade, mas localiza a imagem pela Customer Key em vez do ID.
- [Image](../content-functions/image.md) - para trabalhar com imagens usando referências do Portfolio clássico.
- [RegExMatch](../string-functions/regexmatch.md) - útil para extrair apenas a URL do `src` a partir da tag `<img>` retornada.
- [ContentBlockById](../content-functions/contentblockbyid.md) - para inserir blocos de conteúdo completos do Content Builder por ID.