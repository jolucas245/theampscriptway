---
title: OutputLine
sidebar_label: OutputLine
description: Exibe o resultado de uma função AMPscript no conteúdo renderizado e adiciona uma quebra de linha (CRLF) ao final.
---

# OutputLine

## Descrição

A função `OutputLine` executa uma função AMPscript aninhada, insere o resultado no conteúdo renderizado e adiciona automaticamente um caractere de nova linha (CRLF) ao final. É muito útil quando você precisa imprimir valores dinâmicos e quer que cada saída fique em uma linha separada - especialmente em versões texto de e-mail e mensagens SMS. Importante: ela só funciona com funções AMPscript como parâmetro; se você passar uma string literal ou qualquer outro valor diretamente, a função não produz nenhuma saída.

## Sintaxe

```ampscript
OutputLine(valor)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| valor | Função AMPscript | Sim | A função AMPscript cujo resultado será exibido no conteúdo renderizado, seguido de uma quebra de linha (CRLF). |

## Exemplo básico

Exibindo o nome e o e-mail de um cliente em um bloco AMPscript, cada informação seguida de uma quebra de linha:

```ampscript
%%[
VAR @nome, @email
SET @nome = "João Silva"
SET @email = "joao.silva@lojasvitoria.com.br"

OutputLine(Concat("Cliente: ", @nome))
OutputLine(v(@email))
]%%
```

**Saída:**
```
Cliente: João Silva
joao.silva@lojasvitoria.com.br
```

## Exemplo avançado

Montando o resumo de um pedido para a versão texto de um e-mail transacional da MegaStore, onde cada linha do resumo precisa aparecer separada:

```ampscript
%%[
VAR @nome, @produto, @valor, @data, @protocolo
SET @nome = "Maria Santos"
SET @produto = "Smart TV 55 polegadas"
SET @valor = "R$ 3.299,90"
SET @data = "18/07/2025"
SET @protocolo = "MS-2025-004871"

OutputLine(Concat("Olá, ", @nome, "! Seu pedido foi confirmado."))
OutputLine(Concat("Produto: ", @produto))
OutputLine(Concat("Valor: ", @valor))
OutputLine(Concat("Data do pedido: ", @data))
OutputLine(Concat("Protocolo: ", @protocolo))
OutputLine(v(@nome))
]%%
```

**Saída:**
```
Olá, Maria Santos! Seu pedido foi confirmado.
Produto: Smart TV 55 polegadas
Valor: R$ 3.299,90
Data do pedido: 18/07/2025
Protocolo: MS-2025-004871
Maria Santos
```

## Observações

> **⚠️ Atenção:** A `OutputLine` só aceita **funções AMPscript** como parâmetro. Se você passar uma string literal diretamente - por exemplo, `OutputLine("texto qualquer")` - a função **não produz nenhuma saída**. Para exibir uma string fixa, envolva-a em uma função como [`v()`](../utility-functions/v.md) ou [`Concat()`](../string-functions/concat.md).

> **⚠️ Atenção:** A quebra de linha adicionada é um caractere CRLF (carriage return + line feed), e **não** uma tag HTML `<br/>`. Isso significa que, quando o conteúdo é renderizado como HTML (corpo de um e-mail em HTML, por exemplo), os resultados de múltiplas chamadas de `OutputLine` vão aparecer **na mesma linha visualmente** - porque HTML ignora CRLF. O CRLF só causa quebra de linha visível em saídas que interpretam texto puro, como a **versão texto de um e-mail** ou **mensagens SMS**.

> **💡 Dica:** Se você precisa exibir valores em linhas separadas dentro de um e-mail HTML, use [`Output()`](../utility-functions/output.md) combinada com [`Concat()`](../string-functions/concat.md) incluindo `<br/>` manualmente. Reserve `OutputLine` para cenários onde a saída é texto puro (SMS, versão texto do e-mail).

## Funções relacionadas

- [`Output`](../utility-functions/output.md) - exibe o resultado de uma função AMPscript sem adicionar quebra de linha ao final
- [`v`](../utility-functions/v.md) - retorna o valor de uma variável (comumente usada dentro de `OutputLine`)
- [`Concat`](../string-functions/concat.md) - concatena strings (comumente usada dentro de `OutputLine` para montar textos dinâmicos)
- [`TreatAsContent`](../utility-functions/treatascontent.md) - processa uma string como conteúdo AMPscript renderizável