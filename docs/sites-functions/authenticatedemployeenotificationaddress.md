---
title: AuthenticatedEmployeeNotificationAddress
sidebar_label: AuthenticatedEmployeeNotificationAddress
description: Retorna o endereço de e-mail do usuário autenticado no Marketing Cloud Engagement que está acessando a página do Microsite.
---

<!-- generated-by-script -->

# AuthenticatedEmployeeNotificationAddress

## Descrição

A função `AuthenticatedEmployeeNotificationAddress()` retorna o endereço de e-mail (notification address) do usuário do Marketing Cloud Engagement que está acessando a página naquele momento. Ela é usada exclusivamente em **Microsites** que utilizam **Sender Authenticated Redirection** — ou seja, quando o acesso à página é feito por um usuário autenticado da plataforma. Essa função é útil para identificar qual colaborador/operador está acessando determinada página, permitindo personalização ou registro de auditoria baseado no e-mail desse usuário.

## Sintaxe

```ampscript
AuthenticatedEmployeeNotificationAddress()
```

## Parâmetros

Esta função **não aceita nenhum parâmetro**. Você a chama sem passar nada entre os parênteses.

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| — | — | — | Esta função não possui parâmetros |

## Exemplo básico

Neste exemplo, exibimos na página do Microsite o endereço de e-mail do usuário do Marketing Cloud que está acessando:

```ampscript
%%[
  VAR @emailUsuario
  SET @emailUsuario = AuthenticatedEmployeeNotificationAddress()
]%%

<p>Olá! Você está logado com o e-mail: %%=v(@emailUsuario)=%%</p>
```

**Saída:**
```
Olá! Você está logado com o e-mail: carlos.oliveira@lojasvitoria.com.br
```

## Exemplo avançado

Imagine que a **Lojas Vitória** tem um Microsite interno onde os operadores de marketing acompanham as campanhas de Dia das Mães. Cada vez que um usuário acessa a página, queremos registrar esse acesso em uma Data Extension de auditoria chamada `LogAcessoMicrosite`, gravando o e-mail, o nome de usuário e a data/hora do acesso:

```ampscript
%%[
  VAR @emailNotificacao, @nomeUsuario, @idUsuario, @dataAcesso

  SET @emailNotificacao = AuthenticatedEmployeeNotificationAddress()
  SET @nomeUsuario = AuthenticatedEmployeeUserName()
  SET @idUsuario = AuthenticatedEmployeeId()
  SET @dataAcesso = Now()

  /* Registra o acesso na Data Extension de auditoria */
  InsertDE(
    "LogAcessoMicrosite",
    "EmployeeId", @idUsuario,
    "NomeUsuario", @nomeUsuario,
    "EmailNotificacao", @emailNotificacao,
    "DataAcesso", FormatDate(@dataAcesso, "dd/MM/yyyy HH:mm:ss")
  )
]%%

<h2>Painel de Campanhas — Dia das Mães 2025</h2>
<p>Bem-vindo(a), %%=v(@nomeUsuario)=%%!</p>
<p>Seu e-mail de notificação: %%=v(@emailNotificacao)=%%</p>
<p>Acesso registrado em: %%=FormatDate(@dataAcesso, "dd/MM/yyyy 'às' HH:mm")=%%</p>

<hr>

%%[
  /* Verifica se o e-mail é do time de gestão para exibir dados extras */
  IF IndexOf(@emailNotificacao, "gestao@lojasvitoria.com.br") > 0 THEN
]%%
  <h3>📊 Resumo Executivo</h3>
  <p>Total de campanhas ativas: 12</p>
  <p>Investimento total: R$ 45.000,00</p>
  <p>Frete grátis acima de R$ 299 habilitado para todas as campanhas.</p>
%%[ ELSE ]%%
  <h3>📋 Suas Campanhas</h3>
  <p>Acesse o menu lateral para ver as campanhas atribuídas a você.</p>
%%[ ENDIF ]%%
```

**Saída (para um usuário do time de gestão):**
```
Painel de Campanhas — Dia das Mães 2025
Bem-vindo(a), maria.santos!
Seu e-mail de notificação: gestao@lojasvitoria.com.br
Acesso registrado em: 28/04/2025 às 14:32

📊 Resumo Executivo
Total de campanhas ativas: 12
Investimento total: R$ 45.000,00
Frete grátis acima de R$ 299 habilitado para todas as campanhas.
```

## Observações

- **Uso exclusivo em Microsites:** esta função funciona **apenas em Microsites** que utilizam **Sender Authenticated Redirection**. Ela **não funciona em CloudPages**, emails, SMS ou outros contextos do Marketing Cloud.
- **Sem parâmetros:** a função não aceita nenhum argumento. Qualquer tentativa de passar parâmetros pode gerar erro.
- **Retorno:** o valor retornado é o endereço de e-mail configurado como "notification address" do usuário autenticado no Marketing Cloud Engagement. Esse endereço pode ser diferente do e-mail de login do usuário, dependendo da configuração da conta.
- **Função de uso muito específico:** como Microsites com Sender Authenticated Redirection são um recurso legado e pouco utilizado atualmente (a maioria dos projetos novos usa CloudPages), essa função tem aplicação bastante restrita. Se você está começando um projeto novo, provavelmente vai preferir CloudPages com outras abordagens de autenticação.
- **Segurança:** evite exibir o endereço de e-mail diretamente em páginas públicas. Use essa informação preferencialmente para lógica interna, registros de auditoria ou personalização em contextos controlados.
- **Valor nulo:** se o usuário não estiver autenticado ou a página não estiver configurada corretamente com Sender Authenticated Redirection, o retorno pode ser vazio. Considere usar [Empty](../utility-functions/empty.md) ou [IsNull](../utility-functions/isnull.md) para tratar esses casos.

## Funções relacionadas

- [AuthenticatedEmployeeId](../sites-functions/authenticatedemployeeid.md) — retorna o ID do usuário autenticado no Marketing Cloud
- [AuthenticatedEmployeeUserName](../sites-functions/authenticatedemployeeusername.md) — retorna o nome de usuário (username) do usuário autenticado
- [AuthenticatedEnterpriseID](../sites-functions/authenticatedenterpriseid.md) — retorna o Enterprise ID da conta autenticada
- [AuthenticatedMemberID](../sites-functions/authenticatedmemberid.md) — retorna o Member ID da business unit autenticada
- [AuthenticatedMemberName](../sites-functions/authenticatedmembername.md) — retorna o nome da business unit autenticada
- [MicrositeURL](../sites-functions/micrositeurl.md) — gera URLs para páginas de Microsites
- [CloudPagesURL](../sites-functions/cloudpagesurl.md) — gera URLs para CloudPages (alternativa moderna aos Microsites)
- [RequestParameter](../sites-functions/requestparameter.md) — captura parâmetros de requisição em páginas
- [InsertDE](../data-extension-functions/insertde.md) — insere registros em Data Extensions (útil para logs de acesso)
- [Now](../date-functions/now.md) — retorna a data e hora atuais do sistema