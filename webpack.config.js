import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCSSExtractPlugin from "mini-css-extract-plugin";

const __dirname = path.resolve();

const getPlugins = (isProd) => {
	const plugins = [new HtmlWebpackPlugin({
		template: "./index.html",
	})];

	if (isProd === true) {
		plugins.push(new MiniCSSExtractPlugin({
			filename: "./main-[fullhash:8].css",
		}));
	}

	return plugins;
};

/**
 * @returns {import("webpack").Configuration}
 */
export default (env) => {
	const { mode } = env;
	const isProd = mode === "production";

	return {
		context: path.resolve(__dirname, "./src"),
		mode,
		devServer: {
			port: 4200,
			open: true,
			hot: true,
		},
		entry: "./ts/index.ts",
		resolve: {
			extensions: [".js", ".ts", ".json"],
			alias: {
				"@": path.resolve(__dirname, "src"),
			},
		},
		optimization: {
			minimize: isProd,
		},
		output: {
			filename: `[name]${isProd ? "" : ".[fullhash:8]"}.js`,
			path: path.resolve(__dirname, "dist"),
			chunkFilename: `[id]${isProd ? "" : ".[fullhash:8]"}.js`,
			clean: true,
		},
		devtool: isProd ? false : "source-map",
		plugins: getPlugins(isProd),
		module: {
			rules: [
				{
					test: /\.[jt]s$/,
					exclude: /node_modules/,
					use: "ts-loader",
				},
				{
					test: /\.s[ac]ss$/,
					use: [
						isProd ? MiniCSSExtractPlugin.loader : "style-loader",
						{
							loader: "css-loader",
							options: { sourceMap: !isProd },
						},
						"sass-loader",
					],
				},
			],
		},
	};
};
