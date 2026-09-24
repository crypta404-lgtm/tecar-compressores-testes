import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/blog-list")({
  beforeLoad: () => {
    throw redirect({ to: "/", statusCode: 301 });
  },
});
