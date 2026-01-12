"use client";

import { X, Check, Bot, Loader2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/presentation/components/ui/button";
import { Input } from "@/presentation/components/ui/input";
import { useModels } from "@/presentation/hooks/use-models";

interface CreateConversationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (title: string, modelId: string) => void;
    isLoading: boolean;
}

export const CreateConversationModal = ({ isOpen, onClose, onCreate, isLoading }: CreateConversationModalProps) => {
    const { models, isLoading: isLoadingModels } = useModels();

    const [title, setTitle] = useState("");

    // Temporally store selected model ID (as we only allow one selection)
    const [selectedModelId, setSelectedModelId] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleModelSelect = (id: string) => {
        if (selectedModelId === id) {
            setSelectedModelId(null);
        } else {
            setSelectedModelId(id);
        }
    };

    const handleCreate = () => {
        if (!selectedModelId) return;

        onCreate(title, selectedModelId);

        setTitle("");
        setSelectedModelId(null);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-white/90 backdrop-blur-xl border border-white/50 rounded-3xl shadow-2xl p-6 relative">

                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800">New Conversation Session</h2>
                    <button onClick={onClose} disabled={isLoading} className="p-1 hover:bg-gray-200 rounded-full transition-colors disabled:opacity-50">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                {/* Body */}
                <div className="space-y-6">

                    {/* Title Input */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Conversation Title</label>
                        <Input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Ex: Project Analysis..."
                            className="bg-white/50 border-gray-200 focus-visible:ring-blue-400"
                            disabled={isLoading}
                        />
                    </div>

                    {/* Model Selection */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-end">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Select Model
                            </label>
                            <span className={`text-xs font-medium ${selectedModelId ? "text-blue-600" : "text-amber-600"}`}>
                                {selectedModelId ? "1 selected" : "Select one model"}
                            </span>
                        </div>

                        <div className="h-48 overflow-y-auto custom-scrollbar border border-gray-100 rounded-xl bg-white/50 p-2 space-y-1">
                            {isLoadingModels ? (
                                <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
                                    <Loader2 className="animate-spin" size={20} />
                                    <span className="text-sm">Loading models...</span>
                                </div>
                            ) : (
                                models.map((model) => {
                                    const isSelected = selectedModelId === model.id;

                                    return (
                                        <div
                                            key={model.id}
                                            onClick={() => !isLoading && handleModelSelect(model.id)}
                                            className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all border 
                                                ${isSelected
                                                    ? 'bg-blue-50 border-blue-200 shadow-sm'
                                                    : 'hover:bg-white border-transparent hover:shadow-sm'}
                                                ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                                            `}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`p-1.5 rounded-md transition-colors ${isSelected ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                                                    <Bot size={16} />
                                                </div>
                                                <span className={`text-sm font-medium transition-colors ${isSelected ? 'text-blue-700' : 'text-gray-700'}`}>
                                                    {model.name}
                                                </span>
                                            </div>

                                            {/* Check visual */}
                                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${isSelected ? 'border-blue-500 bg-blue-500 text-white' : 'border-gray-300'}`}>
                                                {isSelected && <Check size={12} strokeWidth={3} />}
                                            </div>
                                        </div>
                                    )
                                })
                            )}
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex gap-3 pt-2">
                        <Button variant="ghost" className="flex-1 rounded-xl" onClick={onClose} disabled={isLoading}>
                            Cancel
                        </Button>
                        <Button
                            className="flex-1 rounded-xl bg-blue-600 hover:bg-blue-700 text-white gap-2"
                            onClick={handleCreate}

                            disabled={isLoading || !selectedModelId || !title.trim()}
                        >
                            {isLoading && <Loader2 className="animate-spin" size={16} />}
                            {isLoading ? "Creating..." : "Create Conversation"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};