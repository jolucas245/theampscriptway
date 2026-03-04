---
title: Concat
sidebar_label: Concat
description: Concatena duas ou mais strings de texto, unindo-as em uma única string na ordem informada.
---

# Concat

## Descrição

A função **Concat** junta duas ou mais strings de texto em uma só, na ordem em que você passa os parâmetros. É uma das funções mais usadas no dia a dia de SFMC — desde montar o nome completo de um cliente até construir URLs dinâmicas, mensagens personalizadas e endereços formatados. Para incluir espaços entre as strings, você precisa adicioná-los explicitamente como parâmetro.

## Sintaxe

```ampscript
Concat(string1, string2, ...)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| string1 | string | Sim | Primeira string de texto. |
| string2 | string | Sim | String de texto que será adicionada ao final de `string1`. Você pode incluir quantos valores adicionais quiser, adicionando mais parâmetros ao final da lista. |

## Exemplo básico

Montando o nome completo de um cliente a partir de primeiro nome, nome do meio e sobrenome — cenário clássico de personalização de e-mail:

```ampscript
%%[
SET @PrimeiroNome = "Maria"
SET @NomeMeio = "Santos"
SET @Sobrenome = "Lima"

SET @NomeCompleto = Concat(@PrimeiroNome, " ", @NomeMeio, " ", @Sobrenome)
]%%

Olá, %%=v(@NomeCompleto)=%%! Bem-vinda à Lojas Vitória.
```

**Saída:**
```
Olá, Maria Santos Lima! Bem-vinda à Lojas Vitória.
```

> **💡 Dica:** Note que os espaços entre os nomes precisam ser incluídos explicitamente como `" "`. Sem eles, o resultado seria `"MariaSantosLima"`.

## Exemplo avançado

Construindo uma linha de endereço completo para um e-mail de confirmação de entrega, combinando `Concat` com [ProperCase](../string-functions/propercase.md) para padronizar a capitalização:

```ampscript
%%[
SET @Rua = "rua das flores"
SET @Numero = "1250"
SET @Complemento = "apto 42"
SET @Bairro = "jardim paulista"
SET @Cidade = "São Paulo"
SET @UF = "SP"
SET @CEP = "01401-000"

SET @EnderecoLinha1 = Concat(ProperCase(@Rua), ", ", @Numero, " - ", ProperCase(@Complemento))
SET @EnderecoLinha2 = Concat(ProperCase(@Bairro), " — ", @Cidade, "/", Uppercase(@UF), " — CEP: ", @CEP)
]%%

Seu pedido será entregue em:
%%=v(@EnderecoLinha1)=%%
%%=v(@EnderecoLinha2)=%%
```

**Saída:**
```
Seu pedido será entregue em:
Rua Das Flores, 1250 - Apto 42
Jardim Paulista — São Paulo/SP — CEP: 01401-000
```

## Observações

- A função exige no mínimo dois parâmetros. Você pode passar quantos valores quiser além disso — todos serão concatenados na ordem em que aparecem.
- As strings são unidas exatamente como informadas. Espaços, hífens, barras ou qualquer separador precisam ser incluídos como parâmetros explícitos.

> **⚠️ Atenção:** Se você precisa juntar valores que não são texto (como números ou datas), considere usar funções como [Format](../string-functions/format.md) ou [FormatDate](../date-functions/formatdate.md) antes de passá-los para `Concat`, garantindo que o resultado fique no formato esperado.

## Funções relacionadas

- [Trim](../string-functions/trim.md) — remove espaços antes e depois de strings, útil para limpar dados antes de concatenar
- [ProperCase](../string-functions/propercase.md) — padroniza capitalização de nomes antes de juntar
- [Uppercase](../string-functions/uppercase.md) — converte para maiúsculas, comum para UF e siglas
- [Lowercase](../string-functions/lowercase.md) — converte para minúsculas
- [Replace](../string-functions/replace.md) — substitui trechos dentro de uma string
- [Substring](../string-functions/substring.md) — extrai parte de uma string
- [Format](../string-functions/format.md) — formata valores antes de concatenar