import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'The AMPScript Way',
  tagline: 'Comprehensive reference manual for AMPscript - the scripting language for Salesforce Marketing Cloud.',
  favicon: 'favicon.ico',

  url: 'https://theampscriptway.pages.dev',
baseUrl: '/',

  organizationName: 'jolucas245',
  projectName: 'AMPScript-Way',

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'pt-BR',
    locales: ['pt-BR'],
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
  themes: [
    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
      {
        hashed: true,
        language: ['pt'],
        indexDocs: true,
        indexPages: true,
      },
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
          label: 'Documentação',
        },
        { to: '/playground', label: 'Playground', position: 'left' },
        { to: '/about', label: 'Sobre', position: 'right' },
        {
          href: 'https://github.com/jolucas245/theampscriptway',
          position: 'right',
          className: 'navbar-icon-link navbar-github-link',
          'aria-label': 'GitHub',
        },
        {
          href: 'https://linkedin.com/in/jolucas245',
          position: 'right',
          className: 'navbar-icon-link navbar-linkedin-link',
          'aria-label': 'LinkedIn',
        },
      ],
    },
    footer: {
      style: 'dark',
      copyright: `AMPscript Way | Guia mantido pela comunidade do Salesforce Marketing`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
    
  } satisfies Preset.ThemeConfig,
};

export default config;