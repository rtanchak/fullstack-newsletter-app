import {service, schemas} from "@/modules/subscribers";
import { handle, successResponse, errorResponse } from "@/lib/api";

export const POST = handle(async (req: Request) => {
  try {
    const body = await req.json();
    const parsed = schemas.subscribeSchema.parse(body);
    const data = await service.subscribe(parsed);

    return successResponse(data);
  } catch (err: unknown) {
    // TODO: add better errors
    const message = "Validation or server error;";
    const status = (err as { name: string }).name === "ZodError" ? 400 : 500;

    return errorResponse(message, status);
  }
});
