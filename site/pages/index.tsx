import { FormEvent, useState } from "react";

export default function Home() {
  const [serviceName, setServiceName] = useState("orders-api");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!serviceName.trim()) {
      setError("Please enter a service name.");
      return;
    }

    try {
      setIsGenerating(true);

      const res = await fetch(
        `/api/generate-service?name=${encodeURIComponent(serviceName.trim())}`
      );

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Failed with status ${res.status}`);
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${serviceName.trim().toLowerCase()}-scaffold.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to generate service.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <main style={{ fontFamily: "system-ui, sans-serif", padding: "2rem", maxWidth: 800, margin: "0 auto" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "0.5rem" }}>
        Platform Golden Path
      </h1>
      <p style={{ color: "#555", marginBottom: "1.5rem" }}>
        An opinionated, production-ready service scaffold that gives teams a
        CI/CD-enabled, cloud-ready microservice in minutes.
      </p>

      <section style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.5rem" }}>
          Generate a New Service
        </h2>
        <p style={{ marginBottom: "0.75rem" }}>
          Enter a service name and download a ready-to-customize scaffold
          including service code, infrastructure, and CI workflow.
        </p>

        <form onSubmit={handleGenerate} style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
          <input
            type="text"
            value={serviceName}
            onChange={e => setServiceName(e.target.value)}
            placeholder="e.g. orders-api"
            style={{
              flex: 1,
              padding: "0.5rem 0.75rem",
              borderRadius: 4,
              border: "1px solid #ccc",
            }}
          />
          <button
            type="submit"
            disabled={isGenerating}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: 4,
              border: "none",
              backgroundColor: "#2563eb",
              color: "white",
              cursor: "pointer",
              opacity: isGenerating ? 0.7 : 1,
            }}
          >
            {isGenerating ? "Generating..." : "Generate Service"}
          </button>
        </form>

        {error && (
          <div style={{ color: "#b91c1c", fontSize: "0.9rem" }}>
            {error}
          </div>
        )}

        <p style={{ fontSize: "0.85rem", color: "#666", marginTop: "0.5rem" }}>
          The download includes <code>services/&lt;name&gt;</code>,{" "}
          <code>infra/&lt;name&gt;-infra</code>, and CI workflow files.
        </p>
      </section>

      <section style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.5rem" }}>
          What&apos;s Included
        </h2>
        <ul style={{ paddingLeft: "1.25rem", color: "#444" }}>
          <li>Service code template with opinionated structure</li>
          <li>Infrastructure (e.g. CDK) project for the service</li>
          <li>CI workflow wired for lint, tests, and build</li>
          <li>
  Tokenized naming: <code>{"{{SERVICE_NAME}}"}</code> and{" "}
  <code>{"{{SERVICE_CLASS_NAME}}"}</code> replaced automatically
</li>

        </ul>
      </section>

      <section>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.5rem" }}>
          Learn More
        </h2>
        <p>
          See the{" "}
          <a href="/docs" style={{ color: "#2563eb", textDecoration: "underline" }}>
            documentation
          </a>{" "}
          for how this golden path fits into CI/CD, platform governance, and developer experience.
        </p>
      </section>
    </main>
  );
}
