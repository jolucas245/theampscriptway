---
title: QueryParameter
sidebar_label: QueryParameter
description: Retorna o valor de um parâmetro de URL ou campo de formulário em uma Landing Page ou CloudPage.
---

<!-- generated-by-script -->

# QueryParameter

## Descrição

A função `QueryParameter()` retorna o valor de um parâmetro passado pela URL ou por um campo de formulário em uma Landing Page ou CloudPage. Ela também consegue recuperar parâmetros de uma query string criptografada gerada pela função `CloudPagesURL()`. Essa função se comporta da mesma forma que a `RequestParameter()` — as duas existem por questões de compatibilidade. Você pode usar qualquer uma delas sem problema.

## Sintaxe

```ampscript
QueryParameter("queryParameter")
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|----------------|--------|-------------|-----------|
| queryParameter | String | Sim | O nome do parâmetro da URL (ou campo de formulário) cujo valor você quer recuperar. |

## Exemplo básico

Imagine que você tem um e-mail da **Lojas Vitória** com um link para uma CloudPage de confirmação de compra. No e-mail, o link é montado assim:

```ampscript
%%=RedirectTo(CloudPagesURL(345, "primeiroNome", "Maria", "produto", "Bolsa de Couro"))=%%
```

Na CloudPage de destino, você recupera os valores usando `QueryParameter()`:

```ampscript
%%[
  VAR @nome, @produto
  SET @nome = QueryParameter("primeiroNome")
  SET @produto = QueryParameter("produto")
]%%

Obrigado pela sua compra, %%=ProperCase(@nome)=%%!

Seu pedido de %%=v(@produto)=%% será enviado em breve.
Fique de olho no seu e-mail para acompanhar o rastreio!
```

**Saída:**
```
Obrigado pela sua compra, Maria!

Seu pedido de Bolsa de Couro será enviado em breve.
Fique de olho no seu e-mail para acompanhar o rastreio!
```

## Exemplo avançado

Neste cenário, a **MegaStore** envia um e-mail de Dia das Mães com um link personalizado para uma CloudPage de resgate de cupom. Vários parâmetros são passados pela URL criptografada, e na CloudPage a gente recupera tudo, valida e registra o resgate em uma Data Extension.

**No e-mail:**

```ampscript
%%[
  VAR @linkResgate
  SET @linkResgate = CloudPagesURL(
    512,
    "email", EmailAddress,
    "nome", FirstName,
    "cupom", "MAES2024",
    "desconto", "50"
  )
]%%

<a href="%%=RedirectTo(@linkResgate)=%%">Resgate seu cupom de Dia das Mães!</a>
```

**Na CloudPage:**

```ampscript
%%[
  VAR @email, @nome, @cupom, @desconto, @mensagem

  SET @email = QueryParameter("email")
  SET @nome = QueryParameter("nome")
  SET @cupom = QueryParameter("cupom")
  SET @desconto = QueryParameter("desconto")

  IF NOT Empty(@email) AND NOT Empty(@cupom) THEN

    /* Registra o resgate na Data Extension */
    InsertDE(
      "Resgates_Cupom",
      "Email", @email,
      "Nome", @nome,
      "Cupom", @cupom,
      "Desconto", @desconto,
      "DataResgate", FormatDate(Now(), "dd/MM/yyyy HH:mm")
    )

    SET @mensagem = Concat(
      "Parabéns, ", ProperCase(@nome),
      "! Seu cupom ", Uppercase(@cupom),
      " de R$ ", @desconto,
      ",00 foi ativado com sucesso. Use na sua próxima compra acima de R$ 299,00 e aproveite frete grátis!"
    )

  ELSE
    SET @mensagem = "Ops, não conseguimos validar seu cupom. Entre em contato pelo nosso SAC."
  ENDIF
]%%

%%=v(@mensagem)=%%
```

**Saída (quando os parâmetros existem):**
```
Parabéns, Maria! Seu cupom MAES2024 de R$ 50,00 foi ativado com sucesso. Use na sua próxima compra acima de R$ 299,00 e aproveite frete grátis!
```

**Saída (quando os parâmetros não existem):**
```
Ops, não conseguimos validar seu cupom. Entre em contato pelo nosso SAC.
```

## Observações

- `QueryParameter()` funciona **da mesma forma** que [`RequestParameter()`](../sites-functions/requestparameter.md). Pode usar qualquer uma das duas — a Salesforce mantém as duas por compatibilidade.
- Essa função é usada principalmente em **CloudPages e Landing Pages**. Não faz sentido usá-la dentro de um e-mail enviado normalmente, já que em e-mails não existe uma URL de requisição com parâmetros.
- Ela consegue recuperar parâmetros de query strings **criptografadas** geradas pela função [`CloudPagesURL()`](../sites-functions/cloudpagesurl.md). Isso é muito importante para segurança — os valores ficam protegidos na URL.
- Se o parâmetro não existir na URL ou estiver vazio, a função retorna uma string vazia. Por isso, é uma boa prática sempre validar o retorno com [`Empty()`](../utility-functions/empty.md) antes de usar o valor.
- O nome do parâmetro passado como argumento é **case-insensitive** na maioria dos cenários, mas uma boa prática é manter a consistência entre o nome usado no `CloudPagesURL()` e o nome usado no `QueryParameter()`.
- Também funciona para capturar valores de campos de formulário enviados via POST em uma CloudPage — não se limita apenas a parâmetros de URL.

## Funções relacionadas

- [RequestParameter](../sites-functions/requestparameter.md) — Faz exatamente a mesma coisa que `QueryParameter()`. As duas existem por compatibilidade.
- [CloudPagesURL](../sites-functions/cloudpagesurl.md) — Gera URLs criptografadas para CloudPages com parâmetros embutidos.
- [RedirectTo](../http-functions/redirectto.md) — Redireciona o clique de um link para uma URL, essencial para usar com `CloudPagesURL()`.
- [Empty](../utility-functions/empty.md) — Verifica se uma variável está vazia. Ótima para validar o retorno de `QueryParameter()`.
- [ProperCase](../string-functions/propercase.md) — Formata texto com a primeira letra de cada palavra em maiúsculo. Útil para exibir nomes capturados pela URL.
- [Uppercase](../string-functions/uppercase.md) — Converte texto para maiúsculas. Útil para exibir códigos de cupom.
- [InsertDE](../data-extension-functions/insertde.md) — Insere registros em Data Extensions. Muito usado em conjunto para registrar ações em CloudPages.
- [Redirect](../sites-functions/redirect.md) — Redireciona o usuário para outra URL a partir de uma CloudPage.