---
title: Loops
sidebar_label: Loops
description: Aprenda a usar loops FOR em AMPScript para iterar sobre dados de Data Extensions e montar conteúdos dinâmicos nos seus e-mails.
sidebar_position: 5
---

<!-- generated-by-script -->

# Loops

Se você já sabe trabalhar com [variáveis](/docs/getting-started/variables) e [condicionais](/docs/getting-started/conditionals), o próximo passo natural é aprender a repetir blocos de código. No AMPScript, o loop `FOR` é a única estrutura de repetição disponível — e, na prática, você vai usá-lo quase sempre junto com **LookupRows**, **Row()** e **Field()** para percorrer linhas de uma Data Extension.

Vamos construir um exemplo do zero e evoluí-lo até um cenário real de carrinho abandonado.

## Sintaxe do FOR...DO...NEXT

A estrutura básica é assim:

```ampscript
%%[
FOR @i = 1 TO @limite DO
  /* código que se repete */
NEXT @i
]%%
```

| Elemento | O que faz |
|---|---|
| `@i` | Variável contadora — incrementa automaticamente de 1 em 1 |
| `1` | Valor inicial do contador |
| `@limite` | Valor final (inclusive) — o loop roda enquanto `@i <= @limite` |
| `DO` | Marca o início do bloco de repetição |
| `NEXT @i` | Fecha o bloco e avança o contador |

Um exemplo mínimo para você sentir a mecânica:

```html
%%[
SET @limite = 3
FOR @i = 1 TO @limite DO
]%%

<p>Repetição número %%=v(@i)=%%</p>

%%[
NEXT @i
]%%
```

Isso gera três parágrafos: *Repetição número 1*, *Repetição número 2*, *Repetição número 3*. Simples assim.

## Iterando sobre rowsets — o uso mais comum

Na vida real, você quase nunca vai usar um `FOR` com número fixo. O padrão do dia a dia é:

1. **LookupRows** busca linhas de uma Data Extension → retorna um *rowset*
2. **RowCount()** conta quantas linhas vieram → define o limite do loop
3. Dentro do loop, **Row()** pega uma linha específica e **Field()** extrai o valor de cada coluna

Imagine uma Data Extension chamada **Pedidos_Recentes** com as colunas `EmailAssinante`, `NomeProduto`, `Valor` e `DataPedido`. Vamos listar os últimos pedidos de um assinante:

```html
%%[
SET @email = AttributeValue("emailaddr")
SET @linhas = LookupRows("Pedidos_Recentes", "EmailAssinante", @email)
SET @total = RowCount(@linhas)
]%%

%%[ IF @total > 0 THEN ]%%

<h2>Seus últimos pedidos</h2>
<table>
  <tr>
    <th>Produto</th>
    <th>Valor</th>
    <th>Data</th>
  </tr>

  %%[ FOR @i = 1 TO @total DO ]%%
    %%[
      SET @linha = Row(@linhas, @i)
      SET @produto = Field(@linha, "NomeProduto")
      SET @valor = Field(@linha, "Valor")
      SET @data = Field(@linha, "DataPedido")
    ]%%
    <tr>
      <td>%%=v(@produto)=%%</td>
      <td>R$ %%=v(@valor)=%%</td>
      <td>%%=FormatDate(@data, "dd/MM/yyyy")=%%</td>
    </tr>
  %%[ NEXT @i ]%%

</table>

%%[ ELSE ]%%
<p>Você ainda não tem pedidos registrados.</p>
%%[ ENDIF ]%%
```

Repare no fluxo: **LookupRows** → **RowCount** (define `@total`) → **FOR 1 TO @total** → **Row + Field** dentro do loop. Esse é o padrão que você vai repetir em 90% dos casos.

> **💡 Dica:** Sempre envolva o loop com `IF @total > 0 THEN` para evitar que o e-mail renderize uma tabela vazia quando não houver dados.

## Cuidado com performance

Cada chamada de **LookupRows** e cada iteração do loop consomem tempo de processamento no momento do envio. Em bases grandes, isso pode atrasar a entrega ou até causar timeout.

