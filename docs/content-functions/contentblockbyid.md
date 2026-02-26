---
title: ContentBlockById
sidebar_label: ContentBlockById
description: Retorna o conteúdo de um bloco de conteúdo do Content Builder referenciando seu ID numérico.
---

# ContentBlockById

## Descrição

A função `ContentBlockById` busca e retorna o conteúdo de um bloco de conteúdo (content block) do **Content Builder** usando o ID numérico dele. É uma das funções mais usadas no dia a dia do Marketing Cloud, porque permite modularizar seus e-mails e páginas — você cria blocos reutilizáveis (como headers, footers, disclaimers, blocos de oferta) e os insere onde precisar. Essa função funciona **apenas** com conteúdo do Content Builder; para conteúdo do Classic Content, use a função `ContentArea()`. Se o bloco não for encontrado, por padrão a função retorna um erro, mas você pode controlar esse comportamento com os parâmetros opcionais.

## Sintaxe

```ampscript
ContentBlockById(contentBlockId)
ContentBlockById(contentBlockId, impressionRegionName)
ContentBlockById(contentBlockId, impressionRegionName, boolErrorOnMissingContentBlock)
ContentBlockById(contentBlockId, impressionRegionName, boolErrorOnMissingContentBlock, errorMessage)
ContentBlockById(contentBlockId, impressionRegionName, boolErrorOnMissingContentBlock, errorMessage, statusCode)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| contentBlockId | Número | Sim | O ID numérico do bloco de conteúdo no Content Builder que você quer inserir. |
| impressionRegionName | String | Não | Nome da região de impressão (impression region) a ser associada ao bloco de conteúdo. Útil para rastreamento de engajamento por região do e-mail. |
| boolErrorOnMissingContentBlock | Booleano | Não | Se `true`, a função retorna um erro caso o bloco não seja encontrado. Se `false`, não retorna erro. O valor padrão é `true`. |
| errorMessage | String | Não | Conteúdo a ser exibido caso ocorra um erro ao recuperar o bloco de conteúdo. |
| statusCode | Número | Não | Código de saída da função. O valor `0` indica que o bloco foi encontrado e renderizado com sucesso. O valor `-1` indica que não há conteúdo ou que o ID do bloco é inválido. |

## Exemplo básico

Imagine que você tem um bloco de conteúdo no Content Builder com o header padrão da **Lojas Vitória**, e o ID desse bloco é `84201`. Para inserir ele no seu e-mail:

```ampscript
%%=ContentBlockById(84201)=%%
```

**Saída:**
```html
<!-- Conteúdo do bloco 84201 é renderizado aqui -->
<table width="100%" bgcolor="#2E86C1">
  <tr>
    <td style="padding: 20px; text-align: center;">
      <img src="https://www.lojasvitoria.com.br/img/logo.png" alt="Lojas Vitória" />
      <p style="color: #ffffff;">Frete grátis acima de R$299 | Até 10x sem juros</p>
    </td>
  </tr>
</table>
```

## Exemplo com Impression Region

Você pode associar uma impression region ao bloco para rastrear engajamento naquela área específica do e-mail. Aqui, inserimos o bloco de oferta de Dia das Mães e marcamos como região "oferta_principal":

```ampscript
%%=ContentBlockById(52413, "oferta_principal")=%%

<!-- Mais conteúdo do e-mail aqui -->

%%=EndImpressionRegion()=%%
```

**Saída:**
```html
<!-- O conteúdo do bloco 52413 é renderizado dentro da impression region "oferta_principal" -->
<div style="text-align: center; padding: 30px;">
  <h2>Dia das Mães com até 40% OFF 💐</h2>
  <p>Presenteie quem mais importa! Ofertas válidas até 12/05/2025.</p>
  <a href="https://www.lojasvitoria.com.br/diadasmaes">Ver ofertas</a>
</div>
```

## Exemplo avançado

Esse é o cenário mais robusto: você usa o parâmetro `statusCode` para verificar se o bloco foi carregado com sucesso e, caso contrário, exibe um conteúdo de fallback. Perfeito para e-mails que não podem quebrar mesmo se alguém deletar um bloco sem querer.

```ampscript
%%[
VAR @statusCode, @conteudoBanner, @nomeCliente

SET @nomeCliente = AttributeValue("PrimeiroNome")
SET @nomeCliente = IIF(Empty(@nomeCliente), "cliente", @nomeCliente)

/* Tenta carregar o banner de Black Friday (ID: 67890) */
SET @conteudoBanner = ContentBlockById(67890, "banner_blackfriday", false, "", @statusCode)

IF @statusCode == 0 THEN
]%%

<!-- Banner carregado com sucesso -->
<h1>Olá, %%=v(@nomeCliente)=%%! 🖤</h1>
%%=v(@conteudoBanner)=%%

%%[ ELSE ]%%

<!-- Fallback: banner não encontrado -->
<table width="100%" bgcolor="#1a1a1a">
  <tr>
    <td style="padding: 40px; text-align: center; color: #ffffff;">
      <h1>Olá, %%=v(@nomeCliente)=%%! 🖤</h1>
      <h2>Black Friday MegaStore</h2>
      <p>Descontos de até 70% + cashback de R$50 na primeira compra!</p>
      <a href="https://www.megastore.com.br/blackfriday" style="color: #FFD700;">
        Acesse as ofertas
      </a>
    </td>
  </tr>
