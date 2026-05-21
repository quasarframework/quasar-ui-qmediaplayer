declare module "*.md";

declare module "@md-plugins/md-plugin-headers" {
  export interface TocItem {
    id: string;
    level: number;
    title: string;
    [key: string]: unknown;
  }
}

interface ImportMetaHot {
  accept(callback?: (..._args: unknown[]) => unknown): void;
}

interface ImportMeta {
  glob: <T = unknown>(pattern: string) => Record<string, () => Promise<T>>;
  hot?: ImportMetaHot;
}

interface TocMenuItem {
  id: string;
  level: number;
  title: string;
  link?: string;
  deep?: boolean;
  sub?: boolean;
  onClick?: () => void;
  children?: TocMenuItem[];
}

interface MarkdownModule {
  title?: string;
  headers?: TocMenuItem[];
  frontmatter?: Record<string, unknown>;
  filename?: string;
  render: (..._args: unknown[]) => unknown;
}

interface MenuItem {
  name: string;
  path?: string;
  icon?: string;
  iconColor?: string;
  rightIcon?: string;
  rightIconColor?: string;
  badge?: string;
  children?: MenuItem[] | undefined;
  external?: boolean;
  expanded?: boolean;
}
