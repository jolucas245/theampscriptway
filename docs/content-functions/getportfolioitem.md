---
title: GetPortfolioItem
sidebar_label: GetPortfolioItem
description: Retorna o conteúdo de um arquivo armazenado no Portfolio do Marketing Cloud.
---

# GetPortfolioItem

## Descrição

A função `GetPortfolioItem` retorna o conteúdo de um arquivo que está no seu **Portfolio** (também chamado de "Enhanced File Manager" ou seção de arquivos do Content Builder). Você passa a **external key** (chave externa) do item e a função traz o conteúdo daquele arquivo direto para o seu e-mail, CloudPage ou qualquer outro contexto AMPscript. É super útil quando você quer centralizar trechos de texto, snippets HTML ou termos legais em um arquivo externo e reutilizar esse conteúdo em vários envios sem precisar copiar e colar.

## Sintaxe

```ampscript
GetPortfolioItem(itemExternalKey)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| itemExternalKey | String | Sim | A chave externa (external key) do item armazenado no Portfolio. Você encontra esse valor nas propriedades do arquivo dentro do Marketing Cloud. |

## Exemplo básico

Imagine que você tem um arquivo de texto chamado `termos-promocao.txt` no Portfolio, com a external key `"TermosBlackFriday2024"`. O conteúdo do arquivo é:

```
Promoção válida de 25/11/2024 a 01/12/2024. Desconto de até 40% em produtos selecionados.
Frete grátis para compras acima de R$299,00. Não cumulativo com outras promoções.
```

Para trazer esse conteúdo no e-mail, basta usar:

```ampscript
%%=GetPortfolioItem("TermosBlackFriday2024")=%%
```

**Saída:**
```
Promoção válida de 25/11/2024 a 01/12/2024. Desconto de até 40% em produtos selecionados.
Frete grátis para compras acima de R$299,00. Não cumulativo com outras promoções.
```

## Exemplo avançado

Aqui vai um cenário real: a **MegaStore** quer enviar e-mails de Dia das Mães com um rodapé legal padronizado que é compartilhado entre vários templates. O texto jurídico fica em um arquivo no Portfolio com a external key `"RodapeLegalMegaStore"`. Além disso, o e-mail personaliza o nome do cliente usando dados de uma Data Extension.

```ampscript
%%[
  VAR @primeiroNome, @rodapeLegal

  SET @primeiroNome = AttributeValue("PrimeiroNome")
  SET @primeiroNome = IIF(Empty(@primeiroNome), "Cliente", ProperCase(@primeiroNome))

  SET @rodapeLegal = GetPortfolioItem("RodapeLegalMegaStore")
]%%

<h1>Olá, %%=v(@primeiroNome)=%%! 💐</h1>

<p>Neste Dia das Mães, preparamos ofertas especiais pra você presentear
quem mais importa. Confira nossos kits a partir de <strong>R$89,90</strong>
com <strong>frete grátis</strong> para todo o Brasil!</p>

<p><a href="https://www.megastore.com.br/dia-das-maes">Ver ofertas</a></p>

<hr>

<div style="font-size: 10px; color: #999;">
  %%=v(@rodapeLegal)=%%
</div>
```

Supondo que o arquivo `RodapeLegalMegaStore` contenha:

```
MegaStore Comércio Digital Ltda. CNPJ: 12.345.678/0001-90.
Rua das Palmeiras, 500 - São Paulo/SP - CEP 01234-567.
Para dúvidas, entre em contato: sac@megastore.com.br ou (11) 3456-7890.
Você recebeu este e-mail porque se cadastrou em www.megastore.com.br.
```

**Saída para a assinante Maria Santos:**
```html
<h1>Olá, Maria! 💐</h1>

<p>Neste Dia das Mães, preparamos ofertas especiais pra você presentear
quem mais importa. Confira nossos kits a partir de <strong>R$89,90</strong>
com <strong>frete grátis</strong> para todo o Brasil!</p>

<p><a href="https://www.megastore.com.br/dia-das-maes">Ver ofertas</a></p>

<hr>

<div style="font-size: 10px; color: #999;">
  MegaStore Comércio Digital Ltda. CNPJ: 12.345.678/0001-90.
  Rua das Palmeiras, 500 - São Paulo/SP - CEP 01234-567.
  Para dúvidas, entre em contato: sac@megastore.com.br ou (11) 3456-7890.
  Você recebeu este e-mail porque se cadastrou em www.megastore.com.br.
</div>
```

## Observações

- **Portfolio é uma funcionalidade legada.** O Portfolio faz parte do Classic Email e pode não estar disponível ou visível em todas as contas do Marketing Cloud. Em contas mais novas, os arquivos ficam no Content Builder. Se você não encontra o Portfolio na sua conta, considere usar [ContentBlockByKey](../content-functions/contentblockbykey.md) como alternativa mais moderna.
- A função retorna o **conteúdo em texto** do arquivo. Ela funciona bem com arquivos `.txt` ou similares. Não é indicada para trazer imagens — para isso, use [Image](../content-functions/image.md) ou [ImageByKey](../content-functions/imagebykey.md).
- Se a **external key** informada não existir ou estiver incorreta, a função pode retornar vazio ou gerar erro no envio. Sempre valide a chave antes de usar em produção.
- Se o conteúdo do arquivo no Portfolio contiver AMPscript, ele **não será processado automaticamente**. Para que trechos AMPscript dentro do conteúdo retornado sejam interpretados, você precisa usar a função [TreatAsContent](../utility-functions/treatascontent.md) no resultado.
- A external key é **case-sensitive** em muitos contextos do SFMC. Tome cuidado para digitar exatamente como está configurada no Portfolio.
- Essa função é muito útil para centralizar conteúdo reutilizável como disclaimers legais, termos de promoção, rodapés e textos padrão que aparecem em múltiplos e-mails.

## Funções relacionadas

- [ContentBlockByKey](../content-functions/contentblockbykey.md) — alternativa moderna para buscar blocos de conteúdo pela chave externa no Content Builder
- [ContentBlockById](../content-functions/contentblockbyid.md) — busca blocos de conteúdo pelo ID numérico no Content Builder
- [ContentBlockByName](../content-functions/contentblockbyname.md) — busca blocos de conteúdo pelo nome/caminho no Content Builder
- [TreatAsContent](../utility-functions/treatascontent.md) — processa AMPscript contido em uma string retornada, útil para interpretar conteúdo dinâmico vindo do Portfolio
- [Image](../content-functions/image.md) — insere uma imagem do Portfolio usando o ALT text e external key
- [ImageByKey](../content-functions/imagebykey.md) — insere uma imagem do Portfolio pela chave externa
- [AttachFile](../content-functions/attachfile.md) — anexa um arquivo do Portfolio ao e-mail
- [V](../utility-functions/v.md) — exibe o valor de uma variável no conteúdo renderizado