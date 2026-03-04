---
title: DateAdd
sidebar_label: DateAdd
description: Adiciona um valor de tempo (anos, meses, dias, horas ou minutos) a uma data, retornando a nova data calculada.
---

# DateAdd

## Descrição

A função `DateAdd` adiciona um valor de tempo especificado a uma data. É uma das funções mais usadas no dia a dia de SFMC no Brasil — seja para calcular datas de vencimento de boletos, definir prazos de validade de cupons em réguas de relacionamento, ou determinar janelas de expiração em campanhas de e-mail marketing. Retorna a data resultante após a adição do tempo informado.

## Sintaxe

```ampscript
DateAdd(@date, amountToAdd, "unitToAdd")
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| date | date | Sim | A data à qual o valor de tempo será adicionado. |
| amountToAdd | number | Sim | O valor de tempo a ser adicionado à data. |
| unitToAdd | string | Sim | A unidade do valor de tempo. Valores aceitos: `Y` (anos), `M` (meses), `D` (dias), `H` (horas) e `MI` (minutos). |

## Exemplo básico

Adicionando 1 dia à data atual para calcular o prazo de entrega de um pedido da MegaStore (assumindo que a data/hora atual é `2023-08-05T13:41:23Z`):

```ampscript
%%[
SET @agora = NOW()
SET @prazoEntrega = DateAdd(@agora, 1, "D")
]%%

Olá, João Silva!

Seu pedido foi confirmado em %%=FormatDate(@agora, "DD/MM/YYYY", "HH:mm")=%%
Previsão de entrega: %%=FormatDate(@prazoEntrega, "DD/MM/YYYY", "HH:mm")=%%
```

**Saída:**
```
Olá, João Silva!

Seu pedido foi confirmado em 05/08/2023, 13:41
Previsão de entrega: 06/08/2023, 13:41
```

## Exemplo avançado

Cenário real de régua de relacionamento: a Lojas Vitória envia um e-mail com cupom de desconto que expira em 7 dias, e aproveita para lembrar a data de renovação anual do programa de fidelidade do cliente.

```ampscript
%%[
SET @nomeCliente = "Maria Santos"
SET @dataCompra = NOW()
SET @validadeCupom = DateAdd(@dataCompra, 7, "D")
SET @renovacaoFidelidade = DateAdd(@dataCompra, 1, "Y")
SET @lembreteContato = DateAdd(@dataCompra, 3, "D")
SET @ofertaRelampago = DateAdd(@dataCompra, 2, "H")

SET @cupomFormatado = FormatDate(@validadeCupom, "DD/MM/YYYY")
SET @renovacaoFormatada = FormatDate(@renovacaoFidelidade, "DD/MM/YYYY")
SET @lembreteFormatado = FormatDate(@lembreteContato, "DD/MM/YYYY", "HH:mm")
SET @relampagoFormatado = FormatDate(@ofertaRelampago, "DD/MM/YYYY", "HH:mm")
]%%

Olá, %%=v(@nomeCliente)=%%!

🎉 Você ganhou um cupom de R$ 50,00 de desconto!
Use o código VITORIA50 até %%=v(@cupomFormatado)=%%.

⚡ Oferta relâmpago! Frete grátis para São Paulo válido até %%=v(@relampagoFormatado)=%%.

📋 Informações do seu programa de fidelidade:
- Próxima renovação: %%=v(@renovacaoFormatada)=%%
- Entraremos em contato em: %%=v(@lembreteFormatado)=%%
```

**Saída:**
```
Olá, Maria Santos!

🎉 Você ganhou um cupom de R$ 50,00 de desconto!
Use o código VITORIA50 até 12/08/2023.

⚡ Oferta relâmpago! Frete grátis para São Paulo válido até 05/08/2023, 15:41.

📋 Informações do seu programa de fidelidade:
- Próxima renovação: 05/08/2024
- Entraremos em contato em: 08/08/2023, 13:41
```

## Observações

> **💡 Dica:** Você pode usar valores negativos no parâmetro `amountToAdd` para subtrair tempo de uma data. Por exemplo, `DateAdd(@data, -30, "D")` retorna a data de 30 dias atrás — útil para buscar clientes que não compram há um mês.

> **💡 Dica:** Combine `DateAdd` com [FormatDate](../date-functions/formatdate.md) para exibir a data resultante no formato brasileiro (DD/MM/AAAA). O `DateAdd` retorna um timestamp completo, então a formatação é quase sempre necessária na saída final.

> **⚠️ Atenção:** A função `DateAdd` trabalha com a data/hora que você passar. Se estiver usando [Now](../date-functions/now.md), lembre-se de que ela retorna o horário do servidor (UTC/CST). Para trabalhar com horário de Brasília, considere usar [SystemDateToLocalDate](../date-functions/systemdatetolocaldate.md) antes de aplicar o `DateAdd`, ou ajuste manualmente com a unidade `H`.

## Funções relacionadas

- [Now](../date-functions/now.md) — retorna a data/hora atual do sistema, frequentemente usada como primeiro parâmetro do `DateAdd`.
- [DateDiff](../date-functions/datediff.md) — calcula a diferença entre duas datas (operação inversa ao `DateAdd`).
- [FormatDate](../date-functions/formatdate.md) — formata a data retornada pelo `DateAdd` para exibição no formato brasileiro.
- [DateParse](../date-functions/dateparse.md) — converte uma string em data, útil quando você precisa transformar um texto antes de usar no `DateAdd`.
- [SystemDateToLocalDate](../date-functions/systemdatetolocaldate.md) — converte a data do sistema para o fuso horário local antes de fazer cálculos.
- [LocalDateToSystemDate](../date-functions/localdatetosystemdate.md) — converte uma data local para o horário do sistema.
- [DatePart](../date-functions/datepart.md) — extrai partes específicas de uma data (dia, mês, ano).