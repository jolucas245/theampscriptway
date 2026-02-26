---
title: ClaimRowValue
sidebar_label: ClaimRowValue
description: Busca uma linha não reivindicada em uma Data Extension, retorna um valor específico dessa linha e a marca como reivindicada, com suporte a valor de fallback caso não haja linhas disponíveis.
---

# ClaimRowValue

## Descrição

A função `ClaimRowValue` busca a próxima linha não reivindicada em uma Data Extension e retorna o valor de uma coluna específica dessa linha. Ao mesmo tempo, ela marca a linha como reivindicada, impedindo que outros subscribers recebam o mesmo valor. Se não houver mais linhas disponíveis, a função retorna um valor de fallback que você define. É a função ideal para distribuição de cupons, códigos promocionais, vouchers e qualquer cenário onde cada subscriber precisa receber um código único e irrepetível.

Ela é semelhante à função [ClaimRow](../data-extension-functions/claimrow.md), mas com duas diferenças importantes: retorna apenas o **valor de uma coluna** (em vez da linha inteira) e aceita um **valor de fallback** caso os códigos acabem.

## Sintaxe

```ampscript
ClaimRowValue(dataExt, returnValueColumn, claimColumn, valueIfClaimed, claimantColumn, claimantValue [, additionalColumn1, additionalValue1, ...])
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| dataExt | String | Sim | Nome da Data Extension que contém os valores a serem reivindicados. **Deve ser hard-coded** — não pode ser uma variável AMPscript, senão a função gera uma exceção. |
| returnValueColumn | String | Sim | Nome da coluna cujo valor você quer que a função retorne. |
| claimColumn | String | Sim | Nome da coluna booleana usada para rastrear se a linha já foi reivindicada. Essa coluna deve ser do tipo Boolean, obrigatória (non-nullable) e com valor padrão `False`. |
| valueIfClaimed | String | Sim | Valor de fallback retornado caso não existam mais linhas disponíveis (não reivindicadas) na Data Extension. |
| claimantColumn | String | Sim | Nome da coluna usada para registrar quem reivindicou a linha. |
| claimantValue | String | Sim | Valor a ser inserido na coluna `claimantColumn` quando a linha for reivindicada (geralmente o e-mail ou identificador do subscriber). |
| additionalColumn, additionalValue | String | Não | Pares adicionais de coluna/valor para preencher outras colunas da linha reivindicada. Você pode adicionar quantos pares precisar ao final da função. |

## Configuração da Data Extension

Para usar `ClaimRowValue`, sua Data Extension **precisa** ter a seguinte estrutura mínima:

| Nome do Atributo | Tipo de Dado | Obrigatório? | Valor Padrão |
|---|---|---|---|
| CodigoCupom | Text | Sim | — |
| EmailAssinante | Text | Não | — |
| Reivindicado | Boolean | Sim | False |
| ClaimedDate | Date | Não | — |

**Importante sobre a coluna `ClaimedDate`:** ela não é estritamente obrigatória, mas se existir na Data Extension, a função insere automaticamente um timestamp quando a linha é reivindicada. A coluna deve ser nullable, do tipo Date e ter **exatamente** o nome `ClaimedDate`.

## Exemplo básico

Imagine que a loja **MegaStore** está distribuindo cupons únicos de R$ 50,00 de desconto para a campanha de **Dia das Mães**. Cada subscriber recebe um cupom exclusivo por e-mail.

**Data Extension "CuponsDiaDasMaes" (antes do envio):**

| CodigoCupom | EmailAssinante | Reivindicado | ClaimedDate |
|---|---|---|---|
| MAES-7B2K | | False | |
| MAES-9X4T | | False | |
| MAES-1R8P | | False | |
| MAES-5W3N | | False | |

```ampscript
%%[
VAR @cupom
SET @cupom = ClaimRowValue(
  "CuponsDiaDasMaes",
  "CodigoCupom",
  "Reivindicado",
  "MAES-ESGOTADO",
  "EmailAssinante",
  EmailAddress
)
]%%

Olá! 🌷

Seu cupom exclusivo de R$ 50,00 de desconto para o Dia das Mães é:

Código: %%=v(@cupom)=%%

Use em www.megastore.com.br até 12/05/2025.
```

**Saída (para maria.santos@email.com.br):**
```
Olá! 🌷

Seu cupom exclusivo de R$ 50,00 de desconto para o Dia das Mães é:

Código: MAES-7B2K

Use em www.megastore.com.br até 12/05/2025.
```

**Data Extension após o envio para Maria:**

| CodigoCupom | EmailAssinante | Reivindicado | ClaimedDate |
|---|---|---|---|
| MAES-7B2K | maria.santos@email.com.br | True | 05/05/2025 13:41:32 |
| MAES-9X4T | | False | |
| MAES-1R8P | | False | |
| MAES-5W3N | | False | |

## Exemplo avançado

A **Conecta Telecom** está fazendo uma campanha de **Black Friday** com cupons de desconto de diferentes valores. Quando os cupons acabam, o e-mail mostra um código genérico de fallback. A DE também registra o nome do subscriber e a campanha de origem.

**Data Extension "CuponsBlackFriday":**

| CodigoCupom | EmailAssinante | NomeAssinante | Campanha | Reivindicado | ClaimedDate |
|---|---|---|---|---|---|
| BF-R50-AB12 | | | | False | |
| BF-R50-CD34 | | | | False | |
| BF-R50-EF56 | | | | False | |

```ampscript
%%[
VAR @cupom, @nome, @email, @mensagem

SET @nome = AttributeValue("FirstName")
SET @email = AttributeValue("EmailAddress")

/* Fallback caso os cupons acabem */
SET @cupom = ClaimRowValue(
  "CuponsBlackFriday",
  "CodigoCupom",
  "Reivindicado",
  "BLACKGENERICO10",
  "EmailAssinante",
  @email,
  "NomeAssinante", @nome,
  "Campanha", "BlackFriday2025"
)

/* Verifica se recebeu o código de fallback */
IF @cupom == "BLACKGENERICO10" THEN
  SET @mensagem = Concat("Ei, ", @nome, "! Nossos cupons exclusivos esgotaram super rápido, mas você ainda garante 10% OFF com o código: ", @cupom)
ELSE
  SET @mensagem = Concat("Parabéns, ", @nome, "! 🎉 Você garantiu R$ 50,00 de desconto exclusivo! Seu código: ", @cupom)
ENDIF
]%%

