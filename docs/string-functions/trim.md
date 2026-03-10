---
title: Trim
sidebar_label: Trim
description: Remove espaços em branco do início e do fim de uma string.
---

# Trim

## Descrição

A função **Trim** remove espaços em branco do início e do fim de uma string. É essencial para limpar dados que vêm de Data Extensions, formulários de CloudPages ou integrações externas, onde é muito comum aparecerem espaços extras que bagunçam comparações, personalizações e validações. Retorna a string original sem os espaços em branco nas extremidades.

## Sintaxe

```ampscript
Trim(sourceString)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|--------------|--------|-------------|-----------|
| sourceString | String | Sim | A string da qual os espaços em branco serão removidos do início e do fim. |

## Exemplo básico

Limpando o nome de um cliente que veio com espaços extras de um cadastro:

```ampscript
%%[
VAR @nome, @nomeLimpo
SET @nome = "  João Silva  "
SET @nomeLimpo = Trim(@nome)
]%%

Nome original: "%%=v(@nome)=%%" 
Nome limpo: "%%=v(@nomeLimpo)=%%" 
```

**Saída:**
```
Nome original: "  João Silva  "
Nome limpo: "João Silva"
```

## Exemplo avançado

Tratando dados de um formulário de CloudPage antes de gravar na Data Extension - combinando Trim com outras funções para padronizar o cadastro:

```ampscript
%%[
VAR @emailRaw, @nomeRaw, @cidadeRaw
VAR @email, @nome, @cidade

/* Dados vindos de um formulário com espaços acidentais */
SET @emailRaw = "  maria.santos@megastore.com.br  "
SET @nomeRaw = "  maria santos  "
SET @cidadeRaw = "  são paulo  "

/* Limpa e padroniza */
SET @email = Lowercase(Trim(@emailRaw))
SET @nome = ProperCase(Trim(@nomeRaw))
SET @cidade = ProperCase(Trim(@cidadeRaw))

UpsertDE("Cadastro_Clientes", 1, "Email", @email, "Nome", @nome, "Cidade", @cidade)
]%%

Cadastro atualizado: %%=v(@nome)=%% (%%=v(@email)=%%) - %%=v(@cidade)=%%
```

**Saída:**
```
Cadastro atualizado: Maria Santos (maria.santos@megastore.com.br) - São Paulo
```

## Observações

- A função remove **apenas** espaços em branco do início e do fim da string. Espaços no meio do texto são preservados (por exemplo, entre nome e sobrenome).

> **💡 Dica:** Sempre aplique `Trim` em dados que vêm de fontes externas - importações de CSV, formulários de CloudPages, integrações via API. É muito comum virem espaços invisíveis que causam falhas em comparações e lookups. Um `Lookup` que busca `"joao@email.com.br"` não vai encontrar `" joao@email.com.br "` se o dado não for tratado.

> **💡 Dica:** Combine `Trim` com [Lowercase](../string-functions/lowercase.md) ou [ProperCase](../string-functions/propercase.md) para criar um pipeline de limpeza de dados. Essa combinação é praticamente obrigatória em formulários de captura.

## Funções relacionadas

- [Lowercase](../string-functions/lowercase.md) - converte a string para minúsculas
- [Uppercase](../string-functions/uppercase.md) - converte a string para maiúsculas
- [ProperCase](../string-functions/propercase.md) - capitaliza a primeira letra de cada palavra
- [Replace](../string-functions/replace.md) - substitui ocorrências dentro de uma string
- [Concat](../string-functions/concat.md) - concatena múltiplas strings