---
title: Substring
sidebar_label: Substring
description: Retorna uma parte de uma string, começando a partir de uma posição específica, com a opção de definir o comprimento do trecho extraído.
---

# Substring

## Descrição

A função `Substring()` extrai um pedaço de uma string a partir de uma posição que você define. Pense nela como uma tesoura: você indica onde quer começar a cortar e, opcionalmente, quantos caracteres quer pegar. Se você não informar o comprimento, ela pega tudo do ponto inicial até o final da string. É super útil para extrair partes de códigos, CPFs, CEPs, números de pedido e qualquer dado que venha "embutido" dentro de uma string maior.

## Sintaxe

```ampscript
Substring(sourceString, startPosition [, substringLength])
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| sourceString | String | Sim | A string original da qual você quer extrair um trecho. |
| startPosition | Número | Sim | A posição do caractere onde a extração começa (base 1, ou seja, o primeiro caractere é a posição 1). Se a posição informada for maior que o tamanho da string, a função retorna uma string vazia. |
| substringLength | Número | Não | A quantidade de caracteres a retornar a partir da posição inicial. Se não for informado, retorna tudo do ponto inicial até o final da string. |

## Exemplo básico

Imagine que você quer extrair o DDD do telefone de um assinante armazenado no formato `(11) 99876-5432`:

```ampscript
%%[
VAR @telefone, @ddd
SET @telefone = "(11) 99876-5432"
SET @ddd = Substring(@telefone, 2, 2)
]%%

Seu DDD é: %%=v(@ddd)=%%
```

**Saída:**
```
Seu DDD é: 11
```

## Exemplo avançado

Cenário real: a **Lojas Vitória** envia um e-mail de confirmação de pedido. O código do pedido vem no formato `PED-2024-0012345-SP`, e você precisa extrair o número do pedido e o estado de origem para personalizar a mensagem. Além disso, você quer mascarar o CPF do cliente, mostrando apenas os três primeiros dígitos e os dois últimos.

```ampscript
%%[
VAR @codigoPedido, @cpfCompleto, @nome
VAR @numeroPedido, @estadoOrigem, @cpfMascarado

SET @codigoPedido = "PED-2024-0012345-SP"
SET @cpfCompleto = "123.456.789-00"
SET @nome = "Maria Santos"

/* Extrair o número do pedido (posição 10, 7 caracteres) */
SET @numeroPedido = Substring(@codigoPedido, 10, 7)

/* Extrair o estado de origem (últimos 2 caracteres) */
SET @estadoOrigem = Substring(@codigoPedido, Subtract(Length(@codigoPedido), 1), 2)

/* Mascarar o CPF: primeiros 3 dígitos + máscara + últimos 2 dígitos */
SET @cpfMascarado = Concat(Substring(@cpfCompleto, 1, 3), ".***.***-", Substring(@cpfCompleto, Length(@cpfCompleto), 2))
]%%

Olá, %%=v(@nome)=%%! 🎉

Seu pedido nº <strong>%%=v(@numeroPedido)=%%</strong> com origem em <strong>%%=v(@estadoOrigem)=%%</strong> foi confirmado!

CPF registrado: %%=v(@cpfMascarado)=%%

Acompanhe o status do seu pedido em www.lojasvitoria.com.br/pedidos.

Aproveite: frete grátis em compras acima de R$ 299,00! 🚚
```

**Saída:**
```
Olá, Maria Santos! 🎉

Seu pedido nº 0012345 com origem em SP foi confirmado!

CPF registrado: 123.***.***-00

Acompanhe o status do seu pedido em www.lojasvitoria.com.br/pedidos.

Aproveite: frete grátis em compras acima de R$ 299,00! 🚚
```

## Observações

- **A contagem de posição começa em 1**, não em 0. O primeiro caractere da string é a posição 1.
- Se o valor de `startPosition` for **maior que o comprimento** da string original, a função retorna uma **string vazia** — não gera erro.
- Se você **não informar** o parâmetro `substringLength`, a função retorna todos os caracteres da posição inicial até o final da string.
- Cuidado com **strings nulas ou vazias**: se `sourceString` for nula, o comportamento pode ser imprevisível. Use [Empty](../utility-functions/empty.md) ou [IsNull](../utility-functions/isnull.md) para validar antes de chamar `Substring()`.
- A função **não modifica** a string original — ela apenas retorna o trecho extraído.
- Para cenários onde você precisa encontrar a posição de um caractere antes de extrair, combine com [IndexOf](../string-functions/indexof.md). Isso é muito útil quando a posição do trecho desejado varia de registro para registro.
- Funciona normalmente em **e-mails, SMS, CloudPages e Landing Pages** — sem restrição de contexto.

## Funções relacionadas

- [IndexOf](../string-functions/indexof.md) — encontra a posição de um caractere ou trecho dentro de uma string (ótima para usar junto com `Substring`)
- [Length](../string-functions/length.md) — retorna o tamanho de uma string (útil para calcular posições dinamicamente)
- [Concat](../string-functions/concat.md) — junta strings, ideal para remontar textos depois de extrair partes com `Substring`
- [Replace](../string-functions/replace.md) — substitui trechos dentro de uma string sem precisar extrair manualmente
- [Trim](../string-functions/trim.md) — remove espaços em branco no início e no fim da string resultante
- [RegExMatch](../string-functions/regexmatch.md) — extrai trechos de strings usando expressões regulares, para cenários mais complexos