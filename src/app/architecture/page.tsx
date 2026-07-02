export default function ArchitecturePage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto py-8">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight mb-4">Architecture Overview</h1>
        <p className="text-lg text-muted-foreground">
          Understanding how the Economics News Monitoring Agent ingests, processes, and serves data.
        </p>
      </div>

      <div className="grid gap-8">
        <section className="bg-card p-6 rounded-xl border shadow-sm">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-lg text-primary">1</div>
            Data Ingestion Layer (Multi-Provider)
          </h2>
          <p className="text-muted-foreground mb-4">
            The application dynamically loads a suite of News Providers, fetching data concurrently via <code>Promise.all()</code>. Current active providers include:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-4 text-sm text-muted-foreground">
            <li><strong>The Guardian API:</strong> Fetches comprehensive news explicitly filtered for economic relevance.</li>
            <li><strong>NewsAPI:</strong> A global aggregator mapping thousands of sources, querying dynamically based on your active Topics and Countries.</li>
          </ul>
          <p className="text-sm font-semibold text-slate-800 mb-2">Intelligent Deduplication:</p>
          <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
            <li>Blocks duplicate ingestions via exact URL or exact Title matches.</li>
            <li>Employs a custom <strong>Levenshtein distance</strong> string similarity algorithm to block articles if the title matches existing news with &gt;90% similarity.</li>
          </ul>
        </section>

        <section className="bg-card p-6 rounded-xl border shadow-sm">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-lg text-primary">2</div>
            AI Processing Engine
          </h2>
          <p className="text-muted-foreground mb-4">
            Once raw articles are ingested, the system triggers the AI worker. The worker batches unanalyzed articles and sends their content to the Google Gemini API.
          </p>
          <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
            <li>Extracts structured JSON containing a summary, importance score, and sentiment.</li>
            <li>Filters out non-economic articles (like sports or celebrity gossip) by flagging them as <strong>noise</strong>.</li>
          </ul>
        </section>

        <section className="bg-card p-6 rounded-xl border shadow-sm">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-lg text-primary">3</div>
            Presentation & Storage
          </h2>
          <p className="text-muted-foreground mb-4">
            The Next.js App Router serves the frontend interface. The Dashboard only queries for articles that have been processed and flagged as high-importance (score &ge; 6) and non-noise.
          </p>
          <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
            <li><strong>Database:</strong> Neon Serverless PostgreSQL managed by Prisma ORM.</li>
            <li><strong>UI:</strong> Tailwind CSS and Shadcn UI components for a modern, responsive feel.</li>
          </ul>
        </section>
      </div>
    </div>
  )
}
