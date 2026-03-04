---
title: BarcodeUrl
sidebar_label: BarcodeUrl
description: Gera a URL de uma imagem de código de barras a partir de uma string, suportando diversos formatos lineares e bidimensionais.
---

# BarcodeUrl

## Descrição

A função `BarcodeUrl` gera um código de barras a partir de uma string de entrada, retornando a URL da imagem gerada. Ela suporta a maioria dos formatos lineares (unidimensionais) e também os formatos bidimensionais Data Matrix e PDF417 — mas **não gera QR Codes**. É muito útil para incluir códigos de barras em e-mails transacionais e landing pages, como boletos, cupons de desconto, ingressos ou vouchers de troca em lojas físicas.

## Sintaxe

```ampscript
BarcodeUrl(valueToConvert, barcodeType, width, height [, checksumValue] [, boolShowText] [, altText] [, rotation] [, boolTransparentBG])
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| valueToConvert | string | Sim | O valor que será convertido em código de barras. |
| barcodeType | string | Sim | O tipo de código de barras a ser gerado. Veja a tabela de tipos suportados abaixo. |
| width | number | Sim | Largura do código de barras em pixels. |
| height | number | Sim | Altura do código de barras em pixels. |
| checksumValue | string | Não | Valor de checksum para o código de barras. |
| boolShowText | boolean | Não | Se `true` ou `1`, exibe o texto do `valueToConvert` abaixo do código de barras. |
| altText | string | Não | Texto alternativo exibido abaixo do código de barras. Só é utilizado quando `boolShowText` é `false`. |
| rotation | number | Não | Rotação do código de barras em graus. Valores aceitos: `0`, `90`, `180`, `270`. |
| boolTransparentBG | boolean | Não | Se `true` ou `1`, o fundo do código de barras será transparente. Caso contrário, o fundo é branco. |

### Tipos de código de barras suportados

| Código | Nome | Tipo | Limite de caracteres | Caracteres permitidos | Observações |
|---|---|---|---|---|---|
| codabar | Codabar | Linear | Variável | Letras maiúsculas A–D, números 0–9 e: `- $ : / . +` | Deve começar e terminar com uma letra A–D |
| code11 | Code 11 | Linear | Variável | Números 0–9 e `-` | |
| code128auto | Code 128 Auto | Linear | Variável | Todos os caracteres ASCII | |
| code128a | Code 128 A | Linear | Variável | Letras maiúsculas ASCII, números 0–9 e caracteres especiais ASCII | |
| code128b | Code 128 B | Linear | Variável | Letras maiúsculas e minúsculas ASCII, números 0–9 e caracteres especiais ASCII | |
| code128c | Code 128 C | Linear | Variável | Números 0–9 | |
| code39 | Code 39 | Linear | Variável | Letras maiúsculas (A–Z), números (0–9), espaços e: `- . $ / + %` | |
| code39ext | Code 39 Extended | Linear | Variável | Qualquer caractere do conjunto ASCII estendido | |
| code93 | Code 93 | Linear | Variável | Letras maiúsculas (A–Z), números (0–9), espaços e: `- . $ / + %` | |
| code93ext | Code 93 Extended | Linear | Variável | Todos os caracteres ASCII | |
| datamatrix | Data Matrix | Bidimensional | 1556 bytes | Todos os caracteres ASCII estendidos | Codificação binária não suportada |
| ean13 | EAN 13 | Linear | 13 dígitos | Números 0–9 | |
| ean8 | EAN 8 | Linear | 8 dígitos | Números 0–9 | |
| industr25 | Code 25 Industrial | Linear | Variável | Números 0–9 | |
| interl25 | Code 25 Interleaved | Linear | Variável | Números 0–9 | |
| msi | MSI Plessey | Linear | Variável | Números 0–9 | |
| pdf417 | PDF 417 | Bidimensional | 1108 bytes | Todos os caracteres ASCII estendidos | Codificação binária não suportada |
| upca | UPC A | Linear | 12 dígitos | Números 0–9 | |
| upce | UPC E | Linear | 12 dígitos | Números 0–9 | Idêntico ao UPC A nesta implementação |

### Tipos não suportados (não geram exceção, mas também não renderizam)

`mat25`, `onecode`, `plaintext`, `planet`, `postnet`, `telepen`

## Exemplo básico

Gerando um código de barras Code 128 Auto para um cupom de desconto da MegaStore, exibindo o código do voucher abaixo da imagem:

```ampscript
%%[
VAR @codigoCupom, @urlBarcode
SET @codigoCupom = "MEGA2024-JUL-78432"
SET @urlBarcode = BarcodeUrl(@codigoCupom, "code128auto", 300, 80, "", true)
]%%

