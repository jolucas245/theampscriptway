---
title: Lowercase
sidebar_label: Lowercase
description: Converte todos os caracteres de uma string para letras minúsculas.
---

# Lowercase

## Descrição

A função `Lowercase()` recebe uma string e retorna ela inteirinha em letras minúsculas. É super útil quando você precisa padronizar dados que vêm de diversas fontes — como e-mails digitados pelo assinante com letras maiúsculas aleatórias, nomes de categorias, ou qualquer campo de texto que precise de consistência. A função retorna uma string com todos os caracteres alfabéticos convertidos para minúsculo, mantendo números e caracteres especiais inalterados.

## Sintaxe

```ampscript
Lowercase(sourceString)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|--------------|--------|-------------|-----------|
| sourceString | String | Sim | A string que você quer converter para letras minúsculas. |

## Exemplo básico

```ampscript
%%[
SET @email = "JOAO.SILVA@GMAIL.COM"
SET @emailNormalized = Lowercase(@email)
]%%

O e-mail normalizado é %%=v(@emailNormalized)=%%
```

**Saída:**
```
O e-mail normalizado é joao.silva@gmail.com
```

## Exemplo avançado

Imagine que você trabalha na **Lojas Vitória** e precisa enviar um e-mail de boas-vindas ao programa de fidelidade. Os dados vêm de um formulário onde o cliente digitou o e-mail de qualquer jeito, e você precisa normalizar o endereço antes de gravar na Data Extension e exibir no e-mail:

```ampscript
%%[
/* Dados vindos da Data Extension "Clientes_Fidelidade" */
SET @nome = "Maria Santos"
SET @emailOriginal = "Maria.Santos@HOTMAIL.COM"
SET @categoriaProduto = "ELETRÔNICOS"

/* Normaliza o e-mail para minúsculo */
SET @emailNormalizado = Lowercase(@emailOriginal)

/* Normaliza a categoria para usar em comparação */
SET @categoriaMinuscula = Lowercase(@categoriaProduto)

/* Atualiza a DE com o e-mail padronizado */
UpsertDE("Clientes_Fidelidade", 1, "Email", @emailNormalizado, "Nome", @nome, "CategoriaPreferida", @categoriaMinuscula)

/* Monta o link de preferências com e-mail normalizado */
SET @linkPreferencias = Concat("https://www.lojasvitoria.com.br/preferencias?email=", @emailNormalizado)
]%%

Olá, %%=ProperCase(@nome)=%%! 👋

Bem-vinda ao programa de pontos da Lojas Vitória!

Seu e-mail cadastrado: %%=v(@emailNormalizado)=%%
Sua categoria favorita: %%=v(@categoriaMinuscula)=%%

🎁 Como você curte **%%=v(@categoriaMinuscula)=%%**, separamos ofertas especiais com frete grátis acima de R$299!

%%[
IF @categoriaMinuscula == "eletrônicos" THEN
]%%
📱 Aproveite: até 30% de cashback em eletrônicos nesta Black Friday!
%%[ ENDIF ]%%

<a href="%%=RedirectTo(@linkPreferencias)=%%">Gerenciar suas preferências</a>
```

**Saída:**
```
Olá, Maria Santos! 👋

Bem-vinda ao programa de pontos da Lojas Vitória!

Seu e-mail cadastrado: maria.santos@hotmail.com
Sua categoria favorita: eletrônicos

🎁 Como você curte eletrônicos, separamos ofertas especiais com frete grátis acima de R$299!

📱 Aproveite: até 30% de cashback em eletrônicos nesta Black Friday!

Gerenciar suas preferências
```

## Observações

- A função converte **apenas caracteres alfabéticos** para minúsculo. Números, espaços e caracteres especiais (como `@`, `.`, `-`) permanecem inalterados.
- É uma prática muito recomendada usar `Lowercase()` para normalizar endereços de e-mail antes de fazer comparações ou gravações em Data Extensions. Isso evita duplicatas como `joao@email.com` e `JOAO@EMAIL.COM` sendo tratados como registros diferentes.
- Combinar `Lowercase()` com comparações em blocos `IF` é uma ótima forma de garantir que a lógica funcione independente de como o dado foi digitado pelo cliente.
- Se a string passada já estiver toda em minúsculo, a função simplesmente retorna a mesma string sem alterações.
- Tome cuidado ao usar `Lowercase()` em nomes de pessoas para exibição — nesse caso, considere usar [ProperCase](../string-functions/propercase.md) para formatar corretamente (ex: "Maria Santos" em vez de "maria santos").

## Funções relacionadas

- [Uppercase](../string-functions/uppercase.md) — Converte todos os caracteres de uma string para letras maiúsculas (o oposto de `Lowercase`).
- [ProperCase](../string-functions/propercase.md) — Converte a primeira letra de cada palavra para maiúscula e o restante para minúscula. Ideal para nomes de pessoas.
- [Trim](../string-functions/trim.md) — Remove espaços em branco no início e no final de uma string. Ótimo para combinar com `Lowercase` na normalização de dados.
- [Replace](../string-functions/replace.md) — Substitui ocorrências de um texto dentro de uma string. Útil para limpeza de dados em conjunto com `Lowercase`.
- [Concat](../string-functions/concat.md) — Concatena duas ou mais strings. Frequentemente usado junto com `Lowercase` para montar URLs ou identificadores padronizados.