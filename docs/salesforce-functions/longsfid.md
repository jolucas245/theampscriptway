---
title: LongSfid
sidebar_label: LongSfid
description: Converte um Salesforce ID de 15 caracteres para o formato completo de 18 caracteres.
---

# LongSfid

## Descrição

A função `LongSfid` recebe um Salesforce ID no formato curto (15 caracteres) e retorna o ID completo de 18 caracteres. Isso é essencial quando você precisa garantir compatibilidade entre sistemas, já que o ID de 15 caracteres é case-sensitive e o de 18 caracteres é case-insensitive — evitando problemas em comparações, lookups e integrações entre o Sales Cloud e o Marketing Cloud.

## Sintaxe

```ampscript
LongSfid(shortSfid)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| shortSfid | String | Sim | Salesforce ID de 15 caracteres que será convertido para o formato de 18 caracteres. |

## Exemplo básico

Convertendo o ID curto de um contato do Sales Cloud para usar em um link personalizado de e-mail:

```ampscript
%%[
VAR @sfid15, @sfid18
SET @sfid15 = "0036000000QKv5T"
SET @sfid18 = LongSfid(@sfid15)
]%%

ID completo: %%=v(@sfid18)=%%
```

**Saída:**
```
ID completo: 0036000000QKv5TAAT
```

## Exemplo avançado

Em uma régua de relacionamento do Banco Meridional, você precisa buscar o ID do contato na Data Extension, converter para 18 caracteres e montar um link para o consultor visualizar o registro diretamente no Salesforce:

```ampscript
%%[
VAR @sfid15, @sfid18, @nomeCliente, @linkSF

SET @sfid15 = AttributeValue("ContactId")
SET @nomeCliente = AttributeValue("PrimeiroNome")

IF NOT Empty(@sfid15) THEN
  SET @sfid18 = LongSfid(@sfid15)
  SET @linkSF = Concat("https://bancomeridional.my.salesforce.com/", @sfid18)
ENDIF
]%%

%%[ IF NOT Empty(@sfid18) THEN ]%%
  Olá, %%=v(@nomeCliente)=%%. Seu código de cliente é: %%=v(@sfid18)=%%
  
  Consultor, acesse o registro: %%=RedirectTo(@linkSF)=%%
%%[ ENDIF ]%%
```

**Saída:**
```
Olá, João. Seu código de cliente é: 0036000000QKv5TAAT

Consultor, acesse o registro: https://bancomeridional.my.salesforce.com/0036000000QKv5TAAT
```

## Observações

> **⚠️ Atenção:** O parâmetro deve ser um Salesforce ID válido de exatamente 15 caracteres. Certifique-se de validar o valor antes de passar para a função — se o campo vier vazio ou com um ID já no formato de 18 caracteres, o comportamento pode ser inesperado.

> **💡 Dica:** No dia a dia de SFMC, é comum receber IDs de 15 caracteres vindos de relatórios do Salesforce ou exportações de Data Extensions sincronizadas. Sempre que for comparar IDs entre sistemas diferentes (por exemplo, em um [Lookup](../data-extension-functions/lookup.md) cruzando dados de uma DE com registros do Sales Cloud), converta para 18 caracteres primeiro — isso evita falhas em comparações case-sensitive.

## Funções relacionadas

- [RetrieveSalesforceObjects](../salesforce-functions/retrievesalesforceobjects.md) — para consultar objetos do Salesforce diretamente via AMPscript
- [CreateSalesforceObject](../salesforce-functions/createsalesforceobject.md) — para criar registros no Salesforce a partir do Marketing Cloud
- [UpdateSingleSalesforceObject](../salesforce-functions/updatesinglesalesforceobject.md) — para atualizar registros no Salesforce usando o ID completo
- [Concat](../string-functions/concat.md) — para montar URLs e strings combinando o ID convertido
- [Empty](../utility-functions/empty.md) — para validar se o ID existe antes de converter
- [Lookup](../data-extension-functions/lookup.md) — para buscar dados em Data Extensions usando o ID convertido