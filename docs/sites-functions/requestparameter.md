---
title: RequestParameter
sidebar_label: RequestParameter
description: Retorna o valor de um parâmetro de URL ou campo de formulário em uma Landing Page ou CloudPage.
---

# RequestParameter

## Descrição

A função `RequestParameter()` retorna o valor de um parâmetro passado via URL (query string) ou enviado por um campo de formulário em uma Landing Page ou CloudPage. Ela também consegue recuperar parâmetros de uma query string criptografada gerada pela função `CloudPagesURL()`. Essa função se comporta exatamente da mesma forma que a função `QueryParameter()` — as duas existem por questões de compatibilidade com versões anteriores. Na prática, `RequestParameter()` é a mais usada no dia a dia e a que você vai encontrar na maioria dos exemplos e projetos.

## Sintaxe

```ampscript
RequestParameter("queryParameter")
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|----------------|--------|-------------|-----------|
| queryParameter | String | Sim | O nome do parâmetro da URL ou campo de formulário cujo valor você quer recuperar. |

## Exemplo básico

Imagine que você tem um e-mail da **Lojas Vitória** com um link para uma CloudPage de confirmação de compra. No e-mail, você monta o link assim com `CloudPagesURL()`:

```ampscript
%%[
VAR @linkConfirmacao
SET @linkConfirmacao = CloudPagesURL(123, "primeiroNome", "Maria", "nomeProduto", "Bolsa Couro Caramelo")
]%%

<a href="%%=RedirectTo(@linkConfirmacao)=%%">Ver confirmação do pedido</a>
```

Na **CloudPage**, você recupera os valores assim:

```ampscript
%%[
VAR @primeiroNome, @nomeProduto
SET @primeiroNome = RequestParameter("primeiroNome")
SET @nomeProduto = RequestParameter("nomeProduto")
]%%

Obrigado pela sua compra, %%=ProperCase(@primeiroNome)=%%!

Seu produto "%%=v(@nomeProduto)=%%" já está sendo preparado para envio.
Fique de olho no seu e-mail para acompanhar o rastreio! 📦
```

**Saída:**
```
Obrigado pela sua compra, Maria!

Seu produto "Bolsa Couro Caramelo" já está sendo preparado para envio.
Fique de olho no seu e-mail para acompanhar o rastreio! 📦
```

## Exemplo avançado

Agora vamos a um cenário mais completo: uma CloudPage de atualização de cadastro para o programa de fidelidade do **Banco Meridional**. O cliente clica no link do e-mail, chega na página com seus dados pré-preenchidos, faz alterações e envia o formulário. A própria CloudPage processa o POST.

**No e-mail** — montando o link com os dados do cliente:

```ampscript
%%[
VAR @linkAtualizacao
SET @linkAtualizacao = CloudPagesURL(
  456,
  "email", EmailAddress,
  "nome", [PrimeiroNome],
  "cpf", [CPF],
  "pontos", [SaldoPontos]
)
]%%

<a href="%%=RedirectTo(@linkAtualizacao)=%%">Atualizar meu cadastro</a>
```

**Na CloudPage** — exibindo os dados e processando o formulário:

```ampscript
%%[
VAR @email, @nome, @cpf, @pontos, @novoTelefone, @novoCep, @enviado

/* Verifica se o formulário foi enviado (POST) */
SET @enviado = RequestParameter("enviado")

IF @enviado == "sim" THEN
  /* Recupera os dados do formulário (campos hidden + campos editáveis) */
  SET @email = RequestParameter("email")
  SET @nome = RequestParameter("nome")
  SET @novoTelefone = RequestParameter("telefone")
  SET @novoCep = RequestParameter("cep")

  /* Valida se os campos obrigatórios foram preenchidos */
  IF Empty(@novoTelefone) OR Empty(@novoCep) THEN
    SET @mensagem = "Por favor, preencha todos os campos obrigatórios."
  ELSE
    /* Atualiza a Data Extension com os novos dados */
    UpsertDE(
      "Cadastro_Fidelidade", 1,
      "Email", @email,
      "Nome", @nome,
      "Telefone", @novoTelefone,
      "CEP", @novoCep,
      "DataAtualizacao", FormatDate(Now(), "dd/MM/yyyy HH:mm")
    )
    SET @mensagem = Concat("Cadastro atualizado com sucesso, ", ProperCase(@nome), "! 🎉")
  ENDIF

ELSE
  /* Primeira carga — dados vindos da query string criptografada */
  SET @email = RequestParameter("email")
  SET @nome = RequestParameter("nome")
  SET @cpf = RequestParameter("cpf")
  SET @pontos = RequestParameter("pontos")
ENDIF
]%%

