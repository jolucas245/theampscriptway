---
title: Comentários
sidebar_label: Comentários
description: Aprenda a usar comentários em AMPscript para documentar seu código, facilitar a manutenção e organizar lógicas complexas nos seus emails e Cloud Pages.
sidebar_position: 7
---

# Comentários

Sabe quando você abre aquele email que criou há seis meses e fica pensando "por que mesmo eu fiz isso aqui?"? Pois é, comentários existem justamente pra evitar esse momento de desespero.

Comentários são trechos de texto dentro do seu código AMPscript que **não aparecem no email final** — eles existem exclusivamente para você (e para o próximo dev que pegar seu código) entenderem o que está acontecendo ali. Pense neles como post-its digitais grudados no seu código.

## Sintaxe de comentários

A sintaxe é simples e direta. Você usa `/*` para abrir o comentário e `*/` para fechar:

```ampscript
%%[
/* Isso é um comentário em AMPscript */
SET @nome = "João Silva"
]%%
```

Tudo que estiver entre `/*` e `*/` será completamente ignorado pelo processador do AMPscript. O subscriber nunca vai ver esse texto — ele existe só no código-fonte.

Você também pode criar comentários com várias linhas:

```ampscript
%%[
/*
  Este bloco busca os dados do cliente na Data Extension
  de cadastro e verifica se ele tem direito ao
  desconto de aniversário da campanha de Dia das Mães.
  Criado por: Maria Santos
  Data: 15/03/2025
*/
SET @cpf = AttributeValue("CPF")
SET @nome = Lookup("CadastroClientes", "PrimeiroNome", "CPF", @cpf)
]%%
```

## Onde podem ser usados

Comentários em AMPscript **só funcionam dentro de blocos `%%[ ]%%`**. Isso é importante — se você tentar colocar `/* comentário */` fora de um bloco AMPscript, o texto vai simplesmente aparecer no email do seu subscriber.

### ✅ Correto — comentário dentro do bloco AMPscript

```ampscript
%%[
/* Busca o saldo de cashback do cliente */
SET @saldo = Lookup("Cashback_Saldo", "Valor", "SubscriberKey", _subscriberkey)
]%%
```

### ❌ Errado — comentário fora do bloco AMPscript

```html
/* Isso NÃO é um comentário AMPscript — vai aparecer no email! */
%%[
SET @saldo = Lookup("Cashback_Saldo", "Valor", "SubscriberKey", _subscriberkey)
]%%
```

> **⚠️ Atenção:** Se você precisa adicionar comentários no HTML fora dos blocos AMPscript, use a sintaxe de comentário HTML: `<!-- comentário HTML -->`. Porém, lembre-se que comentários HTML **são enviados no código-fonte do email** — o subscriber não vê na tela, mas eles estão lá se alguém inspecionar o código. Já os comentários AMPscript dentro de `%%[ ]%%` **não são incluídos no output de forma alguma**.

## Comentários não aparecem no output renderizado

Esse é um ponto que vale reforçar. Quando o SFMC processa seu email, ele interpreta todo o AMPscript e gera o HTML final. Os comentários são **completamente removidos** nesse processo — eles não aparecem no código-fonte do email, não aparecem na pré-visualização e não aparecem para o subscriber.

Vamos ver na prática:

```html
%%[
/* Definindo variáveis de personalização para o email de boas-vindas */
SET @nome = "Carlos Oliveira"
SET @desconto = "15%"
]%%

<h1>Bem-vindo, %%=v(@nome)=%%!</h1>
<p>Você ganhou %%=v(@desconto)=%% de desconto na sua primeira compra.</p>
```

O que o subscriber **Carlos Oliveira** recebe:

```html
<h1>Bem-vindo, Carlos Oliveira!</h1>
<p>Você ganhou 15% de desconto na sua primeira compra.</p>
```

Nenhum rastro do comentário. Limpo e direto.

> **💡 Dica:** Isso significa que você pode (e deve!) ser generoso com comentários. Eles não aumentam o tamanho do email enviado, não afetam a performance de entrega e não prejudicam a experiência do subscriber.

## Boas práticas

Agora que você já sabe a sintaxe, vamos falar sobre **como** usar comentários de forma inteligente. Não é só sair escrevendo qualquer coisa — comentários bons fazem toda a diferença.

### Documente lógicas complexas

Sempre que tiver um `IF` com várias condições, um `Lookup` com regras de negócio específicas ou qualquer lógica que não seja óbvia à primeira vista, explique o **porquê** — não apenas o **o quê**.

```ampscript
%%[
/*
  Regra de frete grátis - Campanha Black Friday 2025:
  - Clientes com mais de 3 compras no ano OU
  - Pedidos acima de R$ 199,90
  recebem frete grátis. Caso contrário, frete fixo de R$ 14,90.
*/
SET @totalCompras = Lookup("Historico_Compras", "QtdCompras2025", "CPF", @cpf)
SET @valorPedido = AttributeValue("ValorPedido")

IF @totalCompras > 3 OR @valorPedido > 199.90 THEN
  SET @frete = "GRÁTIS"
  SET @valorFrete = 0
ELSE
  SET @frete = "R$ 14,90"
  SET @valorFrete = 14.90
ENDIF
]%%
```

