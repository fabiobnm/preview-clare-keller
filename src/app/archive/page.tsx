import Menu from '@/components/Menu/MenuServer';
import { hygraph } from '@/lib/hygraph';
import { INFO_PAGE_QUERY, type Info } from '@/lib/queries/info';



export default async function Page() {
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
      <main >
       <Menu/>
       <div  className='animationOpacity' style={{position:'absolute', top:'400px', display:'flex'}}>
        <div style={{ position:'fixed', left:0, right:0, paddingLeft:0 , width:'100vW', textAlign:'center', whiteSpace:'nowrap',fontSize:'12px'}}>
           COMING SOON <br />
           want you to be notified?  <br />
           <a className='subscribeArchive' href="/subscribe">Subscribe →</a>
</div>

    
      </div>

      </main>
     
    </div>
  );
}