---
title: AuthenticatedMemberID
sidebar_label: AuthenticatedMemberID
description: Retorna o Member ID (MID) do usuário autenticado em uma landing page do tipo Microsite com Sender Authenticated Redirection.
---

<!-- generated-by-script -->

# AuthenticatedMemberID

## Descrição

A função `AuthenticatedMemberID()` retorna o **Member ID (MID)** do usuário que está autenticado em uma landing page. Esse MID identifica a Business Unit no Marketing Cloud de onde veio a requisição autenticada.

Essa função é usada **exclusivamente com Microsites** quando você está utilizando **Sender Authenticated Redirection (SAR)**. Ela **não funciona com CloudPages**. Se você precisa identificar qual Business Unit está acessando um Microsite autenticado — por exemplo, para personalizar conteúdo ou registrar logs — essa é a função certa.

## Sintaxe

```ampscript
AuthenticatedMemberID()
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| — | — | — | Essa função não aceita nenhum parâmetro. |

## Exemplo básico

Aqui um exemplo simples que exibe o Member ID do usuário autenticado na landing page:

```ampscript
%%[
VAR @memberID
SET @memberID = AuthenticatedMemberID()
]%%

O Member ID autenticado é: %%=v(@memberID)=%%
```

**Saída:**
```
O Member ID autenticado é: 123456789
```

## Exemplo avançado

Imagine que a **Conecta Telecom** tem várias Business Units no Marketing Cloud — uma para cada região do Brasil. Eles usam um Microsite centralizado com SAR para exibir ofertas regionais. O código abaixo identifica qual BU está acessando e registra o acesso em uma Data Extension de log, além de personalizar a mensagem:

```ampscript
%%[
VAR @memberID, @memberName, @nomeRegiao, @dataAcesso

SET @memberID = AuthenticatedMemberID()
SET @memberName = AuthenticatedMemberName()
SET @dataAcesso = FormatDate(Now(), "dd/MM/yyyy HH:mm")

/* Busca o nome da região associada a essa BU */
SET @nomeRegiao = Lookup("BU_Regioes", "NomeRegiao", "MemberID", @memberID)

IF Empty(@nomeRegiao) THEN
  SET @nomeRegiao = "Nacional"
ENDIF

/* Registra o acesso no log */
InsertData(
  "Log_Acessos_Microsite",
  "MemberID", @memberID,
  "MemberName", @memberName,
  "NomeRegiao", @nomeRegiao,
  "DataAcesso", @dataAcesso
)
]%%

<h1>Bem-vindo ao portal de ofertas da Conecta Telecom</h1>
<p>Região: %%=v(@nomeRegiao)=%%</p>
<p>BU (MID): %%=v(@memberID)=%% | Nome: %%=v(@memberName)=%%</p>
<p>Acesso registrado em: %%=v(@dataAcesso)=%%</p>

%%[ IF @nomeRegiao == "Sudeste" THEN ]%%
  <div class="oferta">
    <h2>🔥 Oferta exclusiva Sudeste</h2>
    <p>Plano Fibra 500 Mega por apenas R$ 99,90/mês + cashback de R$ 50,00 na primeira fatura!</p>
  </div>
%%[ ELSEIF @nomeRegiao == "Nordeste" THEN ]%%
  <div class="oferta">
    <h2>🌴 Oferta exclusiva Nordeste</h2>
    <p>Plano Fibra 300 Mega por apenas R$ 79,90/mês + frete grátis no roteador!</p>
  </div>
%%[ ELSE ]%%
  <div class="oferta">
    <h2>📡 Oferta Nacional</h2>
    <p>Plano Fibra 200 Mega por apenas R$ 69,90/mês. Aproveite!</p>
  </div>
%%[ ENDIF ]%%
```

**Saída (exemplo para BU da região Sudeste):**
```
Bem-vindo ao portal de ofertas da Conecta Telecom
Região: Sudeste
BU (MID): 987654321 | Nome: Conecta Sudeste
Acesso registrado em: 15/06/2025 14:32

🔥 Oferta exclusiva Sudeste
Plano Fibra 500 Mega por apenas R$ 99,90/mês + cashback de R$ 50,00 na primeira fatura!
```

## Observações

- ⚠️ **Funciona APENAS em Microsites** com **Sender Authenticated Redirection (SAR)** habilitado. Essa função **não funciona em CloudPages**, emails, SMS ou qualquer outro contexto do Marketing Cloud.
- A função **não aceita nenhum parâmetro**. Chamar `AuthenticatedMemberID()` com argumentos vai gerar erro.
- O valor retornado é o **MID (Member ID)** da Business Unit, que é um identificador numérico usado internamente pelo Marketing Cloud.
- Se o usuário não estiver autenticado ou se a função for chamada fora de um Microsite com SAR, o comportamento pode ser imprevisível. Sempre valide o retorno com [Empty](../utility-functions/empty.md) ou [IsNull](../utility-functions/isnull.md) antes de usar o valor.
- Essa função é de uso bastante **específico e raro**. A maioria dos projetos modernos no Marketing Cloud usa CloudPages, onde essa função não se aplica. Se você está trabalhando com CloudPages, considere usar [RequestParameter](../sites-functions/requestparameter.md) ou [QueryParameter](../sites-functions/queryparameter.md) para passar identificadores via URL.
- Microsites é uma funcionalidade legada do Marketing Cloud. Se você está começando um projeto novo, provavelmente não vai precisar dessa função.

## Funções relacionadas

- [AuthenticatedMemberName](../sites-functions/authenticatedmembername.md) — Retorna o nome do membro autenticado na landing page (complementar ao MID).
- [AuthenticatedEnterpriseID](../sites-functions/authenticatedenterpriseid.md) — Retorna o Enterprise ID do usuário autenticado.
- [AuthenticatedEmployeeId](../sites-functions/authenticatedemployeeid.md) — Retorna o ID do empregado autenticado.
- [AuthenticatedEmployeeUserName](../sites-functions/authenticatedemployeeusername.md) — Retorna o nome de usuário do empregado autenticado.
- [AuthenticatedEmployeeNotificationAddress](../sites-functions/authenticatedemployeenotificationaddress.md) — Retorna o endereço de notificação do empregado autenticado.
- [MicrositeURL](../sites-functions/micrositeurl.md) — Gera URLs para Microsites, contexto onde `AuthenticatedMemberID` é utilizada.
- [CloudPagesURL](../sites-functions/cloudpagesurl.md) — Gera URLs para CloudPages (alternativa moderna aos Microsites).
- [RequestParameter](../sites-functions/requestparameter.md) — Captura parâmetros da requisição em landing pages.