"use client";

import { useState } from "react";
import { CheckIcon, CopyIcon, Minimize2Icon, SparklesIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { JsonTreeView } from "@/components/tools/json-tree-view";

export function JsonFormatterTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [parsedData, setParsedData] = useState<unknown>(null);
  const [indent, setIndent] = useState(2);
  const [viewMode, setViewMode] = useState<"text" | "tree">("text");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function formatJson(beautify: boolean) {
    const trimmed = input.trim();
    if (!trimmed) {
      setError("请输入 JSON 文本");
      setOutput("");
      setParsedData(null);
      return;
    }

    try {
      const parsed = JSON.parse(trimmed);
      const result = beautify
        ? JSON.stringify(parsed, null, indent)
        : JSON.stringify(parsed);
      setOutput(result);
      setParsedData(parsed);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "JSON 解析失败");
      setOutput("");
      setParsedData(null);
    }
  }

  async function handleCopy() {
    if (!output) return;

    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore clipboard errors
    }
  }

  function handleClear() {
    setInput("");
    setOutput("");
    setParsedData(null);
    setError(null);
  }

  return (
    <div className="space-y-4">
      {/* 操作栏 */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-[14px] text-ink-muted-80">缩进</span>
          <div className="flex overflow-hidden rounded-pill border border-hairline">
            {[2, 4].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setIndent(n)}
                className={cn(
                  "px-3 py-1 text-[13px] transition-colors",
                  indent === n
                    ? "bg-primary text-white"
                    : "bg-canvas text-ink-muted-80 hover:bg-hairline",
                )}
              >
                {n} 空格
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => formatJson(true)}
          className="inline-flex items-center gap-2 rounded-pill bg-primary px-[22px] py-[11px] text-[15px] text-white transition active:scale-95"
        >
          <SparklesIcon className="h-4 w-4" />
          格式化
        </button>

        <button
          type="button"
          onClick={() => formatJson(false)}
          className="inline-flex items-center gap-2 rounded-pill border border-hairline bg-canvas px-[22px] py-[11px] text-[15px] text-ink-muted-80 transition active:scale-95 hover:border-primary/30"
        >
          <Minimize2Icon className="h-4 w-4" />
          压缩
        </button>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-[14px] text-red-700">
          {error}
        </div>
      )}

      {/* 输入 / 输出 左右分栏 */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* 输入区 */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[14px] font-medium text-ink-muted-80">
              输入
            </span>
            {input && (
              <button
                type="button"
                onClick={handleClear}
                className="text-[13px] text-ink-muted-48 hover:text-primary"
              >
                清空
              </button>
            )}
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='{"name":"Qoder","version":1}'
            className="h-[760px] w-full resize-none rounded-lg border border-hairline bg-canvas px-4 py-3 font-mono text-[14px] outline-none focus:border-primary/50"
          />
        </div>

        {/* 输出区 */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-[14px] font-medium text-ink-muted-80">
                输出
              </span>
              {output && (
                <div className="flex overflow-hidden rounded-pill border border-hairline">
                  {(["text", "tree"] as const).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setViewMode(mode)}
                      className={cn(
                        "px-3 py-0.5 text-[12px] transition-colors",
                        viewMode === mode
                          ? "bg-primary text-white"
                          : "bg-canvas text-ink-muted-80 hover:bg-hairline",
                      )}
                    >
                      {mode === "text" ? "文本" : "树形"}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {output && (
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1 text-[13px] text-ink-muted-48 hover:text-primary"
              >
                {copied ? (
                  <CheckIcon className="h-3.5 w-3.5" />
                ) : (
                  <CopyIcon className="h-3.5 w-3.5" />
                )}
                {copied ? "已复制" : "复制"}
              </button>
            )}
          </div>
          {output ? (
            viewMode === "text" ? (
              <pre className="h-[760px] overflow-auto rounded-lg border border-hairline bg-canvas px-4 py-3 font-mono text-[14px] leading-relaxed">
                <code>{output}</code>
              </pre>
            ) : (
              <div className="h-[760px] overflow-auto rounded-lg border border-hairline bg-canvas px-4 py-3">
                <JsonTreeView data={parsedData} />
              </div>
            )
          ) : (
            <div className="flex h-[760px] items-center justify-center rounded-lg border border-dashed border-hairline text-[14px] text-ink-muted-48">
              格式化后的结果将显示在这里
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
