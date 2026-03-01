---
title: Personalization Strings
sidebar_label: Personalization Strings
description: Referência completa de Personalization Strings do Salesforce Marketing Cloud com exemplos práticos para o contexto brasileiro.
sidebar_position: 6
---

# Personalization Strings


Personalization Strings são aqueles marcadores entre `%%` duplos que você joga no meio do HTML e o SFMC troca pelo valor real na hora do envio, por exemplo `%%FirstName%%` vira "Carlos". Existem dois sabores: as baseadas em atributo, que puxam dados do subscriber, de uma Data Extension ou do contato no Journey; e as de sistema, que trazem info do próprio envio, como data de disparo ou nome do Job.

Um detalhe que confunde muita gente: elas **não são** AMPscript, mas convivem bem juntas. Você pode usar uma Personalization String dentro de um `IF`, atribuir o valor dela a uma variável com `SET` ou passar como argumento em funções tranquilamente.

## Sintaxe

Quando você quer puxar um dado do subscriber direto no HTML, é só envolver o nome do atributo com dois sinais de porcentagem de cada lado, tipo %%emailaddr%%. Não importa se você escreve maiúsculo ou minúsculo — o SFMC entende igual. Agora, dentro de um bloco AMPscript %%[ ]%%, a história muda: você usa o nome do atributo sem os %%, porque o parser já está em modo de código e esses delimitadores extras causariam erro de sintaxe. Outro detalhe importante: se o nome do atributo tem espaço, hífen, parêntese ou qualquer caractere especial, você precisa colocar colchetes em volta, tipo [Nome Completo] ou [Data de Nascimento]. Sem isso, o sistema não vai reconhecer o campo corretamente.

**Uso inline no corpo do e-mail:**

```html
Olá, %%firstname%%! Identificamos uma novidade para o seu perfil.
```

**Dentro de um bloco AMPscript — sem os delimitadores `%%`:**

```ampscript
%%[
VAR @nomeCompleto, @plano
SET @nomeCompleto = [Nome Completo]
SET @plano        = PlanoAtual
]%%
```

**Passando uma string como argumento de função AMPscript:**

```ampscript
%%[
InsertDE("OndaNet_Acessos", "SubscriberKey", _subscriberkey, "DataAcesso", xtshortdate)
]%%
```


## Attribute Strings

Sabe quando você quer chamar o cliente pelo nome ou puxar qualquer dado específico dele no e-mail? É pra isso que servem as Attribute Strings. Basicamente, qualquer campo que esteja na sua Data Extension de envio ou no perfil do assinante lá no All Subscribers vira uma string de personalização — basta colocar o nome do campo entre `%%` e pronto. As fontes que alimentam essas strings são: atributos do perfil de assinante de e-mail, campos de Data Extensions enviáveis, atributos de entrada do Journey Builder, strings de dados do MobileConnect, strings de dados de contato do MobileConnect, atributos do MobilePush e fonte de entrada do Journey Builder. Detalhe importante: se o nome do campo tiver espaço ou caractere especial, você precisa envolver ele com colchetes dentro dos `%%`.

**Atributo de perfil com espaço — colchetes obrigatórios:**

```ampscript
%%[
/* Atributo de perfil: "Código Cliente" (tem espaço) */
SET @codigoCliente = [Código Cliente]

/* Campo de DE sem espaço: referência direta */
SET @segmento = SegmentoMarketing
]%%
```

**Referência inline no HTML — com e sem espaço no nome:**

```html
Seu código de cliente: %%Código Cliente%%
Segmento: %%SegmentoMarketing%%
```


## System Strings

Além das attribute strings, o Marketing Cloud disponibiliza uma coleção de strings baseadas no sistema — valores derivados do contexto do envio, do assinante ou da mensagem, sem depender de campos customizados.


### Email Date Strings

> **⚠️ Atenção:** Todas as strings de data refletem o horário do servidor da Salesforce (UTC do data center), não o fuso horário do assinante. O formato padrão é americano (inglês). Use funções AMPscript como `DatePart()` ou `FormatDate()` para adaptar.

