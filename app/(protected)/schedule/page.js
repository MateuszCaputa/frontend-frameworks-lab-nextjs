"use client";
import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import { useAuth } from "@/app/lib/AuthContext";
import { WEEK_DAYS, TIME_SLOTS } from "@/app/data/mockData";

/**
 * (Lab 6 Topic 2) & (Lab 9, Task 5)
 * Protected Schedule Page.
 * Fetches events from Firestore 'events' collection for the current user.
 * Renders the weekly grid.
 */
export default function SchedulePage() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // (Lab 9, Task 5) Fetch data from Firestore
  useEffect(() => {
    if (!user) return;

    const fetchEvents = async () => {
      try {
        const q = query(
          collection(db, "events"),
          where("userId", "==", user.uid)
        );

        const querySnapshot = await getDocs(q);
        const eventsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        console.log("Fetched events:", eventsData);
        setEvents(eventsData);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-indigo-600">
        Ładowanie planu zajęć...
      </div>
    );
  }

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
      <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center bg-gray-50">
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            Rozkład Tygodniowy
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Twoje zajęcia pobrane z bazy Firestore.
          </p>
        </div>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm">
          Dodaj Zajęcie
        </button>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Header Row */}
          <div className="grid grid-cols-8 border-b border-gray-200 bg-gray-100">
            <div className="p-4 text-center font-bold text-gray-600 border-r border-gray-200">
              Godzina
            </div>
            {WEEK_DAYS.map((day) => (
              <div
                key={day}
                className="p-4 text-center font-bold text-gray-700 border-r border-gray-200 last:border-r-0"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Time Slots */}
          {TIME_SLOTS.map((hour) => (
            <div
              key={hour}
              className="grid grid-cols-8 border-b border-gray-100 h-24"
            >
              {/* Hour Column */}
              <div className="p-2 text-center text-sm font-medium text-gray-500 border-r border-gray-200 bg-gray-50 flex items-center justify-center">
                {hour}:00
              </div>

              {/* Days Columns */}
              {WEEK_DAYS.map((day) => (
                <div
                  key={`${day}-${hour}`}
                  className="relative border-r border-gray-100 last:border-r-0 hover:bg-indigo-50 transition-colors cursor-pointer group"
                >
                  {/* Plus icon on hover */}
                  <span className="hidden group-hover:flex absolute inset-0 items-center justify-center text-indigo-300 text-3xl font-light">
                    +
                  </span>

                  {/* Map events to slots */}
                  {events
                    .filter((e) => e.day === day && e.hour === hour)
                    .map((e) => (
                      <div
                        key={e.id}
                        className="absolute inset-1 bg-indigo-100 text-indigo-800 text-xs p-1 rounded border border-indigo-200 overflow-hidden"
                      >
                        {e.title}
                      </div>
                    ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
