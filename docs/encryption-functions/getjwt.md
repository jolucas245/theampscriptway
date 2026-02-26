---
title: GetJwt
sidebar_label: GetJwt
description: Cria um JSON Web Token (JWT) a partir de um payload JSON, assinado digitalmente com um secret e algoritmo HMAC especificado.
---

# GetJwt

## Descrição

A função `GetJwt` cria um JSON Web Token (JWT) a partir de um payload JSON. O JWT é assinado digitalmente usando um secret e um algoritmo de hash que você define, garantindo que os dados não sejam adulterados durante o transporte. Essa função é útil quando você precisa gerar tokens para autenticação em APIs externas, validar identidade de assinantes em CloudPages ou transmitir informações de forma segura entre sistemas. O retorno é uma string contendo o JWT completo (header.payload.signature).

> ⚠️ **Importante:** A Salesforce recomenda que você use a função [GetJwtByKeyName](../encryption-functions/getjwtbykeyname.md) em vez de `GetJwt`. A diferença é que em `GetJwt` você passa o secret em texto puro no código, enquanto `GetJwtByKeyName` referencia uma chave armazenada no Key Management do Marketing Cloud, o que é significativamente mais seguro.

## Sintaxe

```ampscript
GetJwt(secret, algorithm, jsonPayload)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| secret | String | Sim | O secret usado para assinar o JWT. É passado em texto puro. |
| algorithm | String | Sim | O algoritmo de hash usado para codificar o JWT. Valores possíveis: `HS256` (HMAC com SHA-256), `HS384` (HMAC com SHA-384) ou `HS512` (HMAC com SHA-512). |
| jsonPayload | String | Sim | O payload do JWT. Normalmente é um objeto JSON com pares de nome-valor. O payload do JWT **não é criptografado**, apenas assinado. |

## Exemplo básico

Imagine que a **Conecta Telecom** precisa gerar um JWT simples para autenticar um assinante em uma landing page de autoatendimento:

```ampscript
%%[

SET @secret = "meuSecretSuperSeguro2024"
SET @algoritmo = "HS256"
SET @payload = '{"sub":"joao.silva@email.com.br","nome":"João Silva","iat":1700000000}'

SET @jwt = GetJwt(@secret, @algoritmo, @payload)

]%%

Token gerado: %%=v(@jwt)=%%
```

**Saída:**
```
Token gerado: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJqb2FvLnNpbHZhQGVtYWlsLmNvbS5iciIsIm5vbWUiOiJKb8OjbyBTaWx2YSIsImlhdCI6MTcwMDAwMDAwMH0.[assinatura]
```

## Exemplo avançado

Agora um cenário mais completo: a **MegaStore** quer gerar um JWT personalizado para cada cliente, incluindo dados do programa de fidelidade, e usar isso em um link de CloudPage para acesso autenticado à área de pontos. Os dados vêm de uma Data Extension chamada `Fidelidade_Clientes`:

```ampscript
%%[

SET @email = AttributeValue("EmailAddress")
SET @dadosCliente = LookupRows("Fidelidade_Clientes", "Email", @email)

IF RowCount(@dadosCliente) > 0 THEN

  SET @linha = Row(@dadosCliente, 1)
  SET @nome = Field(@linha, "NomeCompleto")
  SET @cpf = Field(@linha, "CPF")
  SET @pontos = Field(@linha, "Pontos")
  SET @nivel = Field(@linha, "Nivel")

  /* Monta o payload JSON dinamicamente */
  SET @payload = Concat('{"sub":"', @email, '","nome":"', @nome, '","cpf":"', @cpf, '","pontos":', @pontos, ',"nivel":"', @nivel, '","iat":1700000000,"exp":1700086400}')

  SET @secret = "MegaStore_JWT_Secret_2024!"
  SET @jwt = GetJwt(@secret, "HS512", @payload)

  /* Monta a URL da CloudPage com o token */
  SET @linkPontos = Concat("https://cloud.megastore.com.br/meus-pontos?token=", @jwt)

ELSE

  SET @linkPontos = "https://cloud.megastore.com.br/cadastro"

ENDIF

]%%

