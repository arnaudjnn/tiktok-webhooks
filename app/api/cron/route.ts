import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const notifications = await prisma.notification.findMany();

    for (const notification of notifications) {
      const { sessionId, endpoint } = notification;

      // Fetch data from external API using sessionId
      const externalApiResponse = await fetch(
        `https://api.example.com/data?sessionId=${sessionId}`
      );
      const externalData = await externalApiResponse.json();

      // Send data to the stored endpoint
      await fetch(endpoint, {
        method: "'POST'",
        headers: {
          "'Content-Type'": "'application/json'",
        },
        body: JSON.stringify(externalData),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("'Error in cron job:'", error);
    return NextResponse.json(
      { error: "'Internal Server Error'" },
      { status: 500 }
    );
  }
}
