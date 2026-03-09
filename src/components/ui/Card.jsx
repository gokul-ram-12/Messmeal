import React from 'react';

/**
 * Card — Light: white, 16px radius, soft shadow.
 *       Dark:  #1A1A1A charcoal, 20px radius, deep shadow.
 */
export const Card = ({ children, className = "" }) => (
    <div className={[
        // Light mode
        "bg-white rounded-[2.5rem] shadow-card border-[4px] border-primary p-5 sm:p-8",
        "transition-all duration-300 hover:shadow-card-md",
        // Dark mode  
        "dark:bg-[#1A1A1A] dark:rounded-[2.5rem] dark:shadow-card-dark dark:border-primary",
        className,
    ].join(' ')}>
        {children}
    </div>
);
