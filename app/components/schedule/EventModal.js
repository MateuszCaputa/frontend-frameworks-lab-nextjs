"use client";
import { useState } from "react";

/**
 * (Lab 6, Topic 2)
 * Modal Component for Creating and Editing Schedule Events.
 * Handles form state, validation, and triggers onSave/onDelete callbacks.
 * FIX: Shows correct start time for half-hour slots and displays warning.
 */
export default function EventModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  initialData,
}) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    type: initialData?.type || "lecture",
    instructor: initialData?.instructor || "",
    room: initialData?.room || "",
    duration: initialData?.duration || 1.5,
  });

  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await onSave(formData);
    } catch (err) {
      setError(err.message);
    }
  };

  const formatTime = (decimalTime) => {
    const hours = Math.floor(decimalTime);
    const minutes = Math.round((decimalTime - hours) * 60);
    return `${hours}:${minutes === 0 ? "00" : minutes}`;
  };

  const startHourNum = parseFloat(initialData?.hour || 0);
  const endHourNum = startHourNum + parseFloat(formData.duration);

  const isHalfHourStart = startHourNum % 1 !== 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-800">
            {initialData?.id ? "Edytuj Zajęcia" : "Dodaj Zajęcia"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-6 mt-4 bg-red-50 border-l-4 border-red-500 text-red-700 p-3 text-sm rounded-r">
            <p className="font-bold">Błąd zapisu</p>
            <p>{error}</p>
          </div>
        )}

        {/* Info / Warning Message */}
        <div className="px-6 pt-4">
          <div className="text-sm text-indigo-600 font-medium bg-indigo-50 p-2 rounded flex items-center gap-2 mb-2">
            <span className="font-bold">{initialData?.day},</span>
            <span>
              {formatTime(startHourNum)} ➝ {formatTime(endHourNum)}
            </span>
            <span className="text-indigo-400 text-xs ml-auto">
              ({formData.duration}h)
            </span>
          </div>

          {/* Żółty Warning o nietypowej godzinie startu */}
          {isHalfHourStart && (
            <div className="text-xs text-amber-700 bg-amber-50 border-l-4 border-amber-400 p-2 rounded-r">
              <strong>Uwaga:</strong> Zajęcia zaczynają się o{" "}
              {formatTime(startHourNum)}, ponieważ wcześniejsza część godziny
              jest zajęta.
            </div>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 pt-2 space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Przedmiot
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="np. Frameworki Frontendowe"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Typ
              </label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="lecture">Wykład</option>
                <option value="lab">Laboratorium</option>
                <option value="seminar">Seminarium</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Czas trwania
              </label>
              <select
                value={formData.duration}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    duration: parseFloat(e.target.value),
                  })
                }
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value={1}>1.0 h (60 min)</option>
                <option value={1.5}>1.5 h (90 min)</option>
                <option value={2}>2.0 h (120 min)</option>
                <option value={3}>3.0 h (180 min)</option>
                <option value={4}>4.0 h (240 min)</option>
                <option value={4.5}>4.5 h (Blok)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Sala
              </label>
              <input
                type="text"
                value={formData.room}
                onChange={(e) =>
                  setFormData({ ...formData, room: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="np. A-123"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Prowadzący
              </label>
              <input
                type="text"
                value={formData.instructor}
                onChange={(e) =>
                  setFormData({ ...formData, instructor: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="np. dr Kowalski"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 flex justify-between items-center border-t border-gray-100 mt-4">
            {initialData?.id ? (
              <button
                type="button"
                onClick={() => onDelete(initialData.id)}
                className="text-red-600 hover:text-red-800 text-sm font-medium"
              >
                Usuń zajęcia
              </button>
            ) : (
              <div></div> // Spacer
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md text-sm font-medium"
              >
                Anuluj
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm font-bold shadow-sm"
              >
                Zapisz
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