| String | Descrição | Exemplo de Output |
|--------|-----------|-------------------|
| `xtmonth` | Nome por extenso do mês no momento do disparo do e-mail, em inglês | `March` |
| `xtmonthnumeric` | Número ordinal do mês (1–12) | `3` |
| `xtday` | Dia do mês no momento do disparo | `22` |
| `xtdayofweek` | Nome do dia da semana no momento do disparo, em inglês | `Saturday` |
| `xtyear` | Ano com quatro dígitos no momento do disparo | `2025` |
| `xtshortdate` | Data completa no formato americano resumido MM/DD/YYYY | `03/22/2025` |
| `xtlongdate` | Data por extenso no formato americano longo | `Saturday, March 22, 2025` |

**Registrar data de envio para controle de supressão (BioFresh Alimentos):**

```ampscript
%%[
InsertDE(
  "BioFresh_EnviosRegistrados",
  "SubscriberKey", _subscriberkey,
  "CampanhaID",    jobid,
  "DataDisparo",   xtshortdate
)
]%%
```

As Email Date Strings do SFMC (como `%%xtday%%`, `%%xtmonth%%`, `%%xtyear%%`) vêm em inglês e formato americano porque o sistema usa o locale padrão dos EUA. Na prática, se você manda e-mail pra assinantes brasileiros, o mês sai "June" em vez de "Junho", e a ordem da data fica mês/dia/ano — confuso pra quem lê no Brasil.

**Jeito 1 — montagem inline:** você combina as strings separadas direto no HTML pra forçar o formato brasileiro:

```html
Olá! Sua fatura OndaNet de %%xtmonth%% %%xtyear%% está disponível.
```

**Jeito 2 — AMPscript com FormatDate():** você usa `DatePart()` ou `FormatDate()` pra controlar o formato e o locale, gerando DD/MM/AAAA certinho:

```ampscript
%%[
SET @dataFormatada = FormatDate(Now(), "dd/MM/yyyy", "pt-BR")
]%%
Pedido registrado em: %%=v(@dataFormatada)=%%
```

O segundo jeito é mais confiável porque respeita o locale brasileiro de verdade, sem depender de concatenação manual.

### Email Data Strings

| String | Descrição | Exemplo de Output |
|--------|-----------|-------------------|
| `emailname_` | Nome dado ao e-mail no momento da criação no Content Builder | `Cobrança_Maio_2025` |
| `_emailid` | ID numérico gerado automaticamente pelo sistema para o e-mail | `98712` |
| `_messagecontext` | Indica o canal/contexto em que a mensagem está sendo renderizada. Possíveis valores: SEND, PREVIEW, VAWP, FTAF, LANDINGPAGE, VALIDATION, LINKRESOLUTION, SMS, SOCIAL | `SEND` |
| `_replycontent` | Corpo do e-mail de resposta recebido pelo assinante — disponível apenas em Triggered Sends com Reply Mail Management ativo | `(conteúdo do reply)` |
| `_IsTestSend` | Indica se o envio foi feito via botão "Test Send". Retorna a string "true" ou "false" — não é um booleano. | `false` |
| `jobid` | Identificador numérico único gerado para cada job de envio | `7834521` |
| `_JobSubscriberBatchID` | ID do lote associado ao envio em Triggered Sends. Vale 0 para envios convencionais em lista. | `1003` |
| `_PreHeader` | Texto de preheader configurado no e-mail. Funciona apenas via AttributeValue("_PreHeader") — não pode ser usado inline. | `Seu extrato chegou — confira agora` |
| `_DataSourceName` | Nome da lista, grupo, Data Extension ou filtro de envio. Retorna vazio quando o envio é feito para All Subscribers. | `Clientes_Ativos_SP` |
| `_listname` | Nome da lista de envio definido pelo usuário. Retorna vazio para envios em All Subscribers. | `Base_Premium_2025` |

**Exibir aviso de ambiente e rastrear o job em uma DE (SeguraFácil):**

```ampscript
%%[
IF _messagecontext == "PREVIEW" OR _IsTestSend == "true" THEN
]%%
<div style="background:#fff3cd;padding:8px;font-size:12px;">
  ⚠️ Ambiente de teste — jobid: %%jobid%%
</div>
%%[ ELSE ]%%
<p>Sua apólice SeguraFácil foi renovada. Confira os detalhes abaixo.</p>
%%[ ENDIF ]%%
```

