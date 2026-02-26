---
title: Length
sidebar_label: Length
description: Retorna o número de caracteres de uma string, útil para validações de tamanho de campos e URLs no Marketing Cloud.
---

# Length

## Descrição

A função `Length` retorna o número de caracteres presentes em uma string. É super útil quando você precisa validar o tamanho de campos como CPF, CEP, telefone ou URLs antes de usá-los no seu conteúdo. Você passa uma string e ela te devolve um número inteiro com a quantidade de caracteres. Simples assim!

## Sintaxe

```ampscript
Length(sourceString)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|--------------|--------|-------------|--------------------------------------------------|
| sourceString | String | Sim | A string da qual você quer descobrir o tamanho. |

## Exemplo básico

Imagine que você quer verificar se o CPF do assinante foi preenchido com o tamanho correto (14 caracteres com máscara):

```ampscript
%%[
SET @cpf = "123.456.789-00"
SET @tamanho = Length(@cpf)
]%%

O CPF informado tem %%=v(@tamanho)=%% caracteres.
```

**Saída:**
```
O CPF informado tem 14 caracteres.
```

## Exemplo avançado

Esse é um cenário bem comum: você tem uma URL de imagem dinâmica vinda de uma Data Extension e precisa verificar se ela é muito longa. Se passar de um certo limite, usa a função `WrapLongURL` para encurtar. Caso contrário, usa a URL original direto. Isso evita problemas de quebra de links em clientes de e-mail:

```ampscript
%%[
SET @nomeCliente = "Maria Santos"
SET @urlImagem = Lookup("Campanhas_Natal", "URLBanner", "Email", emailaddr)
SET @tamanhoUrl = Length(@urlImagem)

IF @tamanhoUrl >= 975 THEN
  SET @urlFinal = WrapLongURL(@urlImagem)
ELSE
  SET @urlFinal = @urlImagem
ENDIF
]%%

<p>Olá, %%=v(@nomeCliente)=%%! Confira nossas ofertas de Natal:</p>
<img src="%%=v(@urlFinal)=%%" alt="Banner Natal - Lojas Vitória" />
```

**Saída (quando a URL tem menos de 975 caracteres):**
```html
<p>Olá, Maria Santos! Confira nossas ofertas de Natal:</p>
<img src="https://www.lojasvitoria.com.br/images/banner-natal-2024.jpg" alt="Banner Natal - Lojas Vitória" />
```

Outro exemplo bem prático: validar o CEP antes de exibir a estimativa de frete grátis em um e-mail de carrinho abandonado:

```ampscript
%%[
SET @nome = "Carlos Oliveira"
SET @cep = AttributeValue("CEP")
SET @tamanhoCep = Length(@cep)

IF @tamanhoCep == 9 THEN
  /* CEP com máscara: 01310-100 */
  SET @msgFrete = Concat("Frete grátis para o CEP ", @cep, " em compras acima de R$299!")
ELSEIF @tamanhoCep == 8 THEN
  /* CEP sem máscara: 01310100 */
  SET @cepFormatado = Concat(Substring(@cep, 1, 5), "-", Substring(@cep, 6, 3))
  SET @msgFrete = Concat("Frete grátis para o CEP ", @cepFormatado, " em compras acima de R$299!")
ELSE
  SET @msgFrete = "Atualize seu CEP no cadastro para calcular o frete grátis!"
ENDIF
]%%

Olá, %%=v(@nome)=%%!

%%=v(@msgFrete)=%%
```

**Saída (CEP com 9 caracteres):**
```
Olá, Carlos Oliveira!

Frete grátis para o CEP 01310-100 em compras acima de R$299!
```

**Saída (CEP inválido/incompleto):**
```
Olá, Carlos Oliveira!

Atualize seu CEP no cadastro para calcular o frete grátis!
```

## Observações

- A função conta **todos** os caracteres da string, incluindo espaços, hífens, pontos e qualquer caractere especial.
- Se você precisa contar o tamanho de uma string sem espaços nas pontas, combine com [Trim](../string-functions/trim.md) antes: `Length(Trim(@valor))`.
- Útil para validações de campos brasileiros: CPF (14 caracteres com máscara), CNPJ (18 com máscara), CEP (9 com máscara), telefone celular com DDD (15 caracteres no formato `(11) 99999-9999`).
- O retorno é um valor numérico inteiro, então você pode usá-lo diretamente em comparações com `IF`, operações matemáticas, etc.
- Muito utilizada em conjunto com [Substring](../string-functions/substring.md) para extrair partes de uma string com base no tamanho total.
- No exemplo da documentação oficial, a Salesforce demonstra o uso de `Length` combinado com [WrapLongURL](../http-functions/wraplongurl.md) para encurtar URLs que excedam 975 caracteres, evitando problemas de renderização em clientes de e-mail.

## Funções relacionadas

- [Substring](../string-functions/substring.md) — Extrai parte de uma string a partir de uma posição e tamanho, geralmente usada junto com `Length`.
- [Trim](../string-functions/trim.md) — Remove espaços em branco das pontas da string, útil antes de medir o tamanho real.
- [Concat](../string-functions/concat.md) — Concatena strings, frequentemente combinada com `Length` para validação e montagem de conteúdo.
- [IndexOf](../string-functions/indexof.md) — Encontra a posição de um caractere dentro da string, complementa validações de formato.
- [Replace](../string-functions/replace.md) — Substitui partes de uma string, útil para remover caracteres antes de contar o tamanho real.
- [WrapLongURL](../http-functions/wraplongurl.md) — Encurta URLs longas, usada em conjunto com `Length` para verificar se a URL excede um limite.
- [Empty](../utility-functions/empty.md) — Verifica se uma string está vazia, complementa checagens de `Length`.
- [AttributeValue](../utility-functions/attributevalue.md) — Recupera valores de atributos de assinante de forma segura para depois validar com `Length`.