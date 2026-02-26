---
title: ImageById
sidebar_label: ImageById
description: Retorna uma tag img com o caminho de uma imagem armazenada no Content Builder, usando o ID da imagem.
---

<!-- generated-by-script -->

# ImageById

## Descrição

A função `ImageById` (também referenciada como `ContentImageById`) retorna uma tag `<img>` completa com o caminho (`src`) de uma imagem armazenada no Content Builder. A tag gerada inclui automaticamente os atributos `title`, `alt`, `border="0"` e um atributo `thid` com o ID da imagem. Você passa o ID da imagem desejada e um ID de imagem de fallback — se a primeira não for encontrada, a função usa a segunda. É muito útil para montar e-mails dinâmicos onde as imagens podem variar por campanha, categoria de produto ou segmento de cliente.

## Sintaxe

```ampscript
ImageById(imageExternalId, defaultImageExternalId)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| imageExternalId | String | Sim | O ID da imagem no Content Builder que você deseja exibir. |
| defaultImageExternalId | String | Sim | O ID de uma imagem de fallback no Content Builder. Será usada caso a imagem do primeiro parâmetro não seja encontrada. |

## Exemplo básico

Imagine que você está montando um e-mail de promoção para a **MegaStore** e quer exibir o banner principal da campanha de Dia das Mães:

```ampscript
%%[
/* Banner principal - Dia das Mães */
]%%
%%=ImageById("45678", "99999")=%%
```

**Saída (quando a imagem 45678 é encontrada):**
```html
<img src="https://image.s11.sfmc-content.com/lib/fe3a.../45678.jpg" alt="Banner Dia das Mães" title="Banner Dia das Mães" border="0" thid="45678" />
```

**Saída (quando a imagem 45678 NÃO é encontrada — usa o fallback):**
```html
<img src="https://image.s11.sfmc-content.com/lib/fe3a.../99999.jpg" alt="Imagem padrão" title="Imagem padrão" border="0" thid="99999" />
```

## Exemplo avançado

Agora um cenário mais completo: a **Lojas Vitória** quer enviar um e-mail personalizado onde a imagem do banner muda de acordo com a categoria favorita do cliente, e você também precisa extrair somente a URL da imagem (sem a tag `<img>` inteira) para usar como background em CSS inline.

```ampscript
%%[
SET @emailCliente = "joao.silva@email.com.br"
SET @nomeCliente = "João Silva"

/* Busca a categoria favorita do cliente na Data Extension */
SET @categoriaFavorita = Lookup("Clientes_Preferencias", "CategoriaFavorita", "Email", @emailCliente)

/* Define o ID da imagem com base na categoria */
IF @categoriaFavorita == "Eletrônicos" THEN
  SET @imagemBannerId = "10001"
ELSEIF @categoriaFavorita == "Moda" THEN
  SET @imagemBannerId = "10002"
ELSEIF @categoriaFavorita == "Casa e Decoração" THEN
  SET @imagemBannerId = "10003"
ELSE
  SET @imagemBannerId = "10000" /* Banner genérico */
ENDIF

/* Imagem de fallback padrão */
SET @fallbackId = "10000"

/* Gera a tag img completa */
SET @tagImgCompleta = ImageById(@imagemBannerId, @fallbackId)

/* Extrai somente a URL da imagem usando RegExMatch */
SET @urlImagem = RegExMatch(@tagImgCompleta, 'src="([^"]+)"', 1)
]%%

<!-- Banner com tag img completa -->
%%=v(@tagImgCompleta)=%%

<!-- Uso da URL como background inline -->
<table width="100%" cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td background="%%=v(@urlImagem)=%%" style="background-image:url('%%=v(@urlImagem)=%%'); background-size:cover; height:400px; text-align:center;">
      <h1 style="color:#ffffff; font-size:28px; padding-top:150px;">
        Olá, %%=v(@nomeCliente)=%%! 🎉
      </h1>
      <p style="color:#ffffff; font-size:18px;">
        Ofertas especiais em %%=v(@categoriaFavorita)=%% com até 40% OFF + frete grátis acima de R$299!
      </p>
      <a href="https://www.lojasvitoria.com.br/ofertas" style="background:#FF6600; color:#ffffff; padding:12px 30px; text-decoration:none; border-radius:5px; font-weight:bold;">
        VER OFERTAS
      </a>
    </td>
  </tr>
