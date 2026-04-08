'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import styles from './InfiniteCarousel.module.css';
export type CarouselImage = { id?: string | null; url: string; alt?: string };

type Props = {
  images: CarouselImage[];
  itemWidth?: number;   // px (default 280)
  itemGap?: number;     // px (default 12)
  itemHeight?: number;  // px (default 360)
  className?: string;
};

export default function InfiniteCarousel({
  images,
  itemWidth = 280,
  itemGap = 12,
  itemHeight = 420,
  className,
}: Props) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [cycleWidth, setCycleWidth] = useState(0);

  // misura la larghezza di UNA “corsa” (un ciclo di immagini)
  const measure = () => {
    const track = trackRef.current;
    if (!track) return;
    const firstCycle = track.querySelector('[data-cycle="1"]') as HTMLDivElement | null;
    if (!firstCycle) return;
    setCycleWidth(firstCycle.offsetWidth);
  };

  // posiziona al centro (inizio della 2ª copia) per permettere scroll dx/sx da subito
  const goToMiddle = () => {
    const vp = viewportRef.current;
    if (!vp || !cycleWidth) return;
    vp.scrollLeft = cycleWidth; // inizio seconda copia
  };

  // dopo mount: misura e centra
  useLayoutEffect(() => {
    measure();
  }, [images, itemWidth, itemGap, itemHeight]);

  useEffect(() => {
    if (!cycleWidth) return;
    goToMiddle();
    const onResize = () => {
      measure();
      // ricalcolo e recentro dopo resize
      requestAnimationFrame(goToMiddle);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cycleWidth]);

  // loop continuo: quando arrivi agli estremi, ricuce lo scrollLeft
  useEffect(() => {
    const vp = viewportRef.current;
    if (!vp || !cycleWidth) return;

    const threshold = 1; // px

    const onScroll = () => {
      const max = cycleWidth * 3; // 3 cicli: [1][2][3]
      const x = vp.scrollLeft;

      // se sei all'inizio del 1° ciclo → salta avanti di 1 ciclo
      if (x <= threshold) {
        vp.scrollLeft = x + cycleWidth;
        return;
      }
      // se stai finendo il 3° ciclo → salta indietro di 1 ciclo
      if (x + vp.clientWidth >= max - threshold) {
        vp.scrollLeft = x - cycleWidth;
        return;
      }
    };

    vp.addEventListener('scroll', onScroll, { passive: true });
    return () => vp.removeEventListener('scroll', onScroll);
  }, [cycleWidth]);

  if (!images?.length) return null;

  // costruiamo 3 copie per ricucire senza stacchi
  const cycles = [1, 2, 3];

  return (
    <div 
      ref={viewportRef}
      className={[styles.viewport, ' appari ', className || ''].join(' ')}      
      style={{ ['--gap' as any]: `${itemGap}px` }}
      aria-label="Galleria immagini (scroll infinito)"
    >
      <div ref={trackRef} className={styles.track}>
        {cycles.map((cycleIdx) => (
          <div key={cycleIdx} className={styles.cycle} data-cycle={cycleIdx}>
            {images.map((img, i) => (
              <div
                key={`${cycleIdx}-${img.id ?? img.url}-${i}`}
                className={styles.item}
               /* style={{  height: itemHeight}}*/
              >
                <img
                  src={img.url}
                  alt={img.alt ?? `Image ${i + 1}`}
                  loading="lazy"
                  draggable={false}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
