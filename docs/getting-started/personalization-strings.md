---
title: Personalization Strings
sidebar_label: Personalization Strings
description: Guia completo sobre personalization strings no Salesforce Marketing Cloud — o que são, como usar e como combiná-las com AMPScript para personalizar seus e-mails.
sidebar_position: 6
---

# Personalization Strings

Sabe quando você recebe um e-mail e ele começa com "Olá, João!"? Pode parecer mágica, mas é uma das funcionalidades mais básicas e poderosas do Marketing Cloud: as **personalization strings**. Elas são o jeito mais simples de inserir dados dinâmicos nos seus e-mails — sem escrever uma única linha de código.

Se você está começando com personalização no SFMC, este é o melhor ponto de partida antes de mergulhar de cabeça no [AMPScript](/docs/getting-started/introduction).

---

## O que são Personalization Strings

Personalization strings são **marcadores de substituição** (placeholders) que você coloca no corpo do seu e-mail, na linha de assunto ou no preheader. Na hora do envio, o Marketing Cloud substitui cada marcador pelo valor correspondente do subscriber que está recebendo aquela mensagem.

A sintaxe é simples: o nome do campo envolvido por **dois sinais de porcentagem** de cada lado.

```html
Olá, %%FirstName%%! Tudo bem?
```

Se o subscriber João Silva receber esse e-mail, ele vai ver:

```
Olá, João! Tudo bem?
```

É só isso. Sem funções, sem variáveis, sem `SET` ou `Output`. O Marketing Cloud faz a substituição automaticamente.

> **💡 Dica:** Personalization strings funcionam em qualquer lugar do e-mail: corpo (HTML ou texto), linha de assunto, preheader e até no campo "From Name".

---

## Diferença entre Personalization Strings e AMPScript

Essa é uma dúvida super comum: "Se eu posso usar `%%FirstName%%`, por que preciso de AMPScript?"

A resposta curta: personalization strings **exibem dados**, AMPScript **processa dados**.

| Aspecto | Personalization Strings | AMPScript |
|---|---|---|
| **Sintaxe** | `%%NomeDoCampo%%` | `%%[código]%%` |
| **Complexidade** | Nenhuma — é só inserir | Requer lógica de programação |
| **O que faz** | Substitui pelo valor do campo | Pode fazer cálculos, condicionais, lookups, loops |
| **Tratamento de vazio** | Exibe vazio ou valor padrão | Você controla com `IF/ELSE` |
| **Transformação** | Não transforma dados | Pode formatar, concatenar, converter |
| **Onde funciona** | E-mail, SMS, landing pages, CloudPages | E-mail, SMS, landing pages, CloudPages, automações |

### Exemplo prático da diferença

Usando **apenas personalization string**:

```html
Olá, %%FirstName%%! Seu saldo de cashback é R$ %%SaldoCashback%%.
```

Se o campo `FirstName` estiver vazio, o subscriber vê:

```
Olá, ! Seu saldo de cashback é R$ 150,00.
```

Estranho, né? Agora, usando **AMPScript** para tratar o cenário:

```html
%%[
SET @nome = AttributeValue("FirstName")
SET @saldo = AttributeValue("SaldoCashback")

IF EMPTY(@nome) THEN
  SET @saudacao = "Olá!"
ELSE
  SET @saudacao = CONCAT("Olá, ", @nome, "!")
ENDIF
]%%

%%=v(@saudacao)=%% Seu saldo de cashback é R$ %%=v(@saldo)=%%.
```

Agora, se o nome estiver vazio, o subscriber vê:

```
Olá! Seu saldo de cashback é R$ 150,00.
```

Muito melhor. A personalization string é rápida e prática, mas o AMPScript te dá **controle**. Na prática, você vai usar os dois juntos o tempo todo.

> **💡 Dica:** Se você ainda não viu como variáveis e condicionais funcionam no AMPScript, confira os guias de [variáveis](/docs/getting-started/variables) e [condicionais](/docs/getting-started/conditionals).

