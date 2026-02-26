---
title: "Introdução ao AMPscript"
sidebar_label: "Introdução ao AMPscript"
description: "Guia de boas-vindas ao AMPscript: o que é, onde usar no SFMC e como ele pode transformar suas comunicações com personalização dinâmica."
sidebar_position: 1
tags: [ampscript, introdução, sfmc, getting-started]
---

# Introdução ao AMPscript

## O que é AMPscript e para que serve

AMPscript é a linguagem de script nativa do Salesforce Marketing Cloud. Com ela, você consegue personalizar e-mails, SMS, landing pages e praticamente qualquer mensagem de forma dinâmica — usando dados reais dos seus subscribers e Data Extensions.

Pensa assim: em vez de mandar o mesmo e-mail genérico pra todo mundo, você usa AMPscript pra exibir o nome do cliente, mostrar produtos relevantes, calcular valores de cashback e até mudar blocos inteiros de conteúdo com base em regras de negócio. É a ferramenta que transforma comunicação em massa em comunicação personalizada.

A sintaxe é simples e direta. Se você já trabalha com SFMC mas ainda faz tudo "na mão" ou só com campos de personalização básicos, AMPscript vai ser um salto enorme na qualidade das suas campanhas.

## Onde ele pode ser usado no SFMC

| Canal / Recurso | Suporte a AMPscript | Exemplo de uso |
|---|---|---|
| **E-mail (Content Builder)** | Completo | Personalização de nome, ofertas dinâmicas, conteúdo condicional |
| **SMS (MobileConnect)** | Completo | Inserir código de rastreio, nome do cliente |
| **CloudPages** | Completo | Formulários, landing pages dinâmicas, preference centers |
| **Automações (Script Activity)** | ⚠️ Limitado (prefira SSJS) | Manipulação de dados em automações mais complexas |

> **💡 Dica:** O lugar mais comum pra começar com AMPscript é no e-mail. Depois que você pegar o jeito, usar em CloudPages e SMS é natural.

## AMPscript vs. SSJS — Quando usar cada um

| Critério | AMPscript | SSJS (Server-Side JavaScript) |
|---|---|---|
| **Curva de aprendizado** | Mais fácil | Mais complexa |
| **Melhor pra** | Personalização de conteúdo | Lógica complexa, integrações via API |
| **Performance em e-mail** | Excelente | Mais lento |
| **Sintaxe** | Funções próprias do SFMC | JavaScript padrão |
| **Recomendação** | E-mails, SMS, conteúdo dinâmico | Automações, CloudPages complexas, chamadas HTTP |

**Resumo prático:** se é personalização de conteúdo em e-mail ou SMS, vá de AMPscript. Se precisa de loops complexos, chamadas a APIs externas ou manipulação pesada de dados, SSJS pode ser mais adequado.

## Como o AMPscript é processado

AMPscript é processado **no servidor (server-side)**, **antes** da mensagem ser entregue ao subscriber. Isso significa que quando o João Silva abre o e-mail dele, todo o código AMPscript já foi executado e substituído pelo conteúdo final em HTML.

O subscriber **nunca vê** o código AMPscript — ele só vê o resultado. E como tudo roda no servidor da Salesforce, não depende do cliente de e-mail nem do navegador.

## Seu primeiro exemplo prático

Imagine que a **MegaStore** vai mandar um e-mail de Dia das Mães. A Data Extension tem os campos `PrimeiroNome`, `ValorCashback` e `Email`. Veja como personalizar:

```html
%%[
  VAR @nome, @cashback
  SET @nome = AttributeValue("PrimeiroNome")
  SET @cashback = AttributeValue("ValorCashback")
]%%

<h1>Olá, %%=v(@nome)=%%! 💜</h1>

<p>
  Neste Dia das Mães, você tem <strong>R$ %%=v(@cashback)=%%</strong>
  de cashback disponível na MegaStore.
</p>

<a href="https://www.megastore.com.br/diadasmaes">
  Aproveitar agora
</a>
```

Se a subscriber for **Maria Santos** com **R$ 45,00** de cashback, ela verá:

> **Olá, Maria! 💜**
> Neste Dia das Mães, você tem **R$ 45,00** de cashback disponível na MegaStore.

Simples assim. E isso é só o começo!

## Próximos passos

Agora que você entendeu o que é AMPscript e onde ele se encaixa, bora aprender na prática:

1. [Sintaxe básica](/docs/getting-started/syntax) — blocos de código, delimitadores e regras de escrita
2. [Variáveis](/docs/getting-started/variables) — como declarar, atribuir e usar variáveis
3. [Personalization Strings](/docs/getting-started/personalization-strings) — o jeito mais rápido de exibir dados
4. [Condicionais](/docs/getting-started/conditionals) — IF/ELSE para conteúdo dinâmico
5. [Loops](/docs/getting-started/loops) — repetir blocos de conteúdo com dados de tabelas
6. [Comentários](/docs/getting-started/comments) — documentando seu código

> **💡 Dica:** Recomendo seguir essa ordem. Cada guia assume que você leu os anteriores.