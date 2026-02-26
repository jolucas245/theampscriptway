---
title: Char
sidebar_label: Char
description: Retorna o caractere correspondente a um código ASCII, com opção de repetir o caractere múltiplas vezes.
---

# Char

## Descrição

A função `Char()` retorna o caractere que corresponde ao código ASCII informado como parâmetro. Ela suporta o conjunto ASCII estendido, com códigos de 0 a 255. Você também pode usar um segundo parâmetro opcional para repetir o caractere quantas vezes quiser. Essa função é especialmente útil quando você precisa referenciar caracteres não imprimíveis, como quebras de linha (line feed) e retorno de carro (carriage return), que são difíceis de inserir diretamente no código.

## Sintaxe

```ampscript
Char(characterCode)
Char(characterCode, numRepetitions)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|----------------|-----------|---------------|----------------|
| characterCode | String | Sim | O código ASCII do caractere desejado (0–255). |
| numRepetitions | Número | Não | O número de vezes que o caractere deve ser repetido. |

## Exemplo básico

Neste exemplo, usamos o código ASCII 190, que corresponde ao caractere `¾`:

```ampscript
%%=Char(190)=%%
```

**Saída:**
```
¾
```

E aqui repetimos a letra "A" (código 65) três vezes:

```ampscript
%%=Char(65, 3)=%%
```

**Saída:**
```
AAA
```

## Exemplo avançado

Imagina que você tem uma Data Extension chamada **"DepoimentosClientes"** onde os clientes da **Lojas Vitória** deixam avaliações de produtos. O campo `Depoimento` pode conter quebras de linha (CRLF — carriage return + line feed) que vêm de formulários. Para exibir esse conteúdo corretamente em um e-mail HTML, você precisa substituir essas quebras de linha por tags `<br />`.

O código 13 é o carriage return (CR) e o código 10 é o line feed (LF):

```ampscript
%%[
  SET @nome = "Maria Santos"
  SET @conteudo = Lookup("DepoimentosClientes", "Depoimento", "NomeCliente", @nome)

  /* Substitui a combinação CR+LF por <br /> */
  SET @conteudoFormatado = Replace(@conteudo, Concat(Char(13), Char(10)), "<br />")
]%%

<h3>Depoimento de %%=v(@nome)=%%</h3>
<p>%%=v(@conteudoFormatado)=%%</p>
```

**Saída (supondo que o depoimento original tenha quebras de linha):**
```html
<h3>Depoimento de Maria Santos</h3>
<p>Adorei o produto!<br />Chegou antes do prazo.<br />Frete grátis acima de R$299 foi ótimo!</p>
```

Outro cenário prático: gerar uma linha separadora visual usando o caractere `─` (código 196) em um e-mail de texto puro para a **Conecta Telecom**:

```ampscript
%%[
  SET @separador = Char(196, 40)
  SET @nomeCliente = "Carlos Oliveira"
]%%

Olá, %%=v(@nomeCliente)=%%!

%%=v(@separador)=%%
Resumo da sua fatura - Conecta Telecom
%%=v(@separador)=%%

Plano: Fibra 300MB
Valor: R$ 129,90
Vencimento: 15/07/2025
```

**Saída:**
```
Olá, Carlos Oliveira!

────────────────────────────────────────
Resumo da sua fatura - Conecta Telecom
────────────────────────────────────────

Plano: Fibra 300MB
Valor: R$ 129,90
Vencimento: 15/07/2025
```

## Observações

- A função suporta o conjunto ASCII estendido, ou seja, códigos de **0 a 255**.
- O principal uso dessa função é trabalhar com **caracteres não imprimíveis**, como carriage return (`Char(13)`) e line feed (`Char(10)`). Esses são os mais comuns no dia a dia do SFMC.
- Se você precisa remover ou substituir quebras de linha em conteúdos vindos de Data Extensions ou formulários, combine `Char()` com [Replace](../string-functions/replace.md) — essa é a combinação mais frequente.
- O parâmetro `numRepetitions` é opcional. Se não for informado, o caractere é retornado uma única vez.
- Tome cuidado ao usar códigos de caracteres de controle (0–31) em contextos HTML, pois eles podem não ser renderizados corretamente pelos clientes de e-mail.
- Use [Concat](../string-functions/concat.md) para combinar múltiplos caracteres gerados por `Char()`, como no caso clássico de `Concat(Char(13), Char(10))` para representar uma quebra de linha completa (CRLF).

## Funções relacionadas

- [Replace](../string-functions/replace.md) — Substitui ocorrências de texto. Combinação clássica com `Char()` para trocar quebras de linha por `<br />`.
- [Concat](../string-functions/concat.md) — Concatena strings. Útil para juntar múltiplos caracteres gerados por `Char()`.
- [Trim](../string-functions/trim.md) — Remove espaços em branco do início e fim de uma string.
- [Length](../string-functions/length.md) — Retorna o comprimento de uma string, útil para verificar o resultado de repetições com `Char()`.
- [Lookup](../data-extension-functions/lookup.md) — Busca valores em Data Extensions, frequentemente usada junto com `Char()` para tratar conteúdos com caracteres especiais.