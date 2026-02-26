---
title: Índice de Funções
sidebar_label: Índice de Funções
description: Lista completa de todas as funções AMPscript organizadas por categoria.
sidebar_position: 1
---

# Índice de Funções

Lista completa das funções AMPscript disponíveis no Salesforce Marketing Cloud, organizadas por categoria.

## Funções de String

| Função | Descrição |
|--------|-----------|
| [Char](./string-functions/char.md) | Retorna o caractere correspondente a um código ASCII |
| [Concat](./string-functions/concat.md) | Concatena duas ou mais strings |
| [Domain](./string-functions/domain.md) | Extrai o domínio de um endereço de e-mail |
| [Format](./string-functions/format.md) | Formata um valor usando uma máscara |
| [FormatCurrency](./string-functions/formatcurrency.md) | Formata um número como moeda |
| [FormatNumber](./string-functions/formatnumber.md) | Formata um número com casas decimais e separadores |
| [IndexOf](./string-functions/indexof.md) | Retorna a posição de uma substring dentro de uma string |
| [Length](./string-functions/length.md) | Retorna o número de caracteres de uma string |
| [Lowercase](./string-functions/lowercase.md) | Converte uma string para letras minúsculas |
| [ProperCase](./string-functions/propercase.md) | Converte a primeira letra de cada palavra para maiúscula |
| [RegExMatch](./string-functions/regexmatch.md) | Verifica se uma string corresponde a uma expressão regular |
| [RegExReplace](./string-functions/regexreplace.md) | Substitui correspondências de uma regex por outra string |
| [Replace](./string-functions/replace.md) | Substitui ocorrências de uma substring por outra |
| [ReplaceList](./string-functions/replacelist.md) | Substitui múltiplos valores em uma string |
| [StringToHex](./string-functions/stringtohex.md) | Converte uma string para representação hexadecimal |
| [Substring](./string-functions/substring.md) | Extrai uma parte de uma string por posição e tamanho |
| [Trim](./string-functions/trim.md) | Remove espaços no início e no fim de uma string |
| [TrimLeft](./string-functions/trimleft.md) | Remove espaços no início de uma string |
| [TrimRight](./string-functions/trimright.md) | Remove espaços no fim de uma string |
| [URLEncode](./string-functions/urlencode.md) | Codifica uma string para uso em URLs |
| [Uppercase](./string-functions/uppercase.md) | Converte uma string para letras maiúsculas |
| [WrapText](./string-functions/wraptext.md) | Quebra um texto em linhas com tamanho máximo definido |

## Funções Matemáticas

| Função | Descrição |
|--------|-----------|
| [Abs](./math-functions/abs.md) | Retorna o valor absoluto de um número |
| [Add](./math-functions/add.md) | Soma dois números |
| [Ceiling](./math-functions/ceiling.md) | Arredonda um número para cima |
| [Divide](./math-functions/divide.md) | Divide dois números |
| [Floor](./math-functions/floor.md) | Arredonda um número para baixo |
| [Max](./math-functions/max.md) | Retorna o maior valor entre dois números |
| [Min](./math-functions/min.md) | Retorna o menor valor entre dois números |
| [Mod](./math-functions/mod.md) | Retorna o resto da divisão entre dois números |
| [Multiply](./math-functions/multiply.md) | Multiplica dois números |
| [Power](./math-functions/power.md) | Eleva um número a uma potência |
| [Random](./math-functions/random.md) | Gera um número aleatório dentro de um intervalo |
| [Round](./math-functions/round.md) | Arredonda um número para um número de casas decimais |
| [Sqrt](./math-functions/sqrt.md) | Retorna a raiz quadrada de um número |
| [Subtract](./math-functions/subtract.md) | Subtrai dois números |

## Funções de Data

