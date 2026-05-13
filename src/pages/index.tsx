import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

const topics = [
  { label: 'Java', to: '/docs/java/intro', description: 'Core language, JVM, concurrency' },
  { label: 'Spring', to: '/docs/spring/intro', description: 'Spring Boot, Security, Data' },
  { label: 'System Design', to: '/docs/system-design/intro', description: 'Scalability & architecture' },
  { label: 'Design Patterns', to: '/docs/design-patterns/intro', description: 'GoF patterns with examples' },
  { label: 'SOLID', to: '/docs/solid/intro', description: 'Principles with code examples' },
  { label: 'Kafka', to: '/docs/kafka/intro', description: 'Event streaming & messaging' },
  { label: 'Database', to: '/docs/database/intro', description: 'SQL, indexing, transactions' },
  { label: 'Redis', to: '/docs/redis/intro', description: 'Caching, data structures' },
  { label: 'DevOps', to: '/docs/devops/intro', description: 'Docker, Kubernetes, CI/CD' },
  { label: 'AWS', to: '/docs/aws/intro', description: 'Core services & patterns' },
  { label: 'Security', to: '/docs/security/intro', description: 'Auth, encryption, OWASP' },
  { label: 'Coding Interview', to: '/docs/coding-interview/intro', description: 'Algorithms & problem patterns' },
];

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link className="button button--secondary button--lg" to="/docs/">
            Browse the Knowledge Base →
          </Link>
        </div>
      </div>
    </header>
  );
}

function TopicGrid() {
  return (
    <section className={styles.topicsSection}>
      <div className="container">
        <Heading as="h2" className={styles.sectionTitle}>Topics</Heading>
        <div className={styles.topicsGrid}>
          {topics.map(({label, to, description}) => (
            <Link key={label} to={to} className={styles.topicCard}>
              <strong>{label}</strong>
              <span>{description}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description="A practical, continuously growing knowledge base for software engineers">
      <HomepageHeader />
      <main>
        <TopicGrid />
      </main>
    </Layout>
  );
}
