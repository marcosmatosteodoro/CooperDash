'use client'

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { LoadingSpinner } from '@/components';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push('/cooperados');
  }, [router]);

  return <LoadingSpinner />;
}