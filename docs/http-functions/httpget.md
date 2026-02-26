---
title: HTTPGet
sidebar_label: HTTPGet
description: Recupera o conteúdo de uma URL usando o método HTTP GET, permitindo buscar dados externos para personalizar emails, CloudPages e outros contextos no Marketing Cloud.
---

<!-- generated-by-script -->

# HTTPGet

## Descrição

A função `HTTPGet` faz uma requisição HTTP GET para uma URL e retorna o conteúdo da resposta como uma string. É muito útil quando você precisa buscar dados de APIs externas, serviços web ou páginas para personalizar seus envios ou CloudPages. Se a URL for a mesma para vários subscribers em um envio, o Marketing Cloud faz apenas uma chamada e usa o resultado em cache para todos eles — o que é ótimo para performance. A função funciona apenas com HTTP na porta 80 e HTTPS na porta 443; portas diferentes dessas vão causar erro.

## Sintaxe

```ampscript
HTTPGet(httpGetUrl [, boolContinueOnError] [, enumAllowEmptyContent] [, functionStatusOutput])
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| httpGetUrl | String | Sim | A URL para a qual a requisição GET será feita. |
| boolContinueOnError | Booleano | Não | Se `true`, a função ignora erros encontrados durante a requisição. Se `false` (padrão), a função para a execução ao encontrar um erro. |
| enumAllowEmptyContent | Inteiro | Não | Define como a função lida com conteúdo vazio. Valores aceitos: `0` (permite conteúdo vazio — padrão), `1` (retorna erro ao encontrar conteúdo vazio), `2` (pula o envio do email para o subscriber quando usada em email). |
| functionStatusOutput | Inteiro (variável) | Não | Variável que armazena o status da execução. Valores possíveis: `0` (sucesso), `-1` (URL não encontrada), `-2` (erro na requisição HTTP), `-3` (sucesso, mas sem conteúdo retornado). |

## Exemplo básico

Imagine que a **Lojas Vitória** tem uma API que retorna a oferta do dia em texto simples. Você quer exibir essa oferta no email:

```ampscript
%%[
SET @ofertaDoDia = HTTPGet("https://api.lojasvitoria.com.br/oferta-do-dia")
]%%

🎉 Oferta do dia: %%=v(@ofertaDoDia)=%%
```

**Saída:**
```
🎉 Oferta do dia: Frete grátis em compras acima de R$299 — só hoje!
```

## Exemplo avançado

Agora um cenário mais robusto: a **FarmaRede** quer buscar dados de um endpoint externo que retorna informações de cashback personalizadas por CPF. A URL é montada dinamicamente e o código trata erros para não quebrar o email caso a API esteja fora do ar:

```ampscript
%%[
SET @cpf = AttributeValue("CPF")
SET @url = Concat("https://api.farmarede.com.br/cashback?cpf=", URLEncode(@cpf))

SET @resposta = HTTPGet(@url, true, 0, @callStatus)

IF @callStatus == 0 THEN
]%%

<h2>Olá, %%=v(AttributeValue("PrimeiroNome"))=%%! 🎉</h2>
<p>Você tem cashback disponível na FarmaRede:</p>
<p><strong>%%=v(@resposta)=%%</strong></p>
<p>Use seu saldo na próxima compra em qualquer loja FarmaRede!</p>

%%[ ELSEIF @callStatus == -1 THEN ]%%

<p>Não conseguimos localizar suas informações de cashback no momento. Acesse <a href="https://www.farmarede.com.br/minha-conta">sua conta</a> para consultar.</p>

%%[ ELSEIF @callStatus == -2 THEN ]%%

<p>Nosso sistema de cashback está temporariamente indisponível. Tente novamente mais tarde.</p>

%%[ ELSEIF @callStatus == -3 THEN ]%%

<p>Você ainda não possui cashback acumulado. Que tal aproveitar nossas ofertas de Dia das Mães?</p>

