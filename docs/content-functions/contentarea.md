---
title: ContentArea
sidebar_label: ContentArea
description: Retorna conteúdo de uma Content Area clássica (descontinuada) do Marketing Cloud.
---

# ContentArea

## Descrição

A função `ContentArea()` foi criada para recuperar e exibir conteúdo armazenado nas **Content Areas clássicas** do Marketing Cloud. No entanto, as Content Areas clássicas **não são mais suportadas** pelo Salesforce Marketing Cloud, o que significa que essa função **não recupera mais nenhum conteúdo** e **não deve ser utilizada** em novos desenvolvimentos. Esta documentação é mantida apenas para fins históricos. Para recuperar blocos de conteúdo criados no **Content Builder**, utilize a função [ContentBlockById](../content-functions/contentblockbyid.md).

## Sintaxe

```ampscript
ContentArea(contentAreaId, impressionRegionName, boolErrorOnMissingContentArea, errorMessage, statusCode)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| contentAreaId | String ou Número | Sim | O ID da Content Area clássica a ser recuperada. |
| impressionRegionName | String | Não | Nome da Impression Region a ser associada à Content Area. |
| boolErrorOnMissingContentArea | Booleano | Não | Define se a função deve retornar um erro quando a Content Area não for encontrada ou for inválida. O valor `true` retorna um erro. O padrão é `true`. |
| errorMessage | String | Não | Conteúdo padrão a ser exibido caso ocorra um erro. O padrão é uma string vazia. |
| statusCode | Número | Não | Variável de saída que contém o código de retorno da função. O valor `0` indica que a Content Area foi encontrada e o conteúdo foi renderizado com sucesso. O valor `-1` indica que não há conteúdo ou que a Content Area é inválida. |

## Exemplo básico

> ⚠️ **Atenção:** Os exemplos abaixo são apenas para referência histórica. Essa função **não funciona mais** no Marketing Cloud atual.

```ampscript
%%[
/* Exemplo histórico - NÃO USE em novos desenvolvimentos */
/* Recuperando um banner de promoção de Dia das Mães da Lojas Vitória */
]%%
%%=ContentArea("12345")=%%
```

**Saída (histórica):**
```
<!-- O conteúdo HTML da Content Area 12345 seria renderizado aqui -->
<!-- Exemplo: banner com "Dia das Mães - Até 40% OFF na Lojas Vitória!" -->
```

## Exemplo avançado

```ampscript
%%[
/* Exemplo histórico - NÃO USE em novos desenvolvimentos */
/* Recuperando bloco de ofertas Black Friday da MegaStore */
/* com tratamento de erro e Impression Region */

VAR @codigoStatus
SET @codigoStatus = 0

]%%
%%=ContentArea("67890", "banner_blackfriday", false, "<p>Confira nossas ofertas em www.megastore.com.br</p>", @codigoStatus)=%%

%%[
IF @codigoStatus == -1 THEN
]%%
  <!-- Content Area não encontrada, conteúdo alternativo exibido -->
  <p>Aproveite frete grátis acima de R$299 na MegaStore!</p>
%%[
ENDIF
]%%
```

**Saída (histórica, quando a Content Area não fosse encontrada):**
```html
<p>Confira nossas ofertas em www.megastore.com.br</p>
<!-- Content Area não encontrada, conteúdo alternativo exibido -->
<p>Aproveite frete grátis acima de R$299 na MegaStore!</p>
```

## Observações

- 🚫 **FUNÇÃO DESCONTINUADA:** As Content Areas clássicas não são mais suportadas no Marketing Cloud. Essa função **não recupera nenhum conteúdo** atualmente e **não deve ser utilizada** em novos projetos.
- ✅ **Use as alternativas do Content Builder:** Para recuperar blocos de conteúdo, utilize [ContentBlockById](../content-functions/contentblockbyid.md), [ContentBlockByName](../content-functions/contentblockbyname.md) ou [ContentBlockByKey](../content-functions/contentblockbykey.md).
- O parâmetro `boolErrorOnMissingContentArea` tem valor padrão `true`, ou seja, se você não informar nada e a Content Area não existir, um erro será gerado.
- O parâmetro `errorMessage` tem valor padrão de string vazia — se ocorrer erro e você não definir uma mensagem, nada será exibido no lugar.
- O parâmetro `statusCode` é uma **variável de saída** (output variable). Você precisa declarar a variável antes e passá-la como parâmetro. Depois da execução, ela conterá `0` (sucesso) ou `-1` (erro/conteúdo não encontrado).
- Se você encontrar essa função em código legado, o ideal é migrar para as funções do Content Builder o mais rápido possível.

## Funções relacionadas

- [ContentBlockById](../content-functions/contentblockbyid.md) — recupera um bloco de conteúdo do Content Builder pelo ID (substituta recomendada)
- [ContentBlockByName](../content-functions/contentblockbyname.md) — recupera um bloco de conteúdo do Content Builder pelo nome
- [ContentBlockByKey](../content-functions/contentblockbykey.md) — recupera um bloco de conteúdo do Content Builder pela Customer Key
- [ContentAreaByName](../content-functions/contentareabyname.md) — versão que busca Content Area clássica pelo nome (também descontinuada)
- [TreatAsContentArea](../content-functions/treatascontentarea.md) — trata uma string como Content Area para fins de tracking
- [BeginImpressionRegion](../content-functions/beginimpressionregion.md) — inicia uma Impression Region para rastreamento de conteúdo
- [EndImpressionRegion](../content-functions/endimpressionregion.md) — encerra uma Impression Region
- [TreatAsContent](../utility-functions/treatascontent.md) — processa uma string como conteúdo AMPscript