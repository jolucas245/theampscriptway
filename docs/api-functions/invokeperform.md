---
title: InvokePerform
sidebar_label: InvokePerform
description: Invoca o método Perform em um objeto da API do Marketing Cloud e retorna o código de status da operação.
---

# InvokePerform

## Descrição

A função `InvokePerform` invoca o método **Perform** em um objeto da API do Marketing Cloud Engagement e retorna o código de status da operação. Ela é usada quando você precisa executar uma ação específica sobre um objeto da API — como iniciar ou parar uma campanha, por exemplo. O retorno é o código de status da API (como `"OK"` ou `"Error"`), e você pode capturar a mensagem de status em uma variável AMPscript para tratamento de erros.

## Sintaxe

```ampscript
InvokePerform(@apiObject, "actionToPerform", @statusMessage)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| apiObject | API Object | Sim | O objeto da API do Marketing Cloud sobre o qual o método Perform será invocado. Deve ser criado previamente com `CreateObject`. |
| actionToPerform | String | Sim | A ação a ser executada no objeto. Os valores válidos variam conforme o tipo de objeto (ex: `"start"`, `"stop"`). |
| statusMessage | Variável AMPscript | Não | Uma variável AMPscript que armazena a mensagem de status retornada pela API. |

## Retorno

Retorna uma **string** com o código de status da API (ex: `"OK"`, `"Error"`).

## Exemplo básico

Neste exemplo, criamos um objeto Campaign da API e executamos a ação `"stop"` para interromper uma campanha no Marketing Cloud.

```ampscript
%%[
/* Cria o objeto Campaign da API */
SET @campaign = CreateObject("Campaign")
SetObjectProperty(@campaign, "ID", 12345)

/* Invoca o método Perform com a ação "stop" */
SET @statusCode = InvokePerform(@campaign, "stop", @statusMessage)
]%%

Status Code: %%=v(@statusCode)=%%

%%[IF @statusCode != "OK" THEN]%%
  Status Message: %%=v(@statusMessage)=%%
  Error Code: %%=v(@errorCode)=%%
%%[ENDIF]%%
```

**Saída (em caso de sucesso):**
```
Status Code: OK
```

**Saída (em caso de erro):**
```
Status Code: Error
Status Message: Campaign not found
Error Code: 12345
```

## Exemplo avançado

Imagine que a "Conecta Telecom" precisa parar automaticamente uma campanha promocional do Dia das Mães quando o estoque de chips acaba. Um CloudPage verifica o estoque e, se zerado, para a campanha e registra o evento em uma Data Extension de log.

```ampscript
%%[
/* Verifica o estoque atual na Data Extension */
SET @estoque = Lookup("Estoque_Produtos", "Quantidade", "SKU", "CHIP-5G-PROMO")

IF @estoque <= 0 THEN

  /* Cria o objeto Campaign e define o ID da campanha do Dia das Mães */
  SET @campaign = CreateObject("Campaign")
  SetObjectProperty(@campaign, "ID", 67890)

  /* Executa a ação "stop" na campanha */
  SET @statusCode = InvokePerform(@campaign, "stop", @statusMessage)

  /* Registra o resultado na DE de log */
  IF @statusCode == "OK" THEN
    InsertDE(
      "Log_Campanhas",
      "DataHora", Now(),
      "CampanhaID", "67890",
      "Acao", "stop",
      "Status", @statusCode,
      "Motivo", "Estoque zerado - Chip 5G Promo Dia das Mães"
    )
  ELSE
    InsertDE(
      "Log_Campanhas",
      "DataHora", Now(),
      "CampanhaID", "67890",
      "Acao", "stop",
      "Status", @statusCode,
      "Motivo", Concat("Erro ao parar campanha: ", @statusMessage)
    )
    /* Levanta erro para notificar o time */
    RaiseError(Concat("Falha ao parar campanha Dia das Maes. Status: ", @statusCode, " - ", @statusMessage), false)
  ENDIF

ENDIF
]%%

%%[IF @estoque <= 0 THEN]%%
  <p>Campanha encerrada. Status: %%=v(@statusCode)=%%</p>
%%[ELSE]%%
  <p>Estoque disponível: %%=v(@estoque)=%% unidades. Campanha segue ativa.</p>
%%[ENDIF]%%
```

**Saída (estoque zerado, sucesso ao parar):**
```
Campanha encerrada. Status: OK
```

**Saída (estoque disponível):**
```
Estoque disponível: 142 unidades. Campanha segue ativa.
```

## Observações

- **Função avançada**: `InvokePerform` faz parte do grupo de funções da API SOAP do Marketing Cloud. Você precisa ter um bom entendimento dos objetos da API para usá-la corretamente.
- **Ações válidas variam por objeto**: O parâmetro `actionToPerform` depende do tipo de objeto. Nem todo objeto suporta as mesmas ações. Consulte a documentação da API SOAP do Marketing Cloud para saber quais ações cada objeto aceita.
- **Sempre verifique o status de retorno**: Nunca assuma que a operação deu certo. Compare o retorno com `"OK"` e trate os erros adequadamente.
- **Permissões da API**: A conta do Marketing Cloud precisa ter permissões adequadas para executar ações via API. Se as permissões não estiverem configuradas, a função pode retornar erro.
- **Uso em contexto adequado**: Essa função geralmente é usada em **CloudPages** ou em **emails com lógica avançada**, mas tenha cuidado ao usá-la em envios de email em massa — cada execução faz uma chamada à API, o que pode impactar performance.
- **Objeto precisa ser criado antes**: Você deve usar [CreateObject](../api-functions/createobject.md) e [SetObjectProperty](../api-functions/setobjectproperty.md) para criar e configurar o objeto da API antes de passá-lo para `InvokePerform`.
- **Variável de status message**: Embora o terceiro parâmetro não seja obrigatório segundo a documentação, é altamente recomendável usá-lo para capturar mensagens de erro e facilitar o debugging.

## Funções relacionadas

- [CreateObject](../api-functions/createobject.md) — Cria um objeto da API do Marketing Cloud para uso com as funções Invoke
- [SetObjectProperty](../api-functions/setobjectproperty.md) — Define propriedades em um objeto da API
- [AddObjectArrayItem](../api-functions/addobjectarrayitem.md) — Adiciona um item a uma propriedade de array de um objeto da API
- [InvokeCreate](../api-functions/invokecreate.md) — Invoca o método Create na API do Marketing Cloud
- [InvokeUpdate](../api-functions/invokeupdate.md) — Invoca o método Update na API do Marketing Cloud
- [InvokeDelete](../api-functions/invokedelete.md) — Invoca o método Delete na API do Marketing Cloud
- [InvokeRetrieve](../api-functions/invokeretrieve.md) — Invoca o método Retrieve na API do Marketing Cloud
- [InvokeExecute](../api-functions/invokeexecute.md) — Invoca o método Execute na API do Marketing Cloud
- [RaiseError](../utility-functions/raiseerror.md) — Levanta um erro personalizado, útil para tratamento de falhas