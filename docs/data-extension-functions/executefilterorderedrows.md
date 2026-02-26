---
title: ExecuteFilterOrderedRows
sidebar_label: ExecuteFilterOrderedRows
description: Executa um filtro de dados e retorna um rowset ordenado com os resultados filtrados de uma Data Extension.
---

<!-- generated-by-script -->

# ExecuteFilterOrderedRows

## Descrição

A função `ExecuteFilterOrderedRows` executa um filtro de dados (Data Filter) previamente criado no Marketing Cloud e retorna um rowset (conjunto de linhas) **ordenado** com os resultados. Ela funciona apenas com filtros baseados em Data Extensions — não funciona com filtros baseados em atributos de perfil. Pense nela como uma versão da [ExecuteFilter](../data-extension-functions/executefilter.md), mas com a vantagem de você poder definir a coluna e a direção da ordenação dos resultados. É super útil quando você precisa exibir dados filtrados em uma ordem específica, como um ranking de pontos ou uma lista de compras recentes.

## Sintaxe

```ampscript
ExecuteFilterOrderedRows(dataFilterExternalId, numRows, sortColumn)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| dataFilterExternalId | string | Sim | O External ID (chave externa) do filtro de dados a ser executado. Esse filtro precisa estar baseado em uma Data Extension. Você encontra esse ID nas propriedades do filtro no Marketing Cloud. |
| numRows | número | Sim | Quantidade de linhas a retornar no rowset. Use `0` para retornar todos os resultados. Não existe limite máximo de linhas. |
| sortColumn | string | Sim | Nome da coluna para ordenação, seguido de um espaço e `ASC` (ordem crescente) ou `DESC` (ordem decrescente). Exemplo: `"Pontos DESC"`. |

## Retorno

Retorna um **rowset** (conjunto de linhas) com os registros que atendem ao filtro, ordenados conforme especificado. Você pode iterar sobre os resultados usando [Row](../data-extension-functions/row.md), [RowCount](../data-extension-functions/rowcount.md) e [Field](../data-extension-functions/field.md).

## Exemplo básico

Imagine que você tem uma Data Extension chamada **"ProgramaFidelidade"** com os dados abaixo:

| ClienteId | Nome | Sobrenome | Pontos | Nivel | Cidade |
|---|---|---|---|---|---|
| 1 | João | Silva | 92374 | Ouro | São Paulo |
| 2 | Maria | Santos | 201042 | Diamante | Rio de Janeiro |
| 3 | Carlos | Oliveira | 69311 | Prata | Belo Horizonte |
| 4 | Ana | Pereira | 23999 | Bronze | Curitiba |
| 5 | Lucas | Costa | 15123 | Bronze | São Paulo |

Você também tem um filtro de dados chamado **"ProgramaFidelidade_50k_ou_mais"** com external key `a3b8c1d2-55f0-4a12-9e77-1234abcd5678`. Esse filtro retorna todos os registros onde `Pontos` é maior ou igual a 50.000.

```ampscript
%%[

VAR @rows, @rowCount, @filterExtId

SET @filterExtId = "a3b8c1d2-55f0-4a12-9e77-1234abcd5678"
SET @rows = ExecuteFilterOrderedRows(@filterExtId, 0, "Pontos DESC")
SET @rowCount = RowCount(@rows)

IF @rowCount > 0 THEN
  FOR @counter = 1 TO @rowCount DO

    VAR @row, @clienteId, @nome, @sobrenome, @pontos, @cidade
    SET @row = Row(@rows, @counter)
    SET @clienteId = Field(@row, "ClienteId")
    SET @nome = Field(@row, "Nome")
    SET @sobrenome = Field(@row, "Sobrenome")
    SET @pontos = Field(@row, "Pontos")
    SET @cidade = Field(@row, "Cidade")

]%%

<tr>
  <td>%%=v(@counter)=%%</td>
  <td>%%=v(@clienteId)=%%</td>
  <td>%%=v(@nome)=%%</td>
  <td>%%=v(@sobrenome)=%%</td>
  <td>%%=FormatNumber(@pontos, "N0")=%%</td>
  <td>%%=v(@cidade)=%%</td>
</tr>

%%[
  NEXT @counter
ENDIF
]%%
```

**Saída:**

| Ranking | ClienteId | Nome | Sobrenome | Pontos | Cidade |
|---|---|---|---|---|---|
| 1 | 2 | Maria | Santos | 201.042 | Rio de Janeiro |
| 2 | 1 | João | Silva | 92.374 | São Paulo |
| 3 | 3 | Carlos | Oliveira | 69.311 | Belo Horizonte |

## Exemplo avançado

Cenário real: você está montando uma CloudPage para o programa de fidelidade da **Lojas Vitória**. A página exibe o **Top 3** de clientes com mais pontos (acima de 50k) e mostra uma mensagem personalizada com o nível de recompensa que cada um pode resgatar.

```ampscript
%%[

VAR @rows, @rowCount, @filterExtId

SET @filterExtId = "a3b8c1d2-55f0-4a12-9e77-1234abcd5678"

/* Retorna apenas os 3 primeiros, ordenados por pontos decrescente */
SET @rows = ExecuteFilterOrderedRows(@filterExtId, 3, "Pontos DESC")
SET @rowCount = RowCount(@rows)

IF @rowCount > 0 THEN

]%%

