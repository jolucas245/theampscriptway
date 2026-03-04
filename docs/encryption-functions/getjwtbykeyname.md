---
title: GetJwtByKeyName
sidebar_label: GetJwtByKeyName
description: Cria um JSON Web Token (JWT) a partir de um payload JSON, usando uma chave armazenada no Key Management do Marketing Cloud.
---

# GetJwtByKeyName

## Descrição

Cria um JSON Web Token (JWT) assinado digitalmente a partir de um payload JSON. A assinatura é feita com uma chave armazenada no **Key Management** do Marketing Cloud, o que significa que você nunca expõe o segredo diretamente no código — diferente da função [GetJwt](../encryption-functions/getjwt.md), onde a chave é passada em texto puro. Suporta algoritmos HMAC (HS256, HS384, HS512) e RSA (RS256, RS384, RS512), e retorna o token JWT completo como string.

## Sintaxe

```ampscript
GetJwtByKeyName(keyName, algorithm, jsonPayload)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| keyName | String | Sim | A external key de uma chave armazenada no Key Management. A função converte a string da chave para um array de bytes usando UTF-8. Suporta strings em Base 16, Base 64 e caracteres ASCII. |
| algorithm | String | Sim | Algoritmo criptográfico e função hash usados para assinar o token. Valores possíveis: `HS256` (HMAC com SHA-256), `HS384` (HMAC com SHA-384), `HS512` (HMAC com SHA-512), `RS256` (RSA com SHA-256), `RS384` (RSA com SHA-384), `RS512` (RSA com SHA-512). |
| jsonPayload | String | Sim | O payload do JWT. Normalmente é um objeto JSON com pares nome-valor. O payload do JWT **não é criptografado**. |

## Exemplo básico

Gerando um JWT simples para autenticar uma chamada de API do sistema de fidelidade da MegaStore:

```ampscript
%%[

SET @keyName = "megastore-api-hmac-key"
SET @algorithm = "HS256"
SET @payload = '{"sub":"megastore-sfmc","iat":1718000000,"exp":1718003600,"cliente":"joao.silva@megastore.com.br"}'

SET @jwt = GetJwtByKeyName(@keyName, @algorithm, @payload)

Output(Concat("Token: ", @jwt))

]%%
```

**Saída:**
```
Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJtZWdhc3RvcmUtc2ZtYyIsImlhdCI6MTcxODAwMDAwMCwiZXhwIjoxNzE4MDAzNjAwLCJjbGllbnRlIjoiam9hby5zaWx2YUBtZWdhc3RvcmUuY29tLmJyIn0.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

## Exemplo avançado

Em uma régua de relacionamento do Banco Brasilão, uma CloudPage gera um JWT com RSA para autenticar o cliente em um portal de segunda via de boleto. O payload inclui dados do assinante recuperados via [Lookup](../data-extension-functions/lookup.md):

```ampscript
%%[

SET @email = AttributeValue("EmailAddress")
SET @cpf = Lookup("Clientes_Brasilão", "CPF", "Email", @email)
SET @nome = Lookup("Clientes_Brasilão", "NomeCompleto", "Email", @email)
SET @conta = Lookup("Clientes_Brasilão", "NumeroConta", "Email", @email)

IF NOT Empty(@cpf) THEN

  SET @keyName = "brasilao-rsa-private-key"
  SET @algorithm = "RS256"

  SET @payload = Concat(
    '{"sub":"', @email, '",',
    '"nome":"', @nome, '",',
    '"conta":"', @conta, '",',
    '"iat":1718000000,',
    '"exp":1718003600,',
    '"iss":"sfmc-banco-brasilao"}'
  )

  SET @jwt = GetJwtByKeyName(@keyName, @algorithm, @payload)

  Output(Concat('<a href="https://boletos.bancobrasilao.com.br/validar?token=', @jwt, '">Acessar segunda via do boleto</a>'))

ELSE

  Output("Não foi possível gerar o link seguro. Entre em contato com o suporte.")

ENDIF

]%%
```

**Saída:**
```html
<a href="https://boletos.bancobrasilao.com.br/validar?token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJqb2FvLnNpbHZhQG1lcmlkaW9uYWwuY29tLmJyIiwibm9tZSI6Ikpvw6NvIFNpbHZhIiwiY29udGEiOiIxMjM0NTYiLCJpYXQiOjE3MTgwMDAwMDAsImV4cCI6MTcxODAwMzYwMCwiaXNzIjoic2ZtYy1iYW5jby1tZXJpZGlvbmFsIn0.XXXXXXXXXXXXX">Acessar segunda via do boleto</a>
```

## Observações

- A Salesforce **recomenda usar `GetJwtByKeyName` em vez de [`GetJwt`](../encryption-functions/getjwt.md)**. A diferença fundamental é que em `GetJwtByKeyName` você referencia a chave pela external key do Key Management, enquanto em `GetJwt` o segredo é passado em texto puro no código. Isso traz mais segurança e permite controlar o acesso às chaves por usuário.

- O payload do JWT **não é criptografado** — ele é apenas assinado. Isso significa que qualquer pessoa que tenha o token pode decodificar e ler o payload. Nunca inclua dados sensíveis como senhas ou números completos de cartão no payload.

> **⚠️ Atenção:** Se a sintaxe da chamada estiver incorreta (número errado de parâmetros ou tipo de dado inválido), a função retorna um erro **InvalidFunctionException**. Se os valores dos parâmetros forem inválidos (por exemplo, um JSON mal formatado no payload), o erro retornado é **FunctionExecutionException**. Valide seu JSON antes de passar para a função.

> **💡 Dica:** Use a função [Concat](../string-functions/concat.md) para montar o payload JSON dinamicamente com dados do assinante, como no exemplo avançado. Tome cuidado com aspas e caracteres especiais dentro das strings para não quebrar a estrutura do JSON.

## Funções relacionadas

- [GetJwt](../encryption-functions/getjwt.md) — versão onde o segredo é passado em texto puro (menos segura)
- [Base64Encode](../encryption-functions/base64encode.md) — codificação Base64, útil para entender a estrutura de um JWT
- [Base64Decode](../encryption-functions/base64decode.md) — decodificação Base64
- [SHA256](../encryption-functions/sha256.md) — hash SHA-256, um dos algoritmos usados nos JWTs
- [SHA512](../encryption-functions/sha512.md) — hash SHA-512, outro algoritmo disponível
- [EncryptSymmetric](../encryption-functions/encryptsymmetric.md) — criptografia simétrica para quando precisar proteger o conteúdo (não apenas assinar)
- [Concat](../string-functions/concat.md) — essencial para montar payloads JSON dinâmicos
- [Lookup](../data-extension-functions/lookup.md) — para buscar dados do assinante e incluir no payload