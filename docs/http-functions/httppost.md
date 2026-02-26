---
title: HTTPPost
sidebar_label: HTTPPost
description: Envia uma requisição HTTP POST para uma URL especificada, permitindo integrar o Marketing Cloud com APIs e serviços externos.
---

# HTTPPost

## Descrição

A função `HTTPPost` envia uma requisição HTTP POST para uma URL que você especificar, com o conteúdo e headers que você definir. É uma das funções mais poderosas do AMPscript porque permite integrar o Marketing Cloud com praticamente qualquer API ou serviço externo — como sistemas de CRM, plataformas de e-commerce, gateways de pagamento, webhooks e muito mais. A função retorna o conteúdo da resposta em uma variável de saída e armazena o código de status HTTP (como `200`, `201`, `400`, etc.) na variável de retorno. Funciona apenas com HTTP na porta 80 e HTTPS na porta 443.

## Sintaxe

```ampscript
HTTPPost(urlEndpoint, contentTypeHeader, contentToPost, @response [, headerName1, headerValue1, headerName2, headerValue2, ...])
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| urlEndpoint | String | Sim | A URL para onde o conteúdo será enviado via POST. |
| contentTypeHeader | String | Sim | O valor do header `Content-Type` da requisição (ex: `application/json`, `application/x-www-form-urlencoded`). |
| contentToPost | String | Sim | O conteúdo (body) a ser enviado na requisição POST. |
| @response | String | Sim | Parâmetro de saída — variável que vai receber o conteúdo da resposta retornada pela URL. |
| headerName1 | String | Não | Nome de um header adicional a ser incluído na requisição. |
| headerValue1 | String | Não | Valor do header adicional correspondente. |

Você pode passar quantos pares de header name/value precisar, basta ir adicionando ao final da chamada (`headerName2`, `headerValue2`, `headerName3`, `headerValue3`...).

## Exemplo básico

Neste exemplo, enviamos um JSON simples para um webhook notificando que um assinante abriu um e-mail promocional:

```ampscript
%%[
SET @emailAssinante = AttributeValue("EmailAddress")
SET @nomeAssinante = AttributeValue("FirstName")

SET @payload = Concat('{"email":"', @emailAssinante, '","nome":"', @nomeAssinante, '","evento":"abertura_email","campanha":"black_friday_2024"}')

SET @statusCode = HTTPPost(
  "https://api.lojasvitoria.com.br/webhook/email-eventos",
  "application/json",
  @payload,
  @resposta
)
]%%
```

**Saída:**

A variável `@statusCode` recebe o código HTTP retornado (ex: `200`), e `@resposta` recebe o corpo da resposta do servidor, como por exemplo:

```
{"status":"ok","mensagem":"Evento registrado com sucesso"}
```

## Exemplo avançado

Cenário real: uma CloudPage de cadastro em programa de fidelidade da "FarmaRede". Quando o cliente preenche o formulário, os dados são enviados via POST para a API interna do programa de pontos, incluindo headers de autenticação. Depois, o resultado é salvo em uma Data Extension:

```ampscript
%%[
SET @nome = RequestParameter("nome")
SET @cpf = RequestParameter("cpf")
SET @email = RequestParameter("email")
SET @telefone = RequestParameter("telefone")
SET @cep = RequestParameter("cep")

/* Monta o payload JSON com os dados do cliente */
SET @payload = Concat(
  '{',
  '"nome":"', Replace(@nome, '"', '\"'), '",',
  '"cpf":"', @cpf, '",',
  '"email":"', @email, '",',
  '"telefone":"', @telefone, '",',
  '"cep":"', @cep, '",',
  '"programa":"pontos_farmarede",',
  '"pontos_iniciais":500,',
  '"data_cadastro":"', Format(Now(), "dd/MM/yyyy HH:mm:ss"), '"',
  '}'
)

/* Envia para a API do programa de fidelidade com header de autenticação */
SET @statusCode = HTTPPost(
  "https://api.farmarede.com.br/v2/fidelidade/cadastro",
  "application/json",
  @payload,
  @resposta,
  "Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "X-Request-Source", "sfmc-cloudpage"
)

IF @statusCode == 200 OR @statusCode == 201 THEN
  /* Cadastro realizado com sucesso — salva na DE de controle */
  InsertDE(
    "Cadastros_Fidelidade",
    "Email", @email,
    "Nome", @nome,
    "CPF", @cpf,
    "Telefone", @telefone,
    "CEP", @cep,
    "StatusAPI", "sucesso",
    "CodigoHTTP", @statusCode,
    "DataCadastro", Now()
  )
]%%

<div class="sucesso">
  <h2>Parabéns, %%=v(@nome)=%%! 🎉</h2>
  <p>Você foi cadastrado no <strong>Programa Pontos FarmaRede</strong> com sucesso!</p>
  <p>Já creditamos <strong>500 pontos de boas-vindas</strong> na sua conta.</p>
  <p>Acumule pontos em todas as compras e troque por descontos de até R$ 150,00!</p>
</div>

