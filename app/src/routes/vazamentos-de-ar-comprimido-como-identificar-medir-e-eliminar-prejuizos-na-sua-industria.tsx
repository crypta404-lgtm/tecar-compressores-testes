import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/vazamentos-de-ar-comprimido-como-identificar-medir-e-eliminar-prejuizos-na-sua-industria")({
  beforeLoad: () => {
    throw redirect({ to: "/", statusCode: 301 });
  },
});
