---
title: Base64Encode
sidebar_label: Base64Encode
description: Codifica uma string de texto no formato Base64, útil para transmissão segura de dados em URLs, integrações com APIs e ofuscação de informações sensíveis.
---

# Base64Encode

## Descrição

A função `Base64Encode` converte uma string de texto para o formato de codificação Base64. Base64 é um método de codificação que transforma dados binários ou texto em uma sequência de caracteres ASCII, usando apenas letras (A-Z, a-z), números (0-9) e os símbolos `+`, `/` e `=`. Isso é muito útil quando você precisa passar dados em URLs, integrar com APIs externas ou simplesmente ofuscar informações que não devem ficar visíveis em texto puro. Vale lembrar que Base64 **não é criptografia** — é apenas uma codificação reversível, então não use para proteger dados realmente sensíveis como senhas.

## Sintaxe

```ampscript
Base64Encode(string)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|--------|-------------|-----------|
| string | String | Sim | A string de texto que você quer codificar em Base64. |

## Exemplo básico

```ampscript
%%[
VAR @textoOriginal, @textoCodificado

SET @textoOriginal = "Olá, João Silva!"
SET @textoCodificado = Base64Encode(@textoOriginal)
]%%

Texto original: %%=v(@textoOriginal)=%%
Texto codificado: %%=v(@textoCodificado)=%%
```

**Saída:**
```
Texto original: Olá, João Silva!
Texto codificado: T2zDoSwgSm/Do28gU2lsdmEh
```

## Exemplo avançado

Imagine que você trabalha na **Lojas Vitória** e precisa gerar links personalizados para uma landing page de resgate de cashback. Você quer passar o e-mail e o CPF do cliente na URL de forma ofuscada, para que não fiquem expostos em texto puro na barra de endereço.

```ampscript
%%[
VAR @email, @cpf, @nomeCliente, @cashback
VAR @dadosCombinados, @dadosCodificados, @linkResgate

SET @nomeCliente = AttributeValue("NomeCliente")
SET @email = AttributeValue("EmailAddress")
SET @cpf = AttributeValue("CPF")
SET @cashback = AttributeValue("ValorCashback")

/* Combina os dados do cliente separados por pipe */
SET @dadosCombinados = Concat(@email, "|", @cpf)

/* Codifica em Base64 para ofuscar na URL */
SET @dadosCodificados = Base64Encode(@dadosCombinados)

/* Monta o link de resgate */
SET @linkResgate = Concat("https://www.lojasvitoria.com.br/cashback/resgate?d=", @dadosCodificados)
]%%

Olá, %%=v(@nomeCliente)=%%! 🎉

Você tem <b>R$ %%=FormatNumber(@cashback, "N2")=%% de cashback</b> disponível
para usar na sua próxima compra nas Lojas Vitória.

<a href="%%=RedirectTo(@linkResgate)=%%">Resgatar meu cashback</a>

O resgate é válido até 31/12/2024. Aproveite!
```

**Saída:**
```
Olá, Maria Santos! 🎉

Você tem R$ 47,90 de cashback disponível
para usar na sua próxima compra nas Lojas Vitória.

Resgatar meu cashback
(link: https://www.lojasvitoria.com.br/cashback/resgate?d=bWFyaWEuc2FudG9zQGVtYWlsLmNvbS5icnwxMjMuNDU2Ljc4OS0wMA==)

O resgate é válido até 31/12/2024. Aproveite!
```

Na CloudPage de destino, você usaria [Base64Decode](../encryption-functions/base64decode.md) para recuperar os dados originais:

```ampscript
%%[
VAR @dadosRecebidos, @dadosDecodificados

SET @dadosRecebidos = RequestParameter("d")
SET @dadosDecodificados = Base64Decode(@dadosRecebidos)

/* Resultado: "maria.santos@email.com.br|123.456.789-00" */
]%%
```

## Observações

- **Base64 não é criptografia.** Qualquer pessoa pode decodificar uma string Base64 facilmente. Se você precisa proteger dados sensíveis de verdade (como CPF, dados financeiros), use funções de criptografia como [EncryptSymmetric](../encryption-functions/encryptsymmetric.md).
- A string codificada em Base64 é **aproximadamente 33% maior** que a string original. Tenha isso em mente ao usar em URLs, já que URLs muito longas podem causar problemas em alguns clientes de e-mail.
- Caracteres especiais e acentos do português (como ã, ç, é) são codificados normalmente, mas o resultado depende do encoding utilizado internamente pelo SFMC.
- Se a string de entrada for vazia (`""`), a função retorna uma string vazia.
- O resultado pode conter os caracteres `+`, `/` e `=`, que têm significado especial em URLs. Se você for usar o resultado em uma query string, considere combinar com [URLEncode](../string-functions/urlencode.md) para garantir que a URL fique válida.
- Funciona em todos os contextos do SFMC: e-mails, CloudPages, SMS e automações.

## Funções relacionadas

- [Base64Decode](../encryption-functions/base64decode.md) — decodifica uma string Base64 de volta para texto original (operação inversa)
- [EncryptSymmetric](../encryption-functions/encryptsymmetric.md) — criptografia simétrica para quando você precisa de segurança real
- [DecryptSymmetric](../encryption-functions/decryptsymmetric.md) — descriptografa dados criptografados com EncryptSymmetric
- [MD5](../encryption-functions/md5.md) — gera um hash MD5 de uma string (via única, sem decodificação)
- [SHA256](../encryption-functions/sha256.md) — gera um hash SHA-256, mais seguro que MD5
- [URLEncode](../string-functions/urlencode.md) — codifica caracteres especiais para uso seguro em URLs
- [Concat](../string-functions/concat.md) — concatena strings, útil para combinar dados antes de codificar
- [CloudPagesURL](../sites-functions/cloudpagesurl.md) — gera URLs para CloudPages com parâmetros criptografados automaticamente