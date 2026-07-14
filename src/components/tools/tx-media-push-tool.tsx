"use client";

import { useState } from "react";
import { CheckIcon, CopyIcon, Loader2Icon } from "lucide-react";
import { cn } from "@/lib/utils";

export function TxMediaPushTool() {
  const [id, setId] = useState("");
  const [relatedPush, setRelatedPush] = useState(true);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  async function handleCopy() {
    if (!message) return;

    try {
      await navigator.clipboard.writeText(message.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore clipboard errors
    }
  }

  async function handlePush() {
    const trimmedId = id.trim();
    if (!trimmedId) {
      setMessage({ type: "error", text: "请输入媒资 ID" });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/tools/tx-media-push", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id: trimmedId, relatedPush }),
      });

      const data = (await res.json()) as { ok: boolean; message?: string };

      setMessage({
        type: data.ok ? "success" : "error",
        text: data.message ?? `[${trimmedId}] []推送失败`,
      });
    } catch {
      setMessage({
        type: "error",
        text: `[${trimmedId}] []推送失败`,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <label className="block">
        <span className="mb-2 block text-[14px] font-medium text-ink-muted-80">
          媒资 ID
        </span>
        <input
          type="text"
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="输入栏目 / 专辑 / 视频 ID"
          className="w-full rounded-lg border border-hairline bg-canvas px-4 py-3 text-[15px] outline-none focus:border-primary/50"
        />
      </label>

      <label className="flex cursor-pointer items-center gap-3">
        <button
          type="button"
          role="switch"
          aria-checked={relatedPush}
          onClick={() => setRelatedPush(!relatedPush)}
          className={cn(
            "relative h-7 w-12 shrink-0 rounded-pill transition-colors",
            relatedPush ? "bg-primary" : "bg-ink-muted-48"
          )}
        >
          <span
            className={cn(
              "absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white transition-transform",
              relatedPush && "translate-x-5"
            )}
          />
        </button>
        <span className="text-[15px]">关联推送</span>
      </label>

      <button
        type="button"
        disabled={loading}
        onClick={handlePush}
        className={cn(
          "inline-flex items-center justify-center rounded-pill bg-primary px-[22px] py-[11px] text-[17px] text-white transition active:scale-95 disabled:pointer-events-none disabled:opacity-50"
        )}
      >
        {loading && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
        推送
      </button>

      {message && (
        <div
          className={cn(
            "relative rounded-lg px-4 py-3 pr-10 text-[14px]",
            message.type === "success"
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          )}
        >
          <button
            type="button"
            onClick={handleCopy}
            aria-label="复制推送结果"
            className="absolute top-2 right-2 rounded p-1 opacity-60 transition hover:opacity-100"
          >
            {copied ? (
              <CheckIcon className="h-4 w-4" />
            ) : (
              <CopyIcon className="h-4 w-4" />
            )}
          </button>
          <p className="whitespace-pre-line">{message.text}</p>
        </div>
      )}
    </div>
  );
}
