import { NextResponse } from "next/server";
import { ZodError } from "zod";

export type ApiEnvelope<T> = { data: T; error: null } | { data: null; error: { message: string; code?: string } };

export type PaginationMeta = { page: number; limit: number; total: number };

export function successResponse<T>(data: T, meta?: Record<string, unknown>) {
  const body: any = { data, error: null };
  if (meta) body.meta = meta;
  return NextResponse.json(body satisfies ApiEnvelope<T>);
}

export function createdResponse<T>(data: T) {
  return NextResponse.json({ data, error: null } as ApiEnvelope<T>, { status: 201 });
}

export function noContentResponse() {
  return new NextResponse(null, { status: 204 });
}

export class ApiError extends Error {
  code?: string;
  status: number;
  constructor(message: string, status = 400, code?: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export function errorResponse(message: string, status = 400, code = "BAD_REQUEST") {
  return NextResponse.json({ data: null, error: { message, code } } as ApiEnvelope<null>, { status });
}

export function handle<T>(fn: (req: Request) => Promise<T>) {
  return async (req: Request) => {
    try {
      const result = await fn(req);
      if (result instanceof NextResponse) return result;
      return successResponse(result as T);
    } catch (err: unknown) {
      if (err instanceof ZodError) {
        return NextResponse.json(
          { data: null, error: { message: "Validation error", code: "VALIDATION_ERROR", issues: err.issues } },
          { status: 400 }
        );
      }
      if (err instanceof ApiError) {
        return errorResponse(err.message, err.status, err.code ?? "API_ERROR");
      }
      console.error(err);
      return errorResponse("Unexpected error", 500, "SERVER_ERROR");
    }
  };
}
