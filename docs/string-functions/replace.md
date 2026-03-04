---
title: Replace
sidebar_label: Replace
description: Substitui todas as ocorrências de uma substring por outra dentro de uma string.
---

# Replace

## Descrição

A função `Replace` localiza **todas as ocorrências** de uma substring dentro de uma string e substitui cada uma por outra substring que você definir. É muito útil no dia a dia de SFMC para limpar e formatar dados de clientes — como corrigir formatação de telefones, ajustar URLs, trocar placeholders em templates dinâmicos ou padronizar textos em campanhas de e-mail e SMS. Retorna a string original com todas as substituições aplicadas.

## Sintaxe

```ampscript
Replace(sourceString, searchSubstring, replacementSubstring)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| sourceString | string | Sim | A string original onde a busca será feita. |
| searchSubstring | string | Sim | A substring que você quer encontrar dentro de `sourceString`. |
| replacementSubstring | string | Sim | A substring que vai substituir cada ocorrência de `searchSubstring`. |

## Exemplo básico

Substituindo o nome de uma estação do ano em uma mensagem promocional da MegaStore:

```ampscript
%%[
SET @mensagem = "Promoção de inverno MegaStore: até 50% de desconto na coleção de inverno!"
SET @mensagemAtualizada = Replace(@mensagem, "inverno", "verão")
]%%
%%=v(@mensagemAtualizada)=%%
```

**Saída:**
```
Promoção de verão MegaStore: até 50% de desconto na coleção de verão!
```

## Exemplo avançado

Cenário real de régua de relacionamento: você recebe o telefone do cliente sem formatação e precisa limpar caracteres antes de usar em uma integração via API ou exibir de forma padronizada no e-mail.

```ampscript
%%[
SET @telefoneOriginal = "(11) 99876-5432"

/* Remove parênteses, espaço e hífen para obter só números */
SET @telefone = Replace(@telefoneOriginal, "(", "")
SET @telefone = Replace(@telefone, ")", "")
SET @telefone = Replace(@telefone, " ", "")
SET @telefone = Replace(@telefone, "-", "")

SET @nome = "Maria Santos"
SET @loja = "Lojas Vitória"
]%%

Olá, %%=v(@nome)=%%! 

Seu cadastro na %%=v(@loja)=%% está vinculado ao telefone %%=v(@telefoneOriginal)=%%.

Número limpo para integração: %%=v(@telefone)=%%
```

**Saída:**
```
Olá, Maria Santos!

Seu cadastro na Lojas Vitória está vinculado ao telefone (11) 99876-5432.

Número limpo para integração: 11998765432
```

## Observações

- A função substitui **todas** as ocorrências encontradas, não apenas a primeira. Se a substring aparecer 5 vezes, as 5 serão substituídas.

- Você pode encadear múltiplas chamadas de `Replace` para fazer várias substituições em sequência, como no exemplo de limpeza de telefone acima.

- Para identificar um trecho antes de substituir, o [RegExMatch](../string-functions/regexmatch.md) pode ser combinado com `Replace`.

> **💡 Dica:** `Replace` é ótima para montar templates reutilizáveis com placeholders customizados (ex: `{{NOME_CLIENTE}}`, `{{VALOR_PEDIDO}}`), substituindo cada um pelo valor real no momento do envio.

> **⚠️ Atenção:** Se `searchSubstring` não for encontrada em `sourceString`, a função simplesmente retorna a string original sem alterações — não gera erro.

## Funções relacionadas

- [Concat](../string-functions/concat.md) — para juntar strings após substituições
- [Substring](../string-functions/substring.md) — para extrair parte de uma string
- [IndexOf](../string-functions/indexof.md) — para localizar a posição de uma substring antes de decidir substituir
- [RegExMatch](../string-functions/regexmatch.md) — para identificar trechos por padrão regex
- [ReplaceList](../string-functions/replacelist.md) — para substituir um valor por outro a partir de uma lista de opções
- [Trim](../string-functions/trim.md) — para remover espaços em branco das extremidades após substituições