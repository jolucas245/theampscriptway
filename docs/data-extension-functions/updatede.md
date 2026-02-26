---
title: UpdateDE
sidebar_label: UpdateDE
description: Atualiza dados em uma ou mais colunas de uma linha existente em uma Data Extension durante o envio de e-mails.
---

<!-- generated-by-script -->

# UpdateDE

## Descrição

A função `UpdateDE()` atualiza dados em uma Data Extension. Você passa o nome da DE, os critérios de busca para encontrar a linha que quer atualizar e os novos valores para as colunas desejadas. Essa função **não retorna nenhuma saída visível** — ela simplesmente executa a atualização nos bastidores. É importante saber que ela funciona **apenas em contexto de e-mail**. Se você precisa atualizar dados em CloudPages, landing pages, microsites ou mensagens SMS, use a função [UpdateData](../data-extension-functions/updatedata.md).

## Sintaxe

```ampscript
UpdateDE(@dataExtension, columnValuePairs, searchColumnName1, searchValue1, [searchColumnName2, searchValue2, ...], columnToUpdate1, updatedValue1, [columnToUpdate2, updatedValue2, ...])
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| dataExt | string | Sim | Nome da Data Extension que contém os dados a serem atualizados. |
| columnValuePairs | número | Sim | Número de pares coluna/valor usados como critério de busca para localizar a linha. |
| searchColumnName | string | Sim | Nome da coluna usada na busca para identificar a linha a ser atualizada. Você pode especificar múltiplos pares de busca. |
| searchValue | string | Sim | Valor que a função usa para determinar qual linha atualizar. Deve corresponder ao `searchColumnName`. |
| columnToUpdate | string | Sim | Nome da coluna que terá o valor atualizado. Você pode especificar múltiplas colunas para atualizar. |
| updatedValue | string | Sim | Novo valor a ser gravado na coluna especificada em `columnToUpdate`. |

## Exemplo básico

Imagine que você tem uma Data Extension chamada **"Carrinho_Abandonado"** com os dados dos clientes que abandonaram o carrinho na **MegaStore**. Quando o cliente abre o e-mail de recuperação, você quer registrar que ele visualizou a mensagem.

**Data Extension "Carrinho_Abandonado" (antes):**

| EmailCliente | NomeCliente | ValorCarrinho | StatusEmail |
|---|---|---|---|
| joao.silva@email.com.br | João Silva | 459.90 | Enviado |
| maria.santos@email.com.br | Maria Santos | 129.00 | Enviado |
| carlos.oliveira@email.com.br | Carlos Oliveira | 899.50 | Enviado |

```ampscript
%%[
UpdateDE(
  "Carrinho_Abandonado", 1,
  "EmailCliente", "joao.silva@email.com.br",
  "StatusEmail", "Visualizado"
)
]%%
```

**Data Extension "Carrinho_Abandonado" (depois):**

| EmailCliente | NomeCliente | ValorCarrinho | StatusEmail |
|---|---|---|---|
| joao.silva@email.com.br | João Silva | 459.90 | **Visualizado** |
| maria.santos@email.com.br | Maria Santos | 129.00 | Enviado |
| carlos.oliveira@email.com.br | Carlos Oliveira | 899.50 | Enviado |

**Saída:**
```
(nenhuma saída visível no e-mail — a atualização acontece nos bastidores)
```

## Exemplo avançado

Agora um cenário mais completo: a **Conecta Telecom** envia um e-mail de confirmação de upgrade de plano. Quando o assinante recebe o e-mail, a DE é atualizada com o novo plano, o novo valor mensal e a data da alteração. Aqui atualizamos **múltiplas colunas de uma vez**.

**Data Extension "Assinantes_Planos" (antes):**

| CPF | NomeAssinante | Plano | ValorMensal | DataAlteracao |
|---|---|---|---|---|
| 123.456.789-00 | João Silva | Básico 50MB | 79.90 | 01/03/2024 |
| 987.654.321-00 | Maria Santos | Plus 200MB | 119.90 | 15/01/2024 |
| 456.789.123-00 | Carlos Oliveira | Básico 50MB | 79.90 | 20/02/2024 |

```ampscript
%%[
VAR @cpf, @novoPlano, @novoValor, @dataHoje

SET @cpf = AttributeValue("CPF")
SET @novoPlano = "Ultra 500MB"
SET @novoValor = "199.90"
SET @dataHoje = FormatDate(Now(), "dd/MM/yyyy")

UpdateDE(
  "Assinantes_Planos", 1,
  "CPF", @cpf,
  "Plano", @novoPlano,
  "ValorMensal", @novoValor,
  "DataAlteracao", @dataHoje
)
]%%

