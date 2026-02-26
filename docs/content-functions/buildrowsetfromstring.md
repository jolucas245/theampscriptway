---
title: BuildRowsetFromString
sidebar_label: BuildRowsetFromString
description: Cria um rowset a partir de uma string de texto, dividindo-a com base em um delimitador especificado.
---

# BuildRowsetFromString

## Descrição

A função `BuildRowsetFromString` pega uma string de texto e transforma ela em um rowset (conjunto de linhas), quebrando a string em partes com base em um caractere delimitador que você definir. É super útil quando você tem dados separados por vírgula, pipe ou qualquer outro separador armazenados em um único campo e precisa iterar sobre cada valor individualmente. O rowset retornado possui uma única coluna sem nome — por isso, para acessar os valores, você referencia a coluna pelo número ordinal `1`.

## Sintaxe

```ampscript
BuildRowsetFromString(@stringDeDados, "delimitador")
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|--------|-------------|-----------|
| sourceData | String | Sim | A string que contém os dados a serem carregados no rowset. |
| delimiter | String | Sim | O caractere usado como delimitador para dividir a string (por exemplo, vírgula, pipe, ponto e vírgula). |

## Exemplo básico

Imagine que você tem uma lista de categorias favoritas de um cliente da **MegaStore** salva em um único campo, separada por vírgulas:

```ampscript
%%[
VAR @categorias, @delimitador, @rowset, @totalLinhas, @i, @categoria

SET @categorias = "Eletrônicos,Moda,Casa e Jardim"
SET @delimitador = ","
SET @rowset = BuildRowsetFromString(@categorias, @delimitador)
SET @totalLinhas = RowCount(@rowset)

FOR @i = 1 TO @totalLinhas DO
  SET @categoria = Field(Row(@rowset, @i), 1)
  OutputLine(Concat("Categoria: ", @categoria))
NEXT @i
]%%
```

**Saída:**
```
Categoria: Eletrônicos
Categoria: Moda
Categoria: Casa e Jardim
```

## Exemplo avançado

Cenário real: a **Lojas Vitória** está mandando um e-mail de Dia das Mães com sugestões personalizadas. Na Data Extension, existe um campo chamado `ProdutosSugeridos` que contém nomes e preços separados por pipe (`|`). Cada item usa ponto e vírgula (`;`) para separar nome do preço. Vamos processar tudo e montar uma listinha bonita no e-mail:

```ampscript
%%[
VAR @dados, @rowset, @totalItens, @i, @itemCompleto
VAR @rowsetItem, @nomeItem, @precoItem, @totalGeral

SET @dados = "Kit Skincare Floral;R$ 189,90|Bolsa Couro Elegance;R$ 349,00|Perfume Jasmim Deluxe;R$ 259,50"
SET @rowset = BuildRowsetFromString(@dados, "|")
SET @totalItens = RowCount(@rowset)
SET @totalGeral = 0
]%%

<h2>Olá, %%=v(@primeiroNome)=%%! Confira nossas sugestões para o Dia das Mães 💐</h2>

<table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse;">
  <tr>
    <th>#</th>
    <th>Produto</th>
    <th>Preço</th>
  </tr>

%%[
FOR @i = 1 TO @totalItens DO
  SET @itemCompleto = Field(Row(@rowset, @i), 1)

  /* Agora separamos nome e preço usando ponto e vírgula */
  SET @rowsetItem = BuildRowsetFromString(@itemCompleto, ";")
  SET @nomeItem = Field(Row(@rowsetItem, 1), 1)
  SET @precoItem = Field(Row(@rowsetItem, 2), 1)
]%%

  <tr>
    <td>%%=v(@i)=%%</td>
    <td>%%=v(@nomeItem)=%%</td>
    <td>%%=v(@precoItem)=%%</td>
  </tr>

%%[
NEXT @i
]%%

</table>

<p style="margin-top:16px;">
  🚚 <strong>Frete grátis</strong> em compras acima de R$ 299,00!<br>
  Acesse: <a href="https://www.lojasvitoria.com.br/diadasmaes">www.lojasvitoria.com.br/diadasmaes</a>
</p>
```

**Saída:**
```
Olá, Maria! Confira nossas sugestões para o Dia das Mães 💐

