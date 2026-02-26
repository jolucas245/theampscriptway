---
title: DateParse
sidebar_label: DateParse
description: Converte uma string de data em um objeto DateTime, permitindo interpretar diversos formatos de data como timestamps ISO 8601, datas no formato americano e notações por extenso.
---

<!-- generated-by-script -->

# DateParse

## Descrição

A função `DateParse` recebe uma string contendo uma data (ou data e hora) e converte em um objeto `DateTime` que o AMPscript consegue manipular. É super útil quando você recebe datas como texto de Data Extensions, APIs externas ou parâmetros de URL e precisa trabalhar com elas — fazer cálculos, comparações ou formatá-las. Você também pode escolher se o resultado deve vir em UTC ou no fuso horário local da sua Business Unit.

## Sintaxe

```ampscript
DateParse(dateString [, boolUseUtc])
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| dateString | String | Sim | Uma string contendo uma data ou timestamp. Aceita vários formatos como ISO 8601, notação americana (M/D/AAAA), notação por extenso em inglês, entre outros. |
| boolUseUtc | Boolean | Não | Se `true`, retorna a data/hora em UTC. Se `false` (ou omitido), usa o fuso horário local definido na sua Business Unit. O padrão é `false`. |

### Formatos suportados

A função aceita vários formatos de string de data, incluindo:

- **ISO 8601 com timestamp:** `2023-08-05T13:41:23-06:00`
- **ISO 8601 somente data:** `2023-08-05`
- **Notação americana (data e hora):** `8/5/2023 1:41 PM`
- **Notação por extenso em inglês:** `5 August 2023` ou `August 5, 2023`
- **Data e hora:** `2023-08-05 1:41:23 PM`
- **Somente hora:** `1:41 PM`
- **Notação chinesa/japonesa:** `2023年8月5日`
- **Notação coreana:** `2023년 8월 5일`

### Formatos NÃO suportados

⚠️ Preste atenção nesses formatos que **não funcionam**:

- Datas com sufixo ordinal: `August 5th, 2023` ou `5th August 2023`
- Notação little-endian (dia/mês/ano): `5/8/2023` para representar 5 de agosto — a função vai interpretar como 8 de maio!
- Nomes de meses em outros idiomas que não inglês: `5 août 2023`, `5 agosto 2023`
- Numerais que não sejam arábicos ocidentais: `٢٠٢٣/٨/٥`
- Calendários diferentes do gregoriano: `18 Av, 5783` ou `18 Muharram, 1445`

## Exemplo básico

Imagine que você tem uma Data Extension de promoções da **MegaStore** e a data de expiração do cupom vem como texto. Você precisa converter essa string para um objeto DateTime para poder comparar com a data atual:

```ampscript
%%[
VAR @dataTexto, @dataConvertida

SET @dataTexto = "2024-12-25"
SET @dataConvertida = DateParse(@dataTexto)
]%%

A data convertida é: %%=FormatDate(@dataConvertida, "dd/MM/yyyy")=%%
```

**Saída:**
```
A data convertida é: 25/12/2024
```

## Exemplo avançado

### Cenário: Verificar validade de cupom de Dia das Mães

A **Lojas Vitória** está rodando uma campanha de Dia das Mães e precisa verificar se o cupom do cliente ainda é válido. A data de expiração vem de uma Data Extension como string no formato ISO 8601:

```ampscript
%%[
VAR @nomeCliente, @dataExpiracaoTexto, @dataExpiracao, @agora, @diasRestantes, @mensagem

SET @nomeCliente = "Maria Santos"
SET @dataExpiracaoTexto = Lookup("CuponsDiaDasMaes", "DataExpiracao", "Email", emailaddr)

/* Converter a string para DateTime */
SET @dataExpiracao = DateParse(@dataExpiracaoTexto)

/* Pegar a data atual no fuso da BU */
SET @agora = Now()

/* Calcular quantos dias faltam */
SET @diasRestantes = DateDiff(@agora, @dataExpiracao, "D")

IF @diasRestantes > 0 THEN
  SET @mensagem = Concat("Olá, ", @nomeCliente, "! Seu cupom MAMAE15 de 15% de desconto ainda está ativo. Faltam ", @diasRestantes, " dias para expirar. Use em www.lojasvitoria.com.br e garanta frete grátis acima de R$299!")
ELSEIF @diasRestantes == 0 THEN
  SET @mensagem = Concat("Corre, ", @nomeCliente, "! Hoje é o ÚLTIMO DIA para usar seu cupom MAMAE15 de 15% de desconto na Lojas Vitória!")
ELSE
  SET @mensagem = Concat("Oi, ", @nomeCliente, ". Infelizmente seu cupom MAMAE15 já expirou. Mas temos ofertas incríveis esperando por você em www.lojasvitoria.com.br!")
ENDIF
]%%

