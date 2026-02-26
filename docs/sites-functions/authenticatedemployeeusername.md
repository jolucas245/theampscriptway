---
title: AuthenticatedEmployeeUserName
sidebar_label: AuthenticatedEmployeeUserName
description: Retorna o nome de usuário (username) do usuário do Marketing Cloud que está acessando a página no contexto de Microsites com Sender Authenticated Redirection.
---

<!-- generated-by-script -->

# AuthenticatedEmployeeUserName

## Descrição

A função `AuthenticatedEmployeeUserName()` retorna o nome de usuário (username) do usuário do Marketing Cloud Engagement que está acessando a página no momento. Ela é usada exclusivamente em **Microsites** quando você está utilizando **Sender Authenticated Redirection (SAR)**. Essa função é útil para personalizar o conteúdo de uma página com base no usuário logado que está visualizando, como exibir saudações personalizadas ou registrar logs de acesso. **Não funciona com CloudPages.**

## Sintaxe

```ampscript
AuthenticatedEmployeeUserName()
```

## Parâmetros

Esta função **não aceita nenhum parâmetro**. Basta chamá-la sem passar argumentos.

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| _(nenhum)_ | — | — | Esta função não requer parâmetros. |

## Exemplo básico

Neste exemplo, exibimos uma saudação personalizada na página do Microsite com o username do usuário do Marketing Cloud que está acessando.

```ampscript
%%[
  VAR @nomeUsuario
  SET @nomeUsuario = AuthenticatedEmployeeUserName()
]%%

<p>Olá, %%=v(@nomeUsuario)=%%! Bem-vindo(a) ao painel da Conecta Telecom.</p>
```

**Saída:**
```
Olá, carlos.oliveira@conectatelecom.com.br! Bem-vindo(a) ao painel da Conecta Telecom.
```

## Exemplo avançado

Aqui temos um cenário mais completo: um Microsite interno da **Lojas Vitória** onde o vendedor autenticado acessa uma página de acompanhamento de campanhas. O sistema identifica quem é o vendedor, registra o acesso em uma Data Extension de log e exibe informações personalizadas.

```ampscript
%%[
  VAR @username, @employeeId, @dataAcesso, @totalCampanhas

  SET @username = AuthenticatedEmployeeUserName()
  SET @employeeId = AuthenticatedEmployeeId()
  SET @dataAcesso = FormatDate(Now(), "dd/MM/yyyy HH:mm")

  /* Registra o acesso na DE de log */
  InsertDE(
    "Log_Acessos_Microsite",
    "Username", @username,
    "EmployeeId", @employeeId,
    "DataAcesso", @dataAcesso,
    "Pagina", "Painel de Campanhas"
  )

  /* Busca as campanhas ativas do vendedor */
  SET @totalCampanhas = Lookup(
    "Campanhas_Vendedores",
    "TotalAtivas",
    "Username", @username
  )

  IF Empty(@totalCampanhas) THEN
    SET @totalCampanhas = 0
  ENDIF
]%%

<h1>Painel de Campanhas — Lojas Vitória</h1>
<p>Usuário: <strong>%%=v(@username)=%%</strong></p>
<p>ID do funcionário: %%=v(@employeeId)=%%</p>
<p>Data de acesso: %%=v(@dataAcesso)=%%</p>

%%[ IF @totalCampanhas > 0 THEN ]%%
  <p>Você tem <strong>%%=v(@totalCampanhas)=%%</strong> campanha(s) ativa(s) no momento. 🚀</p>
  <p><a href="%%=RedirectTo('https://www.lojasvitoria.com.br/microsite/campanhas')=%%">Ver minhas campanhas</a></p>
%%[ ELSE ]%%
  <p>Você não tem campanhas ativas no momento. Fale com o time de marketing para criar uma nova!</p>
%%[ ENDIF ]%%
```

**Saída:**
```
Painel de Campanhas — Lojas Vitória
Usuário: maria.santos@lojasvitoria.com.br
ID do funcionário: 12345
Data de acesso: 15/06/2025 14:30
Você tem 3 campanha(s) ativa(s) no momento. 🚀
Ver minhas campanhas
```

## Observações

- **Funciona apenas em Microsites** — essa função só retorna valores quando usada em páginas de Microsites configuradas com **Sender Authenticated Redirection (SAR)**. Fora desse contexto, ela não vai funcionar como esperado.
- **Não funciona com CloudPages** — a documentação oficial é bem clara sobre isso. Se você está trabalhando com CloudPages, essa função não é pra você.
- **Função de uso bem específico e pouco comum** — Microsites são um recurso legado do Marketing Cloud. Na maioria dos projetos modernos, você provavelmente vai usar CloudPages. Considere essa função apenas se o seu ambiente ainda utiliza Microsites ativamente.
- **Não aceita parâmetros** — se você passar qualquer argumento, vai gerar erro. Chame sempre como `AuthenticatedEmployeeUserName()` sem nada entre os parênteses.
- **O formato do username retornado** depende de como o usuário foi configurado no Marketing Cloud. Geralmente é o e-mail ou login corporativo cadastrado na conta.
- **Combine com outras funções Authenticated** para obter um contexto mais completo do usuário (ID, e-mail de notificação, enterprise ID, etc.).

## Funções relacionadas

- [AuthenticatedEmployeeId](../sites-functions/authenticatedemployeeid.md) — Retorna o ID do usuário autenticado do Marketing Cloud. Ótimo para usar junto com `AuthenticatedEmployeeUserName()` para identificação completa.
- [AuthenticatedEmployeeNotificationAddress](../sites-functions/authenticatedemployeenotificationaddress.md) — Retorna o endereço de e-mail de notificação do usuário autenticado.
- [AuthenticatedEnterpriseID](../sites-functions/authenticatedenterpriseid.md) — Retorna o Enterprise ID da conta do Marketing Cloud do usuário autenticado.
- [AuthenticatedMemberID](../sites-functions/authenticatedmemberid.md) — Retorna o Member ID (MID) da business unit do usuário autenticado.
- [AuthenticatedMemberName](../sites-functions/authenticatedmembername.md) — Retorna o nome da business unit do usuário autenticado.
- [MicrositeURL](../sites-functions/micrositeurl.md) — Gera URLs para páginas de Microsites, contexto onde `AuthenticatedEmployeeUserName()` funciona.
- [CloudPagesURL](../sites-functions/cloudpagesurl.md) — Gera URLs para CloudPages (lembre-se: `AuthenticatedEmployeeUserName()` **não** funciona com CloudPages).
- [InsertDE](../data-extension-functions/insertde.md) — Útil para registrar logs de acesso combinando com o username retornado.
- [Lookup](../data-extension-functions/lookup.md) — Para buscar dados relacionados ao usuário autenticado em Data Extensions.