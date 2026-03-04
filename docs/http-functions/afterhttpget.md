---
title: AfterHTTPGet
sidebar_label: AfterHTTPGet
description: Envia uma requisição GET para uma URL especificada após a conclusão do job de envio de e-mail, funcionando como um webhook de finalização.
---

# AfterHTTPGet

## Descrição

`AfterHTTPGet` é um **comando** (não uma função) que dispara uma requisição HTTP GET para uma URL especificada **somente após a conclusão do job de envio de e-mail**. Ele funciona como um webhook para notificar sistemas externos de que um envio foi finalizado — ideal para acionar fluxos de pós-envio como atualização de dashboards, disparo de relatórios ou sincronização com sistemas internos. O comando não gera nenhum conteúdo visível no corpo do e-mail.

## Sintaxe

```ampscript
%%After;HTTPGet "url"%%
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| url | String | Sim | URL completa para a qual a requisição GET será enviada após a conclusão do job de envio. |

## Exemplo básico

Notificando um endpoint interno da Lojas Vitória quando o envio da campanha promocional terminar:

```ampscript
%%After;HTTPGet "https://api.lojasvitoria.com.br/webhook/envio-concluido"%%
```

**Saída:**
```
(nenhum conteúdo é exibido no e-mail)
```

## Exemplo avançado

Acionando um webhook que registra a conclusão do envio da campanha Black Friday da MegaStore, combinando a URL com parâmetros via [Concat](../string-functions/concat.md):

```ampscript
%%[
VAR @urlWebhook
SET @urlWebhook = Concat("https://api.megastore.com.br/webhook/campanha-finalizada?campanha=", URLEncode("black-friday-2024"), "&tipo=email")
]%%

%%After;HTTPGet %%=v(@urlWebhook)=%%%%
```

**Saída:**
```
(nenhum conteúdo é exibido no e-mail — a requisição GET será enviada para a URL montada somente após o job de envio ser concluído)
```

## Observações

> **⚠️ Atenção:** O `AfterHTTPGet` **não pode ser usado com Triggered Sends (envios disparados)**. Isso acontece porque um job de Triggered Send não se encerra após enviar um único e-mail — ele permanece ativo aguardando futuros disparos. Como o comando depende da finalização do job, ele simplesmente nunca seria executado nesse contexto.

- Este é um **comando**, não uma função. A sintaxe usa o prefixo `After;` antes do `HTTPGet`, separado por ponto e vírgula.
- Nenhum conteúdo é renderizado no e-mail. O comando é completamente invisível para o destinatário.
- Use-o em **User-Initiated Sends** ou **Scheduled Sends**, onde o job tem um ciclo de vida definido com início e fim.

> **💡 Dica:** Esse comando é muito útil para cenários de automação pós-envio no mercado brasileiro — por exemplo, notificar um sistema de BI interno que a régua de relacionamento finalizou o disparo, ou acionar um processo de conciliação de dados após uma campanha promocional sazonal.

## Funções relacionadas

- [HTTPGet](../http-functions/httpget.md) — faz a requisição GET durante o processamento do e-mail (no momento do envio)
- [BeforeHTTPGet](../http-functions/beforehttpget.md) — faz a requisição GET antes do início do job de envio
- [HTTPPost](../http-functions/httppost.md) — envia requisições POST para URLs externas
- [HTTPRequestHeader](../http-functions/httprequestheader.md) — define headers personalizados para requisições HTTP
- [Concat](../string-functions/concat.md) — útil para montar URLs dinâmicas com parâmetros
- [URLEncode](../string-functions/urlencode.md) — codifica valores para uso seguro em URLs