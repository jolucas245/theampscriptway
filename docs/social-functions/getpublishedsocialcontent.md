---
title: GetPublishedSocialContent
sidebar_label: GetPublishedSocialContent
description: Retorna o conteúdo publicado para compartilhamento em redes sociais com base no ID da região especificada.
---

<!-- generated-by-script -->

# GetPublishedSocialContent

## Descrição

A função `GetPublishedSocialContent` retorna o conteúdo configurado para compartilhamento em uma rede social, identificado pelo ID da região (region ID) da área de conteúdo social. Pense nela como uma forma de puxar dinamicamente o conteúdo que foi preparado para ser compartilhado nas redes sociais do seu assinante. Essa função é de uso exclusivo em **Landing Pages** ou no recurso **Social Forward** do Marketing Cloud — ela não funciona em emails comuns ou em outros contextos.

## Sintaxe

```ampscript
GetPublishedSocialContent(regionId)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|--------|-------------|-----------|
| regionId | String | Sim | O ID da região (region ID) da área de conteúdo social configurada no Marketing Cloud. |

## Exemplo básico

Imagine que a **Lojas Vitória** configurou uma região de conteúdo social chamada `SocialRegion` para a campanha de Dia das Mães. Numa Landing Page, você pode recuperar esse conteúdo assim:

```ampscript
%%[
VAR @conteudoSocial
SET @conteudoSocial = GetPublishedSocialContent("SocialRegion")
]%%

%%=v(@conteudoSocial)=%%
```

**Saída:**
```
🌹 Dia das Mães na Lojas Vitória! Presentes a partir de R$49,90 com frete grátis acima de R$299. Acesse: www.lojasvitoria.com.br/maes
```

## Exemplo avançado

Agora digamos que a **MegaStore** quer montar uma Landing Page de Social Forward para a campanha de Black Friday, combinando o conteúdo social com informações personalizadas do assinante. Nesse cenário, a página exibe o conteúdo social publicado e uma mensagem personalizada incentivando o compartilhamento:

```ampscript
%%[
VAR @conteudoSocial, @nomeAssinante, @mensagemFinal

SET @conteudoSocial = GetPublishedSocialContent("BlackFridayRegion")
SET @nomeAssinante = AttributeValue("FirstName")
SET @nomeAssinante = IIF(Empty(@nomeAssinante), "Amigo(a)", ProperCase(@nomeAssinante))

SET @mensagemFinal = Concat(
  "Oi, ", @nomeAssinante, "! Compartilhe essa oferta incrível com seus amigos:"
)
]%%

<h2>%%=v(@mensagemFinal)=%%</h2>
<div class="social-content">
  %%=v(@conteudoSocial)=%%
</div>
<p>Aproveite a Black Friday MegaStore — descontos de até 70% e cashback de R$50 em compras acima de R$299!</p>
```

**Saída:**
```
Oi, Maria! Compartilhe essa oferta incrível com seus amigos:

🔥 Black Friday MegaStore! Até 70% OFF + cashback de R$50. Corre que é só até 24/11/2024! www.megastore.com.br/blackfriday

Aproveite a Black Friday MegaStore — descontos de até 70% e cashback de R$50 em compras acima de R$299!
```

## Observações

- ⚠️ **Contexto restrito:** essa função funciona **apenas** em Landing Pages e no recurso **Social Forward**. Ela **não** vai funcionar em emails, SMS ou outros contextos do Marketing Cloud.
- O parâmetro `regionId` precisa corresponder exatamente ao ID da região de conteúdo social configurada na sua conta. Se o ID estiver errado ou não existir, a função não vai retornar conteúdo útil.
- Essa é uma função bastante específica e de uso relativamente raro. Ela está atrelada ao recurso de Social Forward, que permite que assinantes compartilhem conteúdo de email nas redes sociais.
- Se você não utiliza o recurso Social Forward na sua conta, provavelmente não vai precisar dessa função.
- Certifique-se de que o conteúdo social já foi publicado antes de tentar recuperá-lo com essa função.

## Funções relacionadas

- [GetSocialPublishUrl](../social-functions/getsocialpublishurl.md) — retorna a URL de publicação social para uma rede específica
- [GetSocialPublishUrlByName](../social-functions/getsocialpublishurlbyname.md) — retorna a URL de publicação social pelo nome da rede
- [ContentBlockByName](../content-functions/contentblockbyname.md) — recupera blocos de conteúdo pelo nome, útil para montar Landing Pages dinâmicas
- [AttributeValue](../utility-functions/attributevalue.md) — obtém o valor de um atributo do assinante, útil para personalização
- [V](../utility-functions/v.md) — exibe o valor de uma variável inline no HTML
- [CloudPagesURL](../sites-functions/cloudpagesurl.md) — gera URLs para CloudPages, contexto onde essa função pode ser usada
- [RedirectTo](../http-functions/redirectto.md) — redireciona o usuário para uma URL, útil em Landing Pages sociais