---
title: MD5
sidebar_label: MD5
description: Converte uma string em um hash hexadecimal MD5 de 128 bits.
---

# MD5

## Descrição

A função `MD5` converte uma string em um hash hexadecimal MD5 de 128 bits. É útil para gerar identificadores únicos a partir de dados como e-mail ou CPF, criar chaves de verificação em links de CloudPages ou produzir valores consistentes para comparação de dados. Por padrão, usa codificação UTF-8, mas também aceita UTF-16.

## Sintaxe

```ampscript
MD5(stringToConvert [, charSet])
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| stringToConvert | String | Sim | A string que será convertida para o hash MD5. |
| charSet | String | Não | O conjunto de caracteres usado na codificação. O valor padrão é `UTF-8`. Também aceita `UTF-16`. |

## Exemplo básico

Gerando um hash MD5 a partir do e-mail de um cliente para usar como identificador em links de verificação:

```ampscript
%%[
VAR @email, @hashEmail
SET @email = "joao.silva@email.com.br"
SET @hashEmail = MD5(@email)
]%%

Hash do e-mail: %%=v(@hashEmail)=%%
```

**Saída:**
```
Hash do e-mail: 7ccb47715d465a9e6a2b7d3c0441da80
```

## Exemplo avançado

Criando um token de verificação para um link de preferências de comunicação em uma régua de relacionamento da Lojas Vitória, usando codificação UTF-16 e combinando com o e-mail do cliente:

```ampscript
%%[
VAR @email, @nome, @hashUtf8, @hashUtf16, @linkPreferencias

SET @nome = "Maria Santos"
SET @email = AttributeValue("EmailAddress")

/* Hash padrão (UTF-8) para o identificador no link */
SET @hashUtf8 = MD5(@email)

/* Hash com UTF-16 para um token de verificação secundário */
SET @hashUtf16 = MD5(@email, "UTF-16")

SET @linkPreferencias = Concat(
  "https://cloud.lojasvitoria.com.br/preferencias?id=",
  @hashUtf8,
  "&token=",
  @hashUtf16
)
]%%

Olá, %%=v(@nome)=%%!

Gerencie suas preferências de comunicação:
%%=RedirectTo(@linkPreferencias)=%%

<!-- Na CloudPage de destino, você compara os hashes para validar o acesso -->
```

**Saída:**
```
Olá, Maria Santos!

Gerencie suas preferências de comunicação:
https://cloud.lojasvitoria.com.br/preferencias?id=7ccb47715d465a9e6a2b7d3c0441da80&token=3251ab3b9d54f085f6b57aa3bc134c3c
```

## Observações

- A mesma string sempre gera o mesmo hash MD5, o que torna a função ideal para criar identificadores consistentes e reproduzíveis a partir de dados como e-mail ou CPF.

- O resultado muda dependendo do charset escolhido. Um hash gerado com `UTF-8` será diferente de um gerado com `UTF-16` para a mesma string de entrada.

> **⚠️ Atenção:** MD5 é uma função de hash unidirecional - não é possível reverter o hash para obter a string original. Porém, MD5 não é considerado seguro para fins criptográficos. Se você precisa de maior segurança para tokens ou validações sensíveis, considere usar [SHA256](../encryption-functions/sha256.md) ou [SHA512](../encryption-functions/sha512.md).

> **💡 Dica:** Uma estratégia muito comum no mercado brasileiro é usar `MD5` para gerar um identificador do subscriber no link de CloudPages. Na página de destino, você recalcula o hash e compara com o parâmetro da URL, garantindo que o acesso é legítimo sem expor dados pessoais como CPF ou e-mail diretamente na query string.

## Funções relacionadas

- [SHA1](../encryption-functions/sha1.md) - hash SHA-1 de 160 bits
- [SHA256](../encryption-functions/sha256.md) - hash SHA-256, mais seguro que MD5
- [SHA512](../encryption-functions/sha512.md) - hash SHA-512, nível máximo de segurança entre as funções de hash disponíveis
- [Base64Encode](../encryption-functions/base64encode.md) - codificação Base64 (reversível, diferente de hash)
- [Concat](../string-functions/concat.md) - concatenação de strings, útil para montar a string antes de gerar o hash