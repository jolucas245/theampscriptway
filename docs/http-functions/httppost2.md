---
title: HTTPPost2
sidebar_label: HTTPPost2
description: Envia uma requisição HTTP POST para uma URL especificada, com suporte a headers customizados adicionais, e armazena a resposta e os headers retornados em variáveis.
---

# HTTPPost2

## Descrição

A função `HTTPPost2` envia conteúdo via requisição HTTP POST para uma URL especificada. A grande diferença dela em relação à [HTTPPost](../http-functions/httppost.md) é que ela retorna os **headers da resposta** em um rowset, além do corpo da resposta — o que é super útil quando você precisa inspecionar headers como `Location`, `Set-Cookie` ou códigos de status detalhados. Funciona apenas com HTTP na porta 80 e HTTPS na porta 443 — portas fora do padrão fazem a função falhar. É muito usada para integrar o Marketing Cloud com APIs externas, como sistemas de CRM, plataformas de e-commerce e serviços de pagamento.

## Sintaxe

```ampscript
HTTPPost2(urlEndpoint, contentTypeHeader, contentToPost, boolExceptionOnError, @response, @responseRowSet [, headerName1, headerValue1 [, headerName2, headerValue2, ...]])
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| urlEndpoint | string | Sim | A URL para onde o conteúdo será enviado via POST. |
| contentTypeHeader | string | Sim | O valor do header `Content-Type` a ser usado na requisição (ex: `application/json`, `application/x-www-form-urlencoded`). |
| contentToPost | string | Sim | O conteúdo (body) que será enviado na requisição POST. |
| boolExceptionOnError | boolean | Sim | Se `true`, a função gera uma exceção em caso de erro. Se `false`, continua a execução normalmente mesmo com erro. |
| @response | variável | Sim | Variável que armazena o corpo da resposta da requisição. |
| @responseRowSet | variável | Sim | Variável que armazena a resposta como um rowset, incluindo os headers retornados. |
| headerName*N* | string | Não | Nome de um header adicional para incluir na requisição. |
| headerValue*N* | string | Não | Valor do header adicional correspondente. Você pode passar múltiplos pares nome-valor adicionando-os ao final da chamada da função. |

## Exemplo básico

Cenário: você está integrando com a API da **MegaStore** para registrar que um assinante optou por receber promoções de Black Friday. A API espera um JSON simples.

```ampscript
%%[
SET @url = "https://api.megastore.com.br/v1/optin"
SET @contentType = "application/json"
SET @payload = Concat('{"email":"', AttributeValue("EmailAddress"), '","campanha":"black-friday-2024","optinData":"', FormatDate(Now(), "dd/MM/yyyy"), '"}')

SET @callStatus = HTTPPost2(@url, @contentType, @payload, true, @response, @responseHeaders)
]%%
```

**Saída:**
```
A variável @callStatus armazena o código de status HTTP (ex: 200).
A variável @response armazena o corpo da resposta da API (ex: {"status":"ok","mensagem":"Opt-in registrado"}).
A variável @responseHeaders armazena os headers da resposta como um rowset.
```

## Exemplo avançado

Cenário: a **Conecta Telecom** precisa consultar o saldo de pontos de fidelidade de cada cliente via API antes de enviar um e-mail personalizado. A API requer autenticação via Bearer Token e um header customizado com o ID do parceiro. Se a chamada falhar, o e-mail exibe uma mensagem alternativa.

```ampscript
%%[
SET @cpf = AttributeValue("CPF")
SET @nomeCliente = AttributeValue("PrimeiroNome")
SET @apiUrl = "https://api.conectatelecom.com.br/v2/pontos/consulta"
SET @contentType = "application/json"
SET @payload = Concat('{"cpf":"', @cpf, '"}')
SET @token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

/* Chamada com headers adicionais: Authorization e X-Partner-ID */
SET @callStatus = HTTPPost2(
  @apiUrl,
  @contentType,
  @payload,
  false,
  @response,
  @responseHeaders,
  "Authorization", @token,
  "X-Partner-ID", "conecta-mktcloud-001"
)

IF @callStatus == 200 THEN
  /* Parseia a resposta JSON para extrair o saldo de pontos */
  SET @rows = BuildRowsetFromJSON(@response, "$", 0)
  SET @row = Row(@rows, 1)
  SET @saldoPontos = Field(@row, "saldoPontos")
  SET @valorEmReais = Field(@row, "valorEmReais")

  IF @saldoPontos > 5000 THEN
    SET @mensagem = Concat("Parabéns, ", @nomeCliente, "! 🎉 Você tem ", FormatNumber(@saldoPontos, "N0"), " pontos (equivalente a R$ ", FormatNumber(@valorEmReais, "N2"), "). Troque agora por descontos na sua próxima fatura!")
  ELSE
    SET @mensagem = Concat("Olá, ", @nomeCliente, "! Você tem ", FormatNumber(@saldoPontos, "N0"), " pontos. Continue acumulando para trocar por benefícios incríveis!")
  ENDIF
ELSE
  SET @mensagem = Concat("Olá, ", @nomeCliente, "! Acesse o app Conecta para consultar seu saldo de pontos e aproveitar ofertas exclusivas.")
ENDIF
]%%

