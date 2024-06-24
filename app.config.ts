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
						"process.env.R2_KEY_ID": JSON.stringify(process.env.R2_KEY_ID),
						"process.env.R2_ENDPOINT": JSON.stringify(process.env.R2_ENDPOINT),
						"process.env.R2_ACCESS_KEY": JSON.stringify(process.env.R2_ACCESS_KEY),
						"process.env.DATABASE_URL": JSON.stringify(process.env.DATABASE_URL),
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
		{
			name: "auth",
			type: "http",
			base: "/auth",
			handler: "./src/events/auth.ts",
			target: "server",
			plugins: () => [
				tsconfigPaths(),
				config("custom", {
					define: {
						"process.env.SITE_URL": JSON.stringify(process.env.SITE_URL),
						"process.env.GOOGLE_CLIENT_ID": JSON.stringify(process.env.DATABASE_URL),
						"process.env.GOOGLE_CLIENT_SECRET": JSON.stringify(process.env.R2_KEY_ID),
						"process.env.DATABASE_URL": JSON.stringify(process.env.DATABASE_URL),
						"process.env.DATABASE_TOKEN": JSON.stringify(process.env.DATABASE_TOKEN),
					},
				}),
			],
		},
	],
});
