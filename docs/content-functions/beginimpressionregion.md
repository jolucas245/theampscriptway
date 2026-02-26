---
title: BeginImpressionRegion
sidebar_label: BeginImpressionRegion
description: Marca o início de uma região de rastreamento de impressões em emails enviados pelo Marketing Cloud.
---

<!-- generated-by-script -->

# BeginImpressionRegion

## Descrição

A função `BeginImpressionRegion` marca o início de uma região do seu email que será rastreada pelo sistema de impression tracking (rastreamento de impressões) do Marketing Cloud. Com ela, você consegue identificar quais blocos de conteúdo do email estão sendo visualizados pelos seus assinantes. Isso é super útil pra entender qual seção do email (header, banner promocional, rodapé, etc.) está gerando mais engajamento. A função não produz nenhuma saída visível no email — ela funciona apenas como um marcador interno para o sistema de rastreamento.

## Sintaxe

```ampscript
BeginImpressionRegion("regionName")
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|------------|--------|-------------|-----------|
| regionName | String | Sim | O nome que você quer dar para a região de impressão. Esse nome vai aparecer nos relatórios de rastreamento para você identificar qual seção do email foi visualizada. |

## Exemplo básico

```ampscript
%%[
BeginImpressionRegion("Header")
]%%

<table width="100%" bgcolor="#1a1a2e">
  <tr>
    <td style="padding: 20px; text-align: center;">
      <img src="https://www.megastore.com.br/images/logo.png" alt="MegaStore" />
      <h1 style="color: #ffffff;">Bem-vindo à MegaStore!</h1>
    </td>
  </tr>
</table>

%%[
EndImpressionRegion()
]%%
```

**Saída:**
```
(Nenhuma saída visível — o HTML do header é renderizado normalmente.
A região "Header" é registrada internamente para rastreamento de impressões.)
```

## Exemplo avançado

Imagine que você está montando um email de campanha de **Black Friday** para a loja fictícia "Lojas Vitória". Você quer rastrear separadamente o banner principal, a seção de ofertas personalizadas e o rodapé, para depois analisar qual parte do email teve mais visualizações:

```ampscript
%%[
VAR @primeiroNome, @categoriaFavorita, @desconto
SET @primeiroNome = AttributeValue("PrimeiroNome")
SET @primeiroNome = IIF(Empty(@primeiroNome), "Cliente", @primeiroNome)
SET @categoriaFavorita = Lookup("PreferenciasCliente", "Categoria", "EmailAddress", EmailAddress)
SET @categoriaFavorita = IIF(Empty(@categoriaFavorita), "Eletrônicos", @categoriaFavorita)
SET @desconto = Lookup("DescontosBlackFriday", "Percentual", "Categoria", @categoriaFavorita)
]%%

<!-- Região: Banner Principal -->
%%[ BeginImpressionRegion("BannerBlackFriday") ]%%
<table width="100%" bgcolor="#000000">
  <tr>
    <td style="padding: 30px; text-align: center;">
      <h1 style="color: #ff0000; font-size: 36px;">🔥 BLACK FRIDAY LOJAS VITÓRIA 🔥</h1>
      <p style="color: #ffffff; font-size: 18px;">
        Olá, %%=v(@primeiroNome)=%%, preparamos ofertas especiais pra você!
      </p>
    </td>
  </tr>
</table>
%%[ EndImpressionRegion() ]%%

<!-- Região: Ofertas Personalizadas -->
%%[ BeginImpressionRegion("OfertasPersonalizadas") ]%%
<table width="100%" bgcolor="#1a1a1a">
  <tr>
    <td style="padding: 20px; text-align: center;">
      <h2 style="color: #ffcc00;">Até %%=v(@desconto)=%%% OFF em %%=v(@categoriaFavorita)=%%!</h2>
      <p style="color: #ffffff;">Frete grátis acima de R$ 299,00 para todo o Brasil.</p>
      <a href="https://www.lojasvitoria.com.br/blackfriday?cat=%%=URLEncode(@categoriaFavorita)=%%"
         style="background: #ff0000; color: #fff; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
        VER OFERTAS
      </a>
    </td>
  </tr>
