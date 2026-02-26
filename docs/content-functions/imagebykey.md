---
title: ImageByKey
sidebar_label: ImageByKey
description: Retorna uma tag HTML img referenciando uma imagem do Content Builder a partir da sua chave externa (external key), com suporte a uma imagem de fallback.
---

# ImageByKey

## Descrição

A função `ImageByKey` retorna uma tag `<img>` completa cujo atributo `src` aponta para uma imagem armazenada no Content Builder, localizada pela sua **chave externa** (external key). A tag gerada já inclui os atributos `title`, `alt`, `border="0"` e um `thid` com o ID interno da imagem. Caso a imagem principal não seja encontrada, a função usa automaticamente uma imagem de fallback que você define no segundo parâmetro. Essa função funciona **somente** com conteúdos do tipo **Image** no Content Builder — ela **não** funciona com blocos do tipo Image Block.

## Sintaxe

```ampscript
ImageByKey(imageExternalKey, defaultImageExternalKey)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| imageExternalKey | String | Sim | A chave externa (external key) da imagem desejada no Content Builder. |
| defaultImageExternalKey | String | Sim | A chave externa de uma imagem de fallback no Content Builder. Será usada caso a imagem do primeiro parâmetro não seja encontrada. |

## Exemplo básico

Imagine que você tem um e-mail de campanha de Dia das Mães para a loja fictícia "Lojas Vitória" e quer exibir o banner principal da promoção. A imagem foi salva no Content Builder com a chave externa `banner-dia-das-maes-2024`, e existe uma imagem genérica de fallback com a chave `banner-padrao-lojas-vitoria`.

```ampscript
%%=ImageByKey("banner-dia-das-maes-2024", "banner-padrao-lojas-vitoria")=%%
```

**Saída (se a imagem principal for encontrada):**
```html
<img src="https://image.s11.sfmc-content.com/lib/fe3c/m/1/banner-dia-das-maes-2024.jpg" alt="Promoção Dia das Mães 2024" title="Promoção Dia das Mães 2024" border="0" thid="12345678" />
```

**Saída (se a imagem principal NÃO for encontrada):**
```html
<img src="https://image.s11.sfmc-content.com/lib/fe3c/m/1/banner-padrao-lojas-vitoria.jpg" alt="Lojas Vitória" title="Lojas Vitória" border="0" thid="87654321" />
```

## Exemplo avançado

Aqui temos um cenário mais completo: um e-mail promocional de Black Friday da "MegaStore" que exibe um banner diferente de acordo com a categoria preferida do cliente, armazenada em uma Data Extension chamada `Preferencias_Cliente`.

```ampscript
%%[
  SET @emailAssinante = AttributeValue("emailaddr")
  SET @categoria = Lookup("Preferencias_Cliente", "CategoriaPrincipal", "Email", @emailAssinante)

  IF @categoria == "Eletrônicos" THEN
    SET @chaveImagem = "bf-2024-eletronicos"
  ELSEIF @categoria == "Moda" THEN
    SET @chaveImagem = "bf-2024-moda"
  ELSEIF @categoria == "Casa e Decoração" THEN
    SET @chaveImagem = "bf-2024-casa-decoracao"
  ELSE
    SET @chaveImagem = "bf-2024-generico"
  ENDIF

  SET @chaveFallback = "bf-2024-generico"
]%%

<table width="600" cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td align="center">
      %%=ImageByKey(@chaveImagem, @chaveFallback)=%%
    </td>
  </tr>
  <tr>
    <td align="center" style="padding: 20px; font-family: Arial, sans-serif; font-size: 16px;">
      Olá! A Black Friday da MegaStore está bombando 🔥<br/>
      Frete grátis acima de R$299 + até 12x sem juros!
    </td>
  </tr>
</table>
```

**Saída (para um cliente com categoria "Moda" e imagem encontrada):**
```html
<table width="600" cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td align="center">
      <img src="https://image.s11.sfmc-content.com/lib/fe3c/m/1/bf-2024-moda.jpg" alt="Black Friday Moda MegaStore" title="Black Friday Moda MegaStore" border="0" thid="11223344" />
    </td>
  </tr>
  <tr>
    <td align="center" style="padding: 20px; font-family: Arial, sans-serif; font-size: 16px;">
      Olá! A Black Friday da MegaStore está bombando 🔥<br/>
      Frete grátis acima de R$299 + até 12x sem juros!
    </td>
  </tr>
</table>
```

## Observações

- A função **só funciona com conteúdos do tipo Image** no Content Builder. Se você tiver um **Image Block** (bloco de imagem), ela não vai funcionar — use [ContentBlockByKey](../content-functions/contentblockbykey.md) para esse caso.
- O segundo parâmetro (`defaultImageExternalKey`) é **obrigatório**. Mesmo que você tenha certeza de que a imagem principal existe, precisa informar uma chave de fallback.
- A tag `<img>` retornada já vem com `border="0"`, `alt`, `title` e `thid`. Você **não** tem controle direto sobre esses atributos via parâmetros da função. Se precisar de mais controle sobre o HTML, considere montar a tag `<img>` manualmente usando a URL da imagem.
- Certifique-se de que a chave externa da imagem está correta e é única. Você pode verificar a external key de qualquer asset no Content Builder clicando na imagem e indo em **Properties > Content Builder Key**.
- Se **nenhuma** das duas imagens (principal e fallback) for encontrada, o comportamento pode gerar uma tag `<img>` vazia ou um erro de renderização. Por isso, garanta que a imagem de fallback sempre exista no Content Builder.
- A função funciona tanto em **e-mails** quanto em **CloudPages**.

## Funções relacionadas

- [Image](../content-functions/image.md) — retorna uma tag `<img>` a partir de uma URL do portfólio clássico (Classic Content)
- [ImageById](../content-functions/imagebyid.md) — semelhante à `ImageByKey`, mas localiza a imagem pelo ID numérico em vez da chave externa
- [ContentBlockByKey](../content-functions/contentblockbykey.md) — retorna o conteúdo de um bloco do Content Builder pela chave externa (útil para Image Blocks e outros tipos de bloco)
- [ContentBlockById](../content-functions/contentblockbyid.md) — retorna o conteúdo de um bloco do Content Builder pelo ID numérico
- [ContentBlockByName](../content-functions/contentblockbyname.md) — retorna o conteúdo de um bloco do Content Builder pelo nome/caminho de pasta
- [Lookup](../data-extension-functions/lookup.md) — busca valores em uma Data Extension (útil para obter chaves de imagem dinamicamente)
- [AttributeValue](../utility-functions/attributevalue.md) — retorna o valor de um atributo do assinante de forma segura, sem erro caso o campo não exista