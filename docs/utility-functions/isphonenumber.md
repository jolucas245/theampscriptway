---
title: IsPhoneNumber
sidebar_label: IsPhoneNumber
description: Verifica se o valor informado é um número de telefone válido no North American Numbering Plan (NANP), retornando true ou false.
---

# IsPhoneNumber

## Descrição

A função `IsPhoneNumber` testa se o valor informado é um número de telefone válido de acordo com o **North American Numbering Plan (NANP)** — o plano de numeração usado em 25 países e territórios, a maioria na América do Norte e Caribe (EUA, Canadá, República Dominicana, entre outros). Se o número for válido no NANP, retorna `true`; caso contrário, retorna `false`. **Números de telefone que não fazem parte do NANP — como os brasileiros — sempre retornam `false`**, o que limita bastante seu uso direto para validação de telefones no Brasil.

## Sintaxe

```ampscript
IsPhoneNumber(phoneNumber)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| phoneNumber | string | Sim | O número de telefone a ser validado contra o NANP. |

## Exemplo básico

Verificando se um número de telefone norte-americano é válido — útil quando sua base tem contatos nos EUA ou Canadá:

```ampscript
%%[
VAR @telefoneUS, @resultado
SET @telefoneUS = "425.555.0185"
SET @resultado = IsPhoneNumber(@telefoneUS)
]%%

Telefone: %%=v(@telefoneUS)=%%
Válido (NANP): %%=v(@resultado)=%%
```

**Saída:**
```
Telefone: 425.555.0185
Válido (NANP): True
```

## Exemplo avançado

Em uma régua de relacionamento da Conecta Telecom que atende clientes no Brasil e nos EUA, você pode usar `IsPhoneNumber` para segmentar a lógica de exibição conforme a origem do número. Note que telefones brasileiros sempre retornam `false` nessa função:

```ampscript
%%[
VAR @nome, @telefone, @ehNANP, @mensagem

SET @nome = "João Silva"
SET @telefone = AttributeValue("Telefone")

/* Remove caracteres especiais, mantendo só números */
SET @telefoneLimpo = Replace(Replace(Replace(Replace(Replace(@telefone, "+", ""), "(", ""), ")", ""), "-", ""), " ", "")

SET @ehNANP = IsPhoneNumber(@telefoneLimpo)

IF @ehNANP == true THEN
  SET @mensagem = Concat("Olá, ", @nome, "! Identificamos seu telefone como válido no plano norte-americano (NANP).")
ELSE
  SET @mensagem = Concat("Olá, ", @nome, "! Seu telefone não faz parte do plano NANP. Para números brasileiros como (11) 99999-9999, utilize outra forma de validação.")
ENDIF
]%%

%%=v(@mensagem)=%%
```

**Saída (para um telefone brasileiro como `11999999999`):**
```
Olá, João Silva! Seu telefone não faz parte do plano NANP. Para números brasileiros como (11) 99999-9999, utilize outra forma de validação.
```

**Saída (para um telefone dos EUA como `4255550185`):**
```
Olá, João Silva! Identificamos seu telefone como válido no plano norte-americano (NANP).
```

## Observações

> **⚠️ Atenção:** Telefones brasileiros — como `(11) 99999-9999` ou `11999999999` — **sempre retornam `false`**, pois o Brasil não faz parte do NANP. Essa função **não serve para validar telefones brasileiros**. Se você precisa validar formato de telefone BR, considere usar [RegExMatch](../string-functions/regexmatch.md) com uma expressão regular adequada.

> **⚠️ Atenção:** Caracteres além de números, espaços, pontos, hífens e parênteses fazem a função retornar `false`, **mesmo que o número em si seja válido no NANP**. Por exemplo, `"+14255550142"` retorna `false` por causa do sinal de `+`. Para melhores resultados, passe apenas números para a função.

> **⚠️ Atenção:** A função retorna `true` para alguns números que começam com `922` e `926`. Quando ela identifica incorretamente um número inválido como válido, **o batch inteiro pode falhar**. Passe apenas dígitos numéricos para minimizar esse risco.

- A função aceita os seguintes separadores sem invalidar o número: espaços, pontos (`.`), hífens (`-`) e parênteses (`(` `)`).
- No contexto de operações brasileiras de SFMC, o uso mais comum dessa função é em bases multinacionais, onde você precisa distinguir telefones NANP de telefones de outros países.

## Funções relacionadas

- [IsEmailAddress](../utility-functions/isemailaddress.md) — valida se um valor é um endereço de e-mail válido
- [Empty](../utility-functions/empty.md) — verifica se um valor está vazio ou nulo
- [RegExMatch](../string-functions/regexmatch.md) — alternativa para validar telefones brasileiros com expressão regular
- [Replace](../string-functions/replace.md) — útil para limpar caracteres do telefone antes da validação
- [AttributeValue](../utility-functions/attributevalue.md) — recupera valores de atributos do assinante de forma segura
- [RaiseError](../utility-functions/raiseerror.md) — pode ser usada para interromper o envio quando o telefone não é válido