---
title: LiveContentMicrositeURL
sidebar_label: LiveContentMicrositeURL
description: Retorna uma URL de microsite para visualização de conteúdo dinâmico (como cupons), ideal para envio via SMS ou e-mails somente texto.
---

# LiveContentMicrositeURL

## Descrição

Gera um link para uma landing page em microsite que exibe conteúdo dinâmico - em vez de renderizar esse conteúdo diretamente no corpo do e-mail. A função é especialmente útil quando você precisa enviar cupons via SMS ou em e-mails somente texto (text-only), onde não é possível exibir conteúdo visual inline. Ela retorna uma URL que aponta para uma página contendo o cupom referenciado.

## Sintaxe

```ampscript
LiveContentMicrositeURL(contentType, externalKey)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| contentType | String | Sim | Tipo do conteúdo dinâmico. O único valor aceito é `"coupon"`. |
| externalKey | String | Sim | Chave externa (external key) do conteúdo dinâmico que você quer referenciar. |

## Exemplo básico

Gerando o link de um cupom de desconto da MegaStore para envio por SMS:

```ampscript
%%[
VAR @urlCupom
SET @urlCupom = LiveContentMicrositeURL("coupon", "megastore-cupom-verao-2024")
]%%

Aproveite seu cupom exclusivo: %%=v(@urlCupom)=%%
```

**Saída:**
```
Aproveite seu cupom exclusivo: https://pub.s10.exacttarget.com/xxxxxxxxxx
```

## Exemplo avançado

Cenário de régua de relacionamento da FarmaRede: após uma compra, o cliente recebe um SMS com um cupom de desconto para a próxima visita. O código seleciona o cupom correto com base na categoria de cliente e monta a mensagem completa.

```ampscript
%%[
VAR @nome, @categoria, @chaveCupom, @urlCupom, @mensagem

SET @nome = AttributeValue("PrimeiroNome")
SET @nome = IIF(NOT EMPTY(@nome), @nome, "Cliente")

SET @categoria = AttributeValue("CategoriaCLiente")

IF @categoria == "VIP" THEN
  SET @chaveCupom = "farmerede-cupom-vip-30off"
ELSE
  SET @chaveCupom = "farmerede-cupom-padrao-10off"
ENDIF

SET @urlCupom = LiveContentMicrositeURL("coupon", @chaveCupom)

SET @mensagem = Concat("Oi, ", @nome, "! A FarmaRede preparou um cupom especial pra voce. Acesse: ", @urlCupom)
]%%

%%=v(@mensagem)=%%
```

**Saída:**
```
Oi, Maria! A FarmaRede preparou um cupom especial pra voce. Acesse: https://pub.s10.exacttarget.com/xxxxxxxxxx
```

## Observações

- O único valor aceito para o parâmetro `contentType` é `"coupon"`. Não existem outros tipos documentados.

> **💡 Dica:** Essa função foi pensada para contextos onde o conteúdo visual não pode ser renderizado diretamente - como mensagens SMS e e-mails text-only. Se você está trabalhando com um e-mail HTML e quer exibir o cupom inline, avalie se realmente precisa direcionar para uma landing page ou se faz mais sentido usar outra abordagem.

> **⚠️ Atenção:** A external key precisa corresponder exatamente ao conteúdo dinâmico do tipo cupom configurado na sua conta. Verifique a chave no setup de Live Content antes de implementar - um typo na external key vai gerar um link que não funciona como esperado.

## Funções relacionadas

- [MicrositeURL](../sites-functions/micrositeurl.md) - gera URLs de microsite para páginas genéricas
- [CloudPagesURL](../sites-functions/cloudpagesurl.md) - gera URLs para Cloud Pages com passagem de parâmetros criptografados
- [RedirectTo](../http-functions/redirectto.md) - redireciona o usuário para uma URL específica
- [Concat](../string-functions/concat.md) - concatena strings, útil para montar mensagens com a URL gerada
- [AttributeValue](../utility-functions/attributevalue.md) - recupera valores de atributos do assinante de forma segura