<p>Olá, seu plano foi atualizado com sucesso para <b>%%=v(@novoPlano)=%%</b>!</p>
<p>Novo valor mensal: <b>R$ %%=v(@novoValor)=%%</b></p>
<p>Data da alteração: <b>%%=v(@dataHoje)=%%</b></p>
```

**Saída no e-mail (se o CPF do assinante for 123.456.789-00):**
```
Olá, seu plano foi atualizado com sucesso para Ultra 500MB!
Novo valor mensal: R$ 199.90
Data da alteração: 25/12/2024
```

**Data Extension "Assinantes_Planos" (depois):**

| CPF | NomeAssinante | Plano | ValorMensal | DataAlteracao |
|---|---|---|---|---|
| 123.456.789-00 | João Silva | **Ultra 500MB** | **199.90** | **25/12/2024** |
| 987.654.321-00 | Maria Santos | Plus 200MB | 119.90 | 15/01/2024 |
| 456.789.123-00 | Carlos Oliveira | Básico 50MB | 79.90 | 20/02/2024 |

## Observações

- **Contexto de uso:** `UpdateDE()` funciona **apenas em e-mails**. Para CloudPages, landing pages, microsites e SMS (MobileConnect), use [UpdateData](../data-extension-functions/updatedata.md).
- **Sem saída visível:** A função não produz nenhum output renderizado no e-mail. Ela apenas executa a operação de atualização.
- **`columnValuePairs` incorreto:** Se o número informado no parâmetro `columnValuePairs` não bater com a quantidade real de pares de busca (searchColumnName/searchValue) passados na função, será retornada uma exceção (erro).
- **Coluna de busca inexistente:** Se o nome da coluna informado em `searchColumnName` não existir na Data Extension, a função retorna uma exceção.
- **Valor de busca não encontrado:** Se o valor informado em `searchValue` não for encontrado na coluna especificada, nenhum dado é atualizado e a função retorna `0`.
- **Tipo de dado incompatível:** Se o valor informado em `updatedValue` tiver um tipo diferente do tipo da coluna de destino (por exemplo, passar texto em uma coluna numérica), nenhum dado é atualizado e a função retorna `0`.
- **Desbalanceamento entre pares de busca e atualização:** Se o número de parâmetros de busca (searchColumnName/searchValue) for diferente do número de parâmetros de atualização (columnToUpdate/updatedValue), a função atualiza apenas as colunas que tiverem pares de busca correspondentes. Por exemplo, se você passar 2 pares de busca e 3 pares de atualização, apenas os 2 primeiros pares de atualização serão processados. Você pode repetir os mesmos parâmetros de atualização se necessário.
- **Múltiplas colunas:** Você pode atualizar várias colunas de uma vez na mesma chamada, basta informar múltiplos pares de columnToUpdate/updatedValue após os critérios de busca.

## Funções relacionadas

- [UpdateData](../data-extension-functions/updatedata.md) — Mesma finalidade que `UpdateDE`, mas para uso em CloudPages, landing pages, microsites e SMS.
- [UpsertDE](../data-extension-functions/upsertde.md) — Atualiza a linha se existir ou insere uma nova se não existir (em e-mails).
- [InsertDE](../data-extension-functions/insertde.md) — Insere uma nova linha em uma Data Extension (em e-mails).
- [DeleteDE](../data-extension-functions/deletede.md) — Remove uma linha de uma Data Extension (em e-mails).
- [Lookup](../data-extension-functions/lookup.md) — Busca um valor específico em uma Data Extension.
- [LookupRows](../data-extension-functions/lookuprows.md) — Retorna múltiplas linhas de uma Data Extension com base em critérios de busca.
- [AttributeValue](../utility-functions/attributevalue.md) — Recupera o valor de um atributo do assinante ou coluna da DE de envio.
- [Now](../date-functions/now.md) — Retorna a data e hora atuais do sistema.
- [FormatDate](../date-functions/formatdate.md) — Formata uma data no padrão desejado.