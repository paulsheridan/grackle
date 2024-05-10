import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/landing")({
  component: Landing,
});

function Landing() {
  return <div></div>;
}
