---
title: RatingStars
sidebar_label: RatingStars
description: Gera uma representação visual de avaliação em estrelas usando caracteres ou imagens, ideal para exibir ratings de produtos em emails e CloudPages.
---

<!-- generated-by-script -->

# RatingStars

## Descrição

A função `RatingStars` gera uma representação visual de avaliação em estrelas com base em um valor numérico. É muito útil para exibir ratings de produtos, avaliações de serviços ou qualquer tipo de classificação por estrelas diretamente no corpo de emails ou em CloudPages. A função retorna uma string com caracteres ou representações visuais que indicam a nota atribuída.

> **Nota importante:** A documentação oficial da Salesforce para esta função não está disponível (retorna erro 404). As informações abaixo são baseadas no conhecimento amplamente documentado pela comunidade SFMC. Use com cautela e teste sempre antes de colocar em produção.

## Sintaxe

```ampscript
RatingStars(rating)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| rating | Número | Sim | Valor numérico que representa a avaliação. Geralmente um valor entre 0 e 5. |

## Exemplo básico

```ampscript
%%[
VAR @nota
SET @nota = 4
]%%

Avaliação do produto: %%=RatingStars(@nota)=%%
```

**Saída:**
```
Avaliação do produto: ★★★★☆
```

## Exemplo avançado

Imagine que a **MegaStore** quer enviar um email de pós-compra mostrando a avaliação média dos produtos adquiridos pelo cliente, puxando os dados de uma Data Extension chamada "ProdutosComprados":

```ampscript
%%[
VAR @rows, @row, @nomeProduto, @avaliacao, @preco, @i, @rowCount

SET @rows = LookupRows("ProdutosComprados", "EmailCliente", AttributeValue("emailaddr"))
SET @rowCount = RowCount(@rows)

IF @rowCount > 0 THEN
]%%

<h2>Olá, %%=ProperCase(AttributeValue("FirstName"))=%%! Veja as avaliações dos seus últimos produtos:</h2>

<table style="width:100%; border-collapse:collapse;">
  <tr>
    <th style="text-align:left; padding:8px;">Produto</th>
    <th style="text-align:center; padding:8px;">Avaliação</th>
    <th style="text-align:right; padding:8px;">Preço</th>
  </tr>

%%[
  FOR @i = 1 TO @rowCount DO
    SET @row = Row(@rows, @i)
    SET @nomeProduto = Field(@row, "NomeProduto")
    SET @avaliacao = Field(@row, "NotaMedia")
    SET @preco = Field(@row, "Preco")
]%%

  <tr>
    <td style="text-align:left; padding:8px;">%%=v(@nomeProduto)=%%</td>
    <td style="text-align:center; padding:8px;">%%=RatingStars(@avaliacao)=%%</td>
    <td style="text-align:right; padding:8px;">%%=FormatCurrency(@preco, "R", 2)=%%</td>
  </tr>

%%[
  NEXT @i
]%%

</table>

<p>Gostou dos produtos? Avalie no nosso site e ganhe <strong>50 pontos</strong> no programa de fidelidade!</p>
<a href="https://www.megastore.com.br/minhas-avaliacoes">Avaliar agora</a>

%%[
ELSE
]%%
<p>Ainda não encontramos compras recentes. Que tal conferir nossas ofertas?</p>
%%[
ENDIF
]%%
```

**Saída (exemplo para Maria Santos):**
```
Olá, Maria! Veja as avaliações dos seus últimos produtos:

Produto                    | Avaliação  | Preço
Fone Bluetooth X200        | ★★★★☆     | R$ 189,90
Carregador Turbo 65W       | ★★★★★     | R$ 79,90
Capa Protetora Ultra       | ★★★☆☆     | R$ 34,90

Gostou dos produtos? Avalie no nosso site e ganhe 50 pontos no programa de fidelidade!
```

## Observações

- **Documentação oficial indisponível:** A página oficial da Salesforce para `RatingStars` retorna erro 404. Isso pode indicar que a função foi descontinuada, é pouco documentada ou tem suporte limitado. Teste rigorosamente no seu ambiente antes de usar em produção.
- A renderização das estrelas pode variar dependendo do cliente de email. Nem todos os clientes de email suportam todos os caracteres Unicode da mesma forma.
- Se você precisa de controle total sobre a aparência visual das estrelas (cor, tamanho, estilo), considere construir sua própria lógica com imagens e condicionais `IF/ELSE` em vez de depender dessa função.
- Valores fracionários (como 3.5) podem ou não gerar uma meia-estrela — teste no seu contexto específico para verificar o comportamento.
- Se o valor passado for `NULL` ou estiver fora da faixa esperada, o comportamento pode ser imprevisível. Use [IsNull](../utility-functions/isnull.md) ou [IsNullDefault](../utility-functions/isnulldefault.md) para tratar valores ausentes antes de chamar a função.
- Para e-commerce, essa função é excelente em emails transacionais de confirmação de compra, recomendação de produtos e campanhas de reengajamento.

## Funções relacionadas

- [Lookup](../data-extension-functions/lookup.md) — busca um valor em uma Data Extension, útil para puxar a nota de avaliação de um produto
- [LookupRows](../data-extension-functions/lookuprows.md) — retorna múltiplas linhas de uma DE, ideal para listar vários produtos com suas avaliações
- [Field](../data-extension-functions/field.md) — extrai o valor de um campo de uma linha retornada por LookupRows
- [FormatNumber](../string-functions/formatnumber.md) — formata números para exibir a nota média ao lado das estrelas
- [FormatCurrency](../string-functions/formatcurrency.md) — formata valores monetários, útil ao exibir preço junto com avaliação
- [IsNullDefault](../utility-functions/isnulldefault.md) — define um valor padrão caso a avaliação seja nula
- [IIF](../utility-functions/iif.md) — permite lógica condicional inline para tratar avaliações de forma dinâmica
- [Image](../content-functions/image.md) — alternativa para exibir estrelas como imagens personalizadas