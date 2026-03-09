// src/lib/notificationService.js
// Handles all in-app and service-worker notification scheduling for MessMeal.

import { getTimeMinutes, format12H } from './utils';
import { MEAL_ORDER, DEFAULT_MEAL_TIMINGS } from './constants';

/** ─── Permission management ─────────────────────────────── */

export const getNotifPermission = () => {
    if (!('Notification' in window)) return 'unsupported';
    return Notification.permission; // 'default' | 'granted' | 'denied'
};

export const requestNotifPermission = async () => {
    if (!('Notification' in window)) return 'unsupported';
    const result = await Notification.requestPermission();
    return result;
};

/** ─── Simple in-page notification helper ──────────────────── */

const showLocalNotification = (title, body, icon = '/pwa-512x512.png') => {
    if (getNotifPermission() !== 'granted') return;

    // Prefer service-worker notification (works offline)
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.ready.then(reg => {
            reg.showNotification(title, {
                body,
                icon,
                badge: '/pwa-192x192.png',
                tag: `messmeal-${Date.now()}`,
                renotify: false,
                vibrate: [200, 100, 200],
            });
        }).catch(() => {
            // Fallback to basic Notification API
            new Notification(title, { body, icon });
        });
    } else {
        try { new Notification(title, { body, icon }); } catch { /* ignore */ }
    }
};

/** ─── Meal-time notification scheduler ─────────────────────
 *
 *  Schedules browser timeouts so that:
 *  - At the exact start minute of each meal, if notifPrefs.mealNotif is true,
 *    a notification fires with the meal name and today's menu.
 *  - Returns a cleanup function to clear all pending timeouts.
 */

let _scheduledTimers = [];

export const clearMealNotifTimers = () => {
    _scheduledTimers.forEach(clearTimeout);
    _scheduledTimers = [];
};

export const scheduleMealNotifications = ({
    activeTimings,
    menu,        // today's menu object { breakfast, lunch, snacks, dinner }
    notifPrefs,  // { mealNotif: bool, noticeNotif: bool }
}) => {
    clearMealNotifTimers();
    if (!notifPrefs?.mealNotif) return;
    if (getNotifPermission() !== 'granted') return;

    const now = new Date();
    const todayMidnight = new Date(now);
    todayMidnight.setHours(0, 0, 0, 0);

    MEAL_ORDER.forEach(meal => {
        const timing = activeTimings?.[meal] || DEFAULT_MEAL_TIMINGS[meal];
        if (!timing?.start) return;

        const startMin = getTimeMinutes(timing.start);
        const [h, m] = timing.start.split(':').map(Number);

        const mealTime = new Date(todayMidnight);
        mealTime.setHours(h, m, 0, 0);

        const msUntil = mealTime.getTime() - now.getTime();
        if (msUntil < 0) return; // Already past this meal today

        const menuText = menu?.[meal.toLowerCase()] || 'Menu not updated yet.';
        const formattedTime = format12H(timing.start);

        const timerId = setTimeout(() => {
            showLocalNotification(
                `🍽️ ${meal} Time! — ${formattedTime}`,
                menuText.length > 120 ? menuText.slice(0, 120) + '…' : menuText
            );
        }, msUntil);

        _scheduledTimers.push(timerId);
    });
};

/** ─── Notice push notification helper ──────────────────────
 *
 *  Called whenever a new notice is detected (from the Firestore listener).
 *  Only fires if notifPrefs.noticeNotif is true and the notice is new
 *  (not previously shown – tracked in sessionStorage).
 */

export const maybeNotifyNotice = (notice, notifPrefs) => {
    if (!notifPrefs?.noticeNotif) return;
    if (getNotifPermission() !== 'granted') return;

    const seenKey = `notif_seen_${notice.id}`;
    if (sessionStorage.getItem(seenKey)) return;
    sessionStorage.setItem(seenKey, '1');

    showLocalNotification(
        `📢 Mess Notice: ${notice.title}`,
        notice.message?.length > 120 ? notice.message.slice(0, 120) + '…' : notice.message
    );
};
