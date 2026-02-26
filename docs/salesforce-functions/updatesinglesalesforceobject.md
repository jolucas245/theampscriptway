---
title: UpdateSingleSalesforceObject
sidebar_label: UpdateSingleSalesforceObject
description: Atualiza um registro em um objeto do Salesforce CRM diretamente a partir do Marketing Cloud usando Marketing Cloud Connect.
---

# UpdateSingleSalesforceObject

## Descrição

A função `UpdateSingleSalesforceObject` atualiza um registro existente em um objeto do Salesforce CRM (Sales Cloud ou Service Cloud). Para usá-la, você precisa ter o **Marketing Cloud Connect** configurado e integrado com a sua org Salesforce. A função faz uma requisição SOAP para a sua org Salesforce — e essas requisições **não** contam nos limites de uso de API da sua org. Se a atualização for bem-sucedida, a função retorna `1`; caso contrário, retorna `0`.

## Sintaxe

```ampscript
UpdateSingleSalesforceObject(objectName, idToUpdate, fieldName1, fieldValue1 [, fieldName2, fieldValue2, ...])
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| objectName | String | Sim | O nome da API do objeto Salesforce a ser atualizado (ex: "Lead", "Contact", "Account", "Opportunity", ou objetos customizados como "Pedido__c"). |
| idToUpdate | String | Sim | O ID do registro Salesforce (18 ou 15 caracteres) que você quer atualizar. |
| fieldName | String | Sim | O nome da API do campo que você quer atualizar. Você pode passar múltiplos pares de campo/valor. |
| fieldValue | String | Sim | O valor que será atribuído ao campo correspondente. Você pode passar múltiplos pares de campo/valor. |

## Exemplo básico

Imagine que o **Banco Meridional** precisa atualizar o e-mail de um Lead no Salesforce quando o cliente corrige seus dados via e-mail:

```ampscript
%%[
VAR @resultado, @idLead
SET @idLead = "00Q00003yAEjAAO"

SET @resultado = UpdateSingleSalesforceObject(
  "Lead",
  @idLead,
  "Email", "joao.silva@email.com.br"
)

IF @resultado == 1 THEN
]%%

Registro com ID %%=v(@idLead)=%% atualizado com sucesso.

%%[ ELSE ]%%

Registro com ID %%=v(@idLead)=%% não foi atualizado.

%%[ ENDIF ]%%
```

**Saída (em caso de sucesso):**
```
Registro com ID 00Q00003yAEjAAO atualizado com sucesso.
```

## Exemplo avançado

A **Lojas Vitória** tem um programa de fidelidade e quer atualizar o objeto customizado `Fidelidade__c` no Salesforce toda vez que o cliente acumula pontos após uma compra. Esse código roda em uma **CloudPage** que recebe o ID do registro e o valor da compra:

```ampscript
%%[
VAR @idFidelidade, @valorCompra, @pontosNovos, @pontosAtuais, @totalPontos, @resultado

SET @idFidelidade = RequestParameter("fid")
SET @valorCompra = RequestParameter("valor")

/* Busca os pontos atuais do registro no Salesforce */
SET @registros = RetrieveSalesforceObjects(
  "Fidelidade__c",
  "Pontos__c,Nome_Cliente__c",
  "Id", "=", @idFidelidade
)

IF RowCount(@registros) > 0 THEN
  SET @linha = Row(@registros, 1)
  SET @pontosAtuais = Field(@linha, "Pontos__c")
  SET @nomeCliente = Field(@linha, "Nome_Cliente__c")

  /* A cada R$1 gasto, o cliente ganha 10 pontos */
  SET @pontosNovos = Multiply(@valorCompra, 10)
  SET @totalPontos = Add(@pontosAtuais, @pontosNovos)

  /* Atualiza múltiplos campos de uma vez */
  SET @resultado = UpdateSingleSalesforceObject(
    "Fidelidade__c",
    @idFidelidade,
    "Pontos__c", @totalPontos,
    "Ultima_Compra__c", Now(),
    "Valor_Ultima_Compra__c", @valorCompra,
    "Status__c", "Ativo"
  )

  IF @resultado == 1 THEN
]%%

