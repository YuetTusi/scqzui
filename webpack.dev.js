const { join, resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

let config = {
	mode: 'development',
	entry: {
		default: join(__dirname, './src/renderer/default/default.tsx')
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
		extensions: ['.tsx', '.ts', '.js', '.json']
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
								// modifyVars: theme,
								javascriptEnabled: true
							}
						}
					}
				]
			},
			{
				test: /\.ya?ml$/,
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
		port: 8084,
		open: false,
		compress: true
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: join(__dirname, './src/renderer/default/default.html'),
			filename: 'default.html',
			chunks: ['default']
		})
	]
};

module.exports = config;
