---
title: InvokeDelete
sidebar_label: InvokeDelete
description: Invoca o método Delete em um API Object do Marketing Cloud e retorna o código de status da operação.
---

# InvokeDelete

## Descrição

A função `InvokeDelete` executa o método Delete em um API Object do Marketing Cloud Engagement, retornando o código de status da API. Você pode usar um ID, external ID ou key como referência do objeto a ser deletado. É a função que você utiliza quando precisa remover objetos da plataforma via AMPscript - como excluir um Subscriber ou outro objeto da API - com controle total sobre o status e possíveis erros da operação.

## Sintaxe

```ampscript
InvokeDelete(@apiObject, @statusMessage, @errorCode, @deleteOptionsObject)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| apiObject | API Object | Sim | O API Object que será deletado. |
| statusMessage | Variável AMPscript | Sim | Variável que armazena a mensagem de status retornada pela API. |
| errorCode | Variável AMPscript | Sim | Variável que armazena o código de erro retornado pela API. |
| deleteOptionsObject | API Object | Não | Um objeto API do tipo DeleteOptions para configurar opções da exclusão. |

## Retorno

Retorna o código de status da API (por exemplo, `"OK"` em caso de sucesso).

## Exemplo básico

Excluindo um Subscriber da conta do Marketing Cloud - cenário comum quando um cliente solicita remoção completa dos dados (LGPD, por exemplo).

```ampscript
%%[
VAR @subscriber, @statusCode, @statusMessage, @errorCode

SET @subscriber = CreateObject("Subscriber")
SetObjectProperty(@subscriber, "SubscriberKey", "joao.silva@lojsvitoria.com.br")

SET @statusCode = InvokeDelete(@subscriber, @statusMessage, @errorCode)

IF @statusCode == "OK" THEN
  Output(Concat("Subscriber removido com sucesso."))
ELSE
  Output(Concat("Erro: ", @statusMessage, " | Código: ", @errorCode))
ENDIF
]%%
```

**Saída (sucesso):**
```
Subscriber removido com sucesso.
```

**Saída (erro):**
```
Erro: Subscriber not found | Código: 12001
```

## Exemplo avançado

Cenário de uma régua de higienização da Conecta Telecom: ao processar uma CloudPage de solicitação de exclusão de dados, o sistema busca o assinante, tenta removê-lo e registra o resultado em uma Data Extension de auditoria.

```ampscript
%%[
VAR @emailCliente, @subscriber, @statusCode, @statusMessage, @errorCode
VAR @dataHora, @resultado

SET @emailCliente = RequestParameter("email")
SET @dataHora = FormatDate(Now(), "dd/MM/yyyy HH:mm", "BRT")

/* Cria o API Object do Subscriber */
SET @subscriber = CreateObject("Subscriber")
SetObjectProperty(@subscriber, "SubscriberKey", @emailCliente)
SetObjectProperty(@subscriber, "EmailAddress", @emailCliente)

/* Executa a exclusão */
SET @statusCode = InvokeDelete(@subscriber, @statusMessage, @errorCode)

IF @statusCode == "OK" THEN
  SET @resultado = "Removido"
  Output(Concat("Pronto, ", @emailCliente, "! Seus dados foram removidos em ", @dataHora, "."))
ELSE
  SET @resultado = Concat("Falha: ", @statusMessage, " (", @errorCode, ")")
  Output(Concat("Não foi possível processar a exclusão. Erro: ", @statusMessage))
ENDIF

/* Registra na DE de auditoria para compliance LGPD */
InsertDE(
  "Auditoria_Exclusao",
  "Email", @emailCliente,
  "DataSolicitacao", @dataHora,
  "StatusAPI", @statusCode,
  "Resultado", @resultado
)
]%%
```

**Saída (sucesso):**
```
Pronto, maria.santos@megastore.com.br! Seus dados foram removidos em 18/07/2025 14:32.
```

**Saída (erro):**
```
Não foi possível processar a exclusão. Erro: Subscriber not found
```

## Observações

> **⚠️ Atenção:** O `InvokeDelete` opera diretamente nos objetos da API do Marketing Cloud - não confunda com [DeleteDE](../data-extension-functions/deletede.md) ou [DeleteData](../data-extension-functions/deletedata.md), que removem registros de Data Extensions. O `InvokeDelete` é para API Objects como Subscriber, DataExtension, TriggeredSendDefinition, entre outros.

> **💡 Dica:** Sempre verifique se o código de status retornado é `"OK"` antes de considerar a operação como bem-sucedida. Use as variáveis `@statusMessage` e `@errorCode` para logar informações detalhadas - isso é essencial para auditoria, especialmente em fluxos de compliance com a LGPD.

> **⚠️ Atenção:** O quarto parâmetro (`deleteOptionsObject`) é opcional e aceita um API Object do tipo DeleteOptions. Crie-o com [CreateObject](../api-functions/createobject.md) caso precise configurar opções específicas da exclusão.

## Funções relacionadas

- [CreateObject](../api-functions/createobject.md) - cria o API Object que será passado para o `InvokeDelete`
- [SetObjectProperty](../api-functions/setobjectproperty.md) - define as propriedades do objeto antes da exclusão
- [InvokeCreate](../api-functions/invokecreate.md) - para criar objetos via API
- [InvokeUpdate](../api-functions/invokeupdate.md) - para atualizar objetos via API
- [InvokeRetrieve](../api-functions/invokeretrieve.md) - para consultar objetos via API
- [DeleteDE](../data-extension-functions/deletede.md) - para deletar registros de Data Extensions (não API Objects)
- [DeleteData](../data-extension-functions/deletedata.md) - alternativa para deletar registros de Data Extensions