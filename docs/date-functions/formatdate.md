---
title: FormatDate
sidebar_label: FormatDate
description: Formata uma string de data em um formato personalizado, com suporte a locales e formatos predefinidos como ISO 8601 e RFC 1123.
---

<!-- generated-by-script -->

# FormatDate

## Descrição

A função `FormatDate` pega uma string de data e formata ela do jeito que você precisar — seja um formato customizado, um padrão como ISO 8601, ou o formato local de um país específico. É uma das funções mais usadas no dia a dia do Marketing Cloud, principalmente pra exibir datas bonitas em e-mails, como "05 de dezembro de 2024" em vez daquele "2024-12-05T00:00:00". Se você não passar nenhum parâmetro além da data, ela vai formatar de acordo com as configurações de locale da sua Business Unit.

## Sintaxe

```ampscript
FormatDate(dateString, dateFormat, timeFormat, localeCode)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| dateString | string | Sim | A string de data que você quer formatar. Aceita vários formatos como ISO 8601 (`2024-08-05T13:41:23-06:00`), data ISO (`2024-08-05`), notação americana (`8/5/2024 1:41 PM`), notação por extenso em inglês (`5 August 2024` ou `August 5, 2024`), data e hora (`2024-08-05 1:41:23 PM`), hora apenas (`1:41 PM`), e notações chinesa/japonesa/coreana. |
| dateFormat | string | Não | Formato a ser aplicado na data. Pode ser um formato customizado (ex: `dd/MM/yyyy`, `ddddd, d MMMM yyyy`) ou um dos valores predefinidos: `S` (formato curto do locale), `L` (formato longo do locale), `ISO` (ISO 8601), `RFC` (RFC 1123). |
| timeFormat | string | Não | Formato a ser aplicado na hora. Ex: `H:mm:ss`, `hh:mm tt`. |
| localeCode | string | Não | Código do locale para formatação, como `pt_BR`, `ja_JP`, `en_US`. Usado em conjunto com `S` ou `L` no parâmetro `dateFormat`. |

### Elementos de formatação customizada

| Elemento | Ano (ex: 2024) | Mês (ex: agosto) | Dia (ex: sábado, 06) | Hora 12h | Hora 24h | Minutos | Segundos | AM/PM | Fuso |
|---|---|---|---|---|---|---|---|---|---|
| 1 caractere | `y` = 24 | `M` = 8 | `d` = 6 | `h` = 8 | `H` = 8 | `m` = 0 | `s` = 5 | `t` = P | `z` = -3 |
| 2 caracteres | `yy` = 24 | `MM` = 08 | `dd` = 06 | `hh` = 08 | `HH` = 20 | `mm` = 00 | `ss` = 05 | `tt` = PM | `zz` = -03 |
| 3 caracteres | `yyy` = 2024 | `MMM` = Aug | `dddd` = Sat | — | — | — | — | — | `zzz` = -03:00 |
| 4 caracteres | `yyyy` = 2024 | `MMMM` = August | `ddddd` = Saturday | — | — | — | — | — | — |

## Exemplo básico

Imagine que você tem uma Data Extension de pedidos da **MegaStore** e quer exibir a data do pedido formatada no e-mail de confirmação:

```ampscript
%%[
VAR @dataPedido, @dataFormatada
SET @dataPedido = "2024-12-05T14:30:00-03:00"
SET @dataFormatada = FormatDate(@dataPedido, "dd/MM/yyyy")
]%%

Olá, João! Seu pedido na MegaStore foi confirmado em %%=v(@dataFormatada)=%%.
```

**Saída:**
```
Olá, João! Seu pedido na MegaStore foi confirmado em 05/12/2024.
```

## Exemplo avançado

Aqui um cenário mais completo: um e-mail de lembrete de vencimento de fatura do **Banco Meridional**, onde precisamos formatar a data de vencimento de forma amigável, incluir o horário limite de pagamento, e também gerar um timestamp ISO pra um link de rastreio:

```ampscript
%%[
VAR @nomeCliente, @dataVencimento, @dataExtenso, @dataHora, @dataISO, @dataCurta

SET @nomeCliente = "Maria Santos"
SET @dataVencimento = "2024-12-15T23:59:59-03:00"

/* Data formatada por extenso (nomes em inglês, padrão da função) */
SET @dataExtenso = FormatDate(@dataVencimento, "dd/MM/yyyy")

/* Data com horário limite */
SET @dataHora = FormatDate(@dataVencimento, "dd/MM/yyyy", "HH:mm")

/* Formato ISO 8601 para usar em URLs e integrações */
SET @dataISO = FormatDate(@dataVencimento, "ISO")

/* Formato curto para locale pt_BR */
SET @dataCurta = FormatDate(@dataVencimento, "S", "", "pt_BR")

/* Formato longo para locale pt_BR */
SET @dataLonga = FormatDate(@dataVencimento, "L", "", "pt_BR")
]%%

Olá, %%=v(@nomeCliente)=%%!

Sua fatura do Banco Meridional vence em %%=v(@dataExtenso)=%%.
Horário limite para pagamento: %%=v(@dataHora)=%%.

Formato curto (pt_BR): %%=v(@dataCurta)=%%
Formato longo (pt_BR): %%=v(@dataLonga)=%%