</table>

%%[ ENDIF ]%%
```

**Saída (quando o bloco existe):**
```html
<h1>Olá, Maria! 🖤</h1>
<!-- Conteúdo do bloco 67890 renderizado aqui -->
```

**Saída (quando o bloco NÃO existe):**
```html
<table width="100%" bgcolor="#1a1a1a">
  <tr>
    <td style="padding: 40px; text-align: center; color: #ffffff;">
      <h1>Olá, Maria! 🖤</h1>
      <h2>Black Friday MegaStore</h2>
      <p>Descontos de até 70% + cashback de R$50 na primeira compra!</p>
      <a href="https://www.megastore.com.br/blackfriday" style="color: #FFD700;">
        Acesse as ofertas
      </a>
    </td>
  </tr>
</table>
```

## Exemplo com ID dinâmico via Data Extension

Você pode montar e-mails super dinâmicos buscando o ID do bloco de conteúdo direto de uma Data Extension. Imagina que a equipe de marketing da **Conecta Telecom** tem uma DE chamada `Campanhas_Ativas` com os IDs dos blocos que mudam toda semana:

```ampscript
%%[
VAR @blocoId, @statusCode

/* Busca o ID do bloco da campanha ativa para o segmento do assinante */
SET @blocoId = Lookup("Campanhas_Ativas", "ContentBlockId", "Segmento", AttributeValue("SegmentoCliente"))

IF NOT Empty(@blocoId) THEN
  SET @conteudo = ContentBlockById(@blocoId, "campanha_semanal", false, "", @statusCode)
  
  IF @statusCode == 0 THEN
]%%
%%=v(@conteudo)=%%
%%[ ELSE ]%%
<p>Confira nossas ofertas em <a href="https://www.conectatelecom.com.br/ofertas">conectatelecom.com.br/ofertas</a></p>
%%[ ENDIF ]%%

%%[ ELSE ]%%
<p>Confira nossas ofertas em <a href="https://www.conectatelecom.com.br/ofertas">conectatelecom.com.br/ofertas</a></p>
%%[ ENDIF ]%%
```

## Observações

- **Funciona apenas com Content Builder.** Se você precisa referenciar conteúdo de áreas Classic, use [ContentArea](../content-functions/contentarea.md).
- **O ID do bloco é numérico.** Você encontra o ID do bloco de conteúdo nas propriedades dele dentro do Content Builder. Não confunda com o Content Builder Asset ID da API — o ID usado aqui é o que aparece na interface.
- **Cuidado ao deletar blocos.** Se alguém da equipe apagar um bloco de conteúdo que está referenciado por ID em vários e-mails, todos esses e-mails vão quebrar (a menos que você use o parâmetro `boolErrorOnMissingContentBlock` como `false` com um fallback).
- **O valor padrão de `boolErrorOnMissingContentBlock` é `true`.** Isso significa que, sem tratamento, um bloco não encontrado vai gerar erro no envio. Em produção, considere sempre usar `false` com um conteúdo de fallback.
- **O `statusCode` retorna `0` para sucesso e `-1` para falha.** Use essa variável para criar lógicas condicionais robustas.
- **O conteúdo do bloco é processado.** Isso significa que se o bloco contiver AMPscript, ele será executado no contexto do e-mail que o está chamando. Variáveis definidas antes da chamada ficam disponíveis dentro do bloco.
- **Impression regions** são úteis para relatórios de engajamento por seção do e-mail. Lembre-se de fechar a região com [EndImpressionRegion](../content-functions/endimpressionregion.md).
- **Performance:** evite aninhar muitos níveis de `ContentBlockById` (bloco que chama bloco que chama bloco). Isso pode impactar o tempo de renderização do e-mail.
- Para referenciar blocos por chave (Customer Key) em vez de ID, use [ContentBlockByKey](../content-functions/contentblockbykey.md) — geralmente mais seguro porque a key não muda se você mover o bloco de pasta.

## Funções relacionadas

- [ContentBlockByKey](../content-functions/contentblockbykey.md) — busca um bloco de conteúdo pela Customer Key (chave) em vez do ID numérico
- [ContentBlockByName](../content-functions/contentblockbyname.md) — busca um bloco de conteúdo pelo nome
- [ContentArea](../content-functions/contentarea.md) — insere conteúdo de áreas Classic Content (legado)
- [EndImpressionRegion](../content-functions/endimpressionregion.md) — encerra uma impression region iniciada por ContentBlockById ou BeginImpressionRegion
- [BeginImpressionRegion](../content-functions/beginimpressionregion.md) — inicia manualmente uma impression region
- [TreatAsContent](../utility-functions/treatascontent.md) — processa uma string como se fosse conteúdo AMPscript (útil para conteúdo dinâmico armazenado em DEs)
- [Lookup](../data-extension-functions/lookup.md) — busca valores em Data Extensions (útil para obter IDs de blocos dinamicamente)
- [AttributeValue](../utility-functions/attributevalue.md) — retorna o valor de um atributo do assinante de forma segura