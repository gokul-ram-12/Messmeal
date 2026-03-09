import React, { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator = () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    if (isOnline) return null;
    return (
        <div className="fixed bottom-16 left-0 right-0 bg-gray-900 text-white text-xs py-2 text-center z-50 flex items-center justify-center gap-2">
            <WifiOff size={14} /> You are offline. Showing cached data.
        </div>
    );
};
