---
title: UpsertDE
sidebar_label: UpsertDE
description: Atualiza dados em uma Data Extension se encontrar correspondência nas colunas de busca, ou insere uma nova linha caso não encontre.
---

# UpsertDE

## Descrição

A função `UpsertDE()` faz um "upsert" em uma Data Extension — ou seja, ela **atualiza** uma linha existente se encontrar correspondência nos critérios de busca, ou **insere** uma nova linha caso não encontre nenhuma correspondência. É aquela função coringa que resolve dois problemas de uma vez: você não precisa verificar se o registro existe antes de decidir entre insert e update. Essa função não retorna nenhum valor de saída. Ela funciona **apenas em e-mails** — para usar em CloudPages, Landing Pages, microsites ou SMS (MobileConnect), use a função [UpsertData](../data-extension-functions/upsertdata.md).

## Sintaxe

```ampscript
UpsertDE("NomeDaDataExtension", quantidadeDeParesDeChave, "colunaBusca1", "valorBusca1", ["colunaBusca2", "valorBusca2", ...], "colunaUpsert1", "valorUpsert1", ["colunaUpsert2", "valorUpsert2", ...])
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| dataExt | string | Sim | Nome da Data Extension onde você quer atualizar ou inserir dados. |
| columnValuePairs | number | Sim | Quantidade de pares coluna/valor usados como critério de busca (chave). |
| searchColumnName1 | string | Sim | Nome da coluna usada como critério de busca. |
| searchValue1 | string | Sim | Valor que a função usa para encontrar a linha a ser atualizada. Se não encontrar, insere uma nova. |
| columnToUpsert1 | string | Sim | Nome da coluna onde o dado será atualizado ou inserido. |
| upsertedValue1 | string | Sim | Valor que será gravado na coluna especificada. |

> **Dica:** Você pode passar múltiplos pares de busca (`searchColumnName`/`searchValue`) e múltiplos pares de upsert (`columnToUpsert`/`upsertedValue`). Porém, a quantidade de pares de busca **deve corresponder** ao número informado em `columnValuePairs`, e a quantidade de pares de upsert deve ser igual ou menor que a quantidade de pares de busca.

## Exemplo básico

Imagine que você tem uma Data Extension chamada **"Clientes_Fidelidade"** com os dados de um programa de pontos da loja fictícia **Lojas Vitória**:

| CPF | Nome | Email | Pontos |
|---|---|---|---|
| 123.456.789-00 | João Silva | joao@email.com | 500 |
| 987.654.321-00 | Maria Santos | maria@email.com | 1200 |

Você quer atualizar os pontos do João (que já existe) e inserir um novo cliente, Carlos Oliveira (que ainda não existe):

```ampscript
%%[
/* Atualiza os pontos do João - registro já existe */
UpsertDE(
  "Clientes_Fidelidade", 1,
  "CPF", "123.456.789-00",
  "Pontos", "750"
)

/* Insere o Carlos - registro não existe, então será criado */
UpsertDE(
  "Clientes_Fidelidade", 1,
  "CPF", "456.789.123-00",
  "Pontos", "100"
)
]%%
```

**Saída:**

A função não gera saída visível no e-mail. Após a execução, a Data Extension fica assim:

| CPF | Nome | Email | Pontos |
|---|---|---|---|
| 123.456.789-00 | João Silva | joao@email.com | 750 |
| 987.654.321-00 | Maria Santos | maria@email.com | 1200 |
| 456.789.123-00 | | | 100 |

> Note que o registro do Carlos foi inserido apenas com CPF e Pontos — as demais colunas ficaram vazias porque não foram informadas no upsert.

## Exemplo avançado

Cenário real: a **MegaStore** envia um e-mail de confirmação de pedido durante a Black Friday. Ao enviar o e-mail, o sistema registra (ou atualiza) os dados do último pedido do cliente na Data Extension **"Ultimos_Pedidos"**.

A DE tem as seguintes colunas: `EmailCliente` (chave primária), `NomeCliente`, `NumeroPedido`, `ValorPedido`, `DataPedido`, `StatusFrete`.

```ampscript
%%[
VAR @email, @nome, @pedido, @valor, @dataHoje

SET @email = AttributeValue("EmailAddress")
SET @nome = AttributeValue("NomeCliente")
SET @pedido = AttributeValue("NumeroPedido")
SET @valor = AttributeValue("ValorPedido")
SET @dataHoje = FormatDate(Now(), "dd/MM/yyyy", "HH:mm")

/* Define frete grátis para compras acima de R$299 */
VAR @statusFrete
IF @valor >= 299 THEN
  SET @statusFrete = "Frete Grátis"
ELSE
  SET @statusFrete = "Frete Padrão"
ENDIF

/* Upsert com 1 par de busca (EmailCliente) e múltiplas colunas para gravar */
UpsertDE(
  "Ultimos_Pedidos", 1,
  "EmailCliente", @email,
  "NomeCliente", @nome
)

UpsertDE(
  "Ultimos_Pedidos", 1,
  "EmailCliente", @email,
  "NumeroPedido", @pedido
)

UpsertDE(
  "Ultimos_Pedidos", 1,
  "EmailCliente", @email,
  "ValorPedido", @valor
)

UpsertDE(
  "Ultimos_Pedidos", 1,
  "EmailCliente", @email,
  "DataPedido", @dataHoje
)

UpsertDE(
  "Ultimos_Pedidos", 1,
  "EmailCliente", @email,
  "StatusFrete", @statusFrete
)
]%%

