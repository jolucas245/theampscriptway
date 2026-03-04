---
title: AMPscript e SSJS
sidebar_label: AMPscript e SSJS
description: Comparação entre AMPscript e Server-Side JavaScript no Marketing Cloud, e como usar Variable.GetValue() e Variable.SetValue() para compartilhar dados entre as duas linguagens.
---

# AMPscript e SSJS

O Marketing Cloud Engagement suporta duas linguagens de script do lado do servidor: **AMPscript** e **Server-Side JavaScript (SSJS)**. Elas coexistem no mesmo template e cada uma tem seu lugar.

Entender quando usar cada uma — e como fazer elas conversarem — é uma habilidade essencial para projetos mais avançados no SFMC.

---

## Qual é a diferença?

| | AMPscript | SSJS |
|---|---|---|
| **Propósito original** | Personalização de conteúdo | Automação e integração |
| **Sintaxe** | Própria (`%%[ ]%%`) | JavaScript com APIs SFMC |
| **Acesso a APIs SFMC** | Limitado (funções nativas) | Completo (Core library) |
| **Manipulação de strings** | Excelente | Moderada |
| **Lógica complexa** | Limitada | Ampla |
| **Performance em e-mail** | Melhor | Aceitável |
| **Disponível em e-mail** | ✅ | ✅ |
| **Disponível em CloudPage** | ✅ | ✅ |
| **Disponível em SMS** | ✅ | ❌ |

### Quando usar AMPscript

- Personalização de conteúdo em e-mails e SMS
- Lookup de dados em Data Extensions
- Condicionais e loops simples sobre dados do subscriber
- Qualquer coisa que precise rodar em escala dentro de um job de envio

### Quando usar SSJS

- Chamadas a APIs REST externas com lógica de autenticação complexa
- Manipulação de JSON aninhado
- Operações com a SOAP API do SFMC
- Lógica condicional complexa que seria verbosa em AMPscript
- Quando você precisa de estruturas como arrays, objetos e funções reutilizáveis

### Quando usar os dois juntos

É comum combinar as duas linguagens no mesmo template. Um padrão frequente é:

1. Usar SSJS para buscar e processar dados de uma API externa
2. Salvar o resultado em uma variável AMPscript
3. Usar AMPscript para renderizar o conteúdo com esses dados

---

## Compartilhando variáveis entre as linguagens

As duas linguagens têm espaços de variáveis separados — uma variável `@nome` do AMPscript não é automaticamente visível no SSJS, e vice-versa. Para transferir valores, o SSJS oferece duas funções utilitárias: `Variable.GetValue()` e `Variable.SetValue()`.

### Variable.GetValue()

Lê o valor de uma variável AMPscript (ou de um atributo do subscriber) dentro de um bloco SSJS.

```
Variable.GetValue(nomeVariavel)
```

| Argumento | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| 1 | String | Sim | Nome da variável AMPscript. O prefixo `@` é opcional. |

**Exemplo — passando uma variável AMPscript para o SSJS:**

```html
%%[
  SET @clienteId = AttributeValue('ClienteID')
  SET @segmento  = 'premium'
]%%

<script runat="server">
  Platform.Load("core", "1.1.5");

  var clienteId = Variable.GetValue("@clienteId");
  var segmento  = Variable.GetValue("@segmento");

  /* Agora você pode usar esses valores em lógica SSJS */
  Write("Cliente " + clienteId + " — Segmento: " + segmento);
</script>
```

A variável precisa ter sido definida com `SET` **antes** do bloco `<script>`. O AMPscript processa de cima para baixo, então ordem importa.

---

### Variable.SetValue()

Define o valor de uma variável AMPscript a partir de dentro de um bloco SSJS.

```
Variable.SetValue(nomeVariavel, valor)
```

| Argumento | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| 1 | String | Sim | Nome da variável AMPscript. O prefixo `@` é opcional. |
| 2 | String | Sim | Valor a definir. Pode ser um literal ou uma variável SSJS. |

**Exemplo — passando um valor do SSJS para o AMPscript:**

```html
<script runat="server">
  Platform.Load("core", "1.1.5");

  /* Busca dados de uma API ou processa lógica complexa */
  var primeiroNome = "Mariana";
  var pontosFidelidade = 4750;

  Variable.SetValue("@primeiroNome", primeiroNome);
  Variable.SetValue("@pontosFidelidade", pontosFidelidade);
</script>

%%[
  /* Agora as variáveis estão disponíveis no AMPscript */
  IF @pontosFidelidade >= 5000 THEN
    SET @nivelFidelidade = 'Ouro'
  ELSEIF @pontosFidelidade >= 2500 THEN
    SET @nivelFidelidade = 'Prata'
  ELSE
    SET @nivelFidelidade = 'Bronze'
  ENDIF
]%%

<p>Olá, %%=v(@primeiroNome)=%%! Você é membro <strong>%%=v(@nivelFidelidade)=%%</strong> com %%=v(@pontosFidelidade)=%% pontos.</p>
```

**Saída:**
```
Olá, Mariana! Você é membro Prata com 4750 pontos.
```

---

## Exemplo completo — fluxo SSJS → AMPscript → SSJS

O padrão mais poderoso é o ciclo completo: o AMPscript prepara dados do subscriber, o SSJS os usa para buscar ou calcular algo, e o resultado volta para o AMPscript renderizar o conteúdo.

```html
%%[
  /* 1. AMPscript prepara dados do subscriber */
  SET @email    = AttributeValue('emailaddr')
  SET @clienteId = Lookup('Clientes_DE', 'ClienteID', 'Email', @email)
]%%

<script runat="server">
  Platform.Load("core", "1.1.5");

  /* 2. SSJS lê os dados preparados pelo AMPscript */
  var clienteId = Variable.GetValue("@clienteId");

  /* 3. SSJS faz uma operação que AMPscript não consegue facilmente */
  var ultimaCompraDE = DataExtension.Init("UltimasCompras_DE");
  var rows = ultimaCompraDE.Rows.Retrieve({
    Property: "ClienteID",
    SimpleOperator: "equals",
    Value: clienteId
  });

  var valorUltimaCompra = rows.length > 0 ? rows[0]["ValorTotal"] : "0";

  /* 4. SSJS devolve o resultado para o AMPscript */
  Variable.SetValue("@valorUltimaCompra", valorUltimaCompra);
</script>

%%[
  /* 5. AMPscript usa o valor para personalizar o conteúdo */
  IF @valorUltimaCompra > 500 THEN
    SET @mensagem = 'Sua última compra foi premium. Confira nossas novidades exclusivas!'
  ELSE
    SET @mensagem = 'Que tal aproveitar nossas ofertas desta semana?'
  ENDIF
]%%

<p>%%=v(@mensagem)=%%</p>
```

---

## Boas práticas

**Defina as variáveis AMPscript antes de usá-las no SSJS.** O `Variable.GetValue()` retorna vazio se a variável não existir ainda. Se precisar de uma variável de "saída" (que o SSJS vai preencher), declare-a com `VAR` ou `SET @var = ''` antes do bloco `<script>`.

**Use `Variable.SetValue()` antes do bloco AMPscript que vai consumir o valor.** O SSJS executa de cima para baixo junto com o AMPscript — então o bloco `<script>` precisa vir antes do `%%[` que usa a variável.

**Prefira AMPscript para personalização de e-mail em escala.** Em jobs com milhões de envios, SSJS pode ter impacto de performance. Use SSJS onde for realmente necessário e AMPscript para o restante.

**Não use SSJS em SMS.** O canal de SMS do MobileConnect suporta apenas AMPscript.
