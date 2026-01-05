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
    Plus,
    Menu,
    ChevronDown,
    Sun,
    Moon
} from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

import { Button } from '@/presentation/components/ui/button';
import { Card, CardFooter, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { Input } from '@/presentation/components/ui/input';
import { useAuth } from '@/presentation/hooks/use-auth';



export const ChatHub = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { logout } = useAuth();
    return (
        <div className="flex flex-col gap-4 w-full max-w-350">

            {/* Header*/}
            <Card className="w-full h-20 rounded-4xl bg-white/70 backdrop-blur-md border-white/20 shadow-sm flex items-center justify-between px-8">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <div className=" text-white font-bold p-1.5 rounded-lg text-xl flex items-center gap-0.5">
                        <Image
                            src="/k-logo.png"
                            alt="Kromaticos icon"
                            width={30}
                            height={20}
                        />
                        <span className="bg-red-500 text-white text-[10px] font-black italic px-1.5 py-1  leading-tight shadow-sm tracking-tighter -mt-2.5">
                            IA
                        </span>
                    </div>
                </div>

                {/* Main toolbar */}
                <div className="hidden lg:flex items-center bg-white border border-white/40 rounded-full p-0.5 shadow-sm">
                    <Button variant="ghost" className="rounded-full text-gray-600 hover:text-black hover:bg-transparent h-auto py-1.5 px-3 font-medium">
                        Models
                    </Button>
                    <Button variant="ghost" className="rounded-full bg-blue-100 text-blue-400 hover:bg-blue-200 hover:text-blue-700 h-auto py-1.5 px-3font-medium">
                        Chat
                    </Button>
                    <Button variant="ghost" className="rounded-full text-gray-600 hover:text-black hover:bg-transparent h-auto py-1.5 px-3 font-medium">
                        Ranking
                    </Button>
                    <Button variant="ghost" className="rounded-full text-gray-600 hover:text-black hover:bg-transparent h-auto py-1.5 px-3font-medium">
                        Enterprise
                    </Button>
                    <Button variant="ghost" className="rounded-full text-gray-600 hover:text-black hover:bg-transparent h-auto py-1.5 px-3font-medium">
                        Pricing
                    </Button>
                    <Button variant="ghost" className="rounded-full text-gray-600 hover:text-black hover:bg-transparent h-auto py-1.5 px-3font-medium">
                        Docs
                    </Button>
                </div>

                {/* User buttons */}
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" className="rounded-full bg-white shadow-sm border border-gray-100">
                        <Search size={22} className="text-gray-500" />
                    </Button>
                    <Button
                        onClick={() => logout()}
                        className="rounded-full bg-white text-black border border-gray-100 hover:bg-gray-50 px-4 shadow-sm gap-2">
                        <div className="flex items-center gap-2">
                            Sign up
                            <Image src="/vector.svg" alt="Vector icon" width={20} height={20} />
                        </div>
                    </Button>
                </div>
            </Card>

            {/* Secondary toolbar  */}
            <Card className="w-full h-16 rounded-2xl bg-white/70 backdrop-blur-3xl border-white/20 shadow-sm flex items-center justify-between px-6 z-20 overflow-visible">
                <div className="flex items-center gap-5">

                    <Button variant="outline" size="icon" className=" border-gray-600">
                        <LayoutTemplate size={18} />
                    </Button>
                    <Button variant="outline" className="border-gray-600 hover:bg-gray-200 gap-2 font-medium px-4">
                        <SquarePen size={18} /> New chat
                    </Button>
                    <Button variant="outline" className="border-gray-600 gap-2 font-medium px-4 ">
                        <Plus size={18} /> Add model
                    </Button>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Button
                            variant="outline"
                            size="icon"
                            className="border-gray-200"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? (
                                <ChevronDown size={18} className="text-gray-700" />
                            ) : (
                                <Menu size={15} />
                            )}
                        </Button>

                        {/* Deployable menu */}
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

                    <div className="w-10 h-10 rounded-full overflow-hidden shadow-sm">
                        {/* Avatar placeholder */}
                        <div className="w-full h-full flex items-center justify-center text-lg">
                            <Image src="/user_avatar.svg" alt="User_avatar icon" width={40} height={40} />
                        </div>
                    </div>
                </div>
            </Card>

            {/* Principal */}
            <Card className="w-full h-[70vh] rounded-[2.5rem]  bg-white/70 backdrop-blur-3xl  border-white/20 flex overflow-hidden">

                {/* Sidebar */}
                <aside className="w-72 hidden md:flex h-full p-4 ">
                    <Card className="h-full w-full flex flex-col gap-8 p-6 bg-white/50 backdrop-blur-1xl border-white/20 shadow-lg rounded-2xl">

                        <div className="bg-white rounded-xl p-3 px-4 text-gray-400 text-sm border border-transparent shadow-sm">
                            Search rooms...
                        </div>

                        {/* Chats list */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-black pl-2">Today</h3>
                            <div className="space-y-3 pl-2">
                                <p className="text-sm text-gray-600 italic hover:text-black cursor-pointer transition-colors">
                                    Untitled Chat
                                </p>
                                <p className="text-sm text-gray-600 italic hover:text-black cursor-pointer transition-colors">
                                    Untitled Chat
                                </p>
                                <p className="text-sm text-gray-600 italic hover:text-black cursor-pointer transition-colors">
                                    Untitled Chat
                                </p>
                            </div>
                        </div>
                    </Card>
                </aside>

                {/* Content */}
                <main className="flex-1 flex flex-col relative overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-10 pb-52 scrollbar-hide">
                        <div className="mb-12 space-y-1">
                            <h1 className="text-4xl font-light text-gray-800 tracking-tight">Welcome to the chat.</h1>
                            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Write your message below.</h1>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Card 1 */}
                            <Card className="group relative flex flex-col justify-between h-40 w-full bg-white border-transparent shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer rounded-3xl overflow-hidden">
                                <CardHeader className="p-6 pb-0">
                                    <CardTitle className="text-lg font-medium text-gray-800 group-hover:text-black transition-colors">
                                        Flagship models
                                    </CardTitle>
                                </CardHeader>
                                <CardFooter className="p-6 pt-0 justify-end gap-3">
                                    <Button className="rounded-full bg-white text-black border border-gray-100 hover:bg-gray-50 px-1 shadow-sm gap-2 h-auto py-1">
                                        <Image src="/Gemini.svg" alt="Gemini" width={20} height={20} className="opacity-60 group-hover:opacity-100 transition-opacity" />
                                    </Button>
                                    <Button className="rounded-full bg-white text-black border border-gray-100 hover:bg-gray-50 px-1 shadow-sm gap-2 h-auto py-1">
                                        <Image src="/Grok.svg" alt="Grok" width={20} height={20} className="opacity-60 group-hover:opacity-100 transition-opacity" />
                                    </Button>
                                    <Button className="rounded-full bg-white text-black border border-gray-100 hover:bg-gray-50 px-1 shadow-sm gap-2 h-auto py-1">
                                        <Image src="/DeepSeek.svg" alt="DeepSeek" width={20} height={20} className="opacity-60 group-hover:opacity-100 transition-opacity" />
                                    </Button>
                                    <Button className="rounded-full bg-white text-black border border-gray-100 hover:bg-gray-50 px-1 shadow-sm gap-2 h-auto py-1">
                                        <Image src="/Mistral.svg" alt="Mistral" width={20} height={20} className="opacity-60 group-hover:opacity-100 transition-opacity" />
                                    </Button>
                                </CardFooter>
                            </Card>

                            {/* Card 2 */}
                            <Card className="group relative flex flex-col justify-between h-40 w-full bg-white border-transparent shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer rounded-3xl overflow-hidden">
                                <CardHeader className="p-6 pb-0">
                                    <CardTitle className="text-lg font-medium text-gray-800 group-hover:text-black transition-colors">
                                        Best roleplay models
                                    </CardTitle>
                                </CardHeader>
                                <CardFooter className="p-6 pt-0 justify-end gap-3">
                                    <Button className="rounded-full bg-white text-black border border-gray-100 hover:bg-gray-50 px-1 shadow-sm gap-2 h-auto py-1">
                                        <Image src="/Gemini.svg" alt="Gemini" width={20} height={20} className="opacity-60 group-hover:opacity-100 transition-opacity" />
                                    </Button>
                                    <Button className="rounded-full bg-white text-black border border-gray-100 hover:bg-gray-50 px-1 shadow-sm gap-2 h-auto py-1">
                                        <Image src="/Grok.svg" alt="Grok" width={20} height={20} className="opacity-60 group-hover:opacity-100 transition-opacity" />
                                    </Button>
                                    <Button className="rounded-full bg-white text-black border border-gray-100 hover:bg-gray-50 px-1 shadow-sm gap-2 h-auto py-1">
                                        <Image src="/DeepSeek.svg" alt="DeepSeek" width={20} height={20} className="opacity-60 group-hover:opacity-100 transition-opacity" />
                                    </Button>
                                    <Button className="rounded-full bg-white text-black border border-gray-100 hover:bg-gray-50 px-1 shadow-sm gap-2 h-auto py-1">
                                        <Image src="/Mistral.svg" alt="Mistral" width={20} height={20} className="opacity-60 group-hover:opacity-100 transition-opacity" />
                                    </Button>
                                </CardFooter>
                            </Card>

                            {/* Card 3 */}
                            <Card className="group relative flex flex-col justify-between h-40 w-full bg-white border-transparent shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer rounded-3xl overflow-hidden">
                                <CardHeader className="p-6 pb-0">
                                    <CardTitle className="text-lg font-medium text-gray-800 group-hover:text-black transition-colors">
                                        Best coding models
                                    </CardTitle>
                                </CardHeader>
                                <CardFooter className="p-6 pt-0 justify-end gap-3">
                                    <Button className="rounded-full bg-white text-black border border-gray-100 hover:bg-gray-50 px-1 shadow-sm gap-2 h-auto py-1">
                                        <Image src="/Gemini.svg" alt="Gemini" width={20} height={20} className="opacity-60 group-hover:opacity-100 transition-opacity" />
                                    </Button>
                                    <Button className="rounded-full bg-white text-black border border-gray-100 hover:bg-gray-50 px-1 shadow-sm gap-2 h-auto py-1">
                                        <Image src="/Grok.svg" alt="Grok" width={20} height={20} className="opacity-60 group-hover:opacity-100 transition-opacity" />
                                    </Button>
                                    <Button className="rounded-full bg-white text-black border border-gray-100 hover:bg-gray-50 px-1 shadow-sm gap-2 h-auto py-1">
                                        <Image src="/DeepSeek.svg" alt="DeepSeek" width={20} height={20} className="opacity-60 group-hover:opacity-100 transition-opacity" />
                                    </Button>
                                    <Button className="rounded-full bg-white text-black border border-gray-100 hover:bg-gray-50 px-1 shadow-sm gap-2 h-auto py-1">
                                        <Image src="/Mistral.svg" alt="Mistral" width={20} height={20} className="opacity-60 group-hover:opacity-100 transition-opacity" />
                                    </Button>
                                </CardFooter>
                            </Card>

                            {/* Card 4 */}
                            <Card className="group relative flex flex-col justify-between h-40 w-full bg-white border-transparent shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer rounded-3xl overflow-hidden">
                                <CardHeader className="p-6 pb-0">
                                    <CardTitle className="text-lg font-medium text-gray-800 group-hover:text-black transition-colors">
                                        Reasoning models
                                    </CardTitle>
                                </CardHeader>
                                <CardFooter className="p-6 pt-0 justify-end gap-3">
                                    <Button className="rounded-full bg-white text-black border border-gray-100 hover:bg-gray-50 px-1 shadow-sm gap-2 h-auto py-1">
                                        <Image src="/Gemini.svg" alt="Gemini" width={20} height={20} className="opacity-60 group-hover:opacity-100 transition-opacity" />
                                    </Button>
                                    <Button className="rounded-full bg-white text-black border border-gray-100 hover:bg-gray-50 px-1 shadow-sm gap-2 h-auto py-1">
                                        <Image src="/Grok.svg" alt="Grok" width={20} height={20} className="opacity-60 group-hover:opacity-100 transition-opacity" />
                                    </Button>
                                    <Button className="rounded-full bg-white text-black border border-gray-100 hover:bg-gray-50 px-1 shadow-sm gap-2 h-auto py-1">
                                        <Image src="/DeepSeek.svg" alt="DeepSeek" width={20} height={20} className="opacity-60 group-hover:opacity-100 transition-opacity" />
                                    </Button>
                                    <Button className="rounded-full bg-white text-black border border-gray-100 hover:bg-gray-50 px-1 shadow-sm gap-2 h-auto py-1">
                                        <Image src="/Mistral.svg" alt="Mistral" width={20} height={20} className="opacity-60 group-hover:opacity-100 transition-opacity" />
                                    </Button>
                                </CardFooter>
                            </Card>

                        </div>
                    </div>

                    {/* Chat */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[95%] max-w-5xl z-20">
                        <Card className="rounded-2xl bg-[#F3F4F6] backdrop-blur-1xl p-4 border-none shadow-lg">

                            <div className="flex gap-3 mb-3 pl-1">
                                <Button
                                    variant="outline"
                                    className="rounded-full bg-transparent border-gray-300 text-gray-600 hover:bg-white h-8 px-4 text-xs font-semibold gap-2"
                                >
                                    <ImageIcon size={14} /> Image
                                </Button>

                                <Button
                                    variant="outline"
                                    className="rounded-full bg-transparent border-gray-300 text-gray-600 hover:bg-white h-8 px-4 text-xs font-semibold gap-2"
                                >
                                    <LayoutTemplate size={14} /> Landing Page
                                </Button>
                            </div>

                            <div className="mb-3">
                                <Input
                                    className="h-14 w-full rounded-2xl border-none bg-white px-5 text-base shadow-sm placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0"
                                    placeholder="Star a new message..."
                                />
                            </div>

                            <div className="flex justify-between items-center pl-2 pr-1">

                                <div className="flex items-center gap-5 text-gray-400">
                                    <Settings size={20} className="cursor-pointer hover:text-gray-600 transition-colors" />
                                    <Paperclip size={20} className="cursor-pointer hover:text-gray-600 transition-colors" />
                                    <Mic size={20} className="cursor-pointer hover:text-gray-600 transition-colors" />

                                    <div className="flex items-center gap-3 ml-2">
                                        <div className="flex items-center gap-2 cursor-pointer hover:text-gray-600 text-gray-500">
                                            <Globe size={18} />
                                            <span className="text-[11px] font-bold uppercase tracking-wide">Search</span>
                                        </div>
                                        <div className="w-9 h-5 bg-gray-200 rounded-full relative cursor-pointer">
                                            <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full shadow-sm transition-all" />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 cursor-pointer hover:text-gray-600 text-gray-500 ml-2">
                                        <MessageSquare size={18} />
                                        <span className="text-[11px] font-bold uppercase tracking-wide">Memory (10)</span>
                                        <span className="text-[8px]">▼</span>
                                    </div>
                                </div>

                                <Button
                                    size="icon"
                                    className="bg-[#333333] hover:bg-black text-white rounded-xl h-10 w-10 shadow-md transition-all"
                                >
                                    <ArrowUp size={20} />
                                </Button>
                            </div>
                        </Card>
                    </div>

                </main>
            </Card>
        </div>
    );
};