# | Produto                  | Preço
1 | Kit Skincare Floral      | R$ 189,90
2 | Bolsa Couro Elegance     | R$ 349,00
3 | Perfume Jasmim Deluxe    | R$ 259,50

🚚 Frete grátis em compras acima de R$ 299,00!
Acesse: www.lojasvitoria.com.br/diadasmaes
```

## Exemplo com atributos nomeados

Você também pode passar pares de nome e valor separados por delimitador. Isso é útil quando precisa processar atributos dinâmicos. Veja como a **Conecta Telecom** poderia exibir detalhes do plano de um cliente:

```ampscript
%%[
VAR @atributos, @rowset, @totalLinhas, @i
VAR @parRowset, @nome, @valor

SET @atributos = "Plano:Ultra Fibra 500MB|Vencimento:15/06/2025|Status:Ativo|Desconto:R$ 30,00"
SET @rowset = BuildRowsetFromString(@atributos, "|")
SET @totalLinhas = RowCount(@rowset)

FOR @i = 1 TO @totalLinhas DO
  SET @parRowset = BuildRowsetFromString(Field(Row(@rowset, @i), 1), ":")
  SET @nome = Field(Row(@parRowset, 1), 1)
  SET @valor = Field(Row(@parRowset, 2), 1)
]%%

<strong>%%=v(@nome)=%%:</strong> %%=v(@valor)=%%<br>

%%[
NEXT @i
]%%
```

**Saída:**
```
Plano: Ultra Fibra 500MB
Vencimento: 15/06/2025
Status: Ativo
Desconto: R$ 30,00
```

## Observações

- O rowset retornado possui **apenas uma coluna, e essa coluna não tem nome**. Para acessar o valor, você precisa usar o número ordinal `1` na função [Field](../data-extension-functions/field.md). Exemplo: `Field(Row(@rowset, @i), 1)`.
- O delimitador deve ser **exatamente um caractere**. Se a sua string usa separadores compostos (como `||` ou `;;`), você vai precisar usar [Replace](../string-functions/replace.md) antes para converter para um delimitador simples.
- Se a string de entrada estiver **vazia**, o rowset retornado terá zero linhas. Sempre valide com [RowCount](../data-extension-functions/rowcount.md) antes de iterar para evitar erros.
- Espaços em branco **não são removidos automaticamente**. Se sua string for `"A, B, C"`, os valores retornados serão `"A"`, `" B"` e `" C"` (com espaço). Use [Trim](../string-functions/trim.md) para limpar.
- Essa função é perfeita para cenários onde dados multi-valorados estão armazenados em um único campo de uma Data Extension — como lista de produtos comprados, categorias de interesse ou códigos de cupom.
- Funciona em todos os contextos do SFMC: e-mails, CloudPages, SMS landing pages e automações com Script Activities.
- Para dados em formato JSON ou XML, considere usar [BuildRowsetFromJson](../content-functions/buildrowsetfromjson.md) ou [BuildRowsetFromXml](../content-functions/buildrowsetfromxml.md) respectivamente.

## Funções relacionadas

- [Row](../data-extension-functions/row.md) — acessa uma linha específica do rowset pelo índice
- [Field](../data-extension-functions/field.md) — extrai o valor de uma coluna de uma linha do rowset
- [RowCount](../data-extension-functions/rowcount.md) — retorna o total de linhas em um rowset
- [BuildRowsetFromJson](../content-functions/buildrowsetfromjson.md) — cria um rowset a partir de uma string JSON
- [BuildRowsetFromXml](../content-functions/buildrowsetfromxml.md) — cria um rowset a partir de uma string XML
- [Concat](../string-functions/concat.md) — concatena strings, útil para montar a saída ao iterar o rowset
- [Trim](../string-functions/trim.md) — remove espaços em branco, útil para limpar valores extraídos
- [Replace](../string-functions/replace.md) — substitui caracteres na string, útil para normalizar delimitadores
- [Output](../utility-functions/output.md) — imprime conteúdo diretamente no resultado renderizado
- [OutputLine](../utility-functions/outputline.md) — imprime conteúdo com quebra de linha
- [LookupRows](../data-extension-functions/lookuprows.md) — alternativa quando os dados estão em uma Data Extension separada em vez de uma string