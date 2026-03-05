---
title: AttachFile
sidebar_label: AttachFile
description: Anexa um arquivo a um e-mail enviado pelo Marketing Cloud, com suporte a HTTP, FTP e Content Builder.
---

# AttachFile

## Descrição

A função `AttachFile` anexa um arquivo a um e-mail que está sendo enviado pelo Marketing Cloud. Você pode puxar o arquivo de uma URL (HTTP/HTTPS), do Enhanced FTP ou do Content Builder. É muito usada em cenários como envio de boletos em PDF, segunda via de documentos, ingressos digitais (.pkpass), calendários (.ics) e relatórios personalizados - situações comuns em réguas de relacionamento no mercado brasileiro.

> **⚠️ Atenção:** Antes de usar essa função, você precisa solicitar a habilitação de anexos em AMPscript junto ao seu Account Executive da Salesforce. Sem isso, a função simplesmente não vai funcionar.

## Sintaxe

```ampscript
AttachFile(fileLocationType, fileLocation, attachmentFileName, boolViewOnWeb, viewOnWebLocation, viewOnWebFileName, viewOnWebDuration, boolContentDispositionAttachment)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| fileLocationType | String | Sim | Tipo de origem do arquivo. Valores aceitos: `http`, `ftp`, `contentbuilder`. |
| fileLocation | String | Sim | Localização do arquivo (máximo de 2088 caracteres). Para `http`: uma URL. Para `ftp`: o nome do arquivo na pasta Import do Enhanced FTP. Para `contentbuilder`: a external key do asset. |
| attachmentFileName | String | Não | Nome que será atribuído ao arquivo anexado. Se não informado, usa o nome original. Para `http`, caso não informado, tenta usar o Content-Disposition do header HTTP; se indisponível, gera um nome automaticamente. |
| boolViewOnWeb | Boolean | Não | Se `true`, inclui um link para o arquivo quando o destinatário clica em "Visualizar como Página Web". Se `false`, o link é omitido. Disponível apenas quando `fileLocationType` é `http`. |
| viewOnWebLocation | String | Não | URL do link exibido no contexto "Visualizar como Página Web". Obrigatório se `boolViewOnWeb` for `true`. Disponível apenas quando `fileLocationType` é `http`. |
| viewOnWebFileName | String | Não | Texto do link exibido no contexto "Visualizar como Página Web". Disponível apenas quando `fileLocationType` é `http`. |
| viewOnWebDuration | Number | Não | Número de dias que o link ficará ativo no contexto "Visualizar como Página Web". Disponível apenas quando `fileLocationType` é `http`. |
| boolContentDispositionAttachment | Boolean | Não | Se `true`, define o header `content-disposition` como `attachment` (forçando download). Se `false`, define como `inline`. |

## Tipos de arquivo suportados

| Extensão | MIME Type |
|----------|-----------|
| doc | application/msword |
| pdf | application/pdf |
| rtf | application/rtf |
| pkpass | application/vnd.apple.pkpass |
| xls | application/vnd.ms-excel |
| ppt | application/vnd.ms-powerpoint |
| docm | application/vnd.ms-word.document.macroEnabled.12 |
| pptx | application/vnd.openxmlformats-officedocument.presentationml.presentation |
| xlsx | application/vnd.openxmlformats-officedocument.spreadsheetml.sheet |
| docx | application/vnd.openxmlformats-officedocument.wordprocessingml.document |
| rar | application/x-rar-compressed |
| ics | application/ics, text/calendar |
| xml | application/xml, text/xml |
| zip | application/x-zip-compressed, application/zip |
| wav | audio/wav, audio/x-wav |
| gif | image/gif |
| jpeg, jpg | image/jpeg, image/jpg |
| png | image/png, image/x-png |
| tif, tiff | image/tiff |
| csv | text/csv |
| htm, html | text/html |
| txt | text/plain |
| rtf | text/rtf |
| vcf | text/vcard, text/x-vcard |
| mp4 | video/mp4 |

## Exemplo básico

Anexando um boleto em PDF hospedado em um servidor web ao e-mail de cobrança do Banco Brasilão:

```ampscript
%%[
VAR @urlBoleto
SET @urlBoleto = Concat("https://boletos.bancobrasilao.com.br/gerar/", AttributeValue("NumeroDocumento"), ".pdf")

AttachFile("http", @urlBoleto, "boleto-banco-brasilao.pdf")
]%%

