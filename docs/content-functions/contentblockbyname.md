---
title: ContentBlockByName
sidebar_label: ContentBlockByName
description: Retorna o conteúdo de um bloco do Content Builder referenciando-o pelo caminho completo (nome).
---

# ContentBlockByName

## Descrição

Retorna o conteúdo de um bloco armazenado no Content Builder a partir do seu caminho completo (nome com pasta). É a função ideal quando você organiza seus blocos reutilizáveis em pastas no Content Builder e quer referenciá-los pelo nome - como headers, footers, disclaimers jurídicos ou snippets de produto que são compartilhados entre vários e-mails de uma régua de relacionamento. A função retorna apenas conteúdo que esteja no Content Builder; para conteúdo em áreas Classic, use a função [ContentArea](../content-functions/contentarea.md).

## Sintaxe

```ampscript
ContentBlockByName("contentBlockName")
ContentBlockByName("contentBlockName", "impressionRegionName")
ContentBlockByName("contentBlockName", "impressionRegionName", boolErrorOnMissingContentBlock)
ContentBlockByName("contentBlockName", "impressionRegionName", boolErrorOnMissingContentBlock, "errorMessage", @statusCode)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| contentBlockName | string | Sim | Caminho completo do bloco de conteúdo no Content Builder. Exemplo: `"Content Builder\Emails\Header"`. |
| impressionRegionName | string | Não | Nome da região de impressão a ser associada ao bloco de conteúdo. |
| boolErrorOnMissingContentBlock | boolean | Não | Se `true`, retorna erro quando o bloco não é encontrado. Se `false`, não retorna erro. O valor padrão é `true`. |
| errorMessage | string | Não | Conteúdo a ser retornado caso ocorra um erro ao recuperar o bloco. |
| statusCode | number | Não | Código de saída da função. `0` indica que o bloco foi encontrado e renderizado com sucesso. `-1` indica que não há conteúdo ou o bloco é inválido. |

## Exemplo básico

Inserindo o header padrão da Lojas Vitória, que fica em uma pasta organizada dentro do Content Builder:

```ampscript
%%=ContentBlockByName("Content Builder\Lojas Vitória\Componentes\Header")=%%
```

**Saída:**
```
<!-- Conteúdo HTML do bloco Header renderizado aqui -->
```

## Exemplo avançado

E-mail de ofertas da MegaStore com conteúdo modular: o bloco de rodapé jurídico é carregado pelo nome, com tratamento de fallback caso o bloco tenha sido movido ou excluído, garantindo que o envio não quebre para toda a base.

```ampscript
%%[

VAR @statusRodape

]%%

%%=ContentBlockByName("Content Builder\MegaStore\Componentes\Header")=%%

<table width="600" align="center">
  <tr>
    <td>
      <h1>Olá, %%=v(@NomeCliente)=%%!</h1>
      <p>Confira nossas ofertas exclusivas com até 40% de desconto.</p>
      <p>Aproveite: frete grátis para São Paulo em compras acima de R$ 199,90.</p>
    </td>
  </tr>
</table>

%%=ContentBlockByName("Content Builder\MegaStore\Componentes\Rodape Juridico", "rodape", false, "", @statusRodape)=%%

%%[ IF @statusRodape == -1 THEN ]%%
<table width="600" align="center">
  <tr>
    <td style="font-size:10px; color:#999999; text-align:center;">
      <p>MegaStore LTDA - CNPJ 00.000.000/0001-00 - São Paulo/SP</p>
      <p>Em caso de dúvidas, entre em contato: sac@megastore.com.br | (11) 3000-0000</p>
    </td>
  </tr>
</table>
%%[ ENDIF ]%%
```

**Saída:**
```
<!-- Header da MegaStore renderizado -->

Olá, Maria Santos!
Confira nossas ofertas exclusivas com até 40% de desconto.
Aproveite: frete grátis para São Paulo em compras acima de R$ 199,90.

<!-- Se o bloco "Rodape Juridico" for encontrado (statusCode = 0): conteúdo do bloco renderizado -->
<!-- Se o bloco NÃO for encontrado (statusCode = -1): rodapé fallback exibido -->
MegaStore LTDA - CNPJ 00.000.000/0001-00 - São Paulo/SP
Em caso de dúvidas, entre em contato: sac@megastore.com.br | (11) 3000-0000
```

## Observações

> **⚠️ Atenção:** O parâmetro `contentBlockName` exige o **caminho completo** do bloco, começando por `Content Builder\`. Se você reorganizar as pastas no Content Builder, todas as referências por nome vão quebrar. Considere usar [ContentBlockByKey](../content-functions/contentblockbykey.md) se os blocos forem movidos com frequência, já que a Customer Key não muda com reorganização de pastas.

> **⚠️ Atenção:** O valor padrão de `boolErrorOnMissingContentBlock` é `true`. Isso significa que, se o bloco não for encontrado e você não tratar o erro, **o envio pode falhar** para o subscriber. Em réguas de relacionamento com alto volume, sempre considere passar `false` e usar o `statusCode` para exibir um conteúdo de fallback.

> **💡 Dica:** Use o parâmetro `impressionRegionName` quando precisar rastrear impressões de blocos específicos (como banners promocionais). Lembre-se de encerrar a região de impressão com [EndImpressionRegion](../content-functions/endimpressionregion.md) após o bloco.

> **💡 Dica:** O código de status `0` confirma que o bloco foi encontrado e renderizado com sucesso. O valor `-1` indica que não há conteúdo ou que o bloco é inválido - use essa verificação para montar lógicas de fallback robustas.

- Esta função retorna **apenas** conteúdo do Content Builder. Para áreas de conteúdo clássicas, use [ContentArea](../content-functions/contentarea.md).

## Funções relacionadas

- [ContentBlockByKey](../content-functions/contentblockbykey.md) - referencia blocos pela Customer Key (mais resiliente a mudanças de pasta)
- [ContentBlockById](../content-functions/contentblockbyid.md) - referencia blocos pelo ID numérico
- [ContentAreaByName](../content-functions/contentareabyname.md) - similar, mas para áreas de conteúdo Classic
- [ContentArea](../content-functions/contentarea.md) - insere conteúdo de áreas Classic por ID
- [EndImpressionRegion](../content-functions/endimpressionregion.md) - encerra uma região de impressão iniciada pelo parâmetro `impressionRegionName`
- [TreatAsContent](../utility-functions/treatascontent.md) - processa uma string como se fosse conteúdo AMPscript/HTML