---
title: AuthenticatedEnterpriseID
sidebar_label: AuthenticatedEnterpriseID
description: Retorna o Enterprise ID (MID da conta principal) do usuário autenticado que está acessando uma landing page em um Microsite.
---

# AuthenticatedEnterpriseID

## Descrição

A função `AuthenticatedEnterpriseID()` retorna o **Enterprise ID** (o MID da conta principal/pai) do usuário que está autenticado em uma landing page de um Microsite. Esse ID identifica a conta Enterprise no Salesforce Marketing Cloud. Essa função é usada exclusivamente com **Microsites** quando você está usando **Sender Authenticated Redirection** — ela **não funciona com CloudPages**. É útil quando você precisa identificar qual conta Enterprise está por trás da sessão autenticada, por exemplo, para registrar logs, controlar acessos ou direcionar conteúdo de acordo com a conta.

## Sintaxe

```ampscript
AuthenticatedEnterpriseID()
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| — | — | — | Essa função não aceita nenhum parâmetro. |

## Exemplo básico

```ampscript
%%[
VAR @enterpriseID
SET @enterpriseID = AuthenticatedEnterpriseID()
]%%

O Enterprise ID da conta autenticada é: %%=v(@enterpriseID)=%%
```

**Saída:**
```
O Enterprise ID da conta autenticada é: 123456789
```

## Exemplo avançado

Imagine que a **Conecta Telecom** tem uma estrutura multi-BU no Marketing Cloud e usa Microsites para páginas internas de gestão de campanhas. Nesse cenário, você quer registrar em uma Data Extension qual usuário autenticado acessou a página, de qual conta Enterprise, e quando isso aconteceu — tudo para fins de auditoria.

```ampscript
%%[
VAR @enterpriseID, @memberID, @nomeUsuario, @dataAcesso

SET @enterpriseID = AuthenticatedEnterpriseID()
SET @memberID = AuthenticatedMemberID()
SET @nomeUsuario = AuthenticatedEmployeeUserName()
SET @dataAcesso = FormatDate(Now(), "dd/MM/yyyy HH:mm:ss")

/* Registra o acesso na DE de auditoria */
InsertDE(
  "Log_Acessos_Microsite",
  "EnterpriseID", @enterpriseID,
  "MemberID", @memberID,
  "NomeUsuario", @nomeUsuario,
  "DataAcesso", @dataAcesso,
  "Pagina", "painel-campanhas"
)
]%%

<h1>Painel de Campanhas — Conecta Telecom</h1>
<p>Bem-vindo(a), %%=v(@nomeUsuario)=%%!</p>
<p>Enterprise ID: %%=v(@enterpriseID)=%% | BU (Member ID): %%=v(@memberID)=%%</p>
<p>Acesso registrado em: %%=v(@dataAcesso)=%%</p>
```

**Saída:**
```
Painel de Campanhas — Conecta Telecom
Bem-vindo(a), carlos.oliveira@conectatelecom.com.br!
Enterprise ID: 123456789 | BU (Member ID): 987654321
Acesso registrado em: 15/06/2025 14:32:07
```

## Observações

- ⚠️ **Funciona exclusivamente com Microsites** — essa função **não é compatível com CloudPages**. Se você tentar usá-la em uma CloudPage, ela não vai retornar o valor esperado.
- Requer que o **Sender Authenticated Redirection (SAR)** esteja configurado no Microsite para que a autenticação funcione corretamente.
- A função **não aceita nenhum parâmetro**. Qualquer argumento passado será ignorado ou poderá causar erro.
- O Enterprise ID é o MID da **conta pai** (top-level), diferente do Member ID que pode ser de uma Business Unit filha. Se a sua conta não é multi-BU, Enterprise ID e Member ID podem ser iguais.
- Essa função é considerada de **uso muito específico e restrito**. A maioria dos projetos modernos no Marketing Cloud usa CloudPages ao invés de Microsites, então avalie se esse é realmente o contexto certo para o seu caso.
- Se nenhum usuário estiver autenticado, o retorno pode ser vazio ou gerar erro — sempre valide o resultado antes de utilizá-lo em lógica condicional.

## Funções relacionadas

- [AuthenticatedMemberID](../sites-functions/authenticatedmemberid.md) — retorna o Member ID (MID da Business Unit) do usuário autenticado no Microsite
- [AuthenticatedMemberName](../sites-functions/authenticatedmembername.md) — retorna o nome da conta/BU do usuário autenticado no Microsite
- [AuthenticatedEmployeeId](../sites-functions/authenticatedemployeeid.md) — retorna o ID do funcionário autenticado no Microsite
- [AuthenticatedEmployeeUserName](../sites-functions/authenticatedemployeeusername.md) — retorna o nome de usuário do funcionário autenticado no Microsite
- [AuthenticatedEmployeeNotificationAddress](../sites-functions/authenticatedemployeenotificationaddress.md) — retorna o endereço de notificação do funcionário autenticado
- [MicrositeURL](../sites-functions/micrositeurl.md) — gera URLs para páginas de Microsites
- [CloudPagesURL](../sites-functions/cloudpagesurl.md) — gera URLs para CloudPages (alternativa moderna aos Microsites)
- [RequestParameter](../sites-functions/requestparameter.md) — captura parâmetros de query string ou POST em landing pages
- [InsertDE](../data-extension-functions/insertde.md) — insere registros em uma Data Extension