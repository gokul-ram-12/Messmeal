import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Globe, Bell } from 'lucide-react';
import { Button } from './Button';
import { Card } from './Card';
import { useInstallPrompt } from '../../lib/hooks';

export const InstallAppModal = () => {
    const { isInstallable, install, dismiss } = useInstallPrompt();
    const [isIOS, setIsIOS] = useState(false);
    const [isStandalone, setIsStandalone] = useState(false);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        // Check if already installed
        const mqStandAlone = '(display-mode: standalone)';
        if (navigator.standalone || window.matchMedia(mqStandAlone).matches) {
            setIsStandalone(true);
            return;
        }

        // Check if iOS
        const userAgent = window.navigator.userAgent.toLowerCase();
        const isIpad = /macintosh/i.test(userAgent) && navigator.maxTouchPoints && navigator.maxTouchPoints > 1;
        if (/iphone|ipad|ipod/.test(userAgent) || isIpad) {
            setIsIOS(true);

            // On iOS, we show the prompt manually if they haven't dismissed it
            const hasDismissed = localStorage.getItem('messmeal_dismissed_install');
            if (!hasDismissed) {
                setTimeout(() => setShowModal(true), 3000); // Show after 3s delay
            }
            return;
        }

        // For non-iOS, if it's installable and not dismissed, show modal after delay
        if (isInstallable) {
            const hasDismissed = localStorage.getItem('messmeal_dismissed_install');
            if (!hasDismissed) {
                const timer = setTimeout(() => setShowModal(true), 3000);
                return () => clearTimeout(timer);
            }
        }
    }, [isInstallable]);

    const handleInstallClick = async () => {
        if (isIOS) return; // iOS users must use share menu

        const outcome = await install();
        if (outcome === 'accepted') {
            setShowModal(false);
        }
    };

    const handleDismiss = () => {
        setShowModal(false);
        dismiss(); // Update hook state
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
                        <button
                            onClick={handleInstallClick}
                            className="w-full py-4 text-sm font-black
                                uppercase tracking-widest rounded-xl
                                bg-[#0057FF] text-white
                                hover:bg-[#0040CC]
                                dark:bg-[#D4F000] dark:text-[#0D0D0D]
                                dark:hover:brightness-110
                                flex items-center justify-center gap-2
                                transition-all active:scale-[0.97]"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg"
                                width="16" height="16"
                                viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5
                                    a2 2 0 0 1-2-2v-4"/>
                                <polyline points="7 10 12 15 17 10"/>
                                <line x1="12" y1="15" x2="12" y2="3"/>
                            </svg>
                            Install Now
                        </button>
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
