import { useRef, useState } from "react";
import { Maximize2 } from "lucide-react";

/*
 * Instituto Luiz Gonzaga photos as an edge-to-edge mosaic: every tile is
 * cropped to fill (object-fit: cover), no letterboxing. The first photo is
 * the large tile. Clicking opens the full, uncropped photo in a dialog.
 */
const photos = [
 {src:"acao-pascoa.jpeg",alt:"Equipe da TecAr e famílias reunidas em uma ação de Páscoa",caption:"Páscoa com a comunidade",width:1600,height:1321,focus:"50% 60%"},
 {src:"agosto-lilas.jpeg",alt:"Equipe da TecAr com doações e material da campanha Agosto Lilás",caption:"Mobilização no Agosto Lilás",width:1200,height:1600,focus:"50% 45%"},
 {src:"cuidado-idosos.jpeg",alt:"Registro de uma ação de cuidado e convivência com idosos",caption:"Cuidado e presença junto aos idosos",width:576,height:1024,focus:"50% 30%"},
 {src:"encontro-solidario.jpeg",alt:"Participantes em um encontro solidário de Páscoa",caption:"Encontros que aproximam",width:1200,height:1600,focus:"50% 35%"},
 {src:"comunidade.jpeg",alt:"Representante da TecAr com uma família durante a entrega de presentes de Páscoa",caption:"Solidariedade de perto",width:1200,height:1600,focus:"50% 40%"},
];
export function CommunityGallery(){
 const dialog=useRef<HTMLDialogElement>(null);
 const [selected,setSelected]=useState(0);
 const photo=photos[selected];
 return <><div className="ab-mosaic">{photos.map((p,i)=><figure key={p.src}><button type="button" onClick={()=>{setSelected(i);dialog.current?.showModal()}} aria-label={`Ampliar: ${p.caption}`}><img src={`/assets/community/${p.src}`} alt={p.alt} width={p.width} height={p.height} loading="lazy" style={{objectPosition:p.focus}}/><Maximize2 aria-hidden="true" size={16}/></button><figcaption>{p.caption}</figcaption></figure>)}</div>
 <dialog className="tc-community-dialog" ref={dialog} aria-label="Fotografias das ações sociais" onClick={e=>{if(e.target===e.currentTarget)dialog.current?.close()}}><button className="tc-gallery-close" type="button" onClick={()=>dialog.current?.close()} aria-label="Fechar fotografia">Fechar ×</button><img src={`/assets/community/${photo.src}`} alt={photo.alt}/><div className="tc-gallery-controls"><button type="button" onClick={()=>setSelected((selected+photos.length-1)%photos.length)} aria-label="Fotografia anterior">←</button><p aria-live="polite">{selected+1} / {photos.length} · {photo.caption}</p><button type="button" onClick={()=>setSelected((selected+1)%photos.length)} aria-label="Próxima fotografia">→</button></div></dialog></>;
}
