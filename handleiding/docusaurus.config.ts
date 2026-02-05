import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Fruitvriendjes Handleiding',
  tagline: 'Admin handleiding voor de Fruitvriendjes app',
  favicon: 'img/favicon.png',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://schoolfruit-handleiding.web.app',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'plewie-io', // Usually your GitHub org/user name.
  projectName: 'fruitvriendjes', // Usually your repo name.

  onBrokenLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'nl',
    locales: ['nl'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Remove edit links since this is internal documentation
          editUrl: undefined,
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/cooking-family.png',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Fruitvriendjes',
      logo: {
        alt: 'Fruitvriendjes Logo',
        src: 'img/schoolfruit-logo.png',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Handleiding',
        },
        {
          href: 'https://schoolfruit.nl',
          label: 'Naar Schoolfruit.nl',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Handleiding',
          items: [
            {
              label: 'Introductie',
              to: '/docs/intro',
            },
          ],
        },
        {
          title: 'Links',
          items: [
            {
              label: 'Fruitvriendjes App',
              href: 'https://fruitvriendjes-35c8c.web.app',
            },
            {
              label: 'Schoolfruit.nl',
              href: 'https://schoolfruit.nl',
            },
          ],
        },
        {
          title: 'Admin',
          items: [
            {
              label: 'Admin Panel',
              href: 'https://fruitvriendjes-35c8c.web.app/admin',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Schoolfruit.nl. Handleiding voor Fruitvriendjes admin.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
