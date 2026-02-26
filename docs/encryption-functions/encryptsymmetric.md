---
title: EncryptSymmetric
sidebar_label: EncryptSymmetric
description: Criptografa dados em texto simples usando um algoritmo simétrico e valores de senha, salt e vetor de inicialização (IV).
---

# EncryptSymmetric

## Descrição

A função `EncryptSymmetric()` criptografa uma string de texto simples usando um algoritmo de criptografia simétrica (AES, DES ou Triple DES) junto com uma senha, um valor de salt e um vetor de inicialização (IV). Ela é muito útil quando você precisa proteger dados sensíveis como CPF, números de cartão de fidelidade ou tokens antes de armazená-los em Data Extensions ou exibi-los em CloudPages. Você pode fornecer os valores de senha, salt e IV diretamente como parâmetros ou referenciar chaves externas cadastradas na seção Key Management do Marketing Cloud. O resultado é uma string criptografada que só pode ser revertida usando a função `DecryptSymmetric()` com os mesmos parâmetros.

## Sintaxe

```ampscript
EncryptSymmetric(@textoSimples, "algoritmo", @passwordExternalKey, @passwordValue, @saltExternalKey, @saltValue, @ivExternalKey, @ivValue)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| data | string | Sim | O texto simples que você quer criptografar. |
| encryptionAlgorithm | string | Sim | O algoritmo de criptografia. Opções: `aes`, `des`, `tripledes`. Você pode adicionar modo e padding (ex: `tripledes;mode=cfb;padding=ansix923`). |
| passwordExternalKey | string | Sim | A chave externa de uma senha cadastrada no Key Management. Passe uma variável vazia/nula se for usar o valor direto. |
| passwordValue | string | Sim | O valor da senha. Passe uma variável vazia/nula se for usar a chave externa. |
| saltExternalKey | string | Sim | A chave externa de um salt cadastrado no Key Management. Passe uma variável vazia/nula se for usar o valor direto. |
| saltValue | string | Sim | O valor do salt, representado como uma string hexadecimal de 8 bytes (16 caracteres hex). Passe uma variável vazia/nula se for usar a chave externa. |
| ivExternalKey | string | Sim | A chave externa de um vetor de inicialização (IV) cadastrado no Key Management. Passe uma variável vazia/nula se for usar o valor direto. |
| ivValue | string | Sim | O vetor de inicialização, representado como uma string hexadecimal de 16 bytes (32 caracteres hex). Passe uma variável vazia/nula se for usar a chave externa. Se não for informado, a função usa o valor da senha como IV. |

### Algoritmos disponíveis

| Algoritmo | Descrição | Segurança |
|---|---|---|
| `aes` | AES (Advanced Encryption Standard) | Mais seguro |
| `tripledes` | Triple DES (aplica DES três vezes a cada bloco) | Intermediário |
| `des` | DES (Data Encryption Standard) | Menos seguro |

### Modos de operação (para DES e Triple DES)

Adicione após o algoritmo com `;mode=`: `cbc` (padrão), `cfb`, `cts`, `ecb`, `ofb`.

### Métodos de padding

Adicione após o modo com `;padding=`: `pkcs7` (padrão), `ansix923`, `iso10126`, `none`, `zeros`.

## Exemplo básico

Imagine que o **Banco Meridional** precisa criptografar o CPF do cliente antes de gravar numa URL segura de CloudPage para consulta de extrato:

```ampscript
%%[
VAR @cpf, @encData, @null
SET @cpf = "123.456.789-00"

/* Usando valores diretos — chaves externas ficam como @null (não declarada) */
SET @encData = EncryptSymmetric(
  @cpf,
  "aes",
  @null, "M1nh@S3nh@F0rt3!",
  @null, "0000000000000000",
  @null, "00000000000000000000000000000000"
)
]%%

CPF criptografado: %%=v(@encData)=%%
```

**Saída:**
```
CPF criptografado: kX7jF2mQpL8sN4vR+3wYtA==  (exemplo ilustrativo — o valor real varia)
```

## Exemplo avançado

Cenário real: a **FarmaRede** quer enviar um e-mail com um link seguro para a CloudPage do programa de pontos. O link contém o número do cartão fidelidade criptografado e codificado em Base64 para ser passado via URL. Na CloudPage, o valor será descriptografado.

### Parte 1 — No e-mail (criptografar e montar o link)

```ampscript
%%[
VAR @cartaoFidelidade, @nomeCliente, @encCartao, @encCartaoB64, @linkSeguro, @null

SET @nomeCliente = AttributeValue("PrimeiroNome")
SET @cartaoFidelidade = AttributeValue("CartaoFidelidade")

/* Criptografar com Triple DES, modo CFB e padding ANSI X9.23 */
SET @encCartao = EncryptSymmetric(
  @cartaoFidelidade,
  "tripledes;mode=cfb;padding=ansix923",
  @null, "P0nt0sFarma2024!",
  @null, "4F6A7B8C9D0E1F2A",
  @null, "4F6A7B8C9D0E1F2A4F6A7B8C9D0E1F2A"
)

/* Codificar em Base64 e depois URL-encode para ficar seguro na URL */
SET @encCartaoB64 = Base64Encode(@encCartao)
SET @linkSeguro = Concat(
  "https://cloud.bancomeridional.com.br/pontos?token=",
  URLEncode(@encCartaoB64)
)
]%%

