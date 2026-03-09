import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, X } from 'lucide-react';
import { Button } from './Button';
import { Card } from './Card';

export const SuccessModal = ({ isOpen, title, message, onConfirm, confirmText = "OK" }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="w-full max-w-sm"
                    >
                        <Card className="relative shadow-2xl overflow-hidden p-8 border-none ring-1 ring-white/10">
                            <button
                                onClick={onConfirm}
                                className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 dark:hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>

                            <div className="flex flex-col items-center text-center">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.1 }}
                                    className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mb-6 text-green-500"
                                >
                                    <CheckCircle2 size={48} strokeWidth={2.5} />
                                </motion.div>

                                <h3 className="text-2xl font-heading font-black text-[#0D0D0D] dark:text-white mb-3 tracking-tight">
                                    {title}
                                </h3>

                                <p className="text-zinc-500 dark:text-zinc-400 font-medium text-sm mb-8 leading-relaxed px-2">
                                    {message}
                                </p>

                                <Button
                                    onClick={onConfirm}
                                    className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-black text-lg shadow-lg shadow-green-600/20 active:scale-[0.98] transition-all"
                                >
                                    {confirmText}
                                </Button>
                            </div>
                        </Card>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
