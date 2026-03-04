---
title: IsChtmlBrowser
sidebar_label: IsChtmlBrowser
description: Verifica se o user-agent de um dispositivo corresponde a um navegador CHTML (Compact HTML).
---

# IsChtmlBrowser

## Descrição

A função `IsChtmlBrowser` verifica se o user-agent informado corresponde a um navegador CHTML (Compact HTML) — um padrão antigo de HTML compacto, criado para celulares simples (feature phones), smartphones iniciais e PDAs. Era usada em landing pages para decidir se o conteúdo deveria ser exibido em HTML padrão ou em CHTML. O padrão CHTML foi superado no início dos anos 2000 e raramente é utilizado hoje — essa função é mantida por motivos históricos.

## Sintaxe

```ampscript
IsChtmlBrowser(userAgentHeader)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| userAgentHeader | String | Sim | String do cabeçalho HTTP user-agent do dispositivo que você quer verificar. |

## Exemplo básico

Verificando se uma string de user-agent pré-definida corresponde a um navegador CHTML — neste caso, um navegador desktop moderno.

```ampscript
%%[
SET @userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
SET @isChtml = IsChtmlBrowser(@userAgent)
]%%

Navegador CHTML: %%=V(@isChtml)=%%
```

**Saída:**
```
Navegador CHTML: false
```

## Exemplo avançado

Em uma CloudPage da Conecta Telecom, capturando o user-agent real do visitante com `HTTPRequestHeader` para decidir dinamicamente qual versão do conteúdo exibir.

```ampscript
%%[
SET @userAgent = HTTPRequestHeader("User-Agent")
SET @isChtml = IsChtmlBrowser(@userAgent)

IF @isChtml == TRUE THEN
  SET @mensagem = "Você está acessando pelo navegador CHTML. Exibindo versão simplificada."
ELSE
  SET @mensagem = "Bem-vindo à Conecta Telecom! Confira nossos planos a partir de R$ 59,90/mês."
ENDIF
]%%

%%=V(@mensagem)=%%
```

**Saída:**
```
Bem-vindo à Conecta Telecom! Confira nossos planos a partir de R$ 59,90/mês.
```

## Observações

> **⚠️ Atenção:** O padrão CHTML foi superado no início dos anos 2000. Na prática, essa função vai retornar `false` para praticamente qualquer dispositivo moderno. A documentação é mantida por motivos históricos.

- A função foi pensada para uso em **landing pages**, onde faz sentido inspecionar o user-agent do visitante para adaptar o conteúdo exibido.
- Para capturar o user-agent real do navegador do visitante em tempo de execução, combine com a função [`HTTPRequestHeader`](../http-functions/httprequestheader.md).

## Funções relacionadas

- [HTTPRequestHeader](../http-functions/httprequestheader.md) — captura cabeçalhos HTTP da requisição atual, como o `User-Agent`.
- [RedirectTo](../http-functions/redirectto.md) — redireciona o visitante para outra URL, útil se quiser encaminhar navegadores CHTML para uma página alternativa.
- [IIF](../utility-functions/iif.md) — alternativa inline para decisões simples baseadas no retorno da função.