---
title: UpsertData
sidebar_label: UpsertData
description: Atualiza dados em uma Data Extension se encontrar correspondência nas colunas de busca, ou insere uma nova linha caso não encontre — retornando o número de linhas afetadas.
---

# UpsertData

## Descrição

A função `UpsertData` faz o famoso "upsert" — ela atualiza uma linha em uma Data Extension se encontrar correspondência nos critérios de busca, ou insere uma nova linha caso nenhuma correspondência seja encontrada. Ela retorna o número de linhas que foram atualizadas ou inseridas. É perfeita para cenários onde você não sabe se o registro já existe, como formulários de cadastro em CloudPages ou atualizações vindas de SMS. **Importante:** essa função funciona em **Landing Pages, Microsites e mensagens SMS (MobileConnect)**. Para fazer upsert dentro de **emails**, use a função [UpsertDE](../data-extension-functions/upsertde.md).

## Sintaxe

```ampscript
UpsertData("NomeDaDataExtension", qtdParesBusca, "colunaBusca1", "valorBusca1", "colunaUpsert1", "valorUpsert1")
```

Para múltiplas colunas de upsert:

```ampscript
UpsertData("NomeDaDataExtension", qtdParesBusca, "colunaBusca1", "valorBusca1", "colunaUpsert1", "valorUpsert1", "colunaUpsert2", "valorUpsert2")
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| dataExt | string | Sim | Nome da Data Extension onde você quer atualizar ou inserir dados. |
| columnValuePairs | número | Sim | Quantidade de pares coluna/valor usados como critério de busca (match). |
| searchColumnName | string | Sim | Nome da coluna usada para buscar o registro. Você pode ter múltiplos pares de busca. |
| searchValue | string | Sim | Valor que a função vai usar para localizar a linha a ser atualizada (ou decidir que precisa inserir). |
| columnToUpsert | string | Sim | Nome da coluna onde os dados serão atualizados ou inseridos. |
| upsertedValue | string | Sim | Valor a ser gravado na coluna especificada. Você pode informar múltiplos pares coluna/valor para upsert. |

## Exemplo básico

Imagina que você tem uma CloudPage de cadastro para o programa de fidelidade da **Lojas Vitória**. Quando o cliente preenche o formulário, você quer criar o registro se ele for novo, ou atualizar os dados se ele já existir. A Data Extension `Clientes_Fidelidade` tem estas colunas: `CPF`, `Nome`, `Email`, `Pontos`.

```ampscript
%%[

VAR @cpf, @nome, @email, @resultado

SET @cpf = RequestParameter("cpf")
SET @nome = RequestParameter("nome")
SET @email = RequestParameter("email")

/* Busca pelo CPF (1 par de busca) e faz upsert do Nome e Email */
SET @resultado = UpsertData(
  "Clientes_Fidelidade",
  1,
  "CPF", @cpf,
  "Nome", @nome,
  "Email", @email
)

]%%
```

**Saída:**

Se o CPF `123.456.789-00` já existir na DE, os campos `Nome` e `Email` são atualizados. Se não existir, uma nova linha é inserida. A variável `@resultado` retorna `1` (uma linha afetada).

## Exemplo avançado

Agora imagine um cenário mais completo: a **Conecta Telecom** tem uma CloudPage onde o cliente atualiza seus dados cadastrais e escolhe o plano de interesse. A Data Extension `Cadastro_Clientes` possui: `CPF`, `Nome`, `Email`, `Telefone`, `CEP`, `PlanoInteresse`, `DataAtualizacao`.

Você quer fazer o upsert com busca composta (CPF + Email) e gravar múltiplas colunas de uma vez.

```ampscript
%%[

VAR @cpf, @nome, @email, @telefone, @cep, @plano, @resultado

SET @cpf = RequestParameter("cpf")
SET @nome = RequestParameter("nome")
SET @email = RequestParameter("email")
SET @telefone = RequestParameter("telefone")
SET @cep = RequestParameter("cep")
SET @plano = RequestParameter("plano")

/* Busca composta: 2 pares de busca (CPF e Email) */
SET @resultado = UpsertData(
  "Cadastro_Clientes",
  2,
  "CPF", @cpf,
  "Email", @email,
  "Nome", @nome,
  "Telefone", @telefone,
  "CEP", @cep,
  "PlanoInteresse", @plano,
  "DataAtualizacao", Format(Now(), "dd/MM/yyyy HH:mm")
)

IF @resultado > 0 THEN
]%%

<h2>Tudo certo, <%= v(@nome) %>!</h2>
<p>Seus dados foram salvos com sucesso.</p>
<p>Plano de interesse: <strong>%%=v(@plano)=%%</strong></p>

%%[ ELSE ]%%

<h2>Ops, algo deu errado!</h2>
<p>Não foi possível salvar seus dados. Tente novamente.</p>

