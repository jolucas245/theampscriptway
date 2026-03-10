---
title: AuthenticatedEmployeeNotificationAddress
sidebar_label: AuthenticatedEmployeeNotificationAddress
description: Retorna o endereço de e-mail do usuário do Marketing Cloud que está acessando um Microsite.
---

# AuthenticatedEmployeeNotificationAddress

## Descrição

Retorna o endereço de e-mail (notification address) do usuário do Marketing Cloud Engagement que está acessando a página. Essa função é usada exclusivamente em **Microsites** com **Sender Authenticated Redirection** habilitado - não funciona em CloudPages. É útil quando você precisa identificar qual usuário da plataforma está interagindo com o Microsite, por exemplo, para registrar logs de acesso ou personalizar a experiência com base no e-mail do operador.

## Sintaxe

```ampscript
AuthenticatedEmployeeNotificationAddress()
```

## Parâmetros

Esta função não aceita parâmetros.

## Exemplo básico

Exibindo o endereço de e-mail do usuário do Marketing Cloud que está acessando o Microsite da Lojas Vitória.

```ampscript
%%[
  VAR @emailUsuario
  SET @emailUsuario = AuthenticatedEmployeeNotificationAddress()
]%%

<p>Usuário autenticado: %%=v(@emailUsuario)=%%</p>
```

**Saída:**
```
Usuário autenticado: joao.silva@lojasvitoria.com.br
```

## Exemplo avançado

Registrando em uma Data Extension o acesso do usuário ao Microsite de gestão de campanhas do Grupo Horizonte, incluindo data/hora e o e-mail do operador.

```ampscript
%%[
  VAR @emailUsuario, @nomeUsuario, @idUsuario, @dataAcesso

  SET @emailUsuario = AuthenticatedEmployeeNotificationAddress()
  SET @nomeUsuario = AuthenticatedEmployeeUserName()
  SET @idUsuario = AuthenticatedEmployeeId()
  SET @dataAcesso = FormatDate(Now(), "dd/MM/yyyy", "HH:mm:ss")

  InsertDE(
    "Log_Acesso_Microsite",
    "EmployeeId", @idUsuario,
    "NomeUsuario", @nomeUsuario,
    "EmailUsuario", @emailUsuario,
    "DataAcesso", @dataAcesso
  )
]%%

<h2>Bem-vindo ao painel do Grupo Horizonte</h2>
<p>Logado como: %%=v(@nomeUsuario)=%% (%%=v(@emailUsuario)=%%)</p>
<p>Acesso registrado em: %%=v(@dataAcesso)=%%</p>
```

**Saída:**
```
Bem-vindo ao painel do Grupo Horizonte
Logado como: carlos.mendes (carlos.mendes@grupohorizonte.com.br)
Acesso registrado em: 15/07/2025, 14:32:07
```

## Observações

> **⚠️ Atenção:** Esta função funciona **somente em Microsites** com **Sender Authenticated Redirection** habilitado. Não use em CloudPages - ela não retornará resultado nesse contexto.

- A função não aceita nenhum parâmetro. Qualquer tentativa de passar argumentos resultará em erro.
- O valor retornado é o endereço de e-mail (notification address) configurado no perfil do usuário do Marketing Cloud Engagement que está acessando a página.

## Funções relacionadas

- [AuthenticatedEmployeeId](../sites-functions/authenticatedemployeeid.md) - retorna o ID do usuário autenticado
- [AuthenticatedEmployeeUserName](../sites-functions/authenticatedemployeeusername.md) - retorna o nome de usuário autenticado
- [AuthenticatedEnterpriseID](../sites-functions/authenticatedenterpriseid.md) - retorna o Enterprise ID da conta
- [AuthenticatedMemberID](../sites-functions/authenticatedmemberid.md) - retorna o Member ID da business unit
- [AuthenticatedMemberName](../sites-functions/authenticatedmembername.md) - retorna o nome da business unit
- [MicrositeURL](../sites-functions/micrositeurl.md) - gera URLs para Microsites