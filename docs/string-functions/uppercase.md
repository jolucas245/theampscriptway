---
title: Uppercase
sidebar_label: Uppercase
description: Converte todos os caracteres de uma string para letras maiúsculas.
---

<!-- generated-by-script -->

# Uppercase

## Descrição

A função `Uppercase()` recebe uma string e retorna ela todinha em letras maiúsculas. É super útil quando você precisa padronizar textos — por exemplo, exibir códigos de cupom, IDs de cliente ou siglas de forma uniforme nos seus e-mails e CloudPages. Se a string já estiver em maiúsculas, ela simplesmente retorna o mesmo valor.

## Sintaxe

```ampscript
Uppercase(sourceString)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|--------------|--------|-------------|---------------------------------------------|
| sourceString | String | Sim | A string que você quer converter para maiúsculas. |

## Exemplo básico

Imagine que você tem o ID externo do cliente salvo numa variável e quer exibi-lo em maiúsculas no e-mail:

```ampscript
%%[
SET @externalCustomerId = "abc-12345-xyz"
]%%

Seu ID de cliente é: %%=Uppercase(@externalCustomerId)=%%
```

**Saída:**
```
Seu ID de cliente é: ABC-12345-XYZ
```

## Exemplo avançado

Cenário real: a **MegaStore** está enviando um e-mail de Black Friday com cupom de desconto personalizado. O nome do cliente vem da Data Extension e pode estar em qualquer formato (minúsculas, misturado, etc.). Você quer exibir o cupom em maiúsculas pra dar destaque e usar o primeiro nome formatado corretamente com `ProperCase()`:

```ampscript
%%[
SET @primeiroNome = Lookup("DE_Clientes", "PrimeiroNome", "Email", EmailAddress)
SET @codigoCupom = Lookup("DE_Clientes", "CupomBlackFriday", "Email", EmailAddress)
SET @categoria = Lookup("DE_Clientes", "CategoriaPontos", "Email", EmailAddress)

SET @nomeFormatado = ProperCase(@primeiroNome)
SET @cupomMaiusculo = Uppercase(@codigoCupom)
SET @categoriaMaiuscula = Uppercase(@categoria)
]%%

Olá, %%=v(@nomeFormatado)=%%! 🎉

Sua categoria no programa de pontos: %%=v(@categoriaMaiuscula)=%%

A Black Friday da MegaStore chegou! Use o cupom abaixo e ganhe
frete grátis em compras acima de R$299:

🏷️ %%=v(@cupomMaiusculo)=%%

Acesse: www.megastore.com.br/blackfriday
```

**Saída (exemplo para a cliente Maria Santos):**
```
Olá, Maria! 🎉

Sua categoria no programa de pontos: OURO

A Black Friday da MegaStore chegou! Use o cupom abaixo e ganhe
frete grátis em compras acima de R$299:

🏷️ BF-MARIA-2024-MEGA

Acesse: www.megastore.com.br/blackfriday
```

## Observações

- A função converte **apenas caracteres alfabéticos** para maiúsculas. Números, espaços e caracteres especiais permanecem inalterados.
- Funciona com caracteres acentuados do português — por exemplo, `Uppercase("ação")` retorna `"AÇÃO"`.
- Se o valor passado for uma string vazia (`""`), a função retorna uma string vazia.
- Muito útil para padronizar códigos de cupom, SKUs, IDs e siglas de estados (SP, RJ, MG) antes de exibir ou comparar valores.
- Para comparações case-insensitive, você pode aplicar `Uppercase()` nos dois lados da comparação para garantir consistência.
- Funciona em todos os contextos do SFMC: e-mails, SMS, CloudPages e Landing Pages.

## Funções relacionadas

- [Lowercase](../string-functions/lowercase.md) — converte todos os caracteres de uma string para letras minúsculas (o oposto de `Uppercase`).
- [ProperCase](../string-functions/propercase.md) — converte a primeira letra de cada palavra para maiúscula e o restante para minúscula.
- [Trim](../string-functions/trim.md) — remove espaços em branco do início e do fim de uma string, útil para limpar dados antes de converter.
- [Concat](../string-functions/concat.md) — concatena duas ou mais strings, ótimo para montar textos dinâmicos junto com `Uppercase`.
- [Replace](../string-functions/replace.md) — substitui partes de uma string, podendo ser combinado com `Uppercase` para padronizar e ajustar textos.
- [Lookup](../data-extension-functions/lookup.md) — busca valores em Data Extensions, frequentemente usado junto com `Uppercase` para formatar os dados retornados.