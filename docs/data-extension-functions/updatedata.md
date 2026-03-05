---
title: UpdateData
sidebar_label: UpdateData
description: Atualiza dados em uma Data Extension e retorna o número de linhas atualizadas.
---

# UpdateData

## Descrição

A função `UpdateData` atualiza dados em uma Data Extension e retorna o número de linhas que foram atualizadas. É a função ideal para quando você precisa modificar registros existentes a partir de CloudPages, landing pages, microsites ou mensagens SMS no MobileConnect. Para atualizar dados em Data Extensions dentro de **e-mails**, use a função [`UpdateDE`](../data-extension-functions/updatede.md).

## Sintaxe

```ampscript
UpdateData("dataExt", columnValuePairs, "searchColumnName1", "searchValue1", "columnToUpdate1", "updatedValue1")
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| dataExt | String | Sim | Nome da Data Extension que contém os dados a serem atualizados. |
| columnValuePairs | Número | Sim | Número de pares coluna/valor usados como critério de busca para localizar as linhas. |
| searchColumnName1 | String | Sim | Nome da coluna usada para localizar a linha que será atualizada. |
| searchValue1 | String | Sim | Valor usado para identificar qual linha atualizar. Você pode especificar múltiplos pares de coluna e valor como critério de busca. |
| columnToUpdate1 | String | Sim | Nome da coluna que terá o dado atualizado. |
| updatedValue1 | String | Sim | Novo valor a ser gravado na coluna especificada. Você pode especificar múltiplos pares de coluna e valor para atualizar. |

## Exemplo básico

Atualizando o preço de um produto na Data Extension "Produtos_Loja" de uma CloudPage da MegaStore:

```ampscript
%%[

VAR @resultado
SET @resultado = UpdateData("Produtos_Loja", 1, "SKU", "SKU-4590", "Preco", "1299.90")

]%%

Registros atualizados: %%=V(@resultado)=%%
```

**Saída:**
```
Registros atualizados: 1
```

## Exemplo avançado

Em uma CloudPage de atualização cadastral, o cliente da Conecta Telecom altera seu endereço e telefone. A função atualiza múltiplas colunas de uma só vez, usando o CPF como critério de busca:

```ampscript
%%[

VAR @cpf, @novoTelefone, @novaCidade, @novoCEP, @resultado

SET @cpf = RequestParameter("cpf")
SET @novoTelefone = RequestParameter("telefone")
SET @novaCidade = RequestParameter("cidade")
SET @novoCEP = RequestParameter("cep")

SET @resultado = UpdateData(
  "Clientes_Conecta", 3,
  "CPF", @cpf,
  "CPF", @cpf,
  "CPF", @cpf,
  "Telefone", @novoTelefone,
  "Cidade", @novaCidade,
  "CEP", @novoCEP
)

IF @resultado > 0 THEN
]%%

<p>Cadastro atualizado com sucesso, obrigado!</p>

%%[ ELSE ]%%

<p>Não encontramos seu cadastro. Verifique o CPF informado.</p>

%%[ ENDIF ]%%
```

**Saída (quando o CPF é encontrado):**
```
Cadastro atualizado com sucesso, obrigado!
```

## Observações

> **⚠️ Atenção:** Para atualizar múltiplas colunas em uma única operação, você precisa fornecer **um par de critério de busca (searchColumnName + searchValue) para cada coluna que deseja atualizar**. Isso significa que, se quiser atualizar 3 colunas, o parâmetro `columnValuePairs` deve ser `3` e você deve repetir o critério de busca 3 vezes. Pode parecer redundante, mas é assim que a função funciona.

> **⚠️ Atenção:** Se o valor de `columnValuePairs` não corresponder ao número real de pares de critério de busca passados na função, ela retorna uma exceção.

> **⚠️ Atenção:** Se a coluna informada em `searchColumnName` não existir na Data Extension, a função gera uma exceção.

> **💡 Dica:** Se o valor informado em `searchValue` não for encontrado na coluna de busca, a função **não atualiza nada** e retorna `0`. Use esse retorno para dar feedback ao usuário, como no exemplo avançado acima.

> **⚠️ Atenção:** Se o tipo de dado do valor em `updatedValue` for diferente do tipo da coluna especificada em `columnToUpdate`, a função não atualiza nada e retorna `0`. Por exemplo, se você passar um valor numérico para uma coluna do tipo texto, a atualização não acontece.

> **⚠️ Atenção:** Se o número de parâmetros de busca (searchColumnName + searchValue) não for igual ao número de parâmetros de atualização (columnToUpdate + updatedValue), a função atualiza apenas as colunas para as quais existem parâmetros de busca correspondentes. Por exemplo, se você fornecer 2 pares de busca e 3 pares de atualização, apenas os 2 primeiros pares de atualização serão executados.

- A função pode ser usada em **CloudPages**, **landing pages**, **microsites** e **mensagens SMS** no MobileConnect.
- Para atualizar dados em Data Extensions dentro de **e-mails**, use [`UpdateDE`](../data-extension-functions/updatede.md).

## Funções relacionadas

- [`UpdateDE`](../data-extension-functions/updatede.md) - versão equivalente para uso em e-mails
- [`UpsertData`](../data-extension-functions/upsertdata.md) - insere ou atualiza (útil quando você não sabe se o registro já existe)
- [`InsertData`](../data-extension-functions/insertdata.md) - insere novos registros na Data Extension
- [`DeleteData`](../data-extension-functions/deletedata.md) - remove registros da Data Extension
- [`Lookup`](../data-extension-functions/lookup.md) - consulta dados antes de decidir o que atualizar
- [`RequestParameter`](../sites-functions/requestparameter.md) - captura parâmetros de formulário em CloudPages