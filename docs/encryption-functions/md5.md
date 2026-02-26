---
title: MD5
sidebar_label: MD5
description: Converte uma string em um hash hexadecimal MD5 de 128 bits, útil para ofuscar dados sensíveis e criar identificadores únicos.
---

<!-- generated-by-script -->

# MD5

## Descrição

A função `MD5` converte uma string em um hash hexadecimal MD5 de 128 bits. É muito usada para ofuscar dados sensíveis (como CPF, e-mail ou identificadores de clientes) sem expor o valor original. Também serve para criar chaves únicas a partir de combinações de dados, como tokens para links de confirmação ou identificadores em programas de fidelidade. Por padrão, a codificação usada é UTF-8, mas você também pode usar UTF-16.

## Sintaxe

```ampscript
MD5(stringToConvert, charSet)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------------|--------|-------------|-----------|
| stringToConvert | String | Sim | A string que você quer converter em hash MD5. |
| charSet | String | Não | O conjunto de caracteres usado na codificação. O padrão é `UTF-8`. Você também pode usar `UTF-16`. |

## Exemplo básico

Imagine que você quer gerar um hash do e-mail do assinante para usar como identificador único em um link de preferências:

```ampscript
%%[
VAR @email, @hashEmail
SET @email = "joao.silva@email.com.br"
SET @hashEmail = MD5(@email)
]%%

Seu identificador: %%=v(@hashEmail)=%%
```

**Saída:**
```
Seu identificador: 7ccb47715d465a9e6a2b7d3c0441da80
```

## Exemplo com UTF-16

Você também pode gerar o hash usando codificação UTF-16, passando o segundo parâmetro:

```ampscript
%%[
VAR @email, @hashEmail16
SET @email = "joao.silva@email.com.br"
SET @hashEmail16 = MD5(@email, "UTF-16")
]%%

Hash UTF-16: %%=v(@hashEmail16)=%%
```

**Saída:**
```
Hash UTF-16: 3251ab3b9d54f085f6b57aa3bc134c3c
```

## Exemplo avançado

Vamos a um cenário real: a **Lojas Vitória** quer enviar um e-mail do programa de fidelidade com um link personalizado para o cliente consultar seus pontos. O link precisa de um token único baseado no CPF do cliente, sem expor o CPF na URL. Além disso, vamos usar o hash para montar um link seguro para a CloudPage:

```ampscript
%%[
VAR @nome, @cpf, @pontos, @token, @linkConsulta

SET @nome = AttributeValue("PrimeiroNome")
SET @cpf = AttributeValue("CPF")
SET @pontos = AttributeValue("Pontos")

/* Gera token único a partir do CPF */
SET @token = MD5(@cpf)

/* Monta o link da CloudPage com o token */
SET @linkConsulta = Concat("https://www.lojasvitoria.com.br/fidelidade?token=", @token)
]%%

Olá, %%=v(@nome)=%%! 🎉

Você tem **%%=v(@pontos)=%% pontos** no programa Vitória Fidelidade.

Para consultar seu extrato completo e trocar por descontos, acesse:
%%=RedirectTo(@linkConsulta)=%%

---
Lojas Vitória — Programa Vitória Fidelidade
```

**Saída (exemplo para o cliente João Silva com CPF 123.456.789-00):**
```
Olá, João! 🎉

Você tem 4.850 pontos no programa Vitória Fidelidade.

Para consultar seu extrato completo e trocar por descontos, acesse:
https://www.lojasvitoria.com.br/fidelidade?token=a3f2b8c1d4e5f6a7b8c9d0e1f2a3b4c5

---
Lojas Vitória — Programa Vitória Fidelidade
```

Na CloudPage de destino, você receberia o token via [RequestParameter](../sites-functions/requestparameter.md) e faria um [Lookup](../data-extension-functions/lookup.md) na Data Extension para encontrar o cliente correspondente ao hash.

## Observações

- **MD5 não é criptografia reversível.** É uma função de hash — você não consegue "descriptografar" o resultado de volta para o valor original. Isso é proposital e é o que torna útil para ofuscação.
- **MD5 não é considerado seguro para fins criptográficos.** Existem vulnerabilidades conhecidas de colisão. Para cenários que exigem maior segurança, considere usar [SHA256](../encryption-functions/sha256.md) ou [SHA512](../encryption-functions/sha512.md).
- **A mesma entrada sempre gera o mesmo hash.** Isso é útil para criar identificadores consistentes — o hash do mesmo CPF vai ser sempre igual.
- **O charset padrão é UTF-8.** Só mude para `UTF-16` se você tiver um motivo específico, como integração com um sistema externo que espera esse formato.
- **Cuidado com espaços extras.** Um espaço a mais na string vai gerar um hash completamente diferente. Use [Trim](../string-functions/trim.md) antes de passar o valor, se necessário.
- **Maiúsculas e minúsculas importam.** `"joao@email.com"` e `"Joao@email.com"` geram hashes diferentes. Normalize com [Lowercase](../string-functions/lowercase.md) se for preciso garantir consistência.
- A função funciona em todos os contextos do SFMC: e-mails, CloudPages, SMS e automações.

## Funções relacionadas

- [SHA1](../encryption-functions/sha1.md) — gera um hash SHA-1 (160 bits), mais seguro que MD5
- [SHA256](../encryption-functions/sha256.md) — gera um hash SHA-256 (256 bits), recomendado para maior segurança
- [SHA512](../encryption-functions/sha512.md) — gera um hash SHA-512 (512 bits), o mais seguro entre as funções de hash disponíveis
- [EncryptSymmetric](../encryption-functions/encryptsymmetric.md) — criptografia simétrica reversível, para quando você precisa recuperar o valor original
- [DecryptSymmetric](../encryption-functions/decryptsymmetric.md) — descriptografa valores criptografados com EncryptSymmetric
- [Lowercase](../string-functions/lowercase.md) — normaliza strings para minúsculas antes de gerar o hash
- [Trim](../string-functions/trim.md) — remove espaços extras antes de gerar o hash
- [Concat](../string-functions/concat.md) — combina strings, útil para montar URLs com o hash gerado
- [Lookup](../data-extension-functions/lookup.md) — busca dados em Data Extensions usando o hash como chave