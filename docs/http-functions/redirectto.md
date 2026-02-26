---
title: RedirectTo
sidebar_label: RedirectTo
description: Cria um link redirecionável a partir de uma URL armazenada em um atributo, campo de Data Extension ou variável, permitindo rastreamento de cliques em emails.
---

<!-- generated-by-script -->

# RedirectTo

## Descrição

A função `RedirectTo` cria um link clicável usando uma URL que vem de um atributo, campo de Data Extension ou variável. Ela é usada principalmente dentro de emails HTML, no atributo `href` de uma tag `<a>`, para que o Marketing Cloud consiga redirecionar o assinante para a URL correta. É essencial quando você precisa montar links dinâmicos cujas URLs estão armazenadas em Data Extensions ou variáveis, em vez de estarem fixas no HTML do email.

## Sintaxe

```ampscript
RedirectTo(@targetUrl)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|--------|-------------|-----------|
| targetUrl | String | Sim | A URL de destino para onde o assinante será redirecionado ao clicar no link. |

## Exemplo básico

Imagine que você tem uma Data Extension chamada **Ofertas_Black_Friday** com os seguintes dados:

| ID_Cliente | Tipo_Oferta | Link |
|------------|-------------|------|
| 1001 | Eletrônicos | http://www.megastore.com.br/eletronicos/ |
| 1001 | Moda | http://www.megastore.com.br/moda/ |
| 1002 | Casa | http://www.megastore.com.br/casa/ |

Para o cliente 1001, você quer exibir os links das ofertas dinamicamente:

```ampscript
%%[
SET @idCliente = "1001"
SET @ofertas = LookupRows("Ofertas_Black_Friday", "ID_Cliente", @idCliente)
SET @totalOfertas = RowCount(@ofertas)

IF @totalOfertas > 0 THEN
  FOR @i = 1 TO @totalOfertas DO
    SET @linha = Row(@ofertas, @i)
    SET @tipoOferta = Field(@linha, "Tipo_Oferta")
    SET @link = Field(@linha, "Link")
]%%

<a href="%%=RedirectTo(@link)=%%" title="%%=v(@tipoOferta)=%%">
  Ofertas de %%=v(@tipoOferta)=%%
</a><br>

%%[
  NEXT @i
ENDIF
]%%
```

**Saída:**

```html
<a href="http://www.megastore.com.br/eletronicos/" title="Eletrônicos">
  Ofertas de Eletrônicos
</a><br>
<a href="http://www.megastore.com.br/moda/" title="Moda">
  Ofertas de Moda
</a><br>
```

## Exemplo avançado

Aqui um cenário mais completo: um programa de fidelidade do **Banco Meridional** onde cada cliente tem um link personalizado com seu CPF e saldo de pontos no final da URL. A Data Extension **Clientes_Fidelidade** contém:

| ID_Cliente | Nome | CPF | Pontos | URL_Base |
|------------|------|-----|--------|----------|
| 2001 | João Silva | 123.456.789-00 | 4500 | http://www.bancomeridional.com.br/fidelidade/ |
| 2002 | Maria Santos | 987.654.321-00 | 12300 | http://www.bancomeridional.com.br/fidelidade/ |

```ampscript
%%[
SET @idCliente = AttributeValue("ID_Cliente")
SET @linhas = LookupRows("Clientes_Fidelidade", "ID_Cliente", @idCliente)

IF RowCount(@linhas) > 0 THEN
  SET @linha = Row(@linhas, 1)
  SET @nome = Field(@linha, "Nome")
  SET @cpf = Field(@linha, "CPF")
  SET @pontos = Field(@linha, "Pontos")
  SET @urlBase = Field(@linha, "URL_Base")

  /* Monta a URL com parâmetros dinâmicos */
  SET @cpfEncoded = URLEncode(@cpf, 1, 1)
  SET @urlFinal = Concat(@urlBase, "?cpf=", @cpfEncoded, "&pontos=", @pontos)
]%%

