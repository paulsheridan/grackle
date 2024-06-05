import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { SingleDatepicker } from "chakra-dayzed-datepicker";

export const Route = createFileRoute("/booking/$username/schedule")({
  component: Schedule,
});

function Schedule() {
  const [date, setDate] = useState(new Date());

  return (
    <SingleDatepicker name="date-input" date={date} onDateChange={setDate} />
  );
}
