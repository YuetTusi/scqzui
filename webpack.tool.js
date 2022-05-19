const { join } = require('path');
const { readdirSync } = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');

/**
 * 读取renderer目录
 */
const getRenderer = () => readdirSync(join(__dirname, './src/renderer'));

/**
 * 打包入口
 */
const getEntry = (dir) => {
	try {
		return dir.reduce(
			(entries, item) => ({
				...entries,
				[item]: join(__dirname, `./src/renderer/${item}/${item}.ts`)
			}),
			{}
		);
	} catch (error) {
		throw error;
	}
};

/**
 * 模版插件
 */
const getHtmlPlugins = (dir) => {
	try {
		return dir.map(
			(item) =>
				new HtmlWebpackPlugin({
					template: join(__dirname, `./src/renderer/${item}/${item}.html`),
					filename: `${item}.html`,
					chunks: [item]
				})
		);
	} catch (error) {
		throw error;
	}
};

module.exports = { getRenderer, getEntry, getHtmlPlugins };