<p>Olá, %%=v(@PrimeiroNome)=%%!</p>
<p>Segue em anexo o boleto referente à sua fatura. Qualquer dúvida, entre em contato.</p>
```

**Saída:**
```
O e-mail é enviado com o arquivo "boleto-banco-brasilao.pdf" anexado.
```

## Exemplo avançado

Cenário de régua de relacionamento da MegaStore: após a compra, o cliente recebe um e-mail com a nota fiscal em PDF anexada (via Content Builder) e um convite de calendário (.ics) hospedado no FTP. O PDF é forçado como download.

```ampscript
%%[
VAR @nomeCliente, @numeroPedido, @chaveNF, @nomeArquivoNF

SET @nomeCliente = AttributeValue("NomeCompleto")
SET @numeroPedido = AttributeValue("NumeroPedido")
SET @chaveNF = Concat("nf-pedido-", @numeroPedido)
SET @nomeArquivoNF = Concat("NF_MegaStore_Pedido_", @numeroPedido, ".pdf")

/* Anexa a nota fiscal do Content Builder */
AttachFile("contentbuilder", @chaveNF, @nomeArquivoNF, false, "", "", 0, true)

/* Anexa o convite de calendário do Enhanced FTP */
AttachFile("ftp", Concat("convite_entrega_", @numeroPedido, ".ics"), "Data_Entrega_MegaStore.ics")
]%%

<p>Olá, %%=v(@nomeCliente)=%%!</p>
<p>Seu pedido <strong>#%%=v(@numeroPedido)=%%</strong> foi confirmado!</p>
<p>Anexamos a nota fiscal em PDF e um convite para sua agenda com a data prevista de entrega.</p>
<p>Obrigado por comprar na MegaStore!</p>
```

**Saída:**
```
O e-mail é enviado com dois anexos:
1. "NF_MegaStore_Pedido_98765.pdf" (nota fiscal via Content Builder, forçando download)
2. "Data_Entrega_MegaStore.ics" (convite de calendário via Enhanced FTP)
```

## Exemplo com View as Web Page

Enviando um PDF de proposta comercial pela Conecta Telecom com link ativo na versão web do e-mail por 7 dias:

```ampscript
%%[
VAR @urlProposta, @urlPropostaWeb, @nomeCliente

SET @nomeCliente = AttributeValue("NomeContato")
SET @urlProposta = "https://propostas.conectatelecom.com.br/docs/proposta-plano-empresarial.pdf"
SET @urlPropostaWeb = "https://propostas.conectatelecom.com.br/docs/proposta-plano-empresarial.pdf"

AttachFile("http", @urlProposta, "Proposta_Conecta_Telecom.pdf", true, @urlPropostaWeb, "Baixar Proposta Comercial (PDF)", 7, true)
]%%

<p>Olá, %%=v(@nomeCliente)=%%!</p>
<p>Segue em anexo a proposta comercial do Plano Empresarial Conecta Telecom.</p>
<p>Caso prefira, você também pode visualizar este e-mail no navegador para acessar o link de download.</p>
```

**Saída:**
```
O e-mail é enviado com "Proposta_Conecta_Telecom.pdf" anexado.
Ao clicar em "Visualizar como Página Web", aparece o link "Baixar Proposta Comercial (PDF)" que ficará ativo por 7 dias.
```

## Observações

- A função `AttachFile` funciona **apenas em e-mails**. Ela não é suportada em CloudPages ou SMS.

- A funcionalidade precisa ser habilitada previamente pelo seu Account Executive da Salesforce. Sem essa habilitação, a função não estará disponível na sua conta.

> **⚠️ Atenção:** Se o servidor remoto (no caso de `http`) não responder à chamada do `AttachFile` dentro de **30 segundos**, o envio é reagendado para **15 minutos depois**. Considere isso em envios com alto volume - servidores lentos podem atrasar significativamente a sua régua.

> **⚠️ Atenção:** Você só pode anexar arquivos que estejam na mesma conta (Business Unit) usada para o envio. A função **não suporta conteúdo compartilhado** do Content Builder ou Portfolio.

> **💡 Dica:** Você pode pedir ao seu Account Executive para ajustar o threshold de erro que interrompe o job de envio prematuramente. Isso evita que um único erro de anexo (ex: URL fora do ar) pare o envio inteiro - muito útil em réguas de boleto onde a URL é dinâmica por cliente.

- O parâmetro `fileLocation` aceita no máximo **2088 caracteres**. Se você monta URLs dinâmicas com [Concat](../string-functions/concat.md), fique atento a esse limite.

- A função suporta transmissão segura via **HTTPS**.

- Os parâmetros `boolViewOnWeb`, `viewOnWebLocation`, `viewOnWebFileName` e `viewOnWebDuration` só podem ser usados quando `fileLocationType` é `http`.

- Para `boolContentDispositionAttachment`: use `true` quando quiser forçar o download do arquivo (ex: boletos, notas fiscais) e `false` quando quiser que o arquivo seja exibido inline pelo cliente de e-mail (quando suportado).

## Funções relacionadas

- [Concat](../string-functions/concat.md) - para montar URLs e nomes de arquivo dinamicamente
- [AttributeValue](../utility-functions/attributevalue.md) - para resgatar dados do assinante usados na construção do caminho do arquivo
- [ContentBlockByKey](../content-functions/contentblockbykey.md) - para incluir blocos de conteúdo dinâmico no corpo do e-mail
- [Lookup](../data-extension-functions/lookup.md) - para buscar dados como número do boleto ou chave do arquivo em uma Data Extension
- [RaiseError](../utility-functions/raiseerror.md) - para tratar erros quando o arquivo não estiver disponível