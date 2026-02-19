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
    title: 'Language',
    icon: '⌥',
    description: 'Syntax, variables, operators, loops and control flow — everything you need to read and write AMPscript fluently.',
    link: '/language/index',
  },
  {
    title: 'Functions',
    icon: 'ƒ',
    description: 'Complete reference for all 150+ AMPscript functions, organized by category with arguments and real-world examples.',
    link: '/function-index/index',
  },
  {
    title: 'Data Strings',
    icon: '⊕',
    description: 'Personalization strings, system strings, sender data and subscriber attributes for dynamic content.',
    link: '/attributes/index',
  },
  {
    title: 'Content Syndication',
    icon: '↗',
    description: 'Fetch and render external content inside your emails and landing pages using HTTP-based syndication.',
    link: '/content-syndication/index',
  },
  {
    title: 'Best Practices',
    icon: '◈',
    description: 'Patterns for writing reliable, maintainable AMPscript — defensive coding, debugging, error handling and more.',
    link: '/best-practices/index',
  },
  {
    title: 'Integrations',
    icon: '⇄',
    description: 'Using AMPscript alongside Server-Side JavaScript, Guide Template Language, Excel formulas and more.',
    link: '/ampscript-and-server-side-javascript/index',
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

        {/* Hero */}
        <section className={styles.hero}>
          <div className={styles.heroInner}>
            <div className={styles.badge}>Salesforce Marketing Cloud</div>
            <h1 className={styles.heroTitle}>
              AMPscript<br />
              <span className={styles.heroTitleAccent}>The Guide</span>
            </h1>
            <p className={styles.heroSubtitle}>
              A comprehensive reference manual for AMPscript —<br />
              the scripting language powering personalization in Salesforce Marketing Cloud.
            </p>
            <div className={styles.heroActions}>
              <Link to="/introduction/index" className={styles.btnPrimary}>
                Get Started
              </Link>
              <Link to="/function-index/index" className={styles.btnSecondary}>
                Function Index
              </Link>
            </div>
          </div>
          <div className={styles.heroCode}>
            <div className={styles.codeWindow}>
              <div className={styles.codeWindowBar}>
                <span /><span /><span />
              </div>
              <pre className={styles.codeBlock}>{`%%[

  var @firstName, @rows, @row
  set @rows = LookupRows(
    "Subscribers",
    "Email", emailaddr
  )

  if not empty(@rows) then
    set @row = Row(@rows, 1)
    set @firstName = Field(@row, "FirstName")
  endif

]%%

Hello, %%=v(@firstName)=%%!`}</pre>
            </div>
          </div>
        </section>

        {}
        <section className={styles.cards}>
          <div className={styles.cardsInner}>
            <h2 className={styles.sectionTitle}>Explore the Guide</h2>
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