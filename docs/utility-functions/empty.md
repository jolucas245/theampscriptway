---
title: Empty
sidebar_label: Empty
description: Verifica se uma variável está vazia ou nula, retornando true ou false.
---

# Empty

## Descrição

A função `Empty()` testa se uma variável possui valor. Se a variável contém algum valor, retorna **false**. Se a variável é uma string vazia ou null (não foi definida), retorna **true**. É uma das funções mais usadas no dia a dia de SFMC - essencial para validar dados de subscribers antes de personalizar e-mails, evitando que campos em branco quebrem o layout ou gerem mensagens constrangedoras como "Olá, !".

## Sintaxe

```ampscript
Empty(@variavel)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| variable | String | Sim | A variável que você quer testar para verificar se está vazia ou nula. |

## Exemplo básico

Verificando se o nome do cliente existe antes de montar a saudação em um e-mail da Lojas Vitória:

```ampscript
%%[
VAR @nome, @cidade, @cupom

SET @nome = "Maria Santos"
SET @cidade = ""

IF NOT Empty(@nome) THEN
  SET @saudacao = Concat("Olá, ", @nome, "!")
ELSE
  SET @saudacao = "Olá!"
ENDIF

IF Empty(@cidade) THEN
  SET @msgCidade = "Atualize seu cadastro para ofertas da sua região."
ELSE
  SET @msgCidade = Concat("Confira as ofertas em ", @cidade, "!")
ENDIF

IF Empty(@cupom) THEN
  SET @msgCupom = "Nenhum cupom disponível no momento."
ELSE
  SET @msgCupom = Concat("Use o cupom: ", @cupom)
ENDIF
]%%

%%=v(@saudacao)=%%
%%=v(@msgCidade)=%%
%%=v(@msgCupom)=%%
```

**Saída:**
```
Olá, Maria Santos!
Atualize seu cadastro para ofertas da sua região.
Nenhum cupom disponível no momento.
```

## Exemplo avançado

Cenário real de régua de relacionamento: um e-mail transacional do Banco Brasilão que valida múltiplos campos do cliente antes de montar o conteúdo, usando `Empty()` combinado com [IIF](../utility-functions/iif.md) para tratamentos inline:

```ampscript
%%[
VAR @nome, @cpf, @email, @telefone, @limiteCredito

SET @nome = AttributeValue("PrimeiroNome")
SET @cpf = AttributeValue("CPF")
SET @email = AttributeValue("EmailAddress")
SET @telefone = AttributeValue("Telefone")
SET @limiteCredito = AttributeValue("LimiteCredito")

/* Validação crítica: sem e-mail válido, não faz sentido continuar */
IF Empty(@email) THEN
  RaiseError("E-mail do subscriber está vazio. Envio cancelado.", true)
ENDIF

SET @saudacao = IIF(NOT Empty(@nome), Concat("Olá, ", @nome, "!"), "Olá, cliente!")

SET @infoCpf = IIF(NOT Empty(@cpf), Concat("CPF cadastrado: ", @cpf), "CPF não informado - atualize seu cadastro.")

SET @infoTelefone = IIF(NOT Empty(@telefone), Concat("Telefone: ", @telefone), "Cadastre seu telefone para receber alertas por SMS.")

SET @infoLimite = IIF(NOT Empty(@limiteCredito), Concat("Seu limite disponível: R$ ", FormatNumber(@limiteCredito, "N", 2)), "Consulte seu limite pelo app do Banco Brasilão.")
]%%

%%=v(@saudacao)=%%

Resumo da sua conta:
%%=v(@infoCpf)=%%
%%=v(@infoTelefone)=%%
%%=v(@infoLimite)=%%
```

**Saída (quando o subscriber tem nome "Carlos Mendes", CPF preenchido, telefone vazio e limite de 5500.50):**
```
Olá, Carlos Mendes!

Resumo da sua conta:
CPF cadastrado: 123.456.789-00
Cadastre seu telefone para receber alertas por SMS.
Seu limite disponível: R$ 5.500,50
```

## Observações

- A função `Empty()` retorna **true** em dois cenários: quando a variável contém uma string vazia (`""`) e quando a variável é null (nunca recebeu um valor via `SET`).

- Combiná-la com `IF` ou [IIF](../utility-functions/iif.md) é o padrão mais comum no dia a dia - praticamente todo e-mail personalizado no SFMC brasileiro usa essa abordagem para tratar campos opcionais do cadastro.

> **💡 Dica:** Use `Empty()` junto com [AttributeValue](../utility-functions/attributevalue.md) para validar campos vindos de Data Extensions ou atributos de perfil. O `AttributeValue` já retorna string vazia quando o campo não existe, o que combina perfeitamente com `Empty()`.

> **⚠️ Atenção:** Uma variável que contém um espaço em branco (`" "`) **não** é considerada vazia por `Empty()` - ela tem um valor (o espaço). Se seus dados podem vir com espaços indesejados, combine com [Trim](../string-functions/trim.md) antes de testar: `Empty(Trim(@variavel))`.

## Funções relacionadas

- [IIF](../utility-functions/iif.md) - ternário inline, ideal para combinar com `Empty()` em tratamentos de uma linha
- [IsNull](../utility-functions/isnull.md) - testa especificamente se o valor é null
- [IsNullDefault](../utility-functions/isnulldefault.md) - retorna um valor padrão quando a variável é null
- [AttributeValue](../utility-functions/attributevalue.md) - recupera atributos de subscriber retornando string vazia quando não existem
- [Trim](../string-functions/trim.md) - remove espaços em branco antes de testar com `Empty()`
- [RaiseError](../utility-functions/raiseerror.md) - cancela o envio quando um campo obrigatório está vazio