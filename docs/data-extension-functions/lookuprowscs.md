---
title: LookupRowsCS
sidebar_label: LookupRowsCS
description: Retorna um conjunto de linhas (rowset) de uma Data Extension com busca case-sensitive (diferencia maiúsculas de minúsculas).
---

# LookupRowsCS

## Descrição

A função `LookupRowsCS` busca linhas em uma Data Extension e retorna um conjunto de resultados (rowset) **não ordenado**, com um limite de até **2.000 linhas**. A diferença principal dela para a `LookupRows` é que tanto o nome da coluna quanto o valor buscado são **case-sensitive** — ou seja, "Ouro" é diferente de "ouro" e de "OURO". Use essa função quando a distinção entre maiúsculas e minúsculas for importante na sua lógica, como códigos de cupom, categorias padronizadas ou identificadores que variam por caixa.

## Sintaxe

```ampscript
LookupRowsCS("NomeDaDataExtension", "colunaBusca1", "valorBusca1" [, "colunaBusca2", "valorBusca2", ...])
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| dataExt | String | Sim | Nome da Data Extension que contém os dados que você quer consultar. |
| searchColumn1 | String | Sim | Nome da coluna onde a busca será feita. **Case-sensitive.** |
| searchValue1 | String | Sim | Valor a ser buscado na coluna especificada. **Case-sensitive.** |
| searchColumn2, searchValue2, ... | String | Não | Pares adicionais de coluna/valor para refinar a busca. Também case-sensitive. |

## Exemplo básico

Imagine que você tem uma Data Extension chamada **"ProgramaFidelidade"** com os seguintes dados:

| ClienteId | Nome | Sobrenome | Pontos | Tier | Cidade |
|---|---|---|---|---|---|
| 1 | João | Silva | 92374 | Ouro | São Paulo |
| 2 | Maria | Santos | 201042 | Diamante | Campinas |
| 3 | Carlos | Oliveira | 69311 | Prata | São Paulo |
| 4 | Ana | Ferreira | 23999 | Bronze | Curitiba |
| 5 | Pedro | Costa | 15123 | Bronze | são paulo |

Repare que o Pedro tem "são paulo" (tudo minúsculo) na coluna Cidade. Com `LookupRowsCS`, ele **não** será retornado se buscarmos por "São Paulo":

```ampscript
%%[

VAR @membrosSP, @totalLinhas
SET @membrosSP = LookupRowsCS("ProgramaFidelidade", "Cidade", "São Paulo")
SET @totalLinhas = RowCount(@membrosSP)

IF @totalLinhas > 0 THEN
  FOR @i = 1 TO @totalLinhas DO

    VAR @linha, @clienteId, @nome, @sobrenome, @pontos
    SET @linha = Row(@membrosSP, @i)
    SET @clienteId = Field(@linha, "ClienteId")
    SET @nome = Field(@linha, "Nome")
    SET @sobrenome = Field(@linha, "Sobrenome")
    SET @pontos = Field(@linha, "Pontos")

]%%

%%=v(@nome)=%% %%=v(@sobrenome)=%% (ID %%=v(@clienteId)=%%) - Saldo de pontos: %%=v(@pontos)=%%

%%[
  NEXT @i
ENDIF

]%%
```

**Saída:**
```
João Silva (ID 1) - Saldo de pontos: 92374
Carlos Oliveira (ID 3) - Saldo de pontos: 69311
```

> Note que Pedro Costa **não** apareceu porque o valor "são paulo" não corresponde a "São Paulo" na busca case-sensitive.

## Exemplo avançado

Cenário real: a **MegaStore** está enviando um e-mail de campanha de **Dia das Mães** com ofertas personalizadas. Eles têm uma Data Extension chamada **"OfertasDiaDasMaes"** onde a coluna `Categoria` é preenchida com valores padronizados como "Perfumaria", "Eletrônicos", "Moda". A equipe precisa garantir que a busca respeite exatamente a grafia cadastrada, porque existe "PERFUMARIA" (para atacado) e "Perfumaria" (para varejo).

| OfertaId | Categoria | Produto | PrecoOriginal | PrecoPromocional | FreteGratis |
|---|---|---|---|---|---|
| 101 | Perfumaria | Kit Hidratante Floral | 189.90 | 139.90 | Sim |
| 102 | Perfumaria | Eau de Parfum Rosé | 259.90 | 199.90 | Sim |
| 103 | PERFUMARIA | Kit Atacado 12un Sabonete | 450.00 | 380.00 | Nao |
| 104 | Moda | Bolsa Couro Legítimo | 499.90 | 349.90 | Sim |

```ampscript
%%[

VAR @categoriaCliente, @ofertas, @qtdOfertas
SET @categoriaCliente = "Perfumaria"
SET @ofertas = LookupRowsCS("OfertasDiaDasMaes", "Categoria", @categoriaCliente)
SET @qtdOfertas = RowCount(@ofertas)

IF @qtdOfertas > 0 THEN

]%%

