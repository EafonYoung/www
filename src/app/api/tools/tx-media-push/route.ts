import { pushTxMedia } from "@/lib/tools/tx-media-push";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    id?: string;
    relatedPush?: boolean;
  };
  const id = body.id?.trim();
  const relatedPush = body.relatedPush !== false;

  if (!id) {
    return Response.json(
      { ok: false, message: "请输入媒资 ID" },
      { status: 400 }
    );
  }

  const result = await pushTxMedia(id, relatedPush);
  return Response.json(result, { status: result.ok ? 200 : 400 });
}
