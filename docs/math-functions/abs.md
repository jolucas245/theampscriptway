---
title: Abs
sidebar_label: Abs
description: Retorna o valor absoluto (não negativo) de um número, removendo o sinal negativo caso exista.
---

# Abs

## Descrição

A função `Abs` retorna o valor absoluto de um número, ou seja, o valor sem o sinal negativo. Se o número já for positivo ou zero, ele é retornado como está; se for negativo, o sinal é removido. É super útil quando você precisa trabalhar com diferenças entre valores sem se preocupar com a direção (positivo ou negativo) — por exemplo, para calcular a diferença entre o saldo anterior e o atual de um cliente, independentemente de quem é maior.

## Sintaxe

```ampscript
Abs(número)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| número | Número | Sim | O valor numérico do qual você deseja obter o valor absoluto. |

## Exemplo básico

```ampscript
%%[
VAR @valorNegativo, @valorPositivo, @zero

SET @valorNegativo = Abs(-150.75)
SET @valorPositivo = Abs(200.50)
SET @zero = Abs(0)
]%%

Valor absoluto de -150.75: %%=v(@valorNegativo)=%%
Valor absoluto de 200.50: %%=v(@valorPositivo)=%%
Valor absoluto de 0: %%=v(@zero)=%%
```

**Saída:**
```
Valor absoluto de -150.75: 150.75
Valor absoluto de 200.50: 200.50
Valor absoluto de 0: 0
```

## Exemplo avançado

Imagine que a **MegaStore** tem um programa de cashback e precisa enviar um e-mail mostrando a variação do saldo de pontos do cliente em relação ao mês anterior. A variação pode ser positiva ou negativa, mas você quer exibir o número absoluto junto com uma indicação de "ganhou" ou "perdeu" pontos.

```ampscript
%%[
VAR @nome, @saldoAtual, @saldoAnterior, @diferenca, @diferencaAbsoluta, @mensagem

SET @nome = AttributeValue("PrimeiroNome")
SET @saldoAtual = Lookup("Pontos_Fidelidade", "SaldoAtual", "EmailAddress", EmailAddress)
SET @saldoAnterior = Lookup("Pontos_Fidelidade", "SaldoAnterior", "EmailAddress", EmailAddress)

SET @diferenca = Subtract(@saldoAtual, @saldoAnterior)
SET @diferencaAbsoluta = Abs(@diferenca)

IF @diferenca > 0 THEN
  SET @mensagem = Concat("Parabéns, ", @nome, "! Você ganhou ", FormatNumber(@diferencaAbsoluta, "N0"), " pontos neste mês. 🎉")
ELSEIF @diferenca < 0 THEN
  SET @mensagem = Concat("Oi, ", @nome, "! Você utilizou ", FormatNumber(@diferencaAbsoluta, "N0"), " pontos neste mês. Que bom que aproveitou! 🛒")
ELSE
  SET @mensagem = Concat("Oi, ", @nome, "! Seu saldo de pontos não teve alteração neste mês.")
ENDIF
]%%

%%=v(@mensagem)=%%

Seu saldo atual: %%=FormatNumber(@saldoAtual, "N0")=%% pontos

Aproveite para trocar seus pontos por descontos em www.megastore.com.br/pontos
```

**Saída (exemplo para cliente que usou pontos):**
```
Oi, Maria! Você utilizou 450 pontos neste mês. Que bom que aproveitou! 🛒

Seu saldo atual: 1.230 pontos

Aproveite para trocar seus pontos por descontos em www.megastore.com.br/pontos
```

**Saída (exemplo para cliente que ganhou pontos):**
```
Parabéns, Carlos! Você ganhou 320 pontos neste mês. 🎉

Seu saldo atual: 2.540 pontos

Aproveite para trocar seus pontos por descontos em www.megastore.com.br/pontos
```

## Observações

- A função aceita números inteiros e decimais (com ponto como separador decimal).
- Se você passar um valor que não seja numérico, a função vai gerar um erro em tempo de execução. Valide os dados antes de usar `Abs` — considere usar [IsNull](../utility-functions/isnull.md) ou [IsNullDefault](../utility-functions/isnulldefault.md) para tratar valores nulos vindos de Data Extensions.
- O valor `0` retorna `0` — não há alteração.
- Muito útil em cenários de cálculo de diferenças (saldo, pontos, preços) onde você quer exibir a magnitude da mudança sem o sinal.

## Funções relacionadas

- [Add](../math-functions/add.md) — soma dois valores numéricos
- [Subtract](../math-functions/subtract.md) — subtrai um valor de outro
- [Multiply](../math-functions/multiply.md) — multiplica dois valores numéricos
- [Divide](../math-functions/divide.md) — divide um valor por outro
- [Round](../math-functions/round.md) — arredonda um número para o número de casas decimais especificado
- [Ceiling](../math-functions/ceiling.md) — arredonda um número para cima (próximo inteiro)
- [Floor](../math-functions/floor.md) — arredonda um número para baixo (inteiro inferior)
- [Min](../math-functions/min.md) — retorna o menor valor entre dois números
- [Max](../math-functions/max.md) — retorna o maior valor entre dois números
- [FormatNumber](../string-functions/formatnumber.md) — formata um número para exibição com separadores e casas decimais