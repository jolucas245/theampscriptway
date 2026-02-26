---
title: Image
sidebar_label: Image
description: Retorna uma tag HTML img com o caminho de uma imagem do Portfolio do Marketing Cloud, incluindo opção de imagem fallback.
---

<!-- generated-by-script -->

# Image

## Descrição

A função `Image` retorna uma tag `<img>` completa, onde o atributo `src` aponta para o caminho de uma imagem armazenada no Portfolio (Content Builder) do Marketing Cloud. A tag gerada inclui automaticamente os atributos `title`, `alt`, `border="0"` e um atributo `thid` contendo o ID interno da imagem no Portfolio. Você pode passar uma imagem de fallback como segundo parâmetro — se a primeira imagem não for encontrada, a função usa a imagem alternativa. É super útil para garantir que seus e-mails sempre exibam uma imagem, mesmo quando a chave externa da imagem principal estiver incorreta ou a imagem tiver sido removida.

## Sintaxe

```ampscript
Image(imageExternalKey, defaultImageExternalKey)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| imageExternalKey | String | Sim | A chave externa (external key) da imagem no Portfolio do Marketing Cloud. |
| defaultImageExternalKey | String | Não | A chave externa de uma imagem de fallback no Portfolio. Será usada caso a imagem do primeiro parâmetro não seja encontrada. |

## Exemplo básico

Imagine que a loja online **MegaStore** quer exibir um banner de promoção de Dia das Mães no e-mail:

```ampscript
%%=Image("banner-dia-das-maes-2024")=%%
```

**Saída:**
```html
<img src="https://image.s1.sfmc-content.com/lib/fe123/m/1/banner-dia-das-maes.jpg" alt="Banner Dia das Mães" title="Banner Dia das Mães" border="0" thid="12345678" />
```

## Exemplo avançado

Agora, a **Lojas Vitória** quer exibir banners personalizados por categoria de produto preferida do cliente. Se a imagem da categoria não existir no Portfolio, um banner genérico de Black Friday é exibido como fallback. Os dados vêm de uma Data Extension chamada `PreferenciasClientes`:

```ampscript
%%[
  SET @email = AttributeValue("emailaddr")
  SET @rows = LookupRows("PreferenciasClientes", "Email", @email)

  IF RowCount(@rows) > 0 THEN
    SET @row = Row(@rows, 1)
    SET @categoria = Field(@row, "CategoriaPreferida")
    SET @chaveImagem = Concat("banner-bf-", Lowercase(@categoria))
  ELSE
    SET @chaveImagem = "banner-bf-generico"
  ENDIF
]%%

<h2>Ofertas Black Friday especiais pra você!</h2>
%%=Image(@chaveImagem, "banner-bf-generico")=%%

<p>Frete grátis acima de R$299,00. Aproveite!</p>
<p>
  Acesse: <a href="https://www.lojasvitoria.com.br/blackfriday">
    www.lojasvitoria.com.br/blackfriday
  </a>
</p>
```

**Saída (quando a categoria é "eletronicos" e a imagem existe):**
```html
<h2>Ofertas Black Friday especiais pra você!</h2>
<img src="https://image.s1.sfmc-content.com/lib/fe456/m/1/banner-bf-eletronicos.jpg" alt="Banner Black Friday Eletrônicos" title="Banner Black Friday Eletrônicos" border="0" thid="87654321" />

<p>Frete grátis acima de R$299,00. Aproveite!</p>
<p>
  Acesse: <a href="https://www.lojasvitoria.com.br/blackfriday">
    www.lojasvitoria.com.br/blackfriday
  </a>
</p>
```

**Saída (quando a imagem da categoria NÃO existe — usa o fallback):**
```html
<h2>Ofertas Black Friday especiais pra você!</h2>
<img src="https://image.s1.sfmc-content.com/lib/fe456/m/1/banner-bf-generico.jpg" alt="Banner Black Friday" title="Banner Black Friday" border="0" thid="11223344" />

<p>Frete grátis acima de R$299,00. Aproveite!</p>
<p>
  Acesse: <a href="https://www.lojasvitoria.com.br/blackfriday">
    www.lojasvitoria.com.br/blackfriday
  </a>
</p>
```

## Observações

- A função `Image` usa a **chave externa** (external key) da imagem no Portfolio. Não confunda com o ID numérico — para buscar por ID, use a função [ImageById](../content-functions/imagebyid.md).
- O atributo `border` da tag `<img>` gerada é sempre definido como `0`.
- A tag retornada inclui automaticamente um atributo `thid` com o ID interno da imagem no Portfolio. Esse atributo é usado pelo Marketing Cloud para rastreamento.
- Se você não informar o segundo parâmetro (imagem de fallback) e a imagem do primeiro parâmetro não for encontrada, a função pode retornar uma tag `<img>` vazia ou gerar um erro. Sempre que possível, informe uma imagem padrão como fallback.
- A função faz referência ao **Portfolio** (também chamado de "Classic Content" em algumas versões). Se você utiliza o Content Builder como repositório principal, verifique se suas imagens têm chaves externas definidas.
- Essa função é mais utilizada em **e-mails**, mas pode funcionar também em **CloudPages** e **Landing Pages**.
- Você não tem controle direto sobre os atributos `width`, `height` ou `style` da tag gerada. Se precisar de mais controle sobre o HTML da imagem, considere usar [GetPortfolioItem](../content-functions/getportfolioitem.md) para pegar a URL e montar a tag `<img>` manualmente.

## Funções relacionadas

- [ImageById](../content-functions/imagebyid.md) — Retorna uma tag `<img>` buscando a imagem pelo ID numérico no Portfolio.
- [ImageByKey](../content-functions/imagebykey.md) — Retorna uma tag `<img>` buscando a imagem pela chave externa (similar à Image, mas com comportamento específico).
- [GetPortfolioItem](../content-functions/getportfolioitem.md) — Retorna informações detalhadas de um item do Portfolio, incluindo a URL da imagem.
- [ContentBlockByKey](../content-functions/contentblockbykey.md) — Insere um bloco de conteúdo pela chave externa, útil quando você quer carregar blocos inteiros com imagens.
- [Concat](../string-functions/concat.md) — Concatena strings, útil para montar chaves externas de imagens dinamicamente.
- [Lowercase](../string-functions/lowercase.md) — Converte texto para minúsculas, útil para padronizar chaves externas.
- [Lookup](../data-extension-functions/lookup.md) — Busca um valor em uma Data Extension, útil para determinar qual imagem exibir por assinante.