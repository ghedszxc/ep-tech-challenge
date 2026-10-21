import { io } from "next/cache";
import Calendar from "@/components/calendar";

export default async function CalendarSSR() {
  await io();

  return <Calendar initialDate={new Date()} />;
}
