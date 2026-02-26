---
title: MicrositeURL
sidebar_label: MicrositeURL
description: Retorna uma URL de microsite com query string criptografada, usada para criar links seguros para microsites criados no Classic Content a partir de e-mails.
---

# MicrositeURL

## Descrição

A função `MicrositeURL` gera uma URL de microsite com a query string **criptografada**, evitando que dados de assinantes trafeguem como texto puro na URL. Você usa essa função dentro de e-mails para criar links para microsites que foram criados no **Classic Content**. Ela aceita múltiplos pares de parâmetro/valor, e todos são criptografados automaticamente na URL resultante. É a versão voltada para microsites do Classic Content — se você trabalha com CloudPages, a alternativa mais moderna é a `CloudPagesURL`.

## Sintaxe

```ampscript
MicrositeURL(pageId [, parameterName1, parameterValue1, parameterName2, parameterValue2, ...])
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| pageId | Número | Sim | ID da página do microsite criado no Classic Content (ou de uma landing page CloudPages). |
| parameterName1 | String | Não | Nome do primeiro parâmetro que você quer incluir na query string criptografada. |
| parameterValue1 | String | Não | Valor do primeiro parâmetro que será criptografado na query string. |
| parameterNameN | String | Não | Nome de parâmetros adicionais. Você pode passar quantos pares nome/valor precisar. |
| parameterValueN | String | Não | Valor de parâmetros adicionais. |

## Exemplo básico

Imagine que você tem um e-mail da **FarmaRede** com um link para o assinante cancelar a inscrição. O microsite de descadastro tem o ID `1234`:

```ampscript
<a href="%%=MicrositeURL(1234)=%%" alias="Descadastro">
  Clique aqui para cancelar sua inscrição
</a>
```

**Saída:**
```html
<a href="https://pub.s10.exacttarget.com/xxxxxxxxx?qs=criptografado123abc" alias="Descadastro">
  Clique aqui para cancelar sua inscrição
</a>
```

A URL gerada já contém os dados de rastreamento criptografados automaticamente.

## Exemplo avançado

Agora um cenário mais completo: a **Lojas Vitória** quer enviar um e-mail de Dia das Mães com um link para uma landing page personalizada. Você precisa passar o e-mail, o nome do assinante e o ID da campanha como parâmetros criptografados:

```ampscript
%%[
  VAR @emailAssinante, @nomeAssinante, @campanhaId, @urlPersonalizada
  SET @emailAssinante = AttributeValue("EmailAddress")
  SET @nomeAssinante = AttributeValue("PrimeiroNome")
  SET @campanhaId = "DIADASMAES2024"
]%%

<a href="%%=MicrositeURL(5678, 'email', @emailAssinante, 'nome', @nomeAssinante, 'campanha', @campanhaId)=%%" alias="PromoMaes">
  Veja suas ofertas exclusivas de Dia das Mães 🌹
</a>
```

**Saída (para a assinante Maria Santos, maria.santos@email.com.br):**
```html
<a href="https://pub.s10.exacttarget.com/xxxxxxxxx?qs=criptografadoXYZ789" alias="PromoMaes">
  Veja suas ofertas exclusivas de Dia das Mães 🌹
</a>
```

Os parâmetros `email`, `nome` e `campanha` ficam criptografados na query string. Na landing page, você recupera esses valores com [RequestParameter](../sites-functions/requestparameter.md).

### Adicionando query strings extras com Concat

Se você precisa adicionar parâmetros **não criptografados** à URL (por exemplo, um parâmetro de UTM), use a função [Concat](../string-functions/concat.md) para anexar um `&` depois da URL gerada:

```ampscript
%%[
  VAR @urlBase, @urlFinal
  SET @urlBase = MicrositeURL(5678, 'email', @emailAssinante)
  SET @urlFinal = Concat(@urlBase, '&utm_source=email&utm_campaign=diadasmaes')
]%%

<a href="%%=RedirectTo(@urlFinal)=%%" alias="PromoMaesUTM">
  Confira as promoções com frete grátis acima de R$299
</a>
```

### Contas Non-Enterprise 2.0

Se a sua conta **não é** Enterprise 2.0, use `microsite_base_url` no lugar:

```ampscript
<a href="%%=Concat(microsite_base_url, '?qs=', MicrositeURL(5678, 'email', @emailAssinante))=%%" alias="Descadastro">
  Cancelar inscrição
</a>
```

## Observações

- ⚠️ **Contexto Classic Content**: Essa função foi projetada para microsites criados no **Classic Content**. Se você está trabalhando com **CloudPages** (que é o padrão mais atual), considere usar [CloudPagesURL](../sites-functions/cloudpagesurl.md) em vez de `MicrositeURL`.
- 🔒 **Criptografia automática**: Todos os parâmetros passados na função são criptografados na query string. Isso é ótimo para proteger dados sensíveis como e-mail ou CPF do assinante.
- 🚫 **Nomes reservados**: Os seguintes nomes **não podem** ser usados como nomes de parâmetros: `PAGEID`, `MID`, `JID`, `LID`, `SID`, `JSB`, `URLID`. Se você tentar usar algum desses, vai ter erro.
- 📧 **Uso em e-mails**: Essa função é destinada para uso dentro de **e-mails**. É neles que você gera os links que apontam para os microsites.
- 🔗 Para recuperar os parâmetros na landing page de destino, use [RequestParameter](../sites-functions/requestparameter.md) ou [QueryParameter](../sites-functions/queryparameter.md).
- Você pode passar **quantos pares** de nome/valor quiser — basta ir adicionando ao final da chamada da função.
- Essa função é considerada **legada** na maioria dos cenários modernos do SFMC. A Salesforce incentiva o uso de CloudPages e `CloudPagesURL` para novos projetos.

## Funções relacionadas

- [CloudPagesURL](../sites-functions/cloudpagesurl.md) — versão moderna para gerar URLs criptografadas de CloudPages (recomendada para novos projetos)
- [LiveContentMicrositeURL](../sites-functions/livecontentmicrositeurl.md) — variante para conteúdo dinâmico em microsites
- [RequestParameter](../sites-functions/requestparameter.md) — recupera parâmetros na landing page de destino
- [QueryParameter](../sites-functions/queryparameter.md) — outra forma de capturar parâmetros de query string
- [Redirect](../sites-functions/redirect.md) — redireciona para uma URL específica
- [RedirectTo](../http-functions/redirectto.md) — redireciona para uma URL com rastreamento de cliques
- [Concat](../string-functions/concat.md) — concatena strings, útil para adicionar parâmetros extras à URL gerada
- [AttributeValue](../utility-functions/attributevalue.md) — recupera valores de atributos do assinante para passar como parâmetros