---
title: DecryptSymmetric
sidebar_label: DecryptSymmetric
description: Descriptografa dados que foram criptografados com a função EncryptSymmetric, usando o algoritmo e valores de criptografia fornecidos.
---

# DecryptSymmetric

## Descrição

A função `DecryptSymmetric` descriptografa dados que foram previamente criptografados usando a função `EncryptSymmetric()`. Você precisa fornecer o algoritmo de criptografia utilizado e os valores (ou chaves externas) de senha, salt e vetor de inicialização (IV) que foram usados na criptografia original. Essa função é essencial para proteger dados sensíveis como CPF, número de cartão, tokens e outras informações pessoais armazenadas em Data Extensions. Ela retorna o texto original (descriptografado) como string.

## Sintaxe

```ampscript
DecryptSymmetric(
  @dadosCriptografados,
  "algoritmo",
  @senhaChaveExterna, @senhaValor,
  @saltChaveExterna, @saltValor,
  @ivChaveExterna, @ivValor
)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| encryptedData | string | Sim | Os dados criptografados que você quer descriptografar. |
| encryptionAlgorithm | string | Sim | O algoritmo usado na criptografia. Valores aceitos: `aes` (AES/Rijndael), `des` (DES) e `tripledes` (Triple DES/Triple DEA). Para DES e Triple DES, você pode especificar modos de cifra e métodos de padding. |
| passwordExternalKey | string | Sim | A chave externa de uma senha criada no Key Management. Use `@null` (variável não declarada) se for passar o valor diretamente. |
| passwordValue | string | Sim | O valor da senha. Use `@null` se for usar a chave externa. |
| saltExternalKey | string | Sim | A chave externa de um salt no Key Management. Use `@null` se for passar o valor diretamente. |
| saltValue | string | Sim | O valor do salt, representado como uma string hexadecimal de 8 bytes. Use `@null` se for usar a chave externa. |
| ivExternalKey | string | Sim | A chave externa de um vetor de inicialização (IV) no Key Management. Use `@null` se for passar o valor diretamente. |
| ivValue | string | Sim | O vetor de inicialização, representado como uma string hexadecimal de 16 bytes. Use `@null` se for usar a chave externa. |

### Modos de cifra (DES e Triple DES)

Para especificar um modo de cifra, adicione ponto e vírgula após o algoritmo, seguido de `mode=` e o nome do modo:

| Modo | Descrição |
|---|---|
| `cbc` | Cipher Block Chaining (padrão) |
| `cfb` | Cipher Feedback |
| `ecb` | Electronic Codebook |
| `ofb` | Output Feedback |
| `cts` | Ciphertext Stealing |

### Métodos de padding (DES e Triple DES)

Adicione `padding=` seguido do nome do método:

| Padding | Descrição |
|---|---|
| `pkcs7` | PKCS#7/RFC 5652 (padrão) |
| `ansix923` | ANSI X9.23 |
| `iso10126` | ISO 10126 |
| `zeros` | Zero padding (preenchimento com zeros) |
| `none` | Sem padding |

**Exemplo de sintaxe com modo e padding:** `"des;mode=ofb;padding=zeros"`

## Exemplo básico

Esse exemplo mostra como descriptografar um CPF que foi armazenado criptografado em uma Data Extension. Aqui usamos valores diretos para senha, salt e IV (sem chaves externas):

```ampscript
%%[
/* Busca o CPF criptografado na Data Extension */
SET @cpfCriptografado = Lookup("Clientes_BancoMeridional", "CPF_Criptografado", "Email", EmailAddress)

/* Define os valores de criptografia */
SET @senha = "M3r1d10n@lS3gur0!"
SET @salt = "0a1b2c3d4e5f6a7b"
SET @iv = "00112233445566778899aabbccddeeff"

/* Descriptografa usando valores diretos — @null para chaves externas */
SET @cpfOriginal = DecryptSymmetric(
  @cpfCriptografado,
  "aes",
  @null, @senha,
  @null, @salt,
  @null, @iv
)
]%%

Olá! Seu CPF cadastrado é: %%=v(@cpfOriginal)=%%
```

**Saída:**
```
Olá! Seu CPF cadastrado é: 123.456.789-00
```

## Exemplo avançado

Cenário real: Uma CloudPage do **Banco Meridional** onde o cliente consulta seus dados cadastrais. Os dados sensíveis (CPF e telefone) estão criptografados na Data Extension e são descriptografados usando chaves externas configuradas no Key Management da conta SFMC:

```ampscript
%%[
/* Recebe o token do cliente via query string */
SET @token = RequestParameter("token")

/* Busca os dados criptografados na Data Extension */
SET @linhaCliente = LookupRows("Clientes_BancoMeridional", "Token", @token)

IF RowCount(@linhaCliente) > 0 THEN
  SET @registro = Row(@linhaCliente, 1)
  SET @nomeCliente = Field(@registro, "Nome")
  SET @cpfCriptografado = Field(@registro, "CPF_Criptografado")
  SET @telCriptografado = Field(@registro, "Telefone_Criptografado")
  SET @saldoPontos = Field(@registro, "SaldoPontos")

  /* Descriptografa CPF usando chaves externas do Key Management */
  SET @cpfOriginal = DecryptSymmetric(
    @cpfCriptografado,
    "aes",
    "bancomeridional-senha-key", @null,
    "bancomeridional-salt-key", @null,
    "bancomeridional-iv-key", @null
  )

  /* Descriptografa telefone usando chaves externas */
  SET @telOriginal = DecryptSymmetric(
    @telCriptografado,
    "aes",
    "bancomeridional-senha-key", @null,
    "bancomeridional-salt-key", @null,
    "bancomeridional-iv-key", @null
  )

  /* Mascara o CPF para exibição segura: mostra só os 3 últimos dígitos */
  SET @cpfMascarado = Concat("***.***.", Substring(@cpfOriginal, 9, 6))
]%%

