---
title: Playground
sidebar_label: Playground
description: Como usar o playground interativo do AMPScript Way para escrever e testar código AMPscript diretamente no navegador, sem precisar de acesso ao Marketing Cloud.
slug: /docs/playground
---

# Playground

O AMPScript Way tem um playground interativo que permite escrever e executar código AMPscript diretamente no navegador — sem precisar de acesso ao Marketing Cloud, sem configurar nada, sem logar em lugar nenhum.

É útil para aprender a linguagem, testar uma lógica antes de colocar em produção, reproduzir um problema ou simplesmente experimentar uma função que você nunca usou.

**[Abrir o Playground →](/playground)**

---

## O que o playground oferece

### Editor com syntax highlighting

O editor é baseado no Monaco — o mesmo que alimenta o VS Code. Ele reconhece a sintaxe do AMPscript e destaca visualmente cada elemento:

- Delimitadores `%%[`, `]%%`, `%%=`, `=%%` e `%%variavel%%`
- Palavras-chave: `VAR`, `SET`, `IF`, `ELSEIF`, `ELSE`, `ENDIF`, `FOR`, `TO`, `DO`, `NEXT`
- Funções, variáveis, strings, números e comentários

O tema acompanha automaticamente a preferência de claro/escuro do site.

### Autocomplete

Ao digitar, o editor sugere funções e palavras-chave disponíveis. As sugestões incluem todas as funções suportadas pelo playground e inserem automaticamente os parênteses de abertura para facilitar a escrita.

### Painel de Subscriber

Simula os atributos de um subscriber, que no Marketing Cloud seriam os campos da All Subscribers ou de uma Data Extension usada como audiência.

Você define pares de chave e valor — por exemplo, `Nome` = `João`, `Email` = `joao@empresa.com.br` — e esses valores ficam acessíveis no código via `AttributeValue()` ou diretamente como personalization strings (`%%Nome%%`).

### Painel de Data Extensions

Simula Data Extensions completas com colunas e linhas. Você cria uma DE, define os campos e insere quantas linhas precisar. O código pode então usar `Lookup()`, `LookupRows()`, `InsertDE()`, `UpsertDE()` e todas as demais funções de DE normalmente, como se estivesse dentro do SFMC.

As alterações feitas pelo código (inserts, updates, deletes) refletem em tempo real no painel — o que torna fácil depurar lógicas que manipulam dados.

### Painel de Output

Exibe o resultado da execução do código. Tudo que o script produz — tanto o texto renderizado quanto os valores de `Output()` e `OutputLine()` — aparece aqui.

---

## Funções suportadas

O playground implementa as seguintes funções em TypeScript puro, sem dependência de nenhum serviço externo.

### String

`Char` · `Concat` · `Domain` · `Format` · `FormatCurrency` · `FormatNumber` · `IndexOf` · `Length` · `Lowercase` · `ProperCase` · `RegExMatch` · `Replace` · `ReplaceList` · `StringToHex` · `Substring` · `Trim` · `Uppercase` · `URLEncode`

### Matemática

`Add` · `Divide` · `Mod` · `Multiply` · `Random` · `Subtract`

### Data

`DateAdd` · `DateDiff` · `DateParse` · `DatePart` · `FormatDate` · `GetSendTime` · `LocalDateToSystemDate` · `Now` · `StringToDate` · `SystemDateToLocalDate`

### Utilitárias

`AttributeValue` · `Empty` · `GUID` · `IIF` · `IsEmailAddress` · `IsNull` · `IsNullDefault` · `IsPhoneNumber` · `Output` · `OutputLine` · `RaiseError` · `TreatAsContent` · `V`

### Criptografia

`Base64Decode` · `Base64Encode` · `DecryptSymmetric` · `EncryptSymmetric` · `MD5` · `SHA1` · `SHA256` · `SHA512`

### Conteúdo

`BuildRowsetFromJson` · `BuildRowsetFromString` · `BuildRowsetFromXml`

### HTTP

`IsChtmlBrowser` · `WrapLongURL`

