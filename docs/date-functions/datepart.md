---
title: DatePart
sidebar_label: DatePart
description: Extrai uma parte específica (dia, mês, ano, hora ou minuto) de uma string de data ou timestamp.
---

<!-- generated-by-script -->

# DatePart

## Descrição

A função `DatePart` extrai uma parte específica de uma string de data ou timestamp — como o ano, mês, dia, hora ou minuto. É super útil quando você precisa isolar um pedaço de uma data para criar lógicas condicionais no seu e-mail, como exibir uma mensagem diferente dependendo do mês de aniversário do assinante ou personalizar conteúdo com base no ano de cadastro. A função retorna um valor numérico correspondente à parte extraída.

## Sintaxe

```ampscript
DatePart(dateString, datePart)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|------------|--------|-------------|-----------|
| dateString | string | Sim | Uma string contendo uma data ou timestamp. Aceita diversos formatos como ISO 8601 (`2023-08-05T13:41:23-06:00`), data ISO (`2023-08-05`), notação americana de data e hora (`8/5/2023 1:41 PM`), formato longo (`5 August 2023` ou `August 5, 2023`), data e hora (`2023-08-05 1:41:23 PM`), hora apenas (`1:41 PM`), além de notações chinesa/japonesa e coreana. |
| datePart | string | Sim | A parte da data que você quer extrair. Valores aceitos: `Y` (ano), `M` (mês), `D` (dia), `H` (hora) e `MI` (minuto). |

## Exemplo básico

```ampscript
%%[
SET @dataCompra = "2024-12-25T14:30:00"
SET @ano = DatePart(@dataCompra, "Y")
SET @mes = DatePart(@dataCompra, "M")
SET @dia = DatePart(@dataCompra, "D")
]%%

Sua última compra foi no dia %%=v(@dia)=%% do mês %%=v(@mes)=%% de %%=v(@ano)=%%.
```

**Saída:**
```
Sua última compra foi no dia 25 do mês 12 de 2024.
```

## Exemplo avançado

Imagine que a **MegaStore** quer enviar um e-mail de aniversário personalizado para seus clientes. A Data Extension `Clientes_MegaStore` tem um campo `DataNascimento`. Dependendo do mês de aniversário, a loja oferece um cupom temático:

```ampscript
%%[
SET @dataNascimento = AttributeValue("DataNascimento")
SET @mesAniversario = DatePart(@dataNascimento, "M")
SET @diaAniversario = DatePart(@dataNascimento, "D")
SET @anoAtual = DatePart(Now(), "Y")
SET @mesAtual = DatePart(Now(), "M")

/* Verifica se o aniversário é neste mês */
IF @mesAniversario == @mesAtual THEN

  /* Define o cupom e a mensagem com base no mês */
  IF @mesAniversario == 5 THEN
    SET @cupom = "MAES30"
    SET @desconto = "30%"
    SET @mensagemExtra = "Além do seu presente de aniversário, aproveite o mês das mães!"
  ELSEIF @mesAniversario == 6 THEN
    SET @cupom = "NAMO25"
    SET @desconto = "25%"
    SET @mensagemExtra = "Mês dos namorados com desconto especial pra você!"
  ELSEIF @mesAniversario == 12 THEN
    SET @cupom = "NATAL40"
    SET @desconto = "40%"
    SET @mensagemExtra = "Natal + aniversário = desconto em dobro!"
  ELSE
    SET @cupom = Concat("ANIVER", @mesAniversario)
    SET @desconto = "20%"
    SET @mensagemExtra = "Um presente especial para o seu mês!"
  ENDIF

  /* Calcula a hora do envio para saudação */
  SET @horaEnvio = DatePart(Now(), "H")

  IF @horaEnvio < 12 THEN
    SET @saudacao = "Bom dia"
  ELSEIF @horaEnvio < 18 THEN
    SET @saudacao = "Boa tarde"
  ELSE
    SET @saudacao = "Boa noite"
  ENDIF

]%%

%%=v(@saudacao)=%%, %%=v(@nomeCliente)=%%! 🎂

