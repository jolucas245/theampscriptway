---
title: InsertDE
sidebar_label: InsertDE
description: Insere uma nova linha em uma Data Extension a partir de um contexto de envio de e-mail.
---

# InsertDE

## Descrição

A função `InsertDE` insere uma nova linha (registro) em uma Data Extension. Ela não retorna nenhum valor — apenas executa a inserção dos dados. Essa função é destinada ao uso em **e-mails**. Se você precisa inserir dados a partir de CloudPages, landing pages, microsites ou mensagens SMS (MobileConnect), use a função [InsertData](../data-extension-functions/insertdata.md). Você pode inserir múltiplas colunas de uma só vez, basta adicionar pares de nome de coluna e valor ao final da chamada da função.

## Sintaxe

```ampscript
InsertDE("NomeDaDataExtension", "coluna1", "valor1" [, "coluna2", "valor2", ...])
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| dataExt | string | Sim | O nome da Data Extension onde você quer inserir os dados. |
| columnName1 | string | Sim | O nome da primeira coluna onde o dado será inserido. |
| valueToInsert1 | string | Sim | O valor a ser inserido na coluna especificada. |
| columnNameN | string | Não | Nome de uma coluna adicional. Você pode adicionar quantos pares coluna/valor precisar. |
| valueToInsertN | string | Não | Valor correspondente à coluna adicional. |

## Exemplo básico

Imagine que você tem uma Data Extension chamada **Pedidos_Loja** com os seguintes dados:

| PedidoId | NomeCliente | Produto | Valor |
|---|---|---|---|
| 1001 | João Silva | Camiseta | 79.90 |
| 1002 | Maria Santos | Tênis | 299.90 |

Para inserir um novo pedido durante o envio de um e-mail:

```ampscript
%%[
InsertDE(
  "Pedidos_Loja",
  "PedidoId", "1003",
  "NomeCliente", "Carlos Oliveira",
  "Produto", "Mochila",
  "Valor", "149.90"
)
]%%
```

**Saída:**

A função não gera nenhuma saída visível no e-mail. Porém, a Data Extension **Pedidos_Loja** agora contém:

| PedidoId | NomeCliente | Produto | Valor |
|---|---|---|---|
| 1001 | João Silva | Camiseta | 79.90 |
| 1002 | Maria Santos | Tênis | 299.90 |
| 1003 | Carlos Oliveira | Mochila | 149.90 |

## Exemplo avançado

Vamos a um cenário real: a **MegaStore** está rodando uma campanha de **Black Friday** e quer registrar em uma Data Extension de log cada subscriber que abriu o e-mail promocional. A DE **Log_Abertura_BlackFriday** tem as colunas `EmailAssinante`, `NomeAssinante`, `DataAbertura` e `Campanha`.

```ampscript
%%[
VAR @email, @nome, @dataAtual, @campanha

SET @email = AttributeValue("emailaddr")
SET @nome = AttributeValue("SubscriberKey")
SET @dataAtual = FormatDate(Now(), "dd/MM/yyyy HH:mm", "Brasilia Standard Time")
SET @campanha = "BlackFriday2024"

/* Verifica se o e-mail do subscriber não está vazio antes de inserir */
IF NOT Empty(@email) THEN
  InsertDE(
    "Log_Abertura_BlackFriday",
    "EmailAssinante", @email,
    "NomeAssinante", @nome,
    "DataAbertura", @dataAtual,
    "Campanha", @campanha
  )
ENDIF
]%%
```

**Saída:**

Nenhuma saída visível no e-mail. A Data Extension **Log_Abertura_BlackFriday** recebe um novo registro, por exemplo:

| EmailAssinante | NomeAssinante | DataAbertura | Campanha |
|---|---|---|---|
| joao.silva@email.com.br | João Silva | 29/11/2024 09:32 | BlackFriday2024 |

Outro cenário prático: a **Conecta Telecom** quer registrar a participação de clientes em um sorteio de **Dia das Mães**. Ao receber o e-mail, o subscriber é automaticamente inscrito:

```ampscript
%%[
VAR @cpf, @nomeCliente, @telefone, @codigoSorteio

SET @cpf = AttributeValue("CPF")
SET @nomeCliente = AttributeValue("NomeCompleto")
SET @telefone = AttributeValue("Telefone")
SET @codigoSorteio = Concat("MAE2024-", GUID())

InsertDE(
  "Sorteio_DiaDasMaes",
  "CPF", @cpf,
  "Nome", @nomeCliente,
  "Telefone", @telefone,
  "CodigoSorteio", @codigoSorteio,
  "DataInscricao", Now()
)
]%%

