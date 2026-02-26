---
title: ContentBlockByName
sidebar_label: ContentBlockByName
description: Recupera e renderiza o conteúdo de um Content Block (bloco de conteúdo) do Content Builder usando o caminho e nome da pasta.
---

# ContentBlockByName

## Descrição

A função `ContentBlockByName` busca e renderiza o conteúdo de um Content Block armazenado no Content Builder, usando o **caminho completo de pastas e o nome do bloco** como identificador. Isso é super útil quando você quer reaproveitar trechos de HTML, AMPscript ou até blocos inteiros de e-mail em vários lugares — tipo um header, footer, disclaimer jurídico ou um bloco de promoção que muda com frequência. A grande sacada é que, ao atualizar o Content Block original, todos os e-mails que referenciam ele são atualizados automaticamente no próximo envio. A função retorna o conteúdo renderizado do bloco, já processando qualquer AMPscript ou personalização que existir dentro dele.

## Sintaxe

```ampscript
ContentBlockByName("Content Builder\caminho\nome_do_bloco")
ContentBlockByName("Content Builder\caminho\nome_do_bloco", "Conteúdo de impressão caso não encontre")
ContentBlockByName("Content Builder\caminho\nome_do_bloco", "Conteúdo de impressão caso não encontre", @ErrorOutput)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| NomeDoBloco | String | Sim | Caminho completo do Content Block no Content Builder, começando com `Content Builder\`. Inclui todas as subpastas e o nome do bloco separados por `\`. |
| ConteudoPadrao | String | Não | Conteúdo alternativo que será exibido caso o Content Block não seja encontrado. Se omitido e o bloco não existir, um erro será gerado. |
| ErroOutput | Variável | Não | Variável que receberá a descrição do erro, caso o Content Block não seja encontrado. Útil para depuração. |

## Exemplo básico

Imagine que você tem um bloco de header padrão salvo no Content Builder dentro da pasta `Componentes Globais` com o nome `Header Email`:

```ampscript
%%=ContentBlockByName("Content Builder\Componentes Globais\Header Email")=%%
```

**Saída:**
```html
<table width="100%" bgcolor="#1a237e">
  <tr>
    <td align="center" style="padding: 20px;">
      <img src="https://www.megastore.com.br/images/logo-branco.png" alt="MegaStore" width="200">
    </td>
  </tr>
</table>
```

## Exemplo avançado

Aqui temos um cenário real de e-mail de campanha de Dia das Mães da loja "Lojas Vitória". O e-mail usa vários Content Blocks reutilizáveis e combina com personalização dinâmica e dados de uma Data Extension:

```ampscript
%%[
  SET @primeiroNome = AttributeValue("PrimeiroNome")
  SET @categoriaPref = AttributeValue("CategoriaPreferida")
  SET @totalPontos = AttributeValue("PontosFidelidade")

  /* Busca dados de cupom personalizado */
  SET @cupomRow = LookupRows("CuponsAtivos", "Categoria", @categoriaPref)

  IF RowCount(@cupomRow) > 0 THEN
    SET @cupom = Field(Row(@cupomRow, 1), "CodigoCupom")
    SET @desconto = Field(Row(@cupomRow, 1), "PercentualDesconto")
  ELSE
    SET @cupom = "MAES2024"
    SET @desconto = "10"
  ENDIF
]%%

/* Header padrão da marca */
%%=ContentBlockByName("Content Builder\Lojas Vitória\Componentes\Header")=%%

<table width="100%" cellpadding="20">
  <tr>
    <td>
      <h1>Olá, %%=ProperCase(@primeiroNome)=%%! 💐</h1>
      <p>O Dia das Mães está chegando e separamos uma oferta especial pra você:</p>
      <p style="font-size: 24px; color: #d81b60;">
        <strong>%%=v(@desconto)=%%% OFF</strong> em %%=v(@categoriaPref)=%%
      </p>
      <p>Use o cupom: <strong>%%=v(@cupom)=%%</strong></p>
      <p>Frete grátis para compras acima de R$299,00!</p>

      %%[IF @totalPontos > 500 THEN]%%
        /* Bloco exclusivo para clientes fidelidade */
        %%=ContentBlockByName("Content Builder\Lojas Vitória\Fidelidade\Banner Pontos VIP")=%%
        <p>Você tem <strong>%%=FormatNumber(@totalPontos, "N0")=%%</strong> pontos acumulados. Que tal trocar por um presente extra?</p>
      %%[ENDIF]%%
    </td>
  </tr>
</table>

/* Bloco de categorias em destaque — com fallback caso não exista */
%%[
  SET @erroBloco = ""
  SET @blocoDestaque = ContentBlockByName("Content Builder\Lojas Vitória\Campanhas\Dia das Maes 2024\Categorias Destaque", "<p>Confira nossas ofertas em www.lojasvitoria.com.br</p>", @erroBloco)
]%%
%%=v(@blocoDestaque)=%%

