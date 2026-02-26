---
title: Sqrt
sidebar_label: Sqrt
description: Retorna a raiz quadrada de um número especificado.
---

# Sqrt

## Descrição

A função `Sqrt` calcula e retorna a raiz quadrada de um valor numérico. É útil quando você precisa fazer cálculos matemáticos dentro de emails, CloudPages ou qualquer contexto do Marketing Cloud — como calcular distâncias, índices estatísticos ou métricas derivadas de dados dos seus assinantes. A função recebe um único número como parâmetro e retorna o resultado como valor numérico.

## Sintaxe

```ampscript
Sqrt(número)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| número | Número | Sim | O valor numérico do qual você quer calcular a raiz quadrada. Deve ser um número maior ou igual a zero. |

## Exemplo básico

```ampscript
%%[
VAR @resultado
SET @resultado = Sqrt(144)
]%%

A raiz quadrada de 144 é: %%=v(@resultado)=%%
```

**Saída:**
```
A raiz quadrada de 144 é: 12
```

## Exemplo avançado

Imagine que a **MegaStore** tem um programa de fidelidade onde os clientes acumulam pontos. Para calcular o nível do cliente (de 1 a 10), eles usam a raiz quadrada dos pontos acumulados dividida por um fator. Isso cria uma progressão onde fica cada vez mais difícil subir de nível — bem parecido com programas de gamificação reais.

```ampscript
%%[
VAR @nomeCliente, @pontosAcumulados, @nivelBruto, @nivel, @nivelFinal

SET @nomeCliente = AttributeValue("NomeCliente")
SET @pontosAcumulados = AttributeValue("PontosAcumulados")

/* Calcula o nível baseado na raiz quadrada dos pontos */
/* Fator: cada 100 pontos equivale a ~1 nível na escala */
SET @nivelBruto = Divide(Sqrt(@pontosAcumulados), Sqrt(100))
SET @nivel = Floor(@nivelBruto)

/* Garante que o nível fique entre 1 e 10 */
IF @nivel < 1 THEN
  SET @nivelFinal = 1
ELSEIF @nivel > 10 THEN
  SET @nivelFinal = 10
ELSE
  SET @nivelFinal = @nivel
ENDIF

VAR @mensagem
IF @nivelFinal >= 8 THEN
  SET @mensagem = "Você é cliente VIP! Aproveite frete grátis em todas as compras."
ELSEIF @nivelFinal >= 5 THEN
  SET @mensagem = "Você está quase lá! Frete grátis acima de R$149,00."
ELSE
  SET @mensagem = "Continue acumulando pontos! Frete grátis acima de R$299,00."
ENDIF
]%%

Olá, %%=v(@nomeCliente)=%%!

Seus pontos acumulados: %%=v(@pontosAcumulados)=%%
Seu nível no programa Mega Fidelidade: %%=v(@nivelFinal)=%%

%%=v(@mensagem)=%%

Acesse: www.megastore.com.br/fidelidade
```

**Saída (para um cliente com 2500 pontos):**
```
Olá, Maria Santos!

Seus pontos acumulados: 2500
Seu nível no programa Mega Fidelidade: 5

Você está quase lá! Frete grátis acima de R$149,00.

Acesse: www.megastore.com.br/fidelidade
```

## Observações

- O parâmetro deve ser um número **maior ou igual a zero**. Passar um número negativo pode gerar um erro na renderização do conteúdo.
- Se o valor passado for zero, o resultado será **0**.
- O resultado retornado pode ser um número decimal (por exemplo, `Sqrt(2)` retorna aproximadamente `1.4142135623731`). Use [Round](../math-functions/round.md) ou [Floor](../math-functions/floor.md) se precisar arredondar o valor.
- Se o campo da Data Extension estiver vazio ou nulo, use [IsNull](../utility-functions/isnull.md) ou [Empty](../utility-functions/empty.md) para validar o valor **antes** de passá-lo para `Sqrt`, evitando erros no envio.
- A função aceita tanto valores numéricos literais quanto variáveis que contenham números.

## Funções relacionadas

- [Power](../math-functions/power.md) — eleva um número a uma potência (operação inversa da raiz quadrada quando usada com expoente 0.5)
- [Round](../math-functions/round.md) — arredonda o resultado para um número específico de casas decimais
- [Floor](../math-functions/floor.md) — arredonda para baixo, útil para obter valores inteiros a partir do resultado
- [Ceiling](../math-functions/ceiling.md) — arredonda para cima o resultado da raiz quadrada
- [Abs](../math-functions/abs.md) — retorna o valor absoluto, útil para garantir que o número seja positivo antes de calcular a raiz
- [Divide](../math-functions/divide.md) — divide dois números, frequentemente combinada com `Sqrt` em cálculos mais complexos
- [Multiply](../math-functions/multiply.md) — multiplica valores, útil para combinar com resultados de raiz quadrada