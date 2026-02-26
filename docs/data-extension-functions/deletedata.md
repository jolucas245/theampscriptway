---
title: DeleteData
sidebar_label: DeleteData
description: Deleta linhas de uma Data Extension e retorna o número de linhas deletadas, para uso em Landing Pages, Microsites e SMS.
---

# DeleteData

## Descrição

A função `DeleteData` deleta uma ou mais linhas de uma Data Extension com base nos critérios que você informar, e retorna o número de linhas que foram deletadas. É ideal para cenários em que você precisa remover registros dinamicamente — como limpar dados de campanhas expiradas, remover pedidos cancelados ou excluir inscrições em promoções. Essa função funciona em **Landing Pages (CloudPages)**, **Microsites** e **mensagens SMS no Mobile Connect**. Se você precisa deletar linhas dentro de um **e-mail**, use a função [DeleteDE](../data-extension-functions/deletede.md).

## Sintaxe

```ampscript
DeleteData("NomeDaDataExtension", "NomeColuna1", "Valor1" [, "NomeColuna2", "Valor2", ...])
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| dataExt | String | Sim | Nome da Data Extension que contém os dados que você quer deletar. |
| columnName1 | String | Sim | Nome da coluna usada como critério de busca para identificar as linhas a deletar. |
| valueToDelete1 | String | Sim | Valor que será comparado na coluna informada para determinar quais linhas serão deletadas. |
| columnNameN | String | Não | Colunas adicionais para critérios extras de busca. Você pode passar quantos pares coluna/valor precisar. |
| valueToDeleteN | String | Não | Valores correspondentes às colunas adicionais. |

## Exemplo básico

Imagine que você tem uma Data Extension chamada **"Cupons_BlackFriday"** com os seguintes dados:

| CPF | NomeCliente | Cupom | ValorDesconto |
|-----|-------------|-------|---------------|
| 123.456.789-00 | João Silva | BF2024-JS | R$ 50,00 |
| 987.654.321-00 | Maria Santos | BF2024-MS | R$ 75,00 |
| 456.789.123-00 | Carlos Oliveira | BF2024-CO | R$ 30,00 |

Você quer remover o cupom da Maria Santos porque ela já utilizou:

```ampscript
%%[
VAR @linhasDeletadas
SET @linhasDeletadas = DeleteData("Cupons_BlackFriday", "CPF", "987.654.321-00")
]%%

Registros removidos: %%=v(@linhasDeletadas)=%%
```

**Saída:**
```
Registros removidos: 1
```

Após a execução, a Data Extension fica assim:

| CPF | NomeCliente | Cupom | ValorDesconto |
|-----|-------------|-------|---------------|
| 123.456.789-00 | João Silva | BF2024-JS | R$ 50,00 |
| 456.789.123-00 | Carlos Oliveira | BF2024-CO | R$ 30,00 |

## Exemplo avançado

Agora vamos a um cenário mais completo. A **MegaStore** tem uma Data Extension chamada **"Lista_Desejos"** com produtos favoritados pelos clientes:

| Email | Categoria | Produto | Preco |
|-------|-----------|---------|-------|
| joao@email.com.br | Eletrônicos | Smart TV 55" | R$ 2.499,00 |
| joao@email.com.br | Casa | Aspirador Robô | R$ 1.899,00 |
| maria@email.com.br | Eletrônicos | Notebook Gamer | R$ 5.999,00 |
| carlos@email.com.br | Casa | Fritadeira Air | R$ 499,00 |
| carlos@email.com.br | Eletrônicos | Fone Bluetooth | R$ 299,00 |
| ana@email.com.br | Casa | Cafeteira Expresso | R$ 899,00 |

Imagine que, numa CloudPage de gerenciamento de lista de desejos, o cliente quer remover todos os itens da categoria "Casa" vinculados ao seu e-mail. Ao mesmo tempo, queremos confirmar a exclusão e mostrar quantos itens restam:

```ampscript
%%[
VAR @emailCliente, @categoria, @deletados, @restantes

SET @emailCliente = RequestParameter("email")
SET @categoria = RequestParameter("categoria")

/* Deleta os itens da categoria informada para o cliente */
SET @deletados = DeleteData(
  "Lista_Desejos",
  "Email", @emailCliente,
  "Categoria", @categoria
)

/* Consulta quantos itens ainda restam na lista do cliente */
SET @restantes = LookupRows("Lista_Desejos", "Email", @emailCliente)
]%%

