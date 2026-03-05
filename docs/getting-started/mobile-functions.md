---
title: Funções Mobile
sidebar_label: Funções Mobile
description: Funções AMPscript exclusivas para mensagens SMS e MMS enviadas via MobileConnect.
sidebar_position: 12
---

# Funções Mobile

O AMPscript tem um conjunto de funções específicas para mensagens mobile enviadas pelo **MobileConnect**. Essas funções trabalham com mensagens originadas pelo próprio subscriber (MO - mobile-originated), ou seja, mensagens que o cliente envia para o seu número de SMS.

> **⚠️ Atenção:** Essas funções **não funcionam em e-mails, CloudPages ou outros tipos de conteúdo**. Elas retornam valores que só fazem sentido no contexto de mensagens mobile e são exclusivas do MobileConnect.

## Entendendo MO e MT

Antes de ver as funções, é importante entender dois conceitos:

- **MO (Mobile-Originated):** mensagem enviada **pelo subscriber** para o seu número de SMS - por exemplo, o cliente envia "OFERTA" para receber um cupom.
- **MT (Mobile-Terminated):** mensagem enviada **para o subscriber** - o disparo que você faz para a base.

As funções abaixo trabalham com o conteúdo da mensagem MO recebida.

## Funções disponíveis

### `Msg(0)`

Retorna o conteúdo completo da mensagem MO - tudo que o subscriber enviou. O único valor aceito como parâmetro é `0`.

```ampscript
SET @mensagemCompleta = Msg(0)
/* Se o subscriber enviou "OFERTA 123", @mensagemCompleta = "OFERTA 123" */
```

### `Verb`

Usado junto com `Msg(0)`, retorna a **palavra-chave** da mensagem MO - o primeiro termo, que corresponde ao keyword configurado no MobileConnect.

```ampscript
SET @keyword = Msg(0).Verb
/* Se a keyword é "OFERTA" e o subscriber enviou "OFERTA 123", retorna "OFERTA" */
```

### `Nouns`

Usado junto com `Msg(0)`, retorna **todo o conteúdo que vem após a keyword**. Útil quando o subscriber envia dados junto com a keyword.

```ampscript
SET @dados = Msg(0).Nouns
/* Se o subscriber enviou "OFERTA João Silva", retorna "João Silva" */
```

### `Noun(n)`

Usado junto com `Msg(0)`, retorna uma **palavra específica** do conteúdo após a keyword. O parâmetro indica a posição: `0` é a primeira palavra após a keyword, `1` é a segunda, e assim por diante.

```ampscript
SET @primeiroNome = Msg(0).Noun(0)
SET @sobrenome    = Msg(0).Noun(1)
/*
  Se o subscriber enviou "CADASTRO Maria Santos":
  @primeiroNome = "Maria"
  @sobrenome = "Santos"
*/
```

### `MMS_Content_URL(n)`

Retorna a URL do conteúdo MMS recebido em uma mensagem MO. Funciona apenas com contas MobileConnect que suportam MMS. O parâmetro `n` indica o ordinal do conteúdo MMS na mensagem - `0` para o conteúdo atual.

```ampscript
SET @urlImagem = MMS_Content_URL(0)
/* Retorna a URL da imagem ou mídia enviada pelo subscriber via MMS */
```

> **⚠️ Atenção:** A URL retornada por `MMS_Content_URL()` deve ser capturada e armazenada no seu próprio sistema para uso posterior - o Marketing Cloud não garante disponibilidade indefinida do conteúdo nessa URL.

## Exemplo prático

Verificar se a mensagem MO do subscriber contém uma palavra específica e responder de acordo:

```ampscript
%%[
SET @mensagem = Msg(0)
SET @keyword  = Msg(0).Verb

IF @keyword == 'CUPOM' THEN
    SET @resposta = 'Seu cupom de 20% de desconto é: MOBILE20. Válido até o fim do mês!'
ELSEIF @keyword == 'SALDO' THEN
    SET @resposta = 'Consulte seu saldo em nosso app ou ligue 0800 999 9999.'
ELSE
    SET @resposta = 'Não reconhecemos esse comando. Envie CUPOM ou SALDO.'
ENDIF
]%%
```

## Funções de Data Extension no MobileConnect

Além das funções mobile específicas, você também pode usar `InsertData()` e `DeleteData()` em mensagens MobileConnect - por exemplo, para registrar keywords recebidas ou gerenciar opt-outs em uma Data Extension.
