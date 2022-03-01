const { join, resolve } = require('path');
const { ProvidePlugin } = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const theme = require('./theme/cyan.json');

let config = {
	mode: 'development',
	entry: {
		default: join(__dirname, './src/renderer/default/default.ts'),
		sqlite: join(__dirname, './src/renderer/sqlite/sqlite.ts'),
		protocol: join(__dirname, './src/renderer/protocol/protocol.ts'),
		timer: join(__dirname, './src/renderer/timer/timer.ts'),
		fetchRecord: join(__dirname, './src/renderer/fetch-record/fetch-record.ts')
	},
	output: {
		filename: '[name].js',
		path: join(__dirname, './dist/renderer')
	},
	target: 'electron-preload',
	resolve: {
		alias: {
			'@': resolve(__dirname, './src')
		},
		extensions: ['.ts', '.tsx', 'yml', 'yaml', '.js', '.json']
	},
	externals: {
		sqlite3: 'commonjs sqlite3'
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
	devServer: {
		static: {
			directory: join(__dirname, './dist')
		},
		client: {
			overlay: { errors: true }
		},
		port: 8085,
		open: false,
		compress: true
	},
	plugins: [
		new ProvidePlugin({
			$: 'jquery',
			jQuery: 'jquery'
		}),
		new HtmlWebpackPlugin({
			template: join(__dirname, './src/renderer/default/default.html'),
			filename: 'default.html',
			chunks: ['default']
		}),
		new HtmlWebpackPlugin({
			template: join(__dirname, './src/renderer/sqlite/sqlite.html'),
			filename: 'sqlite.html',
			chunks: ['sqlite']
		}),
		new HtmlWebpackPlugin({
			template: join(__dirname, './src/renderer/protocol/protocol.html'),
			filename: 'protocol.html',
			chunks: ['protocol']
		}),
		new HtmlWebpackPlugin({
			template: join(__dirname, './src/renderer/timer/timer.html'),
			filename: 'timer.html',
			chunks: ['timer']
		}),
		new HtmlWebpackPlugin({
			template: join(__dirname, './src/renderer/fetch-record/fetch-record.html'),
			filename: 'fetch-record.html',
			chunks: ['fetchRecord']
		})
	]
};

module.exports = config;
