---
title: Char
sidebar_label: Char
description: Retorna o caractere correspondente a um código ASCII, com opção de repetição.
---

# Char

## Descrição

A função `Char` retorna o caractere correspondente ao código ASCII informado. Ela suporta o conjunto ASCII estendido (códigos de 0 a 255) e aceita um segundo parâmetro opcional para repetir o caractere quantas vezes você precisar. É especialmente útil quando você precisa referenciar caracteres não imprimíveis — como quebras de linha (line feed) e retorno de carro (carriage return) — em cenários de tratamento de dados vindos de Data Extensions.

## Sintaxe

```ampscript
Char(characterCode)
Char(characterCode, numRepetitions)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| characterCode | string | Sim | Código ASCII do caractere desejado (0–255). |
| numRepetitions | number | Não | Número de vezes que o caractere deve ser repetido. |

## Exemplo básico

Gerando um separador visual com o caractere "=" repetido para usar em um e-mail de texto plano da Lojas Vitória.

```ampscript
%%[
VAR @separador
SET @separador = Char(61, 30)
]%%

%%=v(@separador)=%%
Lojas Vitória - Resumo do seu pedido
%%=v(@separador)=%%
```

**Saída:**
```
==============================
Lojas Vitória - Resumo do seu pedido
==============================
```

## Exemplo avançado

Um cenário muito comum: você tem uma Data Extension com um campo de endereço que vem com quebras de linha (CRLF) do formulário original. Na hora de renderizar no e-mail HTML, essas quebras não aparecem — você precisa substituí-las por `<br />`. Aqui usamos `Char` junto com [Replace](../string-functions/replace.md) para resolver isso.

```ampscript
%%[
VAR @endereco, @enderecoHTML

/* Simulando conteúdo vindo de uma Data Extension */
SET @endereco = Lookup("Clientes", "Endereco", "CPF", "123.456.789-00")

/* Char(13) = Carriage Return, Char(10) = Line Feed */
SET @enderecoHTML = Replace(@endereco, Concat(Char(13), Char(10)), "<br />")
]%%

<p><strong>Endereço de entrega:</strong><br />
%%=v(@enderecoHTML)=%%</p>
```

**Saída:**
```html
<p><strong>Endereço de entrega:</strong><br />
Rua das Flores, 123<br />Bairro Jardim Europa<br />São Paulo - SP<br />01234-567</p>
```

## Observações

> **💡 Dica:** O caso de uso mais frequente de `Char` no dia a dia de SFMC é justamente a combinação `Concat(Char(13), Char(10))` para representar quebras de linha (CRLF). Dados importados de CSVs, formulários ou integrações frequentemente trazem essas quebras invisíveis que precisam ser tratadas antes de exibir no HTML.

> **⚠️ Atenção:** A função suporta apenas o conjunto ASCII estendido, ou seja, códigos de 0 a 255. Caracteres Unicode fora dessa faixa não são suportados.

> **💡 Dica:** O segundo parâmetro (`numRepetitions`) é muito prático para gerar separadores visuais ou espaçamentos repetidos sem precisar concatenar manualmente — por exemplo, `Char(65, 3)` retorna `AAA`.

## Funções relacionadas

- [Replace](../string-functions/replace.md) — frequentemente usada junto com `Char` para substituir caracteres não imprimíveis
- [Concat](../string-functions/concat.md) — útil para combinar múltiplos caracteres gerados por `Char`, como CRLF
- [Lookup](../data-extension-functions/lookup.md) — para buscar dados de Data Extensions que podem conter caracteres não imprimíveis