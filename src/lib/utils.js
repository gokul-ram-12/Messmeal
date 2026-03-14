// src/lib/utils.js
export const getTimeMinutes = (timeStr) => {
    if (!timeStr) return 0;
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
};

export const format12H = (t) => {
    if (!t) return "";
    const [h, m] = t.split(':');
    const hours = parseInt(h);
    const suffix = hours >= 12 ? 'PM' : 'AM';
    const h12 = hours % 12 || 12;
    return `${h12}:${m} ${suffix}`;
};

export const getMealStatus = (meal, timings, selectedDateStr) => {
    if (!timings || !timings[meal]) return 'UNKNOWN';
    
    // Explicit local timezone string mapping (YYYY-MM-DD)
    const now = new Date();
    const localYear = now.getFullYear();
    const localMonth = String(now.getMonth() + 1).padStart(2, '0');
    const localDay = String(now.getDate()).padStart(2, '0');
    const todayStr = `${localYear}-${localMonth}-${localDay}`;
    
    if (selectedDateStr < todayStr) return 'COMPLETED';
    if (selectedDateStr > todayStr) return 'FUTURE_DAY';
    
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const start = getTimeMinutes(timings[meal].start);
    const end = getTimeMinutes(timings[meal].end);
    
    if (currentMinutes < start) return 'UPCOMING';
    if (currentMinutes > end) return 'COMPLETED';
    return 'ONGOING';
};

export const callGemini = async (prompt, providedApiKey) => {
    const rawKeyString = providedApiKey || "";
    if (!rawKeyString.trim()) return "AI feature not configured. Admins must add a Gemini API key in the Settings Tab to enable nutrition analysis.";

    // Split by comma, trim whitespace, remove empty entries
    const keys = rawKeyString.split(',').map(k => k.trim()).filter(k => k);
    if (keys.length === 0) return "Invalid AI API Key configuration.";

    // Pick a random key from the array
    const apiKey = keys[Math.floor(Math.random() * keys.length)];

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });

        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                return "Nutrition analysis failed: Invalid or expired API Key. Please check settings.";
            }
            throw new Error(`Gemini API returned ${response.status}`);
        }

        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || "Could not generate analysis.";
    } catch (error) {
        console.error("[Gemini] Error:", error);
        return "AI service temporarily unavailable. Please try again later.";
    }
};
export const compressImage = (file, maxDim = 1200, quality = 0.85) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > maxDim) {
                        height *= maxDim / width;
                        width = maxDim;
                    }
                } else {
                    if (height > maxDim) {
                        width *= maxDim / height;
                        height = maxDim;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL('image/jpeg', quality));
            };
            img.src = e.target.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};


