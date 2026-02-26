---
title: Condicionais
sidebar_label: Condicionais
description: Aprenda a usar estruturas condicionais em AMPscript para criar emails dinâmicos e personalizados no Salesforce Marketing Cloud.
sidebar_position: 4
---

<!-- generated-by-script -->

# Condicionais

Condicionais são o coração da personalização em AMPscript. É com elas que você decide **o que mostrar** para cada subscriber com base nos dados que tem. Imagina enviar um email de campanha da **MegaStore** onde clientes VIP veem uma oferta exclusiva e os demais veem outra — é exatamente isso que você vai aprender aqui.

Se você ainda não domina como declarar variáveis, dá uma passada no guia de [Variáveis](/docs/getting-started/variables) antes de continuar.

## IF / THEN / ENDIF

A estrutura mais básica. Se a condição for verdadeira, o bloco é executado.

**Sintaxe:**

```ampscript
%%[
IF @condicao THEN
  /* faça algo */
ENDIF
]%%
```

**Exemplo:** Vamos supor que você está montando um email para a campanha de **Dia das Mães** da MegaStore. Clientes com status "VIP" recebem um cupom especial:

```ampscript
%%[
SET @status = AttributeValue("StatusCliente")

IF @status == "VIP" THEN
  SET @cupom = "MAES50"
ENDIF
]%%
```

Se `@status` for "VIP", a variável `@cupom` recebe o valor `"MAES50"`. Caso contrário, nada acontece.

## ELSEIF / ELSE

Agora vamos **estender** o exemplo acima para cobrir mais cenários. O `ELSEIF` adiciona condições extras e o `ELSE` é o "se nada mais der certo":

```ampscript
%%[
SET @status = AttributeValue("StatusCliente")

IF @status == "VIP" THEN
  SET @cupom = "MAES50"
  SET @desconto = "50% de desconto"
ELSEIF @status == "Premium" THEN
  SET @cupom = "MAES30"
  SET @desconto = "30% de desconto"
ELSE
  SET @cupom = "MAES10"
  SET @desconto = "10% de desconto"
ENDIF
]%%
```

Agora todo subscriber recebe um cupom, independentemente do status. Simples, né?

> **💡 Dica:** Você pode encadear quantos `ELSEIF` quiser, mas se a lista ficar enorme, considere usar uma Data Extension de regras para manter o código limpo.

## Operadores de comparação

Esses são os operadores que você usa dentro do `IF`:

| Operador | Significado       | Exemplo              |
|----------|-------------------|----------------------|
| `==`     | Igual a           | `@status == "VIP"`   |
| `!=`     | Diferente de      | `@status != "Inativo"` |
| `>`      | Maior que         | `@total > 200`       |
| `<`      | Menor que         | `@total < 50`        |
| `>=`     | Maior ou igual a  | `@total >= 100`      |
| `<=`     | Menor ou igual a  | `@total <= 500`      |

> **⚠️ Atenção:** AMPscript compara strings **sem diferenciar** maiúsculas de minúsculas. `"VIP"` e `"vip"` são considerados iguais.

## Operadores lógicos (AND, OR, NOT)

Para combinar condições, use `AND`, `OR` e `NOT`.

**AND** — ambas as condições precisam ser verdadeiras:

```ampscript
%%[
IF @status == "VIP" AND @totalCompras > 500 THEN
  SET @freteGratis = "true"
ENDIF
]%%
```

**OR** — pelo menos uma condição precisa ser verdadeira:

```ampscript
%%[
IF @status == "VIP" OR @status == "Premium" THEN
  SET @acessoAntecipado = "true"
ENDIF
]%%
```

**NOT** — inverte a condição:

```ampscript
%%[
IF NOT Empty(@cupom) THEN
  SET @mensagem = Concat("Use o cupom: ", @cupom)
ENDIF
]%%
```

## IIF()

O `IIF()` é tipo um **IF inline** — perfeito para decisões rápidas em uma única linha. Funciona assim: `IIF(condição, valor_se_verdadeiro, valor_se_falso)`.

```ampscript
%%[
SET @saudacao = IIF(@status == "VIP", "Olá, cliente especial!", "Olá!")
SET @corBanner = IIF(@totalCompras >= 300, "#FFD700", "#CCCCCC")
]%%
```

> **💡 Dica:** Use `IIF()` para coisas simples como trocar uma cor ou uma palavra. Para lógica mais complexa, prefira `IF/ELSEIF/ELSE`.

## Exemplo final: tudo junto

Vamos montar um trecho real de um email da campanha de Dia das Mães da **MegaStore**, combinando tudo que vimos:

```html
%%[
SET @nome = AttributeValue("PrimeiroNome")
SET @status = AttributeValue("StatusCliente")
SET @totalCompras = AttributeValue("TotalComprasReais")
SET @cpf = AttributeValue("CPF")

IF @status == "VIP" AND @totalCompras >= 500 THEN
  SET @cupom = "MAES50"
  SET @desconto = "50%"
  SET @freteGratis = "true"
ELSEIF @status == "Premium" OR @totalCompras >= 200 THEN
  SET @cupom = "MAES30"
  SET @desconto = "30%"
  SET @freteGratis = IIF(@totalCompras >= 300, "true", "false")
ELSE
  SET @cupom = "MAES10"
  SET @desconto = "10%"
  SET @freteGratis = "false"
ENDIF

SET @msgFrete = IIF(@freteGratis == "true", "🚚 Frete grátis!", "")
]%%

<h1>Oi, %%=v(@nome)=%%! 💐</h1>
<p>Seu cupom exclusivo de Dia das Mães: <strong>%%=v(@cupom)=%%</strong></p>
<p>%%=v(@desconto)=%% de desconto em todo o site! %%=v(@msgFrete)=%%</p>
<p><a href="https://www.megastore.com.br/maes?cupom=%%=v(@cupom)=%%">Aproveitar agora</a></p>
```

Nesse exemplo, a Maria Santos (VIP com R$ 800 em compras) vê o cupom `MAES50` com frete grátis. Já o Carlos Oliveira (cliente novo com R$ 150 em compras) vê o cupom `MAES10` sem frete grátis. **Um único email, experiências completamente diferentes.**

---

Agora que você domina condicionais, o próximo passo natural são os [Loops](/docs/getting-started/loops), que permitem iterar sobre linhas de Data Extensions e montar conteúdo repetitivo de forma dinâmica.