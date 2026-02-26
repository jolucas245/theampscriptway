---
title: IsPhoneNumber
sidebar_label: IsPhoneNumber
description: Verifica se o valor informado é um número de telefone válido no padrão NANP (North American Numbering Plan), retornando true ou false.
---

# IsPhoneNumber

## Descrição

A função `IsPhoneNumber` testa se o valor passado como parâmetro é um número de telefone válido de acordo com o **NANP (North American Numbering Plan)** — o plano de numeração usado nos Estados Unidos, Canadá e vários países do Caribe e Pacífico. Se o número for válido dentro do NANP, a função retorna `true`; caso contrário, retorna `false`. Números de telefone que **não fazem parte do NANP** — como números brasileiros, europeus ou asiáticos — sempre retornam `false`. Essa função também retorna `false` se o número contiver caracteres além de dígitos, parênteses, hifens, pontos e espaços (por exemplo, o sinal de `+` já invalida o resultado).

> ⚠️ **Atenção para quem trabalha com o mercado brasileiro:** Números de telefone brasileiros (como `(11) 99999-9999`) **não são validados por essa função**, pois o Brasil não faz parte do NANP. Se você precisa validar telefones brasileiros, considere usar [RegExMatch](../string-functions/regexmatch.md) com uma expressão regular adequada.

## Sintaxe

```ampscript
IsPhoneNumber(phoneNumber)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| phoneNumber | string | Sim | O número de telefone a ser validado. Pode conter dígitos, parênteses, hifens, pontos e espaços. Qualquer outro caractere faz a função retornar `false`. |

## Retorno

Retorna `true` se o número for um telefone NANP válido. Retorna `false` em todos os outros casos.

## Exemplo básico

Imagine que a **Conecta Telecom** tem uma operação nos Estados Unidos e no Brasil, e precisa identificar quais assinantes possuem números norte-americanos válidos antes de enviar SMS via short code nos EUA:

```ampscript
%%[
VAR @telefoneEUA, @telefoneBR, @resultadoEUA, @resultadoBR

SET @telefoneEUA = "425.555.0185"
SET @telefoneBR = "(11) 99876-5432"

SET @resultadoEUA = IsPhoneNumber(@telefoneEUA)
SET @resultadoBR = IsPhoneNumber(@telefoneBR)
]%%

Telefone EUA (425.555.0185): %%=v(@resultadoEUA)=%%
Telefone BR (11) 99876-5432: %%=v(@resultadoBR)=%%
```

**Saída:**
```
Telefone EUA (425.555.0185): true
Telefone BR (11) 99876-5432: false
```

## Exemplo avançado

A **MegaStore** possui uma base de clientes que inclui tanto compradores dos EUA quanto do Brasil. Antes de disparar uma campanha de **Black Friday** via SMS para os clientes norte-americanos, ela precisa validar os números e, para os brasileiros, aplicar uma validação diferente com regex:

```ampscript
%%[
VAR @nome, @telefone, @pais, @ehValido, @mensagem

SET @nome = "Carlos Oliveira"
SET @telefone = AttributeValue("Telefone")
SET @pais = AttributeValue("Pais")

IF @pais == "EUA" THEN

  /* Valida número NANP para clientes nos EUA */
  SET @ehValido = IsPhoneNumber(@telefone)

  IF @ehValido == "true" THEN
    SET @mensagem = Concat("Olá, ", @nome, "! 🇺🇸 Seu número ", @telefone, " é válido para receber ofertas Black Friday da MegaStore nos EUA!")
  ELSE
    SET @mensagem = Concat("Olá, ", @nome, ". Não conseguimos validar seu número ", @telefone, " no padrão norte-americano. Atualize seu cadastro em www.megastore.com.br/minha-conta")
  ENDIF

ELSEIF @pais == "Brasil" THEN

  /* Para números brasileiros, usa RegExMatch pois IsPhoneNumber não suporta NANP */
  VAR @regexBR, @matchBR
  SET @regexBR = "^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$"
  SET @matchBR = RegExMatch(@telefone, @regexBR, 0)

  IF Length(@matchBR) > 0 THEN
    SET @mensagem = Concat("Oi, ", @nome, "! 🇧🇷 Seu número ", @telefone, " está certinho. Fique de olho nas ofertas de Black Friday da MegaStore — frete grátis acima de R$299!")
  ELSE
    SET @mensagem = Concat("Oi, ", @nome, ". Precisamos que você atualize seu telefone em www.megastore.com.br/minha-conta para receber nossas promoções.")
  ENDIF

ELSE
  SET @mensagem = Concat("Olá, ", @nome, ". Entre em contato conosco para atualizar seus dados.")
ENDIF
]%%

