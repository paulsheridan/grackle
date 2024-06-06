import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/booking/$username/services/$serviceId/")(
  {
    component: ScheduleService,
  },
);

function ScheduleService() {
  return <div>Hello /booking/$username/$serviceId/!</div>;
}