<p>Olá, %%=v(@nome)=%%!</p>
<p>Você tem <strong>%%=v(@pontos)=%%</strong> pontos no programa Meridional Fidelidade.</p>
<p>
  <a href="%%=RedirectTo(@urlFinal)=%%" style="background-color:#0066cc;color:#ffffff;padding:12px 24px;text-decoration:none;border-radius:4px;">
    Resgatar meus pontos
  </a>
</p>

%%[ ELSE ]%%

<p>Não encontramos seus dados no programa de fidelidade.</p>

%%[ ENDIF ]%%
```

**Saída (para João Silva):**

```html
<p>Olá, João Silva!</p>
<p>Você tem <strong>4500</strong> pontos no programa Meridional Fidelidade.</p>
<p>
  <a href="http://www.bancomeridional.com.br/fidelidade/?cpf=123.456.789-00&pontos=4500" style="background-color:#0066cc;color:#ffffff;padding:12px 24px;text-decoration:none;border-radius:4px;">
    Resgatar meus pontos
  </a>
</p>
```

## Observações

- **Uso exclusivo em emails:** A função `RedirectTo` foi projetada para fornecer informações de rastreamento de cliques em links de mensagens de email. Ela não funciona da mesma forma em outros contextos (CloudPages, SMS, etc.).
- **Em emails HTML:** Use sempre dentro do atributo `href` de uma tag `<a>`. Exemplo: `<a href="%%=RedirectTo(@url)=%%">`.
- **Em emails de texto puro:** Inclua o prefixo `http://` na URL e garanta que **não haja espaços** dentro dos parênteses da função.
- **Rastreamento de cliques:** Para que o rastreamento funcione corretamente, as tags `<a>...</a>` devem estar presentes no corpo do email em si — e não dentro do conteúdo retornado pela URL que você está buscando.
- **Limitação de rastreamento:** A função **não rastreia** cliques quando a URL está armazenada em uma variável ou é usada como parte de um parâmetro de query string. O rastreamento só funciona para links clicáveis diretamente no corpo do email.
- **URLs dinâmicas:** Quando montar URLs com parâmetros dinâmicos (como CPF, ID de produto, etc.), use [URLEncode](../string-functions/urlencode.md) para garantir que caracteres especiais sejam codificados corretamente.
- **Cuidado com espaços:** Espaços acidentais dentro dos parênteses de `RedirectTo()` podem quebrar o link, especialmente em emails de texto puro.

## Funções relacionadas

- [Concat](../string-functions/concat.md) — Concatena strings para montar URLs dinâmicas com parâmetros
- [URLEncode](../string-functions/urlencode.md) — Codifica valores para uso seguro em URLs (essencial para parâmetros como CPF)
- [V](../utility-functions/v.md) — Exibe o valor de uma variável inline no HTML
- [Lookup](../data-extension-functions/lookup.md) — Busca um único valor em uma Data Extension
- [LookupRows](../data-extension-functions/lookuprows.md) — Busca múltiplas linhas de uma Data Extension
- [Row](../data-extension-functions/row.md) — Retorna uma linha específica de um conjunto de resultados
- [Field](../data-extension-functions/field.md) — Extrai o valor de um campo específico de uma linha
- [RowCount](../data-extension-functions/rowcount.md) — Conta o número de linhas retornadas por uma busca
- [AttributeValue](../utility-functions/attributevalue.md) — Recupera o valor de um atributo de assinante ou campo de envio
- [CloudPagesURL](../sites-functions/cloudpagesurl.md) — Gera URLs rastreáveis para CloudPages com parâmetros criptografados
- [WrapLongURL](../http-functions/wraplongurl.md) — Evita quebra de URLs longas em clientes de email
- [TreatAsContent](../utility-functions/treatascontent.md) — Processa uma string como conteúdo AMPscript/HTML
- [Redirect](../sites-functions/redirect.md) — Redireciona o navegador para uma URL (usado em CloudPages, não em emails)