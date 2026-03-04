---
title: ClaimRow
sidebar_label: ClaimRow
description: Resgata e reserva a primeira linha não reivindicada de uma Data Extension, marcando-a como utilizada para que não seja entregue a outro subscriber.
---

# ClaimRow

## Descrição

A função `ClaimRow` busca a primeira linha ainda não reivindicada em uma Data Extension, marca essa linha como "claimed" (reivindicada) e retorna a linha inteira. É a função clássica para distribuição de cupons únicos, códigos promocionais ou vouchers — qualquer cenário em que cada subscriber deve receber um valor exclusivo e irrepetível. Se não houver mais linhas disponíveis na Data Extension, a função lança uma exceção.

## Sintaxe

```ampscript
ClaimRow("dataExt", "claimColumn", "claimantColumn", "claimantValue" [, "additionalColumn1", "additionalValue1", ...])
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| dataExt | String | Sim | Nome da Data Extension que contém as linhas a serem reivindicadas. **Deve ser hard-coded** — se você passar uma variável AMPscript, a função lança uma exceção. |
| claimColumn | String | Sim | Nome da coluna booleana usada para rastrear se a linha já foi reivindicada. Essa coluna precisa ser configurada como obrigatória (non-nullable) com valor padrão `False`. |
| claimantColumn | String | Sim | Nome da coluna usada para registrar quem reivindicou a linha (ex: e-mail do subscriber). |
| claimantValue | String | Sim | Valor a ser inserido na coluna `claimantColumn` no momento da reivindicação. |
| additionalColumn, additionalValue | String | Não | Pares adicionais de coluna/valor para preencher outras colunas da linha reivindicada no momento do claim. |

## Configuração da Data Extension

Para usar `ClaimRow`, sua Data Extension precisa seguir uma estrutura específica:

| Nome do Atributo | Tipo de Dado | Obrigatório? | Valor Padrão |
|---|---|---|---|
| CouponCode | Text | Sim | |
| EmailAddress | Text | Não | |
| IsClaimed | Boolean | Sim | False |
| ClaimedDate | Date | Não | |

> **💡 Dica:** A coluna `ClaimedDate` não é estritamente obrigatória, mas se existir na Data Extension, a função insere automaticamente um timestamp no momento da reivindicação. Essa coluna deve ser nullable, ter o tipo `Date` e se chamar exatamente **"ClaimedDate"**.

## Exemplo básico

A Lojas Vitória está enviando cupons únicos de desconto por e-mail. Cada cliente recebe um código exclusivo da Data Extension "CuponsDesconto":

```ampscript
%%[
SET @linha = ClaimRow("CuponsDesconto", "IsClaimed", "EmailAddress", EmailAddress)
SET @cupom = Field(@linha, "CouponCode")
]%%

Olá! Seu cupom exclusivo de desconto é: %%=v(@cupom)=%%
```

**Saída:**
```
Olá! Seu cupom exclusivo de desconto é: S5MY7BVU
```

Após a execução, a Data Extension é atualizada automaticamente — a linha reivindicada fica assim:

| CouponCode | EmailAddress | IsClaimed | ClaimedDate |
|---|---|---|---|
| S5MY7BVU | joao.silva@email.com.br | True | 05/08/2023 13:41:32 |

## Exemplo avançado

A FarmaRede está rodando uma campanha de cashback em que cada cliente recebe um voucher único. O e-mail precisa tratar o cenário em que os cupons acabaram, exibindo uma mensagem alternativa em vez de gerar erro. Além disso, a empresa quer registrar a cidade do subscriber no momento do resgate:

```ampscript
%%[
SET @email = AttributeValue("EmailAddress")
SET @cidade = AttributeValue("Cidade")

SET @linha = ClaimRow("VouchersCashback", "IsClaimed", "EmailAddress", @email, "CidadeResgate", @cidade)

IF NOT Empty(@linha) THEN
  SET @voucher = Field(@linha, "CouponCode")
]%%

<h2>Parabéns, você ganhou cashback!</h2>
<p>Use o código <strong>%%=v(@voucher)=%%</strong> na sua próxima compra em qualquer unidade FarmaRede.</p>
<p>Válido até 31/12/2024. Resgatado para: %%=v(@email)=%%</p>

%%[ ELSE ]%%

<h2>Promoção encerrada</h2>
<p>Infelizmente todos os vouchers já foram resgatados. Fique de olho nas próximas campanhas!</p>

%%[ ENDIF ]%%
```

**Saída (quando há voucher disponível):**
```
Parabéns, você ganhou cashback!
Use o código 40PNCHO2 na sua próxima compra em qualquer unidade FarmaRede.
Válido até 31/12/2024. Resgatado para: maria.santos@email.com.br
```

**Saída (quando os vouchers acabaram):**
```
Promoção encerrada
Infelizmente todos os vouchers já foram resgatados. Fique de olho nas próximas campanhas!
```

## Observações

> **⚠️ Atenção:** O nome da Data Extension no primeiro parâmetro **deve ser hard-coded** (escrito diretamente como texto). Se você tentar usar uma variável AMPscript (ex: `ClaimRow(@nomeDe, ...)`), a função lança uma exceção. Isso é uma restrição por design.

> **⚠️ Atenção:** Se não houver nenhuma linha não reivindicada disponível na Data Extension, `ClaimRow` lança uma exceção. Em envios de alto volume, isso pode causar erros em massa se os cupons acabarem no meio do disparo. Considere usar [`ClaimRowValue`](../data-extension-functions/claimrowvalue.md) como alternativa, pois ela permite definir um valor de fallback quando não há linhas disponíveis.

- A coluna booleana usada como `claimColumn` precisa ser **obrigatória (non-nullable)** e ter o valor padrão **False**.
- Se a Data Extension possuir uma coluna chamada exatamente **"ClaimedDate"** (tipo Date, nullable), a função preenche automaticamente com a data e hora da reivindicação.
- Você pode preencher colunas extras da linha reivindicada adicionando pares de coluna/valor ao final da chamada da função.
- A função retorna **a linha inteira** — use [`Field`](../data-extension-functions/field.md) para extrair o valor de uma coluna específica do resultado.

> **💡 Dica:** Antes de um envio grande, verifique se a quantidade de linhas não reivindicadas na Data Extension é suficiente para o tamanho da audiência. Você pode usar [`DataExtensionRowCount`](../data-extension-functions/dataextensionrowcount.md) para ter uma noção do total, mas lembre-se de que ela conta todas as linhas (claimed e unclaimed).

## Funções relacionadas

- [`ClaimRowValue`](../data-extension-functions/claimrowvalue.md) — semelhante, mas retorna apenas o valor de uma coluna específica e aceita um valor de fallback quando não há linhas disponíveis
- [`Field`](../data-extension-functions/field.md) — para extrair o valor de uma coluna específica da linha retornada por `ClaimRow`
- [`Lookup`](../data-extension-functions/lookup.md) — para buscar valores em Data Extensions sem reivindicação
- [`LookupRows`](../data-extension-functions/lookuprows.md) — para buscar múltiplas linhas de uma Data Extension
- [`DataExtensionRowCount`](../data-extension-functions/dataextensionrowcount.md) — para verificar o total de linhas em uma Data Extension
- [`Empty`](../utility-functions/empty.md) — para verificar se o resultado retornado é vazio
- [`RaiseError`](../utility-functions/raiseerror.md) — para tratamento personalizado de erros quando cupons acabam