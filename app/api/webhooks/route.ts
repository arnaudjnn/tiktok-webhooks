import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { headers as getHeaders } from "next/headers";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  const headers = await getHeaders();
  const apiKey = headers.get("X-RapidAPI-Proxy-Secret");

  if (apiKey !== process.env.RAPIDAPI_PROXY_SECRET) {
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
