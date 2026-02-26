---
title: EndImpressionRegion
sidebar_label: EndImpressionRegion
description: Encerra uma região de rastreamento de impressões iniciada por BeginImpressionRegion no e-mail.
---

# EndImpressionRegion

## Descrição

A função `EndImpressionRegion` marca o fim de uma região de rastreamento de impressões no seu e-mail. Ela trabalha em conjunto com a função `BeginImpressionRegion`, que abre a região. Você usa essa função quando quer medir quais blocos de conteúdo foram efetivamente renderizados e exibidos para cada assinante. Ela aceita um parâmetro booleano que permite fechar apenas a região imediatamente anterior ou todas as regiões abertas de uma vez.

## Sintaxe

```ampscript
EndImpressionRegion(boolEndAllRegions)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| boolEndAllRegions | Booleano | Não | Se `true` (ou `1`), encerra **todas** as regiões de impressão abertas anteriormente. Se `false` (ou `0`), encerra apenas a região de impressão imediatamente anterior. O valor padrão é `false`. |

## Exemplo básico

Imagine que você tem um e-mail da **MegaStore** com um banner de promoção de Dia das Mães e quer rastrear se esse bloco foi exibido para o assinante:

```ampscript
%%[
BeginImpressionRegion("Banner_DiaDasMaes")
]%%

<div style="background-color:#ff69b4; padding:20px; text-align:center;">
  <h1>Feliz Dia das Mães! 💐</h1>
  <p>Até 40% de desconto em presentes selecionados na MegaStore</p>
  <p>Frete grátis acima de R$299,00</p>
  <a href="https://www.megastore.com.br/diadasmaes">Confira as ofertas</a>
</div>

%%[
EndImpressionRegion(false)
]%%
```

**Saída:**

O bloco HTML do banner é renderizado normalmente para o assinante. Nos bastidores, o Marketing Cloud registra que a região "Banner_DiaDasMaes" foi exibida para aquele contato, permitindo que você analise os dados de impressão depois.

## Exemplo avançado

Agora um cenário mais completo: a **Conecta Telecom** envia um e-mail com múltiplas regiões de impressão — uma para clientes pós-pago e outra para pré-pago — e quer rastrear qual bloco foi exibido para cada assinante. No final, encerra todas as regiões de uma vez:

```ampscript
%%[
SET @plano = AttributeValue("TipoPlano")
SET @nomeCliente = AttributeValue("PrimeiroNome")

IF @plano == "pos-pago" THEN
  BeginImpressionRegion("Oferta_PosPago")
]%%

<div style="padding:20px; border:2px solid #0066cc;">
  <h2>Olá, %%=v(@nomeCliente)=%% 👋</h2>
  <p>Como cliente pós-pago da Conecta Telecom, você ganhou <strong>10GB extras</strong> este mês!</p>
  <p>Ative agora pelo app e aproveite.</p>
  <a href="https://www.conectatelecom.com.br/ativar-bonus">Ativar bônus</a>
</div>

%%[
ELSE
  BeginImpressionRegion("Oferta_PrePago")
]%%

<div style="padding:20px; border:2px solid #00cc66;">
  <h2>E aí, %%=v(@nomeCliente)=%%! 🎉</h2>
  <p>Recarga de R$30,00 e ganhe o dobro de internet!</p>
  <p>Válido até 31/12/2024.</p>
  <a href="https://www.conectatelecom.com.br/recarga-promo">Recarregar agora</a>
</div>

%%[
ENDIF

/* Encerra TODAS as regiões de impressão abertas de uma vez */
EndImpressionRegion(true)
]%%

<div style="padding:10px; text-align:center; color:#999;">
  <p>Conecta Telecom - Levando você mais longe</p>
  <p>CNPJ: 00.000.000/0001-00 | SAC: 0800 123 4567</p>
</div>
```

**Saída:**

Se o assinante **João Silva** tem o plano `pos-pago`, ele vê o bloco com a oferta de 10GB extras, e o Marketing Cloud registra uma impressão na região "Oferta_PosPago". Se a assinante **Maria Santos** tem plano `pre-pago`, ela vê o bloco de recarga com bônus, e a impressão é registrada na região "Oferta_PrePago". O `EndImpressionRegion(true)` no final garante que qualquer região que tenha ficado aberta é encerrada.

## Observações

- **Fechamento automático:** O sistema encerra automaticamente todas as regiões de impressão que não forem explicitamente fechadas até o final do e-mail. Mesmo assim, é uma boa prática sempre fechar suas regiões manualmente para manter o código organizado e evitar resultados inesperados.
- **Parâmetro padrão:** Se você chamar `EndImpressionRegion()` sem passar nenhum parâmetro, o comportamento padrão é `false` — ou seja, só a região imediatamente anterior será encerrada.
- **Regiões aninhadas:** Se você tiver regiões de impressão aninhadas (uma dentro da outra), usar `EndImpressionRegion(false)` fecha apenas a mais interna. Já `EndImpressionRegion(true)` fecha todas de uma vez, incluindo as externas.
- **Contexto de uso:** O rastreamento de impressões é uma funcionalidade voltada para **e-mails**. Os dados de impressão ficam disponíveis nos relatórios do Marketing Cloud para análise de performance dos blocos de conteúdo.
- **Sempre use em par:** Essa função só faz sentido quando usada junto com `BeginImpressionRegion`. Sem abrir uma região antes, o `EndImpressionRegion` não terá efeito prático.

## Funções relacionadas

- [BeginImpressionRegion](../content-functions/beginimpressionregion.md) — Inicia uma região de rastreamento de impressões (par obrigatório do EndImpressionRegion)
- [ContentBlockByName](../content-functions/contentblockbyname.md) — Insere um bloco de conteúdo pelo nome, útil para modularizar regiões rastreadas
- [ContentBlockByKey](../content-functions/contentblockbykey.md) — Insere um bloco de conteúdo pela chave externa
- [AttributeValue](../utility-functions/attributevalue.md) — Recupera o valor de um atributo do assinante, útil para personalizar regiões condicionais
- [V](../utility-functions/v.md) — Exibe o valor de uma variável inline no HTML