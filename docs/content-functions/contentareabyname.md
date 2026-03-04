---
title: ContentAreaByName
sidebar_label: ContentAreaByName
description: Recupera conteúdo de uma classic content area pelo nome (função descontinuada — não deve ser usada).
---

# ContentAreaByName

## Descrição

A função `ContentAreaByName` retorna o conteúdo de uma **classic content area** a partir do seu nome. No entanto, as classic content areas **não são mais suportadas** no Marketing Cloud Engagement, o que significa que essa função não recupera nenhum conteúdo e **não deve ser utilizada**. Esta documentação é mantida apenas para fins históricos — se você precisa recuperar blocos de conteúdo criados no Content Builder, use a função [ContentBlockByName](../content-functions/contentblockbyname.md).

## Sintaxe

```ampscript
ContentAreaByName(contentAreaName, impressionRegionName, boolErrorOnMissingContentArea, errorMessage, statusCode)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| contentAreaName | string | Sim | Nome da content area a ser recuperada. |
| impressionRegionName | string | Não | Nome da impression region a ser associada à content area. |
| boolErrorOnMissingContentArea | boolean | Não | Se `true`, retorna erro quando a content area não é encontrada. Se `false`, não retorna erro. O valor padrão é `true`. |
| errorMessage | string | Não | Conteúdo a ser exibido caso ocorra um erro ao recuperar a content area. |
| statusCode | number | Não | Variável de saída que contém o código de retorno da função. `0` indica que a content area foi encontrada e o conteúdo renderizado com sucesso. `-1` indica que não há conteúdo ou a content area é inválida. |

## Exemplo básico

Tentativa de recuperar uma classic content area com o cabeçalho padrão da Lojas Vitória:

```ampscript
%%=ContentAreaByName("cabecalho_lojas_vitoria")=%%
```

**Saída:**
```
(sem conteúdo — classic content areas não são mais suportadas)
```

## Exemplo avançado

Uso com tratamento de erro e variável de status para identificar falhas — cenário de uma régua de boas-vindas do Banco Brasilão:

```ampscript
%%[
  VAR @status
  SET @conteudo = ContentAreaByName("banner_boas_vindas", "regiao_header", false, "Conteúdo indisponível no momento.", @status)
]%%

%%[ IF @status == 0 THEN ]%%
  %%=v(@conteudo)=%%
%%[ ELSE ]%%
  <p>Olá! Bem-vindo ao Banco Brasilão.</p>
%%[ ENDIF ]%%
```

**Saída:**
```
Olá! Bem-vindo ao Banco Brasilão.
```

> **⚠️ Atenção:** Como as classic content areas foram descontinuadas, o `statusCode` sempre retornará `-1`, caindo no bloco `ELSE`. Este exemplo serve apenas para referência histórica.

## Observações

> **⚠️ Atenção:** Esta função está **efetivamente descontinuada**. As classic content areas não são mais suportadas no Marketing Cloud Engagement, então `ContentAreaByName` não recupera nenhum conteúdo. Se você encontrar essa função em templates legados, substitua por [ContentBlockByName](../content-functions/contentblockbyname.md) (ou [ContentBlockById](../content-functions/contentblockbyid.md) / [ContentBlockByKey](../content-functions/contentblockbykey.md)) apontando para o bloco equivalente no Content Builder.

- O parâmetro `boolErrorOnMissingContentArea` tem valor padrão `true` — em código legado sem esse parâmetro explícito, a função gera erro quando não encontra a content area (o que hoje acontece sempre).
- O parâmetro `statusCode` é uma **variável de saída**: você declara a variável e a função preenche o valor. `0` = sucesso, `-1` = conteúdo não encontrado ou inválido.

> **💡 Dica:** Se você está migrando templates antigos que usam `ContentAreaByName`, mapeie o nome da content area para o caminho de pasta equivalente no Content Builder e troque para `ContentBlockByName("Content Builder\caminho\bloco")`.

## Funções relacionadas

- [ContentBlockByName](../content-functions/contentblockbyname.md) — **substituta recomendada**, recupera blocos do Content Builder pelo nome
- [ContentBlockById](../content-functions/contentblockbyid.md) — recupera blocos do Content Builder pelo ID
- [ContentBlockByKey](../content-functions/contentblockbykey.md) — recupera blocos do Content Builder pela customer key
- [ContentArea](../content-functions/contentarea.md) — recupera classic content area pelo ID
- [TreatAsContentArea](../content-functions/treatascontentarea.md) — trata uma string como content area
- [BeginImpressionRegion](../content-functions/beginimpressionregion.md) — inicia uma impression region
- [EndImpressionRegion](../content-functions/endimpressionregion.md) — encerra uma impression region