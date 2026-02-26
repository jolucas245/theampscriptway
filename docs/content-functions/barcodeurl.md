---
title: BarcodeUrl
sidebar_label: BarcodeUrl
description: Gera a URL de uma imagem de código de barras a partir de uma string de entrada, suportando diversos padrões lineares e bidimensionais.
---

<!-- generated-by-script -->

# BarcodeUrl

## Descrição

A função `BarcodeUrl` gera uma URL que aponta para uma imagem de código de barras criada a partir de um valor de texto que você fornecer. Ela suporta a maioria dos tipos de códigos de barras lineares (unidimensionais) e também os formatos bidimensionais Data Matrix e PDF417 — mas **não** gera QR Codes. A função retorna uma URL de imagem, então você precisa envolvê-la em uma tag HTML `<img>` para exibir o código de barras no e-mail ou na landing page. Muito útil para cupons, vouchers, ingressos, cartões de fidelidade e qualquer cenário onde o destinatário precisa apresentar um código escaneável.

## Sintaxe

```ampscript
BarcodeUrl(valorParaConverter, tipoCodigoBarras, largura, altura, checksum, exibirTexto, textoAlternativo, rotacao, fundoTransparente)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| valorParaConverter | string | Sim | O valor que será codificado no código de barras. |
| tipoCodigoBarras | string | Sim | O tipo de código de barras a ser gerado. Veja a tabela de tipos suportados abaixo. |
| largura | number | Sim | Largura da imagem do código de barras em pixels. |
| altura | number | Sim | Altura da imagem do código de barras em pixels. |
| checksum | string | Não | Valor de checksum para o código de barras. Passe uma string vazia `""` se não for necessário. |
| exibirTexto | boolean | Não | Se `true` ou `1`, exibe o texto do valor codificado abaixo do código de barras. |
| textoAlternativo | string | Não | Texto alternativo exibido abaixo do código de barras. Só funciona quando `exibirTexto` for `false`. |
| rotacao | number | Não | Rotação do código de barras em graus. Valores aceitos: `0`, `90`, `180`, `270`. |
| fundoTransparente | boolean | Não | Se `true` ou `1`, o fundo do código de barras fica transparente. Caso contrário, o fundo é branco. |

### Tipos de código de barras suportados

| Código | Nome | Tipo | Limite de caracteres | Caracteres permitidos | Observações |
|---|---|---|---|---|---|
| `codabar` | Codabar | Linear | Variável | Letras A–D maiúsculas, 0–9, e `- $ : / . +` | Deve começar e terminar com uma letra A–D |
| `code11` | Code 11 | Linear | Variável | 0–9 e `-` | — |
| `code128auto` | Code 128 Auto | Linear | Variável | Todos os caracteres ASCII | — |
| `code128a` | Code 128 A | Linear | Variável | ASCII maiúsculo, 0–9, caracteres especiais ASCII | — |
| `code128b` | Code 128 B | Linear | Variável | ASCII maiúsculo e minúsculo, 0–9, caracteres especiais ASCII | — |
| `code128c` | Code 128 C | Linear | Variável | 0–9 | — |
| `code39` | Code 39 | Linear | Variável | A–Z maiúsculas, 0–9, espaço, e `- . $ / + %` | — |
| `code39ext` | Code 39 Extended | Linear | Variável | Qualquer caractere ASCII estendido | — |
| `code93` | Code 93 | Linear | Variável | A–Z maiúsculas, 0–9, espaço, e `- . $ / + %` | — |
| `code93ext` | Code 93 Extended | Linear | Variável | Todos os caracteres ASCII | — |
| `datamatrix` | Data Matrix | Bidimensional | 1556 bytes | Todos os caracteres ASCII estendido | Codificação binária não é suportada |
| `ean13` | EAN 13 | Linear | 13 dígitos | 0–9 | — |
| `ean8` | EAN 8 | Linear | 8 dígitos | 0–9 | — |
| `industr25` | Code 25 Industrial | Linear | Variável | 0–9 | — |
| `interl25` | Code 25 Interleaved | Linear | Variável | 0–9 | — |
| `msi` | MSI Plessey | Linear | Variável | 0–9 | — |
| `pdf417` | PDF 417 | Bidimensional | 1108 bytes | Todos os caracteres ASCII estendido | Codificação binária não é suportada |
| `upca` | UPC A | Linear | 12 dígitos | 0–9 | — |
| `upce` | UPC E | Linear | 12 dígitos | 0–9 | Idêntico ao UPC A nesta implementação |

### Tipos NÃO suportados (não geram erro, mas não renderizam nada)

`mat25`, `onecode`, `plaintext`, `planet`, `postnet`, `telepen`

## Exemplo básico

Imagine que a **MegaStore** envia um e-mail com um cupom de desconto para o Dia das Mães. Cada cliente recebe um código de barras único com seu código de cupom:

```ampscript
%%[
  VAR @codigoCupom, @urlBarcode
  SET @codigoCupom = "MAES2024-78432"
  SET @urlBarcode = BarcodeUrl(@codigoCupom, "code128auto", 300, 80)
]%%

