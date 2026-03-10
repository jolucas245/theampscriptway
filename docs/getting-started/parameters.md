---
title: Parâmetros de Funções
sidebar_label: Parâmetros de Funções
description: Como passar parâmetros para funções AMPscript - ordem, tipos aceitos e como lidar com parâmetros opcionais.
sidebar_position: 8
---

# Parâmetros de Funções

As funções AMPscript recebem dados através de parâmetros - valores que você passa entre os parênteses para que a função possa fazer seu trabalho. Entender como os parâmetros funcionam evita erros comuns e deixa seu código mais previsível.

## Ordem importa

Os parâmetros devem ser passados na **ordem exata** definida pela função. A seção de referência deste site lista os parâmetros de cada função na ordem correta.

Por exemplo, a função `FormatCurrency()` tem esta assinatura:

```
FormatCurrency(numero, codigoLocale, casasDecimais, simboloMoeda)
```

O número a converter sempre vem primeiro, seguido pelo locale, e assim por diante. Invertê-los produz resultados errados ou erros de execução.

## Parâmetros opcionais

Algumas funções têm parâmetros opcionais - você não precisa passá-los se não precisar deles. Na `FormatCurrency()`, os dois últimos parâmetros (`casasDecimais` e `simboloMoeda`) são opcionais.

A regra importante é: se quiser passar um parâmetro opcional que vem **depois** de outro opcional que você quer pular, passe `null` ou uma string vazia `""` no lugar do parâmetro que não quer especificar.

```ampscript
%%[
SET @valor = 1299.90

/* Passando só os obrigatórios */
SET @formatado = FormatCurrency(@valor, 'pt-BR')

/* Pulando casasDecimais com null para chegar em simboloMoeda */
SET @formatadoCustom = FormatCurrency(@valor, 'pt-BR', null, 'R$')
]%%
```

## Tipos de entrada aceitos

As funções AMPscript aceitam três tipos de entrada como parâmetros:

**Valores constantes** - texto ou número fixo diretamente no código:
```ampscript
SET @resultado = Lowercase('JOÃO SILVA')
/* Resultado: joão silva */
```

**Atributos** - campos do perfil do subscriber ou da Data Extension de envio:
```ampscript
SET @resultado = Lowercase(Nome)
/* "Nome" é um atributo do subscriber */
```

**Variáveis** - valores armazenados em variáveis com `@`:
```ampscript
SET @nomeDigitado = 'MARIA SANTOS'
SET @resultado    = Lowercase(@nomeDigitado)
/* Resultado: maria santos */
```

## Funções não aceitam recursão

Você não pode chamar uma função dentro de si mesma - o AMPscript não suporta recursão. Se isso acontecer, o sistema lança um erro `104 - RecursiveScriptError`, e o e-mail ou SMS é marcado como "Erro/Não enviado", contando contra o limite de erros do subscriber.

> **⚠️ Atenção:** Erros de recursão em produção podem comprometer seu envio. Se precisar de lógica repetitiva, use um loop `FOR` com contador - nunca tente chamar a função dentro dela mesma.
