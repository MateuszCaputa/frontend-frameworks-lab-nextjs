/**
 * (Lab 6 & 9)
 * Static data for the weekly schedule grid structure.
 * Defines days of the week and time slots (8:00 - 20:00).
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

// Generates hours from 8 to 20
export const TIME_SLOTS = Array.from({ length: 13 }, (_, i) => 8 + i);
