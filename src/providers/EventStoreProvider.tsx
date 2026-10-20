import { create } from "zustand";
import { persist } from "zustand/middleware";
import { TEvent } from "@/components/calendar/Calendar.types";

interface EventState {
  events: TEvent[];
  addEvent: (event: TEvent) => void;
  updateEvent: (updatedEvent: TEvent) => void;
  deleteEvent: (id: string) => void;
}

export const useEventStore = create<EventState>()(
  persist(
    (set) => ({
      events: [],
      addEvent: (event) =>
        set((state) => ({ events: [...state.events, event] })),
      updateEvent: (updatedEvent) =>
        set((state) => ({
          events: state.events.map((e) =>
            e?.id === updatedEvent?.id ? updatedEvent : e
          ),
        })),
      deleteEvent: (id) =>
        set((state) => ({
          events: state.events.filter((e) => e?.id !== id),
        })),
    }),
    {
      name: "calendar-events-storage", // Automatically persists events in localStorage
    }
  )
);