---
title: Variáveis
sidebar_label: Variáveis
description: Como declarar e atribuir valores a variáveis em AMPscript usando VAR e SET.
sidebar_position: 3
---

# Variáveis

Variáveis são o ponto de partida para qualquer lógica em AMPscript. É nelas que você armazena dados: o nome do cliente, uma data formatada, o valor de um produto, para usar ao longo das suas comunicações. Entender como declarar e atribuir valores a variáveis é o fundamento de tudo que vem depois.

## Nomeando variáveis

Em AMPscript, toda variável começa com o caractere `@`. Sempre. Sem exceção.

Você escolhe o nome que quiser depois do `@`, mas a boa prática é usar nomes descritivos que deixem claro o que aquela variável guarda. Quando você está mantendo um template de régua de relacionamento com dezenas de variáveis, um nome como `@cidadeContato` vale ouro comparado a `@c`.

## Declarando variáveis com VAR

Para declarar uma variável, você usa a palavra-chave `VAR`. Quando declara uma variável, ela é adicionada a um dicionário interno de variáveis. O valor inicial de qualquer variável recém-declarada é **nulo** (null) — ela existe, mas ainda não carrega nenhum dado.

Este exemplo declara uma variável chamada `@primeiroNome`:

```ampscript
%%[
  VAR @primeiroNome
]%%
```

Você também pode declarar **múltiplas variáveis em uma única linha**, separando-as por vírgula. Isso é muito útil quando você está montando um e-mail de boas-vindas, por exemplo, e precisa de várias informações do assinante de uma vez:

```ampscript
%%[
  VAR @primeiroNome, @sobrenome, @cidadeContato
]%%
```

> **⚠️ Atenção:** Você só pode declarar variáveis dentro de blocos AMPscript (entre `%%[` e `]%%`). Não é possível declarar variáveis em strings inline de AMPscript. Lembre-se disso ao estruturar seu código.

## Atribuindo valores com SET

Declarar a variável é só o primeiro passo — ela nasce nula. Para colocar um valor dentro dela, você usa a palavra-chave `SET`.

Neste exemplo, declaramos a variável `@cidadeContato` e atribuímos o valor `"São Paulo"`:

```ampscript
%%[
  VAR @cidadeContato
  SET @cidadeContato = "São Paulo"
]%%
```

Agora `@cidadeContato` deixou de ser nula e carrega o texto "São Paulo". Você pode usar essa variável em qualquer lugar do seu conteúdo para personalizar a mensagem — imagine um e-mail da Lojas Vitória dizendo "Confira as ofertas na nossa loja em São Paulo!".

> **💡 Dica:** No dia a dia, você vai declarar e atribuir valor quase sempre em sequência. É um padrão tão comum que se torna automático: `VAR` para criar, `SET` para preencher.

## Atribuindo o resultado de uma função

O `SET` não serve apenas para textos fixos. Você pode atribuir a uma variável o **resultado de uma função**, o que é onde AMPscript começa a ficar realmente poderoso.

Neste exemplo, usamos as funções `FormatDate()` e `Now()` para capturar a data atual formatada e armazená-la na variável `@dataAtual`:

```ampscript
%%[
  VAR @dataAtual
  SET @dataAtual = FormatDate(Now(), "DD/MM/YYYY")
]%%
```

Se hoje fosse 05 de agosto de 2023, a variável `@dataAtual` teria o valor `"05/08/2023"`. Isso é muito usado em e-mails transacionais — confirmações de pedido, comprovantes, notificações — onde a data precisa aparecer no corpo da mensagem.

Imagine um e-mail do Banco Brasilão confirmando uma transação:

```ampscript
%%[
  VAR @nomeCliente, @dataAtual, @cidadeAgencia
  SET @nomeCliente = "Maria Santos"
  SET @dataAtual = FormatDate(Now(), "DD/MM/YYYY")
  SET @cidadeAgencia = "Curitiba"
]%%

Olá, %%=v(@nomeCliente)=%%.

Sua solicitação foi registrada em %%=v(@dataAtual)=%% na agência de %%=v(@cidadeAgencia)=%%.
```

> **💡 Dica:** Combinar `SET` com funções é o padrão que você mais vai usar no Marketing Cloud. Buscar dados de uma Data Extension, formatar valores, manipular datas — tudo passa por atribuir resultados de funções a variáveis.

---

Variáveis são a base de tudo. Com `VAR` e `SET` dominados, você está pronto para avançar para [condicionais](/docs/getting-started/conditionals) e [loops](/docs/getting-started/loops), onde essas variáveis ganham vida dentro de lógica de verdade.