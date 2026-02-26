---
title: URLEncode
sidebar_label: URLEncode
description: Modifica uma string para que ela contenha apenas caracteres seguros para uso em URLs, convertendo espaços e caracteres especiais em seus códigos hexadecimais.
---

# URLEncode

## Descrição

A função `URLEncode` converte uma string para um formato seguro de ser usado em URLs, substituindo espaços e caracteres não-ASCII pelos seus códigos hexadecimais correspondentes (como `%20` para espaço, `%C3%A3` para "ã", etc.). É essencial quando você precisa montar URLs dinâmicas com parâmetros que contêm acentos, espaços ou caracteres especiais — algo super comum no nosso português brasileiro cheio de acentos e cedilhas. Você controla o nível de codificação através dos parâmetros booleanos, podendo codificar apenas espaços, todos os caracteres especiais, ou até strings que não são URLs.

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
| boolEncodeAllChars | Boolean | Não | Se `true`, converte todos os espaços **e** caracteres não-ASCII em seus códigos hexadecimais. Se `false` (padrão), converte apenas espaços para `%20`, mantendo os demais caracteres inalterados. |
| boolEncodeAllStrings | Boolean | Não | Se `true`, converte qualquer string de texto (mesmo que não seja uma URL) para um formato seguro para URLs. Se `false` (padrão), só converte caracteres inseguros que façam parte de parâmetros de uma URL. |

## Exemplo básico

Imagine que você está montando um link de rastreamento para uma campanha de Dia das Mães na Lojas Vitória, e o nome da campanha tem espaços:

```ampscript
%%[
VAR @urlCampanha, @urlCodificada

SET @urlCampanha = "https://www.lojasvitoria.com.br/ofertas?campanha=dia das maes&utm_source=email"
SET @urlCodificada = URLEncode(@urlCampanha)
]%%

Link: %%=v(@urlCodificada)=%%
```

**Saída:**
```
Link: https://www.lojasvitoria.com.br/ofertas?campanha=dia%20das%20maes&utm_source=email
```

Repare que apenas os espaços no parâmetro foram convertidos para `%20`. Os demais caracteres permaneceram iguais porque o comportamento padrão (`boolEncodeAllChars = false`) só converte espaços.

## Exemplo avançado

Agora vamos a um cenário mais realista: você está enviando um e-mail personalizado para o cliente e precisa gerar um link para uma CloudPage que recebe o nome do cliente e a cidade como parâmetros. Nomes e cidades brasileiras frequentemente têm acentos e caracteres especiais:

```ampscript
%%[
VAR @nome, @cidade, @urlBase, @urlFinal

SET @nome = "João da Silva"
SET @cidade = "São Paulo"

/* Codificando parâmetros individuais com todos os caracteres especiais */
SET @nomeCodificado = URLEncode(@nome, true, true)
SET @cidadeCodificada = URLEncode(@cidade, true, true)

SET @urlBase = Concat(
  "https://cloud.lojasvitoria.com.br/resgate-cashback",
  "?nome=", @nomeCodificado,
  "&cidade=", @cidadeCodificada,
  "&valor=50"
)
]%%

<a href="%%=RedirectTo(@urlBase)=%%">Resgatar seu cashback de R$50,00</a>

<!-- Exemplo 2: Codificando uma URL completa com acentos nos parâmetros -->
%%[
VAR @urlCompleta, @urlEncoded

SET @urlCompleta = "https://www.megastore.com.br/busca?termo=calção masculino&categoria=moda praia"

/* Apenas espaços convertidos (padrão) */
SET @urlApenasEspacos = URLEncode(@urlCompleta)

/* Todos os caracteres não-ASCII convertidos */
SET @urlTodosChars = URLEncode(@urlCompleta, true)
]%%

Só espaços: %%=v(@urlApenasEspacos)=%%
Todos os caracteres: %%=v(@urlTodosChars)=%%

<!-- Exemplo 3: Codificando uma string que não é URL -->
%%[
VAR @textoLivre, @textoCodificado

SET @textoLivre = "Promoção válida até 25/12/2024 — frete grátis acima de R$299!"
SET @textoCodificado = URLEncode(@textoLivre, true, true)
]%%

Texto codificado: %%=v(@textoCodificado)=%%
```

