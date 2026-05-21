process.env.BABEL_ENV = "production";

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  rolldown,
  type InputOptions,
  type OutputChunk,
  type OutputOptions,
  type Plugin,
} from "rolldown";
import * as ts from "typescript";
import uglify from "uglify-js";

import buildConf from "./config";
import * as buildUtils from "./build.utils";

const buildDir = path.dirname(fileURLToPath(import.meta.url));
const rolldownPlugins: Plugin[] = [resolveTypeScriptSources(), transpileTypeScript()];

const uglifyJsOptions = {
  compress: {
    // Turn off flags with small gains to speed up minification.
    arrows: false,
    collapse_vars: false,
    comparisons: false,
    hoist_funs: false,
    hoist_props: false,
    hoist_vars: false,
    inline: false,
    loops: false,
    negate_iife: false,
    properties: false,
    reduce_funcs: false,
    reduce_vars: false,
    switches: false,
    toplevel: false,
    typeofs: false,

    // A few flags with a noticeable gains/speed ratio.
    booleans: true,
    if_return: true,
    sequences: true,
    unused: true,

    // Required features to drop conditional branches.
    conditionals: true,
    dead_code: true,
    evaluate: true,
  },
};

interface RolldownConfig {
  input: InputOptions;
  output: OutputOptions;
}

interface BuildConfig {
  rolldown: RolldownConfig;
  build: {
    unminified?: boolean;
    minified?: boolean;
    minExt?: boolean;
    minOutput?: OutputOptions;
  };
}

const builds: BuildConfig[] = [
  {
    rolldown: {
      input: {
        input: pathResolve("../src/index.esm.ts"),
      },
      output: {
        dir: pathResolve("../dist"),
        entryFileNames: "index.esm.js",
        chunkFileNames: "chunks/[name]-[hash].js",
        format: "esm",
      },
    },
    build: {
      unminified: true,
      minified: true,
      minOutput: {
        entryFileNames: "index.esm.min.js",
        chunkFileNames: "chunks/[name]-[hash].min.js",
      },
    },
  },
  {
    rolldown: {
      input: {
        input: pathResolve("../src/index.cjs.ts"),
      },
      output: {
        dir: pathResolve("../dist"),
        entryFileNames: "index.cjs.js",
        chunkFileNames: "chunks/[name]-[hash].js",
        format: "cjs",
        exports: "auto",
      },
    },
    build: {
      unminified: true,
      minified: true,
      minOutput: {
        entryFileNames: "index.cjs.min.js",
        chunkFileNames: "chunks/[name]-[hash].min.js",
      },
    },
  },
  {
    rolldown: {
      input: {
        input: pathResolve("../src/index.umd.ts"),
      },
      output: {
        name: "QMediaPlayer",
        file: pathResolve("../dist/index.umd.js"),
        format: "umd",
        codeSplitting: false,
      },
    },
    build: {
      unminified: true,
      minified: true,
      minExt: true,
    },
  },
];

addUmdAssets(builds, "icon-set", "iconSet");
addUmdAssets(builds, "lang", "lang");
build(builds);

function pathResolve(relativePath: string): string {
  return path.resolve(buildDir, relativePath);
}

function resolveTypeScriptSources(): Plugin {
  return {
    name: "resolve-typescript-sources",
    resolveId(source, importer) {
      if (importer === undefined || source.startsWith(".") === false) {
        return null;
      }

      const sourcePath = path.resolve(path.dirname(importer), source);
      const candidates = source.endsWith(".js")
        ? [sourcePath.replace(/\.js$/, ".ts")]
        : [sourcePath, `${sourcePath}.ts`, `${sourcePath}.js`];

      return candidates.find((candidate) => buildUtils.fileExists(candidate)) ?? null;
    },
  };
}

function transpileTypeScript(): Plugin {
  return {
    name: "transpile-typescript",
    transform(code, id) {
      if (id.endsWith(".ts") === false) {
        return null;
      }

      const result = ts.transpileModule(code, {
        fileName: id,
        compilerOptions: {
          esModuleInterop: true,
          module: ts.ModuleKind.ESNext,
          moduleResolution: ts.ModuleResolutionKind.Bundler,
          target: ts.ScriptTarget.ES2020,
        },
      });

      return {
        code: result.outputText,
        map: null,
      };
    },
  };
}

