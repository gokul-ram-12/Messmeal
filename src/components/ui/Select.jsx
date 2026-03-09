import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';

/**
 * Premium custom Select component to replace standard HTML selectors.
 * Supports groups, labels, and premium animations.
 */
export const Select = ({
    value,
    onChange,
    options = [],
    placeholder = 'Select an option',
    label,
    className = '',
    disabled = false
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const findOption = (opts, val) => {
        for (const opt of opts) {
            if (opt.options) {
                const found = findOption(opt.options, val);
                if (found) return found;
            } else if (opt.value === val) {
                return opt;
            }
        }
        return null;
    };

    const selectedOption = findOption(options, value);

    const handleSelect = (optionValue) => {
        onChange(optionValue);
        setIsOpen(false);
    };

    return (
        <div className={`relative ${className}`} ref={containerRef}>
            {label && (
                <label className="block text-[10px] font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-[0.2em] mb-2 ml-1">
                    {label}
                </label>
            )}

            <button
                type="button"
                disabled={disabled}
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    w-full flex items-center justify-between p-3 
                    bg-zinc-100 dark:bg-black/40 
                    border border-zinc-200 dark:border-white/10 
                    rounded-xl outline-none transition-all duration-200
                    text-zinc-900 dark:text-white text-sm font-medium
                    ${isOpen ? 'ring-2 ring-primary/20 border-primary shadow-sm' : 'hover:border-primary/50'}
                    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
            >
                <span className="truncate">
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown
                    size={18}
                    className={`text-zinc-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 5, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute z-[100] w-full mt-1 bg-white dark:bg-[#16162A] border border-zinc-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden max-h-96 overflow-y-auto"
                    >
                        {options.map((group, idx) => {
                            // Support for optgroups
                            if (group.label && group.options) {
                                return (
                                    <div key={idx} className="border-b last:border-b-0 border-zinc-100 dark:border-white/5">
                                        <div className="px-4 py-2 text-[9px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest bg-zinc-50 dark:bg-black/20">
                                            {group.label}
                                        </div>
                                        {group.options.map((opt) => (
                                            <button
                                                key={opt.value}
                                                type="button"
                                                onClick={() => handleSelect(opt.value)}
                                                className={`
                                                    w-full flex items-center justify-between px-4 py-3 text-sm transition-colors
                                                    ${value === opt.value
                                                        ? 'bg-primary/10 text-primary font-bold'
                                                        : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/10'}
                                                `}
                                            >
                                                <span>{opt.label}</span>
                                                {value === opt.value && <Check size={16} className="text-primary" />}
                                            </button>
                                        ))}
                                    </div>
                                );
                            }
                            // Regular options
                            return (
                                <button
                                    key={group.value}
                                    type="button"
                                    onClick={() => handleSelect(group.value)}
                                    className={`
                                        w-full flex items-center justify-between px-4 py-3 text-sm transition-colors
                                        ${value === group.value
                                            ? 'bg-primary/10 text-primary font-bold'
                                            : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/10'}
                                    `}
                                >
                                    <span>{group.label}</span>
                                    {value === group.value && <Check size={16} className="text-primary" />}
                                </button>
                            );
                        })}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