---

## Principais Strings de Dados do Subscriber

Essas são as personalization strings que puxam dados dos seus subscribers — seja de atributos do perfil (Profile Attributes) ou de colunas da Data Extension usada como sendable.

### Atributos padrão do subscriber

O Marketing Cloud tem alguns campos built-in que todo subscriber possui:

| Personalization String | O que retorna | Exemplo |
|---|---|---|
| `%%EmailAddr%%` | Endereço de e-mail do subscriber | joao.silva@email.com.br |
| `%%SubscriberKey%%` | Chave única do subscriber | 00123456 |
| `%%FirstName%%` | Primeiro nome (Profile Attribute) | João |
| `%%LastName%%` | Sobrenome (Profile Attribute) | Silva |

```html
<p>E-mail cadastrado: %%EmailAddr%%</p>
<p>Código do cliente: %%SubscriberKey%%</p>
```

### Campos de Data Extension

Se você envia a partir de uma **sendable Data Extension**, pode usar qualquer coluna como personalization string. Basta usar o **nome exato da coluna** entre os sinais de porcentagem.

Imagine que sua Data Extension `Clientes_Fidelidade` tem essas colunas:

| NomeCompleto | CPF | Pontos | NivelFidelidade | UltimaCompra |
|---|---|---|---|---|
| Maria Santos | 123.456.789-00 | 4500 | Ouro | 15/04/2025 |

Você pode usar todas elas no e-mail:

```html
<h1>Olá, %%NomeCompleto%%!</h1>

<p>Seu nível no programa Fidelidade MegaStore é: <strong>%%NivelFidelidade%%</strong></p>
<p>Você tem <strong>%%Pontos%% pontos</strong> acumulados.</p>
<p>Sua última compra foi em %%UltimaCompra%%.</p>

<p>Continue comprando e acumule ainda mais pontos!</p>
```

Maria veria:

```
Olá, Maria Santos!

Seu nível no programa Fidelidade MegaStore é: Ouro
Você tem 4500 pontos acumulados.
Sua última compra foi em 15/04/2025.
```

> **⚠️ Atenção:** O nome da personalization string precisa ser **exatamente igual** ao nome da coluna na Data Extension, incluindo maiúsculas/minúsculas e espaços. Se a coluna se chama `NomeCompleto`, usar `%%nomecompleto%%` pode não funcionar como esperado.

### Definindo valores padrão (Default Values)

Você pode definir um valor padrão para quando o campo estiver vazio. Isso é configurado direto na interface do Marketing Cloud, no **Profile Attribute** ou no **Attribute** da Data Extension, não na personalization string em si.