<h2>🌷 Ofertas de Dia das Mães — %%=v(@categoriaCliente)=%%</h2>
<p>Encontramos %%=v(@qtdOfertas)=%% oferta(s) especial(is) pra você!</p>

%%[

  FOR @i = 1 TO @qtdOfertas DO

    VAR @linha, @produto, @precoOriginal, @precoPromo, @frete, @economia
    SET @linha = Row(@ofertas, @i)
    SET @produto = Field(@linha, "Produto")
    SET @precoOriginal = Field(@linha, "PrecoOriginal")
    SET @precoPromo = Field(@linha, "PrecoPromocional")
    SET @frete = Field(@linha, "FreteGratis")
    SET @economia = Subtract(@precoOriginal, @precoPromo)

]%%

<div style="border:1px solid #e0e0e0; padding:15px; margin-bottom:10px;">
  <strong>%%=v(@produto)=%%</strong><br>
  De: R$ %%=FormatNumber(@precoOriginal, "N2")=%%<br>
  <strong style="color:#e91e63;">Por: R$ %%=FormatNumber(@precoPromo, "N2")=%%</strong><br>
  Você economiza: R$ %%=FormatNumber(@economia, "N2")=%%<br>
  %%[ IF @frete == "Sim" THEN ]%%
    <span style="color:green;">✅ Frete grátis!</span>
  %%[ ENDIF ]%%
</div>

%%[
  NEXT @i

ELSE

]%%

<p>Nenhuma oferta encontrada para a categoria selecionada.</p>

%%[

ENDIF

]%%
```

**Saída:**
```
🌷 Ofertas de Dia das Mães — Perfumaria
Encontramos 2 oferta(s) especial(is) pra você!

Kit Hidratante Floral
De: R$ 189,90
Por: R$ 139,90
Você economiza: R$ 50,00
✅ Frete grátis!

Eau de Parfum Rosé
De: R$ 259,90
Por: R$ 199,90
Você economiza: R$ 60,00
✅ Frete grátis!
```

> Perceba que o "Kit Atacado 12un Sabonete" com categoria "PERFUMARIA" (tudo maiúsculo) **não** foi incluído nos resultados, exatamente porque a busca é case-sensitive. Isso evita que produtos de atacado apareçam no e-mail do varejo.

## Observações

- **Case-sensitive**: Tanto o nome da coluna (`searchColumn`) quanto o valor buscado (`searchValue`) diferenciam maiúsculas e minúsculas. Se o dado na DE está como "Ouro" e você busca "ouro", **não vai retornar resultados**.
- **Limite de 2.000 linhas**: A função retorna no máximo 2.000 linhas. Se precisar de mais registros, considere filtrar melhor com colunas adicionais ou usar outra abordagem.
- **Resultados não ordenados**: O rowset retornado **não tem uma ordem garantida**. Se você precisa de ordenação, use [LookupOrderedRowsCS](../data-extension-functions/lookuporderedrowscs.md).
- **Múltiplos filtros**: Você pode adicionar quantos pares de coluna/valor precisar para refinar a busca. Todos os critérios funcionam como um **AND** lógico.
- **Rowset vazio**: Se nenhuma linha corresponder à busca, o rowset retornado terá `RowCount` igual a 0. Sempre valide com `RowCount` antes de iterar para evitar erros.
- **Dica prática**: Se a diferença entre maiúsculas e minúsculas **não importa** para o seu caso de uso, prefira usar [LookupRows](../data-extension-functions/lookuprows.md) — é mais tolerante e evita problemas com dados inconsistentes.
- **Funciona em múltiplos contextos**: Pode ser usada em e-mails, CloudPages, SMS e Landing Pages.

## Funções relacionadas

- [LookupRows](../data-extension-functions/lookuprows.md) — Versão case-insensitive desta função. Use quando não precisar diferenciar maiúsculas/minúsculas.
- [LookupOrderedRows](../data-extension-functions/lookuporderedrows.md) — Retorna linhas com possibilidade de ordenação por uma coluna (case-insensitive).
- [LookupOrderedRowsCS](../data-extension-functions/lookuporderedrowscs.md) — Versão case-sensitive com ordenação. Ideal quando você precisa de busca exata E resultados ordenados.
- [Lookup](../data-extension-functions/lookup.md) — Retorna o valor de uma única coluna de uma única linha (em vez de um rowset completo).
- [Row](../data-extension-functions/row.md) — Extrai uma linha específica de um rowset pelo índice.
- [RowCount](../data-extension-functions/rowcount.md) — Conta o número de linhas em um rowset.
- [Field](../data-extension-functions/field.md) — Extrai o valor de uma coluna específica de uma linha.