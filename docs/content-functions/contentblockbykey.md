---
title: ContentBlockByKey
sidebar_label: ContentBlockByKey
description: Retorna o conteúdo de um bloco do Content Builder referenciando sua chave (key).
---

# ContentBlockByKey

## Descrição

Retorna o conteúdo de um bloco armazenado no Content Builder, usando a **chave (key)** do bloco como referência. É a forma mais robusta de reutilizar blocos de conteúdo em e-mails, CloudPages e templates, já que a key não muda mesmo que o bloco seja renomeado ou movido de pasta. Essa função funciona **exclusivamente** com blocos do Content Builder - para conteúdos do Classic Content, use a função [ContentArea](../content-functions/contentarea.md).

## Sintaxe

```ampscript
ContentBlockByKey(contentBlockKey)
ContentBlockByKey(contentBlockKey, impressionRegionName)
ContentBlockByKey(contentBlockKey, impressionRegionName, boolErrorOnMissingContentBlock, errorMessage, statusCode)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| contentBlockKey | string | Sim | A chave (key) do bloco de conteúdo no Content Builder que você quer recuperar. |
| impressionRegionName | string | Não | Nome da impression region a ser associada ao bloco de conteúdo inserido. |
| boolErrorOnMissingContentBlock | boolean | Não | Se `true`, retorna erro caso o bloco não seja encontrado. Se `false`, não retorna erro. O valor padrão é `true`. |
| errorMessage | string | Não | Conteúdo a ser exibido caso ocorra um erro ao recuperar o bloco. |
| statusCode | number | Não | Código de saída da função. `0` indica que o bloco foi encontrado e renderizado com sucesso. `-1` indica que não há conteúdo ou o bloco é inválido. |

## Exemplo básico

Inserindo um header padrão reutilizável da Lojas Vitória em um e-mail de boas-vindas:

```ampscript
%%=ContentBlockByKey("header-lojas-vitoria-2024")=%%

<p>Olá, João Silva! Bem-vindo à Lojas Vitória.</p>

%%=ContentBlockByKey("footer-lojas-vitoria-2024")=%%
```

**Saída:**
```
[conteúdo do bloco header-lojas-vitoria-2024]

Olá, João Silva! Bem-vindo à Lojas Vitória.

[conteúdo do bloco footer-lojas-vitoria-2024]
```

## Exemplo avançado

Cenário real de régua de relacionamento: a MegaStore usa um bloco de conteúdo para o banner promocional do e-mail, mas precisa de um fallback caso o bloco seja removido acidentalmente do Content Builder. O `statusCode` é usado para exibir conteúdo alternativo:

```ampscript
%%[

VAR @banner, @statusCode

SET @banner = ContentBlockByKey(
  "banner-promo-megastore",
  "banner-region",
  false,
  "",
  @statusCode
)

IF @statusCode == 0 THEN

]%%

%%=v(@banner)=%%

%%[ ELSE ]%%

<table width="100%" cellpadding="0" cellspacing="0">
  <tr>
    <td style="background-color:#003366; color:#ffffff; text-align:center; padding:20px;">
      <h2>MegaStore - Ofertas imperdíveis com até 40% de desconto!</h2>
      <p>Parcele em até 10x sem juros. Frete grátis para São Paulo e Rio de Janeiro.</p>
    </td>
  </tr>
</table>

%%[ ENDIF ]%%

%%=EndImpressionRegion(false)=%%
```

**Saída (bloco encontrado):**
```
[conteúdo do bloco banner-promo-megastore]
```

**Saída (bloco não encontrado):**
```
MegaStore - Ofertas imperdíveis com até 40% de desconto!
Parcele em até 10x sem juros. Frete grátis para São Paulo e Rio de Janeiro.
```

## Observações

> **💡 Dica:** Prefira `ContentBlockByKey` em vez de [ContentBlockByName](../content-functions/contentblockbyname.md) ou [ContentBlockById](../content-functions/contentblockbyid.md). A key é definida na criação do bloco e permanece estável - já o nome pode ser alterado por qualquer usuário e o ID pode variar entre ambientes. Isso torna a key a referência mais confiável para templates de produção.

> **⚠️ Atenção:** Por padrão, o parâmetro `boolErrorOnMissingContentBlock` é `true`. Isso significa que se o bloco não existir, o envio do e-mail pode falhar. Em réguas de relacionamento críticas, considere setar esse parâmetro como `false` e usar o `statusCode` para controlar o fallback, como no exemplo avançado.

- O valor `0` no `statusCode` indica que o bloco foi encontrado e renderizado com sucesso. O valor `-1` indica ausência de conteúdo ou bloco inválido.
- Ao usar o parâmetro `impressionRegionName`, você inicia uma impression region automaticamente. Use [EndImpressionRegion](../content-functions/endimpressionregion.md) para demarcar o final dessa região.
- Essa função retorna **apenas** conteúdo do Content Builder. Para blocos do Classic Content, use [ContentArea](../content-functions/contentarea.md).

## Funções relacionadas

- [ContentBlockById](../content-functions/contentblockbyid.md) - busca o bloco pelo ID numérico
- [ContentBlockByName](../content-functions/contentblockbyname.md) - busca o bloco pelo nome (caminho)
- [ContentArea](../content-functions/contentarea.md) - recupera conteúdo do Classic Content
- [EndImpressionRegion](../content-functions/endimpressionregion.md) - encerra uma impression region aberta
- [TreatAsContent](../utility-functions/treatascontent.md) - processa uma string como conteúdo AMPscript