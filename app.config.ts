import { TanStackRouterVite } from "@tanstack/router-vite-plugin";
import reactRefresh from "@vitejs/plugin-react";
import { createApp } from "vinxi";
import { config } from "vinxi/plugins/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default createApp({
	server: {
		experimental: {
			asyncContext: true,
		},
	},
	routers: [
		{
			name: "public",
			type: "static",
			dir: "./public",
			base: "/",
		},
		{
			name: "server",
			base: "/trpc",
			type: "http",
			handler: "./src/events/trpc.ts",
			target: "server",
			plugins: () => [
				tsconfigPaths(),
				config("custom", {
					define: {
						"process.env.DATABASE_URL": JSON.stringify(process.env.DATABASE_URL),
						"process.env.R2_KEY_ID": JSON.stringify(process.env.R2_KEY_ID),
						"process.env.R2_ACCESS_KEY": JSON.stringify(process.env.R2_ACCESS_KEY),
						"process.env.DATABASE_TOKEN": JSON.stringify(process.env.DATABASE_TOKEN),
					},
				}),
			],
		},
		{
			name: "client",
			type: "spa",
			handler: "index.html",
			target: "browser",
			plugins: () => [tsconfigPaths(), reactRefresh(), TanStackRouterVite()],
		},
	],
});
