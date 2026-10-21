"use client";

import React, { useState, useEffect } from "react";
import { TEvent } from "./Calendar.types";
import { useEventStore } from "@/providers/EventStoreProvider";
import EventForm from "./EventForm";

interface CalendarProps {
  initialDate: Date;
}

export default function Calendar({ initialDate }: CalendarProps) {
  const storeEvents = useEventStore((state) => state.events);
  
  // Hydration handling for Zustand's localstorage persistence in Next.js SSR
  const [isHydrated, setIsHydrated] = useState(false);
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const [currentDate, setCurrentDate] = useState(initialDate);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDateStr, setSelectedDateStr] = useState("");
  const [activeEvent, setActiveEvent] = useState<TEvent | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Grid math logic 
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const openAddModal = (dateStr: string) => {
    setSelectedDateStr(dateStr);
    setActiveEvent(null);
    setIsModalOpen(true);
  };

  const openEditModal = (e: React.MouseEvent, event: TEvent) => {
    e.stopPropagation(); // Stops calendar cell from opening "Add Event" modal
    setSelectedDateStr(event.date ?? "");
    setActiveEvent(event);
    setIsModalOpen(true);
  };

  const calendarCells = [];

  // empty days for the first week of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarCells.push(<div key={i} className="bg-gray-800 border border-gray-700 min-h-[120px]" />);
  }

  // active days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const dayStr = String(day).padStart(2, "0");
    const monthStr = String(month + 1).padStart(2, "0");
    const dateKey = `${year}-${monthStr}-${dayStr}`;

    // Filter events pulling exclusively through zustand state selector
    const dayEvents = isHydrated
      ? storeEvents
          .filter((e) => e?.date === dateKey)
          .sort((a, b) => a?.startTime.localeCompare(b?.startTime))
      : [];

    calendarCells.push(
      <div
        key={dateKey}
        onClick={() => openAddModal(dateKey)}
        className="bg-gray-800 border border-gray-700 min-h-[120px] p-2 hover:bg-blue-50/20 cursor-pointer transition flex flex-col justify-between group"
      >
        <div className="flex justify-between items-center">
          <span className="font-semibold text-gray-300">{day}</span>
          <span className="opacity-0 group-hover:opacity-100 text-xs text-blue-600 font-bold transition">
            + Add Event
          </span>
        </div>

        <div className="mt-1 space-y-1 overflow-y-auto flex-grow max-h-[84px]">
          {dayEvents.map((event) => (
            <div
              key={event.id}
              onClick={(e) => openEditModal(e, event)}
              className="bg-blue-600 text-white text-[11px] px-2 py-0.5 rounded truncate shadow-sm hover:bg-blue-700 transition"
              title={`${event.startTime} - ${event.title}`}
            >
              <span className="font-medium mr-1">{event.startTime}</span>
              {event.title}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto">
      <div className="flex justify-between items-center p-6">
        <h1 className="text-2xl font-bold">
          {monthNames[month]} {year}
        </h1>
        <div className="flex gap-2">
          <button onClick={handlePrevMonth} className="px-4 py-2 cursor-pointer border border-gray-300 rounded-lg hover:bg-gray-700 text-gray-300 font-medium transition">
            Prev
          </button>
          <button onClick={handleNextMonth} className="px-4 py-2 cursor-pointer border border-gray-300 rounded-lg hover:bg-gray-700 text-gray-300 font-medium transition">
            Next
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 text-center font-bold text-gray-500 bg-gray-800 py-3 text-sm">
        {dayNames.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 bg-gray-800 gap-[1px]">
        {calendarCells}
      </div>

      {isModalOpen && (
        <EventForm
          selectedDate={selectedDateStr}
          activeEvent={activeEvent}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}