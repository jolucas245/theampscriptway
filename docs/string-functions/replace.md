---
title: Replace
sidebar_label: Replace
description: Substitui todas as ocorrências de uma substring por outra substring dentro de um texto.
---

<!-- generated-by-script -->

# Replace

## Descrição

A função `Replace()` busca **todas as ocorrências** de uma substring dentro de um texto e substitui cada uma delas por outra substring que você definir. É uma das funções mais versáteis do AMPscript — super útil para personalizar templates de mensagem, corrigir formatações, trocar placeholders por dados dinâmicos, limpar textos vindos de Data Extensions e muito mais. Ela retorna a string original com todas as substituições aplicadas.

## Sintaxe

```ampscript
Replace(sourceString, searchSubstring, replacementSubstring)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| sourceString | String | Sim | O texto original onde a busca será feita. |
| searchSubstring | String | Sim | A substring que você quer encontrar dentro de `sourceString`. |
| replacementSubstring | String | Sim | A substring que vai substituir cada ocorrência de `searchSubstring`. |

## Exemplo básico

Imagine que você tem um template de promoção e precisa trocar o placeholder `%%NOME%%` pelo nome real do assinante:

```ampscript
%%[

SET @template = "Olá, %%NOME%%! Aproveite nossas ofertas de Dia das Mães, %%NOME%%!"
SET @nomeCliente = "Maria Santos"
SET @mensagem = Replace(@template, "%%NOME%%", @nomeCliente)

]%%

%%=v(@mensagem)=%%
```

**Saída:**
```
Olá, Maria Santos! Aproveite nossas ofertas de Dia das Mães, Maria Santos!
```

## Exemplo avançado

Cenário real: a Lojas Vitória envia e-mails promocionais sazonais. O texto base da promoção menciona a estação do ano, e você precisa atualizar dinamicamente para a estação atual. Além disso, o preço e a URL do produto também são personalizados. Aqui usamos [RegExMatch](../string-functions/regexmatch.md) para identificar a estação no texto e `Replace()` para fazer a substituição:

```ampscript
%%[

SET @promoText = "A Lojas Vitória preparou ofertas incríveis de inverno! Frete grátis acima de R$299 em toda coleção de inverno. Acesse www.lojasvitoria.com.br/inverno e confira!"

/* Identifica a estação atual no texto usando RegExMatch */
SET @estacaoEncontrada = RegExMatch(@promoText, "inverno|verão|outono|primavera")

/* Define a nova estação */
SET @estacaoAtual = "primavera"

/* Substitui todas as ocorrências da estação antiga pela nova */
SET @promoText = Replace(@promoText, @estacaoEncontrada, @estacaoAtual)

/* Também atualiza a URL para a landing page correta */
SET @promoText = Replace(@promoText, "www.lojasvitoria.com.br/primavera", Concat("www.lojasvitoria.com.br/", @estacaoAtual, "?utm_source=email&utm_campaign=promo_", @estacaoAtual))

]%%

%%=v(@promoText)=%%
```

**Saída:**
```
A Lojas Vitória preparou ofertas incríveis de primavera! Frete grátis acima de R$299 em toda coleção de primavera. Acesse www.lojasvitoria.com.br/primavera?utm_source=email&utm_campaign=promo_primavera e confira!
```

Outro exemplo prático — formatar CPF que veio sem pontuação de uma Data Extension:

```ampscript
%%[

SET @cpfBruto = "12345678900"

/* Monta o CPF formatado usando Substring e Concat */
SET @cpfFormatado = Concat(
  Substring(@cpfBruto, 1, 3), ".",
  Substring(@cpfBruto, 4, 3), ".",
  Substring(@cpfBruto, 7, 3), "-",
  Substring(@cpfBruto, 10, 2)
)

/* Ou se o CPF já tem alguma formatação parcial, pode usar Replace para limpar e reformatar */
SET @cpfComEspacos = "123 456 789 00"
SET @cpfLimpo = Replace(@cpfComEspacos, " ", "")

]%%

CPF formatado: %%=v(@cpfFormatado)=%%
CPF limpo: %%=v(@cpfLimpo)=%%
```

**Saída:**
```
CPF formatado: 123.456.789-00
CPF limpo: 12345678900
```

## Observações

- A função substitui **todas** as ocorrências da substring encontrada, não apenas a primeira. Se o texto tiver 5 ocorrências, todas serão trocadas.
- A busca **não diferencia maiúsculas de minúsculas** (case-insensitive) no comportamento padrão do AMPscript. Se você precisa de controle mais fino sobre o padrão de busca, considere usar [RegExMatch](../string-functions/regexmatch.md) em conjunto.
- Se a `searchSubstring` não for encontrada na `sourceString`, a função simplesmente retorna o texto original sem alterações.
- Para substituir a substring por nada (ou seja, remover a substring), passe uma string vazia `""` como `replacementSubstring`.
- Cuidado com substituições em cascata: se você encadear múltiplas chamadas de `Replace()`, o resultado de uma pode afetar a próxima. Planeje a ordem das substituições.
- A função funciona em qualquer contexto do SFMC: e-mails, CloudPages, SMS, Landing Pages, etc.
- Se você precisa substituir um valor por diferentes opções com base em uma lista, dê uma olhada na função [ReplaceList](../string-functions/replacelist.md).

## Funções relacionadas

- [ReplaceList](../string-functions/replacelist.md) — substitui um valor por outro com base em uma lista de correspondências
- [RegExMatch](../string-functions/regexmatch.md) — localiza texto usando expressões regulares, ótimo para combinar com `Replace()`
- [Substring](../string-functions/substring.md) — extrai uma parte específica de uma string
- [IndexOf](../string-functions/indexof.md) — encontra a posição de uma substring dentro de um texto
- [Concat](../string-functions/concat.md) — concatena múltiplas strings em uma só
- [Trim](../string-functions/trim.md) — remove espaços em branco do início e do fim de uma string
- [Lowercase](../string-functions/lowercase.md) — converte texto para minúsculas, útil para normalizar antes de usar `Replace()`
- [Uppercase](../string-functions/uppercase.md) — converte texto para maiúsculas