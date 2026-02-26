---
title: ReplaceList
sidebar_label: ReplaceList
description: Substitui uma ou mais substrings por outra string em uma única chamada de função.
---

# ReplaceList

## Descrição

A função `ReplaceList()` procura uma ou mais substrings dentro de uma string e substitui **todas elas** por uma única string de substituição. É como fazer vários "localizar e substituir" de uma vez só — muito útil quando você precisa limpar dados que vêm com separadores variados ou remover/padronizar múltiplos caracteres indesejados. A função retorna a string original com todas as substituições aplicadas.

## Sintaxe

```ampscript
ReplaceList(stringOrigem, stringSubstituta, stringBusca1 [, stringBusca2, ...])
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| stringOrigem | String | Sim | A string original onde a busca será realizada. |
| stringSubstituta | String | Sim | A string que vai substituir todas as ocorrências encontradas. |
| stringBusca1 | String | Sim | A primeira substring a ser buscada e substituída. |
| stringBusca2, ... | String | Não | Substrings adicionais a serem buscadas e substituídas. Você pode adicionar quantos parâmetros de busca precisar. |

## Exemplo básico

Imagine que você tem uma lista de categorias favoritas do cliente separadas por diferentes delimitadores (vírgula, ponto e vírgula e pipe) e quer padronizar a exibição:

```ampscript
%%[
SET @categorias = "Eletrônicos|Moda;Casa,Esportes|Livros"
SET @categoriasFormatadas = ReplaceList(@categorias, " • ", "|", ";", ",")
]%%

Suas categorias favoritas são: %%=v(@categoriasFormatadas)=%%
```

**Saída:**
```
Suas categorias favoritas são: Eletrônicos • Moda • Casa • Esportes • Livros
```

## Exemplo avançado

Cenário real: a MegaStore está enviando um e-mail de Dia das Mães com recomendações personalizadas. Os hobbies da mãe do cliente estão armazenados numa Data Extension com separadores inconsistentes, e você precisa formatar tudo bonitinho para o e-mail:

```ampscript
%%[
/* Busca os dados na Data Extension */
SET @nomeCliente = AttributeValue("PrimeiroNome")
SET @nomeMae = Lookup("MaesDosClientes", "NomeMae", "EmailCliente", emailaddr)
SET @hobbiesMae = Lookup("MaesDosClientes", "Hobbies", "EmailCliente", emailaddr)
SET @valorVoucher = "R$ 150,00"

/* Limpa os separadores e formata a lista */
SET @hobbiesFormatados = ReplaceList(@hobbiesMae, ", ", "|", ";", " | ", ",", " ; ")

/* Remove possíveis espaços extras nos dados */
SET @hobbiesFormatados = Trim(@hobbiesFormatados)
]%%

Olá, %%=v(@nomeCliente)=%%! 🌷

Sabemos que a %%=v(@nomeMae)=%% adora: %%=v(@hobbiesFormatados)=%%.

Por isso, separamos presentes especiais pra ela!
Use o voucher de %%=v(@valorVoucher)=%% com frete grátis acima de R$ 299,00.

Acesse: www.megastore.com.br/diadasmaes
```

**Saída (exemplo para o subscriber João Silva):**
```
Olá, João! 🌷

Sabemos que a Dona Maria adora: Jardinagem, Culinária, Yoga, Leitura.

Por isso, separamos presentes especiais pra ela!
Use o voucher de R$ 150,00 com frete grátis acima de R$ 299,00.

Acesse: www.megastore.com.br/diadasmaes
```

## Observações

- A `ReplaceList()` substitui **todas** as strings de busca pela **mesma** string de substituição. Se você precisa substituir cada string por um valor diferente, use múltiplas chamadas da função [Replace](../string-functions/replace.md).
- Você pode passar quantos parâmetros de busca quiser após os dois primeiros parâmetros obrigatórios (stringOrigem e stringSubstituta). Não há limite documentado.
- Se a string de substituição for vazia (`""`), as substrings encontradas serão simplesmente removidas da string original — ótimo para limpar caracteres indesejados.
- A busca **não** diferencia maiúsculas de minúsculas (case-insensitive) no comportamento padrão do AMPscript.
- Se nenhuma das strings de busca for encontrada na string de origem, a função retorna a string original sem alterações.
- Cuidado com a ordem dos parâmetros: o segundo parâmetro é a **substituição** e do terceiro em diante são as **buscas**. Inverter isso é um erro comum.

## Funções relacionadas

- [Replace](../string-functions/replace.md) — Substitui uma única substring por outra. Use quando cada busca precisa de uma substituição diferente.
- [Concat](../string-functions/concat.md) — Concatena múltiplas strings. Útil para montar o resultado final após substituições.
- [Trim](../string-functions/trim.md) — Remove espaços em branco do início e fim da string. Bom complemento após usar `ReplaceList()`.
- [BuildRowsetFromString](../content-functions/buildrowsetfromstring.md) — Transforma uma string delimitada em um rowset. Alternativa quando você precisa iterar sobre os itens ao invés de apenas reformatar.
- [IndexOf](../string-functions/indexof.md) — Encontra a posição de uma substring dentro de outra. Útil para verificar se um delimitador existe antes de substituir.
- [RegExMatch](../string-functions/regexmatch.md) — Busca padrões com expressões regulares. Para cenários mais complexos de busca e substituição.