<h2>Pronto, tudo certo!</h2>
<p>Removemos %%=v(@deletados)=%% item(ns) da categoria "%%=v(@categoria)=%%" da sua lista de desejos.</p>
<p>Você ainda tem %%=RowCount(@restantes)=%% item(ns) na sua lista.</p>
<p><a href="%%=RedirectTo(CloudPagesURL(456))=%%">Voltar para minha lista</a></p>
```

**Saída (para carlos@email.com.br removendo "Casa"):**
```
Pronto, tudo certo!
Removemos 1 item(ns) da categoria "Casa" da sua lista de desejos.
Você ainda tem 1 item(ns) na sua lista.

Voltar para minha lista
```

Após a execução, a Data Extension fica assim:

| Email | Categoria | Produto | Preco |
|-------|-----------|---------|-------|
| joao@email.com.br | Eletrônicos | Smart TV 55" | R$ 2.499,00 |
| joao@email.com.br | Casa | Aspirador Robô | R$ 1.899,00 |
| maria@email.com.br | Eletrônicos | Notebook Gamer | R$ 5.999,00 |
| carlos@email.com.br | Eletrônicos | Fone Bluetooth | R$ 299,00 |
| ana@email.com.br | Casa | Cafeteira Expresso | R$ 899,00 |

## Observações

- **Não funciona em e-mails.** Use a função [DeleteDE](../data-extension-functions/deletede.md) se precisar deletar registros no contexto de envio de e-mail.
- **Funciona em Landing Pages (CloudPages), Microsites e mensagens SMS** (Mobile Connect).
- A função retorna o **número de linhas deletadas** como um valor inteiro. Se nenhuma linha corresponder aos critérios, o retorno será `0`.
- Você pode passar **múltiplos pares coluna/valor** para refinar o critério de exclusão. Todos os critérios funcionam com lógica **AND** — ou seja, a linha precisa corresponder a **todos** os critérios informados para ser deletada.
- **Cuidado:** a exclusão é permanente. Não existe "desfazer". Antes de deletar, considere fazer um lookup para confirmar os dados ou implementar uma lógica de confirmação na sua CloudPage.
- Se a Data Extension informada não existir ou o nome da coluna estiver errado, a função vai gerar um erro. Considere usar [RaiseError](../utility-functions/raiseerror.md) para tratamento de erros em cenários críticos.
- O nome da Data Extension é **case-insensitive**, mas vale manter consistência para facilitar a manutenção do código.

## Funções relacionadas

- [DeleteDE](../data-extension-functions/deletede.md) — Versão equivalente para uso em contexto de **e-mail**.
- [InsertData](../data-extension-functions/insertdata.md) — Insere uma nova linha em uma Data Extension (Landing Pages, Microsites, SMS).
- [UpdateData](../data-extension-functions/updatedata.md) — Atualiza linhas existentes em uma Data Extension (Landing Pages, Microsites, SMS).
- [UpsertData](../data-extension-functions/upsertdata.md) — Insere ou atualiza uma linha em uma Data Extension (Landing Pages, Microsites, SMS).
- [LookupRows](../data-extension-functions/lookuprows.md) — Busca linhas em uma Data Extension com base em critérios de filtro.
- [RowCount](../data-extension-functions/rowcount.md) — Retorna o número de linhas de um conjunto de resultados.
- [RequestParameter](../sites-functions/requestparameter.md) — Captura parâmetros de requisição em CloudPages.
- [DataExtensionRowCount](../data-extension-functions/dataextensionrowcount.md) — Retorna o total de linhas de uma Data Extension inteira.