---
title: IsNullDefault
sidebar_label: IsNullDefault
description: Define valores padrão para campos vazios em formulários Smart Capture, retornando um valor alternativo quando o campo é nulo.
---

# IsNullDefault

## Descrição

A função `IsNullDefault` permite definir valores padrão para campos vazios em formulários **Smart Capture**. Basicamente, você passa dois valores: o que deve ser retornado quando o campo está preenchido e o que deve ser retornado quando o campo está vazio (nulo). É super útil na hora de inserir dados de formulários Smart Capture em Data Extensions, garantindo que nenhum campo fique sem valor. Pense nela como uma "rede de segurança" para os dados que vêm dos seus formulários em CloudPages.

## Sintaxe

```ampscript
IsNullDefault(nonNullValue, nullValue)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|--------------|--------|-------------|-----------|
| nonNullValue | String | Sim | O valor a ser retornado quando o campo do formulário Smart Capture **não** é nulo (ou seja, está preenchido). |
| nullValue | String | Sim | O valor a ser retornado quando o campo do formulário Smart Capture **é** nulo (ou seja, está vazio). |

## Exemplo básico

Imagine que você tem uma CloudPage com um formulário Smart Capture para cadastro no programa de fidelidade da **Lojas Vitória**. O campo "nivel" (nível do cliente) é opcional. Se o cliente não preencher, você quer que ele entre automaticamente como "Básico".

```ampscript
%%[

VAR @nivel

SET @nivel = IsNullDefault(nivel, "Básico")

InsertDE(
  "Programa_Fidelidade",
  "Nome", [Nome],
  "Email", [Email],
  "Nivel", @nivel
)

]%%

Obrigado por se cadastrar no programa Vitória Pontos!
Seu nível atual é: %%=v(@nivel)=%%
```

**Saída (quando o campo "nivel" está vazio):**
```
Obrigado por se cadastrar no programa Vitória Pontos!
Seu nível atual é: Básico
```

**Saída (quando o campo "nivel" foi preenchido com "Ouro"):**
```
Obrigado por se cadastrar no programa Vitória Pontos!
Seu nível atual é: Ouro
```

## Exemplo avançado

Agora um cenário mais completo: uma CloudPage da **Conecta Telecom** com formulário Smart Capture para solicitação de contato comercial. Vários campos são opcionais e você precisa garantir valores padrão antes de inserir na Data Extension.

```ampscript
%%[

VAR @nome, @email, @telefone, @planoInteresse, @horarioContato, @cidade, @origem

/* Campos obrigatórios vêm direto do formulário */
SET @nome = [Nome]
SET @email = [Email]

/* Campos opcionais com valores padrão via IsNullDefault */
SET @telefone = IsNullDefault(Telefone, "Não informado")
SET @planoInteresse = IsNullDefault(PlanoInteresse, "Conecta Fibra 200MB")
SET @horarioContato = IsNullDefault(HorarioContato, "Comercial (9h-18h)")
SET @cidade = IsNullDefault(Cidade, "Não informada")
SET @origem = IsNullDefault(Origem, "Site institucional")

InsertDE(
  "Leads_Comercial",
  "Nome", @nome,
  "Email", @email,
  "Telefone", @telefone,
  "PlanoInteresse", @planoInteresse,
  "HorarioContato", @horarioContato,
  "Cidade", @cidade,
  "Origem", @origem,
  "DataCadastro", Now()
)

]%%

<h2>Recebemos sua solicitação, %%=v(@nome)=%%!</h2>
<p>Entraremos em contato pelo e-mail <strong>%%=v(@email)=%%</strong>.</p>
<p><strong>Plano de interesse:</strong> %%=v(@planoInteresse)=%%</p>
<p><strong>Horário preferido:</strong> %%=v(@horarioContato)=%%</p>
<p>Enquanto isso, confira nossos planos em <a href="https://www.conectatelecom.com.br/planos">www.conectatelecom.com.br/planos</a></p>
```

**Saída (quando o cliente preencheu apenas Nome, Email e PlanoInteresse como "Conecta Fibra 500MB"):**
```
Recebemos sua solicitação, Maria Santos!
Entraremos em contato pelo e-mail maria.santos@email.com.br.
Plano de interesse: Conecta Fibra 500MB
Horário preferido: Comercial (9h-18h)
```

## Observações

- **Contexto específico:** A função `IsNullDefault` foi projetada para uso com **formulários Smart Capture** em **CloudPages**. Ela não é uma função genérica para checar nulos em qualquer contexto do AMPscript.
- **Diferença de `IsNull`:** Enquanto [`IsNull`](../utility-functions/isnull.md) retorna `true` ou `false` (útil para condicionais), `IsNullDefault` já retorna diretamente o valor que você quer — sem precisar montar um `IF`.
- **Alternativa com `Empty` e `IIF`:** Para cenários fora do Smart Capture, você pode combinar [`Empty`](../utility-functions/empty.md) com [`IIF`](../utility-functions/iif.md) para obter comportamento semelhante: `IIF(Empty(campo), "valor padrão", campo)`.
- **Ambos os parâmetros são obrigatórios.** Se você não passar os dois valores, a função vai gerar um erro.
- **Os parâmetros são do tipo string.** Se você precisar trabalhar com valores numéricos, lembre-se de que o retorno será uma string.
- **Uso prático:** É especialmente útil antes de chamar funções como [`InsertDE`](../data-extension-functions/insertde.md) ou [`UpsertDE`](../data-extension-functions/upsertde.md), para garantir que nenhum campo obrigatório da sua Data Extension receba um valor nulo.

## Funções relacionadas

- [IsNull](../utility-functions/isnull.md) — Verifica se um valor é nulo, retornando `true` ou `false`. Ideal para uso em condicionais.
- [Empty](../utility-functions/empty.md) — Verifica se um valor é vazio ou nulo. Mais versátil que `IsNull` para checagens gerais.
- [IIF](../utility-functions/iif.md) — Retorna um valor baseado em uma condição (tipo um IF inline). Combina bem com `Empty` para criar lógicas de valor padrão.
- [AttributeValue](../utility-functions/attributevalue.md) — Retorna o valor de um atributo de forma segura, retornando string vazia se não existir.
- [InsertDE](../data-extension-functions/insertde.md) — Insere uma linha em uma Data Extension. Comumente usada junto com `IsNullDefault` após captura de formulário.
- [UpsertDE](../data-extension-functions/upsertde.md) — Insere ou atualiza uma linha em uma Data Extension.
- [RequestParameter](../sites-functions/requestparameter.md) — Captura parâmetros de requisição em CloudPages, útil no mesmo contexto de formulários.
- [CloudPagesURL](../sites-functions/cloudpagesurl.md) — Gera URLs para CloudPages, onde os formulários Smart Capture normalmente são hospedados.