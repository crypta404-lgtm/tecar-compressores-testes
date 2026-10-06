import type { ScrollScrubScene, ScrollScrubTheme } from "@/components/scroll-scrub/scroll-scrub";

export const scrollScrubTheme: ScrollScrubTheme = {
  accent: "#D71920",
  background: "#33373B",
  ink: "#F7F6F3",
  muted: "#9DA2A6",
};

export const scrollScrubScenes: ScrollScrubScene[] = [
  {
    body: "Venda, locação, manutenção, engenharia e monitoramento conectados à operação da sua indústria.",
    clip: "/assets/world/scene-01.mp4",
    id: "scene-01",
    kicker: "TecAr Compressores",
    label: "Operação",
    mobileClip: "/assets/world/scene-01-mobile.mp4",
    mobilePoster: "/assets/world/scene-01-mobile-poster.png",
    poster: "/assets/world/scene-01-poster.png",
    tags: ["Curitiba", "Paranaguá", "Desde 1999"],
    title: "Ar comprimido sob controle.",
  },
];
