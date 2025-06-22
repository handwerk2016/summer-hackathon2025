import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { getToken } from './api';

export function useRequireAuth() {
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push('/auth');
    }
  }, [router]);

  return getToken() !== null;
} 