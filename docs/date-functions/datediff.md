---
title: DateDiff
sidebar_label: DateDiff
description: Retorna a diferença entre duas datas ou horários na unidade de tempo especificada (anos, meses, dias, horas ou minutos).
---

# DateDiff

## Descrição

A função `DateDiff` calcula a diferença entre duas datas (ou datas com horário), retornando o resultado na unidade de tempo que você escolher. Ela subtrai a data inicial (`startDate`) da data final (`endDate`). É super útil para cenários como calcular quantos dias faltam para uma promoção expirar, verificar há quanto tempo um cliente não compra, ou determinar a validade de um cupom. O retorno é um valor numérico inteiro representando a diferença na unidade solicitada.

## Sintaxe

```ampscript
DateDiff(@startDate, @endDate, "unitOfDifference")
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| startDate | Date | Sim | A data inicial para a comparação. |
| endDate | Date | Sim | A data final para a comparação. A função subtrai a `startDate` da `endDate`. |
| unitOfDifference | String | Sim | A unidade de tempo em que a diferença será retornada. Valores aceitos: `"Y"` (anos), `"M"` (meses), `"D"` (dias), `"H"` (horas) e `"MI"` (minutos). |

## Exemplo básico

Neste exemplo, calculamos quantos minutos faltam para uma data que é 1 dia à frente da data atual. Vamos supor que o timestamp atual é `2024-08-04T13:41:23Z`.

```ampscript
%%[
VAR @now, @later, @diff

SET @now = Now()
SET @later = DateAdd(@now, 1, "D")
SET @diff = DateDiff(@now, @later, "MI")
]%%

Faltam %%=v(@diff)=%% minutos até %%=v(@later)=%%.
```

**Saída:**
```
Faltam 1440 minutos até 8/5/2024 1:41:23 PM.
```

## Exemplo avançado

Imagine que a **MegaStore** quer enviar um e-mail personalizado avisando os clientes sobre a expiração do cupom de Black Friday. A Data Extension `Cupons_BlackFriday` tem os campos `NomeCliente`, `EmailCliente`, `DataExpiracao` e `ValorDesconto`. O e-mail mostra quantos dias faltam para o cupom vencer e adapta a mensagem de urgência.

```ampscript
%%[
VAR @nomeCliente, @dataExpiracao, @valorDesconto, @diasRestantes, @horasRestantes, @mensagem

SET @nomeCliente = AttributeValue("NomeCliente")
SET @dataExpiracao = AttributeValue("DataExpiracao")
SET @valorDesconto = AttributeValue("ValorDesconto")

SET @diasRestantes = DateDiff(Now(), @dataExpiracao, "D")
SET @horasRestantes = DateDiff(Now(), @dataExpiracao, "H")

IF @diasRestantes <= 0 THEN
  SET @mensagem = "Poxa, seu cupom já expirou! Mas fique de olho nas próximas promoções da MegaStore."
ELSEIF @diasRestantes == 1 THEN
  SET @mensagem = Concat("Corre! Faltam apenas ", @horasRestantes, " horas para seu cupom de R$ ", FormatNumber(@valorDesconto, "N2"), " expirar!")
ELSEIF @diasRestantes <= 3 THEN
  SET @mensagem = Concat("Atenção! Seu cupom de R$ ", FormatNumber(@valorDesconto, "N2"), " expira em ", @diasRestantes, " dias. Não perca!")
ELSE
  SET @mensagem = Concat("Você ainda tem ", @diasRestantes, " dias para usar seu cupom de R$ ", FormatNumber(@valorDesconto, "N2"), " de desconto. Aproveite!")
ENDIF
]%%

Olá, %%=v(@nomeCliente)=%%! 🛒

%%=v(@mensagem)=%%

Acesse agora: www.megastore.com.br/blackfriday

Frete grátis acima de R$ 299,00!
```

**Saída (supondo que hoje é 22/11/2024, o cupom expira em 25/11/2024 e o desconto é 50):**
```
Olá, Maria Santos! 🛒

Atenção! Seu cupom de R$ 50,00 expira em 3 dias. Não perca!

