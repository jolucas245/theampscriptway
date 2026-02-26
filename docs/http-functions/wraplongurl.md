---
title: WrapLongURL
sidebar_label: WrapLongURL
description: Encurta URLs com mais de 975 caracteres para contornar uma limitação conhecida do Microsoft Outlook 2007–2013.
---

<!-- generated-by-script -->

# WrapLongURL

## Descrição

A função `WrapLongURL` recebe uma URL e, se ela tiver mais de 975 caracteres, retorna uma versão encurtada que redireciona pelos servidores do Marketing Cloud. Se a URL tiver 975 caracteres ou menos, ela é retornada sem alteração. Essa função existe para contornar uma limitação conhecida do Microsoft Outlook 2007–2013, que truncava URLs muito longas. É especialmente útil quando você monta URLs dinâmicas com muitos parâmetros de personalização (tracking, dados do assinante, etc.) e precisa garantir que elas funcionem corretamente nesses clientes de email.

## Sintaxe

```ampscript
WrapLongURL(urlParaEncurtar)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| urlParaEncurtar | string | Sim | A URL que você deseja encurtar. Se tiver mais de 975 caracteres, será retornada uma URL encurtada que redireciona pelos servidores do Marketing Cloud. Caso contrário, a URL original é retornada sem alteração. |

## Exemplo básico

Imagine que você tem um email da **MegaStore** com uma imagem de banner personalizada. A URL da imagem é gerada dinamicamente e pode ficar muito longa dependendo dos parâmetros de personalização:

```ampscript
%%[
VAR @urlImagem
SET @urlImagem = "https://imagens.megastore.com.br/banners/blackfriday2024?nome=JoaoSilva&cpf=12345678900&email=joao.silva%40email.com.br&segmento=premium&cidade=SaoPaulo&estado=SP&cep=01310100&telefone=11999998888&pontos=4500&cashback=150&ultimacompra=25112024&produto1=notebook-gamer-16gb&produto2=mouse-sem-fio&produto3=teclado-mecanico&produto4=monitor-27pol&produto5=headset-bluetooth&cupom=BFSILVAPREMIUM2024&frete=gratis&parcelas=12&bandeira=visa&loja=megastore-paulista&campanha=bf2024-premium-eletronicos-sp&versao=A&tracking=abc123def456ghi789jkl012mno345pqr678stu901vwx234yza567bcd890efg123hij456klm789nop012qrs345tuv678wxy901zab234cde567fgh890ijk123lmn456opq789rst012uvw345xyz678abc901def234ghi567jkl890mno123pqr456stu789vwx012yza345bcd678efg901hij234klm567nop890qrs123tuv456wxy789zab012cde345fgh678ijk901lmn234opq567rst890uvw123xyz456abc789def012ghi345jkl678mno901pqr234"
]%%

<img src="%%=WrapLongURL(@urlImagem)=%%" alt="Ofertas Black Friday MegaStore" width="600" />
```

**Saída:**

Como a URL tem mais de 975 caracteres, a função retorna uma URL encurtada que redireciona pelos servidores do Marketing Cloud:

```html
<img src="https://click.s1.sfmc-content.com/r/?id=abc123..." alt="Ofertas Black Friday MegaStore" width="600" />
```

Se a URL tivesse 975 caracteres ou menos, seria retornada exatamente como foi passada.

## Exemplo avançado

Nesse cenário, a **Lojas Vitória** está enviando um email de Dia das Mães com um pixel de tracking personalizado. A URL é montada dinamicamente com dados do assinante vindos de uma Data Extension, e pode estourar o limite de 975 caracteres dependendo da quantidade de parâmetros:

```ampscript
%%[
VAR @nome, @email, @cpf, @segmento, @cidade, @estado, @pontos
VAR @urlBase, @parametros, @urlCompleta, @urlFinal, @tamanhoUrl

SET @nome = AttributeValue("NomeCompleto")
SET @email = AttributeValue("EmailAddress")
SET @cpf = AttributeValue("CPF")
SET @segmento = AttributeValue("Segmento")
SET @cidade = AttributeValue("Cidade")
SET @estado = AttributeValue("Estado")
SET @pontos = AttributeValue("PontosAcumulados")

SET @urlBase = "https://tracking.lojasvitoria.com.br/pixel.gif"

SET @parametros = Concat(
  "?nome=", URLEncode(@nome, 1, 1),
  "&email=", URLEncode(@email, 1, 1),
  "&cpf=", URLEncode(@cpf, 1, 1),
  "&segmento=", URLEncode(@segmento, 1, 1),
  "&cidade=", URLEncode(@cidade, 1, 1),
  "&estado=", URLEncode(@estado, 1, 1),
  "&pontos=", @pontos,
  "&campanha=diadasmaes2024-premium-joias-cosmeticos-moda-acessorios",
  "&promo=fretegratis299&cashback=50reais",
  "&versao=B&loja=vitoria-centro-sp",
  "&tracking_id=", GUID(),
  "&extra_data=lv2024maes-seg-premium-regiao-sudeste-sp-capital-zona-sul-loja-fisica-e-online-multicanal-retargeting-email-personalizado-v2-teste-ab-grupo-controle-false-engagement-score-alto-propensao-compra-elevada-ticket-medio-acima-500-reais-frequencia-mensal-categoria-preferida-cosmeticos-marca-preferida-importada-ultimo-canal-app-dispositivo-mobile-sistema-ios-navegador-safari-resolucao-1170x2532-horario-preferido-noite-dia-semana-preferido-sabado"
)

SET @urlCompleta = Concat(@urlBase, @parametros)
SET @tamanhoUrl = Length(@urlCompleta)
SET @urlFinal = WrapLongURL(@urlCompleta)
]%%

