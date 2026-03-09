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
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    if (selectedDateStr < todayStr) return 'COMPLETED';
    if (selectedDateStr > todayStr) return 'UPCOMING';
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

export const callCalorieNinjas = async (query, providedKey = null) => {
    const apiKey = providedKey || import.meta.env.VITE_CALORIE_NINJAS_API_KEY;
    if (!apiKey) return "Nutrition API not configured.";

    try {
        console.log(`[Nutrition] Querying CalorieNinjas for: "${query}"`);
        const response = await fetch(`https://api.calorieninjas.com/v1/nutrition?query=${encodeURIComponent(query)}`, {
            method: 'GET',
            headers: {
                'X-Api-Key': apiKey,
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error(`[Nutrition] API Error ${response.status}:`, errorBody);
            // Check for common local dev issues
            if (response.status === 401) return "Nutrition API key invalid or expired.";
            if (response.status === 403) return "Access forbidden (check API restrictions).";
            throw new Error(`API returned ${response.status}`);
        }

        const data = await response.json();
        console.log("[Nutrition] Received data:", data);

        if (!data.items || data.items.length === 0) {
            return "No nutritional data found for this meal.";
        }

        // Aggregate data
        const total = data.items.reduce((acc, item) => {
            acc.calories += item.calories;
            acc.protein += item.protein_g;
            acc.carbs += item.carbohydrates_total_g;
            acc.fat += item.fat_total_g;
            return acc;
        }, { calories: 0, protein: 0, carbs: 0, fat: 0 });

        return `Est. ${Math.round(total.calories)} kcal | P: ${Math.round(total.protein)}g, C: ${Math.round(total.carbs)}g, F: ${Math.round(total.fat)}g. (Quantities based on standard servings)`;
    } catch (error) {
        console.error("[Nutrition] Fetch error:", error);
        // Hint at localhost/CORS issues
        if (error.message === 'Failed to fetch') {
            console.warn("[Nutrition] This might be a CORS block in your browser. Check if CalorieNinjas allows requests from localhost.");
        }
        return "Nutrition service temporarily unavailable.";
    }
};
