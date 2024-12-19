import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ status: "All systems normal" }, { status: 200 });
}
