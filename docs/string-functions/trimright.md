---
title: TrimRight
sidebar_label: TrimRight
description: Remove espaços em branco (ou caracteres específicos) do final (lado direito) de uma string.
---

# TrimRight

## Descrição

A função `TrimRight` remove espaços em branco do final (lado direito) de uma string. É super útil quando você está trabalhando com dados que vêm de Data Extensions, integrações ou formulários onde podem acabar sobrando espaços extras no final dos valores. Ela retorna a string limpa, sem aqueles espaços indesejados à direita.

## Sintaxe

```ampscript
TrimRight(string)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| string | String | Sim | A string da qual você quer remover os espaços em branco do final (lado direito). |

## Exemplo básico

```ampscript
%%[
VAR @nome
SET @nome = "Maria Santos   "
]%%

Nome sem espaços à direita: [%%=TrimRight(@nome)=%%]
Tamanho original: %%=Length("Maria Santos   ")=%%
Tamanho após TrimRight: %%=Length(TrimRight(@nome))=%%
```

**Saída:**
```
Nome sem espaços à direita: Maria Santos
Tamanho original: 15
Tamanho após TrimRight: 12
```

## Exemplo avançado

Imagine que você tem uma Data Extension de clientes da **Lojas Vitória** e os dados de nome e cidade vieram com espaços extras no final por causa de uma importação de arquivo. Você quer montar um e-mail de promoção de Dia das Mães sem esses espaços quebrando a formatação:

```ampscript
%%[
VAR @primeiroNome, @cidade, @cpf, @saudacao, @frete

/* Simulando dados que vieram com espaços extras à direita */
SET @primeiroNome = AttributeValue("PrimeiroNome") /* "João   " */
SET @cidade = AttributeValue("Cidade") /* "São Paulo    " */
SET @cpf = AttributeValue("CPF") /* "123.456.789-00  " */

/* Limpando os espaços à direita */
SET @primeiroNome = TrimRight(@primeiroNome)
SET @cidade = TrimRight(@cidade)
SET @cpf = TrimRight(@cpf)

/* Montando a mensagem */
SET @saudacao = Concat("Olá, ", ProperCase(@primeiroNome), "!")

IF @cidade == "São Paulo" OR @cidade == "Rio de Janeiro" THEN
  SET @frete = "FRETE GRÁTIS"
ELSE
  SET @frete = "frete grátis acima de R$299"
ENDIF
]%%

%%=v(@saudacao)=%%

Neste Dia das Mães, a Lojas Vitória preparou ofertas especiais para você em %%=v(@cidade)=%% com %%=v(@frete)=%%! 🎁

Seu CPF cadastrado: %%=v(@cpf)=%%

Aproveite até 50% OFF + cashback de R$30 na sua próxima compra!

Acesse: www.lojasvitoria.com.br/diadasmaes
```

**Saída:**
```
Olá, João!

Neste Dia das Mães, a Lojas Vitória preparou ofertas especiais para você em São Paulo com FRETE GRÁTIS! 🎁

Seu CPF cadastrado: 123.456.789-00

Aproveite até 50% OFF + cashback de R$30 na sua próxima compra!

Acesse: www.lojasvitoria.com.br/diadasmaes
```

## Observações

- A função remove **apenas** espaços em branco do lado **direito** (final) da string. Espaços no início ou no meio do texto não são afetados.
- Se a string não tiver espaços no final, ela é retornada sem alteração.
- Se você precisar remover espaços de **ambos os lados**, use a função [Trim](../string-functions/trim.md). Se precisar remover apenas do lado **esquerdo**, use [TrimLeft](../string-functions/trimleft.md).
- É uma boa prática combinar `TrimRight` com comparações de string (como `IF`), já que espaços invisíveis no final podem fazer uma comparação falhar — `"São Paulo "` não é igual a `"São Paulo"`.
- Se o valor passado for nulo ou vazio, a função retorna o valor sem erro.
- Muito útil para limpar dados importados de arquivos CSV ou integrações externas que costumam trazer espaços extras.

## Funções relacionadas

- [Trim](../string-functions/trim.md) — Remove espaços em branco de ambos os lados da string.
- [TrimLeft](../string-functions/trimleft.md) — Remove espaços em branco apenas do início (lado esquerdo) da string.
- [Length](../string-functions/length.md) — Retorna o tamanho da string, útil para verificar se os espaços foram removidos.
- [Concat](../string-functions/concat.md) — Concatena strings, muito usado junto com TrimRight para montar textos limpos.
- [Replace](../string-functions/replace.md) — Substitui caracteres dentro de uma string, alternativa para remover caracteres específicos.
- [AttributeValue](../utility-functions/attributevalue.md) — Recupera valores de atributos do assinante, que frequentemente precisam de trim.