import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'

dotenv.config()

const frontendEnv: { [key: string]: string | undefined } = {}

// Only expose CALCUBOT_ prefixed environment variables to the frontend to avoid security risks.
for (const [key, value] of Object.entries(process.env)) {
	if (key.startsWith('CALCUBOT_')) {
		frontendEnv[key] = value
	}
}

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	define: {
		'process.env': frontendEnv,
	},
	server: {
		port: parseInt(process.env.APP_PORT || '3001'),
	},
})
