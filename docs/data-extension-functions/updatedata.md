---
title: UpdateData
sidebar_label: UpdateData
description: Atualiza dados em uma Data Extension e retorna o número de linhas atualizadas, para uso em CloudPages, landing pages, microsites e SMS.
---

# UpdateData

## Descrição

A função `UpdateData` atualiza dados em uma Data Extension e retorna o número de linhas que foram atualizadas. Você usa ela pra modificar valores de uma ou mais colunas em registros existentes, localizando a linha correta através de critérios de busca (coluna + valor). É a função ideal quando você precisa atualizar dados em **CloudPages, landing pages, microsites e mensagens SMS (MobileConnect)**. Se precisar atualizar dados dentro de um **e-mail**, use a função [UpdateDE](../data-extension-functions/updatede.md).

## Sintaxe

```ampscript
UpdateData("NomeDaDataExtension", numeroDeParesBusca, "colunaBusca1", "valorBusca1", "colunaAtualizar1", "valorAtualizar1")
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| dataExt | string | Sim | Nome da Data Extension que contém os dados a serem atualizados. |
| columnValuePairs | number | Sim | Número de pares coluna/valor usados como critério de busca para localizar a linha. |
| searchColumnName1 | string | Sim | Nome da coluna usada para buscar a linha que será atualizada. |
| searchValue1 | string | Sim | Valor que identifica qual linha deve ser atualizada na coluna de busca. Você pode especificar múltiplos pares de coluna/valor de busca. |
| columnToUpdate1 | string | Sim | Nome da coluna que terá o dado atualizado. |
| updatedValue1 | string | Sim | Novo valor a ser gravado na coluna especificada. Você pode especificar múltiplos pares de coluna/valor para atualizar. |

## Exemplo básico

Imagine que você tem uma Data Extension chamada **"Pedidos"** com os seguintes dados:

| PedidoId | Cliente | Email | Status | ValorTotal |
|---|---|---|---|---|
| 1001 | João Silva | joao@email.com.br | Pendente | 299.90 |
| 1002 | Maria Santos | maria@email.com.br | Enviado | 149.50 |
| 1003 | Carlos Oliveira | carlos@email.com.br | Pendente | 520.00 |

Você quer atualizar o status do pedido 1001 para "Enviado":

```ampscript
%%[
VAR @resultado
SET @resultado = UpdateData(
  "Pedidos",
  1,
  "PedidoId", "1001",
  "Status", "Enviado"
)
]%%

Linhas atualizadas: %%=v(@resultado)=%%
```

**Saída:**
```
Linhas atualizadas: 1
```

Agora a Data Extension fica assim:

| PedidoId | Cliente | Email | Status | ValorTotal |
|---|---|---|---|---|
| 1001 | João Silva | joao@email.com.br | Enviado | 299.90 |
| 1002 | Maria Santos | maria@email.com.br | Enviado | 149.50 |
| 1003 | Carlos Oliveira | carlos@email.com.br | Pendente | 520.00 |

## Exemplo avançado

Agora um cenário mais real: uma CloudPage de "Central do Cliente" da **Lojas Vitória** onde o cliente atualiza seus dados cadastrais. Quando o formulário é enviado, você atualiza múltiplas colunas de uma vez na Data Extension **"Clientes_Fidelidade"**.

Dados atuais da DE:

| CPF | Nome | Telefone | CEP | PontosAcumulados | UltimaAtualizacao |
|---|---|---|---|---|---|
| 123.456.789-00 | João Silva | (11) 98888-7777 | 01310-100 | 2500 | 10/01/2025 |
| 987.654.321-00 | Maria Santos | (21) 97777-6666 | 20040-020 | 1800 | 15/02/2025 |

O João acessa a CloudPage e atualiza o telefone e o CEP:

```ampscript
%%[
VAR @cpf, @novoTelefone, @novoCEP, @dataAtual, @resultado

SET @cpf = RequestParameter("cpf")
SET @novoTelefone = RequestParameter("telefone")
SET @novoCEP = RequestParameter("cep")
SET @dataAtual = FormatDate(Now(), "dd/MM/yyyy")

/* Verifica se o CPF foi informado antes de atualizar */
IF NOT Empty(@cpf) THEN

  SET @resultado = UpdateData(
    "Clientes_Fidelidade",
    1,
    "CPF", @cpf,
    "Telefone", @novoTelefone,
    "CEP", @novoCEP,
    "UltimaAtualizacao", @dataAtual
  )

  IF @resultado > 0 THEN
]%%
    <div class="sucesso">
      <h2>Dados atualizados com sucesso!</h2>
      <p>Obrigado, seus dados cadastrais no programa Vitória Pontos foram atualizados.</p>
      <p>Novo telefone: %%=v(@novoTelefone)=%%</p>
      <p>Novo CEP: %%=v(@novoCEP)=%%</p>
    </div>