| Função | Descrição |
|--------|-----------|
| [DateAdd](./date-functions/dateadd.md) | Adiciona ou subtrai um intervalo de tempo a uma data |
| [DateDiff](./date-functions/datediff.md) | Retorna a diferença entre duas datas |
| [DateParse](./date-functions/dateparse.md) | Converte uma string em um objeto de data |
| [DatePart](./date-functions/datepart.md) | Extrai uma parte específica de uma data |
| [FormatDate](./date-functions/formatdate.md) | Formata uma data usando uma máscara |
| [GetSendTime](./date-functions/getsendtime.md) | Retorna a data e hora programadas do envio |
| [LocalDateToSystemDate](./date-functions/localdatetosystemdate.md) | Converte data local para data do sistema |
| [Now](./date-functions/now.md) | Retorna a data e hora atual em UTC |
| [StringToDate](./date-functions/stringtodate.md) | Converte uma string para um objeto de data |
| [SystemDate](./date-functions/systemdate.md) | Retorna a data atual do servidor |
| [SystemDateToLocalDate](./date-functions/systemdatetolocaldate.md) | Converte data do sistema para data local |

## Funções Utilitárias

| Função | Descrição |
|--------|-----------|
| [AttributeValue](./utility-functions/attributevalue.md) | Retorna o valor de um atributo do subscriber ou campo da DE |
| [Empty](./utility-functions/empty.md) | Verifica se um valor está vazio ou nulo |
| [GUID](./utility-functions/guid.md) | Gera um identificador único universal |
| [IIF](./utility-functions/iif.md) | Retorna um de dois valores com base em uma condição |
| [IsEmailAddress](./utility-functions/isemailaddress.md) | Verifica se uma string é um endereço de e-mail válido |
| [IsNull](./utility-functions/isnull.md) | Verifica se um valor é nulo |
| [IsNullDefault](./utility-functions/isnulldefault.md) | Retorna um valor padrão se o valor for nulo |
| [IsPhoneNumber](./utility-functions/isphonenumber.md) | Verifica se uma string é um número de telefone válido |
| [Output](./utility-functions/output.md) | Exibe o resultado de uma função AMPscript |
| [OutputLine](./utility-functions/outputline.md) | Exibe o resultado de uma função com quebra de linha |
| [RaiseError](./utility-functions/raiseerror.md) | Gera um erro personalizado |
| [ToString](./utility-functions/tostring.md) | Converte um valor para string |
| [TreatAsContent](./utility-functions/treatascontent.md) | Processa uma string como conteúdo AMPscript |
| [V](./utility-functions/v.md) | Exibe o valor de uma variável inline |

## Funções de Criptografia

| Função | Descrição |
|--------|-----------|
| [Base64Decode](./encryption-functions/base64decode.md) | Decodifica uma string em Base64 |
| [Base64Encode](./encryption-functions/base64encode.md) | Codifica uma string em Base64 |
| [DecryptSymmetric](./encryption-functions/decryptsymmetric.md) | Descriptografa um valor usando criptografia simétrica |
| [EncryptSymmetric](./encryption-functions/encryptsymmetric.md) | Criptografa um valor usando criptografia simétrica |
| [GetJwt](./encryption-functions/getjwt.md) | Gera um JSON Web Token |
| [GetJwtByKeyName](./encryption-functions/getjwtbykeyname.md) | Gera um JWT usando uma chave pelo nome |
| [MD5](./encryption-functions/md5.md) | Gera um hash MD5 de uma string |
| [SHA1](./encryption-functions/sha1.md) | Gera um hash SHA-1 de uma string |
| [SHA256](./encryption-functions/sha256.md) | Gera um hash SHA-256 de uma string |
| [SHA512](./encryption-functions/sha512.md) | Gera um hash SHA-512 de uma string |

## Funções de Data Extension