<a href="https://www.bancomeridional.com.br/fatura?venc=%%=v(@dataISO)=%%">
  Pagar agora
</a>
```

**Saída:**
```
Olá, Maria Santos!

Sua fatura do Banco Meridional vence em 15/12/2024.
Horário limite para pagamento: 15/12/2024 23:59.

Formato curto (pt_BR): 15/12/2024
Formato longo (pt_BR): domingo, 15 de dezembro de 2024

<a href="https://www.bancomeridional.com.br/fatura?venc=2024-12-15T23:59:59-03:00">
  Pagar agora
</a>
```

## Exemplo com dados de Data Extension

Cenário real: e-mail de programa de pontos da **FarmaRede**, buscando a data de expiração dos pontos do cliente:

```ampscript
%%[
VAR @email, @rows, @row, @pontos, @dataExpiracao, @dataFormatada

SET @email = AttributeValue("emailaddr")
SET @rows = LookupRows("Programa_Pontos", "Email", @email)

IF RowCount(@rows) > 0 THEN
  SET @row = Row(@rows, 1)
  SET @pontos = Field(@row, "Pontos")
  SET @dataExpiracao = Field(@row, "DataExpiracao")
  SET @dataFormatada = FormatDate(@dataExpiracao, "dd 'de' MMMM 'de' yyyy")
]%%

Você tem %%=v(@pontos)=%% pontos FarmaRede!
Seus pontos expiram em %%=v(@dataFormatada)=%%.
Aproveite: frete grátis em compras acima de R$ 299,00.

%%[ ELSE ]%%

Cadastre-se no programa de pontos FarmaRede!

%%[ ENDIF ]%%
```

**Saída:**
```
Você tem 2.350 pontos FarmaRede!
Seus pontos expiram em 31 de January de 2025.
Aproveite: frete grátis em compras acima de R$ 299,00.
```

## Observações

- **Formatos de entrada suportados:** a função aceita vários formatos de data como entrada, incluindo ISO 8601 completo (`2024-08-05T13:41:23-06:00`), data ISO (`2024-08-05`), notação americana (`8/5/2024 1:41 PM`), formato por extenso em inglês (`5 August 2024`, `August 5, 2024`), e notações chinesa/japonesa/coreana.
- **Formatos NÃO suportados na entrada:** a função **não aceita** datas com sufixo ordinal (`August 5th, 2024`), formato little-endian numérico (`5/8/2024` significando 5 de agosto), nomes de meses em idiomas diferentes do inglês (`5 août 2024`), numerais não ocidentais, nem calendários diferentes do gregoriano.
- **Cuidado com o formato brasileiro na entrada:** como o formato `DD/MM/AAAA` (little-endian) **não é suportado** como input, evite passar datas nesse formato. Use sempre o formato ISO (`2024-12-25`) ou americano (`12/25/2024`) na entrada. A formatação brasileira deve ser feita apenas na **saída**, usando o parâmetro `dateFormat`.
- **Nomes de meses e dias saem em inglês:** os elementos `MMMM` (nome do mês) e `ddddd` (nome do dia) retornam em inglês (ex: "August", "Saturday"), a menos que você use os formatos `S` ou `L` com um `localeCode` específico. Para exibir nomes em português, considere usar `FormatDate` com locale `pt_BR` e os formatos `S` ou `L`.
- **Parâmetros opcionais:** se você omitir `dateFormat`, `timeFormat` e `localeCode`, a função formata de acordo com as configurações de locale da sua Business Unit no Marketing Cloud.
- **Formato ISO e RFC:** use `"ISO"` para gerar timestamps compatíveis com integrações de API e parâmetros de URL. Use `"RFC"` para o formato RFC 1123, comum em headers HTTP.
- **Se a data vier nula ou vazia** de uma Data Extension, é boa prática usar [Empty](../utility-functions/empty.md) ou [IsNull](../utility-functions/isnull.md) pra validar antes de chamar `FormatDate`, evitando erros no envio.
- A função funciona em todos os contextos do Marketing Cloud: e-mails, CloudPages, SMS, Landing Pages, etc.

## Funções relacionadas

- [Now](../date-functions/now.md) — retorna a data e hora atuais do sistema
- [SystemDate](../date-functions/systemdate.md) — retorna a data/hora do sistema (UTC)
- [SystemDateToLocalDate](../date-functions/systemdatetolocaldate.md) — converte data do sistema para o horário local
- [LocalDateToSystemDate](../date-functions/localdatetosystemdate.md) — converte data local para horário do sistema
- [DateAdd](../date-functions/dateadd.md) — adiciona um intervalo de tempo a uma data
- [DateDiff](../date-functions/datediff.md) — calcula a diferença entre duas datas
- [DatePart](../date-functions/datepart.md) — extrai uma parte específica de uma data (dia, mês, ano, etc)
- [DateParse](../date-functions/dateparse.md) — converte uma string em um valor de data
- [StringToDate](../date-functions/stringtodate.md) — converte string para objeto de data
- [Format](../string-functions/format.md) — formata valores de forma genérica
- [FormatCurrency](../string-functions/formatcurrency.md) — formata valores como moeda
- [Lookup](../data-extension-functions/lookup.md) — busca um valor em uma Data Extension
- [AttributeValue](../utility-functions/attributevalue.md) — retorna o valor de um atributo do subscriber