import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'AMPscript: The Guide',
  tagline: 'Comprehensive reference manual for AMPscript — the scripting language for Salesforce Marketing Cloud.',
  favicon: 'img/favicon.ico',

  url: 'https://jolucas245.github.io',
  baseUrl: '/AMPScript-The-Guide/',

  organizationName: 'jolucas245',
  projectName: 'AMPScript-The-Guide',

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    navbar: {
      title: 'AMPscript: The Guide',
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Documentation',
        },
        {
          href: 'https://github.com/jolucas245/ampscript-the-guide',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      copyright: `AMPscript: The Guide — Community-maintained reference for Salesforce Marketing Cloud.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
    algolia: undefined,
  } satisfies Preset.ThemeConfig,
};

export default config;