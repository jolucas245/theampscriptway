---
title: IIF
sidebar_label: IIF
description: Testa uma condição e retorna um valor se verdadeira ou outro valor se falsa, funcionando como um "if/else" inline no AMPscript.
---

<!-- generated-by-script -->

# IIF

## Descrição

A função `IIF` é o "if ternário" do AMPscript — ela avalia uma condição e, dependendo do resultado, retorna um de dois valores possíveis. Se a condição for verdadeira, retorna o segundo parâmetro; se for falsa, retorna o terceiro. É perfeita para quando você precisa de uma lógica condicional simples direto dentro de uma linha, sem precisar montar um bloco `IF/ELSEIF/ENDIF` inteiro. Você vai usar bastante essa função para personalizar saudações, exibir valores dinâmicos e tomar decisões rápidas em emails, CloudPages e SMS.

## Sintaxe

```ampscript
IIF(condição, valorSeVerdadeiro, valorSeFalso)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| condição | String (expressão booleana) | Sim | A condição a ser testada. Pode ser qualquer função ou expressão que retorne verdadeiro ou falso. |
| valorSeVerdadeiro | String | Sim | O valor retornado quando a condição é verdadeira. |
| valorSeFalso | String | Sim | O valor retornado quando a condição é falsa. |

## Exemplo básico

Imagina que você está enviando um e-mail promocional da **Lojas Vitória** e quer cumprimentar o assinante pelo nome. Se o campo `PrimeiroNome` estiver preenchido, usa o nome; senão, usa uma saudação genérica.

```ampscript
%%[
SET @primeiroNome = AttributeValue("PrimeiroNome")
SET @saudacao = IIF(NOT EMPTY(@primeiroNome), Concat("Olá, ", @primeiroNome, "!"), "Olá, tudo bem?")
]%%

%%=v(@saudacao)=%%
```

**Saída (quando PrimeiroNome = "Maria"):**
```
Olá, Maria!
```

**Saída (quando PrimeiroNome está vazio):**
```
Olá, tudo bem?
```

## Exemplo avançado

Agora um cenário mais completo: a **MegaStore** está enviando um e-mail de carrinho abandonado. Dependendo do valor total do carrinho, o e-mail mostra uma mensagem de frete grátis (acima de R$299) ou informa o valor do frete. Além disso, verifica se o cliente é membro do programa de pontos para exibir uma mensagem extra de cashback.

```ampscript
%%[
SET @primeiroNome = AttributeValue("PrimeiroNome")
SET @valorCarrinho = AttributeValue("ValorCarrinho")
SET @membroPontos = AttributeValue("MembroPontos")

/* Saudação personalizada */
SET @saudacao = IIF(NOT EMPTY(@primeiroNome), Concat("Oi, ", @primeiroNome, "! 👋"), "Oi! 👋")

/* Mensagem de frete */
SET @msgFrete = IIF(@valorCarrinho >= 299, "🚚 Frete grátis para o seu pedido!", Concat("🚚 Frete: R$ 19,90 — faltam R$ ", Format(Subtract(299, @valorCarrinho), "N", "pt-BR", 2), " para frete grátis!"))

/* Mensagem do programa de pontos */
SET @valorCashback = Multiply(@valorCarrinho, 0.05)
SET @msgPontos = IIF(@membroPontos == "Sim", Concat("💰 Você ganha R$ ", Format(@valorCashback, "N", "pt-BR", 2), " de cashback nessa compra!"), "⭐ Cadastre-se no MegaPontos e ganhe 5% de cashback!")
]%%

%%=v(@saudacao)=%%

Você deixou itens no carrinho no valor de R$ %%=Format(@valorCarrinho, "N", "pt-BR", 2)=%%.

%%=v(@msgFrete)=%%

%%=v(@msgPontos)=%%

Finalize agora: www.megastore.com.br/carrinho
```

**Saída (PrimeiroNome = "Carlos", ValorCarrinho = 450.00, MembroPontos = "Sim"):**
```
Oi, Carlos! 👋

Você deixou itens no carrinho no valor de R$ 450,00.

🚚 Frete grátis para o seu pedido!

💰 Você ganha R$ 22,50 de cashback nessa compra!

Finalize agora: www.megastore.com.br/carrinho
```

**Saída (PrimeiroNome vazio, ValorCarrinho = 150.00, MembroPontos = "Não"):**
```
Oi! 👋

Você deixou itens no carrinho no valor de R$ 150,00.

🚚 Frete: R$ 19,90 — faltam R$ 149,00 para frete grátis!

⭐ Cadastre-se no MegaPontos e ganhe 5% de cashback!

Finalize agora: www.megastore.com.br/carrinho
```

## Observações

- A função `IIF` é essencialmente um atalho inline para blocos `IF/ELSE`. Para lógicas simples com apenas duas possibilidades, ela deixa o código muito mais limpo e compacto.
- A condição precisa ser uma expressão que retorne verdadeiro ou falso. Você pode usar operadores de comparação (`==`, `!=`, `>`, `<`, `>=`, `<=`), funções como [Empty](../utility-functions/empty.md) e [IsNull](../utility-functions/isnull.md), ou combinações com `AND`, `OR` e `NOT`.
- Tanto o `valorSeVerdadeiro` quanto o `valorSeFalso` são **sempre avaliados**, independentemente do resultado da condição. Isso significa que se um dos valores contiver uma função que cause erro (como um [Lookup](../data-extension-functions/lookup.md) em uma Data Extension que não existe), o erro vai acontecer mesmo que aquele caminho não seja o "escolhido". Para esses casos, prefira usar blocos `IF/ELSEIF/ENDIF`.
- Diferente de linguagens como JavaScript, o `IIF` do AMPscript **não faz short-circuit evaluation** (avaliação de curto-circuito).
- Você pode aninhar funções `IIF` dentro de outras `IIF` para simular múltiplas condições, mas tome cuidado: isso fica difícil de ler rapidamente. Para mais de duas condições, considere usar blocos `IF/ELSEIF/ENDIF`.
- A função funciona em todos os contextos do SFMC: emails, CloudPages, SMS e Landing Pages.
- Combina muito bem com a função [Concat](../string-functions/concat.md) para montar strings dinâmicas em uma única linha.

## Funções relacionadas

- [Empty](../utility-functions/empty.md) — verifica se um valor está vazio, muito usada como condição dentro do `IIF`
- [IsNull](../utility-functions/isnull.md) — verifica se um valor é nulo, útil como condição no `IIF`
- [IsNullDefault](../utility-functions/isnulldefault.md) — retorna um valor padrão quando o original é nulo (alternativa ao `IIF` para casos de nulidade)
- [Concat](../string-functions/concat.md) — concatena strings, frequentemente usada junto com `IIF` para montar mensagens dinâmicas
- [V](../utility-functions/v.md) — exibe o valor de uma variável inline no conteúdo
- [AttributeValue](../utility-functions/attributevalue.md) — recupera o valor de um atributo do assinante, ótima para alimentar a condição do `IIF`
- [Format](../string-functions/format.md) — formata números e datas, útil para exibir valores em Reais dentro do `IIF`