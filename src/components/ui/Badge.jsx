import React from 'react';

export const Badge = ({ children, variant = 'default', className = '' }) => {
    const variants = {
        // Enhanced default with better contrast
        default: "bg-[#F3F4F6] text-[#374151] border border-[#D1D5DB] font-semibold",
        // Vibrant status badges
        success: "bg-[#DCFCE7] text-[#047857] border border-[#10B981] font-bold shadow-sm",
        warning: "bg-[#FEF3C7] text-[#B45309] border border-[#F59E0B] font-bold shadow-sm",
        danger: "bg-[#FEE2E2] text-[#B91C1C] border border-[#EF4444] font-bold shadow-sm",
        // Role badges with enhanced visibility
        student: "bg-[#EDE9FE] text-[#6D28D9] border border-[#7C3AED] font-bold shadow-sm",
        admin: "bg-[#DBEAFE] text-[#1E40AF] border border-[#3B82F6] font-bold shadow-sm",
        super_admin: "bg-[#FEE2E2] text-[#991B1B] border border-[#DC2626] font-bold shadow-sm",
        // Additional vibrant options for UI variety
        purple: "bg-[#F3E8FF] text-[#7E22CE] border border-[#A855F7] font-bold shadow-sm",
        orange: "bg-[#FFEDD5] text-[#C2410C] border border-[#F97316] font-bold shadow-sm",
        pink: "bg-[#FCE7F3] text-[#BE185D] border border-[#EC4899] font-bold shadow-sm",
        indigo: "bg-[#E0E7FF] text-[#3730A3] border border-[#6366F1] font-bold shadow-sm",
    };
    return <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-200 ${variants[variant] || variants.default} ${className}`}>{children}</span>;
};