<h2>Olá, %%=v(@nomeCliente)=%%!</h2>
<p><strong>CPF:</strong> %%=v(@cpfMascarado)=%%</p>
<p><strong>Telefone:</strong> %%=v(@telOriginal)=%%</p>
<p><strong>Saldo do Programa de Pontos:</strong> %%=v(@saldoPontos)=%% pontos</p>
<p>Troque seus pontos por cashback em R$ ou frete grátis acima de R$ 299,00!</p>

%%[ ELSE ]%%

<p>Token inválido. Acesse <a href="https://www.bancomeridional.com.br/minhaconta">sua conta</a> para gerar um novo link.</p>

%%[ ENDIF ]%%
```

**Saída (para o cliente Carlos Oliveira):**
```html
Olá, Carlos Oliveira!
CPF: ***.***.789-00
Telefone: (11) 99876-5432
Saldo do Programa de Pontos: 4.850 pontos
Troque seus pontos por cashback em R$ ou frete grátis acima de R$ 299,00!
```

## Observações

- **Uso apenas interno ao SFMC:** As funções `EncryptSymmetric()` e `DecryptSymmetric()` só funcionam com dados criptografados **dentro do Marketing Cloud Engagement**. Você **não pode** usar essas funções para descriptografar dados criptografados por sistemas de terceiros, nem o contrário.
- **Salt e IV são strings hexadecimais:** O salt deve ter **8 bytes** de informação hexadecimal (16 caracteres hex) e o IV deve ter **16 bytes** (32 caracteres hex). A função trata esses valores como hex strings, onde cada par de caracteres representa um byte.
- **Não use como cipher string:** Não tente usar os valores de salt e IV como cipher string — a descriptografia falhará.
- **Base64 para texto legível:** Você pode encapsular `EncryptSymmetric()` e `DecryptSymmetric()` dentro de `Base64Encode()` e `Base64Decode()` para visualizar o resultado final em texto plano.
- **IV opcional (com ressalvas):** Se você não fornecer nem referenciar um vetor de inicialização, a função usa o valor da senha como IV. Porém, isso é menos seguro — sempre forneça um IV dedicado.
- **Key Management:** Se você criou chaves na seção Key Management da interface do Marketing Cloud, pode referenciar as chaves externas em vez de passar os valores diretamente. Isso é a abordagem mais segura e recomendada, pois evita expor senhas e chaves no código.
- **Valores ou chaves externas, nunca ambos:** Para cada par (passwordExternalKey/passwordValue, saltExternalKey/saltValue, ivExternalKey/ivValue), forneça **um ou outro**. Use uma variável não declarada (ex: `@null`) para o parâmetro que você não vai usar.
- **Modos de cifra e padding:** A especificação de `mode=` e `padding=` só se aplica aos algoritmos `des` e `tripledes`. O AES usa os padrões CBC e PKCS#7.
- **Cuidado com dados nulos:** Se o dado criptografado vier vazio ou nulo da Data Extension, a função pode gerar erro. Sempre valide com [Empty](../utility-functions/empty.md) ou [IsNull](../utility-functions/isnull.md) antes de tentar descriptografar.

## Funções relacionadas

- [EncryptSymmetric](../encryption-functions/encryptsymmetric.md) — Criptografa dados usando algoritmo simétrico (contraparte direta do DecryptSymmetric)
- [MD5](../encryption-functions/md5.md) — Gera hash MD5 de uma string (criptografia unidirecional)
- [SHA256](../encryption-functions/sha256.md) — Gera hash SHA-256 de uma string (criptografia unidirecional mais segura)
- [SHA512](../encryption-functions/sha512.md) — Gera hash SHA-512 de uma string
- [Lookup](../data-extension-functions/lookup.md) — Busca valor em uma Data Extension (útil para recuperar dados criptografados)
- [LookupRows](../data-extension-functions/lookuprows.md) — Busca múltiplas linhas em uma Data Extension
- [Field](../data-extension-functions/field.md) — Extrai o valor de um campo de uma linha retornada por LookupRows
- [Empty](../utility-functions/empty.md) — Verifica se um valor está vazio (útil para validar antes de descriptografar)
- [IsNull](../utility-functions/isnull.md) — Verifica se um valor é nulo
- [CloudPagesURL](../sites-functions/cloudpagesurl.md) — Gera URL para CloudPages (cenário comum para exibir dados descriptografados)
- [RequestParameter](../sites-functions/requestparameter.md) — Captura parâmetros de query string em CloudPages