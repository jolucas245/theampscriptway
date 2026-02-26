---
title: DataExtensionRowCount
sidebar_label: DataExtensionRowCount
description: Retorna o número total de linhas (registros) de uma Data Extension específica.
---

# DataExtensionRowCount

## Descrição

A função `DataExtensionRowCount` retorna o número total de linhas (registros) presentes em uma Data Extension. É super útil quando você precisa saber quantos registros existem em uma DE sem precisar fazer um lookup completo — por exemplo, para exibir contadores em emails ou CloudPages, validar se uma DE tem dados antes de processá-la, ou criar lógicas condicionais baseadas na quantidade de registros.

A função retorna um valor numérico inteiro representando a contagem de linhas.

## Sintaxe

```ampscript
DataExtensionRowCount("dataExtensionName")
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| dataExtensionName | String | Sim | O nome da Data Extension da qual você quer contar o número de linhas. |

## Exemplo básico

Imagine que você tem uma Data Extension chamada **"ProgramaFidelidade"** com os seguintes dados:

| MembroId | Nome | Sobrenome | Pontos | Nivel | Cidade |
|---|---|---|---|---|---|
| 1 | João | Silva | 92374 | 2 | São Paulo |
| 2 | Maria | Santos | 201042 | 1 | Rio de Janeiro |
| 3 | Carlos | Oliveira | 69311 | 3 | Belo Horizonte |
| 4 | Ana | Ferreira | 23999 | 4 | Curitiba |
| 5 | Pedro | Costa | 15123 | 4 | Salvador |

```ampscript
%%[

SET @totalMembros = DataExtensionRowCount("ProgramaFidelidade")

]%%

Nosso programa de fidelidade já conta com %%=v(@totalMembros)=%% membros!
```

**Saída:**
```
Nosso programa de fidelidade já conta com 5 membros!
```

## Exemplo avançado

Vamos a um cenário real: a **Lojas Vitória** está enviando um email de Black Friday e quer mostrar quantas ofertas estão disponíveis. Dependendo da quantidade, a mensagem muda. Além disso, se houver mais de 100 ofertas, exibe um destaque especial.

```ampscript
%%[

SET @totalOfertas = DataExtensionRowCount("OfertasBlackFriday")
SET @totalCupons = DataExtensionRowCount("CuponsAtivos")

IF @totalOfertas > 100 THEN
  SET @mensagemOfertas = Concat("🔥 MEGA BLACK FRIDAY! São ", FormatNumber(@totalOfertas, "N0"), " ofertas imperdíveis esperando por você!")
  SET @destaque = "Frete grátis acima de R$299 em TODAS as ofertas!"
ELSEIF @totalOfertas > 0 THEN
  SET @mensagemOfertas = Concat("Confira nossas ", FormatNumber(@totalOfertas, "N0"), " ofertas selecionadas de Black Friday!")
  SET @destaque = "Aproveite enquanto durarem os estoques!"
ELSE
  SET @mensagemOfertas = "Em breve teremos novidades incríveis para você!"
  SET @destaque = "Fique de olho no seu email 👀"
ENDIF

IF @totalCupons > 0 THEN
  SET @mensagemCupons = Concat("Você ainda tem ", FormatNumber(@totalCupons, "N0"), " cupons de cashback em Reais para usar!")
ELSE
  SET @mensagemCupons = ""
ENDIF

]%%

Olá, %%=v(@firstName)=%%!

%%=v(@mensagemOfertas)=%%

%%=v(@destaque)=%%

%%[ IF NOT Empty(@mensagemCupons) THEN ]%%
  %%=v(@mensagemCupons)=%%
%%[ ENDIF ]%%

Acesse: www.lojasvitoria.com.br/blackfriday
```

**Saída (supondo 153 ofertas e 3 cupons ativos):**
```
Olá, João!

🔥 MEGA BLACK FRIDAY! São 153 ofertas imperdíveis esperando por você!

Frete grátis acima de R$299 em TODAS as ofertas!

Você ainda tem 3 cupons de cashback em Reais para usar!

Acesse: www.lojasvitoria.com.br/blackfriday
```

## Observações

- A função retorna a contagem **total** de linhas da Data Extension inteira. Não é possível passar filtros ou condições — ela sempre conta todos os registros.
- O parâmetro deve ser o **nome** da Data Extension, não a External Key. Preste atenção se o nome tem espaços ou caracteres especiais — passe exatamente como está cadastrado no SFMC.
- Se a Data Extension não existir ou o nome estiver errado, a função pode gerar um erro no momento do envio. Considere testar com o Preview antes de enviar.
- O resultado é um valor numérico inteiro. Você pode usá-lo diretamente em comparações com `IF` ou em operações matemáticas.
- Para contar linhas de um **resultado de lookup** (ou seja, um rowset retornado por `LookupRows`), use a função [RowCount](../data-extension-functions/rowcount.md) em vez de `DataExtensionRowCount`.
- Em Data Extensions muito grandes (milhões de registros), a função ainda retorna o total de linhas, mas esteja ciente de que ela conta todos os registros sem distinção.
- Funciona tanto em emails quanto em CloudPages e Landing Pages.

## Funções relacionadas

- [RowCount](../data-extension-functions/rowcount.md) — Conta o número de linhas em um rowset retornado por funções como `LookupRows`, diferente de `DataExtensionRowCount` que conta toda a DE.
- [LookupRows](../data-extension-functions/lookuprows.md) — Retorna um conjunto de linhas de uma DE com base em critérios de filtro.
- [Lookup](../data-extension-functions/lookup.md) — Retorna o valor de uma coluna específica de uma DE com base em um critério de busca.
- [LookupOrderedRows](../data-extension-functions/lookuporderedrows.md) — Retorna linhas de uma DE filtradas e ordenadas.
- [Empty](../utility-functions/empty.md) — Verifica se um valor está vazio, útil para validar resultados antes de exibi-los.
- [FormatNumber](../string-functions/formatnumber.md) — Formata números para exibição, útil para mostrar contagens com separadores de milhares.
- [Concat](../string-functions/concat.md) — Concatena strings, muito usada junto com `DataExtensionRowCount` para montar mensagens dinâmicas.