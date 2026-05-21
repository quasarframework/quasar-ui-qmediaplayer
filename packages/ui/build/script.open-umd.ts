import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import open from "open";

const buildDir = dirname(fileURLToPath(import.meta.url));

open(resolve(buildDir, "../umd-test.html")).catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