<p>Olá, %%=v(@nome)=%%! 🎉</p>
<p>Você tem <strong>%%=v(@pontos)=%% pontos</strong> no programa MegaPontos (nível %%=v(@nivel)=%%).</p>
<p>Acima de 5.000 pontos você ganha frete grátis em compras acima de R$299!</p>
<p><a href="%%=RedirectTo(@linkPontos)=%%">Acessar meus pontos</a></p>
```

**Saída (exemplo para a assinante Maria Santos):**
```html
<p>Olá, Maria Santos! 🎉</p>
<p>Você tem <strong>7250 pontos</strong> no programa MegaPontos (nível Ouro).</p>
<p>Acima de 5.000 pontos você ganha frete grátis em compras acima de R$299!</p>
<p><a href="https://cloud.megastore.com.br/meus-pontos?token=eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJtYXJpYS5zYW50b3NAZW1haWwuY29tLmJyIiwibm9tZSI6Ik1hcmlhIFNhbnRvcyIsImNwZiI6IjEyMy40NTYuNzg5LTAwIiwicG9udG9zIjo3MjUwLCJuaXZlbCI6Ik91cm8iLCJpYXQiOjE3MDAwMDAwMDAsImV4cCI6MTcwMDA4NjQwMH0.[assinatura]">Acessar meus pontos</a></p>
```

## Observações

- ⚠️ **Segurança:** O `GetJwt` exige que você passe o secret em **texto puro** diretamente no código AMPscript. Isso é um risco de segurança, pois qualquer pessoa com acesso ao template do email ou CloudPage pode ver o secret. **Prefira usar [GetJwtByKeyName](../encryption-functions/getjwtbykeyname.md)**, que referencia chaves armazenadas de forma segura no Key Management.
- O payload do JWT **não é criptografado** — ele é apenas codificado em Base64 e assinado. Qualquer pessoa que tenha o token pode decodificar e ler o payload. **Nunca inclua dados sensíveis como senhas ou dados financeiros no payload.**
- CPFs e dados pessoais no payload ficam visíveis para quem decodificar o token. Avalie se realmente precisa incluir esses dados ou se pode usar apenas um identificador (como um ID interno).
- Os algoritmos suportados são apenas HMAC simétricos: `HS256`, `HS384` e `HS512`. Algoritmos assimétricos como RS256 não são suportados.
- Se a sintaxe da função estiver inválida, a função retorna um erro `InvalidFunctionException`.
- Se a chamada da função for inválida (por exemplo, um valor de parâmetro incorreto, como um algoritmo não suportado), a função retorna um erro `FunctionExecutionException`.
- O parâmetro `jsonPayload` precisa ser um JSON válido. Use a função [Concat](../string-functions/concat.md) para montar payloads dinâmicos com dados de assinantes.
- A função funciona tanto em emails quanto em CloudPages e Landing Pages.

## Funções relacionadas

- [GetJwtByKeyName](../encryption-functions/getjwtbykeyname.md) — Versão mais segura que referencia o secret pelo nome da chave armazenada no Key Management (recomendada pela Salesforce)
- [EncryptSymmetric](../encryption-functions/encryptsymmetric.md) — Criptografa dados usando algoritmos simétricos
- [DecryptSymmetric](../encryption-functions/decryptsymmetric.md) — Descriptografa dados criptografados com EncryptSymmetric
- [SHA256](../encryption-functions/sha256.md) — Gera hash SHA-256 de uma string
- [SHA512](../encryption-functions/sha512.md) — Gera hash SHA-512 de uma string
- [Concat](../string-functions/concat.md) — Concatena strings, útil para montar payloads JSON dinâmicos
- [RedirectTo](../http-functions/redirectto.md) — Redireciona para URLs, útil ao montar links com JWT
- [Lookup](../data-extension-functions/lookup.md) — Busca valores em Data Extensions para compor o payload
- [LookupRows](../data-extension-functions/lookuprows.md) — Busca linhas em Data Extensions para compor payloads mais complexos
- [CloudPagesURL](../sites-functions/cloudpagesurl.md) — Gera URLs de CloudPages, útil para combinar com tokens JWT