"use client";

import { useState } from "react";
import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";

type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

function getType(value: JsonValue): string {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  return typeof value;
}

/** 叶子节点 */
function LeafNode({ name, value }: { name?: string; value: JsonValue }) {
  const type = getType(value);
  return (
    <div className="flex items-baseline gap-1 py-0.5 pl-1">
      {name !== undefined && (
        <>
          <span className="text-ink-muted-80">&quot;{name}&quot;</span>
          <span className="text-ink-muted-48">:</span>
        </>
      )}
      {type === "null" && <span className="text-ink-muted-48">null</span>}
      {type === "string" && (
        <span className="text-green-600">&quot;{value as string}&quot;</span>
      )}
      {type === "number" && (
        <span className="text-blue-600">{String(value)}</span>
      )}
      {type === "boolean" && (
        <span className="text-purple-600">{String(value)}</span>
      )}
    </div>
  );
}

/** 对象 / 数组节点（可展开收缩） */
function BranchNode({
  name,
  value,
}: {
  name?: string;
  value: JsonValue[] | { [key: string]: JsonValue };
}) {
  const [expanded, setExpanded] = useState(true);
  const isArray = Array.isArray(value);
  const entries = isArray
    ? (value as JsonValue[]).map(
        (v, i) => [String(i), v] as [string, JsonValue],
      )
    : Object.entries(value);
  const count = entries.length;
  const openBracket = isArray ? "[" : "{";
  const closeBracket = isArray ? "]" : "}";

  // 空对象 / 空数组
  if (count === 0) {
    return (
      <div className="flex items-baseline gap-1 py-0.5 pl-1">
        {name !== undefined && (
          <>
            <span className="text-ink-muted-80">&quot;{name}&quot;</span>
            <span className="text-ink-muted-48">:</span>
          </>
        )}
        <span className="text-ink-muted-48">
          {openBracket}
          {closeBracket}
        </span>
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center gap-1 py-0.5 pl-1 text-left hover:bg-hairline/40"
      >
        {expanded ? (
          <ChevronDownIcon className="h-3.5 w-3.5 shrink-0 text-ink-muted-48" />
        ) : (
          <ChevronRightIcon className="h-3.5 w-3.5 shrink-0 text-ink-muted-48" />
        )}
        {name !== undefined && (
          <>
            <span className="text-ink-muted-80">&quot;{name}&quot;</span>
            <span className="text-ink-muted-48">:</span>
          </>
        )}
        <span className="text-ink-muted-48">
          {openBracket}
          {!expanded && ` ${count} ${count === 1 ? "item" : "items"} `}
          {!expanded && closeBracket}
        </span>
      </button>
      {expanded && (
        <div className="ml-[7px] border-l border-hairline pl-3">
          {entries.map(([key, val], index) => (
            <JsonNode
              key={key || index}
              name={isArray ? undefined : key}
              value={val}
            />
          ))}
          <div className="py-0.5 pl-1 text-ink-muted-48">{closeBracket}</div>
        </div>
      )}
    </div>
  );
}

function JsonNode({
  name,
  value,
}: {
  name?: string;
  value: JsonValue;
}) {
  const type = getType(value);

  if (type === "array" || type === "object") {
    return (
      <BranchNode
        name={name}
        value={value as JsonValue[] | { [key: string]: JsonValue }}
      />
    );
  }

  return <LeafNode name={name} value={value} />;
}

export function JsonTreeView({ data }: { data: unknown }) {
  return (
    <div className="font-mono text-[14px] leading-relaxed">
      <JsonNode value={data as JsonValue} />
    </div>
  );
}
