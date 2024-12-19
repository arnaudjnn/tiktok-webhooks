import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getNotifications } from "@/lib/tiktok";

const prisma = new PrismaClient();

export const maxDuration = 300;

export async function GET() {
  try {
    const webhooks = await prisma.webhook.findMany();

    await Promise.all(
      webhooks.map(async (webhook: any) => {
        const notifications = await getNotifications({
          sessionId: webhook.sessionId,
        });

        const lastEventIndex = notifications.findIndex((n) => {
          return n.event_id === webhook.lastEventId;
        });

        const nextNotifications = notifications.filter((_, index) => {
          return lastEventIndex === -1 ? false : index < lastEventIndex;
        });

        await Promise.all(
          nextNotifications.map(async (notification) => {
            await fetch(webhook.endpoint, {
              method: "POST",
              body: JSON.stringify(notification),
            });
          })
        );

        const lastEventId = nextNotifications[0]?.event_id;
        if (lastEventId) {
          await prisma.webhook.update({
            where: {
              id: webhook.id,
            },
            data: {
              lastEventId,
            },
          });
        }
      })
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in cron job:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
