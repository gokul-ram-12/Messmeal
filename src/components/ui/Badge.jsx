import React from 'react';

export const Badge = ({ children, variant = 'default', className = '' }) => {
    const variants = {
        default: "bg-zinc-100 text-zinc-600 border border-zinc-200",
        success: "bg-[#DCFCE7] text-[#065F46] border border-[#10B981]/20",
        warning: "bg-[#FEF3C7] text-[#92400E] border border-[#F59E0B]/20",
        danger: "bg-[#FEE2E2] text-[#991B1B] border border-[#EF4444]/20",
        student: "bg-[#EDE9FE] text-[#5B21B6] border border-[#7C3AED]/20",
        admin: "bg-[#DBEAFE] text-[#1E40AF] border border-blue-500/20",
        super_admin: "bg-[#FEE2E2] text-[#991B1B] border border-red-500/20",
        // legacy mappings
        purple: "bg-[#EDE9FE] text-[#5B21B6] border border-[#7C3AED]/20",
        orange: "bg-[#FEF3C7] text-[#92400E] border border-[#F59E0B]/20"
    };
    return <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${variants[variant] || variants.default} ${className}`}>{children}</span>;
};
