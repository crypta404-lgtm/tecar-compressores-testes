export type TariffReference={id:string;label:string;value:number;tusd:number;te:number;note:string};
export type CompressorReference={id:string;family:string;model:string;hp:number;nominalKw?:number;pressurePsi:number;flowCfm:number;flowM3Min?:number;packageKw?:number;noLoadKw?:number;specificKw100Cfm?:number;sourceLabel:string;sourceUrl:string;energyVerified:boolean};

export const TECH_SOURCES={
  copel:{label:'Copel • Tarifas vigentes',url:'https://www.copel.com/site/copel-distribuicao/tarifas-de-energia-eletrica/'},
  aneel:{label:'ANEEL • Tarifas homologadas por distribuidora',url:'https://dadosabertos.aneel.gov.br/dataset/5a583f3e-1646-4f67-bf0f-69db4203e89e/resource/fcf2906c-7c32-4b9b-a637-054e7a5234f4/download/tarifas-homologadas-distribuidoras-energia-eletrica.csv'},
  doe:{label:'U.S. DOE • Improving Compressed Air System Performance',url:'https://www.energy.gov/sites/default/files/2014/05/f16/compressed_air_sourcebook.pdf'},
  nist:{label:'NIST • Guide to SI conversion factors',url:'https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors/nist-guide-si-appendix-b9'},
  irCagi:{label:'Ingersoll Rand • CAGI Data Sheets',url:'https://www.ingersollrand.com/en-us/resources/cagi-data-sheets/'},
  irUp6s:{label:'Ingersoll Rand • UP6S 20–30 HP',url:'https://www.ingersollrand.com/en-us/products/air-compressors/oil-flooded-rotary-air-compressors/up6s-20-30-hp/'},
  irRs37:{label:'Ingersoll Rand • R-Series 30–37 kW',url:'https://www.ingersollrand.com/pt-br/air-compressor/oil-flooded-ac/ng-r-series-30-37-vsd-hrm'},
  irR90:{label:'Ingersoll Rand • R90ix 90 kW',url:'https://www.ingersollrand.com/pt-br/products/air-compressors/oil-flooded-rotary-air-compressors/r-series-90-kw-125-hp/'},
  irRs90:{label:'Ingersoll Rand • Next Gen RS 90–160 kW',url:'https://www.ingersollrand.com/en-us/products/air-compressors/oil-flooded-rotary-air-compressors/ng-rs-90-160-kw/'},
};

// ANEEL Tarifa de Aplicação, COPEL-DIS, A4, vigência 24/06/2026–23/06/2027.
// Valores abaixo são somente parcela de energia TE+TUSD em R$/kWh, convertidos de R$/MWh.
// Não incluem demanda, tributos, bandeiras nem outros itens da fatura.
export const COPEL_A4_TARIFFS:TariffReference[]=[
 {id:'a4-offpeak',label:'A4 • fora ponta',value:0.44234,tusd:146.59,te:295.75,note:'Azul/Verde: TE + TUSD de energia fora ponta'},
 {id:'a4-blue-peak',label:'A4 Azul • ponta',value:0.62214,tusd:146.59,te:475.55,note:'Modalidade Azul, posto ponta'},
 {id:'a4-green-peak',label:'A4 Verde • ponta',value:1.93894,tusd:1463.39,te:475.55,note:'Modalidade Verde, posto ponta'},
];

