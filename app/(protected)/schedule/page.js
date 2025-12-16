"use client";
import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import { useAuth } from "@/app/lib/AuthContext";
import { WEEK_DAYS, TIME_SLOTS } from "@/app/data/mockData";
import EventModal from "@/app/components/schedule/EventModal";

/**
 * (Lab 6, Topic 2) & (Lab 9, Task 5)
 * Protected Schedule Page.
 * Renders the weekly schedule grid and handles CRUD operations for events via Firestore.
 * Features collision detection and variable duration rendering.
 */
export default function SchedulePage() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  /**
   * Fetches events for the current user from Firestore.
   */
  const fetchEvents = async () => {
    if (!user) return;
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
      setEvents(eventsData);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [user]);

  /**
   * Checks collision for top (first 30min) and bottom (last 30min) of an hour slot.
   */
  const getSlotStatus = (day, hour) => {
    const isTopOccupied = hasCollision(day, hour, 0.5);
    const isBottomOccupied = hasCollision(day, hour + 0.5, 0.5);

    return { isTopOccupied, isBottomOccupied };
  };

  const handleSlotClick = (day, hour, isTopOccupied) => {
    // If top is occupied, suggest starting at the half-hour mark
    const startHour = isTopOccupied ? hour + 0.5 : hour;

    setSelectedSlot({ day, hour: startHour });
    setSelectedEvent(null);
    setIsModalOpen(true);
  };

  const handleEventClick = (e, event) => {
    e.stopPropagation();
    setSelectedEvent(event);
    setSelectedSlot({ day: event.day, hour: event.hour });
    setIsModalOpen(true);
  };

  /**
   * Validates if a proposed event overlaps with existing ones.
   */
  const hasCollision = (day, startHour, duration, currentEventId = null) => {
    const endHour = startHour + duration;

    return events.some((event) => {
      if (currentEventId && event.id === currentEventId) return false;
      if (event.day !== day) return false;

      const eventStart = parseFloat(event.hour);
      const eventEnd = eventStart + parseFloat(event.duration || 1);

      return startHour < eventEnd && endHour > eventStart;
    });
  };

  const handleSave = async (formData) => {
    if (!user) return;

    const day = selectedEvent ? selectedEvent.day : selectedSlot.day;
    const hour = selectedEvent ? selectedEvent.hour : selectedSlot.hour;
    const duration = formData.duration || 1.5;

    if (hasCollision(day, hour, duration, selectedEvent?.id)) {
      throw new Error(
        `W tym czasie (${day}, ${hour}:00) masz już inne zajęcia! Zmień czas lub usuń kolizję.`
      );
    }

    try {
      if (selectedEvent) {
        const eventRef = doc(db, "events", selectedEvent.id);
        await updateDoc(eventRef, {
          ...formData,
          day: selectedEvent.day,
          hour: selectedEvent.hour,
        });
      } else {
        await addDoc(collection(db, "events"), {
          userId: user.uid,
          day: selectedSlot.day,
          hour: selectedSlot.hour,
          ...formData,
        });
      }

      setIsModalOpen(false);
      fetchEvents();
    } catch (error) {
      console.error("Error saving event:", error);
      throw new Error("Wystąpił błąd bazy danych podczas zapisywania.");
    }
  };

  const handleDelete = async (eventId) => {
    if (!confirm("Czy na pewno chcesz usunąć te zajęcia?")) return;

    try {
      await deleteDoc(doc(db, "events", eventId));
      setIsModalOpen(false);
      fetchEvents();
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("Nie udało się usunąć zajęć.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-indigo-600">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mr-3"></div>
        Ładowanie planu...
      </div>
    );
  }

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
      {isModalOpen && (
        <EventModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          onDelete={handleDelete}
          initialData={selectedEvent ? selectedEvent : selectedSlot}
        />
      )}

      <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center bg-gray-50">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Twój Plan Zajęć</h2>
          <p className="mt-1 text-sm text-gray-500">
            Kliknij w kratkę, aby dodać zajęcia.
          </p>
        </div>
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
              <div className="p-2 text-center text-sm font-medium text-gray-500 border-r border-gray-200 bg-gray-50 flex items-center justify-center">
                {hour}:00
              </div>

              {WEEK_DAYS.map((day) => {
                const { isTopOccupied, isBottomOccupied } = getSlotStatus(
                  day,
                  hour
                );
                const isFullyOccupied = isTopOccupied && isBottomOccupied;

                const slotEvents = events.filter(
                  (e) => e.day === day && Math.floor(e.hour) === hour
                );

                return (
                  <div
                    key={`${day}-${hour}`}
                    className="relative border-r border-gray-100 last:border-r-0 p-1"
                    style={{ overflow: "visible" }}
                  >
                    {!isFullyOccupied && (
                      <div
                        onClick={() =>
                          handleSlotClick(day, hour, isTopOccupied)
                        }
                        className={`absolute left-0 right-0 z-0 transition-colors cursor-pointer group hover:bg-indigo-50 flex items-center justify-center
                          ${
                            isTopOccupied
                              ? "bottom-0 top-1/2"
                              : isBottomOccupied
                              ? "top-0 bottom-1/2"
                              : "inset-0"
                          }
                        `}
                      >
                        <span className="hidden group-hover:block text-indigo-200 text-3xl font-light">
                          +
                        </span>
                      </div>
                    )}

                    {slotEvents.map((e) => {
                      const duration = e.duration || 1;
                      const eventStartOffset = (e.hour % 1) * 100;
                      const endTime = e.hour + duration;

                      const endHourDisplay = Math.floor(endTime);
                      const endMinDisplay = endTime % 1 === 0 ? "00" : "30";
                      const startMinDisplay = e.hour % 1 === 0 ? "00" : "30";

                      return (
                        <div
                          key={e.id}
                          onClick={(ev) => handleEventClick(ev, e)}
                          style={{
                            top: `${eventStartOffset}%`,
                            height: `calc(${duration * 100}% - 4px)`,
                            marginTop: "2px",
                            zIndex: 10,
                          }}
                          className={`
                            absolute left-1 right-1
                            p-2 rounded border shadow-sm text-xs cursor-pointer hover:shadow-md transition-all flex flex-col justify-start overflow-hidden
                            ${
                              e.type === "lecture"
                                ? "bg-blue-100 border-blue-200 text-blue-800 hover:bg-blue-200 hover:-translate-y-0.5"
                                : e.type === "lab"
                                ? "bg-green-100 border-green-200 text-green-800 hover:bg-green-200 hover:-translate-y-0.5"
                                : "bg-yellow-100 border-yellow-200 text-yellow-800 hover:bg-yellow-200 hover:-translate-y-0.5"
                            }
                          `}
                        >
                          <strong className="block truncate">{e.title}</strong>
                          <span className="block truncate opacity-75">
                            {Math.floor(e.hour)}:{startMinDisplay} -{" "}
                            {endHourDisplay}:{endMinDisplay}
                          </span>
                          {e.room && (
                            <span className="block truncate opacity-75">
                              {e.room}
                            </span>
                          )}
                          {e.instructor && (
                            <span className="block truncate opacity-75">
                              {e.instructor}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
