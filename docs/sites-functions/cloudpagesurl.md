---
title: CloudPagesURL
sidebar_label: CloudPagesURL
description: Gera uma URL de CloudPage com query string criptografada em AES-GCM para uso em e-mails.
---

# CloudPagesURL

## Descrição

Retorna uma URL de CloudPage com a query string criptografada em AES-GCM. Use essa função para criar links em e-mails que direcionam para landing pages, passando dados do cliente de forma segura (criptografada) em vez de texto puro. A query string inclui uma referência ao e-mail, permitindo que você use personalization strings na landing page para acessar valores associados ao envio.

## Sintaxe

```ampscript
CloudPagesURL(pageId, parameterName1, parameterValue1, [parameterName2, parameterValue2, ...])
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| pageId | Número | Sim | ID da landing page no CloudPages. Você encontra esse ID na página de detalhes do conteúdo da landing page. |
| parameterName1 | String | Sim | Nome do parâmetro que será incluído na query string criptografada. |
| parameterValue1 | String | Sim | Valor do parâmetro que será incluído na query string criptografada. |

Você pode passar quantos pares de nome/valor quiser, basta adicionar ao final da função.

> **⚠️ Atenção:** Os seguintes nomes são reservados e **não podem** ser usados como nomes de parâmetros: `PAGEID`, `MID`, `JID`, `LID`, `SID`, `JSB`, `URLID`.

## Exemplo básico

Gerando um link para uma CloudPage de atualização cadastral, passando o e-mail e o nome do assinante de forma criptografada:

```ampscript
%%[
SET @nome = "Maria Santos"
SET @email = "maria.santos@email.com.br"
SET @cpf = "123.456.789-00"

SET @urlCadastro = CloudPagesURL(845, 'Nome', @nome, 'Email', @email, 'CPF', @cpf)
]%%

<a href="%%=v(@urlCadastro)=%%">Atualize seus dados cadastrais</a>
```

**Saída:**
```html
<a href="https://pub.s10.exacttarget.com/xxxxxxxx?p=eyJhbGciOiJkaXIiLCJlbm...">Atualize seus dados cadastrais</a>
```

## Exemplo avançado

Em uma régua de relacionamento da MegaStore, o e-mail envia o cliente para uma landing page de pesquisa de satisfação. Como a conta usa integração com Google Analytics, combinamos `CloudPagesURL` com [RedirectTo](../http-functions/redirectto.md) e [Concat](../string-functions/concat.md) para evitar que os parâmetros de analytics quebrem o link:

```ampscript
%%[
SET @nome = "João Silva"
SET @pedido = "PED-2024-00587"
SET @valor = "R$ 1.299,90"
SET @cidade = "São Paulo"

SET @urlBase = CloudPagesURL(1023, 'NomeCliente', @nome, 'Pedido', @pedido, 'ValorCompra', @valor, 'Cidade', @cidade)
SET @urlFinal = Concat(@urlBase, '&utm_source=sfmc&utm_medium=email&utm_campaign=pesquisa_satisfacao')
]%%

<a href="%%=RedirectTo(@urlFinal)=%%">Conte como foi sua experiência</a>
```

**Saída:**
```html
<a href="https://pub.s10.exacttarget.com/xxxxxxxx?p=eyJhbGciOiJkaXIiLCJlbm...&utm_source=sfmc&utm_medium=email&utm_campaign=pesquisa_satisfacao">Conte como foi sua experiência</a>
```

> **💡 Dica:** Na landing page, use [RequestParameter](../sites-functions/requestparameter.md) ou [QueryParameter](../sites-functions/queryparameter.md) para recuperar os valores dos parâmetros que você passou. Por exemplo: `SET @nome = RequestParameter('NomeCliente')`.

## Observações

- Essa função foi projetada para uso em **e-mails**. Se você usá-la em SMS ou push messages, a landing page retornará erro caso o assinante não seja membro da lista All Subscribers.

- O ID da landing page fica disponível na página de detalhes do conteúdo dentro do CloudPages.

- Você pode incluir quantos pares de parâmetro nome/valor forem necessários — não há limite documentado.

> **⚠️ Atenção:** Se a sua conta utiliza a integração com Google Analytics para adicionar tags automaticamente aos links, use a combinação com [RedirectTo](../http-functions/redirectto.md) e [Concat](../string-functions/concat.md) conforme o exemplo avançado. Isso é necessário para evitar que os parâmetros adicionais de analytics gerem links quebrados.

> **⚠️ Atenção:** Não use os nomes reservados (`PAGEID`, `MID`, `JID`, `LID`, `SID`, `JSB`, `URLID`) como nomes de parâmetros na query string. Eles são usados internamente pelo sistema.

## Funções relacionadas

- [RedirectTo](../http-functions/redirectto.md) — necessária ao combinar `CloudPagesURL` com parâmetros extras como UTMs do Google Analytics
- [Concat](../string-functions/concat.md) — usada para concatenar a URL gerada com parâmetros adicionais
- [RequestParameter](../sites-functions/requestparameter.md) — recupera valores dos parâmetros na landing page
- [QueryParameter](../sites-functions/queryparameter.md) — alternativa para recuperar valores dos parâmetros na landing page