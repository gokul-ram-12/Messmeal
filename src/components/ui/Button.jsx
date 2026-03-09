import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false, loading = false, icon: Icon, type = 'button' }) => {
    const variants = {
        /* ── PRIMARY ──────────────────────────────────────────────────────
           Light: solid blue, 12-px radius, white text
           Dark:  solid yellow pill, black text, glow                     */
        primary: [
            // light
            "bg-[#0057FF] text-white rounded-xl shadow-blue-glow",
            "hover:bg-[#0040CC] border border-[#0057FF]/30",
            // dark  — pill shape, yellow-green, black text
            "dark:bg-[#D4F000] dark:text-[#0D0D0D] dark:rounded-pill dark:border-0",
            "dark:shadow-nik-btn dark:hover:brightness-110 dark:font-bold",
        ].join(' '),

        /* ── SECONDARY ────────────────────────────────────────────────── */
        secondary: [
            "bg-[#F0F0F0] text-[#0D0D0D] border border-[#E4E4E4] rounded-xl",
            "hover:bg-[#E4E4E4]",
            "dark:bg-[#2A2A2A] dark:text-white dark:border-[#2A2A2A] dark:rounded-pill",
            "dark:hover:bg-[#333333]",
        ].join(' '),

        /* ── DANGER ───────────────────────────────────────────────────── */
        danger: [
            "bg-error/10 border border-error/30 text-error rounded-xl",
            "hover:bg-error/20",
            "dark:bg-error/20 dark:border-error/50 dark:rounded-pill",
            "dark:hover:bg-error/30",
        ].join(' '),

        /* ── GHOST ────────────────────────────────────────────────────── */
        ghost: [
            "text-[#6B6B6B] hover:text-[#0D0D0D] hover:bg-black/5 rounded-xl",
            "dark:text-[#A0A0A0] dark:hover:text-white dark:hover:bg-white/10 dark:rounded-pill",
        ].join(' '),

        /* ── OUTLINE ──────────────────────────────────────────────────── */
        outline: [
            "border border-[#E4E4E4] text-[#6B6B6B] rounded-xl",
            "hover:border-[#0057FF] hover:text-[#0057FF] hover:bg-[#0057FF]/5",
            "dark:border-[#2A2A2A] dark:text-[#A0A0A0] dark:rounded-pill",
            "dark:hover:border-[#D4F000] dark:hover:text-[#D4F000]",
        ].join(' '),
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`px-6 py-3 font-heading font-semibold transition-all duration-150 ease-out flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.97] ${variants[variant] || variants.primary} ${className}`}
        >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : Icon && <Icon className="w-4 h-4" />}
            {children}
        </button>
    );
};