%%=v(@mensagem)=%%

Aproveite em www.conectatelecom.com.br/blackfriday
Válido até 30/11/2025. Frete grátis acima de R$ 299,00!
```

**Saída (quando ainda há cupons, para João Silva):**
```
Parabéns, João! 🎉 Você garantiu R$ 50,00 de desconto exclusivo! Seu código: BF-R50-AB12

Aproveite em www.conectatelecom.com.br/blackfriday
Válido até 30/11/2025. Frete grátis acima de R$ 299,00!
```

**Saída (quando os cupons acabaram, para Carlos Oliveira):**
```
Ei, Carlos! Nossos cupons exclusivos esgotaram super rápido, mas você ainda garante 10% OFF com o código: BLACKGENERICO10

Aproveite em www.conectatelecom.com.br/blackfriday
Válido até 30/11/2025. Frete grátis acima de R$ 299,00!
```

**Data Extension após os envios:**

| CodigoCupom | EmailAssinante | NomeAssinante | Campanha | Reivindicado | ClaimedDate |
|---|---|---|---|---|---|
| BF-R50-AB12 | joao.silva@email.com.br | João | BlackFriday2025 | True | 25/11/2025 09:15:03 |
| BF-R50-CD34 | ana.costa@email.com.br | Ana | BlackFriday2025 | True | 25/11/2025 09:15:04 |
| BF-R50-EF56 | pedro.lima@email.com.br | Pedro | BlackFriday2025 | True | 25/11/2025 09:15:05 |

## Observações

- **O nome da Data Extension deve ser hard-coded (fixo no código).** Se você usar uma variável AMPscript no parâmetro `dataExt`, a função vai gerar uma exceção. Isso é uma limitação intencional da plataforma.
- **A coluna booleana de controle** (ex: `Reivindicado`) precisa ser obrigatória (non-nullable) e ter valor padrão `False`. Sem essa configuração, a função não funciona corretamente.
- **A coluna `ClaimedDate` é opcional**, mas se existir com esse nome exato, tipo Date e nullable, a função preenche automaticamente com a data/hora da reivindicação. Você não precisa passar esse valor manualmente.
- **Cada linha só pode ser reivindicada uma vez.** Depois de marcada como `True`, ela nunca mais será retornada pela função. Isso garante unicidade dos códigos distribuídos.
- **O valor de fallback (`valueIfClaimed`) é crucial.** Sempre defina um código genérico como fallback para evitar que o subscriber receba um e-mail sem nenhum cupom. Uma boa prática é verificar programaticamente se o valor retornado é o fallback e adaptar a mensagem.
- **Você pode preencher colunas adicionais** acrescentando pares de nome/valor ao final da chamada da função. Isso é útil para registrar dados como nome, campanha de origem, canal, etc.
- **Monitore a quantidade de códigos disponíveis.** Use [DataExtensionRowCount](../data-extension-functions/dataextensionrowcount.md) ou relatórios para acompanhar quantos cupons ainda não foram reivindicados. Recarregue a Data Extension antes que acabem.
- **A função é thread-safe.** Se dois envios tentarem reivindicar ao mesmo tempo, cada um recebe uma linha diferente — não há risco de dois subscribers receberem o mesmo código.
- **Funciona em e-mails, CloudPages e Landing Pages.** Porém, em contextos de preview/teste no Content Builder, a função pode consumir um código real. Tenha cuidado ao testar.
- A diferença principal em relação à [ClaimRow](../data-extension-functions/claimrow.md) é que `ClaimRowValue` retorna diretamente um **valor string** de uma coluna específica, enquanto `ClaimRow` retorna um **objeto de linha** do qual você precisa extrair valores com [Field](../data-extension-functions/field.md).

## Funções relacionadas

- [ClaimRow](../data-extension-functions/claimrow.md) — Reivindica uma linha inteira de uma Data Extension (retorna o objeto da linha em vez de um valor direto)
- [Lookup](../data-extension-functions/lookup.md) — Busca um valor em uma Data Extension sem reivindicar a linha
- [LookupRows](../data-extension-functions/lookuprows.md) — Retorna múltiplas linhas de uma Data Extension com base em critérios de busca
- [Field](../data-extension-functions/field.md) — Extrai o valor de uma coluna de um objeto de linha retornado por funções como ClaimRow
- [DataExtensionRowCount](../data-extension-functions/dataextensionrowcount.md) — Conta o total de linhas em uma Data Extension (útil para monitorar cupons restantes)
- [InsertDE](../data-extension-functions/insertde.md) — Insere uma nova linha em uma Data Extension
- [UpdateDE](../data-extension-functions/updatede.md) — Atualiza dados em uma Data Extension existente
- [RaiseError](../utility-functions/raiseerror.md) — Gera um erro personalizado (útil para interromper o envio se os cupons acabarem)
- [AttributeValue](../utility-functions/attributevalue.md) — Recupera o valor de um atributo do subscriber de forma segura
- [Concat](../string-functions/concat.md) — Concatena strings (útil para montar mensagens dinâmicas com o código do cupom)