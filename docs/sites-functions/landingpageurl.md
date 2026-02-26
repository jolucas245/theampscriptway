---
title: LandingPageURL
sidebar_label: LandingPageURL
description: Gera a URL de uma Landing Page (Microsite Page) do Marketing Cloud, permitindo passar parâmetros personalizados como query strings criptografadas.
---

# LandingPageURL

## Descrição

A função `LandingPageURL` gera a URL completa de uma Landing Page criada no Classic Email (Microsites) do Salesforce Marketing Cloud. Ela permite que você passe parâmetros adicionais como pares nome-valor, que são criptografados automaticamente na query string da URL gerada. Essa função é usada dentro de e-mails para criar links personalizados que direcionam o assinante para uma landing page com contexto específico.

> ⚠️ **Função legada (deprecated):** `LandingPageURL` faz parte da funcionalidade de Microsites/Landing Pages clássicas do SFMC. Para novos projetos, a Salesforce recomenda usar **CloudPages** com a função [CloudPagesURL](../sites-functions/cloudpagesurl.md), que é a alternativa moderna e suportada.

## Sintaxe

```ampscript
LandingPageURL("NomeDaLandingPage", "param1", "valor1", "param2", "valor2", ...)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| NomeDaLandingPage | String | Sim | Nome da Landing Page (Microsite Page) cadastrada no Marketing Cloud. |
| param1 | String | Não | Nome do primeiro parâmetro adicional a ser passado na URL. |
| valor1 | String | Não | Valor correspondente ao primeiro parâmetro. |
| paramN | String | Não | Pares adicionais de nome-valor podem ser incluídos conforme necessário. |

Os parâmetros adicionais são passados em pares (nome, valor) e são criptografados na query string da URL resultante. Na landing page de destino, você recupera esses valores usando [RequestParameter](../sites-functions/requestparameter.md) ou [QueryParameter](../sites-functions/queryparameter.md).

## Exemplo básico

Imagine que a "MegaStore" tem uma landing page clássica chamada `PromoNatal` e quer enviar um e-mail com link personalizado para cada assinante:

```ampscript
%%[
VAR @urlPromo
SET @urlPromo = LandingPageURL("PromoNatal")
]%%

<a href="%%=RedirectTo(@urlPromo)=%%">Veja suas ofertas exclusivas de Natal!</a>
```

**Saída:**
```html
<a href="https://pub.s10.exacttarget.com/xxxxxxxxx">Veja suas ofertas exclusivas de Natal!</a>
```

## Exemplo avançado

A "Lojas Vitória" quer direcionar cada cliente para uma landing page com informações personalizadas: o ID do cliente, a categoria de interesse e o valor de um cupom de desconto. Tudo isso é passado como parâmetros criptografados na URL:

```ampscript
%%[
VAR @email, @idCliente, @categoria, @valorCupom, @urlLanding

SET @email = AttributeValue("EmailAddress")
SET @idCliente = AttributeValue("IdCliente")
SET @categoria = AttributeValue("CategoriaPreferida")
SET @valorCupom = "50"

SET @urlLanding = LandingPageURL(
  "OfertasDiaDasMaes",
  "cid", @idCliente,
  "cat", @categoria,
  "cupom", @valorCupom
)
]%%

Olá, %%=AttributeValue("PrimeiroNome")=%%!

Preparamos ofertas especiais de Dia das Mães na categoria %%=v(@categoria)=%% com desconto de R$ %%=v(@valorCupom)=%%!

<a href="%%=RedirectTo(@urlLanding)=%%">Acessar minhas ofertas personalizadas</a>
```

Na **landing page de destino** (`OfertasDiaDasMaes`), você recupera os parâmetros assim:

```ampscript
%%[
VAR @idCliente, @categoria, @valorCupom

SET @idCliente = RequestParameter("cid")
SET @categoria = RequestParameter("cat")
SET @valorCupom = RequestParameter("cupom")

/* Buscar dados do cliente para personalizar a página */
VAR @nomeCliente
SET @nomeCliente = Lookup("Clientes", "NomeCompleto", "IdCliente", @idCliente)
]%%

<h1>Olá, %%=v(@nomeCliente)=%%!</h1>
<p>Aqui estão suas ofertas de Dia das Mães em <strong>%%=v(@categoria)=%%</strong>.</p>
<p>Use seu cupom de <strong>R$ %%=v(@valorCupom)=%%</strong> de desconto!</p>
```

**Saída (no e-mail):**
```
Olá, Maria Santos!

Preparamos ofertas especiais de Dia das Mães na categoria Bolsas com desconto de R$ 50!

[Link: Acessar minhas ofertas personalizadas]
```

## Observações

- ⚠️ **Função legada:** `LandingPageURL` funciona com as Landing Pages clássicas (Microsites) do SFMC. Esse recurso foi substituído por **CloudPages**. Para novos desenvolvimentos, use [CloudPagesURL](../sites-functions/cloudpagesurl.md).
- A função deve ser usada dentro de **e-mails**. Ela gera uma URL que aponta para uma página hospedada no SFMC.
- Os parâmetros adicionais são **criptografados** automaticamente na query string, o que ajuda a proteger dados sensíveis como IDs de clientes.
- Na landing page de destino, use [RequestParameter](../sites-functions/requestparameter.md) ou [QueryParameter](../sites-functions/queryparameter.md) para recuperar os valores passados.
- Sempre envolva a URL retornada com [RedirectTo](../http-functions/redirectto.md) ao usá-la em links `<a href="">` para garantir o rastreamento correto de cliques.
- Se a landing page referenciada pelo nome não existir ou estiver inativa, a função pode gerar um erro ou retornar uma URL inválida. Certifique-se de que o nome corresponde exatamente ao cadastrado no SFMC.
- A função é muito semelhante a [MicrositeURL](../sites-functions/micrositeurl.md) — ambas trabalham com o contexto de Microsites/Landing Pages clássicas.
- Não confunda com [CloudPagesURL](../sites-functions/cloudpagesurl.md), que é a versão moderna e recomendada para CloudPages.

## Funções relacionadas

- [CloudPagesURL](../sites-functions/cloudpagesurl.md) — alternativa moderna e recomendada; gera URLs para CloudPages com parâmetros criptografados
- [MicrositeURL](../sites-functions/micrositeurl.md) — gera URLs para Microsites clássicos, funcionalidade similar
- [LiveContentMicrositeURL](../sites-functions/livecontentmicrositeurl.md) — gera URLs para conteúdo dinâmico em Microsites
- [RedirectTo](../http-functions/redirectto.md) — encapsula URLs para garantir rastreamento de cliques no e-mail
- [Redirect](../sites-functions/redirect.md) — redireciona o navegador para uma URL específica em landing pages
- [RequestParameter](../sites-functions/requestparameter.md) — recupera parâmetros passados na URL dentro de landing pages
- [QueryParameter](../sites-functions/queryparameter.md) — recupera parâmetros de query string na página de destino
- [Concat](../string-functions/concat.md) — concatena strings, útil para montar valores dinâmicos dos parâmetros
- [URLEncode](../string-functions/urlencode.md) — codifica valores para uso seguro em URLs