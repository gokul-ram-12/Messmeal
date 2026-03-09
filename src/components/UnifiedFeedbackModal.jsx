import React, { useState } from 'react';
import { Camera, CheckCircle2, X, Send } from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { db, appId } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from 'react-hot-toast';

import { DEFAULT_HOSTELS, DEFAULT_MESS_TYPES } from '../lib/constants';

export const UnifiedFeedbackModal = ({ isOpen, onClose, initialEmail = '', config }) => {
    const hostels = config?.hostels || DEFAULT_HOSTELS;
    const messTypes = config?.messTypes || DEFAULT_MESS_TYPES;

    const [description, setDescription] = useState('');
    const [email, setEmail] = useState(initialEmail);
    const [hostel, setHostel] = useState(hostels[0]);
    const [messType, setMessType] = useState(messTypes[0]);
    const [proofImage, setProofImage] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const maxSize = 1.2 * 1024 * 1024; // 1.2MB limit to allow for base64 overhead
            if (file.size > maxSize) {
                toast.error("Image must be less than 1.2MB");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setProofImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const submitFeedback = async () => {
        if (!description.trim() || !email.trim()) return;
        setSubmitting(true);
        try {
            await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'feedback_reports'), {
                description,
                email,
                hostel,
                messType,
                proofImage,
                status: 'pending',
                createdAt: serverTimestamp()
            });
            toast.success("Feedback submitted successfully!");
            setDescription('');
            setProofImage(null);
            onClose();
        } catch (error) {
            console.error(error);
            toast.error("Failed to submit feedback.");
        }
        setSubmitting(false);
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xl z-[100] flex items-center justify-center p-4">
            <Card className="w-full max-w-lg relative animate-slide-up">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-mid hover:text-dark dark:hover:text-white hover:bg-black/10 dark:hover:bg-white/10 rounded-full transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="mb-6 pr-8">
                    <h2 className="text-2xl font-heading font-bold text-dark dark:text-white tracking-tight">Report Bug / Feedback</h2>
                    <p className="text-sm text-mid mt-1">Found an issue or have a suggestion? Let us know!</p>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-mid uppercase tracking-widest mb-2">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your@email.com"
                            className="w-full p-4 bg-black/20 dark:bg-black/40 border border-black/20 dark:border-white/10 rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-dark dark:text-white placeholder-mid shadow-inner"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-mid uppercase tracking-widest mb-2">Hostel</label>
                            <select
                                value={hostel}
                                onChange={(e) => setHostel(e.target.value)}
                                className="w-full p-4 bg-black/20 dark:bg-black/40 border border-black/20 dark:border-white/10 rounded-xl outline-none focus:border-primary text-dark dark:text-white appearance-none"
                            >
                                {hostels.map(h => <option key={h} value={h} className="bg-white dark:bg-[#1A1A2E]">{h}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-mid uppercase tracking-widest mb-2">Mess Type</label>
                            <select
                                value={messType}
                                onChange={(e) => setMessType(e.target.value)}
                                className="w-full p-4 bg-black/20 dark:bg-black/40 border border-black/20 dark:border-white/10 rounded-xl outline-none focus:border-primary text-dark dark:text-white appearance-none"
                            >
                                {messTypes.map(t => <option key={t} value={t} className="bg-white dark:bg-[#1A1A2E]">{t}</option>)}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-mid uppercase tracking-widest mb-2">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Please describe the issue or feedback in detail..."
                            className="w-full p-4 bg-black/20 dark:bg-black/40 border border-black/20 dark:border-white/10 rounded-xl h-32 outline-none resize-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-dark dark:text-white placeholder-mid shadow-inner"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-mid uppercase tracking-widest mb-2">Screenshot (Optional)</label>
                        <div className="border-2 border-dashed border-primary/40 hover:border-primary hover:shadow-glow text-dark dark:text-white rounded-2xl p-6 text-center transition-all bg-black/10 dark:bg-white/5 hover:bg-black/20 dark:hover:bg-white/10 backdrop-blur-sm">
                            <input type="file" accept="image/*" onChange={handleImageUpload} id="unified-proof-upload" className="hidden" />
                            <label htmlFor="unified-proof-upload" className="cursor-pointer block">
                                {proofImage ? (
                                    <div className="flex flex-col items-center">
                                        <img src={proofImage} alt="Preview" className="h-32 object-contain mb-3 rounded-lg shadow-sm" />
                                        <span className="text-sm text-green-500 dark:text-green-400 font-semibold tracking-wide flex items-center gap-2">
                                            <CheckCircle2 size={16} /> Screenshot Attached
                                        </span>
                                    </div>
                                ) : (
                                    <>
                                        <div className="w-14 h-14 mx-auto bg-black/10 dark:bg-white/10 border border-black/20 dark:border-white/20 shadow-sm rounded-full flex items-center justify-center mb-3 text-dark dark:text-white hover:text-primary transition-colors">
                                            <Camera size={24} />
                                        </div>
                                        <span className="text-sm font-semibold text-dark dark:text-white block">Add a Screenshot</span>
                                        <span className="text-xs text-mid mt-1 block font-medium">PNG, JPG up to 1MB</span>
                                    </>
                                )}
                            </label>
                        </div>
                    </div>

                    <Button
                        onClick={submitFeedback}
                        disabled={!description.trim() || !email.trim() || submitting}
                        loading={submitting}
                        icon={Send}
                        className="w-full py-4 text-base mt-2"
                    >
                        Submit Feedback
                    </Button>
                </div>
            </Card>
        </div>
    );
};
