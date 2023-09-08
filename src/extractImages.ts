import { Document, Element } from "deno_dom/deno-dom-wasm.ts";
import * as path from "path/mod.ts";

export async function extractImages(
  document: Document,
  hostname: string,
): Promise<URL[]> {
  const tmp = [];

  for (const node of document.querySelectorAll("img")) {
    const img = node as Element;

    const rawUrl = img.getAttribute("src");
    if (
      rawUrl == null || !URL.canParse(rawUrl, hostname)
    ) continue;

    const url = new URL(rawUrl, hostname);
    if (
      [".jpg", ".jpeg", ".png", ".webp", ".svg", ".bmp"]
        .every((x) => path.extname(url.href).toLowerCase() != x)
    ) continue;

    tmp.push(url);
  }

  return tmp;
}
