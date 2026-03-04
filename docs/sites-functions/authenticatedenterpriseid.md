---
title: AuthenticatedEnterpriseID
sidebar_label: AuthenticatedEnterpriseID
description: Retorna o Enterprise ID do usuário autenticado em uma landing page de Microsite com Sender Authenticated Redirection.
---

# AuthenticatedEnterpriseID

## Descrição

Retorna o Enterprise ID (identificador da conta enterprise) do usuário autenticado que está acessando uma landing page. Essa função é usada exclusivamente em **Microsites** configurados com **Sender Authenticated Redirection** — ou seja, cenários onde o usuário do Marketing Cloud acessa a página de forma autenticada. **Não funciona com CloudPages.**

## Sintaxe

```ampscript
AuthenticatedEnterpriseID()
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| — | — | — | Essa função não aceita nenhum parâmetro. |

## Exemplo básico

Exibindo o Enterprise ID do usuário autenticado em uma landing page de Microsite da Conecta Telecom.

```ampscript
%%[
VAR @enterpriseId
SET @enterpriseId = AuthenticatedEnterpriseID()
]%%

Enterprise ID: %%=v(@enterpriseId)=%%
```

**Saída:**
```
Enterprise ID: 123456789
```

## Exemplo avançado

Em um Microsite interno do Grupo Horizonte, exibindo informações do usuário autenticado para fins de auditoria, combinando com outras funções de autenticação.

```ampscript
%%[
VAR @enterpriseId, @memberId, @memberName, @dataAcesso

SET @enterpriseId = AuthenticatedEnterpriseID()
SET @memberId = AuthenticatedMemberID()
SET @memberName = AuthenticatedMemberName()
SET @dataAcesso = FormatDate(Now(), "dd/MM/yyyy", "HH:mm")
]%%

<h2>Painel de Auditoria - Grupo Horizonte</h2>
<table>
  <tr><td><strong>Enterprise ID:</strong></td><td>%%=v(@enterpriseId)=%%</td></tr>
  <tr><td><strong>Member ID:</strong></td><td>%%=v(@memberId)=%%</td></tr>
  <tr><td><strong>Nome do Member:</strong></td><td>%%=v(@memberName)=%%</td></tr>
  <tr><td><strong>Data de acesso:</strong></td><td>%%=v(@dataAcesso)=%%</td></tr>
</table>
```

**Saída:**
```
Painel de Auditoria - Grupo Horizonte

Enterprise ID:    123456789
Member ID:        987654
Nome do Member:   Conecta Telecom
Data de acesso:   15/07/2025 - 14:32
```

## Observações

> **⚠️ Atenção:** Essa função funciona **apenas em Microsites** com **Sender Authenticated Redirection** habilitado. **Não use em CloudPages** — ela não retornará o valor esperado nesse contexto.

- A função não aceita nenhum parâmetro. Qualquer argumento passado será ignorado ou causará erro.
- O Enterprise ID é o identificador da conta principal (parent account) na estrutura do Marketing Cloud. Em contas com múltiplas Business Units, esse valor representa a conta enterprise de nível superior.

## Funções relacionadas

- [AuthenticatedMemberID](../sites-functions/authenticatedmemberid.md) — retorna o Member ID do usuário autenticado
- [AuthenticatedMemberName](../sites-functions/authenticatedmembername.md) — retorna o nome do Member autenticado
- [AuthenticatedEmployeeId](../sites-functions/authenticatedemployeeid.md) — retorna o ID do funcionário autenticado
- [AuthenticatedEmployeeUserName](../sites-functions/authenticatedemployeeusername.md) — retorna o username do funcionário autenticado
- [AuthenticatedEmployeeNotificationAddress](../sites-functions/authenticatedemployeenotificationaddress.md) — retorna o e-mail de notificação do funcionário autenticado
- [MicrositeURL](../sites-functions/micrositeurl.md) — gera URLs para Microsites