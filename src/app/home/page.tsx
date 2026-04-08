import Menu from '@/components/Menu/MenuServer';
import { hygraph } from '@/lib/hygraph';
import { HOME_PAGES_QUERY, type HomePage } from '@/lib/queries/home';
import BouncingImagesPage from "@/components/BouncingImage";
import InfiniteCarousel from "@/components/InfiniteCarousel";
import IntroScroll from '@/components/IntroScroll';
import CenteredImages from '@/components/CenteredImg';
import ScatterStrip from '@/components/Scatter';
import ZoomRow from '@/components/Zoom';
import styles from './page.module.css';








export default async function Page() {
  const { homePages } = await hygraph.request<{ homePages: HomePage[] }>(HOME_PAGES_QUERY);
  const home = homePages?.[0];

    // 3. Costruisci l'array images che passi al componente
  const images =
    home?.images?.slice(0, 10).map((img) => ({
      id: img.id,
      url: img.url,
    })) ?? [];


  if (!home) {
    return (
      <main style={{ padding: '2rem' }}>
        <h1>Nessun contenuto &quot;Homepage&quot; trovato</h1>
        <p>Pubblica un record o controlla gli API ID (model/campi).</p>
      </main>
    );
  }

  const imgs = home.images ?? [];

  return (
    <div >
      <main >
    

        <Menu />

        {/* Barra fissa in basso con link + carousel */}
          <div className="socials">
            <a style={{ marginRight: '10px' }} href={home.instagram}>INSTAGRAM</a>
            <a style={{ marginRight: '10px' }} href={home.youtube}>YOUTUBE</a>
            <a style={{ marginRight: '10px' }} href={home.threads}>THREADS</a>
            <a style={{ marginRight: '10px' }} href={home.x}>X</a>
            <p className="copy">{home.copyright}</p>
          </div>

   

      
          {imgs.length ? (
            <div className="frame"  id='frame' aria-label="Galleria immagini">
              <div className="row" id='row'>
                {imgs.map((img, i) => (
                    <img
                      key={img.id ?? `${img.url}-${i}`}
                      src={img.url}
                      className={styles.ciao}
                      alt={`Image ${i + 1}`}
                      loading="lazy"
                    />
                ))}
                {imgs.map((img, i) => (
                    <img
                      key={`dup-${img.id ?? `${img.url}-${i}`}`}
                      src={img.url}
                      className={styles.ciao}
                      alt={`Image duplicate ${i + 1}`}
                      loading="lazy"
                    />
                ))}
                   {imgs.map((img, i) => (
                    <img
                      key={`dup-${img.id ?? `${img.url}-${i}`}`}
                      src={img.url}
                      className={styles.ciao}
                      alt={`Image duplicate ${i + 1}`}
                      loading="lazy"
                    />
                ))}
              </div>
            </div>
          ) : null}
          
         



      </main>
    </div>
  );
}
