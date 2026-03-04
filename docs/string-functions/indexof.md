---
title: IndexOf
sidebar_label: IndexOf
description: Retorna a posição em que uma substring aparece dentro de uma string, usando indexação baseada em 1.
---

# IndexOf

## Descrição

A função `IndexOf` busca uma substring dentro de uma string e retorna a posição numérica onde ela começa. A indexação é baseada em 1 — ou seja, o primeiro caractere da string está na posição 1. Se a substring não for encontrada, o retorno é `0`. É muito útil no dia a dia de SFMC para localizar caracteres ou trechos específicos dentro de dados de clientes, como encontrar o "@" num e-mail ou identificar padrões em campos de texto.

## Sintaxe

```ampscript
IndexOf(@sourceString, @substring)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| sourceString | string | Sim | A string onde a busca será realizada. |
| substring | string | Sim | O caractere ou substring cuja posição você quer encontrar. |

## Exemplo básico

Localizando a posição do caractere "@" no e-mail de um cliente para validar ou segmentar por domínio:

```ampscript
%%[
VAR @email, @posicao
SET @email = "joao.silva@megastore.com.br"
SET @posicao = IndexOf(@email, "@")

IF @posicao > 0 THEN
  Output(Concat("O '@' está na posição: ", @posicao))
ELSE
  Output("Caractere '@' não encontrado.")
ENDIF
]%%
```

**Saída:**
```
O '@' está na posição: 11
```

## Exemplo avançado

Extraindo o domínio do e-mail de um cliente para personalizar a comunicação — por exemplo, identificando se o assinante usa um e-mail corporativo ou pessoal. Aqui combinamos `IndexOf` com `Substring` e `Length` para isolar a parte após o "@":

```ampscript
%%[
VAR @email, @posicaoArroba, @tamanhoEmail, @dominio, @mensagem

SET @email = "maria.santos@conectatelecom.com.br"
SET @posicaoArroba = IndexOf(@email, "@")
SET @tamanhoEmail = Length(@email)

IF @posicaoArroba > 0 THEN
  SET @dominio = Substring(@email, Add(@posicaoArroba, 1), Subtract(@tamanhoEmail, @posicaoArroba))

  IF IndexOf(@dominio, "conectatelecom") > 0 THEN
    SET @mensagem = Concat("Olá, Maria! Vimos que você faz parte da Conecta Telecom. Confira ofertas exclusivas para colaboradores.")
  ELSE
    SET @mensagem = Concat("Olá, Maria! Confira nossas promoções desta semana.")
  ENDIF
ELSE
  SET @mensagem = "Olá! Confira nossas promoções desta semana."
ENDIF

Output(@mensagem)
]%%
```

**Saída:**
```
Olá, Maria! Vimos que você faz parte da Conecta Telecom. Confira ofertas exclusivas para colaboradores.
```

## Observações

> **💡 Dica:** Como `IndexOf` retorna `0` quando a substring não é encontrada, você pode usar essa verificação como uma espécie de "contém" — basta checar `IF IndexOf(@texto, "trecho") > 0 THEN` para saber se o trecho existe na string.

> **⚠️ Atenção:** A indexação começa em 1, não em 0. Se você combinar o resultado de `IndexOf` com funções como [Substring](../string-functions/substring.md), lembre-se de ajustar a posição corretamente para não cortar caracteres a mais ou a menos.

> **💡 Dica:** `IndexOf` retorna a posição da **primeira ocorrência** da substring. Se a string contiver múltiplas ocorrências do mesmo trecho, apenas a posição da primeira será retornada.

## Funções relacionadas

- [Substring](../string-functions/substring.md) — para extrair parte da string a partir da posição encontrada por `IndexOf`.
- [Length](../string-functions/length.md) — para calcular o tamanho total da string, útil em combinação com `IndexOf`.
- [Replace](../string-functions/replace.md) — para substituir a substring encontrada por outro valor.
- [Concat](../string-functions/concat.md) — para montar strings dinâmicas com os resultados.