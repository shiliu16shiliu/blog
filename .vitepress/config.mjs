import { defineConfig } from 'vitepress';
import { withSidebar } from 'vitepress-sidebar';

const vitePressOptions = {
  // VitePress's options here...
  title: '不动产登记全程网办',
};

const vitePressSidebarConfigs  = [
    {
      documentRootPath: '/',
      scanStartPath: 'qcwb',
      resolvePath: '/qcwb/',
      // useTitleFromFrontmatter: true
    }
  ];

export default defineConfig(withSidebar(vitePressOptions, vitePressSidebarConfigs ));
