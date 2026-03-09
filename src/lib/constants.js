// src/lib/constants.js
import { Coffee, Sun, Moon } from 'lucide-react';

export const INITIAL_SUPER_ADMIN_EMAIL = "messmeal.notifications@gmail.com";
export const DEFAULT_TAGLINE = "Made with ❤️ , EAT ON TIME : BE ON TIME";
export const DEFAULT_RATING_WINDOW = 24;

export const ALLOWED_DOMAINS = ['@vitap.ac.in', '@vitapstudent.ac.in', '@vit.ac.in'];

export const DEFAULT_MEAL_TIMINGS = {
    Breakfast: { start: "07:30", end: "09:00", icon: Coffee },
    Lunch: { start: "12:30", end: "14:15", icon: Sun },
    Snacks: { start: "16:45", end: "18:15", icon: Coffee },
    Dinner: { start: "19:15", end: "20:45", icon: Moon }
};

export const DEFAULT_HOSTELS = [
    "MH-1", "MH-2", "MH-3", "MH-4", "MH-5", "MH-6", "MH-7", "MH-8",
    "LH-1", "LH-2", "LH-3", "LH-4", "LH-5", "LH-6", "LH-7"
];
export const DEFAULT_MESS_TYPES = ["VEG", "NON-VEG", "SPL"];
export const MEAL_ORDER = ['Breakfast', 'Lunch', 'Snacks', 'Dinner'];
