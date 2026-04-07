import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false, loading = false, icon: Icon, type = 'button' }) => {
    const variants = {
        /* ── PRIMARY ──────────────────────────────────────────────────────
           Light: solid bold blue with strong shadow, white text
           Dark:  bold electric yellow pill, black text, strong glow        */
        primary: [
            // light — enhanced boldness with stronger shadow
            "bg-[#0057FF] text-white rounded-xl shadow-blue-glow hover:shadow-lg",
            "hover:bg-[#0040CC] active:bg-[#002E99] border border-[#0057FF]/40",
            "transition-all duration-150",
            // dark — vibrant yellow with stronger emphasis
            "dark:bg-[#D4F000] dark:text-[#0D0D0D] dark:rounded-pill dark:border-0",
            "dark:shadow-nik-btn dark:hover:brightness-125 dark:active:brightness-95 dark:font-bold",
        ].join(' '),

        /* ── SECONDARY ── Enhanced with better contrast */
        secondary: [
            "bg-[#F5F5F5] text-[#0D0D0D] border border-[#E0E0E0] rounded-xl",
            "hover:bg-[#ECECEC] active:bg-[#E0E0E0]",
            "dark:bg-[#333333] dark:text-white dark:border-[#444444] dark:rounded-pill",
            "dark:hover:bg-[#404040] dark:active:bg-[#2A2A2A]",
            "transition-all duration-150 font-semibold",
        ].join(' '),

        /* ── DANGER ── Bolder red for destructive actions */
        danger: [
            "bg-[#FEE2E2] border border-[#FECACA] text-[#DC2626] rounded-xl",
            "hover:bg-[#FCA5A5] active:bg-[#F87171]",
            "dark:bg-[#7F1D1D] dark:border-[#B91C1C] dark:text-[#FCA5A5] dark:rounded-pill",
            "dark:hover:bg-[#991B1B] dark:active:bg-[#7F1D1D]",
            "transition-all duration-150 font-semibold",
        ].join(' '),

        /* ── GHOST ── Subtle but interactive */
        ghost: [
            "text-[#6B6B6B] hover:text-[#0D0D0D] hover:bg-[#0057FF]/10 rounded-xl",
            "active:bg-[#0057FF]/20",
            "dark:text-[#B0B0B0] dark:hover:text-white dark:hover:bg-[#D4F000]/10 dark:rounded-pill dark:active:bg-[#D4F000]/20",
            "transition-all duration-150",
        ].join(' '),

        /* ── OUTLINE ── Better visibility */
        outline: [
            "border-2 border-[#0057FF] text-[#0057FF] rounded-xl",
            "hover:bg-[#0057FF]/5 active:bg-[#0057FF]/10",
            "dark:border-[#D4F000] dark:text-[#D4F000] dark:rounded-pill",
            "dark:hover:bg-[#D4F000]/10 dark:active:bg-[#D4F000]/20",
            "transition-all duration-150 font-semibold",
        ].join(' '),
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`px-4 sm:px-6 py-2.5 sm:py-3 min-h-[44px] sm:min-h-fit font-heading font-semibold transition-all duration-150 ease-out flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.97] ${variants[variant] || variants.primary} ${className}`}
        >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : Icon && <Icon className="w-4 h-4" />}
            {children}
        </button>
    );
};
