---
title: IsEmailAddress
sidebar_label: IsEmailAddress
description: Verifica se um endereço de e-mail tem uma estrutura válida, retornando true ou false.
---

# IsEmailAddress

## Descrição

A função `IsEmailAddress` verifica se um endereço de e-mail está bem formado estruturalmente. Ela retorna `true` se o formato for válido e `false` caso contrário. É importante saber que essa função **não verifica se o e-mail ou domínio realmente existem** — ela apenas analisa se a estrutura do endereço está correta (por exemplo, se tem um `@`, se tem a parte local antes do `@`, etc.). Super útil para validar dados de formulários em CloudPages, fazer limpeza de Data Extensions ou evitar envios para endereços claramente inválidos.

## Sintaxe

```ampscript
IsEmailAddress(emailAddress)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| emailAddress | String | Sim | O endereço de e-mail que você quer validar estruturalmente. |

## Retorno

Retorna `true` se o endereço de e-mail for estruturalmente válido, ou `false` se não for.

## Tabela de resultados

Aqui vai uma referência rápida pra você entender como a função se comporta em diferentes cenários:

| Chamada | Resultado | Observação |
|---|---|---|
| `IsEmailAddress("joao.silva@lojasvitoria.com.br")` | `true` | Formato válido e completo. |
| `IsEmailAddress("maria.santos@megastore")` | `true` | Tecnicamente possível, embora raro, ter um domínio sem TLD (como `.com`). |
| `IsEmailAddress("carlos.oliveirafarmarede.com.br")` | `false` | Falta o arroba (`@`), então é inválido. |
| `IsEmailAddress("ana@souza@conectatelecom.com.br")` | `false` | Tem dois arrobas, o que torna inválido. |
| `IsEmailAddress("@bancomeridional.com.br")` | `false` | Falta a parte local (antes do `@`). |
| `IsEmailAddress("pedro.lima@.com.br")` | `false` | Falta o domínio de segundo nível (tem só o TLD). |

## Exemplo básico

Imagine que você quer verificar se o e-mail de um assinante é válido antes de exibir uma mensagem personalizada:

```ampscript
%%[
VAR @email, @valido
SET @email = "joao.silva@lojasvitoria.com.br"
SET @valido = IsEmailAddress(@email)

IF @valido == "true" THEN
]%%

Olá! Seu e-mail %%=v(@email)=%% está cadastrado corretamente. 🎉

%%[ ELSE ]%%

Ops! O e-mail informado não parece ser válido. Por favor, atualize seu cadastro.

%%[ ENDIF ]%%
```

**Saída:**
```
Olá! Seu e-mail joao.silva@lojasvitoria.com.br está cadastrado corretamente. 🎉
```

## Exemplo avançado

Cenário real: você tem uma CloudPage com formulário de cadastro para a campanha de **Dia das Mães** da MegaStore. Antes de salvar os dados na Data Extension, você precisa validar o e-mail e limpar espaços em branco:

```ampscript
%%[
VAR @emailRaw, @email, @nome, @valido, @mensagem

/* Captura os dados do formulário */
SET @emailRaw = RequestParameter("email")
SET @nome = RequestParameter("nome")

/* Remove espaços extras antes e depois do e-mail */
SET @email = Trim(@emailRaw)

/* Converte pra minúsculo pra padronizar */
SET @email = Lowercase(@email)

/* Valida a estrutura do e-mail */
SET @valido = IsEmailAddress(@email)

IF @valido == "true" AND NOT Empty(@nome) THEN

  /* Salva na Data Extension de cadastro da campanha */
  UpsertDE(
    "CadastroDiaDasMaes",
    1,
    "Email", @email,
    "Nome", ProperCase(@nome),
    "Email", @email,
    "DataCadastro", FormatDate(Now(), "dd/MM/yyyy"),
    "Origem", "CloudPage"
  )

  SET @mensagem = Concat("Obrigado, ", ProperCase(@nome), "! Você foi cadastrado(a) na promoção Dia das Mães da MegaStore. Fique de olho no e-mail ", @email, " para receber cupons de até R$ 150,00 e frete grátis acima de R$ 299,00!")

ELSEIF Empty(@nome) THEN

  SET @mensagem = "Por favor, preencha seu nome para continuar."

ELSE

  SET @mensagem = Concat("O e-mail '", @email, "' não parece ser válido. Verifique se digitou corretamente (exemplo: seunome@email.com.br).")

ENDIF
]%%

%%=v(@mensagem)=%%
```

**Saída (caso de sucesso):**
```
Obrigado, Maria Santos! Você foi cadastrado(a) na promoção Dia das Mães da MegaStore. Fique de olho no e-mail maria.santos@email.com.br para receber cupons de até R$ 150,00 e frete grátis acima de R$ 299,00!
```

**Saída (caso de e-mail inválido):**
```
O e-mail 'mariasantos.email.com.br' não parece ser válido. Verifique se digitou corretamente (exemplo: seunome@email.com.br).
```

## Observações

- A função **não valida se o e-mail ou domínio realmente existem**. Ela apenas checa se a estrutura está correta. Um e-mail como `zzz@dominioquenaoexiste.com.br` vai retornar `true`.
- Um endereço sem TLD (como `joao@megastore`, sem o `.com.br`) é considerado **válido** pela função, pois é tecnicamente possível, embora raro na prática.
- Endereços com dois `@`, sem a parte local (antes do `@`), ou sem domínio de segundo nível são considerados **inválidos**.
- É uma boa prática combinar `IsEmailAddress` com [Trim](../string-functions/trim.md) e [Lowercase](../string-functions/lowercase.md) para limpar e padronizar o e-mail antes da validação.
- Funciona em todos os contextos do SFMC: e-mails, CloudPages, SMS Landing Pages, Script Activities, etc.
- Para uma validação mais robusta (como verificar domínios específicos ou padrões avançados), considere usar [RegExMatch](../string-functions/regexmatch.md) com uma expressão regular customizada.
- Se o valor passado for nulo ou vazio, a função retorna `false`.

## Funções relacionadas

- [IsPhoneNumber](../utility-functions/isphonenumber.md) — Verifica se um número de telefone tem estrutura válida.
- [Empty](../utility-functions/empty.md) — Verifica se um valor é vazio ou nulo, útil para validações complementares.
- [IsNull](../utility-functions/isnull.md) — Verifica se um valor é nulo.
- [Trim](../string-functions/trim.md) — Remove espaços em branco no início e fim de uma string. Ótimo pra limpar e-mails antes de validar.
- [Lowercase](../string-functions/lowercase.md) — Converte uma string para minúsculas, ideal para padronizar e-mails.
- [RegExMatch](../string-functions/regexmatch.md) — Permite validações mais avançadas usando expressões regulares.
- [RaiseError](../utility-functions/raiseerror.md) — Levanta um erro e interrompe o processamento, útil para bloquear envios quando o e-mail é inválido.
- [RequestParameter](../sites-functions/requestparameter.md) — Captura parâmetros de formulários em CloudPages, onde a validação de e-mail é muito comum.