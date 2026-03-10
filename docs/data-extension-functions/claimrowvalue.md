---
title: ClaimRowValue
sidebar_label: ClaimRowValue
description: Busca uma linha não reivindicada em uma Data Extension, retorna um valor dessa linha e a marca como reivindicada, com suporte a valor de fallback.
---

# ClaimRowValue

## Descrição

A função `ClaimRowValue` busca em uma Data Extension a próxima linha que ainda não foi reivindicada (claimed), retorna o valor de uma coluna específica dessa linha e automaticamente marca a linha como reivindicada para que nenhum outro subscriber receba o mesmo valor. É a função ideal para distribuição de cupons únicos, códigos promocionais e vouchers em campanhas de e-mail marketing - cenários muito comuns em varejo, farmácias e programas de fidelidade no Brasil. Diferente da [ClaimRow](../data-extension-functions/claimrow.md), que retorna a linha inteira, esta função retorna apenas o valor de uma coluna e permite definir um valor de fallback caso todos os registros já tenham sido reivindicados.

## Sintaxe

```ampscript
ClaimRowValue(
  "dataExt",
  "returnValueColumn",
  "claimColumn",
  "valueIfClaimed",
  "claimantColumn",
  "claimantValue"
)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| dataExt | String | Sim | Nome da Data Extension que contém os valores a serem distribuídos. **Deve ser hard-coded** - se você passar uma variável AMPscript, a função lança uma exceção. |
| returnValueColumn | String | Sim | Nome da coluna cujo valor você quer que a função retorne (ex: o código do cupom). |
| claimColumn | String | Sim | Nome da coluna booleana usada para controlar se a linha já foi reivindicada. Veja a configuração obrigatória da Data Extension nas observações. |
| valueIfClaimed | String | Sim | Valor de fallback retornado quando não há mais linhas disponíveis (todas já foram reivindicadas). |
| claimantColumn | String | Sim | Nome da coluna que registra quem reivindicou a linha (ex: e-mail do subscriber). |
| claimantValue | String | Sim | Valor a ser gravado na coluna `claimantColumn` no momento da reivindicação. Você pode preencher colunas adicionais da linha reivindicada adicionando pares de nome de coluna e valor ao final da função. |

## Configuração da Data Extension

Para usar `ClaimRowValue`, a Data Extension precisa ter uma estrutura específica. Aqui está a configuração mínima:

| Nome do Atributo | Tipo de Dado | Obrigatório? | Valor Padrão |
|------------------|--------------|--------------|--------------|
| CouponCode | Text | Sim | |
| EmailAddress | Text | Não | |
| IsClaimed | Boolean | Sim | False |
| ClaimedDate | Date | Não | |

> **⚠️ Atenção:** A coluna booleana (no exemplo, `IsClaimed`) **deve** ser obrigatória (non-nullable) e ter o valor padrão `False`. Sem essa configuração, a função não vai funcionar corretamente.

> **💡 Dica:** A coluna `ClaimedDate` não é estritamente obrigatória, mas se existir na Data Extension, a função insere automaticamente um timestamp no momento da reivindicação. Essa coluna deve ser nullable, ter o tipo `Date` e se chamar exatamente **"ClaimedDate"**.

## Exemplo básico

Distribuindo cupons de desconto únicos para clientes da MegaStore em um e-mail promocional de Black Friday:

```ampscript
%%[

VAR @cupom

SET @cupom = ClaimRowValue(
  "CuponsBlackFriday",
  "CodigoCupom",
  "Reivindicado",
  "MEGA10OFF",
  "EmailAssinante",
  EmailAddress
)

]%%

Seu cupom exclusivo: %%=v(@cupom)=%%
```

**Saída:**
```
Seu cupom exclusivo: BF7K9X2M
```

Se todos os cupons já tiverem sido reivindicados:

**Saída:**
```
Seu cupom exclusivo: MEGA10OFF
```

## Exemplo avançado

Campanha da FarmaRede com cupons de desconto personalizados por faixa de valor, onde além do e-mail, registramos o nome do cliente e a data de envio na linha reivindicada:

```ampscript
%%[

VAR @cupom, @nome, @email

SET @nome = AttributeValue("PrimeiroNome")
SET @email = AttributeValue("EmailAddress")

SET @cupom = ClaimRowValue(
  "CuponsFarmaRede",
  "CodigoCupom",
  "Reivindicado",
  "FARMA15GERAL",
  "EmailCliente",
  @email,
  "NomeCliente",
  @nome
)

IF @cupom == "FARMA15GERAL" THEN

]%%

