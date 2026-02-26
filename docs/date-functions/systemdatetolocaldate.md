---
title: SystemDateToLocalDate
sidebar_label: SystemDateToLocalDate
description: Converte uma data/hora do sistema (Central Standard Time) para o horário local configurado na conta do usuário no Marketing Cloud.
---

<!-- generated-by-script -->

# SystemDateToLocalDate

## Descrição

A função `SystemDateToLocalDate` converte uma string de data/hora do sistema do Marketing Cloud para o horário local configurado na conta do usuário. O horário do sistema no SFMC é o North American Central Standard Time (UTC-6), **sem ajuste para horário de verão**. O horário local é aquele definido nas configurações (Setup) da sua conta no Marketing Cloud. Essa função é essencial quando você precisa exibir datas e horários corretamente para o fuso horário do seu público — por exemplo, para mostrar o horário de Brasília (UTC-3) em vez do horário do servidor.

## Sintaxe

```ampscript
SystemDateToLocalDate(systemTime)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|--------|-------------|-----------|
| systemTime | string | Sim | A string de data/hora no horário do sistema (CST/UTC-6) que você deseja converter para o horário local da conta do Marketing Cloud. |

## Exemplo básico

```ampscript
%%[
SET @currentSystemTime = Now()
SET @horaLocal = SystemDateToLocalDate(@currentSystemTime)
]%%

Horário do sistema (CST): %%=v(@currentSystemTime)=%%
Horário local (Brasília): %%=v(@horaLocal)=%%
```

**Saída:**
```
Horário do sistema (CST): 7/15/2025 10:00:00 AM
Horário local (Brasília): 7/15/2025 1:00:00 PM
```

## Exemplo avançado

Imagine que a **MegaStore** está rodando uma promoção relâmpago de Black Friday e precisa mostrar no e-mail o horário exato em que a oferta expira, no fuso horário correto do Brasil:

```ampscript
%%[
/* Busca dados da promoção na Data Extension */
SET @emailAssinante = AttributeValue("EmailAddress")
SET @nomeAssinante = AttributeValue("PrimeiroNome")

SET @promoRows = LookupRows("PromocoesAtivas", "EmailAssinante", @emailAssinante)

IF RowCount(@promoRows) > 0 THEN
  SET @promoRow = Row(@promoRows, 1)
  SET @nomePromo = Field(@promoRow, "NomePromocao")
  SET @descontoValor = Field(@promoRow, "DescontoReais")
  SET @expiraSystemTime = Field(@promoRow, "DataExpiracao")

  /* Converte a data de expiração do sistema para horário de Brasília */
  SET @expiraLocal = SystemDateToLocalDate(@expiraSystemTime)

  /* Formata a data no padrão brasileiro */
  SET @dataFormatada = FormatDate(@expiraLocal, "dd/MM/yyyy")
  SET @horaFormatada = FormatDate(@expiraLocal, "HH:mm")

  /* Pega o horário atual local para verificar se a promo ainda é válida */
  SET @agoraSystem = Now()
  SET @agoraLocal = SystemDateToLocalDate(@agoraSystem)
  SET @horasRestantes = DateDiff(@agoraLocal, @expiraLocal, "H")
]%%

Oi, %%=v(@nomeAssinante)=%%, tudo bem? 🎉

A promoção <b>%%=v(@nomePromo)=%%</b> te dá <b>R$ %%=v(@descontoValor)=%% de desconto</b>!

⏰ Corre que essa oferta expira em <b>%%=v(@dataFormatada)=%% às %%=v(@horaFormatada)=%% (horário de Brasília)</b>.

%%[ IF @horasRestantes <= 6 AND @horasRestantes > 0 THEN ]%%
🔥 Faltam apenas <b>%%=v(@horasRestantes)=%% horas</b>! Não perca!
%%[ ENDIF ]%%

Aproveite com frete grátis acima de R$ 299!
👉 www.megastore.com.br/blackfriday

%%[ ELSE ]%%

Oi, %%=v(@nomeAssinante)=%%, fique de olho! Em breve teremos ofertas exclusivas para você.

%%[ ENDIF ]%%
```

**Saída:**
```
Oi, Maria, tudo bem? 🎉

A promoção Black Friday Eletrônicos te dá R$ 150,00 de desconto!

⏰ Corre que essa oferta expira em 29/11/2025 às 23:59 (horário de Brasília).

🔥 Faltam apenas 4 horas! Não perca!

Aproveite com frete grátis acima de R$ 299!
👉 www.megastore.com.br/blackfriday
```

## Observações

- O horário do sistema do Marketing Cloud é **Central Standard Time (CST / UTC-6)** e **não** se ajusta automaticamente para o horário de verão (daylight saving time). Isso significa que durante o horário de verão americano, a diferença para UTC muda na prática. Fique atento a esse detalhe ao calcular diferenças de horário.
- O horário local retornado depende inteiramente da configuração de fuso horário da sua conta no Marketing Cloud (**Setup > Company Settings > Account Settings**). Se sua conta estiver configurada para o fuso de Brasília (UTC-3), a função vai adicionar 3 horas ao horário do sistema.
- Se você passar um valor nulo ou uma string inválida como parâmetro, a função pode retornar resultados inesperados ou causar erro. É uma boa prática validar o valor antes usando [Empty](../utility-functions/empty.md) ou [IsNull](../utility-functions/isnull.md).
- Para fazer a conversão inversa (horário local → horário do sistema), use a função [LocalDateToSystemDate](../date-functions/localdatetosystemdate.md).
- Essa função é útil tanto em e-mails quanto em CloudPages e Landing Pages — em qualquer contexto onde você precise exibir horários no fuso correto para o usuário final.
- Se você armazena datas em Data Extensions no horário do sistema, **sempre converta** antes de exibir ao assinante para evitar confusão com horários.

## Funções relacionadas

- [Now](../date-functions/now.md) — retorna a data/hora atual do sistema (CST), ideal para passar como parâmetro para `SystemDateToLocalDate`
- [SystemDate](../date-functions/systemdate.md) — retorna a data do sistema sem o componente de hora
- [LocalDateToSystemDate](../date-functions/localdatetosystemdate.md) — faz a conversão inversa: do horário local para o horário do sistema
- [FormatDate](../date-functions/formatdate.md) — formata datas para exibição (ex: formato brasileiro DD/MM/AAAA)
- [DateAdd](../date-functions/dateadd.md) — adiciona intervalos de tempo a uma data
- [DateDiff](../date-functions/datediff.md) — calcula a diferença entre duas datas
- [DatePart](../date-functions/datepart.md) — extrai partes específicas de uma data (hora, minuto, dia, etc.)
- [GetSendTime](../date-functions/getsendtime.md) — retorna a data/hora de envio do e-mail