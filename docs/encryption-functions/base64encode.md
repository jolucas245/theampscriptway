---
title: Base64Encode
sidebar_label: Base64Encode
description: Converte texto simples em dados codificados em Base64.
---

# Base64Encode

## Descrição

A função `Base64Encode` converte uma string de texto simples em sua representação codificada em Base64. É muito útil quando você precisa preparar dados para transmissão segura em URLs, integrações via API ou quando precisa garantir que caracteres especiais (como acentos comuns no português) não se corrompam durante o transporte. A função retorna uma string codificada em Base64.

## Sintaxe

```ampscript
Base64Encode(stringToEncode [, characterEncoding])
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| stringToEncode | string | Sim | A string de texto que você quer codificar em Base64. |
| characterEncoding | string | Não | O tipo de codificação de caracteres a ser usado. Valores aceitos: `ASCII`, `UTF-7`, `UTF-8`, `UTF-16` e `UTF-32`. |

## Exemplo básico

Codificando o e-mail de um cliente para uso em uma integração:

```ampscript
%%[
SET @email = "joao.silva@lojasvitoria.com.br"
SET @emailCodificado = Base64Encode(@email)
]%%

Email codificado: %%=v(@emailCodificado)=%%
```

**Saída:**
```
Email codificado: am9hby5zaWx2YUBsb2phc3ZpdG9yaWEuY29tLmJy
```

## Exemplo avançado

Montando um payload codificado em Base64 com dados do cliente para passar via URL de uma CloudPage, garantindo que acentos e caracteres especiais do português sejam preservados com UTF-8:

```ampscript
%%[
SET @nome = "João Silva"
SET @cpf = "123.456.789-00"
SET @cidade = "São Paulo"

SET @dadosCliente = Concat(@nome, "|", @cpf, "|", @cidade)
SET @dadosCodificados = Base64Encode(@dadosCliente, "UTF-8")

SET @urlCloudPage = Concat("https://pub.s10.sfmc-content.com/minhapagina?dados=", @dadosCodificados)
]%%

<a href="%%=RedirectTo(@urlCloudPage)=%%">Confirmar seus dados</a>

<!-- Para verificação -->
Dados originais: %%=v(@dadosCliente)=%%
Dados codificados: %%=v(@dadosCodificados)=%%
```

**Saída:**
```html
<a href="https://pub.s10.sfmc-content.com/minhapagina?dados=Sm/Do28gU2lsdmF8MTIzLjQ1Ni43ODktMDB8U8OjbyBQYXVsbw==">Confirmar seus dados</a>

Dados originais: João Silva|123.456.789-00|São Paulo
Dados codificados: Sm/Do28gU2lsdmF8MTIzLjQ1Ni43ODktMDB8U8OjbyBQYXVsbw==
```

> **💡 Dica:** Sempre use `UTF-8` como encoding quando estiver trabalhando com dados que contenham acentos e caracteres especiais do português (ã, ç, é, ô etc.). Isso evita que os dados fiquem corrompidos ao decodificar na outra ponta com [Base64Decode](../encryption-functions/base64decode.md).

## Observações

- Ao trabalhar com dados brasileiros que contêm acentuação (nomes de cidades como "São Paulo", "Curitiba" ou nomes como "João", "André"), especifique o parâmetro `characterEncoding` como `UTF-8` para garantir a integridade dos caracteres.

> **⚠️ Atenção:** O parâmetro `characterEncoding` é opcional. Se não for informado, a função usará a codificação padrão, o que pode gerar resultados inesperados com caracteres acentuados. Para dados em português, prefira sempre declarar explicitamente `UTF-8`.

- A codificação Base64 aumenta o tamanho da string resultante. Leve isso em conta ao usar os dados em URLs, que possuem limites de comprimento.

## Funções relacionadas

- [Base64Decode](../encryption-functions/base64decode.md) — decodifica uma string Base64 de volta para texto simples.
- [MD5](../encryption-functions/md5.md) — gera um hash MD5 (diferente de encoding, o hash é irreversível).
- [SHA256](../encryption-functions/sha256.md) — gera um hash SHA-256 para validação de integridade.
- [Concat](../string-functions/concat.md) — concatena strings, útil para montar o conteúdo antes de codificar.
- [URLEncode](../string-functions/urlencode.md) — outra forma de codificar strings para uso seguro em URLs.
- [CloudPagesURL](../sites-functions/cloudpagesurl.md) — gera URLs de CloudPages com parâmetros criptografados.