import { Command } from "command/mod.ts";
import { DOMParser } from "deno_dom/deno-dom-wasm.ts";
import { extractImages } from "./src/extractImages.ts";
import * as path from "path/mod.ts";

const app = new Command()
  .name("img-dl")
  .description("画像ダウンローダー");

app.arguments("<url>")
  .action(async (_, url) => {
    const html = await fetch(url).then((res) => res.text());

    const document = new DOMParser().parseFromString(html, "text/html");
    if (document == null) {
      return;
    }

    const buffers = (await extractImages(document, url + "/..")).map(
      (imgUrl) => {
        console.log("downloading...", imgUrl.href);
        return fetch(imgUrl).then(async (x) =>
          [imgUrl, await x.arrayBuffer()] as const
        );
      },
    );

    for await (const [imgUrl, buf] of buffers) {
      console.log("copying...", path.basename(imgUrl.href));
      await Deno.writeFile(path.basename(imgUrl.href), new Uint8Array(buf));
    }
  });

app.parse();
