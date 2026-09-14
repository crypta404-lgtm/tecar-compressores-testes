import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/a-empresa")({
  beforeLoad: () => {
    throw redirect({ to: "/empresa", statusCode: 301 });
  },
});
