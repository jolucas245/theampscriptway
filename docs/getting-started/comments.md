---
title: Comentários
sidebar_label: Comentários
description: Como adicionar comentários ao seu código AMPscript para melhorar a legibilidade e facilitar a manutenção.
sidebar_position: 7
---

# Comentários

Comentários são trechos de texto dentro do seu código que o AMPscript ignora completamente durante a execução. Eles existem apenas para humanos - para documentar intenções, explicar decisões e facilitar a manutenção por quem vier depois (inclusive você mesmo, seis meses depois).

## Sintaxe

O delimitador de comentário em AMPscript é `/* */` - o mesmo usado em várias outras linguagens. Tudo que estiver entre `/*` e `*/` é tratado como comentário e não é processado.

```ampscript
%%[
/* Isso é um comentário e será ignorado pelo AMPscript */
SET @nomeCliente = Lookup('Clientes_DE', 'Nome', 'Email', emailaddr)
]%%
```

## Onde comentários funcionam

Você pode adicionar comentários em **blocos de código** (`%%[ ]%%`) e em blocos com **sintaxe tag-based** (`<script runat="server">`).

> **⚠️ Atenção:** Não é possível adicionar comentários em AMPscript **inline** - ou seja, dentro de `%%=` e `=%%`. Comentários funcionam apenas dentro de blocos.

```ampscript
/* ✅ Funciona - dentro de bloco de código */
%%[
/* Busca o segmento do cliente */
SET @segmento = Lookup('Segmentos_DE', 'Tier', 'Email', emailaddr)
]%%

/* ❌ Não funciona - inline não aceita comentários */
%%=/* isso causa erro */ v(@segmento)=%%
```

## Tipos de comentário

### Comentário de linha única

```ampscript
%%[
/* Busca o nome do cliente na DE de cadastro */
SET @nomeCliente = Lookup('Clientes_DE', 'Nome', 'Email', emailaddr)
]%%
```

### Comentário de múltiplas linhas

```ampscript
%%[
/*
  E-mail de confirmação de pedido - Lojas Vitória
  
  Este bloco busca os dados do pedido mais recente do cliente
  e formata os valores para exibição no corpo do e-mail.
*/
SET @pedido = Lookup('Pedidos_DE', 'Numero', 'Email', emailaddr)
SET @valor  = Lookup('Pedidos_DE', 'ValorTotal', 'Email', emailaddr)
]%%
```

### Comentário inline (ao lado do código)

```ampscript
%%[
SET @desconto = 15 /* percentual de desconto para clientes Premium */
SET @limite   = 3  /* máximo de produtos exibidos por e-mail */
]%%
```

## Quando comentar

Comente sempre que o código não for autoexplicativo. Não é necessário comentar o óbvio - o objetivo é documentar o **por quê**, não o **o quê**.

```ampscript
%%[
/* ❌ Comentário desnecessário - o código já é claro */
/* Atribui o valor 30 à variável @diasValidade */
SET @diasValidade = 30

/* ✅ Comentário útil - explica a decisão de negócio */
/* Cupom válido por 30 dias - definido pelo time de CRM em jan/2025 */
SET @diasValidade = 30
]%%
```

Para guias completos sobre como estruturar comentários em projetos maiores - incluindo cabeçalhos de script e comentários de seção - veja [Boas Práticas](/getting-started/best-practices).
