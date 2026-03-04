---
title: IsEmailAddress
sidebar_label: IsEmailAddress
description: Verifica se um endereço de e-mail possui formato estruturalmente válido, retornando true ou false.
---

# IsEmailAddress

## Descrição

Verifica se um endereço de e-mail está bem formado do ponto de vista estrutural. **Não valida se o e-mail ou domínio realmente existem** — apenas checa se a formatação é válida (presença do `@`, parte local, domínio etc.). Retorna `true` se o formato for válido e `false` caso contrário. É uma função essencial para higienizar dados de contato antes de disparos ou no momento de captura em CloudPages.

## Sintaxe

```ampscript
IsEmailAddress(emailAddress)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| emailAddress | String | Sim | O endereço de e-mail a ser validado estruturalmente. |

## Exemplo básico

Verificando se o e-mail de um cliente da Lojas Vitória possui formato válido antes de exibir uma mensagem personalizada.

```ampscript
%%[

SET @email = "joao.silva@lojasvitoria.com.br"
SET @valido = IsEmailAddress(@email)

IF @valido == "true" THEN
  SET @mensagem = Concat("O e-mail ", @email, " é válido!")
ELSE
  SET @mensagem = Concat("O e-mail ", @email, " não é válido.")
ENDIF

]%%

%%=v(@mensagem)=%%
```

**Saída:**
```
O e-mail joao.silva@lojasvitoria.com.br é válido!
```

## Exemplo avançado

Em uma CloudPage de atualização cadastral da FarmaRede, você valida o e-mail informado pelo cliente antes de gravar na Data Extension. Se o formato for inválido, exibe um alerta; se for válido, salva o dado com o e-mail em minúsculas (padronizado).

```ampscript
%%[

SET @emailInformado = RequestParameter("email")
SET @nome = RequestParameter("nome")
SET @cpf = RequestParameter("cpf")

/* Remove espaços acidentais nas pontas */
SET @emailInformado = Trim(@emailInformado)

IF Empty(@emailInformado) THEN
  SET @resultado = "Por favor, informe seu e-mail."
ELSEIF IsEmailAddress(@emailInformado) == "false" THEN
  SET @resultado = Concat("O e-mail '", @emailInformado, "' não possui um formato válido. Verifique e tente novamente.")
ELSE
  /* Padroniza para minúsculas antes de salvar */
  SET @emailPadronizado = Lowercase(@emailInformado)

  UpsertDE(
    "CadastroClientes_FarmaRede", 1,
    "CPF", @cpf,
    "NomeCompleto", @nome,
    "EmailAddress", @emailPadronizado,
    "DataAtualizacao", FormatDate(Now(), "dd/MM/yyyy HH:mm")
  )

  SET @resultado = Concat("Obrigado, ", @nome, "! Seu e-mail ", @emailPadronizado, " foi atualizado com sucesso.")
ENDIF

]%%

%%=v(@resultado)=%%
```

**Saída (e-mail válido):**
```
Obrigado, Maria Santos! Seu e-mail maria.santos@gmail.com foi atualizado com sucesso.
```

**Saída (e-mail inválido):**
```
O e-mail 'maria.santosgmail.com' não possui um formato válido. Verifique e tente novamente.
```

## Observações

- A função valida **apenas a estrutura** do e-mail. Um endereço como `carlos@exemplo` retorna `true`, pois tecnicamente é possível (embora raro) ter um domínio sem TLD como `.com` ou `.com.br`.

> **⚠️ Atenção:** `IsEmailAddress` **não garante que o e-mail existe**. Endereços como `aaa@bbb.ccc` passam na validação. Para reduzir bounces, combine essa checagem com boas práticas de confirmação (double opt-in) e higienização periódica da base.

- Exemplos de formatos que retornam `false`:
  - Falta do `@` → `joao.silvaempresa.com.br`
  - Dois `@` → `joao@silva@empresa.com.br`
  - Sem parte local (antes do `@`) → `@empresa.com.br`
  - Sem domínio de segundo nível → `joao.silva@.com.br`

> **💡 Dica:** Combine com [Trim](../string-functions/trim.md) antes da validação para eliminar espaços acidentais que o cliente pode digitar, e com [Lowercase](../string-functions/lowercase.md) para padronizar o e-mail antes de gravar na Data Extension.

## Funções relacionadas

- [Empty](../utility-functions/empty.md) — verifica se um valor está vazio (útil para checar antes de validar o formato)
- [IsNull](../utility-functions/isnull.md) — verifica se o valor é nulo
- [IsPhoneNumber](../utility-functions/isphonenumber.md) — validação estrutural equivalente para números de telefone
- [Trim](../string-functions/trim.md) — remove espaços nas extremidades da string
- [Lowercase](../string-functions/lowercase.md) — converte para minúsculas, ideal para padronizar e-mails
- [Domain](../string-functions/domain.md) — extrai o domínio de um endereço de e-mail
- [RaiseError](../utility-functions/raiseerror.md) — interrompe o envio em caso de dados inválidos