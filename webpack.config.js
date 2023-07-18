const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    mode: (process.env.NODE_ENV === 'production') ? 'production' : "development", //
    entry: './js/main.js',
    output: {
        filename: 'main.min.js',
        publicPath: 'http://localhost:3000/',
        path: __dirname + "/dist"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [['@babel/preset-env', { 
                                targets: {
                                    ie: 11,
                                    esmodules: true
                                },
                                useBuiltIns: 'usage',
                                corejs: 3
                            }]]
                        }
                    }
                ]
            },
            {
                test: /\.(vert|frag|obj)$/i,
                use: [
                    'raw-loader',
                    {
                        loader: 'glslify-loader',
                        options: {
                          transform: [
                            'glslify-import'
                          ]
                        }
                    }
                ]
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    "sass-loader",
                ],
              },
            // {
            //     test: /\.scss$/,
            //     use: ExtractTextPlugin.extract({
            //       fallback: "style-loader",
            //       use: ["css-loader", "sass-loader"],
            //       publicPath: "dist"
            //     })
            //   },
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({
          filename: '[name].css'
        }),
        // new BundleAnalyzerPlugin()
        
    ],
    resolve: {
        alias: {
          libs: path.resolve(__dirname, 'js/libs')
        }
    },
    optimization: {
        // runtimeChunk: true,
        minimize: true,
        minimizer: [
            new TerserPlugin({
                parallel: true,
                terserOptions: {
                  // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
                }
              }),
        ],
    },

    target: ['web', 'es5'],
    
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: false,
        open: true,
        hot: true,
        disableHostCheck: true
    }
};