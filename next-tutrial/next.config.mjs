/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['raw.githubusercontent.com'],
  },
  async redirects() {
    return [
      {
        // リダイレクトが発生するパス
        source: '/about',
        // リダイレクト先のパス
        destination: '/',
        // リダイレクトが永続的ならtrue（リダイレクトを永久にキャッシュされる）
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
