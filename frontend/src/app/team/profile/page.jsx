'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function TeamProfileRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/team/dashboard');
  }, [router]);

  return null;
}
