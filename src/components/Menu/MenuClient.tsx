// src/components/Menu/MenuClient.tsx
'use client';

import { useEffect, useState, useRef, MouseEvent, useLayoutEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import styles from './Menu.module.css';
import { log } from 'console';

type Home = {
  logoDesktop?: { url?: string | null } | null;
  logoMobile?: { url?: string | null } | null;
} | null;

type MenuClientProps = {
  page?: string;
  itemBasis?: string;
  className?: string;
  home: Home;
};

export default function MenuClient({
  page = 'default',
  itemBasis = '16.66%',
  className,
  home,
}: MenuClientProps) {
  const [enter, setEnter] = useState(false);
  const [exit, setExit] = useState(false);
  const [nudgeUp, setNudgeUp] = useState(false); // ← scroll nudge
  const router = useRouter();
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [menuHeight, setMenuHeight] = useState<number>(0);

  // memorizza l'ultima posizione scroll per capire la direzione
  const lastYRef = useRef(0);


  useLayoutEffect(() => {
  if (!menuRef.current) return;

  const measure = () => {
    setMenuHeight(menuRef.current!.offsetHeight);
    console.log('height'+menuRef.current!.offsetHeight);
    
  };

  measure();

  // ricalcola su resize (fondamentale)
  window.addEventListener('resize', measure);
  return () => window.removeEventListener('resize', measure);
}, []);



  // Animazione entrata
  useEffect(() => {
    const t = setTimeout(() => setEnter(true), 0);
    return () => clearTimeout(t);
  }, []);

  // Gestione uscita con ritardo
  const handleNav = (href: string) => (e: MouseEvent) => {
    e.preventDefault();
    if (exit) return;              // evita doppio trigger
    if (pathname === href) return; // già sulla pagina: non fare nulla
    setExit(true);
    setTimeout(() => {
      router.push(href);
    }, 0);//L'HO LEVATO 
  };

  const isHome = pathname === '/';
  const logoToShow = isHome ? home?.logoDesktop?.url : home?.logoDesktop?.url;

  // Scroll listener: verso l'alto → nudge -4vh, verso il basso → nudge 0
  useEffect(() => {
    if (typeof window === 'undefined') return;
    lastYRef.current = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastYRef.current;

      // soglia per evitare jitter su micro scroll
      if (Math.abs(delta) > 50) {
        if (delta > 0 && window.scrollY>10) {
          // scroll up
          setNudgeUp(true);
        } else {
          // scroll down
          setNudgeUp(false);
        }
        lastYRef.current = y;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Item nav con stato attivo non cliccabile
  const NavItem = ({ href, children }: { href: string; children: React.ReactNode }) => {
    const active = pathname === href;

    if (active) {
      return (
        <span className={`${styles.navLink} ${styles.active}`} aria-current="page">
          {children}
        </span>
      );
    }

    return (
      <Link href={href} onClick={handleNav(href)} className={styles.navLink}>
        {children}
      </Link>
    );
  };

  return (
    <div
       id='menuTotale'
       ref={menuRef}
        style={
    {
      '--menu-height': `${menuHeight}px`,
    } as React.CSSProperties
  }
      className={[
        styles.menuWrapper,
        enter ? styles.enter : '',
        exit ? styles.exit : '',
        isHome ? styles.isHome : styles.isMobileLogo, // in home: link opacity 1
        className || '',
      ].join(' ')}
    >
      {/* Nudge wrapper: muove TUTTO (logo + voci) di -4vh in scroll up */}
      <div  style={{background:'white',paddingTop: '10px', borderBottom:'0px solid white'}} className={`${styles.nudge} ${nudgeUp ? styles.nudgeUp : ''}`}>
        {logoToShow && (
          isHome ? (
            // In home: logo non cliccabile
            <img style={{cursor:'pointer'}}
              className={`${styles.logo} ${styles.logoDesktop}`}
              src={logoToShow}
              alt="Logo"
              aria-current="page"
            />
          ) : (
            // Pagine interne: logo cliccabile che porta a /
            <img  style={{cursor:'pointer'}}
              className={`${styles.logo} ${styles.logoDesktop}`}
              onClick={handleNav('/')}
              src={logoToShow}
              alt="Logo"
              role="link"
            />
          )
        )}

        <div className={styles.FabioMenu} >
          <div className="divMenu">
            <NavItem href="/info">INFO</NavItem>
          </div>
          <div className="divMenu">
            <NavItem href="https://cwkshop-2.myshopify.com/">SHOP</NavItem>
          </div>
          <div className="divMenu">
            <NavItem href="/work" >WORK</NavItem>
          </div>
          <div className="divMenuRight">
            <NavItem href="/subscribe">SUBSCRIBE</NavItem>
          </div>
        </div>
      </div>
    </div>
  );
}
