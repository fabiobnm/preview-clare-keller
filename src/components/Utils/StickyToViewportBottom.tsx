'use client';

import { useEffect } from 'react';

type StickyToViewportBottomProps = {
  selector: string;
  minTopVar?: string;
};

export default function StickyToViewportBottom({
  selector,
  minTopVar,
}: StickyToViewportBottomProps) {
  useEffect(() => {

    console.log('eccolo')
    const element = document.querySelector<HTMLElement>(selector);
    if (!element) return;

    const getCssVarNumber = (name?: string) => {
      if (!name) return 0;
      const raw = getComputedStyle(document.documentElement)
        .getPropertyValue(name)
        .trim();
      const parsed = parseFloat(raw);
      return Number.isNaN(parsed) ? 0 : parsed;
    };

    const update = () => {
      if (window.innerWidth <= 900) {
        element.style.position = 'static';
        element.style.top = 'auto';
        return;
      }

      const minTop = getCssVarNumber(minTopVar);
      const viewportHeight = window.innerHeight;
      const elementHeight = element.offsetHeight;

      const desiredTop = viewportHeight - elementHeight;
      const finalTop = Math.max(minTop, desiredTop);

      element.style.position = 'sticky';
      element.style.top = `${finalTop}px`;
    };

    update();

    const resizeObserver = new ResizeObserver(() => {
      update();
    });
   
    resizeObserver.observe(element);

    window.addEventListener('resize', update);
    window.addEventListener('load', update);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', update);
      window.removeEventListener('load', update);
    };
  }, [selector, minTopVar]);

  return null;
}