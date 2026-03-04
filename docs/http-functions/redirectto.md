---
title: RedirectTo
sidebar_label: RedirectTo
description: Cria um link rastreável em e-mails HTML a partir de URLs armazenados em atributos, campos de data extension ou variáveis.
---

# RedirectTo

## Descrição

A função `RedirectTo` cria um link clicável usando uma URL que vem de um atributo, campo de data extension ou variável. É essencial quando você precisa montar links dinâmicos em e-mails — por exemplo, direcionar cada cliente para uma oferta personalizada na sua régua de relacionamento. A função deve ser usada exclusivamente dentro do atributo `href` de uma tag `<a>` em e-mails HTML.

## Sintaxe

```ampscript
RedirectTo(@urlAlvo)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| targetUrl | String | Sim | A URL de destino para onde o link deve redirecionar o usuário. |

## Exemplo básico

Um e-mail da MegaStore que exibe links de ofertas personalizadas para cada cliente, buscando a URL diretamente de uma data extension chamada `Ofertas_Cliente`.

```ampscript
%%[

SET @clienteId = AttributeValue("Customer_ID")
SET @linksOfertas = LookupRows("Ofertas_Cliente", "Customer_ID", @clienteId)

FOR @i = 1 TO RowCount(@linksOfertas) DO

  SET @linha = Row(@linksOfertas, @i)
  SET @tipo = Field(@linha, "Tipo")
  SET @link = Field(@linha, "Link")

]%%

<a href="%%=RedirectTo(@link)=%%" title="%%=v(@tipo)=%%">
  Veja as ofertas de %%=v(@tipo)=%%
</a>

%%[ NEXT @i ]%%
```

Considerando a data extension `Ofertas_Cliente`:

| Customer_ID | Tipo | Link |
|---|---|---|
| 123 | Eletrônicos | http://megastore.com.br/eletronicos/ |
| 123 | Roupas | http://megastore.com.br/roupas/ |

**Saída:**

```html
<a href="http://megastore.com.br/eletronicos/" title="Eletrônicos">
  Veja as ofertas de Eletrônicos
</a>

<a href="http://megastore.com.br/roupas/" title="Roupas">
  Veja as ofertas de Roupas
</a>
```

## Exemplo avançado

Uma régua de relacionamento do Banco Meridional envia um e-mail com link personalizado para simulação de crédito, concatenando o ID do cliente na URL para rastreamento no site de destino.

```ampscript
%%[

SET @clienteId = AttributeValue("Customer_ID")
SET @nome = AttributeValue("PrimeiroNome")
SET @urlBase = "https://bancomericional.com.br/simulacao/"
SET @urlCompleta = Concat(@urlBase, "?cliente=", @clienteId)

]%%

<p>Olá, %%=v(@nome)=%%. Preparamos uma simulação exclusiva para você.</p>

<a href="%%=RedirectTo(@urlCompleta)=%%">
  Simule seu crédito agora
</a>
```

**Saída:**

```html
<p>Olá, João. Preparamos uma simulação exclusiva para você.</p>

<a href="https://bancomericional.com.br/simulacao/?cliente=123">
  Simule seu crédito agora
</a>
```

## Observações

> **⚠️ Atenção:** Use `RedirectTo` **somente** em e-mails HTML, dentro do atributo `href` de uma tag `<a>`. Para e-mails em formato texto, inclua o prefixo `http://` na URL e garanta que **não haja espaços** dentro dos parênteses da função.

> **⚠️ Atenção:** Para que as informações de rastreamento de cliques funcionem corretamente, as tags `<a>...</a>` devem estar **no corpo do e-mail em si**, e não dentro do conteúdo que você recupera via esta função. Se a âncora vier de uma variável ou de um campo de data extension já montada como HTML, o tracking não será registrado.

> **⚠️ Atenção:** A função `RedirectTo` fornece informações de rastreamento **apenas** para links clicáveis em mensagens de e-mail. Você **não consegue** obter dados de rastreamento quando usa esta função com URLs armazenadas em variáveis ou usadas como parte de parâmetros de query string.

> **💡 Dica:** Quando precisar montar URLs dinâmicas combinando uma base fixa com dados do cliente (como ID ou CPF), use [Concat](../string-functions/concat.md) para construir a URL completa antes de passá-la para `RedirectTo`.

## Funções relacionadas

- [Concat](../string-functions/concat.md) — para construir URLs dinâmicas concatenando strings antes de redirecionar
- [Lookup](../data-extension-functions/lookup.md) — para buscar uma URL específica de uma data extension
- [LookupRows](../data-extension-functions/lookuprows.md) — para recuperar múltiplos links de uma data extension
- [Field](../data-extension-functions/field.md) — para extrair o valor da URL de uma linha retornada por `LookupRows`
- [CloudPagesURL](../sites-functions/cloudpagesurl.md) — para gerar URLs de CloudPages com parâmetros criptografados
- [WrapLongURL](../http-functions/wraplongurl.md) — para evitar quebra de URLs longas em clientes de e-mail
- [URLEncode](../string-functions/urlencode.md) — para codificar valores que serão incluídos como parâmetros na URL