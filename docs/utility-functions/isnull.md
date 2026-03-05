---
title: IsNull
sidebar_label: IsNull
description: Testa se o valor de uma variável ou função é nulo, retornando true ou false.
---

# IsNull

## Descrição

A função `IsNull` verifica se o valor de uma variável ou função é **nulo** (null). Se for nulo, retorna `true`; caso contrário, retorna `false`. É essencial para validar dados antes de usá-los em e-mails e CloudPages - especialmente quando você trabalha com Data Extensions onde campos podem vir sem nenhum valor preenchido.

## Sintaxe

```ampscript
IsNull(valorParaTestar)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| valorParaTestar | String | Sim | Variável ou função cujo valor será testado para verificar se é nulo. |

## Exemplo básico

Verificando se uma variável declarada sem valor atribuído é nula - situação comum quando você declara variáveis mas a lógica de atribuição ainda não executou.

```ampscript
%%[
VAR @cidade
SET @resultado = IsNull(@cidade)
]%%

A variável @cidade é nula? %%=V(@resultado)=%%
```

**Saída:**
```
A variável @cidade é nula? True
```

## Exemplo avançado

Em uma régua de boas-vindas da Lojas Vitória, você precisa verificar se o campo de telefone do cliente veio preenchido antes de montar a mensagem. Quando o dado vem de uma Data Extension e o campo é nullable, ele pode chegar como null (e não como string vazia).

```ampscript
%%[
SET @nome = "Maria Santos"
SET @email = "maria.santos@email.com.br"
SET @telefone = Lookup("Clientes_Vitoria", "Telefone", "Email", @email)

IF IsNull(@telefone) THEN
  SET @mensagem = Concat("Olá, ", @nome, "! Atualize seu telefone no nosso site para receber ofertas exclusivas por SMS.")
ELSE
  SET @mensagem = Concat("Olá, ", @nome, "! Vamos enviar novidades também para o número ", @telefone, ".")
ENDIF
]%%

%%=V(@mensagem)=%%
```

**Saída (quando o telefone não existe na DE):**
```
Olá, Maria Santos! Atualize seu telefone no nosso site para receber ofertas exclusivas por SMS.
```

**Saída (quando o telefone existe na DE):**
```
Olá, Maria Santos! Vamos enviar novidades também para o número (11) 99999-9999.
```

## Observações

> **⚠️ Atenção:** `IsNull` e [Empty](../utility-functions/empty.md) **não são a mesma coisa**. A função `Empty` retorna `true` quando o valor é uma **string vazia** (`""`), enquanto `IsNull` retorna `true` apenas quando o valor é **null**. Uma variável declarada sem `SET` é null, mas um campo de Data Extension que existe porém está em branco pode ser uma string vazia. Na prática, muitos desenvolvedores combinam as duas verificações para cobrir ambos os cenários.

> **💡 Dica:** Quando você precisa testar se um valor é nulo **e já definir um valor padrão** em uma única linha, considere usar [IsNullDefault](../utility-functions/isnulldefault.md) - ela faz as duas coisas de uma vez e deixa o código mais limpo.

## Funções relacionadas

- [Empty](../utility-functions/empty.md) - testa se o valor é uma string vazia (diferente de null)
- [IsNullDefault](../utility-functions/isnulldefault.md) - testa se é nulo e já retorna um valor padrão
- [IIF](../utility-functions/iif.md) - avaliação condicional inline, útil para combinar com `IsNull`
- [AttributeValue](../utility-functions/attributevalue.md) - recupera valor de atributo retornando string vazia (em vez de null) quando não encontrado
- [Lookup](../data-extension-functions/lookup.md) - busca dados em Data Extensions, onde campos podem retornar null