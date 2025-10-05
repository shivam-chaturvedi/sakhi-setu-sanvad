import { useEffect, useRef } from 'react';

export const useLocomotiveScroll = () => {
  const scrollRef = useRef<any>(null);

  useEffect(() => {
    // Disable locomotive scroll for now to avoid conflicts
    // Can be re-enabled later with proper React 18 compatibility
    return () => {
      if (scrollRef.current) {
        scrollRef.current.destroy?.();
      }
    };
  }, []);

  return scrollRef.current;
};

export default useLocomotiveScroll;