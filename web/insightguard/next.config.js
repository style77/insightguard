/** @type {import('next').NextConfig} */

const nextConfig = {
    reactStrictMode: true,
    compiler: {
        styledComponents: true,
    },

    env: {
        API_URL: 'https://api.insightguard.tech',
    }
}

const withTM = require('next-transpile-modules')(["react-icons"]);

module.exports = withTM(nextConfig);