Olá, %%=v(@nome)=%%! 🎉

Seu pedido #%%=v(@pedido)=%% foi confirmado!

Valor: R$ %%=FormatNumber(@valor, "N2")=%%
Status: %%=v(@statusFrete)=%%
Data: %%=v(@dataHoje)=%%

Obrigado por comprar na MegaStore!
```

**Saída (no e-mail):**

```
Olá, Maria Santos! 🎉

Seu pedido #BF2024-00789 foi confirmado!

Valor: R$ 459,90
Status: Frete Grátis
Data: 29/11/2024 - 14:32

Obrigado por comprar na MegaStore!
```

E a Data Extension **"Ultimos_Pedidos"** é atualizada (ou recebe um novo registro) com todos os dados do pedido.

## Exemplo com múltiplos pares de busca

Quando você precisa de uma chave composta (mais de uma coluna para identificar o registro), aumente o valor de `columnValuePairs`:

```ampscript
%%[
/* 
  DE "Estoque_Lojas" com chave composta: CodigoLoja + CodigoProduto
  Atualiza a quantidade em estoque e o preço
*/
UpsertDE(
  "Estoque_Lojas", 2,
  "CodigoLoja", "LV-SP-042",
  "CodigoProduto", "PROD-88210",
  "QuantidadeEstoque", "150",
  "PrecoAtual", "89.90"
)
]%%
```

Aqui, o `2` indica que existem dois pares de busca (`CodigoLoja` + `CodigoProduto`), e em seguida temos dois pares de upsert (`QuantidadeEstoque` + `PrecoAtual`).

## Observações

- **Funciona apenas em e-mails.** Para CloudPages, Landing Pages, microsites e SMS no MobileConnect, use [UpsertData](../data-extension-functions/upsertdata.md).
- **Não retorna valor.** A função não gera saída — ela apenas executa a operação na Data Extension silenciosamente.
- **O valor de `columnValuePairs` precisa bater.** Se você informar `2` mas passar apenas um par de busca (ou três), a função vai gerar uma exceção (erro).
- **Coluna de busca inexistente = erro.** Se o nome da coluna informado em `searchColumnName` não existir na Data Extension, a função vai lançar uma exceção.
- **Tipos de dados incompatíveis = falha silenciosa.** Se você passar um valor de tipo diferente do tipo da coluna (ex: texto para uma coluna numérica), a função **não** atualiza nem insere nada e retorna `0`. Fique atento a isso — não vai dar erro, mas também não vai gravar nada.
- **Quantidade de pares de busca ≠ quantidade de pares de upsert.** Se você informar, por exemplo, 2 pares de busca e 3 pares de upsert, **somente os 2 primeiros pares de upsert serão processados**. O terceiro par será ignorado. Você pode repetir os mesmos pares de upsert se necessário para contornar isso.
- **Cuidado com performance.** Cada chamada de `UpsertDE()` é uma operação individual. Se você precisa atualizar muitas colunas do mesmo registro, saiba que cada chamada adicional consome tempo de processamento no envio do e-mail.
- **Colunas não informadas no insert.** Quando a função insere um novo registro (porque não encontrou correspondência), apenas as colunas especificadas nos parâmetros de busca e upsert serão preenchidas. As demais colunas ficarão nulas/vazias.

## Funções relacionadas

- [UpsertData](../data-extension-functions/upsertdata.md) — mesma lógica de upsert, mas para uso em CloudPages, Landing Pages, microsites e SMS
- [InsertDE](../data-extension-functions/insertde.md) — insere uma nova linha na Data Extension (apenas insert, sem update)
- [UpdateDE](../data-extension-functions/updatede.md) — atualiza linhas existentes na Data Extension (apenas update, sem insert)
- [DeleteDE](../data-extension-functions/deletede.md) — remove linhas de uma Data Extension
- [InsertData](../data-extension-functions/insertdata.md) — insere dados em DEs em CloudPages, Landing Pages e SMS
- [UpdateData](../data-extension-functions/updatedata.md) — atualiza dados em DEs em CloudPages, Landing Pages e SMS
- [DeleteData](../data-extension-functions/deletedata.md) — remove dados em DEs em CloudPages, Landing Pages e SMS
- [Lookup](../data-extension-functions/lookup.md) — busca um valor em uma Data Extension
- [LookupRows](../data-extension-functions/lookuprows.md) — retorna múltiplas linhas de uma Data Extension
- [AttributeValue](../utility-functions/attributevalue.md) — recupera o valor de um atributo do subscriber ou da sendable DE
- [Now](../date-functions/now.md) — retorna a data e hora atuais do sistema
- [FormatDate](../date-functions/formatdate.md) — formata datas para exibição
- [FormatNumber](../string-functions/formatnumber.md) — formata números (útil para exibir valores em R$)