import { createSwaggerSpec } from "next-swagger-doc"

export const getApiDocs = () => {
  return createSwaggerSpec({
    apiFolder: "src/app/api",
    definition: {
      openapi: "3.0.3",
      info: {
        title: "Fullstack Newsletter API",
        version: "1.0.0",
        description: "API for posts, subscriptions and cron jobs",
      },
      components: {
        securitySchemes: {
          CronToken: {
            type: "apiKey",
            in: "header",
            name: "x-cron-token",
          },
        },
      },
    },
  })
}
