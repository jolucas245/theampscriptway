---
title: SHA1
sidebar_label: SHA1
description: Converte uma string em um hash SHA-1 hexadecimal de 160 bits, útil para gerar identificadores únicos e verificar integridade de dados no Marketing Cloud.
---

# SHA1

## Descrição

A função `SHA1` converte uma string em um hash hexadecimal de 160 bits usando o algoritmo SHA-1. É bastante usada para gerar identificadores únicos a partir de dados de assinantes, criar tokens de verificação em links e validar integridade de informações. O resultado é sempre uma string hexadecimal de 40 caracteres. Por padrão, a codificação utilizada é UTF-8, mas você também pode usar UTF-16.

## Sintaxe

```ampscript
SHA1(stringToConvert [, charSet])
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| stringToConvert | string | Sim | A string que será convertida para o hash SHA-1. |
| charSet | string | Não | O conjunto de caracteres usado na codificação. O valor padrão é `UTF-8`. Também aceita `UTF-16`. |

## Exemplo básico

```ampscript
%%[
VAR @emailHash
SET @emailHash = SHA1("joao.silva@email.com.br")
]%%

Seu identificador: %%=v(@emailHash)=%%
```

**Saída:**
```
Seu identificador: 0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b
```

> ⚠️ O hash real vai variar conforme a string informada. O valor acima é apenas ilustrativo.

## Exemplo avançado

Imagine que a **MegaStore** quer criar um link de desconto personalizado para a campanha de Dia das Mães. O hash SHA-1 é usado como token de verificação para garantir que o link não foi adulterado. Além disso, o exemplo demonstra o uso do charset UTF-16.

```ampscript
%%[
VAR @nome, @email, @cpf, @tokenBase, @tokenUTF8, @tokenUTF16, @linkDesconto

SET @nome = AttributeValue("PrimeiroNome")
SET @email = AttributeValue("EmailAddress")
SET @cpf = AttributeValue("CPF")

/* Cria uma string base combinando dados do assinante */
SET @tokenBase = Concat(@email, "|", @cpf, "|", "DIADASMAES2024")

/* Gera hash SHA-1 com UTF-8 (padrão) */
SET @tokenUTF8 = SHA1(@tokenBase)

/* Gera hash SHA-1 com UTF-16 */
SET @tokenUTF16 = SHA1(@tokenBase, "UTF-16")

SET @linkDesconto = Concat("https://www.megastore.com.br/promo/maes?token=", @tokenUTF8, "&e=", URLEncode(@email))
]%%

Olá, %%=v(@nome)=%%! 🎉

Preparamos um cupom exclusivo de Dia das Mães pra você!
Ganhe R$ 50,00 de desconto em compras acima de R$ 299,00.

Seu token (UTF-8): %%=v(@tokenUTF8)=%%
Seu token (UTF-16): %%=v(@tokenUTF16)=%%

<a href="%%=RedirectTo(@linkDesconto)=%%">Aproveitar meu desconto</a>

Oferta válida até 12/05/2024. Frete grátis acima de R$ 299,00!
```

**Saída:**
```
Olá, Maria! 🎉

Preparamos um cupom exclusivo de Dia das Mães pra você!
Ganhe R$ 50,00 de desconto em compras acima de R$ 299,00.

Seu token (UTF-8): 0af2f4853cc89dc1e1efe397ca334ce7a19d14da
Seu token (UTF-16): 1a36453a2f2c1bf17dcc763321e5e35268e5e4c6

Aproveitar meu desconto

Oferta válida até 12/05/2024. Frete grátis acima de R$ 299,00!
```

> ⚠️ Os hashes acima são ilustrativos. Os valores reais dependem da string de entrada.

## Observações

- **SHA-1 não é criptografia.** Ele gera um hash unidirecional — ou seja, não dá pra "reverter" o hash e obter a string original. Mas atenção: o SHA-1 é considerado **criptograficamente fraco** para fins de segurança. Se você precisa de algo mais robusto, considere usar [SHA256](../encryption-functions/sha256.md) ou [SHA512](../encryption-functions/sha512.md).
- **Mesmo input, mesmo output.** A mesma string sempre vai gerar o mesmo hash. Isso é útil pra comparações e verificações, mas também significa que dados previsíveis (como CPFs sem salt) podem ser vulneráveis a ataques de dicionário.
- **O resultado é sempre uma string hexadecimal de 40 caracteres**, independente do tamanho da string de entrada.
- **O charset padrão é UTF-8.** Só mude para `UTF-16` se tiver uma necessidade específica (por exemplo, integração com um sistema que espera esse encoding). Lembre-se: o mesmo texto gera hashes diferentes em UTF-8 e UTF-16.
- **Não confunda hash com ofuscação segura.** Para dados sensíveis como CPF, prefira funções de criptografia simétrica como [EncryptSymmetric](../encryption-functions/encryptsymmetric.md), que permite descriptografar depois.
- **Não use para armazenar senhas** em produção. Existem algoritmos mais adequados pra isso (bcrypt, scrypt, etc.), que não estão disponíveis em AMPscript.
- A função funciona em emails, CloudPages, Landing Pages e SMS — em qualquer contexto onde AMPscript é suportado.

## Funções relacionadas

- [MD5](../encryption-functions/md5.md) — gera um hash MD5 de 128 bits (ainda mais fraco que SHA-1, mas útil pra checksums simples)
- [SHA256](../encryption-functions/sha256.md) — gera um hash SHA-256 de 256 bits, mais seguro que SHA-1
- [SHA512](../encryption-functions/sha512.md) — gera um hash SHA-512 de 512 bits, o mais robusto disponível em AMPscript
- [EncryptSymmetric](../encryption-functions/encryptsymmetric.md) — criptografa dados de forma reversível usando chave simétrica
- [DecryptSymmetric](../encryption-functions/decryptsymmetric.md) — descriptografa dados criptografados com EncryptSymmetric
- [Concat](../string-functions/concat.md) — concatena strings, útil para montar a string base antes de gerar o hash
- [URLEncode](../string-functions/urlencode.md) — codifica strings para uso seguro em URLs
- [Lowercase](../string-functions/lowercase.md) — converte para minúsculas, útil para normalizar emails antes de gerar o hash