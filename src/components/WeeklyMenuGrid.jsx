import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, orderBy, limit } from 'firebase/firestore';
import { db, appId } from '../lib/firebase';
import { format, addDays } from 'date-fns';
import { Utensils } from 'lucide-react';
import { MEAL_ORDER } from '../lib/constants';

const MEAL_COLORS = {
    Breakfast: 'text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-500/30',
    Lunch: 'text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30',
    Snacks: 'text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/30',
    Dinner: 'text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/30',
};

export const WeeklyMenuGrid = ({ userData, theme = 'orange' }) => {
    const [weeklyMenus, setWeeklyMenus] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!userData?.hostel) return;

        const timer = setTimeout(() => {
            setIsLoading(true);
        }, 0);

        // Fix: Use toLocaleDateString('en-CA') to get local date in YYYY-MM-DD format
        const today = new Date().toLocaleDateString('en-CA');
        const endDate = addDays(new Date(), 14).toLocaleDateString('en-CA'); // 15 days

        const q = query(
            collection(db, 'artifacts', appId, 'public', 'data', 'menus'),
            where('hostel', '==', userData.hostel),
            where('messType', '==', userData.messType),
            where('date', '>=', today),
            where('date', '<=', endDate),
            orderBy('date', 'asc'),
            limit(15)
        );

        const unsub = onSnapshot(q, (snap) => {
            const menus = snap.docs.map(doc => doc.data());

            // Map fetched menus to a full 15-day array ensuring blanks are shown if data is missing
            const filledWeeklyMenus = Array.from({ length: 15 }).map((_, i) => {
                // Use local midnight as base to avoid UTC offset shifting the date
                const localBase = new Date();
                localBase.setHours(0, 0, 0, 0);
                const targetDate = addDays(localBase, i).toLocaleDateString('en-CA');
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
                <span className="hidden dark:inline">15-DAY MENU</span>
                <span className="dark:hidden">15-Day Overview</span>
            </h2>

            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-7">
                {weeklyMenus.map((dayMenu, idx) => {
                    const isToday = idx === 0;
                    const primaryBorder = "border-primary";
                    const primaryBg = "bg-primary";
                    const neutralBorder = "border-zinc-300 dark:border-zinc-800";
                    const neutralBg = "bg-zinc-100 dark:bg-zinc-800";

                    return (
                        <div key={dayMenu.date} className={`flex flex-col rounded-[2rem] border-[4px] overflow-hidden transition-all duration-300 hover:shadow-2xl ${isToday
                            ? `${primaryBorder} shadow-[0_12px_40px_rgba(var(--color-primary),0.2)] dark:shadow-[0_12px_40px_rgba(var(--color-primary),0.15)] z-10 scale-[1.02]`
                            : `${neutralBorder} bg-white dark:bg-[#1A1A1A] shadow-md opacity-90`
                            }`}>
                            {/* Day header */}
                            <div className={`p-5 text-center ${isToday ? primaryBg : neutralBg}`}>
                                <p className={`text-[10px] font-black uppercase tracking-[0.15em] ${isToday ? 'text-white dark:text-[#0D0D0D]' : 'text-zinc-500 dark:text-zinc-400'}`}>
                                    {isToday ? 'TODAY' : format(new Date(dayMenu.date + 'T00:00:00'), 'EEEE')}
                                </p>
                                <p className={`text-base font-black mt-0.5 ${isToday ? 'text-white dark:text-[#0D0D0D]' : 'text-[#0D0D0D] dark:text-[#E0E0E0]'}`}>
                                    {format(new Date(dayMenu.date + 'T00:00:00'), 'MMM d')}
                                </p>
                            </div>

                            {/* Meal rows */}
                            <div className="p-4 space-y-4 flex-grow bg-white dark:bg-[#1A1A1A]">
                                {MEAL_ORDER.map(meal => {
                                    const mealStyles = MEAL_COLORS[meal];
                                    return (
                                        <div key={meal} className={`border-b-2 ${mealStyles.split(' ').slice(2).join(' ')} last:border-0 pb-3 last:pb-0`}>
                                            <p className={`text-[9px] font-black uppercase tracking-widest mb-1.5 ${mealStyles.split(' ').slice(0, 2).join(' ')}`}>
                                                {meal}
                                            </p>
                                            <p className="text-[13px] text-[#0D0D0D] dark:text-[#E0E0E0] font-black whitespace-pre-wrap leading-tight tracking-tight">
                                                {dayMenu[meal.toLowerCase()] || <span className="text-[#A0A0A0] dark:text-[#5A5A5A] italic font-medium">Not set</span>}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