%%[
ELSE
  /* Erro no cadastro — registra para análise */
  InsertDE(
    "Cadastros_Fidelidade",
    "Email", @email,
    "Nome", @nome,
    "CPF", @cpf,
    "Telefone", @telefone,
    "CEP", @cep,
    "StatusAPI", "erro",
    "CodigoHTTP", @statusCode,
    "RespostaAPI", @resposta,
    "DataCadastro", Now()
  )
]%%

<div class="erro">
  <h2>Ops, algo deu errado 😕</h2>
  <p>Não conseguimos finalizar seu cadastro agora. Por favor, tente novamente em alguns minutos.</p>
  <p>Se o problema persistir, entre em contato pelo telefone (11) 3000-1234.</p>
</div>

%%[
ENDIF
]%%
```

**Saída (em caso de sucesso):**

```html
<div class="sucesso">
  <h2>Parabéns, Maria Santos! 🎉</h2>
  <p>Você foi cadastrado no <strong>Programa Pontos FarmaRede</strong> com sucesso!</p>
  <p>Já creditamos <strong>500 pontos de boas-vindas</strong> na sua conta.</p>
  <p>Acumule pontos em todas as compras e troque por descontos de até R$ 150,00!</p>
</div>
```

## Observações

- **Portas:** Funciona **somente** com HTTP na porta 80 e HTTPS na porta 443. Se a URL usar uma porta diferente (ex: `https://api.exemplo.com.br:8443`), a função vai falhar.
- **Headers que você NÃO pode definir:** Os headers `Host` e `Content-Length` são definidos automaticamente pelo Marketing Cloud. O `Host` é sempre o domínio da URL de destino e o `Content-Length` é sempre o tamanho do conteúdo enviado. Se você tentar defini-los manualmente, serão ignorados.
- **Encoding/charset:** A função respeita o charset retornado no header `Content-Type` da resposta. Por exemplo, se o servidor retornar `Content-Type: application/json; charset=utf-8`, a resposta será tratada como UTF-8. Se o header da resposta não especificar encoding, o padrão assumido é **Windows CodePage 1252**. Para alterar esse padrão, é necessário entrar em contato com o suporte da Salesforce.
- **Valor de retorno:** A função retorna o código de status HTTP (ex: `200`, `201`, `400`, `500`) como valor de retorno. O conteúdo da resposta do servidor é armazenado na variável de saída `@response`.
- **Headers adicionais:** Você pode incluir quantos pares de nome/valor de headers adicionais precisar. Isso é muito útil para enviar tokens de autenticação (`Authorization`), chaves de API (`X-Api-Key`), ou qualquer outro header customizado.
- **Diferença para HTTPPost2:** Se você precisa enviar dados como pares chave-valor (formulário), dê uma olhada na [HTTPPost2](../http-functions/httppost2.md), que tem uma assinatura diferente e facilita esse cenário.
- **Timeout e performance:** Chamadas HTTP externas podem impactar o tempo de renderização de e-mails e CloudPages. Se a API de destino estiver lenta ou fora do ar, isso pode causar falhas. Considere usar a variante `HTTPPostWithRetry` quando disponível para cenários críticos.
- **Contexto de uso:** Funciona em e-mails, CloudPages, SMS (Landing Pages) e em automações via Script Activities. Tenha cuidado ao usar em e-mails com envios em massa — cada envio gerará uma chamada HTTP individual, o que pode sobrecarregar a API de destino.
- **Segurança:** Evite colocar tokens e credenciais diretamente no código. Quando possível, armazene-os em Data Extensions com acesso restrito e recupere com [Lookup](../data-extension-functions/lookup.md).

## Funções relacionadas

- [HTTPPost2](../http-functions/httppost2.md) — Envia POST com pares chave-valor separados ao invés de body livre, útil para formulários e APIs que esperam campos individuais.
- [HTTPGet](../http-functions/httpget.md) — Faz requisições HTTP GET para buscar conteúdo de URLs externas.
- [Concat](../string-functions/concat.md) — Essencial para montar payloads JSON e strings dinâmicas para o corpo da requisição.
- [Replace](../string-functions/replace.md) — Útil para escapar caracteres especiais no conteúdo do POST.
- [BuildRowsetFromJson](../content-functions/buildrowsetfromjson.md) — Permite fazer o parse da resposta JSON retornada pela API.
- [TreatAsContent](../utility-functions/treatascontent.md) — Processa a resposta como conteúdo AMPscript, caso o retorno contenha código renderizável.
- [RaiseError](../utility-functions/raiseerror.md) — Útil para interromper o processamento caso a chamada HTTP falhe.
- [InsertDE](../data-extension-functions/insertde.md) — Para registrar logs e resultados das chamadas HTTP em Data Extensions.
- [RedirectTo](../http-functions/redirectto.md) — Para redirecionar o usuário após uma chamada POST em CloudPages.
- [RequestParameter](../sites-functions/requestparameter.md) — Para capturar dados de formulários em CloudPages antes de enviá-los via HTTPPost.