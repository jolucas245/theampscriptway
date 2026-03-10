---
title: QueryParameter
sidebar_label: QueryParameter
description: Recupera o valor de um parâmetro de URL ou campo de formulário em uma landing page ou CloudPage.
---

# QueryParameter

## Descrição

A função `QueryParameter` retorna o valor de um parâmetro passado via URL (query string) ou campo de formulário em uma landing page. Ela também consegue recuperar parâmetros de uma query string criptografada gerada pela função [CloudPagesURL](../sites-functions/cloudpagesurl.md). Essa função se comporta exatamente da mesma forma que a [RequestParameter](../sites-functions/requestparameter.md) - ambas existem por questões de compatibilidade retroativa.

## Sintaxe

```ampscript
QueryParameter("queryParameter")
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| queryParameter | String | Sim | Nome do parâmetro de URL (query string) cujo valor você deseja recuperar. |

## Exemplo básico

Uma CloudPage da MegaStore recebe o nome do cliente via parâmetro de URL para personalizar a página de boas-vindas.

**No e-mail (gerando o link com parâmetros):**

```ampscript
%%[
VAR @linkPagina
SET @linkPagina = CloudPagesURL(345, "primeiroNome", "João", "nomeProduto", "Smartphone Galaxy Ultra")
]%%

<a href="%%=RedirectTo(@linkPagina)=%%">Ver sua oferta exclusiva</a>
```

**Na CloudPage (recuperando os parâmetros):**

```ampscript
%%[
VAR @primeiroNome, @nomeProduto
SET @primeiroNome = QueryParameter("primeiroNome")
SET @nomeProduto = QueryParameter("nomeProduto")
]%%

Olá, %%=v(@primeiroNome)=%%, temos uma oferta especial do %%=v(@nomeProduto)=%% para você!
```

**Saída:**
```
Olá, João, temos uma oferta especial do Smartphone Galaxy Ultra para você!
```

## Exemplo avançado

A Lojas Vitória envia uma campanha de e-mail com link para uma CloudPage de confirmação de interesse. O link passa vários dados do cliente via [CloudPagesURL](../sites-functions/cloudpagesurl.md), e a CloudPage personaliza o conteúdo e registra o interesse em uma Data Extension.

**No e-mail:**

```ampscript
%%[
VAR @linkConfirmacao
SET @linkConfirmacao = CloudPagesURL(782, "email", EmailAddress, "nome", "Maria Santos", "categoria", "Eletrodomésticos", "valor", "1299.90")
]%%

<a href="%%=RedirectTo(@linkConfirmacao)=%%">Confirmar interesse na oferta</a>
```

**Na CloudPage:**

```ampscript
%%[
VAR @email, @nome, @categoria, @valor, @valorFormatado, @mensagem

SET @email = QueryParameter("email")
SET @nome = QueryParameter("nome")
SET @categoria = QueryParameter("categoria")
SET @valor = QueryParameter("valor")

IF NOT Empty(@email) AND NOT Empty(@nome) THEN

  SET @valorFormatado = FormatCurrency(@valor, "pt-BR", 2)

  InsertDE(
    "Interesses_Campanha",
    "Email", @email,
    "Nome", @nome,
    "Categoria", @categoria,
    "Valor", @valor,
    "DataRegistro", Now()
  )

  SET @mensagem = Concat("Obrigado, ", @nome, "! Seu interesse na categoria ", @categoria, " (", @valorFormatado, ") foi registrado com sucesso.")

ELSE

  SET @mensagem = "Não foi possível processar sua solicitação. Tente novamente pelo e-mail recebido."

ENDIF
]%%

%%=v(@mensagem)=%%
```

**Saída:**
```
Obrigado, Maria Santos! Seu interesse na categoria Eletrodomésticos (R$ 1.299,90) foi registrado com sucesso.
```

## Observações

- A função `QueryParameter` tem comportamento idêntico ao da [RequestParameter](../sites-functions/requestparameter.md). Ambas são mantidas por compatibilidade retroativa. Você pode escolher qualquer uma delas - o resultado será o mesmo.

- Ela recupera tanto parâmetros visíveis na URL (query string aberta) quanto parâmetros de uma query string criptografada gerada pela função [CloudPagesURL](../sites-functions/cloudpagesurl.md).

> **💡 Dica:** No dia a dia, o cenário mais comum é usar `QueryParameter` na CloudPage em conjunto com `CloudPagesURL` no e-mail. A `CloudPagesURL` criptografa os parâmetros automaticamente, o que protege dados sensíveis dos seus contatos na URL. A `QueryParameter` descriptografa e retorna os valores sem nenhuma configuração adicional.

> **⚠️ Atenção:** Sempre valide os valores retornados com [Empty](../utility-functions/empty.md) antes de usá-los em operações como gravação em Data Extensions. Se o parâmetro não existir na URL ou o nome estiver escrito diferente, a função pode retornar vazio, o que pode causar erros inesperados na sua página.

## Funções relacionadas

- [RequestParameter](../sites-functions/requestparameter.md) - função idêntica, mantida por compatibilidade retroativa
- [CloudPagesURL](../sites-functions/cloudpagesurl.md) - gera URLs de CloudPages com parâmetros criptografados, que podem ser lidos por `QueryParameter`
- [RedirectTo](../http-functions/redirectto.md) - usada no e-mail para redirecionar o clique para a URL gerada por `CloudPagesURL`
- [Empty](../utility-functions/empty.md) - para validar se o parâmetro retornou algum valor antes de processá-lo
- [V](../utility-functions/v.md) - para exibir o valor da variável no HTML renderizado