Acesse agora: www.megastore.com.br/blackfriday

Frete grátis acima de R$ 299,00!
```

### Exemplo: Verificando inatividade de clientes

A **Conecta Telecom** quer identificar clientes inativos e personalizar a mensagem com base em quantos meses se passaram desde a última interação.

```ampscript
%%[
VAR @nomeCliente, @ultimaCompra, @mesesInativo, @anosInativo

SET @nomeCliente = AttributeValue("NomeCliente")
SET @ultimaCompra = AttributeValue("DataUltimaCompra")

SET @mesesInativo = DateDiff(@ultimaCompra, Now(), "M")
SET @anosInativo = DateDiff(@ultimaCompra, Now(), "Y")

IF @anosInativo >= 1 THEN
]%%

%%=v(@nomeCliente)=%%, faz mais de %%=v(@anosInativo)=%% ano(s) que você não aparece! A Conecta Telecom tem planos novos a partir de R$ 49,90/mês. Volta pra gente! 💙

%%[ ELSEIF @mesesInativo >= 3 THEN ]%%

%%=v(@nomeCliente)=%%, sentimos sua falta! Já se passaram %%=v(@mesesInativo)=%% meses desde sua última compra. Que tal conferir nossas novidades? 📱

%%[ ELSE ]%%

%%=v(@nomeCliente)=%%, bom te ver por aqui! Continue aproveitando os melhores planos da Conecta Telecom. 🚀

%%[ ENDIF ]%%
```

**Saída (supondo cliente inativo há 5 meses):**
```
João Silva, sentimos sua falta! Já se passaram 5 meses desde sua última compra. Que tal conferir nossas novidades? 📱
```

## Observações

- A função **subtrai a `startDate` da `endDate`**. Se a `startDate` for posterior à `endDate`, o resultado será um número negativo. Você pode usar isso a seu favor para checar se uma data já passou.
- Os valores aceitos para `unitOfDifference` são: `"Y"` (anos), `"M"` (meses), `"D"` (dias), `"H"` (horas) e `"MI"` (minutos). Atenção: minutos é `"MI"`, não `"M"` (que é meses).
- Lembre-se que a função [Now](../date-functions/now.md) retorna o horário no fuso UTC do servidor do Salesforce Marketing Cloud. Se você precisa trabalhar com horário de Brasília, use [SystemDateToLocalDate](../date-functions/systemdatetolocaldate.md) para converter antes de calcular a diferença.
- Certifique-se de que os valores passados como `startDate` e `endDate` sejam datas válidas. Se o campo vier como texto, use [DateParse](../date-functions/dateparse.md) ou [StringToDate](../date-functions/stringtodate.md) para converter antes de usar `DateDiff`.
- O resultado retornado é um número inteiro. Para diferenças que não são exatas (por exemplo, 1 dia e meio), o valor pode ser truncado dependendo da unidade escolhida. Teste sempre o comportamento com seus dados reais.
- Se algum dos parâmetros de data for nulo, a função pode gerar um erro. Considere usar [Empty](../utility-functions/empty.md) ou [IsNull](../utility-functions/isnull.md) para validar antes de chamar `DateDiff`.

## Funções relacionadas

- [Now](../date-functions/now.md) — Retorna a data e hora atuais do sistema (UTC).
- [DateAdd](../date-functions/dateadd.md) — Adiciona ou subtrai um intervalo de tempo a uma data.
- [DatePart](../date-functions/datepart.md) — Extrai uma parte específica de uma data (dia, mês, ano, etc.).
- [FormatDate](../date-functions/formatdate.md) — Formata uma data para exibição em um formato específico.
- [DateParse](../date-functions/dateparse.md) — Converte uma string em um valor de data.
- [StringToDate](../date-functions/stringtodate.md) — Converte uma string formatada em um objeto de data.
- [SystemDateToLocalDate](../date-functions/systemdatetolocaldate.md) — Converte a data do sistema (UTC) para o fuso horário local da conta.
- [IIF](../utility-functions/iif.md) — Retorna um valor com base em uma condição verdadeira ou falsa (útil para lógica inline com DateDiff).