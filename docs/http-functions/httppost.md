---
title: HTTPPost
sidebar_label: HTTPPost
description: Envia uma requisição HTTP POST para uma URL especificada, permitindo integrar o SFMC com APIs e serviços externos.
---

# HTTPPost

## Descrição

Envia conteúdo via requisição HTTP POST para uma URL especificada. É uma das funções mais usadas para integrar o Marketing Cloud com sistemas externos - APIs de CRM, plataformas de e-commerce, serviços de enriquecimento de dados, webhooks e qualquer endpoint que aceite POST. A função armazena o código de status HTTP da resposta em uma variável de saída, permitindo que você verifique se a chamada foi bem-sucedida.

## Sintaxe

```ampscript
HTTPPost(@urlEndpoint, @contentTypeHeader, @contentToPost, @response, @headerName1, @headerValue1)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| urlEndpoint | string | Sim | URL de destino para onde o conteúdo será enviado via POST. |
| contentTypeHeader | string | Sim | Header de content-type usado na requisição POST (ex: `application/json`, `application/x-www-form-urlencoded`). |
| contentToPost | string | Sim | O conteúdo que será enviado no corpo da requisição POST. |
| response | string | Sim | Parâmetro de saída que recebe o status da requisição POST. |
| headerName1 | string | Não | Nome de um header adicional para incluir na requisição. |
| headerValue1 | string | Não | Valor do header adicional correspondente. Você pode passar múltiplos pares nome-valor adicionando-os ao final da chamada (headerName2, headerValue2...). |

## Exemplo básico

Envio de um objeto JSON simples com dados de um cliente para uma API de cadastro da Lojas Vitória:

```ampscript
%%[

SET @endpoint = "https://api.lojasvitoria.com.br/clientes"
SET @contentType = "application/json"
SET @payload = '{"nome": "João Silva", "email": "joao.silva@email.com.br", "cidade": "São Paulo"}'

SET @callStatus = HTTPPost(@endpoint, @contentType, @payload, @response)

]%%
```

**Saída:**
```
200
```

## Exemplo avançado

Cenário de régua de relacionamento: ao enviar um e-mail de boas-vindas, a função notifica a API interna do Banco Brasilão com os dados do novo correntista, incluindo um token de autenticação no header:

```ampscript
%%[

SET @nome = AttributeValue("NomeCliente")
SET @cpf = AttributeValue("CPF")
SET @email = AttributeValue("EmailAddress")
SET @dataCadastro = FormatDate(Now(), "dd/MM/yyyy")

SET @endpoint = "https://api.bancobrasilao.com.br/v1/onboarding/notificacao"
SET @contentType = "application/json"

SET @payload = Concat('{"nome": "', @nome, '", "cpf": "', @cpf, '", "email": "', @email, '", "data_envio_boasvindas": "', @dataCadastro, '", "canal": "email"}')

SET @callStatus = HTTPPost(@endpoint, @contentType, @payload, @response, "Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...", "X-Request-Source", "sfmc-journey")

IF @callStatus == "200" THEN
  SET @statusMsg = "Notificação enviada com sucesso"
ELSE
  SET @statusMsg = Concat("Falha na notificação. Status: ", @callStatus)
ENDIF

]%%
```

**Saída:**
```
Notificação enviada com sucesso
```

## Observações

> **⚠️ Atenção:** A função funciona **apenas** com HTTP na porta 80 e HTTPS na porta 443. Portas não padrão fazem a função falhar. Se a sua API interna usa portas customizadas (como 8080 ou 3000), será necessário configurar um proxy ou ajustar a infraestrutura antes de usar o `HTTPPost`.

> **⚠️ Atenção:** Você **não pode** definir os headers `host` e `content-length` nas requisições enviadas por essa função. O valor de `host` é sempre definido automaticamente como o domínio da URL de destino, e o `content-length` é calculado com base no tamanho do conteúdo enviado.

> **💡 Dica:** A função respeita o charset retornado no header `content-type` da resposta. Se você trabalha com APIs que retornam caracteres especiais (acentos, cedilha - comuns no português), certifique-se de que o endpoint retorne `Content-Type: application/json; charset=utf-8` no header. Caso o header não especifique encoding, o SFMC assume WindowsCodePage 1252 como padrão. Para alterar esse comportamento padrão, entre em contato com o suporte Salesforce.

> **💡 Dica:** Você pode incluir quantos pares nome-valor de headers adicionais forem necessários, bastando adicioná-los ao final da chamada. Isso é útil para enviar tokens de autenticação, headers customizados de rastreamento ou identificadores de origem.

> **💡 Dica:** A função armazena o código de status HTTP na variável de saída. Use essa informação para criar lógicas condicionais - por exemplo, registrar falhas em uma Data Extension de log usando [InsertDE](../data-extension-functions/insertde.md) quando o status for diferente de 200.

## Funções relacionadas

- [HTTPPost2](../http-functions/httppost2.md) - variação do HTTPPost com parâmetros adicionais de saída
- [HTTPPostWithRetry](../http-functions/httppostwithretry.md) - versão com mecanismo de retentativa automática
- [HTTPGet](../http-functions/httpget.md) - para requisições GET a URLs externas
- [HTTPRequestHeader](../http-functions/httprequestheader.md) - para ler headers da requisição recebida
- [Concat](../string-functions/concat.md) - essencial para montar payloads dinâmicos
- [RedirectTo](../http-functions/redirectto.md) - para redirecionamentos em CloudPages