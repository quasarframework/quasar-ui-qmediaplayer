import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { createFolder, writeFile } from "./build.utils";

interface ApiEntry {
  desc?: string;
  type?: string | string[];
  tsType?: string;
  values?: unknown[];
}

interface ComponentApi {
  type?: string;
  props?: Record<string, ApiEntry>;
  methods?: Record<string, ApiEntry>;
  [key: string]: unknown;
}

interface ComponentApiFile {
  name: string;
  api: ComponentApi;
}

const buildDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(buildDir, "..");
const srcDir = path.join(rootDir, "src/components");
const apiDir = path.join(rootDir, "dist/api");
const typesDir = path.join(rootDir, "dist/types");
const sourceTypesFile = path.join(rootDir, "types/types.d.ts");
const distTypesFile = path.join(typesDir, "types.d.ts");
const distIndexFile = path.join(typesDir, "index.d.ts");

function pascalCase(value: string): string {
  return value
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

function camelCase(value: string): string {
  const name = pascalCase(value);
  return name.charAt(0).toLowerCase() + name.slice(1);
}

function getDescription(entry: ApiEntry): string {
  return typeof entry.desc === "string" ? entry.desc.replace(/\*\//g, "* /") : "";
}

function getComment(entry: ApiEntry, indent = "    "): string {
  const desc = getDescription(entry);

  if (!desc) {
    return "";
  }

  return `${indent}/**\n${indent} * ${desc.replace(/\n/g, `\n${indent} * `)}\n${indent} */\n`;
}

function normalizeType(type: string | string[] | undefined): string | undefined {
  return Array.isArray(type) ? type[0] : type;
}

function getType(entry: ApiEntry): string {
  if (entry.tsType) {
    return entry.tsType;
  }

  if (Array.isArray(entry.values) && entry.values.length > 0) {
    return entry.values.map((value) => JSON.stringify(value)).join(" | ");
  }

  switch (normalizeType(entry.type)) {
    case "Array":
      return "unknown[]";
    case "Boolean":
      return "boolean";
    case "Function":
      return "(...args: unknown[]) => unknown";
    case "Number":
      return "number";
    case "Object":
      return "Record<string, unknown>";
    case "String":
      return "string";
    default:
      return "unknown";
  }
}

function getPropsTypes(api: ComponentApi): string {
  return Object.entries(api.props || {})
    .map(([name, entry]) => {
      const propName = camelCase(name);

      return `${getComment(entry)}    ${propName}?: ${getType(entry)}`;
    })
    .join("\n");
}

function getMethodsTypes(api: ComponentApi): string {
  return Object.entries(api.methods || {})
    .map(([name, entry]) => `${getComment(entry)}    ${name}(): void`)
    .join("\n");
}

function getComponentTypes(name: string, api: ComponentApi): string {
  const parts = [getPropsTypes(api), getMethodsTypes(api)].filter(Boolean);

  return `export interface ${name} extends ComponentPublicInstance {\n${parts.join("\n")}\n}\n`;
}

function normalizeApi(file: string): ComponentApiFile {
  const name = path.basename(file, ".json");
  const source = path.join(srcDir, file);
  const api = JSON.parse(fs.readFileSync(source, "utf-8")) as ComponentApi;

  return {
    name,
    api: {
      type: api.type || "component",
      ...api,
    },
  };
}

function writeApiFiles(components: ComponentApiFile[]): Promise<string[]> {
  createFolder("dist/api");

  return Promise.all(
    components.map(({ name, api }) =>
      writeFile(path.join(apiDir, `${name}.json`), JSON.stringify(api, null, 2) + "\n"),
    ),
  );
}

function getSourceTypeNames(): string {
  const content = fs.readFileSync(sourceTypesFile, "utf-8");
  const names: string[] = [];
  const exportRE = /^export\s+(?:type|interface)\s+([A-Za-z0-9_]+)/gm;
  let match: RegExpExecArray | null;

  while ((match = exportRE.exec(content)) !== null) {
    names.push(match[1]);
  }

  return names.join(", ");
}

function getTypesFile(components: ComponentApiFile[]): string {
  const typeImports = fs.existsSync(sourceTypesFile)
    ? `import { ${getSourceTypeNames()} } from './types'\n\n`
    : "";

  return `import type { ComponentPublicInstance, ComponentOptions } from 'vue'

${components.map(({ name, api }) => getComponentTypes(name, api)).join("\n")}
${typeImports}declare module 'vue' {
    interface ComponentCustomProperties {
    }
}
export * from './types'
export as namespace QMediaPlayer
${components.map(({ name }) => `export const ${name}: ComponentOptions`).join("\n")}

export const version: string

export interface QMediaPlayerPlugin {
    version: string
${components.map(({ name }) => `    ${name}: ComponentOptions`).join("\n")}
    install(app: import('vue').App): void
}

declare const plugin: QMediaPlayerPlugin
export default plugin
`;
}

export async function buildApi(): Promise<void> {
  const files = fs
    .readdirSync(srcDir)
    .filter((file) => file.endsWith(".json"))
    .sort((a, b) => a.localeCompare(b));

  const components = files.map(normalizeApi);

  createFolder("dist");
  createFolder("dist/types");

  if (fs.existsSync(sourceTypesFile)) {
    await writeFile(distTypesFile, fs.readFileSync(sourceTypesFile, "utf-8"));
  }

  await writeApiFiles(components);
  await writeFile(distIndexFile, getTypesFile(components));

  console.log(` 🧾 Generated ${components.length} API file${components.length === 1 ? "" : "s"}`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  buildApi().catch((err: unknown) => {
    console.error(err);
    process.exit(1);
  });
}
