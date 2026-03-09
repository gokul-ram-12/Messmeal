import React, { useEffect } from 'react';
import { Utensils } from 'lucide-react';

export const LoadingScreen = () => (
    <div className="fixed inset-0 bg-page z-50 flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <h2 className="text-xl font-heading font-bold text-dark tracking-tight leading-none">MessMeal</h2>
        <p className="inline-block text-[8px] font-black uppercase tracking-[0.2em] text-[#0057FF] bg-[#0057FF]/10 px-2 py-0.5 rounded -mt-1 opacity-100 leading-none">eat on time be on time</p>
    </div>
);

export const BouncingLogoScreen = ({ onComplete }) => {
    useEffect(() => {
        const timer = setTimeout(onComplete, 1500);
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <div className="fixed inset-0 bg-page z-50 flex flex-col items-center justify-center">
            <div className="animate-bounce bg-white p-4 rounded-2xl shadow-card border border-zinc-200">
                <Utensils size={48} className="text-primary" />
            </div>
            <h2 className="text-3xl font-heading font-black text-dark tracking-tight mt-6 leading-none">MessMeal</h2>
            <p className="inline-block text-[10px] font-black uppercase tracking-[0.3em] text-[#0057FF] bg-[#0057FF]/10 px-4 py-1 rounded -mt-1.5 opacity-100">eat on time be on time</p>
            <p className="text-mid font-medium mt-2">Saving your changes...</p>
        </div>
    );
};
