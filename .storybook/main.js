const webpack = require('webpack')
const path = require('path')
const { IgnoreNotFoundPlugin } = require('./plugins')

// example1: /packages/picasso/src/Button/Button.tsx
// example2: /packages/picasso-lab/src/Slider/Slider.tsx
const PACKAGES_COMPONENT_DECLARATION_FILE_REGEXP = /packages\/.*\/src\/(.*)\/\1.tsx$/

const { env } = process
const isDevelopment = env.NODE_ENV !== 'production' && env.NODE_ENV !== 'test'

const tsConfigFile = path.join(__dirname, './tsconfig.json')
const threadLoaders = [{ loader: 'cache-loader' }, { loader: 'thread-loader' }]

module.exports = {
  addons: [
    'storybook-readme/register',
    '@storybook/addon-viewport/register',

    // no "/register" because https://github.com/storybookjs/storybook/issues/11929#issuecomment-672998494
    '@storybook/addon-a11y',

    './addons/menu-expand/register',
    './addons/anchor-link-handler/register',
    './addons/document-title/register'
  ],
  stories: [path.join(__dirname, './load-stories.js')],
  typescript: {
    check: isDevelopment,
    checkOptions: {
      tsconfig: tsConfigFile,
      checkSyntacticErrors: true
    },
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      tsconfigPath: tsConfigFile,
      propFilter: prop => {
        if (prop.description.length === 0) return false

        if (prop.parent) {
          return !prop.parent.fileName.includes('node_modules')
        }

        return true
      }
    }
  },
  webpackFinal: config => {
    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      oneOf: [
        {
          test: PACKAGES_COMPONENT_DECLARATION_FILE_REGEXP,
          use: threadLoaders
        },
        { use: threadLoaders }
      ]
    })

    // supress an error with dynamic path e.g. require(`${url}`)
    // https://github.com/webpack/webpack/issues/196
    config.module.exprContextCritical = false

    config.resolve.alias = {
      ...config.resolve.alias,
      '~': path.resolve(__dirname, '..'),
      '@toptal/picasso': path.resolve(__dirname, '../packages/picasso/src'),
      '@toptal/picasso-shared': path.resolve(
        __dirname,
        '../packages/shared/src'
      ),
      '@toptal/picasso/utils': path.resolve(
        __dirname,
        '../packages/picasso/src/utils'
      ),
      '@toptal/picasso/Icon': path.resolve(
        __dirname,
        '../packages/picasso/src/Icon'
      ),
      '@toptal/picasso-lab': path.resolve(
        __dirname,
        '../packages/picasso-lab/src'
      ),
      '@toptal/picasso-forms': path.resolve(
        __dirname,
        '../packages/picasso-forms/src'
      ),
      '@toptal/picasso-charts': path.resolve(
        __dirname,
        '../packages/picasso-charts/src'
      ),
      '@topkit/analytics-charts': path.resolve(
        __dirname,
        '../packages/topkit-analytics-charts/src'
      ),
      '@toptal/picasso-provider': path.resolve(
        __dirname,
        '../packages/picasso-provider/src'
      )
    }

    config.plugins.push(
      new webpack.DefinePlugin({
        TEST_ENV: JSON.stringify(env.TEST_ENV)
      }),
      // https://github.com/TypeStrong/ts-loader/issues/653
      new IgnoreNotFoundPlugin(['OverridableComponent', 'BaseProps'])
    )

    config.node = {
      fs: 'empty',
      module: 'empty'
    }

    config.optimization.minimizer = []

    return config
  },
  reactOptions: {
    fastRefresh: true
  },
  features: {
    postcss: false
  }
}
