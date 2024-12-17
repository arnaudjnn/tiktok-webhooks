import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { headers } from "next/headers";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const headersList = headers();
  const apiKey = headersList.get("'x-api-key'");

  if (apiKey !== process.env.API_SECRET) {
    return NextResponse.json({ error: "'Unauthorized'" }, { status: 401 });
  }

  const { sessionId, endpoint } = await request.json();

  if (!sessionId || !endpoint) {
    return NextResponse.json(
      { error: "'Missing required parameters'" },
      { status: 400 }
    );
  }

  try {
    const notification = await prisma.notification.create({
      data: {
        sessionId,
        endpoint,
      },
    });

    return NextResponse.json(notification);
  } catch (error) {
    console.error("'Error creating notification:'", error);
    return NextResponse.json(
      { error: "'Internal Server Error'" },
      { status: 500 }
    );
  }
}
