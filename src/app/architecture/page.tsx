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
            Data Ingestion Layer
          </h2>
          <p className="text-muted-foreground mb-4">
            The application fetches news from configured endpoints (like the Guardian API or RSS feeds). It runs on a scheduled basis (or manually for the MVP) and stores raw articles into the PostgreSQL database.
          </p>
          <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
            <li>Prevents duplicates by matching unique article URLs.</li>
            <li>Checks for relevant keywords configured in the "Topics" or "Competitors" sections.</li>
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
