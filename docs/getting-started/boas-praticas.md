---
title: Boas Práticas
sidebar_label: Boas Práticas
description: Convenções, organização e técnicas defensivas para escrever AMPscript limpo, legível e fácil de manter.
sidebar_position: 1
---

# Boas Práticas de AMPscript

Escrever AMPscript que funciona é uma coisa. Escrever AMPscript que outra pessoa consegue entender seis meses depois - inclusive você mesmo - é outra história.

Este guia reúne convenções de nomenclatura, organização de código e técnicas defensivas que fazem diferença no dia a dia. Nada aqui é regra absoluta da linguagem: AMPscript é flexível e tolerante. Mas flexibilidade sem disciplina vira bagunça rápido.

> **💡 Dois princípios que valem mais que qualquer regra:**
> 1. Seja consistente no seu projeto.
> 2. Priorize legibilidade.

---

## Nomenclatura

### Nomes descritivos

O código que você escreve hoje vai ser lido no futuro - por um colega, por um consultor externo, ou por você mesmo depois de dois meses sem ver aquele template. Use nomes que expliquem o propósito da variável, não só o valor.

```ampscript
/* ✅ Nome que diz o que é */
SET @dataDeVencimento = DateAdd(Now(), 30, 'D')
SET @isPrimeiraCompra = IIF(Empty(@totalPedidos), true, false)

/* ❌ Nome que não diz nada */
SET @data = DateAdd(Now(), 30, 'D')
SET @flag = IIF(Empty(@x), true, false)
```

Algumas convenções que ajudam:

- Variáveis booleanas começam com `is`, `has`, `pode` ou `tem` - `isAtivo`, `temSaldo`, `podeReceberEmail`
- Variáveis de data terminam com `Data` ou `Date` - `dataEnvio`, `dataVencimento`
- Variáveis que guardam resultados de Lookup começam com o nome da DE - `clienteNome`, `pedidoStatus`

### Convenção de caixa

AMPscript não liga para maiúsculas ou minúsculas - `lookup` e `LOOKUP` e `Lookup` funcionam igual. O problema é quando o mesmo projeto usa os três ao mesmo tempo. Escolha uma convenção e siga ela.

A convenção mais adotada pela comunidade - e a que recomendamos aqui - é:

| Elemento | Estilo | Exemplo |
|----------|--------|---------|
| Variáveis | `camelCase` | `@nomeCompleto`, `@totalPedidos` |
| Funções | `PascalCase` | `Lookup()`, `FormatDate()`, `Concat()` |
| Palavras-chave (`SET`, `IF`, `FOR`) | `MAIÚSCULAS` | `SET`, `IF THEN`, `FOR DO NEXT` |

```ampscript
%%[
/* ✅ Convenção consistente */
SET @nomeCliente = Lookup('Clientes_DE', 'NomeCompleto', 'Email', emailaddr)
SET @isPremium   = Lookup('Clientes_DE', 'PlanoAtivo', 'Email', emailaddr)

IF @isPremium == 'Premium' THEN
    SET @desconto = '15%'
ELSE
    SET @desconto = '5%'
ENDIF
]%%
```

### Aspas: simples ou duplas?

AMPscript aceita as duas. O importante é não misturar no mesmo projeto.

Preferimos **aspas simples** porque:
- É mais fácil de digitar (sem Shift)
- Evita conflito com atributos HTML que usam aspas duplas

```ampscript
/* ✅ Aspas simples consistentes */
SET @produto = Lookup('Catalogo_DE', 'NomeProduto', 'SKU', @sku)

/* ❌ Mistura de aspas */
SET @produto = Lookup("Catalogo_DE", 'NomeProduto', "SKU", @sku)
```

---

## Organização do código

### Código no topo

Coloque todo o bloco `%%[ ]%%` principal no início do template - antes de qualquer HTML. Isso facilita manutenção, torna o código fácil de localizar e evita problemas com a versão texto do e-mail.

```ampscript
%%[
/* Todo o AMPscript aqui, no topo */
SET @nomeCliente  = Lookup('Clientes_DE', 'Nome', 'Email', emailaddr)
SET @saldoPontos  = Lookup('Fidelidade_DE', 'Saldo', 'Email', emailaddr)
SET @isPremium    = IIF(@saldoPontos > 5000, true, false)
]%%

<!DOCTYPE html>
<html>
<!-- HTML do e-mail abaixo -->
```

