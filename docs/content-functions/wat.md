---
title: WAT
sidebar_label: WAT
description: Retorna os valores do parâmetro de Web Analytics Tracking (WAT) com a chave externa especificada, permitindo adicionar parâmetros de rastreamento de analytics aos links dos seus emails.
---

<!-- generated-by-script -->

# WAT

## Descrição

A função `WAT` retorna os valores de um conjunto de parâmetros de Web Analytics Tracking (rastreamento de analytics web) a partir de uma chave externa especificada. Ela é usada para injetar parâmetros de rastreamento — como UTMs ou tags de ferramentas de analytics — nos links dos seus emails, com base nas configurações feitas no Web Analytics Connector do Marketing Cloud. Você pode passar valores que serão substituídos nas referências à função `WATP()` dentro do conjunto de parâmetros de rastreamento configurado no Sender Profile.

## Sintaxe

```ampscript
WAT("parameterSetKey", "parameterValue1")
WAT("parameterSetKey", "parameterValue1", "parameterValue2", ...)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|----------------|--------|-------------|----------------|
| parameterSetKey | String | Sim | A chave externa do conjunto de parâmetros WAT configurado no Web Analytics Connector. |
| parameterValue1 | String | Sim | Valor que será substituído na referência `WATP(1)` dentro do conjunto de parâmetros de rastreamento. |
| parameterValue2... | String | Não | Valores adicionais opcionais que serão substituídos nas referências `WATP(2)`, `WATP(3)`, etc., respectivamente. |

## Exemplo básico

Imagine que você tem um conjunto de parâmetros de analytics configurado com a chave `"omniture_vitoria"` no Web Analytics Connector. Dentro desse conjunto, existe uma referência a `WATP(1)`. Ao chamar a função, o valor `"1234"` substitui essa referência:

```ampscript
%%=WAT("omniture_vitoria", "1234")=%%
```

**Saída:**

```
utm_source=email&utm_campaign=1234
```

> ⚠️ A saída real depende de como o conjunto de parâmetros de rastreamento foi configurado no Sender Profile / Web Analytics Connector da sua conta. O exemplo acima é ilustrativo.

## Exemplo avançado

Agora imagine um cenário onde a Lojas Vitória configurou um conjunto de parâmetros de analytics com a chave `"analytics_lojasvitoria"` que tem duas referências: `WATP(1)` para o ID da campanha e `WATP(2)` para o segmento do público. Você quer rastrear uma campanha de Black Friday para o segmento de clientes VIP:

```ampscript
%%[
  /* 
    No Web Analytics Connector, o parâmetro set "analytics_lojasvitoria" 
    está configurado com algo como:
    utm_source=email&utm_campaign=WATP(1)&utm_segment=WATP(2)
  */
  
  VAR @trackingParams
  SET @trackingParams = WAT("analytics_lojasvitoria", "blackfriday2024", "vip")
]%%

<!-- O link do email terá os parâmetros de analytics anexados automaticamente -->
<a href="https://www.lojasvitoria.com.br/ofertas">
  Confira as ofertas de Black Friday!
</a>

<!-- Ou você pode usar o valor retornado diretamente -->
Parâmetros gerados: %%=v(@trackingParams)=%%
```

**Saída:**

```
Parâmetros gerados: utm_source=email&utm_campaign=blackfriday2024&utm_segment=vip
```

> ⚠️ Novamente, a saída depende totalmente da configuração feita no Web Analytics Connector. O formato acima é apenas ilustrativo.

## Observações

- **Configuração prévia obrigatória:** para usar `WAT`, você precisa ter o Web Analytics Connector configurado na sua conta do Marketing Cloud. As chaves externas dos conjuntos de parâmetros são definidas lá. Entre em contato com o suporte da Salesforce para configurar os valores das chaves externas.
- **Apenas valores constantes ou numéricos:** os parâmetros passados para `WAT` devem ser valores constantes ou numéricos. Variáveis, atributos, campos e valores de funções **não permitem** resolução em nível de job para os parâmetros de query string desejados nos links. Essa é uma limitação importante — se você tentar passar uma variável do tipo `@campanha`, ela pode não ser resolvida corretamente.
- **Relação com `WATP`:** a função `WATP` é usada **dentro** do conjunto de parâmetros de rastreamento (configurado no Sender Profile) como placeholder. A função `WAT` substitui esses placeholders pelos valores que você fornece. Por exemplo, `WATP(1)` é substituído pelo `parameterValue1`, `WATP(2)` pelo `parameterValue2`, e assim por diante.
- **Contexto de uso:** essa função é usada tipicamente em emails, onde o Web Analytics Connector atua sobre os links rastreados.
- **Função pouco comum:** a `WAT` é uma função bastante específica e raramente utilizada no dia a dia. A maioria dos cenários de rastreamento de analytics pode ser resolvida com parâmetros UTM adicionados diretamente nos links ou via configuração do Google Analytics 360 / Web Analytics Connector sem uso explícito de AMPscript.
- **Número de parâmetros variável:** você pode passar quantos valores adicionais precisar após o `parameterValue1`. Cada valor adicional substitui o `WATP` correspondente (ordinal) no conjunto de parâmetros.

## Funções relacionadas

- [Concat](../string-functions/concat.md) — útil para montar strings de parâmetros de rastreamento manualmente quando WAT não se aplica
- [URLEncode](../string-functions/urlencode.md) — codifica valores para uso seguro em URLs e query strings
- [RedirectTo](../http-functions/redirectto.md) — redireciona para uma URL, útil quando você precisa controlar links com parâmetros dinâmicos
- [CloudPagesURL](../sites-functions/cloudpagesurl.md) — gera URLs de CloudPages com parâmetros criptografados
- [Replace](../string-functions/replace.md) — substitui valores em strings, alternativa manual para montar parâmetros de tracking