Fica a dica pra você não perder tempo debugando bobeira no SFMC: a `_IsTestSend` devolve a **string** "true" ou "false", não booleano. Se você fizer `%%[IF _IsTestSend == true]%%`, vai quebrar silenciosamente. O certo é `%%[IF AttributeValue("_IsTestSend") == "true"]%%`. Outro tropeço clássico: `_PreHeader` não resolve inline com `%%_PreHeader%%` — você precisa obrigatoriamente usar `%%=AttributeValue("_PreHeader")=%%`. E pra saber se tá em preview ou envio real, consulte `_messagecontext`: retorna "PREVIEW" ou "SEND", útil pra testes na OndaNet Telecom, por exemplo.

### Subscriber Data Strings

| String | Descrição | Exemplo de Output |
|--------|-----------|-------------------|
| `emailaddr` | Endereço de e-mail cadastrado para o assinante | `ana.souza@email.com.br` |
| `firstname_ ou firstname` | Primeiro nome do assinante vindo do atributo de perfil "FirstName" — não vem de DEs de envio | `Ana` |
| `lastname_ ou lastname` | Sobrenome do assinante vindo do atributo de perfil "LastName" — não vem de DEs de envio | `Souza` |
| `subscriberid` | ID numérico gerado automaticamente pela plataforma para cada assinante | `4490231` |
| `_subscriberkey` | Chave única do assinante definida pela sua empresa — normalmente CPF, e-mail ou ID interno | `351.204.870-11` |
| `listid` | ID da lista associada ao assinante neste envio. Retorna o ID de All Subscribers quando não há lista específica. | `8821` |
| `list_` | Combinação do listid com o tipo de e-mail preferido (TEXT ou HTML) | `8821_HTML` |
| `listsubid` | Identificador único da relação entre o assinante e a lista | `5503918274` |
| `_messagetypepreference` | Tipo de e-mail preferido pelo assinante conforme configurado no registro — TEXT ou HTML | `HTML` |

Cuidado com uma pegadinha clássica: as strings **firstname_** e **lastname_** puxam dados do perfil no All Subscribers, não da Data Extension de envio. Se o nome que você precisa mora na DE, use `AttributeValue("NomeDoCampo")` — senão, vai aparecer em branco e você só descobre em produção. Outra boa prática: prefira **_subscriberkey** como chave de join em `Lookup()` e `LookupRows()`. E-mail muda, subscriber key não. Isso mantém seus cruzamentos entre DEs confiáveis. Veja o exemplo da Vênus Cosméticos:

```ampscript
%%[
SET @categoria = Lookup(
  "VenusClientes_Segmentos",
  "Categoria",
  "SubscriberKey", _subscriberkey
)
]%%
%%[IF @categoria == "Gold" THEN]%%
  <p>Acesso exclusivo Vênus Gold desbloqueado 🌟</p>
%%[ENDIF]%%
```

### Sender Data Strings

| String | Descrição | Exemplo de Output |
|--------|-----------|-------------------|
| `replyname` | Nome do remetente (From Name) configurado no Sender Profile ou no perfil do usuário que disparou o envio | `OndaNet Telecom` |
| `replyemailaddress` | Endereço de e-mail do remetente (From Address) definido no Sender Profile | `clientes@ondanet.com.br` |
| `memberid` | MID — identificador numérico da Business Unit que executou o envio | `9103847` |
| `member_busname` | Razão social ou nome comercial configurado nos dados da Business Unit | `OndaNet Serviços de Internet S.A.` |
| `member_addr` | Logradouro da empresa configurado na Business Unit | `Rua das Telecomunicações, 500` |
| `member_city` | Município configurado na Business Unit | `Curitiba` |
| `member_state` | Estado ou província configurado na Business Unit | `PR` |
| `member_postalcode` | CEP ou código postal configurado na Business Unit | `80010-020` |
| `member_country` | País configurado na Business Unit | `Brasil` |

**Rodapé legal com endereço da empresa (conformidade LGPD / CAN-SPAM):**

