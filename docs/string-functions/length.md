---
title: Length
sidebar_label: Length
description: Retorna o número de caracteres de uma string.
---

# Length

## Descrição

A função `Length` retorna o número de caracteres de uma string. É muito útil no dia a dia de SFMC para validar dados antes de processá-los - por exemplo, verificar se um CPF tem 11 dígitos, se uma URL não excede determinado tamanho ou se um campo de nome está preenchido de forma plausível. O retorno é um valor numérico inteiro representando a quantidade de caracteres da string informada.

## Sintaxe

```ampscript
Length(sourceString)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| sourceString | String | Sim | A string da qual você quer descobrir o número de caracteres. |

## Exemplo básico

Verificando o tamanho do nome de um cliente para personalização de e-mail:

```ampscript
%%[
VAR @nome, @tamanho
SET @nome = "João Silva"
SET @tamanho = Length(@nome)
]%%

O nome "%%=v(@nome)=%%" tem %%=v(@tamanho)=%% caracteres.
```

**Saída:**
```
O nome "João Silva" tem 10 caracteres.
```

## Exemplo avançado

Cenário real de e-mail marketing: a MegaStore precisa incluir uma imagem com link de rastreamento no e-mail. Se a URL do produto for muito longa, ela é encurtada com `WrapLongURL` para evitar quebra em clientes de e-mail. Caso contrário, usa a URL original.

```ampscript
%%[
VAR @urlProduto, @urlFinal, @limiteCaracteres

SET @urlProduto = "https://www.megastore.com.br/produtos/eletronicos/smartphones/samsung-galaxy-a54-128gb-preto?utm_source=sfmc&utm_medium=email&utm_campaign=blackfriday2024&utm_content=hero_banner&ref=crm_engajados"
SET @limiteCaracteres = 100

IF Length(@urlProduto) > @limiteCaracteres THEN
  SET @urlFinal = WrapLongURL(@urlProduto)
ELSE
  SET @urlFinal = @urlProduto
ENDIF
]%%

<a href="%%=RedirectTo(@urlFinal)=%%">
  <img src="%%=v(@urlFinal)=%%" alt="Oferta MegaStore" />
</a>
```

**Saída (quando a URL excede 100 caracteres):**
```html
<a href="[URL processada pelo RedirectTo]">
  <img src="[URL encurtada pelo WrapLongURL]" alt="Oferta MegaStore" />
</a>
```

## Observações

> **💡 Dica:** `Length` é excelente para criar validações simples antes de exibir dados no e-mail. Por exemplo, você pode verificar se um CEP tem exatamente 8 caracteres (sem hífen) ou se um telefone tem pelo menos 10 dígitos antes de usar a informação em alguma lógica.

> **⚠️ Atenção:** `Length` conta **todos** os caracteres da string, incluindo espaços em branco no início e no fim. Se os dados vêm de uma Data Extension e podem ter espaços extras, considere usar [Trim](../string-functions/trim.md) antes de medir o tamanho - assim você obtém o comprimento real do conteúdo.

## Funções relacionadas

- [Substring](../string-functions/substring.md) - extrai parte de uma string; combina com `Length` para calcular posições dinamicamente.
- [IndexOf](../string-functions/indexof.md) - encontra a posição de um caractere na string; junto com `Length`, permite manipulações avançadas de texto.
- [Trim](../string-functions/trim.md) - remove espaços extras antes de medir o tamanho real do conteúdo.
- [Concat](../string-functions/concat.md) - concatena strings; use `Length` para verificar tamanhos antes de juntar textos.
- [WrapLongURL](../http-functions/wraplongurl.md) - encurta URLs longas; use `Length` para decidir quando acionar o encurtamento.