| Função | Descrição |
|--------|-----------|
| [ClaimRow](./data-extension-functions/claimrow.md) | Reivindica exclusivamente uma linha de uma DE |
| [ClaimRowValue](./data-extension-functions/claimrowvalue.md) | Reivindica e retorna o valor de um campo de uma linha |
| [DataExtensionRowCount](./data-extension-functions/dataextensionrowcount.md) | Retorna o número de linhas de uma DE |
| [DeleteData](./data-extension-functions/deletedata.md) | Remove registros de uma DE usando critérios |
| [DeleteDE](./data-extension-functions/deletede.md) | Remove um registro de uma DE |
| [ExecuteFilter](./data-extension-functions/executefilter.md) | Executa um filtro salvo em uma DE |
| [ExecuteFilterOrderedRows](./data-extension-functions/executefilterorderedrows.md) | Executa um filtro salvo e retorna linhas ordenadas |
| [Field](./data-extension-functions/field.md) | Retorna o valor de um campo de uma linha de rowset |
| [InsertData](./data-extension-functions/insertdata.md) | Insere um registro em uma DE usando critérios |
| [InsertDE](./data-extension-functions/insertde.md) | Insere um registro em uma DE |
| [Lookup](./data-extension-functions/lookup.md) | Retorna um único valor de uma DE |
| [LookupOrderedRows](./data-extension-functions/lookuporderedrows.md) | Retorna linhas de uma DE em ordem específica |
| [LookupOrderedRowsCS](./data-extension-functions/lookuporderedrowscs.md) | Retorna linhas ordenadas com comparação case-sensitive |
| [LookupRows](./data-extension-functions/lookuprows.md) | Retorna múltiplas linhas de uma DE |
| [LookupRowsCS](./data-extension-functions/lookuprowscs.md) | Retorna múltiplas linhas com comparação case-sensitive |
| [Row](./data-extension-functions/row.md) | Retorna uma linha específica de um rowset |
| [RowCount](./data-extension-functions/rowcount.md) | Retorna o número de linhas de um rowset |
| [UpdateData](./data-extension-functions/updatedata.md) | Atualiza registros em uma DE usando critérios |
| [UpdateDE](./data-extension-functions/updatede.md) | Atualiza um registro em uma DE |
| [UpsertData](./data-extension-functions/upsertdata.md) | Insere ou atualiza registros em uma DE |
| [UpsertDE](./data-extension-functions/upsertde.md) | Insere ou atualiza um registro em uma DE |

## Funções de Conteúdo

| Função | Descrição |
|--------|-----------|
| [AttachFile](./content-functions/attachfile.md) | Anexa um arquivo a um e-mail |
| [BarcodeUrl](./content-functions/barcodeurl.md) | Gera a URL de uma imagem de código de barras |
| [BeginImpressionRegion](./content-functions/beginimpressionregion.md) | Marca o início de uma região de impressão |
| [BuildOptionList](./content-functions/buildoptionlist.md) | Cria uma lista de opções HTML a partir de um rowset |
| [BuildRowsetFromJson](./content-functions/buildrowsetfromjson.md) | Converte uma string JSON em um rowset |
| [BuildRowsetFromString](./content-functions/buildrowsetfromstring.md) | Converte uma string delimitada em um rowset |
| [BuildRowsetFromXml](./content-functions/buildrowsetfromxml.md) | Converte uma string XML em um rowset |
| [ContentArea](./content-functions/contentarea.md) | Retorna o conteúdo de uma Content Area por ID |
| [ContentAreaByName](./content-functions/contentareabyname.md) | Retorna o conteúdo de uma Content Area pelo nome |
| [ContentBlockById](./content-functions/contentblockbyid.md) | Insere um Content Block por ID |
| [ContentBlockByKey](./content-functions/contentblockbykey.md) | Insere um Content Block pela chave |
| [ContentBlockByName](./content-functions/contentblockbyname.md) | Insere um Content Block pelo nome |
| [EndImpressionRegion](./content-functions/endimpressionregion.md) | Marca o fim de uma região de impressão |
| [GetPortfolioItem](./content-functions/getportfolioitem.md) | Retorna a URL de um item do Portfolio |
| [Image](./content-functions/image.md) | Insere uma imagem do Portfolio |
| [ImageById](./content-functions/imagebyid.md) | Insere uma imagem do Portfolio por ID |
| [ImageByKey](./content-functions/imagebykey.md) | Insere uma imagem do Portfolio pela chave |
| [TreatAsContentArea](./content-functions/treatascontentarea.md) | Processa uma string como Content Area |
| [WAT](./content-functions/wat.md) | Web Analytics Tracking — adiciona rastreamento a uma URL |

