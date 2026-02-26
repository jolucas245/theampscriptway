---
title: ClaimRow
sidebar_label: ClaimRow
description: Retorna a primeira linha não reivindicada de uma Data Extension e a marca como reivindicada, sendo ideal para distribuição de cupons e códigos promocionais únicos.
---

<!-- generated-by-script -->

# ClaimRow

## Descrição

A função `ClaimRow` busca a primeira linha ainda não reivindicada (unclaimed) de uma Data Extension e a marca como reivindicada, impedindo que outros subscribers recebam o mesmo registro. É a função perfeita para distribuir cupons únicos, códigos promocionais, vouchers de desconto e qualquer recurso que precise ser atribuído de forma exclusiva a cada destinatário. Ela retorna a linha inteira como um objeto, permitindo que você acesse qualquer coluna dessa linha usando a função [Field](../data-extension-functions/field.md). Se não houver mais linhas disponíveis na Data Extension, a função lança uma exceção (erro).

## Sintaxe

```ampscript
ClaimRow("NomeDaDataExtension", "ColunaDeControle", "ColunaDoReivindicante", "ValorDoReivindicante" [, "ColunaAdicional1", "ValorAdicional1", ...])
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| dataExt | String | Sim | Nome da Data Extension que contém as linhas a serem reivindicadas. **Deve ser um valor fixo (hard-coded)** — não aceita variáveis AMPscript. Se você passar uma variável, a função lança uma exceção. |
| claimColumn | String | Sim | Nome da coluna booleana usada para rastrear se a linha já foi reivindicada. Deve ser uma coluna obrigatória (non-nullable), do tipo Boolean, com valor padrão `False`. |
| claimantColumn | String | Sim | Nome da coluna que armazena a identificação de quem reivindicou a linha (ex: e-mail do subscriber). |
| claimantValue | String | Sim | Valor a ser inserido na coluna `claimantColumn` quando a linha for reivindicada. |
| colunaAdicionalN | String | Não | Nomes de colunas adicionais que você deseja preencher no momento da reivindicação. Sempre em pares com o valor correspondente. |
| valorAdicionalN | String | Não | Valores correspondentes às colunas adicionais informadas. |

## Configuração da Data Extension

Para que a `ClaimRow` funcione corretamente, sua Data Extension precisa seguir uma estrutura específica:

| Nome do Atributo | Tipo de Dado | Obrigatório? | Valor Padrão |
|---|---|---|---|
| CodigoCupom | Text | Sim | — |
| EmailAddress | Text | Não | — |
| IsClaimed | Boolean | Sim | False |
| ClaimedDate | Date | Não | — |

**Importante sobre a coluna `ClaimedDate`:** ela não é estritamente obrigatória, mas se existir na Data Extension com o nome exato `ClaimedDate`, tipo `Date` e sendo nullable, a função insere automaticamente um timestamp no momento da reivindicação.

## Exemplo básico

Imagine que a "Lojas Vitória" está fazendo uma campanha de **Dia das Mães** e quer enviar um cupom de desconto único para cada cliente. A Data Extension `CuponsVitoria` tem os seguintes dados:

| CodigoCupom | EmailAddress | IsClaimed | ClaimedDate |
|---|---|---|---|
| MAE-5BK9X | | False | |
| MAE-R2T4W | | False | |
| MAE-8HN1P | | False | |
| MAE-J6M3Q | | False | |

```ampscript
%%[
VAR @linha, @cupom

SET @linha = ClaimRow("CuponsVitoria", "IsClaimed", "EmailAddress", emailaddr)
SET @cupom = Field(@linha, "CodigoCupom")
]%%

Olá! 🌹

Feliz Dia das Mães! A Lojas Vitória preparou um presente especial pra você:

Use o cupom %%=v(@cupom)=%% e ganhe 20% de desconto em todo o site.

Acesse: www.lojasvitoria.com.br/maes
```

**Saída:**
```
Olá! 🌹

Feliz Dia das Mães! A Lojas Vitória preparou um presente especial pra você:

Use o cupom MAE-5BK9X e ganhe 20% de desconto em todo o site.

Acesse: www.lojasvitoria.com.br/maes
```

Após o envio, a Data Extension fica assim:

| CodigoCupom | EmailAddress | IsClaimed | ClaimedDate |
|---|---|---|---|
| MAE-5BK9X | maria.santos@example.com | True | 12/05/2024 10:23:15 |
| MAE-R2T4W | | False | |
| MAE-8HN1P | | False | |
| MAE-J6M3Q | | False | |

## Exemplo avançado

Agora um cenário mais robusto: a "MegaStore" está distribuindo cupons de cashback na **Black Friday**, e quer tratar o caso em que os cupons acabam, além de preencher colunas adicionais no momento da reivindicação. Como `ClaimRow` lança uma exceção quando não há linhas disponíveis, usamos [RaiseError](../utility-functions/raiseerror.md) para controlar o erro de forma elegante.

A Data Extension `CuponsBF_MegaStore` tem estas colunas:

| Nome do Atributo | Tipo de Dado | Obrigatório? | Valor Padrão |
|---|---|---|---|
| CodigoCupom | Text | Sim | — |
| EmailAddress | Text | Não | — |
| NomeCliente | Text | Não | — |
| ValorCashback | Text | Não | — |
| IsClaimed | Boolean | Sim | False |
| ClaimedDate | Date | Não | — |

```ampscript
%%[
VAR @linha, @cupom, @nomeAssinante, @valorCashback, @msgCupom

SET @nomeAssinante = AttributeValue("FirstName")

/* Tenta reivindicar uma linha, preenchendo colunas adicionais */
SET @linha = ClaimRow(
  "CuponsBF_MegaStore",
  "IsClaimed",
  "EmailAddress", emailaddr,
  "NomeCliente", @nomeAssinante,
  "ValorCashback", "R$ 50,00"
)

IF NOT EMPTY(@linha) THEN
  SET @cupom = Field(@linha, "CodigoCupom")
  SET @msgCupom = Concat("Seu cupom exclusivo de Black Friday: ", Uppercase(@cupom))
ELSE
  SET @msgCupom = "Poxa, os cupons acabaram! Mas calma — você ainda tem frete grátis acima de R$299."
ENDIF
]%%

