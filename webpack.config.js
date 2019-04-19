/**
 * 一个webpack配置的模板，当前为dev环境
 */
const path = require('path');
const autoprefixer = require('autoprefixer');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
module.exports = (env, argv) => {
    const commonConfig = {
        mode: argv.mode,
        entry: {
            index: path.join(__dirname, './src/test/index.tsx')
        },
        output: {
            path: path.join(__dirname, 'lib'),
            filename: '[name].js',
            publicPath: '/lib/',
            library: 'SimpleComponent',
            libraryTarget: 'umd'
        },
        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.jsx']
        },
        externals: {
            react: {
                root: 'React',
                commonjs2: 'react',
                commonjs: 'react',
                amd: 'react'
            },
            'react-dom': {
                root: 'react-dom',
                commonjs2: 'react-dom',
                commonjs: 'react-dom',
                amd: 'react-dom'
            }
        },
        module: {
            rules: [
                {
                    test: /\.js[x]?$/,
                    exclude: /node_modules/,
                    use: [{
                        loader: 'babel-loader?presets[]=react,presets[]=es2015,presets[]=stage-0'
                    }]
                },
                { test: /\.ts[x]?$/, loaders: ['babel-loader', 'ts-loader'], include: path.resolve('src') },
                {
                    test: /\.[s]?css$/,
                    use: [{
                        loader: 'style-loader'
                    }, {
                        loader: 'css-loader'
                    }, {
                        loader: 'sass-loader'
                    }, {
                        loader: 'postcss-loader',
                        options: {
                            ident: 'postcss',
                            plugins: () => [
                                autoprefixer({
                                    browsers: [
                                        '>1%',
                                        'last 4 versions',
                                        'Firefox ESR',
                                        'not ie < 9' // React doesn't support IE8 anyway
                                    ],
                                    flexbox: 'no-2009',
                                    remove: false
                                })
                            ]
                        }
                    }]
                }
            ]
        },
        plugins: argv.env === 'analyzer' ? [new BundleAnalyzerPlugin()] : []
    };

    const isDevMode = argv.mode !== 'production';
    if (isDevMode) {
        commonConfig.output.path = path.join(__dirname, 'dist');
        commonConfig.output.publicPath = '/dist/';
        commonConfig.devServer = {
            host: '127.0.0.1',
            port: 8088
        };
    }
    return commonConfig;
};
