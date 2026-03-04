---
title: WAT
sidebar_label: WAT
description: Retorna os valores do parâmetro de Web Analytics Tracking (WAT) com a chave externa especificada, substituindo valores opcionais definidos com WATP.
---

# WAT

## Descrição

A função `WAT` retorna os valores de um parâmetro de Web Analytics Tracking (WAT) associado a uma chave externa específica. Ela é usada para inserir parâmetros de rastreamento de web analytics (como Adobe Omniture) nos links dos seus e-mails, substituindo referências à função `WATP` dentro do conjunto de parâmetros de tracking configurado no Sender Profile. As chaves externas dos parâmetros são configuradas no Web Analytics Connector — para isso, é necessário entrar em contato com o suporte Salesforce.

## Sintaxe

```ampscript
WAT(parameterSetKey, parameterValue1 [, parameterValue2, parameterValue3...])
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| parameterSetKey | string | Sim | A chave do conjunto de parâmetros WAT configurado no Web Analytics Connector. |
| parameterValue1 | string | Sim | Valor que substitui a referência à função `WATP(1)` dentro do conjunto de parâmetros de tracking. |
| parameterValue2, parameterValue3... | string | Não | Valores adicionais que substituem referências a `WATP(2)`, `WATP(3)` etc., na mesma ordem ordinal. |

## Exemplo básico

Inserindo um parâmetro de rastreamento do Omniture com um identificador de campanha para um e-mail da MegaStore:

```ampscript
%%=WAT("Omniture", "1234")=%%
```

**Saída:**
```
[valor do parâmetro de tracking Omniture com "1234" substituído nas referências a WATP(1)]
```

## Exemplo avançado

Substituindo múltiplos parâmetros de tracking para uma campanha de Black Friday da Lojas Vitória, onde o primeiro valor identifica a campanha e o segundo identifica o segmento de clientes:

```ampscript
%%=WAT("Omniture", "1234", "5678")=%%
```

**Saída:**
```
[valor do parâmetro de tracking Omniture com "1234" substituído nas referências a WATP(1) e "5678" substituído nas referências a WATP(2)]
```

## Observações

> **⚠️ Atenção:** Os parâmetros passados na chamada `WAT` **devem ser valores constantes ou numéricos**. Variáveis, atributos, campos e valores de funções **não funcionam**, pois a resolução acontece no nível do job e não consegue resolver dinamicamente os parâmetros de query string dos links.

> **⚠️ Atenção:** Para configurar as chaves externas usadas pelo `WAT`, é necessário entrar em contato com o suporte Salesforce para que elas sejam definidas no Web Analytics Connector.

- O conjunto de parâmetros de tracking referenciado pela `parameterSetKey` é configurado no Analytics Profile do Sender Profile.
- O número ordinal de cada `parameterValue` corresponde à posição do `WATP` dentro do conjunto de parâmetros de tracking. Ou seja, `parameterValue1` substitui `WATP(1)`, `parameterValue2` substitui `WATP(2)`, e assim por diante.

## Funções relacionadas

- [WATP](../sites-functions/watp.md) — função usada dentro do conjunto de parâmetros de tracking que é substituída pelos valores passados na chamada `WAT`.