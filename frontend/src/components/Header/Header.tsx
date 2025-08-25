'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLayout } from '@/providers/LayoutProvider';
import { ProfileDropdown } from './';
import { profileDropdownItems } from './data';
import whiteLogo from '@/assets/images/cooperdash_white.png';
import blackLogo from '@/assets/images/cooperdash_black.png';

export const Header: React.FC = () => {
  const { toggleTheme, layoutData } = useLayout();
  const [mounted, setMounted] = useState<boolean>(false);
  const headerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      if (headerRef.current) {
        if (window.scrollY > 50) {
          headerRef.current.classList.add('scrolled');
        } else {
          headerRef.current.classList.remove('scrolled');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!mounted) {
    return (
      <header ref={headerRef} className="main-header navbar navbar-expand-lg navbar-light fixed-top shadow-sm" >
        <div className="container-fluid">
          <Link className="navbar-brand" href="/">
            <div style={{ width: 100, height: 50 }} />
          </Link>
        </div>
      </header>
    );
  }

  return (
    <header ref={headerRef} className="main-header navbar navbar-expand-lg navbar-light fixed-top shadow-sm" >
      <div className="container-fluid">
        <Link className="navbar-brand" href="/">
          <Image
            src={layoutData.theme === 'dark' ? whiteLogo : blackLogo}
            alt="Logo do Projeto"
            className="w-auto"
            height={50}
            width={100}
            priority
          />
        </Link>

        <div className="d-flex align-items-center">
          <button
            className="btn border-0 text-decoration-none"
            onClick={toggleTheme}
            aria-label={layoutData.theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'}
          >
            <i
              className={`bi ${
                layoutData.theme === 'dark' ? 'bi-moon' : 'bi-sun'
              }`}
              style={{ fontSize: '1.25rem' }}
            />
          </button>

          <div className="vr my-1 mx-2" />

          <ProfileDropdown items={profileDropdownItems} />
        </div>
      </div>
    </header>
  );
};