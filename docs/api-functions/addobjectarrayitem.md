---
title: AddObjectArrayItem
sidebar_label: AddObjectArrayItem
description: Adiciona um objeto a uma propriedade de array dentro de um objeto da API do Marketing Cloud Engagement.
---

<!-- generated-by-script -->

# AddObjectArrayItem

## Descrição

A função `AddObjectArrayItem` adiciona um item (geralmente um objeto da API) a uma propriedade do tipo array dentro de outro objeto da API do Marketing Cloud Engagement. Ela é usada quando você precisa montar objetos complexos da SOAP API que possuem propriedades que aceitam múltiplos itens — por exemplo, adicionar atributos a um subscriber ou adicionar múltiplos objetos a uma lista. Essa função faz parte do conjunto de funções de API do AMPscript que permitem interagir diretamente com a SOAP API do Marketing Cloud sem precisar de chamadas externas.

## Sintaxe

```ampscript
AddObjectArrayItem(@apiObject, "arrayProperty", @itemToAdd)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|----------------|-----------|---------------|----------------|
| @apiObject | API Object | Sim | O objeto da API que contém o array que você quer modificar. Normalmente criado com `CreateObject`. |
| arrayProperty | String | Sim | O nome da propriedade do tipo array no objeto da API que vai receber o novo item. |
| @itemToAdd | String / API Object | Sim | O item a ser adicionado ao array. Pode ser outro objeto da API criado com `CreateObject`. |

## Exemplo básico

Neste exemplo, vamos criar um subscriber e adicionar um atributo personalizado (como o nome do cliente) ao array `Attributes` dele.

```ampscript
%%[
/* Cria o objeto Subscriber */
SET @subscriber = CreateObject("Subscriber")
SetObjectProperty(@subscriber, "EmailAddress", "joao.silva@email.com.br")
SetObjectProperty(@subscriber, "SubscriberKey", "JS-00123")

/* Cria um atributo para o nome */
SET @attrNome = CreateObject("Attribute")
SetObjectProperty(@attrNome, "Name", "NomeCompleto")
SetObjectProperty(@attrNome, "Value", "João Silva")

/* Adiciona o atributo ao array Attributes do subscriber */
AddObjectArrayItem(@subscriber, "Attributes", @attrNome)
]%%
```

**Saída:**

```
O atributo "NomeCompleto" com valor "João Silva" é adicionado ao array Attributes do objeto @subscriber.
Nenhuma saída visível é gerada — a função apenas modifica o objeto em memória.
```

## Exemplo avançado

Cenário real: uma loja fictícia chamada **Lojas Vitória** quer criar um subscriber via SOAP API diretamente pelo AMPscript, adicionando múltiplos atributos personalizados (nome, CPF, cidade e programa de pontos). Depois, o subscriber é criado no Marketing Cloud usando `InvokeCreate`.

```ampscript
%%[
/* === Cria o objeto Subscriber === */
SET @novoSub = CreateObject("Subscriber")
SetObjectProperty(@novoSub, "EmailAddress", "maria.santos@email.com.br")
SetObjectProperty(@novoSub, "SubscriberKey", "LV-98765")

/* === Atributo: Nome Completo === */
SET @attrNome = CreateObject("Attribute")
SetObjectProperty(@attrNome, "Name", "NomeCompleto")
SetObjectProperty(@attrNome, "Value", "Maria Santos")
AddObjectArrayItem(@novoSub, "Attributes", @attrNome)

/* === Atributo: CPF === */
SET @attrCPF = CreateObject("Attribute")
SetObjectProperty(@attrCPF, "Name", "CPF")
SetObjectProperty(@attrCPF, "Value", "123.456.789-00")
AddObjectArrayItem(@novoSub, "Attributes", @attrCPF)

/* === Atributo: Cidade === */
SET @attrCidade = CreateObject("Attribute")
SetObjectProperty(@attrCidade, "Name", "Cidade")
SetObjectProperty(@attrCidade, "Value", "Belo Horizonte")
AddObjectArrayItem(@novoSub, "Attributes", @attrCidade)

/* === Atributo: Pontos do Programa Fidelidade === */
SET @attrPontos = CreateObject("Attribute")
SetObjectProperty(@attrPontos, "Name", "PontosFidelidade")
SetObjectProperty(@attrPontos, "Value", "4500")
AddObjectArrayItem(@novoSub, "Attributes", @attrPontos)

/* === Adiciona o subscriber à lista === */
SET @listaObj = CreateObject("SubscriberList")
SetObjectProperty(@listaObj, "ID", "12345")
SetObjectProperty(@listaObj, "Status", "Active")
AddObjectArrayItem(@novoSub, "Lists", @listaObj)

/* === Invoca a criação do subscriber === */
SET @statusMsg = InvokeCreate(@novoSub, @createStatus, @errorCode)

IF @statusMsg == "OK" THEN
  Output(Concat("Subscriber criado com sucesso! Bem-vinda, Maria Santos. Você já tem 4.500 pontos no programa Lojas Vitória Fidelidade!"))
ELSE
  Output(Concat("Erro ao criar subscriber: ", @errorCode))
ENDIF
]%%
```

**Saída (em caso de sucesso):**

```
Subscriber criado com sucesso! Bem-vinda, Maria Santos. Você já tem 4.500 pontos no programa Lojas Vitória Fidelidade!
```

## Observações

- A função `AddObjectArrayItem` **não retorna nenhum valor**. Ela modifica diretamente o objeto da API passado como primeiro parâmetro.
- Você pode chamar `AddObjectArrayItem` **múltiplas vezes** no mesmo objeto e na mesma propriedade de array para adicionar vários itens — como mostrado no exemplo avançado com múltiplos atributos.
- O objeto passado no parâmetro `@apiObject` precisa ter sido previamente criado com a função [CreateObject](../api-functions/createobject.md). Da mesma forma, o item adicionado (`@itemToAdd`) geralmente também é um objeto criado com `CreateObject`.
- Essa função faz parte do fluxo de trabalho com a **SOAP API via AMPscript**. O padrão típico é: `CreateObject` → `SetObjectProperty` → `AddObjectArrayItem` → `InvokeCreate` / `InvokeUpdate`.
- A propriedade `arrayProperty` precisa ser um nome válido de propriedade do tipo array no objeto da API em questão. Se você passar um nome inválido, o comportamento pode resultar em erro no momento do `Invoke`.
- Essa função é mais utilizada em **cenários avançados** de automação, como criação/atualização de subscribers, triggered sends e gerenciamento de listas diretamente via AMPscript, sem depender de chamadas REST externas.
- Funciona em **emails, CloudPages e Landing Pages**, mas tenha cuidado com o tempo de execução — operações com a SOAP API podem ser lentas e impactar a performance do envio.

## Funções relacionadas

- [CreateObject](../api-functions/createobject.md) — cria um objeto da API do Marketing Cloud para ser manipulado via AMPscript
- [SetObjectProperty](../api-functions/setobjectproperty.md) — define o valor de uma propriedade simples em um objeto da API
- [InvokeCreate](../api-functions/invokecreate.md) — executa a criação de um objeto da API no Marketing Cloud
- [InvokeUpdate](../api-functions/invokeupdate.md) — executa a atualização de um objeto da API já existente
- [InvokeDelete](../api-functions/invokedelete.md) — executa a exclusão de um objeto da API
- [InvokeRetrieve](../api-functions/invokeretrieve.md) — recupera dados de um objeto da API
- [InvokePerform](../api-functions/invokeperform.md) — executa uma ação (perform) em um objeto da API
- [RaiseError](../utility-functions/raiseerror.md) — levanta um erro personalizado, útil para tratamento de falhas nas operações com a API