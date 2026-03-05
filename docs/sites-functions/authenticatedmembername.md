---
title: AuthenticatedMemberName
sidebar_label: AuthenticatedMemberName
description: Retorna o nome do membro (Member Name) do usuário autenticado em uma landing page de Microsite.
---

# AuthenticatedMemberName

## Descrição

Retorna o nome do membro (Member Name) do usuário autenticado em uma landing page. Essa função é usada exclusivamente em **Microsites** com **Sender Authenticated Redirection** - ou seja, quando o usuário que acessa a página está autenticado no contexto da conta SFMC. **Não funciona com CloudPages.**

## Sintaxe

```ampscript
AuthenticatedMemberName()
```

## Parâmetros

Esta função não aceita nenhum parâmetro.

## Exemplo básico

Exibindo o nome do membro autenticado em uma landing page de Microsite da Lojas Vitória:

```ampscript
%%[
VAR @nomeMembro
SET @nomeMembro = AuthenticatedMemberName()
]%%

Membro autenticado: %%=v(@nomeMembro)=%%
```

**Saída:**
```
Membro autenticado: Lojas Vitória
```

## Exemplo avançado

Exibindo uma mensagem de boas-vindas personalizada no Microsite, combinando o nome do membro com uma verificação para evitar exibição em branco:

```ampscript
%%[
VAR @nomeMembro, @mensagem

SET @nomeMembro = AuthenticatedMemberName()

IF NOT Empty(@nomeMembro) THEN
  SET @mensagem = Concat("Bem-vindo ao painel da conta: ", @nomeMembro)
ELSE
  SET @mensagem = "Não foi possível identificar o membro autenticado."
ENDIF
]%%

%%=v(@mensagem)=%%
```

**Saída:**
```
Bem-vindo ao painel da conta: Lojas Vitória
```

## Observações

> **⚠️ Atenção:** Esta função funciona **apenas em Microsites** com Sender Authenticated Redirection. **Não use em CloudPages** - ela não retornará o valor esperado nesse contexto.

- A função não aceita parâmetros. Qualquer tentativa de passar argumentos resultará em erro.
- O "Member Name" retornado corresponde ao nome da business unit (conta/membro) do usuário autenticado, não ao nome de um subscriber ou contato.
- Se você precisa de outros dados do contexto autenticado, considere usar as funções relacionadas abaixo, como [AuthenticatedMemberID](../sites-functions/authenticatedmemberid.md) ou [AuthenticatedEnterpriseID](../sites-functions/authenticatedenterpriseid.md).

## Funções relacionadas

- [AuthenticatedMemberID](../sites-functions/authenticatedmemberid.md)
- [AuthenticatedEnterpriseID](../sites-functions/authenticatedenterpriseid.md)
- [AuthenticatedEmployeeId](../sites-functions/authenticatedemployeeid.md)
- [AuthenticatedEmployeeUserName](../sites-functions/authenticatedemployeeusername.md)
- [AuthenticatedEmployeeNotificationAddress](../sites-functions/authenticatedemployeenotificationaddress.md)
- [MicrositeURL](../sites-functions/micrositeurl.md)
- [Empty](../utility-functions/empty.md)
- [Concat](../string-functions/concat.md)
- [V](../utility-functions/v.md)