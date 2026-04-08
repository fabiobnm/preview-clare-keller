/* eslint-disable @next/next/no-img-element */
'use client';

import { useEffect, useMemo, useState } from 'react';
import styles from './IntroScroll.module.css';

export type IntroImage = { id?: string | null; url: string; alt?: string };

type Props = {
  images: IntroImage[];          // minimo 3 consigliato
  introDelayMs?: number;         // default 600ms (quando entrano i lati)
  revealDelayMs?: number;        // default 1800ms (quando diventa scroll)
  itemHeight?: number;           // altezza immagini nel carousel (px) default 420
};

export default function IntroScrollGallery({
  images,
  introDelayMs = 600,
  revealDelayMs = 1800,
  itemHeight = 420,
}: Props) {
  const [showSides, setShowSides] = useState(false);
  const [reveal, setReveal] = useState(false);

  // scegli immagine centrale e split per i lati
  const { center, left, right } = useMemo(() => {
    const list = images ?? [];
    if (list.length <= 1) {
      return { center: list[0], left: [] as IntroImage[], right: [] as IntroImage[] };
    }
    const c = list[0];
    const rest = list.slice(1);
    const half = Math.ceil(rest.length / 2);
    return { center: c, left: rest.slice(0, half), right: rest.slice(half) };
  }, [images]);

  useEffect(() => {
    // fase 1: entrano i lati
    const t1 = setTimeout(() => setShowSides(true), introDelayMs);
    // fase 2: reveal a carousel scrollabile
    const t2 = setTimeout(() => setReveal(true), revealDelayMs);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [introDelayMs, revealDelayMs]);

  if (!images?.length) return null;

  return (
    <div className={styles.wrapper} style={{ ['--itemH' as any]: `${itemHeight}px` }}>
      {!reveal ? (
        // FASE INTRO
        <div className={styles.introStage} aria-live="polite">
          {/* immagine centrale */}
          {center && (
            <div className={styles.center}>
              <img
                src={center.url}
                alt={center.alt ?? 'center'}
                width={Math.round(itemHeight * 0.75)}
                height={Math.round(itemHeight * 0.75)}
                loading="eager"
              />
            </div>
          )}

          {/* gruppo sinistro */}
          {left.length > 0 && (
            <div className={`${styles.side} ${styles.left} ${showSides ? styles.in : ''}`} aria-hidden={!showSides}>
              {left.map((img, i) => (
                <div className={styles.thumb} key={`L-${img.id ?? img.url}-${i}`}>
                  <img
                    src={img.url}
                    alt={img.alt ?? `left ${i + 1}`}
                    width={Math.round(itemHeight * 0.6)}
                    height={Math.round(itemHeight * 0.6)}
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          )}

          {/* gruppo destro */}
          {right.length > 0 && (
            <div className={`${styles.side} ${styles.right} ${showSides ? styles.in : ''}`} aria-hidden={!showSides}>
              {right.map((img, i) => (
                <div className={styles.thumb} key={`R-${img.id ?? img.url}-${i}`}>
                  <img
                    src={img.url}
                    alt={img.alt ?? `right ${i + 1}`}
                    width={Math.round(itemHeight * 0.6)}
                    height={Math.round(itemHeight * 0.6)}
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        // FASE CAROUSEL SCROLLABILE
        <div className={styles.carouselViewport} aria-label="Galleria immagini orizzontale">
          <div className={styles.carouselTrack}>
            {/* sequenza completa (puoi duplicare per loop manuale) */}
            {images.map((img, i) => (
              <div className={styles.item} key={img.id ?? `${img.url}-${i}`}>
                <img
                  src={img.url}
                  alt={img.alt ?? `image ${i + 1}`}
                  width={Math.round(itemHeight * 0.75)}
                  height={itemHeight}
                  loading="lazy"
                />
              </div>
            ))}
            {/* duplicato per effetto di continuità quando scorri a fine */}
            {images.map((img, i) => (
              <div className={styles.item} key={`dup-${img.id ?? `${img.url}-${i}`}`}>
                <img
                  src={img.url}
                  alt={img.alt ?? `image duplicate ${i + 1}`}
                  width={Math.round(itemHeight * 0.75)}
                  height={itemHeight}
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
