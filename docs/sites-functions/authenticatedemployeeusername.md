---
title: AuthenticatedEmployeeUserName
sidebar_label: AuthenticatedEmployeeUserName
description: Retorna o nome de usuário (username) do usuário do Marketing Cloud que está acessando a página via Microsite com Sender Authenticated Redirection.
---

# AuthenticatedEmployeeUserName

## Descrição

Retorna o username do usuário autenticado do Marketing Cloud Engagement que está acessando a página. Essa função é usada exclusivamente em **Microsites** com **Sender Authenticated Redirection** — ou seja, quando um usuário da plataforma acessa uma página autenticada e você precisa identificar quem é esse usuário. Útil para cenários onde times de marketing ou vendas acessam páginas personalizadas e você quer registrar ou exibir qual operador está logado.

## Sintaxe

```ampscript
AuthenticatedEmployeeUserName()
```

## Parâmetros

Esta função não aceita nenhum parâmetro.

## Exemplo básico

Exibindo o username do usuário do Marketing Cloud que está acessando um Microsite interno da Lojas Vitória:

```ampscript
%%[
VAR @usuario
SET @usuario = AuthenticatedEmployeeUserName()
]%%

Usuário logado: %%=v(@usuario)=%%
```

**Saída:**
```
Usuário logado: joao.silva@lojasvitoria.com.br
```

## Exemplo avançado

Em um Microsite de atendimento da Conecta Telecom, registrando qual operador acessou a página e gravando essa informação em uma Data Extension de log de acessos:

```ampscript
%%[
VAR @usuario, @dataAcesso

SET @usuario = AuthenticatedEmployeeUserName()
SET @dataAcesso = FormatDate(Now(), "dd/MM/yyyy HH:mm")

/* Registra o acesso do operador na DE de auditoria */
InsertDE(
  "Log_Acessos_Microsite",
  "Username", @usuario,
  "DataAcesso", @dataAcesso,
  "Pagina", "Painel de Atendimento"
)
]%%

<h1>Painel de Atendimento - Conecta Telecom</h1>
<p>Bem-vindo, %%=v(@usuario)=%%</p>
<p>Acesso registrado em %%=v(@dataAcesso)=%%</p>
```

**Saída:**
```
Painel de Atendimento - Conecta Telecom
Bem-vindo, maria.santos@conectatelecom.com.br
Acesso registrado em 15/07/2025 14:32
```

## Observações

> **⚠️ Atenção:** Esta função funciona **apenas em Microsites** com **Sender Authenticated Redirection**. **Não** funciona em CloudPages. Se você está construindo páginas em CloudPages, essa função não vai retornar o resultado esperado.

- A função não aceita parâmetros — qualquer tentativa de passar argumentos resultará em erro.
- O valor retornado é o username configurado no Marketing Cloud Engagement para o usuário autenticado que está acessando a página.

## Funções relacionadas

- [AuthenticatedEmployeeId](../sites-functions/authenticatedemployeeid.md) — retorna o ID do usuário autenticado
- [AuthenticatedEmployeeNotificationAddress](../sites-functions/authenticatedemployeenotificationaddress.md) — retorna o endereço de notificação do usuário autenticado
- [AuthenticatedEnterpriseID](../sites-functions/authenticatedenterpriseid.md) — retorna o ID da enterprise (conta pai)
- [AuthenticatedMemberID](../sites-functions/authenticatedmemberid.md) — retorna o MID da business unit
- [AuthenticatedMemberName](../sites-functions/authenticatedmembername.md) — retorna o nome da business unit
- [MicrositeURL](../sites-functions/micrositeurl.md) — gera URLs para Microsites