<h2>Seu cupom de R$50 de desconto - Dia das Mães!</h2>
<p>Apresente este código de barras no caixa da MegaStore:</p>
<img src="%%=v(@urlBarcode)=%%" alt="Código de barras do cupom" />
<p>Código: %%=v(@codigoCupom)=%%</p>
```

**Saída:**

Uma imagem de código de barras Code 128 Auto com o valor `MAES2024-78432` renderizada no e-mail, com 300px de largura e 80px de altura.

## Exemplo avançado

Agora um cenário mais completo: a **FarmaRede** tem um programa de fidelidade e envia um e-mail mensal com o cartão digital do cliente. O código de barras exibe o número do cartão, com texto alternativo personalizado, fundo transparente e rotação:

```ampscript
%%[
  VAR @nomeCliente, @numeroCartao, @pontos, @urlBarcode, @textoAlt

  SET @nomeCliente = AttributeValue("PrimeiroNome")
  SET @numeroCartao = AttributeValue("NumeroCartaoFidelidade")
  SET @pontos = AttributeValue("SaldoPontos")

  SET @textoAlt = Concat("Cartão FarmaRede - ", @nomeCliente)

  SET @urlBarcode = BarcodeUrl(
    @numeroCartao,
    "code128auto",
    350,
    100,
    "",
    false,
    @textoAlt,
    0,
    true
  )
]%%

<div style="background-color: #2E7D32; padding: 20px; text-align: center; border-radius: 12px;">
  <h2 style="color: #FFFFFF;">Olá, %%=v(@nomeCliente)=%%! 🌿</h2>
  <p style="color: #E8F5E9;">Seu cartão fidelidade FarmaRede:</p>
  <img src="%%=v(@urlBarcode)=%%" alt="%%=v(@textoAlt)=%%" />
  <p style="color: #FFFFFF; font-size: 14px;">Cartão: %%=v(@numeroCartao)=%%</p>
  <p style="color: #FFF9C4; font-size: 18px; font-weight: bold;">
    Você tem %%=v(@pontos)=%% pontos!
  </p>
  <p style="color: #E8F5E9; font-size: 12px;">
    Acumule pontos e troque por descontos em www.farmarede.com.br/fidelidade
  </p>
</div>
```

**Saída:**

Um cartão de fidelidade estilizado com fundo verde, contendo um código de barras Code 128 Auto com fundo transparente. Abaixo do código de barras aparece o texto "Cartão FarmaRede - Maria" (exemplo), o número do cartão e o saldo de pontos do cliente.

## Exemplo com Data Matrix e dados de uma Data Extension

A **Conecta Telecom** gera vouchers de recarga com código bidimensional Data Matrix, buscando os dados do voucher em uma Data Extension:

```ampscript
%%[
  VAR @emailCliente, @dadosVoucher, @codigoVoucher, @valorRecarga, @urlBarcode

  SET @emailCliente = AttributeValue("emailaddr")
  SET @dadosVoucher = LookupRows("VouchersRecarga", "Email", @emailCliente)

  IF RowCount(@dadosVoucher) > 0 THEN
    SET @codigoVoucher = Field(Row(@dadosVoucher, 1), "CodigoVoucher")
    SET @valorRecarga = Field(Row(@dadosVoucher, 1), "Valor")

    SET @urlBarcode = BarcodeUrl(
      @codigoVoucher,
      "datamatrix",
      200,
      200,
      "",
      false,
      "",
      0,
      false
    )
]%%

