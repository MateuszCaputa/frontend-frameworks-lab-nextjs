/**
 * Static data for the Weekly Schedule component.
 * Defines the structure of the grid (Days of Week and Time Slots).
 */

export const WEEK_DAYS = [
  "Poniedziałek",
  "Wtorek",
  "Środa",
  "Czwartek",
  "Piątek",
  "Sobota",
  "Niedziela",
];

// Generates an array of hours from 8 (8:00) to 20 (20:00)
export const TIME_SLOTS = Array.from({ length: 13 }, (_, i) => 8 + i);
