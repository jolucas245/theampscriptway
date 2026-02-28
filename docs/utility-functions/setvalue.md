---
title: SetValue
sidebar_label: SetValue
description: Define o valor de uma variável AMPscript previamente declarada usando SET ou VAR.
---

<!-- generated-by-script -->

# SetValue

## Descrição

A função `SetValue` define ou atualiza o valor de uma variável AMPscript. Ela funciona como uma alternativa à instrução `SET` para atribuir valores a variáveis. Essa função é considerada **obsoleta (deprecated)** — hoje em dia, a forma padrão e recomendada de atribuir valores a variáveis é usando a instrução `SET @variavel = valor`. Você pode encontrar `SetValue` em códigos mais antigos, mas para novos desenvolvimentos, prefira usar `SET`.

## Sintaxe

```ampscript
SetValue(@variavel, valor)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| @variavel | Variável | Sim | A variável AMPscript que receberá o valor. Deve ter sido declarada previamente com `VAR` ou já existir no escopo. |
| valor | String, Número, Data, etc. | Sim | O valor que será atribuído à variável. Pode ser um literal, outra variável ou o resultado de uma expressão/função. |

## Exemplo básico

```ampscript
%%[
VAR @nomeCliente
SetValue(@nomeCliente, "Maria Santos")
]%%

Olá, %%=V(@nomeCliente)=%%! Bem-vinda à Lojas Vitória.
```

**Saída:**
```
Olá, Maria Santos! Bem-vinda à Lojas Vitória.
```

## Exemplo avançado

```ampscript
%%[
VAR @nome, @pontos, @categoria, @mensagem

SetValue(@nome, AttributeValue("PrimeiroNome"))
SetValue(@pontos, Lookup("ProgramaFidelidade", "Pontos", "EmailAssinante", EmailAddress))

IF @pontos >= 5000 THEN
  SetValue(@categoria, "Ouro")
  SetValue(@mensagem, Concat("Parabéns, ", @nome, "! Você é cliente ", @categoria, " com ", FormatNumber(@pontos, "N0"), " pontos. Aproveite frete grátis em compras acima de R$149,00!"))
ELSEIF @pontos >= 2000 THEN
  SetValue(@categoria, "Prata")
  SetValue(@mensagem, Concat("Olá, ", @nome, "! Você é cliente ", @categoria, " com ", FormatNumber(@pontos, "N0"), " pontos. Frete grátis acima de R$299,00!"))
ELSE
  SetValue(@categoria, "Bronze")
  SetValue(@mensagem, Concat("Olá, ", @nome, "! Você tem ", FormatNumber(@pontos, "N0"), " pontos. Acumule mais para subir de categoria!"))
ENDIF
]%%

%%=V(@mensagem)=%%
```

**Saída (exemplo para cliente com 6.200 pontos):**
```
Parabéns, João! Você é cliente Ouro com 6.200 pontos. Aproveite frete grátis em compras acima de R$149,00!
```

## Observações

- **Função obsoleta (deprecated):** `SetValue` é uma forma antiga de atribuir valores. A prática recomendada atualmente é usar a instrução `SET`:
  ```ampscript
  SET @nomeCliente = "Maria Santos"
  ```
  O resultado é exatamente o mesmo, mas `SET` é mais legível e é o padrão em toda a documentação moderna.
- Se você encontrar `SetValue` em código legado, ele continuará funcionando normalmente — não há necessidade de urgência para refatorar, mas ao escrever código novo, prefira `SET`.
- A variável deve ser declarada antes de usar `SetValue`. Caso contrário, o comportamento pode ser imprevisível.
- `SetValue` não retorna nenhum valor — ela apenas realiza a atribuição. Não tente usar `%%=SetValue(...)=%%` inline; use dentro de um bloco `%%[ ]%%`.
- Pode ser usada em qualquer contexto do SFMC: emails, CloudPages, SMS, Landing Pages, etc.

## Funções relacionadas

- [V](../utility-functions/v.md) — exibe o valor de uma variável AMPscript
- [GetValue](../utility-functions/getvalue.md) — recupera o valor de uma variável (equivalente legado de `V`)
- [AttributeValue](../utility-functions/attributevalue.md) — retorna o valor de um atributo de assinante ou campo de Data Extension
- [Output](../utility-functions/output.md) — escreve conteúdo diretamente na saída renderizada
- [Lookup](../data-extension-functions/lookup.md) — busca um valor em uma Data Extension para atribuir a variáveis
- [IsNullDefault](../utility-functions/isnulldefault.md) — retorna um valor padrão caso a variável seja nula