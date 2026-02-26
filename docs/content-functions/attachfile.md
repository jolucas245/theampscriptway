---
title: AttachFile
sidebar_label: AttachFile
description: Anexa um arquivo a um e-mail enviado pelo Marketing Cloud, com suporte a arquivos via HTTP, FTP ou Content Builder.
---

# AttachFile

## Descrição

A função `AttachFile` anexa um arquivo a um e-mail que está sendo enviado pelo Marketing Cloud. Você pode puxar o arquivo de três origens diferentes: uma URL (HTTP/HTTPS), o FTP aprimorado da conta ou o Content Builder. Opcionalmente, quando o destinatário visualiza o e-mail como página web ("View as a Web Page"), é possível incluir um link para download do arquivo. Essa função **não retorna valor** — ela apenas executa a ação de anexar o arquivo ao e-mail.

> **Importante:** Antes de usar essa função, você precisa solicitar a ativação de anexos AMPscript ao seu Account Executive da Salesforce. Sem essa ativação, a função não vai funcionar.

## Sintaxe

```ampscript
AttachFile(fileLocationType, fileLocation, attachmentFileName, boolViewOnWeb, viewOnWebLocation, viewOnWebFileName, viewOnWebDuration, boolContentDispositionAttachment)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| fileLocationType | String | Sim | Tipo de origem do arquivo. Valores aceitos: `"http"`, `"ftp"`, `"contentbuilder"`. |
| fileLocation | String | Sim | Localização do arquivo (máximo de 2088 caracteres). Para `"http"`: uma URL completa. Para `"ftp"`: o nome do arquivo na pasta Import do Enhanced FTP. Para `"contentbuilder"`: a external key do asset no Content Builder. |
| attachmentFileName | String | Não | Nome que o arquivo terá quando for anexado ao e-mail. Se não informado, usa o nome original do arquivo. Para `"http"`, se omitido, tenta usar o header `Content-Disposition` do servidor; se indisponível, gera um nome automaticamente. |
| boolViewOnWeb | Boolean | Não | Se `true`, inclui um link para o arquivo quando o destinatário clica em "Visualizar como Página Web". Se `false`, o link é omitido. **Disponível apenas quando fileLocationType é `"http"`.** |
| viewOnWebLocation | String | Não | URL do link que será exibido no contexto "Visualizar como Página Web". **Obrigatório se boolViewOnWeb for `true`.** Pode ser diferente da URL original do arquivo. **Disponível apenas para `"http"`.** |
| viewOnWebFileName | String | Não | Texto do link exibido no contexto "Visualizar como Página Web". **Disponível apenas para `"http"`.** |
| viewOnWebDuration | Número | Não | Número de dias que o link ficará ativo no contexto "Visualizar como Página Web". **Disponível apenas para `"http"`.** |
| boolContentDispositionAttachment | Boolean | Não | Se `true`, define o header `content-disposition` do anexo como `attachment`. Se `false`, define como `inline`. |

## Tipos de arquivo suportados

Aqui estão os principais tipos de arquivo que você pode anexar:

| Extensão | MIME Type |
|---|---|
| pdf | application/pdf |
| doc | application/msword |
| docx | application/vnd.openxmlformats-officedocument.wordprocessingml.document |
| xlsx | application/vnd.openxmlformats-officedocument.spreadsheetml.sheet |
| xls | application/vnd.ms-excel |
| pptx | application/vnd.openxmlformats-officedocument.presentationml.presentation |
| csv | text/csv |
| txt | text/plain |
| png | image/png |
| jpg / jpeg | image/jpeg |
| gif | image/gif |
| zip | application/zip |
| rar | application/x-rar-compressed |
| mp4 | video/mp4 |
| ics | application/ics |
| vcf | text/vcard |
| pkpass | application/vnd.apple.pkpass |
| html / htm | text/html |
| xml | application/xml |
| wav | audio/wav |
| tif / tiff | image/tiff |
| rtf | application/rtf |

## Exemplo básico

Cenário: A **Lojas Vitória** quer enviar um e-mail de confirmação de pedido com o boleto em PDF anexado, puxando o arquivo de uma URL.

```ampscript
%%[
AttachFile("http", "https://www.lojasvitoria.com.br/boletos/pedido_98321.pdf", "Boleto_LojaVitoria.pdf")
]%%

<h1>Olá, %%=v(@PrimeiroNome)=%%!</h1>
<p>Seu pedido #98321 foi confirmado com sucesso!</p>
<p>O boleto no valor de R$ 459,90 está anexado a este e-mail.</p>
<p>Vencimento: 15/06/2025</p>
```

**Saída:**
```
O destinatário recebe o e-mail com o arquivo "Boleto_LojaVitoria.pdf" anexado.
```

## Exemplo avançado

Cenário: O **Banco Meridional** envia um extrato mensal personalizado para cada cliente. O arquivo PDF é gerado dinamicamente e hospedado em um servidor seguro. O banco quer que, ao visualizar o e-mail como página web, o cliente também consiga baixar o extrato por um link que fica ativo por 7 dias.

```ampscript
%%[
SET @NomeCliente = AttributeValue("NomeCompleto")
SET @CPF = AttributeValue("CPF")
SET @ContaID = AttributeValue("ContaID")
SET @MesReferencia = "maio-2025"

/* Monta a URL do extrato */
SET @URLExtrato = Concat("https://extratos.bancomeridional.com.br/gerar/", @ContaID, "/", @MesReferencia, ".pdf")

/* Nome amigável para o anexo */
SET @NomeArquivo = Concat("Extrato_Meridional_", @MesReferencia, ".pdf")

/* URL para visualização web (pode ser diferente) */
SET @URLWeb = Concat("https://www.bancomeridional.com.br/clientes/extrato-download?conta=", @ContaID, "&mes=", @MesReferencia)

/* Anexa o PDF com link ativo por 7 dias na visualização web */
AttachFile(
  "http",
  @URLExtrato,
  @NomeArquivo,
  true,
  @URLWeb,
  "Clique aqui para baixar seu extrato",
  7,
  true
)
]%%

