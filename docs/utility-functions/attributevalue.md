---
title: AttributeValue
sidebar_label: AttributeValue
description: Retorna o valor de um atributo do contato ou assinante, retornando null de forma segura caso o dado não exista.
---

<!-- generated-by-script -->

# AttributeValue

## Descrição

A função `AttributeValue` retorna o valor de um atributo associado ao contato ou assinante para quem a mensagem está sendo enviada. Ela busca esse valor em diversas fontes de dados: perfis de assinantes de e-mail, campos de Data Extensions, atributos da entry source de Journeys e atributos de MobilePush.

A grande vantagem dela sobre a referência direta ao atributo (aquele `%%NomeDoAtributo%%`) é que ela retorna **null** de forma segura quando o dado não é encontrado, em vez de gerar um erro. Isso torna seu código muito mais robusto e previsível.

## Sintaxe

```ampscript
AttributeValue("atributo")
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|--------|-------------|-----------|
| atributo | String | Sim | O nome do atributo cujo valor você quer retornar. Deve corresponder ao nome do campo na Data Extension, no perfil do assinante ou na entry source da Journey. |

## Exemplo básico

Imagine que você está enviando um e-mail a partir de uma Data Extension que tem o campo `PrimeiroNome`. Usando `AttributeValue`, você consegue personalizar a saudação sem risco de erro caso o campo esteja vazio:

```ampscript
%%[
SET @primeiroNome = AttributeValue("PrimeiroNome")

IF Empty(@primeiroNome) THEN
  SET @saudacao = "Olá, cliente!"
ELSE
  SET @saudacao = Concat("Olá, ", @primeiroNome, "!")
ENDIF
]%%

%%= v(@saudacao) =%%
```

**Saída (quando PrimeiroNome = "Maria"):**
```
Olá, Maria!
```

**Saída (quando PrimeiroNome está vazio ou não existe):**
```
Olá, cliente!
```

## Exemplo avançado

Aqui vai um cenário real: a **FarmaRede** tem um programa de pontos e quer enviar um e-mail personalizado para seus clientes. A Data Extension de envio tem os campos `PrimeiroNome`, `PontosAcumulados` e `NivelFidelidade`. Dependendo da quantidade de pontos, a mensagem muda:

```ampscript
%%[
SET @nome = AttributeValue("PrimeiroNome")
SET @pontos = AttributeValue("PontosAcumulados")
SET @nivel = AttributeValue("NivelFidelidade")

/* Tratamento seguro para nome vazio */
IF Empty(@nome) THEN
  SET @nome = "cliente"
ENDIF

/* Monta a mensagem de acordo com os pontos */
IF Empty(@pontos) THEN
  SET @mensagemPontos = "Cadastre-se hoje no programa FarmaRede Pontos!"
ELSEIF @pontos >= 5000 THEN
  SET @mensagemPontos = Concat("Parabéns! Você tem ", @pontos, " pontos e pode trocar por descontos de até R$ 150,00. Seu nível atual: ", @nivel, ".")
ELSEIF @pontos >= 1000 THEN
  SET @mensagemPontos = Concat("Você já acumulou ", @pontos, " pontos. Faltam apenas ", Subtract(5000, @pontos), " pontos para desbloquear recompensas exclusivas!")
ELSE
  SET @mensagemPontos = Concat("Você tem ", @pontos, " pontos. Continue comprando na FarmaRede para acumular mais!")
ENDIF
]%%

<h1>Olá, %%= v(@nome) =%%!</h1>
<p>%%= v(@mensagemPontos) =%%</p>
<p>Aproveite: frete grátis em compras acima de R$ 299,00 até 31/12/2024.</p>
<p><a href="https://www.farmarede.com.br/pontos">Consultar meus pontos</a></p>
```

**Saída (quando PrimeiroNome = "Carlos", PontosAcumulados = 3200, NivelFidelidade = "Ouro"):**
```
Olá, Carlos!
Você já acumulou 3200 pontos. Faltam apenas 1800 pontos para desbloquear recompensas exclusivas!
Aproveite: frete grátis em compras acima de R$ 299,00 até 31/12/2024.
Consultar meus pontos
```

**Saída (quando PontosAcumulados está vazio/não existe):**
```
Olá, cliente!
Cadastre-se hoje no programa FarmaRede Pontos!
Aproveite: frete grátis em compras acima de R$ 299,00 até 31/12/2024.
Consultar meus pontos
```

## Observações

- **Retorno null seguro:** A principal razão para usar `AttributeValue` em vez de uma referência direta (`%%NomeDoAtributo%%`) é que ela retorna **null** quando o atributo não é encontrado, em vez de gerar um erro no envio. Isso é especialmente importante em cenários onde nem todos os registros têm todos os campos preenchidos.
- **Fontes de dados suportadas:** A função busca valores em perfis de assinantes de e-mail, campos de Data Extensions sendable, atributos da entry source de Journeys e atributos de MobilePush.
- **Nome do atributo como string:** O nome do atributo é passado como string (entre aspas). Certifique-se de que o nome corresponda exatamente ao nome do campo na sua fonte de dados, incluindo espaços se houver (ex: `AttributeValue("Primeiro Nome")`).
- **Combine com Empty():** Como a função pode retornar null, é uma boa prática sempre combinar com a função [Empty](../utility-functions/empty.md) para validar o valor antes de usá-lo na sua lógica.
- **Alternativa com valor padrão:** Se você quer um valor padrão automático quando o atributo não existir, considere usar [IsNullDefault](../utility-functions/isnulldefault.md) em conjunto, que já retorna um valor alternativo caso o resultado seja null.
- **Diferença para referência direta:** `SET @var = AttributeValue("Campo")` é mais seguro que `SET @var = Campo` porque a referência direta pode causar erro de renderização se o campo não existir no contexto do envio.

## Funções relacionadas

- [V](../utility-functions/v.md) — Exibe o valor de uma variável no corpo do e-mail ou página
- [Empty](../utility-functions/empty.md) — Verifica se um valor é vazio ou null, ideal para validar o retorno de `AttributeValue`
- [IsNull](../utility-functions/isnull.md) — Verifica se um valor é null
- [IsNullDefault](../utility-functions/isnulldefault.md) — Retorna um valor padrão caso o dado seja null
- [Concat](../string-functions/concat.md) — Concatena strings, muito usada junto com `AttributeValue` para montar mensagens personalizadas
- [Lookup](../data-extension-functions/lookup.md) — Busca valores em Data Extensions que não são a sendable do envio
- [TreatAsContent](../utility-functions/treatascontent.md) — Processa uma string como conteúdo AMPscript, útil quando o valor retornado contém código dinâmico