/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
      return [
        {
          source: '/',
          destination: '/facility/home',
          permanent: true,
        },
      ]
    },
    
    async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://ste-fem2-internet-app.azurewebsites.net/api/:path*',
      },
    ];
  },
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: '**',
          port: '',
          pathname: '**',
        },
      ]
    },
    typescript: {
      // !! WARN !!
      // Dangerously allow production builds to successfully complete even if
      // your project has type errors.
      // !! WARN !!
      ignoreBuildErrors: true,
    },
    output: 'standalone'	
  }

module.exports = nextConfig