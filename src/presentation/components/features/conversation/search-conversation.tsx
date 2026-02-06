import { Search, MessageSquare, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

import { useConversationUIStore } from "@/infrastructure/stores/conversation-ui.store";

import { Input } from '../../ui/input';

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (conversationId: string) => void;
}

export const SearchModal = ({ isOpen, onClose, onSelect }: SearchModalProps) => {

    const inputRef = useRef<HTMLInputElement>(null);
    const [query, setQuery] = useState("");
    const conversations = useConversationUIStore((state) => state.activeConversations);

    const filteredResults = conversations.filter((chat) =>
        chat.title.toLowerCase().includes(query.toLowerCase())
    );

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-100 flex items-start justify-center pt-[12vh] bg-black/20 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                className="w-full max-w-2xl bg-background/95 backdrop-blur-xl border border-white/50 shadow-2xl rounded-3xl overflow-hidden flex flex-col mx-4 animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center px-5 py-4 border-b border-gray-100/50">
                    <Search className="w-5 h-5 text-gray-400 mr-3" />
                    <Input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search in your conversations..."
                        className="flex-1 bg-transparent border-none outline-none text-lg text-gray-800 placeholder:text-gray-400 focus-visible:ring-0 shadow-none"
                    />
                    <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full transition-colors">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                <div className="max-h-[50vh] overflow-y-auto p-2 custom-scrollbar">
                    {filteredResults.length > 0 ? (
                        <div className="space-y-1">
                            {filteredResults.map((chat) => (
                                <button
                                    key={chat.id}
                                    onClick={() => {
                                        onSelect(chat.id);
                                        onClose();
                                    }}
                                    className="w-full flex items-center px-3 py-3 rounded-2xl hover:bg-gray-100/80 transition-all group text-left"
                                >
                                    <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-400 shadow-sm mr-4 group-hover:border-blue-200 group-hover:text-blue-500 transition-all">
                                        <MessageSquare size={18} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-semibold text-gray-800 truncate">
                                            {chat.title}
                                        </h4>
                                        <p className="text-xs text-gray-500 truncate">
                                            {chat.models?.map(m => m.name).join(", ")}
                                        </p>
                                    </div>
                                    <div className="text-[11px] text-gray-400 ml-4 whitespace-nowrap">
                                        {chat.createdAt ? new Date(chat.createdAt).toLocaleDateString() : ''}
                                    </div>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="py-12 text-center">
                            <p className="text-sm text-gray-500">
                                {query ? `No results for "${query}"` : "No conversations found"}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};