<!-- Debug: URL original tem %%=v(@tamanhoUrl)=%% caracteres -->

<!-- Pixel de tracking -->
<img src="%%=v(@urlFinal)=%%" width="1" height="1" alt="" style="display:none;" />

%%[ IF @tamanhoUrl > 975 THEN ]%%
  <!-- URL foi encurtada pelo WrapLongURL -->
%%[ ELSE ]%%
  <!-- URL original mantida (975 caracteres ou menos) -->
%%[ ENDIF ]%%
```

**Saída:**

Se a URL montada tiver mais de 975 caracteres (o que é bem provável nesse caso):

```html
<!-- Debug: URL original tem 1087 caracteres -->

<!-- Pixel de tracking -->
<img src="https://click.s1.sfmc-content.com/r/?id=xyz789..." width="1" height="1" alt="" style="display:none;" />

<!-- URL foi encurtada pelo WrapLongURL -->
```

## Observações

- **Limitação do Outlook:** Essa função foi criada especificamente para contornar um problema do Microsoft Outlook 2007–2013, que truncava URLs com mais de 975 caracteres. Se o seu público não usa essas versões do Outlook, talvez você não precise dela — mas não custa usar como precaução.
- **Limite de 975 caracteres:** Se a URL tiver 975 caracteres ou menos, a função retorna a URL original sem nenhuma modificação. O encurtamento só acontece quando a URL ultrapassa esse limite.
- **Incompatível com Always On Clicks:** URLs encurtadas por essa função **não funcionam** com o recurso Always On Clicks. Fique atento a isso se você usa essa feature na sua conta.
- **Dependência do Member DB:** Se o banco de dados do membro (Member DB) estiver indisponível no momento do envio, a função retorna um erro. Isso é raro, mas vale saber.
- **Redirecionamento:** As URLs encurtadas passam pelos servidores do Marketing Cloud antes de chegar ao destino final. Isso pode adicionar uma pequena latência no carregamento.
- **Uso principal em emails:** O cenário mais comum é em tags `<img>` dentro de emails, onde URLs com muitos parâmetros de tracking podem facilmente ultrapassar 975 caracteres. Também pode ser útil em `<a href="">` quando os links são muito longos.
- **Monte a URL antes:** Lembre-se de montar a URL completa (com todos os parâmetros) antes de passá-la para `WrapLongURL`. A função espera receber a URL final já pronta.

## Funções relacionadas

- [Concat](../string-functions/concat.md) — para montar URLs longas concatenando diversos parâmetros dinâmicos
- [URLEncode](../string-functions/urlencode.md) — para codificar valores que serão usados como parâmetros na URL
- [Length](../string-functions/length.md) — para verificar o tamanho da URL antes de decidir se precisa encurtar
- [RedirectTo](../http-functions/redirectto.md) — para redirecionar o assinante para uma URL construída dinamicamente
- [HTTPGet](../http-functions/httpget.md) — para fazer requisições GET a URLs externas
- [CloudPagesURL](../sites-functions/cloudpagesurl.md) — para gerar URLs de CloudPages com parâmetros criptografados
- [AttributeValue](../utility-functions/attributevalue.md) — para recuperar valores de atributos do assinante de forma segura
- [GUID](../utility-functions/guid.md) — para gerar identificadores únicos usados em parâmetros de tracking