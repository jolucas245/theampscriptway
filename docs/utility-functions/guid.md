---
title: GUID
sidebar_label: GUID
description: Gera um identificador único global (GUID) hexadecimal de 128 bits.
---

# GUID

## Descrição

A função `GUID` gera um identificador único global (Globally Unique Identifier) hexadecimal de 128 bits. É extremamente útil quando você precisa criar chaves únicas para registros em Data Extensions, tokens de transações, códigos de rastreamento ou qualquer situação onde um valor que não se repita é essencial. O retorno é uma string no formato `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`.

## Sintaxe

```ampscript
GUID()
```

## Parâmetros

A função `GUID` não aceita nenhum parâmetro.

## Exemplo básico

Gerando um identificador único para usar como código de protocolo em um e-mail transacional da Conecta Telecom:

```ampscript
%%[
VAR @protocolo
SET @protocolo = GUID()
]%%

Olá, João Silva! Seu protocolo de atendimento é: %%=v(@protocolo)=%%
```

**Saída:**
```
Olá, João Silva! Seu protocolo de atendimento é: a0f71563-b064-4b02-a21a-571dadadafb1
```

## Exemplo avançado

Criando um identificador único para registrar cada envio de cupom promocional em uma Data Extension, garantindo rastreabilidade na régua de relacionamento da MegaStore:

```ampscript
%%[
VAR @codigoCupom, @emailCliente, @nomeCupom

SET @emailCliente = AttributeValue("EmailAddress")
SET @codigoCupom = GUID()
SET @nomeCupom = Concat("MEGA-", Uppercase(Substring(@codigoCupom, 1, 8)))

/* Registra o cupom na DE de controle */
InsertDE(
  "Cupons_Enviados",
  "CupomID", @codigoCupom,
  "CodigoCupom", @nomeCupom,
  "Email", @emailCliente,
  "DataEnvio", Now()
)
]%%

<h2>Seu cupom exclusivo, Maria Santos!</h2>
<p>Use o código <strong>%%=v(@nomeCupom)=%%</strong> e ganhe 15% de desconto em compras acima de R$ 199,90.</p>
<p><small>Protocolo: %%=v(@codigoCupom)=%%</small></p>
```

**Saída:**
```
Seu cupom exclusivo, Maria Santos!
Use o código MEGA-A0F71563 e ganhe 15% de desconto em compras acima de R$ 199,90.
Protocolo: a0f71563-b064-4b02-a21a-571dadadafb1
```

## Observações

- Cada chamada de `GUID()` gera um valor diferente. Se você precisar usar o mesmo GUID em mais de um lugar no seu código, armazene-o em uma variável antes.

> **💡 Dica:** `GUID()` é ideal como chave primária ao inserir registros em Data Extensions com [`InsertDE`](../data-extension-functions/insertde.md). Como o valor é único a cada execução, você evita conflitos de chave duplicada em envios com grandes volumes.

> **⚠️ Atenção:** O valor retornado contém hífens e letras minúsculas (ex: `a0f71563-b064-4b02-a21a-571dadadafb1`). Se o sistema que vai consumir esse identificador exige outro formato, use funções como [`Replace`](../string-functions/replace.md) para remover os hífens ou [`Uppercase`](../string-functions/uppercase.md) para converter para maiúsculas.

## Funções relacionadas

- [`Concat`](../string-functions/concat.md) - para combinar o GUID com prefixos ou sufixos e criar códigos personalizados
- [`Substring`](../string-functions/substring.md) - para extrair parte do GUID quando precisar de um código mais curto
- [`Replace`](../string-functions/replace.md) - para remover os hífens do GUID, se necessário
- [`Uppercase`](../string-functions/uppercase.md) - para converter o GUID para letras maiúsculas
- [`InsertDE`](../data-extension-functions/insertde.md) - para gravar o GUID como chave única em uma Data Extension
- [`Now`](../date-functions/now.md) - para registrar o timestamp junto com o GUID gerado