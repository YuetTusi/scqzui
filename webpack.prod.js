const { join, resolve } = require('path');
const { ProvidePlugin } = require('webpack');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const AntdDayjsPlugin = require('antd-dayjs-webpack-plugin');
const { getRenderer, getEntry, getHtmlPlugins } = require('./webpack.tool');
const theme = require('./theme/cyan.json');

const dir = getRenderer();

let config = {
	mode: 'production',
	entry: getEntry(dir),
	output: {
		filename: '[name].js',
		path: join(__dirname, './dist/renderer')
	},
	target: 'electron-preload',
	optimization: {
		minimize: true,
		minimizer: [
			new TerserWebpackPlugin({
				terserOptions: {
					keep_fnames: false
				}
			})
		]
	},
	resolve: {
		alias: {
			'@': resolve(__dirname, './src')
		},
		extensions: ['.ts', '.tsx', 'yml', 'yaml', '.js', '.json']
	},
	externals: {
		sqlite3: 'commonjs sqlite3',
		archiver: "require('archiver')"
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: [{ loader: 'ts-loader' }]
			},
			{
				test: /\.(png|jpe?g|gif|ico)$/,
				type: 'asset/resource',
				generator: {
					filename: 'images/[hash:16][ext]'
				}
			},
			{
				test: /\.(woff2?|ttf|otf|eot|svg)$/,
				type: 'asset/resource',
				generator: {
					filename: 'fonts/[hash:16][ext]'
				}
			},
			{
				test: /\.css$/,
				use: [{ loader: 'style-loader' }, { loader: 'css-loader' }]
			},
			{
				test: /\.less$/,
				use: [
					{ loader: 'style-loader' },
					{ loader: 'css-loader' },
					{
						loader: 'less-loader',
						options: {
							lessOptions: {
								modifyVars: theme,
								javascriptEnabled: true
							}
						}
					}
				]
			},
			{
				test: /\.ya?ml$/,
				type: 'json',
				use: [{ loader: 'yaml-loader' }]
			}
		]
	},
	plugins: [
		new ProvidePlugin({
			$: 'jquery',
			jQuery: 'jquery'
		}),
		new AntdDayjsPlugin(['customParseFormat', 'localeData', 'weekday']),
		...getHtmlPlugins(dir)
	]
};

module.exports = config;
