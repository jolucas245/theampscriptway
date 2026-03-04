---
title: InsertData
sidebar_label: InsertData
description: Insere uma nova linha em uma Data Extension e retorna o número de linhas inseridas.
---

# InsertData

## Descrição

A função `InsertData` insere uma nova linha em uma Data Extension e retorna o número de linhas inseridas. É a função ideal para gravar dados a partir de **CloudPages, landing pages, microsites e mensagens SMS** (Mobile Connect). Se você precisa inserir dados a partir de um **e-mail**, use a função [InsertDE](../data-extension-functions/insertde.md).

## Sintaxe

```ampscript
InsertData("dataExt", "columnName1", "valueToInsert1" [, "columnName2", "valueToInsert2" ...])
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| dataExt | String | Sim | Nome da Data Extension onde a linha será inserida. |
| columnName1 | String | Sim | Nome da coluna onde o valor será inserido. |
| valueToInsert1 | String | Sim | Valor a ser inserido na coluna especificada. |

> **💡 Dica:** Você pode inserir valores em múltiplas colunas na mesma linha adicionando pares de nome de coluna e valor ao final da chamada da função.

## Exemplo básico

Cadastro de um novo lead capturado via CloudPage de uma campanha da Lojas Vitória.

```ampscript
%%[

SET @resultado = InsertData(
  "Leads_Campanha",
  "Nome", "João Silva",
  "Email", "joao.silva@gmail.com",
  "Telefone", "(11) 99999-9999",
  "Cidade", "São Paulo"
)

]%%
```

**Saída:**
```
1
```

A variável `@resultado` recebe o valor `1`, indicando que uma linha foi inserida com sucesso.

## Exemplo avançado

CloudPage de formulário onde o cliente da Conecta Telecom registra interesse em um plano. Os dados vêm de parâmetros da URL e são tratados antes da inserção.

```ampscript
%%[

SET @nome = RequestParameter("nome")
SET @email = RequestParameter("email")
SET @cpf = RequestParameter("cpf")
SET @plano = RequestParameter("plano")
SET @cidade = RequestParameter("cidade")
SET @dataRegistro = Format(Now(), "dd/MM/yyyy")

SET @nome = ProperCase(Trim(@nome))
SET @email = Lowercase(Trim(@email))

SET @resultado = InsertData(
  "Interesse_Planos",
  "Nome", @nome,
  "Email", @email,
  "CPF", @cpf,
  "Plano", @plano,
  "Cidade", @cidade,
  "DataRegistro", @dataRegistro,
  "Origem", "CloudPage Campanha Junho"
)

IF @resultado == 1 THEN
  Output(Concat("Obrigado, ", @nome, "! Seu interesse no plano ", @plano, " foi registrado com sucesso."))
ENDIF

]%%
```

**Saída:**
```
Obrigado, Maria Santos! Seu interesse no plano Conecta Ultra 300MB foi registrado com sucesso.
```

## Observações

> **⚠️ Atenção:** A função `InsertData` pode ser usada em **CloudPages, landing pages, microsites e mensagens SMS (Mobile Connect)**. Para inserir dados a partir de **e-mails**, use a função [InsertDE](../data-extension-functions/insertde.md).

- A função retorna o número de linhas inseridas. Use esse retorno para validar se a operação foi bem-sucedida.
- A função sempre **insere** uma nova linha — ela não verifica se já existe um registro com a mesma chave primária. Se você precisa inserir ou atualizar dependendo da existência do registro, considere usar [UpsertData](../data-extension-functions/upsertdata.md).
- Você pode inserir valores em quantas colunas precisar, basta continuar adicionando pares de nome de coluna e valor ao final da chamada.

## Funções relacionadas

- [InsertDE](../data-extension-functions/insertde.md) — versão equivalente para uso em e-mails
- [UpdateData](../data-extension-functions/updatedata.md) — atualiza linhas existentes em uma Data Extension
- [UpsertData](../data-extension-functions/upsertdata.md) — insere ou atualiza dependendo da existência do registro
- [DeleteData](../data-extension-functions/deletedata.md) — remove linhas de uma Data Extension
- [Lookup](../data-extension-functions/lookup.md) — consulta valores em uma Data Extension