'use client';

import {
    Image as ImageIcon,
    Settings,
    Paperclip,
    Mic,
    Globe,
    ArrowUp,
    Search,
    SquarePen,
    ChevronDown,
    X,
    ChevronUp,
    Sun,
    Trash2,
    Moon,
    Bell,
    MessageSquare,
    PanelLeftOpen,
    Monitor,
    Loader2
} from 'lucide-react';
import Image from 'next/image';
import { useState, useMemo, useEffect, useRef } from 'react';

import { MessageContentPayload } from '@/domain/entities/message.entity';
import { useConversationUIStore } from "@/infrastructure/stores/conversation-ui.store";
import { useMessageUIStore } from "@/infrastructure/stores/message-ui.store";
import { useModelUIStore } from "@/infrastructure/stores/model-ui.store";
import { CreateConversationModal } from "@/presentation/components/features/conversation/conversation-creator";
import { ModelSelector } from "@/presentation/components/features/models/model-selector";
import { Button } from '@/presentation/components/ui/button';
import { Card, CardFooter, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { Input } from '@/presentation/components/ui/input';
import { useAuth } from '@/presentation/hooks/use-auth';
import { useConversationMessages } from "@/presentation/hooks/use-conversation-messages";
import { useConversations } from "@/presentation/hooks/use-conversations";
import { useCreateConversation } from "@/presentation/hooks/use-create-conversation";
import { useDeleteConversation } from "@/presentation/hooks/use-delete-conversation";
import { useModels } from '@/presentation/hooks/use-models';
import { useSendMessage } from "@/presentation/hooks/use-send-message";

import { ModelIcon } from '../models/model-icons';




export const ChatHub = () => {
    //Use States
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isCreateConversationOpen, setIsCreateConversationOpen] = useState(false);
    const [isAsideOpen, setAsideOpen] = useState(false);
    const [isSearchActive, setIsSearchActive] = useState(false);
    const [memoryValue, setMemoryValue] = useState(10);
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [showModelAlert, setShowModelAlert] = useState(false);
    const [conversationToDelete, setConversationToDelete] = useState<string | null>(null);

    const { logout, user } = useAuth();

    //Stores
    const { activeModels, addModel, removeModel, setModels } = useModelUIStore();
    const { activeConversations } = useConversationUIStore();
    const { selectedConversationId, selectConversation, messages, setMessages } = useMessageUIStore();

    //Hooks for data fetching
    const { models: availableModels } = useModels();
    const { isLoading: isLoadingChats } = useConversations();
    const { isLoading: isLoadingMessages } = useConversationMessages();

    //Hooks for actions   
    const { createConversation, isCreating } = useCreateConversation(() => {
        setIsCreateConversationOpen(false);
    });
    const { deleteConversation } = useDeleteConversation();
    const { sendMessage, isSending } = useSendMessage();

    //Autoscroll to bottom on new messages
    const messagesEndRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleCreateConversation = (title: string, modelId: string) => {
        createConversation({ title, model_id: modelId });
    };

    const handleConversationClick = (id: string) => {
        if (selectedConversationId === id) return;

        selectConversation(id);

        const currentConversation = activeConversations.find(c => c.id === id);

        if (currentConversation && currentConversation.models) {
            setModels(currentConversation.models);
        }
    };

    const renderMessageContent = (content: string | MessageContentPayload) => {
        if (typeof content === 'string') {
            return content;
        }

        if (content && typeof content === 'object' && 'text' in content) {
            return content.text;
        }

        return JSON.stringify(content);
    };

    const recommendedCards = useMemo(() => [
        {
            title: 'Flagship models',
            keywords: ['gpt-4', 'gemini', 'claude', 'opus'],
            logos: [
                { src: '/Gemini.svg', alt: 'Gemini' },
                { src: '/Grok.svg', alt: 'Grok' },
                { src: '/DeepSeek.svg', alt: 'DeepSeek' },
                { src: '/Mistral.svg', alt: 'Mistral' }
            ]
        },
        {
            title: 'Best roleplay models',
            keywords: ['mistral', 'llama', 'roleplay'],
            logos: [{ src: '/Mistral.svg', alt: 'Mistral' }]
        },
        {
            title: 'Best coding models',
            keywords: ['deepseek', 'codellama', 'claude'],
            logos: [{ src: '/DeepSeek.svg', alt: 'DeepSeek' }]
        },
        {
            title: 'Reasoning models',
            keywords: ['o1', 'reasoning', 'thinking'],
            logos: [{ src: '/Gemini.svg', alt: 'Gemini' }]
        }
    ], []);

    const handleCardClick = (keywords: string[]) => {
        const modelsToAdd = availableModels.filter(model =>
            keywords.some(keyword =>
                model.id.toLowerCase().includes(keyword) ||
                model.name?.toLowerCase().includes(keyword)
            )
        );

        modelsToAdd.forEach(model => {
            const isAlreadyActive = activeModels.some(m => m.id === model.id);
            if (!isAlreadyActive) {
                addModel(model);
            }
        });
    };

    const handleSendMessage = () => {
        if (!inputValue.trim()) return;
        if (activeModels.length === 0) {
            setShowModelAlert(true);
            setTimeout(() => {
                setShowModelAlert(false);
            }, 3000);
            return;
        }

        const textToSend = inputValue;
        setInputValue("");

        const currentId = selectedConversationId || "temp-new-chat";

        if (!selectedConversationId) {
            selectConversation(currentId);
        }

        const tempUserMessage = {
            id: crypto.randomUUID(),
            role: "user" as const,
            content: textToSend,
            conversation_id: currentId,
            created_at: new Date().toISOString()
        };

        setMessages([...messages, tempUserMessage]);

        sendMessage(textToSend);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        //Simulate background
        <div className="w-full h-full bg-linear-to-br flex items-center justify-start md:p-1 pt-0 font-sans">

            {/* Create newConversation window */}
            <CreateConversationModal
                isOpen={isCreateConversationOpen}
                onClose={() => setIsCreateConversationOpen(false)}
                onCreate={handleCreateConversation}
                isLoading={isCreating}
            />

            <div className="w-full max-w-full flex flex-col gap-1 pb-0 pt-1">

                {/* Header */}
                <div className="relative z-50 w-full h-14 rounded-2xl bg-white/40 backdrop-blur-xl border border-white/40 shadow-sm flex items-center justify-between px-6">
                    {/* Logo */}
                    <div
                        className="flex items-center gap-2 cursor-pointer transition-opacity hover:opacity-80"
                        onClick={() => {
                            selectConversation(null);
                            setModels([]);
                            setIsSearchActive(false);
                            setIsPopoverOpen(false);
                        }}
                    >
                        <div className="relative w-10 h-10 flex items-center justify-center">
                            <Image
                                src="/kromaticos_logo.svg"
                                alt="Kromaticos Logo"
                                width={35}
                                height={35}
                                className="object-contain"
                            />
                            <span className="absolute -top-1 -right-7 bg-red-500 text-white text-[13px] font-bold px-2 rounded-sm">IA</span>
                        </div>
                    </div>

                    {/* Nav Central */}
                    <nav className="hidden lg:flex items-center bg-white rounded-full px-1 py-1 shadow-sm gap-1 h-12 ">
                        <Button variant="ghost" className="rounded-full text-gray-500 hover:text-gray-900 h-9 px-4 text-sm font-medium">Models</Button>
                        <Button variant="ghost" className="rounded-full bg-[#5C8CB3] text-white hover:bg-[#4a7a9f] h-9 px-5 text-sm font-medium shadow-sm">Chat</Button>
                        <Button variant="ghost" className="rounded-full text-gray-500 hover:text-gray-900 h-9 px-4 text-sm font-medium">Ranking</Button>
                        <Button variant="ghost" className="rounded-full text-gray-500 hover:text-gray-900 h-9 px-4 text-sm font-medium">Enterprise</Button>
                        <Button variant="ghost" className="rounded-full text-gray-500 hover:text-gray-900 h-9 px-4 text-sm font-medium">Pricing</Button>
                        <Button variant="ghost" className="rounded-full text-gray-500 hover:text-gray-900 h-9 px-4 text-sm font-medium">Docs</Button>

                    </nav>

                    {/* User Profile */}
                    <div className="flex items-center gap-3">
                        <nav className="hidden lg:flex items-center bg-white rounded-full px-2.5 py-1 shadow-sm gap-3 h-12 w-fit">
                            <Button variant="ghost" size="icon" className="rounded-full bg-gray-200 hover:bg-white shadow-sm w-10 h-10 text-gray-600">
                                <Bell size={20} />
                            </Button>
                            <Button variant="ghost" size="icon" className="rounded-full bg-gray-200 hover:bg-white shadow-sm w-10 h-10 text-gray-600">
                                <Search size={20} />
                            </Button>
                        </nav>
                        {/* Deployable Menu */}
                        <div className='relative'>
                            <div
                                className="flex items-center bg-white rounded-full p-1 pr-4 gap-3 shadow-sm cursor-pointer hover:bg-gray-50 transition-colors h-12"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                            >
                                <div className="w-12 h-12 rounded-full overflow-hidden pl-1 pt-0.5">
                                    <Image src="/user_avatar.svg" alt="User" width={46} height={44} />
                                </div>
                                <div className="flex flex-col text-left leading-none">
                                    <span className="text-[15px] font-bold text-gray-800">
                                        User (Placeholder)
                                    </span>
                                    <span className="text-[15px] text-gray-500">
                                        {user?.email || 'Loading...'}
                                    </span>
                                </div>
                                {!isMenuOpen ? (
                                    <ChevronDown size={18} className="text-gray-400" />
                                ) : (
                                    <ChevronUp size={18} className="text-gray-400" />
                                )}
                                {isMenuOpen && (
                                    <div className="absolute top-full right-0 mt-2 w-36 bg-white rounded-xl shadow-xl border border-gray-100 p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                                        <ul className="flex flex-col gap-0.5">
                                            {['Credits', 'Keys', 'Activity', 'Settings', 'Enterprise'].map((item) => (
                                                <li key={item} className="px-3 py-1.5 text-sm text-gray-600 hover:text-black hover:bg-gray-50 rounded-lg cursor-pointer transition-colors font-medium">
                                                    {item}
                                                </li>
                                            ))}

                                            <li
                                                onClick={() => logout()}
                                                className="px-3 py-1.5 text-sm text-gray-600 hover:text-black hover:bg-gray-50 rounded-lg cursor-pointer transition-colors font-medium">
                                                Sign out
                                            </li>
                                        </ul>

                                        <div className="h-px bg-gray-100 my-1.5 mx-1" />

                                        <div className="bg-gray-100 p-0.5 rounded-lg flex items-center justify-between">
                                            <button className="flex-1 flex items-center justify-center py-1 rounded-md bg-white shadow-sm transition-all">
                                                <Sun size={14} className="text-gray-900" />
                                            </button>
                                            <button className="flex-1 flex items-center justify-center py-1 rounded-md text-gray-400 hover:text-gray-600 transition-all">
                                                <Moon size={14} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Card */}
                <div className="w-full h-[89.5vh] flex gap-6 p-0 pt-0 pb-1 not-rounded relative">

                    {/* Sidebar */}
                    <aside
                        className={`hidden md:flex flex-col h-full shrink-0 transition-all duration-300 ease-in-out ${isAsideOpen ? 'w-65' : 'w-15'}`}
                    >
                        <Card className={`h-full w-full flex flex-col bg-white/20 backdrop-blur-3xl border border-white/20 shadow-xl rounded-[2.5rem] overflow-hidden transition-all duration-300 ${isAsideOpen ? 'p-5' : 'py-5 px-2 items-center'}`}>

                            <div className={`flex items-center w-full mb-6 transition-all duration-300 ${isAsideOpen ? 'gap-2 justify-between' : 'justify-center'}`}>
                                {isAsideOpen && (
                                    <div className="relative w-full opacity-100 animate-in fade-in duration-300">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
                                        <Input
                                            className="w-full bg-white border-0 rounded-xl h-11 pl-10 text-sm placeholder:text-gray-600 focus-visible:ring-1 focus-visible:ring-white/50 shadow-inner"
                                            placeholder="Search rooms..."
                                        />
                                    </div>
                                )}

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setAsideOpen(!isAsideOpen)}
                                    className={'h-10 w-10 rounded-full bg-white hover:bg-white/40 text-gray-600 shrink-0 shadow-sm'}
                                >
                                    {isAsideOpen ? (
                                        <X size={20} />
                                    ) : (
                                        <PanelLeftOpen size={20} />
                                    )}
                                </Button>
                            </div>


                            <div className={`flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar w-full transition-opacity duration-300 ${isAsideOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>
                                <h3 className="text-xs font-bold text-gray-800 tracking-wider pl-2 mb-2">Active Chats</h3>

                                {/* Render of Active Chats */}

                                {isLoadingChats && activeConversations.length === 0 && (
                                    <div className="flex flex-col gap-2 px-2 animate-pulse">
                                        <div className="h-10 bg-white/30 rounded-xl w-full"></div>
                                        <div className="h-10 bg-white/30 rounded-xl w-full"></div>
                                        <div className="h-10 bg-white/30 rounded-xl w-full"></div>
                                        <p className="text-xs text-gray-500 text-center mt-2">Syncing history...</p>
                                    </div>
                                )}

                                {!isLoadingChats && activeConversations.length === 0 && (
                                    <p className="text-xs text-gray-500 italic pl-2">No active conversations.</p>
                                )}

                                {activeConversations.length === 0 && (
                                    <p className="text-xs text-white italic pl-2">No active Conversations.</p>
                                )}

                                {activeConversations.map(conversation => (
                                    <div
                                        key={conversation.id}
                                        onClick={() => handleConversationClick(conversation.id)}
                                        className={`group flex items-center justify-between px-3 py-3 rounded-xl cursor-pointer transition-all border border-transparent 
                                            ${selectedConversationId === conversation.id
                                                ? 'bg-white shadow-md border-white/60'
                                                : 'bg-white/40 hover:bg-white/70 hover:border-white/50'
                                            }`}
                                    >
                                        <div className="flex flex-col overflow-hidden max-w-[80%]">
                                            <div className="flex items-center gap-2">
                                                <MessageSquare size={14} className={selectedConversationId === conversation.id ? "text-blue-600" : "text-gray-600"} />
                                                <span className="text-sm font-semibold text-gray-800 truncate">{conversation.title}</span>
                                            </div>
                                            <span className="text-[10px] text-gray-500 pl-6 truncate">
                                                {conversation.models.length} models
                                            </span>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setConversationToDelete(conversation.id);
                                            }}
                                            className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-100 text-red-400 rounded-lg transition-all"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </aside>

                    {conversationToDelete && (
                        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/20 backdrop-blur-sm animate-in fade-in duration-200">

                            <div
                                className="bg-white/90 border border-white/50 p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] max-w-xs w-full text-center transform transition-all scale-100 m-4"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
                                    <Trash2 size={24} />
                                </div>

                                <h3 className="text-lg font-bold text-gray-800 mb-2">Delete chat?</h3>
                                <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                                    All messages in this conversation will be permanently deleted.
                                </p>

                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setConversationToDelete(null)}
                                        className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (conversationToDelete) {
                                                deleteConversation(conversationToDelete);
                                                setConversationToDelete(null);
                                            }
                                        }}
                                        className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/30 transition-all hover:scale-[1.02]"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}


                    {/* Main Content */}
                    <main className="flex-1 relative flex flex-col h-full p-0 rounded-[2.5rem] overflow-hidden">

                        {/* New Conversation & Add Model */}
                        <div className="absolute top-6 right-8 flex items-center gap-3 z-30">

                            {/* Models list */}
                            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide mask-gradient pr-2">

                                {activeModels.length === 0 && (
                                    <p className="text-xs text-black italic pl-2 whitespace-nowrap">
                                        No active models.
                                    </p>
                                )}

                                {/* Models mapping */}
                                {activeModels.map((model) => (
                                    <div
                                        key={model.id}
                                        className="shrink-0  h-10 group flex items-center justify-between px-3 py-2 rounded-full bg-white hover:bg-white/60 cursor-pointer transition-all border border-white/20 hover:border-white/50 shadow-sm backdrop-blur-md">
                                        <div className="flex items-center gap-2 overflow-hidden">
                                            {model.id && (
                                                <ModelIcon modelName={model.id} />
                                            )}
                                            <span className="text-xs text-gray-800 font-medium whitespace-nowrap">
                                                {model.title}
                                            </span>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeModel(model.id);
                                            }}
                                            className="opacity-0 group-hover:opacity-100 ml-2 p-0.5 hover:bg-red-100 rounded-full text-red-400 transition-all shrink-0">
                                            <X size={12} />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {activeModels.length > 0 && <div className="h-6 w-px bg-white/30 shrink-0 mx-1"></div>}

                            <Button
                                onClick={() => setIsCreateConversationOpen(true)}
                                variant="outline"
                                className="rounded-full bg-white border-white/40 text-black hover:bg-white/30 px-5 h-10 gap-2 font-medium backdrop-blur-md whitespace-nowrap">
                                <SquarePen size={16} /> <span className="hidden sm:inline">New chat</span>
                            </Button>

                            <div className="shrink-0">
                                <ModelSelector />
                            </div>

                        </div>


                        <div className="flex-1 overflow-y-auto px-4 md:px-16 pt-20 pb-48 scrollbar-hide">

                            {/* A: No chat selected -> Cards */}
                            {!selectedConversationId ? (
                                <>
                                    <div className="mb-12 space-y-2 mx-auto">
                                        <h1 className="text-4xl md:text-6xl font-light text-white tracking-tight drop-shadow-md">Welcome to the chat.</h1>
                                        <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight drop-shadow-md opacity-90">Write your message below.</h1>
                                    </div>

                                    {activeModels.length === 0 && (
                                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 max-w-5xl mx-auto animate-in fade-in zoom-in-95 duration-300">
                                            {recommendedCards.map((card, idx) => (
                                                <Card
                                                    key={idx}
                                                    onClick={() => handleCardClick(card.keywords)}
                                                    className="group h-40 rounded-4xl bg-white/90 border-0 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between p-1"
                                                >
                                                    <CardHeader className="px-6 pt-6 pb-0">
                                                        <CardTitle className="text-xl font-medium text-gray-700 group-hover:text-black">
                                                            {card.title}
                                                        </CardTitle>
                                                    </CardHeader>

                                                    <CardFooter className="px-6 pb-4 flex justify-end gap-2">
                                                        {card.logos.map((logo, i) => (
                                                            <div key={i} className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-gray-100 shadow-sm group-hover:scale-110 transition-transform">
                                                                <Image src={logo.src} alt={logo.alt} width={18} height={18} className="opacity-70 group-hover:opacity-100 transition-opacity" />
                                                            </div>
                                                        ))}
                                                    </CardFooter>
                                                </Card>
                                            ))}
                                        </div>
                                    )}
                                </>
                            ) : (
                                /* B: chat selected -> messages */
                                <div className="flex flex-col gap-6 max-w-4xl mx-auto py-4">

                                    {isLoadingMessages ? (
                                        <div className="flex justify-center items-center h-40">
                                            <Loader2 className="animate-spin text-white w-8 h-8" />
                                        </div>
                                    ) : messages.length === 0 ? (
                                        <div className="text-center text-white/70 italic mt-10">
                                            No messages yet. Start the conversation!
                                        </div>
                                    ) : (
                                        activeModels.map((model) => (
                                            messages.map((msg) => (
                                                <div
                                                    key={msg.id}
                                                    className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>

                                                    <div className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>

                                                        <div className="flex items-center gap-2 mb-2 opacity-70 text-xs font-semibold uppercase tracking-wider">
                                                            <span>{msg.role}</span>
                                                            {msg.role === 'user' ? <Image src="/user_avatar.svg" alt="User" width={30} height={30} /> : <ModelIcon modelName={model.id} />}
                                                        </div>

                                                        <div
                                                            className={`rounded-3xl p-5 shadow-sm text-sm leading-relaxed w-full
                                                                ${msg.role === 'user'
                                                                    ? 'bg-white backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl'
                                                                    : 'bg-white text-gray-800 rounded-tl-sm'
                                                                }`}>

                                                            <div className="whitespace-pre-wrap">
                                                                {renderMessageContent(msg.content)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))))
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>
                            )}
                        </div>

                        {/* Input Area */}

                        <div className="w-full h-36 px-4 md:px-16 pb-0 z-40 flex justify-center  shrink-0">

                            <Card className="w-full max-w-5xl bg-[#F3F4F6]/80 backdrop-blur-2xl rounded-4xl p-2 shadow-2xl border border-white/60">

                                <div className="flex gap-3 mb-3 px-2">
                                    <Button size="sm" variant="ghost" className="h-8 rounded-full bg-white/80 border border-gray-400 text-gray-600 text-xs font-bold gap-2 hover:bg-white shadow-sm">
                                        <ImageIcon size={14} /> Image
                                    </Button>
                                    <Button size="sm" variant="ghost" className="h-8 rounded-full bg-white/80 border border-gray-400 text-gray-600 text-xs font-bold gap-2 hover:bg-white shadow-sm">
                                        <Monitor size={14} /> Landing Page
                                    </Button>
                                </div>

                                <Input
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    disabled={isSending}
                                    className="h-14 w-full border-none bg-white px-4 text-lg shadow-none placeholder:text-gray-400 focus-visible:ring-0 text-gray-800"
                                    placeholder="Start a new message..." />

                                <div className="flex justify-between items-center px-2 pt-2">
                                    <div className="flex h-auto items-center gap-8 pb-4 text-gray-400">

                                        {/* Basic Tools */}
                                        <div className="flex items-center gap-6">
                                            <Settings size={17} className="text-black hover:text-gray-600 cursor-pointer transition-colors" />
                                            <Paperclip size={17} className="text-black hover:text-gray-600 cursor-pointer transition-colors" />
                                            <Mic size={17} className="text-black hover:text-gray-600 cursor-pointer transition-colors" />
                                        </div>


                                        <div
                                            onClick={() => setIsSearchActive(!isSearchActive)}
                                            className={`flex items-center gap-2 cursor-pointer transition-colors group ${isSearchActive ? 'text-black' : 'text-gray-400 hover:text-gray-600'}`}>
                                            <Globe size={18} className='text-black' />
                                            <span className="text-sm font-medium text-black">Search</span>

                                            <div className={`w-9 h-5 rounded-full p-0.5 transition-colors flex items-center ${isSearchActive ? 'bg-black' : 'bg-gray-170 group-hover:bg-gray-300'}`}>
                                                <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ease-in-out transform ${isSearchActive ? 'translate-x-4' : 'translate-x-0'}`}></div>
                                            </div>
                                        </div>

                                        <div className="relative" >
                                            <div
                                                onClick={() => setIsPopoverOpen(!isPopoverOpen)}
                                                className="flex items-center gap-2 cursor-pointer hover:text-gray-600 transition-colors text-black "
                                            >
                                                <MessageSquare size={18} />
                                                <span className="text-sm font-medium">Memory ({memoryValue})</span>
                                                <ChevronDown size={14} className={`transition-transform ${isPopoverOpen ? 'rotate-180' : ''}`} />
                                            </div>

                                            {isPopoverOpen && (
                                                <div className="absolute bottom-full mb-2 left-0 w-95 p-1.5 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 ">
                                                    <div className="flex justify-between items-center mb-4">
                                                        <span className="text-gray-700 font-medium">Chat memory</span>

                                                        <div className="bg-gray-100 px-3 py-1 text-black rounded-md text-sm font-mono min-w-7.5 text-center">
                                                            {memoryValue}
                                                        </div>
                                                    </div>

                                                    {/* Slider*/}
                                                    <input
                                                        type="range"
                                                        min="0"
                                                        max="500"
                                                        value={memoryValue}
                                                        onChange={(e) => setMemoryValue(parseInt(e.target.value))}
                                                        className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                                                    />

                                                    <p className="mt-3 text-xs text-black leading-relaxed">
                                                        Sends the last {memoryValue} messages from your conversation each request.
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {showModelAlert && (
                                        <div className="absolute -top-16 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                            <div className="flex items-center gap-2 bg-red-500/90 text-white px-4 py-2 rounded-full backdrop-blur-md border border-red-400">
                                                <span className="text-xxs font-semibold whitespace-nowrap">
                                                    Select a model first
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                    <Button
                                        onClick={handleSendMessage} disabled={isSending}
                                        size="icon" className="bg-[#1a1a1a] hover:bg-black text-white rounded-2xl h-7 w-10 -mt-3 shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 ">
                                        <ArrowUp size={20} />
                                    </Button>

                                </div>
                            </Card>
                        </div>
                    </main>
                </div>
            </div >
        </div >
    );
}