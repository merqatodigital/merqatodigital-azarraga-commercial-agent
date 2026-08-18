import { AzarragaState } from "./AzarragaState";

export { AzarragaState };

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname.startsWith("/api/")) {
      const id = env.AzarragaState.idFromName("default");
      const stub = env.AzarragaState.get(id);
      return stub.fetch(request);
    }

    if (url.pathname === "/") {
      return Response.json({
        name: "Azarraga Commercial Agent Worker",
        version: "1.0.0",
        endpoints: [
          "POST /api/quotes — Create quote",
          "GET /api/quotes — List quotes",
          "POST /api/quotes/preview — Preview quote",
          "GET /api/quotes/sample — Sample quote",
          "GET /api/quotes/calculate — Calculate quote",
          "POST /api/leads — Create lead",
          "GET /api/leads — List leads",
          "POST /api/invoices — Create invoice",
          "GET /api/invoices — List invoices",
          "POST /api/documents — Upload document",
          "GET /api/documents — List documents",
          "GET /api/commercial-records — Commercial memory",
          "GET /api/dashboard — Dashboard",
          "GET /api/agent/models — Available models",
          "POST /api/agent — Chat with agent",
          "POST /api/quote-evidence — Find evidence",
        ],
      });
    }

    return new Response("Not found", { status: 404 });
  },
};

export interface Env {
  AzarragaState: DurableObjectNamespace;
  OPENROUTER_API_KEY?: string;
  OPENROUTER_MODEL?: string;
  NEXT_PUBLIC_APP_URL?: string;
}
