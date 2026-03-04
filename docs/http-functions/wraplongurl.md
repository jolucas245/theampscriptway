---
title: WrapLongURL
sidebar_label: WrapLongURL
description: Encurta URLs com mais de 975 caracteres para contornar limitações do Microsoft Outlook 2007–2013.
---

# WrapLongURL

## Descrição

A função `WrapLongURL` resolve um problema bem específico: URLs muito longas (acima de 975 caracteres) que quebram no Microsoft Outlook 2007–2013. Quando a URL ultrapassa esse limite, a função retorna uma versão encurtada que redireciona pelos servidores do Marketing Cloud. Se a URL tiver menos de 975 caracteres, ela é devolvida sem nenhuma alteração.

## Sintaxe

```ampscript
WrapLongURL(urlToShorten)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| urlToShorten | String | Sim | A URL que você deseja encurtar. |

## Exemplo básico

Usando `WrapLongURL` para garantir que uma URL longa de imagem dinâmica renderize corretamente no Outlook:

```ampscript
%%[
VAR @urlImagem, @urlFinal
SET @urlImagem = "https://img.megastore.com.br/produtos/render?sku=PROD-98712&cliente=joao-silva&segmento=eletronicos&campanha=black-friday-2024&utm_source=sfmc&utm_medium=email&utm_campaign=bf2024_eletronicos_sp&utm_content=hero_banner&utm_term=smartphone&personalizado=true&regiao=sudeste&cidade=sao-paulo&estado=sp&cep=01310-100&formato=jpg&largura=600&altura=300&qualidade=85&cache=20241125&token=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4i5j6k7l8m9n0o1p2q3r4s5t6u7v8w9x0y1z2a3b4c5d6e7f8g9h0i1j2k3l4m5n6o7p8q9r0s1t2u3v4w5x6y7z8a9b0c1d2e3f4g5h6i7j8k9l0m1n2o3p4q5r6s7t8u9v0w1x2y3z4a5b6c7d8e9f0g1h2i3j4k5l6m7n8o9p0q1r2s3t4u5v6w7x8y9z0a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4i5j6k7l8m9n0o1p2q3r4s5t6u7v8w9x0y1z2a3b4c5d6e7f8g9h0i1j2k3l4m5n6o7p8q9r0s1t2u3v4w5x6y7z8a9b0c1d2e3f4g5h6i7j8k9l0m1n2o3"
SET @urlFinal = WrapLongURL(@urlImagem)
]%%

<img src="%%=v(@urlFinal)=%%" alt="Oferta Black Friday - MegaStore" width="600" />
```

**Saída:**
```html
<img src="https://click.sfmc.megastore.com.br/shortened/abc123xyz" alt="Oferta Black Friday - MegaStore" width="600" />
```

## Exemplo avançado

Em uma régua de relacionamento da Lojas Vitória, o e-mail de carrinho abandonado monta uma URL de imagem dinâmica com diversos parâmetros de personalização. Usamos `WrapLongURL` combinado com [Concat](../string-functions/concat.md) para construir e proteger a URL:

```ampscript
%%[
VAR @nome, @sku, @urlBase, @parametros, @urlCompleta, @urlSegura

SET @nome = "Maria Santos"
SET @sku = "VEST-44210"

SET @urlBase = "https://img.lojasvitoria.com.br/api/render"

SET @parametros = Concat(
  "?sku=", @sku,
  "&cliente=", Replace(@nome, " ", "-"),
  "&campanha=carrinho-abandonado-2024",
  "&utm_source=sfmc&utm_medium=email&utm_campaign=cart_abandon_reengajamento",
  "&utm_content=produto_principal&utm_term=vestido",
  "&regiao=sudeste&cidade=belo-horizonte&estado=mg",
  "&formato=jpg&largura=600&altura=400&qualidade=90",
  "&sessao=s9f8e7d6c5b4a3z2y1x0w9v8u7t6s5r4q3p2o1n0m9l8k7j6i5h4g3f2e1d0",
  "&preco=R%24+299%2C90&parcelas=3x+R%24+99%2C97",
  "&token=abc123def456ghi789jkl012mno345pqr678stu901vwx234yza567bcd890efg123hij456klm789nop012qrs345tuv678wxy901zab234cde567fgh890ijk123lmn456opq789rst012uvw345xyz678abc901def234ghi567jkl890mno123pqr456stu789vwx012yza345bcd678efg901hij234klm567nop890qrs123tuv456wxy789zab012cde345fgh678ijk901lmn234opq567rst890uvw123xyz456abc789def012ghi345jkl678mno901pqr234stu567vwx890yza"
)

SET @urlCompleta = Concat(@urlBase, @parametros)
SET @urlSegura = WrapLongURL(@urlCompleta)
]%%

<a href="https://www.lojasvitoria.com.br/carrinho">
  <img src="%%=v(@urlSegura)=%%" alt="Seu vestido está esperando, %%=v(@nome)=%%!" width="600" />
</a>
```

**Saída:**
```html
<a href="https://www.lojasvitoria.com.br/carrinho">
  <img src="https://click.sfmc.lojasvitoria.com.br/shortened/def456uvw" alt="Seu vestido está esperando, Maria Santos!" width="600" />
</a>
```

## Observações

> **⚠️ Atenção:** URLs encurtadas com `WrapLongURL` **não são compatíveis com Always On Clicks**. Se você usa esse recurso de rastreamento na sua conta, considere esse conflito antes de aplicar a função.

> **⚠️ Atenção:** Se o Member DB (banco de dados da sua BU) estiver indisponível no momento do envio, a função retorna um erro. Em réguas críticas, leve isso em consideração.

- A função só altera URLs com **mais de 975 caracteres**. Abaixo desse limite, a URL original é retornada sem modificação — então é seguro aplicar `WrapLongURL` em qualquer URL sem se preocupar se ela vai ser encurtada desnecessariamente.
- O caso de uso principal é para tags `<img>` onde a URL da imagem é montada dinamicamente com muitos parâmetros (personalização, tracking, tokens). Links `<a>` normalmente são tratados pelo próprio link tracking do SFMC, mas imagens com URLs longas podem quebrar silenciosamente no Outlook.
- A URL encurtada redireciona pelos servidores do Marketing Cloud Engagement antes de chegar ao destino final.

> **💡 Dica:** No dia a dia, URLs com mais de 975 caracteres são raras em links comuns. Elas aparecem mais em cenários de imagens dinâmicas com muitos parâmetros de personalização ou tokens de segurança longos. Se você monta URLs dinamicamente com [Concat](../string-functions/concat.md) e muitas variáveis, fique atento.

## Funções relacionadas

- [Concat](../string-functions/concat.md) — para construir URLs dinâmicas concatenando parâmetros
- [URLEncode](../string-functions/urlencode.md) — para codificar valores antes de incluí-los como query parameters
- [RedirectTo](../http-functions/redirectto.md) — para redirecionamentos rastreados em links clicáveis
- [Replace](../string-functions/replace.md) — útil para sanitizar valores antes de incluí-los em URLs