%%[ IF @enviado == "sim" AND NOT Empty(@novoTelefone) AND NOT Empty(@novoCep) THEN ]%%

  <h2>%%=v(@mensagem)=%%</h2>
  <p>Seu saldo continua em <strong>%%=FormatNumber(@pontos, "N0")=%% pontos</strong>.</p>
  <p>Aproveite para trocar seus pontos em <a href="https://www.bancomeridional.com.br/fidelidade">nossa loja de recompensas</a>!</p>

%%[ ELSE ]%%

  <h2>Atualize seu cadastro, %%=ProperCase(@nome)=%%!</h2>
  <p>CPF: %%=v(@cpf)=%%</p>
  <p>Saldo de pontos: <strong>%%=FormatNumber(@pontos, "N0")=%%</strong></p>

  %%[ IF NOT Empty(@mensagem) THEN ]%%
    <p style="color:red;">%%=v(@mensagem)=%%</p>
  %%[ ENDIF ]%%

  <form method="POST">
    <input type="hidden" name="email" value="%%=v(@email)=%%" />
    <input type="hidden" name="nome" value="%%=v(@nome)=%%" />
    <input type="hidden" name="pontos" value="%%=v(@pontos)=%%" />
    <input type="hidden" name="enviado" value="sim" />

    <label>Telefone:</label>
    <input type="text" name="telefone" placeholder="(11) 99999-9999" />

    <label>CEP:</label>
    <input type="text" name="cep" placeholder="01310-100" />

    <button type="submit">Salvar alterações</button>
  </form>

%%[ ENDIF ]%%
```

**Saída (após envio do formulário):**
```
Cadastro atualizado com sucesso, Maria! 🎉

Seu saldo continua em 12.450 pontos.
Aproveite para trocar seus pontos em nossa loja de recompensas!
```

## Observações

- **Funciona igual a `QueryParameter()`**: as duas funções fazem exatamente a mesma coisa. A Salesforce mantém ambas por compatibilidade. Na prática, a comunidade usa mais `RequestParameter()`.
- **Contexto principal: CloudPages e Landing Pages.** Essa função é usada principalmente em CloudPages, Landing Pages e microsites. Em e-mails, você normalmente usa personalização via Data Extensions ou atributos de assinante — não `RequestParameter()`.
- **Recupera parâmetros criptografados:** quando você usa `CloudPagesURL()` para gerar links, os parâmetros são passados de forma criptografada na URL. O `RequestParameter()` consegue descriptografar e ler esses valores automaticamente.
- **Funciona tanto com GET quanto com POST:** você pode usar para capturar valores da query string (GET) e também de campos de formulário enviados via POST.
- **Se o parâmetro não existir, retorna vazio:** caso você passe um nome de parâmetro que não está na URL nem no formulário, a função retorna uma string vazia. É uma boa prática sempre validar com [Empty](../utility-functions/empty.md) antes de usar o valor.
- **Cuidado com segurança:** parâmetros passados em texto puro na URL (sem `CloudPagesURL()`) ficam visíveis para o usuário. Evite passar dados sensíveis como CPF ou e-mail em URLs não criptografadas. Sempre prefira `CloudPagesURL()` para trafegar informações sensíveis.
- **Nome do parâmetro é case-insensitive:** geralmente não faz diferença escrever `"nome"` ou `"Nome"`, mas é uma boa prática manter consistência entre o envio e a leitura.

## Funções relacionadas

- [CloudPagesURL](../sites-functions/cloudpagesurl.md) — gera URLs de CloudPages com parâmetros criptografados, perfeita para usar em conjunto com `RequestParameter()`
- [QueryParameter](../sites-functions/queryparameter.md) — funciona de forma idêntica a `RequestParameter()`, mantida por compatibilidade
- [RedirectTo](../http-functions/redirectto.md) — usada para redirecionar links em e-mails, frequentemente combinada com `CloudPagesURL()`
- [Redirect](../sites-functions/redirect.md) — redireciona o usuário para outra URL a partir de uma CloudPage
- [Empty](../utility-functions/empty.md) — valida se o valor retornado pelo `RequestParameter()` está vazio
- [IsNullDefault](../utility-functions/isnulldefault.md) — define um valor padrão caso o parâmetro retorne nulo
- [ProperCase](../string-functions/propercase.md) — formata nomes com a primeira letra maiúscula, muito usada junto com `RequestParameter()`
- [Trim](../string-functions/trim.md) — remove espaços extras do valor capturado, útil para limpar dados de formulários
- [UpsertDE](../data-extension-functions/upsertde.md) — insere ou atualiza registros em Data Extensions com os dados capturados do formulário
- [Lookup](../data-extension-functions/lookup.md) — busca dados em Data Extensions para validar ou complementar informações recebidas via parâmetro