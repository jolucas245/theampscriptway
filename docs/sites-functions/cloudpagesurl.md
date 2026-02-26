---
title: CloudPagesURL
sidebar_label: CloudPagesURL
description: Retorna uma URL de CloudPages com query string criptografada em AES-GCM, usada para criar links seguros de emails para landing pages.
---

# CloudPagesURL

## Descrição

A função `CloudPagesURL` gera uma URL apontando para uma landing page do CloudPages, com todos os parâmetros de query string criptografados usando AES-GCM. Isso significa que você pode passar dados de clientes (como CPF, ID de pedido, etc.) de forma segura, sem expor informações sensíveis em texto puro na URL. A query string gerada também inclui uma referência ao e-mail de origem, permitindo que você use personalization strings na landing page para acessar valores associados ao envio. Basicamente, é a forma recomendada de criar links de e-mails para CloudPages no Marketing Cloud.

## Sintaxe

```ampscript
CloudPagesURL(pageId, parameterName1, parameterValue1 [, parameterName2, parameterValue2, ...])
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| pageId | Número | Sim | O ID da landing page do CloudPages para a qual você quer direcionar o link. Você encontra esse ID na página de detalhes do conteúdo da landing page. |
| parameterName1 | String | Sim | O nome do parâmetro que você quer incluir na query string criptografada. |
| parameterValue1 | String | Sim | O valor do parâmetro correspondente ao nome informado. |
| parameterNameN | String | Não | Nomes adicionais de parâmetros. Você pode passar quantos pares nome-valor precisar. |
| parameterValueN | String | Não | Valores adicionais correspondentes aos nomes extras informados. |

## Exemplo básico

Imagine que a **MegaStore** quer enviar um e-mail de confirmação de compra com um link para uma página de detalhes do pedido no CloudPages. Você precisa passar o ID do pedido e o e-mail do cliente de forma segura:

```ampscript
%%[
VAR @linkConfirmacao, @pedidoId, @emailCliente

SET @pedidoId = "PED-2024-78543"
SET @emailCliente = "joao.silva@email.com.br"

SET @linkConfirmacao = CloudPagesURL(845, 'pedidoId', @pedidoId, 'emailCliente', @emailCliente)
]%%

<a href="%%=RedirectTo(@linkConfirmacao)=%%">Ver detalhes do seu pedido</a>
```

**Saída:**
```html
<a href="https://pub.s10.exacttarget.com/xxxxxxxxxxxx?encrypted_query_string">Ver detalhes do seu pedido</a>
```

A URL gerada conterá os parâmetros `pedidoId` e `emailCliente` criptografados na query string — nada aparece em texto puro.

## Exemplo avançado

Agora um cenário mais completo: a **Lojas Vitória** está rodando uma campanha de Dia das Mães e quer enviar um e-mail com um link para uma landing page personalizada. O link precisa passar dados do cliente e, ao mesmo tempo, funcionar com os parâmetros do Google Analytics (UTM) sem quebrar a URL.

**No e-mail (remetente):**

```ampscript
%%[
VAR @nomeCliente, @cpf, @valorCupom, @linkPromo, @urlFinal

SET @nomeCliente = AttributeValue("PrimeiroNome")
SET @cpf = AttributeValue("CPF")
SET @valorCupom = "50"

SET @linkPromo = CloudPagesURL(
  1234,
  'nome', @nomeCliente,
  'cpf', @cpf,
  'valorCupom', @valorCupom,
  'campanha', 'dia-das-maes-2024'
)

/* Combinando com Concat e RedirectTo para adicionar parâmetros UTM do Google Analytics */
SET @urlFinal = Concat(
  @linkPromo,
  '&utm_source=sfmc',
  '&utm_medium=email',
  '&utm_campaign=dia_das_maes_2024',
  '&utm_content=botao_principal'
)
]%%

<p>Olá, %%=v(@nomeCliente)=%%, preparamos algo especial pra você! 💐</p>

<a href="%%=RedirectTo(@urlFinal)=%%" style="background-color:#E91E63;color:#fff;padding:12px 24px;text-decoration:none;border-radius:4px;">
  Resgatar meu cupom de R$ %%=v(@valorCupom)=%%
</a>
```

**Na landing page do CloudPages (destino):**

```ampscript
%%[
VAR @nome, @cpf, @valorCupom, @campanha

SET @nome = RequestParameter("nome")
SET @cpf = RequestParameter("cpf")
SET @valorCupom = RequestParameter("valorCupom")
SET @campanha = RequestParameter("campanha")
]%%

