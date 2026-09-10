import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet, createRootRouteWithContext, useRouter, HeadContent, Scripts } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import appCss from "../styles.css?url";
import { reportHiggsfieldError } from "../lib/higgsfield-error-reporting";
import appMetaJson from "../app-meta.json";

declare const __HF_DESIGN_INSPECTOR__: boolean;
type AppMeta = { og_title?: string|null; og_description?: string|null; og_image_url?: string|null; favicon_url?: string|null; og_video_url?: string|null; marketplace_cover_url?: string|null };
const appMeta = appMetaJson as AppMeta;

function buildHead(meta: AppMeta) {
  const title = meta.og_title ?? "TecAr Compressores";
  const description = meta.og_description ?? "Compressores de ar, manutencao, locacao, engenharia e monitoramento para a industria.";
  return {
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title },
      { name: "description", content: description },
      { name: "author", content: "TecAr Compressores" },
      { name: "theme-color", content: "#07131D" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://tecar-compressores-lab.higgsfield.app/" },
      ...(meta.og_image_url ? [
        { property: "og:image", content: meta.og_image_url },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: meta.og_image_url },
      ] : [{ name: "twitter:card", content: "summary" }]),
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon-32.png", sizes: "32x32" },
      { rel: "icon", href: "/favicon-16.png", sizes: "16x16" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
      { rel: "manifest", href: "/site.webmanifest" },
    ],
  };
}

function NotFoundComponent() {
  return <main className="systemPage"><img src="/assets/tecar/logo.gif" alt="TecAr Compressores"/><h1>404</h1><p>Esta pagina nao foi encontrada.</p><a href="/">Voltar ao inicio</a></main>;
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  useEffect(() => { reportHiggsfieldError(error, { boundary: "root_error" }); }, [error]);
  return <main className="systemPage"><img src="/assets/tecar/logo.gif" alt="TecAr Compressores"/><h1>Algo nao carregou</h1><p>Tente novamente ou volte para a pagina inicial.</p><div><button onClick={() => { router.invalidate(); reset(); }}>Tentar novamente</button><a href="/">Inicio</a></div></main>;
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => buildHead(appMeta),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return <html lang="pt-BR" style={{ colorScheme: "dark" }}><head><HeadContent /></head><body className="tecarBody">{children}<Scripts /></body></html>;
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  useEffect(() => {
    if (!__HF_DESIGN_INSPECTOR__) return;
    void import("../module/design-inspector/runtime")
      .then(({ installHiggsfieldDesignInspector }) => installHiggsfieldDesignInspector())
      .catch((error) => reportHiggsfieldError(error instanceof Error ? error : new Error("Design inspector failed"), { boundary: "design_inspector" }));
  }, []);
  return <QueryClientProvider client={queryClient}><Outlet /></QueryClientProvider>;
}
