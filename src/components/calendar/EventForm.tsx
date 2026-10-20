"use client";

import React, { useState, useEffect } from "react";
import { TEvent } from "./Calendar.types";
import { useEventStore } from "@/providers/EventStoreProvider";

interface EventFormProps {
  selectedDate: string;
  activeEvent: TEvent | null; // Null = Add Mode, Object = Edit Mode
  onClose: () => void;
}

export default function EventForm({ selectedDate, activeEvent, onClose }: EventFormProps) {
  const { addEvent, updateEvent, deleteEvent } = useEventStore();

  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [type, setType] = useState("");

  useEffect(() => {
    if (activeEvent) {
      setTitle(activeEvent.title);
      setStartTime(activeEvent.startTime);
      setEndTime(activeEvent.endTime);
      setType(activeEvent.type || "");
    } else {
      setTitle("");
      setStartTime("09:00");
      setEndTime("10:00");
      setType("");
    }
  }, [activeEvent, selectedDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const eventData: TEvent = {
      id: activeEvent?.id || crypto.randomUUID(),
      title,
      date: selectedDate,
      startTime,
      endTime,
      type,
    };

    if (activeEvent) {
      updateEvent(eventData);
    } else {
      addEvent(eventData);
    }
    onClose();
  };

  const handleDelete = () => {
    if (activeEvent) {
      deleteEvent(activeEvent.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 border border-gray-100">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          {activeEvent ? "Edit Event" : `Add Event`}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700">Title</label>
            <input
              type="text"
              className="w-full mt-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-black"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full mt-1 p-2 border border-gray-300 rounded text-black bg-white outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Member">Meeting</option>
              <option value="Admin">Event</option>
              <option value="Guest">Adhoc</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700">Start Time</label>
              <input
                type="time"
                className="w-full mt-1 p-2 border border-gray-300 rounded text-black"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">End Time</label>
              <input
                type="time"
                className="w-full mt-1 p-2 border border-gray-300 rounded text-black"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <div>
              {activeEvent && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded transition"
                >
                  Delete
                </button>
              )}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition"
              >
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}