%%=v(@mensagem)=%%
```

**Saída (para um cliente com 7.500 pontos):**
```
Parabéns, Carlos! 🎉 Você tem 7.500 pontos (equivalente a R$ 150,00). Troque agora por descontos na sua próxima fatura!
```

**Saída (em caso de erro na API):**
```
Olá, Carlos! Acesse o app Conecta para consultar seu saldo de pontos e aproveitar ofertas exclusivas.
```

## Observações

- **Portas:** funciona **apenas** com HTTP na porta 80 e HTTPS na porta 443. Qualquer porta fora do padrão faz a função falhar.
- **Diferença para HTTPPost:** a principal diferença da `HTTPPost2` em relação à [HTTPPost](../http-functions/httppost.md) é que ela retorna os **headers da resposta** no parâmetro `@responseRowSet`, permitindo inspecionar headers como `Location`, `Set-Cookie`, tokens, etc.
- **Encoding/charset:** a função respeita o charset definido no header `Content-Type` da resposta. Por exemplo, se a resposta vier com `Content-Type: application/json; charset=utf-8`, o conteúdo será interpretado como UTF-8. Se nenhum charset for especificado, o padrão é **Windows CodePage 1252**. Para alterar esse padrão, entre em contato com o suporte da Salesforce.
- **Headers que não podem ser alterados:** você **não pode** alterar os headers `Host` e `Content-Length` da requisição. O `Host` é sempre definido como o domínio da URL, e o `Content-Length` é calculado automaticamente com base no conteúdo enviado.
- **Tratamento de erros:** quando `boolExceptionOnError` é `true`, qualquer erro na requisição (timeout, URL inválida, status 4xx/5xx) gera uma exceção e interrompe a execução do código. Se `false`, a execução continua e você pode verificar o valor de `@callStatus` para tratar o erro manualmente — essa é geralmente a abordagem mais segura em e-mails.
- **Headers adicionais:** você pode passar quantos pares de header nome-valor quiser, adicionando-os ao final da chamada. Isso é ótimo para autenticação (Bearer Token, API Keys) e headers customizados.
- **Uso em e-mails vs CloudPages:** cuidado ao usar em e-mails — chamadas HTTP durante o envio podem impactar a performance se a API externa for lenta ou instável. Considere usar `false` para `boolExceptionOnError` em e-mails e sempre forneça conteúdo alternativo.
- **Timeouts:** chamadas HTTP no AMPscript têm um timeout padrão definido pela plataforma. APIs lentas podem causar falhas.
- **Segurança:** evite incluir tokens ou credenciais diretamente no código. Sempre que possível, armazene dados sensíveis em Data Extensions criptografadas ou utilize outras estratégias de gerenciamento de segredos.

## Funções relacionadas

- [HTTPPost](../http-functions/httppost.md) — Versão mais simples que envia POST sem retornar os headers da resposta em um rowset.
- [HTTPGet](../http-functions/httpget.md) — Faz requisições HTTP GET para buscar conteúdo de uma URL.
- [BuildRowsetFromJSON](../content-functions/buildrowsetfromjson.md) — Converte uma string JSON em um rowset, ideal para parsear respostas de APIs.
- [BuildRowsetFromXml](../content-functions/buildrowsetfromxml.md) — Converte uma string XML em um rowset, útil quando a API retorna XML.
- [TreatAsContent](../utility-functions/treatascontent.md) — Processa uma string como se fosse conteúdo AMPscript, útil para renderizar respostas dinâmicas.
- [RaiseError](../utility-functions/raiseerror.md) — Gera um erro personalizado, útil para tratamento de falhas em chamadas HTTP.
- [RedirectTo](../http-functions/redirectto.md) — Redireciona para uma URL, útil em CloudPages após processar uma resposta de API.
- [Concat](../string-functions/concat.md) — Concatena strings, muito usada para montar payloads JSON dinamicamente.
- [AttributeValue](../utility-functions/attributevalue.md) — Recupera valores de atributos do assinante de forma segura.