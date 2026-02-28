---
title: AfterHTTPGet
sidebar_label: AfterHTTPGet
description: Processa e manipula o conteúdo retornado por uma chamada HTTPGet, permitindo transformar a resposta após a requisição ser concluída.
---

<!-- generated-by-script -->

# AfterHTTPGet

## Descrição

A função `AfterHTTPGet` é usada em conjunto com a função `HTTPGet` para processar o conteúdo retornado por uma requisição HTTP GET **após** a resposta ser recebida. Ela funciona como um handler (manipulador) pós-requisição, permitindo que você aplique transformações ou lógica no conteúdo obtido. Essa função faz parte de um trio com `BeforeHTTPGet` e `HTTPGet`, onde cada uma atua em uma etapa diferente do ciclo de vida da requisição.

> **Nota importante:** A documentação oficial da Salesforce para esta função retorna um erro 404, o que indica que ela pode estar **descontinuada**, ter cobertura documental limitada ou ser uma função legada com suporte reduzido. As informações aqui apresentadas são baseadas no conhecimento disponível da comunidade e no comportamento observado dentro do ecossistema SFMC. Use com cautela e teste extensivamente antes de implementar em produção.

## Sintaxe

```ampscript
AfterHTTPGet(conteudo)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| conteudo | String | Sim | O conteúdo (string) retornado pela chamada HTTPGet que será processado após a requisição. |

## Exemplo básico

```ampscript
%%[
/* Busca conteúdo de uma API externa de ofertas */
SET @urlOfertas = "https://api.megastore.com.br/ofertas/destaque"
SET @resposta = HTTPGet(@urlOfertas)

/* Processa o conteúdo após a requisição */
SET @conteudoProcessado = AfterHTTPGet(@resposta)
]%%

%%=v(@conteudoProcessado)=%%
```

**Saída:**
```
(O conteúdo retornado pela URL após o processamento pós-requisição)
```

## Exemplo avançado

```ampscript
%%[
/*
  Cenário: A Lojas Vitória puxa um bloco de HTML com ofertas
  personalizadas de Dia das Mães a partir de um endpoint externo,
  e depois processa o resultado para inserir no e-mail.
*/

SET @emailAssinante = AttributeValue("EmailAddress")
SET @nomeAssinante = AttributeValue("FirstName")

IF Empty(@nomeAssinante) THEN
  SET @nomeAssinante = "Cliente"
ENDIF

/* Monta a URL com parâmetro do assinante */
SET @urlBase = "https://www.lojasvitoria.com.br/api/ofertas-diadasmaes"
SET @urlCompleta = Concat(@urlBase, "?email=", URLEncode(@emailAssinante))

/* Faz a requisição GET */
SET @respostaHTML = HTTPGet(@urlCompleta)

/* Aplica processamento pós-requisição */
SET @conteudoFinal = AfterHTTPGet(@respostaHTML)

/* Verifica se o conteúdo voltou vazio */
IF Empty(@conteudoFinal) THEN
  SET @conteudoFinal = Concat("<p>Olá, ", @nomeAssinante, "! Confira nossas ofertas de Dia das Mães com frete grátis acima de R$299!</p>")
ENDIF
]%%

<h2>Olá, %%=v(@nomeAssinante)=%%!</h2>
<div class="ofertas-dia-das-maes">
  %%=v(@conteudoFinal)=%%
</div>
```

**Saída:**
```html
<h2>Olá, Maria!</h2>
<div class="ofertas-dia-das-maes">
  (Conteúdo HTML das ofertas retornado pela API da Lojas Vitória, ou o fallback caso vazio)
</div>
```

## Observações

- ⚠️ **Documentação oficial indisponível:** A página oficial da Salesforce para `AfterHTTPGet` retorna erro 404. Isso pode indicar que a função está **descontinuada ou com suporte limitado**. Recomenda-se fortemente usar `HTTPGet` diretamente e processar a resposta com funções padrão como [Replace](../string-functions/replace.md), [Substring](../string-functions/substring.md), [BuildRowsetFromJson](../content-functions/buildrowsetfromjson.md) ou [BuildRowsetFromXml](../content-functions/buildrowsetfromxml.md).
- A função faz parte de um conjunto de três funções relacionadas ao ciclo de vida de uma requisição GET: `BeforeHTTPGet` (pré-processamento), `HTTPGet` (execução) e `AfterHTTPGet` (pós-processamento).
- Se o conteúdo retornado pelo `HTTPGet` for nulo ou vazio, o comportamento de `AfterHTTPGet` pode ser imprevisível. Sempre valide a resposta com [Empty](../utility-functions/empty.md) ou [IsNull](../utility-functions/isnull.md) antes de processar.
- Assim como `HTTPGet`, esta função está sujeita a **timeouts** e **limites de tamanho de resposta** impostos pelo SFMC. Respostas muito grandes podem ser truncadas.
- Em contextos de e-mail (envio em larga escala), chamadas HTTP externas podem impactar significativamente o tempo de processamento. Use com moderação e considere cachear dados em Data Extensions quando possível.
- Para cenários mais modernos e robustos de integração HTTP, considere usar **SSJS (Server-Side JavaScript)** com `HTTP.Get()`, que oferece melhor controle sobre headers, status codes e tratamento de erros.

## Funções relacionadas

- [HTTPGet](../http-functions/httpget.md) — Realiza a requisição HTTP GET e retorna o conteúdo da URL especificada
- [BeforeHTTPGet](../http-functions/beforehttpget.md) — Processa ou configura algo antes da execução de uma chamada HTTPGet
- [HTTPGetWrap](../http-functions/httpgetwrap.md) — Versão do HTTPGet que encapsula o conteúdo retornado com tratamento de links para tracking
- [HTTPPost](../http-functions/httppost.md) — Realiza uma requisição HTTP POST para enviar dados a um endpoint externo
- [HTTPPost2](../http-functions/httppost2.md) — Versão estendida do HTTPPost com suporte a content-type customizado
- [TreatAsContent](../utility-functions/treatascontent.md) — Renderiza uma string como conteúdo AMPscript/HTML processável
- [Replace](../string-functions/replace.md) — Substitui trechos de texto na string retornada, útil para manipular respostas HTTP
- [BuildRowsetFromJson](../content-functions/buildrowsetfromjson.md) — Converte uma string JSON em um rowset para processamento, útil para tratar respostas de APIs
- [Empty](../utility-functions/empty.md) — Verifica se o valor retornado está vazio antes de processar