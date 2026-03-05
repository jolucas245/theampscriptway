---
title: Case Sensitivity
sidebar_label: Case Sensitivity
description: AMPscript não diferencia maiúsculas de minúsculas em palavras-chave e nomes de funções - entenda o que isso significa na prática.
sidebar_position: 10
---

# Case Sensitivity

AMPscript é **case-insensitive** para palavras-chave e nomes de funções. Isso significa que `Replace`, `replace` e `REPLACE` são tratados exatamente da mesma forma - produzem o mesmo resultado.

```ampscript
%%[
SET @texto = 'Olá mundo!'

/* Todas as variações abaixo são válidas e produzem o mesmo resultado */
SET @a = Replace(@texto, 'mundo', 'Brasil')
SET @b = replace(@texto, 'mundo', 'Brasil')
SET @c = REPLACE(@texto, 'mundo', 'Brasil')
]%%
```

**Saída das três variáveis:** `Olá Brasil!`

O mesmo vale para palavras-chave estruturais da linguagem: `IF`, `If` e `if` funcionam da mesma forma. `FOR`, `For` e `for` também.

## Por que isso importa

A flexibilidade é boa, mas pode virar problema em projetos com múltiplos desenvolvedores. Sem uma convenção definida, o mesmo projeto pode ter `Lookup`, `LOOKUP` e `lookup` misturados - o que funciona, mas dificulta muito a leitura e manutenção.

A documentação oficial da Salesforce adota **PascalCase** para funções - primeira letra de cada palavra em maiúsculo. Na AMPScript Way, recomendamos essa convenção combinada com `MAIÚSCULAS` para palavras-chave estruturais:

| Elemento | Convenção | Exemplo |
|----------|-----------|---------|
| Funções | PascalCase | `Lookup()`, `FormatDate()`, `Concat()` |
| Variáveis | camelCase | `@nomeCliente`, `@totalPedidos` |
| Palavras-chave | MAIÚSCULAS | `SET`, `IF THEN ENDIF`, `FOR DO NEXT` |

> **💡 Dica:** O mais importante não é qual convenção você escolhe - é ser consistente. Defina o padrão com sua equipe no início do projeto e documente-o. Isso economiza tempo e evita discussões desnecessárias.

Para mais detalhes sobre convenções de nomenclatura e organização de código, veja [Boas Práticas](/getting-started/best-practices).
