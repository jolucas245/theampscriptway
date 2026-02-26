---
title: TrimLeft
sidebar_label: TrimLeft
description: Remove espaços em branco do início (lado esquerdo) de uma string.
---

<!-- generated-by-script -->

# TrimLeft

## Descrição

A função `TrimLeft` remove todos os espaços em branco do início (lado esquerdo) de uma string, mantendo o restante do conteúdo intacto. É super útil quando você está trabalhando com dados importados de sistemas externos ou preenchidos por formulários, onde é comum aparecerem espaços extras no começo dos valores. A função retorna a string sem os espaços à esquerda.

## Sintaxe

```ampscript
TrimLeft(string)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|--------|-------------|-----------|
| string | String | Sim | A string da qual os espaços em branco à esquerda serão removidos. |

## Exemplo básico

```ampscript
%%[
VAR @nome
SET @nome = "   Maria Santos"
]%%

Nome original: "%%=v(@nome)=%%"
Nome ajustado: "%%=TrimLeft(@nome)=%%"
```

**Saída:**
```
Nome original: "   Maria Santos"
Nome ajustado: "Maria Santos"
```

## Exemplo avançado

Imagine que você tem uma Data Extension de clientes da **Lojas Vitória** e, ao importar os dados do sistema legado, alguns nomes e CPFs vieram com espaços no início. Você precisa limpar esses dados antes de usar no e-mail de boas-vindas ao programa de fidelidade:

```ampscript
%%[
VAR @nomeRaw, @cpfRaw, @emailRaw
VAR @nomeLimpo, @cpfLimpo, @emailLimpo, @saudacao

/* Simulando dados que vieram com espaços à esquerda */
SET @nomeRaw = "   João Silva"
SET @cpfRaw = "  123.456.789-00"
SET @emailRaw = "   joao.silva@email.com.br"

/* Limpando os espaços do início */
SET @nomeLimpo = TrimLeft(@nomeRaw)
SET @cpfLimpo = TrimLeft(@cpfRaw)
SET @emailLimpo = TrimLeft(@emailRaw)

/* Formatando o nome para ficar bonito */
SET @saudacao = ProperCase(@nomeLimpo)
]%%

Olá, %%=v(@saudacao)=%%! 👋

Seja bem-vindo(a) ao programa de pontos da Lojas Vitória!

Seus dados cadastrados:
- Nome: %%=v(@nomeLimpo)=%%
- CPF: %%=v(@cpfLimpo)=%%
- E-mail: %%=v(@emailLimpo)=%%

A cada R$ 1,00 em compras, você acumula 3 pontos.
Frete grátis acima de R$ 299,00!

Acesse: www.lojasvitoria.com.br/fidelidade
```

**Saída:**
```
Olá, João Silva! 👋

Seja bem-vindo(a) ao programa de pontos da Lojas Vitória!

Seus dados cadastrados:
- Nome: João Silva
- CPF: 123.456.789-00
- E-mail: joao.silva@email.com.br

A cada R$ 1,00 em compras, você acumula 3 pontos.
Frete grátis acima de R$ 299,00!

Acesse: www.lojasvitoria.com.br/fidelidade
```

## Observações

- A função remove **apenas** os espaços do lado esquerdo (início) da string. Espaços no meio ou no final são mantidos.
- Se você precisa remover espaços de ambos os lados, use a função [Trim](../string-functions/trim.md). Se precisa remover apenas do lado direito, use [TrimRight](../string-functions/trimright.md).
- Se a string não tiver espaços no início, a função retorna a string original sem alterações.
- Muito útil para limpar dados vindos de integrações, importações de CSV ou formulários de CloudPages, onde é comum ter espaços acidentais.
- Combine com outras funções de string como [ProperCase](../string-functions/propercase.md) ou [Uppercase](../string-functions/uppercase.md) para garantir que os dados fiquem formatados corretamente após a limpeza.
- Cuidado: a função remove **espaços em branco**, não outros caracteres invisíveis como tabulações ou quebras de linha.

## Funções relacionadas

- [Trim](../string-functions/trim.md) — Remove espaços em branco de ambos os lados da string.
- [TrimRight](../string-functions/trimright.md) — Remove espaços em branco apenas do final (lado direito) da string.
- [Replace](../string-functions/replace.md) — Substitui ocorrências de uma substring por outra, útil para remover caracteres específicos.
- [Concat](../string-functions/concat.md) — Concatena strings, útil após limpar os dados com TrimLeft.
- [ProperCase](../string-functions/propercase.md) — Converte a primeira letra de cada palavra para maiúscula, ótimo para usar junto com TrimLeft na formatação de nomes.
- [Length](../string-functions/length.md) — Retorna o tamanho da string, útil para verificar se a limpeza funcionou como esperado.