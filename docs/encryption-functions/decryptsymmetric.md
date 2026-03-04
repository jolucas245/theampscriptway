---
title: DecryptSymmetric
sidebar_label: DecryptSymmetric
description: Descriptografa dados que foram criptografados com algoritmo simétrico, usando senha, salt e vetor de inicialização (IV).
---

# DecryptSymmetric

## Descrição

A função `DecryptSymmetric` descriptografa dados que foram previamente criptografados com a função [EncryptSymmetric](../encryption-functions/encryptsymmetric.md), usando o algoritmo e os valores de criptografia fornecidos. Você pode passar os valores de senha, salt e IV diretamente ou referenciar chaves externas criadas na seção Key Management do Marketing Cloud. É essencial para cenários onde você precisa recuperar dados sensíveis de clientes — como CPF, número de cartão ou informações pessoais — que foram armazenados de forma criptografada em Data Extensions.

## Sintaxe

```ampscript
DecryptSymmetric(
  @dadosCriptografados,
  "algoritmo",
  "chaveExternaPassword", @valorPassword,
  "chaveExternaSalt", @valorSalt,
  "chaveExternaIV", @valorIV
)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| encryptedData | string | Sim | Os dados criptografados que você quer descriptografar. |
| encryptionAlgorithm | string | Sim | O algoritmo usado na criptografia. Valores aceitos: `aes` (AES/Rijndael), `des` (DES) e `tripledes` (Triple DES/Triple DEA). Para DES e Triple DES, você pode especificar cipher mode e padding method. |
| passwordExternalKey | string | Sim | A chave externa de uma senha criada no Key Management. |
| passwordValue | string | Sim | O valor da senha. |
| saltExternalKey | string | Sim | A chave externa de um salt no Key Management. |
| saltValue | string | Sim | O valor do salt, representado como uma string hexadecimal de 8 bytes. |
| ivExternalKey | string | Sim | A chave externa de um vetor de inicialização (IV) no Key Management. |
| ivValue | string | Sim | O vetor de inicialização, representado como uma string hexadecimal de 16 bytes. |

## Exemplo básico

Descriptografando o CPF de um cliente do Banco Brasilão que foi armazenado criptografado em uma Data Extension, usando valores fornecidos diretamente (sem chaves externas do Key Management):

```ampscript
%%[
VAR @cpfCriptografado, @cpfOriginal, @null

SET @cpfCriptografado = AttributeValue("CPFCriptografado")

SET @cpfOriginal = DecryptSymmetric(
  @cpfCriptografado,
  "aes",
  @null, "S3nh4M3r1d10n4l!2024",
  @null, "0000000000000000",
  @null, "00000000000000000000000000000000"
)
]%%

CPF: %%=v(@cpfOriginal)=%%
```

**Saída:**
```
CPF: 123.456.789-00
```

## Exemplo avançado

Em uma CloudPage do programa de fidelidade da MegaStore, você precisa descriptografar dados do cliente que chegam via query string criptografada e exibir as informações de forma legível. Aqui combinamos `DecryptSymmetric` com [Base64Decode](../encryption-functions/base64decode.md) para tratar o dado codificado, e usamos chaves externas do Key Management:

```ampscript
%%[
VAR @dadoBase64, @dadoCriptografado, @emailCliente, @nomeCliente
VAR @null

/* Dado criptografado vem codificado em Base64 pela URL */
SET @dadoBase64 = RequestParameter("dados")
SET @dadoCriptografado = Base64Decode(@dadoBase64)

/* Descriptografa o e-mail usando chaves do Key Management */
SET @emailCliente = DecryptSymmetric(
  @dadoCriptografado,
  "aes",
  "chave-megastore-pwd", @null,
  "chave-megastore-salt", @null,
  "chave-megastore-iv", @null
)

/* Busca dados adicionais do cliente */
SET @nomeCliente = Lookup(
  "Clientes_MegaStore",
  "NomeCompleto",
  "Email", @emailCliente
)
]%%

<h1>Olá, %%=v(@nomeCliente)=%%!</h1>
<p>Confirmamos seu e-mail: %%=v(@emailCliente)=%%</p>
<p>Bem-vindo ao programa de fidelidade MegaStore.</p>
```

**Saída:**
```
Olá, Maria Santos!
Confirmamos seu e-mail: maria.santos@megastore.com.br
Bem-vindo ao programa de fidelidade MegaStore.
```

## Observações

- Para cada parâmetro de chave (password, salt e IV), você deve fornecer **ou** a chave externa do Key Management **ou** o valor direto. O parâmetro que não for usado deve receber uma variável não declarada (como `@null`). Nunca passe ambos preenchidos ao mesmo tempo.

- Os valores de Salt e IV são tratados como **strings hexadecimais**, onde cada par de caracteres representa um byte. O Salt deve ter 8 bytes de informação hex (16 caracteres) e o IV deve ter 16 bytes (32 caracteres).

> **⚠️ Atenção:** Não tente usar os valores de Salt e IV como cipher string. Strings criptografadas dessa forma não poderão ser descriptografadas por esta função.

- Se você não passar ou referenciar um vetor de inicialização (IV), a função usará o valor da senha como IV.

- Para algoritmos DES e Triple DES, você pode especificar cipher mode e padding method adicionando um ponto e vírgula após o algoritmo. Cipher modes aceitos: `cbc` (padrão), `cfb`, `ecb`, `ofb`, `cts`. Padding methods aceitos: `pkcs7` (padrão), `ansix923`, `iso10126`, `zeros`, `none`. Exemplo: `"des;mode=cfb;padding=zeros"`.

> **⚠️ Atenção:** As funções `EncryptSymmetric` e `DecryptSymmetric` funcionam **somente** com dados contidos no Marketing Cloud. Não é possível usá-las com funcionalidades de criptografia/descriptografia de terceiros.

> **💡 Dica:** Para visualizar o resultado final em texto plano, você pode encapsular `EncryptSymmetric` com [Base64Encode](../encryption-functions/base64encode.md) na hora de criptografar e `DecryptSymmetric` com [Base64Decode](../encryption-functions/base64decode.md) na hora de descriptografar.

## Funções relacionadas

- [EncryptSymmetric](../encryption-functions/encryptsymmetric.md) — a função complementar que criptografa os dados
- [Base64Encode](../encryption-functions/base64encode.md) — útil para codificar o resultado criptografado em Base64
- [Base64Decode](../encryption-functions/base64decode.md) — útil para decodificar dados em Base64 antes de descriptografar
- [MD5](../encryption-functions/md5.md) — hash unidirecional (quando você não precisa recuperar o valor original)
- [SHA256](../encryption-functions/sha256.md) — hash unidirecional mais seguro
- [Lookup](../data-extension-functions/lookup.md) — para buscar dados criptografados em Data Extensions