import babel from 'rollup-plugin-babel';
import serve from 'rollup-plugin-serve';

export default {
  // 打包入口
  input: './src/index.js',
  output: {
    // 出口
    file: 'dist/umd/vue.js',
    // 指定打包后全局变量名
    name: 'Vue',
    // 统一模块规范
    format: 'umd',
    // 源码调试
    sourcemap: true,
  },
  plugins: [
    babel({
      exclude: 'node_modules/**',
    }),
    process.env.ENV === 'development'
      ? serve({
          // 自动打开
          open: true,
          openPage: '/public/index.html',
          port: 3000,
          contentBase: '',
        })
      : null,
  ],
};
