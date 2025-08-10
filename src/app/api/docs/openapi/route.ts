import { getApiDocs } from "@/lib/utils/swagger";

type OpenAPISpec = {
  openapi: string;
  info: {
    title: string;
    version: string;
    description?: string;
  };
  servers?: Array<{url: string}>;
  paths: Record<string, Record<string, unknown>>;
  components?: {
    schemas?: Record<string, Record<string, unknown>>;
    securitySchemes?: Record<string, Record<string, unknown>>;
  };
};

export async function GET() {
  const baseSpec = getApiDocs() as OpenAPISpec;

  const enhancedSpec: OpenAPISpec = {
    ...baseSpec,
    paths: {
      "/api/v1/posts": {
        get: {
          summary: "Get published posts",
          description: "Returns a list of published posts with pagination",
          parameters: [
            {
              name: "page",
              in: "query",
              description: "Page number",
              required: false,
              schema: { type: "integer", default: 1 }
            },
            {
              name: "limit",
              in: "query",
              description: "Number of items per page",
              required: false,
              schema: { type: "integer", default: 10 }
            }
          ],
          responses: {
            "200": {
              description: "List of published posts",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      data: {
                        type: "array",
                        items: { $ref: "#/components/schemas/Post" }
                      },
                      meta: { $ref: "#/components/schemas/PaginationMeta" }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/api/v1/posts/{slug}": {
        get: {
          summary: "Get post by slug",
          parameters: [
            {
              name: "slug",
              in: "path",
              required: true,
              schema: { type: "string" }
            }
          ],
          responses: {
            "200": { description: "Post details" },
            "404": { description: "Post not found" }
          }
        }
      },
      "/api/v1/subscriptions": {
        post: {
          summary: "Create a new subscription",
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    email: { type: "string", format: "email" }
                  },
                  required: ["email"]
                }
              }
            }
          },
          responses: {
            "201": { description: "Subscription created" },
            "400": { description: "Invalid input" }
          }
        }
      },
      "/api/v1/jobs/publications": {
        post: {
          summary: "Trigger post publication job",
          security: [{ CronToken: [] }],
          responses: {
            "200": { description: "Job triggered successfully" },
            "401": { description: "Unauthorized" }
          }
        }
      },
      "/api/v1/jobs/notifications": {
        post: {
          summary: "Trigger notification job",
          security: [{ CronToken: [] }],
          responses: {
            "200": { description: "Job triggered successfully" },
            "401": { description: "Unauthorized" }
          }
        }
      }
    },
    components: {
      ...baseSpec.components,
      schemas: {
        Post: {
          type: "object",
          properties: {
            id: { type: "string" },
            title: { type: "string" },
            slug: { type: "string" },
            content: { type: "string" },
            status: { type: "string", enum: ["DRAFT", "PUBLISHED", "SCHEDULED"] },
            publishedAt: { type: "string", format: "date-time" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" }
          }
        },
        PaginationMeta: {
          type: "object",
          properties: {
            currentPage: { type: "integer" },
            itemsPerPage: { type: "integer" },
            totalItems: { type: "integer" },
            totalPages: { type: "integer" }
          }
        }
      }
    }
  };

  return Response.json(enhancedSpec, {
    headers: {
      "cache-control": "public, max-age=60",
    },
  });
}
