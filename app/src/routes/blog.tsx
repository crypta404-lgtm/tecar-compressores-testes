import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/blog")({
  beforeLoad: () => {
    throw redirect({ to: "/conteudo", statusCode: 301 });
  },
});