async function build(builds: BuildConfig[]): Promise<void> {
  try {
    for (const config of builds.map(genConfig)) {
      await buildEntry(config);
    }
  } catch (err: unknown) {
    buildUtils.logError(err);
    process.exit(1);
  }
}

function genConfig(opts: BuildConfig): BuildConfig {
  Object.assign(opts.rolldown.input, {
    external: (id: string) => id === "vue" || id === "quasar",
    plugins: rolldownPlugins,
  });

  Object.assign(opts.rolldown.output, {
    banner: buildConf.banner,
    globals: { vue: "Vue", quasar: "Quasar" },
    exports: "auto",
  });

  return opts;
}

function addExtension(filename: string, ext = "min"): string {
  const insertionPoint = filename.lastIndexOf(".");
  return `${filename.slice(0, insertionPoint)}.${ext}${filename.slice(insertionPoint)}`;
}

function addUmdAssets(builds: BuildConfig[], type: "icon-set" | "lang", injectName: string): void {
  const inputDir = pathResolve(`../${type}`);
  const outputDir = pathResolve(`../dist/${type}`);

  if (fs.existsSync(inputDir) === false) {
    return;
  }

  fs.mkdirSync(outputDir, { recursive: true });

  fs.readdirSync(inputDir)
    .filter((file) => file.endsWith(".mjs"))
    .forEach((file) => {
      const name = file
        .substring(0, file.length - 4)
        .replace(/-([a-zA-Z])/g, (_, letter: string) => letter.toUpperCase());

      builds.push({
        rolldown: {
          input: {
            input: pathResolve(`../${type}/${file}`),
          },
          output: {
            file: pathResolve(
              `../dist/${type}/${addExtension(file.replace(/\.mjs$/, ".js"), "umd")}`,
            ),
            format: "umd",
            name: `QMediaPlayer.${injectName}.${name}`,
            codeSplitting: false,
          },
        },
        build: {
          minified: true,
        },
      });
    });
}

async function buildEntry(config: BuildConfig): Promise<void> {
  const bundle = await rolldown(config.rolldown.input);

  if (config.build.unminified) {
    const { output } = await bundle.generate(config.rolldown.output);
    await writeOutputFiles(output, config.rolldown.output);
  }

  if (config.build.minified) {
    const minOutputOptions = getMinOutputOptions(config);
    const { output } = await bundle.generate(minOutputOptions);
    await writeOutputFiles(output, minOutputOptions, true);
  }

  await bundle.close();
}

async function writeOutputFiles(
  output: OutputChunk[],
  outputOptions: OutputOptions,
  minify = false,
): Promise<void> {
  await Promise.all(
    output.map((chunk) => {
      if (chunk.type !== "chunk") {
        return Promise.resolve();
      }

      let code = outputOptions.format === "umd" ? injectVueRequirement(chunk.code) : chunk.code;

      if (minify === true) {
        const minified = uglify.minify(code, uglifyJsOptions);

        if (minified.error) {
          throw minified.error;
        }

        code = buildConf.banner + minified.code;
      }

      const outputFile = getOutputFile(chunk, outputOptions);
      fs.mkdirSync(path.dirname(outputFile), { recursive: true });

      return buildUtils.writeFile(outputFile, code, minify);
    }),
  );
}

function getMinOutputOptions(config: BuildConfig): OutputOptions {
  const output = {
    ...config.rolldown.output,
  };

  if (config.build.minOutput) {
    Object.assign(output, config.build.minOutput);
  }

  if (output.file) {
    output.file =
      config.build.minExt === true
        ? addExtension(config.rolldown.output.file as string)
        : output.file;
  }

  return output;
}

function getOutputFile(chunk: OutputChunk, outputOptions: OutputOptions): string {
  if (outputOptions.file) {
    return outputOptions.file;
  }

  return path.join(outputOptions.dir as string, chunk.fileName);
}

function injectVueRequirement(code: string): string {
  const index = code.indexOf(`Vue = Vue && Vue.hasOwnProperty('default') ? Vue['default'] : Vue`);

  if (index === -1) {
    return code;
  }

  const checkMe = ` if (Vue === void 0) {
    console.error('[ QMediaPlayer ] Vue is required to run. Please add a script tag for it before loading QMediaPlayer.')
    return
  }
  `;

  return code.substring(0, index - 1) + checkMe + code.substring(index);
}
