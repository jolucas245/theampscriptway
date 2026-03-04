---
title: TreatAsContentArea
sidebar_label: TreatAsContentArea
description: Trata conteúdo recuperado de uma Data Extension ou outra fonte como se fosse uma Content Area fixa, permitindo reuso e rastreamento via Impression Regions.
---

# TreatAsContentArea

## Descrição

A função `TreatAsContentArea` pega um conteúdo que você buscou de uma Data Extension (ou outra fonte) e faz o SFMC tratá-lo como se fosse uma Content Area nativa — uma "Content Area virtual". Isso é muito útil quando você monta conteúdo dinâmico a partir de dados externos e precisa que ele seja rastreável via Impression Regions, ou quando quer reutilizar blocos de conteúdo identificados por uma chave. É bastante comum em cenários de e-mail marketing onde diferentes versões de conteúdo (texto e HTML) são armazenadas em Data Extensions e precisam ser renderizadas no momento do envio.

## Sintaxe

```ampscript
TreatAsContentArea(contentKey, contentValue [, impressionRegion])
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| contentKey | string | Sim | Chave que identifica o conteúdo. A função trata uma chave em contexto de texto como distinta de uma chave em contexto HTML — ou seja, você pode usar a mesma chave para identificar versões distintas de texto e HTML do conteúdo. O processamento das chaves é case-insensitive. |
| contentValue | string | Sim | O conteúdo a ser armazenado para o envio do e-mail sob a chave especificada. Para recuperar esse conteúdo, use as funções `HTTPGet()` ou `Lookup()`. |
| impressionRegion | string | Não | Nome da Impression Region para a Content Area virtual. O número máximo de blocos de conteúdo virtual é 300. |

## Exemplo básico

Buscando o conteúdo de um banner promocional em uma Data Extension e salvando como Content Area virtual para reuso no e-mail:

```ampscript
%%[
SET @conteudoBanner = Lookup("ConteudoEmail", "HtmlBanner", "Campanha", "BlackFriday2024")
TreatAsContentArea("BannerPromo", @conteudoBanner)
]%%
```

**Saída:**
```
O conteúdo HTML armazenado no campo "HtmlBanner" da Data Extension "ConteudoEmail"
(filtrado pela campanha "BlackFriday2024") é renderizado como uma Content Area
virtual identificada pela chave "BannerPromo".
```

## Exemplo avançado

Cenário de régua de relacionamento onde cada cliente recebe um bloco de conteúdo personalizado baseado no seu segmento, com rastreamento via Impression Region para medir performance de cada variação:

```ampscript
%%[
SET @email = AttributeValue("EmailAddress")
SET @segmento = Lookup("Clientes_Segmentacao", "Segmento", "Email", @email)

IF @segmento == "Premium" THEN
  SET @chaveConteudo = "OfertaPremium"
  SET @htmlOferta = Lookup("ConteudoCampanhas", "HtmlBloco", "Segmento", "Premium")
  SET @nomeImpressao = "Oferta Premium"
ELSEIF @segmento == "Recorrente" THEN
  SET @chaveConteudo = "OfertaRecorrente"
  SET @htmlOferta = Lookup("ConteudoCampanhas", "HtmlBloco", "Segmento", "Recorrente")
  SET @nomeImpressao = "Oferta Recorrente"
ELSE
  SET @chaveConteudo = "OfertaGeral"
  SET @htmlOferta = Lookup("ConteudoCampanhas", "HtmlBloco", "Segmento", "Geral")
  SET @nomeImpressao = "Oferta Geral"
ENDIF

TreatAsContentArea(@chaveConteudo, @htmlOferta, @nomeImpressao)
]%%
```

**Saída:**
```
Para um cliente Premium, o bloco HTML da oferta premium é renderizado
e rastreado na Impression Region "Oferta Premium".
Para um cliente do segmento Geral, o bloco genérico é renderizado
e rastreado na Impression Region "Oferta Geral".
```

## Observações

> **⚠️ Atenção:** Sempre sanitize a entrada do usuário dentro de um bloco `TreatAsContentArea()`. Remova, escape ou bloqueie conteúdo que contenha tags HTML ou código AMPscript. Uma abordagem segura é usar uma allowlist de caracteres permitidos. Isso é crítico — como o conteúdo é tratado como Content Area, qualquer código AMPscript ou HTML malicioso inserido será processado e renderizado.

> **⚠️ Atenção:** O número máximo de blocos de conteúdo virtual (Content Areas virtuais) é **300** por envio. Se você estiver montando e-mails altamente dinâmicos com muitas variações, fique de olho nesse limite.

> **💡 Dica:** A função trata chaves de forma **case-insensitive** — ou seja, `"BannerPromo"`, `"bannerpromo"` e `"BANNERPROMO"` são a mesma chave. Porém, uma chave usada em contexto de texto é considerada distinta da mesma chave usada em contexto HTML. Isso significa que você pode usar a mesma chave para mapear a versão texto puro e a versão HTML do mesmo conteúdo sem conflito.

> **💡 Dica:** Para buscar o conteúdo que será passado como `contentValue`, use [`Lookup()`](../data-extension-functions/lookup.md) para Data Extensions ou [`HTTPGet()`](../http-functions/httpget.md) para fontes externas.

## Funções relacionadas

- [`TreatAsContent`](../utility-functions/treatascontent.md) — renderiza uma string como conteúdo AMPscript/HTML, mas sem criar uma Content Area virtual com chave e Impression Region
- [`Lookup`](../data-extension-functions/lookup.md) — para buscar o conteúdo em uma Data Extension antes de passá-lo para `TreatAsContentArea`
- [`HTTPGet`](../http-functions/httpget.md) — para buscar conteúdo de uma URL externa
- [`ContentArea`](../content-functions/contentarea.md) — para referenciar Content Areas reais (não virtuais)
- [`ContentBlockByKey`](../content-functions/contentblockbykey.md) — para incluir Content Blocks por chave
- [`BeginImpressionRegion`](../content-functions/beginimpressionregion.md) / [`EndImpressionRegion`](../content-functions/endimpressionregion.md) — para criar Impression Regions manualmente em torno de blocos de conteúdo