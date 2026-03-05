---
title: HTTPGetWrap
sidebar_label: HTTPGetWrap
description: Prefixo aplicado em links dentro de conteúdo HTML externo (syndicated content) para habilitar o rastreamento de cliques pelo Marketing Cloud.
---

# HTTPGetWrap

## Descrição

`HTTPGetWrap` não é uma função AMPscript tradicional - é um **prefixo** que você aplica no atributo `href` de links dentro de conteúdo HTML externo, carregado via syndicated content (como [HTTPGet](../http-functions/httpget.md)). Quando o Marketing Cloud busca HTML de uma URL externa, os links desse conteúdo não passam pelo wrapper de rastreamento de cliques por padrão. Ao adicionar o prefixo `HTTPGetWrap|` antes da URL no HTML externo, você instrui o Marketing Cloud a aplicar o rastreamento de cliques nesses links, permitindo que apareçam nos relatórios de tracking normalmente.

## Sintaxe

No HTML do conteúdo externo (o arquivo que será buscado pelo Marketing Cloud):

```html
<a href="HTTPGetWrap|http://exemplo.com.br/pagina">texto do link</a>
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| URL | String | Sim | A URL de destino do link, precedida pelo prefixo `HTTPGetWrap\|`. O prefixo é inserido diretamente no atributo `href` do HTML externo, separado da URL por um pipe (`\|`). |

## Exemplo básico

Imagine que a Lojas Vitória hospeda um HTML com ofertas em um servidor externo e esse conteúdo é puxado para o e-mail via syndicated content. Para que o clique no link de produto seja rastreado, o HTML externo precisa usar o prefixo:

```html
<!-- Este HTML fica no servidor externo (ex: https://conteudo.lojasvitoria.com.br/ofertas.html) -->

<h2>Oferta da Semana</h2>
<p>Smartphone Galaxy por apenas R$ 1.299,90!</p>
<a href="HTTPGetWrap|https://www.lojasvitoria.com.br/produto/smartphone-galaxy">Ver produto</a>
```

No e-mail dentro do Marketing Cloud, você puxa esse conteúdo:

```ampscript
%%=HTTPGet("https://conteudo.lojasvitoria.com.br/ofertas.html")=%%
```

**Saída no e-mail (após processamento):**

```html
<h2>Oferta da Semana</h2>
<p>Smartphone Galaxy por apenas R$ 1.299,90!</p>
<a href="https://click.seudominio.com.br/tracking?url=https://www.lojasvitoria.com.br/produto/smartphone-galaxy">Ver produto</a>
```

O link agora passa pelo wrapper de rastreamento do Marketing Cloud.

## Exemplo avançado

A MegaStore mantém um servidor que gera HTML dinâmico com múltiplos produtos. O conteúdo externo precisa ter o prefixo em cada link que deve ser rastreado:

```html
<!-- HTML no servidor externo: https://api.megastore.com.br/email/destaques.html -->

<table>
  <tr>
    <td>
      <h3>Notebook Pro 15"</h3>
      <p>De R$ 4.999,00 por R$ 3.799,90</p>
      <a href="HTTPGetWrap|https://www.megastore.com.br/notebook-pro-15">Comprar agora</a>
    </td>
    <td>
      <h3>Fone Bluetooth Elite</h3>
      <p>De R$ 399,00 por R$ 249,90</p>
      <a href="HTTPGetWrap|https://www.megastore.com.br/fone-bluetooth-elite">Comprar agora</a>
    </td>
  </tr>
  <tr>
    <td colspan="2">
      <a href="HTTPGetWrap|https://www.megastore.com.br/ofertas?utm_source=email&utm_medium=syndicated">
        Ver todas as ofertas
      </a>
    </td>
  </tr>
</table>
```

No template de e-mail do Marketing Cloud:

```ampscript
%%[
  VAR @urlConteudo
  SET @urlConteudo = "https://api.megastore.com.br/email/destaques.html"
]%%

%%=HTTPGet(@urlConteudo)=%%
```

**Saída:**

```html
<table>
  <tr>
    <td>
      <h3>Notebook Pro 15"</h3>
      <p>De R$ 4.999,00 por R$ 3.799,90</p>
      <a href="https://click.seudominio.com.br/tracking?url=https://www.megastore.com.br/notebook-pro-15">Comprar agora</a>
    </td>
    <td>
      <h3>Fone Bluetooth Elite</h3>
      <p>De R$ 399,00 por R$ 249,90</p>
      <a href="https://click.seudominio.com.br/tracking?url=https://www.megastore.com.br/fone-bluetooth-elite">Comprar agora</a>
    </td>
  </tr>
  <tr>
    <td colspan="2">
      <a href="https://click.seudominio.com.br/tracking?url=https://www.megastore.com.br/ofertas?utm_source=email&utm_medium=syndicated">
        Ver todas as ofertas
      </a>
    </td>
  </tr>
</table>
```

Todos os links agora são rastreados nos relatórios de clique do Marketing Cloud.

## Observações

> **⚠️ Atenção:** O prefixo `HTTPGetWrap|` **precisa ser habilitado pelo Suporte da Salesforce**. A business rule que ativa essa funcionalidade se chama **WRAP_HTTPGET_URLS**. Sem essa regra ativada na sua conta, o prefixo será ignorado e os links não serão rastreados. Abra um case com o suporte solicitando a ativação antes de implementar.

> **⚠️ Atenção:** O prefixo `HTTPGetWrap|` é aplicado **no HTML do servidor externo**, e não no código AMPscript do e-mail. Quem edita é o desenvolvedor que controla o conteúdo externo - é fundamental alinhar isso com a equipe responsável pelo servidor que hospeda o HTML.

> **💡 Dica:** Esse recurso é essencial quando você trabalha com conteúdo sindicalizado (syndicated content) - cenário comum em operações brasileiras onde uma equipe de produto ou e-commerce mantém o HTML de ofertas em um CMS separado, e o Marketing Cloud apenas consome esse conteúdo. Sem o `HTTPGetWrap|`, você perde toda a visibilidade de cliques nesses links nos relatórios de tracking.

## Funções relacionadas

- [HTTPGet](../http-functions/httpget.md) - função que busca o conteúdo HTML externo onde o prefixo `HTTPGetWrap|` é utilizado
- [BeforeHTTPGet](../http-functions/beforehttpget.md) - executada antes da chamada HTTPGet
- [AfterHTTPGet](../http-functions/afterhttpget.md) - executada após a chamada HTTPGet
- [RedirectTo](../http-functions/redirectto.md) - redireciona para uma URL com rastreamento de cliques
- [WrapLongURL](../http-functions/wraplongurl.md) - encapsula URLs longas para rastreamento
- [ContentBlockByName](../content-functions/contentblockbyname.md) - alternativa para incluir conteúdo reutilizável sem depender de servidor externo