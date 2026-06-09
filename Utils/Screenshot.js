import path from "path";
import fs from "fs";

export default class Screenshot {
  static async capture(page, testTitle, passed) {
    const slug = testTitle.replace(/[^a-z0-9]/gi, "_");
    const label = passed ? "PASSED" : "FAILED";
    const dir = path.join(process.cwd(), "Screenshots");

    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    await page.screenshot({
      path: path.join(dir, `${slug}__${label}.png`),
      fullPage: true,
    });
  }
}
