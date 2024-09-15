/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    env: {
        UPLOADTHING_SECRET: process.env.UPLOADTHING_SECRET,
      },
};

export default nextConfig;
