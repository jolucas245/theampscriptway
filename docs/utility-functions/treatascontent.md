---
title: TreatAsContent
sidebar_label: TreatAsContent
description: Trata uma string como se fosse conteúdo nativo do Marketing Cloud, processando personalizações e AMPscript embutidos nela.
---

# TreatAsContent

## Descrição

A função `TreatAsContent` pega uma string e a trata como se fosse conteúdo vindo diretamente de uma Content Area do Marketing Cloud. Isso significa que, se a string contiver personalization strings (como `%%FirstName%%`) ou código AMPscript, eles serão processados e substituídos pelos valores correspondentes. É muito útil quando você monta HTML dinamicamente (por exemplo, puxando de uma Data Extension) e precisa que o AMPscript ou as personalization strings dentro dessa string sejam interpretados. Para que links embutidos na string tenham rastreamento de clique, inclua a string `httpgetwrap` nos links.

## Sintaxe

```ampscript
TreatAsContent(stringToReturn)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| stringToReturn | String | Sim | A string que será tratada como conteúdo. Pode conter HTML, personalization strings e código AMPscript que serão processados. |

## Exemplo básico

Imagine que você tem uma Data Extension chamada **CampanhasEmail** com uma coluna `ConteudoHTML` que armazena trechos de HTML personalizados. Você quer renderizar esse conteúdo no e-mail:

```ampscript
%%[
SET @primeiroNome = "Maria"
SET @saudacao = Concat("<p>Olá, ", @primeiroNome, "! Bem-vinda à nossa promoção de Dia das Mães! 🌹</p>")
TreatAsContent(@saudacao)
]%%
```

**Saída:**

```html
<p>Olá, Maria! Bem-vinda à nossa promoção de Dia das Mães! 🌹</p>
```

## Exemplo avançado

Cenário real: a **MegaStore** armazena templates de e-mail em uma Data Extension chamada **TemplatesPromocao**. Cada template contém personalization strings que precisam ser resolvidas no momento do envio. O conteúdo é puxado dinamicamente com base no tipo de campanha do assinante.

```ampscript
%%[
/* Busca o template na Data Extension */
SET @conteudoTemplate = Lookup(
  "TemplatesPromocao",
  "ConteudoHTML",
  "TipoCampanha", "black_friday"
)

/* 
   Supondo que o conteúdo retornado seja algo como:
   
   "<h1>Fala, %%NomeCliente%%! 🖤</h1>
    <p>A Black Friday da MegaStore chegou!</p>
    <p>Você tem <strong>R$ %%SaldoCashback%%</strong> de cashback disponível.</p>
    <p>Use no site e ganhe frete grátis acima de R$ 299!</p>
    <p>Aproveite até 30/11/2024.</p>
    <a href='https://www.megastore.com.br/blackfriday?cpf=%%CPFCliente%%'>
      Ver ofertas exclusivas
    </a>"
*/

/* Valida se o conteúdo não está vazio */
IF NOT Empty(@conteudoTemplate) THEN
  TreatAsContent(@conteudoTemplate)
ELSE
  Output(Concat("<p>Olá! Confira nossas ofertas em www.megastore.com.br</p>"))
ENDIF
]%%
```

**Saída (para a assinante Maria Santos, com R$ 45,00 de cashback e CPF 123.456.789-00):**

```html
<h1>Fala, Maria Santos! 🖤</h1>
<p>A Black Friday da MegaStore chegou!</p>
<p>Você tem <strong>R$ 45,00</strong> de cashback disponível.</p>
<p>Use no site e ganhe frete grátis acima de R$ 299!</p>
<p>Aproveite até 30/11/2024.</p>
<a href='https://www.megastore.com.br/blackfriday?cpf=123.456.789-00'>
  Ver ofertas exclusivas
</a>
```

## Observações

- **⚠️ Segurança é prioridade:** Sempre sanitize qualquer input de usuário dentro de um bloco `TreatAsContent`. Remova, escape ou bloqueie entradas que contenham tags HTML ou código AMPscript. Use uma lista de caracteres permitidos (allowlist) para evitar injeção de código malicioso. Isso é especialmente crítico quando o conteúdo vem de fontes externas ou de dados que o próprio assinante pode ter preenchido (como campos de formulário em CloudPages).
- **Personalization strings são processadas:** Se a string contiver `%%NomeDoAtributo%%`, o Marketing Cloud vai substituir pelo valor correspondente do assinante, exatamente como faria em conteúdo nativo.
- **AMPscript embutido também é processado:** Código AMPscript dentro da string será executado. Isso é poderoso, mas exige cuidado — conteúdo não confiável pode executar código indesejado.
- **Rastreamento de links:** Para que os links embutidos na string retornada tenham tracking de clique, você precisa incluir a string `httpgetwrap` nesses links.
- **Use apenas com dados revisados:** A documentação oficial recomenda usar essa função somente com dados que foram previamente revisados e otimizados para aparecer como conteúdo. Não use com dados brutos ou não validados.
- **Diferença para `TreatAsContentArea`:** A função `TreatAsContent` trabalha com strings puras, enquanto [`TreatAsContentArea`](../content-functions/treatascontentarea.md) simula uma Content Area com mais opções de formatação.
- **Contexto de uso:** Funciona em e-mails, CloudPages, SMS e Landing Pages — qualquer contexto onde AMPscript é processado.

## Funções relacionadas

- [TreatAsContentArea](../content-functions/treatascontentarea.md) — similar, mas trata a string como uma Content Area com opções adicionais de layout
- [ContentBlockByName](../content-functions/contentblockbyname.md) — busca e renderiza um Content Block pelo nome (conteúdo já salvo no SFMC)
- [ContentBlockByKey](../content-functions/contentblockbykey.md) — busca e renderiza um Content Block pela Customer Key
- [ContentBlockById](../content-functions/contentblockbyid.md) — busca e renderiza um Content Block pelo ID
- [Lookup](../data-extension-functions/lookup.md) — busca valores em Data Extensions (frequentemente usada junto com TreatAsContent)
- [Concat](../string-functions/concat.md) — concatena strings para montar conteúdo dinâmico antes de tratar como conteúdo
- [Output](../utility-functions/output.md) — exibe conteúdo diretamente, mas sem processar personalization strings embutidas na string
- [V](../utility-functions/v.md) — recupera o valor de uma variável ou atributo pelo nome em formato de string
- [Replace](../string-functions/replace.md) — útil para sanitizar strings antes de passá-las para TreatAsContent
- [Empty](../utility-functions/empty.md) — verifica se a string está vazia antes de tentar renderizá-la como conteúdo