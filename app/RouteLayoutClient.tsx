"use client";

import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import Providers from "@/utils/providers";
import InstallPrompt from "@/components/InstallPrompt";
import PWAStatus from "@/components/PWAStatus";

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Providers>
        <PWAStatus />
        {children}
        <InstallPrompt />
      </Providers>
    </QueryClientProvider>
  );
}
