---
title: GUID
sidebar_label: GUID
description: Gera um identificador único global (GUID) de 128 bits em formato hexadecimal, útil para criar chaves únicas em Data Extensions, tokens de transação e códigos de rastreamento.
---

<!-- generated-by-script -->

# GUID

## Descrição

A função `GUID()` gera um identificador único global (Globally Unique Identifier) de 128 bits em formato hexadecimal. Cada vez que a função é chamada, ela retorna um valor diferente, garantindo unicidade. É extremamente útil quando você precisa criar chaves primárias únicas para registros em Data Extensions, gerar códigos de transação, tokens temporários, IDs de sessão em CloudPages ou qualquer situação em que você precise de um valor que não se repita.

## Sintaxe

```ampscript
GUID()
```

## Parâmetros

A função `GUID()` não aceita nenhum parâmetro.

## Exemplo básico

Gerando um identificador único e exibindo na saída:

```ampscript
%%[
VAR @idUnico
SET @idUnico = GUID()
]%%

Seu código de identificação: %%=v(@idUnico)=%%
```

**Saída:**
```
Seu código de identificação: a0f71563-b064-4b02-a21a-571dadadafb1
```

## Exemplo avançado

Imagine que a **MegaStore** está rodando uma campanha de Black Friday e precisa gerar um código de transação único para cada e-mail enviado. Esse código é registrado numa Data Extension chamada `TransacoesBlackFriday` para rastreamento e também é exibido no e-mail como código de referência para o atendimento ao cliente.

```ampscript
%%[
VAR @codigoTransacao, @nomeCliente, @emailCliente, @valorDesconto, @dataAtual

SET @nomeCliente = AttributeValue("PrimeiroNome")
SET @emailCliente = AttributeValue("EmailAddress")
SET @valorDesconto = "R$ 150,00"
SET @dataAtual = FormatDate(Now(), "dd/MM/yyyy", "HH:mm")
SET @codigoTransacao = GUID()

/* Registra a transação na Data Extension para rastreamento */
InsertDE(
  "TransacoesBlackFriday",
  "CodigoTransacao", @codigoTransacao,
  "NomeCliente", @nomeCliente,
  "EmailCliente", @emailCliente,
  "ValorDesconto", @valorDesconto,
  "DataEnvio", Now(),
  "Status", "Enviado"
)
]%%

Olá, %%=v(@nomeCliente)=%%! 🎉

A Black Friday da MegaStore chegou e separamos um desconto exclusivo de %%=v(@valorDesconto)=%% pra você!

🛒 Aproveite em: www.megastore.com.br/blackfriday

Seu código de referência: %%=v(@codigoTransacao)=%%
Data do envio: %%=v(@dataAtual)=%%

Guarde esse código! Se precisar falar com nosso atendimento sobre
esta oferta, informe o código acima para agilizar o processo.

Frete grátis acima de R$ 299,00 em todo o Brasil!
```

**Saída:**
```
Olá, Maria! 🎉

A Black Friday da MegaStore chegou e separamos um desconto exclusivo de R$ 150,00 pra você!

🛒 Aproveite em: www.megastore.com.br/blackfriday

Seu código de referência: 7c3e29a1-48bf-4d3f-9e12-83ab6f4d2c10
Data do envio: 29/11/2024 - 10:30

Guarde esse código! Se precisar falar com nosso atendimento sobre
esta oferta, informe o código acima para agilizar o processo.

Frete grátis acima de R$ 299,00 em todo o Brasil!
```

## Exemplo com CloudPage

Gerando um ID de sessão único para um formulário de cadastro em uma CloudPage do programa de fidelidade do **Banco Meridional**:

```ampscript
%%[
VAR @sessionId, @codigoConfirmacao

/* ID de sessão para rastrear o acesso à página */
SET @sessionId = GUID()

/* Código de confirmação para o cliente */
SET @codigoConfirmacao = Uppercase(Substring(GUID(), 1, 8))
]%%

<input type="hidden" name="sessionId" value="%%=v(@sessionId)=%%" />

<p>Seu código de confirmação: <strong>%%=v(@codigoConfirmacao)=%%</strong></p>
```

**Saída:**
```html
<input type="hidden" name="sessionId" value="d4e5f6a7-89b0-1c2d-3e4f-567890abcdef" />

<p>Seu código de confirmação: <strong>D4E5F6A7</strong></p>
```

## Observações

- A função **não aceita nenhum parâmetro**. Se você passar algum argumento, vai gerar erro.
- Cada chamada de `GUID()` retorna um valor **diferente**. Se você chamar duas vezes no mesmo e-mail, vai ter dois GUIDs distintos. Se precisa usar o mesmo valor em mais de um lugar, armazene numa variável primeiro.
- O formato retornado segue o padrão UUID: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` (com hífens separando os blocos).
- O GUID é gerado como **string**. Você pode manipulá-lo com funções de texto como [Replace](../string-functions/replace.md) (por exemplo, para remover os hífens) ou [Uppercase](../string-functions/uppercase.md) para deixar em maiúsculas.
- O GUID é ótimo para chaves primárias de Data Extensions quando você não tem um identificador natural (como CPF ou e-mail) ou quando precisa de um ID que não exponha dados sensíveis.
- **Não use GUID como mecanismo de segurança forte** (como tokens de autenticação críticos). Para cenários que exigem criptografia, considere usar funções como [SHA256](../encryption-functions/sha256.md) ou [EncryptSymmetric](../encryption-functions/encryptsymmetric.md).
- A função funciona em todos os contextos do SFMC: e-mails, CloudPages, SMS e automações com Script Activities.

## Funções relacionadas

- [V](../utility-functions/v.md) — exibe o valor de uma variável no conteúdo, usado para renderizar o GUID gerado
- [Output](../utility-functions/output.md) — alternativa ao `v()` para exibir valores dentro de blocos AMPscript
- [Concat](../string-functions/concat.md) — concatena o GUID com outros textos para criar identificadores compostos
- [Replace](../string-functions/replace.md) — útil para remover os hífens do GUID e obter uma string contínua
- [Uppercase](../string-functions/uppercase.md) — converte o GUID para letras maiúsculas
- [Substring](../string-functions/substring.md) — extrai parte do GUID para criar códigos mais curtos
- [InsertDE](../data-extension-functions/insertde.md) — insere registros em Data Extensions usando o GUID como chave única
- [UpsertDE](../data-extension-functions/upsertde.md) — insere ou atualiza registros usando o GUID como identificador
- [SHA256](../encryption-functions/sha256.md) — alternativa para gerar hashes quando você precisa de mais segurança
- [MD5](../encryption-functions/md5.md) — gera um hash a partir de uma string, diferente do GUID que é aleatório