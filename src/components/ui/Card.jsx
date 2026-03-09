import React from 'react';

/**
 * Card — Light: white, 16px radius, soft shadow.
 *       Dark:  #1A1A1A charcoal, 20px radius, deep shadow.
 */
export const Card = ({ children, className = "" }) => (
    <div className={[
        // Light mode
        "bg-white rounded-card shadow-card border-0 p-5 sm:p-6",
        "transition-all duration-300 hover:shadow-card-md",
        // Dark mode  
        "dark:bg-[#1A1A1A] dark:rounded-card-xl dark:shadow-card-dark",
        className,
    ].join(' ')}>
        {children}
    </div>
);
