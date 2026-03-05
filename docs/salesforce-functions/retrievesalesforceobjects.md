---
title: RetrieveSalesforceObjects
sidebar_label: RetrieveSalesforceObjects
description: Retorna um rowset com dados de objetos do Salesforce CRM que correspondem aos critérios de filtro especificados, usando Marketing Cloud Connect.
---

# RetrieveSalesforceObjects

## Descrição

Consulta objetos do Salesforce CRM (Sales Cloud ou Service Cloud) diretamente do AMPscript e retorna um rowset com os registros que correspondem aos filtros informados. Para funcionar, é obrigatório ter o **Marketing Cloud Connect** configurado e integrado com o seu org Salesforce. Essa função é muito usada em e-mails e CloudPages para puxar dados em tempo real do CRM - como oportunidades, casos de suporte, leads ou qualquer objeto padrão ou customizado - sem precisar sincronizar tudo em Data Extensions.

## Sintaxe

```ampscript
RetrieveSalesforceObjects(objectName, fieldsToRetrieve, queryFieldName, queryFieldOperator, queryFieldValue [, queryFieldName2, queryFieldOperator2, queryFieldValue2 ...])
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| objectName | String | Sim | Nome da API do objeto do Salesforce de onde você quer recuperar os dados (ex: `"Lead"`, `"Contact"`, `"Opportunity"`). |
| fieldsToRetrieve | String | Sim | Lista de campos separados por vírgula que você quer trazer no retorno (ex: `"FirstName,LastName,Email"`). |
| queryFieldName | String | Sim | Nome do campo usado como filtro na consulta. |
| queryFieldOperator | String | Sim | Operador de comparação do filtro (ex: `"="`, `">"`, `"<"`). |
| queryFieldValue | String | Sim | Valor que será comparado no filtro. |

Você pode adicionar **conjuntos adicionais** de `queryFieldName`, `queryFieldOperator` e `queryFieldValue` para aplicar múltiplos filtros. Todos os filtros são conectados por lógica **AND**.

## Exemplo básico

Buscando todos os leads da região "Sudeste" no Salesforce para personalizar um e-mail de prospecção da MegaStore:

```ampscript
%%[
SET @leads = RetrieveSalesforceObjects(
  "Lead",
  "FirstName,LastName,Email,Company",
  "Region__c", "=", "Sudeste"
)

SET @total = RowCount(@leads)

IF @total > 0 THEN
  SET @linha = Row(@leads, 1)
  SET @nome = Field(@linha, "FirstName")
  SET @sobrenome = Field(@linha, "LastName")
  SET @empresa = Field(@linha, "Company")
]%%

Olá %%=v(@nome)=%% %%=v(@sobrenome)=%%, da %%=v(@empresa)=%%!

%%[ ENDIF ]%%
```

**Saída:**
```
Olá João Silva, da Lojas Vitória!
```

## Exemplo avançado

Cenário real de régua de relacionamento: um e-mail do Banco Brasilão que lista as oportunidades em aberto acima de R$ 1.000.000,00 para a região Sudeste, exibindo cada uma em uma tabela para o gerente de contas.

```ampscript
%%[
SET @oportunidades = RetrieveSalesforceObjects(
  "Opportunity",
  "Name,Amount,StageName,CloseDate,Account_Name__c",
  "Region__c", "=", "Sudeste",
  "Amount", ">", "1000000",
  "IsClosed", "=", "false"
)

SET @total = RowCount(@oportunidades)

IF @total > 0 THEN
]%%

<h2>Oportunidades em aberto - Região Sudeste</h2>
<p>Total encontrado: %%=v(@total)=%%</p>

<table border="1" cellpadding="8" cellspacing="0">
  <tr>
    <th>Conta</th>
    <th>Oportunidade</th>
    <th>Valor</th>
    <th>Fase</th>
    <th>Previsão de Fechamento</th>
  </tr>

