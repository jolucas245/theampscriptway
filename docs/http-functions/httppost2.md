---
title: HTTPPost2
sidebar_label: HTTPPost2
description: Envia uma requisição HTTP POST para uma URL especificada, com suporte a headers customizados e captura da resposta como rowset.
---

# HTTPPost2

## Descrição

A função `HTTPPost2` envia conteúdo via requisição HTTP POST para uma URL especificada, permitindo incluir headers adicionais na chamada e capturando a resposta tanto como status quanto como rowset. É a versão mais completa do [HTTPPost](../http-functions/httppost.md), ideal para quando você precisa inspecionar os headers de resposta ou processar o retorno de forma estruturada. No dia a dia de SFMC no Brasil, você vai usar bastante para integrar com APIs de parceiros — sistemas de frete, gateways de pagamento, CRMs internos — enviando e recebendo dados em JSON ou XML.

## Sintaxe

```ampscript
HTTPPost2(urlEndpoint, contentTypeHeader, contentToPost, boolExceptionOnError, response, responseRowSet [, headerName1, headerValue1 ...])
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| urlEndpoint | string | Sim | URL de destino para onde o conteúdo será enviado via POST. |
| contentTypeHeader | string | Sim | Header content-type da requisição (ex: `application/json`, `application/x-www-form-urlencoded`). |
| contentToPost | string | Sim | Conteúdo que será enviado no corpo da requisição POST. |
| boolExceptionOnError | boolean | Sim | Se `true`, a função gera uma exceção ao encontrar um erro. Se `false`, a execução continua mesmo em caso de erro. |
| response | variable | Sim | Variável que armazena o status da requisição POST. |
| responseRowSet | variable | Sim | Variável que armazena a resposta como um rowset. |
| headerName1 | string | Não | Nome de um header adicional para incluir na requisição. |
| headerValue1 | string | Não | Valor do header adicional correspondente. Você pode passar múltiplos pares nome-valor adicionando ao final da função (headerName2, headerValue2, ...). |

## Exemplo básico

Enviando um objeto JSON simples para uma API de cadastro de clientes da Lojas Vitória.

```ampscript
%%[

SET @payload = '{"nome": "João Silva", "email": "joao.silva@email.com.br", "cidade": "São Paulo"}'

SET @statusCode = HTTPPost2(
  "https://api.lojasvitoria.com.br/v1/clientes",
  "application/json",
  @payload,
  true,
  @resposta,
  @respostaRowSet
)

]%%
```

**Saída:**
```
A variável @statusCode contém o código HTTP retornado (ex: 200).
A variável @resposta contém o status da requisição.
A variável @respostaRowSet contém a resposta do servidor como rowset.
```

## Exemplo avançado

Cenário real de régua de relacionamento: ao enviar um e-mail de confirmação de pedido, a CloudPage consulta uma API interna do Grupo Horizonte para registrar o envio e obter dados atualizados do pedido, passando um token de autenticação via header customizado.

```ampscript
%%[

SET @emailCliente = AttributeValue("EmailAddress")
SET @cpf = AttributeValue("CPF")
SET @pedidoId = AttributeValue("PedidoId")

SET @payload = Concat(
  '{"cpf": "', @cpf,
  '", "email": "', @emailCliente,
  '", "pedido_id": "', @pedidoId,
  '", "evento": "email_confirmacao_enviado",',
  '"data_envio": "', FormatDate(Now(), "dd/MM/yyyy", "HH:mm:ss"), '"}'
)

SET @token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

SET @statusCode = HTTPPost2(
  "https://api.grupohorizonte.com.br/v2/pedidos/eventos",
  "application/json",
  @payload,
  false,
  @resposta,
  @respostaRowSet,
  "Authorization", @token,
  "X-Source", "SFMC-RegUA",
  "Accept", "application/json"
)

IF @statusCode == 200 THEN

  SET @dadosResposta = Row(@respostaRowSet, 1)
  SET @statusPedido = Field(@dadosResposta, "Value")

ELSE

  SET @statusPedido = "Não foi possível consultar o status do pedido."

ENDIF

]%%

<p>Olá! Seu pedido #%%=V(@pedidoId)=%% está com status: %%=V(@statusPedido)=%%</p>
```

**Saída:**
```
Olá! Seu pedido #98432 está com status: Em separação
```

## Observações

- A função opera **exclusivamente** na porta 80 (HTTP) e porta 443 (HTTPS). Qualquer URL com porta não-padrão vai fazer a função falhar.

- O `HTTPPost2` respeita o charset informado no header `content-type` da resposta. Por exemplo, se a API retornar `Content-Type: text/html; charset=utf-8`, o conteúdo será interpretado como UTF-8. Se o header não especificar encoding, o padrão assumido é **WindowsCodePage 1252**. Para alterar esse padrão, é necessário contatar o suporte Salesforce.

> **⚠️ Atenção:** Você **não pode** sobrescrever os headers `host` e `content-length` na requisição. O valor de `host` é sempre definido automaticamente a partir do domínio da URL, e o `content-length` é calculado a partir do conteúdo enviado.

> **💡 Dica:** A grande diferença entre `HTTPPost2` e `HTTPPost` é o parâmetro `responseRowSet`, que permite capturar a resposta de forma estruturada. Se você não precisa inspecionar a resposta como rowset, o [HTTPPost](../http-functions/httppost.md) mais simples pode ser suficiente.

> **⚠️ Atenção:** Quando usar `boolExceptionOnError` como `false`, lembre-se de tratar manualmente os cenários de erro verificando o valor retornado — senão seu e-mail pode renderizar com dados em branco ou incompletos sem você perceber.

> **💡 Dica:** Você pode passar quantos pares de headers adicionais precisar, basta ir adicionando `headerName`, `headerValue` ao final da chamada. Muito útil para APIs que exigem `Authorization`, `X-Api-Key` ou headers customizados.

## Funções relacionadas

- [HTTPPost](../http-functions/httppost.md) — versão mais simples, sem captura de resposta como rowset.
- [HTTPGet](../http-functions/httpget.md) — para requisições GET quando você só precisa recuperar dados.
- [HTTPRequestHeader](../http-functions/httprequestheader.md) — para ler headers da requisição recebida.
- [TreatAsContent](../utility-functions/treatascontent.md) — para renderizar conteúdo retornado dinamicamente.
- [BuildRowsetFromJson](../content-functions/buildrowsetfromjson.md) — para parsear respostas JSON em rowsets.
- [Concat](../string-functions/concat.md) — para montar payloads dinâmicos concatenando variáveis.