<h1>Parabéns, %%=v(@nome)=%%! 🎉</h1>
<p>Seu cupom de <strong>R$ %%=v(@valorCupom)=%%</strong> para o Dia das Mães está ativo!</p>

%%[
/* Registra o resgate na Data Extension */
InsertDE(
  "ResgatesCupom",
  "CPF", @cpf,
  "Nome", @nome,
  "ValorCupom", @valorCupom,
  "Campanha", @campanha,
  "DataResgate", Now()
)
]%%

<p>Cupom aplicado automaticamente. Aproveite em <strong>www.lojasvitoria.com.br</strong>!</p>
```

**Saída no e-mail:**
```html
<a href="https://pub.s10.exacttarget.com/xxxxxxxxxxxx?encrypted_params&utm_source=sfmc&utm_medium=email&utm_campaign=dia_das_maes_2024&utm_content=botao_principal">
  Resgatar meu cupom de R$ 50
</a>
```

**Saída na landing page:**
```html
<h1>Parabéns, João! 🎉</h1>
<p>Seu cupom de <strong>R$ 50</strong> para o Dia das Mães está ativo!</p>
<p>Cupom aplicado automaticamente. Aproveite em www.lojasvitoria.com.br!</p>
```

## Observações

- **Use principalmente em e-mails.** A função `CloudPagesURL` foi projetada para criar links de e-mails para landing pages do CloudPages. Se você usá-la em mensagens SMS ou push, a landing page vai retornar erro caso o subscriber não seja membro da lista All Subscribers.
- **Criptografia automática.** Todos os parâmetros passados na função são criptografados com AES-GCM. Você não precisa se preocupar em criptografar manualmente — a função cuida disso.
- **Nomes reservados.** Os seguintes nomes **não podem** ser usados como nomes de parâmetros: `PAGEID`, `MID`, `JID`, `LID`, `SID`, `JSB`, `URLID`. Se você tentar usar algum deles, vai ter problema.
- **Onde achar o Page ID.** O ID da landing page fica na página de detalhes do conteúdo dentro do CloudPages, no Marketing Cloud.
- **Integração com Google Analytics.** Se você usa a integração do Google Analytics para anexar tags UTM automaticamente nos links, combine `CloudPagesURL` com [RedirectTo](../http-functions/redirectto.md) e [Concat](../string-functions/concat.md). Isso evita que os parâmetros adicionais de analytics quebrem a URL gerada (como mostrado no exemplo avançado).
- **Recuperando parâmetros na landing page.** Na página de destino, use [RequestParameter](../sites-functions/requestparameter.md) ou [QueryParameter](../sites-functions/queryparameter.md) para recuperar os valores dos parâmetros passados. Os dados já chegam descriptografados automaticamente.
- **Quantidade de parâmetros.** Você pode passar quantos pares nome-valor quiser — não há limite documentado. Basta ir adicionando ao final da função.
- **Contexto de personalização.** Como a query string inclui referência ao e-mail de origem, você consegue usar personalization strings na landing page para acessar dados do subscriber e do envio.

## Funções relacionadas

- [RedirectTo](../http-functions/redirectto.md) — redireciona para uma URL; essencial quando combinada com `CloudPagesURL` e parâmetros UTM do Google Analytics.
- [Concat](../string-functions/concat.md) — concatena strings; usada para adicionar parâmetros UTM à URL gerada pelo `CloudPagesURL`.
- [RequestParameter](../sites-functions/requestparameter.md) — recupera o valor de um parâmetro da query string na landing page de destino.
- [QueryParameter](../sites-functions/queryparameter.md) — alternativa para recuperar parâmetros de query string na landing page.
- [MicrositeURL](../sites-functions/micrositeurl.md) — função similar usada para gerar URLs de microsites (contexto mais antigo).
- [Redirect](../sites-functions/redirect.md) — redireciona o navegador para uma URL especificada.
- [AttributeValue](../utility-functions/attributevalue.md) — recupera valores de atributos do subscriber, útil para passar dados dinâmicos ao `CloudPagesURL`.
- [InsertDE](../data-extension-functions/insertde.md) — insere registros em Data Extensions; comum em landing pages que processam dados recebidos via `CloudPagesURL`.