---
title: BeginImpressionRegion
sidebar_label: BeginImpressionRegion
description: Marca o início de uma região de rastreamento de impressões em e-mails enviados pelo SFMC.
---

# BeginImpressionRegion

## Descrição

Define o início de uma região de rastreamento de impressões (impression tracking) no corpo de um e-mail. Isso permite que você monitore quais seções do e-mail foram efetivamente renderizadas para cada destinatário — útil para medir a visibilidade de blocos de conteúdo dinâmico como banners, ofertas segmentadas ou seções condicionais. A função não produz nenhuma saída visível no e-mail.

## Sintaxe

```ampscript
BeginImpressionRegion("regionName")
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| regionName | String | Sim | Nome que você quer atribuir à região de impressão. Esse nome será usado nos relatórios de tracking para identificar a região. |

## Exemplo básico

Rastreando a impressão de um banner promocional em um e-mail da MegaStore:

```ampscript
%%=BeginImpressionRegion("Banner_Promocional")=%%

<table width="100%" cellpadding="0" cellspacing="0">
  <tr>
    <td style="background-color:#FF6600; padding:20px; text-align:center;">
      <h1 style="color:#FFFFFF;">Mega Oferta MegaStore</h1>
      <p style="color:#FFFFFF;">Até 40% de desconto em eletrônicos!</p>
    </td>
  </tr>
</table>

%%=EndImpressionRegion()=%%
```

**Saída:**
```
(A função não gera saída visível. O banner é exibido normalmente e a região "Banner_Promocional" é registrada no tracking de impressões.)
```

## Exemplo avançado

E-mail de régua de relacionamento da Lojas Vitória com conteúdo condicional — cada bloco exibido é rastreado como uma região de impressão separada, permitindo analisar depois qual oferta foi mostrada para cada segmento de clientes:

```ampscript
%%[
  SET @categoria = AttributeValue("CategoriaPreferida")
  SET @nome = AttributeValue("PrimeiroNome")
]%%

Olá, %%=v(@nome)=%%! Confira sua oferta exclusiva:

%%[ IF @categoria == "Eletrônicos" THEN ]%%

  %%=BeginImpressionRegion("Oferta_Eletronicos")=%%

  <table width="100%" cellpadding="10">
    <tr>
      <td>
        <h2>Smartphones a partir de R$ 1.299,90</h2>
        <p>Frete grátis para São Paulo e Curitiba!</p>
      </td>
    </tr>
  </table>

  %%=EndImpressionRegion()=%%

%%[ ELSEIF @categoria == "Moda" THEN ]%%

  %%=BeginImpressionRegion("Oferta_Moda")=%%

  <table width="100%" cellpadding="10">
    <tr>
      <td>
        <h2>Nova coleção com 30% OFF</h2>
        <p>Parcele em até 6x sem juros no cartão.</p>
      </td>
    </tr>
  </table>

  %%=EndImpressionRegion()=%%

%%[ ELSE ]%%

  %%=BeginImpressionRegion("Oferta_Geral")=%%

  <table width="100%" cellpadding="10">
    <tr>
      <td>
        <h2>Ofertas imperdíveis para você</h2>
        <p>Até 25% de desconto em todo o site!</p>
      </td>
    </tr>
  </table>

  %%=EndImpressionRegion()=%%

%%[ ENDIF ]%%
```

**Saída:**
```
(Para um assinante com CategoriaPreferida = "Eletrônicos", o bloco "Oferta_Eletronicos" é exibido e registrado no tracking. Os demais blocos não são renderizados nem rastreados. Nenhuma saída visível é gerada pelas funções de impressão em si.)
```

## Observações

> **⚠️ Atenção:** Regiões de impressão funcionam **apenas em mensagens de e-mail enviadas (outbound)**. CloudPages **não suportam** impression regions.

- A função não gera nenhuma saída visível no e-mail. Ela apenas marca internamente onde começa a região de rastreamento.
- Toda região aberta com `BeginImpressionRegion` deve ser fechada com [`EndImpressionRegion`](../content-functions/endimpressionregion.md). Se você esquecer de fechar, o sistema fecha automaticamente no final do e-mail — mas é boa prática sempre fechar explicitamente para evitar que o rastreamento capture conteúdo que você não pretendia incluir na região.

> **💡 Dica:** Use nomes descritivos e padronizados para as regiões (ex: `"Header_Principal"`, `"Bloco_Oferta_Eletronicos"`, `"Footer_RedesSociais"`). Isso facilita muito a análise posterior nos relatórios de impression tracking, especialmente quando você trabalha com vários blocos de conteúdo dinâmico no mesmo e-mail.

## Funções relacionadas

- [EndImpressionRegion](../content-functions/endimpressionregion.md) — fecha a região de impressão aberta por `BeginImpressionRegion`
- [ContentBlockByName](../content-functions/contentblockbyname.md) — útil para modularizar blocos de conteúdo que serão rastreados
- [ContentBlockByKey](../content-functions/contentblockbykey.md) — alternativa para referenciar blocos de conteúdo por chave