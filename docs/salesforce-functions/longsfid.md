---
title: LongSfid
sidebar_label: LongSfid
description: Converte um ID do Salesforce de 15 caracteres para o formato completo de 18 caracteres, que é case-insensitive e mais seguro para uso em integrações.
---

# LongSfid

## Descrição

A função `LongSfid` recebe um ID do Salesforce no formato curto (15 caracteres) e retorna o mesmo ID no formato longo (18 caracteres). O ID de 18 caracteres inclui um sufixo de 3 caracteres que funciona como checksum, tornando o ID case-insensitive — ou seja, seguro para uso em comparações, exports para Excel, fórmulas e integrações onde a diferença entre maiúsculas e minúsculas pode se perder. Sempre que você estiver trabalhando com IDs do Salesforce dentro do Marketing Cloud, é uma boa prática converter para o formato de 18 caracteres para evitar problemas de correspondência.

## Sintaxe

```ampscript
LongSfid(shortSfid)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|--------|-------------|-----------|
| shortSfid | String | Sim | Um ID do Salesforce com 15 caracteres que você deseja converter para o formato de 18 caracteres. |

## Exemplo básico

Imagine que você tem o ID curto de um contato do Salesforce e precisa exibir o ID completo em um e-mail de confirmação:

```ampscript
%%[
  SET @shortId = "0036000000QKv5T"
  SET @longId = LongSfid(@shortId)
]%%

O ID completo do seu registro é %%=v(@longId)=%%
```

**Saída:**
```
O ID completo do seu registro é 0036000000QKv5TAAT
```

## Exemplo avançado

Cenário real: a **Conecta Telecom** envia um e-mail mensal para seus clientes com um link personalizado para a área do cliente em uma CloudPage. O ID do Salesforce do contato vem de uma Data Extension no formato curto (15 caracteres). Você precisa converter para 18 caracteres antes de usar na URL, garantindo que a busca no Salesforce funcione corretamente.

```ampscript
%%[
  /* Busca os dados do assinante na DE */
  SET @sfContactId = AttributeValue("SalesforceContactId")
  SET @nomeCliente = AttributeValue("NomeCliente")
  SET @plano = AttributeValue("Plano")

  /* Converte o ID curto para o formato longo de 18 caracteres */
  IF NOT Empty(@sfContactId) THEN
    SET @longId = LongSfid(@sfContactId)
  ELSE
    SET @longId = ""
  ENDIF

  /* Monta a URL da CloudPage com o ID longo */
  SET @urlAreaCliente = Concat(
    "https://cloud.conectatelecom.com.br/minha-conta?cid=",
    @longId
  )
]%%

Olá, %%=v(@nomeCliente)=%%!

Seu plano atual: %%=v(@plano)=%%
Seu ID de cliente Salesforce: %%=v(@longId)=%%

<a href="%%=RedirectTo(@urlAreaCliente)=%%">
  Acesse sua área do cliente
</a>
```

**Saída:**
```
Olá, Maria Santos!

Seu plano atual: Fibra 300 Mega
Seu ID de cliente Salesforce: 0036000000QKv5TAAT

Acesse sua área do cliente
```

## Observações

- A função é específica para cenários de integração com o **Salesforce CRM (Sales Cloud / Service Cloud)**. Ela só faz sentido quando você está trabalhando com IDs do Salesforce dentro do Marketing Cloud.
- O parâmetro **deve ter exatamente 15 caracteres**. Se você passar um ID que já tem 18 caracteres ou um valor com tamanho diferente, o comportamento pode ser inesperado.
- Sempre valide se o ID não está vazio antes de chamar a função, usando [Empty](../utility-functions/empty.md) ou [IsNull](../utility-functions/isnull.md), para evitar erros em tempo de execução.
- IDs de 15 caracteres são **case-sensitive** no Salesforce (ex: `001A0` é diferente de `001a0`). O formato de 18 caracteres resolve isso adicionando um sufixo de checksum. Isso é especialmente importante quando você exporta dados para planilhas ou sistemas que não preservam maiúsculas/minúsculas.
- Essa função é útil quando você recebe IDs do Salesforce via **Synchronized Data Extensions**, **Salesforce Data Extensions** ou campos personalizados e precisa garantir compatibilidade em lookups, comparações ou chamadas de API.

## Funções relacionadas

- [RetrieveSalesforceObjects](../salesforce-functions/retrievesalesforceobjects.md) — busca registros diretamente do Salesforce CRM usando filtros
- [CreateSalesforceObject](../salesforce-functions/createsalesforceobject.md) — cria um novo registro no Salesforce CRM
- [UpdateSingleSalesforceObject](../salesforce-functions/updatesinglesalesforceobject.md) — atualiza um registro existente no Salesforce CRM
- [Lookup](../data-extension-functions/lookup.md) — busca um valor em uma Data Extension, útil para encontrar registros pelo ID convertido
- [Concat](../string-functions/concat.md) — concatena strings, útil para montar URLs com o ID longo
- [Empty](../utility-functions/empty.md) — verifica se um valor está vazio antes de tentar converter o ID
- [AttributeValue](../utility-functions/attributevalue.md) — recupera o valor de um atributo do assinante ou campo da Data Extension