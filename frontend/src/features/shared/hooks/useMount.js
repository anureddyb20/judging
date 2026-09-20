import { useEffect } from 'react';

export function useMount(callback) {
  useEffect(() => {
    callback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}