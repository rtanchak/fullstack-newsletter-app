import { NextResponse } from "next/server";
import { getApiDocs } from "@/lib/utils/swagger";

export async function GET() {
  const spec = getApiDocs();
  return NextResponse.json(spec);
}