<h2>Olá, %%=v(@NomeCliente)=%%!</h2>
<p>Segue em anexo o seu extrato do mês de referência <strong>%%=v(@MesReferencia)=%%</strong>.</p>
<p>Conta: %%=v(@ContaID)=%% | CPF: %%=v(@CPF)=%%</p>
<p>Qualquer dúvida, entre em contato pelo (11) 3030-5050.</p>
<p style="font-size:12px;color:#888;">Este extrato é confidencial e destinado exclusivamente ao titular da conta.</p>
```

**Saída:**
```
O destinatário recebe o e-mail com o arquivo "Extrato_Meridional_maio-2025.pdf" anexado.
Ao clicar em "Visualizar como Página Web", aparece o link "Clique aqui para baixar seu extrato"
apontando para a URL de download, que ficará ativo por 7 dias.
```

## Exemplo com FTP

Cenário: A **FarmaRede** envia um catálogo de ofertas semanais em PDF. O arquivo é carregado na pasta Import do Enhanced FTP.

```ampscript
%%[
AttachFile("ftp", "catalogo_ofertas_semana24.pdf", "Ofertas_FarmaRede.pdf")
]%%

<h2>Confira as ofertas da semana, %%=v(@PrimeiroNome)=%%! 💊</h2>
<p>O catálogo completo está anexado a este e-mail.</p>
<p>Frete grátis para compras acima de R$ 149,90!</p>
```

## Exemplo com Content Builder

Cenário: A **Conecta Telecom** quer anexar um guia de instalação que está armazenado no Content Builder.

```ampscript
%%[
AttachFile("contentbuilder", "guia-instalacao-fibra-2025", "Guia_Instalacao_Conecta.pdf")
]%%

<h2>Bem-vindo à Conecta Telecom, %%=v(@NomeCliente)=%%! 🎉</h2>
<p>Seu plano Fibra 500 Mega foi ativado com sucesso!</p>
<p>Anexamos o guia de instalação do roteador para facilitar sua configuração.</p>
<p>Suporte técnico: (11) 4002-8922</p>
```

## Observações

- **Ativação obrigatória:** Essa função só funciona se o recurso de anexos AMPscript estiver habilitado na sua conta. Fale com seu Account Executive da Salesforce para ativar.
- **Limite de timeout:** Se o servidor remoto não responder à chamada `AttachFile` em **30 segundos**, o envio é reagendado para **15 minutos depois**.
- **Threshold de erros:** Você pode pedir ao seu Account Executive para ajustar o limite de erros que faz o job de envio parar prematuramente, evitando que um único erro interrompa toda a campanha.
- **Apenas dentro da mesma conta:** Só é possível anexar arquivos que pertencem à conta usada para enviar o e-mail. **Conteúdo compartilhado** do Content Builder ou Portfolio **não é suportado**.
- **Parâmetros "View on Web"** (boolViewOnWeb, viewOnWebLocation, viewOnWebFileName, viewOnWebDuration): estão disponíveis **somente** quando o `fileLocationType` é `"http"`. Não funcionam com `"ftp"` ou `"contentbuilder"`.
- **HTTPS:** A função suporta transmissão segura via HTTPS — e na prática, você quase sempre vai querer usar HTTPS.
- **Tamanho da URL:** O parâmetro `fileLocation` suporta no máximo **2088 caracteres**.
- **Content-Disposition:** Use o parâmetro `boolContentDispositionAttachment` como `true` para forçar o download do arquivo no cliente de e-mail (header `attachment`), ou `false` para exibição inline.
- **Contexto de uso:** Essa função funciona **apenas em e-mails**. Não faz sentido usá-la em CloudPages, SMS ou outros contextos.
- **Cuidado com o tamanho dos anexos:** Embora a documentação não especifique um limite de tamanho, lembre-se que e-mails com anexos muito grandes podem ser rejeitados por provedores de e-mail. Mantenha os anexos leves — geralmente abaixo de 5 MB é uma boa prática.

## Funções relacionadas

- [ContentBlockByKey](../content-functions/contentblockbykey.md) — referencia blocos de conteúdo no Content Builder pela external key
- [ContentBlockById](../content-functions/contentblockbyid.md) — referencia blocos de conteúdo no Content Builder pelo ID
- [ContentBlockByName](../content-functions/contentblockbyname.md) — referencia blocos de conteúdo no Content Builder pelo nome
- [HTTPGet](../http-functions/httpget.md) — faz requisições HTTP GET para buscar conteúdo de URLs externas
- [Concat](../string-functions/concat.md) — concatena strings, útil para montar URLs dinâmicas dos arquivos
- [AttributeValue](../utility-functions/attributevalue.md) — recupera valores de atributos do subscriber, útil para personalizar o caminho do arquivo
- [Lookup](../data-extension-functions/lookup.md) — busca dados em Data Extensions para montar caminhos dinâmicos de arquivos
- [RaiseError](../utility-functions/raiseerror.md) — útil para tratar erros quando o arquivo não pode ser anexado
- [GetPortfolioItem](../content-functions/getportfolioitem.md) — recupera itens do Portfolio (legado)
- [Image](../content-functions/image.md) — insere imagens no corpo do e-mail (alternativa para conteúdo visual inline)