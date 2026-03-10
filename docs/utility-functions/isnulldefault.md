---
title: IsNullDefault
sidebar_label: IsNullDefault
description: Define valores padrão para campos vazios em formulários Smart Capture, facilitando a inserção de dados em Data Extensions.
---

# IsNullDefault

## Descrição

A função `IsNullDefault` permite criar valores padrão para campos vazios em formulários Smart Capture. Ela é especialmente útil quando você precisa inserir dados de um formulário Smart Capture em uma Data Extension e quer garantir que campos não preenchidos pelo usuário recebam um valor predefinido em vez de ficarem nulos. A função retorna o primeiro parâmetro se o campo tiver valor, ou o segundo parâmetro se o campo estiver nulo.

## Sintaxe

```ampscript
IsNullDefault(nonNullValue, nullValue)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| nonNullValue | string | Sim | Valor retornado quando o campo do formulário Smart Capture **não** é nulo |
| nullValue | string | Sim | Valor retornado quando o campo do formulário Smart Capture **é** nulo |

## Exemplo básico

Inserindo dados de um formulário Smart Capture de cadastro da MegaStore em uma Data Extension, com valor padrão "Básico" para o campo de categoria do cliente quando ele não for preenchido:

```ampscript
%%[

InsertDE(
  "Cadastro_Clientes",
  "Nome", Nome,
  "Email", Email,
  "Categoria", IsNullDefault(Categoria, "Básico")
)

]%%
```

**Saída:**

Se o campo "Categoria" for preenchido com "Premium":
```
O valor "Premium" é inserido na Data Extension.
```

Se o campo "Categoria" estiver vazio:
```
O valor "Básico" é inserido na Data Extension.
```

## Exemplo avançado

Formulário Smart Capture da Conecta Telecom para captação de leads em uma CloudPage. Vários campos opcionais recebem valores padrão para garantir consistência na Data Extension de destino:

```ampscript
%%[

VAR @nome, @email, @telefone, @cidade, @plano, @origem

SET @nome = Nome
SET @email = Email
SET @telefone = Telefone
SET @cidade = Cidade
SET @plano = Plano
SET @origem = Origem

InsertDE(
  "Leads_Conecta_Telecom",
  "Nome", @nome,
  "Email", @email,
  "Telefone", IsNullDefault(@telefone, "Não informado"),
  "Cidade", IsNullDefault(@cidade, "São Paulo"),
  "Plano", IsNullDefault(@plano, "Básico"),
  "Origem", IsNullDefault(@origem, "Landing Page")
)

]%%
```

**Saída:**

Para um lead que preencheu apenas nome e e-mail:
```
Nome: Maria Santos
Email: maria.santos@email.com.br
Telefone: Não informado
Cidade: São Paulo
Plano: Básico
Origem: Landing Page
```

Para um lead que preencheu todos os campos:
```
Nome: Carlos Mendes
Email: carlos.mendes@email.com.br
Telefone: (11) 99999-9999
Cidade: Curitiba
Plano: Premium
Origem: Google Ads
```

## Observações

> **⚠️ Atenção:** A função `IsNullDefault` foi projetada especificamente para uso com formulários **Smart Capture**. Ela avalia se o campo do formulário é nulo - não confunda com campos vazios vindos de Data Extensions ou outras fontes de dados.

> **💡 Dica:** Usar `IsNullDefault` é uma forma prática de garantir que sua Data Extension nunca receba valores nulos de formulários Smart Capture. Isso evita problemas em personalizações posteriores de e-mails e réguas de relacionamento que dependam desses campos.

## Funções relacionadas

- [IsNull](../utility-functions/isnull.md) - verifica se um valor é nulo (retorna booleano)
- [Empty](../utility-functions/empty.md) - verifica se um valor é vazio ou nulo
- [IIF](../utility-functions/iif.md) - retorna um valor ou outro com base em uma condição
- [InsertDE](../data-extension-functions/insertde.md) - insere registros em uma Data Extension
- [AttributeValue](../utility-functions/attributevalue.md) - recupera valor de atributo retornando string vazia em vez de erro quando não encontrado