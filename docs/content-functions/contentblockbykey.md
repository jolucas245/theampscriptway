---
title: ContentBlockByKey
sidebar_label: ContentBlockByKey
description: Recupera e renderiza o conteúdo de um Content Block usando sua Customer Key (chave externa) no Salesforce Marketing Cloud.
---

# ContentBlockByKey

## Descrição

A função `ContentBlockByKey` busca e renderiza o conteúdo de um Content Block (bloco de conteúdo) armazenado no Content Builder, usando a **Customer Key** (também chamada de External Key) como identificador. É a forma mais recomendada de referenciar Content Blocks, porque a Customer Key não muda mesmo se você mover o bloco para outra pasta ou renomeá-lo. Isso torna seus templates muito mais robustos e fáceis de manter. A função retorna o conteúdo do bloco como string, processando qualquer AMPscript, HTML ou personalização que exista dentro dele.

## Sintaxe

```ampscript
ContentBlockByKey(@customerKey)
ContentBlockByKey(@customerKey, @impressionRegionName)
ContentBlockByKey(@customerKey, @impressionRegionName, @throwError)
ContentBlockByKey(@customerKey, @impressionRegionName, @throwError, @defaultContent)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| @customerKey | string | Sim | A Customer Key (External Key) do Content Block no Content Builder. Você encontra esse valor nas propriedades do bloco. |
| @impressionRegionName | string | Não | Nome da Impression Region para tracking de impressões. Use uma string vazia `""` se não quiser usar, mas precisar passar os parâmetros seguintes. |
| @throwError | boolean | Não | Define se um erro deve ser disparado caso o Content Block não seja encontrado. `true` (padrão) gera erro; `false` suprime o erro silenciosamente. |
| @defaultContent | string | Não | Conteúdo padrão que será exibido caso o Content Block não seja encontrado e `@throwError` esteja definido como `false`. |

## Exemplo básico

Imagine que você tem um bloco de cabeçalho padrão salvo no Content Builder com a Customer Key `header-email-principal`. Você quer reutilizá-lo em vários emails:

```ampscript
%%=ContentBlockByKey("header-email-principal")=%%

<h1>Olá, %%=v(@PrimeiroNome)=%%!</h1>
<p>Confira nossas ofertas especiais de Dia das Mães!</p>

%%=ContentBlockByKey("footer-email-principal")=%%
```

**Saída:**
```html
<!-- Conteúdo do header renderizado aqui -->

<h1>Olá, Maria!</h1>
<p>Confira nossas ofertas especiais de Dia das Mães!</p>

<!-- Conteúdo do footer renderizado aqui -->
```

## Exemplo avançado

Aqui temos um cenário real de e-commerce: a **MegaStore** envia um email promocional de Black Friday. O conteúdo principal da oferta fica num Content Block separado, e usamos um fallback caso o bloco não exista. Além disso, personalizamos com dados do assinante vindos de uma Data Extension:

```ampscript
%%[
  SET @email = AttributeValue("EmailAddress")
  SET @nome = AttributeValue("PrimeiroNome")

  /* Busca dados do cliente na DE de programa de pontos */
  SET @pontos = Lookup("ProgramaFidelidade", "Pontos", "Email", @email)
  SET @pontos = IIF(IsNull(@pontos), 0, @pontos)

  /* Define qual bloco de oferta exibir baseado nos pontos */
  IF @pontos >= 5000 THEN
    SET @chaveOferta = "blackfriday-oferta-vip"
  ELSEIF @pontos >= 1000 THEN
    SET @chaveOferta = "blackfriday-oferta-gold"
  ELSE
    SET @chaveOferta = "blackfriday-oferta-padrao"
  ENDIF

  /* Conteúdo padrão caso o bloco não exista */
  SET @fallback = Concat("<p>Olá, ", @nome, "! Aproveite até 70% OFF na Black Friday MegaStore. Frete grátis acima de R$299!</p>")
]%%

<!-- Header reutilizável -->
%%=ContentBlockByKey("header-megastore-2024")=%%

<div style="padding: 20px;">
  <h1>Fala, %%=v(@nome)=%%! 🖤</h1>
  <p>Você tem <strong>%%=FormatNumber(@pontos, "N0")=%%</strong> pontos no programa MegaStore Fidelidade.</p>

  <!-- Bloco de oferta personalizado com fallback -->
  %%=ContentBlockByKey(@chaveOferta, "", false, @fallback)=%%

  <table role="presentation" width="100%">
    <tr>
      <td align="center" style="padding: 20px;">
        <a href="https://www.megastore.com.br/black-friday"
           style="background-color: #000; color: #fff; padding: 15px 40px; text-decoration: none; font-size: 18px;">
          VER OFERTAS
        </a>
      </td>
    </tr>
  </table>

  <p style="font-size: 12px; color: #666;">
    Oferta válida de 24/11/2024 a 01/12/2024.
    Cupom de cashback de R$50 para compras acima de R$500.
  </p>