Sem o comentário, alguém teria que adivinhar de onde vem a regra do `> 3` e do `> 199.90`. Com o comentário, fica claro de primeira.

### Marque seções do código

Em emails mais longos, com várias lógicas AMPscript, use comentários como "separadores de seção". Isso ajuda demais na navegação quando o código fica extenso:

```html
%%[
/* ============================================
   SEÇÃO 1: BUSCA DE DADOS DO CLIENTE
   ============================================ */
SET @subscriberKey = _subscriberkey
SET @nome = Lookup("CadastroClientes", "PrimeiroNome", "SubscriberKey", @subscriberKey)
SET @email = Lookup("CadastroClientes", "Email", "SubscriberKey", @subscriberKey)
SET @segmento = Lookup("CadastroClientes", "Segmento", "SubscriberKey", @subscriberKey)

/* ============================================
   SEÇÃO 2: DEFINIÇÃO DA OFERTA POR SEGMENTO
   ============================================ */
IF @segmento == "Ouro" THEN
  SET @desconto = "30%"
  SET @cupom = "OURO30"
ELSEIF @segmento == "Prata" THEN
  SET @desconto = "20%"
  SET @cupom = "PRATA20"
ELSE
  SET @desconto = "10%"
  SET @cupom = "BEMVINDO10"
ENDIF

/* ============================================
   SEÇÃO 3: MONTAGEM DO LINK DE REDIRECT
   ============================================ */
SET @linkOferta = Concat("https://www.megastore.com.br/oferta?cupom=", @cupom, "&sk=", @subscriberKey)
]%%
```

Mesmo com bastante código, fica fácil encontrar onde cada coisa acontece.

### Identifique autor e data em lógicas críticas

Para códigos que envolvem regras de negócio importantes (cálculos financeiros, regras de compliance, lógica de opt-in), é uma boa prática registrar quem criou e quando:

```ampscript
%%[
/*
  Cálculo de cashback - Programa Fidelidade Banco Meridional
  Regra: 2% para compras no débito, 5% para compras no crédito
  Aprovado por: Diretoria de Marketing (Ticket #4521)
  Autor: João Silva
  Data: 20/04/2025
  Última alteração: 10/05/2025 - Ajuste no % do crédito (era 3%, agora é 5%)
*/
IF @tipoPagamento == "debito" THEN
  SET @cashback = Multiply(@valorCompra, 0.02)
ELSEIF @tipoPagamento == "credito" THEN
  SET @cashback = Multiply(@valorCompra, 0.05)
ENDIF
]%%
```

### Comente código temporariamente desativado

Às vezes você precisa desativar um trecho de código para testes, mas não quer apagá-lo. Comentários são perfeitos pra isso:

```ampscript
%%[
SET @nome = Lookup("CadastroClientes", "PrimeiroNome", "SubscriberKey", _subscriberkey)

/* Bloco temporariamente desativado - Reativar após 01/12/2025 para campanha de Natal
SET @presenteNatal = Lookup("Campanha_Natal", "Premio", "SubscriberKey", _subscriberkey)
SET @mostrarBanner = "sim"
*/

SET @mostrarBanner = "nao"
]%%
```

> **💡 Dica:** Quando comentar código temporariamente, sempre adicione uma nota explicando **por que** está desativado e **quando** deve ser reativado. Código comentado sem explicação vira lixo misterioso que ninguém tem coragem de apagar.

## Exemplos práticos

Vamos ver alguns cenários reais onde comentários fazem toda a diferença.

### Email de carrinho abandonado com lógica de desconto progressivo

```html
%%[
/* ============================================
   Email: Carrinho Abandonado - Lojas Vitória
   Journey: Abandono_Carrinho_2025
   Regra de desconto progressivo:
   - 1ª tentativa (24h): sem desconto, só lembrete
   - 2ª tentativa (48h): 10% de desconto
   - 3ª tentativa (72h): 15% + frete grátis
   ============================================ */

/* Identifica qual tentativa é essa (vem da Journey como atributo) */
SET @tentativa = AttributeValue("NumeroTentativa")
SET @nomeCliente = AttributeValue("PrimeiroNome")
SET @valorCarrinho = AttributeValue("ValorCarrinho")

/* Define desconto e frete de acordo com a tentativa */
IF @tentativa == 1 THEN
  SET @textoOferta = "Seus produtos estão esperando por você!"
  SET @cupom = ""
  SET @freteGratis = "nao"
ELSEIF @tentativa == 2 THEN
  SET @textoOferta = "Use o cupom abaixo e ganhe 10% OFF!"
  SET @cupom = "VOLTA10"
  SET @freteGratis = "nao"
ELSEIF @tentativa == 3 THEN
  /* Última tentativa - oferta mais agressiva */
  SET @textoOferta = "Última chance! 15% OFF + FRETE GRÁTIS"
  SET @cupom = "VOLTA15FRETE"
  SET @freteGratis = "sim"
ENDIF
]%%

<h1>Oi, %%=v(@nomeCliente)=%%!</h1>
<p>%%=v(@textoOferta)=%%</p>

%%[ IF Length(@cupom) > 0 THEN ]%%
  <div class="cupom-box">
    <p>Seu cupom: <strong>%%=v(@cupom)=%%</strong></p>
  </div>
%%[ ENDIF ]%%

%%[ /* Mostra badge de frete grátis apenas na 3ª tentativa */ ]%%
%%[ IF @freteGratis == "sim" THEN ]%%
  <div class="frete-gratis">🚚 Frete grátis para todo o Brasil!</div>
%%[ ENDIF ]%%
```

