export default function Docs() {
    return (
      <main style={{ fontFamily: "system-ui, sans-serif", padding: "2rem", maxWidth: 800, margin: "0 auto" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "1rem" }}>
          Platform Golden Path Documentation
        </h1>
  
        <section style={{ marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.5rem" }}>
            Overview
          </h2>
          <p>
            Platform Golden Path provides a standard way to create new microservices and
            their infrastructure with built-in CI/CD, testing, and structure. It codifies
            platform best practices into repeatable templates.
          </p>
        </section>
  
        <section style={{ marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.5rem" }}>
            Local CLI Usage
          </h2>
          <pre
            style={{
              background: "#f5f5f5",
              padding: "0.75rem",
              borderRadius: 4,
              overflowX: "auto",
              fontSize: "0.9rem",
            }}
          >
  {`git clone <this-repo-url>
  cd platform-golden-path
  node scripts/new-service.js orders-api`}
          </pre>
          <p style={{ marginTop: "0.5rem" }}>
            This command generates:
          </p>
          <ul style={{ paddingLeft: "1.25rem" }}>
            <li><code>services/orders-api</code> – service code scaffold</li>
            <li><code>infra/orders-api-infra</code> – infra project</li>
            <li>CI workflow files under <code>.github/workflows</code></li>
          </ul>
        </section>
  
        <section style={{ marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.5rem" }}>
            Using the Hosted Generator
          </h2>
          <p>
            From the landing page, enter a service name and click <strong>Generate Service</strong>.
            You&apos;ll download a zip file containing the same scaffold you would get from the CLI.
          </p>
        </section>
  
        <section>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.5rem" }}>
            CI/CD and Platform Vision
          </h2>
          <p>
            Each generated service is wired to a CI workflow that can run lint, unit tests, and
            integration tests by default. This ensures new services start with a strong foundation
            for reliability, observability, and platform governance.
          </p>
        </section>
      </main>
    );
  }
  