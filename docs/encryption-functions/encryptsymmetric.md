---
title: EncryptSymmetric
sidebar_label: EncryptSymmetric
description: Criptografa dados em texto plano usando um algoritmo simétrico e valores de senha, salt e vetor de inicialização.
---

# EncryptSymmetric

## Descrição

Criptografa uma string de texto plano usando o algoritmo simétrico especificado (AES, DES ou Triple DES), junto com senha, salt e vetor de inicialização (IV). É a função essencial quando você precisa proteger dados sensíveis de clientes — como CPF, número de cartão ou qualquer informação pessoal — antes de armazená-los em Data Extensions ou passá-los via parâmetros em URLs de CloudPages. Retorna a string criptografada, que posteriormente pode ser revertida com [DecryptSymmetric](../encryption-functions/decryptsymmetric.md).

## Sintaxe

```ampscript
EncryptSymmetric(@data, "algoritmo", @passwordExternalKey, @passwordValue, @saltExternalKey, @saltValue, @ivExternalKey, @ivValue)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| data | string | Sim | A string de texto plano que será criptografada. |
| encryptionAlgorithm | string | Sim | O algoritmo de criptografia. Opções: `aes`, `des`, `tripledes`. Para DES e Triple DES, você pode especificar modo de operação e padding (ex: `tripledes;mode=cfb;padding=ansix923`). |
| passwordExternalKey | string | Sim | A external key de uma senha criada no Key Management. Use uma variável não declarada (ex: `@null`) se for informar o valor diretamente. |
| passwordValue | string | Sim | O valor da senha. Use uma variável não declarada (ex: `@null`) se estiver usando a external key. |
| saltExternalKey | string | Sim | A external key de um salt no Key Management. Use uma variável não declarada (ex: `@null`) se for informar o valor diretamente. |
| saltValue | string | Sim | O valor do salt, representado como uma string hexadecimal de 8 bytes. Use uma variável não declarada (ex: `@null`) se estiver usando a external key. |
| ivExternalKey | string | Sim | A external key de um vetor de inicialização no Key Management. Use uma variável não declarada (ex: `@null`) se for informar o valor diretamente. |
| ivValue | string | Sim | O vetor de inicialização, representado como uma string hexadecimal de 16 bytes. Use uma variável não declarada (ex: `@null`) se estiver usando a external key. |

## Algoritmos disponíveis

| Algoritmo | Descrição | Segurança |
|---|---|---|
| `aes` | AES (Advanced Encryption Standard) | Mais seguro |
| `tripledes` | Triple DES (aplica o DES três vezes em cada bloco) | Intermediário |
| `des` | DES (Data Encryption Standard) | Menos seguro |

### Modos de operação (DES e Triple DES)

Especifique após o algoritmo com `;mode=`:

| Modo | Descrição |
|---|---|
| `cbc` | Cipher Block Chaining (padrão) |
| `cfb` | Cipher Feedback |
| `cts` | Ciphertext Stealing |
| `ecb` | Electronic Codebook |
| `ofb` | Output Feedback |

### Métodos de padding (DES e Triple DES)

Especifique após o modo com `;padding=`:

| Padding | Descrição |
|---|---|
| `pkcs7` | PKCS#7/RFC 5652 (padrão) |
| `ansix923` | ANSI X9.23 |
| `iso10126` | ISO 10126 |
| `zeros` | Bytes preenchidos com zeros |
| `none` | Sem padding |

## Exemplo básico

Criptografando o CPF de um cliente do Banco Meridional usando AES com valores fornecidos diretamente.

```ampscript
%%[

VAR @cpf, @encData
SET @cpf = "123.456.789-00"

SET @encData = EncryptSymmetric(@cpf, "aes", @null, "S3nh4M3r1d10n4l!", @null, "0000000000000000", @null, "00000000000000000000000000000000")

]%%