## Funções HTTP

| Função | Descrição |
|--------|-----------|
| [HTTPGet](./http-functions/httpget.md) | Realiza uma requisição HTTP GET |
| [HTTPPost](./http-functions/httppost.md) | Realiza uma requisição HTTP POST |
| [HTTPPost2](./http-functions/httppost2.md) | Realiza um HTTP POST com suporte a cabeçalhos personalizados |
| [IsChtmlBrowser](./http-functions/ischtmlbrowser.md) | Verifica se o cliente é um browser CHTML |
| [RedirectTo](./http-functions/redirectto.md) | Redireciona para uma URL |
| [RequestHeader](./http-functions/requestheader.md) | Retorna o valor de um cabeçalho HTTP da requisição |
| [WrapLongURL](./http-functions/wraplongurl.md) | Encurta uma URL longa para uso em e-mails |

## Funções de Sites

| Função | Descrição |
|--------|-----------|
| [AuthenticatedEmployeeId](./sites-functions/authenticatedemployeeid.md) | Retorna o ID do funcionário autenticado |
| [AuthenticatedEmployeeNotificationAddress](./sites-functions/authenticatedemployeenotificationaddress.md) | Retorna o e-mail de notificação do funcionário autenticado |
| [AuthenticatedEmployeeUserName](./sites-functions/authenticatedemployeeusername.md) | Retorna o nome de usuário do funcionário autenticado |
| [AuthenticatedEnterpriseID](./sites-functions/authenticatedenterpriseid.md) | Retorna o ID da empresa autenticada |
| [AuthenticatedMemberID](./sites-functions/authenticatedmemberid.md) | Retorna o ID do membro autenticado |
| [AuthenticatedMemberName](./sites-functions/authenticatedmembername.md) | Retorna o nome do membro autenticado |
| [CloudPagesURL](./sites-functions/cloudpagesurl.md) | Gera a URL de uma CloudPage com parâmetros |
| [LiveContentMicrositeURL](./sites-functions/livecontentmicrositeurl.md) | Retorna a URL de um microsite de conteúdo ao vivo |
| [MicrositeURL](./sites-functions/micrositeurl.md) | Retorna a URL de um microsite |
| [QueryParameter](./sites-functions/queryparameter.md) | Retorna o valor de um parâmetro da query string |
| [Redirect](./sites-functions/redirect.md) | Redireciona para uma URL em CloudPages |
| [RequestParameter](./sites-functions/requestparameter.md) | Retorna o valor de um parâmetro da requisição |

## Funções Sociais

| Função | Descrição |
|--------|-----------|
| [GetPublishedSocialContent](./social-functions/getpublishedsocialcontent.md) | Retorna conteúdo publicado em redes sociais |
| [GetSocialPublishUrl](./social-functions/getsocialpublishurl.md) | Retorna a URL de publicação social |
| [GetSocialPublishUrlByName](./social-functions/getsocialpublishurlbyname.md) | Retorna a URL de publicação social pelo nome |

## Funções SMS

| Função | Descrição |
|--------|-----------|
| [CreateSmsConversation](./sms-functions/createsmsconversation.md) | Inicia uma conversa SMS |
| [EndSmsConversation](./sms-functions/endsmsconversation.md) | Encerra uma conversa SMS |
| [SetSmsConversationNextKeyword](./sms-functions/setsmsconversationnextkeyword.md) | Define a próxima palavra-chave esperada em uma conversa SMS |