<h2>Parabéns, %%=v(@nomeCliente)=%%!</h2>
<p>Você acumulou <strong>%%=v(@pontosNovos)=%%</strong> pontos com a sua compra de <strong>%%=FormatCurrency(@valorCompra, "R$", 2)=%%</strong>.</p>
<p>Seu saldo total agora é de <strong>%%=FormatNumber(@totalPontos, "N0")=%%</strong> pontos!</p>

%%[ ELSE ]%%

<p>Ops, não conseguimos atualizar seus pontos. Tente novamente ou entre em contato com nosso SAC.</p>

%%[ ENDIF ]%%

%%[ ELSE ]%%

<p>Registro de fidelidade não encontrado.</p>

%%[ ENDIF ]%%
```

**Saída (em caso de sucesso, supondo R$299,90 de compra e 1.500 pontos existentes):**
```
Parabéns, Maria Santos!
Você acumulou 2999 pontos com a sua compra de R$299,90.
Seu saldo total agora é de 4.499 pontos!
```

## Exemplo com proteção de preview

Quando você visualiza (preview) um e-mail ou página que usa essa função, ela **executa de verdade** a atualização no Salesforce — como se estivesse rodando em um envio real. Para evitar que previews alterem dados ao vivo, use a variável de sistema `_messagecontext`:

```ampscript
%%[
IF _messagecontext != "PREVIEW" THEN

  SET @resultado = UpdateSingleSalesforceObject(
    "Contact",
    @sfContactId,
    "Phone", "(11) 99999-8888",
    "MailingPostalCode", "01310-100"
  )

ENDIF
]%%
```

## Observações

- **Requer Marketing Cloud Connect:** essa função só funciona se você tiver a integração entre Marketing Cloud e Sales Cloud ou Service Cloud configurada e ativa. Sem isso, ela não vai funcionar.
- **Performance em envios grandes:** a Salesforce recomenda **minimizar o uso** dessa função em envios de e-mail. Em envios muito grandes, o uso intensivo pode fazer com que o envio falhe ou não seja concluído. Se possível, prefira processos em batch ou Automations para atualizações em massa.
- **Requisições SOAP:** as chamadas feitas por essa função são via SOAP API e **não** contam nos limites de API da sua org Salesforce.
- **Retorno:** retorna `1` se a atualização for bem-sucedida e `0` se falhar. Sempre valide o retorno para tratar erros.
- **Múltiplos campos:** você pode atualizar vários campos de uma vez, basta adicionar pares adicionais de `fieldName, fieldValue` após os dois primeiros parâmetros obrigatórios.
- **Cuidado com preview:** ao fazer preview de um e-mail ou CloudPage que contenha essa função, a atualização será executada de verdade no Salesforce. Use a variável `_messagecontext` para proteger seus dados (veja o exemplo acima).
- **ID do registro:** use o ID completo de 18 caracteres do Salesforce sempre que possível para evitar problemas de case sensitivity. Você pode usar a função [LongSfid](../salesforce-functions/longsfid.md) para converter IDs de 15 para 18 caracteres.

## Funções relacionadas

- [CreateSalesforceObject](../salesforce-functions/createsalesforceobject.md) — cria um novo registro em um objeto do Salesforce
- [RetrieveSalesforceObjects](../salesforce-functions/retrievesalesforceobjects.md) — consulta e recupera registros de um objeto do Salesforce
- [LongSfid](../salesforce-functions/longsfid.md) — converte um ID Salesforce de 15 caracteres para o formato de 18 caracteres
- [UpdateDE](../data-extension-functions/updatede.md) — atualiza registros em uma Data Extension do Marketing Cloud
- [UpsertDE](../data-extension-functions/upsertde.md) — insere ou atualiza registros em uma Data Extension (upsert)
- [Row](../data-extension-functions/row.md) — retorna uma linha específica de um conjunto de resultados
- [Field](../data-extension-functions/field.md) — retorna o valor de um campo de uma linha de resultado
- [RowCount](../data-extension-functions/rowcount.md) — retorna a quantidade de linhas em um conjunto de resultados
- [RaiseError](../utility-functions/raiseerror.md) — gera um erro customizado e pode interromper o envio
- [Now](../date-functions/now.md) — retorna a data e hora atuais do sistema