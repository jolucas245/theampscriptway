---
title: Ordem de Execução
sidebar_label: Ordem de Execução
description: Como o Marketing Cloud processa o AMPscript em e-mails - ordem de execução entre componentes e impacto no estado das variáveis.
sidebar_position: 9
---

# Ordem de Execução

Entender a ordem em que o Marketing Cloud Engagement processa o AMPscript é fundamental para evitar erros que só aparecem em produção - quando variáveis retornam `null` em lugares inesperados ou funções de escrita em Data Extensions geram conflitos de chave.

## Processamento em lote

O Marketing Cloud não executa o AMPscript linha por linha, de forma sequencial, no momento em que o e-mail é montado. Em vez disso, ele **processa todo o código em lote como etapa final** do envio.

Isso tem uma implicação prática importante: se você usa uma Data Extension para gerenciar dados de subscribers e o próprio envio grava dados nessa DE, o AMPscript pode tentar inserir um registro que já foi criado pelo processo de envio, gerando um erro de chave duplicada.

> **💡 Dica:** Sempre que precisar gravar dados em uma DE durante um envio, prefira `UpsertDE()` ao invés de `InsertDE()`. O `UpsertDE()` insere se não existir e atualiza se já existir, evitando conflitos de chave primária.

## Ordem de processamento dentro do e-mail

Quando um e-mail tem AMPscript em múltiplos componentes, a ordem de execução é:

1. **Texto do pré-cabeçalho**
2. **Corpo HTML**
3. **Corpo texto**
4. **Linha de assunto**

Essa ordem tem impacto direto no estado das variáveis. Uma variável definida no corpo HTML já tem valor quando o corpo texto é processado - e também quando a linha de assunto é processada.

O contrário não é verdade: uma variável definida apenas na linha de assunto vai aparecer como `null` no corpo HTML e no corpo texto, porque a linha de assunto é processada por último.

```
%%[ SET @primeiroNome = "João" ]%%
```

Se esse `SET` estiver no **corpo HTML**, a variável `@primeiroNome` terá o valor "João" tanto no corpo texto quanto na linha de assunto.

Se esse `SET` estiver apenas na **linha de assunto**, a variável será `null` no corpo HTML e no corpo texto.

## Regra prática

Sempre declare e atribua suas variáveis no **corpo HTML** (preferencialmente no topo). Nunca dependa de uma variável que foi definida na linha de assunto para usar no corpo do e-mail - ela não vai estar disponível.

```ampscript
/* ✅ Defina no corpo HTML - funciona em todos os componentes */
%%[
SET @nomeCliente = Lookup('Clientes_DE', 'Nome', 'Email', emailaddr)
SET @oferta      = Lookup('Ofertas_DE', 'Descricao', 'Segmento', @segmento)
]%%
```

> **⚠️ Atenção:** Em CloudPages, a lógica é diferente - o código executa de forma sequencial do início ao fim da página, de cima para baixo, sem essa ordem de componentes. A regra de processamento em lote e a ordem de componentes se aplica exclusivamente a e-mails.
