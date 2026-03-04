---
title: SHA1
sidebar_label: SHA1
description: Converte uma string em um hash hexadecimal SHA-1 de 160 bits.
---

# SHA1

## Descrição

A função `SHA1` converte uma string em um hash hexadecimal SHA-1 de 160 bits. É útil quando você precisa gerar identificadores únicos a partir de dados como e-mail ou CPF, criar tokens de verificação para links em CloudPages, ou ofuscar informações sensíveis em Data Extensions de log. Por padrão, utiliza o charset UTF-8, mas também aceita UTF-16.

## Sintaxe

```ampscript
SHA1(stringToConvert [, charSet])
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| stringToConvert | String | Sim | A string que será convertida em hash SHA-1. |
| charSet | String | Não | O charset usado na codificação. O valor padrão é `UTF-8`. Também aceita `UTF-16`. |

## Exemplo básico

Gerando um hash SHA-1 a partir do e-mail de um cliente para usar como token de verificação:

```ampscript
%%[
SET @email = "joao.silva@email.com.br"
SET @hash = SHA1(@email)
]%%

Token: %%=v(@hash)=%%
```

**Saída:**
```
Token: 0a7b8c9d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b
```

## Exemplo avançado

Criando um link de confirmação em uma régua de boas-vindas da Lojas Vitória, usando o e-mail do cliente combinado com uma chave secreta para gerar um token de validação na CloudPage:

```ampscript
%%[
SET @email = AttributeValue("EmailAddress")
SET @chaveSecreta = "LojaVitoria2024@Secret"
SET @stringBase = Concat(@email, "|", @chaveSecreta)

/* Hash padrão UTF-8 */
SET @tokenUTF8 = SHA1(@stringBase)

/* Hash com UTF-16 */
SET @tokenUTF16 = SHA1(@stringBase, "UTF-16")

SET @linkConfirmacao = Concat(
  CloudPagesURL(458),
  "&token=", @tokenUTF8,
  "&email=", URLEncode(@email)
)
]%%

<a href="%%=RedirectTo(@linkConfirmacao)=%%">Confirmar meu cadastro</a>

<!-- Para fins de debug -->
<!-- Hash UTF-8: %%=v(@tokenUTF8)=%% -->
<!-- Hash UTF-16: %%=v(@tokenUTF16)=%% -->
```

**Saída:**
```html
<a href="https://cloud.e.lojasvitoria.com.br/confirmacao?token=0af2f4853cc89dc1e1efe397ca334ce7a19d14da&email=joao.silva%40email.com.br">Confirmar meu cadastro</a>

<!-- Para fins de debug -->
<!-- Hash UTF-8: 0af2f4853cc89dc1e1efe397ca334ce7a19d14da -->
<!-- Hash UTF-16: 1a36453a2f2c1bf17dcc763321e5e35268e5e4c6 -->
```

## Observações

> **⚠️ Atenção:** O hash gerado com `UTF-8` e `UTF-16` para a mesma string produz resultados completamente diferentes. Se você gera o hash em um e-mail e valida em uma CloudPage, garanta que ambos usem o mesmo charset — caso contrário, os tokens nunca vão bater.

> **💡 Dica:** O `SHA1` gera um hash de mão única — não é possível reverter o hash para obter a string original. Isso é útil para ofuscar dados como CPF ou e-mail em logs e Data Extensions de auditoria, sem expor a informação em texto claro.

> **💡 Dica:** Se você precisa de um nível de segurança maior, considere usar [SHA256](../encryption-functions/sha256.md) ou [SHA512](../encryption-functions/sha512.md), que geram hashes mais longos e são mais resistentes a colisões.

## Funções relacionadas

- [MD5](../encryption-functions/md5.md) — gera um hash de 128 bits (menos seguro, mas mais curto)
- [SHA256](../encryption-functions/sha256.md) — gera um hash de 256 bits, mais robusto que SHA1
- [SHA512](../encryption-functions/sha512.md) — gera um hash de 512 bits, o mais robusto disponível em AMPscript
- [Base64Encode](../encryption-functions/base64encode.md) — codifica strings em Base64 (reversível, diferente de hash)
- [Concat](../string-functions/concat.md) — útil para combinar strings antes de gerar o hash
- [URLEncode](../string-functions/urlencode.md) — para usar o hash com segurança em URLs