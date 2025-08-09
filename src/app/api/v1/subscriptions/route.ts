import {service, schemas} from "@/modules/subscribers";
import { handle, successResponse, errorResponse } from "@/lib/api";

export const POST = handle(async (req: Request) => {
  try {
    const body = await req.json();
    const parsed = schemas.subscribeSchema.parse(body);
    const data = await service.subscribe(parsed);

    return successResponse(data);
  } catch (err: any) {
    const message =
      err?.issues?.[0]?.message ??
      err?.message ??
      "Validation or server error;";
    const status = err?.name === "ZodError" ? 400 : 500;

    return errorResponse(message, status);
  }
});
