---
title: ImageByKey
sidebar_label: ImageByKey
description: Retorna uma tag img com o caminho de uma imagem do Content Builder, localizada pela external key, com suporte a imagem fallback.
---

# ImageByKey

## Descrição

A função `ContentImageByKey` retorna uma tag `<img>` completa apontando para uma imagem armazenada no Content Builder, localizada pela sua external key. A tag gerada já inclui os atributos `title`, `alt`, `border="0"` e um `thid` com o ID interno da imagem. É muito útil quando você precisa inserir imagens dinâmicas em e-mails - por exemplo, banners personalizados por segmento ou logos de parceiros - e quer garantir que, caso a imagem principal não seja encontrada, um fallback seja exibido automaticamente.

> **⚠️ Atenção:** Essa função funciona **apenas** com conteúdo do tipo Image no Content Builder. Ela **não** funciona com conteúdo do tipo Image Block.

## Sintaxe

```ampscript
ContentImageByKey(imageExternalKey, defaultImageExternalKey)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| imageExternalKey | String | Sim | A external key da imagem no Content Builder que você deseja exibir. |
| defaultImageExternalKey | String | Sim | A external key de uma imagem fallback no Content Builder. Será usada caso a imagem do primeiro parâmetro não seja encontrada. |

## Exemplo básico

Exibindo o banner principal de uma campanha de Black Friday da MegaStore, com um banner genérico como fallback:

```ampscript
%%=ContentImageByKey("banner-blackfriday-2024", "banner-generico-megastore")=%%
```

**Saída:**
```html
<img src="https://image.s11.sfmc-content.com/lib/fe3a.../banner-blackfriday-2024.jpg" alt="Black Friday MegaStore" title="Black Friday MegaStore" border="0" thid="12345678" />
```

## Exemplo avançado

Imagine uma régua de relacionamento da Lojas Vitória onde cada categoria de produto tem um banner específico. Você monta a external key dinamicamente com base na categoria do cliente e garante que, se o banner da categoria não existir, um banner institucional será exibido:

```ampscript
%%[
  SET @categoria = AttributeValue("CategoriaPreferida")

  IF Empty(@categoria) THEN
    SET @categoria = "geral"
  ENDIF

  SET @chaveImagem = Concat("banner-vitoria-", Lowercase(@categoria))
  SET @chaveFallback = "banner-vitoria-institucional"
]%%

%%=ContentImageByKey(@chaveImagem, @chaveFallback)=%%
```

**Saída (quando a categoria é "Eletrônicos"):**
```html
<img src="https://image.s11.sfmc-content.com/lib/fe3a.../banner-vitoria-eletronicos.jpg" alt="Eletrônicos Lojas Vitória" title="Eletrônicos Lojas Vitória" border="0" thid="98765432" />
```

**Saída (quando a categoria não tem banner cadastrado):**
```html
<img src="https://image.s11.sfmc-content.com/lib/fe3a.../banner-vitoria-institucional.jpg" alt="Lojas Vitória" title="Lojas Vitória" border="0" thid="11223344" />
```

## Observações

- A função retorna uma tag `<img>` completa e pronta para uso no HTML do e-mail. Você não precisa montar a tag manualmente.
- Os atributos `alt`, `title`, `border` e `thid` são incluídos automaticamente na tag gerada. O `alt` e `title` vêm das propriedades definidas na imagem dentro do Content Builder - então garanta que esses campos estejam preenchidos para manter a acessibilidade dos seus e-mails.
- O segundo parâmetro (fallback) é obrigatório, o que é ótimo para evitar imagens quebradas em produção. Mantenha sempre uma imagem genérica válida como fallback.

> **⚠️ Atenção:** Essa função só funciona com conteúdo do tipo **Image** no Content Builder. Se você tentar usar a external key de um **Image Block**, a função não vai retornar o resultado esperado.

> **💡 Dica:** Ao montar a external key dinamicamente (como no exemplo avançado), use [Lowercase](../string-functions/lowercase.md) para padronizar e evitar erros de case sensitivity na busca da imagem.

## Funções relacionadas

- [ContentImageById](../content-functions/contentimagebyid.md) - mesma lógica, mas localiza a imagem pelo ID numérico em vez da external key.
- [ContentBlockByKey](../content-functions/contentblockbykey.md) - para inserir blocos de conteúdo completos (não apenas imagens) via external key.
- [Image](../content-functions/image.md) - função para trabalhar com imagens do Portfolio (Classic).
- [ImageById](../content-functions/imagebyid.md) - função para imagens do Portfolio usando ID.
- [Concat](../string-functions/concat.md) - útil para montar external keys dinâmicas combinando strings.
- [Empty](../utility-functions/empty.md) - para validar se um valor está vazio antes de montar a key.
- [AttributeValue](../utility-functions/attributevalue.md) - para capturar atributos do assinante de forma segura.