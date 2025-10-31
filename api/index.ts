import { IncomingMessage, ServerResponse, createServer } from 'http';
import app from '../src/server';

type VercelRequest = IncomingMessage & {
	headers: Record<string, string | string[] | undefined>;
	method?: string;
	url?: string;
};
type VercelResponse = ServerResponse & {
	status: (code: number) => VercelResponse;
};

// Wrap Express app for Vercel serverless
const server = createServer(app);

// Helper to read allowed origins from env (comma-separated) or defaults
const allowedOrigins = process.env.CORS_ORIGIN
	? process.env.CORS_ORIGIN.split(',').map((s) => s.trim())
	: ['http://localhost:8080', 'https://digital-wallet-frontend-indol.vercel.app'];

function isAllowedOrigin(origin?: string | string[] | null): boolean {
	if (!origin) return true; // allow server-to-server or non-browser requests
	if (Array.isArray(origin)) origin = origin[0];
	return allowedOrigins.includes(origin);
}

export default function handler(req: VercelRequest, res: VercelResponse) {
	const origin = (req.headers.origin as string) || '';

	// Always set CORS headers that matter for browser preflight
	if (isAllowedOrigin(origin)) {
		res.setHeader('Access-Control-Allow-Origin', origin || '*');
		res.setHeader('Access-Control-Allow-Credentials', 'true');
		res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
		res.setHeader(
			'Access-Control-Allow-Headers',
			'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
		);
	}

	// Respond to preflight requests quickly without invoking Express
	if (req.method === 'OPTIONS') {
		res.status(204).end();
		return;
	}

	// Otherwise pass through to the Express app
	return new Promise((resolve) => {
		server.emit('request', req, res);
		res.on('finish', resolve);
	});
}
