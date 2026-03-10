---
title: DateDiff
sidebar_label: DateDiff
description: Retorna a diferença entre duas datas ou horários na unidade de tempo especificada.
---

# DateDiff

## Descrição

A função `DateDiff` calcula a diferença entre duas datas ou horários, subtraindo a data inicial da data final. Você define a unidade de retorno: anos, meses, dias, horas ou minutos. É essencial em réguas de relacionamento no SFMC - por exemplo, para saber quantos dias faltam para o vencimento de uma fatura, há quanto tempo um cliente não compra, ou quantas horas restam até o fim de uma promoção.

## Sintaxe

```ampscript
DateDiff(startDate, endDate, unitOfDifference)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| startDate | date | Sim | Data inicial da comparação. |
| endDate | date | Sim | Data final da comparação. A função subtrai a startDate da endDate. |
| unitOfDifference | string | Sim | Unidade da diferença a ser retornada. Valores aceitos: `"Y"` (anos), `"M"` (meses), `"D"` (dias), `"H"` (horas) e `"MI"` (minutos). |

## Exemplo básico

Calculando quantos dias faltam para a data de vencimento de um boleto da Lojas Vitória:

```ampscript
%%[
VAR @dataVencimento, @hoje, @diasRestantes

SET @dataVencimento = "2024-12-20"
SET @hoje = Now()
SET @diasRestantes = DateDiff(@hoje, @dataVencimento, "D")
]%%

Olá, João Silva!
Seu boleto vence em %%=v(@diasRestantes)=%% dias.
```

**Saída:**
```
Olá, João Silva!
Seu boleto vence em 138 dias.
```

## Exemplo avançado

Em uma régua de reengajamento da MegaStore, verificando há quantos dias o cliente não faz uma compra e personalizando a mensagem com base nesse intervalo:

```ampscript
%%[
VAR @ultimaCompra, @diasSemCompra, @mensagem, @amanha, @minutosAteAmanha

SET @ultimaCompra = AttributeValue("UltimaCompra")
SET @diasSemCompra = DateDiff(@ultimaCompra, Now(), "D")

IF @diasSemCompra > 90 THEN
  SET @mensagem = Concat("Faz ", @diasSemCompra, " dias que não nos visitamos! Preparamos um cupom especial de 20% para você voltar.")
ELSEIF @diasSemCompra > 30 THEN
  SET @mensagem = Concat("Já se passaram ", @diasSemCompra, " dias desde sua última compra. Que tal conferir as novidades?")
ELSE
  SET @mensagem = "Bom te ver por aqui! Confira nossas ofertas da semana."
ENDIF

/* Calculando minutos até amanhã usando DateAdd + DateDiff */
SET @amanha = DateAdd(Now(), 1, "D")
SET @minutosAteAmanha = DateDiff(Now(), @amanha, "MI")
]%%

%%=v(@mensagem)=%%

Essa oferta expira em %%=v(@minutosAteAmanha)=%% minutos!
```

**Saída:**
```
Faz 112 dias que não nos visitamos! Preparamos um cupom especial de 20% para você voltar.

Essa oferta expira em 1440 minutos!
```

## Observações

> **💡 Dica:** A função subtrai a `startDate` da `endDate`. Se a data inicial for posterior à data final, o resultado será negativo. Use isso a seu favor para detectar atrasos - por exemplo, se `DateDiff(dataVencimento, Now(), "D")` retornar um valor positivo, o boleto já está vencido.

> **💡 Dica:** Combine `DateDiff` com [DateAdd](../date-functions/dateadd.md) para cenários como o da documentação oficial: adicione um período a uma data e depois calcule a diferença em minutos ou horas. Isso é útil para contagens regressivas em e-mails promocionais.

> **⚠️ Atenção:** Os valores aceitos para `unitOfDifference` são apenas `"Y"`, `"M"`, `"D"`, `"H"` e `"MI"`. Note que minutos usa `"MI"` (não `"M"`, que é meses). Confundir os dois é um erro bastante comum.

## Funções relacionadas

- [Now](../date-functions/now.md) - obtém a data/hora atual para usar como parâmetro
- [DateAdd](../date-functions/dateadd.md) - adiciona ou subtrai intervalos de tempo a uma data
- [DatePart](../date-functions/datepart.md) - extrai uma parte específica de uma data
- [FormatDate](../date-functions/formatdate.md) - formata datas para exibição
- [Format](../string-functions/format.md) - formatação geral de valores para exibição