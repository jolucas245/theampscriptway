import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'The AMPScript Way',
  tagline: 'Comprehensive reference manual for AMPscript - the scripting language for Salesforce Marketing Cloud.',
  favicon: 'favicon.ico',

  url: 'https://ampscriptway.dev',
  baseUrl: '/The-AMPScript-Way/',

  organizationName: 'jolucas245',
  projectName: 'AMPScript-Way',

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'pt-BR',
    locales: ['pt-BR', 'en'],
    localeConfigs: {
      'pt-BR': { label: 'Português (BR)', direction: 'ltr' },
      en: { label: 'English', direction: 'ltr' },
    },
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
      title: 'The AMPScript Way',
      logo: {
        alt: 'The AMPScript Way',
        src: 'img/mascot.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Documentation',
        },
        {
          href: 'https://github.com/jolucas245//theampscriptway',
          label: 'GitHub',
          position: 'right',
        },
        { to: '/playground', label: 'Playground', position: 'left' },
      ],
    },
    footer: {
      style: 'dark',
      copyright: `AMPscript Way | Community-maintained reference for Salesforce Marketing Cloud.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
    algolia: undefined,
  } satisfies Preset.ThemeConfig,
};

export default config;