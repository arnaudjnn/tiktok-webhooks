import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { headers as getHeaders } from "next/headers";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const headers = await getHeaders();
  const apiKey = headers.get("x-api-key");

  if (apiKey !== process.env.API_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { sessionId, endpoint } = await request.json();

  if (!sessionId || !endpoint) {
    return NextResponse.json(
      { error: "Missing required parameters" },
      { status: 400 }
    );
  }

  try {
    const webhook = await prisma.webhook.create({
      data: {
        sessionId,
        endpoint,
      },
    });

    return NextResponse.json(webhook);
  } catch (error) {
    console.error("Error creating webhook:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
