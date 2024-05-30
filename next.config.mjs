/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: "/nextjs-github-pages",
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/rooms',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
