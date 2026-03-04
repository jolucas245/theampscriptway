---
title: DeleteData
sidebar_label: DeleteData
description: Exclui linhas de uma Data Extension e retorna o número de linhas deletadas.
---

# DeleteData

## Descrição

A função `DeleteData` exclui uma ou mais linhas de uma Data Extension com base nos critérios que você informar, e retorna o número de linhas deletadas. É muito útil em landing pages e CloudPages para cenários como cancelamento de cadastro, remoção de itens de uma lista de desejos ou limpeza de dados temporários. Pode ser usada em landing pages, microsites e mensagens SMS no Mobile Connect.

> **⚠️ Atenção:** Para excluir linhas de uma Data Extension dentro de um **e-mail**, use a função [`DeleteDE`](../data-extension-functions/deletede.md). A `DeleteData` não funciona em contexto de envio de e-mail.

## Sintaxe

```ampscript
DeleteData("dataExt", "columnName1", "valueToDelete1" [, "columnName2", "valueToDelete2" ...])
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|----------------|-----------|---------------|----------------|
| dataExt | String | Sim | Nome da Data Extension que contém os dados que você quer excluir. |
| columnName1 | String | Sim | Nome da coluna usada como critério de busca para a exclusão. |
| valueToDelete1 | String | Sim | Valor que identifica a(s) linha(s) a ser(em) deletada(s) na coluna informada. |

Você pode deletar múltiplas linhas na mesma operação adicionando pares de nomes de coluna e valores ao final da função.

## Exemplo básico

Imagine uma Data Extension chamada **"ListaDesejos"** em uma CloudPage da MegaStore, onde o cliente pode remover um produto da sua lista:

**Data Extension "ListaDesejos" antes:**

| Email | Produto | Preco |
|---|---|---|
| joao.silva@email.com.br | Notebook Gamer | 4299,90 |
| joao.silva@email.com.br | Mouse sem fio | 189,90 |
| maria.santos@email.com.br | Teclado mecânico | 349,90 |

```ampscript
%%[

VAR @resultado
SET @resultado = DeleteData("ListaDesejos", "Produto", "Mouse sem fio")

]%%

%%=v(@resultado)=%%
```

**Saída:**
```
1
```

**Data Extension "ListaDesejos" depois:**

| Email | Produto | Preco |
|---|---|---|
| joao.silva@email.com.br | Notebook Gamer | 4299,90 |
| maria.santos@email.com.br | Teclado mecânico | 349,90 |

## Exemplo avançado

Em uma CloudPage de gestão de preferências da Conecta Telecom, o cliente solicita a remoção de todos os seus registros de uma Data Extension de alertas promocionais. A DE possui registros em múltiplas colunas que identificam o cliente, e queremos remover por mais de um critério para ser mais preciso:

**Data Extension "AlertasPromo" antes:**

| Email | Cidade | Plano | Desconto |
|---|---|---|---|
| joao.silva@email.com.br | São Paulo | Ultra 300MB | 15% |
| maria.santos@email.com.br | Curitiba | Básico 100MB | 10% |
| carlos.mendes@email.com.br | São Paulo | Ultra 300MB | 20% |
| ana.lima@email.com.br | Rio de Janeiro | Premium 500MB | 25% |
| pedro.rocha@email.com.br | São Paulo | Básico 100MB | 5% |

```ampscript
%%[

VAR @emailCliente, @cidadeCliente, @removidos
SET @emailCliente = RequestParameter("email")
SET @cidadeCliente = RequestParameter("cidade")

/* Remove registros que correspondam ao e-mail E à cidade */
SET @removidos = DeleteData("AlertasPromo", "Email", @emailCliente, "Cidade", @cidadeCliente)

IF @removidos > 0 THEN
]%%

<p>Pronto! Removemos %%=v(@removidos)=%% registro(s) dos alertas promocionais para %%=v(@cidadeCliente)=%%.</p>

%%[ ELSE ]%%

<p>Nenhum registro encontrado para remoção.</p>

%%[ ENDIF ]%%
```

Supondo que os parâmetros recebidos sejam `email=joao.silva@email.com.br` e `cidade=São Paulo`:

**Saída:**
```
Pronto! Removemos 1 registro(s) dos alertas promocionais para São Paulo.
```

## Observações

- A função **retorna o número de linhas deletadas**, o que é muito útil para exibir confirmações ao usuário ou para lógica condicional na sua página.
- Ao passar múltiplos pares de coluna/valor, a função utiliza todos como critério conjunto (todas as condições precisam ser atendidas na mesma linha para que ela seja deletada — funciona como um AND). Porém, se um mesmo valor aparece em colunas diferentes de linhas distintas, múltiplas linhas podem ser removidas, como demonstrado na documentação oficial onde registros com "ATL" tanto em Origin quanto em Dest resultaram na exclusão de 3 linhas.

> **⚠️ Atenção:** Esta função pode ser usada em **landing pages**, **microsites** e **mensagens SMS** (Mobile Connect). Para exclusão de dados em contexto de **e-mail**, utilize [`DeleteDE`](../data-extension-functions/deletede.md).

> **💡 Dica:** Antes de chamar `DeleteData`, considere usar [`LookupRows`](../data-extension-functions/lookuprows.md) para verificar quais registros serão afetados. Isso ajuda a evitar exclusões indesejadas, especialmente em CloudPages voltadas ao público final.

## Funções relacionadas

- [`DeleteDE`](../data-extension-functions/deletede.md) — Exclui linhas de uma Data Extension em contexto de e-mail.
- [`InsertData`](../data-extension-functions/insertdata.md) — Insere linhas em uma Data Extension (landing pages, microsites, SMS).
- [`UpdateData`](../data-extension-functions/updatedata.md) — Atualiza linhas em uma Data Extension (landing pages, microsites, SMS).
- [`UpsertData`](../data-extension-functions/upsertdata.md) — Insere ou atualiza linhas em uma Data Extension (landing pages, microsites, SMS).
- [`LookupRows`](../data-extension-functions/lookuprows.md) — Busca linhas em uma Data Extension para verificação antes de operações de exclusão.