Fala, %%=v(@nomeAssinante)=%%! 🖤

A Black Friday da MegaStore chegou com tudo!

%%=v(@msgCupom)=%%

Use no checkout em www.megastore.com.br/blackfriday e garanta R$ 50,00 de cashback na sua compra.

Válido até 30/11/2024. Não perca!
```

**Saída (com cupom disponível):**
```
Fala, João! 🖤

A Black Friday da MegaStore chegou com tudo!

Seu cupom exclusivo de Black Friday: BF-7KM2XP

Use no checkout em www.megastore.com.br/blackfriday e garanta R$ 50,00 de cashback na sua compra.

Válido até 30/11/2024. Não perca!
```

**Saída (sem cupons disponíveis — se o erro não for controlado, o envio falha. Veja a nota abaixo):**
```
Fala, João! 🖤

A Black Friday da MegaStore chegou com tudo!

Poxa, os cupons acabaram! Mas calma — você ainda tem frete grátis acima de R$299.

Use no checkout em www.megastore.com.br/blackfriday e garanta R$ 50,00 de cashback na sua compra.

Válido até 30/11/2024. Não perca!
```

> ⚠️ **Atenção:** O exemplo avançado acima mostra uma checagem com `EMPTY`, mas na prática, quando **não há linhas disponíveis**, a `ClaimRow` lança uma **exceção imediata** e o código após ela não é executado. Se você precisa de um comportamento com fallback (valor alternativo), considere usar a [ClaimRowValue](../data-extension-functions/claimrowvalue.md), que aceita um valor de retorno padrão quando não há linhas disponíveis.

## Observações

- **O nome da Data Extension deve ser hard-coded (fixo).** Você **não pode** passar uma variável AMPscript como primeiro parâmetro. Fazer isso causa uma exceção.
- **Exceção quando não há linhas disponíveis:** Diferente da [ClaimRowValue](../data-extension-functions/claimrowvalue.md), a `ClaimRow` **não aceita um valor de fallback**. Se todas as linhas já foram reivindicadas, a função gera uma exceção que interrompe a renderização da mensagem para aquele subscriber. Monitore seus estoques de cupons!
- **Coluna booleana obrigatória:** A Data Extension deve conter uma coluna booleana, obrigatória (non-nullable), com valor padrão `False`. Essa é a coluna que a função usa para controlar o status de reivindicação.
- **Coluna `ClaimedDate` é opcional, mas automática:** Se sua Data Extension tiver uma coluna chamada exatamente `ClaimedDate`, do tipo `Date` e nullable, a função preenche automaticamente com o timestamp do momento da reivindicação. Você não precisa fazer nada manualmente.
- **Retorna a linha inteira:** `ClaimRow` retorna um objeto de linha. Para acessar valores específicos, use a função [Field](../data-extension-functions/field.md).
- **Colunas adicionais:** Você pode preencher colunas extras na linha reivindicada adicionando pares de nome/valor após os quatro parâmetros obrigatórios.
- **Concorrência:** A função é segura para uso concorrente — cada linha é reivindicada atomicamente, garantindo que dois subscribers não recebam o mesmo cupom.
- **Planeje o estoque:** Em campanhas grandes (Black Friday, Natal, Dia das Mães), garanta que a Data Extension tenha cupons suficientes para todo o público-alvo. Considere usar [DataExtensionRowCount](../data-extension-functions/dataextensionrowcount.md) para monitorar o estoque antes do envio.
- **Dica prática:** Se você quer apenas um valor específico da linha (e não a linha inteira) e precisa de um fallback seguro, prefira a [ClaimRowValue](../data-extension-functions/claimrowvalue.md).

## Funções relacionadas

- [ClaimRowValue](../data-extension-functions/claimrowvalue.md) — Semelhante à `ClaimRow`, mas retorna apenas um valor específico da linha reivindicada e aceita um valor de fallback quando não há linhas disponíveis.
- [Field](../data-extension-functions/field.md) — Extrai o valor de uma coluna específica de um objeto de linha retornado por `ClaimRow`.
- [Lookup](../data-extension-functions/lookup.md) — Busca um valor em uma Data Extension com base em critérios, sem reivindicar a linha.
- [LookupRows](../data-extension-functions/lookuprows.md) — Retorna múltiplas linhas de uma Data Extension com base em critérios de busca.
- [DataExtensionRowCount](../data-extension-functions/dataextensionrowcount.md) — Retorna o número total de linhas em uma Data Extension, útil para monitorar o estoque de cupons.
- [RaiseError](../utility-functions/raiseerror.md) — Permite controlar o comportamento de erro, como suprimir o envio para um subscriber específico.
- [InsertDE](../data-extension-functions/insertde.md) — Insere uma nova linha em uma Data Extension, útil para reabastecer cupons.
- [V](../utility-functions/v.md) — Exibe o valor de uma variável AMPscript inline no conteúdo.
- [Uppercase](../string-functions/uppercase.md) — Converte texto para maiúsculas, útil para exibir códigos de cupom padronizados.
- [Empty](../utility-functions/empty.md) — Verifica se um valor está vazio ou nulo.