---
title: ProperCase
sidebar_label: ProperCase
description: Converte a primeira letra de cada palavra de uma string para maiúscula, formatando o texto em "Título".
---

# ProperCase

## Descrição

A função `ProperCase` recebe uma string e retorna ela com a primeira letra de cada palavra em maiúscula. É extremamente útil no dia a dia de SFMC no Brasil para padronizar nomes de clientes, endereços e cidades que muitas vezes chegam da base de dados em CAIXA ALTA ou tudo minúsculo. O retorno é a string formatada em proper case (estilo título).

## Sintaxe

```ampscript
ProperCase(sourceString)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| sourceString | String | Sim | A string que será convertida para proper case (primeira letra de cada palavra em maiúscula). |

## Exemplo básico

Formatando o nome de um cliente que veio da Data Extension em caixa alta para exibição no e-mail:

```ampscript
%%[
SET @nome = "JOÃO CARLOS DA SILVA"
SET @nomeFormatado = ProperCase(@nome)
]%%

Olá, %%=v(@nomeFormatado)=%%! Bem-vindo à Lojas Vitória.
```

**Saída:**
```
Olá, João Carlos Da Silva! Bem-vindo à Lojas Vitória.
```

## Exemplo avançado

Montando o endereço completo de um cliente para um e-mail transacional de confirmação de pedido, combinando `ProperCase` com [Concat](../string-functions/concat.md) para formatar dados que vieram todos em maiúsculas:

```ampscript
%%[
SET @rua = ProperCase("RUA QUINZE DE NOVEMBRO")
SET @bairro = ProperCase("CENTRO")
SET @cidade = ProperCase("BELO HORIZONTE")
SET @estado = "MG"
SET @cep = "30130-000"

SET @enderecoCompleto = Concat(@rua, ", ", @bairro, " - ", @cidade, "/", @estado, " - CEP: ", @cep)
]%%

Seu pedido será entregue em:
%%=v(@enderecoCompleto)=%%
```

**Saída:**
```
Seu pedido será entregue em:
Rua Quinze De Novembro, Centro - Belo Horizonte/MG - CEP: 30130-000
```

## Observações

> **⚠️ Atenção:** A função converte a primeira letra de **cada palavra** para maiúscula, independentemente do tamanho da palavra. Isso significa que preposições e artigos como "da", "de", "do", "das" também terão a primeira letra capitalizada (ex: "Da Silva" em vez de "da Silva"). Se você precisa de um tratamento mais refinado para nomes brasileiros, será necessário combinar `ProperCase` com funções como [Replace](../string-functions/replace.md) para corrigir essas partículas depois da conversão.

> **💡 Dica:** Essa função é uma mão na roda para quem trabalha com bases de dados legadas ou integrações com ERPs que armazenam tudo em CAIXA ALTA. Usar `ProperCase` no momento do envio garante uma comunicação muito mais humanizada sem precisar corrigir a base inteira.

## Funções relacionadas

- [Uppercase](../string-functions/uppercase.md) — converte toda a string para maiúsculas
- [Lowercase](../string-functions/lowercase.md) — converte toda a string para minúsculas
- [Concat](../string-functions/concat.md) — concatena múltiplas strings (ótimo para montar endereços e nomes completos após o ProperCase)
- [Trim](../string-functions/trim.md) — remove espaços extras antes e depois da string (bom usar antes do ProperCase)
- [Replace](../string-functions/replace.md) — substitui trechos da string (útil para corrigir preposições após o ProperCase)