// @/presentation/components/features/chat/create-chat-modal.tsx
"use client";

import { X, Check, Bot } from "lucide-react";
import { useState } from "react";

import type { AIModel } from "@/domain/entities/model.entity";
import { useChatUIStore } from "@/infrastructure/stores/chat-ui.store";
import { Button } from "@/presentation/components/ui/button";
import { Input } from "@/presentation/components/ui/input";
import { useModels } from "@/presentation/hooks/use-models";


interface CreateChatModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const CreateChatModal = ({ isOpen, onClose }: CreateChatModalProps) => {
    const { models, isLoading } = useModels();
    const { addChat } = useChatUIStore();

    const [title, setTitle] = useState("");
    const [selectedModels, setSelectedModels] = useState<AIModel[]>([]);

    if (!isOpen) return null;

    const toggleModel = (model: AIModel) => {
        if (selectedModels.find((m) => m.id === model.id)) {
            setSelectedModels(selectedModels.filter((m) => m.id !== model.id));
        } else {
            setSelectedModels([...selectedModels, model]);
        }
    };

    const handleCreate = () => {
        if (selectedModels.length === 0) return;
        addChat(title, selectedModels);

        setTitle("");
        setSelectedModels([]);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-white/90 backdrop-blur-xl border border-white/50 rounded-3xl shadow-2xl p-6 relative">

                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800">New Chat Session</h2>
                    <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full transition-colors">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                {/* Body */}
                <div className="space-y-6">

                    {/* Title Input */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Chat Title</label>
                        <Input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Ex: Project Analysis..."
                            className="bg-white/50 border-gray-200 focus-visible:ring-blue-400"
                        />
                    </div>

                    {/* Model Selection */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex justify-between">
                            Select Models
                            <span className="text-blue-500">{selectedModels.length} selected</span>
                        </label>

                        <div className="h-48 overflow-y-auto custom-scrollbar border border-gray-100 rounded-xl bg-white/50 p-2 space-y-1">
                            {isLoading ? (
                                <div className="text-center p-4 text-sm text-gray-400">Loading models...</div>
                            ) : (
                                models.map((model) => {
                                    const isSelected = selectedModels.some(m => m.id === model.id);
                                    return (
                                        <div
                                            key={model.id}
                                            onClick={() => toggleModel(model)}
                                            className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all border ${isSelected ? 'bg-blue-50 border-blue-200' : 'hover:bg-white border-transparent'}`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`p-1.5 rounded-md ${isSelected ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                                                    <Bot size={16} />
                                                </div>
                                                <span className={`text-sm font-medium ${isSelected ? 'text-blue-700' : 'text-gray-700'}`}>
                                                    {model.name}
                                                </span>
                                            </div>
                                            {isSelected && <Check size={16} className="text-blue-600" />}
                                        </div>
                                    )
                                })
                            )}
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex gap-3 pt-2">
                        <Button variant="ghost" className="flex-1 rounded-xl" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button
                            className="flex-1 rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={handleCreate}
                            disabled={selectedModels.length === 0}
                        >
                            Create Chat
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};