```html
<table width="100%" cellpadding="0" cellspacing="0">
  <tr>
    <td style="text-align:center;font-size:11px;color:#888;padding:16px 0;">
      %%member_busname%%<br>
      %%member_addr%% · %%member_city%% – %%member_state%% · %%member_postalcode%%<br>
      <a href="%%unsub_center_url%%">Cancelar assinatura</a>
    </td>
  </tr>
</table>
```

Quando várias Business Units compartilham o mesmo template de e-mail, as Sender Data Strings poupam você de criar blocos condicionais para cada marca. Se a OndaNet, a TechPrime e a Vênus Cosméticos usam o mesmo layout, cada BU injeta automaticamente seus próprios dados — nome, endereço, telefone — vindos de **Setup → Business Units → Account Information**, exibindo sempre as informações corretas sem nenhuma lógica extra.

### Email URL Data Strings

| String | Descrição | Exemplo de Output |
|--------|-----------|-------------------|
| `view_email_url` | Link para abrir o e-mail no navegador — geralmente colocado no topo do template | `https://view.s6.exacttarget.com/?qs=...` |
| `ftaf_url` | Link para o formulário de encaminhamento "Indique um amigo" | `https://view.s6.exacttarget.com/ftaf.aspx?qs=...` |
| `subscription_center_url` | Link para a Central de Assinaturas — o assinante escolhe de quais comunicações quer sair | `https://cl.s6.exct.net/subscription_center.aspx?qs=...` |
| `profile_center_url` | Link para o Centro de Perfil — o assinante atualiza seus dados e preferências | `https://cl.s6.exct.net/profile_center.aspx?qs=...` |
| `unsub_center_url` | Link de descadastro global — remove o assinante de todas as comunicações da Business Unit de uma vez | `https://cl.s6.exct.net/unsub_center.aspx?qs=...` |
| `double_opt_in_url` | Link de confirmação de double opt-in, quando essa funcionalidade está ativa na conta | `https://cl.exct.net/sub_confirm.asp?lst=8821&eml=...` |

**Rodapé completo com links de preferências (campanha de reengajamento BioFresh):**

```html
<p style="font-size:12px;text-align:center;color:#999;">
  <a href="%%view_email_url%%">Ver no navegador</a> &nbsp;·&nbsp;
  <a href="%%profile_center_url%%">Atualizar meus dados</a> &nbsp;·&nbsp;
  <a href="%%subscription_center_url%%">Gerenciar preferências</a> &nbsp;·&nbsp;
  <a href="%%unsub_center_url%%">Descadastrar</a>
</p>
```

Quando você usa `%%subscription_center_url%%`, o assinante cai numa página onde ele escolhe quais tipos de comunicação quer continuar recebendo — por exemplo, a OndaNet Telecom pode deixar o cara sair só dos e-mails promocionais, mas manter os de fatura. Já `%%unsub_center_url%%` é radical: o contato vira Unsubscribed na Business Unit inteira e não recebe mais nada daquela BU, sem meio-termo.

### Reply Mail Management Strings

O RMM é o recurso do SFMC que intercepta respostas dos assinantes antes de caírem numa caixa de entrada comum. Você configura isso no Sender Profile, escolhendo "Forward using triggered send" ou "Reply using triggered send", vinculando a um Triggered Send que processa cada reply automaticamente.

As strings de RMM extraem dados do e-mail de resposta — remetente, assunto, conteúdo — e disponibilizam tudo via AMPscript dentro do Triggered Send. Com isso, dá pra enviar uma confirmação automática ao assinante com o resumo do que ele respondeu, encaminhar o reply pra um e-mail interno da **OndaNet Telecom** com contexto completo do envio original, limpar a thread removendo o corpo do e-mail anterior, gravar o conteúdo numa Data Extension pra histórico, criar Tasks ou Activities no Salesforce CRM a partir da resposta e detectar palavras-chave no reply pra disparar automações condicionais.

Vale destacar: a string `_replycontent`, na seção Email Data Strings, retorna o corpo completo da resposta recebida.

### MobileConnect Data Strings

