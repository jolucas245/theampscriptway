---
title: GetJwtByKeyName
sidebar_label: GetJwtByKeyName
description: Cria um JSON Web Token (JWT) assinado a partir de um payload JSON, usando uma chave armazenada no Key Management do Marketing Cloud.
---

<!-- generated-by-script -->

# GetJwtByKeyName

## Descrição

A função `GetJwtByKeyName` cria um JSON Web Token (JWT) a partir de um payload JSON, assinando-o digitalmente com uma chave armazenada no **Key Management** do Marketing Cloud. JWTs são uma forma segura de transmitir informações entre sistemas como um objeto JSON — como o token é assinado, quem recebe pode ter certeza de que os dados não foram alterados no caminho. Essa função é a versão mais segura da [`GetJwt`](../encryption-functions/getjwt.md), porque a chave secreta fica protegida no Key Management em vez de aparecer em texto puro no código. O Marketing Cloud suporta algoritmos HMAC (HS256, HS384, HS512) e RSA (RS256, RS384, RS512).

## Sintaxe

```ampscript
GetJwtByKeyName(keyName, algorithm, jsonPayload)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| keyName | String | Sim | A chave externa (external key) de uma chave armazenada no Key Management do Marketing Cloud. A função converte a string da chave para um array de bytes usando UTF-8. Suporta strings em Base 16, Base 64 e caracteres ASCII. |
| algorithm | String | Sim | O algoritmo criptográfico e função de hash usados para assinar o token. Valores possíveis: `HS256`, `HS384`, `HS512` (HMAC com SHA), `RS256`, `RS384`, `RS512` (RSA com SHA). |
| jsonPayload | String | Sim | O payload do JWT. Normalmente é um objeto JSON com pares de nome-valor. **Atenção:** o payload do JWT não é criptografado, apenas assinado. |

## Exemplo básico

Imagine que a **Conecta Telecom** precisa gerar um token JWT para autenticar um cliente no portal de autoatendimento. A chave HMAC já está cadastrada no Key Management com a external key `conecta-hmac-key`.

```ampscript
%%[

SET @cpf = "123.456.789-00"
SET @nome = "João Silva"

SET @payload = Concat('{"sub":"', @cpf, '","nome":"', @nome, '","iat":1700000000}')

SET @jwt = GetJwtByKeyName("conecta-hmac-key", "HS256", @payload)

]%%

Seu token de acesso: %%=V(@jwt)=%%
```

**Saída:**
```
Seu token de acesso: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjMuNDU2Ljc4OS0wMCIsIm5vbWUiOiJKb8OjbyBTaWx2YSIsImlhdCI6MTcwMDAwMDAwMH0.XXXXXXXXXXXXX
```

## Exemplo avançado

Aqui um cenário mais completo: a **MegaStore** quer gerar um link personalizado de cashback para cada cliente. O JWT vai carregar as informações do programa de pontos e o link será montado para uma CloudPage. A chave RSA já está no Key Management com a external key `megastore-rsa-key`.

```ampscript
%%[

SET @email = AttributeValue("EmailAddress")
SET @nome = AttributeValue("PrimeiroNome")
SET @cpf = AttributeValue("CPF")
SET @pontosAcumulados = Lookup("ProgramaPontos", "Pontos", "CPF", @cpf)
SET @cashbackReais = Divide(@pontosAcumulados, 100)

/* Monta o payload JSON com os dados do cliente */
SET @payload = Concat(
  '{',
    '"sub":"', @cpf, '",',
    '"nome":"', @nome, '",',
    '"email":"', @email, '",',
    '"pontos":', @pontosAcumulados, ',',
    '"cashback_brl":', @cashbackReais, ',',
    '"campanha":"natal-2024",',
    '"iat":1703000000,',
    '"exp":1703604800',
  '}'
)

SET @jwt = GetJwtByKeyName("megastore-rsa-key", "RS256", @payload)

/* Monta a URL da CloudPage com o token */
SET @linkCashback = Concat("https://cloud.megastore.com.br/cashback?token=", @jwt)

]%%

