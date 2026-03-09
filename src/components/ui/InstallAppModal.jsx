import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Globe, Bell } from 'lucide-react';
import { Button } from './Button';
import { Card } from './Card';

export const InstallAppModal = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isIOS, setIsIOS] = useState(false);
    const [isStandalone, setIsStandalone] = useState(false);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        // Check if already installed
        const mqStandAlone = '(display-mode: standalone)';
        if (navigator.standalone || window.matchMedia(mqStandAlone).matches) {
            const t = setTimeout(() => setIsStandalone(true), 0);
            return () => clearTimeout(t);
        }

        // Check if iOS
        const userAgent = window.navigator.userAgent.toLowerCase();
        const isIpad = /macintosh/i.test(userAgent) && navigator.maxTouchPoints && navigator.maxTouchPoints > 1;
        if (/iphone|ipad|ipod/.test(userAgent) || isIpad) {
            const t = setTimeout(() => setIsIOS(true), 0);

            // On iOS, we show the prompt manually if they haven't dismissed it
            const hasDismissed = localStorage.getItem('messmeal_dismissed_install');
            if (!hasDismissed) {
                setTimeout(() => setShowModal(true), 3000); // Show after 3s delay
            }
            return () => clearTimeout(t);
        }

        // Listen for standard PWA prompt event (Android/Chrome)
        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);

            const hasDismissed = localStorage.getItem('messmeal_dismissed_install');
            if (!hasDismissed) {
                setTimeout(() => setShowModal(true), 3000);
            }
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt && !isIOS) return;

        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                setDeferredPrompt(null);
                setShowModal(false);
            }
        }
    };

    const handleDismiss = () => {
        setShowModal(false);
        // Don't ask again for 7 days
        localStorage.setItem('messmeal_dismissed_install', new Date().toISOString());
    };

    if (!showModal || isStandalone) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={handleDismiss}
            />

            <Card className="relative w-full max-w-md p-6 bg-zinc-950 border border-white/10 shadow-2xl animate-fade-in-up">
                <button
                    onClick={handleDismiss}
                    className="absolute top-4 right-4 text-zinc-500 hover:text-white bg-zinc-900 hover:bg-zinc-800 p-2 rounded-full transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-white border border-zinc-800 rounded-2xl flex items-center justify-center p-1 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                        <img src="/pwa-192x192.png" alt="MessMeal Icon" className="w-full h-full object-contain rounded-xl" />
                    </div>
                </div>

                <div className="text-center mb-6">
                    <h3 className="text-xl font-black text-white tracking-tight mb-2">Install MessMeal</h3>
                    <p className="text-sm font-medium text-zinc-400 leading-relaxed">
                        Add the official app to your home screen for a seamless dining experience.
                    </p>
                </div>

                <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                        <Smartphone className="text-blue-400 shrink-0" size={20} />
                        <div>
                            <p className="text-xs font-bold text-white uppercase tracking-wider">Native Experience</p>
                            <p className="text-[10px] text-zinc-500 font-medium">Full screen, no browser bars</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                        <Globe className="text-green-400 shrink-0" size={20} />
                        <div>
                            <p className="text-xs font-bold text-white uppercase tracking-wider">Offline Access</p>
                            <p className="text-[10px] text-zinc-500 font-medium">View menus without internet</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                        <Bell className="text-orange-400 shrink-0" size={20} />
                        <div>
                            <p className="text-xs font-bold text-white uppercase tracking-wider">Instant Alerts</p>
                            <p className="text-[10px] text-zinc-500 font-medium">Notices & menu updates</p>
                        </div>
                    </div>
                </div>

                {isIOS ? (
                    <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl text-center">
                        <p className="text-sm font-bold text-blue-400 mb-2">To install on iOS:</p>
                        <p className="text-xs text-blue-300 font-medium leading-relaxed">
                            Tap the <strong className="text-white">Share</strong> icon at the bottom of Safari, then tap <strong className="text-white bg-blue-500/20 px-1 rounded inline-block mt-1">Add to Home Screen</strong>.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <Button
                            onClick={handleInstallClick}
                            className="w-full py-4 text-sm bg-white text-black hover:bg-zinc-200"
                            icon={Download}
                        >
                            Install Now
                        </Button>
                        <button
                            onClick={handleDismiss}
                            className="w-full py-3 text-xs font-bold text-zinc-500 hover:text-white uppercase tracking-widest transition-colors outline-none"
                        >
                            Not Now
                        </button>
                    </div>
                )}
            </Card>
        </div>
    );
};
