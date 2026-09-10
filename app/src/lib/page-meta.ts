export const SITE_ORIGIN="https://tecar-compressores-lab.higgsfield.app";
export function pageMeta(path:string,title:string,description:string,image="/assets/v2/compressors.jpg"){
  const url=SITE_ORIGIN+(path==="/"?"":path);
  return {
    meta:[
      {title},
      {name:"description",content:description},
      {property:"og:title",content:title},
      {property:"og:description",content:description},
      {property:"og:url",content:url},
      {property:"og:image",content:SITE_ORIGIN+image},
      {name:"twitter:card",content:"summary_large_image"},
      {name:"twitter:title",content:title},
      {name:"twitter:description",content:description},
    ],
    links:[{rel:"canonical",href:url}]
  };
}
