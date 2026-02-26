---
title: Variáveis
sidebar_label: Variáveis
description: Aprenda a declarar, atribuir e usar variáveis em AMPScript para personalizar seus e-mails e automações no Salesforce Marketing Cloud.
sidebar_position: 3
---

# Variáveis

Variáveis são o coração do AMPScript. É nelas que você guarda informações — nome do assinante, valor de um desconto, resultado de uma busca em Data Extension — para usar ao longo do seu código. Se você já entendeu a [sintaxe básica](/docs/getting-started/syntax), aqui é o próximo passo natural.

## Declaração com VAR e atribuição com SET

Para criar uma variável em AMPScript, você usa duas funções:

- **`VAR`** — declara a variável (diz pro AMPScript que ela existe).
- **`SET`** — atribui um valor a ela.

```ampscript
%%[
  VAR @nomeCliente
  SET @nomeCliente = "Maria Santos"
]%%
```

Depois de atribuir, você exibe o valor no HTML usando `%%=v(@nomeCliente)=%%`:

```html
<p>Olá, %%=v(@nomeCliente)=%%! Confira nossas ofertas de Dia das Mães.</p>
```

> **💡 Dica:** Na prática, muita gente pula o `VAR` e vai direto pro `SET`. O AMPScript aceita, mas declarar com `VAR` é uma boa prática — deixa o código mais legível e evita confusão em blocos maiores.

## Declarando múltiplas variáveis de uma vez

Você não precisa escrever um `VAR` pra cada variável. Dá pra declarar várias na mesma linha, separando por vírgula:

```ampscript
%%[
  VAR @nome, @email, @valorCashback
  SET @nome = "João Silva"
  SET @email = "joao.silva@email.com.br"
  SET @valorCashback = 25.50
]%%
```

Isso mantém o código limpo, especialmente quando você trabalha com muitas variáveis no mesmo e-mail.

## Tipos de dados

AMPScript não exige que você declare o tipo da variável — ele resolve isso sozinho com base no valor atribuído. Mesmo assim, é importante conhecer os tipos que existem:

| Tipo | Exemplo de SET | Resultado |
|---|---|---|
| **String** | `SET @cidade = "São Paulo"` | Texto entre aspas duplas |
| **Number** | `SET @preco = 149.90` | Número decimal ou inteiro |
| **Boolean** | `SET @ativo = 1` | `1` (verdadeiro) ou `0` (falso) |
| **Date** | `SET @data = NOW()` | Data/hora retornada por funções de data |
| **Null** | (variável declarada sem SET) | Sem valor atribuído |

> **⚠️ Atenção:** AMPScript não tem literais `true`/`false`. Use `1` e `0` para representar valores booleanos. Se você escrever `SET @ativo = true`, o valor será a **string** "true", não um booleano.

## Escopo de variáveis

Variáveis declaradas em AMPScript têm escopo **local ao e-mail ou à página** onde foram criadas. Isso significa que uma variável definida num bloco de código no topo do e-mail pode ser usada em qualquer outro bloco `%%[ ]%%` dentro daquele mesmo e-mail — não importa se está no header, body ou footer. Porém, essa variável **não existe** em outro e-mail ou em outra página do CloudPages.

```ampscript
%%[
  SET @frete = "Frete Grátis"
]%%

<!-- Mais abaixo no HTML, outro bloco AMPScript -->
<div class="banner">
  %%=v(@frete)=%% para todo o Brasil!
</div>
```

A variável `@frete` foi definida no primeiro bloco e acessada normalmente no segundo. Funciona porque é o mesmo contexto de renderização.

## Convenção de nomenclatura com @

- Toda variável AMPScript **começa com `@`**. Sem o arroba, não funciona.
- Use **camelCase** para facilitar a leitura: `@nomeCliente`, `@dataNascimento`, `@valorDesconto`.
- Evite nomes genéricos como `@x` ou `@temp`. Prefira nomes descritivos: `@cpfAssinante`, `@cepEntrega`.
- Variáveis **não diferenciam** maiúsculas de minúsculas: `@Nome` e `@nome` são a mesma variável.
- Não use espaços ou caracteres especiais (acentos, ç) no nome da variável.

## Exemplo realista: personalizando com AttributeValue e Lookup

Vamos juntar tudo num cenário real. Imagine que a **MegaStore** quer enviar um e-mail de cashback personalizado. O nome do cliente vem do atributo do envio (a coluna da Data Extension de envio) e o saldo de cashback vem de outra Data Extension chamada `Cashback_Clientes`.

```ampscript
%%[
  VAR @nome, @cpf, @saldo, @mensagem

  SET @nome = AttributeValue("PrimeiroNome")
  SET @cpf = AttributeValue("CPF")

  SET @saldo = Lookup("Cashback_Clientes", "Saldo", "CPF", @cpf)

  IF @saldo > 0 THEN
    SET @mensagem = CONCAT("Você tem R$ ", FormatNumber(@saldo, "N2"), " de cashback disponível!")
  ELSE
    SET @mensagem = "Compre hoje e ganhe cashback na sua próxima compra."
  ENDIF
]%%
```

```html
<h1>Oi, %%=v(@nome)=%%! 👋</h1>
<p>%%=v(@mensagem)=%%</p>
<a href="https://www.megastore.com.br/cashback">Usar meu cashback</a>
```

Nesse exemplo:

1. **`AttributeValue`** busca dados da Data Extension de envio (a que está vinculada ao Job).
2. **`Lookup`** vai em outra DE (`Cashback_Clientes`) e traz o saldo usando o CPF como chave.
3. O [condicional](/docs/getting-started/conditionals) `IF/ELSE` define a mensagem com base no valor encontrado.

> **💡 Dica:** Se o `Lookup` não encontrar nenhum registro, ele retorna vazio (null). Sempre trate esse cenário pra evitar exibir conteúdo quebrado pro assinante.

---

Agora que você domina variáveis, o próximo passo é aprender a controlar o fluxo do seu código com [condicionais](/docs/getting-started/conditionals).