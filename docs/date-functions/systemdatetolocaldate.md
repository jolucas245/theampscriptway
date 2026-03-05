---
title: SystemDateToLocalDate
sidebar_label: SystemDateToLocalDate
description: Converte uma data/hora do sistema (Central Standard Time) para o horário local configurado na conta do Marketing Cloud.
---

# SystemDateToLocalDate

## Descrição

Converte uma string de data/hora do sistema para o horário local do usuário atual do Marketing Cloud. O horário do sistema é o North American Central Standard Time (UTC-6), **sem** ajuste de horário de verão. O horário local é o configurado na conta do usuário no Marketing Cloud, que pode ser definido em Setup.

No contexto brasileiro, essa função é essencial para garantir que datas e horários exibidos nos e-mails e CloudPages reflitam o fuso horário correto do Brasil (normalmente UTC-3 para Brasília), já que o sistema sempre trabalha internamente em CST (UTC-6).

## Sintaxe

```ampscript
SystemDateToLocalDate(@systemTime)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| systemTime | string | Sim | O valor de data/hora do sistema que você deseja converter para o horário local. |

## Exemplo básico

Convertendo o horário atual do sistema para o horário local configurado na conta (ex: horário de Brasília) para exibir em um e-mail da Lojas Vitória.

```ampscript
%%[
SET @currentSystemTime = NOW()
SET @horarioLocal = SystemDateToLocalDate(@currentSystemTime)
]%%

Olá, João Silva!

Horário do sistema (CST): %%=V(@currentSystemTime)=%%
Horário de Brasília: %%=V(@horarioLocal)=%%
```

**Saída:**
```
Olá, João Silva!

Horário do sistema (CST): 1/15/2025 7:00:00 AM
Horário de Brasília: 1/15/2025 10:00:00 AM
```

## Exemplo avançado

E-mail transacional do Banco Brasilão que registra o horário de envio de um alerta de segurança, convertendo o horário do sistema para o fuso local e formatando no padrão brasileiro.

```ampscript
%%[
SET @currentSystemTime = NOW()
SET @horarioLocal = SystemDateToLocalDate(@currentSystemTime)

SET @dataFormatada = FormatDate(@horarioLocal, "dd/MM/yyyy")
SET @horaFormatada = FormatDate(@horarioLocal, "HH:mm:ss")

SET @nomeCliente = "Maria Santos"
SET @tipoAlerta = "Tentativa de login"
]%%

Olá, %%=V(@nomeCliente)=%%!

Detectamos uma atividade na sua conta:

Tipo: %%=V(@tipoAlerta)=%%
Data: %%=V(@dataFormatada)=%%
Horário: %%=V(@horaFormatada)=%% (horário de Brasília)

Se não foi você, entre em contato com a central:
(11) 3000-9999 ou acesse www.bancobrasilao.com.br
```

**Saída:**
```
Olá, Maria Santos!

Detectamos uma atividade na sua conta:

Tipo: Tentativa de login
Data: 15/01/2025
Horário: 10:00:00 (horário de Brasília)

Se não foi você, entre em contato com a central:
(11) 3000-9999 ou acesse www.bancobrasilao.com.br
```

## Observações

> **⚠️ Atenção:** O horário do sistema do Marketing Cloud é **Central Standard Time (UTC-6)** e **não** se ajusta automaticamente para o horário de verão (daylight saving time). Isso significa que a diferença entre o horário do sistema e UTC é sempre fixa em -6 horas, independentemente da época do ano.

> **⚠️ Atenção:** O horário local retornado pela função depende da configuração de fuso horário da sua conta de usuário no Marketing Cloud, definida em **Setup**. Se o fuso horário da conta não estiver configurado corretamente para o Brasil (ex: UTC-3 Brasília), a conversão retornará um horário incorreto. Verifique essa configuração antes de usar a função.

> **💡 Dica:** Use essa função sempre que precisar exibir horários para o assinante final. Mostrar horários em CST em um e-mail para clientes brasileiros gera confusão. Combine com [FormatDate](../date-functions/formatdate.md) para formatar no padrão DD/MM/AAAA que o público brasileiro espera.

> **💡 Dica:** Para fazer a operação inversa - converter um horário local para o horário do sistema - use [LocalDateToSystemDate](../date-functions/localdatetosystemdate.md).

## Funções relacionadas

- [Now](../date-functions/now.md) - retorna a data/hora atual do sistema
- [LocalDateToSystemDate](../date-functions/localdatetosystemdate.md) - operação inversa: converte horário local para horário do sistema
- [FormatDate](../date-functions/formatdate.md) - formata datas para exibição (ex: padrão brasileiro DD/MM/AAAA)
- [DateAdd](../date-functions/dateadd.md) - adiciona intervalos a uma data
- [DatePart](../date-functions/datepart.md) - extrai partes específicas de uma data