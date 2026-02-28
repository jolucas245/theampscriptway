---
title: ContentAreaById
sidebar_label: ContentAreaById
description: Recupera e exibe o conteúdo de uma Content Area do Classic Email usando seu ID numérico.
---

<!-- generated-by-script -->

# ContentAreaById

## Descrição

A função `ContentAreaById` recupera e renderiza o conteúdo de uma Content Area (área de conteúdo) do Classic Email no Salesforce Marketing Cloud, usando o ID numérico dessa área como referência. Ela é útil quando você já conhece o ID da Content Area e quer inserir seu conteúdo dinamicamente em um e-mail ou página.

> ⚠️ **Função deprecada:** As Content Areas fazem parte do Classic Email Editor, que foi substituído pelo Content Builder. Para novos projetos, a Salesforce recomenda usar as funções `ContentBlockById`, `ContentBlockByName` ou `ContentBlockByKey` do Content Builder.

## Sintaxe

```ampscript
ContentAreaById(contentAreaId)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| contentAreaId | Número | Sim | O ID numérico da Content Area que você deseja recuperar e exibir. Esse ID pode ser encontrado nas propriedades da Content Area dentro do Classic Email Editor. |

## Exemplo básico

Imagine que a "MegaStore" tem uma Content Area com o ID `12345` que contém um banner de promoção de Dia das Mães:

```ampscript
%%=ContentAreaById(12345)=%%
```

**Saída:**
```html
<table width="100%">
  <tr>
    <td style="text-align:center;">
      <h2>Dia das Mães na MegaStore! 💐</h2>
      <p>Até 40% de desconto + frete grátis acima de R$299</p>
    </td>
  </tr>
</table>
```

## Exemplo avançado

Aqui a "Lojas Vitória" usa um campo de uma Data Extension para decidir qual Content Area exibir, dependendo do segmento do cliente. O ID da Content Area está armazenado na coluna `ContentAreaID` da DE:

```ampscript
%%[
  SET @email = AttributeValue("EmailAddress")
  SET @rows = LookupRows("Segmentacao_Clientes", "Email", @email)

  IF RowCount(@rows) > 0 THEN
    SET @row = Row(@rows, 1)
    SET @segmento = Field(@row, "Segmento")
    SET @contentId = Field(@row, "ContentAreaID")
  ELSE
    SET @segmento = "geral"
    SET @contentId = 99999
  ENDIF
]%%

<p>Olá! Confira a oferta especial para você:</p>

%%=ContentAreaById(@contentId)=%%

%%[
  IF @segmento == "vip" THEN
]%%
  <p style="color: #8B0000; font-weight: bold;">
    🎁 Bônus exclusivo VIP: R$50 de cashback na sua próxima compra!
  </p>
%%[ ENDIF ]%%
```

**Saída (para um cliente VIP com ContentAreaID = 55001):**
```html
<p>Olá! Confira a oferta especial para você:</p>

<div>
  <h3>Black Friday Lojas Vitória - Exclusivo VIP</h3>
  <p>Ganhe 3x mais pontos no programa de fidelidade!</p>
  <a href="https://www.lojasvitoria.com.br/blackfriday">Aproveitar agora</a>
</div>

<p style="color: #8B0000; font-weight: bold;">
  🎁 Bônus exclusivo VIP: R$50 de cashback na sua próxima compra!
</p>
```

## Observações

- **Função deprecada:** `ContentAreaById` faz parte do sistema Classic Email, que está sendo descontinuado. Para novas implementações, use `ContentBlockById` ou `ContentBlockByKey` do Content Builder.
- A Content Area precisa existir e estar ativa na conta. Se o ID informado não corresponder a nenhuma Content Area válida, a função pode retornar vazio ou gerar erro no envio.
- O ID numérico da Content Area pode ser encontrado acessando a Content Area no Classic Email Editor e verificando suas propriedades ou a URL da página.
- Essa função renderiza o conteúdo HTML completo da Content Area — incluindo qualquer AMPscript que esteja dentro dela, que será processado normalmente.
- Funciona em contextos de e-mail. O comportamento em CloudPages ou Landing Pages pode variar.
- Não confunda `ContentAreaById` com [ContentBlockById](../content-functions/contentblockbyid.md) — a primeira busca em Content Areas (Classic), a segunda em Content Blocks (Content Builder).

## Funções relacionadas

- [ContentArea](../content-functions/contentarea.md) — recupera uma Content Area usando nome e parâmetros adicionais de formatação
- [ContentAreaByName](../content-functions/contentareabyname.md) — recupera uma Content Area pelo nome em vez do ID
- [ContentBlockById](../content-functions/contentblockbyid.md) — versão moderna que recupera um Content Block do Content Builder pelo ID (recomendada)
- [ContentBlockByName](../content-functions/contentblockbyname.md) — recupera um Content Block do Content Builder pelo nome
- [ContentBlockByKey](../content-functions/contentblockbykey.md) — recupera um Content Block do Content Builder pela Customer Key
- [TreatAsContent](../utility-functions/treatascontent.md) — processa uma string como se fosse conteúdo AMPscript/HTML
- [TreatAsContentArea](../content-functions/treatascontentarea.md) — trata uma string como uma Content Area para renderização