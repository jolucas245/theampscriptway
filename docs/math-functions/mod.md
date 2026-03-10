---
title: Mod
sidebar_label: Mod
description: Retorna o resto da divisão entre dois números.
---

# Mod

## Descrição

A função `Mod()` retorna o resto (módulo) da divisão do primeiro parâmetro pelo segundo. É muito útil no dia a dia de SFMC quando você precisa criar alternâncias em templates de e-mail (como alternar cores de linhas em tabelas), distribuir registros em grupos ou identificar números pares e ímpares para personalizar layouts. A função aceita números inteiros, decimais, positivos e negativos.

## Sintaxe

```ampscript
Mod(dividend, divisor)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| dividend | Número | Sim | O número inicial (dividendo) |
| divisor | Número | Sim | O número pelo qual o dividendo será dividido (divisor) |

## Exemplo básico

Calculando o resto da divisão para verificar se o número de parcelas pagas de um cliente é par ou ímpar:

```ampscript
%%[
VAR @parcelasPagas, @resto
SET @parcelasPagas = 500
SET @resto = Mod(@parcelasPagas, 12)
]%%

Parcelas pagas: %%=v(@parcelasPagas)=%%
Resto da divisão por 12: %%=v(@resto)=%%
```

**Saída:**
```
Parcelas pagas: 500
Resto da divisão por 12: 8
```

## Exemplo avançado

Alternando a cor de fundo das linhas de uma tabela de pedidos para um e-mail transacional da MegaStore, e demonstrando o comportamento com números decimais e negativos:

```ampscript
%%[
VAR @totalItens, @corFundo, @i
SET @totalItens = 5

/* Exemplo com decimais e negativos */
VAR @restoDecimal, @restoNegativo
SET @restoDecimal = Mod(10.5, 3.2)
SET @restoNegativo = Mod(-25.5, 7.88)
]%%

<table style="width:100%; border-collapse:collapse;">
  <tr style="background-color:#333; color:#fff;">
    <th style="padding:8px;">Item</th>
    <th style="padding:8px;">Descrição</th>
  </tr>
%%[
FOR @i = 1 TO @totalItens DO
  IF Mod(@i, 2) == 0 THEN
    SET @corFundo = "#f2f2f2"
  ELSE
    SET @corFundo = "#ffffff"
  ENDIF
]%%
  <tr style="background-color:%%=v(@corFundo)=%%;">
    <td style="padding:8px;">%%=v(@i)=%%</td>
    <td style="padding:8px;">Produto %%=v(@i)=%% - MegaStore</td>
  </tr>
%%[
NEXT @i
]%%
</table>

<p>Resto com decimais (10.5 / 3.2): %%=v(@restoDecimal)=%%</p>
<p>Resto com negativos (-25.5 / 7.88): %%=v(@restoNegativo)=%%</p>
```

**Saída:**
```
(tabela com 5 linhas alternando fundo branco e cinza claro)

Resto com decimais (10.5 / 3.2): 0.9
Resto com negativos (-25.5 / 7.88): -1.88300000000001
```

## Observações

> **💡 Dica:** O uso mais comum de `Mod()` no dia a dia de SFMC é verificar par/ímpar com `Mod(valor, 2)`. Se o resultado for 0, o número é par - perfeito para alternar estilos em tabelas de e-mail, distribuir clientes em grupos de teste A/B ou rotacionar banners.

> **⚠️ Atenção:** Ao trabalhar com números decimais e negativos, o resultado pode apresentar imprecisão de ponto flutuante (como `-1.88300000000001` em vez de `-1.883`). Se você precisa exibir o resultado para o cliente, considere usar [FormatNumber](../string-functions/formatnumber.md) para arredondar as casas decimais.

## Funções relacionadas

- [Add](../math-functions/add.md) - soma dois números
- [Subtract](../math-functions/subtract.md) - subtrai dois números
- [Multiply](../math-functions/multiply.md) - multiplica dois números
- [Divide](../math-functions/divide.md) - divide dois números