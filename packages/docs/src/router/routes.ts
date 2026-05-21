import { slugify } from "@md-plugins/shared";
import examplesPageList from "src/examples/listing";
import mdPageList from "src/markdown/listing";

function getMarkdownPath(key: string): string {
  const parts = key.replace(/^\.\//, "").replace(/\.md$/, "").split("/").filter(Boolean);

  if (parts[parts.length - 1] === "landing-page") {
    return "";
  }

  if (parts.length > 1 && parts[parts.length - 1] === parts[parts.length - 2]) {
    parts.pop();
  }

  return parts.map(slugify).join("/");
}

function getExamplePath(key: string): string {
  const parts = key
    .replace(/^\.\//, "")
    .replace(/\.vue$/, "")
    .split("/")
    .filter(Boolean)
    .map(slugify);

  return ["examples", ...parts].join("/");
}

const routes = [
  {
    path: "/",
    component: () => import("src/.q-press/layouts/MarkdownLayout.vue"),
    children: [
      ...Object.entries(mdPageList)
        .filter(([key]) => key.includes("landing-page.md"))
        .map(([_key, component]) => ({
          path: "",
          name: "Landing Page",
          component,
          meta: { fullscreen: true, dark: true },
        })),

      ...Object.entries(mdPageList)
        .filter(([key]) => !key.includes("landing-page.md"))
        .map(([key, component]) => ({
          path: getMarkdownPath(key),
          component,
        })),

      ...Object.entries(examplesPageList).map(([key, component]) => ({
        path: getExamplePath(key),
        component,
      })),
    ],
  },

  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/Error404.vue"),
  },
];

export default routes;
