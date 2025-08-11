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
        },
        post: {
          summary: "Create a new post",
          description: "Creates a new post with the provided data",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    content: { type: "string" },
                    status: { type: "string", enum: ["DRAFT", "PUBLISHED", "SCHEDULED"] },
                    publishedAt: { type: "string", format: "date-time" }
                  },
                  required: ["title", "content", "status"]
                }
              }
            }
          },
          responses: {
            "201": {
              description: "Post created successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      data: { $ref: "#/components/schemas/Post" }
                    }
                  }
                }
              }
            },
            "400": { description: "Invalid input" },
            "401": { description: "Unauthorized" }
          }
        }
      },
      "/api/v1/posts/{slug}": {
        get: {
          summary: "Get post by slug",
          description: "Returns a single post by its slug identifier",
          parameters: [
            {
              name: "slug",
              in: "path",
              required: true,
              schema: { type: "string" },
              description: "Unique slug identifier of the post"
            }
          ],
          responses: {
            "200": { 
              description: "Post details",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      data: { $ref: "#/components/schemas/PostDetail" }
                    }
                  }
                }
              }
            },
            "404": { 
              description: "Post not found",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      error: { type: "string" },
                      code: { type: "string" }
                    },
                    example: {
                      error: "Post not found",
                      code: "NOT_FOUND"
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/api/v1/subscriptions": {
        post: {
          summary: "Create a new subscription",
          description: "Subscribe an email address to the newsletter",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    email: { type: "string", format: "email", description: "Email address to subscribe" }
                  },
                  required: ["email"]
                }
              }
            }
          },
          responses: {
            "201": { 
              description: "Subscription created successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      data: { 
                        type: "object",
                        properties: {
                          id: { type: "string" },
                          email: { type: "string", format: "email" },
                          active: { type: "boolean" }
                        }
                      }
                    }
                  }
                }
              }
            },
            "400": { 
              description: "Invalid input",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      error: { type: "string" },
                      details: { type: "object" }
                    },
                    example: {
                      error: "Invalid email format",
                      details: { email: ["Invalid email format"] }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/api/v1/jobs": {
        post: {
          summary: "Process due jobs",
          description: "Processes all jobs that are due at the current time",
          security: [{ CronToken: [] }],
          responses: {
            "200": { 
              description: "Jobs processed successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean" },
                      result: { $ref: "#/components/schemas/ProcessResult" }
                    }
                  },
                  example: {
                    success: true,
                    result: {
                      publishedCount: 2,
                      emailedCount: 5
                    }
                  }
                }
              }
            },
            "401": { 
              description: "Unauthorized",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                  example: {
                    error: "Unauthorized",
                    code: "UNAUTHORIZED"
                  }
                }
              }
            },
            "500": { 
              description: "Server error",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                  example: {
                    error: "Internal server error",
                    code: "SERVER_ERROR"
                  }
                }
              }
            }
          }
        }
      },
      "/api/v1/jobs/publications": {
        post: {
          summary: "Create publication job",
          description: "Schedules a job to publish a post at the specified time",
          security: [{ CronToken: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    postId: { type: "string", description: "ID of the post to publish" },
                    when: { 
                      type: "string", 
                      format: "date-time", 
                      description: "When to publish the post (ISO date string or Date object)",
                      default: "current timestamp" 
                    }
                  },
                  required: ["postId"]
                },
                example: {
                  postId: "clq1234abcdef",
                  when: "2025-08-15T10:00:00Z"
                }
              }
            }
          },
          responses: {
            "200": { 
              description: "Job triggered successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean" },
                      job: { $ref: "#/components/schemas/Job" }
                    }
                  },
                  example: {
                    success: true,
                    job: {
                      id: "clq5678ghijkl",
                      postId: "clq1234abcdef",
                      jobType: "PUBLICATION",
                      scheduledAt: "2025-08-15T10:00:00Z",
                      status: "PENDING",
                      createdAt: "2025-08-11T00:33:57Z",
                      updatedAt: "2025-08-11T00:33:57Z"
                    }
                  }
                }
              }
            },
            "400": { 
              description: "Invalid input",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                  example: {
                    error: "Invalid request",
                    code: "VALIDATION_ERROR",
                    details: { postId: ["Required"] }
                  }
                }
              }
            },
            "401": { 
              description: "Unauthorized",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                  example: {
                    error: "Unauthorized",
                    code: "UNAUTHORIZED"
                  }
                }
              }
            },
            "500": { 
              description: "Server error",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                  example: {
                    error: "Internal server error",
                    code: "SERVER_ERROR"
                  }
                }
              }
            }
          }
        }
      },
      "/api/v1/jobs/notifications": {
        post: {
          summary: "Create notification job",
          description: "Schedules a job to send email notifications about a post at the specified time",
          security: [{ CronToken: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    postId: { type: "string", description: "ID of the post to send notifications for" },
                    when: { 
                      type: "string", 
                      format: "date-time", 
                      description: "When to send the notifications (ISO date string or Date object)",
                      default: "current timestamp" 
                    }
                  },
                  required: ["postId"]
                },
                example: {
                  postId: "clq1234abcdef",
                  when: "2025-08-15T10:00:00Z"
                }
              }
            }
          },
          responses: {
            "200": { 
              description: "Job triggered successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean" },
                      job: { $ref: "#/components/schemas/Job" }
                    }
                  },
                  example: {
                    success: true,
                    job: {
                      id: "clq5678ghijkl",
                      postId: "clq1234abcdef",
                      jobType: "EMAIL_NOTIFICATION",
                      scheduledAt: "2025-08-15T10:00:00Z",
                      status: "PENDING",
                      createdAt: "2025-08-11T00:33:57Z",
                      updatedAt: "2025-08-11T00:33:57Z"
                    }
                  }
                }
              }
            },
            "401": { 
              description: "Unauthorized",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                  example: {
                    error: "Unauthorized",
                    code: "UNAUTHORIZED"
                  }
                }
              }
            },
            "500": { 
              description: "Server error",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                  example: {
                    error: "Internal server error",
                    code: "SERVER_ERROR"
                  }
                }
              }
            }
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
            id: { type: "string", description: "Unique identifier for the post" },
            title: { type: "string", description: "Post title" },
            slug: { type: "string", description: "URL-friendly identifier" },
            content: { type: "string", description: "Post content" },
            status: { 
              type: "string", 
              enum: ["DRAFT", "PUBLISHED", "SCHEDULED"],
              description: "Current status of the post" 
            },
            publishedAt: { 
              type: "string", 
              format: "date-time", 
              description: "When the post was or will be published",
              nullable: true 
            },
            author: { type: "string", description: "Author of the post" },
            createdAt: { type: "string", format: "date-time", description: "Creation timestamp" },
            updatedAt: { type: "string", format: "date-time", description: "Last update timestamp" }
          },
          required: ["id", "title", "slug", "status"]
        },
        PostDetail: {
          type: "object",
          properties: {
            id: { type: "string", description: "Unique identifier for the post" },
            title: { type: "string", description: "Post title" },
            slug: { type: "string", description: "URL-friendly identifier" },
            content: { type: "string", description: "Full post content" },
            status: { 
              type: "string", 
              enum: ["DRAFT", "PUBLISHED", "SCHEDULED"],
              description: "Current status of the post" 
            },
            publishedAt: { 
              type: "string", 
              format: "date-time", 
              description: "When the post was or will be published",
              nullable: true 
            },
            author: { type: "string", description: "Author of the post" },
            createdAt: { type: "string", format: "date-time", description: "Creation timestamp" },
            updatedAt: { type: "string", format: "date-time", description: "Last update timestamp" }
          },
          required: ["id", "title", "slug", "content", "status"]
        },
        PaginationMeta: {
          type: "object",
          properties: {
            page: { type: "integer", description: "Current page number" },
            limit: { type: "integer", description: "Number of items per page" },
            total: { type: "integer", description: "Total number of items" }
          },
          required: ["page", "limit", "total"]
        },
        Subscriber: {
          type: "object",
          properties: {
            id: { type: "string", description: "Unique identifier for the subscriber" },
            email: { type: "string", format: "email", description: "Subscriber's email address" },
            active: { type: "boolean", description: "Whether the subscription is active" },
            createdAt: { type: "string", format: "date-time", description: "When the subscription was created" },
            updatedAt: { type: "string", format: "date-time", description: "When the subscription was last updated" }
          },
          required: ["id", "email", "active"]
        },
        Job: {
          type: "object",
          properties: {
            id: { type: "string", description: "Unique identifier for the job" },
            postId: { type: "string", description: "ID of the associated post" },
            jobType: { 
              type: "string", 
              enum: ["PUBLICATION", "EMAIL_NOTIFICATION"],
              description: "Type of job to execute" 
            },
            scheduledAt: { type: "string", format: "date-time", description: "When the job is scheduled to run" },
            status: { 
              type: "string", 
              enum: ["PENDING", "PROCESSING", "COMPLETED", "FAILED"],
              description: "Current status of the job" 
            },
            createdAt: { type: "string", format: "date-time", description: "Creation timestamp" },
            updatedAt: { type: "string", format: "date-time", description: "Last update timestamp" }
          },
          required: ["id", "postId", "jobType", "scheduledAt", "status"]
        },
        ProcessResult: {
          type: "object",
          properties: {
            publishedCount: { type: "integer", description: "Number of posts published" },
            emailedCount: { type: "integer", description: "Number of notification emails sent" }
          },
          required: ["publishedCount", "emailedCount"]
        },
        Error: {
          type: "object",
          properties: {
            error: { type: "string", description: "Error message" },
            code: { type: "string", description: "Error code" },
            details: { type: "object", description: "Additional error details" }
          },
          required: ["error"]
        }
      },
      securitySchemes: {
        CronToken: {
          type: "apiKey",
          in: "header",
          name: "x-cron-token",
          description: "API key for scheduled job endpoints"
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
