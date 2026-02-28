---
title: ContentImageById
sidebar_label: ContentImageById
description: Retorna uma tag img com o caminho de uma imagem do Content Builder a partir do seu ID, com suporte a imagem de fallback.
---

<!-- generated-by-script -->

# ContentImageById

## Descrição

A função `ContentImageById` retorna uma tag `<img>` completa apontando para uma imagem armazenada no Content Builder, usando o **ID numérico** da imagem. A tag gerada já vem com os atributos `src`, `title`, `alt`, `border="0"` e um atributo `thid` contendo o ID da imagem. Se a imagem principal não for encontrada, a função usa automaticamente uma imagem de fallback que você define no segundo parâmetro. Essa função funciona **apenas** com imagens no Content Builder — ela não funciona com blocos de imagem (image blocks).

## Sintaxe

```ampscript
ContentImageById(imageExternalId, defaultImageExternalId)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| imageExternalId | String | Sim | O ID da imagem no Content Builder que você quer exibir. |
| defaultImageExternalId | String | Sim | O ID de uma imagem de fallback no Content Builder. Será usada caso a imagem do primeiro parâmetro não seja encontrada. |

## Exemplo básico

Imagine que você está montando um e-mail de promoção de Dia das Mães para a **Lojas Vitória** e quer inserir o banner principal da campanha usando o ID da imagem no Content Builder:

```ampscript
%%=ContentImageById("12345", "99999")=%%
```

**Saída:**
```html
<img src="https://image.s1.sfmc-content.com/lib/fe.../12345.jpg" alt="Banner Dia das Mães" title="Banner Dia das Mães" border="0" thid="12345" />
```

Se a imagem `12345` não for encontrada, a função retorna automaticamente a tag `<img>` apontando para a imagem de fallback `99999`.

## Exemplo avançado

Neste cenário, a **MegaStore** envia um e-mail personalizado de Black Friday. O banner muda de acordo com a categoria preferida do cliente, que está salva em uma Data Extension. Se a imagem da categoria não existir, um banner genérico de Black Friday é exibido. Além disso, queremos extrair apenas a URL da imagem para usar como background de uma `<div>`:

```ampscript
%%[
  SET @email = AttributeValue("EmailAddress")
  SET @categoriaRows = LookupRows("PreferenciasClientes", "Email", @email)

  IF RowCount(@categoriaRows) > 0 THEN
    SET @row = Row(@categoriaRows, 1)
    SET @bannerImageId = Field(@row, "BannerImageId")
  ELSE
    SET @bannerImageId = "50000"
  ENDIF

  SET @fallbackId = "60000"

  /* Gera a tag <img> completa */
  SET @imgTag = ContentImageById(@bannerImageId, @fallbackId)

  /* Extrai apenas a URL da imagem usando RegExMatch */
  SET @imgUrl = RegExMatch(@imgTag, 'src="([^"]+)"', 1)
]%%

<!-- Uso como tag img normal -->
%%=v(@imgTag)=%%

<!-- Uso como background em uma div -->
<div style="background-image: url('%%=v(@imgUrl)=%%'); width: 600px; height: 300px;">
  <h1 style="color: #fff; padding: 40px;">
    Black Friday MegaStore 🔥<br>
    Até 70% OFF + Frete Grátis acima de R$299!
  </h1>
</div>
```

**Saída (quando a imagem da categoria é encontrada):**
```html
<img src="https://image.s1.sfmc-content.com/lib/fe.../banner-eletronicos.jpg" alt="Black Friday Eletrônicos" title="Black Friday Eletrônicos" border="0" thid="45678" />

<div style="background-image: url('https://image.s1.sfmc-content.com/lib/fe.../banner-eletronicos.jpg'); width: 600px; height: 300px;">
  <h1 style="color: #fff; padding: 40px;">
    Black Friday MegaStore 🔥<br>
    Até 70% OFF + Frete Grátis acima de R$299!
  </h1>
</div>
```

## Observações

- Essa função funciona **somente com imagens no Content Builder**. Ela não funciona com blocos de imagem (image blocks).
- O segundo parâmetro (`defaultImageExternalId`) é **obrigatório**. Sempre tenha uma imagem de fallback cadastrada no Content Builder para evitar que o e-mail fique sem imagem.
- A tag `<img>` retornada inclui automaticamente os atributos `src`, `title`, `alt`, `border="0"` e `thid`. Você não precisa montar o HTML manualmente.
- Se você precisa apenas da **URL** da imagem (e não da tag `<img>` inteira), use a função [RegExMatch](../string-functions/regexmatch.md) para extrair o valor do atributo `src`, como mostrado no exemplo avançado.
- Se você precisa referenciar imagens por **chave externa** (Customer Key) em vez de ID, considere usar a função [ContentImageByKey](../content-functions/contentimagebykey.md).
- Os IDs das imagens podem ser encontrados no Content Builder, nas propriedades de cada imagem.

## Funções relacionadas

- [ContentImageByKey](../content-functions/contentimagebykey.md) — retorna uma tag `<img>` a partir da chave externa da imagem no Content Builder
- [Image](../content-functions/image.md) — insere uma imagem referenciando-a por diferentes métodos
- [ImageById](../content-functions/imagebyid.md) — retorna uma imagem pelo ID (função legada do Portfolio)
- [ImageByKey](../content-functions/imagebykey.md) — retorna uma imagem pela chave externa (função legada do Portfolio)
- [ContentBlockById](../content-functions/contentblockbyid.md) — insere um bloco de conteúdo do Content Builder pelo ID
- [ContentBlockByKey](../content-functions/contentblockbykey.md) — insere um bloco de conteúdo do Content Builder pela chave externa
- [RegExMatch](../string-functions/regexmatch.md) — extrai partes de uma string usando expressão regular (útil para pegar só a URL da imagem)
- [Lookup](../data-extension-functions/lookup.md) — busca um valor em uma Data Extension
- [LookupRows](../data-extension-functions/lookuprows.md) — retorna múltiplas linhas de uma Data Extension