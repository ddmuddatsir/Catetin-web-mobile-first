declare module "next-pwa" {
  import { NextConfig } from "next";

  interface PWAConfig {
    dest?: string;
    register?: boolean;
    skipWaiting?: boolean;
    disable?: boolean;
    sw?: string;
    publicExcludes?: string[];
    buildExcludes?: string[];
    fallbacks?: {
      image?: string;
      audio?: string;
      video?: string;
      font?: string;
      document?: string;
    };
    cacheOnFrontEndNav?: boolean;
    reloadOnOnline?: boolean;
    swcMinify?: boolean;
    extendDefaultRuntimeCaching?: boolean;
    workboxOptions?: Record<string, unknown>;
  }

  function withPWA(config: PWAConfig): (nextConfig: NextConfig) => NextConfig;

  export = withPWA;
}
