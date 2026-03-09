import React from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { AlertCircle, X } from 'lucide-react';

export const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, confirmText = "Confirm", cancelText = "Cancel", isDestructive = true }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <Card className="w-full max-w-sm relative shadow-2xl overflow-hidden p-6 animate-scale-in">
                <button
                    onClick={onCancel}
                    className="absolute top-4 right-4 text-zinc-400 hover:text-dark transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="flex flex-col items-center text-center mt-2">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${isDestructive ? 'bg-error/10 text-error' : 'bg-primary/10 text-primary'}`}>
                        <AlertCircle size={28} />
                    </div>
                    <h3 className="text-xl font-heading font-bold text-dark mb-2 tracking-tight">{title}</h3>
                    <p className="text-mid text-sm mb-8 leading-relaxed">{message}</p>

                    <div className="flex gap-3 w-full">
                        <Button
                            variant="secondary"
                            className="flex-1"
                            onClick={onCancel}
                        >
                            {cancelText}
                        </Button>
                        <Button
                            className={`flex-1 ${isDestructive ? 'bg-error hover:bg-red-600 focus:ring-error shadow-error/30' : ''}`}
                            onClick={onConfirm}
                        >
                            {confirmText}
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};
