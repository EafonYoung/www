const CHECK_API =
  "https://opentv.video.qq.com/i-tvbin/open/check_sync_data?id=%s&type=%s&PT=VST";
const PUSH_API =
  "http://admin.cibnvst.com:81/cibnvst-quartz/sync/syncqq?type=%s";

const TIMEOUT_MS = 10_000;

export const MediaType = {
  COLUMN: 2005,
  ALBUM: 2003,
  VIDEO: 2001,
} as const;

export function resolveMediaType(id: string): number | null {
  if (/^\d+$/.test(id)) return MediaType.COLUMN;
  if (id.length === 15) return MediaType.ALBUM;
  if (id.length === 11) return MediaType.VIDEO;
  return null;
}

function buildUrl(template: string, ...args: (string | number)[]): string {
  let i = 0;
  return template.replace(/%s/g, () => String(args[i++]));
}

type CheckFields = {
  title?: string;
  video_ids?: unknown[];
};

function parseCheckBody(body: string): { title: string; videoIds: string[] } {
  try {
    const data = JSON.parse(body) as {
      datas?: Array<{ fields?: CheckFields }>;
    };
    const fields = data.datas?.[0]?.fields;
    const videoIds = Array.isArray(fields?.video_ids)
      ? fields.video_ids.map(String)
      : [];
    return {
      title: fields?.title ?? "",
      videoIds,
    };
  } catch {
    return { title: "", videoIds: [] };
  }
}

function formatResult(id: string, title: string, ok: boolean): string {
  return `[${id}] [${title}]推送${ok ? "成功" : "失败"}`;
}

type PushOneResult = {
  ok: boolean;
  line: string;
  checkBody?: string;
};

async function pushOne(id: string): Promise<PushOneResult> {
  const type = resolveMediaType(id);
  if (type === null) {
    return { ok: false, line: formatResult(id, "", false) };
  }

  let checkResponse: Response;
  try {
    checkResponse = await fetch(buildUrl(CHECK_API, id, type), {
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch {
    return { ok: false, line: formatResult(id, "", false) };
  }

  if (!checkResponse.ok) {
    return { ok: false, line: formatResult(id, "", false) };
  }

  const body = await checkResponse.text();
  const { title } = parseCheckBody(body);

  let pushResponse: Response;
  try {
    pushResponse = await fetch(buildUrl(PUSH_API, type), {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch {
    return { ok: false, line: formatResult(id, title, false), checkBody: body };
  }

  if (!pushResponse.ok) {
    return { ok: false, line: formatResult(id, title, false), checkBody: body };
  }

  return { ok: true, line: formatResult(id, title, true), checkBody: body };
}

export type PushResult = {
  ok: boolean;
  message: string;
};

export async function pushTxMedia(
  id: string,
  relatedPush = true
): Promise<PushResult> {
  const mediaType = resolveMediaType(id);
  const lines: string[] = [];
  const outcomes: boolean[] = [];

  const main = await pushOne(id);
  lines.push(main.line);
  outcomes.push(main.ok);

  if (
    main.ok &&
    relatedPush &&
    mediaType === MediaType.ALBUM &&
    main.checkBody
  ) {
    const { videoIds } = parseCheckBody(main.checkBody);
    for (const videoId of videoIds) {
      const video = await pushOne(videoId);
      lines.push(video.line);
      outcomes.push(video.ok);
    }
  }

  return {
    ok: outcomes.every(Boolean),
    message: lines.join("\n"),
  };
}
