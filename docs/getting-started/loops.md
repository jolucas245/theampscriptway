---
title: Loops
sidebar_label: Loops
description: Use blocos For em AMPscript para iterar sobre estruturas de dados ou executar código um número específico de vezes.
sidebar_position: 6
---

# Loops

Loops permitem repetir um bloco de código várias vezes - seja um número fixo de repetições ou uma vez para cada linha de uma estrutura de dados. Em SFMC, isso é essencial para cenários como listar os últimos pedidos de um cliente, exibir produtos de um carrinho abandonado ou gerar linhas de uma tabela dinâmica.

## Estrutura do For

O loop `For` é a única estrutura de repetição do AMPscript. No mínimo, um bloco `For` precisa de:

- `FOR` - inicia o loop
- Uma variável de controle com valor inicial
- `TO` ou `DOWNTO` - define a direção da contagem
- O valor final (número, variável ou função)
- `DO` - inicia o bloco de código
- O código a repetir
- `NEXT` - avança o contador e fecha o bloco

Quando você usa `TO`, o contador aumenta 1 a cada iteração. Quando usa `DOWNTO`, diminui 1.

> **💡 Dica:** As palavras-chave `FOR`, `TO`, `DOWNTO`, `DO` e `NEXT` não são case-sensitive - `for`, `For` e `FOR` funcionam exatamente igual. Escolha um padrão e mantenha consistência.

## Repetindo um número fixo de vezes

O uso mais simples de `FOR` é executar código um número pré-determinado de vezes. O exemplo abaixo exibe uma numeração de 1 a 5:

```ampscript
%%[
FOR @i = 1 TO 5 DO
    Output(Concat('Item ', @i, '<br>'))
NEXT @i
]%%
```

**Saída:**
```
Item 1
Item 2
Item 3
Item 4
Item 5
```

## Iterando sobre um rowset

O uso mais comum em SFMC é percorrer um rowset - uma estrutura de dados retornada por funções como `LookupRows()`, `BuildRowsetFromString()` ou `BuildRowsetFromJson()`. O padrão é sempre o mesmo: buscar o rowset, contar as linhas com `RowCount()` e iterar de 1 até esse total.

O exemplo abaixo exibe os últimos pedidos de um cliente da Lojas Vitória:

```ampscript
%%[
SET @pedidos = LookupRows('Pedidos_DE', 'Email', emailaddr)
SET @total   = RowCount(@pedidos)

IF @total > 0 THEN
    FOR @i = 1 TO @total DO
        SET @linha       = Row(@pedidos, @i)
        SET @numeroPedido = Field(@linha, 'NumeroPedido')
        SET @valor        = Field(@linha, 'ValorTotal')
        SET @status       = Field(@linha, 'Status')
]%%

<tr>
    <td>%%=v(@numeroPedido)=%%</td>
    <td>R$ %%=v(@valor)=%%</td>
    <td>%%=v(@status)=%%</td>
</tr>

%%[
    NEXT @i
ENDIF
]%%
```

Repare no padrão de fechar e reabrir blocos AMPscript (`]%%` e `%%[`) para intercalar com HTML. Isso é totalmente válido - o AMPscript interpreta os blocos em sequência, e o HTML no meio é renderizado normalmente.

## Contagem regressiva com DOWNTO

Use `DOWNTO` quando precisar iterar de um valor maior para um menor:

```ampscript
%%[
FOR @i = 5 DOWNTO 1 DO
    Output(Concat(@i, '... ', '<br>'))
NEXT @i
Output('Promoção ativada!')
]%%
```

**Saída:**
```
5...
4...
3...
2...
1...
Promoção ativada!
```

## Limitando o número de itens exibidos

Em e-mails, é comum limitar quantos itens você exibe - por exemplo, no máximo 3 produtos recomendados. Use `IIF()` ou um `IF` simples para definir o limite antes do loop:

```ampscript
%%[
SET @produtos = LookupRows('Recomendados_DE', 'Email', emailaddr)
SET @total    = RowCount(@produtos)

/* Exibe no máximo 3 produtos */
IF @total > 3 THEN
    SET @total = 3
ENDIF

FOR @i = 1 TO @total DO
    SET @linha  = Row(@produtos, @i)
    SET @nome   = Field(@linha, 'NomeProduto')
    SET @preco  = Field(@linha, 'Preco')
]%%

<div class="produto">
    <strong>%%=v(@nome)=%%</strong> - R$ %%=v(@preco)=%%
</div>

%%[
NEXT @i
]%%
```

> **⚠️ Atenção:** Evite usar `LookupRows()` ou `HTTPGet()` dentro de um loop - cada chamada é executada a cada iteração. Em um rowset com 50 linhas, isso significa 50 queries ou 50 requests externos. Busque os dados antes do loop e percorra o rowset já carregado.

---

Com loops dominados, você tem todas as ferramentas fundamentais para construir AMPscript dinâmico. Para boas práticas sobre como organizar código com loops complexos, veja [Boas Práticas](/docs/getting-started/boas-praticas).
