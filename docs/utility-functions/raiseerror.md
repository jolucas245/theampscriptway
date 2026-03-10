---
title: RaiseError
sidebar_label: RaiseError
description: Interrompe o processamento de um envio de e-mail e gera uma mensagem de erro, podendo pular apenas o subscriber atual ou parar o job inteiro.
---

# RaiseError

## Descrição

A função `RaiseError` interrompe o processamento de um envio de e-mail e produz uma mensagem de erro. Você pode configurar para pular apenas o subscriber que causou o erro (continuando o job para os demais) ou para parar o job inteiro. É a principal ferramenta de AMPscript para tratar exceções - por exemplo, quando um dado obrigatório está faltando na Data Extension e você não quer que o subscriber receba um e-mail quebrado.

## Sintaxe

```ampscript
RaiseError(errorMessage [, boolSkipCurrentOnly] [, apiErrorCode] [, apiErrorNumber] [, boolPreserveDataExt])
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| errorMessage | string | Sim | Mensagem de erro exibida quando o erro é disparado. |
| boolSkipCurrentOnly | boolean | Não | Se `true`, pula apenas o subscriber que gerou o erro e continua o job para os demais. Se `false` (padrão), para o job inteiro. |
| apiErrorCode | string | Não | Código de erro personalizado definido pelo usuário para identificação via API. |
| apiErrorNumber | number | Não | Número de erro personalizado definido pelo usuário para identificação via API. |
| boolPreserveDataExt | boolean | Não | Se `true`, mantém as informações gravadas em Data Extensions (insert, update, upsert, delete via AMPscript) antes do erro ocorrer, mesmo que o subscriber seja pulado. Se `false`, não mantém essas informações. |

## Exemplo básico

Validação simples para garantir que o nome do cliente existe antes de montar o e-mail da Lojas Vitória:

```ampscript
%%[

VAR @nome
SET @nome = AttributeValue("PrimeiroNome")

IF Empty(@nome) THEN
  RaiseError("Nome do cliente vazio - subscriber pulado", true)
ENDIF

]%%

Olá, %%=v(@nome)=%%! Confira as ofertas da Lojas Vitória.
```

**Saída (quando o nome está vazio):**
```
Erro disparado: "Nome do cliente vazio - subscriber pulado"
O subscriber é pulado e o e-mail não é enviado para ele. O job continua para os demais.
```

## Exemplo avançado

Em uma régua de relacionamento do Banco Brasilão, o e-mail precisa exibir dados da conta do cliente. Se o registro não for encontrado na Data Extension, o erro é registrado em uma DE de log antes de pular o subscriber - e o parâmetro `boolPreserveDataExt` garante que esse log seja mantido:

```ampscript
%%[

VAR @cpf, @rows, @row, @nomeConta, @saldo

SET @cpf = AttributeValue("CPF")

IF Empty(@cpf) THEN
  RaiseError("CPF vazio - impossivel buscar dados da conta", true)
ENDIF

SET @rows = LookupRows("ContasClientes", "CPF", @cpf)

IF RowCount(@rows) == 0 THEN

  /* Registra o erro em uma DE de log antes de pular */
  InsertDE(
    "LogErrosEnvio",
    "CPF", @cpf,
    "DataErro", FormatDate(Now(), "dd/MM/yyyy HH:mm"),
    "Mensagem", Concat("Conta nao encontrada para CPF: ", @cpf)
  )

  RaiseError(
    Concat("Conta nao encontrada para CPF: ", @cpf),
    true,
    "CONTA_NAO_ENCONTRADA",
    1001,
    true
  )

ENDIF

SET @row = Row(@rows, 1)
SET @nomeConta = Field(@row, "NomeConta")
SET @saldo = Field(@row, "Saldo")

]%%

Olá, %%=v(@nomeConta)=%%!

Seu saldo atual no Banco Brasilão é de R$ %%=FormatNumber(@saldo, "N", 2, "pt-BR")=%%.
```

**Saída (quando a conta é encontrada):**
```
Olá, João Silva!

Seu saldo atual no Banco Brasilão é de R$ 3.450,00.
```

**Saída (quando a conta NÃO é encontrada):**
```
Erro disparado: "Conta nao encontrada para CPF: 123.456.789-00"
O subscriber é pulado, mas o registro na DE "LogErrosEnvio" é preservado graças ao parâmetro boolPreserveDataExt = true.
```

## Observações

> **⚠️ Atenção:** O Marketing Cloud constrói e pré-processa os e-mails antes de tentar enviá-los. Isso significa que seus relatórios de tracking podem incluir e-mails que **não foram efetivamente enviados** por conta do `RaiseError`. Não se assuste se os números parecerem inconsistentes - é comportamento esperado.

> **⚠️ Atenção:** E-mails que não são enviados por causa do `RaiseError` **não são contabilizados** no consumo de billing da sua conta. Ou seja, você não paga por envios que foram barrados por essa função.

> **⚠️ Atenção:** Em Journeys, o `RaiseError` remove o subscriber apenas do envio atual - ele **não** é removido de outros envios dentro da mesma Journey. Se o subscriber estiver em uma jornada com múltiplos e-mails, os próximos steps continuarão normalmente.

> **💡 Dica:** Use `RaiseError` exclusivamente para **tratamento de erros**. Se o que você precisa é segmentar subscribers (por exemplo, excluir quem não tem e-mail válido ou quem deu opt-out), utilize Query Activities e listas de exclusão. Usar `RaiseError` como mecanismo de segmentação é uma prática desencorajada pela Salesforce.

> **💡 Dica:** O parâmetro `boolPreserveDataExt` é essencial quando você faz gravações em Data Extensions (via [InsertDE](../data-extension-functions/insertde.md), [UpdateDE](../data-extension-functions/updatede.md), [UpsertDE](../data-extension-functions/upsertde.md) ou [DeleteDE](../data-extension-functions/deletede.md)) antes de disparar o erro. Sem ele como `true`, essas gravações são descartadas junto com o subscriber pulado.

> **💡 Dica:** Os parâmetros `apiErrorCode` e `apiErrorNumber` são úteis quando você monitora erros de envio via API. Defina códigos e números padronizados para facilitar a triagem de problemas no seu time.

## Funções relacionadas

- [Empty](../utility-functions/empty.md) - verificar se um valor está vazio antes de decidir disparar o erro
- [IsNull](../utility-functions/isnull.md) - verificar se um valor é nulo
- [AttributeValue](../utility-functions/attributevalue.md) - recuperar atributos do subscriber de forma segura
- [Lookup](../data-extension-functions/lookup.md) - buscar valores em Data Extensions
- [LookupRows](../data-extension-functions/lookuprows.md) - buscar múltiplas linhas para validação
- [RowCount](../data-extension-functions/rowcount.md) - contar resultados de um lookup antes de tratar o erro
- [InsertDE](../data-extension-functions/insertde.md) - registrar logs antes de disparar o erro
- [Concat](../string-functions/concat.md) - montar mensagens de erro dinâmicas