%%=v(@mensagem)=%%
```

**Saída (exemplo para cliente nos EUA com número válido):**
```
Olá, Carlos Oliveira! 🇺🇸 Seu número 647 555 0123 é válido para receber ofertas Black Friday da MegaStore nos EUA!
```

**Saída (exemplo para cliente no Brasil com número válido):**
```
Oi, Carlos Oliveira! 🇧🇷 Seu número (11) 99876-5432 está certinho. Fique de olho nas ofertas de Black Friday da MegaStore — frete grátis acima de R$299!
```

## Tabela de referência de resultados

| Chamada | Resultado | Observação |
|---|---|---|
| `IsPhoneNumber("647 555 0123")` | `true` | Número canadense válido (NANP). |
| `IsPhoneNumber("425.555.0185")` | `true` | Número dos EUA válido (NANP). |
| `IsPhoneNumber("(829) 555-0142")` | `true` | Número da República Dominicana, que faz parte do NANP. |
| `IsPhoneNumber("+14255550142")` | `false` | Número dos EUA válido, mas retorna `false` por causa do sinal de `+`. |
| `IsPhoneNumber("0161 496 0009")` | `false` | Número do Reino Unido — não faz parte do NANP. |
| `IsPhoneNumber("82 517 460 123")` | `false` | Número da Coreia do Sul — não faz parte do NANP. |
| `IsPhoneNumber("(11) 99999-9999")` | `false` | Número brasileiro — não faz parte do NANP. |

## Observações

- **Não valida números brasileiros.** O Brasil não faz parte do NANP, então qualquer número brasileiro — celular ou fixo — sempre retornará `false`. Para validar telefones brasileiros, use [RegExMatch](../string-functions/regexmatch.md) com uma expressão regular apropriada.
- **Caracteres permitidos:** Apenas dígitos (`0-9`), parênteses (`()`), hifens (`-`), pontos (`.`) e espaços são aceitos. Qualquer outro caractere (como `+`, `/`, `#`) faz a função retornar `false`, mesmo que o número em si seja válido no NANP.
- **Para melhores resultados, passe apenas dígitos.** A documentação oficial da Salesforce recomenda incluir somente números ao chamar essa função, evitando caracteres especiais que possam causar resultados inesperados.
- **Bug conhecido com prefixos 922 e 926:** A função pode retornar `true` incorretamente para alguns números que começam com `922` ou `926`. Quando isso acontece e o número é na verdade inválido, **o batch inteiro pode falhar**. Fique atento a isso ao processar listas grandes.
- **O NANP cobre 25 países/territórios**, incluindo Estados Unidos, Canadá, Porto Rico, República Dominicana, Jamaica, Trinidad e Tobago, entre outros. Consulte a [lista completa na Wikipedia](https://en.wikipedia.org/wiki/North_American_Numbering_Plan) se precisar saber quais países são cobertos.
- **Use [Trim](../string-functions/trim.md) antes** de chamar `IsPhoneNumber` para remover espaços indesejados no início ou fim do valor, especialmente quando o dado vem de formulários ou Data Extensions.
- **Não confunda com validação de formato para SMS.** Mesmo que `IsPhoneNumber` retorne `true`, isso não garante que o número esteja no formato correto para envio via MobileConnect no SFMC. Para SMS, geralmente você precisa do formato E.164 (ex: `+15551234567`), que ironicamente faz essa função retornar `false`.

## Funções relacionadas

- [IsEmailAddress](../utility-functions/isemailaddress.md) — Valida se um valor é um endereço de e-mail válido. Útil para usar junto com `IsPhoneNumber` na validação de dados de contato.
- [IsNull](../utility-functions/isnull.md) — Verifica se um valor é nulo. Use antes de `IsPhoneNumber` para evitar passar valores nulos.
- [IsNullDefault](../utility-functions/isnulldefault.md) — Retorna um valor padrão quando o campo é nulo. Ótimo para definir um fallback antes da validação.
- [Empty](../utility-functions/empty.md) — Verifica se um valor está vazio. Combine com `IsPhoneNumber` para uma validação mais completa.
- [RegExMatch](../string-functions/regexmatch.md) — Faz correspondência com expressões regulares. A alternativa recomendada para validar números de telefone brasileiros e de outros países fora do NANP.
- [Trim](../string-functions/trim.md) — Remove espaços em branco do início e fim de uma string. Use antes de chamar `IsPhoneNumber` para limpar os dados.
- [Replace](../string-functions/replace.md) — Substitui caracteres em uma string. Útil para remover caracteres indesejados (como `+`) antes da validação.
- [IIF](../utility-functions/iif.md) — Retorna um valor ou outro com base em uma condição. Permite criar validações inline com `IsPhoneNumber`.
- [RaiseError](../utility-functions/raiseerror.md) — Levanta um erro e interrompe o processamento. Use para bloquear envios quando o telefone é inválido.
- [AttributeValue](../utility-functions/attributevalue.md) — Recupera o valor de um atributo do assinante de forma segura, retornando vazio em vez de erro se o campo não existir.