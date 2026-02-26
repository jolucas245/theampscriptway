---
title: RetrieveMscrmRecordsFetchXml
sidebar_label: RetrieveMscrmRecordsFetchXml
description: Retorna registros do Microsoft Dynamics CRM utilizando uma consulta Fetch XML personalizada.
---

# RetrieveMscrmRecordsFetchXml

## Descrição

A função `RetrieveMscrmRecordsFetchXml` permite buscar registros do Microsoft Dynamics CRM usando uma consulta Fetch XML. Isso te dá bastante flexibilidade, porque o Fetch XML é a linguagem de consulta nativa do Dynamics CRM — você consegue montar filtros complexos, junções entre entidades e selecionar exatamente os atributos que precisa. A função retorna um rowset (conjunto de linhas) que você pode percorrer usando [Row](../data-extension-functions/row.md), [RowCount](../data-extension-functions/rowcount.md) e [Field](../data-extension-functions/field.md), da mesma forma que faz com dados de Data Extensions.

## Sintaxe

```ampscript
RetrieveMscrmRecordsFetchXml(fetchXmlQuery)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|----------------|-----------|---------------|----------------|
| fetchXmlQuery | String | Sim | Uma consulta Fetch XML válida do Microsoft Dynamics CRM. Define quais entidades, atributos e filtros serão usados na busca. |

## Exemplo básico

Neste exemplo, buscamos os dados de um contato no Dynamics CRM usando a SubscriberKey do assinante atual para localizar o registro correspondente.

```ampscript
%%[

SET @SubKey = _subscriberkey

SET @FetchXML = Concat(
  '<fetch mapping="logical" count="1">',
    '<entity name="contact">',
      '<attribute name="contactid"/>',
      '<attribute name="emailaddress1"/>',
      '<attribute name="firstname"/>',
      '<attribute name="lastname"/>',
      '<filter>',
        '<condition attribute="emailaddress1" operator="eq" value="', @SubKey, '"/>',
      '</filter>',
    '</entity>',
  '</fetch>'
)

SET @RowSet_All = RetrieveMscrmRecordsFetchXml(@FetchXML)

IF RowCount(@RowSet_All) >= 1 THEN
  SET @RowSet = Row(@RowSet_All, 1)
  SET @contactid = Field(@RowSet, 'contactid', 0)
  SET @emailaddress = Field(@RowSet, 'emailaddress1', 0)
  SET @firstname = Field(@RowSet, 'firstname', 0)
  SET @lastname = Field(@RowSet, 'lastname', 0)
ENDIF

]%%

Olá, %%=v(@firstname)=%% %%=v(@lastname)=%%!
```

**Saída:**
```
Olá, João Silva!
```

## Exemplo avançado

Aqui temos um cenário mais real: a Conecta Telecom quer enviar um e-mail de campanha de Dia das Mães com uma oferta personalizada. A ideia é buscar o contato no Dynamics CRM, verificar o plano atual do cliente e personalizar a mensagem com base nisso.

```ampscript
%%[

SET @SubKey = _subscriberkey

/* Busca dados do contato e o plano associado no Dynamics CRM */
SET @FetchXML = Concat(
  '<fetch mapping="logical" count="1">',
    '<entity name="contact">',
      '<attribute name="contactid"/>',
      '<attribute name="firstname"/>',
      '<attribute name="lastname"/>',
      '<attribute name="emailaddress1"/>',
      '<attribute name="telephone1"/>',
      '<attribute name="new_planoatual"/>',
      '<attribute name="new_valormensal"/>',
      '<filter type="and">',
        '<condition attribute="emailaddress1" operator="eq" value="', @SubKey, '"/>',
        '<condition attribute="statecode" operator="eq" value="0"/>',
      '</filter>',
    '</entity>',
  '</fetch>'
)

SET @Resultados = RetrieveMscrmRecordsFetchXml(@FetchXML)

IF RowCount(@Resultados) >= 1 THEN

  SET @Row = Row(@Resultados, 1)
  SET @PrimeiroNome = Field(@Row, 'firstname', 0)
  SET @Sobrenome = Field(@Row, 'lastname', 0)
  SET @Email = Field(@Row, 'emailaddress1', 0)
  SET @Telefone = Field(@Row, 'telephone1', 0)
  SET @Plano = Field(@Row, 'new_planoatual', 0)
  SET @ValorMensal = Field(@Row, 'new_valormensal', 0)

  /* Define oferta de Dia das Mães conforme o plano */
  IF @Plano == "Básico" THEN
    SET @Oferta = "Upgrade para o plano Premium por apenas R$ 89,90/mês"
    SET @Desconto = "30%"
  ELSEIF @Plano == "Intermediário" THEN
    SET @Oferta = "Upgrade para o plano Ultra por apenas R$ 119,90/mês"
    SET @Desconto = "25%"
  ELSE
    SET @Oferta = "Ganhe 3 meses de streaming grátis no seu plano atual"
    SET @Desconto = "Cortesia"
  ENDIF

  SET @NomeCompleto = Concat(ProperCase(@PrimeiroNome), " ", ProperCase(@Sobrenome))

ELSE

  SET @NomeCompleto = "Cliente"
  SET @Oferta = "Confira nossas ofertas especiais de Dia das Mães"
  SET @Desconto = ""
  SET @Plano = ""

ENDIF

]%%

%%[ IF RowCount(@Resultados) >= 1 THEN ]%%

<h1>Feliz Dia das Mães, %%=v(@NomeCompleto)=%%! 💐</h1>

<p>Sabemos que você é do plano <strong>%%=v(@Plano)=%%</strong> da Conecta Telecom.</p>
<p>Preparamos algo especial pra você neste mês das mães:</p>

