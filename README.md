# AMPScript Way

> Referência completa de AMPscript em português, feita pela comunidade brasileira de Salesforce Marketing Cloud.

**[ampscriptway.com](https://ampscriptway.com)** &nbsp;·&nbsp; [Playground](https://ampscriptway.com/playground) &nbsp;·&nbsp; [Documentação](https://ampscriptway.com/getting-started/introduction)

---

## Sobre o projeto

A documentação oficial do AMPscript é em inglês, técnica e muitas vezes incompleta nos exemplos. O **AMPScript Way** nasceu para resolver isso: uma referência completa em PT-BR, com exemplos que fazem sentido para a realidade brasileira.

- Explicação clara sobre as funções, com uma linguagem bem acessível
- Nomes brasileiros, moeda em Real, datas no formato DD/MM/AAAA
- Cenários reais: programas de fidelidade, cashback, Dia das Mães, Black Friday
- Playground para testar AMPscript diretamente dentro do nosso projeto, sem acesso ao Marketing Cloud
- Guias de boas práticas e comportamentos específicos do Marketing Cloud Engagement

## Funcionalidades

- **Documentação completa** de funções AMPscript organizadas por categoria
- **Playground interativo AMPScript** com editor Monaco, suporte a variáveis de subscriber e Data Extensions
- **Busca** em toda a documentação
- **Modo claro e escuro**

## Rodando localmente

**Pré-requisitos:** Node.js 18+

```bash
# Clone o repositório
git clone https://github.com/jolucas245/AMPScript-Way.git
cd AMPScript-Way

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm start
```

O site estará disponível em `http://localhost:3000/The-AMPScript-Way/`.

> **Atenção:** a busca não funciona em modo de desenvolvimento. Para testar, rode `npm run build && npm run serve`.

## Estrutura do projeto

```
docs/
├── getting-started/       # Guias introdutórios
├── string-functions/      # Funções de string
├── date-functions/        # Funções de data
├── math-functions/        # Funções matemáticas
├── data-extension-functions/
├── encryption-functions/
└── ...

src/
├── components/
│   └── Playground/        # Playground interativo
├── lib/
│   └── ampscript/         # Recriação do Interpretador AMPScript
└── css/
    └── custom.css         # Estilização pra ficar bonitin
```

## Como contribuir

Contribuições são bem-vindas! Veja como ajudar:

- **Correções:** encontrou um erro na documentação? Abre uma issue ou manda um PR
- **Novas funções:** alguma função não está documentada? Siga o padrão dos arquivos existentes em `docs/`
- **Exemplos:** exemplos adicionais com contexto brasileiro são sempre úteis
- **Playground:** melhorias no interpretador AMPscript em `src/lib/ampscript/`

### Padrão dos arquivos de documentação

Cada função tem seu próprio arquivo `.md` seguindo esta estrutura:

```markdown
---
title: NomeDaFuncao
sidebar_label: NomeDaFuncao
description: Descrição bem curtinha da função.
---

# NomeDaFuncao

Descrição da função.

## Sintaxe

...

## Parâmetros

...

## Exemplo

...
```

## Licença

MIT © [João Lucas](https://linkedin.com/in/jolucas245)

---

<p align="center">
  Feito com café para a comunidade brasileira de Salesforce Marketing Cloud
</p>