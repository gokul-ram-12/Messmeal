import Papa from 'papaparse';
import { doc, setDoc, writeBatch, serverTimestamp } from 'firebase/firestore';
import { db, appId } from './firebase';

/**
 * Parses a CSV file and builds a menu map: { dateStr: { breakfast, lunch, snacks, dinner } }
 * Specific rules:
 * 1. Skip Headers/Footers: Column headers are on row 2 or 3. Stop if "MESS SERVICE INSTRUCTIONS" is found.
 * 2. Grouped Dates: Column 0 has strings like "Sun 1,15,29". Extract integers using Regex.
 * 3. Fill-Down: Dates column can be empty for subsequent rows of the same day.
 * 4. Data cleaning: Ignore empty cells/commas.
 */
export const parseMenuCSV = (file, selectedMonth, selectedYear) => {
    return new Promise((resolve, reject) => {
        Papa.parse(file, {
            skipEmptyLines: true,
            complete: (results) => {
                try {
                    const data = results.data;
                    const menuMap = {}; // dateStr -> { breakfast: [], lunch: [], snacks: [], dinner: [] }
                    let currentActiveDays = [];
                    let headerFound = false;

                    for (let i = 0; i < data.length; i++) {
                        const row = data[i];
                        if (!row || row.length === 0) continue;

                        const firstCell = String(row[0] || '').trim();

                        // 1. Footer check
                        if (firstCell.toUpperCase().includes("MESS SERVICE INSTRUCTIONS")) break;

                        // 2. Header skip (heuristic: headers usually contain "Date" or "Breakfast")
                        if (!headerFound) {
                            if (firstCell.toLowerCase().includes("date") ||
                                String(row[1] || '').toLowerCase().includes("breakfast")) {
                                headerFound = true;
                            }
                            continue;
                        }

                        // 3. Extract dates or "Fill-Down"
                        if (firstCell) {
                            // Grouped Dates Extraction: "Sun 1,15,29" -> [1, 15, 29]
                            const dayNumbers = firstCell.match(/\d+/g);
                            if (dayNumbers) {
                                currentActiveDays = dayNumbers.map(d => parseInt(d));
                            }
                        }

                        if (currentActiveDays.length === 0) continue;

                        // 4. Extract and clean food items
                        const cleanItem = (item) => {
                            if (!item) return null;
                            const cleaned = String(item).trim().replace(/^,+|,+$/g, '').trim();
                            return cleaned || null;
                        };

                        const items = {
                            breakfast: cleanItem(row[1]),
                            lunch: cleanItem(row[2]),
                            snacks: cleanItem(row[3]),
                            dinner: cleanItem(row[4])
                        };

                        // 5. Append items to each active date
                        currentActiveDays.forEach(day => {
                            // Validate day for the month/year
                            const date = new Date(selectedYear, selectedMonth, day);
                            if (date.getMonth() !== selectedMonth) return;

                            const dateStr = date.toISOString().split('T')[0];
                            if (!menuMap[dateStr]) {
                                menuMap[dateStr] = { breakfast: [], lunch: [], snacks: [], dinner: [] };
                            }

                            // If item exists, add it to the corresponding meal array
                            Object.keys(items).forEach(meal => {
                                if (items[meal]) {
                                    menuMap[dateStr][meal].push(items[meal]);
                                }
                            });
                        });
                    }

                    // Convert arrays to joined strings for Firestore consistency
                    const finalMenu = {};
                    Object.keys(menuMap).forEach(dateStr => {
                        finalMenu[dateStr] = {
                            breakfast: menuMap[dateStr].breakfast.join(', '),
                            lunch: menuMap[dateStr].lunch.join(', '),
                            snacks: menuMap[dateStr].snacks.join(', '),
                            dinner: menuMap[dateStr].dinner.join(', ')
                        };
                    });

                    resolve(finalMenu);
                } catch (error) {
                    reject(error);
                }
            },
            error: (error) => reject(error)
        });
    });
};

/**
 * Uploads themed menu to Firestore for multiple hostels.
 */
export const uploadMenuBatch = async (processedMenu, targets, messTypes, userId) => {
    const batch = writeBatch(db);
    let count = 0;

    const types = Array.isArray(messTypes) ? messTypes : [messTypes];

    Object.entries(processedMenu).forEach(([dateStr, meals]) => {
        targets.forEach(hostel => {
            types.forEach(messType => {
                const docId = `${hostel}_${messType}_${dateStr}`;
                const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'menus', docId);

                batch.set(docRef, {
                    ...meals,
                    date: dateStr,
                    hostel,
                    messType,
                    updatedAt: serverTimestamp(),
                    updatedBy: userId
                }, { merge: true });
                count++;
            });
        });
    });

    await batch.commit();
    return count;
};
