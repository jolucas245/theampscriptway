---
title: Base64Decode
sidebar_label: Base64Decode
description: Decodifica uma string codificada em Base64, convertendo-a de volta para texto simples.
---

# Base64Decode

## Descrição

A função `Base64Decode` converte dados binários codificados em Base64 de volta para uma string de texto simples. É muito útil quando você recebe dados codificados de sistemas externos, APIs ou Data Extensions que armazenam informações em Base64 — cenário comum em integrações entre SFMC e plataformas de e-commerce ou CRMs no mercado brasileiro. O retorno é a string decodificada no formato de texto legível.

## Sintaxe

```ampscript
Base64Decode(stringToDecode, characterEncoding, abortSendOnFail)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| stringToDecode | String | Sim | A string codificada em Base64 que você quer decodificar. |
| characterEncoding | String | Não | O tipo de codificação de caracteres a ser usado na decodificação. Valores aceitos: `ASCII`, `UTF-7`, `UTF-8`, `UTF-16` e `UTF-32`. |
| abortSendOnFail | Boolean | Não | Define o comportamento em caso de falha na decodificação durante um envio de e-mail. Se `1`, o envio é abortado quando a string não pode ser decodificada. Se `0`, o envio continua mesmo com falha. O valor padrão é `1`. |

## Exemplo básico

Decodificando o nome de um cliente que foi armazenado em Base64 numa Data Extension alimentada por um sistema externo.

```ampscript
%%[
SET @nomeCodeado = "Sm/Do28gU2lsdmE="
SET @nomeDecodificado = Base64Decode(@nomeCodeado)
]%%

Nome do cliente: %%=v(@nomeDecodificado)=%%
```

**Saída:**
```
Nome do cliente: João Silva
```

## Exemplo avançado

Cenário de régua de relacionamento onde os dados do pedido chegam codificados em Base64 via integração com o e-commerce, e você precisa decodificar para montar o e-mail de confirmação de compra.

```ampscript
%%[
SET @dadosPedidoBase64 = Lookup("Pedidos_Integração", "DadosBase64", "Email", emailaddr)

IF NOT Empty(@dadosPedidoBase64) THEN
  SET @dadosPedido = Base64Decode(@dadosPedidoBase64, "UTF-8", 0)
ELSE
  SET @dadosPedido = "Dados do pedido indisponíveis"
ENDIF
]%%

Olá, aqui estão os detalhes do seu pedido na MegaStore:

%%=v(@dadosPedido)=%%
```

**Saída:**
```
Olá, aqui estão os detalhes do seu pedido na MegaStore:

Pedido #48712 - Smartphone Galaxy - R$ 1.299,90 - Entrega: Rua das Flores, 123 - São Paulo/SP - CEP 01234-567
```

## Observações

- Especifique `UTF-8` no parâmetro `characterEncoding` quando trabalhar com dados que contenham caracteres acentuados do português (como ã, é, ç, ô). Sem isso, nomes como "João" ou "Conceição" podem aparecer com caracteres estranhos no e-mail.

> **⚠️ Atenção:** O comportamento padrão de `abortSendOnFail` é `1`, ou seja, se a string não puder ser decodificada, o envio do e-mail será **abortado** para aquele subscriber. Em réguas de alto volume, considere usar `0` e tratar a falha manualmente com uma verificação via [Empty](../utility-functions/empty.md), para evitar que um dado corrompido impeça o envio inteiro.

> **💡 Dica:** Se você precisa fazer o caminho inverso — codificar texto em Base64 para enviar dados a uma API externa via [HTTPPost](../http-functions/httppost.md), por exemplo — use a função [Base64Encode](../encryption-functions/base64encode.md).

## Funções relacionadas

- [Base64Encode](../encryption-functions/base64encode.md) — função complementar que codifica texto simples em Base64.
- [Lookup](../data-extension-functions/lookup.md) — para buscar a string codificada em uma Data Extension.
- [Empty](../utility-functions/empty.md) — para validar se o valor retornado está vazio antes de decodificar.
- [TreatAsContent](../utility-functions/treatascontent.md) — útil quando o conteúdo decodificado contém HTML ou AMPscript que precisa ser renderizado.