| Regra prática | Por quê |
|---|---|
| Limite o loop a **no máximo 2.000 iterações** | Acima disso o SFMC pode abortar a renderização |
| Prefira **LookupRows** com filtros específicos | Quanto menos linhas retornarem, mais rápido o loop roda |
| Evite **LookupRows dentro de outro FOR** | Loops aninhados com lookup multiplicam chamadas ao banco — use **LookupOrderedRows** com limite quando possível |
| Use **LookupOrderedRows** quando precisar de ordenação e limite | Permite trazer só os N registros mais recentes |

> **⚠️ Atenção:** O **LookupRows** retorna no máximo **2.000 linhas** por padrão. Se a sua DE tiver mais registros para o mesmo filtro, considere refinar a consulta ou usar **LookupOrderedRows** com um limite explícito.

## Exemplo real: e-mail de carrinho abandonado

Vamos evoluir o exemplo anterior para um cenário completo. A **MegaStore** quer enviar um e-mail de carrinho abandonado listando os produtos que o cliente deixou no carrinho, com link para finalizar a compra.

Data Extension **Carrinho_Abandonado**: `EmailCliente`, `NomeProduto`, `ImagemURL`, `Valor`, `SKU`.

```html
%%[
SET @email = AttributeValue("emailaddr")
SET @nome = AttributeValue("FirstName")
SET @itens = LookupRows("Carrinho_Abandonado", "EmailCliente", @email)
SET @qtd = RowCount(@itens)
SET @valorTotal = 0
]%%

<p>Oi, %%=v(@nome)=%% 👋</p>
<p>Você deixou %%=v(@qtd)=%% item(ns) esperando no seu carrinho:</p>

%%[ IF @qtd > 0 THEN ]%%
<table>
  %%[ FOR @i = 1 TO @qtd DO ]%%
    %%[
      SET @linha = Row(@itens, @i)
      SET @produto = Field(@linha, "NomeProduto")
      SET @img = Field(@linha, "ImagemURL")
      SET @preco = Field(@linha, "Valor")
      SET @sku = Field(@linha, "SKU")
      SET @valorTotal = Add(@valorTotal, @preco)
      SET @linkProduto = Concat("https://www.megastore.com.br/produto/", @sku)
    ]%%
    <tr>
      <td><img src="%%=v(@img)=%%" width="80" alt="%%=v(@produto)=%%"></td>
      <td>
        <a href="%%=RedirectTo(@linkProduto)=%%">%%=v(@produto)=%%</a><br>
        R$ %%=FormatNumber(@preco, "N2")=%%
      </td>
    </tr>
  %%[ NEXT @i ]%%
</table>

<p><strong>Total: R$ %%=FormatNumber(@valorTotal, "N2")=%%</strong></p>
<p>Finalize agora e ganhe <strong>frete grátis</strong>! 🚚</p>

%%[ ELSE ]%%
<p>Parece que seu carrinho está vazio. Que tal dar uma olhada nas nossas ofertas?</p>
%%[ ENDIF ]%%
```

Perceba como este exemplo é uma evolução natural do anterior: adicionamos acumulador de valor total (`@valorTotal` com **Add**), montagem dinâmica de URL com **Concat** e **RedirectTo**, e uma imagem por produto. Tudo dentro do mesmo padrão **LookupRows → RowCount → FOR → Row → Field**.

> **💡 Dica:** Se você quiser limitar a exibição a, digamos, 5 produtos, troque `LookupRows` por `LookupOrderedRows("Carrinho_Abandonado", 5, "Valor DESC", "EmailCliente", @email)` — assim já vem ordenado pelo maior valor e limitado a 5 itens.

---

Com loops dominados, você já consegue montar e-mails altamente dinâmicos. Quando sentir que o código está ficando complexo demais, volte ao básico: revise a [sintaxe](/docs/getting-started/syntax), organize suas [variáveis](/docs/getting-started/variables) e use [condicionais](/docs/getting-started/conditionals) para controlar o que aparece. É tudo junto e misturado! 🚀