---
title: AuthenticatedMemberName
sidebar_label: AuthenticatedMemberName
description: Retorna o nome do membro (Member Name) do usuário autenticado em uma landing page de Microsite com Sender Authenticated Redirection.
---

<!-- generated-by-script -->

# AuthenticatedMemberName

## Descrição

A função `AuthenticatedMemberName()` retorna o nome do membro (Member Name) do usuário que está autenticado em uma landing page. Esse nome corresponde ao identificador do membro na conta do Marketing Cloud. Essa função é usada **exclusivamente com Microsites** quando você está trabalhando com **Sender Authenticated Redirection** — ela **não funciona com CloudPages**. Não recebe nenhum parâmetro.

## Sintaxe

```ampscript
AuthenticatedMemberName()
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| — | — | — | Esta função não aceita nenhum parâmetro. |

## Exemplo básico

Imagine que a **Conecta Telecom** tem um Microsite com autenticação para que clientes corporativos acessem informações da conta. Você quer exibir o nome do membro autenticado na página:

```ampscript
%%[
VAR @nomeMembro
SET @nomeMembro = AuthenticatedMemberName()
]%%

<h1>Painel Conecta Telecom</h1>
<p>Bem-vindo! Você está autenticado como: %%=v(@nomeMembro)=%%</p>
```

**Saída:**
```
Painel Conecta Telecom
Bem-vindo! Você está autenticado como: ConectaTelecom_Corporativo
```

## Exemplo avançado

Agora um cenário mais completo: a **Lojas Vitória** usa um Microsite autenticado para parceiros e quer registrar o acesso em uma Data Extension chamada `LogAcessoParceiros`, além de exibir uma mensagem personalizada com o nome do membro formatado:

```ampscript
%%[
VAR @nomeMembro, @nomeFormatado, @dataAcesso

SET @nomeMembro = AuthenticatedMemberName()
SET @dataAcesso = FormatDate(Now(), "dd/MM/yyyy HH:mm")

/* Verifica se o membro foi identificado */
IF NOT Empty(@nomeMembro) THEN

  SET @nomeFormatado = ProperCase(@nomeMembro)

  /* Registra o acesso na Data Extension */
  InsertDE(
    "LogAcessoParceiros",
    "NomeMembro", @nomeMembro,
    "DataAcesso", @dataAcesso,
    "Origem", "Microsite"
  )
]%%

<div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px;">
  <h2>Portal de Parceiros — Lojas Vitória</h2>
  <p>Olá, <strong>%%=v(@nomeFormatado)=%%</strong>!</p>
  <p>Seu acesso foi registrado em %%=v(@dataAcesso)=%%.</p>
  <p>Aqui você pode consultar comissões, acompanhar metas e acessar materiais de campanha do Natal 2024.</p>
</div>

%%[ ELSE ]%%

<div style="background-color: #ffe0e0; padding: 20px; border-radius: 8px;">
  <h2>Acesso não autorizado</h2>
  <p>Não foi possível identificar seu membro. Por favor, acesse novamente pelo link enviado por e-mail.</p>
</div>

%%[ ENDIF ]%%
```

**Saída (quando autenticado):**
```
Portal de Parceiros — Lojas Vitória
Olá, Lojasvitoria_Parceiro!
Seu acesso foi registrado em 15/11/2024 14:32.
Aqui você pode consultar comissões, acompanhar metas e acessar materiais de campanha do Natal 2024.
```

**Saída (quando não autenticado):**
```
Acesso não autorizado
Não foi possível identificar seu membro. Por favor, acesse novamente pelo link enviado por e-mail.
```

## Observações

- **Funciona apenas com Microsites** — essa função exige o contexto de Sender Authenticated Redirection. Se você tentar usá-la em CloudPages, ela **não vai funcionar**.
- **Não confunda com CloudPages** — se você está construindo landing pages com CloudPages (que é o padrão mais comum hoje em dia), essa função não é pra você. Microsites é uma funcionalidade mais antiga do Marketing Cloud.
- **Não aceita parâmetros** — qualquer tentativa de passar argumentos vai gerar erro.
- **Pode retornar vazio** — sempre valide o retorno com [Empty](../utility-functions/empty.md) antes de usar o valor, como mostrado no exemplo avançado.
- **Função de uso restrito** — como Microsites são uma feature legada e menos utilizada atualmente, essa função tem um caso de uso bem específico. Na maioria dos projetos novos, você provavelmente não vai precisar dela.
- O valor retornado é o **Member Name** configurado na conta do Marketing Cloud, não o nome de exibição do usuário final (assinante).

## Funções relacionadas

- [AuthenticatedMemberID](../sites-functions/authenticatedmemberid.md) — retorna o ID do membro autenticado no Microsite
- [AuthenticatedEnterpriseID](../sites-functions/authenticatedenterpriseid.md) — retorna o Enterprise ID do usuário autenticado
- [AuthenticatedEmployeeId](../sites-functions/authenticatedemployeeid.md) — retorna o ID do funcionário autenticado
- [AuthenticatedEmployeeUserName](../sites-functions/authenticatedemployeeusername.md) — retorna o nome de usuário do funcionário autenticado
- [AuthenticatedEmployeeNotificationAddress](../sites-functions/authenticatedemployeenotificationaddress.md) — retorna o endereço de notificação do funcionário autenticado
- [MicrositeURL](../sites-functions/micrositeurl.md) — gera URLs para páginas de Microsites
- [CloudPagesURL](../sites-functions/cloudpagesurl.md) — gera URLs para CloudPages (alternativa moderna aos Microsites)
- [RequestParameter](../sites-functions/requestparameter.md) — captura parâmetros de requisição em landing pages
- [Empty](../utility-functions/empty.md) — verifica se um valor está vazio (útil para validar o retorno)
- [V](../utility-functions/v.md) — exibe o valor de uma variável inline no HTML