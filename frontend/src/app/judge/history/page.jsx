'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function JudgeHistoryRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/judge/dashboard');
  }, [router]);

  return null;
}
