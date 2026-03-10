---
title: StringToHex
sidebar_label: StringToHex
description: Converte cada caractere de uma string para seu equivalente hexadecimal, com suporte a UTF-8 e UTF-16.
---

# StringToHex

## Descrição

A função `StringToHex()` converte cada caractere de uma string para seu código hexadecimal equivalente. É útil quando você precisa representar dados em formato hexadecimal - por exemplo, para gerar identificadores codificados, preparar valores para integrações que exigem hex ou criar representações seguras de dados de clientes. O valor padrão de encoding é UTF-8, mas você também pode usar UTF-16.

## Sintaxe

```ampscript
StringToHex(sourceString, charSet)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| sourceString | string | Sim | A string que será convertida para códigos hexadecimais. |
| charSet | string | Não | O conjunto de caracteres usado para a codificação. Valores aceitos: `UTF-8` ou `UTF-16`. O valor padrão é `UTF-8`. |

## Exemplo básico

Convertendo o nome de um cliente para sua representação hexadecimal em UTF-8:

```ampscript
%%[
VAR @nome, @nomeHex
SET @nome = "João Silva"
SET @nomeHex = StringToHex(@nome, "UTF-8")
]%%

Nome original: %%=v(@nome)=%%
Hexadecimal (UTF-8): %%=v(@nomeHex)=%%
```

**Saída:**
```
Nome original: João Silva
Hexadecimal (UTF-8): 4ac3a34f20536976616c
```

## Exemplo avançado

Comparando a codificação de uma string em UTF-8 e UTF-16 - útil quando você precisa decidir qual encoding usar para uma integração com um sistema externo do Banco Brasilão:

```ampscript
%%[
VAR @texto, @hexUtf8, @hexUtf16

SET @texto = "Pedido #1024"

SET @hexUtf8 = StringToHex(@texto, "UTF-8")
SET @hexUtf16 = StringToHex(@texto, "UTF-16")
]%%

Texto original: %%=v(@texto)=%%
Hex UTF-8: %%=v(@hexUtf8)=%%
Hex UTF-16: %%=v(@hexUtf16)=%%
```

**Saída:**
```
Texto original: Pedido #1024
Hex UTF-8: 50656469646f202331303234
Hex UTF-16: feff00500065006400690064006f00200023003100300032003400
```

## Observações

> **💡 Dica:** Quando o parâmetro `charSet` não é informado, a função usa `UTF-8` por padrão. Para a maioria dos cenários com texto em português (incluindo acentos como ã, é, ç), UTF-8 é a escolha mais comum e gera uma saída mais compacta que UTF-16.

> **⚠️ Atenção:** Os valores aceitos para `charSet` são `UTF-8` e `UTF-16`. A documentação também menciona `UTC-16` como valor aceito. Fique atento à diferença de resultado entre os dois encodings - UTF-16 gera saídas significativamente maiores por usar mais bytes por caractere.

## Funções relacionadas

- [Concat](../string-functions/concat.md) - para concatenar strings antes de converter
- [Replace](../string-functions/replace.md) - para limpar ou substituir caracteres antes da conversão
- [MD5](../encryption-functions/md5.md) - para gerar hashes a partir de strings
- [SHA256](../encryption-functions/sha256.md) - para gerar hashes mais seguros
- [Base64Encode](../encryption-functions/base64encode.md) - para outra forma de codificação de strings
- [URLEncode](../string-functions/urlencode.md) - para codificar strings para uso em URLs