<h2>🏆 Ranking Programa Fidelidade - Lojas Vitória</h2>
<p>Confira os clientes com mais pontos acumulados!</p>
<table border="1" cellpadding="8" cellspacing="0">
  <tr>
    <th>Posição</th>
    <th>Cliente</th>
    <th>Pontos</th>
    <th>Cidade</th>
    <th>Recompensa Disponível</th>
  </tr>

%%[

  FOR @counter = 1 TO @rowCount DO

    VAR @row, @nome, @sobrenome, @pontos, @cidade, @recompensa
    SET @row = Row(@rows, @counter)
    SET @nome = Field(@row, "Nome")
    SET @sobrenome = Field(@row, "Sobrenome")
    SET @pontos = Field(@row, "Pontos")
    SET @cidade = Field(@row, "Cidade")

    /* Define a recompensa com base nos pontos */
    IF @pontos >= 200000 THEN
      SET @recompensa = "Vale-compras de R$ 500,00 + frete grátis por 1 ano"
    ELSEIF @pontos >= 80000 THEN
      SET @recompensa = "Vale-compras de R$ 200,00 + cashback de 10%"
    ELSEIF @pontos >= 50000 THEN
      SET @recompensa = "Cupom de R$ 100,00 na próxima compra"
    ENDIF

]%%

  <tr>
    <td style="text-align:center; font-size:18px; font-weight:bold;">%%=v(@counter)=%%º</td>
    <td>%%=ProperCase(Concat(@nome, " ", @sobrenome))=%%</td>
    <td style="text-align:right;">%%=FormatNumber(@pontos, "N0")=%% pts</td>
    <td>%%=v(@cidade)=%%</td>
    <td>%%=v(@recompensa)=%%</td>
  </tr>

%%[

  NEXT @counter

]%%

</table>

<p style="font-size:12px; color:#666;">
  Atualizado em %%=FormatDate(Now(), "dd/MM/yyyy", "HH:mm")=%% | 
  Acesse <a href="https://www.lojasvitoria.com.br/fidelidade">www.lojasvitoria.com.br/fidelidade</a> para conferir seus pontos.
</p>

%%[

ELSE

]%%

<p>Nenhum cliente atingiu a pontuação mínima de 50.000 pontos ainda. Continue acumulando!</p>

%%[

ENDIF

]%%
```

**Saída:**

| Posição | Cliente | Pontos | Cidade | Recompensa Disponível |
|---|---|---|---|---|
| 1º | Maria Santos | 201.042 pts | Rio de Janeiro | Vale-compras de R$ 500,00 + frete grátis por 1 ano |
| 2º | João Silva | 92.374 pts | São Paulo | Vale-compras de R$ 200,00 + cashback de 10% |
| 3º | Carlos Oliveira | 69.311 pts | Belo Horizonte | Cupom de R$ 100,00 na próxima compra |

## Observações

- **Restrição de contexto:** essa função funciona **apenas** em CloudPages, landing pages, microsites e mensagens SMS criadas no MobileConnect. **Não funciona em emails.** Se precisar de dados ordenados em emails, use a [LookupOrderedRows](../data-extension-functions/lookuporderedrows.md).
- **Apenas Data Extensions:** o filtro de dados precisa estar baseado em uma Data Extension. Filtros baseados em atributos de perfil (Profile Attributes) **não são suportados**.
- **External ID do filtro:** você encontra o External ID nas propriedades do Data Filter dentro do Marketing Cloud. É aquele valor no formato UUID (ex: `c5a7e0d9-41e0-4068-bdcc-8766d7c1af94`). Não confunda com o nome do filtro.
- **Retornando todas as linhas:** passe `0` no parâmetro `numRows` para retornar todos os resultados do filtro. Não existe limite máximo documentado.
- **Formato da ordenação:** o parâmetro `sortColumn` deve conter o nome exato da coluna seguido de um espaço e `ASC` ou `DESC`. Exemplo: `"Pontos DESC"` ou `"Nome ASC"`.
- **Rowset vazio:** sempre verifique com [RowCount](../data-extension-functions/rowcount.md) se o resultado tem linhas antes de iterar. Se o filtro não retornar nenhum registro, o `RowCount` será `0`.
- **Filtro precisa existir previamente:** diferente das funções `Lookup`, onde você passa os critérios direto no código, aqui o filtro já precisa estar criado na interface do Marketing Cloud. Qualquer mudança nos critérios precisa ser feita lá.
- **Performance:** como o filtro é executado em tempo real, tenha cuidado com filtros que retornam volumes muito grandes de dados em páginas com alto tráfego.

## Funções relacionadas

- [ExecuteFilter](../data-extension-functions/executefilter.md) — executa um filtro de dados e retorna o rowset sem ordenação
- [LookupOrderedRows](../data-extension-functions/lookuporderedrows.md) — busca linhas ordenadas diretamente em uma Data Extension usando critérios inline (funciona em emails também)
- [LookupRows](../data-extension-functions/lookuprows.md) — busca linhas em uma Data Extension com base em critérios, sem ordenação
- [Row](../data-extension-functions/row.md) — extrai uma linha específica de um rowset pelo índice
- [RowCount](../data-extension-functions/rowcount.md) — retorna a quantidade de linhas em um rowset
- [Field](../data-extension-functions/field.md) — extrai o valor de uma coluna específica de uma linha do rowset
- [FormatNumber](../string-functions/formatnumber.md) — formata números com separadores de milhar e casas decimais
- [FormatDate](../date-functions/formatdate.md) — formata datas em diferentes padrões
- [ProperCase](../string-functions/propercase.md) — converte texto para formato de nome próprio (primeira letra maiúscula)
- [Concat](../string-functions/concat.md) — concatena strings