> No MobileConnect, mensagens MO (Mobile Originated — enviadas pelo cliente) seguem o padrão **verbo + substantivos**. O verbo é sempre a primeira palavra (a keyword cadastrada). Tudo que vem depois são substantivos, acessíveis por índice. Exemplo: em `AGENDAMENTO 2025-04-10 14h`, o verbo é `AGENDAMENTO` e `MSG(0).NOUN(0)` retorna `2025-04-10`.

| String | Descrição | Exemplo de Output |
|--------|-----------|-------------------|
| `MOBILE_NUMBER` | Número de celular do contato com DDI e DDD | `5541988001122` |
| `SHORT_CODE` | Short code ou long code associado ao envio | `40032 (short) ou 554140032000 (long)` |
| `MSG(0)` | Conteúdo integral da mensagem MO recebida | `AGENDAMENTO 2025-04-10 14h` |
| `MSG(0).VERB` | Primeira palavra da mensagem MO — a keyword que acionou o fluxo | `AGENDAMENTO` |
| `MSG(0).NOUNS` | Tudo que segue o verbo na mensagem MO | `2025-04-10 14h` |
| `MSG(0).NOUN([n])` | Acessa um substantivo específico pelo índice zero-based (0 = primeiro, 1 = segundo, e assim por diante) | `MSG(0).NOUN(0) = 2025-04-10` |
| `MMS_CONTENT_URL([n])` | URL do conteúdo MMS anexado à mensagem MO recebida. Índice zero-based; 0 indica o primeiro arquivo da mensagem. | `https://exacttarget.com/mms.aspx?qs=...` |

**Confirmação de agendamento por SMS (SeguraFácil):**

```ampscript
%%[
SET @data    = MSG(0).NOUN(0)
SET @horario = MSG(0).NOUN(1)
SET @cpf     = Lookup("SeguraFacil_Clientes", "CPF", "Celular", MOBILE_NUMBER)

InsertDE(
  "SeguraFacil_Agendamentos",
  "CPF",      @cpf,
  "Data",     @data,
  "Horario",  @horario,
  "Celular",  MOBILE_NUMBER
)
]%%
Agendamento confirmado para %%=v(@data)=%% às %%=v(@horario)=%%. Até lá! 🗓️
```

Esse código captura o SMS do cliente da SeguraFácil, extrai a data e o horário enviados e registra o agendamento automaticamente no sistema.

### MobileConnect Contact Data Strings

> **⚠️ Atenção:** Os valores retornados por `_CarrierID` são conhecidamente inconsistentes e podem não refletir a operadora real do contato. Não tome decisões de negócio com base nesse campo.

| String | Descrição | Exemplo de Output |
|--------|-----------|-------------------|
| `_CarrierID` | ID numérico da operadora de telefonia — valores podem ser imprecisos ⚠️ | `7` |
| `_Channel` | Canal de comunicação utilizado | `Mobile` |
| `_City` | Cidade associada ao contato mobile | `Curitiba` |
| `_ContactID` | ID do contato no Contact Builder do SFMC | `28830192` |
| `_CountryCode` | Código do país do contato no formato ISO 3166-1 alpha-2 | `BR` |
| `_CreatedBy` | ID interno da entidade que criou o registro do contato | `9023441` |
| `_CreatedDate` | Data e hora de criação do registro do contato | `2024-08-14 09:15` |
| `_FirstName` | Primeiro nome do contato mobile | `Carlos` |
| `_IsHonorDST` | Indica se o fuso horário do contato respeita o horário de verão | `True` |
| `_LastName` | Sobrenome do contato mobile | `Andrade` |
| `_MobileNumber` | Número de celular completo com DDI | `5541988001122` |
| `_ModifiedBy` | ID da entidade que realizou a última alteração no registro | `9023441` |
| `_ModifiedDate` | Data e hora da última modificação no registro do contato | `2025-01-30 11:42` |
| `_Priority` | Nível de prioridade de entrega para este contato | `1` |
| `_Source` | Origem do cadastro do contato | `SMS Opt-in Web` |
| `_SourceObjectID` | ID interno da fonte de origem do cadastro | `5` |
| `_State` | UF associada ao contato | `PR` |
| `_Status` | Status de envio: -1 Unspecified · 1 Active · 2 Bounced · 3 Held · 4 Unsubscribed | `1` |
| `_UTCOffset` | Diferença em horas entre o fuso do contato e o UTC | `-3` |
| `_ZipCode` | CEP associado ao contato | `80010-020` |


