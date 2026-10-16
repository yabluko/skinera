// components/Navigation.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ServicesDropdown from './ServicesDropdown';

const Navigation = ({ isMobile, onNavigate }: { isMobile?: boolean; onNavigate?: () => void }) => {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  const navItems = [
    { path: '/products', label: 'Товари' },
    { path: '/contacts', label: 'Контакти' },
  ];

  return (
    <nav
      className={`${isMobile ? 'flex flex-col gap-4' : 'hidden md:flex items-center gap-1 lg:gap-3'}`}
    >
      <ServicesDropdown isMobile={isMobile} onNavigate={onNavigate} />
      {navItems.map(({ path, label }) => (
        <Link
          key={path}
          href={path}
          className={`py-2 px-4 rounded-full text-[13.5px] font-medium transition-colors ${
            isActive(path)
              ? 'text-skin-ink bg-skin-pink-soft font-semibold'
              : 'text-skin-ink/80 hover:text-skin-ink'
          }`}
          onClick={() => isMobile && onNavigate?.()}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
};

export default Navigation;
