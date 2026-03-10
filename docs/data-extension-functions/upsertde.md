---
title: UpsertDE
sidebar_label: UpsertDE
description: Atualiza dados em uma Data Extension se encontrar correspondência, ou insere uma nova linha caso não encontre.
---

# UpsertDE

## Descrição

A função `UpsertDE` faz um "upsert" (update + insert) em uma Data Extension: se encontrar uma linha que corresponda aos critérios de busca, atualiza os valores; se não encontrar, insere uma nova linha com os dados informados. Essa função não retorna nenhum valor de saída. É a função ideal para cenários de e-mail onde você precisa garantir que o dado será gravado independentemente de o registro já existir - como atualizar o status de um cliente em uma régua de relacionamento ou registrar a última interação durante o envio de uma campanha.

> **⚠️ Atenção:** A `UpsertDE` é exclusiva para uso em **e-mails**. Para landing pages, CloudPages, microsites e SMS (MobileConnect), use a função [UpsertData](../data-extension-functions/upsertdata.md).

## Sintaxe

```ampscript
UpsertDE(@dataExt, @columnValuePairs, @searchColumnName1, @searchValue1, @columnToUpsert1, @upsertedValue1, ...)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `dataExt` | string | Sim | Nome da Data Extension onde os dados serão atualizados ou inseridos. |
| `columnValuePairs` | number | Sim | Número de pares coluna/valor usados como critério de busca (search). |
| `searchColumnName1` | string | Sim | Nome da coluna usada para localizar a linha que será atualizada ou onde será feita a inserção. |
| `searchValue1` | string | Sim | Valor de busca usado para determinar qual linha atualizar ou inserir. Você pode especificar múltiplos pares de coluna/valor de busca. |
| `columnToUpsert1` | string | Sim | Nome da coluna onde o dado será atualizado ou inserido. |
| `upsertedValue1` | string | Sim | Valor a ser gravado na coluna especificada. Você pode especificar múltiplos pares de coluna/valor para upsert. |

## Exemplo básico

Atualizando o preço e a taxa de entrega de um produto na Data Extension "Produtos" de uma campanha da MegaStore. Se o produto já existir, atualiza; se não existir, insere uma nova linha.

```ampscript
%%[
/* Atualiza o ProdutoId 103 (já existe) com novo preço e frete */
UpsertDE(
  "Produtos", 1,
  "ProdutoId", "103",
  "Preco", "1299.90",
  "TaxaEntrega", "15.90"
)

/* ProdutoId 200 não existe - será inserido como nova linha */
UpsertDE(
  "Produtos", 1,
  "ProdutoId", "200",
  "NomeProduto", "Smart TV 55 polegadas",
  "Preco", "2499.00",
  "TaxaEntrega", "0.00"
)
]%%
```

**Saída:**

A função não produz saída visível. A Data Extension "Produtos" será atualizada com os novos valores para o ProdutoId 103, e uma nova linha será criada para o ProdutoId 200.

## Exemplo avançado

Em uma régua de relacionamento da Conecta Telecom, ao enviar o e-mail mensal de fatura, o sistema registra na Data Extension "HistoricoEnvios" a data do envio e o valor da fatura. Se o cliente já tiver registro para o mês corrente, atualiza; caso contrário, insere.

```ampscript
%%[

VAR @cpf, @email, @plano, @valorFatura, @mesReferencia, @dataEnvio

SET @cpf = AttributeValue("CPF")
SET @email = AttributeValue("EmailAddress")
SET @plano = AttributeValue("Plano")
SET @valorFatura = AttributeValue("ValorFatura")
SET @mesReferencia = FormatDate(Now(), "MM/yyyy")
SET @dataEnvio = FormatDate(Now(), "dd/MM/yyyy")

/* Upsert com 2 colunas de busca: CPF + MesReferencia */
UpsertDE(
  "HistoricoEnvios", 2,
  "CPF", @cpf,
  "MesReferencia", @mesReferencia,
  "EmailAddress", @email,
  "Plano", @plano,
  "ValorFatura", @valorFatura,
  "DataEnvio", @dataEnvio,
  "StatusEnvio", "Enviado"
)

]%%

Olá! Sua fatura do plano %%=V(@plano)=%% referente a %%=V(@mesReferencia)=%% no valor de R$ %%=FormatNumber(@valorFatura, "N2")=%% está disponível.
```

**Saída:**
```
Olá! Sua fatura do plano Conecta 100GB referente a 07/2025 no valor de R$ 89,90 está disponível.
```

A Data Extension "HistoricoEnvios" terá a linha do cliente atualizada (se já existia registro para aquele CPF + mês) ou uma nova linha inserida.

## Observações

- A `UpsertDE` **não retorna nenhum valor**. Ela executa a operação silenciosamente - se precisar confirmar que o dado foi gravado, faça um [Lookup](../data-extension-functions/lookup.md) posterior.

- O parâmetro `columnValuePairs` indica **quantos pares de busca** (searchColumnName/searchValue) serão usados, não o total de pares de upsert. Você pode fazer upsert de quantas colunas quiser, mas deve fornecer os critérios de busca correspondentes.

> **⚠️ Atenção:** Se o valor de `columnValuePairs` não corresponder à quantidade real de pares de busca (coluna/valor) fornecidos, a função retorna uma exceção.

> **⚠️ Atenção:** Se você informar um nome de coluna em `searchColumnName` que não exista na Data Extension, a função produz uma exceção.

> **⚠️ Atenção:** Se o valor em `upsertedValue` for de um tipo de dado diferente do tipo da coluna especificada em `columnToUpsert`, a função **não atualiza nem insere** nenhum dado e retorna `0`. Por exemplo, se a coluna espera texto e você passa um número, nada acontece.

> **⚠️ Atenção:** Se a quantidade de parâmetros de busca (searchColumnName e searchValue) não for igual à quantidade de parâmetros de upsert (columnToUpsert e upsertedValue), a função só atualiza/insere as colunas para as quais existem parâmetros de busca correspondentes. Por exemplo, se você fornecer 2 parâmetros de busca e 3 pares de upsert, apenas os 2 primeiros pares de upsert serão processados. Você pode repetir os mesmos parâmetros de upsert múltiplas vezes se necessário.

> **💡 Dica:** A `UpsertDE` é perfeita para cenários de e-mail onde você quer registrar a interação do envio sem se preocupar se o registro já existe. Em réguas de relacionamento no Journey Builder, isso evita duplicação de lógica (verificar existência → inserir ou atualizar separadamente).

## Funções relacionadas

- [InsertDE](../data-extension-functions/insertde.md) - quando você quer apenas inserir (sem atualizar registros existentes)
- [UpdateDE](../data-extension-functions/updatede.md) - quando você quer apenas atualizar (sem inserir novos registros)
- [DeleteDE](../data-extension-functions/deletede.md) - para remover linhas de uma Data Extension em e-mails
- [UpsertData](../data-extension-functions/upsertdata.md) - equivalente da `UpsertDE` para uso em landing pages, CloudPages, microsites e SMS
- [Lookup](../data-extension-functions/lookup.md) - para consultar dados em uma Data Extension
- [LookupRows](../data-extension-functions/lookuprows.md) - para consultar múltiplas linhas de uma Data Extension