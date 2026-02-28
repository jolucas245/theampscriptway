---
title: WATP
sidebar_label: WATP
description: Exibe conteúdo de um portfólio do Marketing Cloud em uma página web com rastreamento de impressões e parâmetros adicionais.
---

<!-- generated-by-script -->

# WATP

## Descrição

A função `WATP` (Web Analytics Tracking with Parameters) é usada para exibir conteúdo de portfólio (como imagens ou arquivos) hospedado no Salesforce Marketing Cloud em páginas web, adicionando rastreamento de web analytics junto com parâmetros personalizados. Ela funciona de forma similar à função [WAT](../content-functions/wat.md), mas com a capacidade extra de passar parâmetros adicionais na URL de rastreamento. Essa função é útil quando você precisa rastrear impressões de conteúdo em MicroSites ou Landing Pages e quer incluir informações extras para segmentação ou análise.

> **Nota:** A documentação oficial da Salesforce para esta função não está disponível (retorna erro 404). As informações abaixo são baseadas no comportamento conhecido da função dentro do ecossistema SFMC e em sua relação com a função WAT. Use com cautela e teste em ambiente de desenvolvimento antes de aplicar em produção.

## Sintaxe

```ampscript
WATP(conteudo, parametros)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| conteudo | String | Sim | O nome ou referência do item de portfólio (conteúdo) a ser exibido com rastreamento |
| parametros | String | Sim | Parâmetros adicionais a serem anexados à URL de rastreamento no formato de query string |

## Exemplo básico

```ampscript
%%=WATP("banner_natal_2024", "campanha=natal&categoria=eletronicos")=%%
```

**Saída:**
```
[Exibe o conteúdo do portfólio "banner_natal_2024" com rastreamento de web analytics e os parâmetros campanha=natal&categoria=eletronicos anexados à URL]
```

## Exemplo avançado

```ampscript
%%[
VAR @nomeAssinante, @segmento, @parametros

SET @nomeAssinante = AttributeValue("NomeCompleto")
SET @segmento = Lookup("SegmentosClientes", "Segmento", "Email", EmailAddress)

IF @segmento == "VIP" THEN
  SET @parametros = Concat("segmento=vip&origem=email&cliente=", URLEncode(@nomeAssinante))
ELSE
  SET @parametros = Concat("segmento=regular&origem=email&cliente=", URLEncode(@nomeAssinante))
ENDIF
]%%

<!-- Banner promocional Black Friday - Lojas Vitória -->
%%=WATP("banner_blackfriday_lojasvitoria", @parametros)=%%

%%[
/* Exemplo com conteúdo condicional para campanha de Dia das Mães */
IF @segmento == "VIP" THEN
]%%
  %%=WATP("diamaes_oferta_premium", "tipo=premium&desconto=30&frete=gratis")=%%
%%[ ELSE ]%%
  %%=WATP("diamaes_oferta_padrao", "tipo=padrao&desconto=15")=%%
%%[ ENDIF ]%%
```

**Saída:**
```
[Para cliente VIP: Exibe o banner de Black Friday com parâmetros segmento=vip&origem=email&cliente=Jo%C3%A3o%20Silva e depois o banner premium do Dia das Mães com parâmetros tipo=premium&desconto=30&frete=gratis]

[Para cliente regular: Exibe o banner de Black Friday com parâmetros segmento=regular&origem=email&cliente=Maria%20Santos e depois o banner padrão do Dia das Mães com parâmetros tipo=padrao&desconto=15]
```

## Observações

- ⚠️ **Documentação oficial indisponível:** A página oficial da Salesforce para esta função retorna erro 404. Isso pode indicar que a função está **depreciada** ou que foi removida da documentação pública. Recomenda-se testar antes de usar em produção.
- A função `WATP` é uma extensão da função [WAT](../content-functions/wat.md), adicionando suporte a parâmetros customizados.
- Essa função é mais relevante no contexto de **MicroSites e Landing Pages** do Marketing Cloud. Em CloudPages mais modernas, considere usar abordagens alternativas.
- Os parâmetros são úteis para integração com ferramentas de web analytics (como Google Analytics) ou para rastreamento interno de campanhas.
- Use [URLEncode](../string-functions/urlencode.md) para codificar valores de parâmetros que possam conter caracteres especiais (acentos, espaços, etc.).
- Se o item de portfólio referenciado não existir, a função pode retornar vazio ou gerar erro — sempre valide o conteúdo antes.
- O rastreamento de impressões depende da configuração de web analytics na sua conta do Marketing Cloud.

## Funções relacionadas

- [WAT](../content-functions/wat.md) — Exibe conteúdo de portfólio com rastreamento de web analytics, sem parâmetros adicionais
- [GetPortfolioItem](../content-functions/getportfolioitem.md) — Recupera um item do portfólio do Marketing Cloud
- [ContentBlockByName](../content-functions/contentblockbyname.md) — Inclui um bloco de conteúdo pelo nome
- [ContentBlockByKey](../content-functions/contentblockbykey.md) — Inclui um bloco de conteúdo pela chave externa
- [Image](../content-functions/image.md) — Exibe uma imagem do portfólio
- [URLEncode](../string-functions/urlencode.md) — Codifica strings para uso seguro em URLs
- [Concat](../string-functions/concat.md) — Concatena strings, útil para montar parâmetros dinamicamente
- [CloudPagesURL](../sites-functions/cloudpagesurl.md) — Gera URLs para CloudPages com parâmetros criptografados
- [MicrositeURL](../sites-functions/micrositeurl.md) — Gera URLs para MicroSites com rastreamento