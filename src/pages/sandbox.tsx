import Layout from '@theme/Layout';
import { sims } from '@site/src/components/sims/registry';

export default function Sandbox() {
  if (process.env.NODE_ENV !== 'development') {
    return (
      <Layout title="Sandbox">
        <main style={{ padding: '2rem' }}>
          <h1>Sandbox</h1>
          <p>Not available in production builds.</p>
        </main>
      </Layout>
    );
  }

  return (
    <Layout title="Sandbox">
      <main style={{ padding: '2rem', maxWidth: 900, margin: '0 auto' }}>
        <h1>Sandbox</h1>
        <p>Renders each registered sim alone for iteration. Dev-only.</p>
        {sims.length === 0 ? (
          <p><em>No sims registered yet.</em></p>
        ) : (
          sims.map(({ id, name, Component }) => (
            <section key={id} style={{ marginTop: '2rem' }}>
              <h2>{name}</h2>
              <Component />
            </section>
          ))
        )}
      </main>
    </Layout>
  );
}
