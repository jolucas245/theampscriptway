---
title: AttributeValue
sidebar_label: AttributeValue
description: Retorna o valor de um atributo do contato ou subscriber, devolvendo null quando o dado não existe em vez de gerar erro.
---

# AttributeValue

## Descrição

A função `AttributeValue` retorna o valor de um atributo associado ao contato ou subscriber que está recebendo a mensagem. Ela consulta diversas fontes de dados automaticamente: perfil do subscriber, campos de data extensions, atributos da entry source de journeys e atributos de MobilePush. A grande vantagem sobre a referência direta ao atributo (como `%%NomeDoAtributo%%`) é que ela retorna null quando o dado não é encontrado, em vez de gerar erro - o que torna seu código muito mais seguro e previsível.

## Sintaxe

```ampscript
AttributeValue("attribute")
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| attribute | String | Sim | Nome do atributo cujo valor você quer retornar. |

## Exemplo básico

Recuperando os pontos de fidelidade de um cliente a partir da data extension de envio para exibir no e-mail:

```ampscript
%%[
  SET @pontosFidelidade = AttributeValue("PontosFidelidade")
]%%

Você tem %%=v(@pontosFidelidade)=%% pontos acumulados no programa Lojas Vitória.
```

**Saída:**
```
Você tem 4850 pontos acumulados no programa Lojas Vitória.
```

## Exemplo avançado

Montando uma saudação personalizada em um e-mail de régua de relacionamento, tratando cenários onde o nome do cliente pode não estar preenchido na base:

```ampscript
%%[
  SET @primeiroNome = AttributeValue("PrimeiroNome")
  SET @categoria = AttributeValue("CategoriaTier")
  SET @pontosRecompensa = AttributeValue("PontosRecompensa")

  IF IsNull(@primeiroNome) THEN
    SET @saudacao = "Olá, cliente"
  ELSE
    SET @saudacao = Concat("Olá, ", ProperCase(@primeiroNome))
  ENDIF

  IF IsNull(@pontosRecompensa) THEN
    SET @pontosRecompensa = 0
  ENDIF
]%%

%%=v(@saudacao)=%%!

Sua categoria atual: %%=v(@categoria)=%%
Pontos disponíveis: %%=FormatNumber(@pontosRecompensa, "N0")=%%

%%[ IF @pontosRecompensa >= 5000 THEN ]%%
  🎉 Parabéns! Você já pode trocar seus pontos por descontos na MegaStore.
%%[ ENDIF ]%%
```

**Saída:**
```
Olá, Maria!

Sua categoria atual: Ouro
Pontos disponíveis: 7.230

🎉 Parabéns! Você já pode trocar seus pontos por descontos na MegaStore.
```

## Observações

> **💡 Dica:** Sempre prefira `AttributeValue` em vez de referenciar um atributo diretamente com `%%NomeDoAtributo%%` ou `Set @var = NomeDoAtributo`. A referência direta pode gerar erro se o campo não existir na fonte de dados do envio. Com `AttributeValue`, você recebe null de forma segura e pode tratar o cenário com [IsNull](../utility-functions/isnull.md) ou [Empty](../utility-functions/empty.md).

> **⚠️ Atenção:** O valor retornado é null quando o atributo não é encontrado nas fontes de dados relacionadas ao contato - isso inclui perfil de subscriber, campos da data extension de envio, atributos da entry source do journey e atributos de MobilePush. Null é diferente de string vazia, então valide adequadamente no seu código.

> **💡 Dica:** Em journeys com entry source vinda do Salesforce CRM ou de uma data extension, `AttributeValue` é a forma mais confiável de acessar os campos que foram injetados na entrada. Isso é muito comum em réguas de boas-vindas, aniversário e reativação no mercado brasileiro.

## Funções relacionadas

- [V](../utility-functions/v.md) - exibe o valor de uma variável no conteúdo renderizado
- [IsNull](../utility-functions/isnull.md) - verifica se um valor é null
- [IsNullDefault](../utility-functions/isnulldefault.md) - retorna um valor padrão quando o dado é null
- [Empty](../utility-functions/empty.md) - verifica se um valor é vazio ou null
- [Lookup](../data-extension-functions/lookup.md) - busca um valor em data extension por chave (quando você precisa ir além da DE de envio)
- [ProperCase](../string-functions/propercase.md) - formata texto com primeira letra maiúscula