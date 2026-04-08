'use client';

import { useEffect } from 'react';

export default function ScrollLockInfo() {
  useEffect(() => {
    const info = document.getElementById('textInfo');
    if (!info) return;

    let locked = true;

    const onWheel = (e: WheelEvent) => {
      if (!locked) return;

      const atBottom =
        info.scrollTop + info.clientHeight >= info.scrollHeight;

      if (!atBottom) {
        e.preventDefault();
        info.classList.add('active-scroll');
        info.scrollTop += e.deltaY;
      } else {
        locked = false;
        info.classList.remove('active-scroll');
      }
    };

    window.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      window.removeEventListener('wheel', onWheel);
    };
  }, []);

  return null;
}