/* Footer jurídico padrão */
%%=ContentBlockByName("Content Builder\Lojas Vitória\Componentes\Footer Juridico")=%%
```

**Saída:**
```html
<!-- Header renderizado -->
<table width="100%" bgcolor="#6a1b9a">
  <tr>
    <td align="center" style="padding: 15px;">
      <img src="https://www.lojasvitoria.com.br/images/logo.png" alt="Lojas Vitória" width="180">
    </td>
  </tr>
</table>

<table width="100%" cellpadding="20">
  <tr>
    <td>
      <h1>Olá, Maria! 💐</h1>
      <p>O Dia das Mães está chegando e separamos uma oferta especial pra você:</p>
      <p style="font-size: 24px; color: #d81b60;">
        <strong>15% OFF</strong> em Perfumaria
      </p>
      <p>Use o cupom: <strong>PERFMAES15</strong></p>
      <p>Frete grátis para compras acima de R$299,00!</p>

      <!-- Banner VIP renderizado do Content Block -->
      <table width="100%" bgcolor="#ffd600">
        <tr><td align="center" style="padding:10px;">⭐ Cliente VIP — Ofertas exclusivas para você!</td></tr>
      </table>
      <p>Você tem <strong>1.250</strong> pontos acumulados. Que tal trocar por um presente extra?</p>
    </td>
  </tr>
</table>

<!-- Categorias em destaque renderizadas -->
<table width="100%">
  <tr>
    <td>Perfumaria</td>
    <td>Bolsas</td>
    <td>Joias</td>
  </tr>
</table>

<!-- Footer jurídico renderizado -->
<table width="100%" style="font-size:11px; color:#999;">
  <tr>
    <td align="center" style="padding:15px;">
      Lojas Vitória Ltda — CNPJ: 12.345.678/0001-90<br>
      Rua das Flores, 1000 — São Paulo/SP — CEP 01310-100<br>
      <a href="%%unsub_center_url%%">Descadastrar</a> | <a href="%%profile_center_url%%">Gerenciar preferências</a>
    </td>
  </tr>
</table>
```

## Observações

- **O caminho sempre começa com `Content Builder\`**. Esse é o prefixo obrigatório, seguido pelas pastas e subpastas até o nome do bloco. Exemplo: `Content Builder\Minha Pasta\Subpasta\Nome do Bloco`.
- **O caminho é case-insensitive** — tanto faz usar maiúsculas ou minúsculas no nome das pastas e do bloco.
- **Se o Content Block não existir e você não informar o conteúdo padrão (segundo parâmetro), o envio vai gerar erro.** Sempre que possível, use o fallback para evitar dor de cabeça em produção.
- **AMPscript dentro do Content Block é processado normalmente.** Ou seja, se o bloco referenciado contém variáveis, lookups ou lógica condicional, tudo será executado no contexto do e-mail que está chamando.
- **Cuidado com referências circulares!** Se o Bloco A chama o Bloco B e o Bloco B chama o Bloco A, você vai ter um loop infinito que resulta em erro no envio.
- **Em contas com Business Units**, o caminho pode variar. O Content Block precisa estar acessível na BU de onde o envio está sendo feito, ou em uma pasta compartilhada.
- **Renomear ou mover o Content Block quebra a referência.** Se você mover o bloco para outra pasta ou trocar o nome dele, todos os e-mails que usam `ContentBlockByName` com o caminho antigo vão falhar. Para evitar isso, considere usar [ContentBlockByKey](../content-functions/contentblockbykey.md) ou [ContentBlockById](../content-functions/contentblockbyid.md), que são mais resilientes a mudanças de nome/caminho.
- **Funciona em e-mails, CloudPages, SMS e Landing Pages** — basicamente em qualquer contexto onde AMPscript é suportado.
- **Performance**: usar muitos Content Blocks aninhados (bloco dentro de bloco dentro de bloco) pode aumentar o tempo de renderização. Tente manter a profundidade de aninhamento razoável.
- **Para encontrar o caminho correto**: no Content Builder, navegue até o bloco desejado e anote a estrutura de pastas. O caminho é montado juntando `Content Builder\` + cada nível de pasta separado por `\` + o nome do bloco.

## Funções relacionadas

- [ContentBlockByKey](../content-functions/contentblockbykey.md) — Recupera um Content Block usando a Customer Key (mais resiliente a mudanças de nome/caminho).
- [ContentBlockById](../content-functions/contentblockbyid.md) — Recupera um Content Block usando o ID numérico do bloco.
- [ContentAreaByName](../content-functions/contentareabyname.md) — Recupera uma Content Area clássica pelo nome (funcionalidade legada, anterior ao Content Builder).
- [ContentArea](../content-functions/contentarea.md) — Recupera uma Content Area clássica pelo ID (funcionalidade legada).
- [TreatAsContent](../utility-functions/treatascontent.md) — Processa uma string como se fosse conteúdo AMPscript, útil quando você monta HTML dinamicamente e precisa que o AMPscript interno seja executado.
- [AttributeValue](../utility-functions/attributevalue.md) — Recupera o valor de um atributo do assinante, frequentemente usado dentro de Content Blocks para personalização.
- [Lookup](../data-extension-functions/lookup.md) — Busca um valor em uma Data Extension, muito comum dentro de Content Blocks dinâmicos.