%%[ ENDIF ]%%
```

**Saída (cenário de sucesso):**
```html
<h2>Olá, Maria! 🎉</h2>
<p>Você tem cashback disponível na FarmaRede:</p>
<p><strong>R$ 47,50 de cashback para usar até 31/12/2024</strong></p>
<p>Use seu saldo na próxima compra em qualquer loja FarmaRede!</p>
```

**Saída (cenário de erro na requisição):**
```html
<p>Nosso sistema de cashback está temporariamente indisponível. Tente novamente mais tarde.</p>
```

## Observações

- **Portas:** A função funciona **apenas** com HTTP na porta 80 e HTTPS na porta 443. Se a URL usar uma porta diferente (ex: `https://api.exemplo.com.br:8443/dados`), a função vai falhar.
- **Cache por URL:** Se a URL for idêntica para vários subscribers no mesmo envio, o Marketing Cloud faz a chamada uma única vez e reutiliza o resultado. Se você precisa de dados diferentes por subscriber, inclua um parâmetro único na URL (como CPF, ID do cliente, etc.).
- **Encoding de caracteres:** Em contas mais antigas, o Marketing Cloud assume que o conteúdo retornado usa o charset WindowsCodePage 1252. Contas mais recentes usam UTF-8. Se você está tendo problemas com acentos (muito comum com nomes brasileiros como "João", "André", "Conceição"), entre em contato com o suporte da Salesforce para ajustar o encoding padrão.
- **Tratamento de erros:** Sem o parâmetro `boolContinueOnError` definido como `true`, qualquer erro na requisição vai interromper a renderização do conteúdo. Em emails, é uma boa prática sempre usar `true` e tratar os cenários de erro via `@callStatus`.
- **Conteúdo vazio:** Use o parâmetro `enumAllowEmptyContent` com valor `2` se quiser pular o envio do email para um subscriber quando a API não retornar conteúdo — útil para evitar enviar emails com informações faltando.
- **Uso com JSON/XML:** O `HTTPGet` retorna o conteúdo como string. Para parsear respostas JSON ou XML, combine com [BuildRowsetFromJson](../content-functions/buildrowsetfromjson.md) ou [BuildRowsetFromXml](../content-functions/buildrowsetfromxml.md).
- **Timeout:** A documentação oficial não especifica um valor de timeout exato. Tenha em mente que chamadas HTTP lentas podem impactar o tempo de renderização do email e a performance do envio.
- **Segurança:** Evite expor dados sensíveis (como CPF completo) diretamente na URL sem HTTPS. Sempre use endpoints `https://` quando estiver trafegando informações pessoais.

## Funções relacionadas

- [HTTPPost](../http-functions/httppost.md) — Envia dados para uma URL usando o método POST
- [HTTPPost2](../http-functions/httppost2.md) — Versão estendida do HTTPPost com suporte a headers customizados
- [URLEncode](../string-functions/urlencode.md) — Codifica strings para uso seguro em URLs (ideal para montar query strings)
- [TreatAsContent](../utility-functions/treatascontent.md) — Processa o conteúdo retornado como AMPscript/HTML renderizável
- [BuildRowsetFromJson](../content-functions/buildrowsetfromjson.md) — Converte uma string JSON em um rowset para extrair dados
- [BuildRowsetFromXml](../content-functions/buildrowsetfromxml.md) — Converte uma string XML em um rowset para extrair dados
- [Concat](../string-functions/concat.md) — Concatena strings, útil para montar URLs dinâmicas
- [RaiseError](../utility-functions/raiseerror.md) — Gera um erro customizado, útil para tratamento de falhas em chamadas HTTP
- [RedirectTo](../http-functions/redirectto.md) — Redireciona o usuário para uma URL, útil em CloudPages
- [V](../utility-functions/v.md) — Exibe o valor de uma variável inline no conteúdo