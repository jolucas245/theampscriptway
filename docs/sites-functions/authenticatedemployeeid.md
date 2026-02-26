---
title: AuthenticatedEmployeeId
sidebar_label: AuthenticatedEmployeeId
description: Retorna o ID do funcionário (employee ID) do usuário autenticado no Marketing Cloud que está acessando a página do Microsite.
---

<!-- generated-by-script -->

# AuthenticatedEmployeeId

## Descrição

A função `AuthenticatedEmployeeId()` retorna o ID do funcionário (employee ID) do usuário do Marketing Cloud Engagement que está acessando a página no momento. Ela é usada exclusivamente em **Microsites** quando você está trabalhando com **Sender Authenticated Redirection**. Isso é útil para rastrear qual usuário da plataforma está interagindo com determinada página, permitindo registrar ações, criar logs de auditoria ou personalizar o conteúdo com base no usuário logado.

## Sintaxe

```ampscript
AuthenticatedEmployeeId()
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| — | — | — | Essa função não aceita nenhum parâmetro. |

## Exemplo básico

Esse exemplo simplesmente exibe o ID do funcionário do Marketing Cloud que está acessando a página do Microsite.

```ampscript
%%[
  VAR @employeeId
  SET @employeeId = AuthenticatedEmployeeId()
]%%

<p>ID do funcionário autenticado: %%=v(@employeeId)=%%</p>
```

**Saída:**
```
ID do funcionário autenticado: 12345
```

## Exemplo avançado

Imagine que a **Conecta Telecom** quer registrar qual representante comercial acessou uma página de acompanhamento de propostas no Microsite. O código abaixo captura o ID do funcionário, o nome de usuário e grava um log na Data Extension `Log_Acesso_Representantes`.

```ampscript
%%[
  VAR @employeeId, @employeeUser, @dataAcesso

  SET @employeeId = AuthenticatedEmployeeId()
  SET @employeeUser = AuthenticatedEmployeeUserName()
  SET @dataAcesso = Now()

  /* Registra o acesso na Data Extension de log */
  InsertDE(
    "Log_Acesso_Representantes",
    "EmployeeId", @employeeId,
    "NomeUsuario", @employeeUser,
    "DataAcesso", FormatDate(@dataAcesso, "dd/MM/yyyy HH:mm:ss"),
    "Pagina", "Acompanhamento de Propostas"
  )
]%%

<h2>Painel de Propostas — Conecta Telecom</h2>
<p>Bem-vindo! Seu acesso foi registrado.</p>
<p>Employee ID: %%=v(@employeeId)=%%</p>
<p>Usuário: %%=v(@employeeUser)=%%</p>
<p>Data/Hora: %%=FormatDate(@dataAcesso, "dd/MM/yyyy HH:mm:ss")=%%</p>

%%[
  /* Busca propostas atribuídas a esse representante */
  VAR @propostas, @totalPropostas, @i, @cliente, @valor, @status
  SET @propostas = LookupRows("Propostas_Comerciais", "EmployeeId", @employeeId)
  SET @totalPropostas = RowCount(@propostas)
]%%

%%[ IF @totalPropostas > 0 THEN ]%%
  <table>
    <tr><th>Cliente</th><th>Valor</th><th>Status</th></tr>
    %%[ FOR @i = 1 TO @totalPropostas DO ]%%
      %%[
        SET @cliente = Field(Row(@propostas, @i), "NomeCliente")
        SET @valor = Field(Row(@propostas, @i), "ValorProposta")
        SET @status = Field(Row(@propostas, @i), "Status")
      ]%%
      <tr>
        <td>%%=v(@cliente)=%%</td>
        <td>R$ %%=FormatNumber(@valor, "N2")=%%</td>
        <td>%%=v(@status)=%%</td>
      </tr>
    %%[ NEXT @i ]%%
  </table>
%%[ ELSE ]%%
  <p>Nenhuma proposta encontrada para o seu usuário.</p>
%%[ ENDIF ]%%
```

**Saída:**
```
Painel de Propostas — Conecta Telecom
Bem-vindo! Seu acesso foi registrado.
Employee ID: 12345
Usuário: carlos.oliveira
Data/Hora: 25/07/2025 14:30:00

| Cliente        | Valor         | Status    |
|----------------|---------------|-----------|
| João Silva     | R$ 1.250,00   | Aprovada  |
| Maria Santos   | R$ 3.780,50   | Pendente  |
```

## Observações

- ⚠️ Essa função funciona **exclusivamente em Microsites** com **Sender Authenticated Redirection** habilitado. **Não funciona em CloudPages**.
- A função **não aceita nenhum parâmetro**. Se você passar argumentos, vai gerar erro.
- O valor retornado é o ID numérico do funcionário dentro do Marketing Cloud Engagement — não é o mesmo que o Salesforce User ID, por exemplo.
- Essa é uma função de uso bastante **específico e raro**. A maioria dos projetos modernos no SFMC usa CloudPages, onde essa função não tem utilidade. Se você está trabalhando com CloudPages, considere outras abordagens para identificar usuários.
- Se nenhum usuário estiver autenticado no contexto do Microsite, o comportamento do retorno pode ser vazio ou gerar erro. Sempre valide o resultado com [Empty](../utility-functions/empty.md) ou [IsNull](../utility-functions/isnull.md) antes de usar o valor.
- Microsites é uma funcionalidade legada do Marketing Cloud. Se você está começando um projeto novo, vale avaliar se CloudPages não atende melhor à sua necessidade.

## Funções relacionadas

- [AuthenticatedEmployeeUserName](../sites-functions/authenticatedemployeeusername.md) — Retorna o nome de usuário do funcionário autenticado no Microsite
- [AuthenticatedEmployeeNotificationAddress](../sites-functions/authenticatedemployeenotificationaddress.md) — Retorna o endereço de notificação do funcionário autenticado
- [AuthenticatedEnterpriseID](../sites-functions/authenticatedenterpriseid.md) — Retorna o Enterprise ID da conta autenticada
- [AuthenticatedMemberID](../sites-functions/authenticatedmemberid.md) — Retorna o Member ID da conta autenticada
- [AuthenticatedMemberName](../sites-functions/authenticatedmembername.md) — Retorna o nome do membro autenticado
- [MicrositeURL](../sites-functions/micrositeurl.md) — Gera URLs para páginas de Microsites
- [CloudPagesURL](../sites-functions/cloudpagesurl.md) — Gera URLs para CloudPages (alternativa moderna aos Microsites)
- [RequestParameter](../sites-functions/requestparameter.md) — Captura parâmetros de requisição em páginas web
- [InsertDE](../data-extension-functions/insertde.md) — Insere registros em Data Extensions
- [LookupRows](../data-extension-functions/lookuprows.md) — Busca múltiplas linhas em uma Data Extension