---
title: Empty
sidebar_label: Empty
description: Testa se uma variável está vazia ou nula, retornando true quando não possui valor e false quando possui.
---

# Empty

## Descrição

A função `Empty()` verifica se uma variável tem algum valor atribuído. Se a variável tiver um valor, a função retorna `false`. Se a variável for uma string vazia (`""`) ou `null` (nunca recebeu um valor), a função retorna `true`. É uma das funções mais usadas no dia a dia do AMPscript — você vai usar ela o tempo todo para evitar que campos em branco quebrem a personalização dos seus e-mails, CloudPages e SMS.

## Sintaxe

```ampscript
Empty(@variavel)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|--------|-------------|-----------|
| variable | String | Sim | A variável que você quer testar para saber se está vazia ou nula. |

## Exemplo básico

Um cenário clássico: você quer mostrar o primeiro nome do assinante no e-mail, mas nem todo mundo tem esse campo preenchido na Data Extension. Com `Empty()`, você mostra um fallback amigável quando o nome estiver em branco.

```ampscript
%%[
  SET @primeiroNome = [PrimeiroNome]
]%%

%%[ IF NOT Empty(@primeiroNome) THEN ]%%
  Olá, %%=v(@primeiroNome)=%%! 👋
%%[ ELSE ]%%
  Olá! 👋
%%[ ENDIF ]%%
```

**Saída (quando `PrimeiroNome` = "Maria"):**
```
Olá, Maria! 👋
```

**Saída (quando `PrimeiroNome` está vazio ou nulo):**
```
Olá! 👋
```

## Exemplo avançado

Imagine que a **MegaStore** está mandando um e-mail de Dia das Mães com oferta personalizada. Você precisa verificar vários campos de uma Data Extension: nome, cupom de desconto e saldo de cashback. Se algum dado estiver faltando, o e-mail mostra uma versão genérica.

```ampscript
%%[
  SET @email = AttributeValue("EmailAddress")
  SET @nome = AttributeValue("PrimeiroNome")
  SET @cupom = AttributeValue("CupomDiaDasMaes")
  SET @cashback = AttributeValue("SaldoCashback")

  /* Definindo fallbacks com IIF e Empty */
  SET @saudacao = IIF(NOT Empty(@nome), Concat("Oi, ", @nome, "!"), "Oi!")

  SET @blocoCupom = ""
  IF NOT Empty(@cupom) THEN
    SET @blocoCupom = Concat("🎁 Use o cupom ", @cupom, " e ganhe 15% OFF no presente da sua mãe!")
  ELSE
    SET @blocoCupom = "🎁 Confira nossas ofertas especiais de Dia das Mães em www.megastore.com.br!"
  ENDIF

  SET @blocoCashback = ""
  IF NOT Empty(@cashback) THEN
    SET @blocoCashback = Concat("💰 Você tem R$ ", FormatNumber(@cashback, "N2"), " de cashback disponível. Aproveite!")
  ENDIF
]%%

%%=v(@saudacao)=%%

%%=v(@blocoCupom)=%%

%%[ IF NOT Empty(@blocoCashback) THEN ]%%
  %%=v(@blocoCashback)=%%
%%[ ENDIF ]%%

---
Frete grátis acima de R$ 299,00 | www.megastore.com.br
```

**Saída (quando todos os campos estão preenchidos — nome: "Carla", cupom: "MAES2024", cashback: 47.50):**
```
Oi, Carla!

🎁 Use o cupom MAES2024 e ganhe 15% OFF no presente da sua mãe!

💰 Você tem R$ 47,50 de cashback disponível. Aproveite!

---
Frete grátis acima de R$ 299,00 | www.megastore.com.br
```

**Saída (quando nome está vazio, cupom está vazio e cashback está nulo):**
```
Oi!

🎁 Confira nossas ofertas especiais de Dia das Mães em www.megastore.com.br!

---
Frete grátis acima de R$ 299,00 | www.megastore.com.br
```

## Observações

- `Empty()` retorna `true` em dois cenários: quando a variável contém uma **string vazia** (`""`) ou quando ela é **nula** (nunca recebeu nenhum valor com `SET`).
- Se a variável tiver um valor atribuído — mesmo que seja um espaço em branco (`" "`), zero (`0`) ou a string `"0"` — a função retorna `false`. Se você precisa tratar espaços em branco, combine com [Trim](../string-functions/trim.md) antes de testar: `Empty(Trim(@variavel))`.
- É muito comum combinar `Empty()` com `NOT` dentro de blocos `IF` para executar código somente quando o valor **existe**.
- Você também pode usar `Empty()` inline com [IIF](../utility-functions/iif.md) para resoluções em uma única linha, como: `%%=IIF(NOT Empty(@var), @var, "Valor padrão")=%%`.
- A função `Empty()` funciona em todos os contextos do Marketing Cloud: e-mails, CloudPages, SMS, Landing Pages e Script Activities.
- Se você está trabalhando com resultados de [Lookup](../data-extension-functions/lookup.md) ou [LookupRows](../data-extension-functions/lookuprows.md), sempre teste com `Empty()` (para `Lookup`) ou compare o [RowCount](../data-extension-functions/rowcount.md) com zero (para `LookupRows`) antes de usar os valores retornados — isso evita erros em tempo de envio.
- `Empty()` é diferente de [IsNull](../utility-functions/isnull.md): enquanto `IsNull()` detecta apenas valores nulos, `Empty()` detecta **tanto nulos quanto strings vazias**, sendo geralmente a opção mais segura para validações.

## Funções relacionadas

- [IIF](../utility-functions/iif.md) — Retorna um valor ou outro com base em uma condição; muito usado junto com `Empty()` para fallbacks inline.
- [IsNull](../utility-functions/isnull.md) — Testa se uma variável é nula (mas não detecta strings vazias).
- [IsNullDefault](../utility-functions/isnulldefault.md) — Retorna um valor padrão quando a variável é nula.
- [AttributeValue](../utility-functions/attributevalue.md) — Recupera o valor de um atributo de perfil ou campo de Data Extension, retornando string vazia quando não encontra (ideal para usar com `Empty()`).
- [V](../utility-functions/v.md) — Exibe o valor de uma variável; combine com `Empty()` para só exibir quando houver valor.
- [Trim](../string-functions/trim.md) — Remove espaços em branco no início e fim de uma string; útil antes de testar com `Empty()`.
- [Length](../string-functions/length.md) — Retorna o tamanho de uma string; alternativa para verificar se um campo tem conteúdo.
- [Lookup](../data-extension-functions/lookup.md) — Busca um valor em Data Extension; sempre valide o retorno com `Empty()` antes de usar.