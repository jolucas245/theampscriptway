---
title: IndexOf
sidebar_label: IndexOf
description: Retorna a posição em que uma substring aparece dentro de uma string, usando indexação baseada em 1.
---

# IndexOf

## Descrição

A função `IndexOf` procura uma substring dentro de uma string e retorna a posição onde ela começa. A indexação é baseada em 1 — ou seja, o primeiro caractere da string é a posição 1. Se a substring não for encontrada, a função retorna **0**. É super útil quando você precisa verificar se um determinado texto existe dentro de outro, ou localizar a posição exata de um caractere ou trecho para fazer manipulações mais avançadas.

## Sintaxe

```ampscript
IndexOf(sourceString, substring)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|--------------|--------|-------------|-----------|
| sourceString | String | Sim | A string onde a busca será realizada. |
| substring | String | Sim | O caractere ou substring que você quer localizar dentro da `sourceString`. |

## Exemplo básico

Imagine que você quer verificar se o código de um ingresso contém a letra "C" para identificar a classe do bilhete:

```ampscript
%%[
  SET @codigoIngresso = "EVT-2024-C-0385"
  SET @posicao = IndexOf(@codigoIngresso, "C")
]%%

%%[ IF @posicao > 0 THEN ]%%
  Seu ingresso é Classe C 🎫
%%[ ELSE ]%%
  Seu ingresso não é Classe C
%%[ ENDIF ]%%
```

**Saída:**
```
Seu ingresso é Classe C 🎫
```

## Exemplo avançado

Aqui temos um cenário real de e-commerce: a **MegaStore** envia um e-mail de confirmação de pedido e precisa extrair o código do estado a partir de uma string de localização do tipo "São Paulo-SP" para direcionar informações de frete:

```ampscript
%%[
  SET @nomeCliente = "Maria Santos"
  SET @localizacao = "Belo Horizonte-MG"
  SET @codigoPedido = "MS-BF2024-78432"

  /* Encontra a posição do hífen para saber onde começa a sigla do estado */
  SET @posHifen = IndexOf(@localizacao, "-")

  IF @posHifen > 0 THEN
    /* Extrai a sigla do estado (2 caracteres após o hífen) */
    SET @siglaEstado = Substring(@localizacao, Add(@posHifen, 1), 2)
    SET @cidade = Substring(@localizacao, 1, Subtract(@posHifen, 1))
  ELSE
    SET @siglaEstado = "N/A"
    SET @cidade = @localizacao
  ENDIF

  /* Verifica se o pedido é da Black Friday */
  SET @posBF = IndexOf(@codigoPedido, "BF")

  IF @posBF > 0 THEN
    SET @mensagemPromo = Concat("Parabéns! Seu pedido tem frete grátis da Black Friday! 🚚")
  ELSE
    SET @mensagemPromo = Concat("Frete calculado para ", @siglaEstado, ".")
  ENDIF

  /* Verifica se o CEP contém um trecho específico para centro de distribuição */
  SET @cepCliente = "30130-000"
  SET @posTraco = IndexOf(@cepCliente, "-")

  IF @posTraco > 0 THEN
    SET @cepPrefixo = Substring(@cepCliente, 1, Subtract(@posTraco, 1))
  ELSE
    SET @cepPrefixo = @cepCliente
  ENDIF
]%%

Olá, %%=v(@nomeCliente)=%%!

Pedido: %%=v(@codigoPedido)=%%
Cidade: %%=v(@cidade)=%%
Estado: %%=v(@siglaEstado)=%%
CEP: %%=v(@cepCliente)=%% (prefixo: %%=v(@cepPrefixo)=%%)

%%=v(@mensagemPromo)=%%
```

**Saída:**
```
Olá, Maria Santos!

Pedido: MS-BF2024-78432
Cidade: Belo Horizonte
Estado: MG
CEP: 30130-000 (prefixo: 30130)

Parabéns! Seu pedido tem frete grátis da Black Friday! 🚚
```

## Observações

- A indexação é **baseada em 1**, não em 0. O primeiro caractere da string está na posição 1.
- Quando a substring **não é encontrada**, a função retorna **0**. Use isso nas suas condicionais (`IF @posicao > 0 THEN`).
- A função encontra apenas a **primeira ocorrência** da substring. Se o texto aparecer mais de uma vez, só a posição da primeira será retornada.
- Quando a substring tem mais de um caractere, a função retorna a posição onde essa substring **começa**.
- Combina muito bem com [Substring](../string-functions/substring.md) para extrair trechos de texto a partir da posição encontrada.
- Funciona em todos os contextos do SFMC: e-mails, CloudPages, SMS e Landing Pages.

## Funções relacionadas

- [Substring](../string-functions/substring.md) — Extrai uma parte de uma string a partir de uma posição e comprimento. Ótima companheira do `IndexOf`.
- [Replace](../string-functions/replace.md) — Substitui todas as ocorrências de uma substring por outra dentro de uma string.
- [Length](../string-functions/length.md) — Retorna o tamanho de uma string. Útil para calcular posições relativas ao final do texto.
- [Concat](../string-functions/concat.md) — Junta várias strings em uma só.
- [Trim](../string-functions/trim.md) — Remove espaços em branco do início e do final de uma string.
- [RegExMatch](../string-functions/regexmatch.md) — Busca padrões mais complexos usando expressões regulares, quando o `IndexOf` não dá conta.
- [Add](../math-functions/add.md) — Soma valores numéricos, útil para calcular posições ao combinar com `IndexOf`.
- [Subtract](../math-functions/subtract.md) — Subtrai valores numéricos, muito usado junto com `IndexOf` para calcular comprimentos.