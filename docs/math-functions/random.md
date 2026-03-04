---
title: Random
sidebar_label: Random
description: Retorna um número aleatório dentro de um intervalo definido por um limite inferior e um limite superior.
---

# Random

## Descrição

A função `Random` gera um número aleatório dentro de um intervalo que você define. Você passa um limite inferior e um limite superior, e ela retorna um valor maior ou igual ao menor número e menor ou igual ao maior número. É muito útil no dia a dia de SFMC para cenários como sortear cupons de desconto, randomizar conteúdo de e-mail, distribuir ofertas aleatoriamente em réguas de relacionamento ou criar códigos de verificação simples.

## Sintaxe

```ampscript
Random(lowerBound, upperBound)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| lowerBound | Número | Sim | O menor número que a função pode retornar. Aceita inteiros ou decimais, positivos ou negativos. |
| upperBound | Número | Sim | O maior número que a função pode retornar. Aceita inteiros ou decimais, positivos ou negativos. |

## Exemplo básico

Sorteando um percentual de desconto aleatório entre 5 e 30 para uma campanha promocional da MegaStore:

```ampscript
%%[
SET @desconto = Random(5, 30)
]%%

Parabéns! Você ganhou %%=v(@desconto)=%% % de desconto na MegaStore!
```

**Saída:**
```
Parabéns! Você ganhou 17% de desconto na MegaStore!
```

## Exemplo avançado

Criando uma régua de relacionamento para a Lojas Vitória onde cada cliente recebe um cupom com código aleatório e um valor de cashback sorteado. O número aleatório é combinado com outras funções para montar o código e formatar a mensagem:

```ampscript
%%[
SET @nome = "Maria Santos"
SET @codigoParte = Random(10000, 99999)
SET @cupom = Concat("VITORIA-", @codigoParte)
SET @cashback = Random(10, 50)

SET @faixaSorteada = Random(1, 3)

IF @faixaSorteada == 1 THEN
  SET @categoria = "Moda"
ELSEIF @faixaSorteada == 2 THEN
  SET @categoria = "Eletrônicos"
ELSE
  SET @categoria = "Casa e Decoração"
ENDIF
]%%

Olá, %%=v(@nome)=%%!

Seu cupom exclusivo: %%=v(@cupom)=%%
Cashback de R$ %%=v(@cashback)=%%,00 em compras na categoria %%=v(@categoria)=%%.

Válido até 31/12/2025. Aproveite!
```

**Saída:**
```
Olá, Maria Santos!

Seu cupom exclusivo: VITORIA-48273
Cashback de R$ 34,00 em compras na categoria Eletrônicos.

Válido até 31/12/2025. Aproveite!
```

## Observações

- A ordem dos parâmetros `lowerBound` e `upperBound` não importa. Se você passar `Random(50, 10)`, a função entende que o intervalo é de 10 a 50 e funciona normalmente.

- Os parâmetros aceitam números inteiros e decimais, positivos e negativos. Então `Random(-10, 10)` e `Random(1.5, 9.5)` são usos válidos.

- O valor retornado é maior ou igual ao menor número e menor ou igual ao maior número do intervalo — ou seja, ambos os limites podem ser retornados.

> **💡 Dica:** Como o resultado é aleatório, cada subscriber pode receber um valor diferente no mesmo envio. Isso é ótimo para campanhas de "desconto surpresa" ou gamificação em e-mails. Se você precisa de um número inteiro "redondo" a partir de um resultado decimal, combine com [Floor](../math-functions/floor.md) ou [Ceiling](../math-functions/ceiling.md).

> **⚠️ Atenção:** Por ser aleatório, o valor gerado muda a cada renderização. Se você usar `Random` em um e-mail e o subscriber abrir o e-mail várias vezes (em contextos com conteúdo dinâmico em tempo de abertura), o valor pode variar. Para garantir consistência, capture o valor com `SET` em uma variável e use essa variável ao longo do conteúdo.

## Funções relacionadas

- [Floor](../math-functions/floor.md) — arredonda para baixo, útil para obter inteiros a partir do resultado de `Random`
- [Ceiling](../math-functions/ceiling.md) — arredonda para cima
- [Round](../math-functions/round.md) — arredonda para o inteiro mais próximo
- [Mod](../math-functions/mod.md) — resto da divisão, útil para distribuir resultados em grupos
- [Concat](../string-functions/concat.md) — para montar códigos ou cupons concatenando o número aleatório com prefixos
- [Format](../string-functions/format.md) — para formatar o número gerado