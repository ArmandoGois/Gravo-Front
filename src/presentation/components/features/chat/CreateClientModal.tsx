import { X, ChevronRight, Check, Loader2, Building2, Palette, FileText } from 'lucide-react';
import React, { useState } from 'react';

interface CreateClientModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export const CreateClientModal = ({ isOpen, onClose, onSuccess }: CreateClientModalProps) => {

    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const [basicInfo, setBasicInfo] = useState({
        name: '', slug: '', description: '', website: '', industry: ''
    });

    const [brandInfo, setBrandInfo] = useState({
        primaryColors: '', secondaryColors: '', accentColors: '', forbiddenColors: '',
        typography_style: '', font_preferences: '',
        preferred_styles: '', forbidden_styles: '', mood_keywords: '',
        preferred_aspect_ratios: '', preferred_subjects: '', forbidden_subjects: '',
        style_notes: '', restrictions_notes: '', general_notes: ''
    });

    if (!isOpen) return null;

    const handleStep1Submit = (e: React.FormEvent) => {
        e.preventDefault();
        setStep(2);
    };

    const handleStep2Submit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);


        setTimeout(() => {
            setIsLoading(false);
            if (onSuccess) onSuccess();
            onClose();
            setStep(1);
        }, 800);
    };

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/30 backdrop-blur-sm animate-in fade-in duration-200 p-4">
            <div className="bg-background/95 border border-white/50 p-0 rounded-3xl shadow-2xl max-w-2xl w-full flex flex-col max-h-[90vh] overflow-hidden" onClick={e => e.stopPropagation()}>

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
                    <button onClick={onClose} className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-full transition-colors">
                        <X size={18} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full">

                    {step === 1 && (
                        <form id="step1-form" onSubmit={handleStep1Submit} className="flex flex-col gap-4 animate-in slide-in-from-right-4 duration-300">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-semibold text-gray-600 ml-1">Client Name</label>
                                    <input required value={basicInfo.name} onChange={e => setBasicInfo({ ...basicInfo, name: e.target.value })} className="h-10 px-4 rounded-xl border border-gray-200 bg-white text-sm focus:border-secondary-blue focus:ring-1 focus:ring-secondary-blue outline-none transition-all" placeholder="e.g. Acme Corp" />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-semibold text-gray-600 ml-1">Slug</label>
                                    <input required value={basicInfo.slug} onChange={e => setBasicInfo({ ...basicInfo, slug: e.target.value })} className="h-10 px-4 rounded-xl border border-gray-200 bg-white text-sm focus:border-secondary-blue focus:ring-1 focus:ring-secondary-blue outline-none transition-all" placeholder="acme-corp" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-semibold text-gray-600 ml-1">Website</label>
                                    <input type="url" value={basicInfo.website} onChange={e => setBasicInfo({ ...basicInfo, website: e.target.value })} className="h-10 px-4 rounded-xl border border-gray-200 bg-white text-sm focus:border-secondary-blue outline-none transition-all" placeholder="https://..." />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-semibold text-gray-600 ml-1">Industry</label>
                                    <input value={basicInfo.industry} onChange={e => setBasicInfo({ ...basicInfo, industry: e.target.value })} className="h-10 px-4 rounded-xl border border-gray-200 bg-white text-sm focus:border-secondary-blue outline-none transition-all" placeholder="Technology, Retail..." />
                                </div>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-gray-600 ml-1">Description</label>
                                <textarea rows={3} value={basicInfo.description} onChange={e => setBasicInfo({ ...basicInfo, description: e.target.value })} className="p-4 rounded-xl border border-gray-200 bg-white text-sm focus:border-secondary-blue outline-none transition-all resize-none" placeholder="Brief description of the client..." />
                            </div>
                        </form>
                    )}

                    {step === 2 && (
                        <form id="step2-form" onSubmit={handleStep2Submit} className="flex flex-col gap-6 animate-in slide-in-from-right-4 duration-300">

                            <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                                <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2"><Palette size={16} className="text-secondary-blue" /> Color Palette</h3>
                                <p className="text-xs text-gray-500 mb-4">Separate multiple values with commas (e.g. #FFF, #000, blue).</p>
                                <div className="grid grid-cols-2 gap-4">
                                    {['primary', 'secondary', 'accent', 'forbidden'].map(type => {
                                        const colorKey = `${type}Colors` as keyof typeof brandInfo;
                                        const colorString = brandInfo[colorKey] as string;
                                        const colorsArray = colorString.split(',').map(c => c.trim()).filter(Boolean);

                                        return (
                                            <div key={type} className="flex flex-col gap-1.5">
                                                <label className="text-xs font-semibold text-gray-600 ml-1 capitalize">{type} Colors</label>
                                                <input
                                                    value={colorString}
                                                    onChange={e => setBrandInfo({ ...brandInfo, [colorKey]: e.target.value })}
                                                    className="h-10 px-4 rounded-xl border border-gray-200 bg-white text-sm focus:border-secondary-blue outline-none transition-all"
                                                    placeholder="#hex, blue"
                                                />
                                                <div className="flex flex-wrap gap-1.5 min-h-6 px-1 mt-0.5">
                                                    {colorsArray.map((color, idx) => (
                                                        <div
                                                            key={idx}
                                                            className="w-6 h-6 rounded-md border border-gray-300 shadow-sm shrink-0"
                                                            style={{ backgroundColor: color }}
                                                            title={color}
                                                        />
                                                    ))}
                                                    {colorsArray.length === 0 && (
                                                        <span className="text-[10px] text-gray-400 italic flex items-center">No colors yet</span>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                                <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2"><FileText size={16} className="text-secondary-blue" /> Typography & Style</h3>
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-semibold text-gray-600 ml-1">Typography Style</label>
                                        <input value={brandInfo.typography_style} onChange={e => setBrandInfo({ ...brandInfo, typography_style: e.target.value })} className="h-10 px-4 rounded-xl border border-gray-200 bg-white text-sm focus:border-secondary-blue outline-none transition-all" placeholder="Minimalist, bold..." />
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-semibold text-gray-600 ml-1">Font Preferences</label>
                                        <input value={brandInfo.font_preferences} onChange={e => setBrandInfo({ ...brandInfo, font_preferences: e.target.value })} className="h-10 px-4 rounded-xl border border-gray-200 bg-white text-sm focus:border-secondary-blue outline-none transition-all" placeholder="Inter, Roboto..." />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-semibold text-gray-600 ml-1">Preferred Styles</label>
                                        <input value={brandInfo.preferred_styles} onChange={e => setBrandInfo({ ...brandInfo, preferred_styles: e.target.value })} className="h-10 px-4 rounded-xl border border-gray-200 bg-white text-sm focus:border-secondary-blue outline-none transition-all" placeholder="Modern, corporate..." />
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-semibold text-gray-600 ml-1">Forbidden Styles</label>
                                        <input value={brandInfo.forbidden_styles} onChange={e => setBrandInfo({ ...brandInfo, forbidden_styles: e.target.value })} className="h-10 px-4 rounded-xl border border-gray-200 bg-white text-sm focus:border-secondary-blue outline-none transition-all" placeholder="Playful, retro..." />
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-semibold text-gray-600 ml-1">Mood Keywords</label>
                                        <input value={brandInfo.mood_keywords} onChange={e => setBrandInfo({ ...brandInfo, mood_keywords: e.target.value })} className="h-10 px-4 rounded-xl border border-gray-200 bg-white text-sm focus:border-secondary-blue outline-none transition-all" placeholder="Trust, speed..." />
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-semibold text-gray-600 ml-1">Aspect Ratios</label>
                                        <input value={brandInfo.preferred_aspect_ratios} onChange={e => setBrandInfo({ ...brandInfo, preferred_aspect_ratios: e.target.value })} className="h-10 px-4 rounded-xl border border-gray-200 bg-white text-sm focus:border-secondary-blue outline-none transition-all" placeholder="16:9, 1:1..." />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100 flex flex-col gap-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-semibold text-gray-600 ml-1">Preferred Subjects</label>
                                        <input value={brandInfo.preferred_subjects} onChange={e => setBrandInfo({ ...brandInfo, preferred_subjects: e.target.value })} className="h-10 px-4 rounded-xl border border-gray-200 bg-white text-sm focus:border-secondary-blue outline-none transition-all" placeholder="People, nature..." />
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-semibold text-gray-600 ml-1">Forbidden Subjects</label>
                                        <input value={brandInfo.forbidden_subjects} onChange={e => setBrandInfo({ ...brandInfo, forbidden_subjects: e.target.value })} className="h-10 px-4 rounded-xl border border-gray-200 bg-white text-sm focus:border-secondary-blue outline-none transition-all" placeholder="Violence, politics..." />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-semibold text-gray-600 ml-1">General Notes</label>
                                    <textarea rows={2} value={brandInfo.general_notes} onChange={e => setBrandInfo({ ...brandInfo, general_notes: e.target.value })} className="p-4 rounded-xl border border-gray-200 bg-white text-sm focus:border-secondary-blue outline-none transition-all resize-none" placeholder="Any additional context..." />
                                </div>
                            </div>
                        </form>
                    )}
                </div>

                <div className="px-6 py-4 border-t border-gray-100/50 bg-white/50 flex justify-end gap-3">
                    <button
                        onClick={onClose}
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