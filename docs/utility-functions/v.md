---
title: V
sidebar_label: V
description: Retorna o valor de uma variável AMPscript, permitindo acessar seu conteúdo de forma inline.
---

# V

## Descrição

A função `V()` retorna o valor armazenado em uma variável AMPscript. Ela é a forma padrão de exibir o conteúdo de uma variável dentro de expressões inline (`%%=...=%%`). Sempre que você precisa imprimir o valor de uma variável declarada com `SET`, você usa `V()` para acessá-lo. É uma das funções mais fundamentais do AMPscript — você vai usar ela o tempo todo.

## Sintaxe

```ampscript
V(@variavel)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|--------------|--------|-------------|------------------------------------------------|
| variableName | String | Sim | O nome da variável cujo valor você quer retornar. |

## Exemplo básico

```ampscript
%%[
  VAR @nomeCliente
  SET @nomeCliente = "Maria Santos"
]%%

Olá, %%=V(@nomeCliente)=%%! Bem-vinda à Lojas Vitória.
```

**Saída:**
```
Olá, Maria Santos! Bem-vinda à Lojas Vitória.
```

## Exemplo avançado

Cenário real: um e-mail de boas-vindas do programa de fidelidade da FarmaRede, onde combinamos `V()` com outras funções para personalizar a mensagem completa.

```ampscript
%%[
  VAR @primeiroNome, @pontos, @validade, @mensagem, @linkLoja

  SET @primeiroNome = "João"
  SET @pontos = 1500
  SET @validade = "31/12/2025"
  SET @linkLoja = "https://www.farmarede.com.br/programa-fidelidade"

  IF @pontos >= 1000 THEN
    SET @mensagem = Concat("Parabéns, ", V(@primeiroNome), "! Você tem ", V(@pontos), " pontos no FarmaRede Fidelidade.")
  ELSE
    SET @mensagem = Concat("Olá, ", V(@primeiroNome), "! Continue comprando para acumular mais pontos.")
  ENDIF
]%%

%%=V(@mensagem)=%%

Seus pontos são válidos até %%=V(@validade)=%%.

Acesse sua conta: %%=V(@linkLoja)=%%
```

**Saída:**
```
Parabéns, João! Você tem 1500 pontos no FarmaRede Fidelidade.

Seus pontos são válidos até 31/12/2025.

Acesse sua conta: https://www.farmarede.com.br/programa-fidelidade
```

## Observações

- `V()` é a forma mais comum de exibir variáveis em expressões inline (`%%=V(@var)=%%`). Dentro de blocos `%%[ ... ]%%`, você não precisa de `V()` para referenciar variáveis — basta usar `@variavel` diretamente em funções como `Concat()`, `IF`, etc.
- Se a variável não foi declarada ou não teve valor atribuído, `V()` retorna uma string vazia. Isso não gera erro, mas pode deixar espaços em branco no seu conteúdo. Use [IsNull](../utility-functions/isnull.md) ou [Empty](../utility-functions/empty.md) para verificar antes de exibir.
- Muitos desenvolvedores usam a forma abreviada `%%=@variavel=%%` sem `V()` e funciona da mesma maneira. Porém, usar `V()` explicitamente torna o código mais legível e é considerado uma boa prática.
- `V()` funciona em todos os contextos do SFMC: emails, SMS, CloudPages, landing pages e blocos de conteúdo.
- O parâmetro passado deve ser o nome da variável (com `@`), não uma string com o nome. Por exemplo: `V(@nome)` está correto; `V("@nome")` retornaria a string literal `"@nome"`.

## Funções relacionadas

- [Output](../utility-functions/output.md) — Exibe conteúdo dentro de blocos AMPscript (alternativa ao inline com `V()`)
- [OutputLine](../utility-functions/outputline.md) — Similar ao `Output`, mas adiciona uma quebra de linha ao final
- [TreatAsContent](../utility-functions/treatascontent.md) — Processa uma string como se fosse conteúdo AMPscript, útil quando o valor da variável contém AMPscript
- [AttributeValue](../utility-functions/attributevalue.md) — Retorna o valor de um atributo de perfil ou campo de Data Extension com tratamento seguro de nulos
- [Concat](../string-functions/concat.md) — Concatena strings e variáveis, frequentemente usada junto com `V()`
- [IsNull](../utility-functions/isnull.md) — Verifica se uma variável é nula antes de exibir com `V()`
- [IsNullDefault](../utility-functions/isnulldefault.md) — Retorna um valor padrão caso a variável seja nula, evitando espaços em branco