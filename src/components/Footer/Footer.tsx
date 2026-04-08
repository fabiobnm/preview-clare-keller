// src/components/Menu/MenuServer.tsx
import { hygraph } from '@/lib/hygraph';
import { HOME_PAGES_QUERY, type HomePage } from '@/lib/queries/home';


type MenuProps = {
  page?: string;
  itemBasis?: string;
  className?: string;
};

export default async function MenuServer({ page = 'default', itemBasis = '16.66%', className }: MenuProps) {
  const { homePages } = await hygraph.request<{ homePages: HomePage[] }>(HOME_PAGES_QUERY);
  const home = homePages?.[0] || null;

    const logoUrl = home?.logoDesktop?.url ?? undefined;
  
  return (
    <div>
 {/* <img className='logoFooter' src={logoUrl}  /> */}
  <div className='footerLink' style={{ position:'relative',paddingInline:15, fontSize:'.7em'}}>
       <a style={{marginRight:'10px'}} href={home.instagram}  target="_blank"
  rel="noopener noreferrer">INSTAGRAM</a>
       <a style={{marginRight:'10px', display:'none'}} href={home.youtube}  target="_blank"
  rel="noopener noreferrer">YOUTUBE</a> {/* display none */}
   

        <a style={{position:'absolute', right:'15px', opacity:'1'}}>©{new Date().getFullYear()} Clare Waight Keller</a>
        </div>
        </div>
  );
}