### Variáveis no bloco, `v()` no corpo

Calcule tudo no bloco do topo e use `%%=v(@variavel)=%%` no corpo do HTML. Evite aninhar funções diretamente no HTML - fica ilegível e difícil de depurar.

```ampscript
/* ✅ Cálculo no bloco, exibição limpa no HTML */
%%[
SET @preco         = Lookup('Produtos_DE', 'Preco', 'SKU', @sku)
SET @precoFormatado = FormatNumber(@preco, '###.##0,00', 'pt-BR')
SET @nomeProduto   = Lookup('Produtos_DE', 'Nome', 'SKU', @sku)
]%%

<p>%%=v(@nomeProduto)=%% - R$ %%=v(@precoFormatado)=%%</p>
```

```ampscript
/* ❌ Funções aninhadas direto no HTML */
<p>%%=Lookup('Produtos_DE', 'Nome', 'SKU', @sku)=%% - R$ %%=FormatNumber(Lookup('Produtos_DE', 'Preco', 'SKU', @sku), '###.##0,00', 'pt-BR')=%%</p>
```

### Indentação

Sem chaves `{}` para delimitar blocos, a indentação é o único recurso visual para entender estrutura. Use 4 espaços (não tab) dentro de `IF` e `FOR`.

```ampscript
%%[
SET @rowset = LookupRows('Pedidos_DE', 'Email', emailaddr)
SET @total  = RowCount(@rowset)

IF @total > 0 THEN
    FOR @i = 1 TO @total DO
        SET @row    = Row(@rowset, @i)
        SET @pedido = Field(@row, 'NumeroPedido')
        SET @valor  = Field(@row, 'ValorTotal')
        SET @status = Field(@row, 'Status')

        IF @status == 'Entregue' THEN
            SET @resumo = Concat('Pedido ', @pedido, ' entregue - R$ ', @valor)
        ENDIF
    NEXT @i
ENDIF
]%%
```

> **⚠️ Atenção:** Os editores visuais do SFMC (WYSIWYG) podem desfazer sua indentação ao salvar. Use blocos **HTML** (não de conteúdo visual) para preservar a formatação.

---

## Comentários

> *O código diz como. O comentário diz por quê.* - Jeff Atwood

Comentários bem escritos são tão importantes quanto o código em si. Com o tempo, você vai agradecer.

### Cabeçalho do script

Para scripts longos, comece com um bloco descrevendo o propósito e a estrutura geral:

```ampscript
%%[
/* ─────────────────────────────────────────────────────────────────────────
   E-mail de carrinho abandonado - Lojas Vitória
   
   Lógica:
   1. Busca itens do carrinho na DE Carrinho_Abandonado
   2. Valida se o cliente ainda tem os itens disponíveis em estoque
   3. Calcula desconto progressivo baseado em dias desde o abandono
   4. Exibe cupom se desconto for aplicável
   ─────────────────────────────────────────────────────────────────────── */
]%%
```

### Comentários de seção

Divida scripts longos em seções marcadas:

```ampscript
%%[
/* ── 1. Dados do cliente ────────────────────────────────────────── */
SET @nomeCliente = Lookup('Clientes_DE', 'Nome', 'Email', emailaddr)
SET @cpf         = Lookup('Clientes_DE', 'CPF', 'Email', emailaddr)

/* ── 2. Itens do carrinho ───────────────────────────────────────── */
SET @itens = LookupRows('Carrinho_DE', 'Email', emailaddr)
SET @total = RowCount(@itens)

/* ── 3. Cálculo do desconto ─────────────────────────────────────── */
SET @diasAbandonado = DateDiff(Now(), @dataAbandono, 'D')
]%%
```

### Comentários inline

Use para explicar decisões não óbvias - por que aquele valor, por que aquela lógica:

```ampscript
/* Usa AttributeValue ao invés de Lookup para capturar campos de perfil
   do subscriber mesmo quando não há DE de envio configurada */
SET @email = AttributeValue('EmailAddress')

/* Limite de 3 itens por e-mail - decisão de negócio da equipe de CRM */
IF @total > 3 THEN
    SET @total = 3
ENDIF
```

---

## Codificação defensiva

### Sempre verifique se o dado existe

Nunca assuma que um campo vai ter valor. Se o campo não existir na DE ou estiver vazio, seu e-mail pode quebrar ou enviar em branco para milhares de pessoas.