Olá, %%=v(@nomeCliente)=%%, confira seus pontos FarmaRede!

<a href="%%=RedirectTo(@linkSeguro)=%%">Ver meus pontos</a>
```

### Parte 2 — Na CloudPage (descriptografar)

```ampscript
%%[
VAR @tokenParam, @encCartaoDecoded, @cartaoOriginal, @null

SET @tokenParam = RequestParameter("token")

/* Decodificar de Base64 */
SET @encCartaoDecoded = Base64Decode(@tokenParam)

/* Descriptografar com os mesmos parâmetros */
SET @cartaoOriginal = DecryptSymmetric(
  @encCartaoDecoded,
  "tripledes;mode=cfb;padding=ansix923",
  @null, "P0nt0sFarma2024!",
  @null, "4F6A7B8C9D0E1F2A",
  @null, "4F6A7B8C9D0E1F2A4F6A7B8C9D0E1F2A"
)
]%%

<h1>Programa de Pontos FarmaRede</h1>
<p>Cartão: %%=v(@cartaoOriginal)=%%</p>
```

**Saída (na CloudPage):**
```
Programa de Pontos FarmaRede
Cartão: 9876543210  (valor original descriptografado)
```

## Exemplo com Key Management

Se você já cadastrou chaves no Key Management do Marketing Cloud, pode referenciá-las pelas chaves externas em vez de colocar os valores diretamente no código — isso é bem mais seguro para produção:

```ampscript
%%[
VAR @cpf, @encData, @null

SET @cpf = Lookup("Clientes_BancoMeridional", "CPF", "EmailAddress", EmailAddress)

SET @encData = EncryptSymmetric(
  @cpf,
  "aes",
  "chave-senha-banco-meridional", @null,
  "chave-salt-banco-meridional", @null,
  "chave-iv-banco-meridional", @null
)
]%%
```

## Observações

- **Funciona apenas dentro do Marketing Cloud.** Você **não pode** usar `EncryptSymmetric()` e `DecryptSymmetric()` para interoperar com sistemas de criptografia de terceiros. Os dados precisam ser criptografados e descriptografados usando essas mesmas funções do AMPscript.
- **Salt e IV são strings hexadecimais.** O salt deve ter 8 bytes (16 caracteres hexadecimais) e o IV deve ter 16 bytes (32 caracteres hexadecimais). Cada par de caracteres representa um byte. Não tente usar esses valores como cipher strings — a descriptografia vai falhar.
- **Se você não informar o IV**, a função usa o valor da senha como vetor de inicialização.
- **AES é o algoritmo mais seguro** e deve ser a sua primeira escolha. Use DES ou Triple DES apenas se houver alguma necessidade específica de compatibilidade.
- **Modos de operação e padding** só podem ser especificados para DES e Triple DES. O formato é: `tripledes;mode=cfb;padding=ansix923`.
- **Use Base64Encode/Base64Decode** para envolver o resultado criptografado quando precisar visualizar ou transportar a string (por exemplo, em URLs ou Data Extensions com campo texto).
- **Para produção, prefira usar Key Management** em vez de colocar senhas, salts e IVs diretamente no código. Isso é mais seguro e facilita a rotação de chaves.
- Para parâmetros que você não vai usar (chave externa ou valor direto), passe uma variável não declarada (como `@null`) — o SFMC vai tratá-la como vazia.
- O modo de operação padrão é `cbc` (Cipher Block Chaining) e o padding padrão é `pkcs7`.

## Funções relacionadas

- [DecryptSymmetric](../encryption-functions/decryptsymmetric.md) — Descriptografa dados que foram criptografados com `EncryptSymmetric()`
- [MD5](../encryption-functions/md5.md) — Gera um hash MD5 de uma string (mão única, sem descriptografia)
- [SHA256](../encryption-functions/sha256.md) — Gera um hash SHA-256 de uma string
- [SHA512](../encryption-functions/sha512.md) — Gera um hash SHA-512 de uma string
- [Base64Encode](../content-functions/buildrowsetfromstring.md) — Útil para codificar o resultado criptografado em Base64
- [URLEncode](../string-functions/urlencode.md) — Codifica strings para uso seguro em URLs
- [Lookup](../data-extension-functions/lookup.md) — Busca valores em Data Extensions para criptografar
- [AttributeValue](../utility-functions/attributevalue.md) — Recupera atributos do assinante de forma segura
- [CloudPagesURL](../sites-functions/cloudpagesurl.md) — Gera URLs de CloudPages onde você pode passar dados criptografados
- [RequestParameter](../sites-functions/requestparameter.md) — Captura parâmetros na CloudPage para descriptografar
- [RedirectTo](../http-functions/redirectto.md) — Redireciona para URLs com dados criptografados