---
title: IsChtmlBrowser
sidebar_label: IsChtmlBrowser
description: Verifica se o user-agent de um dispositivo corresponde a um navegador CHTML (Compact HTML), retornando true ou false.
---

# IsChtmlBrowser

## Descrição

A função `IsChtmlBrowser()` analisa uma string de user-agent HTTP e retorna um valor booleano indicando se o dispositivo é um navegador CHTML (Compact HTML). CHTML é uma variante simplificada do HTML que foi criada para celulares antigos (feature phones), smartphones primitivos e PDAs, pensada para telas pequenas com recursos limitados. Essa função era usada em landing pages para decidir se o conteúdo exibido deveria ser HTML padrão ou CHTML. O padrão CHTML foi substituído no início dos anos 2000 e hoje é raramente utilizado — essa função existe basicamente por razões históricas.

## Sintaxe

```ampscript
IsChtmlBrowser(userAgentHeader)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| userAgentHeader | String | Sim | String contendo o cabeçalho HTTP user-agent do dispositivo que você quer verificar. |

## Exemplo básico

Neste exemplo, passamos uma string de user-agent de um navegador moderno para verificar se ele é CHTML. Como é um navegador desktop atual, o resultado será `false`.

```ampscript
%%[
VAR @userAgent, @isChtml

SET @userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
SET @isChtml = IsChtmlBrowser(@userAgent)
]%%

O navegador é CHTML? %%=v(@isChtml)=%%
```

**Saída:**
```
O navegador é CHTML? false
```

## Exemplo avançado

Aqui temos um cenário mais realista numa CloudPage da **Conecta Telecom**. A função `HttpRequestHeader()` captura o user-agent real do visitante, e com base no resultado de `IsChtmlBrowser()`, exibimos conteúdo adequado ao dispositivo — seja uma versão simplificada para CHTML ou a versão completa com promoções.

```ampscript
%%[
VAR @userAgent, @isChtml, @conteudo

SET @userAgent = HTTPRequestHeader("User-Agent")
SET @isChtml = IsChtmlBrowser(@userAgent)

IF @isChtml == "true" THEN
  SET @conteudo = "Conecta Telecom - Planos a partir de R$ 49,90/mes. Ligue 0800 123 4567."
ELSE
  SET @conteudo = Concat("<h1>Conecta Telecom</h1>", "<p>Aproveite nossos planos de internet fixa e móvel!</p>", "<p><strong>Plano Turbo 300MB:</strong> R$ 99,90/mês</p>", "<p><strong>Plano Família 500MB:</strong> R$ 149,90/mês</p>", "<p>Frete grátis no chip acima de R$ 299 em acessórios. Use o cupom <strong>CONECTA10</strong> para 10% OFF!</p>", "<a href='https://www.conectatelecom.com.br/planos'>Ver todos os planos</a>")
ENDIF
]%%

%%=v(@conteudo)=%%
```

**Saída (navegador moderno):**
```html
<h1>Conecta Telecom</h1>
<p>Aproveite nossos planos de internet fixa e móvel!</p>
<p><strong>Plano Turbo 300MB:</strong> R$ 99,90/mês</p>
<p><strong>Plano Família 500MB:</strong> R$ 149,90/mês</p>
<p>Frete grátis no chip acima de R$ 299 em acessórios. Use o cupom <strong>CONECTA10</strong> para 10% OFF!</p>
<a href='https://www.conectatelecom.com.br/planos'>Ver todos os planos</a>
```

**Saída (navegador CHTML):**
```
Conecta Telecom - Planos a partir de R$ 49,90/mes. Ligue 0800 123 4567.
```

## Observações

- **⚠️ Função obsoleta na prática:** O padrão CHTML foi abandonado no início dos anos 2000. É extremamente improvável que você encontre um dispositivo CHTML em cenários modernos de marketing digital. Essa documentação é mantida por razões históricas.
- **Contexto de uso:** Essa função foi projetada para uso em **landing pages** (CloudPages / Microsites). Em emails, o user-agent do assinante não está disponível no momento do envio, então a função não faz sentido nesse contexto.
- **Combinação com `HTTPRequestHeader()`:** Para capturar o user-agent real do visitante em tempo de execução, use `HTTPRequestHeader("User-Agent")` e passe o resultado para `IsChtmlBrowser()`.
- **Retorno:** A função retorna `true` se o user-agent corresponder a um navegador CHTML, e `false` caso contrário.
- **Alternativas modernas:** Para detecção de dispositivos hoje em dia, considere usar CSS responsivo (media queries) ou JavaScript para adaptar o conteúdo. AMPscript não oferece uma função nativa robusta para detectar dispositivos móveis modernos.

## Funções relacionadas

- [RequestHeader](../http-functions/requestheader.md) — Recupera o valor de um cabeçalho HTTP da requisição atual
- [HTTPGet](../http-functions/httpget.md) — Faz uma requisição HTTP GET para uma URL
- [RedirectTo](../http-functions/redirectto.md) — Redireciona o usuário para uma URL específica
- [CloudPagesURL](../sites-functions/cloudpagesurl.md) — Gera uma URL segura para uma CloudPage
- [RequestParameter](../sites-functions/requestparameter.md) — Recupera o valor de um parâmetro da requisição atual
- [IIF](../utility-functions/iif.md) — Retorna um valor baseado numa condição (alternativa inline ao IF/ELSE)
- [Concat](../string-functions/concat.md) — Concatena múltiplas strings em uma só