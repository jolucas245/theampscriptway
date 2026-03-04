---
title: GetPortfolioItem
sidebar_label: GetPortfolioItem
description: Retorna o conteúdo de um arquivo armazenado no Portfolio do Marketing Cloud.
---

# GetPortfolioItem

## Descrição

A função `GetPortfolioItem` retorna o conteúdo de um arquivo armazenado no seu Portfolio (a biblioteca de arquivos do Marketing Cloud). Ela é especialmente útil quando você quer manter trechos de texto em arquivos externos e puxá-los dinamicamente para dentro dos seus e-mails, CloudPages ou qualquer conteúdo. Pense nela como uma forma de centralizar textos reutilizáveis — termos legais, disclaimers, rodapés padrão — em um único lugar, sem precisar replicar em cada peça.

## Sintaxe

```ampscript
GetPortfolioItem(itemExternalKey)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| itemExternalKey | String | Sim | A external key (chave externa) do item armazenado no Portfolio. |

## Exemplo básico

Recuperando o conteúdo de um arquivo de texto no Portfolio que contém um aviso legal padrão para e-mails da Lojas Vitória.

```ampscript
%%=GetPortfolioItem("AvisoLegal_LojasVitoria")=%%
```

**Saída:**
```
Este e-mail foi enviado por Lojas Vitória LTDA, CNPJ 12.345.678/0001-90, Rua Augusta, 1200 - São Paulo/SP - CEP 01304-001. Caso não deseje mais receber nossas comunicações, utilize o link de descadastro abaixo.
```

## Exemplo avançado

Cenário de régua de relacionamento: um e-mail transacional do Banco Meridional que monta o corpo da mensagem combinando saudação personalizada com um bloco de texto jurídico centralizado no Portfolio, usando [Concat](../string-functions/concat.md) para compor a saída final.

```ampscript
SET @nome = "Maria Santos"
SET @textoRegulatorio = GetPortfolioItem("DisclaimerFinanceiro_2024")

SET @mensagemFinal = Concat(
  "Olá, ", @nome, "!", Char(13), Char(10),
  Char(13), Char(10),
  "Segue abaixo o extrato da sua conta referente a 01/12/2024.", Char(13), Char(10),
  Char(13), Char(10),
  @textoRegulatorio
)
]%%

%%=v(@mensagemFinal)=%%
```

**Saída:**
```
Olá, Maria Santos!

Segue abaixo o extrato da sua conta referente a 01/12/2024.

Banco Meridional S.A. - Instituição financeira autorizada pelo Banco Central do Brasil. As informações contidas neste e-mail são confidenciais e destinadas exclusivamente ao titular da conta. Ouvidoria: 0800 123 4567.
```

## Observações

- A função busca o arquivo pela **external key** (chave externa), não pelo nome do arquivo. Certifique-se de que a external key está corretamente definida no Portfolio antes de referenciá-la no código.

- É uma ótima estratégia para centralizar textos que mudam com frequência (como disclaimers legais, políticas de privacidade ou avisos sazonais). Você atualiza o arquivo no Portfolio uma vez e todos os e-mails que usam `GetPortfolioItem` já refletem a alteração.

> **💡 Dica:** Essa função é ideal para trechos de **texto puro**. Se você precisa incluir blocos de conteúdo mais ricos (com HTML, AMPscript embutido etc.), considere usar [ContentBlockByKey](../content-functions/contentblockbykey.md) em vez do Portfolio.

> **⚠️ Atenção:** Se a external key informada não corresponder a nenhum item existente no Portfolio, a função pode gerar erro no momento do envio. Sempre valide que o item existe e que a chave está correta antes de publicar a comunicação.

## Funções relacionadas

- [ContentBlockByKey](../content-functions/contentblockbykey.md) — carrega blocos de conteúdo pela chave externa (alternativa mais moderna para conteúdo reutilizável)
- [ContentBlockByName](../content-functions/contentblockbyname.md) — carrega blocos de conteúdo pelo caminho/nome
- [ContentBlockById](../content-functions/contentblockbyid.md) — carrega blocos de conteúdo pelo ID
- [TreatAsContent](../utility-functions/treatascontent.md) — processa AMPscript dentro de uma string retornada
- [Concat](../string-functions/concat.md) — concatena strings para compor mensagens dinâmicas
- [AttachFile](../content-functions/attachfile.md) — anexa arquivos do Portfolio a e-mails