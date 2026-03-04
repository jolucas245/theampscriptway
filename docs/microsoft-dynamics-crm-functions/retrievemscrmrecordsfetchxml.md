---
title: RetrieveMscrmRecordsFetchXml
sidebar_label: RetrieveMscrmRecordsFetchXml
description: Retorna atributos de registros do Microsoft Dynamics CRM usando uma query Fetch XML.
---

# RetrieveMscrmRecordsFetchXml

## Descrição

Executa uma query Fetch XML no Microsoft Dynamics CRM e retorna os atributos especificados na consulta. Essa função é útil quando você precisa buscar dados de contatos ou outras entidades do Dynamics CRM diretamente dentro de um e-mail, CloudPage ou automação no SFMC — por exemplo, para personalizar comunicações com dados que vivem no CRM, como nome, e-mail ou ID de contato. O resultado traz os registros que atendem aos critérios definidos na query Fetch XML.

## Sintaxe

```ampscript
RetrieveMscrmRecordsFetchXml(@fetchXmlQuery)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| fetchXmlQuery | String | Sim | Query Fetch XML válida do Microsoft Dynamics CRM que define quais atributos e filtros serão usados na consulta. |

## Exemplo básico

Recuperando o ID de contato, e-mail, primeiro nome e sobrenome de um contato específico no Dynamics CRM usando sua subscriber key.

```ampscript
%%[
SET @subscriberKey = "carlos.mendes@conectatelecom.com.br"

SET @fetchXml = Concat(
  "<fetch mapping='logical'>",
    "<entity name='contact'>",
      "<attribute name='contactid' />",
      "<attribute name='emailaddress1' />",
      "<attribute name='firstname' />",
      "<attribute name='lastname' />",
      "<filter type='and'>",
        "<condition attribute='emailaddress1' operator='eq' value='", @subscriberKey, "' />",
      "</filter>",
    "</entity>",
  "</fetch>"
)

SET @registros = RetrieveMscrmRecordsFetchXml(@fetchXml)

SET @totalRegistros = RowCount(@registros)

IF @totalRegistros > 0 THEN
  SET @linha = Row(@registros, 1)
  SET @primeiroNome = Field(@linha, "firstname")
  SET @sobrenome = Field(@linha, "lastname")
  SET @email = Field(@linha, "emailaddress1")
ENDIF
]%%

Olá, %%=V(@primeiroNome)=%% %%=V(@sobrenome)=%%!
Seu e-mail cadastrado: %%=V(@email)=%%
```

**Saída:**
```
Olá, Carlos Mendes!
Seu e-mail cadastrado: carlos.mendes@conectatelecom.com.br
```

## Exemplo avançado

Cenário de régua de relacionamento: o Banco Meridional envia um e-mail personalizado listando todos os contatos vinculados a uma conta específica no Dynamics CRM, exibindo nome e e-mail de cada um.

```ampscript
%%[
SET @contaId = "A1B2C3D4-E5F6-7890-ABCD-EF1234567890"

SET @fetchXml = Concat(
  "<fetch mapping='logical'>",
    "<entity name='contact'>",
      "<attribute name='contactid' />",
      "<attribute name='emailaddress1' />",
      "<attribute name='firstname' />",
      "<attribute name='lastname' />",
      "<filter type='and'>",
        "<condition attribute='parentcustomerid' operator='eq' value='", @contaId, "' />",
      "</filter>",
    "</entity>",
  "</fetch>"
)

SET @registros = RetrieveMscrmRecordsFetchXml(@fetchXml)
SET @totalRegistros = RowCount(@registros)

IF @totalRegistros > 0 THEN
  Output(Concat("<p>Encontramos ", @totalRegistros, " contato(s) vinculado(s) à sua conta:</p>"))
  Output("<table><tr><th>Nome</th><th>E-mail</th></tr>")

  FOR @i = 1 TO @totalRegistros DO
    SET @linha = Row(@registros, @i)
    SET @primeiroNome = Field(@linha, "firstname")
    SET @sobrenome = Field(@linha, "lastname")
    SET @email = Field(@linha, "emailaddress1")

    SET @nomeCompleto = Concat(
      ProperCase(@primeiroNome), " ",
      ProperCase(@sobrenome)
    )

    SET @emailTratado = IsNullDefault(@email, "não informado")

    Output(Concat(
      "<tr><td>", @nomeCompleto, "</td>",
      "<td>", @emailTratado, "</td></tr>"
    ))
  NEXT @i

  Output("</table>")
ELSE
  Output("<p>Nenhum contato encontrado para esta conta.</p>")
ENDIF
]%%
```

**Saída:**
```
Encontramos 3 contato(s) vinculado(s) à sua conta:

Nome              | E-mail
João Silva        | joao.silva@bancomeridional.com.br
Maria Santos      | maria.santos@bancomeridional.com.br
Ana Lima          | não informado
```

## Observações

- A query Fetch XML precisa seguir o padrão do Microsoft Dynamics CRM. Consulte a documentação oficial da Microsoft sobre Fetch XML para construir queries válidas.

> **⚠️ Atenção:** Essa função só funciona em contas SFMC que possuem integração configurada com o Microsoft Dynamics CRM. Se a integração não estiver ativa, a função não retornará resultados.

> **💡 Dica:** Use a função [Concat](../string-functions/concat.md) para montar a query Fetch XML de forma dinâmica, inserindo valores de variáveis nos filtros. Isso permite personalizar a consulta por subscriber, conta ou qualquer outro atributo.

- Utilize [RowCount](../data-extension-functions/rowcount.md), [Row](../data-extension-functions/row.md) e [Field](../data-extension-functions/field.md) para iterar e extrair os valores dos registros retornados, da mesma forma que faria com resultados de [LookupRows](../data-extension-functions/lookuprows.md).

## Funções relacionadas

- [RetrieveMscrmRecords](../microsoft-dynamics-crm-functions/retrievemscrmrecords.md) — consulta registros do Dynamics CRM sem usar Fetch XML
- [CreateMscrmRecord](../microsoft-dynamics-crm-functions/createmscrmrecord.md) — cria registros no Dynamics CRM
- [UpdateMscrmRecords](../microsoft-dynamics-crm-functions/updatemscrmrecords.md) — atualiza registros no Dynamics CRM
- [UpsertMscrmRecord](../microsoft-dynamics-crm-functions/upsertmscrmrecord.md) — insere ou atualiza registros no Dynamics CRM
- [RowCount](../data-extension-functions/rowcount.md) — conta os registros retornados
- [Row](../data-extension-functions/row.md) — acessa uma linha específica do resultado
- [Field](../data-extension-functions/field.md) — extrai o valor de um campo do registro
- [Concat](../string-functions/concat.md) — monta a query Fetch XML dinamicamente