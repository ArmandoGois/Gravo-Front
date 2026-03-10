import { X, ChevronRight, Check, Loader2, Building2, Palette, FileText, Plus } from 'lucide-react'; // <-- Added Plus icon
import React, { useState } from 'react';

import { CreateBrandProfileRequestDto } from '@/domain/dtos/create-brand.dto';
import { useCreateClient } from '@/presentation/hooks/use-create-client';

interface CreateClientModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export const CreateClientModal = ({ isOpen, onClose, onSuccess }: CreateClientModalProps) => {

    const [step, setStep] = useState(1);
    const [createdClientId, setCreatedClientId] = useState<string | null>(null);
    const { createClient, createBrandProfile, isLoading, error } = useCreateClient();

    // Step 1 State - Added logo_url
    const [basicInfo, setBasicInfo] = useState({
        name: '', slug: '', description: '', website: '', industry: '', logo_url: ''
    });

    // Step 2 State - Colors are now arrays
    const [brandInfo, setBrandInfo] = useState({
        primaryColors: [] as string[],
        secondaryColors: [] as string[],
        accentColors: [] as string[],
        forbiddenColors: [] as string[],
        typography_style: '', font_preferences: '',
        preferred_styles: '', forbidden_styles: '', mood_keywords: '',
        preferred_aspect_ratios: '', preferred_subjects: '', forbidden_subjects: '',
        style_notes: '', restrictions_notes: '', general_notes: ''
    });

    if (!isOpen) return null;

