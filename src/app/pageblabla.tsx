import Menu from '@/components/Menu/MenuServer';
import { hygraph } from '@/lib/hygraph';
import ReactMarkdown from 'react-markdown';
import { SUBSCRIBE_PAGE_QUERY, type Subscribe } from '@/lib/queries/subscribe';
import NewsletterForm from '@/components/NewsletterForm/NewsletterForm';
import Footer from '@/components/Footer/Footer';
import SubscribeToggle from "@/components/SubscribeToggle/SubscribeToggle";



export const dynamic='force-static';
export const revalidate= 0;




export default async function Page() {
  const { subscribes } = await hygraph.request<{ subscribes: Subscribe[] }>(SUBSCRIBE_PAGE_QUERY);
  const subscribe = subscribes?.[0];

  if (!subscribe) {
    return (
      <main style={{ padding: '2rem' }}>
        <h1>Nessun contenuto &quot;Info&quot; trovato</h1>
        <p>Pubblica un record o controlla gli API ID (model/campi).</p>
      </main>
    );
  }


  return (
    <div style={{ color:'#e6f5ff'}}>
      <main >

       <div className='animationOpacity mainSubscribeDiv'  style={{display:'block'}}>

        <img className='logoXSubIndex' src="/logoBabyBlue.svg" alt="" />

       <SubscribeToggle markdown={subscribe.text?.markdown ?? ""} />

      </div>
      <div className='footerSubs slide-in-topSUBSCRIBE'>
        <Footer />
      </div>

      </main>
    </div>
  );
}
