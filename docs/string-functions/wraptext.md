---
title: WrapText
sidebar_label: WrapText
description: Quebra um texto longo em múltiplas linhas, inserindo uma quebra de linha a cada número especificado de caracteres.
---

<!-- generated-by-script -->

# WrapText

## Descrição

A função **WrapText** pega uma string de texto e insere quebras de linha automaticamente para que nenhuma linha ultrapasse o número máximo de caracteres que você definir. Ela é útil quando você precisa formatar textos longos para exibição em contextos com largura limitada, como e-mails em texto puro, SMS ou áreas de conteúdo com layout fixo. A função retorna a string reformatada com as quebras de linha inseridas nos pontos apropriados.

## Sintaxe

```ampscript
WrapText(texto, numero_de_caracteres, separador)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| texto | String | Sim | O texto que você quer quebrar em múltiplas linhas. |
| numero_de_caracteres | Inteiro | Sim | O número máximo de caracteres por linha antes de inserir a quebra. |
| separador | String | Não | O caractere ou string usado como quebra de linha. Se não informado, utiliza a quebra de linha padrão (newline). |

## Exemplo básico

Imagine que você precisa formatar uma descrição de produto para um e-mail em texto puro, limitando cada linha a 40 caracteres:

```ampscript
%%[
VAR @descricao, @resultado
SET @descricao = "Tênis esportivo com amortecimento em gel, ideal para corridas de longa distância e treinos diários na academia"
SET @resultado = WrapText(@descricao, 40)
]%%
%%=v(@resultado)=%%
```

**Saída:**
```
Tênis esportivo com amortecimento em
gel, ideal para corridas de longa
distância e treinos diários na academia
```

## Exemplo avançado

Aqui um cenário real: você tem uma Data Extension com termos e condições de uma promoção da **Lojas Vitória** para o Dia das Mães, e precisa formatar o texto para um e-mail, usando `<br>` como separador para exibição em HTML:

```ampscript
%%[
VAR @nomeCliente, @termos, @termosFormatados, @mensagem

SET @nomeCliente = AttributeValue("PrimeiroNome")
SET @nomeCliente = IIF(Empty(@nomeCliente), "Cliente", ProperCase(@nomeCliente))

SET @termos = Lookup("Promocoes_DE", "TermosCondicoes", "PromoID", "MAES2025")

/* Se o texto dos termos for muito longo, quebra a cada 60 caracteres com <br> para HTML */
IF NOT Empty(@termos) THEN
  SET @termosFormatados = WrapText(@termos, 60, "<br>")
ELSE
  SET @termosFormatados = "Consulte os termos completos em www.lojasvitoria.com.br/termos"
ENDIF
]%%

<h2>Olá, %%=v(@nomeCliente)=%% 🌸</h2>
<p>Aproveite nossa promoção de Dia das Mães com frete grátis acima de R$299!</p>

<div style="font-size:11px; color:#666; max-width:500px;">
  <strong>Termos e Condições:</strong><br>
  %%=v(@termosFormatados)=%%
</div>
```

**Saída (supondo que o campo TermosCondicoes contenha um texto longo):**
```html
<h2>Olá, Maria 🌸</h2>
<p>Aproveite nossa promoção de Dia das Mães com frete grátis acima de R$299!</p>

<div style="font-size:11px; color:#666; max-width:500px;">
  <strong>Termos e Condições:</strong><br>
  Promoção válida de 01/05/2025 a 11/05/2025. Frete<br>grátis para compras acima de R$299,00 em todo o<br>território nacional. Não cumulativo com outras<br>ofertas. Consulte regulamento completo no site.
</div>
```

## Observações

- A função tenta quebrar o texto em espaços em branco para não cortar palavras no meio. Se uma palavra individual for mais longa que o limite definido, ela pode ultrapassar o comprimento máximo da linha.
- Quando o parâmetro **separador** não é informado, a função usa o caractere de nova linha padrão (`\n`). Para e-mails HTML, considere usar `<br>` como separador.
- Se o texto de entrada for `null` ou vazio, a função retorna uma string vazia.
- O valor do **numero_de_caracteres** deve ser um inteiro positivo. Valores muito baixos (como 1 ou 2) podem gerar resultados inesperados.
- Essa função é especialmente útil em contextos de **texto puro** (plain text emails) e **SMS**, onde não há controle de layout via CSS.
- Funciona tanto em e-mails quanto em CloudPages e Landing Pages.

## Funções relacionadas

- [Concat](../string-functions/concat.md) — Concatena várias strings em uma só, útil para montar o texto antes de aplicar WrapText.
- [Substring](../string-functions/substring.md) — Extrai parte de uma string por posição, uma alternativa quando você precisa apenas truncar texto.
- [Length](../string-functions/length.md) — Retorna o comprimento de uma string, útil para verificar se o texto precisa ser quebrado.
- [Replace](../string-functions/replace.md) — Substitui ocorrências em uma string, pode ser combinada para ajustar o texto antes da quebra.
- [Trim](../string-functions/trim.md) — Remove espaços em branco do início e fim de uma string antes de processá-la.
- [Output](../utility-functions/output.md) — Exibe o resultado de uma expressão, alternativa ao `v()` para renderizar o texto formatado.