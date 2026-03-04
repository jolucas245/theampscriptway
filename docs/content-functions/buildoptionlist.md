---
title: BuildOptionList
sidebar_label: BuildOptionList
description: Gera um conjunto de tags HTML <option> para uso em formulários web, como dropdowns em CloudPages.
---

# BuildOptionList

## Descrição

Cria um conjunto de tags `<option>` prontas para serem integradas em formulários HTML em páginas web. É a função ideal quando você precisa montar dropdowns (`<select>`) em CloudPages — como formulários de cadastro, pesquisas de satisfação ou preference centers. O retorno é uma string com as tags `<option>` geradas, já com a opção padrão pré-selecionada.

## Sintaxe

```ampscript
BuildOptionList(defaultSelection, option1Value, option1Text [, option2Value, option2Text ...])
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| defaultSelection | string ou number | Sim | A opção que será selecionada por padrão no dropdown. |
| option1Value | string | Sim | Identificador da primeira opção. Define o atributo `value` da tag `<option>`. |
| option1Text | string | Sim | Texto exibido para o usuário na primeira opção. Cada opção da lista requer um par de valor e texto. Você pode adicionar quantas opções precisar, acrescentando pares `optionNValue, optionNText` ao final da função. |

## Exemplo básico

Formulário em uma CloudPage para o cliente da Lojas Vitória escolher a cidade de entrega:

```ampscript
%%[

SET @listaCidades = BuildOptionList(
  "SP",
  "SP", "São Paulo",
  "RJ", "Rio de Janeiro",
  "BH", "Belo Horizonte",
  "CWB", "Curitiba"
)

]%%

<form action="%%=CloudPagesURL(456)=%%" method="post">
  <label for="cidade">Escolha sua cidade de entrega:</label>
  <select name="cidade" id="cidade">
    %%=v(@listaCidades)=%%
  </select>
  <button type="submit">Confirmar</button>
</form>
```

**Saída:**
```html
<form action="https://cloud.e.lojasvitoria.com.br/pagina" method="post">
  <label for="cidade">Escolha sua cidade de entrega:</label>
  <select name="cidade" id="cidade">
    <option value="SP" selected>São Paulo</option>
    <option value="RJ">Rio de Janeiro</option>
    <option value="BH">Belo Horizonte</option>
    <option value="CWB">Curitiba</option>
  </select>
  <button type="submit">Confirmar</button>
</form>
```

## Exemplo avançado

Preference Center da Conecta Telecom onde o assinante escolhe com que frequência quer receber comunicações. O valor padrão é recuperado da Data Extension de preferências do cliente, garantindo que a seleção atual dele já apareça marcada ao abrir a página:

```ampscript
%%[

SET @email = RequestParameter("email")
SET @frequenciaAtual = Lookup("PreferenciasClientes", "Frequencia", "Email", @email)

IF Empty(@frequenciaAtual) THEN
  SET @frequenciaAtual = "semanal"
ENDIF

SET @opcoesFrequencia = BuildOptionList(
  @frequenciaAtual,
  "diario", "Diário - todos os dias úteis",
  "semanal", "Semanal - uma vez por semana",
  "quinzenal", "Quinzenal - a cada 15 dias",
  "mensal", "Mensal - uma vez por mês"
)

]%%

<h2>Olá! Atualize suas preferências de comunicação</h2>
<form action="%%=CloudPagesURL(789)=%%" method="post">
  <input type="hidden" name="email" value="%%=v(@email)=%%" />

  <label for="frequencia">Com que frequência deseja receber nossas ofertas?</label>
  <select name="frequencia" id="frequencia">
    %%=v(@opcoesFrequencia)=%%
  </select>

  <button type="submit">Salvar preferências</button>
</form>
```

**Saída (considerando que o cliente tinha "quinzenal" salvo):**
```html
<h2>Olá! Atualize suas preferências de comunicação</h2>
<form action="https://cloud.e.conectatelecom.com.br/preferencias" method="post">
  <input type="hidden" name="email" value="joao.silva@email.com.br" />

  <label for="frequencia">Com que frequência deseja receber nossas ofertas?</label>
  <select name="frequencia" id="frequencia">
    <option value="diario">Diário - todos os dias úteis</option>
    <option value="semanal">Semanal - uma vez por semana</option>
    <option value="quinzenal" selected>Quinzenal - a cada 15 dias</option>
    <option value="mensal">Mensal - uma vez por mês</option>
  </select>

  <button type="submit">Salvar preferências</button>
</form>
```

## Observações

- A função gera tags `<option>` para integração em formulários HTML em páginas web (CloudPages). Ela **não** gera o `<select>` — você precisa envolvê-la manualmente com as tags `<select>`.

- Cada opção da lista exige **dois parâmetros**: o valor (`value`) e o texto de exibição. Você pode criar quantas opções precisar, basta acrescentar pares ao final da chamada.

- O parâmetro `defaultSelection` define qual opção aparecerá com o atributo `selected`. Isso é especialmente útil em preference centers, onde você quer que o formulário já reflita a escolha atual do cliente.

> **💡 Dica:** Combine com [Lookup](../data-extension-functions/lookup.md) para buscar a preferência atual do assinante e passá-la como `defaultSelection`. Assim o dropdown já abre na opção certa, melhorando a experiência do usuário.

> **💡 Dica:** Após o envio do formulário, use [RequestParameter](../sites-functions/requestparameter.md) na página de destino para capturar o valor selecionado, e [UpsertDE](../data-extension-functions/upsertde.md) para salvar a escolha.

## Funções relacionadas

- [CloudPagesURL](../sites-functions/cloudpagesurl.md) — para gerar a URL de destino do formulário
- [RequestParameter](../sites-functions/requestparameter.md) — para capturar o valor enviado pelo formulário
- [Lookup](../data-extension-functions/lookup.md) — para buscar a seleção atual do assinante em uma Data Extension
- [UpsertDE](../data-extension-functions/upsertde.md) — para salvar a escolha do formulário na Data Extension
- [V](../utility-functions/v.md) — para exibir o resultado da função no HTML