**Saída:**
```
<a href="https://cloud.lojasvitoria.com.br/resgate-cashback?nome=Jo%C3%A3o%20da%20Silva&cidade=S%C3%A3o%20Paulo&valor=50">Resgatar seu cashback de R$50,00</a>

Só espaços: https://www.megastore.com.br/busca?termo=cal%C3%A7%C3%A3o%20masculino&categoria=moda%20praia
Todos os caracteres: https://www.megastore.com.br/busca?termo=cal%C3%A7%C3%A3o%20masculino&categoria=moda%20praia

Texto codificado: Promo%C3%A7%C3%A3o%20v%C3%A1lida%20at%C3%A9%2025%2F12%2F2024%20%E2%80%94%20frete%20gr%C3%A1tis%20acima%20de%20R%24299!
```

## Observações

- **Comportamento padrão (sem parâmetros opcionais):** Apenas espaços dentro de parâmetros de URL são convertidos para `%20`. Caracteres acentuados como "ã", "ç", "é" ficam inalterados. Isso pode causar problemas em alguns navegadores ou servidores — em cenários brasileiros, quase sempre vale a pena usar `boolEncodeAllChars = true`.
- **Quando usar `boolEncodeAllStrings = true`:** Use esse parâmetro quando a string que você está passando **não é uma URL**, mas sim um texto livre que será incluído como valor de parâmetro em uma URL. Sem essa flag, a função só codifica caracteres que estejam na parte de parâmetros (query string) de uma URL reconhecida.
- **Acentos do português brasileiro:** Como nosso idioma usa muitos caracteres especiais (ã, õ, ç, é, á, ê, etc.), é muito comum precisar de `URLEncode` com `boolEncodeAllChars = true` para garantir que os links funcionem corretamente.
- **Combine com `Concat` para montar URLs:** Uma boa prática é codificar cada parâmetro individualmente com `URLEncode` e depois usar [Concat](../string-functions/concat.md) para juntar tudo na URL final.
- **Use com `RedirectTo` em e-mails:** Quando você gera URLs dinâmicas em e-mails, lembre-se de envolver o link final com [RedirectTo](../http-functions/redirectto.md) para que o rastreamento de cliques do SFMC funcione corretamente.
- **CloudPages:** Em CloudPages, quando você recebe parâmetros via [RequestParameter](../sites-functions/requestparameter.md) ou [QueryParameter](../sites-functions/queryparameter.md), os valores já chegam decodificados automaticamente. Mas ao montar URLs de saída ou redirecionamentos, lembre-se de codificar novamente.
- **Não confunda com `WrapLongURL`:** A função [WrapLongURL](../http-functions/wraplongurl.md) serve para evitar que URLs longas quebrem em clientes de e-mail. `URLEncode` serve para tornar caracteres seguros para uso em URLs — são propósitos diferentes.
- **Cuidado com dupla codificação:** Se você aplicar `URLEncode` em uma string que já foi codificada, o `%` será codificado como `%25`, resultando em algo como `%2520` em vez de `%20`. Sempre codifique apenas uma vez.

## Funções relacionadas

- [Concat](../string-functions/concat.md) — Concatena strings, ideal para montar URLs com parâmetros codificados
- [Replace](../string-functions/replace.md) — Substitui caracteres em uma string, útil para limpezas antes de codificar
- [RedirectTo](../http-functions/redirectto.md) — Redireciona para uma URL preservando o rastreamento de cliques do SFMC
- [WrapLongURL](../http-functions/wraplongurl.md) — Evita quebra de URLs longas em clientes de e-mail
- [CloudPagesURL](../sites-functions/cloudpagesurl.md) — Gera URLs para CloudPages com parâmetros já codificados e criptografados
- [RequestParameter](../sites-functions/requestparameter.md) — Recupera parâmetros de URL em CloudPages (valores já decodificados)
- [StringToHex](../string-functions/stringtohex.md) — Converte uma string para sua representação hexadecimal
- [Trim](../string-functions/trim.md) — Remove espaços em branco das extremidades de uma string antes de codificar