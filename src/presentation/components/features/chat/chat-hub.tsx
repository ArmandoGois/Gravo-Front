'use client';

import {
    Image as ImageIcon,
    LayoutTemplate,
    Settings,
    Paperclip,
    Mic,
    Globe,
    MessageSquare,
    ArrowUp,
    Search,
    SquarePen,
    ChevronDown,
    X,
    ChevronUp,
    Sun,
    Moon,
    Bot,
    Trash2
} from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

import { useChatUIStore } from "@/infrastructure/stores/chat-ui.store";
import { useModelUIStore } from "@/infrastructure/stores/model-ui.store";
import { CreateChatModal } from "@/presentation/components/features/chat/chat-creator";
import { ModelSelector } from "@/presentation/components/features/models/model-selector";
import { Button } from '@/presentation/components/ui/button';
import { Card, CardFooter, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { Input } from '@/presentation/components/ui/input';
import { useAuth } from '@/presentation/hooks/use-auth';

export const ChatHub = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const [isCreateChatOpen, setIsCreateChatOpen] = useState(false);

    const { logout } = useAuth();

    const { activeModels, removeModel } = useModelUIStore();

    const { activeChats, removeChat } = useChatUIStore();

    return (
        //Simulate background
        <div className="min-h-screen w-full bg-linear-to-br bg-black flex items-center justify-center p-4 md:p-8 font-sans">

            <CreateChatModal
                isOpen={isCreateChatOpen}
                onClose={() => setIsCreateChatOpen(false)}
            />

            <div className="w-full max-w-7xl flex flex-col gap-5">

                {/* --- HEADER --- */}
                <div className="relative z-50 w-full h-20 rounded-4xl bg-white/40 backdrop-blur-xl border border-white/40 shadow-sm flex items-center justify-between px-6">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <div className="relative w-10 h-10 flex items-center justify-center">
                            <Image
                                src="/kromaticos_logo.svg"
                                alt="Kromaticos Logo"
                                width={40}
                                height={40}
                                className="object-contain"
                            />
                            <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[9px] font-bold px-1 rounded-sm">IA</span>
                        </div>
                    </div>

                    {/* Nav Central */}
                    <nav className="hidden lg:flex items-center bg-white rounded-full px-1 py-1 shadow-sm gap-1">
                        <Button variant="ghost" className="rounded-full text-gray-500 hover:text-gray-900 h-9 px-4 text-sm font-medium">Models</Button>
                        <Button variant="ghost" className="rounded-full bg-[#5C8CB3] text-white hover:bg-[#4a7a9f] h-9 px-5 text-sm font-medium shadow-sm">Chat</Button>
                        <Button variant="ghost" className="rounded-full text-gray-500 hover:text-gray-900 h-9 px-4 text-sm font-medium">Ranking</Button>
                        <Button variant="ghost" className="rounded-full text-gray-500 hover:text-gray-900 h-9 px-4 text-sm font-medium">Enterprise</Button>
                        <Button variant="ghost" className="rounded-full text-gray-500 hover:text-gray-900 h-9 px-4 text-sm font-medium">Pricing</Button>
                        <Button variant="ghost" className="rounded-full text-gray-500 hover:text-gray-900 h-9 px-4 text-sm font-medium">Docs</Button>

                    </nav>

                    {/* User Profile */}
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" className="rounded-full bg-white/80 hover:bg-white shadow-sm w-10 h-10 text-gray-600">
                            <Search size={20} />
                        </Button>
                        {/* Deployable Menu */}
                        <div className='relative'>
                            <div
                                className="flex items-center bg-white rounded-full p-1 pr-4 gap-3 shadow-sm cursor-pointer hover:bg-gray-50 transition-colors"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                            >
                                <div className="w-8 h-8 rounded-full bg-blue-100 overflow-hidden border border-blue-200">
                                    <Image src="/user_avatar.svg" alt="User" width={32} height={32} />
                                </div>
                                <div className="flex flex-col text-left leading-none">
                                    <span className="text-xs font-bold text-gray-800">Name Lorem</span>
                                    <span className="text-[10px] text-gray-500">lorem@ipsum.com</span>
                                </div>
                                {!isMenuOpen ? (
                                    <ChevronDown size={14} className="text-gray-400" />
                                ) : (
                                    <ChevronUp size={14} className="text-gray-400" />
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
                <Card className="w-full h-[80vh] rounded-[2.5rem] bg-white/30 backdrop-blur-2xl border border-white/30 shadow-2xl flex overflow-hidden relative">

                    {/* Sidebar */}
                    <aside className="hidden md:flex flex-col w-72 h-full bg-white/20 border-r border-white/20 p-5 z-20">
                        {/* Search input (Igual que antes) */}
                        <div className="flex items-center gap-2 mb-6">
                            <Input
                                className="w-full bg-white/50 border-0 rounded-xl h-10 pl-4 text-sm placeholder:text-gray-500 focus-visible:ring-1 focus-visible:ring-white/50"
                                placeholder="Search rooms..."
                            />
                            {/* ... */}
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                            <h3 className="text-xs font-bold text-gray-800 tracking-wider pl-2 mb-2">Active Chats</h3>

                            {/* Renderizado de Chats Activos */}
                            {activeChats.length === 0 && (
                                <p className="text-xs text-white italic pl-2">No active chats.</p>
                            )}

                            {activeChats.map(chat => (
                                <div key={chat.id} className="group flex items-center justify-between px-3 py-3 rounded-xl bg-white/40 hover:bg-white/70 cursor-pointer transition-all border border-transparent hover:border-white/50">
                                    <div className="flex flex-col overflow-hidden">
                                        <div className="flex items-center gap-2">
                                            <MessageSquare size={14} className="text-gray-600" />
                                            <span className="text-sm font-semibold text-gray-800 truncate">{chat.title}</span>
                                        </div>
                                        <span className="text-[10px] text-gray-500 pl-6 truncate">
                                            {chat.models.length} models active
                                        </span>
                                    </div>

                                    <button
                                        onClick={(e) => { e.stopPropagation(); removeChat(chat.id); }}
                                        className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-100 text-red-400 rounded-lg transition-all"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 relative flex flex-col h-full bg-transparent">

                        {/* New Chat & Add Model */}
                        {/* Agregamos max-w-full para gestionar el espacio responsive */}
                        <div className="absolute top-6 right-8 flex items-center gap-3 z-30 max-w-[90%] md:max-w-[70%] justify-end">

                            {/* --- CONTENEDOR DE LA LISTA DE MODELOS --- */}
                            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide mask-gradient pr-2">

                                {/* Mensaje vacío */}
                                {activeModels.length === 0 && (
                                    <p className="text-xs text-gray-500 italic pl-2 whitespace-nowrap">
                                        No active models.
                                    </p>
                                )}

                                {/* Mapeo de Modelos */}
                                {activeModels.map((model) => (
                                    <div
                                        key={model.id}
                                        // shrink-0: Evita que el elemento se encoja
                                        // whitespace-nowrap: Evita que el texto salte de línea
                                        className="shrink-0 group flex items-center justify-between px-3 py-2 rounded-full bg-white/40 hover:bg-white/60 cursor-pointer transition-all border border-white/20 hover:border-white/50 shadow-sm backdrop-blur-md"
                                    >
                                        <div className="flex items-center gap-2 overflow-hidden">
                                            <Bot size={14} className="text-blue-600 shrink-0" />
                                            <span className="text-xs text-gray-800 font-medium whitespace-nowrap">
                                                {model.title}
                                            </span>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeModel(model.id);
                                            }}
                                            className="opacity-0 group-hover:opacity-100 ml-2 p-0.5 hover:bg-red-100 rounded-full text-red-400 transition-all shrink-0"
                                        >
                                            <X size={12} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            {/* ----------------------------------------- */}

                            {/* Separador visual opcional si quieres distinguir la lista de los botones fijos */}
                            {activeModels.length > 0 && <div className="h-6 w-px bg-white/30 shrink-0 mx-1"></div>}

                            {/* Botones Fijos (shrink-0 para que nunca se aplasten) */}
                            <Button
                                onClick={() => setIsCreateChatOpen(true)} // ABRIMOS EL MODAL
                                variant="outline"
                                className="rounded-full bg-white/20 border-white/40 text-white hover:bg-white/30 px-5 h-10 gap-2 font-medium backdrop-blur-md whitespace-nowrap"
                            >
                                <SquarePen size={16} /> <span className="hidden sm:inline">New chat</span>
                            </Button>

                            <div className="shrink-0">
                                <ModelSelector />
                            </div>

                        </div>

                        {/* Message */}
                        <div className="flex-1 overflow-y-auto px-8 md:px-12 pt-12 pb-48 scrollbar-hide">
                            <div className="mb-10 space-y-1">
                                <h1 className="text-4xl md:text-5xl font-light text-white tracking-tight drop-shadow-sm">Welcome to the chat.</h1>
                                <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight drop-shadow-sm">Write your message below.</h1>
                            </div>

                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 max-w-5xl">
                                {[
                                    { title: 'Flagship models' },
                                    { title: 'Best roleplay models' },
                                    { title: 'Best coding models' },
                                    { title: 'Reasoning models' }
                                ].map((card, idx) => (
                                    <Card key={idx} className="group h-40 rounded-4xl bg-white/90 border-0 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between p-1">
                                        <CardHeader className="px-6 pt-6 pb-0">
                                            <CardTitle className="text-xl font-medium text-gray-700 group-hover:text-black">
                                                {card.title}
                                            </CardTitle>
                                        </CardHeader>

                                        <CardFooter className="px-6 pb-4 flex justify-end gap-2">
                                            {[
                                                { src: '/Gemini.svg', alt: 'Gemini' },
                                                { src: '/Grok.svg', alt: 'Grok' },
                                                { src: '/DeepSeek.svg', alt: 'DeepSeek' },
                                                { src: '/Mistral.svg', alt: 'Mistral' }
                                            ].map((logo, i) => (
                                                <div
                                                    key={i}
                                                    className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-gray-100 shadow-sm group-hover:scale-110 transition-transform"
                                                >
                                                    <Image
                                                        src={logo.src}
                                                        alt={logo.alt}
                                                        width={18}
                                                        height={18}
                                                        className="opacity-70 group-hover:opacity-100 transition-opacity"
                                                    />
                                                </div>
                                            ))}
                                        </CardFooter>
                                    </Card>
                                ))}
                            </div>
                        </div>

                        {/* Input Area*/}
                        <div className="absolute bottom-0 left-0 right-0 px-8 md:px-12 pb-8 pt-4 bg-linear-to-t from-white/10 to-transparent z-40 flex justify-center">
                            <div className="w-full max-w-4xl bg-[#F3F4F6]/90 backdrop-blur-xl rounded-3xl p-3 shadow-xl border border-white/50">

                                <div className="flex gap-2 mb-2 px-1">
                                    <Button size="sm" variant="ghost" className="h-7 rounded-full bg-white border border-gray-200 text-gray-500 text-xs font-semibold gap-2 hover:bg-gray-50">
                                        <ImageIcon size={12} /> Image
                                    </Button>
                                    <Button size="sm" variant="ghost" className="h-7 rounded-full bg-white border border-gray-200 text-gray-500 text-xs font-semibold gap-2 hover:bg-gray-50">
                                        <LayoutTemplate size={12} /> Landing Page
                                    </Button>
                                </div>

                                <Input
                                    className="h-12 w-full rounded-xl border-none bg-white px-4 text-base shadow-sm placeholder:text-gray-400 focus-visible:ring-0 mb-3"
                                    placeholder="Star a new message..."
                                />

                                <div className="flex justify-between items-center px-1">
                                    <div className="flex items-center gap-3 text-gray-400">
                                        <Settings size={18} className="hover:text-gray-600 cursor-pointer" />
                                        <Paperclip size={18} className="hover:text-gray-600 cursor-pointer" />
                                        <Mic size={18} className="hover:text-gray-600 cursor-pointer" />
                                        <div className="h-4 w-px bg-gray-300 mx-1"></div>
                                        <div className="flex items-center gap-1.5 text-gray-500 hover:text-gray-700 cursor-pointer">
                                            <Globe size={16} /> <span className="text-[10px] font-bold uppercase">Search</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-gray-500 hover:text-gray-700 cursor-pointer ml-2">
                                            <MessageSquare size={16} /> <span className="text-[10px] font-bold uppercase">Memory (10)</span>
                                        </div>
                                    </div>
                                    <Button size="icon" className="bg-[#2D2D2D] hover:bg-black text-white rounded-xl h-9 w-9 shadow-md transition-all">
                                        <ArrowUp size={18} />
                                    </Button>
                                </div>
                            </div>
                        </div>

                    </main>
                </Card>
            </div>
        </div>
    );
}