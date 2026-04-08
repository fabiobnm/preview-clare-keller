/* eslint-disable @next/next/no-img-element */
'use client';

import { useEffect, useRef } from 'react';

export type ZoomImg = { id?: string | null; url: string; alt?: string };

export default function ZoomRow({
  images,
  autoStartDelayMs = 2000, // quanto aspettare prima di “zoomare”
  smallHeight = 120,
  bigHeight = 420,
}: {
  images: ZoomImg[];
  autoStartDelayMs?: number;
  smallHeight?: number;
  bigHeight?: number;
}) {
  const rowRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);

  const toggleZoom = () => {
    const row = rowRef.current;
    const frame = frameRef.current;
    if (!row || !frame) return;
    const isZoomingIn = !row.classList.contains('zoomed');
    row.classList.toggle('zoomed', isZoomingIn);
    frame.classList.toggle('zoomed', isZoomingIn);
  };

  useEffect(() => {
    const t = setTimeout(() => {
      const row = rowRef.current;
      if (row && !row.classList.contains('zoomed')) toggleZoom();
    }, 3000);
    return () => clearTimeout(t);
  }, [autoStartDelayMs]);

  return (
    <div className="frame" ref={frameRef}>
      <div className="row" ref={rowRef}>
        {images.map((im, i) => (
          <img key={im.id ?? `${im.url}-${i}`} src={im.url} alt={im.alt ?? `image ${i + 1}`} />
        ))}
      </div>

      <style jsx>{`
        .frame {
          width: 100vw;
          overflow: visible;
          background: transparent;
          border-radius: 0;
          border: none;
          transition: background .3s ease, border .3s ease, border-radius .3s ease;
        }
        .frame.zoomed {
          overflow: hidden;
          border-radius: 16px;
        }
        .row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 2400px;                   /* “sparso” iniziale */
          padding: 12px;
          overflow-x: visible;
          overscroll-behavior-x: auto;
          animation: inlineGap .6s ease-out .2s forwards;
        }
        @keyframes inlineGap { to { gap: 24px; } }

        .row.zoomed {
          overflow-x: auto;
          gap: 48px;
          padding: 24px;
        }
        .row::-webkit-scrollbar { display: none; }

        .row img {
          flex: 0 0 auto;
          height: ${smallHeight}px;      /* small */
          object-fit: cover;
          transition: height .4s ease, margin .4s ease;
          user-select: none;
          -webkit-user-drag: none;
        }
        .row.zoomed img {
          height: ${bigHeight}px;        /* zoomed */
        }
      `}</style>
    </div>
  );
}