%%[
  ELSE
]%%
    <div class="erro">
      <p>Não encontramos seu CPF em nossa base. Verifique e tente novamente.</p>
    </div>
%%[
  ENDIF

ELSE
]%%
  <div class="erro">
    <p>Por favor, informe seu CPF para atualizar os dados.</p>
  </div>
%%[
ENDIF
]%%
```

**Saída (quando o CPF 123.456.789-00 é enviado com telefone (11) 99999-1234 e CEP 04538-133):**
```
Dados atualizados com sucesso!
Obrigado, seus dados cadastrais no programa Vitória Pontos foram atualizados.
Novo telefone: (11) 99999-1234
Novo CEP: 04538-133
```

A Data Extension fica assim após a atualização:

| CPF | Nome | Telefone | CEP | PontosAcumulados | UltimaAtualizacao |
|---|---|---|---|---|---|
| 123.456.789-00 | João Silva | (11) 99999-1234 | 04538-133 | 2500 | 28/06/2025 |
| 987.654.321-00 | Maria Santos | (21) 97777-6666 | 20040-020 | 1800 | 15/02/2025 |

## Observações

- **Contexto de uso:** `UpdateData` funciona em **CloudPages, landing pages, microsites e mensagens SMS (MobileConnect)**. Ela **não funciona em e-mails**. Para atualizar dados dentro de e-mails, use [UpdateDE](../data-extension-functions/updatede.md).
- **Retorno:** A função retorna um número inteiro com a quantidade de linhas atualizadas. Se nenhuma linha for encontrada com os critérios de busca, retorna `0`.
- **Parâmetro `columnValuePairs` incorreto:** Se o valor informado em `columnValuePairs` não bater com o número real de pares de busca (coluna/valor) passados na função, ela gera uma exceção (erro).
- **Coluna de busca inexistente:** Se você informar um nome de coluna em `searchColumnName` que não existe na Data Extension, a função gera uma exceção.
- **Valor de busca não encontrado:** Se o valor em `searchValue` não for encontrado na coluna especificada, nenhum dado é atualizado e a função retorna `0`.
- **Tipo de dado incompatível:** Se o valor informado em `updatedValue` tiver um tipo de dado diferente da coluna de destino (por exemplo, passar texto numa coluna numérica), a função não atualiza nada e retorna `0`.
- **Pares de busca vs. pares de atualização desbalanceados:** Se o número de pares de busca (`searchColumnName`/`searchValue`) for diferente do número de pares de atualização (`columnToUpdate`/`updatedValue`), a função atualiza apenas as colunas para as quais existem pares de busca correspondentes. Por exemplo, se você passar 2 pares de busca e 3 pares de atualização, somente os 2 primeiros pares de atualização serão executados. Você pode repetir os mesmos pares de busca se necessário.
- **Múltiplas colunas:** Você pode atualizar várias colunas de uma vez na mesma chamada, bastando adicionar mais pares de `columnToUpdate`/`updatedValue` ao final da função.
- **Cuidado com performance:** Se a Data Extension for muito grande, considere garantir que as colunas de busca estejam indexadas para melhorar a performance.

## Funções relacionadas

- [UpdateDE](../data-extension-functions/updatede.md) — Mesma funcionalidade que `UpdateData`, mas para uso dentro de **e-mails**.
- [UpsertData](../data-extension-functions/upsertdata.md) — Insere ou atualiza dados em uma Data Extension (se a linha existe, atualiza; se não, insere).
- [InsertData](../data-extension-functions/insertdata.md) — Insere uma nova linha em uma Data Extension.
- [DeleteData](../data-extension-functions/deletedata.md) — Deleta linhas de uma Data Extension.
- [Lookup](../data-extension-functions/lookup.md) — Busca um valor em uma Data Extension.
- [LookupRows](../data-extension-functions/lookuprows.md) — Retorna múltiplas linhas de uma Data Extension com base em critérios de busca.
- [UpsertDE](../data-extension-functions/upsertde.md) — Insere ou atualiza dados em uma Data Extension, para uso em e-mails.
- [InsertDE](../data-extension-functions/insertde.md) — Insere uma nova linha em uma Data Extension, para uso em e-mails.
- [DeleteDE](../data-extension-functions/deletede.md) — Deleta linhas de uma Data Extension, para uso em e-mails.
- [RequestParameter](../sites-functions/requestparameter.md) — Captura parâmetros de formulários e query strings em CloudPages.
- [Now](../date-functions/now.md) — Retorna a data e hora atuais do sistema.
- [FormatDate](../date-functions/formatdate.md) — Formata valores de data para exibição.
- [Empty](../utility-functions/empty.md) — Verifica se um valor está vazio ou nulo.