%%[
  FOR @i = 1 TO @total DO
    SET @linha = Row(@oportunidades, @i)
    SET @conta = Field(@linha, "Account_Name__c")
    SET @nomeOp = Field(@linha, "Name")
    SET @valor = Field(@linha, "Amount")
    SET @fase = Field(@linha, "StageName")
    SET @dataFechamento = Field(@linha, "CloseDate")
    SET @valorFormatado = FormatCurrency(@valor, "pt-BR", 2)
    SET @dataFormatada = FormatDate(@dataFechamento, "dd/MM/yyyy")
]%%

  <tr>
    <td>%%=v(@conta)=%%</td>
    <td>%%=v(@nomeOp)=%%</td>
    <td>%%=v(@valorFormatado)=%%</td>
    <td>%%=v(@fase)=%%</td>
    <td>%%=v(@dataFormatada)=%%</td>
  </tr>

%%[
  NEXT @i
ENDIF
]%%

</table>
```

**Saída:**
```
Oportunidades em aberto - Região Sudeste
Total encontrado: 3

| Conta                    | Oportunidade                  | Valor            | Fase         | Previsão de Fechamento |
|--------------------------|-------------------------------|------------------|--------------|------------------------|
| Grupo Horizonte          | Expansão São Paulo 2024       | R$ 2.500.000,00  | Negociação   | 15/03/2025             |
| Supermercados Bela Vista | Novo Centro de Distribuição   | R$ 1.800.000,00  | Proposta     | 28/04/2025             |
| Conecta Telecom          | Fibra Corporativo Poços de Caldas | R$ 1.250.000,00 | Qualificação | 10/06/2025          |
```

## Observações

> **⚠️ Atenção:** O rowset retornado é **limitado a 1.000 linhas**. Se o seu filtro pode trazer mais registros do que isso, refine os critérios de busca para garantir que os dados mais relevantes estejam dentro desse limite.

> **⚠️ Atenção:** Cada chamada dessa função dispara uma **requisição SOAP** para o seu org Salesforce. Essas requisições **não** contam nos limites de uso de API do org, mas podem impactar a performance do envio de e-mail se forem muito demoradas. Evite usar essa função em loops pesados dentro de envios de alto volume.

> **💡 Dica:** Essa função exige que o **Marketing Cloud Connect** esteja configurado e ativo. Sem essa integração, a função simplesmente não vai funcionar. Se você só precisa de dados que já estão sincronizados em Data Extensions, prefira usar [LookupRows](../data-extension-functions/lookuprows.md) - é mais rápido e não depende de chamada externa.

> **💡 Dica:** Quando você adiciona múltiplos conjuntos de filtro, todos são conectados com lógica **AND**. Não existe suporte nativo a **OR** nessa função. Se precisar de lógica OR, você terá que fazer múltiplas chamadas e combinar os resultados.

- O retorno é um **rowset**. Use [Row()](../data-extension-functions/row.md) para acessar uma linha específica, [Field()](../data-extension-functions/field.md) para extrair o valor de um campo e [RowCount()](../data-extension-functions/rowcount.md) para saber quantos registros vieram.

## Funções relacionadas

- [CreateSalesforceObject](../salesforce-functions/createsalesforceobject.md) - cria registros em objetos do Salesforce
- [UpdateSingleSalesforceObject](../salesforce-functions/updatesinglesalesforceobject.md) - atualiza um registro específico no Salesforce
- [RetrieveSalesforceJobSources](../salesforce-functions/retrievesalesforcejobsources.md) - recupera fontes de jobs do Salesforce
- [LongSfid](../salesforce-functions/longsfid.md) - converte Salesforce ID de 15 para 18 caracteres
- [Row](../data-extension-functions/row.md) - acessa uma linha específica do rowset
- [Field](../data-extension-functions/field.md) - extrai o valor de um campo de uma linha
- [RowCount](../data-extension-functions/rowcount.md) - conta o número de linhas no rowset
- [LookupRows](../data-extension-functions/lookuprows.md) - alternativa para consultar dados já sincronizados em Data Extensions