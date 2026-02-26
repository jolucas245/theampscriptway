---
title: InsertData
sidebar_label: InsertData
description: Insere uma nova linha em uma Data Extension e retorna o número de linhas inseridas.
---

<!-- generated-by-script -->

# InsertData

## Descrição

A função `InsertData` insere uma nova linha em uma Data Extension e retorna o número de linhas inseridas (normalmente `1`). Você passa o nome da Data Extension, seguido de pares de nome de coluna e valor que deseja inserir. É a função ideal para gravar novos registros a partir de CloudPages, landing pages, microsites e mensagens SMS no Mobile Connect. Se você precisa inserir dados a partir de um **e-mail**, use a função [InsertDE](../data-extension-functions/insertde.md).

## Sintaxe

```ampscript
InsertData("NomeDaDataExtension", "coluna1", "valor1" [, "coluna2", "valor2", ...])
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| dataExt | string | Sim | Nome da Data Extension onde a linha será inserida. |
| columnName1 | string | Sim | Nome da coluna onde o valor será inserido. |
| valueToInsert1 | string | Sim | Valor a ser inserido na coluna especificada. |
| columnNameN | string | Não | Colunas adicionais para inserir na mesma linha. Sempre em pares com o respectivo valor. |
| valueToInsertN | string | Não | Valor correspondente à coluna adicional. |

## Exemplo básico

Imagine que você tem uma Data Extension chamada **Cadastros_Newsletter** com as colunas: `Email`, `Nome`, `Cidade`. Uma CloudPage com formulário de cadastro pode usar `InsertData` assim:

```ampscript
%%[

VAR @email, @nome, @cidade, @resultado

SET @email = RequestParameter("email")
SET @nome = RequestParameter("nome")
SET @cidade = RequestParameter("cidade")

SET @resultado = InsertData(
  "Cadastros_Newsletter",
  "Email", @email,
  "Nome", @nome,
  "Cidade", @cidade
)

]%%
```

**Saída:**

```
1
```

A variável `@resultado` retorna `1`, indicando que uma linha foi inserida com sucesso na Data Extension.

## Exemplo avançado

Cenário real: a **MegaStore** tem uma CloudPage de cadastro para a promoção de **Dia das Mães**. O cliente preenche um formulário com seus dados e, ao submeter, o registro é inserido na Data Extension **Promo_DiaDasMaes** com um código de cupom gerado automaticamente.

```ampscript
%%[

VAR @nome, @email, @cpf, @telefone, @cupom, @dataRegistro, @resultado

/* Captura dados do formulário */
SET @nome = ProperCase(RequestParameter("nome"))
SET @email = Lowercase(RequestParameter("email"))
SET @cpf = RequestParameter("cpf")
SET @telefone = RequestParameter("telefone")

/* Gera um código de cupom único */
SET @cupom = Concat("MAES-", Uppercase(Substring(MD5(@email), 1, 8)))

/* Data e hora do registro */
SET @dataRegistro = Format(Now(), "dd/MM/yyyy HH:mm")

/* Verifica se o e-mail já está cadastrado */
VAR @jaExiste
SET @jaExiste = LookupRows("Promo_DiaDasMaes", "Email", @email)

IF RowCount(@jaExiste) == 0 THEN

  SET @resultado = InsertData(
    "Promo_DiaDasMaes",
    "Nome", @nome,
    "Email", @email,
    "CPF", @cpf,
    "Telefone", @telefone,
    "Cupom", @cupom,
    "DataRegistro", @dataRegistro,
    "Origem", "CloudPage"
  )

  IF @resultado == 1 THEN
]%%

<h2>Tudo certo, %%=v(@nome)=%%! 🎉</h2>
<p>Você está participando da promoção Dia das Mães da MegaStore.</p>
<p>Seu cupom de desconto: <strong>%%=v(@cupom)=%%</strong></p>
<p>Use no site www.megastore.com.br até 11/05/2025 e ganhe frete grátis em compras acima de R$299,00!</p>

%%[
  ELSE
]%%

<p>Ops! Ocorreu um erro ao processar seu cadastro. Tente novamente.</p>

%%[
  ENDIF

ELSE
]%%

<p>Oi, %%=v(@nome)=%%! Você já está cadastrado(a) na promoção. 😉</p>

%%[
ENDIF

]%%
```

**Saída (para um novo cadastro):**

```
Tudo certo, Maria Santos! 🎉
Você está participando da promoção Dia das Mães da MegaStore.
Seu cupom de desconto: MAES-3A7F2B1C
Use no site www.megastore.com.br até 11/05/2025 e ganhe frete grátis em compras acima de R$299,00!
```

## Observações

- **Contexto de uso:** `InsertData` funciona em **CloudPages, landing pages, microsites e mensagens SMS (Mobile Connect)**. Ela **não funciona em e-mails**. Para inserir dados a partir de e-mails, use [InsertDE](../data-extension-functions/insertde.md).
- **Retorno:** A função retorna o número de linhas inseridas. Em caso de sucesso, o retorno é `1`.
- **Pares coluna/valor:** Os parâmetros após o nome da Data Extension devem sempre vir em pares (nome da coluna + valor). Se você passar um número ímpar de parâmetros após o nome da DE, ocorrerá um erro.
- **Campos obrigatórios:** Se a Data Extension possui colunas obrigatórias (not nullable e sem valor default), você precisa incluí-las na chamada da função, caso contrário a inserção falhará.
- **Chave primária:** Se a Data Extension tem uma chave primária e você tentar inserir um valor duplicado, a inserção falhará. Nesse caso, considere usar [UpsertData](../data-extension-functions/upsertdata.md) para inserir ou atualizar.
- **Tipos de dados:** Todos os valores são passados como strings, mas o Marketing Cloud faz a conversão automática para o tipo definido na coluna da Data Extension (número, data, booleano, etc.).
- **Sem limite explícito de colunas:** Você pode passar quantos pares de coluna/valor forem necessários para preencher a linha, basta adicioná-los ao final da chamada da função.

## Funções relacionadas

- [InsertDE](../data-extension-functions/insertde.md) — Insere linhas em uma Data Extension a partir de **e-mails** (equivalente ao InsertData para contexto de envio).
- [UpdateData](../data-extension-functions/updatedata.md) — Atualiza linhas existentes em uma Data Extension (contexto de páginas/SMS).
- [UpsertData](../data-extension-functions/upsertdata.md) — Insere ou atualiza linhas em uma Data Extension (contexto de páginas/SMS).
- [DeleteData](../data-extension-functions/deletedata.md) — Exclui linhas de uma Data Extension (contexto de páginas/SMS).
- [Lookup](../data-extension-functions/lookup.md) — Busca um valor em uma Data Extension com base em uma condição.
- [LookupRows](../data-extension-functions/lookuprows.md) — Retorna múltiplas linhas de uma Data Extension com base em uma condição.
- [RowCount](../data-extension-functions/rowcount.md) — Retorna o número de linhas em um conjunto de resultados.
- [RequestParameter](../sites-functions/requestparameter.md) — Captura parâmetros de formulários e query strings em CloudPages.
- [Now](../date-functions/now.md) — Retorna a data e hora atuais do sistema.