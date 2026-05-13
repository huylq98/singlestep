import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Singlestep',
  tagline: 'Single-step through the hard stuff.',
  favicon: 'img/favicon.ico',

  future: { v4: true },

  url: 'https://singlestep.dev', // updated when custom domain configured
  baseUrl: '/',

  organizationName: 'PLACEHOLDER-GH-USER', // <-- set this to your GitHub username before deploy
  projectName: 'singlestep',
  deploymentBranch: 'gh-pages',
  trailingSlash: false,

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  i18n: { defaultLocale: 'en', locales: ['en'] },

  presets: [
    [
      'classic',
      {
        docs: { sidebarPath: './sidebars.ts' },
        blog: false, // re-enabled in Task 3
        theme: { customCss: './src/css/custom.css' },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      defaultMode: 'light',
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Singlestep',
      logo: {
        alt: 'Singlestep',
        src: 'img/logo.svg',
      },
      items: [
        { type: 'docSidebar', sidebarId: 'main', position: 'left', label: 'Docs' },
        // Blog, Playground, About added in Task 3.
      ],
    },
    footer: {
      style: 'dark',
      links: [],
      copyright: `Copyright © ${new Date().getFullYear()} Singlestep. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['java', 'bash', 'sql', 'yaml', 'docker', 'typescript'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
