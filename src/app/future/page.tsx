export default function FutureImprovementsPage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto py-8">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight mb-4">Future Improvements</h1>
        <p className="text-lg text-muted-foreground">
          A roadmap for taking the MVP to a production-ready, enterprise-scale platform.
        </p>
      </div>

      <div className="space-y-6">
        <div className="border-l-4 border-blue-500 pl-6 py-2">
          <h2 className="text-2xl font-bold mb-2">Phase 1: Near-Term Enhancements</h2>
          <p className="text-muted-foreground mb-4">Focusing on automation, stability, and notifications.</p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li><strong>Background Scheduler:</strong> Replace manual refresh with Node-Cron or Vercel Cron jobs to fetch data automatically every 30 minutes.</li>
            <li><strong>Alerting System:</strong> Integrate Slack Webhooks or Email notifications (via Resend) when high-impact news (score &ge; 8) drops.</li>
            <li><strong>User Accounts:</strong> Add Clerk or NextAuth to secure the dashboard and allow personalized tracking preferences.</li>
          </ul>
        </div>

        <div className="border-l-4 border-purple-500 pl-6 py-2">
          <h2 className="text-2xl font-bold mb-2">Phase 2: Scale & Intelligence</h2>
          <p className="text-muted-foreground mb-4">Handling mass data and improving analytical depth.</p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li><strong>Message Queues:</strong> Transition the AI generation step to a queue (BullMQ/RabbitMQ) to prevent timeouts and handle rate limits safely.</li>
            <li><strong>Vector Embeddings:</strong> Store article embeddings in a Vector Database (like Pinecone) to enable semantic search ("Find articles about rising oil prices").</li>
            <li><strong>Entity Clustering:</strong> Automatically group 5 different articles about the same event into a single "Story Arc".</li>
          </ul>
        </div>

        <div className="border-l-4 border-emerald-500 pl-6 py-2">
          <h2 className="text-2xl font-bold mb-2">Phase 3: Enterprise Features</h2>
          <p className="text-muted-foreground mb-4">Adding predictive features and complex workflows.</p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li><strong>Market Impact Predictions:</strong> Use LLMs to forecast which specific sectors or indices might react to the news.</li>
            <li><strong>RAG Knowledge Base:</strong> Allow users to upload PDFs (e.g., internal company policies) and have the AI analyze public news against their private data context.</li>
            <li><strong>Microservices:</strong> Split the monolith. Move the ingestion engine to a dedicated high-speed Python/Go service.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
