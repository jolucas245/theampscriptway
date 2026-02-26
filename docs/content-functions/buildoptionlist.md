---
title: BuildOptionList
sidebar_label: BuildOptionList
description: Cria um conjunto de tags <option> HTML para uso em formulários de seleção em páginas web como CloudPages.
---

<!-- generated-by-script -->

# BuildOptionList

## Descrição

A função `BuildOptionList` gera um conjunto de tags `<option>` prontas para serem usadas dentro de um elemento `<select>` em formulários HTML. Ela é super útil quando você está criando formulários em CloudPages e precisa montar listas de seleção (dropdowns) de forma dinâmica. Você define qual opção vem selecionada por padrão e passa quantos pares de valor/texto quiser — a função monta todo o HTML das `<option>` pra você.

## Sintaxe

```ampscript
BuildOptionList(defaultSelection, option1Value, option1Text [, option2Value, option2Text, ...])
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| defaultSelection | String ou Número | Sim | O valor da opção que deve vir selecionada por padrão no dropdown. |
| option1Value | String | Sim | O identificador (valor) da primeira opção. Esse valor é atribuído ao atributo `value` da tag `<option>`. |
| option1Text | String | Sim | O texto de exibição da primeira opção, ou seja, o que o usuário vai ver no dropdown. |
| optionNValue | String | Não | O valor de opções adicionais. Você pode adicionar quantos pares valor/texto precisar. |
| optionNText | String | Não | O texto de exibição de opções adicionais. Cada opção exige um par valor + texto. |

## Exemplo básico

Imagine que você está criando um formulário numa CloudPage da **Lojas Vitória** onde o cliente escolhe o departamento de interesse:

```ampscript
%%[
  SET @ListaDepartamentos = BuildOptionList(
    2,
    "1", "Eletrônicos",
    "2", "Moda Feminina",
    "3", "Casa e Decoração"
  )
]%%

<form action="%%=RequestParameter('PAGEURL')=%%" method="post">
  <label for="departamento">Escolha seu departamento favorito:</label>
  <select name="departamento" id="departamento">
    %%=v(@ListaDepartamentos)=%%
  </select>
  <button type="submit">Enviar</button>
</form>
```

**Saída HTML gerada:**
```html
<label for="departamento">Escolha seu departamento favorito:</label>
<select name="departamento" id="departamento">
  <option value="1">Eletrônicos</option>
  <option value="2" selected>Moda Feminina</option>
  <option value="3">Casa e Decoração</option>
</select>
```

Repare que a opção "Moda Feminina" (valor `2`) já vem selecionada, porque passamos `2` como `defaultSelection`.

## Exemplo avançado

Agora um cenário mais real: uma CloudPage do **Banco Meridional** onde o cliente atualiza suas preferências de contato. A preferência atual do cliente está salva numa Data Extension, e queremos que o dropdown já venha com a opção correta selecionada:

```ampscript
%%[
  /* Busca a preferência atual do cliente na DE */
  SET @EmailCliente = RequestParameter("email")
  SET @PreferenciaAtual = Lookup(
    "PreferenciasClientes",
    "CanalPreferido",
    "Email", @EmailCliente
  )

  /* Se não tiver preferência salva, usa "email" como padrão */
  IF Empty(@PreferenciaAtual) THEN
    SET @PreferenciaAtual = "email"
  ENDIF

  /* Monta a lista de opções de canal de contato */
  SET @OpcoesCanal = BuildOptionList(
    @PreferenciaAtual,
    "email", "E-mail",
    "sms", "SMS",
    "whatsapp", "WhatsApp",
    "push", "Notificação Push"
  )

  /* Monta a lista de frequência de comunicação */
  SET @FrequenciaAtual = Lookup(
    "PreferenciasClientes",
    "Frequencia",
    "Email", @EmailCliente
  )

  IF Empty(@FrequenciaAtual) THEN
    SET @FrequenciaAtual = "semanal"
  ENDIF

  SET @OpcoesFrequencia = BuildOptionList(
    @FrequenciaAtual,
    "diaria", "Diária",
    "semanal", "Semanal",
    "quinzenal", "Quinzenal",
    "mensal", "Mensal"
  )
]%%

