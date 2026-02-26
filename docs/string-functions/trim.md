---
title: Trim
sidebar_label: Trim
description: Remove espaços em branco do início e do fim de uma string.
---

# Trim

## Descrição

A função `Trim` remove espaços em branco do início e do fim de uma string. É super útil quando você trabalha com dados que vêm de formulários, importações de CSV ou Data Extensions onde os valores podem ter espaços extras acidentais. A função retorna a string limpa, sem aqueles espaços indesejados nas pontas. Se você já teve problema com comparações que falhavam por causa de um espacinho sobrando, essa função é a sua melhor amiga.

## Sintaxe

```ampscript
Trim(sourceString)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|--------------|--------|-------------|---------------------------------------------------|
| sourceString | String | Sim | A string da qual os espaços em branco do início e do fim serão removidos. |

## Exemplo básico

```ampscript
%%[
VAR @nomeOriginal, @nomeLimpo

SET @nomeOriginal = "   João Silva   "
SET @nomeLimpo = Trim(@nomeOriginal)
]%%

Nome original: "%%=v(@nomeOriginal)=%%"
Nome limpo: "%%=v(@nomeLimpo)=%%"
```

**Saída:**
```
Nome original: "   João Silva   "
Nome limpo: "João Silva"
```

## Exemplo avançado

Imagina que você tem uma Data Extension de clientes da **Lojas Vitória** e os dados de nome e cidade vieram de um formulário onde o pessoal digitou com espaços extras. Você precisa montar um e-mail de boas-vindas ao programa de pontos com os dados certinhos:

```ampscript
%%[
VAR @primeiroNome, @cidade, @email, @pontos

SET @primeiroNome = Trim(AttributeValue("PrimeiroNome"))
SET @cidade = Trim(AttributeValue("Cidade"))
SET @email = Trim(Lowercase(AttributeValue("EmailAddress")))
SET @pontos = Lookup("ProgramaPontos", "Saldo", "Email", @email)

IF Empty(@primeiroNome) THEN
  SET @primeiroNome = "Cliente"
ENDIF
]%%

Olá, %%=ProperCase(@primeiroNome)=%%! 👋

Bem-vindo(a) ao programa de pontos da Lojas Vitória!

Vimos que você é de %%=ProperCase(@cidade)=%%. Fique de olho nas ofertas exclusivas da sua região.

Seu saldo atual: %%=v(@pontos)=%% pontos

%%[
IF @pontos >= 500 THEN
]%%
🎉 Parabéns! Você já pode trocar seus pontos por frete grátis em compras acima de R$299,00!
%%[
ENDIF
]%%

Acesse: www.lojasvitoria.com.br/pontos
```

**Saída (exemplo para uma assinante com " Maria " no campo PrimeiroNome e " São Paulo " no campo Cidade):**
```
Olá, Maria! 👋

Bem-vindo(a) ao programa de pontos da Lojas Vitória!

Vimos que você é de São Paulo. Fique de olho nas ofertas exclusivas da sua região.

Seu saldo atual: 750 pontos

🎉 Parabéns! Você já pode trocar seus pontos por frete grátis em compras acima de R$299,00!

Acesse: www.lojasvitoria.com.br/pontos
```

## Observações

- A função remove **apenas** espaços em branco do início e do fim da string. Espaços no meio do texto (por exemplo, entre o primeiro nome e o sobrenome) são preservados normalmente.
- É uma boa prática usar `Trim` sempre que você captura dados via [RequestParameter](../sites-functions/requestparameter.md) em CloudPages, já que usuários frequentemente digitam espaços sem querer.
- Combinar `Trim` com funções como [Lowercase](../string-functions/lowercase.md) ou [Uppercase](../string-functions/uppercase.md) antes de fazer comparações evita muita dor de cabeça com dados inconsistentes.
- Se a string passada for vazia, a função retorna uma string vazia.
- Se você precisa remover espaços apenas de um lado da string, considere usar [TrimLeft](../string-functions/trimleft.md) ou [TrimRight](../string-functions/trimright.md).
- A função não remove outros caracteres de espaço em branco como tabulações ou quebras de linha — apenas espaços comuns.

## Funções relacionadas

- [TrimLeft](../string-functions/trimleft.md) — Remove espaços em branco apenas do início (lado esquerdo) da string.
- [TrimRight](../string-functions/trimright.md) — Remove espaços em branco apenas do fim (lado direito) da string.
- [Replace](../string-functions/replace.md) — Substitui ocorrências de uma substring por outra, útil para remover espaços no meio do texto.
- [Lowercase](../string-functions/lowercase.md) — Converte a string para minúsculas, ótima para combinar com Trim antes de comparações.
- [Uppercase](../string-functions/uppercase.md) — Converte a string para maiúsculas.
- [ProperCase](../string-functions/propercase.md) — Converte a primeira letra de cada palavra para maiúscula, ideal para nomes de pessoas.
- [Length](../string-functions/length.md) — Retorna o tamanho da string, útil para validar após o Trim.
- [Empty](../utility-functions/empty.md) — Verifica se um valor está vazio, bom para usar junto com Trim na validação de campos.
- [AttributeValue](../utility-functions/attributevalue.md) — Recupera o valor de um atributo do assinante, frequentemente combinada com Trim.