### Sites

`QueryParameter` · `RequestParameter`

### Data Extension

`DataExtensionRowCount` · `DeleteData` · `DeleteDE` · `Field` · `InsertData` · `InsertDE` · `Lookup` · `LookupOrderedRows` · `LookupOrderedRowsCS` · `LookupRows` · `LookupRowsCS` · `Row` · `RowCount` · `UpdateData` · `UpdateDE` · `UpsertData` · `UpsertDE`

---

## Avisos importantes

### O playground não substitui o SFMC

> O objetivo do playground é educacional e de prototipagem. O comportamento simulado é uma aproximação fiel, mas há diferenças inevitáveis em relação ao ambiente real do Marketing Cloud. **Sempre valide seu código no SFMC antes de usar em produção.**

### Data Extensions são simuladas em memória

> As DEs do playground existem apenas enquanto a sessão está aberta. Não há persistência — fechar ou recarregar a página apaga tudo. Além disso, o playground não tem acesso a nenhuma DE real da sua conta SFMC.

### Funções de data e fuso horário

> `Now()` e `GetSendTime()` retornam a hora atual do navegador em UTC. No SFMC, `GetSendTime()` retorna o horário configurado no agendamento do job de envio, que pode ser diferente. As funções `LocalDateToSystemDate()` e `SystemDateToLocalDate()` não aplicam conversão de fuso no playground — retornam a data como está.

### Criptografia

> `SHA1`, `SHA256` e `SHA512` são implementados em JavaScript puro e produzem hashes idênticos aos do SFMC para qualquer entrada.

> `EncryptSymmetric` e `DecryptSymmetric` usam AES-128-CBC. A chave e o IV passados como string são truncados ou completados com zeros até 16 bytes. O comportamento pode diferir do SFMC se você usar chaves gerenciadas pela plataforma (Key Management) ou configurações de padding diferentes.

> `MD5`, `Base64Encode` e `Base64Decode` têm comportamento idêntico ao SFMC.

### Funções HTTP não são suportadas

> `HTTPGet`, `HTTPPost`, `HTTPPost2` e `HTTPPostWithRetry` não estão disponíveis no playground. Requisições HTTP externas não são possíveis no contexto do navegador sem um servidor intermediário.

> `IsChtmlBrowser()` sempre retorna `false`. `WrapLongURL()` retorna a URL sem modificação — o comportamento real depende do sistema de rastreamento do SFMC.

### Funções de QueryParameter e RequestParameter

> `QueryParameter()` e `RequestParameter()` lêem os parâmetros da URL atual do navegador. Para testá-las, adicione parâmetros na URL do playground — por exemplo: `/playground?cidade=Recife&segmento=premium` — e o código conseguirá lê-los normalmente.

### Funções que dependem do ambiente SFMC

As seguintes categorias de funções existem na linguagem mas **não são suportadas** no playground porque dependem de serviços ou dados que só existem dentro do Marketing Cloud:

- **Content Builder**: `ContentBlockByKey`, `ContentBlockById`, `ContentArea`, `Image`, `AttachFile` e similares
- **CloudPages**: `CloudPagesURL`, `MicrositeURL`, `Redirect` e similares
- **Autenticação**: todas as funções `Authenticated*`
- **Salesforce CRM**: `CreateSalesforceObject`, `RetrieveSalesforceObjects` e similares
- **Microsoft Dynamics**: todas as funções `*Mscrm*`
- **API SOAP**: `InvokeCreate`, `InvokeRetrieve`, `CreateObject` e similares
- **SMS / MobileConnect**: `CreateSmsConversation`, `EndSmsConversation` e similares
- **Social**: `GetPublishedSocialContent`, `GetSocialPublishURL` e similares
- **Contatos**: `UpsertContact`
- **DE avançado**: `ClaimRow`, `ClaimRowValue`, `ExecuteFilter`, `ExecuteFilterOrderedRows`
- **JWT**: `GetJwt`, `GetJwtByKeyName`

Tentar usar uma dessas funções no playground resulta em erro de função desconhecida.