CPF criptografado: %%=V(@encData)=%%
```

**Saída:**
```
CPF criptografado: [string criptografada]
```

## Exemplo avançado

Cenário real: em um e-mail da FarmaRede, você precisa gerar um link para CloudPage que carregue dados sensíveis do cliente de forma segura. Aqui criptografamos o e-mail do cliente com Triple DES usando Cipher Feedback e padding ANSI X9.23, e então codificamos em Base64 para transporte seguro via URL.

```ampscript
%%[

VAR @email, @encData, @encBase64, @linkSeguro

SET @email = "joao.silva@email.com.br"

/* Criptografa com Triple DES, modo CFB, padding ANSI X9.23 */
SET @encData = EncryptSymmetric(
  @email,
  "tripledes;mode=cfb;padding=ansix923",
  @null,
  "F4rm4R3d3S3cur3!",
  @null,
  "0102030405060708",
  @null,
  "01020304050607080910111213141516"
)

/* Codifica em Base64 para poder usar em URL */
SET @encBase64 = Base64Encode(@encData)

SET @linkSeguro = Concat("https://cloud.farmarede.com.br/minha-conta?token=", URLEncode(@encBase64))

]%%

<a href="%%=RedirectTo(@linkSeguro)=%%">Acessar minha conta FarmaRede</a>
```

**Saída:**
```html
<a href="https://cloud.farmarede.com.br/minha-conta?token=[string criptografada em Base64 e URL-encoded]">Acessar minha conta FarmaRede</a>
```

## Observações

> **⚠️ Atenção:** Os valores de Salt e IV são tratados como **strings hexadecimais**, onde cada par de caracteres representa um byte. O Salt deve ter **8 bytes** (16 caracteres hex) e o IV deve ter **16 bytes** (32 caracteres hex). Não tente usar esses valores como strings de cifra — você não conseguirá descriptografar corretamente depois.

> **⚠️ Atenção:** As funções `EncryptSymmetric` e `DecryptSymmetric` funcionam **exclusivamente com dados dentro do Marketing Cloud**. Não é possível usá-las com funcionalidades de criptografia/descriptografia de terceiros.

> **💡 Dica:** Quando for informar valores diretamente (em vez de usar external keys do Key Management), passe uma variável não declarada (como `@null`) no parâmetro de external key correspondente. Isso indica à função que ela deve usar o valor fornecido no parâmetro seguinte.

> **💡 Dica:** Para visualizar ou transportar a string criptografada com segurança, envolva o resultado em [Base64Encode](../encryption-functions/base64encode.md). Na hora de descriptografar, use [Base64Decode](../encryption-functions/base64decode.md) antes de chamar [DecryptSymmetric](../encryption-functions/decryptsymmetric.md).

> **💡 Dica:** Se você não passar ou referenciar um vetor de inicialização (IV), a função usará o valor da senha como IV. Mesmo assim, é altamente recomendável sempre definir um IV explícito para maior segurança.

> **💡 Dica:** Se você já criou chaves na seção **Key Management** da interface do Marketing Cloud, pode referenciar as external keys diretamente nos parâmetros, sem precisar expor valores sensíveis no código. Essa é a abordagem mais segura para ambientes de produção.

> **💡 Dica:** Entre os algoritmos disponíveis, prefira **AES** — é o mais seguro. Use Triple DES ou DES apenas quando houver necessidade de compatibilidade com sistemas legados.

## Funções relacionadas

- [DecryptSymmetric](../encryption-functions/decryptsymmetric.md) — descriptografa dados criptografados com `EncryptSymmetric`
- [Base64Encode](../encryption-functions/base64encode.md) — codifica a string criptografada em Base64 para visualização e transporte
- [Base64Decode](../encryption-functions/base64decode.md) — decodifica Base64 antes de descriptografar
- [MD5](../encryption-functions/md5.md) — gera hash MD5 (criptografia unidirecional)
- [SHA256](../encryption-functions/sha256.md) — gera hash SHA-256 (criptografia unidirecional)
- [SHA512](../encryption-functions/sha512.md) — gera hash SHA-512 (criptografia unidirecional)
- [URLEncode](../string-functions/urlencode.md) — codifica strings para uso seguro em URLs
- [RedirectTo](../http-functions/redirectto.md) — redireciona para URLs construídas dinamicamente
- [CloudPagesURL](../sites-functions/cloudpagesurl.md) — gera URLs de CloudPages com parâmetros criptografados