---
title: GetJwt
sidebar_label: GetJwt
description: Gera um JSON Web Token (JWT) assinado a partir de um payload JSON, um segredo e um algoritmo de hash.
---

# GetJwt

## Descrição

A função `GetJwt` cria um JSON Web Token (JWT) a partir de um payload JSON, assinando-o digitalmente com um segredo e um algoritmo de hash que você define. JWTs são usados para transmitir informações de forma segura entre sistemas — como quando você precisa autenticar uma chamada a uma API externa a partir de uma CloudPage ou gerar um token para validar a identidade de um subscriber. Como o JWT é assinado, quem recebe o token tem a garantia de que os dados não foram alterados no caminho.

## Sintaxe

```ampscript
GetJWT(secret, algorithm, jsonPayload)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| secret | String | Sim | Segredo usado para assinar o JWT. É passado em texto plano. |
| algorithm | String | Sim | Algoritmo de hash para codificar o JWT. Valores possíveis: `HS256` (HMAC com SHA-256), `HS384` (HMAC com SHA-384) ou `HS512` (HMAC com SHA-512). |
| jsonPayload | String | Sim | O payload do JWT. Normalmente é um objeto JSON com pares de nome-valor. O payload do JWT não é criptografado. |

## Exemplo básico

Gerando um JWT simples com dados de um cliente para autenticação em um sistema externo do Banco Brasilão:

```ampscript
%%[
SET @segredo = "minha-chave-secreta-banco-brasilao-2024"
SET @algoritmo = "HS256"
SET @payload = '{"sub":"joao.silva@bancobrasilao.com.br","nome":"João Silva","cpf":"123.456.789-00"}'

SET @token = GetJWT(@segredo, @algoritmo, @payload)
]%%

Token gerado: %%=v(@token)=%%
```

**Saída:**
```
Token gerado: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJqb2FvLnNpbHZhQGJhbmNvbWVyaWRpb25hbC5jb20uYnIiLCJub21lIjoiSm_Do28gU2lsdmEiLCJjcGYiOiIxMjMuNDU2Ljc4OS0wMCJ9.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

## Exemplo avançado

Em uma régua de relacionamento da MegaStore, você precisa gerar um link seguro por e-mail que permita ao cliente acessar uma área logada na CloudPage sem digitar senha. O JWT carrega o identificador do cliente e uma data de expiração, e o payload é montado dinamicamente com dados da Data Extension:

```ampscript
%%[
SET @email = AttributeValue("EmailAddress")
SET @nome = AttributeValue("FirstName")
SET @clienteId = AttributeValue("ClienteId")

/* Monta o payload dinamicamente */
SET @payload = Concat('{"sub":"', @clienteId, '","email":"', @email, '","nome":"', @nome, '","iat":"', Format(Now(), "yyyy-MM-ddTHH:mm:ss"), '","origem":"email-megastore"}')

SET @segredo = "chave-super-secreta-megastore-prod-2024"
SET @token = GetJWT(@segredo, "HS512", @payload)

SET @linkSeguro = Concat("https://cloud.megastore.com.br/minha-conta?token=", @token)
]%%

<a href="%%=RedirectTo(@linkSeguro)=%%">Acessar minha conta</a>
```

**Saída:**
```html
<a href="https://cloud.megastore.com.br/minha-conta?token=eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5ODc2NSIsImVtYWlsIjoibWFyaWEuc2FudG9zQGdtYWlsLmNvbSIsIm5vbWUiOiJNYXJpYSIsImlhdCI6IjIwMjQtMDctMTVUMTA6MzA6MDAiLCJvcmlnZW0iOiJlbWFpbC1tZWdhc3RvcmUifQ.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX">Acessar minha conta</a>
```

## Observações

> **⚠️ Atenção:** O payload do JWT **não é criptografado** — ele é apenas codificado em Base64. Qualquer pessoa que tenha o token consegue ler o conteúdo do payload. Nunca inclua dados sensíveis como senhas, números completos de cartão de crédito ou tokens de acesso no payload.

> **⚠️ Atenção:** Na função `GetJwt`, o segredo é passado em **texto plano** diretamente no código. A Salesforce recomenda usar a função [`GetJwtByKeyName`](../encryption-functions/getjwtbykeyname.md) no lugar, que referencia uma chave armazenada no Key Management do Marketing Cloud. Isso é mais seguro porque o segredo não fica exposto no código e você controla quem tem acesso às chaves.

> **💡 Dica:** Se a sintaxe da função estiver inválida, ela retorna um erro do tipo `InvalidFunctionException`. Se a chamada em si for inválida — por exemplo, se você passar um algoritmo que não existe — o erro será `FunctionExecutionException`. Valide seus parâmetros antes de publicar.

> **💡 Dica:** Os algoritmos disponíveis são apenas da família HMAC: `HS256`, `HS384` e `HS512`. Se o sistema externo que vai consumir o JWT exigir RSA ou outro tipo de assinatura, essa função não vai atender.

## Funções relacionadas

- [`GetJwtByKeyName`](../encryption-functions/getjwtbykeyname.md) — versão mais segura que referencia o segredo pelo Key Management em vez de texto plano
- [`Base64Encode`](../encryption-functions/base64encode.md) — codificação Base64 de strings
- [`Base64Decode`](../encryption-functions/base64decode.md) — decodificação Base64
- [`SHA256`](../encryption-functions/sha256.md) — hash SHA-256 para outros cenários de assinatura
- [`SHA512`](../encryption-functions/sha512.md) — hash SHA-512
- [`Concat`](../string-functions/concat.md) — concatenação de strings, útil para montar payloads dinâmicos
- [`HTTPPost`](../http-functions/httppost.md) — para enviar o JWT em chamadas a APIs externas