</table>
```

**Saída (para um cliente com categoria "Eletrônicos"):**
```html
<img src="https://image.s11.sfmc-content.com/lib/fe3a.../10001.jpg" alt="Banner Eletrônicos" title="Banner Eletrônicos" border="0" thid="10001" />

<table width="100%" cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td background="https://image.s11.sfmc-content.com/lib/fe3a.../10001.jpg" style="background-image:url('https://image.s11.sfmc-content.com/lib/fe3a.../10001.jpg'); background-size:cover; height:400px; text-align:center;">
      <h1 style="color:#ffffff; font-size:28px; padding-top:150px;">
        Olá, João Silva! 🎉
      </h1>
      <p style="color:#ffffff; font-size:18px;">
        Ofertas especiais em Eletrônicos com até 40% OFF + frete grátis acima de R$299!
      </p>
      <a href="https://www.lojasvitoria.com.br/ofertas" style="background:#FF6600; color:#ffffff; padding:12px 30px; text-decoration:none; border-radius:5px; font-weight:bold;">
        VER OFERTAS
      </a>
    </td>
  </tr>
</table>
```

## Observações

- **Funciona apenas com imagens no Content Builder.** Essa função não funciona com blocos de imagem (image blocks) — somente com arquivos de imagem salvos diretamente no Content Builder.
- **Ambos os parâmetros são obrigatórios.** Você sempre precisa informar tanto o ID da imagem principal quanto o ID da imagem de fallback. Mesmo que você ache que a imagem sempre vai existir, o fallback é exigido.
- **O retorno é uma tag `<img>` completa**, não apenas a URL. Se você precisa somente da URL da imagem (por exemplo, para usar em CSS inline ou como parâmetro de outra função), utilize a função [RegExMatch](../string-functions/regexmatch.md) para extrair o valor do atributo `src`.
- **O atributo `border` é sempre definido como `0`** automaticamente na tag gerada.
- **A tag inclui um atributo `thid`** que contém o ID da imagem, usado internamente pelo Marketing Cloud para rastreamento.
- **Cuidado com IDs inválidos nos dois parâmetros.** Se tanto a imagem principal quanto a imagem de fallback não forem encontradas, o comportamento pode ser imprevisível. Garanta que pelo menos a imagem de fallback seja uma imagem genérica que sempre exista no seu Content Builder.
- **Não confunda com `Image`**. A função [Image](../content-functions/image.md) usa uma referência diferente para localizar imagens. Se você prefere buscar por Customer Key em vez de ID, confira a função [ImageByKey](../content-functions/imagebykey.md).

## Funções relacionadas

- [Image](../content-functions/image.md) — Retorna uma tag `<img>` de uma imagem do portfólio clássico.
- [ImageByKey](../content-functions/imagebykey.md) — Semelhante ao `ImageById`, mas busca a imagem pela Customer Key em vez do ID.
- [RegExMatch](../string-functions/regexmatch.md) — Útil para extrair somente a URL (`src`) da tag `<img>` retornada pelo `ImageById`.
- [ContentBlockById](../content-functions/contentblockbyid.md) — Insere um bloco de conteúdo do Content Builder pelo ID.
- [ContentBlockByKey](../content-functions/contentblockbykey.md) — Insere um bloco de conteúdo do Content Builder pela Customer Key.
- [Lookup](../data-extension-functions/lookup.md) — Busca valores em Data Extensions, útil para determinar dinamicamente qual ID de imagem usar.
- [V](../utility-functions/v.md) — Exibe o valor de uma variável no HTML do e-mail.
- [TreatAsContent](../utility-functions/treatascontent.md) — Processa uma string como conteúdo AMPscript, útil quando você monta HTML dinâmico com imagens.