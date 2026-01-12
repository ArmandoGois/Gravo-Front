'use client';

import {
    Image as ImageIcon,
    LayoutTemplate,
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
    Bot,
    Trash2,
    Moon,
    Bell,
    MessageSquare
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
        <div className="min-h-screen w-full bg-linear-to-br flex items-center justify-center p-4 md:p-8 font-sans">

            {/* Create newChat window */}
            <CreateChatModal
                isOpen={isCreateChatOpen}
                onClose={() => setIsCreateChatOpen(false)}
            />

            <div className="w-full max-w-[92%] flex flex-col gap-5">

                {/* Header */}
                <div className="relative z-50 w-full h-30 rounded-2xl bg-white/40 backdrop-blur-xl border border-white/40 shadow-sm flex items-center justify-between px-6">
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
                    <nav className="hidden lg:flex items-center bg-white rounded-full px-1 py-1 shadow-sm gap-1 h-15">
                        <Button variant="ghost" className="rounded-full text-gray-500 hover:text-gray-900 h-9 px-4 text-sm font-medium">Models</Button>
                        <Button variant="ghost" className="rounded-full bg-[#5C8CB3] text-white hover:bg-[#4a7a9f] h-9 px-5 text-sm font-medium shadow-sm">Chat</Button>
                        <Button variant="ghost" className="rounded-full text-gray-500 hover:text-gray-900 h-9 px-4 text-sm font-medium">Ranking</Button>
                        <Button variant="ghost" className="rounded-full text-gray-500 hover:text-gray-900 h-9 px-4 text-sm font-medium">Enterprise</Button>
                        <Button variant="ghost" className="rounded-full text-gray-500 hover:text-gray-900 h-9 px-4 text-sm font-medium">Pricing</Button>
                        <Button variant="ghost" className="rounded-full text-gray-500 hover:text-gray-900 h-9 px-4 text-sm font-medium">Docs</Button>

                    </nav>

                    {/* User Profile */}
                    <div className="flex items-center gap-3">
                        <nav className="hidden lg:flex items-center bg-white rounded-full px-2.5 py-1 shadow-sm gap-3 h-15 w-fit">
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
                                className="flex items-center bg-white rounded-full p-1 pr-4 gap-3 shadow-sm cursor-pointer hover:bg-gray-50 transition-colors h-15"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                            >
                                <div className="w-12 h-12 rounded-full overflow-hidden pl-1">
                                    <Image src="/user_avatar.svg" alt="User" width={46} height={44} />
                                </div>
                                <div className="flex flex-col text-left leading-none">
                                    <span className="text-[15px] font-bold text-gray-800">Name Lorem</span>
                                    <span className="text-[15px] text-gray-500">lorem@ipsum.com</span>
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
                <div className="w-full h-[85vh] flex gap-6 max-w-450 relative">

                    {/* Sidebar */}
                    <aside className="hidden md:flex flex-col w-80 h-full shrink-0">
                        <Card className="h-full w-full flex flex-col bg-white/20 backdrop-blur-3xl border border-white/20 shadow-xl rounded-[2.5rem] overflow-hidden p-5">

                            {/* Search Bar and Close Button */}
                            <div className="flex items-center gap-2 mb-6">
                                <div className="relative w-full">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
                                    <Input
                                        className="w-full bg-white/40 border-0 rounded-2xl h-11 pl-10 text-sm placeholder:text-gray-600 focus-visible:ring-1 focus-visible:ring-white/50 shadow-inner"
                                        placeholder="Search rooms..."
                                    />
                                </div>
                                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full bg-white/20 hover:bg-white/40 text-gray-600 shrink-0">
                                    <X size={18} />
                                </Button>
                            </div>


                            <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                                <h3 className="text-xs font-bold text-gray-800 tracking-wider pl-2 mb-2">Active Chats</h3>

                                {/* Render of Active Chats */}
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
                        </Card>
                    </aside>




                    {/* Main Content */}
                    <main className="flex-1 relative flex flex-col h-full rounded-[2.5rem] overflow-hidden">

                        {/* New Chat & Add Model */}
                        <div className="absolute top-6 right-8 flex items-center gap-3 z-30">

                            {/* Models list */}
                            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide mask-gradient pr-2">

                                {activeModels.length === 0 && (
                                    <p className="text-xs text-gray-500 italic pl-2 whitespace-nowrap">
                                        No active models.
                                    </p>
                                )}

                                {/* Models mapping */}
                                {activeModels.map((model) => (
                                    <div
                                        key={model.id}
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

                            {activeModels.length > 0 && <div className="h-6 w-px bg-white/30 shrink-0 mx-1"></div>}

                            <Button
                                onClick={() => setIsCreateChatOpen(true)}
                                variant="outline"
                                className="rounded-full bg-white/20 border-white/40 text-white hover:bg-white/30 px-5 h-10 gap-2 font-medium backdrop-blur-md whitespace-nowrap"
                            >
                                <SquarePen size={16} /> <span className="hidden sm:inline">New chat</span>
                            </Button>

                            <div className="shrink-0">
                                <ModelSelector />
                            </div>

                        </div>

                        <div className="flex-1 overflow-y-auto px-4 md:px-16 pt-20 pb-48 scrollbar-hide">

                            {/* Welcome Headers */}
                            <div className="mb-12 space-y-2">
                                <h1 className="text-4xl md:text-6xl font-light text-white tracking-tight drop-shadow-md">Welcome to the chat.</h1>
                                <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight drop-shadow-md opacity-90">Write your message below.</h1>
                            </div>

                            {/* Recommended Models */}
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

                        {/* Input area */}
                        <div className="absolute bottom-6 left-0 right-0 px-4 md:px-16 z-40 flex justify-center">

                            <Card className="w-full max-w-5xl bg-[#F3F4F6]/80 backdrop-blur-2xl rounded-4xl p-4 shadow-2xl border border-white/60">

                                <div className="flex gap-3 mb-3 px-2">
                                    <Button size="sm" variant="ghost" className="h-8 rounded-full bg-white/80 border border-gray-200 text-gray-600 text-xs font-bold gap-2 hover:bg-white shadow-sm">
                                        <ImageIcon size={14} /> Image
                                    </Button>
                                    <Button size="sm" variant="ghost" className="h-8 rounded-full bg-white/80 border border-gray-200 text-gray-600 text-xs font-bold gap-2 hover:bg-white shadow-sm">
                                        <LayoutTemplate size={14} /> Landing Page
                                    </Button>
                                </div>

                                <Input
                                    className="h-14 w-full rounded-xl border-none bg-transparent px-4 text-lg shadow-none placeholder:text-gray-400 focus-visible:ring-0 text-gray-800"
                                    placeholder="Star a new message..."
                                />

                                <div className="flex justify-between items-center px-2 pt-2">
                                    <div className="flex items-center gap-4 text-gray-400">
                                        <Settings size={20} className="hover:text-gray-600 cursor-pointer transition-colors" />
                                        <Paperclip size={20} className="hover:text-gray-600 cursor-pointer transition-colors" />
                                        <Mic size={20} className="hover:text-gray-600 cursor-pointer transition-colors" />

                                        <div className="h-5 w-px bg-gray-300 mx-2"></div>
                                        <div className="flex items-center gap-2 text-gray-500 hover:text-gray-700 cursor-pointer bg-white/50 px-3 py-1 rounded-full">
                                            <Globe size={14} /> <span className="text-[11px] font-bold uppercase tracking-wide">Search</span>
                                        </div>
                                    </div>

                                    <Button size="icon" className="bg-[#1a1a1a] hover:bg-black text-white rounded-2xl h-10 w-10 shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
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