<h2>Olá, %%=v(@nome)=%%!</h2>
<p>Nossos cupons exclusivos esgotaram, mas preparamos um desconto especial para você:</p>
<p>Use o código <strong>%%=v(@cupom)=%%</strong> e ganhe 15% de desconto em todo o site.</p>

%%[ ELSE ]%%

<h2>Olá, %%=v(@nome)=%%!</h2>
<p>Temos um cupom exclusivo só para você! Ninguém mais vai receber esse código:</p>
<p>Use o código <strong>%%=v(@cupom)=%%</strong> e garanta até 30% de desconto na FarmaRede.</p>
<p><small>Válido até %%=FormatDate(DateAdd(Now(), 7, "D"), "DD/MM/YYYY")=%%</small></p>

%%[ ENDIF ]%%
```

**Saída (quando há cupons disponíveis):**
```
Olá, Maria!
Temos um cupom exclusivo só para você! Ninguém mais vai receber esse código:
Use o código R4FM8BN3 e garanta até 30% de desconto na FarmaRede.
Válido até 12/08/2025
```

**Saída (quando todos os cupons já foram reivindicados):**
```
Olá, Maria!
Nossos cupons exclusivos esgotaram, mas preparamos um desconto especial para você:
Use o código FARMA15GERAL e ganhe 15% de desconto em todo o site.
```

## Observações

> **⚠️ Atenção:** O parâmetro `dataExt` **deve ser hard-coded** (escrito diretamente como string). Se você tentar passar uma variável AMPscript no lugar do nome da Data Extension, a função retorna uma exceção. Isso é uma restrição da plataforma, não um bug.

> **⚠️ Atenção:** A Data Extension precisa obrigatoriamente ter uma coluna booleana configurada como **obrigatória (non-nullable)** com valor padrão **False**. Essa coluna é o mecanismo que a função usa para identificar quais linhas ainda estão disponíveis.

> **💡 Dica:** A grande vantagem da `ClaimRowValue` sobre a [ClaimRow](../data-extension-functions/claimrow.md) é o parâmetro `valueIfClaimed`. Em campanhas de alto volume - como Black Friday ou Dia das Mães - é muito comum os cupons acabarem antes do fim do envio. Com o fallback, você garante que nenhum cliente receba um e-mail quebrado: todos recebem pelo menos um cupom genérico.

> **💡 Dica:** Você pode preencher colunas adicionais na linha reivindicada adicionando pares de nome de coluna e valor ao final da chamada da função. Isso é útil para registrar informações extras como nome do cliente, ID da campanha ou canal de origem.

> **💡 Dica:** Se a Data Extension incluir uma coluna chamada exatamente **"ClaimedDate"** (tipo Date, nullable), a função preenche automaticamente com o timestamp do momento da reivindicação - sem necessidade de código adicional.

- A função busca sempre a próxima linha não reivindicada. Chamadas subsequentes retornam linhas diferentes, garantindo que cada subscriber receba um valor único.
- Cada linha reivindicada é atualizada na Data Extension com o valor do `claimantValue` na coluna `claimantColumn` e o campo booleano é marcado como `True`.

## Funções relacionadas

- [ClaimRow](../data-extension-functions/claimrow.md) - Versão que retorna a linha inteira em vez de um único valor, sem suporte a fallback.
- [Lookup](../data-extension-functions/lookup.md) - Busca simples em Data Extension (sem reivindicação).
- [LookupRows](../data-extension-functions/lookuprows.md) - Retorna múltiplas linhas de uma Data Extension.
- [InsertDE](../data-extension-functions/insertde.md) - Insere registros em uma Data Extension.
- [UpdateDE](../data-extension-functions/updatede.md) - Atualiza registros em uma Data Extension.
- [DataExtensionRowCount](../data-extension-functions/dataextensionrowcount.md) - Conta o total de linhas em uma Data Extension (útil para monitorar estoque de cupons).
- [Empty](../utility-functions/empty.md) - Verifica se um valor está vazio.