Use `AttributeValue()` para capturar campos de perfil com segurança, e valide com `Empty()` ou `IsNull()` antes de usar o valor:

```ampscript
SET @nomeCliente = AttributeValue('Nome')

IF Empty(@nomeCliente) THEN
    SET @nomeCliente = 'Cliente'
ENDIF
```

Para Data Extensions, o `Lookup()` retorna vazio se não encontrar o registro - então sempre trate esse caso:

```ampscript
SET @segmento = Lookup('Segmentos_DE', 'Tier', 'Email', emailaddr)

IF Empty(@segmento) THEN
    SET @segmento = 'Padrão'
ENDIF
```

### Use RaiseError para dados críticos

Às vezes é melhor não enviar do que enviar errado. Se um dado é obrigatório para o e-mail fazer sentido - como um número de pedido, um CPF ou um valor de fatura - use `RaiseError()` para abortar o envio daquele subscriber quando o dado estiver faltando.

```ampscript
SET @numeroPedido = Lookup('Pedidos_DE', 'Numero', 'Email', emailaddr)

/* Se não tem número de pedido, não faz sentido enviar o e-mail de confirmação */
IF Empty(@numeroPedido) THEN
    RaiseError('Número de pedido não encontrado para: ' + emailaddr, true)
ENDIF
```

O segundo parâmetro `true` faz o sistema **pular** esse subscriber (não aborta o envio inteiro). Use `false` se quiser abortar o job por completo.

> **💡 Dica:** Durante o desenvolvimento, `RaiseError()` é seu melhor amigo para identificar dados inconsistentes antes de um envio real. Habilite ele em ambiente de teste e deixe ele te mostrar onde estão os buracos.

### Limite chamadas HTTP externas

Funções como `HTTPGet()` fazem requisições externas a cada e-mail renderizado. Em um disparo de 500 mil e-mails, isso significa 500 mil requests no seu servidor. Siga as diretrizes:

- Máximo de **3 chamadas** de conteúdo externo por e-mail
- Use `%%Before;HTTPGet "url"%%` para chamadas que devem ocorrer **uma vez** por job de envio, não por subscriber
- Evite `HTTPGet` dentro de loops - o número de requests cresce de forma proporcional ao tamanho do rowset

---

## Depuração

### Imprima variáveis no fluxo

Quando algo não está funcionando como esperado, a técnica mais rápida é imprimir os valores das variáveis diretamente no e-mail durante os testes:

```ampscript
%%[
SET @segmento = Lookup('Segmentos_DE', 'Tier', 'Email', emailaddr)
SET @pontos   = Lookup('Fidelidade_DE', 'Saldo', 'Email', emailaddr)
]%%

<!-- DEBUG - remover antes de produção -->
<pre>
segmento: %%=v(@segmento)=%%
pontos: %%=v(@pontos)=%%
</pre>
```

### Reduza até funcionar

Se o erro é difícil de identificar, remova todo o HTML e deixe só o AMPscript. Se ainda quebrar, reduza o código ao mínimo que funciona e vá adicionando de volta até reproduzir o erro. É repetitivo, mas funciona.

### Valide a sintaxe antes de testar

No Content Builder, erros de sintaxe aparecem em vermelho na aba **Pré-visualização e Teste** - antes de você sequer mandar um e-mail de teste. Sempre abra a pré-visualização primeiro para garantir que a sintaxe está certa antes de testar com dados reais.

---

## Modularização

### Reutilize com Content Blocks

Se um trecho de AMPscript ou HTML é usado em múltiplos e-mails - um rodapé de programa de fidelidade, um bloco de status de pedido, um banner dinâmico - isole em um Content Block e referencie pelo External Key:

```ampscript
%%=ContentBlockByKey('bloco-status-fidelidade')=%%
```

Assim, qualquer ajuste no bloco se reflete automaticamente em todos os e-mails que o usam.

### Content Blocks dinâmicos

Você pode calcular qual Content Block carregar com base em dados do subscriber - útil para variações por região, idioma ou segmento:

```ampscript
SET @regiao    = Lookup('Clientes_DE', 'Regiao', 'Email', emailaddr)
SET @chaveBloco = Concat('oferta-regional-', Lowercase(@regiao))

/* Resultado: 'oferta-regional-sudeste', 'oferta-regional-nordeste', etc. */
%%=ContentBlockByKey(v(@chaveBloco))=%%
```

Isso mantém o template limpo e elimina uma série de `IF/ELSEIF` para cada variação.
