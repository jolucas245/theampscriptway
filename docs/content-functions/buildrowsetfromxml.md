---
title: BuildRowsetFromXml
sidebar_label: BuildRowsetFromXml
description: Carrega dados XML em um rowset para que você possa iterar e extrair valores usando expressões XPath.
---

<!-- generated-by-script -->

# BuildRowsetFromXml

## Descrição

A função `BuildRowsetFromXml` transforma dados XML em um rowset (conjunto de linhas) que você pode percorrer e manipular no AMPscript. Ela é super útil quando você recebe dados em formato XML — seja de uma API via [HTTPGet](../http-functions/httpget.md), de um campo de Data Extension, ou de uma variável — e precisa extrair informações específicas para personalizar seus emails ou CloudPages. A função usa expressões XPath para localizar os nós desejados dentro do XML. Ela é executada no momento do envio para mensagens de saída e no momento do carregamento para CloudPages.

## Sintaxe

```ampscript
BuildRowsetFromXml(xmlData, xpathExpression, boolReturnEmptyOnError)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| xmlData | String | Sim | Os dados XML que você quer processar. Pode ser uma variável contendo o XML ou uma string literal. |
| xpathExpression | String | Sim | A expressão XPath que define quais nós do XML serão extraídos para o rowset. |
| boolReturnEmptyOnError | Boolean | Sim | Se `false`, retorna um rowset vazio quando há erro de sintaxe na função ou na expressão XPath. Se `true`, retorna uma exceção (erro) quando ocorre um problema. |

## Exemplo básico

Imagine que a **MegaStore** precisa exibir os produtos de uma promoção de Black Friday que estão em formato XML:

```ampscript
%%[

SET @xml = '<Produtos>
  <Produto categoria="Eletrônicos">
    <Nome>Smart TV 50"</Nome>
    <Preco>2499.90</Preco>
  </Produto>
  <Produto categoria="Informática">
    <Nome>Notebook Ultra</Nome>
    <Preco>3899.00</Preco>
  </Produto>
  <Produto categoria="Eletrônicos">
    <Nome>Fone Bluetooth</Nome>
    <Preco>189.90</Preco>
  </Produto>
</Produtos>'

SET @produtos = BuildRowsetFromXml(@xml, '//Produto', false)
SET @totalProdutos = RowCount(@produtos)

FOR @i = 1 TO @totalProdutos DO
  SET @linha = Row(@produtos, @i)
  SET @nome = Field(@linha, 'Nome')
  SET @preco = Field(@linha, 'Preco')
  SET @categoria = Field(@linha, 'categoria')
]%%

Produto: %%=v(@nome)=%% | Categoria: %%=v(@categoria)=%% | R$ %%=v(@preco)=%%<br>

%%[NEXT @i]%%
```

**Saída:**
```
Produto: Smart TV 50" | Categoria: Eletrônicos | R$ 2499.90
Produto: Notebook Ultra | Categoria: Informática | R$ 3899.00
Produto: Fone Bluetooth | Categoria: Eletrônicos | R$ 189.90
```

## Exemplo avançado

Agora um cenário mais completo: a **Conecta Telecom** envia um email mensal com o extrato de consumo do cliente. Os dados vêm de uma API em XML e o email precisa listar cada item, calcular o total e formatar tudo bonitinho:

```ampscript
%%[

SET @xmlExtrato = '<Extrato cliente="Maria Santos" cpf="123.456.789-00">
  <Item tipo="Plano">
    <Descricao>Plano Conecta 100GB</Descricao>
    <Valor>99.90</Valor>
  </Item>
  <Item tipo="Adicional">
    <Descricao>Pacote Streaming</Descricao>
    <Valor>29.90</Valor>
  </Item>
  <Item tipo="Adicional">
    <Descricao>Seguro Digital</Descricao>
    <Valor>14.90</Valor>
  </Item>
  <Item tipo="Desconto">
    <Descricao>Desconto Fidelidade</Descricao>
    <Valor>-15.00</Valor>
  </Item>
</Extrato>'

/* Extrair dados do cliente do nó raiz */
SET @dadosCliente = BuildRowsetFromXml(@xmlExtrato, '//Extrato', false)
SET @linhaCliente = Row(@dadosCliente, 1)
SET @nomeCliente = Field(@linhaCliente, 'cliente')
SET @cpfCliente = Field(@linhaCliente, 'cpf')

/* Extrair itens do extrato */
SET @itens = BuildRowsetFromXml(@xmlExtrato, '//Item', false)
SET @totalItens = RowCount(@itens)
SET @valorTotal = 0

]%%

