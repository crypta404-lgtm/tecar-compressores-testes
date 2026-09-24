import { createFileRoute } from "@tanstack/react-router";

const ROUTES = ["/", "/empresa", "/produtos", "/compressores", "/secadores", "/linhas-de-ar", "/acessorios", "/safety-air", "/servicos", "/diagnostico", "/manutencao", "/engenharia", "/locacao", "/tecar-connect", "/trabalhe-conosco"];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const origin = new URL(request.url).origin;
        const today = new Date().toISOString().split("T")[0];
        const urls = ROUTES.map((path, i) => [
          "  <url>",
          `    <loc>${origin}${path === "/" ? "" : path}</loc>`,
          `    <lastmod>${today}</lastmod>`,
          `    <changefreq>${i === 0 ? "weekly" : "monthly"}</changefreq>`,
          `    <priority>${i === 0 ? "1.0" : "0.8"}</priority>`,
          "  </url>",
        ].join("\n")).join("\n");
        const xml = ['<?xml version="1.0" encoding="UTF-8"?>','<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',urls,'</urlset>'].join("\n");
        return new Response(xml,{headers:{"Content-Type":"application/xml; charset=utf-8","Cache-Control":"public, max-age=3600"}});
      },
    },
  },
});