</table>
%%[ EndImpressionRegion() ]%%

<!-- Região: Cashback e Programa de Pontos -->
%%[ BeginImpressionRegion("ProgramaPontos") ]%%
<table width="100%" bgcolor="#222222">
  <tr>
    <td style="padding: 20px; text-align: center;">
      <h3 style="color: #00ff88;">💰 Ganhe cashback de até R$ 150,00</h3>
      <p style="color: #cccccc;">
        Compras acima de R$ 500,00 dão direito a pontos em dobro no
        Programa Vitória Fidelidade. Válido de 24/11/2024 a 01/12/2024.
      </p>
    </td>
  </tr>
</table>
%%[ EndImpressionRegion() ]%%

<!-- Região: Rodapé -->
%%[ BeginImpressionRegion("Rodape") ]%%
<table width="100%" bgcolor="#000000">
  <tr>
    <td style="padding: 15px; text-align: center; color: #666666; font-size: 12px;">
      <p>Lojas Vitória LTDA - CNPJ: 12.345.678/0001-90</p>
      <p>Rua das Palmeiras, 500 - São Paulo/SP - CEP 01310-100</p>
      <p>
        <a href="%%unsub_center_url%%" style="color: #999999;">Gerenciar preferências</a> |
        <a href="%%subscription_center_url%%" style="color: #999999;">Cancelar inscrição</a>
      </p>
    </td>
  </tr>
</table>
%%[ EndImpressionRegion() ]%%
```

**Saída:**
```
(O email é renderizado normalmente com todas as seções visíveis.
Internamente, quatro regiões de impressão são registradas:
"BannerBlackFriday", "OfertasPersonalizadas", "ProgramaPontos" e "Rodape".
Os dados de visualização de cada região ficam disponíveis nos relatórios de tracking.)
```

## Observações

- **Somente emails de saída (outbound):** As regiões de impressão funcionam apenas em emails enviados pelo Marketing Cloud. **CloudPages não suportam** impression regions.
- **Sem saída visível:** A função não gera nenhum conteúdo no email. Ela serve apenas como marcador interno para o sistema de rastreamento.
- **Fechamento automático:** Se você esquecer de chamar `EndImpressionRegion()` antes do final do email, o sistema fecha a região automaticamente. Mas é uma boa prática sempre fechar explicitamente para manter o código organizado e garantir que cada região rastreie exatamente o trecho que você quer.
- **Nomes descritivos:** Use nomes claros e descritivos para as regiões (ex: "BannerPrincipal", "OfertasDiaDasMaes", "MenuCategorias"). Isso facilita muito na hora de analisar os relatórios.
- **Múltiplas regiões:** Você pode ter várias regiões de impressão no mesmo email, cada uma com um nome diferente. Isso permite comparar o desempenho de diferentes seções.
- **Relatórios:** Os dados de impressão por região ficam disponíveis nos relatórios de tracking do Marketing Cloud, ajudando a entender quais partes do email recebem mais atenção dos assinantes.

## Funções relacionadas

- [EndImpressionRegion](../content-functions/endimpressionregion.md) — Marca o fim de uma região de impressão. Usada em conjunto com `BeginImpressionRegion`.
- [ContentBlockByName](../content-functions/contentblockbyname.md) — Insere um bloco de conteúdo pelo nome. Útil para modularizar seções rastreadas.
- [ContentBlockByKey](../content-functions/contentblockbykey.md) — Insere um bloco de conteúdo pela chave. Outra forma de organizar conteúdo dentro de regiões de impressão.
- [ContentBlockById](../content-functions/contentblockbyid.md) — Insere um bloco de conteúdo pelo ID.
- [AttributeValue](../utility-functions/attributevalue.md) — Retorna o valor de um atributo do assinante, útil para personalizar o conteúdo dentro das regiões rastreadas.
- [URLEncode](../string-functions/urlencode.md) — Codifica valores para uso seguro em URLs dentro das regiões de impressão.