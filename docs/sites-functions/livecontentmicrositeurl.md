---
title: LiveContentMicrositeURL
sidebar_label: LiveContentMicrositeURL
description: Retorna uma URL de microsite para visualizar conteúdo dinâmico (como cupons) em uma landing page, em vez de exibi-lo diretamente no corpo da mensagem.
---

# LiveContentMicrositeURL

## Descrição

A função `LiveContentMicrositeURL` gera um link para uma landing page em um microsite que exibe conteúdo dinâmico (live content), como cupons. Em vez de renderizar o cupom diretamente no corpo do e-mail ou SMS, ela retorna uma URL que o destinatário pode acessar para visualizar o conteúdo. Isso é especialmente útil quando você está enviando cupons via mensagens SMS ou e-mails somente texto, onde não é possível renderizar HTML complexo ou imagens inline. A função aceita apenas o tipo de conteúdo `coupon` e a chave externa do conteúdo dinâmico que você configurou no Marketing Cloud.

## Sintaxe

```ampscript
LiveContentMicrositeURL("coupon", "externalKey")
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| contentType | String | Sim | O tipo de conteúdo dinâmico. O único valor aceito é `"coupon"`. |
| externalKey | String | Sim | A chave externa (external key) do conteúdo dinâmico (live content) configurado no Marketing Cloud. |

## Retorno

Retorna uma **string** contendo a URL completa de uma landing page no microsite que exibe o cupom referenciado.

## Exemplo básico

Imagine que a **MegaStore** configurou um cupom de desconto como live content no Marketing Cloud, com a chave externa `cupom-blackfriday-2024`. Você quer enviar o link desse cupom por SMS:

```ampscript
%%[
VAR @linkCupom
SET @linkCupom = LiveContentMicrositeURL("coupon", "cupom-blackfriday-2024")
]%%

MegaStore: Seu cupom de Black Friday chegou! Acesse e garanta 30% OFF: %%=v(@linkCupom)=%%
```

**Saída:**
```
MegaStore: Seu cupom de Black Friday chegou! Acesse e garanta 30% OFF: https://pub.s10.exacttarget.com/xxxxx
```

## Exemplo avançado

Aqui a **FarmaRede** quer enviar cupons personalizados por SMS para clientes do programa de fidelidade. O cupom varia de acordo com o nível do cliente, e a chave externa é montada dinamicamente com base em dados de uma Data Extension:

```ampscript
%%[
VAR @nomeCliente, @nivelFidelidade, @chaveCupom, @linkCupom, @mensagem

SET @nomeCliente = AttributeValue("PrimeiroNome")
SET @nivelFidelidade = Lowercase(AttributeValue("NivelFidelidade"))

/* Monta a chave externa do cupom com base no nível */
IF @nivelFidelidade == "ouro" THEN
  SET @chaveCupom = "cupom-farmerede-ouro-2024"
ELSEIF @nivelFidelidade == "prata" THEN
  SET @chaveCupom = "cupom-farmerede-prata-2024"
ELSE
  SET @chaveCupom = "cupom-farmerede-padrao-2024"
ENDIF

SET @linkCupom = LiveContentMicrositeURL("coupon", @chaveCupom)

/* Monta a mensagem SMS */
IF @nivelFidelidade == "ouro" THEN
  SET @mensagem = Concat("Oi ", @nomeCliente, "! Voce e cliente Ouro FarmaRede e ganhou um cupom de R$50 OFF. Resgate aqui: ", @linkCupom)
ELSEIF @nivelFidelidade == "prata" THEN
  SET @mensagem = Concat("Oi ", @nomeCliente, "! Cliente Prata tem cupom de R$25 OFF na FarmaRede. Acesse: ", @linkCupom)
ELSE
  SET @mensagem = Concat("Oi ", @nomeCliente, "! A FarmaRede tem um cupom especial pra voce. Confira: ", @linkCupom)
ENDIF
]%%

%%=v(@mensagem)=%%
```

**Saída (para Maria Santos, nível Ouro):**
```
Oi Maria! Voce e cliente Ouro FarmaRede e ganhou um cupom de R$50 OFF. Resgate aqui: https://pub.s10.exacttarget.com/xxxxx
```

**Saída (para Carlos Oliveira, nível padrão):**
```
Oi Carlos! A FarmaRede tem um cupom especial pra voce. Confira: https://pub.s10.exacttarget.com/yyyyy
```

## Observações

- O único valor aceito para o parâmetro `contentType` é `"coupon"`. Passar qualquer outro valor vai gerar erro.
- Essa função foi pensada especificamente para cenários onde o conteúdo não pode ser renderizado diretamente na mensagem, como **mensagens SMS** e **e-mails somente texto (text-only)**. Se você está enviando um e-mail HTML comum, pode ser mais prático renderizar o cupom diretamente no corpo do e-mail.
- A chave externa (`externalKey`) precisa corresponder exatamente ao live content configurado no Marketing Cloud. Verifique no Content Builder ou na área de Live Content se a chave está correta antes de usar.
- Essa função depende da funcionalidade de **Microsites** do Marketing Cloud. Se sua conta não tem microsites configurados, a função pode não funcionar como esperado.
- A URL retornada é gerada automaticamente pelo Marketing Cloud e aponta para a infraestrutura de microsites da Salesforce — você não tem controle sobre o domínio base dessa URL, a menos que tenha configurado um domínio personalizado (SAP/Sender Authentication Package).
- A função `LiveContentMicrositeURL` é considerada uma função de nicho. A maioria dos cenários modernos de cupons e landing pages utiliza [CloudPagesURL](../sites-functions/cloudpagesurl.md) com lógica customizada. Avalie se CloudPages não atende melhor ao seu caso de uso.

## Funções relacionadas

- [MicrositeURL](../sites-functions/micrositeurl.md) — gera URLs para microsites de forma geral, sem ser específica para live content
- [CloudPagesURL](../sites-functions/cloudpagesurl.md) — gera URLs para CloudPages com parâmetros criptografados, alternativa moderna para landing pages
- [Concat](../string-functions/concat.md) — concatena strings, útil para montar mensagens dinâmicas com o link do cupom
- [Lowercase](../string-functions/lowercase.md) — converte texto para minúsculas, útil para normalizar valores antes de comparações
- [AttributeValue](../utility-functions/attributevalue.md) — recupera valores de atributos do assinante de forma segura
- [RedirectTo](../http-functions/redirectto.md) — redireciona para uma URL, útil quando você precisa controlar o tracking de cliques em links dinâmicos
- [V](../utility-functions/v.md) — exibe o valor de uma variável no conteúdo renderizado