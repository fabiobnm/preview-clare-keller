import Menu from '@/components/Menu/MenuServer';
import { hygraph } from '@/lib/hygraph';
import MenuHeightVar from '@/components/Utils/MenuHeightVar';
import ReactMarkdown from 'react-markdown';
import Footer from '@/components/Footer/Footer';
import {
  INFO_PAGE_QUERY,
  type Info,
  type ExternalLink,
} from '@/lib/queries/info';

export const dynamic='force-static';
export const revalidate= 0;

export default async function Page() {
  // ATTENZIONE: INFO_PAGE_QUERY deve avere gli alias:
  // linksList: links { ... }  e  linksList2: link2 { ... }
  const { infos } = await hygraph.request<{ infos: Info[] }>(INFO_PAGE_QUERY);
  const info = infos?.[0];

  if (!info) {
    return (
      <main style={{ padding: '2rem' }}>
        <h1>Nessun contenuto &quot;Info&quot; trovato</h1>
        <p>Pubblica un record o controlla gli API ID (model/campi).</p>
      </main>
    );
  }



  return (
    <div>
      <Menu />
        <MenuHeightVar /> {/* imposta --menu-h in base a #menuTotale */}
           <style>{`
   
    `}</style>
      <main className="infoContent">
        <div className="blockInfo animationOpacity">
          <div className="textInfo">
            <div dangerouslySetInnerHTML={{ __html: info.infoText?.html ?? "Nessun contenuto AboutUs trovato." }}/>

            
          </div>
          <div className="textAbout">
            <p>ABOUT</p>
            <div style={{marginTop:'30px'}} dangerouslySetInnerHTML={{ __html: info.about?.html ?? "Nessun contenuto AboutUs trovato." }}/>
          </div>

        </div>
        <div style={{marginTop:'100px'}}>
          <Footer />
        </div>
        
      </main>
    </div>
  );
}