<h3>Seu voucher de recarga de R$%%=v(@valorRecarga)=%%</h3>
<p>Escaneie o código abaixo em qualquer loja Conecta Telecom:</p>
<img src="%%=v(@urlBarcode)=%%" alt="Voucher de recarga Conecta Telecom" />
<p style="font-size: 11px; color: #999;">Código: %%=v(@codigoVoucher)=%%</p>

%%[ ELSE ]%%

<p>Nenhum voucher disponível no momento.</p>

%%[ ENDIF ]%%
```

**Saída:**

Um código Data Matrix de 200x200 pixels com o código do voucher de recarga, fundo branco, renderizado no corpo do e-mail.

## Exemplo com código de barras rotacionado

A **Lojas Vitória** envia ingressos digitais para um evento de Black Friday. O código de barras é rotacionado 90° para facilitar a leitura na catraca:

```ampscript
%%[
  VAR @codigoIngresso, @urlBarcode
  SET @codigoIngresso = "BF2024-INGR-00571"

  SET @urlBarcode = BarcodeUrl(
    @codigoIngresso,
    "code128auto",
    100,
    300,
    "",
    true,
    "",
    90,
    false
  )
]%%

<p>Apresente este ingresso na entrada do evento:</p>
<img src="%%=v(@urlBarcode)=%%" alt="Ingresso Black Friday Lojas Vitória" />
```

**Saída:**

Um código de barras Code 128 Auto rotacionado 90° no sentido horário, com o texto `BF2024-INGR-00571` exibido junto ao código, com dimensões de 100x300 pixels.

## Observações

- **Limite de chamadas:** você pode usar `BarcodeUrl` no máximo **2 vezes por mensagem ou landing page**. Se precisar de mais códigos de barras em um mesmo e-mail, considere redesenhar o layout.
- **QR Code não é suportado.** Se você precisa de QR Codes, utilize serviços externos via [HTTPGet](../http-functions/httpget.md) ou APIs de terceiros.
- **Tag `<img>` obrigatória:** a função retorna apenas a URL da imagem. Você precisa colocá-la dentro de `<img src="...">` para renderizar o código de barras.
- **Parâmetros opcionais são posicionais:** se quiser usar um parâmetro opcional, você precisa incluir todos os parâmetros anteriores a ele. Passe strings vazias `""` para os que não forem necessários.
- **Tipos com tamanho fixo:** códigos como `ean13` (13 dígitos), `ean8` (8 dígitos) e `upca` (12 dígitos) exigem a quantidade exata de caracteres. Se o número de caracteres estiver errado, o código de barras **não será renderizado** — sem erro, simplesmente não aparece nada.
- **Tipos não suportados:** os tipos `mat25`, `onecode`, `plaintext`, `planet`, `postnet` e `telepen` podem ser informados sem gerar erro, mas **não produzem nenhuma imagem**.
- **Codificação binária:** os tipos `datamatrix` e `pdf417` não suportam codificação binária, apenas caracteres ASCII estendido.
- **Contexto:** funciona em e-mails (HTML) e em CloudPages / landing pages.
- **Fundo transparente:** use `fundoTransparente = true` quando o fundo do seu e-mail não for branco, para que o código de barras se integre melhor ao design.
- **Dica de largura/altura:** códigos lineares geralmente ficam bem com largura maior que altura. Códigos bidimensionais (Data Matrix, PDF417) ficam melhores com proporções mais quadradas.

## Funções relacionadas

- [Concat](../string-functions/concat.md) — útil para montar dinamicamente o valor a ser codificado no código de barras
- [Lookup](../data-extension-functions/lookup.md) — para buscar um valor único de uma Data Extension e usá-lo no código de barras
- [LookupRows](../data-extension-functions/lookuprows.md) — para buscar linhas de uma Data Extension com dados de cupons ou vouchers
- [AttributeValue](../utility-functions/attributevalue.md) — para capturar atributos do subscriber e usar como valor do código de barras
- [V](../utility-functions/v.md) — para exibir o valor da URL gerada dentro do HTML
- [Image](../content-functions/image.md) — outra função de conteúdo para renderizar imagens
- [ContentBlockByKey](../content-functions/contentblockbykey.md) — para encapsular o bloco de código de barras em um content block reutilizável
- [CloudPagesURL](../sites-functions/cloudpagesurl.md) — para gerar links de CloudPages onde o código de barras pode ser exibido em páginas dinâmicas