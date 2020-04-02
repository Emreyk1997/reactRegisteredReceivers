import path from 'path'
import { DEFAULT_EXTENSIONS } from '@babel/core'
import replace from '@rollup/plugin-replace'
import typescript from '@rollup/plugin-typescript'
import babel from 'rollup-plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import alias from '@rollup/plugin-alias'
import browsersync from 'rollup-plugin-browsersync'
import visualizer from 'rollup-plugin-visualizer'
import filesize from 'rollup-plugin-filesize'
import progress from 'rollup-plugin-progress'
import { uglify } from 'rollup-plugin-uglify'
import { name } from './package.json'


const isProd = process.env.BUILD === 'production';
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
    'version'
  ]
  
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
    'version'
  ]
  
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
    'typeOf'
  ]

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
        'styled-components': 'styled'
      }
    },
    plugins: [
        replace({
          'process.env.NODE_ENV': JSON.stringify(isProd ? 'production' : 'development')
        }),
        resolve(),
    commonjs({
      include: 'node_modules/**',
      namedExports: {
        react: reactNamedExports,
        'react-dom': reactDOMNamedExports,
        'react-is': reactIsNamedExports
      }
    }),
    babel({
        extensions: [...DEFAULT_EXTENSIONS, '.ts', '.tsx'],
        exclude: 'node_modules/**'
      }),
      filesize(),
      typescript(),
      alias({
        entries: [{ find: 'components', replacement: path.join(__dirname, 'src/components') }]
      }),
      progress({
        clearLine: false
      }),
      isProd && visualizer(),
      isProd && uglify(),
      !isProd && browsersync({ server: 'public', files: 'public/dist/app.js' })
    ],
    watch: {
        exclude: 'node_modules/**',
        include: 'src/**'
      }
    }