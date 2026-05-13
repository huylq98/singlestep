import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import { sims } from '@site/src/components/sims/registry';
import { RedisReadMode } from '@site/src/components/sims/RedisReadMode';

export default function Home() {
  const featured = sims[0];
  return (
    <Layout
      title="Singlestep"
      description="Interactive engineering knowledge base. Single-step through the hard stuff."
    >
      <main>
        <section style={{ padding: '4rem 1rem 2rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '3rem', margin: 0 }}>Singlestep</h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--ifm-color-emphasis-700)' }}>
            Single-step through the hard stuff.
          </p>
          <p style={{ maxWidth: 640, margin: '1rem auto', color: 'var(--ifm-color-emphasis-800)' }}>
            An engineering knowledge base built around interactive simulations.
            Don't read about how a system behaves — play with it.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginTop: '1.5rem' }}>
            <Link className="button button--primary button--lg" to="/docs/intro">Browse the docs</Link>
            <Link className="button button--secondary button--lg" to="/playground">Play with sims</Link>
          </div>
        </section>

        <section style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1rem' }}>
          <h2>Featured: {featured?.name ?? 'Coming soon'}</h2>
          {featured && (
            <>
              <p style={{ color: 'var(--ifm-color-emphasis-700)' }}>{featured.blurb}</p>
              <RedisReadMode initialMode="master" />
              <p>
                <Link to={featured.embeddedAt}>Read the full page →</Link>
              </p>
            </>
          )}
        </section>
      </main>
    </Layout>
  );
}
