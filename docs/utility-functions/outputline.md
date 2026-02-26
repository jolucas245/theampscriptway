---
title: OutputLine
sidebar_label: OutputLine
description: Retorna o resultado de uma função AMPscript aninhada e insere o conteúdo renderizado seguido de uma quebra de linha (CRLF).
---

# OutputLine

## Descrição

A função `OutputLine` exibe o resultado de uma função AMPscript aninhada diretamente no conteúdo renderizado e adiciona automaticamente um caractere de nova linha (CRLF — Carriage Return + Line Feed) ao final da saída. Ela funciona de forma muito parecida com a função [Output](../utility-functions/output.md), mas com essa quebra de linha extra no final. É importante saber que `OutputLine` **só funciona com funções aninhadas** como parâmetro — se você passar uma string literal ou qualquer outro valor direto, ela simplesmente não vai gerar nenhuma saída.

## Sintaxe

```ampscript
OutputLine(valor)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| valor | Função AMPscript | Sim | A função AMPscript cujo resultado será exibido no conteúdo renderizado, seguido de uma quebra de linha (CRLF). |

## Exemplo básico

Imagine que você quer montar uma saudação personalizada para um e-mail da **Lojas Vitória** com o nome do cliente:

```ampscript
%%[
VAR @nomeCliente
SET @nomeCliente = "Maria Santos"

OutputLine(Concat("Olá, ", @nomeCliente, "! Bem-vinda à Lojas Vitória."))
OutputLine(v(@nomeCliente))
]%%
```

**Saída:**
```
Olá, Maria Santos! Bem-vinda à Lojas Vitória.
Maria Santos
```

> **Nota:** Cada chamada de `OutputLine` adiciona um CRLF ao final. Em HTML, esse CRLF **não** gera uma quebra visual (você precisaria de `<br/>` para isso). Porém, em saídas de texto puro — como a versão texto de um e-mail ou mensagens SMS — cada resultado aparece em uma linha separada.

## Exemplo avançado

Cenário real: um e-mail de confirmação de compra da **MegaStore** durante a Black Friday. Você precisa exibir os dados do pedido em formato texto (por exemplo, para a versão texto do e-mail ou um SMS):

```ampscript
%%[
VAR @nomeCliente, @numeroPedido, @valorCompra, @cashback, @dataCompra

SET @nomeCliente = "Carlos Oliveira"
SET @numeroPedido = "MS-2024-78432"
SET @valorCompra = 1549.90
SET @cashback = Multiply(@valorCompra, 0.05)
SET @dataCompra = "29/11/2024"

OutputLine(Concat("===== MegaStore - Confirmação de Pedido ====="))
OutputLine(Concat("Cliente: ", @nomeCliente))
OutputLine(Concat("Pedido: ", @numeroPedido))
OutputLine(Concat("Data da compra: ", @dataCompra))
OutputLine(Concat("Valor total: R$ ", FormatNumber(@valorCompra, "N2")))
OutputLine(Concat("Cashback Black Friday (5%): R$ ", FormatNumber(@cashback, "N2")))
OutputLine(Concat("Obrigado por comprar na MegaStore, ", @nomeCliente, "!"))
]%%
```

**Saída (versão texto/SMS):**
```
===== MegaStore - Confirmação de Pedido =====
Cliente: Carlos Oliveira
Pedido: MS-2024-78432
Data da compra: 29/11/2024
Valor total: R$ 1.549,90
Cashback Black Friday (5%): R$ 77,50
Obrigado por comprar na MegaStore, Carlos Oliveira!
```

> Na versão HTML do e-mail, todo esse texto apareceria em uma única linha visual, já que o CRLF não é interpretado como quebra de linha em HTML. Para conteúdo HTML, considere usar [Output](../utility-functions/output.md) combinado com tags `<br/>`, ou simplesmente incorporar o HTML diretamente.

## Observações

- **Só aceita funções como parâmetro.** Se você passar uma string literal (ex: `OutputLine("texto qualquer")`), nada será exibido. Sempre encapsule o valor em uma função como [Concat](../string-functions/concat.md) ou [V](../utility-functions/v.md).
- **CRLF ≠ `<br/>`.** A quebra de linha adicionada é um caractere CRLF (invisível em HTML). Em renderizações HTML, as saídas de múltiplas chamadas de `OutputLine` vão aparecer na **mesma linha visual**. O CRLF só faz diferença em contextos de texto puro, como a versão texto de e-mails ou mensagens SMS.
- **Para HTML, prefira alternativas.** Se você precisa de quebras de linha visíveis em HTML, use [Output](../utility-functions/output.md) junto com `Concat` incluindo `<br/>`, ou use a função [Char](../string-functions/char.md) para inserir caracteres especiais conforme necessário.
- **Funciona em diversos contextos do SFMC:** e-mails (versão HTML e texto), SMS, CloudPages e Landing Pages.
- **Diferença entre Output e OutputLine:** a única diferença é que `OutputLine` adiciona o CRLF automaticamente ao final; [Output](../utility-functions/output.md) não adiciona nenhuma quebra de linha.

## Funções relacionadas

- [Output](../utility-functions/output.md) — Exibe o resultado de uma função aninhada sem adicionar quebra de linha ao final.
- [V](../utility-functions/v.md) — Retorna o valor de uma variável; muito usada dentro de `OutputLine` para exibir variáveis.
- [Concat](../string-functions/concat.md) — Concatena strings e valores; a parceira ideal de `OutputLine` para montar textos dinâmicos.
- [TreatAsContent](../utility-functions/treatascontent.md) — Processa uma string como conteúdo AMPscript, útil para renderizar blocos dinâmicos.
- [Char](../string-functions/char.md) — Retorna um caractere a partir do código ASCII; pode ser usado para inserir quebras de linha manualmente.