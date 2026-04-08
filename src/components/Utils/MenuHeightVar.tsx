// src/components/Utils/MenuHeightVar.tsx
'use client';

import { useEffect } from 'react';

export default function MenuHeightVar({ targetId = 'menuTotale' }: { targetId?: string }) {
  useEffect(() => {
    const el = document.getElementById(targetId);
    if (!el) return;

    const setVar = () => {
      const h = el.getBoundingClientRect().height;
      document.documentElement.style.setProperty('--menu-h', `${h}px`);
    };

    setVar(); // iniziale
    const ro = new ResizeObserver(setVar);
    ro.observe(el);
    window.addEventListener('resize', setVar);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', setVar);
    };
  }, [targetId]);

  return null;
}