Dia %%=v(@diaAniversario)=%% é o seu aniversário e a MegaStore preparou um presente pra você:

**%%=v(@desconto)=%% de desconto** em todo o site com o cupom **%%=v(@cupom)=%%**!

%%=v(@mensagemExtra)=%%

Válido para compras acima de R$149,00 com frete grátis acima de R$299,00.

Acesse: www.megastore.com.br

%%[
ELSE
]%%

/* Não é o mês de aniversário — não renderiza nada ou exibe conteúdo padrão */

%%[
ENDIF
]%%
```

**Saída (para um cliente que faz aniversário em dezembro, com envio às 10h da manhã):**
```
Bom dia, João Silva! 🎂

Dia 15 é o seu aniversário e a MegaStore preparou um presente pra você:

**40% de desconto** em todo o site com o cupom **NATAL40**!

Natal + aniversário = desconto em dobro!

Válido para compras acima de R$149,00 com frete grátis acima de R$299,00.

Acesse: www.megastore.com.br
```

## Observações

- **Formatos de data suportados:** A função aceita ISO 8601 (`2023-08-05T13:41:23-06:00`), data ISO (`2023-08-05`), notação americana (`8/5/2023 1:41 PM`), formato longo em inglês (`5 August 2023` ou `August 5, 2023`), data e hora (`2023-08-05 1:41:23 PM`), hora apenas (`1:41 PM`) e notações chinesa/japonesa/coreana.
- **Formato brasileiro (DD/MM/AAAA) NÃO é suportado:** A função interpreta datas numéricas no formato americano (MM/DD/AAAA). Se você passar `05/08/2023`, a função vai entender como **5 de agosto** e não como **8 de maio**. Para evitar ambiguidade, use sempre o formato ISO (`2023-08-05`).
- **Sufixos ordinais não são suportados:** Datas como `August 5th, 2023` ou `5th August 2023` não funcionam.
- **Nomes de meses devem estar em inglês:** A função não reconhece `5 agosto 2023` ou `5 août 2023`. Use `5 August 2023` ou, melhor ainda, o formato ISO.
- **Calendários não-gregorianos não são suportados:** Datas hebraicas, islâmicas e outros sistemas de calendário não são aceitos.
- **Numerais não-ocidentais não são suportados:** Apenas numerais arábicos ocidentais (0-9) são reconhecidos.
- **Ao extrair hora ou minuto**, certifique-se de que a string de data inclui informação de horário. Se passar apenas uma data como `2023-08-05`, os valores de `H` e `MI` retornarão `0`.
- **O valor de `datePart` não diferencia maiúsculas/minúsculas:** Tanto `"Y"` quanto `"y"` funcionam, assim como `"MI"` ou `"mi"`.
- **Dica prática:** Se você tem datas armazenadas no formato brasileiro na sua Data Extension, considere usar [DateParse](../date-functions/dateparse.md) ou [StringToDate](../date-functions/stringtodate.md) para converter a string antes de usar `DatePart`.

## Funções relacionadas

- [Now](../date-functions/now.md) — Retorna a data e hora atuais do sistema (útil para pegar a data atual e extrair partes dela)
- [SystemDate](../date-functions/systemdate.md) — Retorna a data do sistema no momento do envio
- [FormatDate](../date-functions/formatdate.md) — Formata uma data em um formato de exibição específico
- [DateAdd](../date-functions/dateadd.md) — Adiciona um intervalo de tempo a uma data
- [DateDiff](../date-functions/datediff.md) — Calcula a diferença entre duas datas
- [DateParse](../date-functions/dateparse.md) — Converte uma string de data em um objeto de data reconhecido pelo sistema
- [StringToDate](../date-functions/stringtodate.md) — Converte uma string em um valor de data
- [Format](../string-functions/format.md) — Formata valores (incluindo datas) como strings personalizadas
- [Concat](../string-functions/concat.md) — Concatena strings (útil para montar datas ou mensagens dinâmicas)
- [IIF](../utility-functions/iif.md) — Avaliação condicional inline (útil para lógicas simples baseadas em partes de data)