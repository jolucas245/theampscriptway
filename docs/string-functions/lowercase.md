---
title: Lowercase
sidebar_label: Lowercase
description: Converte todos os caracteres de uma string para letras minúsculas.
---

# Lowercase

## Descrição

A função `Lowercase` converte todos os caracteres de uma string para letras minúsculas. É extremamente útil para padronizar dados antes de fazer comparações - por exemplo, garantir que e-mails estejam sempre em minúsculo ou normalizar valores vindos de Data Extensions onde o preenchimento foi inconsistente. Retorna a string fornecida inteiramente em caracteres minúsculos.

## Sintaxe

```ampscript
Lowercase(sourceString)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| sourceString | String | Sim | A string que você deseja converter para caracteres minúsculos. |

## Exemplo básico

Padronizando o e-mail de um assinante para exibição em minúsculas no rodapé de um e-mail marketing:

```ampscript
%%[
SET @email = "JOAO.SILVA@LOJASVITORIA.COM.BR"
SET @emailPadronizado = Lowercase(@email)
]%%

Seu e-mail cadastrado: %%=v(@emailPadronizado)=%%
```

**Saída:**
```
Seu e-mail cadastrado: joao.silva@lojasvitoria.com.br
```

## Exemplo avançado

Normalizando a cidade informada pelo cliente para fazer uma comparação confiável e exibir uma oferta regionalizada em uma régua de relacionamento:

```ampscript
%%[
SET @cidadeOriginal = AttributeValue("Cidade")
SET @cidadeNormalizada = Lowercase(@cidadeOriginal)

IF @cidadeNormalizada == "são paulo" THEN
  SET @mensagem = "Frete grátis para São Paulo em compras acima de R$ 199,90!"
ELSEIF @cidadeNormalizada == "rio de janeiro" THEN
  SET @mensagem = "Entrega expressa para o Rio de Janeiro! Aproveite 10% OFF."
ELSE
  SET @mensagem = Concat("Olá! Enviamos para ", ProperCase(@cidadeNormalizada), " com as melhores condições.")
ENDIF
]%%

%%=v(@mensagem)=%%
```

**Saída (supondo que o campo Cidade contenha "SÃO PAULO"):**
```
Frete grátis para São Paulo em compras acima de R$ 199,90!
```

## Observações

> **💡 Dica:** Comparações de string em AMPscript podem ser sensíveis a maiúsculas/minúsculas dependendo do contexto. Usar `Lowercase` em ambos os lados da comparação é uma prática sólida para evitar que um "São Paulo" não bata com "SÃO PAULO" ou "são paulo". Isso é especialmente comum quando os dados vêm de formulários preenchidos livremente pelo cliente.

> **💡 Dica:** Para e-mails, é boa prática aplicar `Lowercase` antes de gravar o dado na Data Extension. Endereços de e-mail são case-insensitive por definição do protocolo, mas manter tudo em minúsculo evita duplicações e facilita lookups.

## Funções relacionadas

- [Uppercase](../string-functions/uppercase.md) - converte todos os caracteres para maiúsculas (operação inversa).
- [ProperCase](../string-functions/propercase.md) - capitaliza a primeira letra de cada palavra, ideal para nomes de pessoas.
- [Trim](../string-functions/trim.md) - remove espaços em branco do início e fim da string, ótimo para combinar com `Lowercase` na padronização de dados.
- [Replace](../string-functions/replace.md) - substitui partes de uma string, útil em conjunto com `Lowercase` para normalização avançada.
- [Concat](../string-functions/concat.md) - concatena strings, frequentemente usada junto com `Lowercase` para montar valores padronizados.