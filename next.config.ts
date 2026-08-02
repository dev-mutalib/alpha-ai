import type { NextConfig } from 'next';
import './lib/env.mjs';

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ['127.0.0.1'],
};

export default nextConfig;
