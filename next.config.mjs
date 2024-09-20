/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    env: {
        UPLOADTHING_SECRET: process.env.UPLOADTHING_SECRET,
    },
    typescript: {
      // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
     // ignoreBuildErrors: true, // Добавьте эту строку для игнорирования ошибок TypeScript
    },
};

export default nextConfig;