</div>

<!-- Footer reutilizável com Impression Region para tracking -->
%%=ContentBlockByKey("footer-megastore-2024", "footer-impression")=%%
```

**Saída (exemplo para cliente VIP com 7.500 pontos):**
```html
<!-- Header da MegaStore renderizado -->

<div style="padding: 20px;">
  <h1>Fala, João! 🖤</h1>
  <p>Você tem <strong>7.500</strong> pontos no programa MegaStore Fidelidade.</p>

  <!-- Conteúdo do bloco "blackfriday-oferta-vip" renderizado com ofertas exclusivas -->

  <table role="presentation" width="100%">
    <tr>
      <td align="center" style="padding: 20px;">
        <a href="https://www.megastore.com.br/black-friday"
           style="background-color: #000; color: #fff; padding: 15px 40px; text-decoration: none; font-size: 18px;">
          VER OFERTAS
        </a>
      </td>
    </tr>
  </table>

  <p style="font-size: 12px; color: #666;">
    Oferta válida de 24/11/2024 a 01/12/2024.
    Cupom de cashback de R$50 para compras acima de R$500.
  </p>
</div>

<!-- Footer da MegaStore renderizado com tracking de impressão -->
```

## Observações

- **Customer Key vs. Name vs. ID:** A `ContentBlockByKey` usa a Customer Key (External Key), que é um identificador único que você pode definir ao criar o bloco no Content Builder. É diferente do nome do bloco (usado por [ContentBlockByName](../content-functions/contentblockbyname.md)) e do ID numérico (usado por [ContentBlockById](../content-functions/contentblockbyid.md)).
- **Por que preferir a Key?** A Customer Key não muda quando você renomeia ou move o Content Block para outra pasta. Já o nome e o caminho de pastas podem mudar, quebrando referências feitas com `ContentBlockByName`. Por isso, `ContentBlockByKey` é considerada a abordagem mais segura e recomendada.
- **Onde encontrar a Customer Key:** No Content Builder, abra o bloco de conteúdo, clique em "Properties" (Propriedades). O campo "Customer Key" ou "External Key" estará listado ali. Você também pode definir uma key customizada na criação do bloco.
- **Comportamento de erro:** Por padrão, se o Content Block não for encontrado, a função gera um erro que impede o envio do email para aquele assinante. Use o terceiro parâmetro como `false` para suprimir o erro e, idealmente, combine com o quarto parâmetro para exibir um conteúdo de fallback.
- **AMPscript dentro do bloco é processado:** Se o Content Block referenciado contém AMPscript, ele será processado normalmente no contexto do email/página. Variáveis definidas antes da chamada ficam disponíveis dentro do bloco.
- **Cuidado com recursão:** Evite criar Content Blocks que referenciam uns aos outros em loop (A chama B, que chama A). Isso gera erro de recursão.
- **Funciona em vários contextos:** A função pode ser usada em emails, CloudPages, Landing Pages e SMS (em templates que suportam AMPscript).
- **Performance:** Muitas chamadas `ContentBlockByKey` em um único email podem impactar o tempo de renderização. Use com bom senso — é ótimo para headers, footers e blocos modulares, mas não exagere na quantidade.
- **Impression Regions:** O segundo parâmetro permite rastrear impressões do conteúdo via [BeginImpressionRegion](../content-functions/beginimpressionregion.md) / [EndImpressionRegion](../content-functions/endimpressionregion.md). É útil para medir qual conteúdo dinâmico foi exibido para cada assinante.

## Funções relacionadas

- [ContentBlockById](../content-functions/contentblockbyid.md) — Recupera um Content Block usando seu ID numérico interno
- [ContentBlockByName](../content-functions/contentblockbyname.md) — Recupera um Content Block usando seu nome e caminho de pastas
- [TreatAsContent](../utility-functions/treatascontent.md) — Processa uma string como se fosse conteúdo AMPscript (útil para renderizar conteúdo dinâmico armazenado em Data Extensions)
- [ContentArea](../content-functions/contentarea.md) — Recupera uma Classic Content Area (função legada, anterior ao Content Builder)
- [ContentAreaByName](../content-functions/contentareabyname.md) — Recupera uma Classic Content Area pelo nome (função legada)
- [TreatAsContentArea](../content-functions/treatascontentarea.md) — Trata uma string como Content Area para processamento
- [BeginImpressionRegion](../content-functions/beginimpressionregion.md) — Inicia uma região de rastreamento de impressões
- [Lookup](../data-extension-functions/lookup.md) — Busca um valor em uma Data Extension (útil para combinar com conteúdo dinâmico)
- [AttributeValue](../utility-functions/attributevalue.md) — Recupera o valor de um atributo do assinante ou coluna da sendable DE