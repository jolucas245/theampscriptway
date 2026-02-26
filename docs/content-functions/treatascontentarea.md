---
title: TreatAsContentArea
sidebar_label: TreatAsContentArea
description: Trata conteúdo recuperado de uma Data Extension ou outra fonte como se fosse uma Content Area fixa, permitindo reutilização e rastreamento via Impression Regions.
---

<!-- generated-by-script -->

# TreatAsContentArea

## Descrição

A função `TreatAsContentArea()` pega um conteúdo que você recuperou de uma Data Extension (ou outra fonte) e faz o SFMC tratá-lo como se fosse uma Content Area nativa — aquelas áreas de conteúdo fixo do sistema. Isso é super útil quando você quer montar blocos de conteúdo dinâmicos no e-mail, mas precisa que eles se comportem como "áreas de conteúdo virtuais", inclusive com suporte a Impression Regions para rastreamento de engajamento. Na prática, você armazena o conteúdo sob uma chave (key) e pode reaproveitá-lo ao longo do mesmo envio, além de associar uma região de impressão para tracking.

## Sintaxe

```ampscript
TreatAsContentArea(contentKey, contentValue)
TreatAsContentArea(contentKey, contentValue, impressionRegion)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| contentKey | String | Sim | Chave que identifica o conteúdo armazenado. A função trata chaves em contexto de texto como distintas de chaves em contexto HTML. Você pode usar a mesma chave para identificar versões texto e HTML do conteúdo. O processamento das chaves é **case-insensitive** (não diferencia maiúsculas de minúsculas). |
| contentValue | String | Sim | O conteúdo que será armazenado para o envio do e-mail sob a chave especificada. Normalmente você recupera esse valor usando funções como `Lookup()` ou `HTTPGet()`. |
| impressionRegion | String | Não | Nome da Impression Region associada a essa área de conteúdo virtual. O número máximo de blocos de conteúdo virtuais por envio é **300**. |

## Exemplo básico

Imagina que a **Lojas Vitória** tem uma Data Extension chamada `ConteudoPromocional` onde cada registro guarda um bloco HTML de oferta. Você quer puxar esse conteúdo e tratá-lo como uma Content Area:

```ampscript
%%[
SET @htmlOferta = Lookup("ConteudoPromocional", "BlocoHTML", "CampanhaID", "NATAL2024")
TreatAsContentArea("OfertaNatal", @htmlOferta)
]%%
```

**Saída:**

O conteúdo HTML armazenado na coluna `BlocoHTML` para a campanha `NATAL2024` será renderizado no e-mail como se fosse uma Content Area fixa, registrado internamente sob a chave `OfertaNatal`.

## Exemplo avançado

Agora um cenário mais completo: a **MegaStore** envia e-mails personalizados para o Dia das Mães. Cada categoria de cliente recebe um bloco de conteúdo diferente, armazenado em uma Data Extension. Além disso, queremos rastrear as impressões de cada bloco com Impression Regions:

```ampscript
%%[
/* Busca a categoria do cliente na DE de perfil */
SET @categoriaCliente = Lookup("PerfilClientes", "Categoria", "EmailAssinante", EmailAddr)

/* Define a chave do conteúdo baseada na categoria */
SET @chaveConteudo = Concat("DiaDasMaes_", @categoriaCliente)

/* Busca o bloco HTML correspondente na DE de conteúdo */
SET @htmlBloco = Lookup("ConteudoCampanhas", "BlocoHTML", "ChaveConteudo", @chaveConteudo)

/* Busca também a versão texto para multipart */
SET @textoBloco = Lookup("ConteudoCampanhas", "BlocoTexto", "ChaveConteudo", @chaveConteudo)

/* Verifica se encontrou conteúdo */
IF NOT Empty(@htmlBloco) THEN
  /* Trata como Content Area com Impression Region para tracking */
  SET @nomeImpressao = Concat("Impressao_DiadasMaes_", @categoriaCliente)
  TreatAsContentArea("BlocoDiaDasMaes", @htmlBloco, @nomeImpressao)
ELSE
  /* Conteúdo padrão caso não encontre a categoria */
  SET @htmlFallback = Concat("<div style='text-align:center;'>")
  SET @htmlFallback = Concat(@htmlFallback, "<h2>Feliz Dia das Mães!</h2>")
  SET @htmlFallback = Concat(@htmlFallback, "<p>Confira nossas ofertas especiais com frete grátis acima de R$299!</p>")
  SET @htmlFallback = Concat(@htmlFallback, "<a href='https://www.megastore.com.br/diadasmaes'>Ver ofertas</a>")
  SET @htmlFallback = Concat(@htmlFallback, "</div>")
  TreatAsContentArea("BlocoDiaDasMaes", @htmlFallback, "Impressao_DiadasMaes_Padrao")
ENDIF
]%%
```

**Saída:**

Para uma assinante como **Maria Santos**, que está na categoria `Premium`, o sistema busca o bloco com chave `DiaDasMaes_Premium`, renderiza o HTML personalizado no e-mail e registra a impressão na região `Impressao_DiadasMaes_Premium`. Se a categoria não for encontrada, exibe o conteúdo padrão com a promoção de frete grátis acima de R$299.

## Exemplo com chave dinâmica via atributo

Você também pode usar um atributo do assinante ou campo da Data Extension de envio como chave:

```ampscript
%%[
SET @chaveAssinante = AttributeValue("ChaveConteudo")
SET @conteudo = Lookup("BlocosEmail", "HTML", "Chave", @chaveAssinante)

IF NOT Empty(@conteudo) THEN
  TreatAsContentArea(@chaveAssinante, @conteudo, "RegiaoPrincipal")
ENDIF
]%%
```

**Saída:**

O conteúdo é armazenado sob a chave que veio do atributo do assinante (por exemplo, `BLACKFRIDAY_VIP`), funcionando como uma Content Area virtual com rastreamento na Impression Region `RegiaoPrincipal`.

## Observações

- **Segurança é fundamental:** Sempre sanitize o input do usuário dentro de um bloco `TreatAsContentArea()`. Remova, escape ou bloqueie conteúdo que contenha tags HTML ou código AMPscript. Use uma lista de caracteres permitidos (allowlist) quando possível. Isso evita ataques de injeção.
- **Limite de 300 blocos virtuais:** O número máximo de blocos de conteúdo virtuais (Content Areas virtuais) por envio é 300. Se ultrapassar, o comportamento pode ser imprevisível.
- **Chaves são case-insensitive:** `"OfertaNatal"`, `"ofertanatal"` e `"OFERTANATAL"` são tratadas como a mesma chave.
- **Contexto texto vs. HTML:** A função trata uma chave usada em contexto de texto como distinta de uma chave usada em contexto HTML. Ou seja, você pode usar a mesma string de chave para armazenar tanto a versão texto quanto a versão HTML do conteúdo sem conflito.
- **Recuperação de conteúdo:** Use funções como [Lookup](../data-extension-functions/lookup.md) ou [HTTPGet](../http-functions/httpget.md) para buscar o conteúdo que será passado como `contentValue`.
- **Impression Regions:** Se você precisa rastrear impressões de blocos dinâmicos (por exemplo, para saber qual variação de oferta foi exibida), o terceiro parâmetro é o caminho. Veja também [BeginImpressionRegion](../content-functions/beginimpressionregion.md) e [EndImpressionRegion](../content-functions/endimpressionregion.md) para controle mais granular.
- **Diferença para TreatAsContent:** A função [TreatAsContent](../utility-functions/treatascontent.md) simplesmente processa uma string como se fosse conteúdo AMPscript/HTML inline, sem criar uma "área de conteúdo virtual" com chave e sem suporte a Impression Regions. Use `TreatAsContentArea()` quando precisar dessas funcionalidades extras.
- **Contexto de uso:** Funciona no contexto de envio de e-mails. É projetada para cenários onde o conteúdo vem de fontes externas (Data Extensions, APIs via HTTPGet) e precisa ser tratado como Content Area nativa.

## Funções relacionadas

- [TreatAsContent](../utility-functions/treatascontent.md) — Processa uma string como conteúdo AMPscript/HTML, sem criar uma Content Area virtual
- [Lookup](../data-extension-functions/lookup.md) — Busca valores em Data Extensions, frequentemente usada para recuperar o conteúdo passado para TreatAsContentArea
- [HTTPGet](../http-functions/httpget.md) — Recupera conteúdo de URLs externas para usar como valor de conteúdo
- [ContentArea](../content-functions/contentarea.md) — Referencia uma Content Area nativa pelo ID
- [ContentAreaByName](../content-functions/contentareabyname.md) — Referencia uma Content Area nativa pelo nome
- [ContentBlockByKey](../content-functions/contentblockbykey.md) — Referencia um Content Block pela chave externa
- [ContentBlockByName](../content-functions/contentblockbyname.md) — Referencia um Content Block pelo nome
- [BeginImpressionRegion](../content-functions/beginimpressionregion.md) — Inicia uma Impression Region para rastreamento de conteúdo
- [EndImpressionRegion](../content-functions/endimpressionregion.md) — Encerra uma Impression Region
- [AttributeValue](../utility-functions/attributevalue.md) — Recupera valores de atributos do assinante, útil para chaves dinâmicas
- [Concat](../string-functions/concat.md) — Concatena strings, útil para montar chaves e conteúdos dinâmicos
- [Empty](../utility-functions/empty.md) — Verifica se um valor está vazio, útil para validação antes de tratar conteúdo