export const CAGI_UP6S:CompressorReference[]=[
 {id:'up6s-20-125',family:'UP6S',model:'UP6S-20-125',hp:20,nominalKw:15,pressurePsi:125,flowCfm:78,flowM3Min:2.21,packageKw:16.67,noLoadKw:6.4,specificKw100Cfm:21.37,energyVerified:true,sourceLabel:'Ingersoll Rand CAGI Data Sheet • 06/03/2025',sourceUrl:'https://azure-na-assets.contentstack.com/v3/assets/blta3c1d56420975795/blt35e16090feaaab0e/68714e19d3d795e3856f00ac/cagi_data_sheet_up6s_20-125.pdf'},
 {id:'up6s-20-150',family:'UP6S',model:'UP6S-20-150',hp:20,nominalKw:15,pressurePsi:150,flowCfm:72,flowM3Min:2.04,packageKw:17.14,noLoadKw:5.9,specificKw100Cfm:23.81,energyVerified:true,sourceLabel:'Ingersoll Rand CAGI Data Sheet • 06/03/2025',sourceUrl:'https://azure-na-assets.contentstack.com/v3/assets/blta3c1d56420975795/blt1e47fc38f3602efc/68714e19850cef72b7bdeac9/cagi_data_sheet_up6s_20-150.pdf'},
 {id:'up6s-25-125',family:'UP6S',model:'UP6S-25-125',hp:25,nominalKw:18,pressurePsi:125,flowCfm:98,flowM3Min:2.78,packageKw:22.02,noLoadKw:8.5,specificKw100Cfm:22.47,energyVerified:true,sourceLabel:'Ingersoll Rand CAGI Data Sheet • 06/03/2025',sourceUrl:'https://azure-na-assets.contentstack.com/v3/assets/blta3c1d56420975795/blt48dcbe1386d30cfd/68714e19b22c5625868656b9/cagi_data_sheet_up6s_25-125.pdf'},
 {id:'up6s-25-150',family:'UP6S',model:'UP6S-25-150',hp:25,nominalKw:18,pressurePsi:150,flowCfm:91,flowM3Min:2.58,packageKw:21.64,noLoadKw:7.7,specificKw100Cfm:23.78,energyVerified:true,sourceLabel:'Ingersoll Rand CAGI Data Sheet • 06/03/2025',sourceUrl:'https://azure-na-assets.contentstack.com/v3/assets/blta3c1d56420975795/blt23b8618f1effb72c/68714e19e864f36dc648b48e/cagi_data_sheet_up6s_25-150.pdf'},
 {id:'up6s-30-125',family:'UP6S',model:'UP6S-30-125',hp:30,nominalKw:22,pressurePsi:125,flowCfm:116,flowM3Min:3.28,packageKw:26.16,noLoadKw:10.1,specificKw100Cfm:22.55,energyVerified:true,sourceLabel:'Ingersoll Rand CAGI Data Sheet • 28/02/2025',sourceUrl:'https://azure-na-assets.contentstack.com/v3/assets/blta3c1d56420975795/blt7c813913269c2f53/68714e193feb757d697b1959/cagi_data_sheet_up6s_30-125.pdf'},
 {id:'up6s-30-150',family:'UP6S',model:'UP6S-30-150',hp:30,nominalKw:22,pressurePsi:150,flowCfm:107,flowM3Min:3.03,packageKw:26.28,noLoadKw:9.2,specificKw100Cfm:24.56,energyVerified:true,sourceLabel:'Ingersoll Rand CAGI Data Sheet • 04/03/2025',sourceUrl:'https://azure-na-assets.contentstack.com/v3/assets/blta3c1d56420975795/blt36443b0955134046/68714e19850cef3366bdeac5/cagi_data_sheet_up6s_30-150.pdf'},
];

export const VERIFIED_MODELS:CompressorReference[]=[
 {id:'up6-5-125',family:'UP6',model:'UP6-5-125',hp:5,pressurePsi:125,flowCfm:14.9,energyVerified:false,sourceLabel:'Ingersoll Rand Shop • especificação oficial',sourceUrl:'https://shop.ingersollrand.com/en-us/products/rotary-screw-compressor-up6-5-125-230-1-60-max-125-psi-120-gal-tank-mounted-18002923'},
 ...CAGI_UP6S,
 {id:'rs30ne',family:'Next Gen R-Series',model:'RS30ne',hp:40,nominalKw:30,pressurePsi:145,flowCfm:200,flowM3Min:5.7,energyVerified:false,sourceLabel:'Ingersoll Rand • página oficial 30–37 kW',sourceUrl:TECH_SOURCES.irRs37.url},
 {id:'rs37ne',family:'Next Gen R-Series',model:'RS37ne',hp:50,nominalKw:37,pressurePsi:145,flowCfm:253,flowM3Min:7.2,energyVerified:false,sourceLabel:'Ingersoll Rand • página oficial 30–37 kW',sourceUrl:TECH_SOURCES.irRs37.url},
 {id:'r90ix-a125',family:'R90ix Brasil',model:'R90ix-A125',hp:125,nominalKw:90,pressurePsi:125,flowCfm:514,flowM3Min:14.6,energyVerified:false,sourceLabel:'Ingersoll Rand • página oficial R90ix Brasil',sourceUrl:TECH_SOURCES.irR90.url},
 {id:'rs90i-a125',family:'Next Gen RS',model:'RS90I-A125',hp:125,nominalKw:93,pressurePsi:125,flowCfm:634,flowM3Min:18.0,energyVerified:false,sourceLabel:'Ingersoll Rand • página oficial RS 90–160 kW',sourceUrl:TECH_SOURCES.irRs90.url},
 {id:'rs110i-a125',family:'Next Gen RS',model:'RS110I-A125',hp:150,nominalKw:112,pressurePsi:125,flowCfm:735,flowM3Min:20.8,energyVerified:false,sourceLabel:'Ingersoll Rand • página oficial RS 90–160 kW',sourceUrl:TECH_SOURCES.irRs90.url},
];

export const HP_ROWS=[5,7.5,10,15,20,25,30,40,50,60,75,100,125,150,200].map(hp=>({hp,kw:hp*0.7456999}));
