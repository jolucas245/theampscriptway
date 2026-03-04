---
title: UpsertContact
sidebar_label: UpsertContact
description: Insere ou atualiza atributos de um contato no MobileConnect, criando o registro caso não exista.
---

# UpsertContact

## Descrição

A função `UpsertContact` insere ou atualiza atributos em um registro de contato. Se o contato já existir, os atributos são atualizados com as chaves e valores fornecidos. Se o contato não existir, a função cria um novo registro usando essas mesmas chaves e valores. É especialmente útil em fluxos de SMS e MobileConnect, onde você precisa manter dados de contato atualizados — como nome, cidade ou CEP — a partir de interações via mensagem. A função retorna `0` quando a operação é concluída sem erros.

## Sintaxe

```ampscript
UpsertContact(channel, attribute, phoneNumber, keyToUpsert1, valueToUpsert1 [, keyToUpsert2, valueToUpsert2 ...])
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| channel | String | Sim | O canal do contato. O único valor suportado é `"mobile"`. |
| attribute | String | Sim | O atributo usado para localizar o contato. O único valor suportado é `"phone"`. |
| phoneNumber | Número | Sim | O número de telefone do contato. Deve incluir o código do país. |
| keyToUpsert1 | String | Não | O nome do atributo a ser inserido ou atualizado. |
| valueToUpsert1 | String | Não | O valor do atributo a ser inserido ou atualizado. |

> **💡 Dica:** Você pode adicionar quantos pares de chave-valor forem necessários, basta acrescentá-los ao final da lista de parâmetros (keyToUpsert2, valueToUpsert2, keyToUpsert3, valueToUpsert3...).

## Exemplo básico

Atualizando o CEP de um contato que interagiu por SMS com a Conecta Telecom:

```ampscript
%%[
  SET @resultado = UpsertContact("mobile", "phone", 5511999998888, "_ZipCode", "01310-100")
]%%

Resultado: %%=V(@resultado)=%%
```

**Saída:**
```
Resultado: 0
```

## Exemplo avançado

Cenário de régua de relacionamento via MobileConnect: ao receber uma mensagem SMS de opt-in, você atualiza nome, sobrenome e cidade do contato de uma só vez, mantendo o cadastro completo no MobileConnect Data Attribute Group.

```ampscript
%%[
  SET @telefone = 5521988887777
  SET @nome = "Maria"
  SET @sobrenome = "Santos"
  SET @cidade = "Rio de Janeiro"
  SET @cep = "20040-020"

  SET @resultado = UpsertContact(
    "mobile",
    "phone",
    @telefone,
    "_FirstName", @nome,
    "_LastName", @sobrenome,
    "_City", @cidade,
    "_ZipCode", @cep
  )
]%%

Resultado do upsert: %%=V(@resultado)=%%
```

**Saída:**
```
Resultado do upsert: 0
```

## Observações

- A função trabalha exclusivamente com o canal `"mobile"` e o atributo de busca `"phone"`. Não há suporte para outros canais ou atributos de correspondência.

- O número de telefone deve incluir o código do país. Para números brasileiros, use o prefixo `55` seguido do DDD e número (ex: `5511999998888`).

- Você pode fazer upsert de qualquer atributo que faça parte do **MobileConnect Data Attribute Group**, incluindo campos padrão como `_FirstName`, `_LastName`, `_City` e `_ZipCode`, além de atributos customizados. Para visualizar esses atributos, acesse o **Data Designer** no **Contact Builder**.

- O retorno `0` indica que a operação foi concluída sem erros.

> **⚠️ Atenção:** Essa função é voltada para o contexto de MobileConnect. Se você precisa fazer upsert de dados em Data Extensions, utilize as funções [UpsertDE](../data-extension-functions/upsertde.md) ou [UpsertData](../data-extension-functions/upsertdata.md).

## Funções relacionadas

- [CreateSmsConversation](../sms-functions/createsmsconversation.md) — cria uma conversa SMS
- [EndSmsConversation](../sms-functions/endsmsconversation.md) — encerra uma conversa SMS
- [SetSmsConversationNextKeyword](../sms-functions/setsmsconversationnextkeyword.md) — define a próxima keyword esperada numa conversa SMS
- [UpsertDE](../data-extension-functions/upsertde.md) — upsert em Data Extensions (por nome)
- [UpsertData](../data-extension-functions/upsertdata.md) — upsert em Data Extensions (por nome externo)