---
title: BeforeHTTPGet
sidebar_label: BeforeHTTPGet
description: Intercepta e modifica uma URL antes que uma requisição HTTPGet seja executada, permitindo adicionar parâmetros ou alterar a URL dinamicamente.
---

<!-- generated-by-script -->

# BeforeHTTPGet

## Descrição

A função `BeforeHTTPGet` é usada como um manipulador (handler) que intercepta a URL antes que uma chamada [HTTPGet](../http-functions/httpget.md) seja executada. Ela permite que você modifique a URL de destino dinamicamente — adicionando parâmetros, tokens de autenticação ou qualquer outra alteração necessária — antes que a requisição HTTP GET realmente aconteça. Essa função trabalha em conjunto com [HTTPGet](../http-functions/httpget.md) e [AfterHTTPGet](../http-functions/afterhttpget.md), formando um ciclo de pré-processamento, execução e pós-processamento de chamadas HTTP.

> ⚠️ **Nota importante:** A documentação oficial da Salesforce para esta função não está disponível (retorna erro 404). As informações abaixo são baseadas no comportamento conhecido dentro do ecossistema SFMC e na relação com funções associadas. Use com cautela e teste sempre em ambiente de desenvolvimento antes de colocar em produção.

## Sintaxe

```ampscript
BeforeHTTPGet(URL)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| URL | String | Sim | A URL que será processada/modificada antes da execução da requisição HTTP GET. |

## Exemplo básico

```ampscript
%%[
/* Define a URL base de uma API de consulta de ofertas */
SET @urlBase = "https://api.megastore.com.br/ofertas"

/* Adiciona um parâmetro de categoria antes da chamada */
SET @urlCompleta = Concat(@urlBase, "?categoria=eletronicos&formato=json")

/* Usa BeforeHTTPGet para preparar a URL */
BeforeHTTPGet(@urlCompleta)
]%%
```

**Saída:**
```
A URL é interceptada e preparada antes da execução do HTTPGet, permitindo que a requisição seja feita com os parâmetros adicionados.
```

## Exemplo avançado

```ampscript
%%[
/* 
   Cenário: A Lojas Vitória quer buscar ofertas personalizadas 
   para cada assinante no e-mail de Black Friday.
   Antes de fazer o GET, precisamos montar a URL com o CPF 
   do cliente e um token de autenticação.
*/

SET @cpfCliente = AttributeValue("CPF")
SET @tokenAPI = "Bearer abc123xyz"
SET @urlBase = "https://api.lojasvitoria.com.br/v1/ofertas-personalizadas"

/* Monta a URL com parâmetros do cliente */
SET @urlCompleta = Concat(
  @urlBase, 
  "?cpf=", URLEncode(@cpfCliente), 
  "&campanha=blackfriday2024",
  "&frete_gratis_acima=299"
)

/* Intercepta a URL antes da chamada HTTP */
BeforeHTTPGet(@urlCompleta)

/* Executa a requisição GET */
SET @resposta = HTTPGet(@urlCompleta)

/* Exibe as ofertas retornadas */
]%%

<div style="font-family: Arial, sans-serif;">
  <h2>🖤 Black Friday Lojas Vitória</h2>
  <p>Olá! Preparamos ofertas especiais pra você.</p>
  <p>Frete grátis acima de R$ 299,00!</p>
  %%=TreatAsContent(@resposta)=%%
</div>
```

**Saída:**
```html
<div style="font-family: Arial, sans-serif;">
  <h2>🖤 Black Friday Lojas Vitória</h2>
  <p>Olá! Preparamos ofertas especiais pra você.</p>
  <p>Frete grátis acima de R$ 299,00!</p>
  <!-- Conteúdo dinâmico retornado pela API com as ofertas personalizadas -->
</div>
```

## Observações

- **Documentação oficial indisponível:** A página de referência da Salesforce para `BeforeHTTPGet` retorna erro 404. Isso pode indicar que a função foi descontinuada, renomeada ou que a documentação foi removida. Sempre teste o comportamento atual no seu ambiente SFMC.
- **Uso em conjunto:** Essa função faz parte de um trio: `BeforeHTTPGet` (pré-processamento), [HTTPGet](../http-functions/httpget.md) (execução) e [AfterHTTPGet](../http-functions/afterhttpget.md) (pós-processamento). Use as três juntas quando precisar de controle total sobre o ciclo da requisição.
- **Raramente usada:** Na prática, a maioria dos desenvolvedores SFMC usa diretamente o [HTTPGet](../http-functions/httpget.md) ou o [HTTPGetWrap](../http-functions/httpgetwrap.md) sem precisar de `BeforeHTTPGet`. Considere se você realmente precisa dessa função antes de implementá-la.
- **Contexto de execução:** Chamadas HTTP em AMPscript podem ter restrições dependendo do contexto (e-mail, CloudPages, SMS). Em e-mails, chamadas HTTP são feitas no momento do envio e podem impactar a performance se a API externa for lenta.
- **Timeout e limites:** As requisições HTTP no SFMC têm limite de timeout. Se a URL montada via `BeforeHTTPGet` apontar para um serviço lento, a chamada pode falhar silenciosamente.
- **Segurança:** Nunca exponha tokens de autenticação ou dados sensíveis (como CPF completo) diretamente em URLs sem criptografia. Considere usar [EncryptSymmetric](../encryption-functions/encryptsymmetric.md) ou [SHA256](../encryption-functions/sha256.md) para proteger dados sensíveis nos parâmetros.
- **Whitelisting de URLs:** Lembre-se de que o SFMC exige que domínios externos estejam na lista de permissões (whitelist) do Setup para que chamadas HTTP funcionem.

## Funções relacionadas

- [HTTPGet](../http-functions/httpget.md) — Executa uma requisição HTTP GET para buscar conteúdo de uma URL externa
- [AfterHTTPGet](../http-functions/afterhttpget.md) — Intercepta e processa a resposta após a execução de um HTTPGet
- [HTTPGetWrap](../http-functions/httpgetwrap.md) — Variação do HTTPGet que encapsula links para rastreamento
- [HTTPPost](../http-functions/httppost.md) — Executa uma requisição HTTP POST para enviar dados a uma URL externa
- [HTTPPost2](../http-functions/httppost2.md) — Versão estendida do HTTPPost com suporte a headers customizados
- [URLEncode](../string-functions/urlencode.md) — Codifica strings para uso seguro em URLs
- [TreatAsContent](../utility-functions/treatascontent.md) — Renderiza uma string como conteúdo AMPscript/HTML
- [RedirectTo](../http-functions/redirectto.md) — Redireciona o usuário para uma URL específica
- [Concat](../string-functions/concat.md) — Concatena strings, útil para montar URLs dinamicamente