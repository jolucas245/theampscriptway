---
title: HTTPPostWithRetry
sidebar_label: HTTPPostWithRetry
description: Envia uma requisição HTTP POST para uma URL especificada, com suporte a retentativas automáticas em caso de falha.
---

<!-- generated-by-script -->

# HTTPPostWithRetry

## Descrição

A função `HTTPPostWithRetry` envia conteúdo via requisição HTTP POST para uma URL especificada. O grande diferencial dela em relação às outras funções de POST (como `HTTPPost2`) é que ela permite configurar **retentativas automáticas** caso a requisição falhe na primeira tentativa. Isso é super útil quando você está integrando com APIs externas que podem ter instabilidade momentânea. A função armazena o código de status HTTP e o conteúdo da resposta em variáveis que você define, e funciona apenas em HTTP na porta 80 e HTTPS na porta 443.

## Sintaxe

```ampscript
HTTPPostWithRetry(
  urlEndpoint,
  contentTypeHeader,
  content,
  numRetries,
  boolReschedule,
  boolReturnExceptionOnError,
  @responseStatus,
  @responseContentRowset
  [, headerName1, headerValue1]
  [, headerName2, headerValue2]
  [, ...]
)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| urlEndpoint | String | Sim | A URL de destino para onde o conteúdo será enviado via POST. |
| contentTypeHeader | String | Sim | O valor do header `Content-Type` da requisição (ex: `application/json`, `application/x-www-form-urlencoded`). |
| content | String | Sim | O conteúdo (body) que será enviado na requisição POST. |
| numRetries | Número | Não | Número de vezes que a requisição pode ser retentada em caso de falha. A primeira retentativa ocorre imediatamente após a falha. As retentativas seguintes ocorrem entre 1 e 4 segundos após a falha anterior. O valor padrão é **3**. |
| boolReschedule | Booleano | Não | Se `true` e a requisição não conseguir ser completada após todas as retentativas, o envio é pausado e o sistema tenta novamente após **15 minutos**. Se `false`, o sistema não tenta novamente depois. O valor padrão é **false**. |
| boolReturnExceptionOnError | Booleano | Não | Se `true`, a função gera uma exceção (erro) quando encontra um problema. Se `false`, a função continua a execução mesmo em caso de erro. |
| @responseStatus | Variável | Sim | Variável que armazena o código de status HTTP da resposta (ex: 200, 401, 500). |
| @responseContentRowset | Variável | Sim | Variável que armazena o conteúdo da resposta como um rowset. |
| headerName1 | String | Não | Nome de um header adicional para incluir na requisição. |
| headerValue1 | String | Não | Valor do header adicional correspondente. Você pode passar quantos pares nome-valor precisar, adicionando `headerName2`, `headerValue2`, etc. |

## Exemplo básico

Imagine que a **MegaStore** quer notificar seu sistema interno toda vez que um e-mail promocional é enviado, postando um JSON simples para uma API:

```ampscript
%%[
SET @payload = '{"evento": "email_enviado", "campanha": "black-friday-2024"}'

SET @callStatus = ""
SET @callResponse = ""

HTTPPostWithRetry(
  "https://api.megastore.com.br/webhooks/email-enviado",
  "application/json",
  @payload,
  3,
  false,
  true,
  @callStatus,
  @callResponse
)
]%%

Status da chamada: %%=v(@callStatus)=%%
```

**Saída:**
```
Status da chamada: 200
```

## Exemplo avançado

Agora um cenário mais completo: a **Conecta Telecom** precisa consultar uma API de fidelidade para registrar pontos do cliente toda vez que ele recebe um e-mail de confirmação de recarga. A API exige autenticação via header e o payload inclui dados do assinante vindos de uma Data Extension:

```ampscript
%%[
/* Busca dados do cliente na Data Extension */
SET @rows = LookupRows("Clientes_Fidelidade", "EmailAddress", EmailAddress)

IF RowCount(@rows) > 0 THEN
  SET @row = Row(@rows, 1)
  SET @nome = Field(@row, "NomeCompleto")
  SET @cpf = Field(@row, "CPF")
  SET @pontos = Field(@row, "PontosAcumulados")
  SET @novosPontos = Add(@pontos, 50)

  /* Monta o payload JSON */
  SET @payload = Concat(
    '{"cpf": "', @cpf,
    '", "nome": "', @nome,
    '", "pontos_adicionados": 50',
    ', "total_pontos": ', @novosPontos,
    ', "motivo": "recarga_confirmada"',
    ', "data": "', FormatDate(Now(), "dd/MM/yyyy"), '"}'
  )

  SET @callStatus = ""
  SET @callResponse = ""

  /* Envia para a API com retentativas e reagendamento */
  HTTPPostWithRetry(
    "https://api.conectatelecom.com.br/fidelidade/registrar-pontos",
    "application/json",
    @payload,
    5,
    true,
    false,
    @callStatus,
    @callResponse,
    "Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "X-Request-Source", "sfmc-email"
  )

  IF @callStatus == "200" THEN
    /* Atualiza os pontos na Data Extension */
    UpsertDE(
      "Clientes_Fidelidade", 1,
      "EmailAddress", EmailAddress,
      "PontosAcumulados", @novosPontos
    )
  ENDIF
ENDIF
]%%

