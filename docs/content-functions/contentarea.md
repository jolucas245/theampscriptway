---
title: ContentArea
sidebar_label: ContentArea
description: Retorna conteúdo de uma classic content area (função descontinuada — use ContentBlockById no lugar).
---

# ContentArea

## Descrição

A função `ContentArea` recupera conteúdo de uma **classic content area** pelo seu ID. No entanto, as classic content areas **não são mais suportadas** no Marketing Cloud Engagement, o que significa que essa função não recupera mais nenhum conteúdo e **não deve ser usada**. A documentação é mantida apenas para fins históricos. Para recuperar blocos de conteúdo criados no Content Builder, utilize a função [ContentBlockById](../content-functions/contentblockbyid.md).

## Sintaxe

```ampscript
ContentArea(contentAreaId, impressionRegionName, boolErrorOnMissingContentArea, errorMessage, statusCode)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| contentAreaId | string ou number | Sim | O ID da content area a ser recuperada. |
| impressionRegionName | string | Não | Nome da impression region a ser associada à content area. |
| boolErrorOnMissingContentArea | boolean | Não | Define se a função retorna erro quando não encontra a content area ou quando ela é inválida. O valor `true` retorna erro. O padrão é `true`. |
| errorMessage | string | Não | Conteúdo padrão a ser retornado caso ocorra um erro. O padrão é uma string vazia. |
| statusCode | number | Não | Variável de saída que contém o código de retorno da função. `0` indica que a content area foi encontrada e o conteúdo renderizado com sucesso. `-1` indica que não há conteúdo ou a content area é inválida. |

## Exemplo básico

Recuperando uma content area pelo ID para exibir um banner promocional da MegaStore:

```ampscript
%%[
/* ATENÇÃO: função descontinuada — use ContentBlockById() */
]%%
%%=ContentArea("12345")=%%
```

**Saída:**
```
(sem conteúdo — classic content areas não são mais suportadas)
```

## Exemplo avançado

Tentativa de recuperação com tratamento de erro e variável de status — cenário de régua de relacionamento da Lojas Vitória com conteúdo de fallback:

```ampscript
%%[
/* ATENÇÃO: função descontinuada — use ContentBlockById() */
VAR @statusCode
SET @conteudo = ContentArea(
  "67890",
  "banner_principal",
  false,
  "<p>Confira nossas ofertas em lojasvitoria.com.br</p>",
  @statusCode
)

IF @statusCode == -1 THEN
  /* Content area não encontrada — exibe mensagem alternativa */
  SET @conteudo = "<p>Visite lojasvitoria.com.br para ver nossas promoções!</p>"
ENDIF
]%%
%%=v(@conteudo)=%%
```

**Saída:**
```
<p>Visite lojasvitoria.com.br para ver nossas promoções!</p>
```

## Observações

> **⚠️ Atenção:** As classic content areas **não são mais suportadas** no Marketing Cloud Engagement. Isso significa que a função `ContentArea` **não recupera nenhum conteúdo** atualmente. Não use essa função em implementações novas.

- O parâmetro `statusCode` é uma **variável de saída** — você passa uma variável que será preenchida pela função com o código de retorno (`0` para sucesso, `-1` para erro ou conteúdo inexistente).
- Quando `boolErrorOnMissingContentArea` é `true` (padrão), a função retorna erro se a content area não for encontrada. Se for `false`, retorna o valor de `errorMessage` em vez de gerar erro.
- Para qualquer necessidade de conteúdo reutilizável, migre para blocos do **Content Builder** e utilize [ContentBlockById](../content-functions/contentblockbyid.md), [ContentBlockByName](../content-functions/contentblockbyname.md) ou [ContentBlockByKey](../content-functions/contentblockbykey.md).

> **💡 Dica:** Se você encontrou essa função em templates legados da sua conta, substitua por `ContentBlockById()` e localize o ID correspondente no Content Builder. Isso garante que o conteúdo será renderizado corretamente.

## Funções relacionadas

- [ContentBlockById](../content-functions/contentblockbyid.md) — **substituta recomendada**, recupera blocos de conteúdo do Content Builder pelo ID
- [ContentBlockByName](../content-functions/contentblockbyname.md) — recupera blocos do Content Builder pelo nome
- [ContentBlockByKey](../content-functions/contentblockbykey.md) — recupera blocos do Content Builder pela customer key
- [ContentAreaByName](../content-functions/contentareabyname.md) — versão por nome (descontinuada)
- [TreatAsContentArea](../content-functions/treatascontentarea.md) — trata string como content area
- [BeginImpressionRegion](../content-functions/beginimpressionregion.md) — inicia uma impression region
- [EndImpressionRegion](../content-functions/endimpressionregion.md) — encerra uma impression region