%%=v(@mensagem)=%%
```

**Saída (se faltam 5 dias):**
```
Olá, Maria Santos! Seu cupom MAMAE15 de 15% de desconto ainda está ativo. Faltam 5 dias para expirar. Use em www.lojasvitoria.com.br e garanta frete grátis acima de R$299!
```

### Cenário: Obter horário atual em UTC

Quando você precisa registrar timestamps padronizados (por exemplo, para gravar log de abertura em uma DE), o parâmetro `boolUseUtc` é essencial:

```ampscript
%%[
VAR @agoraUtc, @agoraLocal

SET @agoraUtc = DateParse(Now(), true)
SET @agoraLocal = DateParse(Now(), false)
]%%

Horário UTC: %%=FormatDate(@agoraUtc, "dd/MM/yyyy HH:mm:ss")=%%
Horário local da BU: %%=FormatDate(@agoraLocal, "dd/MM/yyyy HH:mm:ss")=%%
```

**Saída (supondo BU configurada para Brasília, UTC-3):**
```
Horário UTC: 15/05/2024 18:30:00
Horário local da BU: 15/05/2024 15:30:00
```

### Cenário: Converter data recebida por API e registrar em Data Extension

O **Banco Meridional** recebe a data de adesão ao programa de cashback via integração como string ISO 8601 com timezone. Precisa converter e gravar na DE em formato padronizado:

```ampscript
%%[
VAR @emailCliente, @dataAdesaoTexto, @dataAdesao, @dataAdesaoUtc

SET @emailCliente = "carlos.oliveira@email.com.br"
SET @dataAdesaoTexto = "2024-03-15T10:30:00-03:00"

/* Converter para DateTime no horário local */
SET @dataAdesao = DateParse(@dataAdesaoTexto)

/* Converter para UTC para padronizar o registro */
SET @dataAdesaoUtc = DateParse(@dataAdesaoTexto, true)

/* Gravar na Data Extension */
UpsertDE("ProgramaCashback", 1, "Email", @emailCliente, "DataAdesao", @dataAdesao, "DataAdesaoUTC", @dataAdesaoUtc)
]%%

Olá, Carlos! Sua adesão ao programa de cashback foi registrada com sucesso em %%=FormatDate(@dataAdesao, "dd/MM/yyyy")=%%.
Todas as compras a partir de agora geram cashback em Reais direto na sua conta!
```

**Saída:**
```
Olá, Carlos! Sua adesão ao programa de cashback foi registrada com sucesso em 15/03/2024.
Todas as compras a partir de agora geram cashback em Reais direto na sua conta!
```

## Observações

- **Cuidado com o formato brasileiro de data!** O formato DD/MM/AAAA (little-endian) **não é suportado**. Se sua DE armazena `05/08/2024` querendo dizer 5 de agosto, a função vai interpretar como 8 de maio (formato americano MM/DD/AAAA). Sempre que possível, armazene datas no formato ISO 8601 (`2024-08-05`) para evitar ambiguidades.
- **Nomes de meses em português não funcionam.** A string `5 agosto 2024` não será reconhecida. Use nomes de meses em inglês (`5 August 2024`) ou, preferencialmente, o formato ISO 8601.
- O parâmetro `boolUseUtc` é opcional. Quando omitido, o padrão é `false`, ou seja, usa o fuso horário configurado na sua Business Unit.
- Se a string passada não puder ser interpretada como uma data válida, a função vai gerar um erro em tempo de execução. Considere usar [Empty](../utility-functions/empty.md) para validar o valor antes de chamar `DateParse`.
- O retorno é um objeto `DateTime`, que pode ser usado diretamente com outras funções de data como [DateAdd](../date-functions/dateadd.md), [DateDiff](../date-functions/datediff.md) e [FormatDate](../date-functions/formatdate.md).
- Se você receber somente a hora (ex: `1:41 PM`), a função vai retornar um DateTime com a data definida como a data padrão do sistema (geralmente 01/01/0001). Tome cuidado com esse cenário.
- A função funciona em emails, CloudPages, SMS e Landing Pages — não há restrição de contexto conhecida.

## Funções relacionadas

- [FormatDate](../date-functions/formatdate.md) — Formata um objeto DateTime para exibição (ex: `dd/MM/yyyy`). Ótima companheira para usar depois do `DateParse`.
- [DateAdd](../date-functions/dateadd.md) — Adiciona um intervalo de tempo a uma data. Use junto com `DateParse` para calcular datas futuras.
- [DateDiff](../date-functions/datediff.md) — Calcula a diferença entre duas datas. Perfeita para verificar validade de promoções.
- [DatePart](../date-functions/datepart.md) — Extrai uma parte específica de uma data (dia, mês, ano, hora, etc).
- [Now](../date-functions/now.md) — Retorna a data e hora atual no fuso da Business Unit.
- [SystemDate](../date-functions/systemdate.md) — Retorna a data e hora do sistema em UTC (horário do servidor Central).
- [StringToDate](../date-functions/stringtodate.md) — Outra função para converter strings em datas. Compare com `DateParse` para escolher a melhor opção.
- [LocalDateToSystemDate](../date-functions/localdatetosystemdate.md) — Converte uma data no fuso local para o fuso do sistema.
- [SystemDateToLocalDate](../date-functions/systemdatetolocaldate.md) — Converte uma data do fuso do sistema para o fuso local da BU.
- [Format](../string-functions/format.md) — Formata valores diversos como strings, incluindo datas.