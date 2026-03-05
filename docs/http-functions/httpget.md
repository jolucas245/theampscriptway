---
title: HTTPGet
sidebar_label: HTTPGet
description: Faz uma requisição HTTP GET para uma URL e retorna o conteúdo da resposta.
---

# HTTPGet

## Descrição

A função `HTTPGet` faz uma requisição GET para uma URL e retorna o conteúdo da resposta. É muito usada no dia a dia de SFMC para buscar dados dinâmicos de APIs externas - como informações de produto, status de pedido, cotações ou qualquer conteúdo que precise ser injetado em tempo real num e-mail ou CloudPage. Se a URL for a mesma para múltiplos subscribers num envio, o Marketing Cloud faz apenas uma chamada e usa o cache da resposta para os demais.

## Sintaxe

```ampscript
HTTPGet(httpGetUrl [, boolContinueOnError] [, enumAllowEmptyContent] [, functionStatusOutput])
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| httpGetUrl | String | Sim | A URL onde a requisição GET será executada. |
| boolContinueOnError | Boolean | Não | Se `true`, a função ignora erros encontrados durante a execução. Se `false`, a função para ao encontrar um erro. O valor padrão é `false`. |
| enumAllowEmptyContent | Integer | Não | Define como a função lida com conteúdo vazio. `0`: permite conteúdo vazio (padrão). `1`: retorna erro ao encontrar conteúdo vazio. `2`: pula o envio do e-mail para o subscriber quando usado em e-mail. |
| functionStatusOutput | Integer | Não | Variável que recebe o status da execução. `0`: função completou com sucesso. `-1`: falhou porque a URL não foi encontrada. `-2`: falhou por erro na requisição HTTP. `-3`: completou com sucesso mas não retornou conteúdo. |

## Exemplo básico

Buscando o conteúdo de uma página da Lojas Vitória para exibir informações dinâmicas num e-mail:

```ampscript
%%[
SET @conteudo = HTTPGet("https://api.lojasvitoria.com.br/promocao-do-dia")
]%%

%%=v(@conteudo)=%%
```

**Saída:**
```
{"produto":"Cafeteira Elétrica","preco":"R$ 189,90","validade":"31/12/2024"}
```

## Exemplo avançado

Consultando uma API de status de pedido para personalizar um e-mail de acompanhamento na régua de relacionamento, com tratamento de erro para garantir que o subscriber não receba um e-mail quebrado:

```ampscript
%%[
SET @cpf = AttributeValue("CPF")
SET @numeroPedido = AttributeValue("NumeroPedido")

SET @url = Concat("https://api.megastore.com.br/pedidos/", @numeroPedido, "?cpf=", URLEncode(@cpf))

SET @resposta = HTTPGet(@url, true, 0, @callStatus)

IF @callStatus == 0 THEN
  SET @mensagem = Concat("Olá! Aqui está a atualização do seu pedido #", @numeroPedido, ":")
ELSEIF @callStatus == -1 THEN
  SET @mensagem = "Não conseguimos localizar seu pedido no momento. Entre em contato pelo (11) 3000-1234."
ELSEIF @callStatus == -2 THEN
  SET @mensagem = "Estamos com uma instabilidade temporária. Tente consultar seu pedido em megastore.com.br."
ELSEIF @callStatus == -3 THEN
  SET @mensagem = "Seu pedido está sendo processado. Em breve você terá novidades!"
ENDIF
]%%

%%=v(@mensagem)=%%

%%[ IF @callStatus == 0 THEN ]%%
  %%=v(@resposta)=%%
%%[ ENDIF ]%%
```

**Saída (sucesso):**
```
Olá! Aqui está a atualização do seu pedido #98234:
{"status":"Em transporte","previsao":"28/07/2025","transportadora":"Correios"}
```

**Saída (URL não encontrada):**
```
Não conseguimos localizar seu pedido no momento. Entre em contato pelo (11) 3000-1234.
```

## Observações

> **⚠️ Atenção:** A função funciona **apenas** com HTTP na porta 80 e HTTPS na porta 443. Portas não padrão fazem a função falhar. Se sua API interna roda em porta customizada (tipo 8080), você vai precisar de um proxy ou ajuste na infraestrutura.

> **⚠️ Atenção:** Em contas mais antigas, o Marketing Cloud assume que os dados retornados usam o charset **Windows CodePage 1252**. Contas criadas recentemente usam **UTF-8**. Se você está numa conta antiga e recebe caracteres estranhos (acentos quebrados - muito comum com dados em português), entre em contato com o suporte Salesforce para alterar o padrão.

> **💡 Dica:** Quando a URL é idêntica para vários subscribers num mesmo envio, o Marketing Cloud faz apenas **uma chamada** e reutiliza o cache. Isso é ótimo para conteúdo genérico (promoção do dia, banner), mas se você precisa de dados individualizados por subscriber, inclua um identificador na URL (como CPF ou ID do cliente) para que cada chamada seja única.

> **💡 Dica:** Use o parâmetro `enumAllowEmptyContent` com valor `2` quando for crítico que o subscriber não receba um e-mail vazio ou quebrado - com essa opção, o envio é simplesmente pulado para aquele subscriber se a API não retornar conteúdo.

## Funções relacionadas

- [HTTPPost](../http-functions/httppost.md) - para enviar dados via POST em vez de apenas consultar.
- [HTTPPost2](../http-functions/httppost2.md) - variação do POST com parâmetros adicionais.
- [HTTPRequestHeader](../http-functions/httprequestheader.md) - para definir headers customizados nas requisições HTTP.
- [URLEncode](../string-functions/urlencode.md) - para codificar parâmetros na URL corretamente.
- [Concat](../string-functions/concat.md) - para montar URLs dinâmicas concatenando strings.
- [TreatAsContent](../utility-functions/treatascontent.md) - para processar o conteúdo retornado que contenha AMPscript.
- [BuildRowsetFromJson](../content-functions/buildrowsetfromjson.md) - para parsear respostas JSON retornadas pela API.
- [BuildRowsetFromXml](../content-functions/buildrowsetfromxml.md) - para parsear respostas XML retornadas pela API.
- [RedirectTo](../http-functions/redirectto.md) - para redirecionar o subscriber para uma URL.