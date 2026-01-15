"use client";

import { Plus, ChevronDown } from "lucide-react";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";


import { useModelUIStore } from "@/infrastructure/stores/model-ui.store";
import { Button } from "@/presentation/components/ui/button";
import { useModels } from "@/presentation/hooks/use-models";


const getModelIcon = (modelName: string) => {
    const name = modelName.toLowerCase();
    if (name.includes("gemini")) return "/Gemini.svg";
    if (name.includes("deepseek")) return "/DeepSeek.svg";
    if (name.includes("mistral")) return "/Mistral.svg";
    if (name.includes("claude")) return "/ClaudeAI.svg";
    if (name.includes("gpt")) return "/ChatGPT.svg";
    return null;
};

export const ModelSelector = () => {
    const { models, isLoading } = useModels();
    const { addModel } = useModelUIStore();

    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside 
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <Button
                variant="outline"
                onClick={() => setIsOpen(!isOpen)}
                className={`rounded-full bg-white border-white/40 text-black hover:bg-white/30 px-5 h-10 gap-2 font-medium transition-all ${isOpen ? "bg-white/40 ring-2 ring-white/20" : ""}`}
            >
                <Plus size={16} />
                Add model
                <ChevronDown size={14} className={`text-black/70 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </Button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 z-50 origin-top-right">
                    {/* Container with Glass effect + Soft shadow */}
                    <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="px-4 py-3 border-b border-black/5 bg-white/40">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                Available Models
                            </span>
                        </div>

                        <div className="max-h-80 overflow-y-auto py-1 custom-scrollbar">
                            {isLoading ? (
                                <div className="p-6 text-center text-sm text-gray-500">
                                    <div className="animate-spin w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full mx-auto mb-2" />
                                    Loading models...
                                </div>
                            ) : models.length > 0 ? (
                                models.map((model) => {
                                    const iconPath = getModelIcon(model.name);

                                    return (
                                        <button
                                            key={model.id}
                                            onClick={() => {
                                                addModel(model);
                                                setIsOpen(false);
                                            }}
                                            className="w-full text-left px-4 py-3 hover:bg-blue-50/80 transition-colors group border-l-2 border-transparent hover:border-blue-400 flex items-start gap-3"
                                        >
                                            <div className="mt-0.5 p-1.5 rounded-md bg-white border border-gray-100 shadow-sm group-hover:border-blue-200 group-hover:shadow-md transition-all flex items-center justify-center w-8 h-8">
                                                {iconPath && (
                                                    <Image
                                                        src={iconPath}
                                                        alt={model.name}
                                                        width={18}
                                                        height={18}
                                                        className="object-contain"
                                                    />
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-gray-700 group-hover:text-blue-700">
                                                    {model.name}
                                                </p>
                                            </div>
                                        </button>
                                    );
                                })
                            ) : (
                                <div className="p-4 text-sm text-center text-gray-400">
                                    No models found.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};