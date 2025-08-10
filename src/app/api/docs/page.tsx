"use client";

import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

export default function ApiDocsPage() {
  if (process.env.NODE_ENV === "production") return null;
  return <SwaggerUI url="/api/docs/json" docExpansion="list" />;
}
