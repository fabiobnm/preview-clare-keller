'use client';

import { useEffect } from 'react';

export default function InfoSequentialScroll() {
  useEffect(() => {
    const block = document.getElementById('blockInfo');
    const textInfo = document.getElementById('textInfo');

    if (!block || !textInfo) return;

    const isDesktop = () => window.innerWidth > 900;

    const blockIsActive = () => {
      const rect = block.getBoundingClientRect();
      const menuHRaw = getComputedStyle(document.documentElement)
        .getPropertyValue('--menu-h')
        .trim();
      const menuH = parseFloat(menuHRaw || '0') || 0;

      const visibleTopLimit = menuH;
      const visibleBottomLimit = window.innerHeight;

      return rect.top <= visibleBottomLimit && rect.bottom > visibleTopLimit;
    };

    const canScrollInfoDown = () => {
      return textInfo.scrollTop + textInfo.clientHeight < textInfo.scrollHeight - 1;
    };

    const canScrollInfoUp = () => {
      return textInfo.scrollTop > 0;
    };

   const onWheel = (e: WheelEvent) => {
  if (!isDesktop()) return;
  if (!blockIsActive()) return;

  const atBottom =
    textInfo.scrollTop + textInfo.clientHeight >= textInfo.scrollHeight - 1;

  const atTop = textInfo.scrollTop <= 0;

  if (e.deltaY > 0) {
    // scroll down
    if (!atBottom) {
      e.preventDefault();
      textInfo.scrollTop += e.deltaY;
    }
    // 👇 QUI: se è finito, NON bloccare più → entra textAbout
  } else if (e.deltaY < 0) {
    // scroll up
    if (!atTop) {
      e.preventDefault();
      textInfo.scrollTop += e.deltaY;
    }
  }
};

    window.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      window.removeEventListener('wheel', onWheel);
    };
  }, []);

  return null;
}