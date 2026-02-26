---
title: SystemDate
sidebar_label: SystemDate
description: Retorna a data e hora atual do sistema do Salesforce Marketing Cloud em UTC (Central Standard Time).
---

# SystemDate

## Descrição

A função `SystemDate` retorna a data e hora atual do servidor do Salesforce Marketing Cloud. O valor retornado está sempre no fuso horário do sistema, que é **Central Standard Time (CST/CDT)** — ou seja, o horário central dos Estados Unidos, e **não** o horário de Brasília. Essa função não aceita nenhum parâmetro e é útil quando você precisa de uma referência de data/hora consistente e independente de configurações de conta para lógica condicional, registros de auditoria ou cálculos de data.

## Sintaxe

```ampscript
SystemDate
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| — | — | — | Esta função não aceita parâmetros. |

## Exemplo básico

Exibindo a data/hora do sistema no corpo de um e-mail:

```ampscript
%%[
VAR @dataAtual
SET @dataAtual = SystemDate
]%%

Data e hora do sistema: %%=v(@dataAtual)=%%
```

**Saída:**
```
Data e hora do sistema: 6/15/2025 2:30:00 PM
```

> **Nota:** O valor exibido estará no horário central dos EUA (CST/CDT). Para o horário de Brasília, você precisa fazer a conversão.

## Exemplo avançado

### Convertendo para horário de Brasília e personalizando saudação

O horário de Brasília (BRT) está **2 horas à frente** do horário central dos EUA durante o horário de verão americano (CDT, UTC-5), pois BRT é UTC-3. Fora do horário de verão americano (CST, UTC-6), a diferença é de **3 horas**. Neste exemplo, consideramos a diferença mais comum de 2 horas (período de horário de verão americano):

```ampscript
%%[
VAR @dataSistema, @dataBrasilia, @hora, @saudacao, @dataFormatada

SET @dataSistema = SystemDate
SET @dataBrasilia = DateAdd(@dataSistema, 2, "H")
SET @hora = DatePart(@dataBrasilia, "H")

IF @hora >= 6 AND @hora < 12 THEN
  SET @saudacao = "Bom dia"
ELSEIF @hora >= 12 AND @hora < 18 THEN
  SET @saudacao = "Boa tarde"
ELSE
  SET @saudacao = "Boa noite"
ENDIF

SET @dataFormatada = FormatDate(@dataBrasilia, "dd/MM/yyyy", "HH:mm")
]%%

%%=v(@saudacao)=%%, %%=v(@PrimeiroNome)=%%!

Este e-mail foi enviado em %%=v(@dataFormatada)=%% (horário de Brasília).
```

**Saída:**
```
Boa tarde, João!

Este e-mail foi enviado em 15/06/2025 16:30 (horário de Brasília).
```

### Verificando prazo de promoção com SystemDate

```ampscript
%%[
VAR @dataSistema, @dataBrasilia, @fimPromocao, @mensagem

SET @dataSistema = SystemDate
SET @dataBrasilia = DateAdd(@dataSistema, 2, "H")
SET @fimPromocao = DateParse("2025-06-30 23:59:59")

IF @dataBrasilia < @fimPromocao THEN
  VAR @diasRestantes
  SET @diasRestantes = DateDiff(@dataBrasilia, @fimPromocao, "D")
  SET @mensagem = Concat("Corre! Faltam apenas ", @diasRestantes, " dias para acabar a promoção de Dia dos Namorados da MegaStore! Frete grátis acima de R$299 + cashback de R$50.")
ELSE
  SET @mensagem = "A promoção de Dia dos Namorados da MegaStore já encerrou, mas temos ofertas incríveis esperando por você!"
ENDIF
]%%

%%=v(@mensagem)=%%

Confira: www.megastore.com.br/namorados
```

**Saída:**
```
Corre! Faltam apenas 15 dias para acabar a promoção de Dia dos Namorados da MegaStore! Frete grátis acima de R$299 + cashback de R$50.

Confira: www.megastore.com.br/namorados
```

### Registrando data de interação em uma Data Extension

```ampscript
%%[
VAR @dataSistema, @dataBrasilia, @email

SET @dataSistema = SystemDate
SET @dataBrasilia = DateAdd(@dataSistema, 2, "H")
SET @email = AttributeValue("EmailAddress")

UpsertDE("Log_Abertura_Email", 1, "EmailAddress", @email, "EmailAddress", @email, "UltimaAbertura", @dataBrasilia, "Canal", "Email")
]%%
```

## Observações

- **`SystemDate` não aceita parâmetros.** É usada como uma propriedade, sem parênteses — basta referenciar `SystemDate` diretamente.
- **O fuso horário retornado é Central Standard Time (CST/CDT)**, que corresponde a UTC-6 (ou UTC-5 durante o horário de verão americano). Para converter para o horário de Brasília (UTC-3), use [DateAdd](../date-functions/dateadd.md) adicionando 2 ou 3 horas, dependendo da época do ano.
- **Diferença entre `SystemDate` e `Now`:** A função [Now](../date-functions/now.md) retorna a data/hora com base na configuração de fuso horário da sua conta no Marketing Cloud, enquanto `SystemDate` sempre retorna no fuso do servidor (Central Time). Se sua conta está configurada para o horário de Brasília, `Now` já vai retornar no seu fuso — mas `SystemDate` não.
- **`SystemDate` é avaliada no momento do envio** (para e-mails) ou no momento da renderização (para CloudPages). Se o e-mail for aberto depois via conteúdo dinâmico em tempo real, o valor já estará fixo desde o momento do envio.
- **Use `SystemDate` quando precisar de consistência:** Como ela sempre retorna o mesmo fuso independente das configurações da conta, é ideal para lógica que precisa ser previsível entre Business Units com configurações de fuso diferentes.
- **Para formatar a data no padrão brasileiro (DD/MM/AAAA)**, combine com [FormatDate](../date-functions/formatdate.md).

## Funções relacionadas

- [Now](../date-functions/now.md) — retorna a data/hora atual com base no fuso horário configurado na conta
- [GetSendTime](../date-functions/getsendtime.md) — retorna a data/hora em que o e-mail foi enviado
- [FormatDate](../date-functions/formatdate.md) — formata uma data em um padrão específico (ex: DD/MM/AAAA)
- [DateAdd](../date-functions/dateadd.md) — adiciona ou subtrai um intervalo de tempo a uma data
- [DateDiff](../date-functions/datediff.md) — calcula a diferença entre duas datas
- [DatePart](../date-functions/datepart.md) — extrai uma parte específica de uma data (hora, dia, mês, etc.)
- [DateParse](../date-functions/dateparse.md) — converte uma string em um valor de data
- [SystemDateToLocalDate](../date-functions/systemdatetolocaldate.md) — converte a data do sistema para o fuso local da conta
- [LocalDateToSystemDate](../date-functions/localdatetosystemdate.md) — converte a data local para o fuso do sistema