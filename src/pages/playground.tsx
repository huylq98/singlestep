import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import { sims } from '@site/src/components/sims/registry';

export default function Playground() {
  const byCategory = sims.reduce<Record<string, typeof sims>>((acc, s) => {
    (acc[s.category] ||= []).push(s);
    return acc;
  }, {});

  return (
    <Layout title="Playground" description="Interactive engineering simulations.">
      <main style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1rem' }}>
        <h1>Playground</h1>
        <p>
          Every interactive simulation on the site, grouped by topic. Each one is embedded
          in a doc page that explains the concept — click through to learn the context.
        </p>
        {Object.entries(byCategory).map(([category, items]) => (
          <section key={category} style={{ marginTop: '2rem' }}>
            <h2>{category}</h2>
            <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: '0.75rem' }}>
              {items.map((s) => (
                <li
                  key={s.id}
                  style={{
                    border: '1px solid var(--ifm-color-emphasis-300)',
                    borderRadius: 8,
                    padding: '1rem',
                  }}
                >
                  <h3 style={{ margin: 0 }}>
                    <Link to={s.embeddedAt}>{s.name}</Link>
                  </h3>
                  <p style={{ margin: '0.25rem 0 0', color: 'var(--ifm-color-emphasis-700)' }}>
                    {s.blurb}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </main>
    </Layout>
  );
}
