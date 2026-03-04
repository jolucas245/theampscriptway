---
title: BeforeHTTPGet
sidebar_label: BeforeHTTPGet
description: Executa uma requisição HTTP GET uma única vez no início do envio de e-mail, antes que qualquer subscriber receba a mensagem.
---

# BeforeHTTPGet

## Descrição

`BeforeHTTPGet` é um comando que prefixa o [HTTPGet](../http-functions/httpget.md) com a diretiva `Before;`, fazendo com que a requisição HTTP GET seja executada **uma única vez no início do job de envio**, antes de qualquer subscriber receber o e-mail. Isso é extremamente útil quando você precisa acionar um webhook, registrar um log ou buscar um conteúdo compartilhado que não precisa (e não deve) ser repetido para cada destinatário. Diferente do `HTTPGet` padrão, que roda uma vez por subscriber, o `BeforeHTTPGet` roda uma vez por envio.

## Sintaxe

```ampscript
%%Before;HTTPGet "url"%%
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| url | String | Sim | URL completa para a qual a requisição GET será feita. Deve estar entre aspas duplas. |

## Exemplo básico

Notificando um sistema externo da Lojas Vitória de que um envio de campanha foi iniciado:

```ampscript
%%Before;HTTPGet "https://api.lojasvitoria.com.br/webhook/envio-iniciado"%%
```

**Saída:**
```
(A requisição GET é feita uma única vez no início do envio. O conteúdo retornado pela URL, se houver, é renderizado nesse ponto do e-mail.)
```

## Exemplo avançado

Cenário de régua de relacionamento do Banco Brasilão: antes de enviar a campanha de aniversário para toda a base, o sistema externo é acionado para registrar o início do job e retornar um aviso legal atualizado que será exibido no rodapé de todos os e-mails.

```ampscript
%%[
VAR @avisoLegal
]%%

%%[ SET @avisoLegal = ]%%%%Before;HTTPGet "https://api.bancobrasilao.com.br/campanhas/aviso-legal"%%%%[ ]%%

%%[
/* O conteúdo do e-mail personalizado por subscriber continua normalmente */
VAR @nomeCliente
SET @nomeCliente = AttributeValue("PrimeiroNome")
]%%

Olá, %%=v(@nomeCliente)=%%!

Parabéns pelo seu aniversário! 🎂

%%=v(@avisoLegal)=%%
```

**Saída:**
```
Olá, Maria!

Parabéns pelo seu aniversário! 🎂

Banco Brasilão S.A. – CNPJ 00.000.000/0001-00. Ouvidoria: 0800 123 4567.
```

## Observações

> **⚠️ Atenção:** O `BeforeHTTPGet` é executado **uma única vez por job de envio**, não uma vez por destinatário. Se você precisa fazer uma chamada HTTP para cada subscriber individualmente, use o [HTTPGet](../http-functions/httpget.md) padrão.

- Este é um **comando**, não uma função. A sintaxe usa `%%Before;HTTPGet "url"%%` diretamente no corpo do e-mail, e não dentro de um bloco `%%[ ]%%` com `SET`.

- Cenários típicos de uso incluem: acionar webhooks de início de campanha, registrar logs em sistemas externos, buscar conteúdo compartilhado (avisos legais, banners dinâmicos) que seja o mesmo para todos os destinatários, e disparar processos de pré-envio em plataformas integradas.

> **💡 Dica:** Se você precisa executar uma ação uma vez **após** o envio (depois que o último subscriber for processado), confira o [AfterHTTPGet](../http-functions/afterhttpget.md). Combinando `BeforeHTTPGet` e `AfterHTTPGet`, você consegue criar um fluxo completo de notificação para sistemas externos — marcando início e fim da campanha.

## Funções relacionadas

- [HTTPGet](../http-functions/httpget.md) — requisição GET executada uma vez por subscriber
- [AfterHTTPGet](../http-functions/afterhttpget.md) — requisição GET executada uma vez ao final do envio
- [HTTPGetWrap](../http-functions/httpgetwrap.md) — requisição GET com quebra de linha automática
- [HTTPPost](../http-functions/httppost.md) — requisição POST para envio de dados a endpoints externos
- [HTTPRequestHeader](../http-functions/httprequestheader.md) — define headers customizados para requisições HTTP