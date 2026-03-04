---
title: Substring
sidebar_label: Substring
description: Extrai uma parte de uma string a partir de uma posição específica, com tamanho opcional.
---

# Substring

## Descrição

A função `Substring` retorna uma parte de uma string, começando a partir de uma posição de caractere que você define. Opcionalmente, você pode especificar quantos caracteres quer extrair — se não informar, a função retorna tudo do ponto inicial até o final da string. É extremamente útil no dia a dia de SFMC para recortar trechos de dados como CPF, CEP, códigos de pedido e qualquer informação que venha concatenada ou em formato fixo.

## Sintaxe

```ampscript
Substring(@sourceString, startPosition, substringLength)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| sourceString | string | Sim | A string original da qual você quer extrair um trecho. |
| startPosition | number | Sim | A posição do caractere onde a extração começa. Se a posição exceder o tamanho da string, a função retorna uma string vazia. |
| substringLength | number | Não | Quantidade de caracteres a retornar a partir da posição inicial. Se não for informado, retorna tudo até o final da string. |

## Exemplo básico

Extraindo o DDD de um telefone celular armazenado no formato `(11) 99999-9999`:

```ampscript
%%[
SET @telefone = "(11) 99999-9999"
SET @ddd = Substring(@telefone, 2, 2)
]%%

DDD: %%=v(@ddd)=%%
```

**Saída:**
```
DDD: 11
```

## Exemplo avançado

Em uma régua de relacionamento de e-commerce, é comum receber um código de pedido composto (ex: `SP-2024-0058732`) onde as duas primeiras letras representam a filial, o bloco seguinte é o ano e o restante é o número sequencial. Veja como desmembrar tudo para personalizar o e-mail de confirmação:

```ampscript
%%[
SET @codigoPedido = "SP-2024-0058732"
SET @filial = Substring(@codigoPedido, 1, 2)
SET @ano = Substring(@codigoPedido, 4, 4)
SET @numero = Substring(@codigoPedido, 9)

SET @cpf = "12345678901"
SET @cpfMascarado = Concat(
  Substring(@cpf, 1, 3), ".",
  Substring(@cpf, 4, 3), ".",
  Substring(@cpf, 7, 3), "-",
  Substring(@cpf, 10, 2)
)

SET @nomeCompleto = "Maria Santos de Oliveira"
SET @primeiroNome = Substring(@nomeCompleto, 1, Subtract(IndexOf(@nomeCompleto, " "), 1))
]%%

Olá, %%=v(@primeiroNome)=%%!

Seu pedido da filial %%=v(@filial)=%% foi confirmado.
Código: %%=v(@codigoPedido)=%%
Ano: %%=v(@ano)=%%
Número sequencial: %%=v(@numero)=%%
CPF: %%=v(@cpfMascarado)=%%
```

**Saída:**
```
Olá, Maria!

Seu pedido da filial SP foi confirmado.
Código: SP-2024-0058732
Ano: 2024
Número sequencial: 0058732
CPF: 123.456.789-01
```

## Observações

> **⚠️ Atenção:** Se o valor de `startPosition` exceder o tamanho da string original, a função retorna uma string vazia. Isso é importante quando você trabalha com campos de Data Extension que podem ter tamanhos variáveis — sempre valide antes de usar.

> **💡 Dica:** Quando você não informa o terceiro parâmetro (`substringLength`), a função retorna tudo da posição inicial até o fim da string. Isso é muito prático para pegar "o restante" de um texto sem precisar calcular o comprimento exato.

> **💡 Dica:** Combine `Substring` com [IndexOf](../string-functions/indexof.md) para extrair trechos dinâmicos — como o primeiro nome de um campo de nome completo — sem depender de posições fixas. Combine com [Length](../string-functions/length.md) quando precisar calcular posições a partir do final da string.

## Funções relacionadas

- [Concat](../string-functions/concat.md) — para remontar strings após extrair partes
- [IndexOf](../string-functions/indexof.md) — para encontrar a posição de um caractere antes de usar `Substring`
- [Length](../string-functions/length.md) — para calcular o tamanho da string e definir posições dinamicamente
- [Replace](../string-functions/replace.md) — quando você quer substituir trechos em vez de extraí-los
- [Trim](../string-functions/trim.md) — para remover espaços antes de aplicar `Substring`