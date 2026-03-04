---
title: Introdução ao AMPscript
sidebar_label: Introdução ao AMPscript
description: Visão geral do AMPscript, a linguagem de script interpretada do Marketing Cloud Engagement para personalização de mensagens e páginas.
sidebar_position: 1
---

# Introdução ao AMPscript

## O que é AMPscript?

AMPscript é uma linguagem de script interpretada do Marketing Cloud Engagement. Em termos práticos, é a ferramenta que conecta os dados dos seus clientes ao conteúdo das suas comunicações. Isso muda completamente o jogo da personalização.

Imagine que a Lojas CompraTudo precisa enviar um e-mail de aniversário para milhões de clientes, cada um com nome, oferta e valor de desconto diferentes. É exatamente para isso que o AMPscript existe: integrar os dados do seu banco de clientes diretamente no conteúdo de marketing.

## Onde você pode usar

O AMPscript funciona em todos os canais de comunicação suportados pelo Marketing Cloud Engagement:

- **E-mail**: personalização de campanhas, réguas de relacionamento, e-mails transacionais
- **SMS**: mensagens mobile com dados dinâmicos
- **WhatsApp**: mensagens de template e sessão via WhatsApp Business
- **Mobile**: comunicações via push e mensagens in-app
- **CloudPages**: landing pages e microsites customizados

Essa versatilidade é o que torna o AMPscript tão valioso no dia a dia. Você aprende uma linguagem e aplica em praticamente todos os pontos de contato com o cliente.

## Como funciona a execução

Esse é um ponto fundamental para entender bem: o código AMPscript é executado no servidor do Marketing Cloud Engagement. O momento da execução depende do contexto:

- **Em mensagens (e-mail, SMS, mobile):** o código roda no momento do envio
- **Em CloudPages:** o código roda quando a landing page é carregada pelo navegador

Ou seja, quando o Mário abre o e-mail da Conecta Telecom, ele já recebe o HTML final, pois todo o processamento do AMPscript já aconteceu antes, no servidor, na hora do envio. O destinatário nunca vê o código, apenas o resultado.

> **💡 Dica:** Como a execução acontece no servidor durante o envio, cada mensagem é processada individualmente. É assim que um único e-mail template pode gerar milhões de versões personalizadas, uma para cada assinante da sua base.

> **⚠️ Atenção:** Em CloudPages, o código executa a cada carregamento da página. Isso é diferente do e-mail, onde a execução acontece uma única vez no momento do envio. Tenha isso em mente ao planejar sua solução.

## O que dá para fazer na prática

Com a integração entre dados e conteúdo que o AMPscript oferece, sua equipe de marketing consegue enviar mensagens altamente personalizadas. Pense em cenários como:

- Um e-mail do Banco Brasilão que exibe o nome, agência e saldo de pontos de cada correntista
- Uma CloudPage da MegaStore que mostra produtos recomendados com preços como R$ 1.299,90, formatados para cada região
- Um SMS da FarmaRede com o endereço da loja mais próxima baseado no CEP do cliente

Tudo isso é possível porque o AMPscript puxa os dados diretamente da sua base dentro do Marketing Cloud Engagement e injeta no conteúdo na hora certa.

## Próximos passos

Este guia cobre os fundamentos que você precisa dominar para trabalhar com AMPscript. Cada tópico a seguir aprofunda um aspecto da linguagem:

1. [Sintaxe](/docs/getting-started/syntax) - como escrever e estruturar código AMPscript
2. [Variáveis](/docs/getting-started/variables) - como armazenar e manipular dados
3. [Condicionais](/docs/getting-started/conditionals) - como criar lógica e regras de exibição
4. [Loops](/docs/getting-started/loops) - como repetir blocos de conteúdo
5. [Comentários](/docs/getting-started/comments) - como documentar seu código
6. [Strings de personalização](/docs/getting-started/personalization-strings) - como exibir dados dos assinantes no conteúdo

> **💡 Dica:** Se você já programa em qualquer linguagem, vai se sentir confortável rapidamente. Se é sua primeira vez com código, não se preocupe, o AMPscript tem uma curva de aprendizado acessível, e esse guia foi feito para acompanhar você passo a passo.