<div style="background-color:#f0f8ff; padding:20px; border-radius:8px;">
  <p><strong>🎁 Sua oferta exclusiva:</strong></p>
  <p>%%=v(@Oferta)=%%</p>
  %%[ IF @Desconto != "Cortesia" THEN ]%%
    <p>Isso é <strong>%%=v(@Desconto)=%% de desconto</strong> nos primeiros 6 meses!</p>
  %%[ ENDIF ]%%
  <p><a href="https://www.conectatelecom.com.br/diadasmaes">Quero aproveitar!</a></p>
</div>

<p style="font-size:12px; color:#888;">
  E-mail enviado para %%=v(@Email)=%%. Dúvidas? Ligue para (11) 3000-5000.
</p>

%%[ ELSE ]%%

<h1>Feliz Dia das Mães! 💐</h1>
<p>%%=v(@Oferta)=%%</p>
<p><a href="https://www.conectatelecom.com.br/diadasmaes">Confira aqui</a></p>

%%[ ENDIF ]%%
```

**Saída:**
```
Feliz Dia das Mães, Maria Santos! 💐

Sabemos que você é do plano Básico da Conecta Telecom.
Preparamos algo especial pra você neste mês das mães:

🎁 Sua oferta exclusiva:
Upgrade para o plano Premium por apenas R$ 89,90/mês
Isso é 30% de desconto nos primeiros 6 meses!

[Quero aproveitar!]

E-mail enviado para maria.santos@email.com.br. Dúvidas? Ligue para (11) 3000-5000.
```

## Observações

- **Requer integração com Microsoft Dynamics CRM:** Essa função só funciona se a sua conta do Marketing Cloud estiver conectada a uma instância do Microsoft Dynamics CRM. Sem essa integração configurada, a função vai retornar erro.
- **Fetch XML precisa ser válido:** A consulta Fetch XML precisa seguir a especificação do Microsoft Dynamics CRM. Consulte a [documentação da Microsoft sobre Fetch XML](https://learn.microsoft.com/en-us/power-apps/developer/data-platform/use-fetchxml-construct-query) para construir suas queries corretamente.
- **Retorno é um rowset:** O retorno funciona como um rowset padrão do AMPscript. Use [RowCount](../data-extension-functions/rowcount.md) para verificar se há resultados antes de tentar acessar os dados, evitando erros em tempo de execução.
- **Sempre valide antes de usar os campos:** Use o terceiro parâmetro da função [Field](../data-extension-functions/field.md) (valor padrão) para evitar problemas com campos nulos ou vazios. No exemplo da documentação oficial, é usado `0` como fallback.
- **Cuidado com performance:** Consultas Fetch XML muito amplas (sem filtros ou com muitas entidades relacionadas) podem impactar o tempo de renderização do e-mail. Sempre use filtros adequados e limite o número de registros com o atributo `count` no elemento `<fetch>`.
- **Uso específico para Dynamics CRM:** Se você usa Salesforce CRM (Sales Cloud / Service Cloud), use [RetrieveSalesforceObjects](../salesforce-functions/retrievesalesforceobjects.md) em vez desta função.
- **Vantagem sobre RetrieveMscrmRecords:** Enquanto a função [RetrieveMscrmRecords](../microsoft-dynamics-crm-functions/retrievemscrmrecords.md) trabalha com parâmetros mais simples, a `RetrieveMscrmRecordsFetchXml` permite queries muito mais complexas, incluindo junções, ordenações e condições aninhadas — tudo via Fetch XML.
- **O nome do campo `emailaddresstring`** aparece na documentação oficial da Salesforce exatamente desta forma (sem o segundo "s" em "address"). Fique atento ao nome exato dos atributos retornados, pois eles correspondem aos nomes lógicos das entidades no Dynamics CRM.

## Funções relacionadas

- [RetrieveMscrmRecords](../microsoft-dynamics-crm-functions/retrievemscrmrecords.md) — busca registros do Dynamics CRM com parâmetros simples, sem precisar de Fetch XML
- [CreateMscrmRecord](../microsoft-dynamics-crm-functions/createmscrmrecord.md) — cria um novo registro no Dynamics CRM
- [UpdateMscrmRecords](../microsoft-dynamics-crm-functions/updatemscrmrecords.md) — atualiza registros existentes no Dynamics CRM
- [UpsertMscrmRecord](../microsoft-dynamics-crm-functions/upsertmscrmrecord.md) — insere ou atualiza um registro no Dynamics CRM
- [AddMscrmListMember](../microsoft-dynamics-crm-functions/addmscrmlistmember.md) — adiciona um membro a uma lista de marketing no Dynamics CRM
- [DescribeMscrmEntities](../microsoft-dynamics-crm-functions/describemscrmentities.md) — retorna informações sobre as entidades disponíveis no Dynamics CRM
- [DescribeMscrmEntityAttributes](../microsoft-dynamics-crm-functions/describemscrmentityattributes.md) — retorna os atributos de uma entidade do Dynamics CRM
- [SetStateMscrmRecord](../microsoft-dynamics-crm-functions/setstatemscrmrecord.md) — altera o estado de um registro no Dynamics CRM
- [Row](../data-extension-functions/row.md) — acessa uma linha específica de um rowset
- [RowCount](../data-extension-functions/rowcount.md) — retorna o número de linhas em um rowset
- [Field](../data-extension-functions/field.md) — extrai o valor de um campo de uma linha do rowset
- [Concat](../string-functions/concat.md) — concatena strings, útil para montar o Fetch XML dinamicamente