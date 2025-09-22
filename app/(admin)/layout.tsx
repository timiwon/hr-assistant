import React from 'react';

import DBClientProvider from "@/providers/DBClientProvider";

export default function Layout({ children }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <DBClientProvider>
      <main>{children}</main>
    </DBClientProvider>
  )
}
