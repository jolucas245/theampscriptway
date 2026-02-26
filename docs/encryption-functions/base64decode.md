---
title: Base64Decode
sidebar_label: Base64Decode
description: Decodifica uma string que foi codificada em Base64, retornando o valor original em texto legível.
---

# Base64Decode

## Descrição

A função `Base64Decode` pega uma string codificada em Base64 e converte de volta para o texto original. É a operação inversa da função `Base64Encode`. Você vai usar bastante essa função quando receber dados codificados em Base64 — por exemplo, parâmetros passados via URL em CloudPages, dados vindos de APIs externas, ou valores armazenados em Data Extensions que foram previamente codificados para transporte seguro.

## Sintaxe

```ampscript
Base64Decode(1)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| 1 | String | Sim | A string codificada em Base64 que você deseja decodificar para texto legível. |

## Exemplo básico

```ampscript
%%[
VAR @codificado, @decodificado

SET @codificado = "T2zDoSwgSm/Do28hIFNlbSBjdXBvbSBkZSBkZXNjb250byBhcXVpLg=="
SET @decodificado = Base64Decode(@codificado)
]%%

Mensagem decodificada: %%=v(@decodificado)=%%
```

**Saída:**
```
Mensagem decodificada: Olá, João! Seu cupom de desconto aqui.
```

## Exemplo avançado

Imagine que a **MegaStore** passa dados do cliente codificados em Base64 pela URL de uma CloudPage para garantir que os dados não fiquem expostos de forma legível na barra do navegador. Na CloudPage, você decodifica e usa as informações para personalizar a página:

```ampscript
%%[
/* Captura os parâmetros codificados da URL da CloudPage */
VAR @nomeBase64, @emailBase64, @cupomBase64
VAR @nome, @email, @cupom

SET @nomeBase64 = RequestParameter("n")
SET @emailBase64 = RequestParameter("e")
SET @cupomBase64 = RequestParameter("c")

/* Decodifica os valores recebidos */
SET @nome = Base64Decode(@nomeBase64)
SET @email = Base64Decode(@emailBase64)
SET @cupom = Base64Decode(@cupomBase64)

/* Registra o acesso na Data Extension de controle */
InsertDE(
  "LogAcessoCupons",
  "Email", @email,
  "Nome", @nome,
  "Cupom", @cupom,
  "DataAcesso", Now()
)
]%%

<h1>Olá, %%=v(@nome)=%%! 🎉</h1>
<p>A <strong>MegaStore</strong> preparou uma oferta especial pra você nesta Black Friday!</p>
<p>Seu cupom de <strong>R$ 50,00 de desconto</strong> em compras acima de R$ 299,00:</p>
<div style="font-size: 28px; font-weight: bold; color: #e91e63; padding: 15px; border: 2px dashed #e91e63; display: inline-block;">
  %%=v(@cupom)=%%
</div>
<p>Frete grátis acima de R$ 299,00 para todo o Brasil! 🚚</p>
<p style="font-size: 12px; color: #999;">
  Válido até 30/11/2024. Cupom vinculado ao e-mail %%=v(@email)=%%.
</p>
```

**Saída (exemplo com parâmetros `n=Q2FybG9zIE9saXZlaXJh`, `e=Y2FybG9zQGVtYWlsLmNvbS5icg==`, `c=QkY1ME1FR0E=`):**
```html
Olá, Carlos Oliveira! 🎉
A MegaStore preparou uma oferta especial pra você nesta Black Friday!
Seu cupom de R$ 50,00 de desconto em compras acima de R$ 299,00:
BF50MEGA
Frete grátis acima de R$ 299,00 para todo o Brasil! 🚚
Válido até 30/11/2024. Cupom vinculado ao e-mail carlos@email.com.br.
```

## Observações

- **Base64 não é criptografia.** É apenas uma codificação. Qualquer pessoa pode decodificar uma string Base64 facilmente. Se você precisa proteger dados sensíveis como CPF ou dados de pagamento, use funções de criptografia de verdade como [EncryptSymmetric](../encryption-functions/encryptsymmetric.md).
- Se a string passada não for uma codificação Base64 válida, a função pode retornar resultados inesperados ou gerar erro. Sempre valide os dados de entrada quando possível.
- A função espera receber exatamente uma string. Passar um valor nulo ou vazio pode causar erro. Considere usar [Empty](../utility-functions/empty.md) para verificar antes de decodificar.
- Muito útil em cenários de **CloudPages** onde você recebe parâmetros via [RequestParameter](../sites-functions/requestparameter.md) ou [QueryParameter](../sites-functions/queryparameter.md) que foram codificados no lado do e-mail com [Base64Encode](../encryption-functions/base64encode.md).
- A codificação/decodificação Base64 trabalha com caracteres UTF-8, então acentos e caracteres especiais do português (como é, ã, ç) são preservados corretamente.
- Funciona em todos os contextos do SFMC: e-mails, CloudPages, SMS e automações (Script Activities).

## Funções relacionadas

- [Base64Encode](../encryption-functions/base64encode.md) — Codifica uma string em Base64 (operação inversa do `Base64Decode`)
- [EncryptSymmetric](../encryption-functions/encryptsymmetric.md) — Criptografa dados de forma segura com chave simétrica (use quando precisar de segurança real)
- [DecryptSymmetric](../encryption-functions/decryptsymmetric.md) — Descriptografa dados criptografados com `EncryptSymmetric`
- [RequestParameter](../sites-functions/requestparameter.md) — Captura parâmetros de URL ou POST em CloudPages (frequentemente usado junto com `Base64Decode`)
- [CloudPagesURL](../sites-functions/cloudpagesurl.md) — Gera URLs de CloudPages com parâmetros criptografados
- [MD5](../encryption-functions/md5.md) — Gera hash MD5 de uma string (hash de mão única, diferente de codificação)
- [SHA256](../encryption-functions/sha256.md) — Gera hash SHA-256 de uma string (mais seguro que MD5)