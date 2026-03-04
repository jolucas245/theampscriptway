---
title: V
sidebar_label: V
description: Retorna o valor de uma variável AMPscript a partir do seu nome passado como string.
---

# V

## Descrição

A função **V** retorna o valor de uma variável AMPscript. A diferença em relação à referência direta da variável (com `%%variavel%%`) é que aqui você passa o **nome da variável como string** — o que permite acessar variáveis de forma dinâmica. Isso é especialmente útil quando o nome da variável que você precisa acessar é construído em tempo de execução, como em loops ou quando os nomes dos campos seguem um padrão previsível.

## Sintaxe

```ampscript
V(variableName)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| variableName | String | Sim | O nome da variável cujo valor será retornado. |

## Exemplo básico

Declarando uma variável com o nome do cliente e exibindo o valor com `V()`:

```ampscript
%%[
SET @NomeCliente = "Maria Santos"
]%%

Olá, %%=V(@NomeCliente)=%%! Bem-vinda à Lojas Vitória.
```

**Saída:**
```
Olá, Maria Santos! Bem-vinda à Lojas Vitória.
```

## Exemplo avançado

Cenário de e-mail marketing onde você precisa exibir dados de produtos de forma dinâmica. Imagine que uma régua de relacionamento da MegaStore envia um e-mail com até 3 produtos recomendados, e os nomes das variáveis seguem um padrão (`@Produto1`, `@Produto2`, `@Produto3`). Com `V()`, você monta o nome da variável dentro do loop:

```ampscript
%%[
SET @Produto1 = "Notebook Ultra 15 - R$ 3.499,90"
SET @Produto2 = "Fone Bluetooth Pro - R$ 249,90"
SET @Produto3 = "Smartwatch Pulse - R$ 899,90"

FOR @i = 1 TO 3 DO
  SET @NomeVariavel = Concat("@Produto", @i)
  SET @ValorProduto = V(@NomeVariavel)
]%%

Produto %%=V(@i)=%%: %%=V(@ValorProduto)=%%
%%[
NEXT @i
]%%
```

**Saída:**
```
Produto 1: Notebook Ultra 15 - R$ 3.499,90
Produto 2: Fone Bluetooth Pro - R$ 249,90
Produto 3: Smartwatch Pulse - R$ 899,90
```

> **💡 Dica:** Esse padrão de `Concat` + `V()` é um dos mais poderosos do AMPscript. Sempre que você tiver variáveis numeradas seguindo um padrão (como resultados de um [LookupRows](../data-extension-functions/lookuprows.md) iterado com [Row](../data-extension-functions/row.md) e [Field](../data-extension-functions/field.md)), usar `V()` com o nome construído dinamicamente evita repetição de código e deixa o template muito mais limpo.

## Observações

- Na maioria dos casos simples, usar `%%=V(@variavel)=%%` produz o mesmo resultado que `%%@variavel%%`. A função `V()` se torna essencial quando o nome da variável é **dinâmico** — ou seja, montado em tempo de execução via [Concat](../string-functions/concat.md) ou outra lógica.

> **⚠️ Atenção:** Se a variável referenciada por `V()` não tiver sido declarada ou definida previamente, o retorno será vazio. Combine com [Empty](../utility-functions/empty.md) para validar antes de exibir conteúdo ao assinante.

## Funções relacionadas

- [Output](../utility-functions/output.md) — exibe valores dentro de blocos de código AMPscript
- [OutputLine](../utility-functions/outputline.md) — exibe valores com quebra de linha
- [Concat](../string-functions/concat.md) — construa nomes de variáveis dinamicamente para usar com `V()`
- [TreatAsContent](../utility-functions/treatascontent.md) — processa strings que contêm AMPscript embutido
- [AttributeValue](../utility-functions/attributevalue.md) — recupera valores de atributos do assinante
- [Empty](../utility-functions/empty.md) — valida se o retorno de `V()` está vazio antes de usar