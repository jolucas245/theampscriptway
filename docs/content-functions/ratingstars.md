---
title: RatingStars
sidebar_label: RatingStars
description: Gera uma imagem de estrelas de avaliação com base na nota de um produto recomendado, tipicamente usada com Einstein Email Recommendations.
---

# RatingStars

## Descrição

A função `RatingStars` gera uma imagem de estrelas de avaliação baseada no atributo de rating de um produto recomendado. Ela é tipicamente utilizada dentro de blocos de código do **Einstein Email Recommendations** para exibir visualmente a nota de produtos em e-mails. O retorno é um elemento `<img>` com o atributo `src` apontando para a URL da imagem gerada.

## Sintaxe

```ampscript
RatingStars(highestRanking, starColor, starSize)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| highestRanking | Número | Sim | A nota máxima (ranking mais alto) a ser exibida em estrelas. |
| starColor | String | Sim | Cor das estrelas, informada como código hexadecimal HTML ou nome de cor em inglês (ex: `"yellow"`, `"#FFD700"`). |
| starSize | Número | Sim | Tamanho (largura e altura) de cada estrela em pixels. |

## Exemplo básico

Exibindo estrelas de avaliação amarelas para um produto da MegaStore com nota máxima 5:

```ampscript
%%=RatingStars(5, "yellow", 25)=%%
```

**Saída:**
```html
<img src="[URL da imagem gerada com 5 estrelas amarelas de 25px]" />
```

## Exemplo avançado

Em um e-mail de recomendações da Lojas Vitória, exibindo a avaliação de um produto com estrelas douradas maiores, combinando com o nome do produto via [Concat](../string-functions/concat.md):

```ampscript
%%[
VAR @nomeProduto, @nota, @htmlEstrelas

SET @nomeProduto = "Cafeteira Elétrica Premium"
SET @nota = 5
SET @htmlEstrelas = RatingStars(@nota, "#FFD700", 30)
]%%

<div style="font-family: Arial, sans-serif;">
  <p style="font-size: 16px; color: #333;">%%=v(@nomeProduto)=%%</p>
  <p>Avaliação: %%=v(@htmlEstrelas)=%%</p>
  <p style="font-size: 12px; color: #666;">
    %%=Concat("Nota: ", @nota, " de 5")=%%
  </p>
</div>
```

**Saída:**
```html
<div style="font-family: Arial, sans-serif;">
  <p style="font-size: 16px; color: #333;">Cafeteira Elétrica Premium</p>
  <p>Avaliação: <img src="[URL da imagem gerada com 5 estrelas douradas de 30px]" /></p>
  <p style="font-size: 12px; color: #666;">
    Nota: 5 de 5
  </p>
</div>
```

## Observações

> **⚠️ Atenção:** A função `RatingStars` é tipicamente utilizada dentro de blocos de código do **Einstein Email Recommendations**. Fora desse contexto, o comportamento pode não funcionar como esperado, já que ela depende do atributo de rating do produto recomendado.

- O retorno da função é um elemento HTML `<img>` completo, com o `src` apontando para a URL da imagem gerada. Você não precisa montar a tag manualmente.
- Para a cor, você pode usar tanto nomes de cor em inglês (`"yellow"`, `"red"`) quanto códigos hexadecimais HTML (`"#FFD700"`).
- O valor de `starSize` define tanto a largura quanto a altura de cada estrela em pixels — escolha um tamanho que se encaixe bem no layout do seu template de e-mail.

## Funções relacionadas

- [Image](../content-functions/image.md) — para inserir outras imagens no conteúdo
- [Concat](../string-functions/concat.md) — para combinar texto com a saída das estrelas
- [V](../utility-functions/v.md) — para exibir variáveis no HTML
- [BeginImpressionRegion](../content-functions/beginimpressionregion.md) — para rastrear impressões em blocos de recomendação