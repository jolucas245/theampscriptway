---
title: Sintaxe básica
sidebar_label: Sintaxe básica
description: Aprenda os fundamentos da sintaxe AMPscript — blocos de código, expressões inline e boas práticas de formatação para seus emails no Marketing Cloud.
sidebar_position: 2
---

<!-- generated-by-script -->

# Sintaxe básica

Se você já passou pela [Introdução](/docs/getting-started/introduction), sabe o que o AMPscript pode fazer. Agora vamos entender **como** ele funciona na prática. Nesta página, você vai aprender as três formas de escrever AMPscript e onde usá-las nos seus emails.

## Blocos de código: `%%[ ... ]%%`

O bloco de código é a forma principal de escrever AMPscript. Tudo que fica entre `%%[` e `]%%` é processado pelo Marketing Cloud antes do envio. É dentro desses blocos que você declara [variáveis](/docs/getting-started/variables), faz [condicionais](/docs/getting-started/conditionals), [loops](/docs/getting-started/loops) e qualquer lógica mais elaborada.

```ampscript
%%[

SET @primeiroNome = AttributeValue("FirstName")
SET @desconto = "20%"

]%%
```

Nesse exemplo, estamos criando duas variáveis que podem ser usadas depois no corpo do email. O bloco em si **não gera nenhuma saída visual** — ele apenas processa a lógica. Para exibir valores, você vai precisar das expressões inline.

## Expressões inline

### `%%=...=%%` — saída com encoding (HTML encoded)

Essa é a expressão que você vai usar na maioria das vezes. Ela **renderiza o valor** diretamente no HTML e aplica encoding automático de caracteres especiais (como `<`, `>`, `&`). Isso protege contra problemas de exibição e injeção de HTML.

```html
<p>Oi, %%=v(@primeiroNome)=%%. Seu cupom de %%=v(@desconto)=%% de desconto está esperando por você!</p>
```

O resultado final para a Maria Santos seria: *"Oi, Maria. Seu cupom de 20% de desconto está esperando por você!"*

### `%%==...==%%` — saída raw (sem encoding)

Essa expressão retorna o valor **sem nenhum encoding**. Use quando precisar inserir HTML dinâmico que já vem pronto — por exemplo, um trecho de código armazenado em uma Data Extension.

```html
%%==v(@htmlBanner)==%%
```

> **⚠️ Atenção:** Use `%%==...==%%` com cuidado. Se o conteúdo da variável vier de uma fonte externa ou de input do usuário, você pode acabar com HTML quebrado ou problemas de segurança. Na dúvida, prefira sempre a versão com encoding (`%%=...=%%`).

## Onde usar AMPscript

AMPscript não funciona só no corpo do email. Veja onde você pode colocar seus blocos e expressões:

| Local | Bloco `%%[ ]%%` | Inline `%%=...=%%` | Exemplo de uso |
|---|---|---|---|
| **Body (HTML)** | ✅ | ✅ | Personalização, lógica condicional |
| **Subject line** | ❌ | ✅ | `Oi, %%=v(@primeiroNome)=%%! Sua oferta de Dia das Mães` |
| **Preheader** | ❌ | ✅ | `%%=v(@primeiroNome)=%%, R$ 50 de cashback te esperando` |

> **💡 Dica:** No subject e no preheader, você só consegue usar expressões inline. Mas se precisar de lógica (um IF, por exemplo), declare tudo em um bloco `%%[ ]%%` no início do body do email. As variáveis criadas lá ficam disponíveis para o subject e o preheader usarem via `%%=v(...)=%%`.

## AMPscript é case-insensitive

Não importa se você escreve `SET`, `Set` ou `set` — o AMPscript não diferencia maiúsculas de minúsculas. O mesmo vale para nomes de funções e variáveis: `@PrimeiroNome`, `@primeironome` e `@PRIMEIRONOME` são a mesma coisa. Escolha um padrão e mantenha a consistência no seu código.

## Boas práticas de formatação

- **Coloque o bloco principal no topo do email**, antes de qualquer HTML. Isso garante que todas as variáveis e lookups sejam processados antes de serem usados.
- **Use uma instrução por linha** — evite empilhar vários `SET` na mesma linha. Fica muito mais fácil de ler e debugar.
- **Indente seu código** dentro de [condicionais](/docs/getting-started/conditionals) e [loops](/docs/getting-started/loops). AMPscript não exige indentação, mas seu eu do futuro vai agradecer.
- **Adicione [comentários](/docs/getting-started/comments)** para explicar trechos de lógica mais complexos, principalmente se outras pessoas do time vão mexer no mesmo template.

```html
%%[
  /* Busca dados do assinante na DE de Fidelidade */
  SET @nome = AttributeValue("FirstName")
  SET @pontos = Lookup("Fidelidade_MegaStore", "Pontos", "CPF", AttributeValue("CPF"))

  IF @pontos > 1000 THEN
    SET @mensagem = "Você é cliente VIP! Frete grátis em todas as compras."
  ELSE
    SET @mensagem = "Acumule mais pontos e ganhe frete grátis!"
  ENDIF
]%%

<h1>Olá, %%=v(@nome)=%%!</h1>
<p>Seus pontos: %%=v(@pontos)=%%</p>
<p>%%=v(@mensagem)=%%</p>
```

Esse exemplo junta tudo que você aprendeu: bloco de código no topo, variáveis, lógica condicional e expressões inline no HTML. É basicamente a estrutura de 90% dos emails com AMPscript que você vai encontrar por aí.

---

Agora que você domina a sintaxe, o próximo passo é entender como as [variáveis](/docs/getting-started/variables) funcionam em detalhes.