## Funções de Contatos

| Função | Descrição |
|--------|-----------|
| [UpsertContact](./contacts-functions/upsertcontact.md) | Insere ou atualiza um contato no Contact Builder |

## Funções Salesforce

| Função | Descrição |
|--------|-----------|
| [CreateSalesforceObject](./salesforce-functions/createsalesforceobject.md) | Cria um registro no Salesforce CRM |
| [LongSfid](./salesforce-functions/longsfid.md) | Converte um ID Salesforce curto para o formato longo de 18 caracteres |
| [RetrieveSalesforceJobSources](./salesforce-functions/retrievesalesforcejobsources.md) | Retorna as fontes de um job do Salesforce |
| [RetrieveSalesforceObjects](./salesforce-functions/retrievesalesforceobjects.md) | Retorna registros do Salesforce CRM |
| [UpdateSingleSalesforceObject](./salesforce-functions/updatesinglesalesforceobject.md) | Atualiza um único registro no Salesforce CRM |

## Microsoft Dynamics CRM

| Função | Descrição |
|--------|-----------|
| [AddMscrmListMember](./microsoft-dynamics-crm-functions/addmscrmlistmember.md) | Adiciona um membro a uma lista do Dynamics CRM |
| [CreateMscrmRecord](./microsoft-dynamics-crm-functions/createmscrmrecord.md) | Cria um registro no Dynamics CRM |
| [DescribeMscrmEntities](./microsoft-dynamics-crm-functions/describemscrmentities.md) | Retorna a lista de entidades do Dynamics CRM |
| [DescribeMscrmEntityAttributes](./microsoft-dynamics-crm-functions/describemscrmentityattributes.md) | Retorna os atributos de uma entidade do Dynamics CRM |
| [RetrieveMscrmRecords](./microsoft-dynamics-crm-functions/retrievemscrmrecords.md) | Retorna registros do Dynamics CRM |
| [RetrieveMscrmRecordsFetchXml](./microsoft-dynamics-crm-functions/retrievemscrmrecordsfetchxml.md) | Retorna registros do Dynamics CRM usando FetchXML |
| [SetStateMscrmRecord](./microsoft-dynamics-crm-functions/setstatemscrmrecord.md) | Altera o estado de um registro no Dynamics CRM |
| [UpdateMscrmRecords](./microsoft-dynamics-crm-functions/updatemscrmrecords.md) | Atualiza registros no Dynamics CRM |
| [UpsertMscrmRecord](./microsoft-dynamics-crm-functions/upsertmscrmrecord.md) | Insere ou atualiza um registro no Dynamics CRM |

## Funções de API

| Função | Descrição |
|--------|-----------|
| [AddObjectArrayItem](./api-functions/addobjectarrayitem.md) | Adiciona um item a um array de objeto da API |
| [CreateObject](./api-functions/createobject.md) | Cria um objeto para uso com a API SOAP |
| [InvokeCreate](./api-functions/invokecreate.md) | Executa uma operação Create via API SOAP |
| [InvokeDelete](./api-functions/invokedelete.md) | Executa uma operação Delete via API SOAP |
| [InvokeExecute](./api-functions/invokeexecute.md) | Executa uma operação Execute via API SOAP |
| [InvokePerform](./api-functions/invokeperform.md) | Executa uma operação Perform via API SOAP |
| [InvokeRetrieve](./api-functions/invokeretrieve.md) | Executa uma operação Retrieve via API SOAP |
| [InvokeUpdate](./api-functions/invokeupdate.md) | Executa uma operação Update via API SOAP |
| [SetObjectProperty](./api-functions/setobjectproperty.md) | Define uma propriedade em um objeto da API |