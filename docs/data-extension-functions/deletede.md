---
title: DeleteDE
sidebar_label: DeleteDE
description: Deleta linhas de uma Data Extension com base em critérios de coluna e valor, disponível para uso em emails.
---

<!-- generated-by-script -->

# DeleteDE

## Descrição

A função `DeleteDE` deleta uma ou mais linhas de uma Data Extension com base em critérios de busca que você define (coluna + valor). Ela **não retorna nenhum valor** — simplesmente remove os registros que correspondem aos critérios informados. Essa função é específica para uso em **emails**. Se você precisa deletar dados em CloudPages, landing pages, microsites ou mensagens SMS no MobileConnect, use a função [DeleteData](../data-extension-functions/deletedata.md).

## Sintaxe

```ampscript
DeleteDE("NomeDaDataExtension", "coluna1", "valor1" [, "coluna2", "valor2", ...])
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| dataExt | String | Sim | Nome da Data Extension que contém os dados que você quer deletar. |
| columnName1 | String | Sim | Nome da coluna usada como critério de busca para encontrar a(s) linha(s) a deletar. |
| valueToDelete1 | String | Sim | Valor que a função usa para determinar qual(is) linha(s) deletar na coluna especificada. |
| columnNameN | String | Não | Colunas adicionais para refinar o critério de deleção. Sempre em pares com o valor correspondente. |
| valueToDeleteN | String | Não | Valores adicionais correspondentes às colunas extras. |

## Exemplo básico

Imagine que você tem uma Data Extension chamada **"Carrinho_Abandonado"** com os seguintes dados:

| EmailCliente | Produto | Valor |
|---|---|---|
| joao.silva@email.com | Tênis Esportivo | 349.90 |
| maria.santos@email.com | Bolsa Couro | 189.90 |
| carlos.oliveira@email.com | Relógio Digital | 279.90 |

Quando o João Silva finalizar a compra, você pode remover o registro dele do carrinho abandonado:

```ampscript
%%[
DeleteDE("Carrinho_Abandonado", "EmailCliente", "joao.silva@email.com")
]%%
```

**Saída:**

A função não gera nenhuma saída visível. Após a execução, a Data Extension fica assim:

| EmailCliente | Produto | Valor |
|---|---|---|
| maria.santos@email.com | Bolsa Couro | 189.90 |
| carlos.oliveira@email.com | Relógio Digital | 279.90 |

## Exemplo avançado

Vamos a um cenário mais completo: a **MegaStore** tem uma Data Extension chamada **"Ofertas_Black_Friday"** com promoções segmentadas por região e categoria. Quando uma promoção expirar, ela precisa ser removida.

| Regiao | Categoria | Produto | PrecoOriginal | PrecoPromo |
|---|---|---|---|---|
| Sudeste | Eletrônicos | Smart TV 55" | 3499.00 | 2199.00 |
| Sudeste | Moda | Jaqueta Inverno | 399.00 | 199.00 |
| Nordeste | Eletrônicos | Notebook Gamer | 5999.00 | 4299.00 |
| Nordeste | Casa | Jogo de Panelas | 289.00 | 149.00 |
| Sul | Eletrônicos | Fone Bluetooth | 249.00 | 129.00 |
| Sul | Moda | Tênis Running | 599.00 | 349.00 |

Para remover todas as ofertas de **Eletrônicos** da região **Nordeste** (por exemplo, quando o estoque acabou):

```ampscript
%%[
DeleteDE("Ofertas_Black_Friday", "Regiao", "Nordeste", "Categoria", "Eletrônicos")
]%%
```

**Saída:**

Nenhuma saída visível. A Data Extension fica assim:

| Regiao | Categoria | Produto | PrecoOriginal | PrecoPromo |
|---|---|---|---|---|
| Sudeste | Eletrônicos | Smart TV 55" | 3499.00 | 2199.00 |
| Sudeste | Moda | Jaqueta Inverno | 399.00 | 199.00 |
| Nordeste | Casa | Jogo de Panelas | 289.00 | 149.00 |
| Sul | Eletrônicos | Fone Bluetooth | 249.00 | 129.00 |
| Sul | Moda | Tênis Running | 599.00 | 349.00 |

Agora, um exemplo combinando com outras funções — removendo um assinante de uma lista de espera após ele receber o e-mail de confirmação de compra:

```ampscript
%%[
VAR @emailAssinante, @cpf
SET @emailAssinante = AttributeValue("EmailAddress")
SET @cpf = Lookup("Clientes", "CPF", "Email", @emailAssinante)

IF NOT Empty(@cpf) THEN
  DeleteDE("Lista_Espera_Natal", "CPF", @cpf)
ENDIF
]%%
```

Nesse caso, buscamos o CPF do cliente na Data Extension **"Clientes"** e usamos ele para remover o registro da **"Lista_Espera_Natal"**. O `Empty` garante que só tentamos deletar se o CPF foi encontrado.

## Observações

- **Contexto de uso:** A função `DeleteDE` funciona **apenas em emails**. Para CloudPages, landing pages, microsites e mensagens SMS (MobileConnect), use [DeleteData](../data-extension-functions/deletedata.md).
- **Sem retorno:** A função não retorna nenhum valor. Não tente atribuir o resultado a uma variável.
- **Múltiplos critérios:** Você pode adicionar quantos pares de coluna/valor quiser ao final da função para refinar a deleção. Todos os critérios funcionam com lógica **AND** — ou seja, a linha precisa atender a **todos** os critérios para ser deletada.
- **Múltiplas linhas:** Se mais de uma linha corresponder aos critérios informados, **todas** serão deletadas. Tenha cuidado para não remover mais dados do que o esperado.
- **Cuidado com deleções acidentais:** Sempre valide seus critérios antes de rodar em produção. Uma vez deletados, os dados não podem ser recuperados facilmente.
- **Nome da Data Extension:** Use o nome exato da Data Extension, incluindo espaços e caracteres especiais, se houver. O nome não é case-sensitive, mas é boa prática manter o padrão.
- **Performance:** Evite usar essa função em emails com envios massivos (centenas de milhares), pois operações de escrita em Data Extensions durante o envio podem impactar a performance.

## Funções relacionadas

- [DeleteData](../data-extension-functions/deletedata.md) — Mesma funcionalidade do `DeleteDE`, mas para uso em CloudPages, landing pages, microsites e SMS.
- [InsertDE](../data-extension-functions/insertde.md) — Insere uma nova linha em uma Data Extension (uso em emails).
- [UpdateDE](../data-extension-functions/updatede.md) — Atualiza linhas existentes em uma Data Extension (uso em emails).
- [UpsertDE](../data-extension-functions/upsertde.md) — Insere ou atualiza uma linha em uma Data Extension (uso em emails).
- [Lookup](../data-extension-functions/lookup.md) — Busca um valor em uma Data Extension com base em critérios de coluna.
- [LookupRows](../data-extension-functions/lookuprows.md) — Retorna múltiplas linhas de uma Data Extension com base em critérios.
- [DataExtensionRowCount](../data-extension-functions/dataextensionrowcount.md) — Retorna a quantidade de linhas em uma Data Extension.
- [Empty](../utility-functions/empty.md) — Verifica se um valor está vazio, útil para validar antes de deletar.
- [AttributeValue](../utility-functions/attributevalue.md) — Recupera o valor de um atributo do assinante ou coluna da sendable DE.