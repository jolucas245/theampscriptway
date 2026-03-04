---
title: InsertDE
sidebar_label: InsertDE
description: Insere uma nova linha em uma Data Extension a partir de e-mails no Salesforce Marketing Cloud.
---

# InsertDE

## Descrição

A função `InsertDE` insere uma nova linha (registro) em uma Data Extension. Ela não retorna nenhum valor de saída. Use essa função quando precisar gravar dados em uma DE a partir de **e-mails** — por exemplo, registrar que um assinante abriu uma comunicação, salvar uma preferência capturada via personalização ou alimentar uma DE de log durante o envio de uma campanha.

## Sintaxe

```ampscript
InsertDE("dataExt", "columnName1", "valueToInsert1" [, "columnName2", "valueToInsert2" ...])
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| dataExt | string | Sim | Nome da Data Extension onde a linha será inserida. |
| columnName1 | string | Sim | Nome da coluna onde o valor será inserido. |
| valueToInsert1 | string | Sim | Valor a ser inserido na coluna especificada. |

Você pode inserir dados em múltiplas colunas de uma mesma linha adicionando pares de nome de coluna e valor ao final da chamada da função.

## Exemplo básico

Inserindo um novo voo na Data Extension "Voos" de uma campanha da Conecta Telecom que oferece passagens promocionais:

```ampscript
%%[
InsertDE(
  "Voos",
  "VooId", "4",
  "Origem", "GRU",
  "Destino", "GIG",
  "Preco", "125"
)
]%%
```

**Saída:**

A função não gera saída visível. A Data Extension "Voos" passa a conter:

```
VooId | Origem | Destino | Preco | TaxaBagagem
------+--------+---------+-------+------------
1     | GRU    | SSA     | 100   |
2     | GRU    | CWB     | 200   |
3     | GRU    | POA     | 500   | 25
4     | GRU    | GIG     | 125   |
```

## Exemplo avançado

Registrando o interesse de um assinante em uma régua de relacionamento da MegaStore. A cada abertura de e-mail promocional, uma linha é gravada na DE "LogInteresse" com os dados do subscriber, a data/hora do envio e o produto visualizado:

```ampscript
%%[
VAR @email, @nome, @dataEnvio, @produto, @preco

SET @email = AttributeValue("EmailAddress")
SET @nome = AttributeValue("PrimeiroNome")
SET @dataEnvio = FormatDate(Now(), "DD/MM/YYYY", "HH:mm")
SET @produto = "Notebook ProMax 15"
SET @preco = "R$ 4.299,90"

InsertDE(
  "LogInteresse",
  "Email", @email,
  "Nome", @nome,
  "DataRegistro", @dataEnvio,
  "Produto", @produto,
  "PrecoExibido", @preco,
  "Origem", "Email Promocional"
)
]%%
```

**Saída:**

Nenhuma saída visível no e-mail. Uma nova linha é inserida na Data Extension "LogInteresse":

```
Email                     | Nome  | DataRegistro     | Produto            | PrecoExibido  | Origem
--------------------------+-------+------------------+--------------------+---------------+-------------------
joao.silva@email.com.br   | João  | 15/07/2025 09:30 | Notebook ProMax 15 | R$ 4.299,90   | Email Promocional
```

## Observações

- A função `InsertDE` **não retorna nenhum valor**. Ela apenas executa a inserção na Data Extension.

> **⚠️ Atenção:** A `InsertDE` é destinada ao uso em **e-mails**. Para inserir dados a partir de **CloudPages, landing pages, microsites ou mensagens SMS (MobileConnect)**, use a função [`InsertData`](../data-extension-functions/insertdata.md).

> **💡 Dica:** Você pode inserir quantas colunas precisar em uma única chamada — basta continuar adicionando pares de `"nomeColuna", "valor"` ao final da função. Não é necessário preencher todas as colunas da DE; apenas as que você precisa (respeitando campos obrigatórios e chaves primárias da sua DE).

## Funções relacionadas

- [`InsertData`](../data-extension-functions/insertdata.md) — equivalente para uso em CloudPages, landing pages, microsites e SMS
- [`UpdateDE`](../data-extension-functions/updatede.md) — atualiza linhas existentes em uma DE (uso em e-mails)
- [`UpsertDE`](../data-extension-functions/upsertde.md) — insere ou atualiza conforme a existência do registro (uso em e-mails)
- [`DeleteDE`](../data-extension-functions/deletede.md) — remove linhas de uma DE (uso em e-mails)
- [`Lookup`](../data-extension-functions/lookup.md) — consulta valores em uma DE antes de decidir se insere ou não