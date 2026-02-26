---
title: UpsertContact
sidebar_label: UpsertContact
description: Insere ou atualiza atributos de um registro de contato no MobileConnect, usando o número de telefone como identificador.
---

# UpsertContact

## Descrição

A função `UpsertContact` faz um "upsert" (inserção ou atualização) de atributos em um registro de contato do MobileConnect. Se o contato já existir (identificado pelo número de telefone), os atributos informados são atualizados. Se o contato não existir, ele é criado com os valores fornecidos. A função retorna `0` quando a operação é concluída sem erros. Você pode atualizar quantos atributos quiser em uma única chamada, bastando adicionar pares de chave-valor como parâmetros adicionais.

## Sintaxe

```ampscript
UpsertContact(canal, atributo, numeroTelefone, chave1, valor1 [, chave2, valor2, ...])
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| canal | String | Sim | O canal do contato. O único valor suportado é `"mobile"`. |
| atributo | String | Sim | O atributo usado para localizar o contato. O único valor suportado é `"phone"`. |
| numeroTelefone | Número | Sim | O número de telefone do contato, incluindo o código do país (ex: `5511999998888`). |
| chave1 | String | Sim | O nome do atributo a ser inserido ou atualizado (ex: `"_FirstName"`, `"_City"`, `"_ZipCode"` ou atributos customizados). |
| valor1 | String | Sim | O valor do atributo correspondente à chave1. |
| chaveN, valorN | String | Não | Pares adicionais de chave-valor para upsert de múltiplos atributos de uma só vez. Pode adicionar quantos pares precisar. |

## Exemplo básico

Imagine que a **Conecta Telecom** precisa atualizar o CEP de um contato mobile que já está cadastrado. O número de telefone inclui o código do Brasil (`55`):

```ampscript
%%[
  VAR @resultado
  SET @resultado = UpsertContact(
    "mobile",
    "phone",
    5511988887777,
    "_ZipCode", "04538-132"
  )
]%%

Resultado da operação: %%=v(@resultado)=%%
```

**Saída:**
```
Resultado da operação: 0
```

O retorno `0` indica que a operação foi concluída sem erros. O CEP do contato com telefone `+55 (11) 98888-7777` foi atualizado para `04538-132`.

## Exemplo avançado

Agora, a **FarmaRede** está rodando uma campanha de SMS para o Dia das Mães e quer cadastrar ou atualizar contatos mobile com nome, sobrenome e cidade de uma só vez. Os dados vêm de uma Data Extension chamada `CampanhaDiadasMaes`:

```ampscript
%%[
  VAR @telefone, @nome, @sobrenome, @cidade, @resultado

  SET @telefone = Lookup("CampanhaDiadasMaes", "Telefone", "CPF", "123.456.789-00")
  SET @nome = Lookup("CampanhaDiadasMaes", "Nome", "CPF", "123.456.789-00")
  SET @sobrenome = Lookup("CampanhaDiadasMaes", "Sobrenome", "CPF", "123.456.789-00")
  SET @cidade = Lookup("CampanhaDiadasMaes", "Cidade", "CPF", "123.456.789-00")

  /* Remove espaços extras do nome */
  SET @nome = Trim(@nome)
  SET @sobrenome = Trim(@sobrenome)

  SET @resultado = UpsertContact(
    "mobile",
    "phone",
    @telefone,
    "_FirstName", @nome,
    "_LastName", @sobrenome,
    "_City", @cidade
  )

  IF @resultado == 0 THEN
    SET @mensagem = Concat("Contato ", @nome, " ", @sobrenome, " atualizado com sucesso!")
  ELSE
    SET @mensagem = Concat("Erro ao atualizar contato. Código: ", @resultado)
  ENDIF
]%%

%%=v(@mensagem)=%%
```

**Saída:**
```
Contato Maria Santos atualizado com sucesso!
```

Nesse exemplo, buscamos os dados na DE usando [Lookup](../data-extension-functions/lookup.md), limpamos espaços com [Trim](../string-functions/trim.md), e fazemos o upsert de três atributos de uma vez só (`_FirstName`, `_LastName` e `_City`).

## Observações

- **Canal limitado:** O único canal suportado atualmente é `"mobile"`. Essa função é específica para contatos do **MobileConnect** (SMS). Não funciona para contatos de e-mail.
- **Atributo de busca limitado:** O único atributo de match suportado é `"phone"`. Não é possível buscar por e-mail, nome ou outro campo.
- **Código do país obrigatório:** O número de telefone deve incluir o código do país. Para o Brasil, use `55` antes do DDD e número (ex: `5521999991234`).
- **Atributos disponíveis:** Você pode fazer upsert de qualquer atributo que faça parte do **MobileConnect Data Attribute Group** no Contact Builder. Isso inclui campos padrão como `_FirstName`, `_LastName`, `_City`, `_ZipCode`, e também atributos customizados. Consulte o **Data Designer** no Contact Builder para verificar os atributos disponíveis.
- **Retorno:** A função retorna `0` quando a operação é concluída sem erros.
- **Contexto de uso:** Por ser uma função voltada ao MobileConnect, é mais comum encontrá-la em mensagens SMS, templates de MobileConnect ou em CloudPages que interajam com contatos mobile.
- **Múltiplos atributos:** Você pode passar quantos pares chave-valor quiser na mesma chamada. Não precisa fazer múltiplas chamadas para atualizar vários campos do mesmo contato.

## Funções relacionadas

- [CreateSmsConversation](../sms-functions/createsmsconversation.md) — cria uma conversa SMS interativa com o contato
- [EndSmsConversation](../sms-functions/endsmsconversation.md) — encerra uma conversa SMS ativa
- [SetSmsConversationNextKeyword](../sms-functions/setsmsconversationnextkeyword.md) — define a próxima keyword esperada em uma conversa SMS
- [Lookup](../data-extension-functions/lookup.md) — busca um valor em uma Data Extension para usar como parâmetro
- [UpsertDE](../data-extension-functions/upsertde.md) — insere ou atualiza registros em uma Data Extension (equivalente ao upsert, mas para DEs)
- [Trim](../string-functions/trim.md) — remove espaços extras de strings antes de salvar no contato
- [IsPhoneNumber](../utility-functions/isphonenumber.md) — valida se um valor é um número de telefone válido antes de usar no upsert