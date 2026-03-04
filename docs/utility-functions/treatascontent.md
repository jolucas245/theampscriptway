---
title: TreatAsContent
sidebar_label: TreatAsContent
description: Interpreta uma string como conteúdo, processando personalizações e código AMPscript embutido nela.
---

# TreatAsContent

## Descrição

A função `TreatAsContent` recebe uma string e a trata como se fosse conteúdo vindo de uma Content Area — ou seja, qualquer personalização (como `%%FirstName%%`) ou código AMPscript presente nessa string será processado e resolvido. Isso é extremamente útil quando você armazena templates ou trechos de HTML com personalizações em Data Extensions e precisa que eles sejam renderizados dinamicamente no momento do envio. Se o conteúdo tiver links embutidos e você precisar rastrear cliques, inclua a string `httpgetwrap` nesses links.

## Sintaxe

```ampscript
TreatAsContent(stringToReturn)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| stringToReturn | String | Sim | A string que será interpretada e retornada como conteúdo. Personalizações e código AMPscript dentro dela serão processados. |

## Exemplo básico

Renderizando uma saudação personalizada montada dinamicamente a partir de uma string com personalizações:

```ampscript
%%[

SET @nome = "Maria Santos"
SET @saudacao = Concat("Olá, ", @nome, "! Bem-vinda à MegaStore.")

TreatAsContent(@saudacao)

]%%
```

**Saída:**
```
Olá, Maria Santos! Bem-vinda à MegaStore.
```

## Exemplo avançado

Imagine que a equipe de CRM da Lojas Vitória armazena templates de blocos de e-mail em uma Data Extension chamada `TemplatesEmail`, onde cada linha tem um campo `HtmlBloco` com HTML e personalizações AMPscript embutidas. Isso permite que o time de marketing atualize o conteúdo sem mexer no e-mail principal:

```ampscript
%%[

SET @email = AttributeValue("EmailAddress")
SET @primeiroNome = AttributeValue("PrimeiroNome")
SET @cidade = AttributeValue("Cidade")

SET @templateRows = LookupRows("TemplatesEmail", "BlocoID", "header-promo")
SET @templateRow = Row(@templateRows, 1)
SET @htmlTemplate = Field(@templateRow, "HtmlBloco")

/* 
  O campo HtmlBloco contém algo como:
  "<h1>Oi, %%=v(@primeiroNome)=%%!</h1>
   <p>Ofertas exclusivas para quem é de %%=v(@cidade)=%%.</p>
   <p>Aproveite até 40% de desconto em produtos selecionados.</p>"
*/

TreatAsContent(@htmlTemplate)

]%%
```

**Saída:**
```html
<h1>Oi, Maria Santos!</h1>
<p>Ofertas exclusivas para quem é de Curitiba.</p>
<p>Aproveite até 40% de desconto em produtos selecionados.</p>
```

## Observações

> **⚠️ Atenção:** Sempre sanitize dados de entrada do usuário dentro de um bloco `TreatAsContent()`. Remova, escape ou bloqueie qualquer input que contenha tags HTML ou código AMPscript. Use uma allowlist de caracteres seguros. Se a string processada vier de uma fonte não confiável (como um formulário de CloudPage), um usuário mal-intencionado pode injetar código AMPscript que será executado, causando desde vazamento de dados até erros no envio.

> **💡 Dica:** Use essa função apenas com dados que foram revisados e otimizados para aparecer como conteúdo. Ela é ideal para cenários onde os blocos de conteúdo ficam armazenados em Data Extensions — por exemplo, quando diferentes unidades de negócio gerenciam seus próprios textos promocionais e você precisa montar o e-mail dinamicamente.

> **💡 Dica:** Se o conteúdo retornado por `TreatAsContent` incluir links e você precisar rastrear cliques nesses links, utilize a string [HTTPGetWrap](../http-functions/httpgetwrap.md) nos links embutidos para garantir que as informações de tracking sejam capturadas corretamente.

- A função processa tanto personalization strings (ex: `%%NomeColuna%%`) quanto blocos AMPscript completos (ex: `%%=v(@variavel)=%%`) presentes na string recebida.

## Funções relacionadas

- [Output](../utility-functions/output.md) — exibe o resultado de uma expressão, mas não processa personalizações dentro de strings
- [V](../utility-functions/v.md) — retorna o valor de uma variável
- [ContentBlockByKey](../content-functions/contentblockbykey.md) — carrega um Content Block pelo key, já processando o conteúdo automaticamente
- [ContentBlockByName](../content-functions/contentblockbyname.md) — carrega um Content Block pelo nome
- [ContentBlockById](../content-functions/contentblockbyid.md) — carrega um Content Block pelo ID
- [TreatAsContentArea](../content-functions/treatascontentarea.md) — similar, mas trata a string como uma Content Area nomeada
- [Concat](../string-functions/concat.md) — útil para montar a string que será processada pelo TreatAsContent
- [Lookup](../data-extension-functions/lookup.md) — para buscar o template armazenado em uma Data Extension
- [HTTPGetWrap](../http-functions/httpgetwrap.md) — para incluir tracking em links dentro do conteúdo processado