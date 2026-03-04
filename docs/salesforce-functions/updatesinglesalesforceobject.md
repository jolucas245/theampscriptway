---
title: UpdateSingleSalesforceObject
sidebar_label: UpdateSingleSalesforceObject
description: Atualiza um registro em um objeto do Salesforce CRM diretamente via AMPscript, usando Marketing Cloud Connect.
---

# UpdateSingleSalesforceObject

## Descrição

Atualiza um registro específico em um objeto do Salesforce (Sales Cloud ou Service Cloud) diretamente pelo AMPscript. Para funcionar, é necessário ter o **Marketing Cloud Connect** configurado entre as duas plataformas. A função retorna **1** se a atualização for bem-sucedida e **0** caso contrário — o que permite tratar o resultado e dar feedback ao subscriber ou registrar o status da operação.

## Sintaxe

```ampscript
UpdateSingleSalesforceObject(objectName, idToUpdate, fieldName, fieldValue)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| objectName | String | Sim | Nome da API do objeto do Salesforce que será atualizado (ex: `"Lead"`, `"Contact"`, `"Account"`) |
| idToUpdate | String | Sim | ID do registro no Salesforce que você quer atualizar |
| fieldName | String | Sim | Nome do campo a ser atualizado |
| fieldValue | String | Sim | Valor que será gravado no campo especificado |

## Exemplo básico

Atualizando o e-mail de um Lead no Salesforce após o subscriber confirmar seus dados em uma campanha da Lojas Vitória.

```ampscript
%%[
SET @resultado = UpdateSingleSalesforceObject(
  "Lead",
  "00Q00003yAEj",
  "Email",
  "joao.silva@email.com.br"
)

IF @resultado == 1 THEN
  SET @mensagem = "E-mail atualizado com sucesso!"
ELSE
  SET @mensagem = "Não foi possível atualizar o e-mail."
ENDIF
]%%

%%=v(@mensagem)=%%
```

**Saída:**
```
E-mail atualizado com sucesso!
```

## Exemplo avançado

Em uma régua de relacionamento do Banco Meridional, após o cliente informar seu novo telefone via CloudPage, o sistema atualiza o contato no Salesforce e exibe uma confirmação personalizada. O ID do contato e o novo telefone vêm como parâmetros da página.

```ampscript
%%[
SET @contatoId = RequestParameter("sfid")
SET @novoTelefone = RequestParameter("telefone")
SET @nomeCliente = RequestParameter("nome")

IF NOT Empty(@contatoId) AND NOT Empty(@novoTelefone) THEN
  SET @resultado = UpdateSingleSalesforceObject(
    "Contact",
    @contatoId,
    "Phone",
    @novoTelefone
  )

  IF @resultado == 1 THEN
    SET @msg = Concat("Obrigado, ", @nomeCliente, "! Seu telefone foi atualizado para ", @novoTelefone, ".")
  ELSE
    SET @msg = Concat(@nomeCliente, ", não conseguimos atualizar seu telefone. Tente novamente ou entre em contato com nosso suporte.")
  ENDIF
ELSE
  SET @msg = "Dados incompletos. Por favor, preencha todos os campos."
ENDIF
]%%

%%=v(@msg)=%%
```

**Saída:**
```
Obrigado, Maria Santos! Seu telefone foi atualizado para (11) 99999-9999.
```

## Observações

- A função exige que o **Marketing Cloud Connect** esteja configurado e ativo. Sem essa integração, a chamada não vai funcionar.

- Internamente, cada chamada dispara uma requisição SOAP para o seu org do Salesforce. Essas requisições **não contam** nos limites de uso de API do seu org.

> **⚠️ Atenção:** Para melhor performance, minimize o uso dessa função em envios. Usá-la em envios muito grandes pode fazer com que o envio **não seja concluído**. Se você precisa atualizar dados em massa no Salesforce, considere alternativas como Automation Studio ou processos batch.

> **⚠️ Atenção:** Ao fazer preview do código em uma webpage ou mensagem que usa essa função, **a atualização será executada de verdade**, como se fosse um envio. Para evitar que previews alterem dados reais, use a variável de sistema `_messagecontext` para impedir que o conteúdo seja processado no contexto de preview.

## Funções relacionadas

- [CreateSalesforceObject](../salesforce-functions/createsalesforceobject.md) — cria um novo registro em um objeto do Salesforce
- [RetrieveSalesforceObjects](../salesforce-functions/retrievesalesforceobjects.md) — consulta registros de um objeto do Salesforce
- [LongSfid](../salesforce-functions/longsfid.md) — converte um ID de 15 caracteres para o formato de 18 caracteres
- [Empty](../utility-functions/empty.md) — valida se um valor está vazio antes de tentar a atualização
- [Concat](../string-functions/concat.md) — monta strings dinâmicas para mensagens de feedback
- [RequestParameter](../sites-functions/requestparameter.md) — captura parâmetros em CloudPages para cenários de atualização via formulário