process.env.NODE_ENV = "production";

import { spawn } from "node:child_process";
import { cpus } from "node:os";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { blue, green } from "kolorist";

import { buildApi } from "./build.api";
import { buildIconSets } from "./build.icon-sets";
import { buildLang } from "./build.lang";
import { createFolder } from "./build.utils";
import { cleanDist } from "./script.clean";
import { generateVersionFile } from "./script.version";
import { syncAppExt } from "./script.app-ext";

const nodeRequire = createRequire(import.meta.url);
const { version } = nodeRequire("../package.json") as { version: string };
const buildDir = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(buildDir, "..");
const parallel = cpus().length > 1;

function runScript(script: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn("pnpm", ["exec", "tsx", script], {
      cwd: rootDir,
      shell: process.platform === "win32",
      stdio: "inherit",
    });

    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`${script} failed with exit code ${code}`));
    });
  });
}

async function main(): Promise<void> {
  console.log();

  syncAppExt();
  cleanDist();

  console.log(
    ` 📦 Building ${green("v" + version)}...${parallel ? blue(" [multi-threaded]") : ""}\n`,
  );

  createFolder("dist");
  generateVersionFile();
  await buildLang();
  await buildIconSets();
  await buildApi();

  const jobs = ["build/script.javascript.ts", "build/script.css.ts"];

  if (parallel) {
    await Promise.all(jobs.map(runScript));
    return;
  }

  for (const job of jobs) {
    await runScript(job);
  }
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
