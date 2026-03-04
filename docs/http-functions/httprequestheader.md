---
title: HTTPRequestHeader
sidebar_label: HTTPRequestHeader
description: Recupera o valor de um header HTTP padrão da requisição em uma landing page.
---

# HTTPRequestHeader

## Descrição

A função `HTTPRequestHeader` recupera o valor de um header (cabeçalho) de uma requisição HTTP em uma landing page. Ela funciona apenas com headers HTTP padrão definidos na RFC 7231. É útil quando você precisa identificar informações do navegador ou dispositivo do visitante em CloudPages — por exemplo, para adaptar o conteúdo de uma página de preferências ou formulário com base no `User-Agent` do cliente.

## Sintaxe

```ampscript
HTTPRequestHeader("headerToRetrieve")
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| headerToRetrieve | String | Sim | Nome do header HTTP padrão (RFC 7231) que você deseja recuperar da requisição. |

## Exemplo básico

Recuperando o header `User-Agent` em uma CloudPage da Lojas Vitória para identificar o navegador do visitante.

```ampscript
%%[
SET @userAgent = HTTPRequestHeader("User-Agent")
]%%

Seu navegador: %%=v(@userAgent)=%%
```

**Saída:**
```
Seu navegador: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36
```

## Exemplo avançado

Em uma landing page de cadastro da MegaStore, você quer detectar se o visitante está acessando de um dispositivo móvel para registrar essa informação na Data Extension junto com os dados do formulário.

```ampscript
%%[
SET @userAgent = HTTPRequestHeader("User-Agent")
SET @isMobile = "Nao"

IF IndexOf(@userAgent, "Mobile") > 0 OR IndexOf(@userAgent, "Android") > 0 THEN
  SET @isMobile = "Sim"
ENDIF

SET @email = RequestParameter("email")
SET @nome = RequestParameter("nome")

IF NOT Empty(@email) THEN
  InsertDE(
    "Cadastro_MegaStore",
    "Email", @email,
    "Nome", @nome,
    "DispositivoMovel", @isMobile,
    "UserAgent", @userAgent
  )
ENDIF
]%%

%%[ IF @isMobile == "Sim" THEN ]%%
  <p>Obrigado pelo cadastro, %%=v(@nome)=%%! Vimos que você está no celular — em breve enviaremos ofertas otimizadas para mobile.</p>
%%[ ELSE ]%%
  <p>Obrigado pelo cadastro, %%=v(@nome)=%%! Confira nossas ofertas no site.</p>
%%[ ENDIF ]%%
```

**Saída (acesso via celular):**
```
Obrigado pelo cadastro, Maria Santos! Vimos que você está no celular — em breve enviaremos ofertas otimizadas para mobile.
```

## Observações

> **⚠️ Atenção:** Essa função só pode ser usada em **landing pages** (CloudPages). Não funciona em e-mails, pois no momento do envio de e-mail não existe uma requisição HTTP do subscriber.

> **⚠️ Atenção:** Apenas headers HTTP padrão definidos na **RFC 7231** podem ser recuperados. Headers customizados não são suportados por essa função.

- A função retorna o valor do header como string. Se o header solicitado não estiver presente na requisição, considere tratar o retorno com [Empty](../utility-functions/empty.md) ou [IsNull](../utility-functions/isnull.md) para evitar exibir valores vazios na página.

> **💡 Dica:** Combine com [IndexOf](../string-functions/indexof.md) ou [RegExMatch](../string-functions/regexmatch.md) para fazer parsing do valor retornado — como identificar navegador, sistema operacional ou tipo de dispositivo a partir do `User-Agent`.

## Funções relacionadas

- [HTTPGet](../http-functions/httpget.md)
- [HTTPPost](../http-functions/httppost.md)
- [RequestParameter](../sites-functions/requestparameter.md)
- [CloudPagesURL](../sites-functions/cloudpagesurl.md)
- [RedirectTo](../http-functions/redirectto.md)
- [IndexOf](../string-functions/indexof.md)