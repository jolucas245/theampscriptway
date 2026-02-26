---
title: Max
sidebar_label: Max
description: Retorna o maior valor entre dois ou mais números fornecidos como parâmetros.
---

# Max

## Descrição

A função `Max` compara dois ou mais valores numéricos e retorna o maior entre eles. É super útil quando você precisa determinar o valor mais alto em cenários como comparar saldos, encontrar o maior desconto disponível, identificar o produto mais caro de um pedido ou definir limites máximos em regras de negócio. A função aceita múltiplos parâmetros numéricos e retorna um único valor numérico correspondente ao maior deles.

## Sintaxe

```ampscript
Max(valor1, valor2[, valor3, ...])
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| valor1 | Número | Sim | Primeiro valor numérico para comparação |
| valor2 | Número | Sim | Segundo valor numérico para comparação |
| valorN | Número | Não | Valores numéricos adicionais para comparação (você pode passar quantos quiser) |

## Exemplo básico

```ampscript
%%[
SET @pontosFidelidade = 1200
SET @pontosBonus = 850
SET @maiorPontuacao = Max(@pontosFidelidade, @pontosBonus)
]%%

Sua maior pontuação no programa de pontos é: %%=v(@maiorPontuacao)=%%
```

**Saída:**
```
Sua maior pontuação no programa de pontos é: 1200
```

## Exemplo avançado

Imagine que a **MegaStore** quer enviar um e-mail personalizado mostrando o maior valor de cashback que o cliente pode resgatar, comparando o cashback acumulado em três categorias diferentes. Além disso, o cliente tem um valor mínimo garantido de R$ 15,00 de cashback:

```ampscript
%%[
/* Busca os dados de cashback do cliente na Data Extension */
SET @email = AttributeValue("EmailAddress")
SET @rows = LookupRows("CashbackClientes", "Email", @email)

IF RowCount(@rows) > 0 THEN
  SET @row = Row(@rows, 1)
  SET @cashbackEletronicos = Field(@row, "CashbackEletronicos")
  SET @cashbackModa = Field(@row, "CashbackModa")
  SET @cashbackMercado = Field(@row, "CashbackMercado")
  SET @nomeCliente = Field(@row, "PrimeiroNome")
  SET @cashbackMinimo = 15.00

  /* Encontra o maior cashback entre as três categorias */
  SET @maiorCashback = Max(@cashbackEletronicos, @cashbackModa, @cashbackMercado)

  /* Garante que o cliente receba pelo menos o valor mínimo */
  SET @cashbackFinal = Max(@maiorCashback, @cashbackMinimo)

  SET @cashbackFormatado = FormatCurrency(@cashbackFinal, "pt-BR", 2)
]%%

Oi, %%=v(@nomeCliente)=%%! 🎉

Você tem <b>%%=v(@cashbackFormatado)=%%</b> de cashback disponível para resgatar!

Veja seu saldo por categoria:
- Eletrônicos: R$ %%=FormatNumber(@cashbackEletronicos, "N2")=%%
- Moda: R$ %%=FormatNumber(@cashbackModa, "N2")=%%
- Mercado: R$ %%=FormatNumber(@cashbackMercado, "N2")=%%

Resgate agora em www.megastore.com.br/cashback e aproveite!

%%[ELSE]%%

Cadastre-se no programa de cashback da MegaStore e comece a economizar!

%%[ENDIF]%%
```

**Saída (exemplo para Maria Santos com cashback de R$ 42,50 em eletrônicos, R$ 18,30 em moda e R$ 7,90 em mercado):**
```
Oi, Maria! 🎉

Você tem R$ 42,50 de cashback disponível para resgatar!

Veja seu saldo por categoria:
- Eletrônicos: R$ 42,50
- Moda: R$ 18,30
- Mercado: R$ 7,90

Resgate agora em www.megastore.com.br/cashback e aproveite!
```

## Observações

- A função precisa de **pelo menos dois parâmetros** para funcionar.
- Todos os parâmetros devem ser **valores numéricos**. Se você passar texto ou valores não numéricos, a função pode gerar um erro.
- Você pode encadear chamadas de `Max` ou passar múltiplos parâmetros para comparar mais de dois valores de uma vez.
- Uma técnica muito comum é usar `Max` para definir **pisos** (valores mínimos garantidos), como no exemplo acima onde garantimos um cashback mínimo de R$ 15,00.
- Se você estiver trabalhando com valores vindos de Data Extensions, certifique-se de que os campos são do tipo numérico (Number ou Decimal) para evitar comportamentos inesperados.
- Para encontrar o **menor** valor entre vários números, use a função [Min](../math-functions/min.md).

## Funções relacionadas

- [Min](../math-functions/min.md) — Retorna o menor valor entre dois ou mais números (o oposto de `Max`)
- [Abs](../math-functions/abs.md) — Retorna o valor absoluto de um número, útil quando combinado com `Max` para trabalhar com valores sempre positivos
- [Round](../math-functions/round.md) — Arredonda um valor numérico para um número específico de casas decimais
- [Ceiling](../math-functions/ceiling.md) — Arredonda um número para cima, para o inteiro mais próximo
- [Floor](../math-functions/floor.md) — Arredonda um número para baixo, para o inteiro mais próximo
- [FormatCurrency](../string-functions/formatcurrency.md) — Formata um número como moeda, ótimo para exibir o resultado de `Max` em valores monetários
- [FormatNumber](../string-functions/formatnumber.md) — Formata um número com padrão específico de casas decimais e separadores
- [IIF](../utility-functions/iif.md) — Alternativa para comparações simples entre dois valores com retorno condicional