---
title: ReplaceList
sidebar_label: ReplaceList
description: Substitui uma ou mais substrings de uma só vez por uma única string de substituição.
---

# ReplaceList

## Descrição

A função `ReplaceList()` substitui uma ou mais substrings dentro de um texto por uma única string de substituição. É perfeita para quando você precisa limpar ou padronizar dados que podem conter vários caracteres ou padrões diferentes - tudo em uma única chamada, sem precisar encadear múltiplos [Replace()](../string-functions/replace.md). Retorna a string original com todas as substituições aplicadas.

## Sintaxe

```ampscript
ReplaceList(sourceString, replacementString, searchString1 [, searchString2, ...])
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| sourceString | string | Sim | A string original onde a busca será feita. |
| replacementString | string | Sim | A string que substituirá cada ocorrência encontrada. |
| searchString1 | string | Sim | A substring a ser encontrada. Você pode adicionar quantas strings de busca precisar, incluindo parâmetros adicionais (searchString2, searchString3, etc.). |

## Exemplo básico

Removendo diferentes delimitadores de uma lista de categorias de produtos e substituindo por um separador legível:

```ampscript
%%[
VAR @categorias, @resultado
SET @categorias = "Eletrônicos|Celulares;Informática,Acessórios"
SET @resultado = ReplaceList(@categorias, " | ", "|", ";", ",")
]%%

Categorias: %%=v(@resultado)=%%
```

**Saída:**
```
Categorias: Eletrônicos | Celulares | Informática | Acessórios
```

## Exemplo avançado

Limpando dados de telefone que chegam com formatações variadas de uma Data Extension, padronizando para uso em um e-mail de confirmação de cadastro da Conecta Telecom:

```ampscript
%%[
VAR @nome, @telefoneRaw, @telefoneLimpo, @cpfRaw, @cpfLimpo

SET @nome = "Maria Santos"
SET @telefoneRaw = "(11) 99876-5432"
SET @cpfRaw = "123.456.789-00"

/* Remove parênteses, espaços e traço do telefone */
SET @telefoneLimpo = ReplaceList(@telefoneRaw, "", "(", ")", " ", "-")

/* Remove pontos e traço do CPF */
SET @cpfLimpo = ReplaceList(@cpfRaw, "", ".", "-")
]%%

Olá, %%=v(@nome)=%%!

Seus dados cadastrados na Conecta Telecom:
- Telefone: %%=v(@telefoneLimpo)=%%
- CPF: %%=v(@cpfLimpo)=%%

Caso precise de suporte, ligue para (11) 3000-1234.
```

**Saída:**
```
Olá, Maria Santos!

Seus dados cadastrados na Conecta Telecom:
- Telefone: 1199876543
- CPF: 12345678900

Caso precise de suporte, ligue para (11) 3000-1234.
```

## Observações

> **💡 Dica:** A grande vantagem do `ReplaceList()` sobre o [Replace()](../string-functions/replace.md) é poder buscar múltiplas substrings em uma única chamada. Em vez de encadear vários `Replace()` dentro de `Replace()` (o que deixa o código difícil de ler), você passa todas as strings de busca como parâmetros adicionais e todas são substituídas pela mesma string de destino.

> **⚠️ Atenção:** Note que o segundo parâmetro é a string de **substituição** e o terceiro em diante são as strings de **busca**. Essa ordem é diferente do [Replace()](../string-functions/replace.md), onde a busca vem antes da substituição. Preste atenção para não inverter.

> **💡 Dica:** Se você precisar substituir por valores **diferentes** para cada busca, o `ReplaceList()` não é a função certa - nesse caso, use chamadas separadas de [Replace()](../string-functions/replace.md) para cada substituição.

## Funções relacionadas

- [Replace()](../string-functions/replace.md) - substitui uma única substring por outra (quando cada busca precisa de uma substituição diferente)
- [Trim()](../string-functions/trim.md) - remove espaços em branco das extremidades de uma string
- [Concat()](../string-functions/concat.md) - concatena strings, útil para reconstruir textos após substituições