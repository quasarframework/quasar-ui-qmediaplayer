import { fabGithub, fabXTwitter } from "@quasar/extras/fontawesome-v7";
import type { MenuItem } from "@md-plugins/vite-md-plugin";
import { version } from "../../../ui/package.json";
import { slugify } from "../.q-press/components/markdown-utils";

const repoBranch = "v3-beta";
const productName = "QMediaPlayer";

export interface SocialLink {
  name: string;
  icon: string;
  path: string;
  external?: boolean | undefined;
}

export interface SiteMenuItem extends MenuItem {
  about?: string | undefined;
  expanded?: boolean | undefined;
  external?: boolean | undefined;
  children?: SiteMenuItem[] | undefined;
  separator?: boolean | undefined;
  header?: string | undefined;
  mq?: number | undefined;
  extract?: string | undefined;
  image?: string | undefined;
  maxWidth?: string | undefined;
}

export interface LinksConfig {
  primaryHeaderLinks: SiteMenuItem[];
  secondaryHeaderLinks: SiteMenuItem[];
  moreLinks: SiteMenuItem[];
  footerLinks: SiteMenuItem[];
  socialLinks: SocialLink[];
}

export interface LogoConfig {
  showLogo: boolean;
  logoLight: string;
  logoDark: string;
  logoAlt: string;
}

export interface VersionConfig {
  showTitle: boolean;
  showVersion: boolean;
  showOnHeader: boolean;
  showOnSidebar: boolean;
}

export interface UIConfig {
  usePrimaryHeader: boolean;
  useSecondaryHeader: boolean;
  headerHeightHint: number;
  useMoreLinks: boolean;
  useFooter: boolean;
  useSidebar: boolean;
  useToc: boolean;
}

export interface CopyrightConfig {
  line1: string;
  line2: string;
}

export interface LicenseConfig {
  label: string;
  link: string;
}

export interface PrivacyConfig {
  label: string;
  link: string;
}

export interface CodepenGlobalPackage {
  packageName: string;
  globalName: string;
}

export interface CodepenConfig {
  head?: string | undefined;
  cssExternal?: string[] | undefined;
  jsExternal?: string[] | undefined;
  jsPreProcessor?: string | undefined;
  titleSuffix?: string | undefined;
  jsSetup?: string | undefined;
  globalPackages?: CodepenGlobalPackage[] | undefined;
}

export interface SiteConfig {
  lang: string;
  title: string;
  description: string;
  theme: string;
  version: string;
  copyright: CopyrightConfig;
  githubEditRootSrc: string;
  githubSourceRootSrc?: string | undefined;
  codepen?: CodepenConfig | undefined;
  license: LicenseConfig;
  privacy: PrivacyConfig;
  logoConfig: LogoConfig;
  versionConfig: VersionConfig;
  config: UIConfig;
  links: LinksConfig;
  sidebar: SiteMenuItem[];
}

function getSidebarPath(item: SiteMenuItem): string {
  if (item.external === true) {
    return item.path ?? slugify(item.name);
  }

  const path = item.path?.replace(/^\/+/, "").split("/").filter(Boolean).pop();
  return path ?? slugify(item.name);
}

function processMenuItem(item: SiteMenuItem): SiteMenuItem {
  return {
    name: item.name,
    path: getSidebarPath(item),
    icon: item.icon,
    iconColor: item.iconColor,
    rightIcon: item.rightIcon,
    rightIconColor: item.rightIconColor,
    external: item.external,
    expanded: item.expanded ?? false,
    children: item.children ? item.children.map(processMenuItem) : undefined,
  };
}

const socialLinks = {
  name: "Social",
  mq: 1400,
  children: [
    {
      name: "GitHub",
      icon: fabGithub,
      path: `https://github.com/quasarframework/quasar-ui-qmediaplayer/tree/${repoBranch}`,
      external: true,
    },
    {
      name: "X (Twitter)",
      icon: fabXTwitter,
      path: "https://twitter.com/jgalbraith64",
      external: true,
    },
  ],
};