Mas existe um truque usando a sintaxe `AttributeValue` com AMPScript que é muito mais flexível — veremos isso [mais adiante neste guia](#como-usar-em-conjunto-com-ampscript).

---

## Strings de Sistema

Além dos dados do subscriber, o Marketing Cloud oferece **personalization strings de sistema** que retornam informações sobre o envio em si. Essas são extremamente úteis para tracking, troubleshooting e construção de links dinâmicos.

### Strings de identificação do envio

| Personalization String | O que retorna | Uso típico |
|---|---|---|
| `%%jobid%%` | ID único do job de envio | Tracking, logs |
| `%%listid%%` | ID da lista ou Data Extension usada | Identificação da audiência |
| `%%batchid%%` | ID do lote dentro do job | Debug de envios grandes |
| `%%subscriberID%%` | ID interno do subscriber no All Subscribers | Identificação única |
| `%%memberid%%` | MID da Business Unit que fez o envio | Ambientes multi-BU |
| `%%emailname_%%` | Nome do e-mail no Content Builder | Referência interna |

### Strings de links do sistema

| Personalization String | O que retorna |
|---|---|
| `%%unsub_center_url%%` | URL do centro de cancelamento de inscrição |
| `%%subscription_center_url%%` | URL do centro de gerenciamento de preferências |
| `%%profile_center_url%%` | URL do centro de atualização de perfil |
| `%%view_email_url%%` | URL para visualizar o e-mail no navegador |

### Exemplo prático: rodapé de e-mail

Esse é um cenário real que todo desenvolvedor SFMC vai encontrar — o rodapé do e-mail com os links obrigatórios:

```html
<table width="100%" style="background-color: #f5f5f5; padding: 20px;">
  <tr>
    <td style="text-align: center; font-size: 12px; color: #666;">
      <p>Este e-mail foi enviado para %%EmailAddr%%</p>
      <p>
        <a href="%%unsub_center_url%%">Cancelar inscrição</a> |
        <a href="%%subscription_center_url%%">Gerenciar preferências</a> |
        <a href="%%profile_center_url%%">Atualizar dados</a>
      </p>
      <p>
        <a href="%%view_email_url%%">Ver este e-mail no navegador</a>
      </p>
      <p style="font-size: 10px; color: #999;">
        Lojas Vitória LTDA - CNPJ: 12.345.678/0001-90<br>
        Rua das Flores, 1000 - São Paulo/SP - CEP 01234-567
      </p>
    </td>
  </tr>
</table>
```

### Exemplo prático: construindo URLs de tracking personalizado

As strings de sistema são muito úteis quando você precisa passar parâmetros para uma landing page ou CloudPage:

```html
<a href="https://cloud.megastore.com.br/oferta?
  sk=%%SubscriberKey%%
  &jid=%%jobid%%
  &lid=%%listid%%
  &bid=%%batchid%%">
  Ver oferta exclusiva
</a>
```

Isso permite que na CloudPage de destino você saiba exatamente quem clicou, de qual envio e de qual lista. Ótimo para relatórios e atribuição.

> **💡 Dica:** As personalization strings de sistema usam **letras minúsculas** (`%%jobid%%`, não `%%JobId%%`). Já as strings de dados do subscriber seguem o nome exato do campo.

---

## Como usar em conjunto com AMPScript

Aqui é onde as coisas ficam interessantes de verdade. Personalization strings e AMPScript se complementam perfeitamente.

### Capturando personalization strings em variáveis

Você pode pegar o valor de uma personalization string e guardar em uma [variável AMPScript](/docs/getting-started/variables) usando a função `AttributeValue`:

```ampscript
%%[
SET @nome = AttributeValue("FirstName")
SET @email = AttributeValue("EmailAddr")
SET @chave = AttributeValue("_subscriberkey")
SET @pontos = AttributeValue("Pontos")
]%%
```

> **💡 Dica:** `AttributeValue` é a forma mais segura de capturar valores. Se o campo não existir ou estiver vazio, ela retorna uma string vazia em vez de gerar erro. Isso é diferente de usar diretamente `%%FirstName%%`, que pode causar problemas em alguns cenários.

### Personalizando com lógica condicional

Um cenário clássico de Dia das Mães para a **FarmaRede**:

```html
%%[
SET @nome = AttributeValue("PrimeiroNome")
SET @genero = AttributeValue("Genero")
SET @cupom = AttributeValue("CupomExclusivo")

IF @genero == "F" THEN
  SET @titulo = "Feliz Dia das Mães!"
  SET @mensagem = CONCAT("Parabéns, ", @nome, "! Neste dia especial, preparamos uma oferta só para você.")
  SET @banner = "https://imagens.farmarede.com.br/diadasmaes_mae.jpg"
ELSE
  SET @titulo = "Surpreenda sua mãe!"
  SET @mensagem = CONCAT(@nome, ", que tal presentear quem mais te ama?")
  SET @banner = "https://imagens.farmarede.com.br/diadasmaes_presente.jpg"
ENDIF
]%%

<img src="%%=v(@banner)=%%" alt="%%=v(@titulo)=%%" width="600">

<h1>%%=v(@titulo)=%%</h1>
<p>%%=v(@mensagem)=%%</p>

%%[ IF NOT EMPTY(@cupom) THEN ]%%
  <div style="background: #e91e63; color: white; padding: 15px; text-align: center;">
    <p>Use o cupom <strong>%%=v(@cupom)=%%</strong> e ganhe 20% OFF em perfumaria!</p>
  </div>
%%[ ELSE ]%%
  <div style="background: #9c27b0; color: white; padding: 15px; text-align: center;">
    <p>Use o cupom <strong>MAMAE25</strong> e ganhe frete grátis!</p>
  </div>
%%[ ENDIF ]%%
```

Veja como combinamos dados da Data Extension (`PrimeiroNome`, `Genero`, `CupomExclusivo`) com lógica [condicional](/docs/getting-started/conditionals) para criar uma experiência totalmente diferente para cada subscriber.

### Usando strings de sistema com AMPScript

Você também pode capturar strings de sistema em variáveis e usá-las em lógica mais complexa:

```html
%%[
SET @jobId = jobid
SET @subscriberKey = _subscriberkey
SET @mid = memberid

/* Construindo um link de tracking personalizado para a Conecta Telecom */
SET @linkRecarga = CONCAT(
  "https://cloud.conectatelecom.com.br/recarga",
  "?sk=", @subscriberKey,
  "&job=", @jobId,
  "&mid=", @mid,
  "&utm_source=email",
  "&utm_medium=crm",
  "&utm_campaign=recarga_mensal"
)
]%%

<a href="%%=RedirectTo(@linkRecarga)=%%" style="background: #00c853; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
  Fazer recarga agora
</a>
```

> **⚠️ Atenção:** Quando captura strings de sistema dentro do bloco `%%[ ]%%`, use o nome **sem** os sinais de porcentagem: `SET @jobId = jobid`, não `SET @jobId = %%jobid%%`. Os `%%` só são necessários fora do bloco AMPScript.

### Misturando personalization strings e AMPScript no mesmo e-mail

É perfeitamente válido — e muito comum — usar os dois no mesmo e-mail:

```html
%%[
SET @nome = AttributeValue("PrimeiroNome")
SET @saldo = AttributeValue("SaldoCashback")

IF @saldo > 50 THEN
  SET @msgSaldo = "Você tem cashback suficiente para usar na próxima compra!"
  SET @corBadge = "#4caf50"
ELSE
  SET @msgSaldo = "Continue comprando para acumular mais cashback!"
  SET @corBadge = "#ff9800"
ENDIF
]%%

<h2>Olá, %%=v(@nome)=%%!</h2>

<div style="background: %%=v(@corBadge)=%%; color: white; padding: 10px; border-radius: 8px;">
  <p>💰 Seu cashback: <strong>R$ %%=FORMAT(@saldo, "N2")=%%</strong></p>
  <p>%%=v(@msgSaldo)=%%</p>
</div>

<!-- Aqui embaixo, usando personalization string pura — sem AMPScript -->
<hr>
<p style="font-size: 11px; color: #999;">
  E-mail enviado para %%EmailAddr%% | 
  <a href="%%unsub_center_url%%">Descadastrar</a>
</p>
```

Repare: no corpo usamos AMPScript para a lógica de cashback, e no rodapé usamos personalization strings puras (`%%EmailAddr%%` e `%%unsub_center_url%%`). Funciona perfeitamente junto.

---

## Limitações e onde não funcionam

Personalization strings são práticas, mas têm limites importantes que você precisa conhecer para evitar dores de cabeça.

### 1. Não fazem transformação de dados

Personalization strings exibem o valor **exatamente como está salvo**. Não dá para formatar, converter ou manipular.

```html
<!-- Isso não funciona — não tem como formatar a data -->
%%DataNascimento%%
<!-- Vai exibir: 3/15/1990 12:00:00 AM (formato do sistema) -->
```

Para formatar, você precisa de AMPScript:

```ampscript
%%[
SET @dataNasc = AttributeValue("DataNascimento")
SET @dataFormatada = FORMAT(@dataNasc, "dd/MM/yyyy")
]%%
```

```html
Data de nascimento: %%=v(@dataFormatada)=%%
<!-- Agora exibe: 15/03/1990 -->
```

### 2. Não funcionam dentro de blocos AMPScript

Dentro do bloco `%%[ ]%%`, use o nome do campo diretamente ou `AttributeValue()`:

```ampscript
%%[
/* ❌ ERRADO — não use %% dentro do bloco AMPScript */
SET @nome = %%FirstName%%

/* ✅ CORRETO */
SET @nome = FirstName
SET @nome = AttributeValue("FirstName")
]%%
```

### 3. Não funcionam em SQL Query Activities

Dentro de queries SQL em automações, personalization strings simplesmente não são resolvidas. Use os campos da Data Extension diretamente na query.

### 4. Campos inexistentes geram problemas

Se você usar uma personalization string que não corresponde a nenhum campo acessível, o comportamento pode variar:

- O e-mail pode mostrar a string literal: `%%CampoQueNaoExiste%%`
- Em alguns cenários, pode causar erro no envio

```html
<!-- Se "Apelido" não existir na sua DE ou nos Profile Attributes -->
Olá, %%Apelido%%!
<!-- Resultado possível: "Olá, %%Apelido%%!" ou "Olá, !" -->
```

> **⚠️ Atenção:** Sempre teste seus e-mails com um **Preview and Test** usando subscribers reais antes de enviar para a base toda. Isso evita surpresas com campos inexistentes ou vazios.

### 5. Sem lógica condicional

Não dá para fazer "se/então" com personalization strings puras. Precisa de uma valor? Ótimo, use `%%Campo%%`. Precisa decidir o que mostrar? Você precisa de [condicionais AMPScript](/docs/getting-started/conditionals).

```html
<!-- ❌ Impossível com personalization strings puras -->
%%IF FirstName IS NOT EMPTY THEN FirstName ELSE "Cliente"%% 

<!-- ✅ Correto — use AMPScript -->
%%[ IF NOT EMPTY(AttributeValue("FirstName")) THEN ]%%
  Olá, %%FirstName%%!
%%[ ELSE ]%%
  Olá, Cliente!
%%[ ENDIF ]%%
```

### 6. Cuidado com caracteres especiais nos nomes de campo

Se o nome da coluna na Data Extension tem espaços ou caracteres especiais, a personalization string pode não funcionar corretamente:

```html
<!-- Coluna chamada "Nome Completo" (com espaço) -->
%%Nome Completo%%  <!-- Pode não funcionar -->
```

A recomendação é: **sempre nomeie suas colunas sem espaços e sem caracteres especiais**. Use `NomeCompleto`, `PrimeiroNome`, `SaldoCashback` — formato camelCase ou PascalCase.

### Resumo rápido: quando usar o quê

| Situação | Use |
|---|---|
| Exibir um campo simples (nome, e-mail) | `%%Campo%%` — personalization string |
| Tratar campo vazio com fallback | AMPScript com `IF EMPTY()` |
| Formatar datas, números, moedas | AMPScript com `FORMAT()` |
| Construir URLs dinâmicas | AMPScript com `CONCAT()` e `RedirectTo()` |
| Links de unsub/preferências | `%%unsub_center_url%%` — personalization string |
| Lógica condicional (gênero, segmento, etc.) | AMPScript com `IF/ELSEIF/ELSE` |
| Exibir "Ver no navegador" | `%%view_email_url%%` — personalization string |

---

> **💡 Dica:** Personalization strings são seu ponto de entrada no mundo da personalização no SFMC. Domine-as primeiro, e depois vá evoluindo para AMPScript quando precisar de mais controle. Os dois trabalham juntos lindamente — e na prática do dia a dia você vai usar ambos em praticamente todo e-mail que criar.

Quer continuar aprendendo? Veja como adicionar [comentários](/docs/getting-started/comments) ao seu código para manter tudo organizado, ou volte para a [introdução](/docs/getting-started/introduction) para revisar os fundamentos.