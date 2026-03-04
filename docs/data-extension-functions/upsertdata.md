---
title: UpsertData
sidebar_label: UpsertData
description: Atualiza ou insere dados em uma Data Extension, retornando o número de linhas afetadas.
---

# UpsertData

## Descrição

A função `UpsertData` faz o clássico "upsert" em uma Data Extension: se encontrar uma linha que corresponda aos critérios de busca, atualiza os valores; se não encontrar, insere uma nova linha. Ela retorna o número de linhas atualizadas ou inseridas. É a função ideal para landing pages, microsites e mensagens SMS (MobileConnect) onde você precisa garantir que um registro exista e esteja atualizado — por exemplo, um formulário de cadastro ou atualização de preferências em uma CloudPage. Para fazer upsert dentro de um **e-mail**, use a função [UpsertDE](../data-extension-functions/upsertde.md).

## Sintaxe

```ampscript
UpsertData("NomeDaDataExtension", numeroDeParesBusca, "colunaBusca1", "valorBusca1", "colunaUpsert1", "valorUpsert1")
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| dataExt | string | Sim | Nome da Data Extension onde você quer atualizar ou inserir dados. |
| columnValuePairs | number | Sim | Número de pares coluna/valor usados como critério de busca (para localizar a linha). |
| searchColumnName | string | Sim | Nome da coluna usada como critério de busca. |
| searchValue | string | Sim | Valor que a função usa para encontrar a linha a ser atualizada ou inserida. Você pode especificar múltiplos pares de coluna/valor de busca. |
| columnToUpsert | string | Sim | Nome da coluna onde os dados serão atualizados ou inseridos. |
| upsertedValue | string | Sim | Valor a ser gravado na coluna especificada. Você pode especificar múltiplos pares de coluna/valor para upsert. |

## Exemplo básico

Atualizando o endereço de e-mail e a cidade de um cliente em uma Data Extension de cadastro, buscando pelo CPF. Se o CPF não existir, uma nova linha é criada.

```ampscript
%%[

VAR @resultado
SET @resultado = UpsertData(
  "Cadastro_Clientes", 1,
  "CPF", "123.456.789-00",
  "Email", "joao.silva@email.com.br",
  "Cidade", "São Paulo",
  "Nome", "João Silva"
)

]%%
```

**Saída:**
```
1
```

## Exemplo avançado

Imagine uma CloudPage de atualização cadastral da **Lojas Vitória**. O cliente preenche um formulário com CPF e loja preferida (critérios compostos de busca), e a página atualiza ou cria o registro com os novos dados. Aqui usamos [RequestParameter](../sites-functions/requestparameter.md) para capturar os valores do formulário e [Now](../date-functions/now.md) para registrar a data da atualização.

```ampscript
%%[

VAR @cpf, @lojaPreferida, @nome, @email, @telefone, @dataAtualizacao, @resultado

SET @cpf = RequestParameter("cpf")
SET @lojaPreferida = RequestParameter("loja")
SET @nome = RequestParameter("nome")
SET @email = RequestParameter("email")
SET @telefone = RequestParameter("telefone")
SET @dataAtualizacao = Now()

/* Busca por 2 critérios: CPF + LojaPreferida */
SET @resultado = UpsertData(
  "Preferencias_Clientes", 2,
  "CPF", @cpf,
  "LojaPreferida", @lojaPreferida,
  "NomeCompleto", @nome,
  "Email", @email,
  "Telefone", @telefone,
  "DataAtualizacao", @dataAtualizacao
)

IF @resultado > 0 THEN
  Output(Concat("Cadastro salvo com sucesso! Registros afetados: ", @resultado))
ELSE
  Output("Não foi possível salvar o cadastro. Verifique os dados informados.")
ENDIF

]%%
```

**Saída (quando o registro é criado ou atualizado com sucesso):**
```
Cadastro salvo com sucesso! Registros afetados: 1
```

## Observações

> **⚠️ Atenção:** O valor do parâmetro `columnValuePairs` precisa corresponder exatamente à quantidade de pares coluna/valor de **busca** que você passar. Se houver divergência, a função lança uma exceção. Por exemplo, se você informar `2` mas passar apenas um par de busca, vai dar erro.

> **⚠️ Atenção:** Se o nome da coluna informado em `searchColumnName` não existir na Data Extension, a função produz uma exceção.

> **⚠️ Atenção:** Se o valor informado em `upsertedValue` for de um tipo diferente do tipo da coluna (`columnToUpsert`), a função **não** atualiza nem insere dados e retorna `0`. Por exemplo, se você passar um valor numérico para uma coluna do tipo texto, nada acontece — sem erro visível, apenas retorno `0`.

> **⚠️ Atenção:** Se a quantidade de parâmetros de busca (`searchColumnName` e `searchValue`) for diferente da quantidade de parâmetros de upsert (`columnToUpsert` e `upsertedValue`), a função só processa os pares de upsert para os quais existam pares de busca correspondentes. Os pares excedentes são ignorados. Você pode repetir os mesmos parâmetros de busca várias vezes se necessário.

> **💡 Dica:** A função `UpsertData` é permitida em **landing pages**, **microsites** e **mensagens SMS** (MobileConnect). Para upsert dentro de **e-mails**, use [UpsertDE](../data-extension-functions/upsertde.md).

## Funções relacionadas

- [UpsertDE](../data-extension-functions/upsertde.md) — versão equivalente para uso em e-mails
- [InsertData](../data-extension-functions/insertdata.md) — apenas insere, sem verificar duplicidade
- [UpdateData](../data-extension-functions/updatedata.md) — apenas atualiza registros existentes
- [DeleteData](../data-extension-functions/deletedata.md) — remove registros de uma Data Extension
- [Lookup](../data-extension-functions/lookup.md) — consulta valores em uma Data Extension
- [LookupRows](../data-extension-functions/lookuprows.md) — retorna múltiplas linhas de uma Data Extension