    const resetForm = () => {
        setStep(1);
        setCreatedClientId(null);
        setBasicInfo({ name: '', slug: '', description: '', website: '', industry: '', logo_url: '' });
        setBrandInfo({
            primaryColors: [], secondaryColors: [], accentColors: [], forbiddenColors: [],
            typography_style: '', font_preferences: '', preferred_styles: '', forbidden_styles: '',
            mood_keywords: '', preferred_aspect_ratios: '', preferred_subjects: '', forbidden_subjects: '',
            style_notes: '', restrictions_notes: '', general_notes: ''
        });
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    // Color Management Handlers
    const handleAddColor = (category: 'primaryColors' | 'secondaryColors' | 'accentColors' | 'forbiddenColors') => {
        setBrandInfo(prev => ({
            ...prev,
            [category]: [...prev[category], '#3B82F6'] // Default color blue
        }));
    };

    const handleUpdateColor = (category: 'primaryColors' | 'secondaryColors' | 'accentColors' | 'forbiddenColors', index: number, value: string) => {
        setBrandInfo(prev => {
            const newColors = [...prev[category]];
            newColors[index] = value;
            return { ...prev, [category]: newColors };
        });
    };

    const handleRemoveColor = (category: 'primaryColors' | 'secondaryColors' | 'accentColors' | 'forbiddenColors', index: number) => {
        setBrandInfo(prev => {
            const newColors = [...prev[category]];
            newColors.splice(index, 1);
            return { ...prev, [category]: newColors };
        });
    };

    const handleStep1Submit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const newClient = await createClient({
                name: basicInfo.name,
                slug: basicInfo.slug,
                description: basicInfo.description,
                website: basicInfo.website,
                industry: basicInfo.industry,
                logo_url: basicInfo.logo_url // <-- Sending logo_url
            });

            if (newClient && newClient.id) {
                setCreatedClientId(newClient.id);
                setStep(2);
            }
        } catch (err) {
            console.error("Step 1 failed:", err);
        }
    };

    const handleStep2Submit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!createdClientId) return;

        // Arrays are already formatted correctly
        const payload: CreateBrandProfileRequestDto = {
            colors: {
                primary: brandInfo.primaryColors,
                secondary: brandInfo.secondaryColors,
                accent: brandInfo.accentColors,
                forbidden: brandInfo.forbiddenColors,
            },
            typography_style: brandInfo.typography_style,
            font_preferences: brandInfo.font_preferences,
            // Split other strings by comma
            preferred_styles: brandInfo.preferred_styles ? brandInfo.preferred_styles.split(',').map(s => s.trim()) : [],
            forbidden_styles: brandInfo.forbidden_styles ? brandInfo.forbidden_styles.split(',').map(s => s.trim()) : [],
            mood_keywords: brandInfo.mood_keywords ? brandInfo.mood_keywords.split(',').map(s => s.trim()) : [],
            preferred_aspect_ratios: brandInfo.preferred_aspect_ratios ? brandInfo.preferred_aspect_ratios.split(',').map(s => s.trim()) : [],
            preferred_subjects: brandInfo.preferred_subjects ? brandInfo.preferred_subjects.split(',').map(s => s.trim()) : [],
            forbidden_subjects: brandInfo.forbidden_subjects ? brandInfo.forbidden_subjects.split(',').map(s => s.trim()) : [],
            style_notes: brandInfo.style_notes,
            restrictions_notes: brandInfo.restrictions_notes,
            general_notes: brandInfo.general_notes,
        };

        try {
            await createBrandProfile(createdClientId, payload);
            if (onSuccess) onSuccess();
            handleClose();
        } catch (err) {
            console.error("Step 2 failed:", err);
        }
    };

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/30 backdrop-blur-sm animate-in fade-in duration-200 p-4">
            <div className="bg-background/95 border border-white/50 p-0 rounded-3xl shadow-2xl max-w-2xl w-full flex flex-col max-h-[90vh] overflow-hidden" onClick={e => e.stopPropagation()}>

                {/* Cabecera del Modal */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100/50 bg-white/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-secondary-blue/10 rounded-full flex items-center justify-center text-secondary-blue">
                            {step === 1 ? <Building2 size={20} /> : <Palette size={20} />}
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-800 leading-tight">
                                {step === 1 ? 'Add New Client' : 'Brand Identity'}
                            </h2>
                            <p className="text-xs text-gray-500 font-medium">
                                Step {step} of 2
                            </p>
                        </div>
                    </div>
                    <button onClick={handleClose} className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-full transition-colors" disabled={isLoading}>
                        <X size={18} />
                    </button>
                </div>

                {/* Global Error Banner */}
                {error && (
                    <div className="bg-red-50 text-red-600 px-6 py-2 text-sm font-medium border-b border-red-100">
                        {error}
                    </div>
                )}

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full">

                    {step === 1 && (
                        <form id="step1-form" onSubmit={handleStep1Submit} className="flex flex-col gap-4 animate-in slide-in-from-right-4 duration-300">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-semibold text-gray-600 ml-1">Client Name</label>
                                    <input required value={basicInfo.name} onChange={e => setBasicInfo({ ...basicInfo, name: e.target.value })} className="h-10 px-4 rounded-xl border border-gray-200 bg-white text-sm focus:border-secondary-blue focus:ring-1 focus:ring-secondary-blue outline-none transition-all" placeholder="e.g. Acme Corp" disabled={isLoading} />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-semibold text-gray-600 ml-1">Slug</label>
                                    <input required value={basicInfo.slug} onChange={e => setBasicInfo({ ...basicInfo, slug: e.target.value })} className="h-10 px-4 rounded-xl border border-gray-200 bg-white text-sm focus:border-secondary-blue focus:ring-1 focus:ring-secondary-blue outline-none transition-all" placeholder="acme-corp" disabled={isLoading} />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-semibold text-gray-600 ml-1">Website</label>
                                    <input type="url" value={basicInfo.website} onChange={e => setBasicInfo({ ...basicInfo, website: e.target.value })} className="h-10 px-4 rounded-xl border border-gray-200 bg-white text-sm focus:border-secondary-blue outline-none transition-all" placeholder="https://..." disabled={isLoading} />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-semibold text-gray-600 ml-1">Industry</label>
                                    <input value={basicInfo.industry} onChange={e => setBasicInfo({ ...basicInfo, industry: e.target.value })} className="h-10 px-4 rounded-xl border border-gray-200 bg-white text-sm focus:border-secondary-blue outline-none transition-all" placeholder="Technology, Retail..." disabled={isLoading} />
                                </div>
                            </div>

                            {/* Added Logo URL Input */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-gray-600 ml-1">Logo URL (Optional)</label>
                                <input type="url" value={basicInfo.logo_url} onChange={e => setBasicInfo({ ...basicInfo, logo_url: e.target.value })} className="h-10 px-4 rounded-xl border border-gray-200 bg-white text-sm focus:border-secondary-blue outline-none transition-all" placeholder="https://example.com/logo.png" disabled={isLoading} />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-gray-600 ml-1">Description</label>
                                <textarea rows={3} value={basicInfo.description} onChange={e => setBasicInfo({ ...basicInfo, description: e.target.value })} className="p-4 rounded-xl border border-gray-200 bg-white text-sm focus:border-secondary-blue outline-none transition-all resize-none" placeholder="Brief description of the client..." disabled={isLoading} />
                            </div>
                        </form>
                    )}

                    {step === 2 && (
                        <form id="step2-form" onSubmit={handleStep2Submit} className="flex flex-col gap-6 animate-in slide-in-from-right-4 duration-300">

                            <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                                <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2"><Palette size={16} className="text-secondary-blue" /> Color Palette</h3>
                                <p className="text-xs text-gray-500 mb-4">Click the plus button to add specific brand colors.</p>

                                <div className="grid grid-cols-2 gap-6">
                                    {(['primary', 'secondary', 'accent', 'forbidden'] as const).map(type => {
                                        const colorKey = `${type}Colors` as const;
                                        const colorsArray = brandInfo[colorKey];

                                        return (
                                            <div key={type} className="flex flex-col gap-2">
                                                <div className="flex items-center justify-between">
                                                    <label className={`text-xs font-semibold ml-1 capitalize ${type === 'forbidden' ? 'text-red-500' : 'text-gray-600'}`}>{type} Colors</label>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleAddColor(colorKey)}
                                                        className="text-xs flex items-center gap-1 text-secondary-blue hover:text-blue-700 transition-colors font-medium bg-secondary-blue/10 px-2 py-1 rounded-md"
                                                    >
                                                        <Plus size={12} /> Add
                                                    </button>
                                                </div>

                                                <div className="flex flex-col gap-2 min-h-10">
                                                    {colorsArray.map((color, idx) => (
                                                        <div key={idx} className="flex items-center gap-2 animate-in fade-in zoom-in-95 duration-200">
                                                            {/* Native Color Picker */}
                                                            <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-gray-200 shadow-sm shrink-0 cursor-pointer">
                                                                <input
                                                                    type="color"
                                                                    value={color}
                                                                    onChange={e => handleUpdateColor(colorKey, idx, e.target.value)}
                                                                    className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer"
                                                                />
                                                            </div>
                                                            {/* Text Input for exact HEX typing */}
                                                            <input
                                                                type="text"
                                                                value={color.toUpperCase()}
                                                                onChange={e => handleUpdateColor(colorKey, idx, e.target.value)}
                                                                className="h-10 flex-1 px-3 rounded-xl border border-gray-200 bg-white text-sm font-mono text-gray-700 focus:border-secondary-blue outline-none uppercase"
                                                                maxLength={7}
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRemoveColor(colorKey, idx)}
                                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                            >
                                                                <X size={16} />
                                                            </button>
                                                        </div>
                                                    ))}
                                                    {colorsArray.length === 0 && (
                                                        <div className="h-10 flex items-center justify-center border border-dashed border-gray-300 rounded-xl bg-white/50">
                                                            <span className="text-[11px] text-gray-400 italic">No {type} colors added</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* ... (Aquí continúa la otra parte del form de Typography & Style que ya tenías) ... */}
                            <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                                <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2"><FileText size={16} className="text-secondary-blue" /> Typography & Style</h3>
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-semibold text-gray-600 ml-1">Typography Style</label>
                                        <input value={brandInfo.typography_style} onChange={e => setBrandInfo({ ...brandInfo, typography_style: e.target.value })} className="h-10 px-4 rounded-xl border border-gray-200 bg-white text-sm focus:border-secondary-blue outline-none transition-all" placeholder="Minimalist, bold..." disabled={isLoading} />
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-semibold text-gray-600 ml-1">Font Preferences</label>
                                        <input value={brandInfo.font_preferences} onChange={e => setBrandInfo({ ...brandInfo, font_preferences: e.target.value })} className="h-10 px-4 rounded-xl border border-gray-200 bg-white text-sm focus:border-secondary-blue outline-none transition-all" placeholder="Inter, Roboto..." disabled={isLoading} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-semibold text-gray-600 ml-1">Preferred Styles (comma separated)</label>
                                        <input value={brandInfo.preferred_styles} onChange={e => setBrandInfo({ ...brandInfo, preferred_styles: e.target.value })} className="h-10 px-4 rounded-xl border border-gray-200 bg-white text-sm focus:border-secondary-blue outline-none transition-all" placeholder="Modern, corporate..." disabled={isLoading} />
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-semibold text-gray-600 ml-1">Forbidden Styles (comma separated)</label>
                                        <input value={brandInfo.forbidden_styles} onChange={e => setBrandInfo({ ...brandInfo, forbidden_styles: e.target.value })} className="h-10 px-4 rounded-xl border border-gray-200 bg-white text-sm focus:border-secondary-blue outline-none transition-all" placeholder="Playful, retro..." disabled={isLoading} />
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-semibold text-gray-600 ml-1">Mood Keywords (comma separated)</label>
                                        <input value={brandInfo.mood_keywords} onChange={e => setBrandInfo({ ...brandInfo, mood_keywords: e.target.value })} className="h-10 px-4 rounded-xl border border-gray-200 bg-white text-sm focus:border-secondary-blue outline-none transition-all" placeholder="Trust, speed..." disabled={isLoading} />
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-semibold text-gray-600 ml-1">Aspect Ratios (comma separated)</label>
                                        <input value={brandInfo.preferred_aspect_ratios} onChange={e => setBrandInfo({ ...brandInfo, preferred_aspect_ratios: e.target.value })} className="h-10 px-4 rounded-xl border border-gray-200 bg-white text-sm focus:border-secondary-blue outline-none transition-all" placeholder="16:9, 1:1..." disabled={isLoading} />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100 flex flex-col gap-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-semibold text-gray-600 ml-1">Preferred Subjects (comma separated)</label>
                                        <input value={brandInfo.preferred_subjects} onChange={e => setBrandInfo({ ...brandInfo, preferred_subjects: e.target.value })} className="h-10 px-4 rounded-xl border border-gray-200 bg-white text-sm focus:border-secondary-blue outline-none transition-all" placeholder="People, nature..." disabled={isLoading} />
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-semibold text-gray-600 ml-1">Forbidden Subjects (comma separated)</label>
                                        <input value={brandInfo.forbidden_subjects} onChange={e => setBrandInfo({ ...brandInfo, forbidden_subjects: e.target.value })} className="h-10 px-4 rounded-xl border border-gray-200 bg-white text-sm focus:border-secondary-blue outline-none transition-all" placeholder="Violence, politics..." disabled={isLoading} />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-semibold text-gray-600 ml-1">General Notes</label>
                                    <textarea rows={2} value={brandInfo.general_notes} onChange={e => setBrandInfo({ ...brandInfo, general_notes: e.target.value })} className="p-4 rounded-xl border border-gray-200 bg-white text-sm focus:border-secondary-blue outline-none transition-all resize-none" placeholder="Any additional context..." disabled={isLoading} />
                                </div>
                            </div>
                        </form>
                    )}
                </div>

                {/* Footer / Action Buttons */}
                <div className="px-6 py-4 border-t border-gray-100/50 bg-white/50 flex justify-end gap-3">
                    <button
                        onClick={handleClose}
                        disabled={isLoading}
                        className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form={step === 1 ? "step1-form" : "step2-form"}
                        disabled={isLoading}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-secondary-blue hover:bg-blue-600 shadow-md hover:shadow-lg transition-all disabled:opacity-50"
                    >
                        {isLoading ? <Loader2 size={16} className="animate-spin" /> : (step === 1 ? <ChevronRight size={16} /> : <Check size={16} />)}
                        {step === 1 ? 'Next Step' : 'Save Client'}
                    </button>
                </div>

            </div>
        </div>
    );
}