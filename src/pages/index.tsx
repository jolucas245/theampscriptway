import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import styles from './index.module.css';

type CardItem = {
  title: string;
  icon: string;
  description: string;
  link: string;
};

const cards: CardItem[] = [
  {
    title: 'Primeiros Passos',
    icon: '⌥',
    description: 'Sintaxe, variáveis, operadores, loops e controle de fluxo — tudo que você precisa para ler e escrever AMPscript com fluência.',
    link: '/getting-started/introduction',
  },
  {
    title: 'Índice de Funções',
    icon: 'ƒ',
    description: 'Referência completa de todas as funções AMPscript, organizadas por categoria com parâmetros e exemplos reais.',
    link: '/function-index',
  },
  {
    title: 'Funções de String',
    icon: 'Aa',
    description: 'Concat, Substring, Replace, RegExMatch e todas as funções para manipulação de texto.',
    link: '/string-functions/concat',
  },
  {
    title: 'Funções de Data Extension',
    icon: '⊕',
    description: 'Lookup, LookupRows, InsertDE, UpdateDE, UpsertDE e todas as funções para trabalhar com Data Extensions.',
    link: '/data-extension-functions/lookup',
  },
  {
    title: 'Funções de Data',
    icon: '📅',
    description: 'Now, DateAdd, DateDiff, FormatDate e todas as funções para manipulação de datas e horários.',
    link: '/date-functions/now',
  },
  {
    title: 'Playground',
    icon: '▶',
    description: 'Teste seu código AMPscript diretamente no browser, sem precisar de acesso ao Marketing Cloud.',
    link: '/playground',
  },
];

function Card({title, icon, description, link}: CardItem) {
  return (
    <Link to={link} className={styles.card}>
      <div className={styles.cardIcon}>{icon}</div>
      <h3 className={styles.cardTitle}>{title}</h3>
      <p className={styles.cardDescription}>{description}</p>
      <span className={styles.cardArrow}>→</span>
    </Link>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();

  return (
    <Layout description={siteConfig.tagline}>
      <main className={styles.main}>

        <section className={styles.hero}>
          <div className={styles.heroInner}>
            <div className={styles.badge}>Salesforce Marketing Cloud</div>
            <h1 className={styles.heroTitle}>
              The AMPscript<br />
              <span className={styles.heroTitleAccent}>Way</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Referência completa de AMPscript em português —<br />
              a linguagem de personalização do Salesforce Marketing Cloud.
            </p>
            <div className={styles.heroActions}>
              <Link to="/getting-started/introduction" className={styles.btnPrimary}>
                Começar agora
              </Link>
              <Link to="/function-index" className={styles.btnSecondary}>
                Índice de Funções
              </Link>
            </div>
          </div>
          <div className={styles.heroCode}>
            <div className={styles.codeWindow}>
              <div className={styles.codeWindowBar}>
                <span /><span /><span />
              </div>
              <pre className={styles.codeBlock}>{`%%[

  VAR @nome, @rows, @row
  SET @rows = LookupRows(
    "Clientes",
    "Email", emailaddr
  )

  IF NOT Empty(@rows) THEN
    SET @row = Row(@rows, 1)
    SET @nome = Field(@row, "PrimeiroNome")
  ENDIF

]%%

Olá, %%=v(@nome)=%%!`}</pre>
            </div>
          </div>
        </section>

        <section className={styles.cards}>
          <div className={styles.cardsInner}>
            <h2 className={styles.sectionTitle}>Explore o conteúdo</h2>
            <div className={styles.cardsGrid}>
              {cards.map((card) => (
                <Card key={card.title} {...card} />
              ))}
            </div>
          </div>
        </section>

      </main>
    </Layout>
  );
}