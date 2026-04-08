/* eslint-disable @next/next/no-img-element */
'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';
import styles from './CenteredImg.module.css';

export type CenterImg = { id?: string | null; url: string; alt?: string };

type Props = {
  images: CenterImg[];
  centerIndex?: number;     // default 7
  gap?: number;             // px
  baseHeight?: number;      // px
  scaleCenter?: number;     // fattore scala
  smooth?: boolean;         // scroll smooth quando ricentri
  centerAfterMs?: number;   // delay extra per attendere animazioni CSS
};

export default function CenteredImages({
  images,
  centerIndex = 7,
  gap = 12,
  baseHeight = 320,
  scaleCenter = 1,
  smooth = false,
  centerAfterMs = 1200,
}: Props) {
  const stripRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const roRef = useRef<ResizeObserver | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const clampIndex = (i: number) => {
    const max = Math.max(0, (images?.length ?? 1) - 1);
    return Math.min(Math.max(0, i), max);
  };

  const withSnapOff = (fn: () => void) => {
    const strip = stripRef.current;
    if (!strip) return;
    strip.classList.add(styles.noSnap);
    try { fn(); }
    finally {
      requestAnimationFrame(() => strip.classList.remove(styles.noSnap));
    }
  };

  const centerToIndex = (rawIndex: number) => {
    const strip = stripRef.current;
    if (!strip) return;

    const idx = clampIndex(rawIndex);
    const items = strip.querySelectorAll<HTMLDivElement>('[data-item]');
    const el = items[idx];
    if (!el) return;

    const targetLeft = el.offsetLeft + el.offsetWidth / 2 - strip.clientWidth / 2;
    const left = Math.max(0, targetLeft);

    withSnapOff(() => {
      // HTMLDivElement ha sempre scrollTo: niente ramo else, niente never
      strip.scrollTo({ left, top: 0, behavior: smooth ? 'smooth' : 'auto' });
    });
  };

  const scheduleCenter = (idx: number, delay = 0) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      rafRef.current = requestAnimationFrame(() => centerToIndex(idx));
    }, delay) as unknown as number;
  };

  useLayoutEffect(() => {
    if (!images?.length) return;
    scheduleCenter(centerIndex, centerAfterMs);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      rafRef.current = null;
      timeoutRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images.length]);

  useEffect(() => {
    scheduleCenter(centerIndex, centerAfterMs);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      rafRef.current = null;
      timeoutRef.current = null;
    };
  }, [centerIndex, centerAfterMs]);

  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;
    const imgs = Array.from(strip.querySelectorAll<HTMLImageElement>('img'));
    if (!imgs.length) return;

    let remaining = imgs.length;
    const done = () => {
      remaining -= 1;
      if (remaining <= 0) scheduleCenter(centerIndex, centerAfterMs);
    };

    imgs.forEach((im) => {
      if (im.complete) done();
      else {
        im.addEventListener('load', done, { once: true });
        im.addEventListener('error', done, { once: true });
      }
    });

    return () => {
      imgs.forEach((im) => {
        im.removeEventListener('load', done);
        im.removeEventListener('error', done);
      });
    };
  }, [images, centerIndex, centerAfterMs]);

  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;

    roRef.current?.disconnect();
    const ro = new ResizeObserver(() => scheduleCenter(centerIndex, 0));
    ro.observe(strip);
    roRef.current = ro;

    const onWinResize = () => scheduleCenter(centerIndex, 0);
    window.addEventListener('resize', onWinResize);

    return () => {
      ro.disconnect();
      roRef.current = null;
      window.removeEventListener('resize', onWinResize);
    };
  }, [centerIndex]);

  if (!images?.length) return null;

  return (
    <div
      ref={stripRef}
      className={styles.strip}
      style={{
        ['--gap' as any]: `${gap}px`,
        ['--h' as any]: `${baseHeight}px`,
        ['--scaleC' as any]: scaleCenter,
      }}
      aria-label="Galleria orizzontale con immagine centrale"
    >
      {images.map((img, i) => {
        const idx = clampIndex(centerIndex);
        const cls =
          i === idx ? styles.center : i < idx ? styles.leftShift : styles.rightShift;

        return (
          <div
            key={img.id ?? `${img.url}-${i}`}
            data-item
            className={`${styles.item} ${cls}`}
          >
            <img
              src={img.url}
              alt={img.alt ?? `image ${i + 1}`}
              loading="lazy"
              draggable={false}
            />
          </div>
        );
      })}
    </div>
  );
}
