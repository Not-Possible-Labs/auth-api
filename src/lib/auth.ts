import { betterAuth } from '../deps.ts';
import { prisma } from '../../prisma/client.ts';

export const auth = betterAuth({
    secret: Deno.env.get('BETTER_AUTH_SECRET') || '',
    baseUrl: Deno.env.get('BETTER_AUTH_URL') || 'http://localhost:8000',
    database: {
        type: 'prisma',
        prisma,
        provider: 'postgresql'
    },
    providers: {
        credentials: {
            type: 'credentials',
            authorize: (_credentials: { email?: string; password?: string }) => {
                // Add your credentials validation logic here
                return Promise.resolve(null);
            },
        },
    },
});