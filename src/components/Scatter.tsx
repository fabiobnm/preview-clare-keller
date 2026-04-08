/* eslint-disable @next/next/no-img-element */
'use client';

import { useEffect, useMemo, useState } from 'react';
import styles from './Scatter.module.css';

export type ScatterImage = { id?: string | null; url: string; alt?: string };

export default function ScatterStrip({
  images,
  itemHeight = 320,     // altezza finale in strip
  gap = 12,              // gap tra card
  scatterRange = 40,     // % della viewport per la dispersione iniziale
  enterDelayMs = 1500,   // ritardo prima di allinearsi
  animMs = 700,          // durata animazione verso la strip
}: {
  images: ScatterImage[];
  itemHeight?: number;
  gap?: number;
  scatterRange?: number;     // 0..50 consigliato
  enterDelayMs?: number;
  animMs?: number;
}) {
  const [arranged, setArranged] = useState(false);

  // offset random per ogni immagine, stabili per l'intero mount
  const seeds = useMemo(() => {
    const r = (min: number, max: number) => Math.random() * (max - min) + min;
    return images.map(() => ({
      // percentuali relative alla viewport; poi convertite in px via CSS
      tx: r(-scatterRange, scatterRange), // in vw
      ty: r(-scatterRange * 0.6, scatterRange * 0.6), // in vh (meno verticale, più leggibile)
      rot: r(-18, 18), // gradi
      scale: r(0.85, 1.1),
    }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images.length, scatterRange]);

  useEffect(() => {
    const t = setTimeout(() => setArranged(true), enterDelayMs);
    return () => clearTimeout(t);
  }, [enterDelayMs]);

  if (!images?.length) return null;

  return (
    <div
      className={[
        styles.wrapper,
        arranged ? styles.arranged : styles.scattered,
      ].join(' ')}
      style={
        {
          ['--gap' as any]: `${gap}px`,
          ['--itemH' as any]: `${itemHeight}px`,
          ['--animMs' as any]: `${animMs}ms`,
        } as React.CSSProperties
      }
      aria-label="Galleria: da sparsa a striscia orizzontale"
    >
      <div className={styles.track}>
        {images.map((img, i) => {
          const seed = seeds[i];
          return (
            <div
              key={img.id ?? `${img.url}-${i}`}
              className={styles.item}
              style={
                arranged
                  ? undefined
                  : ({
                      ['--txvw' as any]: `${seed.tx}vw`,
                      ['--tyvh' as any]: `${seed.ty}vh`,
                      ['--rot' as any]: `${seed.rot}deg`,
                      ['--scale' as any]: seed.scale,
                    } as React.CSSProperties)
              }
            >
              <img
                src={img.url}
                alt={img.alt ?? `image ${i + 1}`}
                loading="eager"
                draggable={false}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
