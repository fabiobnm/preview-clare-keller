"use client";

import { useEffect, useRef, useState } from "react";

type ImageData = {
  id: string;
  url: string;
};

type Props = {
  images: ImageData[];
};

type Item = {
  el: HTMLImageElement;
  x: number;
  y: number;
  vx: number;
  vy: number;
};

const BASE_IMAGE_SIZE = 260;
const MIN_SPEED = 1.0;
const MAX_SPEED = 3.5;
const GAP = 24;
const STRIP_PADDING = 24;
const TRANSITION_DURATION = 900; // ms

function random(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function randomSpeed() {
  let s = random(MIN_SPEED, MAX_SPEED);
  if (Math.random() < 0.5) s = -s;
  return s;
}

// easing morbido
function easeSmooth(t: number) {
  return t * t * (3 - 2 * t);
}

export default function BouncingImagesPage({ images }: Props) {
  const imgRefs = useRef<(HTMLImageElement | null)[]>([]);
  const itemsRef = useRef<Item[]>([]);
  const rafRef = useRef<number | null>(null);

  // "bounce" = rimbalzo, "transition" = si spostano verso la strip,
  // "strip" = layout orizzontale scrollabile
  const [mode, setMode] = useState<"bounce" | "transition" | "strip">("bounce");

  // -----------------------
  // ANIMAZIONE RIMBALZO
  // -----------------------
  useEffect(() => {
    if (!images || images.length === 0) return;
    if (mode !== "bounce") return;

    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    const w = window.innerWidth;
    const h = window.innerHeight;

    const items: Item[] = images.map((_, index) => {
      const el = imgRefs.current[index];
      if (!el) {
        throw new Error("Image element missing");
      }

      const x = random(0, Math.max(1, w - BASE_IMAGE_SIZE));
      const y = random(0, Math.max(1, h - BASE_IMAGE_SIZE));
      const vx = randomSpeed();
      const vy = randomSpeed();

      el.style.transform = `translate(${x}px, ${y}px)`;

      return { el, x, y, vx, vy };
    });

    itemsRef.current = items;

    const step = () => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      for (const item of itemsRef.current) {
        const { el } = item;

        const imgWidth = el.offsetWidth || BASE_IMAGE_SIZE;
        const imgHeight = el.offsetHeight || BASE_IMAGE_SIZE;

        let { x, y, vx, vy } = item;

        x += vx;
        y += vy;

        // collisione orizzontale
        if (x <= 0) {
          x = 0;
          vx *= -1;
        } else if (x + imgWidth >= viewportWidth) {
          x = viewportWidth - imgWidth;
          vx *= -1;
        }

        // collisione verticale
        if (y <= 0) {
          y = 0;
          vy *= -1;
        } else if (y + imgHeight >= viewportHeight) {
          y = viewportHeight - imgHeight;
          vy *= -1;
        }

        item.x = x;
        item.y = y;
        item.vx = vx;
        item.vy = vy;

        el.style.transform = `translate(${x}px, ${y}px)`;
      }

      if (mode === "bounce") {
        rafRef.current = requestAnimationFrame(step);
      }
    };

    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [images, mode]);

  // -----------------------
  // TRANSIZIONE → STRIP
  // -----------------------
  useEffect(() => {
    if (!images || images.length === 0) return;
    if (mode !== "transition") return;

    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    const items = itemsRef.current;
    if (!items.length) {
      setMode("strip");
      return;
    }

    const viewportHeight = window.innerHeight;

    const sampleEl = items[0].el;
    const imgWidth = sampleEl.offsetWidth || BASE_IMAGE_SIZE;
    const imgHeight = sampleEl.offsetHeight || BASE_IMAGE_SIZE;

    // posizioni iniziali
    const start = items.map((item) => ({
      x: item.x,
      y: item.y,
    }));

    // QUI LA FIX:
    // target X = esattamente dove saranno nella strip:
    // padding sinistro + index * (width + gap)
    const targets = items.map((_, index) => {
      const x = STRIP_PADDING + index * (imgWidth + GAP);
      const y = viewportHeight - imgHeight - STRIP_PADDING;
      return { x, y };
    });

    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      let t = elapsed / TRANSITION_DURATION;
      if (t > 1) t = 1;
      const eased = easeSmooth(t);

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const { el } = item;

        const sx = start[i].x;
        const sy = start[i].y;
        const tx = targets[i].x;
        const ty = targets[i].y;

        const x = sx + (tx - sx) * eased;
        const y = sy + (ty - sy) * eased;

        item.x = x;
        item.y = y;
        item.vx = 0;
        item.vy = 0;

        el.style.transform = `translate(${x}px, ${y}px)`;
      }

      if (t < 1 && mode === "transition") {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        // fine transizione → entriamo in strip mode
        for (const item of itemsRef.current) {
          item.el.style.transform = "none";
        }
        setMode("strip");
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [mode, images.length]);

  // -----------------------
  // NESSUNA IMMAGINE
  // -----------------------
  if (!images || images.length === 0) {
    return (
      <div className="bouncing-root">
        <div className="bouncing-message">
          Nessuna immagine trovata in Hygraph.
        </div>

        <style jsx global>{`
          html,
          body {
            margin: 0;
            padding: 0;
            height: 100%;
            overflow: hidden;
            font-family: system-ui, -apple-system, BlinkMacSystemFont,
              "Segoe UI", sans-serif;
          }

          body {
            min-height: 100vh;
          }

          .bouncing-root {
            position: relative;
            width: 100vw;
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .bouncing-message {
            font-size: 1.2rem;
          }
        `}</style>
      </div>
    );
  }

  // -----------------------
  // CLICK HANDLER
  // -----------------------
  const handleClick = () => {
    if (mode === "bounce") {
      setMode("transition");
    }
  };

  const isStrip = mode === "strip";

  return (
    <div
      className={isStrip ? "strip-root" : "bouncing-root"}
      onClick={handleClick}
    >
      {isStrip ? (
        // STRIP ORIZZONTALE SCROLLABILE
        <div className="strip-track">
          {images.map((img, index) => (
            <img
              key={img.id ?? `${index}`}
              ref={(el) => {
                imgRefs.current[index] = el;
              }}
              src={img.url}
              alt={`immagine ${index + 1}`}
              className="strip-image"
            />
          ))}
        </div>
      ) : (
        // RIMBALZO / TRANSIZIONE
        images.map((img, index) => (
          <img
            key={img.id ?? `${index}`}
            ref={(el) => {
              imgRefs.current[index] = el;
            }}
            src={img.url}
            alt={`immagine ${index + 1}`}
            className="bouncing-image"
          />
        ))
      )}

      <style jsx global>{`
        html,
        body {
          margin: 0;
          padding: 0;
          height: 100%;
          overflow: hidden;
          font-family: system-ui, -apple-system, BlinkMacSystemFont,
            "Segoe UI", sans-serif;
        }

        body {
          min-height: 100vh;
        }

        /* MODALITÀ RIMBALZO / TRANSIZIONE */
        .bouncing-root {
          position: relative;
          width: 100vw;
          height: 100vh;
          overflow: hidden;
          cursor: pointer;
        }

        .bouncing-image {
          position: absolute;
          width: ${BASE_IMAGE_SIZE}px;
          height: ${BASE_IMAGE_SIZE}px;
          object-fit: cover;
          pointer-events: none;
          user-select: none;
        }

        /* MODALITÀ STRIP */
        .strip-root {
          position: relative;
          width: 100vw;
          height: 100vh;
          overflow-x: auto;
          overflow-y: hidden;
          display: flex;
          align-items: flex-end;
          cursor: default;
        }

        .strip-track {
          display: flex;
          gap: ${GAP}px;
          padding: ${STRIP_PADDING}px;
          padding-top: 0;
        }

        .strip-image {
          flex: 0 0 auto;
          width: ${BASE_IMAGE_SIZE}px;
          height: ${BASE_IMAGE_SIZE}px;
          object-fit: cover;
          user-select: none;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}
