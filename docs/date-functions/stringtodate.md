---
title: StringToDate
sidebar_label: StringToDate
description: Converte uma string de data para um objeto datetime do .NET, permitindo que você manipule e compare datas no AMPscript.
---

<!-- generated-by-script -->

# StringToDate

## Descrição

A função `StringToDate` converte uma string que representa uma data (ou data e hora) em um objeto `datetime` do .NET. Isso é essencial quando você precisa transformar datas que vêm como texto — por exemplo, de uma Data Extension ou de um parâmetro de URL — em um formato que o AMPscript consiga realmente entender como data. Depois da conversão, você pode usar o resultado com funções como [DateAdd](../date-functions/dateadd.md), [DateDiff](../date-functions/datediff.md) e [FormatDate](../date-functions/formatdate.md) para fazer cálculos e formatações.

## Sintaxe

```ampscript
StringToDate(dateString)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|------------|--------|-------------|-----------|
| dateString | String | Sim | A string contendo a data ou timestamp que você quer converter em um objeto datetime do .NET. Precisa estar em um dos formatos suportados (veja as observações abaixo). |

## Retorno

Retorna um objeto `datetime` do .NET correspondente à string de data informada.

## Exemplo básico

Imagine que a **Lojas Vitória** está enviando um e-mail com a data de expiração de um cupom de desconto. A data vem como texto de uma Data Extension:

```ampscript
%%[
SET @dataTexto = "2024-12-25"
SET @dataConvertida = StringToDate(@dataTexto)
]%%

Seu cupom de R$50 de desconto é válido até %%=FormatDate(@dataConvertida, "DD/MM/YYYY")=%%. Aproveite!
```

**Saída:**
```
Seu cupom de R$50 de desconto é válido até 25/12/2024. Aproveite!
```

## Exemplo avançado

A **MegaStore** quer enviar um e-mail de lembrete para clientes cujo cupom de Black Friday está prestes a vencer. O e-mail verifica quantos dias faltam e exibe uma mensagem personalizada:

```ampscript
%%[
SET @nome = "Maria Santos"
SET @dataExpiracao = Lookup("Cupons_BlackFriday", "DataExpiracao", "Email", emailaddr)

/* A data vem como string no formato ISO da DE */
SET @dataExpiracaoObj = StringToDate(@dataExpiracao)
SET @hoje = Now()
SET @diasRestantes = DateDiff(@hoje, @dataExpiracaoObj, "D")

IF @diasRestantes > 0 AND @diasRestantes <= 3 THEN
  SET @mensagem = Concat("Corre, ", @nome, "! Seu cupom de 30% OFF expira em apenas ", @diasRestantes, " dia(s)!")
  SET @urgencia = "⚠️ ÚLTIMOS DIAS!"
ELSEIF @diasRestantes > 3 THEN
  SET @mensagem = Concat("Oi, ", @nome, "! Você ainda tem ", @diasRestantes, " dias para usar seu cupom de 30% OFF.")
  SET @urgencia = ""
ELSE
  SET @mensagem = Concat("Oi, ", @nome, ", infelizmente seu cupom expirou. Mas temos outras ofertas para você!")
  SET @urgencia = ""
ENDIF
]%%

%%=v(@urgencia)=%%

%%=v(@mensagem)=%%

Válido até: %%=FormatDate(@dataExpiracaoObj, "DD/MM/YYYY")=%%

Frete grátis em compras acima de R$299!
Acesse: www.megastore.com.br/blackfriday
```

**Saída (exemplo com 2 dias restantes):**
```
⚠️ ÚLTIMOS DIAS!

Corre, Maria Santos! Seu cupom de 30% OFF expira em apenas 2 dia(s)!

Válido até: 28/11/2024

Frete grátis em compras acima de R$299!
Acesse: www.megastore.com.br/blackfriday
```

## Formatos suportados

A função aceita datas em diversos formatos, incluindo:

| Formato | Exemplo |
|---------|---------|
| ISO 8601 com timestamp | `2024-08-05T13:41:23-06:00` |
| ISO 8601 apenas data | `2024-08-05` |
| Notação americana (data e hora) | `8/5/2024 1:41 PM` |
| Formato longo em inglês | `5 August 2024` ou `August 5, 2024` |
| Data e hora combinados | `2024-08-05 1:41:23 PM` |
| Apenas hora | `1:41 PM` |
| Notação chinesa/japonesa | `2024年8月5日` |
| Notação coreana | `2024년 8월 5일` |

## Observações

- **Formato brasileiro (DD/MM/AAAA) NÃO é suportado diretamente.** A notação little-endian numérica como `05/08/2024` para representar 5 de agosto de 2024 **não funciona** — o sistema vai interpretar como 8 de maio (formato americano MM/DD). Isso é muito importante para nós brasileiros! Use sempre o formato ISO (`2024-08-05`) para evitar confusão.
- **Nomes de meses em português não são suportados.** Strings como `5 agosto 2024` ou `5 de dezembro de 2024` **não funcionam**. Os nomes de meses precisam estar em inglês (ex: `5 August 2024`).
- **Sufixos ordinais não são suportados.** Datas como `August 5th, 2024` ou `5th August 2024` vão gerar erro.
- **Numerais não-arábicos ocidentais não são suportados**, assim como calendários que não sejam o gregoriano.
- Se a string de data estiver vazia ou em um formato inválido, a função pode gerar um erro. Considere usar [Empty](../utility-functions/empty.md) para verificar o valor antes de converter.
- **Dica para dados brasileiros:** se você armazena datas no formato `DD/MM/AAAA` na sua Data Extension, uma boa prática é armazenar no formato ISO (`AAAA-MM-DD`) ou usar [Substring](../string-functions/substring.md) e [Concat](../string-functions/concat.md) para reorganizar a string antes de converter.

## Funções relacionadas

- [FormatDate](../date-functions/formatdate.md) — formata um objeto datetime para exibição em diferentes formatos
- [DateAdd](../date-functions/dateadd.md) — adiciona ou subtrai intervalos de tempo de uma data
- [DateDiff](../date-functions/datediff.md) — calcula a diferença entre duas datas
- [DatePart](../date-functions/datepart.md) — extrai uma parte específica de uma data (dia, mês, ano, etc.)
- [DateParse](../date-functions/dateparse.md) — outra função para interpretar strings de data
- [Now](../date-functions/now.md) — retorna a data e hora atuais do sistema
- [SystemDateToLocalDate](../date-functions/systemdatetolocaldate.md) — converte a data do sistema para o fuso horário local
- [Format](../string-functions/format.md) — formata valores diversos, incluindo datas, como string