<p>Oi, %%=v(@nomeCliente)=%%! 🎉</p>
<p>Você está participando do nosso sorteio de Dia das Mães!</p>
<p>Seu código de participação é: <strong>%%=v(@codigoSorteio)=%%</strong></p>
<p>Boa sorte! 💐</p>
```

**Saída no e-mail:**

```
Oi, Ana Beatriz Ferreira! 🎉
Você está participando do nosso sorteio de Dia das Mães!
Seu código de participação é: MAE2024-a3f2b1c4-5d6e-7f89-0abc-def123456789
Boa sorte! 💐
```

## Observações

- **A função não retorna nenhum valor.** Ela apenas executa a inserção — não exibe nada no e-mail.
- **Use apenas em contexto de e-mail.** Para CloudPages, landing pages, microsites e SMS no MobileConnect, utilize a função [InsertData](../data-extension-functions/insertdata.md).
- **Sempre insere uma nova linha.** Se você precisa atualizar um registro existente ou inserir caso não exista, considere usar [UpdateDE](../data-extension-functions/updatede.md) ou [UpsertDE](../data-extension-functions/upsertde.md).
- **Colunas obrigatórias da DE precisam ser preenchidas.** Se a Data Extension tem campos obrigatórios (como uma Primary Key) e você não os informar, a inserção vai falhar.
- **Cuidado com inserções duplicadas.** Se a Data Extension tiver uma Primary Key e você tentar inserir um registro com um valor de chave que já existe, a operação vai gerar um erro. Nesse caso, use [UpsertDE](../data-extension-functions/upsertde.md).
- **Os pares coluna/valor são passados em sequência.** Você pode inserir quantas colunas precisar — basta ir adicionando pares `"nomeColuna", "valor"` ao final da chamada.
- **Performance em envios de alto volume:** tenha cuidado ao usar `InsertDE` em e-mails enviados para listas muito grandes, pois cada envio individual vai executar uma operação de escrita na Data Extension.
- **O nome da Data Extension é case-insensitive**, mas é uma boa prática manter a grafia exata para facilitar a manutenção do código.

## Funções relacionadas

- [InsertData](../data-extension-functions/insertdata.md) — Equivalente ao `InsertDE`, mas para uso em CloudPages, landing pages, microsites e SMS.
- [UpdateDE](../data-extension-functions/updatede.md) — Atualiza registros existentes em uma Data Extension (contexto de e-mail).
- [UpsertDE](../data-extension-functions/upsertde.md) — Insere ou atualiza um registro dependendo se já existe (contexto de e-mail).
- [DeleteDE](../data-extension-functions/deletede.md) — Remove registros de uma Data Extension (contexto de e-mail).
- [Lookup](../data-extension-functions/lookup.md) — Busca um valor específico em uma Data Extension.
- [LookupRows](../data-extension-functions/lookuprows.md) — Retorna múltiplas linhas de uma Data Extension com base em critérios de busca.
- [Empty](../utility-functions/empty.md) — Verifica se um valor está vazio, útil para validar antes de inserir.
- [Now](../date-functions/now.md) — Retorna a data e hora atuais, útil para registrar timestamps na inserção.
- [GUID](../utility-functions/guid.md) — Gera um identificador único, útil para criar chaves primárias ou códigos únicos.