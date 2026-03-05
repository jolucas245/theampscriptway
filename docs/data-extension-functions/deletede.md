---
title: DeleteDE
sidebar_label: DeleteDE
description: Remove linhas de uma Data Extension com base em critérios de coluna e valor, para uso em contexto de e-mail.
---

# DeleteDE

## Descrição

A função `DeleteDE` remove linhas de uma Data Extension com base em um ou mais critérios de coluna e valor. Ela é usada especificamente em contexto de **e-mail** - se você precisa deletar registros em CloudPages, landing pages, microsites ou mensagens SMS no MobileConnect, use a função [DeleteData](../data-extension-functions/deletedata.md). A função não retorna nenhum valor de saída.

## Sintaxe

```ampscript
DeleteDE(@dataExt, @columnName1, @valueToDelete1)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `dataExt` | String | Sim | Nome da Data Extension que contém os dados que você quer deletar. |
| `columnName1` | String | Sim | Nome da coluna usada como critério de busca para identificar as linhas a serem deletadas. |
| `valueToDelete1` | String | Sim | Valor que a função usa para determinar qual(is) linha(s) deletar. |

Você pode deletar múltiplas linhas na mesma operação adicionando pares extras de nome de coluna e valor ao final da chamada da função.

## Exemplo básico

Imagine que você tem uma Data Extension chamada "Ofertas" com dados de promoções enviadas a clientes. Você quer remover a oferta destinada a uma cidade específica ao disparar um e-mail de atualização.

**Data Extension "Ofertas" antes:**

| Cidade | Produto | Preco | Frete |
|---|---|---|---|
| São Paulo | Notebook | R$ 3.499,00 | R$ 0,00 |
| Curitiba | Smart TV | R$ 2.199,00 | R$ 89,90 |
| Belo Horizonte | Smartphone | R$ 1.299,90 | R$ 49,90 |

```ampscript
%%[
DeleteDE("Ofertas", "Cidade", "Curitiba")
]%%
```

**Data Extension "Ofertas" depois:**

| Cidade | Produto | Preco | Frete |
|---|---|---|---|
| São Paulo | Notebook | R$ 3.499,00 | R$ 0,00 |
| Belo Horizonte | Smartphone | R$ 1.299,90 | R$ 49,90 |

## Exemplo avançado

Em uma régua de relacionamento da MegaStore, você mantém uma Data Extension "FilaAtendimento" com solicitações de suporte. Ao enviar um e-mail de encerramento de chamado, você precisa remover todas as linhas em que a origem **ou** o destino do atendimento seja "Rio de Janeiro" - por exemplo, porque aquela regional foi migrada para outro sistema.

**Data Extension "FilaAtendimento" antes:**

| Origem | Destino | Valor | TaxaExtra |
|---|---|---|---|
| São Paulo | Curitiba | R$ 100,00 | |
| São Paulo | Rio de Janeiro | R$ 200,00 | |
| São Paulo | Belo Horizonte | R$ 500,00 | R$ 25,00 |
| Curitiba | Belo Horizonte | R$ 525,00 | R$ 10,00 |
| Curitiba | Rio de Janeiro | R$ 400,00 | |
| Belo Horizonte | Recife | R$ 300,00 | |
| Belo Horizonte | Rio de Janeiro | R$ 10,00 | |
| Rio de Janeiro | Salvador | R$ 350,00 | R$ 10,00 |
| Porto Alegre | Brasília | R$ 5,00 | |
| Porto Alegre | Rio de Janeiro | R$ 200,00 | |

```ampscript
%%[
DeleteDE("FilaAtendimento", "Origem", "Rio de Janeiro", "Destino", "Rio de Janeiro")
]%%
```

**Data Extension "FilaAtendimento" depois:**

| Origem | Destino | Valor | TaxaExtra |
|---|---|---|---|
| São Paulo | Curitiba | R$ 100,00 | |
| São Paulo | Rio de Janeiro | R$ 200,00 | |
| São Paulo | Belo Horizonte | R$ 500,00 | R$ 25,00 |
| Curitiba | Belo Horizonte | R$ 525,00 | R$ 10,00 |
| Curitiba | Rio de Janeiro | R$ 400,00 | |
| Belo Horizonte | Recife | R$ 300,00 | |
| Porto Alegre | Brasília | R$ 5,00 | |

> **💡 Dica:** Quando você passa múltiplos pares de coluna/valor, a função remove as linhas que atendem a **qualquer um** dos critérios informados - no exemplo acima, foram removidas as linhas onde `Origem` era "Rio de Janeiro" **ou** `Destino` era "Rio de Janeiro".

## Observações

> **⚠️ Atenção:** A função `DeleteDE` é exclusiva para uso em **e-mails**. Se você precisa deletar registros em CloudPages, landing pages, microsites ou mensagens SMS do MobileConnect, utilize a função [DeleteData](../data-extension-functions/deletedata.md).

- A função **não retorna nenhum valor de saída**. Ela executa a deleção silenciosamente.
- Você pode expandir a operação para múltiplos critérios adicionando pares de nome de coluna e valor ao final da chamada. Cada par adicional funciona como um critério **OR** - qualquer linha que corresponda a pelo menos um dos critérios será removida.

## Funções relacionadas

- [DeleteData](../data-extension-functions/deletedata.md) - equivalente para uso em CloudPages, landing pages, microsites e SMS
- [InsertDE](../data-extension-functions/insertde.md) - insere linhas em uma Data Extension (contexto de e-mail)
- [UpdateDE](../data-extension-functions/updatede.md) - atualiza linhas em uma Data Extension (contexto de e-mail)
- [UpsertDE](../data-extension-functions/upsertde.md) - insere ou atualiza linhas em uma Data Extension (contexto de e-mail)
- [LookupRows](../data-extension-functions/lookuprows.md) - consulta linhas de uma Data Extension antes de decidir o que deletar