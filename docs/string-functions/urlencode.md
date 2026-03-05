---
title: URLEncode
sidebar_label: URLEncode
description: Converte uma string para um formato seguro para uso em URLs, codificando espaços e caracteres especiais em seus equivalentes hexadecimais.
---

# URLEncode

## Descrição

A função `URLEncode` modifica uma string para que ela contenha apenas caracteres seguros para uso em URLs. Isso é essencial quando você monta links dinâmicos em e-mails ou CloudPages que incluem dados de clientes - nomes com acentos, endereços com espaços, termos de busca, etc. Ela retorna a string codificada, convertendo caracteres problemáticos para seus códigos hexadecimais (por exemplo, espaço vira `%20`).

## Sintaxe

```ampscript
URLEncode(urlToEncode)
URLEncode(urlToEncode, boolEncodeAllChars)
URLEncode(urlToEncode, boolEncodeAllChars, boolEncodeAllStrings)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| urlToEncode | String | Sim | A string que será convertida para um formato seguro para uso em URLs. |
| boolEncodeAllChars | Boolean | Não | Se `true`, converte todos os espaços e caracteres não-ASCII nos parâmetros da URL para seus códigos hexadecimais. Se `false` (padrão), converte apenas espaços para `%20`, deixando os demais caracteres inalterados. |
| boolEncodeAllStrings | Boolean | Não | Se `true`, converte qualquer string de texto (mesmo que não seja uma URL) para um formato seguro para URLs. Se `false` (padrão), só converte caracteres inseguros que estejam dentro de parâmetros de uma URL. |

## Exemplo básico

Codificando uma URL que contém um parâmetro com espaço no nome da cidade do cliente:

```ampscript
%%[
SET @url = "https://www.lojasvitoria.com.br/busca?cidade=São Paulo&categoria=ofertas especiais"
SET @urlSegura = URLEncode(@url)
]%%

URL codificada: %%=v(@urlSegura)=%%
```

**Saída:**
```
URL codificada: https://www.lojasvitoria.com.br/busca?cidade=São%20Paulo&categoria=ofertas%20especiais
```

## Exemplo avançado

Montando um link de rastreamento para uma régua de relacionamento onde o nome do cliente e a cidade possuem acentos e caracteres especiais. Usando `boolEncodeAllChars` como `true` para garantir que todos os caracteres não-ASCII (como acentos) sejam codificados corretamente:

```ampscript
%%[
SET @nome = "João André da Silva"
SET @cidade = "Florianópolis"
SET @cpf = "123.456.789-00"

SET @urlBase = Concat(
  "https://www.megastore.com.br/perfil?nome=", @nome,
  "&cidade=", @cidade,
  "&doc=", @cpf
)

/* Apenas espaços codificados (padrão) */
SET @urlPadrao = URLEncode(@urlBase)

/* Todos os caracteres não-ASCII codificados */
SET @urlCompleta = URLEncode(@urlBase, true)
]%%

Padrão: %%=v(@urlPadrao)=%%

Completa: %%=v(@urlCompleta)=%%
```

**Saída:**
```
Padrão: https://www.megastore.com.br/perfil?nome=João%20André%20da%20Silva&cidade=Florianópolis&doc=123.456.789-00

Completa: https://www.megastore.com.br/perfil?nome=Jo%C3%A3o%20Andr%C3%A9%20da%20Silva&cidade=Florian%C3%B3polis&doc=123.456.789-00
```

Codificando uma string que não é URL para uso como parâmetro, usando `boolEncodeAllStrings` como `true`:

```ampscript
%%[
SET @textoLivre = "Promoção de Verão - 50% off em eletrônicos!"
SET @textoCodificado = URLEncode(@textoLivre, true, true)
SET @linkFinal = Concat("https://www.farmarede.com.br/lp?msg=", @textoCodificado)
]%%

Link final: %%=v(@linkFinal)=%%
```

**Saída:**
```
Link final: https://www.farmarede.com.br/lp?msg=Promo%C3%A7%C3%A3o%20de%20Ver%C3%A3o%20%E2%80%94%2050%25%20off%20em%20eletr%C3%B4nicos!
```

## Observações

> **💡 Dica:** No Brasil, nomes de pessoas, cidades e endereços estão cheios de acentos e cedilhas (ã, ç, é, ô...). Se você está montando URLs com esses dados, use `boolEncodeAllChars` como `true` para garantir que todos os caracteres especiais sejam codificados. Só converter espaços (o padrão) pode causar links quebrados em alguns clientes de e-mail.

> **⚠️ Atenção:** Por padrão (`boolEncodeAllStrings` = `false`), a função só codifica caracteres que estejam dentro de parâmetros de URL (query string). Se você passar uma string de texto puro que não seja uma URL, precisa definir `boolEncodeAllStrings` como `true` para que a codificação seja aplicada.

> **💡 Dica:** Quando usar [RedirectTo](../http-functions/redirectto.md) ou [CloudPagesURL](../sites-functions/cloudpagesurl.md), lembre que `CloudPagesURL` já faz encoding dos parâmetros automaticamente. O `URLEncode` é mais útil quando você está montando URLs manualmente com [Concat](../string-functions/concat.md).

## Funções relacionadas

- [Concat](../string-functions/concat.md) - para montar URLs dinâmicas antes de codificá-las
- [Replace](../string-functions/replace.md) - para substituições manuais em strings antes do encoding
- [RedirectTo](../http-functions/redirectto.md) - para redirecionar para URLs em CloudPages e Landing Pages
- [CloudPagesURL](../sites-functions/cloudpagesurl.md) - para gerar URLs de CloudPages com parâmetros criptografados
- [Base64Encode](../encryption-functions/base64encode.md) - para outro tipo de codificação de strings
- [StringToHex](../string-functions/stringtohex.md) - para converter strings em representação hexadecimal