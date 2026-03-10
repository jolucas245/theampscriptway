---
title: DataExtensionRowCount
sidebar_label: DataExtensionRowCount
description: Retorna o número total de linhas (registros) de uma Data Extension.
---

# DataExtensionRowCount

## Descrição

A função `DataExtensionRowCount` retorna o número total de linhas de uma Data Extension. É muito útil quando você precisa saber a quantidade de registros armazenados - por exemplo, para exibir contadores em e-mails ("já são X clientes no programa"), validar se uma DE tem dados antes de fazer um loop, ou tomar decisões de conteúdo com base no volume de registros.

## Sintaxe

```ampscript
DataExtensionRowCount("dataExtensionName")
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| dataExtensionName | String | Sim | Nome da Data Extension da qual você quer obter a contagem de linhas. |

## Exemplo básico

Verificando quantos membros existem no programa de fidelidade da MegaStore.

```ampscript
%%[

VAR @totalMembros
SET @totalMembros = DataExtensionRowCount("ProgramaFidelidade")

]%%

Nosso programa de fidelidade já conta com %%=v(@totalMembros)=%% membros!
```

**Saída:**
```
Nosso programa de fidelidade já conta com 5 membros!
```

## Exemplo avançado

E-mail de régua de relacionamento da Lojas Vitória que exibe uma mensagem diferente dependendo do volume de clientes cadastrados na lista de espera de um produto.

```ampscript
%%[

VAR @totalListaEspera, @mensagem

SET @totalListaEspera = DataExtensionRowCount("ListaEsperaSmartTV")

IF @totalListaEspera > 100 THEN
  SET @mensagem = Concat("Alta demanda! Já são ", @totalListaEspera, " pessoas na lista de espera da Smart TV 65"". Garanta a sua.")
ELSEIF @totalListaEspera > 0 THEN
  SET @mensagem = Concat("Você é uma das ", @totalListaEspera, " pessoas interessadas na Smart TV 65"". Estoque limitado!")
ELSE
  SET @mensagem = "A Smart TV 65"" está disponível e esperando por você. Aproveite!"
ENDIF

]%%

<p>%%=v(@mensagem)=%%</p>
```

**Saída:**
```
Alta demanda! Já são 247 pessoas na lista de espera da Smart TV 65". Garanta a sua.
```

## Observações

> **💡 Dica:** `DataExtensionRowCount` retorna a contagem total da Data Extension inteira, sem filtros. Se você precisa contar apenas registros que atendam a um critério específico, considere usar [LookupRows](../data-extension-functions/lookuprows.md) combinado com [RowCount](../data-extension-functions/rowcount.md) - assim você filtra primeiro e depois conta o resultado.

> **⚠️ Atenção:** O parâmetro recebe o **nome** da Data Extension, não a External Key. Se você renomear a DE, precisará atualizar todas as referências no código.

## Funções relacionadas

- [RowCount](../data-extension-functions/rowcount.md) - conta linhas de um rowset retornado por funções como `LookupRows`
- [LookupRows](../data-extension-functions/lookuprows.md) - recupera linhas filtradas de uma Data Extension
- [LookupOrderedRows](../data-extension-functions/lookuporderedrows.md) - recupera linhas filtradas e ordenadas
- [Lookup](../data-extension-functions/lookup.md) - retorna um valor específico de uma coluna com base em filtro