Olá, %%=v(@nomeCliente)=%%!<br>
CPF: %%=v(@cpfCliente)=%%<br><br>

Confira seu extrato deste mês:<br><br>

<table border="1" cellpadding="5">
<tr><th>Tipo</th><th>Descrição</th><th>Valor</th></tr>

%%[

FOR @i = 1 TO @totalItens DO
  SET @linha = Row(@itens, @i)
  SET @descricao = Field(@linha, 'Descricao')
  SET @valor = Field(@linha, 'Valor')
  SET @tipo = Field(@linha, 'tipo')
  SET @valorTotal = Add(@valorTotal, @valor)

]%%

<tr>
  <td>%%=v(@tipo)=%%</td>
  <td>%%=v(@descricao)=%%</td>
  <td>R$ %%=FormatNumber(@valor, 'N2')=%%</td>
</tr>

%%[NEXT @i]%%

<tr>
  <td colspan="2"><strong>Total</strong></td>
  <td><strong>R$ %%=FormatNumber(@valorTotal, 'N2')=%%</strong></td>
</tr>
</table>

%%[

IF @valorTotal > 100 THEN
]%%
<br>💡 Dica: Ative o débito automático e ganhe R$ 5,00 de desconto todo mês!
%%[ENDIF]%%
```

**Saída:**
```
Olá, Maria Santos!
CPF: 123.456.789-00

Confira seu extrato deste mês:

| Tipo      | Descrição             | Valor       |
|-----------|-----------------------|-------------|
| Plano     | Plano Conecta 100GB   | R$ 99,90    |
| Adicional | Pacote Streaming      | R$ 29,90    |
| Adicional | Seguro Digital        | R$ 14,90    |
| Desconto  | Desconto Fidelidade   | R$ -15,00   |
| **Total** |                       | **R$ 129,70** |

💡 Dica: Ative o débito automático e ganhe R$ 5,00 de desconto todo mês!
```

## Observações

- **Atributos viram colunas:** O rowset gerado cria automaticamente uma coluna para cada atributo encontrado nos nós XML. Você acessa esses atributos pelo nome usando a função [Field](../data-extension-functions/field.md). No exemplo acima, `categoria` e `tipo` são atributos acessados dessa forma.
- **Atributos ausentes:** Se um nó não possui um atributo que outros nós possuem, o rowset inclui um valor vazio para aquele atributo naquela linha.
- **Nós que não retornam valor:** Os seguintes tipos de nós XML **não** retornam valor: CDATA, Comment, Document, Document Fragments, DocumentType, Entities, Entity References, Notation, ProcessingInformation, Whitespace e XmlDeclaration.
- **Tratamento de erros:** Use `false` no terceiro parâmetro se quiser que o email seja enviado mesmo com XML inválido (retorna rowset vazio). Use `true` se preferir que um erro seja disparado — útil durante testes para identificar problemas no XML ou no XPath.
- **Contexto de execução:** A função é processada no momento do envio para emails e no momento do carregamento para CloudPages.
- **XPath:** Se você não conhece XPath, pense nele como um "caminho" para navegar na árvore XML. `//Produto` significa "encontre todos os nós chamados Produto em qualquer nível". Para referência completa, consulte a [recomendação XPath do W3C](https://www.w3.org/TR/xpath/).
- **Valores dos nós filhos:** Os valores de texto dos elementos filhos (como `<Nome>` e `<Preco>`) são acessados como colunas do rowset, usando o nome da tag como nome da coluna na função [Field](../data-extension-functions/field.md).
- **Combine com [HTTPGet](../http-functions/httpget.md):** No mundo real, é muito comum buscar o XML de uma API externa e depois processá-lo com `BuildRowsetFromXml`. Fica uma combinação poderosa.

## Funções relacionadas

- [BuildRowsetFromString](../content-functions/buildrowsetfromstring.md) — Cria um rowset a partir de uma string delimitada (mais simples que XML)
- [BuildRowsetFromJson](../content-functions/buildrowsetfromjson.md) — Mesma ideia, mas para dados em formato JSON
- [Row](../data-extension-functions/row.md) — Extrai uma linha específica de um rowset
- [RowCount](../data-extension-functions/rowcount.md) — Retorna o número de linhas em um rowset
- [Field](../data-extension-functions/field.md) — Extrai o valor de uma coluna específica de uma linha do rowset
- [HTTPGet](../http-functions/httpget.md) — Busca conteúdo de uma URL (ótimo para obter XML de APIs)
- [TreatAsContent](../utility-functions/treatascontent.md) — Processa uma string como conteúdo AMPscript (útil para conteúdo dinâmico vindo do XML)