### GroupConnect Data Strings

> Essas strings são exclusivas do canal **GroupConnect (LINE)** e não funcionam em e-mail, SMS ou outros canais do SFMC.

| String | Descrição | Exemplo de Output |
|--------|-----------|-------------------|
| `LINE_ADDRESS_ID` | Identificador único do usuário na plataforma LINE | `carlos.andrade.line` |
| `LINE_JOB_ID` | Identificador único do job de envio no LINE | `k882bcfd71294ac9f2e8b339d612ca1f` |
| `LINE_SUBSCRIBER_ID` | ID do assinante correspondente no Marketing Cloud | `3341092` |
| `TEXT` | Conteúdo integral da mensagem recebida no LINE | `CUPOM BIOFRESCO20` |
| `VERB` | Primeira palavra da mensagem — a keyword. Equivalente ao MSG(0).VERB do MobileConnect. | `CUPOM` |
| `TEXT.NOUN` | Tudo que vem após a keyword. Equivalente ao MSG(0).NOUNS do MobileConnect. | `BIOFRESCO20` |
| `TEXT.NOUN([n])` | Acessa um substantivo específico por índice zero-based | `TEXT.NOUN(0) = BIOFRESCO20` |
| `STKR.STKPKGID` | ID do pacote de stickers — presente quando a mensagem MO contém um sticker | `5001` |
| `STKR.STKID` | ID do sticker específico dentro do pacote | `10023` |
| `STKR.STKTXT` | Texto descritivo associado ao sticker | `thumbsup` |


### Website Data Strings

> Strings exclusivas de **landing pages, microsites e CloudPages**. Não funcionam em e-mails ou mensagens mobile.

| String | Descrição | Exemplo de Output |
|--------|-----------|-------------------|
| `PAGEURL` | URL completa da CloudPage atual, incluindo todos os parâmetros de query string | `https://pub.s1.exacttarget.com/5gk2ab?sk=351.204.870-11&origem=email` |
| `microsite_base_url[default]ID[/default]` | ⚠️ LEGADO — URL de landing page clássica (microsites antigos). Substitua ID pelo identificador da página. Não funciona em CloudPages modernas. | `https://pub.s1.exacttarget.com/page.aspx?qs=...` |

Quando você monta uma CloudPage na **OndaNet Telecom**, duas data strings fazem diferença: **PAGEURL** retorna a URL completa da página, perfeita pra gerar um QR code ou link de compartilhamento ali mesmo. Já **RequestParameter("nomeDoParametro")** captura valores específicos da query string — tipo o `_subscriberkey` que veio no link do e-mail. Agora, **microsite_base_url** é legado total, não funciona em CloudPages; pode ignorar sem dó.

### Email Analytics Strings

| String | Descrição | Exemplo de Output |
|--------|-----------|-------------------|
| `linkname` | Alias do link clicado, definido via atributo `alias` na tag `<a>`. Se não configurado, retorna a URL completa. Requer conector de web analytics ativo. | `CTA_VerExtrato` |
| `_ImpressionRegionID` | ID numérico da Impression Region que está ativa no momento da renderização. Retorna 0 se nenhuma estiver ativa. | `3` |
| `_ImpressionRegionName` | Nome da Impression Region ativa conforme definido no e-mail. | `oferta_destaque` |
| `AdditionalInfo_` | Valor do campo "Additional Info" preenchido no painel de envio. Anexado automaticamente a todos os links como parâmetro de URL. Requer Parameter Manager. | `blackfriday2025` |
| `__AdditionalEmailAttribute1` | Primeiro campo de Additional Email Attributes do envio. Até 5 atributos disponíveis (n de 1 a 5). Requer Parameter Manager. | `norte` |
| `__AdditionalEmailAttribute2` | Segundo campo de Additional Email Attributes | `cliente_ouro` |
| `__AdditionalEmailAttribute3` | Terceiro campo de Additional Email Attributes | `—` |
| `__AdditionalEmailAttribute4` | Quarto campo de Additional Email Attributes | `—` |
| `__AdditionalEmailAttribute5` | Quinto campo de Additional Email Attributes | `—` |

