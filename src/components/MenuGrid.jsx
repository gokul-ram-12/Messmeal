import React from 'react';
import { Utensils, Clock4, Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import { getMealStatus, format12H } from '../lib/utils';
import { MEAL_ORDER, DEFAULT_MEAL_TIMINGS } from '../lib/constants';

// Per-meal accent colors: top-border, icon tint, and label tint
const MEAL_ACCENTS = {
    Breakfast: {
        topBorder: 'border-t-orange-500 dark:border-t-orange-400',
        iconCls: 'text-orange-500 dark:text-orange-400',
        labelCls: 'bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-500/30',
    },
    Lunch: {
        topBorder: 'border-t-green-500 dark:border-t-green-400',
        iconCls: 'text-green-600 dark:text-green-400',
        labelCls: 'bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-500/30',
    },
    Snacks: {
        topBorder: 'border-t-amber-500 dark:border-t-amber-400',
        iconCls: 'text-amber-600 dark:text-amber-400',
        labelCls: 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30',
    },
    Dinner: {
        topBorder: 'border-t-purple-500 dark:border-t-purple-400',
        iconCls: 'text-purple-600 dark:text-purple-400',
        labelCls: 'bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30',
    },
};

export const MenuGrid = ({ menu, isLoading, activeTimings, selectedDateStr, nutritionTips, onAnalyze, aiLoading, theme = 'orange' }) => {
    if (isLoading) {
        return (
            <div className="space-y-6 animate-fade-in">
                <div className="px-1 py-2 mb-2">
                    <div className="h-12 w-40 bg-[#E4E4E4] dark:bg-[#2A2A2A] rounded-xl animate-pulse mb-3" />
                    <div className="h-5 w-56 bg-[#E4E4E4] dark:bg-[#2A2A2A] rounded animate-pulse" />
                </div>
                <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="bg-white dark:bg-[#1A1A1A] rounded-2xl border-t-4 border-t-zinc-200 dark:border-t-zinc-700 border border-zinc-100 dark:border-zinc-800 p-6 shadow-md flex flex-col h-52 animate-pulse">
                            <div className="h-6 w-24 bg-[#E4E4E4] dark:bg-[#2A2A2A] rounded-full mb-6" />
                            <div className="space-y-3 flex-grow">
                                <div className="h-4 bg-[#F0F0F0] dark:bg-[#2A2A2A] rounded w-3/4" />
                                <div className="h-4 bg-[#F0F0F0] dark:bg-[#2A2A2A] rounded w-1/2" />
                            </div>
                            <div className="h-10 bg-[#F0F0F0] dark:bg-[#2A2A2A] rounded-xl mt-auto" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (!menu) {
        return (
            <div className="flex flex-col items-center justify-center p-14 bg-white dark:bg-[#1A1A1A] rounded-2xl border-2 border-dashed border-[#E4E4E4] dark:border-[#2A2A2A] shadow-md">
                <Utensils className="text-[#A0A0A0] mb-4" size={40} />
                <p className="text-[#6B6B6B] dark:text-[#A0A0A0] font-semibold text-lg">No menu active for this date.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* ── HEADING ─────────────────────────────────── */}
            <div className="px-1 mb-2">
                {/* Light: blue-dot prefix; Dark: Nike-style white uppercase bold */}
                <h1 className="text-5xl md:text-7xl font-heading font-black tracking-tighter mb-1
                               text-[#0D0D0D] section-dot
                               dark:text-white dark:uppercase dark:tracking-[-0.04em] dark:section-dot-none">
                    <span className="hidden dark:inline">MENU</span>
                    <span className="dark:hidden">Menu</span>
                </h1>
                <p className="text-sm text-[#6B6B6B] dark:text-[#A0A0A0] font-medium">
                    {format(new Date(selectedDateStr), 'EEEE, MMMM do, yyyy')}
                </p>
            </div>

            {/* ── MEAL CARDS ──────────────────────────────── */}
            <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                {MEAL_ORDER.map(meal => {
                    const status = getMealStatus(meal, activeTimings, selectedDateStr);
                    const timing = activeTimings?.[meal] || DEFAULT_MEAL_TIMINGS[meal];
                    const IconComponent = timing?.icon || Utensils;
                    const menuItem = menu[meal.toLowerCase()] || "Menu not updated.";
                    const accent = MEAL_ACCENTS[meal] || MEAL_ACCENTS.Breakfast;

                    let cardCls = "";
                    let statusBadge = "";
                    let statusText = status;

                    if (status === 'ONGOING') {
                        statusText = "Eat away! 😋";
                        cardCls = [
                            "bg-white dark:bg-[#1A1A1A]",
                            `border-t-4 ${accent.topBorder}`,
                            "border border-green-300 dark:border-green-600/50",
                            "shadow-[0_4px_24px_rgba(34,197,94,0.18)] dark:shadow-[0_4px_24px_rgba(74,222,128,0.12)]",
                            "ring-1 ring-green-400/30 dark:ring-green-500/20",
                        ].join(' ');
                        statusBadge = "bg-green-50 text-green-700 dark:bg-green-500/20 dark:text-green-300 border border-green-200 dark:border-green-500/30";
                    } else if (status === 'COMPLETED') {
                        statusText = "Closed";
                        cardCls = [
                            "bg-zinc-50 dark:bg-[#141414]",
                            `border-t-4 ${accent.topBorder} opacity-60`,
                            "border border-zinc-200 dark:border-zinc-800",
                            "shadow-sm",
                        ].join(' ');
                        statusBadge = "bg-zinc-200 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400 border border-zinc-300 dark:border-zinc-700";
                    } else {
                        // UPCOMING
                        statusText = `OPENS ${format12H(timing?.start)}`;
                        cardCls = [
                            "bg-white dark:bg-[#1A1A1A]",
                            `border-t-4 ${accent.topBorder}`,
                            "border border-zinc-100 dark:border-zinc-800",
                            "shadow-md dark:shadow-[0_2px_12px_rgba(0,0,0,0.4)]",
                        ].join(' ');
                        statusBadge = "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300 border border-blue-200 dark:border-blue-500/20";
                    }

                    return (
                        <div key={meal} className={`rounded-2xl p-6 transition-all duration-200 hover:shadow-lg flex flex-col h-full ${cardCls}`}>
                            {/* Header row: meal name + status badge */}
                            <div className="flex justify-between items-center mb-5">
                                <span className={`text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider flex items-center gap-1.5 ${accent.labelCls}`}>
                                    <IconComponent size={12} className={accent.iconCls} /> {meal}
                                </span>
                                <span className={`text-[10px] font-bold px-3 py-1.5 rounded-full tracking-wide ${statusBadge}`}>
                                    {statusText}
                                </span>
                            </div>

                            {/* Menu content */}
                            <div className="mb-5 flex-grow">
                                <p className="text-[#0D0D0D] dark:text-[#E0E0E0] text-sm font-medium leading-relaxed whitespace-pre-wrap">
                                    {String(menuItem)}
                                </p>
                            </div>

                            {/* Timing row */}
                            <div className="mt-auto space-y-2">
                                <div className={`flex items-center gap-2 px-3 py-2.5 rounded-xl ${timing?.isOverride ? 'bg-amber-500/10 border border-amber-500/20' : 'bg-zinc-100 dark:bg-[#2A2A2A]'}`}>
                                    <Clock4 size={14} className={timing?.isOverride ? 'text-amber-500' : 'text-[#6B6B6B] dark:text-[#A0A0A0]'} />
                                    <span className={`text-xs font-semibold ${timing?.isOverride ? 'text-amber-600 dark:text-amber-400' : 'text-[#6B6B6B] dark:text-[#A0A0A0]'}`}>
                                        {format12H(timing?.start)} – {format12H(timing?.end)}
                                        {timing?.isOverride && <span className="ml-2 text-[9px] font-black uppercase tracking-tighter opacity-80">(Override)</span>}
                                    </span>
                                </div>

                                {nutritionTips?.[meal] ? (
                                    <div className="bg-[#0057FF]/5 dark:bg-[#D4F000]/5 p-3 rounded-xl text-xs text-[#0057FF] dark:text-[#D4F000] border border-[#0057FF]/10 dark:border-[#D4F000]/10 leading-relaxed font-medium">
                                        <Sparkles size={11} className="inline mr-1.5" />
                                        {String(nutritionTips[meal])}
                                        <div className="mt-2 pt-2 border-t border-current opacity-30 text-[10px] italic">
                                            Disclaimer: Nutrition analyzer data is not 100% accurate.
                                        </div>
                                    </div>
                                ) : onAnalyze && menu[meal.toLowerCase()] && status !== 'COMPLETED' && (
                                    <button
                                        onClick={() => onAnalyze(meal, menu[meal.toLowerCase()])}
                                        disabled={aiLoading === meal}
                                        className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold py-2 rounded-xl transition-all
                                                   text-[#0057FF] hover:bg-[#0057FF]/5
                                                   dark:text-[#D4F000] dark:hover:bg-[#D4F000]/5"
                                    >
                                        <Sparkles size={13} />
                                        {aiLoading === meal ? "Analyzing..." : "Analyze Nutrition"}
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

