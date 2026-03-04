---
title: Sintaxe básica
sidebar_label: Sintaxe básica
description: Conheça as três formas de inserir AMPscript no seu conteúdo - inline, bloco de código e tag-based scripting.
sidebar_position: 2
---

# Sintaxe básica

Antes de sair escrevendo lógica e variáveis, você precisa entender como o Marketing Cloud reconhece que determinado trecho do seu conteúdo é AMPscript. Existem três formas de fazer isso, cada uma com seus delimitadores próprios. Pense nos delimitadores como sinais que dizem ao sistema: "ei, interprete isso aqui como código, não como texto comum".

---

## Inline AMPscript

Use os delimitadores `%%=` e `=%%` para inserir AMPscript **diretamente dentro do seu HTML**. Essa é a forma mais comum quando você quer exibir um valor dinâmico no meio do conteúdo, como o nome do cliente num e-mail, o preço de um produto, uma data formatada.

```html
<p>Olá, %%=v(@primeiroNome)=%%! Seu pedido no valor de %%=v(@valorPedido)=%% foi confirmado.</p>
```

Uma regra importante: dentro de um trecho inline, você só pode executar **uma única função**. Mas calma, você pode **aninhar funções** dentro dessa função única. Isso dá bastante flexibilidade na prática.

No exemplo abaixo, usamos a função `Iif()` para testar uma condição. Se o nome do cliente estiver vazio (verificado pela função `Empty()` aninhada), exibimos "Cliente" como fallback. Se não, exibimos o próprio nome:

```html
<p>Bem-vindo(a), %%=Iif(Empty(@nome), "Cliente", @nome)=%%!</p>
```

Esse padrão é muito usado em campanhas de e-mail marketing. Imagine uma régua de boas-vindas da **Lojas CompraTudo** onde nem todo lead tem nome preenchido no cadastro.

> **💡 Dica:** Inline AMPscript é perfeito para personalização pontual dentro de tags HTML. Sempre que precisar exibir um valor dinâmico no meio de um parágrafo, botão ou link, essa é a abordagem certa.

---

## Bloco de código

Quando você precisa fazer mais do que exibir um valor (definir múltiplas variáveis, executar várias funções, montar lógica mais elaborada) use um **bloco de código**. Os delimitadores são `%%[` para abrir e `]%%` para fechar.

```
%%[
  SET @nomeCliente = "Maria Santos"
  SET @cpf = "123.456.789-00"
  SET @cidade = "Belo Horizonte"
  SET @valorDesconto = "R$ 50,00"
]%%

<h1>Oferta exclusiva para você, %%=v(@nomeCliente)=%%!</h1>
<p>Identificamos que você é de %%=v(@cidade)=%%. Aproveite %%=v(@valorDesconto)=%% de desconto na sua próxima compra.</p>
```

Perceba o padrão: o bloco `%%[ ... ]%%` fica no topo, cuidando de toda a lógica e preparação de dados, e o HTML abaixo usa trechos inline para exibir os valores. Essa separação entre lógica e apresentação é a base de praticamente todo e-mail personalizado que você vai construir.

> **💡 Dica:** Em e-mails e CloudPages mais complexos, é comum ter vários blocos de código ao longo do conteúdo. Organize-os de forma que a lógica fique próxima do HTML que ela alimenta e seu "eu do futuro" agradecerá na hora da manutenção.

---

## Tag-based scripting

A terceira forma usa tags `<script>` com atributos específicos, padronizando a sintaxe de declaração do AMPscript com a mesma estrutura usada em Server-Side JavaScript (SSJS). Isso facilita a vida de quem trabalha com as duas linguagens no dia a dia.

```html
<script runat="server" language="ampscript">
  SET @empresa = "Conecta Telecom"
  SET @telefone = "(11) 99999-9999"
</script>

<p>Fale com a %%=v(@empresa)=%%: %%=v(@telefone)=%%</p>
```

> **⚠️ Atenção:** Quando você abre um bloco com um tipo de delimitador, **precisa fechar com o mesmo tipo**. Se abriu com `<script>`, feche com `</script>`. Se abriu com `%%[`, feche com `]%%`. Misturar delimitadores de abertura e fechamento vai gerar erro.

---

## Qual usar?

| Situação | Forma recomendada |
|---|---|
| Exibir um valor no meio do HTML | Inline (`%%==%%`) |
| Definir variáveis e executar várias funções | Bloco de código (`%%[ ]%%`) |
| Padronizar sintaxe com SSJS no mesmo conteúdo | Tag-based (`<script>`) |

Na prática, a maioria dos projetos combina **blocos de código** para a lógica com **inline** para a exibição. Tag-based scripting aparece mais em contextos onde a equipe também trabalha com SSJS e quer manter consistência. Particularmente, em anos de trabalho com Marketing Cloud Engagement, eu cheguei a user o Tag-based não mais que 3 vezes.

Agora que você entende como o Marketing Cloud identifica AMPscript, o próximo passo é aprender a trabalhar com [variáveis](/getting-started/variables), a base de qualquer personalização.