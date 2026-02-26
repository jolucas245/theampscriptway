---
title: Output
sidebar_label: Output
description: Retorna o resultado de uma função AMPscript aninhada e insere esse resultado diretamente no conteúdo renderizado.
---

<!-- generated-by-script -->

# Output

## Descrição

A função `Output` pega o resultado de uma função AMPscript aninhada e insere esse resultado diretamente no conteúdo renderizado (email, CloudPage, SMS, etc). Ela é essencial quando você está escrevendo blocos de código AMPscript entre `%%[` e `]%%` e precisa "imprimir" algo no HTML de saída sem usar a sintaxe inline `%%=...=%%`. **Atenção:** a `Output` só funciona quando você passa outra função como parâmetro. Se você passar uma string literal ou qualquer outro valor direto (que não seja uma função), ela **não vai gerar nenhuma saída**.

## Sintaxe

```ampscript
Output(valor)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| valor | Função AMPscript | Sim | A função cujo resultado será inserido no conteúdo renderizado. Pode ser qualquer função AMPscript válida, como `Concat()`, `v()`, `Format()`, etc. |

## Exemplo básico

Imagine que você quer exibir o nome de um assinante dentro de um bloco de código AMPscript. Usando `Output` com a função `v()`, você consegue imprimir o valor da variável direto no conteúdo:

```ampscript
%%[
SET @nome = "Maria Santos"
Output(v(@nome))
]%%
```

**Saída:**
```
Maria Santos
```

## Exemplo avançado

Cenário real: você está montando um email de confirmação de pedido para a loja **MegaStore**. Precisa exibir uma mensagem personalizada com o nome do cliente e o valor do pedido, tudo dentro de um bloco de código:

```ampscript
%%[
SET @primeiroNome = "João"
SET @sobrenome = "Silva"
SET @valorPedido = "R$ 459,90"
SET @numeroPedido = "MS-2024-78432"

Output(Concat("Olá, ", v(@primeiroNome), " ", v(@sobrenome), "!"))
]%%

<br>

%%[
Output(Concat("Seu pedido #", v(@numeroPedido), " no valor de ", v(@valorPedido), " foi confirmado com sucesso."))
]%%

<br>

%%[
Output(Concat("Aproveite o frete grátis para compras acima de R$ 299,00 em www.megastore.com.br"))
]%%
```

**Saída:**
```
Olá, João Silva!

Seu pedido #MS-2024-78432 no valor de R$ 459,90 foi confirmado com sucesso.

Aproveite o frete grátis para compras acima de R$ 299,00 em www.megastore.com.br
```

## Cenário prático: quando usar Output vs sintaxe inline

Muita gente se pergunta: "Mas por que eu usaria `Output` se posso usar `%%=v(@variavel)=%%`?" Boa pergunta! A `Output` brilha quando você tem lógica complexa dentro de um bloco `%%[ ]%%` e precisa gerar saída condicionalmente:

```ampscript
%%[
SET @pontos = 1250
SET @nomeCliente = "Carlos Oliveira"

IF @pontos >= 1000 THEN
  Output(Concat(v(@nomeCliente), ", parabéns! Você tem ", v(@pontos), " pontos no programa Conecta Pontos. Resgate já suas recompensas!"))
ELSE
  Output(Concat(v(@nomeCliente), ", você tem ", v(@pontos), " pontos. Faltam apenas ", Subtract(1000, @pontos), " pontos para começar a resgatar!"))
ENDIF
]%%
```

**Saída (quando pontos >= 1000):**
```
Carlos Oliveira, parabéns! Você tem 1250 pontos no programa Conecta Pontos. Resgate já suas recompensas!
```

## Observações

- **Só aceita funções como parâmetro.** Se você passar uma string literal como `Output("Olá")`, nada será exibido. Você precisa envolver em uma função, por exemplo: `Output(Concat("Olá"))` ou `Output(v(@variavel))`.
- A `Output` é a alternativa à sintaxe inline `%%=...=%%` para quando você está dentro de um bloco de código `%%[ ]%%`.
- Se você precisa que a saída inclua uma quebra de linha ao final, considere usar a função [OutputLine](../utility-functions/outputline.md) em vez de `Output`.
- A função funciona em todos os contextos do Marketing Cloud: emails, CloudPages, SMS e Landing Pages.
- Se a função aninhada retornar `null` ou vazio, `Output` simplesmente não vai exibir nada no conteúdo — não gera erro.
- Para exibir o valor de uma variável, o padrão mais comum é `Output(v(@variavel))`, já que `v()` é a função que retorna o valor de uma variável.

## Funções relacionadas

- [V](../utility-functions/v.md) — retorna o valor de uma variável; é o par mais comum da `Output`
- [OutputLine](../utility-functions/outputline.md) — funciona como `Output`, mas adiciona uma quebra de linha ao final
- [Concat](../string-functions/concat.md) — concatena strings; muito usado dentro de `Output` para montar textos dinâmicos
- [TreatAsContent](../utility-functions/treatascontent.md) — processa uma string como conteúdo AMPscript, útil para renderizar HTML dinâmico
- [Format](../string-functions/format.md) — formata valores (datas, números) que podem ser exibidos via `Output`