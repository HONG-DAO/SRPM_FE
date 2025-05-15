/// <reference types='vitest' />
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const isProd = env.VITE_NODE_ENV === 'production';
  
  return {
    root: __dirname,
    cacheDir: `./node_modules/.vite/${env.VITE_APP_NAME.toLowerCase()}`,
    server: {
      port: Number(new URL(env.VITE_SERVER_URL).port) || 4200,
      host: new URL(env.VITE_SERVER_URL).hostname || 'localhost',
      proxy: {
        '/api': {
          target: env.VITE_API_URL,
          changeOrigin: true,
          secure: isProd,
        }
      }
    },
    preview: {
      port: 4300,
      host: 'localhost',
    },
    plugins: [react(), nxViteTsPaths(), nxCopyAssetsPlugin(['*.md'])],
    resolve: {
      alias: {
        '@cnpm': path.resolve(__dirname, 'src'),
        '@i18n': path.resolve(__dirname, 'src/i18n'),
        '@services': path.resolve(__dirname, 'src/services'),
        '@lib': path.resolve(__dirname, 'src/lib'),
        '@utils': path.resolve(__dirname, 'src/utils'),
      },
    },
    build: {
      outDir: `./dist/${env.VITE_APP_NAME.toLowerCase()}`,
      emptyOutDir: true,
      reportCompressedSize: true,
      commonjsOptions: {
        transformMixedEsModules: true,
      },
      sourcemap: !isProd,
      minify: isProd,
    },
    test: {
      watch: false,
      globals: true,
      environment: 'jsdom',
      include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
      reporters: ['default'],
      coverage: {
        reportsDirectory: `./coverage/${env.VITE_APP_NAME.toLowerCase()}`,
        provider: 'v8',
      },
    },
    define: {
      'process.env': env
    }
  };
});