<img src="%%=v(@urlBarcode)=%%" alt="Código de barras do cupom" />
```

**Saída:**
```html
<img src="https://image.s11.sfmc-content.com/barcode?..." alt="Código de barras do cupom" />
```
*(A imagem renderizada mostra o código de barras com o texto "MEGA2024-JUL-78432" abaixo)*

## Exemplo avançado

Cenário de e-mail transacional: a FarmaRede envia um e-mail com voucher de desconto personalizado para cada cliente. O código do voucher vem de uma Data Extension, e abaixo do código de barras aparece um texto amigável em vez do código bruto. O barcode é rotacionado em 90° para se adequar ao layout vertical do e-mail:

```ampscript
%%[
VAR @nomeCliente, @codigoVoucher, @valorDesconto, @urlBarcode, @textoAlt

SET @nomeCliente = AttributeValue("PrimeiroNome")
SET @nomeCliente = IIF(Empty(@nomeCliente), "Cliente", @nomeCliente)

SET @codigoVoucher = Lookup("Vouchers_FarmaRede", "CodigoVoucher", "EmailAssinante", EmailAddress)
SET @valorDesconto = Lookup("Vouchers_FarmaRede", "ValorDesconto", "EmailAssinante", EmailAddress)

SET @textoAlt = Concat("Voucher R$ ", @valorDesconto, " - ", @nomeCliente)

SET @urlBarcode = BarcodeUrl(
  @codigoVoucher,
  "code128auto",
  400,
  100,
  "",
  false,
  @textoAlt,
  90,
  true
)
]%%

<p>Olá, %%=v(@nomeCliente)=%% 👋</p>
<p>Aqui está seu voucher de <strong>R$ %%=v(@valorDesconto)=%%</strong> para usar em qualquer unidade FarmaRede:</p>

<img src="%%=v(@urlBarcode)=%%" alt="Voucher FarmaRede" style="display:block; margin:20px auto;" />

<p style="font-size:12px; color:#666;">
  Apresente este código de barras no caixa. Código: %%=v(@codigoVoucher)=%%
</p>
```

**Saída (exemplo para a cliente Maria Santos):**
```html
<p>Olá, Maria 👋</p>
<p>Aqui está seu voucher de <strong>R$ 25,00</strong> para usar em qualquer unidade FarmaRede:</p>

<img src="https://image.s11.sfmc-content.com/barcode?..." alt="Voucher FarmaRede" style="display:block; margin:20px auto;" />

<p style="font-size:12px; color:#666;">
  Apresente este código de barras no caixa. Código: FR-2024-MS-00892
</p>
```
*(A imagem renderizada mostra o código de barras rotacionado 90° com fundo transparente e o texto "Voucher R$ 25,00 - Maria" abaixo)*

## Observações

> **⚠️ Atenção:** Você pode chamar `BarcodeUrl` no máximo **2 vezes por mensagem ou landing page**. Se precisar de mais códigos de barras no mesmo e-mail, considere redesenhar o layout ou usar abordagens alternativas.

> **⚠️ Atenção:** A função **não gera QR Codes**. Se você precisa de QR Code, será necessário usar um serviço externo (API de terceiros, por exemplo, via [HTTPGet](../http-functions/httpget.md)).

> **⚠️ Atenção:** Tipos de código de barras com comprimento fixo (como `ean8`, `ean13`, `upca`, `upce`) exigem a quantidade exata de dígitos. Se o número de caracteres estiver errado, o código de barras simplesmente **não será renderizado** — sem erro.

> **⚠️ Atenção:** Os tipos `mat25`, `onecode`, `plaintext`, `planet`, `postnet` e `telepen` podem ser passados como parâmetro sem gerar exceção, mas **não produzem nenhum código de barras**.

- Para renderizar o código de barras, você precisa envolver a chamada da função em uma tag HTML `<img>`. A função retorna apenas a URL da imagem.

- Se você quiser usar parâmetros opcionais que não são os primeiros na lista, precisa incluir todos os anteriores. Por exemplo, para usar `altText` (7º parâmetro), você deve passar valores para `checksumValue` e `boolShowText` também — use string vazia `""` quando não precisar definir um valor.

> **💡 Dica:** O tipo `code128auto` é o mais versátil para a maioria dos cenários de cupons e vouchers no Brasil, pois aceita todos os caracteres ASCII e tem comprimento variável. É uma boa escolha padrão.

> **💡 Dica:** Use `boolTransparentBG` como `true` quando o fundo do seu e-mail não for branco, assim o código de barras se integra melhor ao layout.

## Funções relacionadas

- [Concat](../string-functions/concat.md) — para montar dinamicamente a string que será codificada no barcode
- [Lookup](../data-extension-functions/lookup.md) — para buscar códigos de voucher ou dados do cliente em Data Extensions
- [AttributeValue](../utility-functions/attributevalue.md) — para acessar atributos do assinante de forma segura
- [V](../utility-functions/v.md) — para exibir a URL gerada dentro de tags HTML
- [Empty](../utility-functions/empty.md) — para validar se o valor existe antes de gerar o código de barras
- [IIF](../utility-functions/iif.md) — para lógica condicional na montagem do barcode