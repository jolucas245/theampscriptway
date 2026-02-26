---
title: Mod
sidebar_label: Mod
description: Retorna o resto da divisão do primeiro parâmetro pelo segundo parâmetro.
---

<!-- generated-by-script -->

# Mod

## Descrição

A função `Mod()` retorna o **resto** (módulo) da divisão de um número por outro. Você passa dois números — o dividendo e o divisor — e ela calcula quanto sobra depois da divisão inteira. É super útil para cenários como alternar cores em linhas de tabelas, distribuir itens em grupos, criar lógicas cíclicas (tipo "a cada X compras, ganhe um brinde") ou verificar se um número é par ou ímpar. A função aceita números inteiros, decimais, positivos e negativos.

## Sintaxe

```ampscript
Mod(dividendo, divisor)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| dividendo | Número | Sim | O número que será dividido (pode ser inteiro, decimal, positivo ou negativo). |
| divisor | Número | Sim | O número pelo qual o dividendo será dividido (pode ser inteiro, decimal, positivo ou negativo). |

## Exemplo básico

Imagine que você quer saber o resto da divisão de 500 por 12 — por exemplo, para calcular quantos meses "sobram" em um programa de fidelidade:

```ampscript
%%[
VAR @resto
SET @resto = Mod(500, 12)
]%%

O resto da divisão de 500 por 12 é: %%=v(@resto)=%%
```

**Saída:**
```
O resto da divisão de 500 por 12 é: 8
```

## Exemplo avançado

Vamos a um cenário real: a **MegaStore** tem um programa de fidelidade onde a cada 5 compras o cliente ganha um cupom de R$ 50,00 de desconto. Queremos mostrar no e-mail quantas compras faltam para o próximo cupom e, se o cliente já completou o ciclo, parabenizá-lo. Também vamos alternar a cor das linhas de um histórico de recompensas.

```ampscript
%%[
VAR @nomeCliente, @totalCompras, @comprasRestantes, @cuponsGanhos

SET @nomeCliente = AttributeValue("PrimeiroNome")
SET @totalCompras = AttributeValue("TotalCompras")

/* Quantas compras faltam para o próximo cupom */
SET @comprasRestantes = Mod(@totalCompras, 5)

/* Quantos cupons o cliente já ganhou */
SET @cuponsGanhos = Divide(Subtract(@totalCompras, @comprasRestantes), 5)
]%%

Olá, %%=v(@nomeCliente)=%%! 🎉

Você já fez %%=v(@totalCompras)=%% compras na MegaStore.

%%[ IF @comprasRestantes == 0 THEN ]%%
  Parabéns! Você completou um ciclo de 5 compras! 🏆
  Seu cupom de R$ 50,00 já está disponível na sua conta.
  Até agora você já acumulou %%=v(@cuponsGanhos)=%% cupons!
%%[ ELSE ]%%
  Faltam apenas %%=v(Subtract(5, @comprasRestantes))=%% compras para seu próximo cupom de R$ 50,00!
  Cupons já resgatados: %%=v(@cuponsGanhos)=%%
%%[ ENDIF ]%%

<!-- Exemplo de alternância de cores em linhas usando Mod -->
<table style="width:100%; border-collapse: collapse;">
  <tr style="background-color: #333; color: #fff;">
    <th style="padding: 8px;">Compra #</th>
    <th style="padding: 8px;">Status</th>
  </tr>
%%[
VAR @i, @corFundo, @statusLinha
FOR @i = 1 TO @totalCompras DO

  /* Se Mod retorna 0, a linha é par → fundo cinza claro; senão, branco */
  IF Mod(@i, 2) == 0 THEN
    SET @corFundo = "#f2f2f2"
  ELSE
    SET @corFundo = "#ffffff"
  ENDIF

  /* Verifica se essa compra completou um ciclo de 5 */
  IF Mod(@i, 5) == 0 THEN
    SET @statusLinha = "🎁 Cupom de R$ 50,00 gerado!"
  ELSE
    SET @statusLinha = "✔ Registrada"
  ENDIF
]%%
  <tr style="background-color: %%=v(@corFundo)=%%;">
    <td style="padding: 8px; text-align: center;">%%=v(@i)=%%</td>
    <td style="padding: 8px;">%%=v(@statusLinha)=%%</td>
  </tr>
%%[ NEXT @i ]%%
</table>
```

**Saída (para um cliente com 13 compras):**
```
Olá, João! 🎉

Você já fez 13 compras na MegaStore.

Faltam apenas 2 compras para seu próximo cupom de R$ 50,00!
Cupons já resgatados: 2

| Compra # | Status                        |
|----------|-------------------------------|
| 1        | ✔ Registrada                  |
| 2        | ✔ Registrada                  |
| 3        | ✔ Registrada                  |
| 4        | ✔ Registrada                  |
| 5        | 🎁 Cupom de R$ 50,00 gerado! |
| 6        | ✔ Registrada                  |
| 7        | ✔ Registrada                  |
| 8        | ✔ Registrada                  |
| 9        | ✔ Registrada                  |
| 10       | 🎁 Cupom de R$ 50,00 gerado! |
| 11       | ✔ Registrada                  |
| 12       | ✔ Registrada                  |
| 13       | ✔ Registrada                  |
```

## Observações

- A função `Mod()` funciona com números **inteiros e decimais**. Por exemplo, `Mod(-11.93, 5.025)` retorna `-1.88300000000001`. Note que com decimais pode haver pequenas imprecisões de ponto flutuante (aquele "…0001" no final).
- Aceita **números negativos** tanto no dividendo quanto no divisor. O sinal do resultado segue o sinal do dividendo.
- Cuidado ao passar **zero como divisor** — isso pode gerar um erro de divisão por zero. Sempre valide o divisor antes de usar a função.
- Caso algum dos parâmetros venha de uma Data Extension, lembre-se de garantir que o valor é numérico. Se necessário, combine com validações usando [Empty](../utility-functions/empty.md) ou [IsNull](../utility-functions/isnull.md).
- Um uso clássico é verificar se um número é **par ou ímpar**: se `Mod(numero, 2)` retorna `0`, o número é par.
- A função funciona normalmente em **emails, CloudPages, SMS e Landing Pages** — não tem restrição de contexto.

## Funções relacionadas

- [Add](../math-functions/add.md) — soma dois números
- [Subtract](../math-functions/subtract.md) — subtrai dois números
- [Multiply](../math-functions/multiply.md) — multiplica dois números
- [Divide](../math-functions/divide.md) — divide dois números (retorna o quociente, não o resto)
- [Abs](../math-functions/abs.md) — retorna o valor absoluto de um número (útil se o Mod retornar negativo e você precisar do valor positivo)
- [Floor](../math-functions/floor.md) — arredonda para baixo, útil em combinação com Mod para cálculos de ciclos
- [Ceiling](../math-functions/ceiling.md) — arredonda para cima
- [Round](../math-functions/round.md) — arredonda um número para o número de casas decimais especificado
- [FormatNumber](../string-functions/formatnumber.md) — formata a saída numérica para exibição