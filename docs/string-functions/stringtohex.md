---
title: StringToHex
sidebar_label: StringToHex
description: Converte cada caractere de uma string para seu equivalente hexadecimal, usando codificação UTF-8 ou UTF-16.
---

# StringToHex

## Descrição

A função `StringToHex()` converte cada caractere de uma string para o seu código hexadecimal equivalente. É útil quando você precisa codificar dados em formato hexadecimal para integrações, geração de tokens, passagem segura de parâmetros em URLs ou qualquer cenário onde a representação hex seja necessária. Você pode escolher entre os charsets UTF-8 (padrão) e UTF-16. A função retorna uma string contendo os valores hexadecimais correspondentes a cada caractere da string original.

## Sintaxe

```ampscript
StringToHex(sourceString, charSet)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|--------------|--------|-------------|-----------|
| sourceString | String | Sim | A string que você quer converter para códigos hexadecimais. |
| charSet | String | Não | O charset usado na codificação. Valores aceitos: `UTF-8` ou `UTF-16`. O padrão é `UTF-8`. Também aceita `UTC-16` como valor. |

## Exemplo básico

```ampscript
%%[
VAR @nome, @hexNome
SET @nome = "João"
SET @hexNome = StringToHex(@nome)
]%%

Nome original: %%=v(@nome)=%%
Nome em hex (UTF-8): %%=v(@hexNome)=%%
```

**Saída:**
```
Nome original: João
Nome em hex (UTF-8): 4ac3a6c3a36f
```

## Exemplo avançado

Imagine que você trabalha na **Conecta Telecom** e precisa gerar um identificador hexadecimal único para cada assinante, combinando o e-mail com um código de campanha. Esse valor hex é passado como parâmetro em uma URL de CloudPage para validação.

```ampscript
%%[
VAR @email, @codigoCampanha, @stringBase, @hexUtf8, @hexUtf16, @urlValidacao

SET @email = "carlos.oliveira@email.com.br"
SET @codigoCampanha = "NATAL2024"

/* Concatena o email com o código da campanha */
SET @stringBase = Concat(@email, "|", @codigoCampanha)

/* Gera as versões hexadecimais em UTF-8 e UTF-16 */
SET @hexUtf8 = StringToHex(@stringBase, "UTF-8")
SET @hexUtf16 = StringToHex(@stringBase, "UTF-16")

/* Monta a URL de validação com o hex em UTF-8 */
SET @urlValidacao = Concat("https://www.conectatelecom.com.br/validar?token=", @hexUtf8)
]%%

Olá Carlos Oliveira,

Sua promoção de Natal com frete grátis acima de R$299 está ativa! 🎄

String original: %%=v(@stringBase)=%%
Hex (UTF-8): %%=v(@hexUtf8)=%%
Hex (UTF-16): %%=v(@hexUtf16)=%%

<a href="%%=RedirectTo(@urlValidacao)=%%">Validar minha oferta</a>
```

**Saída:**
```
Olá Carlos Oliveira,

Sua promoção de Natal com frete grátis acima de R$299 está ativa! 🎄

String original: carlos.oliveira@email.com.br|NATAL2024
Hex (UTF-8): 6361726c6f732e6f6c697665697261406...
Hex (UTF-16): fffe63006100720006c006f0073002e006f00...

Validar minha oferta
```

## Observações

- O charset padrão é **UTF-8**. Se você não informar o segundo parâmetro, a função usa UTF-8 automaticamente.
- Os valores aceitos para o parâmetro `charSet` são `UTF-8`, `UTF-16` e também `UTC-16` (conforme documentação oficial da Salesforce).
- A saída em UTF-16 tende a ser significativamente maior que a saída em UTF-8, especialmente para caracteres ASCII básicos, pois UTF-16 usa no mínimo 2 bytes por caractere.
- Caracteres especiais e acentuados (muito comuns no português brasileiro, como ã, é, ç, ô) ocupam mais bytes em UTF-8, então a representação hex desses caracteres será maior.
- Se você precisar passar o resultado hex em uma URL, considere usar [URLEncode](../string-functions/urlencode.md) para garantir que a string seja segura para uso em query strings.
- Essa função é útil para cenários de ofuscação leve de dados, mas **não é uma função de criptografia**. Para segurança real, use funções como [SHA256](../encryption-functions/sha256.md) ou [EncryptSymmetric](../encryption-functions/encryptsymmetric.md).
- Caso a string de entrada esteja vazia, a função retorna uma string vazia.

## Funções relacionadas

- [Concat](../string-functions/concat.md) — concatena múltiplas strings, útil para montar a string antes de converter para hex
- [URLEncode](../string-functions/urlencode.md) — codifica uma string para uso seguro em URLs
- [MD5](../encryption-functions/md5.md) — gera um hash MD5 de uma string (retorna resultado em hex)
- [SHA256](../encryption-functions/sha256.md) — gera um hash SHA-256, mais seguro que conversão hex simples
- [SHA512](../encryption-functions/sha512.md) — gera um hash SHA-512 para cenários que exigem maior segurança
- [Replace](../string-functions/replace.md) — substitui partes de uma string, útil para manipular o resultado hex
- [Substring](../string-functions/substring.md) — extrai parte de uma string, pode ser usado para pegar trechos do hex gerado
- [Length](../string-functions/length.md) — retorna o tamanho da string, útil para validar o resultado da conversão