import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Singlestep',
  tagline: 'Single-step through the hard stuff.',
  favicon: 'img/favicon.ico',

  future: { v4: true },

  url: 'https://singlestep.dev',
  baseUrl: '/',

  organizationName: 'PLACEHOLDER-GH-USER',
  projectName: 'singlestep',
  deploymentBranch: 'gh-pages',
  trailingSlash: false,

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  i18n: { defaultLocale: 'en', locales: ['en'] },

  markdown: {
    mermaid: true,
  },

  themes: ['@docusaurus/theme-mermaid'],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          showLastUpdateTime: true,
          showLastUpdateAuthor: false,
        },
        blog: {
          showReadingTime: true,
          blogTitle: 'Singlestep — Blog',
          blogDescription: 'Posts about engineering experiences and lessons.',
          postsPerPage: 10,
          feedOptions: {
            type: 'all',
            title: 'Singlestep',
            description: 'Engineering deep dives and interactive simulations.',
            copyright: `Copyright © ${new Date().getFullYear()} Singlestep.`,
          },
        },
        theme: { customCss: './src/css/custom.css' },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    [
      '@easyops-cn/docusaurus-search-local',
      {
        hashed: true,
        indexDocs: true,
        indexBlog: true,
        indexPages: true,
        docsRouteBasePath: '/docs',
        blogRouteBasePath: '/blog',
        language: 'en',
      },
    ],
    [
      '@docusaurus/plugin-client-redirects',
      {
        redirects: [
          // Add entries here when you reorganize URLs. Example:
          // { from: '/docs/old-path', to: '/docs/new-path' },
        ],
      },
    ],
  ],

  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    metadata: [
      { name: 'description', content: 'Interactive engineering knowledge base. Single-step through the hard stuff.' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { property: 'og:type', content: 'website' },
    ],
    colorMode: {
      defaultMode: 'light',
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Singlestep',
      logo: { alt: 'Singlestep', src: 'img/logo.svg' },
      items: [
        { type: 'docSidebar', sidebarId: 'main', position: 'left', label: 'Docs' },
        { to: '/blog', label: 'Blog', position: 'left' },
        { to: '/playground', label: 'Playground', position: 'left' },
        { to: '/about', label: 'About', position: 'right' },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Site',
          items: [
            { label: 'Docs', to: '/docs/intro' },
            { label: 'Blog', to: '/blog' },
            { label: 'Playground', to: '/playground' },
            { label: 'About', to: '/about' },
          ],
        },
        {
          title: 'Feeds',
          items: [
            { label: 'RSS', href: '/blog/rss.xml' },
            { label: 'Atom', href: '/blog/atom.xml' },
          ],
        },
      ],
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
