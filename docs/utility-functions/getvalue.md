---
title: GetValue
sidebar_label: GetValue
description: Retorna o valor de um atributo ou campo especificado, funcionando como uma alternativa à função V() para recuperar valores de variáveis e atributos.
---

<!-- generated-by-script -->

# GetValue

## Descrição

A função `GetValue` recupera o valor de um atributo de perfil, propriedade do assinante ou variável AMPscript, dado o nome como uma string. Ela funciona de forma semelhante à função `V()` — basicamente, ambas fazem a mesma coisa: resolvem o valor de uma referência passada como parâmetro. Na prática, `GetValue` é raramente usada no dia a dia, já que a função `V()` é mais curta e cumpre o mesmo papel. Ainda assim, você pode encontrá-la em códigos legados ou em situações onde a legibilidade do nome completo da função é preferida.

## Sintaxe

```ampscript
GetValue(valor)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| valor | String / Variável | Sim | O nome do atributo, campo ou variável cujo valor você deseja recuperar. |

## Exemplo básico

Imagine que você tem uma Data Extension de clientes com o campo `PrimeiroNome` e quer exibir o nome do assinante no e-mail:

```ampscript
%%[
SET @primeiroNome = "Maria"
SET @resultado = GetValue(@primeiroNome)
]%%

Olá, %%=v(@resultado)=%%!
```

**Saída:**
```
Olá, Maria!
```

## Exemplo avançado

Cenário real: um e-mail de programa de fidelidade da **Lojas Vitória** que consulta uma Data Extension para exibir o saldo de pontos e a categoria do cliente.

```ampscript
%%[
SET @email = AttributeValue("emailaddr")
SET @rows = LookupRows("Fidelidade_Clientes", "Email", @email)

IF RowCount(@rows) > 0 THEN
  SET @cliente = Row(@rows, 1)
  SET @nome = Field(@cliente, "NomeCompleto")
  SET @pontos = Field(@cliente, "SaldoPontos")
  SET @categoria = Field(@cliente, "Categoria")

  SET @nomeValor = GetValue(@nome)
  SET @pontosValor = GetValue(@pontos)
  SET @categoriaValor = GetValue(@categoria)
ELSE
  SET @nomeValor = "Cliente"
  SET @pontosValor = "0"
  SET @categoriaValor = "Bronze"
ENDIF
]%%

Olá, %%=v(@nomeValor)=%%! 🎉

Você é cliente categoria **%%=v(@categoriaValor)=%%** do programa
Vitória Fidelidade.

Seu saldo atual: **%%=v(@pontosValor)=%% pontos**

%%[ IF @pontosValor >= 5000 THEN ]%%
Parabéns! Você já pode trocar seus pontos por um vale-compras
de R$ 50,00. Acesse: www.lojasvitoria.com.br/fidelidade
%%[ ENDIF ]%%
```

**Saída (exemplo para a assinante Maria Santos com 7.200 pontos, categoria Ouro):**
```
Olá, Maria Santos! 🎉

Você é cliente categoria Ouro do programa Vitória Fidelidade.

Seu saldo atual: 7200 pontos

Parabéns! Você já pode trocar seus pontos por um vale-compras
de R$ 50,00. Acesse: www.lojasvitoria.com.br/fidelidade
```

## Observações

- **`GetValue` e `V()` são funcionalmente equivalentes.** Na grande maioria dos casos, os desenvolvedores preferem usar `V()` por ser mais curta e prática. Você provavelmente só vai encontrar `GetValue` em códigos mais antigos.
- Se a variável ou atributo passado não existir ou estiver vazio, `GetValue` retorna uma string vazia — não gera erro. Mesmo assim, é boa prática usar `Empty()` ou `IsNull()` para validar antes de exibir.
- A função aceita variáveis AMPscript (com `@`) e também nomes de atributos de perfil do assinante.
- Funciona em todos os contextos do Marketing Cloud: e-mails, CloudPages, SMS e Landing Pages.
- **Não confunda com `SetValue`**, que é a função complementar usada para *definir* o valor de uma variável.

## Funções relacionadas

- [V](../utility-functions/v.md) — forma abreviada e mais comum de recuperar o valor de uma variável ou atributo (equivalente ao GetValue)
- [SetValue](../utility-functions/setvalue.md) — define o valor de uma variável AMPscript (complemento do GetValue)
- [AttributeValue](../utility-functions/attributevalue.md) — recupera o valor de um atributo do assinante, retornando string vazia se não existir (sem erro)
- [Empty](../utility-functions/empty.md) — verifica se um valor está vazio, útil para validar o retorno do GetValue
- [IsNull](../utility-functions/isnull.md) — verifica se um valor é nulo antes de usá-lo
- [IsNullDefault](../utility-functions/isnulldefault.md) — retorna um valor padrão caso o campo seja nulo
- [Field](../data-extension-functions/field.md) — extrai o valor de um campo específico de uma linha retornada por LookupRows
- [Lookup](../data-extension-functions/lookup.md) — busca um valor único diretamente em uma Data Extension