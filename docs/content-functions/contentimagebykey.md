---
title: ContentImageByKey
sidebar_label: ContentImageByKey
description: Retorna uma tag img HTML com o caminho de uma imagem armazenada no Content Builder, usando a chave externa da imagem.
---

<!-- generated-by-script -->

# ContentImageByKey

## Descrição

A função `ContentImageByKey` retorna uma tag `<img>` completa apontando para uma imagem armazenada no Content Builder, usando a chave externa (external key) da imagem como referência. A tag gerada inclui automaticamente os atributos `src`, `title`, `alt`, `border="0"` e um atributo `thid` com o ID interno da imagem. Essa função é ideal quando você precisa inserir imagens dinâmicas em emails ou CloudPages e quer ter um fallback caso a imagem principal não seja encontrada. **Importante:** ela funciona apenas com conteúdo do tipo **Image** no Content Builder — não funciona com blocos do tipo Image Block.

## Sintaxe

```ampscript
ContentImageByKey(imageExternalKey, defaultImageExternalKey)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| imageExternalKey | String | Sim | A chave externa (external key) da imagem no Content Builder que você deseja exibir. |
| defaultImageExternalKey | String | Sim | A chave externa de uma imagem de fallback no Content Builder. Será usada caso a imagem do primeiro parâmetro não seja encontrada. |

## Exemplo básico

Imagine que a **MegaStore** quer exibir o banner de uma promoção de Dia das Mães no email. A imagem do banner tem a chave externa `banner-dia-das-maes-2024` e, caso ela não exista, uma imagem genérica com a chave `banner-padrao-megastore` será exibida.

```ampscript
%%=ContentImageByKey("banner-dia-das-maes-2024", "banner-padrao-megastore")=%%
```

**Saída (quando a imagem principal é encontrada):**
```html
<img src="https://image.s11.sfmc-content.com/lib/fe3e15/m/1/banner-dia-das-maes.jpg" title="Banner Dia das Mães MegaStore" alt="Banner Dia das Mães MegaStore" border="0" thid="12345" />
```

**Saída (quando a imagem principal NÃO é encontrada):**
```html
<img src="https://image.s11.sfmc-content.com/lib/fe3e15/m/1/banner-padrao.jpg" title="Banner Padrão MegaStore" alt="Banner Padrão MegaStore" border="0" thid="67890" />
```

## Exemplo avançado

Aqui temos um cenário real da **Lojas Vitória**, que envia um email personalizado com uma imagem de categoria baseada na preferência de cada cliente. A chave externa da imagem é montada dinamicamente com base em um campo da Data Extension.

```ampscript
%%[
  SET @emailAssinante = AttributeValue("EmailAddress")
  SET @categoriaFavorita = Lookup("DE_Preferencias_Clientes", "CategoriaFavorita", "Email", @emailAssinante)

  IF Empty(@categoriaFavorita) THEN
    SET @categoriaFavorita = "geral"
  ENDIF

  SET @chaveImagem = Concat("vitoria-categoria-", Lowercase(@categoriaFavorita))
  SET @chaveFallback = "vitoria-categoria-geral"
]%%

<h2>Ofertas especiais pra você!</h2>
<p>Confira as promoções na sua categoria favorita com frete grátis acima de R$299:</p>

%%=ContentImageByKey(@chaveImagem, @chaveFallback)=%%

<p>Aproveite! Válido até 31/12/2024.</p>
```

**Saída (para um cliente cuja categoria favorita é "eletronicos"):**
```html
<h2>Ofertas especiais pra você!</h2>
<p>Confira as promoções na sua categoria favorita com frete grátis acima de R$299:</p>

<img src="https://image.s11.sfmc-content.com/lib/ab1234/m/1/vitoria-eletronicos.jpg" title="Categoria Eletrônicos" alt="Categoria Eletrônicos" border="0" thid="11223" />

<p>Aproveite! Válido até 31/12/2024.</p>
```

**Saída (quando a categoria não é encontrada ou está vazia):**
```html
<h2>Ofertas especiais pra você!</h2>
<p>Confira as promoções na sua categoria favorita com frete grátis acima de R$299:</p>

<img src="https://image.s11.sfmc-content.com/lib/ab1234/m/1/vitoria-geral.jpg" title="Categoria Geral" alt="Categoria Geral" border="0" thid="44556" />

<p>Aproveite! Válido até 31/12/2024.</p>
```

## Observações

- **Funciona apenas com imagens do tipo Image no Content Builder.** Não funciona com conteúdo do tipo Image Block. Se você tentar usar a chave de um Image Block, a função não vai encontrar a imagem e vai usar o fallback.
- **O segundo parâmetro (fallback) é obrigatório.** Sempre tenha uma imagem padrão cadastrada no Content Builder para garantir que o email nunca fique sem imagem.
- **A tag `<img>` gerada inclui automaticamente** os atributos `src`, `title`, `alt`, `border="0"` e `thid`. Você não tem controle direto sobre esses atributos via parâmetros da função — se precisar de mais controle (como `width`, `height` ou `style`), considere envolver a saída em HTML customizado ou usar a função [ImageByKey](../content-functions/imagebykey.md) combinada com HTML manual.
- **As chaves externas são case-sensitive na maioria dos contextos.** Certifique-se de que a chave passada corresponde exatamente à chave cadastrada no Content Builder.
- **Se ambas as imagens (principal e fallback) não forem encontradas**, o comportamento pode resultar em uma tag `<img>` quebrada. Sempre valide que a imagem de fallback existe antes de enviar.
- **Para montar chaves dinâmicas**, combine com funções como [Concat](../string-functions/concat.md) e [Lowercase](../string-functions/lowercase.md), como mostrado no exemplo avançado.

## Funções relacionadas

- [ContentImageById](../content-functions/contentimagebyid.md) — Faz o mesmo que `ContentImageByKey`, mas usa o ID numérico da imagem em vez da chave externa.
- [ImageByKey](../content-functions/imagebykey.md) — Retorna a URL de uma imagem do Content Builder pela chave externa (sem gerar a tag `<img>` completa).
- [ImageById](../content-functions/imagebyid.md) — Retorna a URL de uma imagem do Content Builder pelo ID numérico.
- [Image](../content-functions/image.md) — Insere uma imagem usando referência direta.
- [ContentBlockByKey](../content-functions/contentblockbykey.md) — Insere um bloco de conteúdo do Content Builder pela chave externa (útil para blocos que não são imagens).
- [Lookup](../data-extension-functions/lookup.md) — Busca valores em Data Extensions, útil para determinar dinamicamente qual imagem exibir.
- [Concat](../string-functions/concat.md) — Concatena strings, ideal para montar chaves externas dinâmicas.
- [Empty](../utility-functions/empty.md) — Verifica se um valor está vazio, útil para validar dados antes de montar a chave da imagem.