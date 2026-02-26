---
title: IsNull
sidebar_label: IsNull
description: Testa se o valor de uma variável ou função é nulo (null), retornando true em caso positivo e false caso contrário.
---

# IsNull

## Descrição

A função `IsNull` verifica se o valor de uma variável ou função é **nulo (null)**. Se for nulo, ela retorna `true`; caso contrário, retorna `false`. É muito útil para validar dados antes de usá-los em personalizações de e-mail, CloudPages ou qualquer outro contexto do Marketing Cloud — por exemplo, para checar se um campo da Data Extension veio preenchido ou se uma variável foi definida corretamente. Ela é parecida com a função [Empty](../utility-functions/empty.md), mas tem uma diferença importante: `Empty` retorna `true` também para strings vazias (`""`), enquanto `IsNull` **não** retorna `true` para strings vazias — só para valores genuinamente nulos.

## Sintaxe

```ampscript
IsNull(valorParaTestar)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| valorParaTestar | String | Sim | A variável ou função cujo valor será testado para verificar se é nulo. |

## Exemplo básico

Neste exemplo, declaramos uma variável sem atribuir nenhum valor a ela (ou seja, o valor é nulo) e depois usamos `IsNull` para testar:

```ampscript
%%[
  VAR @n
]%%

O valor de @n é nulo? %%=IsNull(@n)=%%
```

**Saída:**
```
O valor de @n é nulo? True
```

## Exemplo avançado

Imagine que você trabalha na **MegaStore** e está enviando um e-mail de Dia das Mães. Você quer personalizar a saudação usando o primeiro nome do cliente, que vem de uma Data Extension. Porém, nem todo cadastro tem o nome preenchido — alguns vieram nulos. Veja como tratar isso:

```ampscript
%%[
  SET @primeiroNome = Lookup("Clientes_MegaStore", "PrimeiroNome", "Email", EmailAddress)
  SET @cupom = Lookup("Clientes_MegaStore", "CupomDiadasMaes", "Email", EmailAddress)
  SET @saldoPontos = Lookup("Clientes_MegaStore", "SaldoPontos", "Email", EmailAddress)

  IF IsNull(@primeiroNome) THEN
    SET @saudacao = "Olá, cliente especial"
  ELSE
    SET @saudacao = Concat("Olá, ", @primeiroNome)
  ENDIF

  IF IsNull(@cupom) THEN
    SET @msgCupom = "Aproveite nossas ofertas de Dia das Mães!"
  ELSE
    SET @msgCupom = Concat("Use o cupom ", @cupom, " e ganhe 15% de desconto!")
  ENDIF

  IF IsNull(@saldoPontos) THEN
    SET @msgPontos = ""
  ELSE
    SET @msgPontos = Concat("Você tem ", @saldoPontos, " pontos disponíveis no programa MegaPontos.")
  ENDIF
]%%

%%=v(@saudacao)=%%! 🌷

%%=v(@msgCupom)=%%

%%[IF NOT IsNull(@saldoPontos) THEN]%%
  %%=v(@msgPontos)=%%
  Troque seus pontos por frete grátis em compras acima de R$299,00!
%%[ENDIF]%%

Acesse: www.megastore.com.br/diadasmaes
```

**Saída (para Maria Santos, que tem cupom e pontos):**
```
Olá, Maria! 🌷

Use o cupom MAES2024 e ganhe 15% de desconto!

Você tem 4.250 pontos disponíveis no programa MegaPontos.
Troque seus pontos por frete grátis em compras acima de R$299,00!

Acesse: www.megastore.com.br/diadasmaes
```

**Saída (para um cliente sem nome nem cupom cadastrados):**
```
Olá, cliente especial! 🌷

Aproveite nossas ofertas de Dia das Mães!

Acesse: www.megastore.com.br/diadasmaes
```

## Observações

- `IsNull` retorna `true` **somente** quando o valor é genuinamente nulo. Uma string vazia (`""`) **não** é considerada nula por essa função — para esse caso, use [Empty](../utility-functions/empty.md).
- Uma variável declarada com `VAR` sem receber um valor via `SET` é considerada nula.
- Campos de Data Extension que não têm valor preenchido e não possuem valor padrão geralmente retornam nulo, o que pode ser capturado por `IsNull`.
- Na prática, muitos desenvolvedores preferem usar [Empty](../utility-functions/empty.md) como verificação mais abrangente, pois ela cobre tanto nulos quanto strings vazias. Use `IsNull` quando você precisa distinguir especificamente entre "nulo" e "vazio".
- Se você quer testar se é nulo e, em caso positivo, retornar um valor padrão em uma única linha, confira a função [IsNullDefault](../utility-functions/isnulldefault.md) — ela faz exatamente isso e deixa seu código mais enxuto.
- A função pode ser usada em qualquer contexto do SFMC: e-mails, CloudPages, SMS, Landing Pages, etc.

## Funções relacionadas

- [Empty](../utility-functions/empty.md) — Testa se o valor é nulo **ou** uma string vazia. Mais abrangente que `IsNull`.
- [IsNullDefault](../utility-functions/isnulldefault.md) — Testa se o valor é nulo e retorna um valor padrão caso seja. Combina teste + fallback em uma só função.
- [IIF](../utility-functions/iif.md) — Retorna um valor ou outro com base em uma condição. Útil para lógicas inline combinadas com `IsNull`.
- [AttributeValue](../utility-functions/attributevalue.md) — Retorna o valor de um atributo do assinante, retornando string vazia em vez de erro caso o atributo não exista.
- [Lookup](../data-extension-functions/lookup.md) — Busca um valor em uma Data Extension. Pode retornar nulo quando não encontra o registro, sendo um cenário comum para usar `IsNull`.
- [V](../utility-functions/v.md) — Exibe o valor de uma variável. Frequentemente usada junto com `IsNull` para renderização condicional.