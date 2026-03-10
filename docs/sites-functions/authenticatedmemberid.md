---
title: AuthenticatedMemberID
sidebar_label: AuthenticatedMemberID
description: Retorna o Member ID do usuário autenticado em uma landing page de Microsite com Sender Authenticated Redirection.
---

# AuthenticatedMemberID

## Descrição

Retorna o Member ID (MID) do usuário autenticado em uma landing page. Essa função é usada exclusivamente em **Microsites** que utilizam **Sender Authenticated Redirection** - ou seja, cenários onde a landing page precisa identificar de qual Business Unit (MID) veio a requisição autenticada. Não funciona com CloudPages.

## Sintaxe

```ampscript
AuthenticatedMemberID()
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| - | - | - | Esta função não aceita nenhum parâmetro. |

## Exemplo básico

Exibindo o Member ID do usuário autenticado em uma landing page de Microsite da Lojas Vitória:

```ampscript
%%[
VAR @memberID
SET @memberID = AuthenticatedMemberID()
]%%

<p>Member ID autenticado: %%=v(@memberID)=%%</p>
```

**Saída:**
```
Member ID autenticado: 123456789
```

## Exemplo avançado

Em um Microsite do Grupo Horizonte, que opera com múltiplas Business Units, você pode registrar qual MID acessou a landing page e combinar com outras informações do usuário autenticado para fins de log:

```ampscript
%%[
VAR @memberID, @memberName, @enterpriseID, @logInfo

SET @memberID = AuthenticatedMemberID()
SET @memberName = AuthenticatedMemberName()
SET @enterpriseID = AuthenticatedEnterpriseID()

SET @logInfo = Concat("Enterprise: ", @enterpriseID, " | MID: ", @memberID, " | Nome: ", @memberName)

InsertDE(
  "Log_Acessos_Microsite",
  "DataAcesso", Now(),
  "EnterpriseID", @enterpriseID,
  "MemberID", @memberID,
  "MemberName", @memberName
)
]%%

<p>Acesso registrado com sucesso.</p>
<p>%%=v(@logInfo)=%%</p>
```

**Saída:**
```
Acesso registrado com sucesso.
Enterprise: 100001234 | MID: 123456789 | Nome: Grupo Horizonte - Marketing
```

## Observações

> **⚠️ Atenção:** Esta função é exclusiva para **Microsites** com **Sender Authenticated Redirection**. **Não funciona com CloudPages.** Se você está trabalhando com CloudPages (que é o cenário mais comum hoje em dia no SFMC), essa função não vai retornar o resultado esperado.

- A função não recebe nenhum parâmetro - basta chamá-la diretamente.
- O Member ID retornado corresponde à Business Unit (MID) do usuário autenticado que está acessando a landing page, o que é útil em contas com estrutura Enterprise (múltiplas BUs) para identificar a origem do acesso.

## Funções relacionadas

- [AuthenticatedMemberName](../sites-functions/authenticatedmembername.md) - retorna o nome do membro autenticado
- [AuthenticatedEnterpriseID](../sites-functions/authenticatedenterpriseid.md) - retorna o Enterprise ID do usuário autenticado
- [AuthenticatedEmployeeId](../sites-functions/authenticatedemployeeid.md) - retorna o ID do funcionário autenticado
- [AuthenticatedEmployeeUserName](../sites-functions/authenticatedemployeeusername.md) - retorna o nome de usuário do funcionário autenticado
- [AuthenticatedEmployeeNotificationAddress](../sites-functions/authenticatedemployeenotificationaddress.md) - retorna o endereço de notificação do funcionário autenticado
- [MicrositeURL](../sites-functions/micrositeurl.md) - gera URLs para Microsites