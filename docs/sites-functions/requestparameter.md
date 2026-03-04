---
title: RequestParameter
sidebar_label: RequestParameter
description: Recupera o valor de um parâmetro de URL ou campo de formulário em Landing Pages e CloudPages.
---

# RequestParameter

## Descrição

A função `RequestParameter` recupera o valor de um parâmetro vindo de uma URL, campo de formulário ou query string criptografada gerada pela função [CloudPagesURL](../sites-functions/cloudpagesurl.md). É a função essencial para capturar dados dinâmicos em CloudPages — seja para personalizar uma página de confirmação de cadastro, processar um formulário de atualização de dados ou identificar o assinante que clicou em um link do e-mail. Essa função tem o mesmo comportamento da função [QueryParameter](../sites-functions/queryparameter.md), e ambas são mantidas por compatibilidade.

## Sintaxe

```ampscript
RequestParameter("queryParameter")
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| queryParameter | String | Sim | Nome do parâmetro cujo valor você deseja recuperar da URL, campo de formulário ou query string criptografada. |

## Exemplo básico

Uma CloudPage da MegaStore recebe o nome do cliente e o produto de interesse via parâmetros passados pelo [CloudPagesURL](../sites-functions/cloudpagesurl.md) no e-mail:

```ampscript
%%[
VAR @primeiroNome, @nomeProduto

SET @primeiroNome = RequestParameter("primeiroNome")
SET @nomeProduto = RequestParameter("nomeProduto")
]%%

<h1>Olá, %%=v(@primeiroNome)=%%!</h1>
<p>Você demonstrou interesse no produto: %%=v(@nomeProduto)=%%</p>
```

**Saída:**
```
Olá, Maria!
Você demonstrou interesse no produto: Smart TV 55" 4K
```

## Exemplo avançado

Uma CloudPage da Lojas Vitória funciona como centro de preferências. O e-mail envia o link usando [CloudPagesURL](../sites-functions/cloudpagesurl.md) com os dados do assinante. Na CloudPage, os parâmetros são recuperados para personalizar a página e, após o envio do formulário, os dados são gravados numa Data Extension:

```ampscript
%%[
VAR @email, @nome, @cidade, @submitted

SET @email = RequestParameter("email")
SET @nome = RequestParameter("nome")
SET @cidade = RequestParameter("cidade")
SET @submitted = RequestParameter("submitted")

IF @submitted == "true" THEN
  /* Dados vindos do formulário após o submit */
  VAR @novaCidade, @novoTelefone
  SET @novaCidade = RequestParameter("novaCidade")
  SET @novoTelefone = RequestParameter("novoTelefone")

  UpsertDE(
    "CentroPreferencias", 1,
    "Email", @email,
    "Nome", @nome,
    "Cidade", @novaCidade,
    "Telefone", @novoTelefone
  )
]%%

<h1>Obrigado, %%=v(@nome)=%%!</h1>
<p>Seus dados foram atualizados com sucesso.</p>

%%[ ELSE ]%%

<h1>Olá, %%=v(@nome)=%%!</h1>
<p>Atualize seus dados abaixo:</p>

<form method="post">
  <input type="hidden" name="email" value="%%=v(@email)=%%" />
  <input type="hidden" name="nome" value="%%=v(@nome)=%%" />
  <input type="hidden" name="submitted" value="true" />

  <label>Cidade:</label>
  <input type="text" name="novaCidade" value="%%=v(@cidade)=%%" />

  <label>Telefone:</label>
  <input type="text" name="novoTelefone" placeholder="(11) 99999-9999" />

  <button type="submit">Salvar</button>
</form>

%%[ ENDIF ]%%
```

**Saída (antes do submit):**
```
Olá, João Silva!
Atualize seus dados abaixo:

[Formulário com campo Cidade preenchido com "São Paulo" e campo Telefone vazio]
```

**Saída (após o submit):**
```
Obrigado, João Silva!
Seus dados foram atualizados com sucesso.
```

## Observações

> **💡 Dica:** Use `RequestParameter` tanto para capturar parâmetros de URL (GET) quanto valores de campos de formulário (POST). Isso torna a função perfeita para CloudPages que exibem dados personalizados e também processam formulários — como no exemplo do centro de preferências acima.

> **💡 Dica:** Quando o link no e-mail é gerado com [CloudPagesURL](../sites-functions/cloudpagesurl.md), os parâmetros trafegam criptografados na query string. A `RequestParameter` consegue recuperar esses valores automaticamente, sem necessidade de descriptografar manualmente.

> **⚠️ Atenção:** `RequestParameter` e [QueryParameter](../sites-functions/queryparameter.md) têm exatamente o mesmo comportamento. Ambas são mantidas por compatibilidade. Você pode padronizar seu código usando qualquer uma delas — o importante é manter consistência no projeto.

## Funções relacionadas

- [QueryParameter](../sites-functions/queryparameter.md) — função idêntica, mantida por compatibilidade
- [CloudPagesURL](../sites-functions/cloudpagesurl.md) — gera URLs com parâmetros criptografados que podem ser recuperados por `RequestParameter`
- [Redirect](../sites-functions/redirect.md) — redireciona o usuário para outra URL a partir de uma CloudPage
- [Empty](../utility-functions/empty.md) — útil para validar se o parâmetro retornado está vazio antes de usá-lo
- [UpsertDE](../data-extension-functions/upsertde.md) — comum em conjunto com `RequestParameter` para gravar dados recebidos de formulários