---
title: ContentImageByKey
sidebar_label: ContentImageByKey
description: Retorna uma tag img com o caminho de uma imagem do Content Builder, usando a external key como referência e permitindo uma imagem de fallback.
---

# ContentImageByKey

## Descrição

Retorna uma tag `<img>` completa apontando para uma imagem armazenada no Content Builder, localizada pela sua external key. A tag gerada já inclui os atributos `title`, `alt`, `border="0"` e um atributo `thid` com o ID interno da imagem. É muito útil para montar e-mails dinâmicos onde as imagens podem variar por segmento ou campanha, com a segurança de um fallback caso a imagem principal não seja encontrada.

## Sintaxe

```ampscript
ContentImageByKey(imageExternalKey, defaultImageExternalKey)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| imageExternalKey | string | Sim | External key da imagem no Content Builder que você quer exibir. |
| defaultImageExternalKey | string | Sim | External key de uma imagem de fallback no Content Builder. Será usada se a imagem do primeiro parâmetro não for encontrada. |

## Exemplo básico

Exibindo o banner principal de uma campanha da MegaStore, com um banner genérico como fallback:

```ampscript
%%=ContentImageByKey("banner-inverno-2024", "banner-padrao-megastore")=%%
```

**Saída:**
```html
<img src="https://image.s11.sfmc-content.com/lib/fe3a.../banner-inverno-2024.jpg" alt="Promoção de Inverno MegaStore" title="Promoção de Inverno MegaStore" border="0" thid="12345678" />
```

## Exemplo avançado

Em uma régua de relacionamento da Lojas Vitória, a imagem do e-mail muda conforme a categoria de interesse do cliente. A external key da imagem é montada dinamicamente com base em dados da Data Extension:

```ampscript
%%[
  SET @categoria = Lookup("CategoriaCliente", "Categoria", "EmailAddress", EmailAddress)

  IF Empty(@categoria) THEN
    SET @categoria = "geral"
  ENDIF

  SET @chaveImagem = Concat("vitoria-destaque-", Lowercase(@categoria))
  SET @chaveFallback = "vitoria-destaque-geral"
]%%

%%=ContentImageByKey(@chaveImagem, @chaveFallback)=%%
```

**Saída (para um cliente com categoria "eletronicos"):**
```html
<img src="https://image.s11.sfmc-content.com/lib/fe3a.../vitoria-destaque-eletronicos.jpg" alt="Destaques Eletrônicos Lojas Vitória" title="Destaques Eletrônicos Lojas Vitória" border="0" thid="87654321" />
```

**Saída (quando a categoria não existe ou a imagem não é encontrada):**
```html
<img src="https://image.s11.sfmc-content.com/lib/fe3a.../vitoria-destaque-geral.jpg" alt="Destaques Lojas Vitória" title="Destaques Lojas Vitória" border="0" thid="11223344" />
```

## Observações

> **⚠️ Atenção:** Essa função só funciona com conteúdo do tipo **Image** no Content Builder. Ela **não funciona** com conteúdo do tipo **Image Block**. Se você está tentando usar e nada aparece, verifique o tipo do asset no Content Builder.

- Se a imagem especificada no primeiro parâmetro não for encontrada, a função automaticamente retorna a tag `<img>` apontando para a imagem do segundo parâmetro (fallback). Isso evita que o e-mail vá com imagem quebrada.
- A tag `<img>` retornada já vem com `border="0"`, o que é padrão para e-mail marketing e evita bordas indesejadas em clientes de e-mail antigos.
- O atributo `thid` incluído na tag contém um ID interno da imagem usado pelo Marketing Cloud.

> **💡 Dica:** Ao montar external keys dinamicamente (como no exemplo avançado), use [Lowercase](../string-functions/lowercase.md) para padronizar e evitar problemas de case sensitivity na hora da busca. Combine com [Empty](../utility-functions/empty.md) para garantir que você sempre terá uma chave válida antes de chamar a função.

## Funções relacionadas

- [ContentImageById](../content-functions/contentimagebyid.md) - mesma ideia, mas localiza a imagem pelo ID numérico em vez da external key.
- [ImageByKey](../content-functions/imagebykey.md) - outra função para referenciar imagens por external key.
- [ImageById](../content-functions/imagebyid.md) - referencia imagens pelo ID numérico.
- [Image](../content-functions/image.md) - função base para trabalhar com imagens.
- [ContentBlockByKey](../content-functions/contentblockbykey.md) - para inserir blocos de conteúdo (não imagens) por external key.
- [Concat](../string-functions/concat.md) - útil para montar external keys dinâmicas.
- [Lowercase](../string-functions/lowercase.md) - para padronizar strings antes de usar como chave.
- [Empty](../utility-functions/empty.md) - para validar valores antes de montar a chave da imagem.