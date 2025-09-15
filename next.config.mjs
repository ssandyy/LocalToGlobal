import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirnameResolved = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
    images:{
        unoptimized: true
    },
    webpack: (config) => {
        // Ensure '@' alias works in all environments (Vercel included)
        config.resolve.alias = {
            ...(config.resolve.alias || {}),
            '@': __dirnameResolved,
        };
        return config;
    }
};

export default nextConfig;
