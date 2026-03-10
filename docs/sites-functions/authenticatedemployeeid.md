---
title: AuthenticatedEmployeeId
sidebar_label: AuthenticatedEmployeeId
description: Retorna o ID do funcionário (employee ID) do usuário Marketing Cloud que está acessando a página em um Microsite com Sender Authenticated Redirection.
---

# AuthenticatedEmployeeId

## Descrição

Retorna o employee ID do usuário Marketing Cloud Engagement que está acessando a página. Essa função é usada exclusivamente em **Microsites** configurados com **Sender Authenticated Redirection** - ou seja, cenários onde você precisa identificar qual usuário da plataforma está visualizando a página. Não funciona com CloudPages.

## Sintaxe

```ampscript
AuthenticatedEmployeeId()
```

## Parâmetros

Esta função não aceita nenhum parâmetro.

## Exemplo básico

Exibindo o ID do funcionário do usuário Marketing Cloud que está acessando um Microsite da Lojas Vitória.

```ampscript
%%[
VAR @employeeId
SET @employeeId = AuthenticatedEmployeeId()
]%%

O ID do funcionário autenticado é: %%=v(@employeeId)=%%
```

**Saída:**
```
O ID do funcionário autenticado é: 12345
```

## Exemplo avançado

Em um Microsite interno do Grupo Horizonte, registrando em uma Data Extension qual usuário Marketing Cloud acessou a página - útil para auditoria e rastreabilidade de ações.

```ampscript
%%[
VAR @employeeId, @employeeName, @dataAcesso

SET @employeeId = AuthenticatedEmployeeId()
SET @employeeName = AuthenticatedEmployeeUserName()
SET @dataAcesso = FormatDate(Now(), "dd/MM/yyyy HH:mm")

InsertDE(
  "Log_Acesso_Microsite",
  "EmployeeId", @employeeId,
  "NomeUsuario", @employeeName,
  "DataAcesso", @dataAcesso,
  "Pagina", "Painel de Campanhas"
)
]%%

<p>Bem-vindo ao painel de campanhas, usuário #%%=v(@employeeId)=%%!</p>
<p>Acesso registrado em %%=v(@dataAcesso)=%%.</p>
```

**Saída:**
```
Bem-vindo ao painel de campanhas, usuário #12345!
Acesso registrado em 15/07/2025 09:32.
```

## Observações

> **⚠️ Atenção:** Esta função funciona **somente em Microsites** com **Sender Authenticated Redirection** habilitado. **Não** é compatível com CloudPages. Se você tentar usá-la em uma CloudPage, não vai obter o resultado esperado.

- A função não aceita nenhum parâmetro - qualquer tentativa de passar argumentos resultará em erro.
- O valor retornado é o employee ID do usuário Marketing Cloud que está acessando a página naquele momento, o que a torna útil para cenários de auditoria e personalização baseada no operador da plataforma.

## Funções relacionadas

- [AuthenticatedEmployeeUserName](../sites-functions/authenticatedemployeeusername.md) - retorna o nome de usuário do funcionário autenticado
- [AuthenticatedEmployeeNotificationAddress](../sites-functions/authenticatedemployeenotificationaddress.md) - retorna o endereço de notificação do funcionário autenticado
- [AuthenticatedEnterpriseID](../sites-functions/authenticatedenterpriseid.md) - retorna o Enterprise ID da conta autenticada
- [AuthenticatedMemberID](../sites-functions/authenticatedmemberid.md) - retorna o Member ID da conta autenticada
- [AuthenticatedMemberName](../sites-functions/authenticatedmembername.md) - retorna o nome do membro autenticado
- [MicrositeURL](../sites-functions/micrositeurl.md) - gera URLs para Microsites