%%[ IF NOT Empty(@nome) THEN ]%%
<p>Olá, %%=ProperCase(@nome)=%%! 🎉</p>
<p>Sua recarga foi confirmada e você acumulou mais <strong>50 pontos</strong> no programa Conecta Fidelidade!</p>
<p>Seu saldo atual: <strong>%%=v(@novosPontos)=%% pontos</strong></p>
<p>Com 500 pontos você ganha frete grátis em acessórios acima de R$299,00!</p>
%%[ ELSE ]%%
<p>Olá! Sua recarga foi confirmada com sucesso.</p>
%%[ ENDIF ]%%
```

**Saída (para a cliente Maria Santos com 450 pontos anteriores):**
```html
<p>Olá, Maria Santos! 🎉</p>
<p>Sua recarga foi confirmada e você acumulou mais <strong>50 pontos</strong> no programa Conecta Fidelidade!</p>
<p>Seu saldo atual: <strong>500 pontos</strong></p>
<p>Com 500 pontos você ganha frete grátis em acessórios acima de R$299,00!</p>
```

## Observações

- **Portas permitidas:** A função só funciona com HTTP na porta 80 e HTTPS na porta 443. Se a URL usar uma porta diferente (ex: `:8080`), a função vai falhar.
- **Headers que você NÃO pode setar:** Os headers `Host` e `Content-Length` são definidos automaticamente pela função. O `Host` é sempre o domínio da URL de destino, e o `Content-Length` é sempre o tamanho do conteúdo enviado.
- **Encoding/charset:** A função respeita o charset retornado no header `Content-Type` da resposta. Por exemplo, se a API retornar `Content-Type: text/html; charset=utf-8`, o conteúdo será interpretado como UTF-8. Se nenhum charset for especificado, o padrão é **Windows CodePage 1252**. Para mudar esse padrão, você precisa entrar em contato com o suporte da Salesforce.
- **Comportamento das retentativas:** A primeira retentativa acontece imediatamente após a falha. As retentativas seguintes ocorrem entre 1 e 4 segundos após a falha anterior. Se você definir `numRetries` como 5, a função vai tentar até 5 vezes antes de desistir.
- **Reagendamento (`boolReschedule`):** Se você passar `true` e todas as retentativas falharem, o envio inteiro é pausado e o sistema tenta de novo após 15 minutos. Use com cuidado — isso pode atrasar o envio completo de uma campanha.
- **Tratamento de erros:** Se `boolReturnExceptionOnError` for `true`, qualquer erro vai parar a execução do AMPscript. Se for `false`, a execução continua normalmente e você pode verificar o status pela variável `@responseStatus`.
- **Diferença para HTTPPost2:** A função é essencialmente igual à `HTTPPost2`, mas com os parâmetros extras de retentativa (`numRetries`, `boolReschedule`, `boolReturnExceptionOnError`). Se você não precisa de retentativas, pode usar `HTTPPost2` direto.
- **Headers adicionais:** Você pode passar quantos pares de header nome-valor precisar, basta adicioná-los ao final da chamada da função.
- **Variável de resposta:** O `@responseContentRowset` armazena o conteúdo da resposta como um rowset. Para extrair os dados, você pode usar funções como [Row](../data-extension-functions/row.md) e [Field](../data-extension-functions/field.md).

## Funções relacionadas

- [HTTPPost](../http-functions/httppost.md) — Versão mais simples de POST, sem suporte a headers customizados e retentativas.
- [HTTPPost2](../http-functions/httppost2.md) — Similar à HTTPPostWithRetry, mas sem o mecanismo de retentativas automáticas.
- [HTTPGet](../http-functions/httpget.md) — Faz requisições HTTP GET para buscar conteúdo de uma URL.
- [HTTPRequestHeader](../http-functions/httprequestheader.md) — Recupera o valor de um header da requisição HTTP atual.
- [BuildRowsetFromJson](../content-functions/buildrowsetfromjson.md) — Converte uma string JSON em um rowset, útil para parsear respostas de APIs.
- [BuildRowsetFromXml](../content-functions/buildrowsetfromxml.md) — Converte uma string XML em um rowset, útil para respostas em XML.
- [Row](../data-extension-functions/row.md) — Extrai uma linha específica de um rowset.
- [Field](../data-extension-functions/field.md) — Extrai o valor de um campo específico de uma linha de rowset.
- [RaiseError](../utility-functions/raiseerror.md) — Gera um erro customizado, útil para tratamento de falhas em chamadas HTTP.
- [V](../utility-functions/v.md) — Exibe o valor de uma variável inline no HTML.