**Marcando links com alias para tracking granular (TechPrime):**

```html
<a href="https://techprime.com.br/ofertas/notebook" alias="CTA_Notebook_Topo">
  Ver notebooks em oferta
</a>

<a href="https://techprime.com.br/ofertas/monitor" alias="CTA_Monitor_Meio">
  Ver monitores
</a>
```

Quando você adiciona o atributo `alias` diretamente na tag `<a>` com um valor fixo, tipo `alias="cta_promo"`, o tracking do SFMC registra certinho esse nome na coluna linkname. Agora, se você monta o alias dinamicamente — usando `Concat()`, SSJS ou Personalization Strings dentro da própria tag — esquece: o SFMC ignora e exibe a URL completa no lugar.

### Einstein Email Data Strings

> Diferente das demais Personalization Strings, as strings Einstein se comportam como funções — o valor retornado depende dos argumentos embutidos no próprio nome da string. Elas só funcionam dentro de blocos de recomendação do Einstein Email.

| String | Descrição | Exemplo de Output |
|--------|-----------|-------------------|
| `ImageLink` | URL da imagem mapeada no campo "Image URL" do catálogo de produtos | `https://biofresco.com.br/img/granola-fit-500g.jpg` |
| `ProductName` | Nome do produto mapeado no campo "Product" do catálogo | `Granola Fit 500g` |
| `Description` | Descrição do produto mapeada no campo "Product Description" do catálogo | `Granola artesanal sem açúcar com castanhas e frutas.` |
| `RegularPrice` | Preço cheio do produto, mapeado no campo "Regular Price" do catálogo | `34.90` |
| `SalePrice` | Preço promocional do produto, mapeado no campo "Sale Price" do catálogo | `27.90` |
| `RegularPriceMain` | Parte inteira do preço cheio — útil para montar layouts de preço com cents estilizados | `34` |
| `SalePriceMain` | Parte inteira do preço promocional | `27` |
| `RegularPriceFractional` | Parte decimal do preço cheio (dois dígitos após a vírgula) | `90` |
| `SalePriceFractional` | Parte decimal do preço promocional | `90` |
| `ToFloat` | Converte um campo texto do catálogo para número de ponto flutuante | `27.90` |
| `[a]LongestWordLength` | Retorna o número de caracteres da palavra mais longa no atributo [a]. Ex: %%DescriptionLongestWordLength%% | `Para "Granola artesanal": 9` |
| `[a]LengthNum` | Retorna o total de caracteres do atributo [a]. Ex: %%ProductNameLengthNum%% | `Para "Granola Fit 500g": 17` |
| `First[n]` | Retorna os primeiros [n] caracteres de um campo. Ex: %%SKUFirst6%% retorna os 6 primeiros chars do campo SKU | `GRN-FT` |
| `Split[d]At[i]` | Divide o valor pelo delimitador [d] e retorna o item no índice [i] (zero-based). Delimitador pode ter mais de um caractere; índice pode ser negativo. | `Para "500g;1kg;2kg": %%Split;At1%% → 1kg` |
| `[a]Replace[r]With[w]End` | Substitui globalmente a string [r] por [w] no atributo [a]. Ex: %%NomeReplaceFitWithSaudávelEnd%% | `Granola Saudável 500g` |
| `[a]UpTo[n]By[d]With[o]End` | Trunca o atributo [a] até [n] caracteres usando [d] como delimitador de corte e adiciona [o] ao final. Retorna vazio se o valor não contiver o delimitador dentro do limite. | `Para "Granola;Fit;Bio;Sem Açúcar": %%NomeUpTo15By;With...End%% → Granola;Fit...` |

As Einstein Email Data Strings do SFMC se destacam porque funcionam como funções parametrizadas embutidas no próprio nome, ao contrário das demais strings de personalização, que simplesmente devolvem um valor fixo. Melhor ainda: você pode encadear várias delas numa única expressão, aplicando transformações em sequência, tipo truncar, substituir e converter pra maiúsculas — tudo de uma vez só.