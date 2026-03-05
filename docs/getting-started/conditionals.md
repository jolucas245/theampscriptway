---
title: Condicionais
sidebar_label: Condicionais
description: Use blocos If, ElseIf e Else em AMPScript para controlar o conteúdo exibido com base em condições.
sidebar_position: 4
---

# Condicionais

Personalização de verdade vai muito além de colocar o primeiro nome no assunto do e-mail. Quando você precisa mostrar um conteúdo diferente para cada perfil de cliente - uma oferta por faixa etária, uma saudação por região, um bloco específico por tipo de plano - é aí que entram as condicionais.

Em AMPScript, o bloco `If` é a estrutura que permite executar processamento condicional: você define uma condição, e o conteúdo só é renderizado se ela for verdadeira.

## Bloco If básico

No mínimo, um bloco `If` precisa de três palavras-chave:

- **`If`** - vem imediatamente antes da condição que você quer avaliar.
- **`Then`** - vem imediatamente depois da condição.
- **`EndIf`** - fecha o bloco.

Essa é a estrutura mais enxuta possível:

```html
%%[
  SET @totalPedido = 1500

  IF @totalPedido > 1299 THEN
    SET @mensagem = "Você ganhou frete grátis para todo o Brasil!"
  ENDIF
]%%

%%=v(@mensagem)=%%
```

Nesse exemplo, como o valor de `@totalPedido` (1500) é maior que 1299, a condição é verdadeira e a variável `@mensagem` recebe o texto sobre frete grátis. Se o valor fosse 800, nada seria exibido - o bloco simplesmente seria ignorado.

> **💡 Dica:** As palavras-chave `If`, `Then` e `EndIf` **não são case-sensitive**. Ou seja, `IF`, `If` e `if` funcionam exatamente da mesma forma. Escolha um padrão e mantenha consistência no seu código - isso facilita muito a manutenção em equipe.

## O que pode entrar na condição

As avaliações dentro de um bloco `If` aceitam estes tipos de entrada:

- **Constantes** - valores fixos como números ou strings (`1299`, `"SP"`)
- **Variáveis** - definidas com `SET` (como `@totalPedido`)
- **Atributos e valores de Data Extension** - campos do seu modelo de dados
- **Chamadas de função** - o retorno de qualquer função AMPScript

Isso dá bastante flexibilidade. Você pode comparar uma variável com uma constante, comparar dois campos de Data Extension entre si, ou usar o resultado de uma função diretamente na condição.

## Testando condições adicionais com ElseIf

Use `ElseIf` quando precisar testar mais de uma condição dentro do mesmo bloco. Você pode incluir **múltiplos** `ElseIf` em sequência.

Imagine uma régua de relacionamento da MegaStore onde a oferta muda conforme a faixa etária do cliente:

```html
%%[
  SET @idade = 35

  IF @idade >= 31 AND @idade <= 40 THEN
    SET @oferta = "20% de desconto em eletrônicos - aproveite, é por tempo limitado!"
  ELSEIF @idade >= 41 AND @idade <= 50 THEN
    SET @oferta = "15% de desconto em eletrodomésticos para renovar sua casa."
  ENDIF
]%%

%%=v(@oferta)=%%
```

Aqui, se `@idade` for 35, o cliente vê a oferta de eletrônicos. Se for 45, vê a de eletrodomésticos. Para qualquer outro valor fora dessas faixas, nenhuma oferta é exibida.

## Capturando tudo o que sobrou com Else

O `Else` funciona como uma rede de segurança: ele captura **qualquer condição que não foi tratada** pelos blocos `If` ou `ElseIf` anteriores. Você só pode incluir **um único** `Else` por bloco.

```html
%%[
  SET @idade = 28

  IF @idade >= 31 AND @idade <= 40 THEN
    SET @oferta = "20% de desconto em eletrônicos!"
  ELSEIF @idade >= 41 AND @idade <= 50 THEN
    SET @oferta = "15% de desconto em eletrodomésticos!"
  ELSE
    SET @oferta = "Confira nossas ofertas especiais do mês na MegaStore."
  ENDIF
]%%

Olá, João! %%=v(@oferta)=%%
```

Como `@idade` é 28 - fora das duas faixas definidas - o bloco `Else` entra em ação e o cliente recebe a mensagem genérica. Ninguém fica sem conteúdo.

> **⚠️ Atenção:** Você pode ter quantos `ElseIf` precisar, mas apenas **um `Else`**, e ele deve ser sempre o último antes do `EndIf`. Se você colocar um `ElseIf` depois do `Else`, vai ter erro.

> **💡 Dica:** Em campanhas de e-mail com vários perfis de público, o `Else` é seu melhor amigo. Ele garante que mesmo um registro com dados inesperados receba um conteúdo válido - evitando aquele e-mail com espaço em branco no meio.

---

Agora que você domina condicionais, o próximo passo é aprender a percorrer conjuntos de dados com [Loops](/docs/getting-started/loops). Para revisar como criar e usar as variáveis que aparecem nas condições, volte em [Variáveis](/docs/getting-started/variables).