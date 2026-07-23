"use client";

import { useState, useEffect } from "react";
import { CheckIcon, CopyIcon, ClockIcon, CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/** 可复制的结果行 */
function ResultRow({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      disabled={!value}
      className="flex w-full items-center justify-between gap-3 rounded-lg border border-hairline bg-canvas px-4 py-3 text-left transition-colors hover:border-primary/30 disabled:pointer-events-none disabled:opacity-50"
    >
      <div className="min-w-0">
        <div className="text-[12px] text-ink-muted-48">{label}</div>
        <div className="mt-0.5 truncate font-mono text-[14px]">{value || "—"}</div>
      </div>
      {copied ? (
        <CheckIcon className="h-4 w-4 shrink-0 text-green-600" />
      ) : (
        <CopyIcon className="h-4 w-4 shrink-0 text-ink-muted-48" />
      )}
    </button>
  );
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

/** 格式化为本地时间 YYYY-MM-DD HH:mm:ss */
function formatLocal(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

/** 计算相对时间描述 */
function relativeTime(date: Date) {
  const now = Date.now();
  const diff = date.getTime() - now;
  const absDiff = Math.abs(diff);
  const minute = 60_000;
  const hour = 3_600_000;
  const day = 86_400_000;

  if (absDiff < minute) return `${Math.round(diff / 1000)} 秒${diff >= 0 ? "后" : "前"}`;
  if (absDiff < hour) return `${Math.round(diff / minute)} 分钟${diff >= 0 ? "后" : "前"}`;
  if (absDiff < day) return `${Math.round(diff / hour)} 小时${diff >= 0 ? "后" : "前"}`;
  return `${Math.round(diff / day)} 天${diff >= 0 ? "后" : "前"}`;
}

export function TimeConverterTool() {
  /* ---------- 时间戳 → 时间 ---------- */
  const [tsInput, setTsInput] = useState("");
  const [unit, setUnit] = useState<"s" | "ms">("s");

  const trimmedTs = tsInput.trim();
  let tsError: string | null = null;
  let tsResults = { local: "", utc: "", iso: "", relative: "" };

  if (trimmedTs) {
    const num = Number(trimmedTs);
    if (!Number.isFinite(num)) {
      tsError = "请输入有效数字";
    } else {
      const ms = unit === "s" ? num * 1000 : num;
      const date = new Date(ms);
      if (Number.isNaN(date.getTime())) {
        tsError = "无效的时间戳";
      } else {
        tsResults = {
          local: formatLocal(date),
          utc: date.toUTCString(),
          iso: date.toISOString(),
          relative: relativeTime(date),
        };
      }
    }
  }

  /* ---------- 时间 → 时间戳 ---------- */
  const [dtInput, setDtInput] = useState("");
  const [liveMode, setLiveMode] = useState(false);

  useEffect(() => {
    if (!liveMode) return;
    const timer = setInterval(() => {
      const now = new Date();
      setDtInput(
        `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`,
      );
    }, 1000);
    return () => clearInterval(timer);
  }, [liveMode]);

  let dtResults = { seconds: "", millis: "", iso: "" };
  if (dtInput) {
    const date = new Date(dtInput);
    if (!Number.isNaN(date.getTime())) {
      dtResults = {
        seconds: String(Math.floor(date.getTime() / 1000)),
        millis: String(date.getTime()),
        iso: date.toISOString(),
      };
    }
  }

  function toggleLive() {
    if (liveMode) {
      setLiveMode(false);
    } else {
      setLiveMode(true);
      const now = new Date();
      setDtInput(
        `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`,
      );
    }
  }

  return (
    <div className="space-y-4">
      {/* 输入 / 输出 左右分栏 */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* 左侧：时间戳 → 时间 */}
        <div>
          <div className="mb-2 flex items-center gap-2">
            <ClockIcon className="h-4 w-4 text-ink-muted-48" />
            <span className="text-[14px] font-medium text-ink-muted-80">
              时间戳 → 时间
            </span>
          </div>
          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                inputMode="numeric"
                value={tsInput}
                onChange={(e) => setTsInput(e.target.value)}
                placeholder="输入时间戳，如 1700000000"
                className="h-[44px] flex-1 rounded-lg border border-hairline bg-canvas px-4 font-mono text-[14px] outline-none focus:border-primary/50"
              />
              <div className="flex overflow-hidden rounded-lg border border-hairline">
                {(["s", "ms"] as const).map((u) => (
                  <button
                    key={u}
                    type="button"
                    onClick={() => setUnit(u)}
                    className={cn(
                      "px-3 text-[13px] transition-colors",
                      unit === u
                        ? "bg-primary text-white"
                        : "bg-canvas text-ink-muted-80 hover:bg-hairline",
                    )}
                  >
                    {u === "s" ? "秒" : "毫秒"}
                  </button>
                ))}
              </div>
            </div>

            {tsError && (
              <div className="rounded-lg bg-red-50 px-4 py-2 text-[13px] text-red-700">
                {tsError}
              </div>
            )}

            <div className="space-y-2">
              <ResultRow label="本地时间" value={tsResults.local} />
              <ResultRow label="UTC 时间" value={tsResults.utc} />
              <ResultRow label="ISO 8601" value={tsResults.iso} />
              <ResultRow label="相对时间" value={tsResults.relative} />
            </div>
          </div>
        </div>

        {/* 右侧：时间 → 时间戳 */}
        <div>
          <div className="mb-2 flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-ink-muted-48" />
            <span className="text-[14px] font-medium text-ink-muted-80">
              时间 → 时间戳
            </span>
          </div>
          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                type="datetime-local"
                step="1"
                value={dtInput}
                onChange={(e) => {
                  setDtInput(e.target.value);
                  setLiveMode(false);
                }}
                className="h-[44px] flex-1 rounded-lg border border-hairline bg-canvas px-4 text-[14px] outline-none focus:border-primary/50"
              />
              <button
                type="button"
                onClick={toggleLive}
                className={cn(
                  "inline-flex shrink-0 items-center gap-1.5 rounded-lg border px-4 text-[13px] transition-colors",
                  liveMode
                    ? "border-primary/30 bg-primary/10 text-primary"
                    : "border-hairline bg-canvas text-ink-muted-80 hover:border-primary/30",
                )}
              >
                {liveMode ? "暂停" : "现在"}
              </button>
            </div>

            <div className="space-y-2">
              <ResultRow label="Unix 秒" value={dtResults.seconds} />
              <ResultRow label="Unix 毫秒" value={dtResults.millis} />
              <ResultRow label="ISO 8601" value={dtResults.iso} />
            </div>
          </div>
        </div>
      </div>

      <p className="text-[12px] text-ink-muted-48">
        点击任意结果行可复制内容
      </p>
    </div>
  );
}
