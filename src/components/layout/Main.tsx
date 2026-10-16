'use client';

import { usePathname } from 'next/navigation';

type MainProps = {
  children: React.ReactNode;
};

export default function Main({ children }: MainProps) {
  const pathname = usePathname();
  const isGrayBackground = pathname?.startsWith('/favorites');

  return <main className={`grow overflow-x-clip ${isGrayBackground ? 'bg-gray-50' : ''}`}>{children}</main>;
}
