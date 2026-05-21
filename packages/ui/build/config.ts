import { createRequire } from "node:module";

const nodeRequire = createRequire(import.meta.url);
const { name, author, version } = nodeRequire("../package.json") as {
  name: string;
  author: string;
  version: string;
};
const year = new Date().getFullYear();

export default {
  name,
  version,
  banner:
    "/*!\n" +
    " * " +
    name +
    " v" +
    version +
    "\n" +
    " * (c) " +
    year +
    " " +
    author +
    "\n" +
    " * Released under the MIT License.\n" +
    " */\n",
};
