import Menu from '@/components/Menu/MenuServer';
import { hygraph } from '@/lib/hygraph';
import { WORK_PAGE_QUERY, type Work, type Link, type LinkUnion } from '@/lib/queries/work';
import Footer from '@/components/Footer/Footer';
import WorksList from "@/components/WorksList/WorksList";



export const dynamic='force-static';
export const revalidate= 0;




export default async function Page() {
  
  const { works } = await hygraph.request<{ works: Work[] }>(WORK_PAGE_QUERY);
  const work = works?.[0];

  if (!work) {
    return (
      <main style={{ padding: '2rem' }}>
        <h1>Nessun contenuto &quot;Info&quot; trovato</h1>
        <p>Pubblica un record o controlla gli API ID (model/campi).</p>
      </main>
    );
  }


  return (
  <div>
      <Menu/>
      <main style={{marginTop:'275px', minHeight: 'calc(99vH - 275px)'}} className="mx-auto max-w-5xl px-4 py-8 opacityAnim">
        <WorksList works={works} />
      </main>
      <Footer />
    </div>
  );
}