const docsMenus: SiteMenuItem[] = [
  {
    name: "Getting Started",
    mq: 470,
    children: [
      { name: "Introduction", path: "/getting-started/introduction" },
      { name: "Installation Types", path: "/getting-started/installation-types" },
    ],
  },
  {
    name: "Developing",
    mq: 600,
    children: [
      { name: "Using QMediaPlayer", path: "/developing/using-qmediaplayer" },
      { name: "FAQ", path: "/developing/faq" },
    ],
  },
  {
    name: "Other",
    mq: 760,
    children: [
      { name: "Releases", path: "/other/releases" },
      { name: "Migration Guide", path: "/other/migration-guide" },
      { name: "Contact", path: "/other/contact" },
      {
        name: "Contributing",
        children: [
          { name: "Overview", path: "/other/contributing/overview" },
          {
            name: "Bugs and Feature Requests",
            path: "/other/contributing/bugs-and-feature-requests",
          },
          { name: "Components", path: "/other/contributing/components" },
          { name: "Documentation", path: "/other/contributing/documentation" },
          { name: "Call to Action", path: "/other/contributing/call-to-action" },
          { name: "Sponsor", path: "/other/contributing/sponsor" },
        ],
      },
    ],
  },
];

const processedMenus = docsMenus.map((menu) => ({
  name: menu.name,
  path: slugify(menu.name),
  expanded: menu.expanded ?? false,
  children: menu.children ? menu.children.map(processMenuItem) : [],
}));

export const moreLinks: SiteMenuItem[] = [
  {
    name: "More",
    children: [...docsMenus, socialLinks],
  },
];

export const sidebar = processedMenus;

const config: SiteConfig = {
  lang: "en-US",
  title: productName,
  description: "HTML5 media player for Vue and Quasar applications",
  theme: "doc",
  version,
  copyright: {
    line1: `Copyright © 2019-${new Date().getFullYear()} Jeff Galbraith`,
    line2: "",
  },
  githubEditRootSrc: `https://github.com/quasarframework/quasar-ui-qmediaplayer/edit/${repoBranch}/packages/docs/src`,
  githubSourceRootSrc: `https://github.com/quasarframework/quasar-ui-qmediaplayer/tree/${repoBranch}/packages/docs/src`,
  codepen: {
    jsPreProcessor: "typescript",
    titleSuffix: `QMediaPlayer v${version}`,
    cssExternal: [
      `https://cdn.jsdelivr.net/npm/@quasar/quasar-ui-qmediaplayer@${version}/dist/index.min.css`,
    ],
    jsExternal: [
      `https://cdn.jsdelivr.net/npm/@quasar/quasar-ui-qmediaplayer@${version}/dist/index.umd.min.js`,
    ],
    globalPackages: [
      {
        packageName: "@quasar/quasar-ui-qmediaplayer",
        globalName: "(globalThis as any).QMediaPlayer",
      },
    ],
    jsSetup: "app.use((globalThis as any).QMediaPlayer)",
  },
  license: {
    label: "MIT License",
    link: `https://github.com/quasarframework/quasar-ui-qmediaplayer/blob/${repoBranch}/LICENSE`,
  },
  privacy: {
    label: "Contact",
    link: "/other/contact",
  },
  logoConfig: {
    showLogo: true,
    logoLight: "/qmediaplayer-logo.svg",
    logoDark: "/qmediaplayer-logo.svg",
    logoAlt: "QMediaPlayer Logo",
  },
  versionConfig: {
    showTitle: true,
    showVersion: true,
    showOnHeader: false,
    showOnSidebar: true,
  },
  config: {
    usePrimaryHeader: false,
    useSecondaryHeader: true,
    headerHeightHint: 55,
    useMoreLinks: true,
    useFooter: true,
    useSidebar: true,
    useToc: true,
  },
  links: {
    primaryHeaderLinks: [],
    secondaryHeaderLinks: [...docsMenus],
    moreLinks,
    footerLinks: [
      {
        name: socialLinks.name,
        children: [...socialLinks.children],
      },
    ],
    socialLinks: [...socialLinks.children],
  },
  sidebar,
};

export { sidebar as menu };
export default config;
