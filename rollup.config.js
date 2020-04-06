import path from 'path';
import { DEFAULT_EXTENSIONS } from '@babel/core';
import replace from '@rollup/plugin-replace';
import typescript from 'rollup-plugin-typescript2';
import babel from 'rollup-plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import alias from '@rollup/plugin-alias';
import browsersync from 'rollup-plugin-browsersync';
import visualizer from 'rollup-plugin-visualizer';
import filesize from 'rollup-plugin-filesize';
import progress from 'rollup-plugin-progress';
import { uglify } from 'rollup-plugin-uglify';
import { name } from './package.json';
import json from '@rollup/plugin-json';

const isProd = false;
process.env.NODE_ENV = isProd ? 'production' : 'development';
process.env.BABEL_ENV = isProd ? 'production' : 'development';

const reactNamedExports = [
  'Children',
  'Component',
  'Fragment',
  'Profiler',
  'PureComponent',
  'StrictMode',
  'Suspense',
  '__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED',
  'cloneElement',
  'createContext',
  'createElement',
  'createFactory',
  'createRef',
  'forwardRef',
  'isValidElement',
  'lazy',
  'memo',
  'useCallback',
  'useContext',
  'useDebugValue',
  'useEffect',
  'useImperativeHandle',
  'useLayoutEffect',
  'useMemo',
  'useReducer',
  'useRef',
  'useState',
  'version',
];

const reactDOMNamedExports = [
  '__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED',
  'createPortal',
  'findDOMNode',
  'flushSync',
  'hydrate',
  'render',
  'unmountComponentAtNode',
  'unstable_batchedUpdates',
  'unstable_createPortal',
  'unstable_renderSubtreeIntoContainer',
  'version',
];

const reactIsNamedExports = [
  'AsyncMode',
  'ConcurrentMode',
  'ContextConsumer',
  'ContextProvider',
  'Element',
  'ForwardRef',
  'Fragment',
  'Lazy',
  'Memo',
  'Portal',
  'Profiler',
  'StrictMode',
  'Suspense',
  'isAsyncMode',
  'isConcurrentMode',
  'isContextConsumer',
  'isContextProvider',
  'isElement',
  'isForwardRef',
  'isFragment',
  'isLazy',
  'isMemo',
  'isPortal',
  'isProfiler',
  'isStrictMode',
  'isSuspense',
  'isValidElementType',
  'typeOf',
];

const extensions = [...DEFAULT_EXTENSIONS, '.jsx', '.ts', '.tsx'];

const commonExternal = ['react', 'react-is', 'styled-components'];

const commonPlugins = [
  commonjs({
    include: 'node_modules/**',
    exclude: ['node_modules/process-es6/**'],
    extensions,
    namedExports: {
      react: reactNamedExports,
      'react-dom': reactDOMNamedExports,
      'react-is': reactIsNamedExports,
    },
  }),
  resolve({
    extensions,
    preferBuiltins: true,
  }),
  babel({
    extensions,
    exclude: 'node_modules/**',
  }),
  json({
    compact: true,
    namedExports: false,
  }),
  isProd &&
    progress({
      clearLine: false,
    }),
  isProd && filesize(),
];

const commonOptions = {
  cache: true,
  treeshake: false,
};

const clientConfig = {
  ...commonOptions,
  input: 'src/index.tsx',
  external: isProd && [...commonExternal, 'react-dom', 'prop-types'],
  output: {
    name: pkg.name,
    file: `dist/public/${pkg.name}.js`,
    format: 'iife',
    globals: {
      react: 'React',
      'react-dom': 'ReactDOM',
      'prop-types': 'PropTypes',
      'styled-components': 'styled',
    },
  },
  plugins: [
    typescript({ check: isProd }),
    ...commonPlugins,
    replace({
      'process.env.NODE_ENV': JSON.stringify(isProd ? 'production' : 'development'),
    }),
    isProd && visualizer(),
    isProd && uglify(),
  ],
  watch: {
    exclude: 'node_modules/**',
    include: 'src/**',
  },
};

// SSR Rendering frontend application file bundle
const appConfig = {
  input: 'src/app.tsx',
  ...commonOptions,
  external: [...commonExternal],
  output: { file: 'dist/app.js', format: 'cjs', compact: true },
  plugins: [typescript({ check: isProd, tsconfigOverride: { module: 'commonjs', jsx: 'react' } }), ...commonPlugins],
  watch: {
    exclude: 'node_modules/**',
    include: 'src/**',
  },
};

export default {
  input: 'src/index.tsx',
  external: isProd && ['react', 'react-dom', 'prop-types', 'styled-components'],
  output: {
    name,
    file: 'public/dist/app.js',
    format: 'iife',
    globals: {
      react: 'React',
      'react-dom': 'ReactDOM',
      'prop-types': 'PropTypes',
      'styled-components': 'styled',
    },
  },
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify(isProd ? 'production' : 'development'),
    }),
    resolve(),
    commonjs({
      include: 'node_modules/**',
      namedExports: {
        react: reactNamedExports,
        'react-dom': reactDOMNamedExports,
        'react-is': reactIsNamedExports,
      },
    }),
    babel({
      extensions: [...DEFAULT_EXTENSIONS, '.ts', '.tsx'],
      exclude: 'node_modules/**',
    }),
    filesize(),
    typescript(),
    alias({
      entries: [{ find: 'components', replacement: path.join(__dirname, 'src/components') }],
    }),
    progress({
      clearLine: false,
    }),
    isProd && visualizer(),
    isProd && uglify(),
    !isProd && browsersync({ server: 'public', files: 'public/dist/app.js' }),
  ],
  watch: {
    exclude: 'node_modules/**',
    include: 'src/**',
  },
};
