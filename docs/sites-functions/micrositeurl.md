---
title: MicrositeURL
sidebar_label: MicrositeURL
description: Retorna a URL de um microsite criado no Classic Content com query string criptografada.
---

# MicrositeURL

## Descrição

A função `MicrositeURL` gera a URL de um microsite criado no Classic Content, criptografando automaticamente os parâmetros da query string. Use essa função quando precisar criar links para microsites a partir de e-mails, garantindo que dados sensíveis dos clientes (como CPF, ID ou qualquer informação pessoal) não trafeguem em texto puro na URL. Ela retorna a URL completa com os parâmetros criptografados.

## Sintaxe

```ampscript
MicrositeURL(pageId [, parameterName1, parameterValue1, ...])
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| pageId | Número | Sim | ID da página do microsite criado no Classic Content. |
| parameterName1 | String | Não | Nome do parâmetro que você quer incluir na query string criptografada. |
| parameterValue1 | String | Não | Valor do parâmetro correspondente que será criptografado na query string. |

Você pode passar quantos pares de nome/valor forem necessários, adicionando-os ao final da função.

## Exemplo básico

Gerando um link para um microsite de confirmação de cadastro da Lojas Vitória, passando o e-mail do cliente como parâmetro criptografado:

```ampscript
%%=MicrositeURL(1234, 'email', 'joao.silva@email.com.br')=%%
```

**Saída:**
```
http://pub.s10.exacttarget.com/xxxxxxxxx?qs=abc123def456...
```

## Exemplo avançado

Em uma régua de relacionamento do Banco Brasilão, você precisa direcionar o cliente para um microsite de atualização cadastral, passando múltiplos parâmetros criptografados. Para adicionar query strings extras à URL, use [Concat](../string-functions/concat.md) para inserir um `&` após a URL gerada:

```ampscript
%%[
  VAR @nome, @cpf, @contaId, @urlMicrosite, @urlFinal

  SET @nome = "Maria Santos"
  SET @cpf = "123.456.789-00"
  SET @contaId = "ACC-98765"

  SET @urlMicrosite = MicrositeURL(5678, 'nome', @nome, 'cpf', @cpf, 'contaId', @contaId)
  SET @urlFinal = Concat(@urlMicrosite, '&canal=email')
]%%

<a href="%%=RedirectTo(@urlFinal)=%%">Atualize seu cadastro, %%=v(@nome)=%%</a>
```

**Saída:**
```html
<a href="http://pub.s10.exacttarget.com/xxxxxxxxx?qs=abc123def456...&canal=email">Atualize seu cadastro, Maria Santos</a>
```

## Observações

> **⚠️ Atenção:** Os seguintes nomes são reservados e **não podem** ser usados como nomes de parâmetros na query string: `PAGEID`, `MID`, `JID`, `LID`, `SID`, `JSB`, `URLID`. Se você tentar usar algum deles, a função não vai funcionar como esperado.

- A principal vantagem da `MicrositeURL` é a **criptografia automática** dos parâmetros. Em cenários brasileiros de e-mail marketing onde você precisa trafegar CPF, ID de cliente ou dados financeiros, isso é essencial para atender boas práticas de segurança e LGPD.
- Essa função é voltada para microsites criados no **Classic Content**. Se você trabalha com **CloudPages**, a função recomendada é [CloudPagesURL](../sites-functions/cloudpagesurl.md), que oferece o mesmo benefício de criptografia.
- Para contas que não são Enterprise 2.0, use `microsite_base_url` em vez do ID da página.
- Para adicionar parâmetros extras não criptografados à URL, use [Concat](../string-functions/concat.md) para concatenar um `&` seguido do parâmetro desejado após a URL gerada.

## Funções relacionadas

- [CloudPagesURL](../sites-functions/cloudpagesurl.md) — alternativa moderna para landing pages no CloudPages, com criptografia de parâmetros
- [LiveContentMicrositeURL](../sites-functions/livecontentmicrositeurl.md) — variação para conteúdo dinâmico em microsites
- [RedirectTo](../http-functions/redirectto.md) — para redirecionar corretamente links gerados por funções de URL
- [Concat](../string-functions/concat.md) — para concatenar parâmetros adicionais à URL
- [RequestParameter](../sites-functions/requestparameter.md) — para recuperar os parâmetros criptografados na página de destino