Repare como os comentários explicam a regra de negócio no topo e esclarecem decisões pontuais ao longo do código.

### Lookup com múltiplas Data Extensions

```ampscript
%%[
/* 
   Busca de dados em múltiplas DEs para o email mensal 
   do programa de fidelidade da FarmaRede.
   
   DEs utilizadas:
   - Clientes_Fidelidade: dados cadastrais e nível
   - Pontos_Acumulados: saldo de pontos atualizado diariamente
   - Ofertas_Personalizadas: ofertas baseadas no histórico de compras
*/

SET @sk = _subscriberkey

/* Dados cadastrais */
SET @nome = Lookup("Clientes_Fidelidade", "Nome", "SubscriberKey", @sk)
SET @nivel = Lookup("Clientes_Fidelidade", "NivelFidelidade", "SubscriberKey", @sk)

/* Saldo de pontos - atualizado via automação diária às 06h */
SET @pontos = Lookup("Pontos_Acumulados", "SaldoAtual", "SubscriberKey", @sk)
SET @pontosExpirar = Lookup("Pontos_Acumulados", "PontosVencer30Dias", "SubscriberKey", @sk)

/* 
   Oferta personalizada - o campo "OfertaHTML" já contém o HTML formatado
   gerado pelo time de CRM. Não alterar a estrutura sem alinhar com eles.
*/
SET @ofertaHTML = Lookup("Ofertas_Personalizadas", "OfertaHTML", "SubscriberKey", @sk)
]%%
```

Aqui os comentários servem como uma mini-documentação: explicam de onde vêm os dados, quando são atualizados e até alertam sobre dependências com outros times.

### Comentário inline para variáveis não óbvias

Às vezes um comentário curtinho ao lado de uma linha já resolve:

```ampscript
%%[
SET @diasParaExpirar = 30 /* Regra do programa: pontos expiram em 30 dias */
SET @minPontos = 500 /* Mínimo para resgate conforme regulamento v3.2 */
SET @taxaConversao = 0.01 /* 1 ponto = R$ 0,01 */

/* Calcula o valor em Reais que o cliente pode resgatar */
SET @valorResgate = Multiply(@pontos, @taxaConversao)
]%%
```

### Comentários para debug (temporários)

Durante o desenvolvimento, comentários podem ajudar a marcar pontos de verificação:

```ampscript
%%[
SET @cpf = AttributeValue("CPF")
/* DEBUG: Verificar se o CPF está vindo formatado ou só números */
/* Esperado: 123.456.789-00 | Se vier 12345678900, ajustar o Lookup */

SET @nome = Lookup("Clientes", "Nome", "CPF", @cpf)
/* DEBUG: Se @nome vier vazio, checar se a DE "Clientes" está com o nome certo */
]%%
```

> **⚠️ Atenção:** Comentários de debug são úteis durante o desenvolvimento, mas lembre-se de removê-los (ou pelo menos limpá-los) antes de colocar o email em produção. Eles não aparecem para o subscriber, mas deixam o código poluído para quem for dar manutenção depois.

## Resumo rápido

| Aspecto | Detalhe |
|---|---|
| **Sintaxe** | `/* seu comentário aqui */` |
| **Onde usar** | Apenas dentro de blocos `%%[ ]%%` |
| **Aparece no email?** | Não — é completamente removido no processamento |
| **Multilinha?** | Sim — pode ter quantas linhas quiser entre `/*` e `*/` |
| **Impacto na performance?** | Nenhum — use à vontade |

> **💡 Dica:** Adquira o hábito de comentar seu código desde o primeiro email. Pode parecer exagero agora, mas quando você tiver 50 emails em produção e precisar ajustar uma regra de negócio em três deles, vai agradecer cada comentário que deixou.

---

Agora que você já sabe documentar seu código como um profissional, que tal revisar os outros fundamentos? Confira os guias de [Sintaxe básica](/docs/getting-started/syntax), [Variáveis](/docs/getting-started/variables) e [Condicionais](/docs/getting-started/conditionals) para ter uma base sólida antes de avançar para [Loops](/docs/getting-started/loops) e lógicas mais avançadas.