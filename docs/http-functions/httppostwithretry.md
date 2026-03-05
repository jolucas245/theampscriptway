---
title: HTTPPostWithRetry
sidebar_label: HTTPPostWithRetry
description: Envia conteúdo via POST para uma URL com capacidade de retry automático em caso de falha.
---

# HTTPPostWithRetry

## Descrição

Envia conteúdo via HTTP POST para uma URL especificada, com a vantagem de tentar novamente automaticamente caso a requisição falhe na primeira tentativa. Funciona apenas com HTTP na porta 80 e HTTPS na porta 443. É similar à [HTTPPost2](../http-functions/httppost2.md), mas com o diferencial de permitir configurar o número de retentativas e até reagendar o envio caso todas as tentativas falhem - algo muito útil quando você integra com APIs externas que podem estar instáveis (gateways de pagamento, CRMs, sistemas de estoque etc.).

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
  @responseContentRowset,
  headerName1, headerValue1,
  headerName2, headerValue2,
  ...
)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| urlEndpoint | string | Sim | URL de destino para onde o conteúdo será enviado via POST. |
| contentTypeHeader | string | Sim | Header `Content-Type` da requisição (ex: `application/json`, `application/x-www-form-urlencoded`). |
| content | string | Sim | Conteúdo (body) que será enviado na requisição POST. |
| numRetries | number | Não | Número de vezes que a requisição pode ser retentada em caso de falha. A primeira retentativa ocorre imediatamente após a falha; as seguintes ocorrem de 1 a 4 segundos após a falha anterior. Valor padrão: **3**. |
| boolReschedule | boolean | Não | Define se o envio será reagendado caso todas as retentativas falhem. Se `true`, o sistema pausa o envio e tenta novamente após 15 minutos. Se `false`, não tenta novamente. Valor padrão: **false**. |
| boolReturnExceptionOnError | boolean | Não | Se `true`, a função gera uma exceção ao encontrar um erro. Se `false`, a função continua a execução mesmo após um erro. |
| @responseStatus | variável | Não | Variável que armazena o status da requisição POST (código HTTP de retorno). |
| @responseContentRowset | variável | Não | Variável que armazena o conteúdo da resposta como um rowset. |
| headerName*N* | string | Não | Nome de um header adicional a incluir na requisição. Você pode passar quantos pares nome-valor precisar, adicionando-os ao final da chamada. |
| headerValue*N* | string | Não | Valor do header adicional correspondente. |

## Exemplo básico

Enviando dados de um pedido para a API de fulfillment da MegaStore em formato JSON:

```ampscript
%%[
SET @url = "https://api.megastore.com.br/pedidos"
SET @contentType = "application/json"
SET @payload = Concat('{"cpf":"123.456.789-00","nome":"João Silva","valor":"R$ 1.299,90","pedido":"PED-20241507"}')

HTTPPostWithRetry(
  @url,
  @contentType,
  @payload,
  3,
  false,
  true,
  @callStatus,
  @callResponse
)

Output(Concat("Status: ", @callStatus))
]%%
```

**Saída:**
```
Status: 200
```

## Exemplo avançado

Cenário de régua de relacionamento: ao enviar um e-mail de boas-vindas, você notifica a API interna do Banco Brasilão para registrar a ativação do cliente, incluindo um token de autenticação no header. Se a API estiver fora, o sistema reagenda a tentativa automaticamente:

```ampscript
%%[
SET @nome = "Maria Santos"
SET @email = "maria.santos@email.com.br"
SET @cpf = "987.654.321-00"
SET @dataAtivacao = FormatDate(Now(), "DD/MM/YYYY")

SET @url = "https://api.bancobrasilao.com.br/clientes/ativacao"
SET @contentType = "application/json"

SET @payload = Concat(
  '{"nome":"', @nome,
  '","email":"', @email,
  '","cpf":"', @cpf,
  '","dataAtivacao":"', @dataAtivacao,
  '","origem":"email-boas-vindas"}'
)

SET @authToken = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

HTTPPostWithRetry(
  @url,
  @contentType,
  @payload,
  5,
  true,
  false,
  @respStatus,
  @respContent,
  "Authorization", @authToken,
  "X-Correlation-Id", GUID()
)

IF @respStatus == "200" THEN
  SET @resultado = "Ativação registrada com sucesso"
ELSE
  SET @resultado = Concat("Falha na ativação. Status: ", @respStatus)
ENDIF

Output(Concat(@resultado))
]%%
```

**Saída:**
```
Ativação registrada com sucesso
```

## Observações

> **⚠️ Atenção:** A função só funciona com HTTP na porta 80 e HTTPS na porta 443. Portas não-padrão fazem a função falhar. Se a API de destino usa uma porta customizada, você precisará de um proxy ou redirecionamento.

> **⚠️ Atenção:** Você **não pode** definir os headers `Host` e `Content-Length` manualmente. O `Host` é sempre definido automaticamente como o domínio da URL de destino, e o `Content-Length` é calculado com base no tamanho do conteúdo enviado.

- A função respeita o charset retornado no header `Content-Type` da resposta. Por exemplo, se a resposta incluir `Content-Type: text/html; charset=utf-8`, o conteúdo será interpretado como UTF-8. Caso o header não especifique encoding, o sistema assume **WindowsCodePage 1252**. Para alterar esse padrão, é necessário contatar o suporte da Salesforce.

> **💡 Dica:** O parâmetro `boolReschedule` como `true` é especialmente útil em envios de e-mail em larga escala. Se a API de destino ficar temporariamente indisponível, o sistema pausa e retenta após 15 minutos em vez de simplesmente perder a chamada. Isso é muito valioso em integrações com sistemas de estoque ou CRMs que podem ter janelas de manutenção.

> **💡 Dica:** Você pode incluir quantos pares de headers adicionais precisar - basta adicioná-los ao final da função. Isso é comum para enviar tokens de autenticação (`Authorization`), headers de rastreamento (`X-Correlation-Id`) ou headers customizados exigidos pela API de destino.

- A primeira retentativa ocorre imediatamente após a falha. As retentativas seguintes acontecem entre 1 e 4 segundos após a falha anterior, implementando um mecanismo de backoff.

## Funções relacionadas

- [HTTPPost](../http-functions/httppost.md) - versão mais simples, sem suporte a headers customizados e sem retry.
- [HTTPPost2](../http-functions/httppost2.md) - versão com headers customizados, mas sem retry automático.
- [HTTPGet](../http-functions/httpget.md) - para requisições GET em vez de POST.
- [BuildRowsetFromJson](../content-functions/buildrowsetfromjson.md) - útil para parsear a resposta JSON armazenada no rowset de retorno.
- [Concat](../string-functions/concat.md) - para montar dinamicamente o payload e headers.
- [GUID](../utility-functions/guid.md) - para gerar identificadores únicos de correlação nos headers.
- [RaiseError](../utility-functions/raiseerror.md) - para tratar erros de forma controlada quando `boolReturnExceptionOnError` é `false`.