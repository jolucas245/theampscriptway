---
title: InvokeDelete
sidebar_label: InvokeDelete
description: Invoca o método Delete em um API Object do Marketing Cloud e retorna o código de status da operação.
---

<!-- generated-by-script -->

# InvokeDelete

## Descrição

A função `InvokeDelete` executa o método Delete na API SOAP do Marketing Cloud sobre um API Object previamente criado. Ela retorna o código de status da operação (como `"OK"` ou `"Error"`), permitindo que você verifique se a exclusão foi bem-sucedida. Você pode usar um ID, external ID ou key como referência do objeto a ser deletado. É útil quando você precisa remover registros diretamente dos objetos da API do Marketing Cloud (como Subscribers, Data Extensions via API Object, etc.) de dentro do próprio AMPscript.

## Sintaxe

```ampscript
InvokeDelete(apiObject, statusMessage, errorCode, deleteOptionsObject)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| apiObject | API Object | Sim | O API Object que você quer deletar. Deve ser criado previamente com `CreateObject` e ter suas propriedades definidas com `SetObjectProperty`. |
| statusMessage | Variável AMPscript | Sim | Uma variável que vai armazenar a mensagem de status retornada pela API após a tentativa de exclusão. |
| errorCode | Variável AMPscript | Sim | Uma variável que vai armazenar o código de erro retornado pela API, caso a operação falhe. |
| deleteOptionsObject | API Object | Não | Um objeto `DeleteOptions` da API, caso você precise passar opções adicionais para a operação de exclusão. |

## Valor de retorno

Retorna uma string com o código de status da API (por exemplo, `"OK"` para sucesso ou `"Error"` para falha).

## Exemplo básico

Neste exemplo, vamos deletar um Subscriber do Marketing Cloud pelo endereço de e-mail. Imagine que o cliente João Silva pediu para ser removido da base da **Conecta Telecom**:

```ampscript
%%[
/* Cria o objeto Subscriber */
SET @sub = CreateObject("Subscriber")
SetObjectProperty(@sub, "SubscriberKey", "joao.silva@email.com.br")

/* Executa a exclusão */
SET @statusCode = InvokeDelete(@sub, @statusMessage, @errorCode)
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
Status Message: Subscriber not found
Error Code: 12001
```

## Exemplo avançado

Cenário real: a **FarmaRede** tem uma CloudPage de gestão de preferências onde o assinante pode solicitar a remoção completa do seu cadastro. O sistema busca o e-mail do assinante, tenta deletar o Subscriber e registra o resultado em uma Data Extension de auditoria:

```ampscript
%%[
/* Captura o e-mail enviado via formulário na CloudPage */
SET @emailAssinante = RequestParameter("email")
SET @cpf = RequestParameter("cpf")
SET @dataRemocao = FormatDate(Now(), "DD/MM/YYYY")

IF NOT Empty(@emailAssinante) AND NOT Empty(@cpf) THEN

  /* Verifica se o assinante existe na DE de clientes */
  SET @clienteExiste = Lookup("Clientes_FarmaRede", "NomeCompleto", "Email", @emailAssinante, "CPF", @cpf)

  IF NOT Empty(@clienteExiste) THEN

    /* Cria o objeto Subscriber para exclusão */
    SET @subscriberObj = CreateObject("Subscriber")
    SetObjectProperty(@subscriberObj, "SubscriberKey", @emailAssinante)
    SetObjectProperty(@subscriberObj, "EmailAddress", @emailAssinante)

    /* Executa a exclusão do Subscriber */
    SET @statusCode = InvokeDelete(@subscriberObj, @statusMessage, @errorCode)

    IF @statusCode == "OK" THEN
      /* Registra a exclusão na DE de auditoria */
      InsertDE(
        "Auditoria_Exclusoes",
        "Email", @emailAssinante,
        "CPF", @cpf,
        "NomeCompleto", @clienteExiste,
        "DataExclusao", @dataRemocao,
        "StatusOperacao", "Sucesso",
        "Origem", "CloudPage - Solicitação do Cliente"
      )

      /* Remove também da DE de clientes */
      DeleteDE("Clientes_FarmaRede", "Email", @emailAssinante, "CPF", @cpf)
    ELSE
      /* Registra a falha na auditoria */
      InsertDE(
        "Auditoria_Exclusoes",
        "Email", @emailAssinante,
        "CPF", @cpf,
        "NomeCompleto", @clienteExiste,
        "DataExclusao", @dataRemocao,
        "StatusOperacao", Concat("Falha: ", @statusMessage),
        "CodigoErro", @errorCode,
        "Origem", "CloudPage - Solicitação do Cliente"
      )
    ENDIF

  ELSE
    SET @statusCode = "NotFound"
    SET @statusMessage = "Assinante não localizado com os dados informados."
  ENDIF

ELSE
  SET @statusCode = "InvalidInput"
  SET @statusMessage = "E-mail e CPF são obrigatórios."
ENDIF
]%%

<!DOCTYPE html>
<html>
<body>
  <h2>FarmaRede - Resultado da Solicitação</h2>

  %%[IF @statusCode == "OK" THEN]%%
    <p>✅ Olá, %%=v(@clienteExiste)=%%! Seu cadastro com o e-mail <strong>%%=v(@emailAssinante)=%%</strong> foi removido com sucesso em %%=v(@dataRemocao)=%%.</p>
    <p>Você não receberá mais comunicações da FarmaRede.</p>
  %%[ELSEIF @statusCode == "NotFound" THEN]%%
    <p>⚠️ Não encontramos um cadastro com os dados informados. Verifique seu e-mail e CPF.</p>
  %%[ELSEIF @statusCode == "InvalidInput" THEN]%%
    <p>⚠️ %%=v(@statusMessage)=%%</p>
  %%[ELSE]%%
    <p>❌ Ocorreu um erro ao processar sua solicitação.</p>
    <p>Mensagem: %%=v(@statusMessage)=%%</p>
    <p>Código do erro: %%=v(@errorCode)=%%</p>
    <p>Por favor, entre em contato pelo SAC: (11) 3000-4000.</p>
  %%[ENDIF]%%
</body>
</html>
```

**Saída (em caso de sucesso):**
```
FarmaRede - Resultado da Solicitação

✅ Olá, João Silva! Seu cadastro com o e-mail joao.silva@email.com.br foi removido com sucesso em 15/06/2025.
Você não receberá mais comunicações da FarmaRede.
```

## Observações

- A função `InvokeDelete` trabalha diretamente com os **API Objects da SOAP API** do Marketing Cloud. Ela **não** deleta registros de Data Extensions — para isso, use [DeleteDE](../data-extension-functions/deletede.md) ou [DeleteData](../data-extension-functions/deletedata.md).
- Você precisa sempre criar o API Object com [CreateObject](../api-functions/createobject.md) e definir as propriedades com [SetObjectProperty](../api-functions/setobjectproperty.md) antes de chamar `InvokeDelete`.
- O objeto precisa ter uma identificação válida (ID, SubscriberKey, external key, etc.) para que a API saiba qual registro deletar. Sem isso, a operação vai falhar.
- Sempre valide o código de status retornado. Se o valor não for `"OK"`, as variáveis de `statusMessage` e `errorCode` vão conter informações sobre o que deu errado.
- O quarto parâmetro (`deleteOptionsObject`) é **opcional**. Na maioria dos cenários do dia a dia, você não precisa passá-lo.
- Essa função é mais comum em **CloudPages** e **Landing Pages**, onde você tem interação do usuário e precisa fazer operações CRUD. Usar em emails de envio exige cautela, pois a exclusão será executada no momento da renderização para cada destinatário.
- **Cuidado:** a exclusão via `InvokeDelete` é **permanente**. Não existe undo. Sempre faça um registro de auditoria antes de deletar.
- Essa função requer permissões adequadas na Business Unit. Se a sua conta não tiver permissão para deletar determinados objetos via API, a operação vai retornar erro.

## Funções relacionadas

- [CreateObject](../api-functions/createobject.md) — cria um API Object para usar com as funções Invoke
- [SetObjectProperty](../api-functions/setobjectproperty.md) — define propriedades em um API Object
- [InvokeCreate](../api-functions/invokecreate.md) — invoca o método Create em um API Object
- [InvokeUpdate](../api-functions/invokeupdate.md) — invoca o método Update em um API Object
- [InvokeRetrieve](../api-functions/invokeretrieve.md) — invoca o método Retrieve para buscar dados de um API Object
- [InvokeExecute](../api-functions/invokeexecute.md) — invoca o método Execute em um API Object
- [InvokePerform](../api-functions/invokeperform.md) — invoca o método Perform em um API Object
- [AddObjectArrayItem](../api-functions/addobjectarrayitem.md) — adiciona itens a uma propriedade de array de um API Object
- [DeleteDE](../data-extension-functions/deletede.md) — deleta registros de uma Data Extension (mais simples para DEs)
- [DeleteData](../data-extension-functions/deletedata.md) — alternativa para deletar dados de Data Extensions