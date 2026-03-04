---
title: Image
sidebar_label: Image
description: Retorna uma tag img HTML a partir da external key de uma imagem no Portfolio do SFMC, com suporte a imagem de fallback.
---

# Image

## Descrição

A função `Image` gera uma tag `<img>` completa a partir de uma imagem armazenada no Portfolio (Content Builder) do Marketing Cloud, usando a **external key** como referência. A tag retornada já inclui os atributos `src`, `title`, `alt`, `border="0"` e um atributo `thid` com o ID interno da imagem. É muito útil para montar e-mails dinâmicos onde as imagens podem variar por segmento ou campanha, e você ainda pode definir uma imagem de fallback caso a principal não seja encontrada.

## Sintaxe

```ampscript
Image(imageExternalKey [, defaultImageExternalKey])
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| imageExternalKey | string | Sim | A external key da imagem no Portfolio que você quer exibir. |
| defaultImageExternalKey | string | Não | A external key de uma imagem de fallback no Portfolio. Usada caso a imagem do primeiro parâmetro não seja encontrada. |

## Exemplo básico

Exibindo o banner principal de uma campanha de e-mail da MegaStore:

```ampscript
%%=Image("banner-inverno-2024")=%%
```

**Saída:**
```html
<img src="https://image.s11.sfmc-content.com/lib/fe3a.../banner-inverno-2024.jpg" title="Promoção de Inverno 2024" alt="Promoção de Inverno 2024" border="0" thid="12345" />
```

## Exemplo avançado

Em uma régua de relacionamento da Lojas Vitória, o banner muda conforme a categoria preferida do cliente. Se a imagem da categoria não existir no Portfolio, um banner genérico é exibido como fallback:

```ampscript
%%[
  SET @categoriaPreferida = AttributeValue("CategoriaPreferida")
  SET @chaveImagem = Concat("banner-categoria-", Lowercase(@categoriaPreferida))
  SET @chaveFallback = "banner-generico-lojasvitoria"
]%%

%%=Image(@chaveImagem, @chaveFallback)=%%
```

**Saída (quando a categoria é "Eletrônicos" e a imagem existe):**
```html
<img src="https://image.s11.sfmc-content.com/lib/fe3a.../banner-categoria-eletronicos.jpg" title="Eletrônicos - Lojas Vitória" alt="Eletrônicos - Lojas Vitória" border="0" thid="67890" />
```

**Saída (quando a imagem da categoria não é encontrada):**
```html
<img src="https://image.s11.sfmc-content.com/lib/fe3a.../banner-generico-lojasvitoria.jpg" title="Lojas Vitória" alt="Lojas Vitória" border="0" thid="11111" />
```

## Observações

> **💡 Dica:** Sempre defina o segundo parâmetro (imagem de fallback) em cenários dinâmicos. Se a external key do primeiro parâmetro estiver errada ou a imagem tiver sido removida do Portfolio, o fallback garante que seu e-mail não fique com imagem quebrada.

> **⚠️ Atenção:** A função busca a imagem pela **external key** no Portfolio. Certifique-se de que suas imagens tenham external keys bem definidas e padronizadas — isso facilita muito a montagem de chaves dinâmicas com [Concat](../string-functions/concat.md). Se você não definir uma external key ao fazer upload, o SFMC pode gerar uma automaticamente que não é intuitiva.

- Os atributos `title` e `alt` da tag `<img>` retornada são preenchidos automaticamente com as informações cadastradas na imagem dentro do Portfolio.
- O atributo `border` é sempre definido como `0`.
- O atributo `thid` contém o ID interno da imagem no Portfolio.

## Funções relacionadas

- [ImageById](../content-functions/imagebyid.md) — busca a imagem pelo ID numérico em vez da external key.
- [ImageByKey](../content-functions/imagebykey.md) — outra forma de buscar imagem por key no Portfolio.
- [ContentImageById](../content-functions/contentimagebyid.md) — retorna imagem do Content Builder pelo ID.
- [ContentImageByKey](../content-functions/contentimagebykey.md) — retorna imagem do Content Builder pela key.
- [Concat](../string-functions/concat.md) — útil para montar external keys dinâmicas.
- [Lowercase](../string-functions/lowercase.md) — para normalizar valores antes de compor a key da imagem.
- [AttributeValue](../utility-functions/attributevalue.md) — para capturar dados do assinante de forma segura.