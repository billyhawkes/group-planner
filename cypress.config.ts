import { defineConfig } from "cypress";
import dotenv from "dotenv";
dotenv.config();

export default defineConfig({
	component: {
		devServer: {
			framework: "react",
			bundler: "vite",
			// optionally pass in vite config
			//   viteConfig: customViteConfig,
		},
	},
	env: {
		googleRefreshToken: process.env.GOOGLE_REFRESH_TOKEN,
		googleClientId: process.env.REACT_APP_GOOGLE_CLIENTID,
		googleClientSecret: process.env.REACT_APP_GOOGLE_CLIENT_SECRET,
		databaseUrl: process.env.DATABASE_URL,
		databaseToken: process.env.DATABASE_TOKEN,
	},

	e2e: {
		setupNodeEvents(on, config) {
			// implement node event listeners here
		},
	},
});
