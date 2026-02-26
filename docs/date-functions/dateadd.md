---
title: DateAdd
sidebar_label: DateAdd
description: Adiciona um valor de tempo especificado a uma data, retornando uma nova data com o acréscimo de anos, meses, dias, horas ou minutos.
---

<!-- generated-by-script -->

# DateAdd

## Descrição

A função `DateAdd` adiciona um valor de tempo a uma data existente e retorna a nova data resultante. Você pode somar anos, meses, dias, horas ou minutos a qualquer data. É super útil pra calcular datas de expiração de cupons, prazos de entrega, validade de promoções, períodos de carência e qualquer cenário onde você precisa projetar uma data futura (ou passada, usando valores negativos) a partir de uma data de referência.

## Sintaxe

```ampscript
DateAdd(date, amountToAdd, unitToAdd)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| date | Date | Sim | A data base à qual o valor de tempo será adicionado. |
| amountToAdd | Number | Sim | O valor numérico a ser adicionado à data. Pode ser negativo para subtrair tempo. |
| unitToAdd | String | Sim | A unidade do tempo a ser adicionado. Valores aceitos: `"Y"` (anos), `"M"` (meses), `"D"` (dias), `"H"` (horas) e `"MI"` (minutos). |

## Exemplo básico

Neste exemplo, adicionamos 1 dia à data/hora atual para mostrar quando uma oferta relâmpago expira. Vamos supor que a data atual seja `05/08/2023 10:41:23`.

```ampscript
%%[
SET @agora = Now()
SET @expiracao = DateAdd(@agora, 1, "D")
]%%

Corra! Esta oferta expira em %%=FormatDate(@expiracao, "DD/MM/YYYY", "", "")=%%.
```

**Saída:**
```
Corra! Esta oferta expira em 06/08/2023.
```

## Exemplo avançado

Cenário real: a **MegaStore** envia um e-mail de boas-vindas com um cupom de desconto que vale por 7 dias. Além disso, informa ao cliente quando seus pontos de fidelidade expiram (em 12 meses). A data de cadastro vem de uma Data Extension.

```ampscript
%%[
SET @nome = AttributeValue("PrimeiroNome")
SET @dataCadastro = AttributeValue("DataCadastro")

/* Cupom válido por 7 dias a partir do cadastro */
SET @validadeCupom = DateAdd(@dataCadastro, 7, "D")

/* Pontos expiram em 12 meses */
SET @expiracaoPontos = DateAdd(@dataCadastro, 12, "M")

/* Lembrete 48h antes da expiração do cupom */
SET @lembreteCupom = DateAdd(@validadeCupom, -48, "H")

/* Formata as datas no padrão brasileiro */
SET @validadeCupomFormatada = FormatDate(@validadeCupom, "DD/MM/YYYY", "", "")
SET @expiracaoPontosFormatada = FormatDate(@expiracaoPontos, "DD/MM/YYYY", "", "")
]%%

Olá, %%=v(@nome)=%%! Bem-vindo(a) à MegaStore! 🎉

Preparamos um presente especial pra você:

🎁 Use o cupom BEMVINDO15 e ganhe 15% de desconto
   em compras acima de R$ 149,90!
   Válido até: %%=v(@validadeCupomFormatada)=%%

⭐ Você já ganhou 500 pontos de boas-vindas no
   programa MegaPontos!
   Seus pontos expiram em: %%=v(@expiracaoPontosFormatada)=%%

Aproveite! Acesse: www.megastore.com.br
```

**Saída (supondo cadastro em 05/08/2023 e nome "Maria Santos"):**
```
Olá, Maria Santos! Bem-vindo(a) à MegaStore! 🎉

Preparamos um presente especial pra você:

🎁 Use o cupom BEMVINDO15 e ganhe 15% de desconto
   em compras acima de R$ 149,90!
   Válido até: 12/08/2023

⭐ Você já ganhou 500 pontos de boas-vindas no
   programa MegaPontos!
   Seus pontos expiram em: 05/08/2024

Aproveite! Acesse: www.megastore.com.br
```

## Observações

- O parâmetro `unitToAdd` aceita **apenas** os seguintes valores: `"Y"` (anos), `"M"` (meses), `"D"` (dias), `"H"` (horas) e `"MI"` (minutos). Qualquer outro valor vai gerar erro.
- Você pode usar **valores negativos** em `amountToAdd` para subtrair tempo de uma data. Por exemplo, `DateAdd(@data, -3, "D")` retorna a data de 3 dias atrás.
- O valor retornado é um **timestamp completo** (data e hora). Se você precisa exibir só a data ou só a hora, use a função [FormatDate](../date-functions/formatdate.md) para formatar a saída.
- Lembre-se que as datas no Marketing Cloud são armazenadas em **UTC (horário central do servidor)**. Se você precisa trabalhar com horário de Brasília, considere usar [SystemDateToLocalDate](../date-functions/systemdatetolocaldate.md) ou [LocalDateToSystemDate](../date-functions/localdatetosystemdate.md) para converter antes ou depois de aplicar o `DateAdd`.
- Se a data passada for nula ou inválida, a função pode gerar um erro em tempo de execução. É uma boa prática validar a data antes usando [Empty](../utility-functions/empty.md) ou [IsNull](../utility-functions/isnull.md).
- A função funciona normalmente em todos os contextos do SFMC: e-mails, CloudPages, SMS e Landing Pages.

## Funções relacionadas

- [Now](../date-functions/now.md) — retorna a data e hora atuais do sistema (UTC).
- [SystemDate](../date-functions/systemdate.md) — retorna a data do sistema no momento do envio.
- [DateDiff](../date-functions/datediff.md) — calcula a diferença entre duas datas.
- [DatePart](../date-functions/datepart.md) — extrai uma parte específica de uma data (dia, mês, ano, etc).
- [FormatDate](../date-functions/formatdate.md) — formata uma data para exibição em diferentes padrões.
- [DateParse](../date-functions/dateparse.md) — converte uma string em um valor de data.
- [SystemDateToLocalDate](../date-functions/systemdatetolocaldate.md) — converte data UTC para fuso horário local.
- [GetSendTime](../date-functions/getsendtime.md) — retorna a data e hora do envio do e-mail.