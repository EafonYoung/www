import { prisma } from "@/lib/db";

const DEFAULTS: Record<string, string> = {
  "hero.title": "Eafon",
  "hero.subtitle": "技术笔记与开发实践",
};

export async function getSiteConfig(key: string): Promise<string> {
  try {
    const row = await prisma.siteConfig.findUnique({ where: { key } });
    return row?.value ?? DEFAULTS[key] ?? "";
  } catch {
    return DEFAULTS[key] ?? "";
  }
}

export async function getSiteConfigs(keys: string[]): Promise<Record<string, string>> {
  const result: Record<string, string> = {};

  for (const key of keys) {
    result[key] = await getSiteConfig(key);
  }

  return result;
}
