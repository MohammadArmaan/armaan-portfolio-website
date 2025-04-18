/** @type {import('next').NextConfig} */
const allowedDomain = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname;
const nextConfig = {
    images: {
      domains: [allowedDomain],
    },
  };

export default nextConfig;
