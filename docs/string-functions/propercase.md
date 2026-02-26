---
title: ProperCase
sidebar_label: ProperCase
description: Retorna a string informada com a primeira letra de cada palavra em maiúscula (capitalizada).
---

<!-- generated-by-script -->

# ProperCase

## Descrição

A função `ProperCase()` recebe uma string e retorna ela com a primeira letra de cada palavra convertida para maiúscula. É super útil para padronizar nomes de clientes, endereços e outras informações que vêm de Data Extensions ou formulários onde o texto pode estar todo em maiúsculas ou minúsculas. A conversão acontece para **todas** as palavras, independentemente do tamanho delas — até palavras com uma única letra terão essa letra convertida para maiúscula.

## Sintaxe

```ampscript
ProperCase(sourceString)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|--------------|--------|-------------|-----------|
| sourceString | String | Sim | A string que você quer converter para proper case (primeira letra de cada palavra em maiúscula). |

## Exemplo básico

Imagine que você tem uma Data Extension de clientes e o nome foi cadastrado todo em maiúsculas. Você quer exibir no e-mail de forma mais elegante:

```ampscript
%%[
SET @nomeCliente = "MARIA SANTOS"
SET @nomeFormatado = ProperCase(@nomeCliente)
]%%

Olá, %%=v(@nomeFormatado)=%%! Aproveite nossas ofertas de Dia das Mães.
```

**Saída:**
```
Olá, Maria Santos! Aproveite nossas ofertas de Dia das Mães.
```

## Exemplo avançado

Aqui um cenário bem comum: você tem dados de endereço do cliente armazenados em caixa alta na Data Extension e precisa montar o endereço completo formatado em proper case para um e-mail de confirmação de pedido da **MegaStore**:

```ampscript
%%[
SET @rua = "RUA DAS FLORES"
SET @numero = "1245"
SET @bairro = "JARDIM PRIMAVERA"
SET @cidade = "SAO PAULO"
SET @estado = "SP"
SET @cep = "01234-567"

SET @ruaFormatada = ProperCase(@rua)
SET @bairroFormatado = ProperCase(@bairro)
SET @cidadeFormatada = ProperCase(@cidade)

SET @enderecoCompleto = Concat(
  @ruaFormatada, ", ", @numero, " - ",
  @bairroFormatado, ", ",
  @cidadeFormatada, " - ", @estado, " | CEP: ", @cep
)
]%%

Seu pedido será entregue no endereço:
%%=v(@enderecoCompleto)=%%

Frete grátis para compras acima de R$299! 🎉
```

**Saída:**
```
Seu pedido será entregue no endereço:
Rua Das Flores, 1245 - Jardim Primavera, Sao Paulo - SP | CEP: 01234-567

Frete grátis para compras acima de R$299! 🎉
```

Outro exemplo prático — personalização de saudação combinando com [Lookup](../data-extension-functions/lookup.md) para buscar dados do cliente:

```ampscript
%%[
SET @email = AttributeValue("emailaddr")
SET @nomeCompleto = Lookup("Clientes_FarmaRede", "NomeCompleto", "Email", @email)
SET @cidade = Lookup("Clientes_FarmaRede", "Cidade", "Email", @email)

SET @nomeFormatado = ProperCase(@nomeCompleto)
SET @cidadeFormatada = ProperCase(@cidade)
]%%

Oi, %%=v(@nomeFormatado)=%%!

Temos novidades na FarmaRede mais perto de você em %%=v(@cidadeFormatada)=%%.
Acumule pontos no programa FarmaVantagens e troque por cashback em reais! 💊
```

**Saída:**
```
Oi, Carlos Oliveira!

Temos novidades na FarmaRede mais perto de você em Belo Horizonte.
Acumule pontos no programa FarmaVantagens e troque por cashback em reais! 💊
```

## Observações

- A função capitaliza a primeira letra de **cada** palavra da string, sem exceção. Isso significa que preposições e artigos como "da", "de", "do", "das" também terão a primeira letra em maiúscula (ex: "RUA DAS FLORES" vira "Rua Das Flores", e não "Rua das Flores"). Se você precisa manter preposições em minúscula, vai precisar tratar esses casos manualmente com [Replace](../string-functions/replace.md).
- Se a string de entrada já estiver parcialmente formatada (ex: "jOÃO silva"), a função converte apenas a primeira letra de cada palavra para maiúscula. As demais letras da palavra são convertidas para minúscula, resultando em "João Silva".
- Considere usar [Trim](../string-functions/trim.md) antes de `ProperCase()` para remover espaços extras no início e fim da string, garantindo um resultado mais limpo.
- Se o valor da string for vazio ou nulo, avalie usar [Empty](../utility-functions/empty.md) ou [IsNullDefault](../utility-functions/isnulldefault.md) para tratar esses cenários antes de aplicar a função.
- A função funciona normalmente em emails, SMS, CloudPages e qualquer outro contexto do Marketing Cloud que suporte AMPscript.

## Funções relacionadas

- [Uppercase](../string-functions/uppercase.md) — converte toda a string para letras maiúsculas
- [Lowercase](../string-functions/lowercase.md) — converte toda a string para letras minúsculas
- [Concat](../string-functions/concat.md) — concatena múltiplas strings em uma só, ótima para montar textos combinados com ProperCase
- [Trim](../string-functions/trim.md) — remove espaços em branco do início e fim da string antes de formatar
- [Replace](../string-functions/replace.md) — substitui trechos da string, útil para corrigir preposições após o ProperCase
- [AttributeValue](../utility-functions/attributevalue.md) — recupera o valor de um atributo do subscriber, frequentemente usado como entrada para ProperCase