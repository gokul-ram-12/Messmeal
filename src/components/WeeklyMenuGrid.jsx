import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, orderBy, limit } from 'firebase/firestore';
import { db, appId } from '../lib/firebase';
import { format, addDays } from 'date-fns';
import { Utensils } from 'lucide-react';
import { MEAL_ORDER } from '../lib/constants';

export const WeeklyMenuGrid = ({ userData, theme = 'orange' }) => {
    const [weeklyMenus, setWeeklyMenus] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const themeColors = theme === 'purple'
        ? { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-800', header: 'bg-purple-100' }
        : theme === 'blue'
            ? { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800', header: 'bg-blue-100' }
            : { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-800', header: 'bg-orange-100' };

    useEffect(() => {
        if (!userData?.hostel) return;

        const timer = setTimeout(() => {
            setIsLoading(true);
        }, 0);

        const today = new Date().toISOString().split('T')[0];
        const nextWeek = addDays(new Date(), 6).toISOString().split('T')[0];

        const q = query(
            collection(db, 'artifacts', appId, 'public', 'data', 'menus'),
            where('hostel', '==', userData.hostel),
            where('messType', '==', userData.messType),
            where('date', '>=', today),
            where('date', '<=', nextWeek),
            orderBy('date', 'asc'),
            limit(7)
        );

        const unsub = onSnapshot(q, (snap) => {
            const menus = snap.docs.map(doc => doc.data());

            // Map fetched menus to a full 7-day array to ensure blanks are shown if data is missing
            const filledWeeklyMenus = Array.from({ length: 7 }).map((_, i) => {
                const targetDate = addDays(new Date(), i).toISOString().split('T')[0];
                const found = menus.find(m => m.date === targetDate);
                return found || { date: targetDate, breakfast: '', lunch: '', snacks: '', dinner: '' };
            });

            setWeeklyMenus(filledWeeklyMenus);
            setIsLoading(false);
        }, (err) => {
            console.error("Weekly Menu fetch error:", err);
            setIsLoading(false);
        });

        return () => {
            unsub();
            clearTimeout(timer);
        };
    }, [userData?.hostel, userData?.messType]);

    if (isLoading) {
        return (
            <div className="animate-fade-in space-y-6 mt-4">
                <div className="h-8 w-48 bg-white/10 rounded-lg animate-pulse mb-8 border border-white/5"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-6">
                    {[1, 2, 3, 4, 5, 6, 7].map(i => (
                        <div key={i} className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-black/5 dark:border-white/5 flex flex-col h-96 animate-pulse shadow-md">
                            <div className="h-8 w-2/3 bg-black/10 dark:bg-white/10 rounded-xl mb-6"></div>
                            <div className="space-y-4 flex-grow">
                                {[1, 2, 3, 4].map(j => (
                                    <div key={j} className="h-10 bg-black/5 dark:bg-white/5 rounded-lg w-full"></div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in space-y-5 mt-4 pb-24">
            {/* Section heading: blue dot prefix (light) / Nike caps white (dark) */}
            <h2 className="text-2xl font-heading font-black tracking-tight flex items-center gap-2 mb-5
                           text-[#0D0D0D] section-dot
                           dark:text-white dark:uppercase dark:tracking-[-0.03em]">
                <Utensils size={22} className="text-[#0057FF] dark:text-[#D4F000]" />
                <span className="hidden dark:inline">7-DAY MENU</span>
                <span className="dark:hidden">7-Day Overview</span>
            </h2>

            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-7">
                {weeklyMenus.map((dayMenu, idx) => {
                    const isToday = idx === 0;
                    return (
                        <div key={dayMenu.date} className={`flex flex-col rounded-card dark:rounded-card-xl border overflow-hidden transition-all duration-200 hover:shadow-card-md ${isToday
                            ? 'border-[#0057FF] dark:border-[#D4F000] shadow-blue-glow dark:shadow-nik-glow'
                            : 'bg-white dark:bg-[#1A1A1A] border-[#E4E4E4] dark:border-[#2A2A2A] shadow-card dark:shadow-card-dark'
                            }`}>
                            {/* Day header */}
                            <div className={`p-3 text-center border-b ${isToday
                                ? 'bg-[#0057FF] dark:bg-[#D4F000] border-transparent'
                                : 'bg-[#F0F0F0] dark:bg-[#0D0D0D] border-[#E4E4E4] dark:border-[#2A2A2A]'
                                }`}>
                                <p className={`text-[11px] font-black uppercase tracking-widest ${isToday ? 'text-white dark:text-[#0D0D0D]' : 'text-[#6B6B6B] dark:text-[#A0A0A0]'
                                    }`}>
                                    {isToday ? 'TODAY' : format(new Date(dayMenu.date), 'EEE')}
                                </p>
                                <p className={`text-xs font-bold mt-0.5 ${isToday ? 'text-white/80 dark:text-[#0D0D0D]/70' : 'text-[#A0A0A0] dark:text-[#5A5A5A]'
                                    }`}>
                                    {format(new Date(dayMenu.date), 'MMM d')}
                                </p>
                            </div>

                            {/* Meal rows */}
                            <div className="p-3 space-y-3 flex-grow bg-white dark:bg-[#1A1A1A]">
                                {MEAL_ORDER.map(meal => (
                                    <div key={meal} className="border-b border-[#F0F0F0] dark:border-[#2A2A2A] last:border-0 pb-2 last:pb-0">
                                        <p className="text-[9px] font-black text-[#A0A0A0] uppercase tracking-widest mb-1">{meal}</p>
                                        <p className="text-xs text-[#0D0D0D] dark:text-[#E0E0E0] font-medium whitespace-pre-wrap leading-snug">
                                            {dayMenu[meal.toLowerCase()] || <span className="text-[#A0A0A0] dark:text-[#5A5A5A] italic">Not set</span>}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