<h2>Atualize suas preferências - Banco Meridional</h2>
<form action="%%=CloudPagesURL(456)=%%" method="post">
  <input type="hidden" name="email" value="%%=v(@EmailCliente)=%%">

  <label for="canal">Canal de contato preferido:</label>
  <select name="canal" id="canal">
    %%=v(@OpcoesCanal)=%%
  </select>

  <br><br>

  <label for="frequencia">Frequência de comunicação:</label>
  <select name="frequencia" id="frequencia">
    %%=v(@OpcoesFrequencia)=%%
  </select>

  <br><br>
  <button type="submit">Salvar preferências</button>
</form>
```

**Saída HTML gerada (supondo que o cliente tenha "whatsapp" e "quinzenal" salvos):**
```html
<h2>Atualize suas preferências - Banco Meridional</h2>
<form action="https://cloud.email.bancomeridional.com.br/pagina456" method="post">
  <input type="hidden" name="email" value="carlos.oliveira@email.com.br">

  <label for="canal">Canal de contato preferido:</label>
  <select name="canal" id="canal">
    <option value="email">E-mail</option>
    <option value="sms">SMS</option>
    <option value="whatsapp" selected>WhatsApp</option>
    <option value="push">Notificação Push</option>
  </select>

  <br><br>

  <label for="frequencia">Frequência de comunicação:</label>
  <select name="frequencia" id="frequencia">
    <option value="diaria">Diária</option>
    <option value="semanal">Semanal</option>
    <option value="quinzenal" selected>Quinzenal</option>
    <option value="mensal">Mensal</option>
  </select>

  <br><br>
  <button type="submit">Salvar preferências</button>
</form>
```

## Observações

- Essa função é **projetada para uso em páginas web** (CloudPages, Landing Pages, microsites). Não faz sentido usá-la dentro de e-mails, já que formulários `<select>` não funcionam em clientes de e-mail.
- Cada opção na lista exige **dois parâmetros**: um valor (`value`) e um texto de exibição. Os parâmetros sempre vêm em pares depois do `defaultSelection`.
- Você pode criar **quantas opções precisar** — basta continuar adicionando pares de valor/texto ao final da chamada da função.
- O parâmetro `defaultSelection` aceita tanto **string quanto número**. A função compara esse valor com os `optionValue` para determinar qual opção recebe o atributo `selected`.
- Se o valor de `defaultSelection` não corresponder a nenhum dos valores das opções, nenhuma opção virá pré-selecionada.
- Para exibir o resultado gerado, use a função [V](../utility-functions/v.md) dentro da inline notation `%%=v(@suaVariavel)=%%`.
- Se você precisa montar opções **dinamicamente** a partir de dados de uma Data Extension (em vez de valores fixos no código), considere usar [LookupRows](../data-extension-functions/lookuprows.md) com um loop `FOR` para construir o HTML manualmente, pois `BuildOptionList` trabalha apenas com valores estáticos passados diretamente como parâmetros.

## Funções relacionadas

- [V](../utility-functions/v.md) — Exibe o valor de uma variável; essencial para renderizar o resultado de `BuildOptionList` no HTML.
- [RequestParameter](../sites-functions/requestparameter.md) — Captura valores enviados por formulários em CloudPages (como os valores selecionados no dropdown).
- [CloudPagesURL](../sites-functions/cloudpagesurl.md) — Gera URLs seguras para CloudPages, útil para o `action` dos formulários.
- [Lookup](../data-extension-functions/lookup.md) — Busca um valor em uma Data Extension para usar como seleção padrão.
- [LookupRows](../data-extension-functions/lookuprows.md) — Busca múltiplas linhas de uma Data Extension; útil quando você precisa montar dropdowns dinâmicos.
- [Concat](../string-functions/concat.md) — Concatena strings; pode ser útil para montar valores ou textos de opções dinamicamente.
- [BuildRowsetFromString](../content-functions/buildrowsetfromstring.md) — Cria um rowset a partir de uma string delimitada, alternativa para construir listas dinâmicas.
- [TreatAsContent](../utility-functions/treatascontent.md) — Processa uma string como conteúdo AMPscript/HTML; outra forma de renderizar HTML gerado dinamicamente.