Olá, %%=V(@nome)=%%! 🎄

Você tem **%%=V(@pontosAcumulados)=%% pontos** acumulados no programa MegaStore Fidelidade, 
equivalentes a **%%=FormatCurrency(@cashbackReais, "pt-BR", 2)=%%** em cashback!

<a href="%%=RedirectTo(@linkCashback)=%%">Resgatar meu cashback de Natal</a>

Válido até 26/12/2024. Frete grátis acima de R$299,00!
```

**Saída:**
```
Olá, Maria Santos! 🎄

Você tem 4500 pontos acumulados no programa MegaStore Fidelidade, 
equivalentes a R$45,00 em cashback!

Resgatar meu cashback de Natal (link com JWT embutido)

Válido até 26/12/2024. Frete grátis acima de R$299,00!
```

## Observações

- **Use sempre `GetJwtByKeyName` em vez de [`GetJwt`](../encryption-functions/getjwt.md).** A diferença é que `GetJwt` exige que você passe a chave secreta em texto puro direto no código, o que é um risco de segurança. Com `GetJwtByKeyName`, a chave fica protegida no Key Management, e você só referencia a external key.
- **O payload do JWT NÃO é criptografado.** Ele é apenas codificado em Base64 e assinado. Qualquer pessoa que tiver o token consegue ler o conteúdo do payload. Nunca coloque senhas, tokens de API ou dados sensíveis no payload.
- **A chave precisa estar cadastrada no Key Management** do Marketing Cloud antes de usar a função. Vá em **Setup > Data Management > Key Management** para criar ou importar sua chave.
- O Key Management também permite controlar quais usuários têm acesso às chaves, adicionando mais uma camada de segurança.
- Se a sintaxe da chamada estiver errada (número de parâmetros incorreto ou tipo de dado inválido), a função retorna um erro **InvalidFunctionException**.
- Se os dados passados forem inválidos (por exemplo, um JSON mal formatado no payload), a função retorna um erro **FunctionExecutionException**.
- A função suporta chaves em formato **Base 16**, **Base 64** e **ASCII**. A conversão para array de bytes usa **UTF-8**.
- **Algoritmos HMAC (HS256, HS384, HS512):** usam uma chave secreta compartilhada (simétrica). Ideal para comunicação entre sistemas que você controla.
- **Algoritmos RSA (RS256, RS384, RS512):** usam par de chaves pública/privada (assimétrica). Ideal para cenários onde terceiros precisam verificar o token usando apenas a chave pública.
- Sempre valide o JSON do payload antes de passar para a função. Um `Concat` mal montado (faltando aspas ou vírgulas) vai gerar erro.

## Funções relacionadas

- [GetJwt](../encryption-functions/getjwt.md) — Versão menos segura que recebe a chave secreta em texto puro (evite usar)
- [EncryptSymmetric](../encryption-functions/encryptsymmetric.md) — Criptografa dados usando algoritmos simétricos
- [DecryptSymmetric](../encryption-functions/decryptsymmetric.md) — Descriptografa dados criptografados com EncryptSymmetric
- [SHA256](../encryption-functions/sha256.md) — Gera hash SHA-256 de uma string
- [SHA512](../encryption-functions/sha512.md) — Gera hash SHA-512 de uma string
- [Concat](../string-functions/concat.md) — Concatena strings (útil para montar o payload JSON)
- [V](../utility-functions/v.md) — Exibe o valor de uma variável inline
- [RedirectTo](../http-functions/redirectto.md) — Redireciona para uma URL (útil para links com JWT)
- [Lookup](../data-extension-functions/lookup.md) — Busca valores em Data Extensions
- [CloudPagesURL](../sites-functions/cloudpagesurl.md) — Gera URLs para CloudPages com parâmetros criptografados