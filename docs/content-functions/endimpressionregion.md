---
title: EndImpressionRegion
sidebar_label: EndImpressionRegion
description: Encerra uma ou todas as regiões de rastreamento de impressões (impression tracking) definidas no e-mail.
---

# EndImpressionRegion

## Descrição

Marca o fim de uma região de rastreamento de impressões no e-mail. Essa função trabalha em conjunto com [BeginImpressionRegion](../content-functions/beginimpressionregion.md) para delimitar blocos de conteúdo que você quer monitorar via impression tracking no Marketing Cloud. Você pode optar por encerrar apenas a região imediatamente anterior ou fechar todas as regiões abertas de uma só vez.

## Sintaxe

```ampscript
EndImpressionRegion(boolEndAllRegions)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| boolEndAllRegions | Boolean | Não | Se `true` (ou `1`), encerra **todas** as regiões de impressão anteriores. Se `false` (ou `0`), encerra apenas a região de impressão imediatamente precedente. O valor padrão é `false`. |

## Exemplo básico

Encerrando apenas a região de impressão anterior - útil quando você tem um bloco de banner promocional da MegaStore e quer rastrear separadamente cada seção do e-mail.

```ampscript
%%[
BeginImpressionRegion("Banner_Promocional")
]%%

<table width="100%">
  <tr>
    <td style="text-align:center;">
      <h2>Oferta Relâmpago MegaStore</h2>
      <p>Smart TV 55" por apenas R$ 2.499,90 em até 12x sem juros!</p>
      <a href="https://www.megastore.com.br/ofertas">Aproveite agora</a>
    </td>
  </tr>
</table>

%%[
EndImpressionRegion(false)
]%%
```

**Saída:**
```
(O conteúdo HTML do banner é renderizado normalmente no e-mail. A região "Banner_Promocional" é rastreada e encerrada.)
```

## Exemplo avançado

E-mail com múltiplas seções rastreáveis em uma régua de relacionamento da Lojas Vitória - cada bloco de conteúdo tem sua própria região de impressão, e ao final usamos o parâmetro `true` para garantir que todas as regiões sejam fechadas.

```ampscript
%%[
VAR @nome
SET @nome = AttributeValue("PrimeiroNome")
SET @nome = IIF(Empty(@nome), "Cliente", @nome)

/* Região 1: Header personalizado */
BeginImpressionRegion("Header_Personalizado")
]%%

<h1>Olá, %%=V(@nome)=%%! Confira nossas ofertas de hoje</h1>

%%[
/* Região 2: Vitrine de produtos (aninhada dentro da região 1) */
BeginImpressionRegion("Vitrine_Produtos")
]%%

<table width="100%">
  <tr>
    <td>
      <p><strong>Notebook Gamer</strong></p>
      <p>De R$ 6.999,90 por <strong>R$ 5.299,90</strong></p>
    </td>
    <td>
      <p><strong>Smartphone 256GB</strong></p>
      <p>De R$ 3.499,90 por <strong>R$ 2.799,90</strong></p>
    </td>
  </tr>
</table>

%%[
/* Região 3: Cupom de desconto (aninhada) */
BeginImpressionRegion("Cupom_Desconto")
]%%

<div style="background-color:#f5f5f5; padding:15px; text-align:center;">
  <p>Use o cupom <strong>VITORIA15</strong> e ganhe 15% de desconto adicional!</p>
  <p>Válido até 31/12/2024</p>
</div>

%%[
/* Encerra TODAS as regiões de uma vez */
EndImpressionRegion(true)
]%%

<p style="font-size:12px; color:#999;">
  Lojas Vitória - São Paulo, SP | SAC: (11) 3000-1234
</p>
```

**Saída:**
```
Olá, Maria! Confira nossas ofertas de hoje

Notebook Gamer
De R$ 6.999,90 por R$ 5.299,90

Smartphone 256GB
De R$ 3.499,90 por R$ 2.799,90

Use o cupom VITORIA15 e ganhe 15% de desconto adicional!
Válido até 31/12/2024

Lojas Vitória - São Paulo, SP | SAC: (11) 3000-1234

(As três regiões - Header_Personalizado, Vitrine_Produtos e Cupom_Desconto - são rastreadas e encerradas simultaneamente.)
```

## Observações

> **💡 Dica:** Quando você tem regiões de impressão aninhadas (uma dentro da outra), usar `EndImpressionRegion(true)` no final é uma forma prática de garantir que tudo seja encerrado de uma vez, sem precisar fechar cada região individualmente.

> **⚠️ Atenção:** O sistema encerra automaticamente todas as regiões de impressão que não forem explicitamente fechadas até o final do e-mail. Mesmo assim, é boa prática sempre fechar suas regiões com `EndImpressionRegion` para manter o código organizado e o rastreamento previsível.

- O valor padrão do parâmetro é `false`, então chamar `EndImpressionRegion(false)` tem o mesmo efeito que uma chamada sem intenção de fechar tudo - apenas a região imediatamente anterior é encerrada.

## Funções relacionadas

- [BeginImpressionRegion](../content-functions/beginimpressionregion.md) - abre uma região de impressão (par obrigatório desta função)
- [ContentBlockByName](../content-functions/contentblockbyname.md) - para carregar blocos de conteúdo que podem conter regiões de impressão
- [ContentBlockByKey](../content-functions/contentblockbykey.md) - alternativa para carregar blocos via chave externa