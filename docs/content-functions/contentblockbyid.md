---
title: ContentBlockById
sidebar_label: ContentBlockById
description: Insere o conteúdo de um bloco do Content Builder referenciando-o pelo seu ID numérico.
---

# ContentBlockById

## Descrição

Retorna o conteúdo de um bloco armazenado no Content Builder a partir do seu ID numérico. É a função mais usada no dia a dia para modularizar e-mails e CloudPages - você cria blocos reutilizáveis (header, footer, disclaimer legal, bloco de produto) e os puxa dinamicamente nos seus templates. Funciona **apenas** com conteúdos do Content Builder; para blocos do Classic Content, use a função [ContentArea](../content-functions/contentarea.md).

## Sintaxe

```ampscript
ContentBlockById(contentBlockId)
ContentBlockById(contentBlockId, impressionRegionName)
ContentBlockById(contentBlockId, impressionRegionName, boolErrorOnMissingContentBlock, errorMessage, statusCode)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| contentBlockId | number | Sim | ID numérico do bloco de conteúdo no Content Builder. |
| impressionRegionName | string | Não | Nome da região de impressão (Impression Region) a ser associada ao bloco inserido. |
| boolErrorOnMissingContentBlock | boolean | Não | Se `true`, retorna erro quando o bloco não é encontrado. Se `false`, não gera erro. O valor padrão é `true`. |
| errorMessage | string | Não | Conteúdo a ser exibido caso ocorra um erro ao recuperar o bloco. |
| statusCode | number | Não | Código de saída da função. `0` indica que o bloco foi encontrado e renderizado com sucesso. `-1` indica que não há conteúdo ou o bloco é inválido. |

## Exemplo básico

Inserindo o rodapé padrão da Lojas Vitória em um e-mail de boas-vindas, referenciando o bloco pelo ID:

```ampscript
%%=ContentBlockById(52413)=%%
```

**Saída:**
```
© 2025 Lojas Vitória - CNPJ 12.345.678/0001-90
Rua Augusta, 1200 - São Paulo/SP - CEP 01304-001
Você recebeu este e-mail porque se cadastrou em lojasavitoria.com.br
```

## Exemplo avançado

Em uma régua de relacionamento da MegaStore, você quer inserir um bloco de recomendação de produtos. Se o bloco não existir (por exemplo, alguém apagou sem querer), o e-mail não deve quebrar - exibe um conteúdo alternativo e usa o `statusCode` para mostrar uma mensagem de fallback:

```ampscript
%%[

VAR @statusCode, @conteudoBloco

SET @conteudoBloco = ContentBlockById(78901, "bloco-ofertas", false, "", @statusCode)

IF @statusCode == 0 THEN

]%%

%%=v(@conteudoBloco)=%%

%%[ ELSE ]%%

<table width="100%" cellpadding="16" style="background-color:#f5f5f5;">
  <tr>
    <td align="center" style="font-family:Arial,sans-serif;font-size:14px;color:#666;">
      Confira nossas ofertas em
      <a href="https://www.megastore.com.br/ofertas">megastore.com.br/ofertas</a>
    </td>
  </tr>
</table>

%%[ ENDIF ]%%
```

**Saída (quando o bloco existe - statusCode 0):**
```
[conteúdo do bloco 78901 renderizado normalmente]
```

**Saída (quando o bloco não existe - statusCode -1):**
```
Confira nossas ofertas em megastore.com.br/ofertas
```

Outro cenário comum: iniciar uma Impression Region ao inserir o bloco, para rastrear engajamento naquela área do e-mail:

```ampscript
%%=ContentBlockById(52413, "texto-principal")=%%
%%=EndImpressionRegion()=%%
```

**Saída:**
```
[conteúdo do bloco 52413 renderizado, com a Impression Region "texto-principal" registrada]
```

## Observações

> **💡 Dica:** O ID do bloco de conteúdo pode ser encontrado no Content Builder - basta abrir o bloco e verificar a URL ou as propriedades do item. Esse ID é numérico e único dentro da Business Unit.

> **⚠️ Atenção:** O valor padrão de `boolErrorOnMissingContentBlock` é `true`. Isso significa que, se você não passar esse parâmetro e o bloco não existir, o envio do e-mail vai gerar erro para aquele subscriber. Em réguas automatizadas e envios em massa, considere sempre passar `false` e tratar o fallback com o `statusCode` para evitar que e-mails deixem de ser enviados.

> **💡 Dica:** Essa função só funciona com blocos do Content Builder. Se você precisa referenciar conteúdo do Classic Content, use [ContentArea](../content-functions/contentarea.md). Se preferir referenciar blocos por chave (Customer Key) em vez de ID - o que é mais seguro em migrações entre ambientes - use [ContentBlockByKey](../content-functions/contentblockbykey.md).

> **💡 Dica:** O `statusCode` é especialmente útil em cenários onde o bloco pode variar por campanha (por exemplo, blocos criados dinamicamente por um time de conteúdo). Ao verificar se o valor é `0` ou `-1`, você garante que o e-mail sempre terá um conteúdo válido.

## Funções relacionadas

- [ContentBlockByKey](../content-functions/contentblockbykey.md) - insere bloco do Content Builder pela Customer Key
- [ContentBlockByName](../content-functions/contentblockbyname.md) - insere bloco do Content Builder pelo nome
- [ContentArea](../content-functions/contentarea.md) - insere conteúdo do Classic Content
- [EndImpressionRegion](../content-functions/endimpressionregion.md) - encerra uma Impression Region iniciada na inserção do bloco