%%[ ENDIF ]%%
```

**Saída (se o upsert funcionar):**

```
Tudo certo, Maria Santos!
Seus dados foram salvos com sucesso.
Plano de interesse: Conecta Ultra 200MB
```

Nesse caso, se já existir um registro com o CPF `987.654.321-00` **e** o Email `maria.santos@email.com.br`, a linha é atualizada. Se não existir nenhuma linha com essa combinação exata, uma nova linha é criada. `@resultado` retorna `1`.

## Cenário prático: Formulário de Black Friday

A **MegaStore** criou uma CloudPage para os clientes se cadastrarem e receberem ofertas exclusivas de Black Friday. A DE `BlackFriday_Inscritos` tem: `Email`, `Nome`, `Categoria`, `AceitaComunicacao`, `DataInscricao`.

```ampscript
%%[

VAR @email, @nome, @categoria, @resultado

SET @email = Trim(Lowercase(RequestParameter("email")))
SET @nome = ProperCase(RequestParameter("nome"))
SET @categoria = RequestParameter("categoria")

SET @resultado = UpsertData(
  "BlackFriday_Inscritos",
  1,
  "Email", @email,
  "Nome", @nome,
  "Categoria", @categoria,
  "AceitaComunicacao", "Sim",
  "DataInscricao", Format(Now(), "dd/MM/yyyy")
)

IF @resultado >= 1 THEN
]%%

<p>Boa, <b>%%=v(@nome)=%%</b>! 🎉</p>
<p>Você está na lista VIP da Black Friday da MegaStore!</p>
<p>Categoria escolhida: <b>%%=v(@categoria)=%%</b></p>
<p>Fique de olho no seu e-mail <b>%%=v(@email)=%%</b> — as ofertas com frete grátis acima de R$299 vão chegar em breve!</p>

%%[ ENDIF ]%%
```

**Saída:**

```
Boa, Carlos Oliveira! 🎉
Você está na lista VIP da Black Friday da MegaStore!
Categoria escolhida: Eletrônicos
Fique de olho no seu e-mail carlos.oliveira@email.com.br — as ofertas com frete grátis acima de R$299 vão chegar em breve!
```

## Observações

- **Contexto de uso:** `UpsertData` funciona em **Landing Pages**, **Microsites** e **mensagens SMS (MobileConnect)**. Ela **NÃO** funciona em emails — para emails, use [UpsertDE](../data-extension-functions/upsertde.md).
- **Valor de retorno:** Retorna o número de linhas atualizadas ou inseridas. Se algo der errado (como tipo de dado incompatível), retorna `0`.
- **Parâmetro `columnValuePairs` errado:** Se o número que você informar não bater com a quantidade real de pares de busca (coluna + valor), a função vai disparar uma exceção. Confira sempre se o número tá certinho.
- **Coluna de busca inexistente:** Se você informar um nome de coluna no `searchColumnName` que não existe na Data Extension, vai rolar uma exceção.
- **Tipo de dado incompatível:** Se o valor que você passar no `upsertedValue` tiver um tipo diferente do esperado pela coluna (por exemplo, passar texto numa coluna numérica), a função não atualiza nem insere nada — e retorna `0`.
- **Desbalanceamento de parâmetros de busca e upsert:** Se a quantidade de pares de busca (`searchColumnName`/`searchValue`) for diferente da quantidade de pares de upsert (`columnToUpsert`/`upsertedValue`), a função só vai processar os pares de upsert que tiverem um par de busca correspondente. Exemplo: se você passar 2 pares de busca e 3 pares de upsert, apenas os 2 primeiros pares de upsert serão processados. Você pode repetir os mesmos parâmetros de upsert se necessário.
- **Dica de performance:** Se você precisa fazer upsert de muitos registros de uma vez, considere usar a API ao invés de fazer múltiplas chamadas `UpsertData` em loop — pode impactar no tempo de processamento da página.

## Funções relacionadas

- [UpsertDE](../data-extension-functions/upsertde.md) — Faz a mesma coisa que `UpsertData`, mas funciona dentro de **emails**.
- [UpdateData](../data-extension-functions/updatedata.md) — Apenas atualiza dados existentes (não insere linhas novas).
- [InsertData](../data-extension-functions/insertdata.md) — Apenas insere novas linhas (não atualiza existentes).
- [DeleteData](../data-extension-functions/deletedata.md) — Remove linhas de uma Data Extension.
- [InsertDE](../data-extension-functions/insertde.md) — Insere dados em uma DE dentro de emails.
- [UpdateDE](../data-extension-functions/updatede.md) — Atualiza dados em uma DE dentro de emails.
- [DeleteDE](../data-extension-functions/deletede.md) — Remove dados de uma DE dentro de emails.
- [Lookup](../data-extension-functions/lookup.md) — Busca um valor em uma Data Extension.
- [LookupRows](../data-extension-functions/lookuprows.md) — Retorna múltiplas linhas de uma Data Extension.
- [RequestParameter](../sites-functions/requestparameter.md) — Captura valores enviados via formulário ou query string em CloudPages.
- [Now](../date-functions/now.md) — Retorna a data e hora atual do sistema.
- [Format](../string-functions/format.md) — Formata valores como datas e números.
- [Trim](../string-functions/trim.md) — Remove espaços em branco do início e fim de uma string.
- [Lowercase](../string-functions/lowercase.md) — Converte uma string para minúsculas.
- [ProperCase](../string-functions/propercase.md) — Converte a primeira letra de cada palavra para maiúscula.