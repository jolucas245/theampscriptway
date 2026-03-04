---
title: Link Aliases Dinâmicos
sidebar_label: Link Aliases Dinâmicos
description: Use AMPscript para criar aliases dinâmicos em links de e-mail e segmentar métricas de clique por atributo do subscriber.
sidebar_position: 11
---

# Link Aliases Dinâmicos

Quando um e-mail HTML tem múltiplos links, pode ser difícil identificar nos relatórios quem clicou em qual link — especialmente quando dois links têm o mesmo texto ou a mesma URL. O atributo `alias` resolve isso: você dá um nome identificador para cada link, e ele aparece separado nas métricas de engajamento.

## Como funciona

Adicione o atributo `alias` diretamente na tag `<a>` do HTML. O conteúdo do alias não é visível para quem recebe o e-mail — serve apenas para identificação nos relatórios.

```html
<a href="https://www.lojvitoria.com.br/ofertas" alias="oferta-principal">
    Ver ofertas
</a>
```

## Aliases dinâmicos com AMPscript

Você pode usar AMPscript para gerar o valor do alias dinamicamente, com base em dados do subscriber. Isso é útil para segmentar métricas por atributo — região, segmento, faixa etária — sem precisar criar versões diferentes do e-mail.

O exemplo abaixo rastreia cliques separados por região do cliente:

```ampscript
%%[
SET @regiao = Lookup('Clientes_DE', 'Regiao', 'Email', emailaddr)
]%%

<a href="https://www.megastore.com.br/ofertas-regiao"
   alias="%%=v(@regiao)=%%">
    Ver ofertas da sua região
</a>
```

Com isso, nos relatórios de engajamento você verá métricas separadas para cada valor de `@regiao` — por exemplo: `Sudeste`, `Nordeste`, `Sul`. Você consegue entender como clientes de regiões diferentes interagem com a mesma mensagem, sem criar e-mails distintos.

> **⚠️ Atenção:** O limite é de **100 nomes de alias distintos** por e-mail. Se o alias dinâmico gerar mais de 100 valores únicos, os excedentes são agrupados sob um nome genérico nas métricas.

> **💡 Dica:** Aliases dinâmicos são especialmente úteis em campanhas de régua de relacionamento onde você envia o mesmo e-mail para bases segmentadas por estado, plano ou perfil de compra. Em vez de duplicar templates, você mantém um único e-mail e analisa o comportamento de cada segmento separadamente.

## Disponibilidade

Links aliases dinâmicos funcionam **apenas em e-mails HTML**. Não estão disponíveis em e-mails texto, SMS ou CloudPages.
