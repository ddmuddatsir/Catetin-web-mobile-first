"use client";

import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import Providers from "@/utils/providers";

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Providers>{children}</Providers>
    </QueryClientProvider>
  );
}
