---
title: ContentAreaByName
sidebar_label: ContentAreaByName
description: Retorna conteúdo de uma classic content area pelo nome — função descontinuada que não deve mais ser utilizada.
---

<!-- generated-by-script -->

# ContentAreaByName

## Descrição

A função `ContentAreaByName()` foi criada para recuperar conteúdo de uma **classic content area** (área de conteúdo clássica) pelo seu nome. Porém, as classic content areas **não são mais suportadas** no Marketing Cloud Engagement, então essa função **não recupera mais nenhum conteúdo** e **não deve ser usada**. Essa documentação existe apenas para referência histórica. Se você precisa recuperar blocos de conteúdo criados no **Content Builder**, use a função [`ContentBlockByName()`](../content-functions/contentblockbyname.md).

## Sintaxe

```ampscript
ContentAreaByName(contentAreaName, impressionRegionName, boolErrorOnMissingContentArea, errorMessage, statusCode)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| contentAreaName | String | Sim | O nome da content area clássica que você quer recuperar. |
| impressionRegionName | String | Não | O nome da impression region a ser associada à content area. |
| boolErrorOnMissingContentArea | Boolean | Não | Se `true`, a função retorna um erro caso a content area não seja encontrada. Se `false`, não retorna erro. O valor padrão é `true`. |
| errorMessage | String | Não | O conteúdo a ser retornado caso ocorra um erro ao recuperar a content area. |
| statusCode | Número | Não | Variável de saída que recebe o código de status da função. `0` indica que a content area foi encontrada e o conteúdo renderizado com sucesso. `-1` indica que não há conteúdo ou que a content area é inválida. |

## Exemplo básico

> ⚠️ **Atenção:** Os exemplos abaixo são apenas para referência histórica. Essa função **não funciona mais** no Marketing Cloud. Use [`ContentBlockByName()`](../content-functions/contentblockbyname.md) no lugar.

```ampscript
%%=ContentAreaByName("banner_natal_2024")=%%
```

**Saída:**
```
(Nenhum conteúdo retornado — função descontinuada)
```

## Exemplo avançado

Este exemplo mostra como a função era usada com tratamento de erro e variável de status — novamente, apenas para fins históricos:

```ampscript
%%[
VAR @statusCode
VAR @conteudo

SET @conteudo = ContentAreaByName(
  "promo_black_friday_megastore",
  "hero_banner",
  false,
  "<p>Ops! Não foi possível carregar o banner promocional.</p>",
  @statusCode
)

IF @statusCode == 0 THEN
]%%

%%=v(@conteudo)=%%

%%[ ELSE ]%%

<p>Confira nossas ofertas de Black Friday em <a href="https://www.megastore.com.br/black-friday">www.megastore.com.br</a></p>

%%[ ENDIF ]%%
```

**Saída:**
```
Confira nossas ofertas de Black Friday em www.megastore.com.br
```

*(Como a função não recupera mais conteúdo, o `statusCode` sempre retornaria `-1`, caindo no bloco `ELSE`.)*

## Equivalente atual com ContentBlockByName

Se você encontrou `ContentAreaByName()` em um código legado e precisa migrar, veja como ficaria usando a função moderna:

```ampscript
%%[
/* ❌ Código antigo (não funciona mais) */
/* %%=ContentAreaByName("header_lojas_vitoria")=%% */

/* ✅ Código atual — usando Content Builder */
]%%
%%=ContentBlockByName("Content Builder\Lojas Vitória\Headers\header_principal")=%%
```

**Saída:**
```html
<div style="background-color:#2E86AB; padding:20px; text-align:center;">
  <img src="https://www.lojasvitoria.com.br/images/logo.png" alt="Lojas Vitória" />
  <p style="color:#fff;">Frete grátis acima de R$299 para todo o Brasil!</p>
</div>
```

## Observações

- ⛔ **Função descontinuada.** As classic content areas não são mais suportadas no Marketing Cloud Engagement. Essa função **não recupera nenhum conteúdo** atualmente.
- 🔄 **Migre para [`ContentBlockByName()`](../content-functions/contentblockbyname.md)** — essa é a alternativa moderna que trabalha com blocos de conteúdo do Content Builder.
- O parâmetro `statusCode` é uma **variável de saída** (output variable) — você precisa declarar a variável com `VAR` antes de passá-la para a função.
- O valor padrão de `boolErrorOnMissingContentArea` é `true`. Ou seja, se você não passar esse parâmetro e a content area não existir, a função gera um erro no envio.
- Se você encontrar essa função em templates antigos, **substitua imediatamente** para evitar problemas de renderização nos seus e-mails.
- A função funcionava apenas no contexto de **classic content areas** — nunca funcionou com blocos do Content Builder.

## Funções relacionadas

- [ContentBlockByName](../content-functions/contentblockbyname.md) — alternativa moderna; recupera blocos de conteúdo do Content Builder pelo nome
- [ContentBlockById](../content-functions/contentblockbyid.md) — recupera blocos de conteúdo do Content Builder pelo ID numérico
- [ContentBlockByKey](../content-functions/contentblockbykey.md) — recupera blocos de conteúdo do Content Builder pela customer key
- [ContentArea](../content-functions/contentarea.md) — outra função descontinuada que recuperava classic content areas pelo ID
- [TreatAsContentArea](../content-functions/treatascontentarea.md) — trata uma string como content area para fins de tracking
- [TreatAsContent](../utility-functions/treatascontent.md) — processa uma string como se fosse conteúdo AMPscript/HTML
- [BeginImpressionRegion](../content-functions/beginimpressionregion.md) — inicia uma impression region para rastreamento de conteúdo
- [EndImpressionRegion](../content-functions/endimpressionregion.md) — finaliza uma impression region