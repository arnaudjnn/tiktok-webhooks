const typeSlugs = {
  45: "mention",
  33: "follow",
  31: "comment",
  41: "like",
};

interface TiktokNotification {
  create_time: number;
  user_id: string;
  type: keyof typeof typeSlugs;
}

interface FormattedNotification extends TiktokNotification {
  event_id: string;
  type_slug: (typeof typeSlugs)[keyof typeof typeSlugs];
}

export async function getNotifications({
  sessionId,
}: {
  sessionId: string;
}): Promise<FormattedNotification[]> {
  const res = await fetch(
    `https://www.tiktok.com/api/notice/multi/?group_list=%5B%7B%22count%22%3A20%2C%22`,
    {
      method: "GET",
      headers: {
        Cookie: `sessionid=${sessionId}`,
      },
    }
  );
  const data = await res.json();
  return data.notice_lists[0].notice_list.map(
    (noticeList: TiktokNotification) => ({
      event_id: `${noticeList.create_time}:${noticeList.user_id}:${noticeList.type}`,
      ...noticeList,
      type: noticeList.type,
      type_slug: typeSlugs[noticeList.type],
    })
  );
}
