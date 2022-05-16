const { join } = require('path');
const { readdirSync } = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');

/**
 * 打包入口
 */
const getEntry = () => {
	try {
		const dir = readdirSync(join(__dirname, './src/renderer'));
		const entry = dir.reduce(
			(entries, item) => ({
				...entries,
				[item]: join(__dirname, `./src/renderer/${item}/${item}.ts`)
			}),
			{}
		);
		console.info('Read Webpack Entry...');
		console.table(entry);
		return entry;
	} catch (error) {
		throw error;
	}
};

/**
 * 模版插件
 */
const getHtmlPlugins = () => {
	try {
		const dir = readdirSync(join(__dirname, './src/renderer'));
		const plugins = dir.map((item) => {
			return new HtmlWebpackPlugin({
				template: join(__dirname, `./src/renderer/${item}/${item}.html`),
				filename: `${item}.html`,
				chunks: [item]
			});
		});
		return plugins;
	} catch (error) {
		throw error;
	}
};

module.exports = { getEntry, getHtmlPlugins };
