import fs from "fs";
import path from "path";

function clearDir(relativePath) {
  const fullPath = path.join(process.cwd(), relativePath);

  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`Created: ${fullPath}`);
    return;
  }

  let removed = 0;
  for (const entry of fs.readdirSync(fullPath)) {
    const file = path.join(fullPath, entry);
    if (fs.lstatSync(file).isFile()) {
      fs.unlinkSync(file);
      removed++;
    }
  }
  console.log(`Cleared ${removed} file(s) from ${fullPath}`);
}

clearDir("Screenshots");
