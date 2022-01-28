import { defineConfig } from 'dumi';

export default defineConfig({
  title: 'like-ui',
  favicon:
    'https://user-images.githubusercontent.com/9554297/83762004-a0761b00-a6a9-11ea-83b4-9c8ff721d4b8.png',
  logo: 'https://user-images.githubusercontent.com/9554297/83762004-a0761b00-a6a9-11ea-83b4-9c8ff721d4b8.png',
  outputPath: 'docs-dist',
  mode: 'site',
  base: '/like-ui',
  publicPath: '/like-ui/',
  exportStatic: {},
  navs: [
    null, // null 值代表保留约定式生成的导航，只做增量配置
    {
      title: '设计',
      path: '/',
    },
    {
      title: '产品',
      path: '/',
      // 可通过如下形式嵌套二级导航菜单，目前暂不支持更多层级嵌套：
      children: [
        { title: '组件', path: '/' },
        { title: '高阶组件', path: '/' },
        { title: 'hooks', path: '/' },
      ],
    },
  ],
  // more config: https://d.umijs.org/config
});
