export async function GET() {
  const spec = {
    openapi: "3.1.0",
    info: {
      title: "Fullstack Newsletter API",
      version: "1.0.0",
    },
    servers: [{ url: "/" }],
    paths: {
      "/api/v1/posts": { get: { responses: { "200": { description: "ok" } } } },
    },
  };

  return Response.json(spec, {
    headers: {
      "cache-control": "public, max-age=60",
    },
  });
}
