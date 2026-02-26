---
title: Concat
sidebar_label: Concat
description: Concatena (junta) duas ou mais strings de texto em uma única string, na ordem em que são passadas.
---

# Concat

## Descrição

A função `Concat` junta duas ou mais strings de texto em uma única string, adicionando cada valor ao final do anterior, na ordem em que você passar os parâmetros. É uma das funções mais usadas no dia a dia do AMPscript — perfeita para montar nomes completos, URLs dinâmicas, mensagens personalizadas, códigos de cupom e muito mais. Ela retorna uma string com todos os valores concatenados. Se você precisa de espaços, hífens ou qualquer separador entre os valores, precisa incluí-los explicitamente como parâmetros.

## Sintaxe

```ampscript
Concat(string1, string2[, string3, ...])
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|--------|-------------|-----------|
| string1 | String | Sim | Primeira string de texto. |
| string2 | String | Sim | Segunda string de texto, adicionada ao final de `string1`. |
| stringN | String | Não | Você pode passar quantas strings adicionais quiser. Cada uma é adicionada ao final da anterior, na ordem. |

## Exemplo básico

Um cenário clássico: montar o nome completo do assinante a partir de campos separados (primeiro nome, nome do meio e sobrenome), incluindo espaços entre eles.

```ampscript
%%[
  SET @primeiroNome = "Maria"
  SET @nomeDoMeio = "Clara"
  SET @sobrenome = "Santos"

  SET @nomeCompleto = Concat(@primeiroNome, " ", @nomeDoMeio, " ", @sobrenome)
]%%

Olá, %%=v(@nomeCompleto)=%%! Seja bem-vinda.
```

**Saída:**
```
Olá, Maria Clara Santos! Seja bem-vinda.
```

## Exemplo avançado

Imagine que a **MegaStore** quer enviar um e-mail de Dia das Mães com um cupom personalizado e um link dinâmico para a página de ofertas. O código do cupom é montado combinando o prefixo da campanha, o ID do cliente e o valor do desconto.

```ampscript
%%[
  SET @primeiroNome = AttributeValue("PrimeiroNome")
  SET @sobrenome = AttributeValue("Sobrenome")
  SET @clienteId = AttributeValue("ClienteId")
  SET @pontosAcumulados = AttributeValue("Pontos")

  /* Monta o nome completo */
  SET @nomeCompleto = Concat(@primeiroNome, " ", @sobrenome)

  /* Gera o código do cupom: MAES24-00158-50 */
  SET @prefixoCampanha = "MAES24"
  SET @valorDesconto = "50"
  SET @codigoCupom = Concat(@prefixoCampanha, "-", @clienteId, "-", @valorDesconto)

  /* Monta a URL personalizada com parâmetros */
  SET @urlBase = "https://www.megastore.com.br/ofertas-maes"
  SET @urlCompleta = Concat(@urlBase, "?cupom=", @codigoCupom, "&cliente=", @clienteId)

  /* Monta a linha de saudação com pontos do programa de fidelidade */
  SET @mensagemPontos = Concat(
    "Você tem ", 
    @pontosAcumulados, 
    " pontos no programa MegaPontos. ",
    "Use o cupom abaixo e ganhe R$ ", 
    @valorDesconto, 
    ",00 de desconto em compras acima de R$ 299,00!"
  )
]%%

<h1>%%=v(Concat("Feliz Dia das Mães, ", @primeiroNome, "! 💐"))=%%</h1>

<p>%%=v(@mensagemPontos)=%%</p>

<p>Seu cupom exclusivo: <strong>%%=v(@codigoCupom)=%%</strong></p>

<a href="%%=RedirectTo(@urlCompleta)=%%">Aproveitar ofertas</a>

<p style="font-size: 12px; color: #999;">
  %%=v(Concat("E-mail enviado para ", @nomeCompleto, " — ClienteId: ", @clienteId))=%%
</p>
```

**Saída (exemplo para a assinante Maria Santos, ID 00158, com 1.250 pontos):**
```
Feliz Dia das Mães, Maria! 💐

Você tem 1250 pontos no programa MegaPontos. Use o cupom abaixo e ganhe R$ 50,00 de desconto em compras acima de R$ 299,00!

Seu cupom exclusivo: MAES24-00158-50

[Botão: Aproveitar ofertas → https://www.megastore.com.br/ofertas-maes?cupom=MAES24-00158-50&cliente=00158]

E-mail enviado para Maria Santos — ClienteId: 00158
```

## Observações

- **Mínimo de dois parâmetros:** você precisa passar pelo menos duas strings para a função funcionar. Com apenas uma, vai dar erro.
- **Espaços não são automáticos:** a função simplesmente gruda um valor no outro. Se você quer espaço, vírgula, hífen ou qualquer separador, inclua como um parâmetro separado (ex: `Concat(@nome, " ", @sobrenome)`).
- **Sem limite de parâmetros:** você pode concatenar quantos valores quiser — basta ir adicionando parâmetros separados por vírgula.
- **Valores não-string:** na prática, valores numéricos e de outros tipos são convertidos para string automaticamente ao serem passados para `Concat`. Porém, se você precisa de formatação específica (casas decimais, moeda), use funções como [Format](../string-functions/format.md) ou [FormatCurrency](../string-functions/formatcurrency.md) antes de concatenar.
- **Campos nulos ou vazios:** se um dos campos vier vazio ou nulo da Data Extension, ele será tratado como string vazia. Isso pode resultar em espaços duplos ou separadores soltos. Combine com [Empty](../utility-functions/empty.md) ou [IsNullDefault](../utility-functions/isnulldefault.md) para tratar esses casos.
- **Funciona em todos os contextos:** e-mails, SMS, CloudPages, Landing Pages — sem restrições.
- **Alternativa inline:** para concatenações simples dentro de HTML, você também pode usar múltiplas chamadas `%%=v()=%%` lado a lado, mas `Concat` deixa o código mais limpo e organizado, especialmente quando há muitos valores.

## Funções relacionadas

- [Trim](../string-functions/trim.md) — remove espaços em branco do início e do fim de uma string. Útil para limpar valores antes de concatenar.
- [Replace](../string-functions/replace.md) — substitui partes de uma string por outro texto.
- [Substring](../string-functions/substring.md) — extrai uma parte de uma string, útil quando você quer concatenar apenas um trecho de um valor.
- [ProperCase](../string-functions/propercase.md) — formata a string com a primeira letra de cada palavra em maiúscula. Ótimo para padronizar nomes antes de juntar.
- [Uppercase](../string-functions/uppercase.md) — converte a string para maiúsculas, útil para códigos de cupom.
- [Lowercase](../string-functions/lowercase.md) — converte a string para minúsculas.
- [Format](../string-functions/format.md) — formata números e datas antes de incluí-los em uma concatenação.
- [FormatCurrency](../string-functions/formatcurrency.md) — formata valores monetários (ex: R$ 50,00) para uso em textos concatenados.
- [V](../utility-functions/v.md) — exibe o valor de uma variável no conteúdo renderizado.
- [IsNullDefault](../utility-functions/isnulldefault.md) — retorna um valor padrão quando o campo é nulo, evitando concatenações com valores vazios.
- [Empty](../utility-functions/empty.md) — verifica se uma string está vazia antes de concatenar.
- [AttributeValue](../utility-functions/attributevalue.md) — recupera o valor de um atributo do assinante, muito usado em conjunto com `Concat`.