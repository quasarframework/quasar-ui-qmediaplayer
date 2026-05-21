// Configuration for your app
// https://v2.quasar.dev/quasar-cli-vite/quasar-config-file

import { defineConfig } from "@quasar/app-vite";
import { viteExamplesPlugin, viteManualChunks } from "@md-plugins/vite-examples-plugin";
import { viteMdPlugin, type MenuItem } from "@md-plugins/vite-md-plugin";

export default defineConfig(async (ctx) => {
  const siteConfig = await import("./src/siteConfig");
  const { sidebar } = siteConfig.default;

  return {
    boot: [],

    css: ["app.scss"],

    extras: ["fontawesome-v6", "roboto-font", "material-icons"],

    build: {
      target: {
        browser: ["es2022", "firefox115", "chrome115", "safari14"],
        node: "node20",
      },

      typescript: {
        strict: true,
        vueShim: true,
        extendTsConfig(tsConfig) {
          tsConfig.compilerOptions ??= {};
          tsConfig.compilerOptions.exactOptionalPropertyTypes = false;
          tsConfig.compilerOptions.paths ??= {};
          tsConfig.compilerOptions.paths["@quasar/quasar-ui-qmediaplayer"] = [
            "./../../ui/src/index.ts",
          ];
        },
      },

      vueRouterMode: "history",

      extendViteConf(viteConf, { isClient }) {
        const alias = viteConf.resolve?.alias;
        viteConf.resolve = viteConf.resolve || {};
        viteConf.resolve.alias = [
          ...(Array.isArray(alias)
            ? alias
            : Object.entries(alias ?? {}).map(([find, replacement]) => ({ find, replacement }))),
          // Consume workspace source in docs so examples track local UI edits.
          {
            find: /^@quasar\/quasar-ui-qmediaplayer$/,
            replacement: ctx.appPaths.appDir + "/../ui/src/index.ts",
          },
        ];

        if (ctx.prod && isClient) {
          viteConf.build = viteConf.build || {};
          viteConf.build.chunkSizeWarningLimit = 650;

          const buildOptions = viteConf.build as typeof viteConf.build & {
            rolldownOptions?: {
              output?: {
                codeSplitting?: {
                  groups?: Array<{
                    name: (moduleId: string) => string | null;
                  }>;
                };
              };
            };
          };

          buildOptions.rolldownOptions = buildOptions.rolldownOptions || {};
          buildOptions.rolldownOptions.output = buildOptions.rolldownOptions.output || {};
          buildOptions.rolldownOptions.output.codeSplitting = {
            groups: [
              {
                name: (moduleId: string) => viteManualChunks(moduleId) ?? null,
              },
            ],
          };
        }
      },

      viteVuePluginOptions: {
        include: [/\.(vue|md)$/],
        template: {
          compilerOptions: {
            isPreTag: (tag) => tag === "pre",
          },
        },
      },

      vitePlugins: [
        [
          viteMdPlugin,
          {
            path: ctx.appPaths.srcDir + "/markdown",
            menu: sidebar as MenuItem[],
            config: {
              headersPlugin: {
                shouldAllowExample: false,
              },
            },
          },
        ],
        [
          viteExamplesPlugin,
          {
            isProd: ctx.prod,
            path: ctx.appPaths.srcDir + "/examples",
          },
        ],
        [
          "vite-plugin-checker",
          {
            vueTsc: true,
          },
          { server: false },
        ],
      ],
    },

    devServer: {
      open: true,
      port: 8090,
    },

    framework: {
      config: {
        dark: "auto",
        loadingBar: {
          color: "red",
          position: "top",
        },
      },

      plugins: [
        "AppFullscreen",
        "Dark",
        "Dialog",
        "LoadingBar",
        "LocalStorage",
        "Meta",
        "Notify",
        "Platform",
        "Screen",
      ],
    },

    animations: [],
  };
});
