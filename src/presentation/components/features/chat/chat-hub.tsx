'use client';

import {
    Image as ImageIcon,
    Paperclip,
    ArrowUp,
    Search,
    SquarePen,
    ChevronDown,
    X,
    Sun,
    Trash2,
    Moon,
    MessageSquare,
    PanelLeftOpen,
    Loader2,
    Bot,
    MoreVertical,
    Pencil,
    PanelRightOpen,
    Wand2,
    ThumbsUp,
    ThumbsDown,
    CornerUpRight,
    LayoutGrid,
    UserPlus,
    ArrowLeft,
    Building2,
    Globe,
    FileText,
    Palette
} from 'lucide-react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
const TextMessage = dynamic(
    () => import('@/presentation/components/features/message/text-message').then(mod => mod.TextMessage),
    { ssr: false, loading: () => <span className="opacity-50">Loading message...</span> }
);
import { useState, useEffect, useRef, useCallback } from 'react';

import { MessageContentPayload } from '@/domain/entities/message.entity';
import { useConversationUIStore } from "@/infrastructure/stores/conversation-ui.store";
import { useMessageUIStore } from "@/infrastructure/stores/message-ui.store";
import { useModelUIStore } from "@/infrastructure/stores/model-ui.store";
import { CreateConversationModal } from "@/presentation/components/features/conversation/conversation-creator";
import { ImageMessage } from '@/presentation/components/features/message/image-message';
import { ModelIcon } from '@/presentation/components/features/models/model-icons';
import { ModelSelector } from "@/presentation/components/features/models/model-selector";
import { Button } from '@/presentation/components/ui/button';
import { Card } from '@/presentation/components/ui/card';
import { Input } from '@/presentation/components/ui/input';
import { useAuth } from '@/presentation/hooks/use-auth';
import { useClients } from '@/presentation/hooks/use-clients';
import { useConversationMessages } from "@/presentation/hooks/use-conversation-messages";
import { useConversations } from "@/presentation/hooks/use-conversations";
import { useCreateConversation } from "@/presentation/hooks/use-create-conversation";
import { useDeleteConversation } from "@/presentation/hooks/use-delete-conversation";
import { useEditImage } from "@/presentation/hooks/use-edit-image";
import { useGenerateImage } from "@/presentation/hooks/use-generate-image";
import { useImageHistory } from "@/presentation/hooks/use-image-history";
import { useLoadImageGeneration } from "@/presentation/hooks/use-load-image-generation";
import { useModels } from '@/presentation/hooks/use-models';
import { useSendMessage } from "@/presentation/hooks/use-send-message";
import { useUpdateConversation } from '@/presentation/hooks/use-update-conversation';

import { Textarea } from '../../ui/textarea';
import { CreateClientModal } from '../clients/create-client-modal';
import { SearchModal } from '../conversation/search-conversation';



const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });

export const ChatHub = () => {
    //Use States
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isCreateConversationOpen, setIsCreateConversationOpen] = useState(false);
    const [isAsideOpen, setAsideOpen] = useState(true);
    const [isSearchChatActive, setIsSearchChatActive] = useState(false);
    const [memoryValue, setMemoryValue] = useState(10);
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [showModelAlert, setShowModelAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("Select a model first"); //default alert message
    const [conversationToDelete, setConversationToDelete] = useState<string | null>(null);
    const [isImageMode, setIsImageMode] = useState(false);
    const [activeSidebarTab, setActiveSidebarTab] = useState<'chat' | 'image' | 'clients'>('chat');
    const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
    const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
    const [conversationToRename, setConversationToRename] = useState<{ id: string, title: string } | null>(null);
    const [newTitleInput, setNewTitleInput] = useState("");
    const [isEditImageMode, setIsEditImageMode] = useState(false);
    const [isCreateClientOpen, setIsCreateClientOpen] = useState(false);

    const [searchTerm] = useState("");

    const { logout, user } = useAuth();

    //Stores
    const { activeModels, removeModel, setModels, removeAllModels } = useModelUIStore();
    const { activeConversations } = useConversationUIStore();
    const { selectedConversationId, selectConversation, messages, setMessages } = useMessageUIStore();

    //Hooks for data fetching
    const { models: availableModels } = useModels();
    const { isLoading: isLoadingChats } = useConversations();
    const { isLoading: isLoadingMessages } = useConversationMessages(activeSidebarTab === 'chat');
    const { imageHistory, isLoading: isLoadingImages } = useImageHistory();

    // Clients Hook - Extracted everything needed for details
    const {
        clients,
        isLoading: isLoadingClients,
        loadClients,
        selectedClientDetails,
        isLoadingDetails,
        loadClientDetails,
        clearSelectedClient
    } = useClients();
    const [isEditBrandModalOpen, setIsEditBrandModalOpen] = useState(false);
    const [clientToEditId, setClientToEditId] = useState<string | null>(null);

    //Hooks for actions   
    const { createConversation, isCreating } = useCreateConversation(() => {
        setIsCreateConversationOpen(false);
    });
    const { updateConversation, isUpdating } = useUpdateConversation(() => {
        setIsRenameModalOpen(false);
        setNewTitleInput("");
    });
    const { deleteConversation } = useDeleteConversation();
    const { sendMessage, isSending } = useSendMessage();
    const { generateImage, isGenerating } = useGenerateImage();
    const { editImage, isEditing } = useEditImage();
    const isBusy = isSending || isGenerating || isEditing;
    useLoadImageGeneration(selectedConversationId, activeSidebarTab === 'image');

    //Autoscroll to bottom on new messages
    const messagesEndRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (messagesEndRef.current) {
            requestAnimationFrame(() => {
                messagesEndRef.current?.scrollIntoView({
                    behavior: 'auto'
                });
            });
        }
    }, [messages]);

    useEffect(() => {
        if (activeSidebarTab === 'clients') {
            loadClients();
        }
    }, [activeSidebarTab, loadClients]);

    const isImageModel = useCallback((modelId: string) => {
        const model = availableModels.find(m => m.id === modelId);
        return model?.type === 'image';
    }, [availableModels]);

    const handleCreateConversation = (title: string, modelIds: string[]) => {
        createConversation({ title, model_id: modelIds });
    };

    const handleConversationClick = (id: string) => {
        if (selectedConversationId === id) return;

        setMessages([]);
        selectConversation(id);

        if (activeSidebarTab === 'chat') {
            if (isImageMode) {
                setIsImageMode(false);
            }

            const currentConversation = activeConversations.find(c => c.id === id);
            if (currentConversation && currentConversation.models) {
                setModels(currentConversation.models);
            }
        }

        if (activeSidebarTab === 'image') {
            if (!isImageMode) {
                setIsImageMode(true);
            }

            const selectedImage = imageHistory.find(img => img.id === id);

            if (selectedImage) {
                const fullModel = availableModels.find(m => m.id === selectedImage.model);

                if (fullModel) {
                    setModels([fullModel]);
                }
            }
        }
    };

    const handleTabChange = (tab: 'chat' | 'image' | 'clients') => {
        setActiveSidebarTab(tab);

        selectConversation(null);
        clearSelectedClient(); // Clear selected client if user navigates away
        setMessages([]);
        setModels([]);

        if (tab === 'chat') {
            setIsImageMode(false);
        } else if (tab === 'image') {
            setIsImageMode(true);
        }
    };

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [inputValue]);

    const handleSendMessage = async () => {
        if (!inputValue.trim() && selectedFiles.length === 0) return;

        if (!isImageMode && selectedFiles.length > 0) {
            setAlertMessage("Images are only allowed in Image Mode.");
            setShowModelAlert(true);
            setTimeout(() => setShowModelAlert(false), 3000);
            return;
        }

        if (activeModels.length === 0) {
            setShowModelAlert(true);
            setAlertMessage("Select a model first");
            setTimeout(() => setShowModelAlert(false), 3000);
            return;
        }

        const textToSend = inputValue;
        const filesToSend = [...selectedFiles];

        setInputValue("");
        setSelectedFiles([]);
        setImagePreviews([]);

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

        if (isEditImageMode && isImageMode) {
            try {
                editImage({
                    prompt: textToSend,
                });
            } catch (e) {
                setAlertMessage("Could not find an image to edit context.");
                console.error("Edit image error:", e);
                setShowModelAlert(true);
            }
            return;
        }



        if (isImageMode && !isEditImageMode) {
            const imageModelId = activeModels[0].id;

            let referenceImages: string[] = [];
            if (filesToSend.length > 0) {
                try {
                    referenceImages = await Promise.all(filesToSend.map(fileToBase64));
                } catch (error) {
                    console.error("Error converting images", error);
                }
            }

            generateImage({
                prompt: textToSend,
                modelId: imageModelId,
                conversationId: currentId,
                reference_images: referenceImages
            });

        } else {
            sendMessage(textToSend);
        }
    };

    // const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    //     if (e.key === 'Enter' && !e.shiftKey) {
    //         e.preventDefault();
    //         handleSendMessage();
    //     }
    // };

    const handleToggleEditImageMode = () => {
        setIsEditImageMode(!isEditImageMode);
        if (!isEditImageMode) {
            setInputValue("");
        } else {
            setInputValue("");
        }
    };

    const getMessageModelDetails = (messageModelId?: string) => {
        if (messageModelId) {
            const found = availableModels.find(m => m.id === messageModelId);
            if (found) return found;
        }
        if (activeModels.length > 0) {
            return activeModels[0];
        }
        return null;
    };

    const openRenameModal = (id: string, currentTitle: string) => {
        setConversationToRename({ id, title: currentTitle });
        setNewTitleInput(currentTitle);
        setIsRenameModalOpen(true);
        setActiveMenuId(null);
    };

    const handleRenameSubmit = () => {
        if (conversationToRename && newTitleInput.trim()) {
            updateConversation({ id: conversationToRename.id, title: newTitleInput });
        }
    };

    useEffect(() => {
        const handleClickOutside = () => setActiveMenuId(null);
        window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    }, []);

    const handleToggleImageMode = () => {
        const newMode = !isImageMode;
        setIsImageMode(newMode);

        if (newMode) {
            selectConversation(null);
            const defaultImageModel = availableModels.find(m => m.type === 'image');

            if (defaultImageModel) {
                setModels([defaultImageModel]);
            } else {
                console.warn("No image generation models found in the API.");
            }
        } else {
            setModels([]);
        }
    };

    const isImageMessage = (content: string | MessageContentPayload): boolean => {
        if (typeof content === 'object' && content !== null) {

            if (content.type === 'image') return true;
        }
        const text = typeof content === 'string' ? content : content.text;
        return /^\s*!\[(.*?)\]\((.*?)\)\s*$/.test(text);
    };

    // Control models based on isImageMode and other conditions
    useEffect(() => {
        const activeImageModels = activeModels.filter(m => isImageModel(m.id));
        const hasImageModel = activeImageModels.length > 0;

        const triggerAlert = (msg: string) => {
            setAlertMessage(msg);
            setShowModelAlert(true);
            setTimeout(() => setShowModelAlert(false), 3000);
        };
        //  Case 1: Image mode off, but image model active
        if (!isImageMode && hasImageModel) {
            activeImageModels.forEach(m => removeModel(m.id));
            triggerAlert("Use the 'Image' button to activate generation mode.");
            return;
        }

        //  Case 2: Image mode active, but there are multiple models (Prohibited mix)
        if (isImageMode && activeModels.length > 1 && hasImageModel) {
            const survivorId = activeImageModels[0].id;
            const fullSurvivorModel = availableModels.find(m => m.id === survivorId);

            if (fullSurvivorModel) setModels([fullSurvivorModel]);

            triggerAlert("Image generation does not support multiple models.");
            return;
        }

        // Case 3: Image mode active, but no image model selected
        if (selectedConversationId && hasImageModel && !isImageMode) {
            activeImageModels.forEach(m => removeModel(m.id));
            triggerAlert("Cannot add image generation to existing chats yet.");
            return;
        }

    }, [isImageModel, availableModels, activeModels, isImageMode, selectedConversationId, removeModel, setModels]);

    const getSourceConversations = () => {
        if (activeSidebarTab === 'chat') {
            return activeConversations;
        }
        if (activeSidebarTab === 'image') {
            return imageHistory.map(img => ({
                id: img.id,
                title: img.prompt,
                createdAt: img.created_at,
                models: [{
                    id: img.model,
                    title: "Image Model",
                    name: "Image Generation"
                }],
                originalData: img
            }));
        }
        return [];
    };

    const sourceConversations = getSourceConversations();

    const isListLoading = activeSidebarTab === 'chat' ? isLoadingChats : isLoadingImages;

    const filteredConversations = sourceConversations.filter((conversation) =>
        conversation.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Image Handler
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    const [imagePreviews, setImagePreviews] = useState<string[]>([]);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files);

            // Max 3 images rule
            const totalImages = selectedFiles.length + newFiles.length;

            if (totalImages > 3) {
                setAlertMessage("Maximum 3 images allowed.");
                setShowModelAlert(true);
                setTimeout(() => setShowModelAlert(false), 3000);

                // eslint-disable-next-line no-param-reassign
                e.target.value = '';
                return;
            }

            setSelectedFiles(prev => [...prev, ...newFiles]);

            try {
                const base64Promises = newFiles.map(file => fileToBase64(file));
                const newPreviews = await Promise.all(base64Promises);
                setImagePreviews(prev => [...prev, ...newPreviews]);
            } catch (error) {
                console.error("Error generating previews", error);
            }
        }
    };

    const removeImage = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => {
            const newPreviews = prev.filter((_, i) => i !== index);
            URL.revokeObjectURL(prev[index]);
            return newPreviews;
        });
    };

    return (
        //Simulate background
        <div className="w-full h-full bg-linear-to-br flex items-start justify-start pt-2 font-sans">

            {/* Create newConversation window */}
            <CreateConversationModal
                isOpen={isCreateConversationOpen}
                onClose={() => setIsCreateConversationOpen(false)}
                onCreate={handleCreateConversation}
                isLoading={isCreating}
            />

            <SearchModal
                key={isSearchChatActive ? 'open' : 'closed'}
                isOpen={isSearchChatActive}
                onClose={() => setIsSearchChatActive(false)}
                onSelect={handleConversationClick}
                items={sourceConversations}
            />


            {/* Menu for rename and delete */}
            {isRenameModalOpen && (
                <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/20 backdrop-blur-sm animate-in fade-in duration-200">
                    <div
                        className="bg-background p-6 rounded-3xl shadow-2xl w-full max-w-sm m-4 border border-white/50"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-lg font-bold text-font-gray mb-4">Rename Chat</h3>
                        <Input
                            value={newTitleInput}
                            onChange={(e) => setNewTitleInput(e.target.value)}
                            className="mb-6 bg-gray-50 border-gray-200"
                            placeholder="Enter new chat name..."
                            autoFocus
                            onKeyDown={(e) => e.key === 'Enter' && handleRenameSubmit()}
                        />
                        <div className="flex gap-3">
                            <Button
                                variant="ghost"
                                className="flex-1 rounded-xl"
                                onClick={() => setIsRenameModalOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                className="flex-1 rounded-xl bg-black text-white hover:bg-logo-color"
                                onClick={handleRenameSubmit}
                                disabled={isUpdating}
                            >
                                {isUpdating ? 'Saving...' : 'Save'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <div className="w-full h-dvh max-w-full flex flex-col gap-0 overflow-hidden">

                {/* Main Card */}
                <div className="w-full h-full flex gap-4 lg:gap-6 p-2 lg:p-4 relative bg-transparent">

                    {/* Sidebar */}
                    <aside
                        className={`relative hidden md:flex flex-col h-full shrink-0 transition-all duration-300 ease-in-out ${isAsideOpen
                            ? 'w-5 lg:w-60 xl:w-64 2xl:w-75'
                            : 'w-0 md:w-20'
                            }`}>
                        <button
                            onClick={() => setAsideOpen(!isAsideOpen)}
                            className={`absolute -right-3 top-1/2 -translate-y-1/2 z-50 flex items-center justify-center w-8 h-14 bg-white border border-gray-200 shadow-md rounded-full hover:bg-gray-50 transition-all cursor-pointer group ${isCreateConversationOpen ? 'hidden' : ''}`}
                            disabled={isCreateConversationOpen}
                        >
                            {isAsideOpen ? (
                                <PanelRightOpen size={22} className="text-gray-500 group-hover:text-black" />
                            ) : (
                                <PanelLeftOpen size={22} className="text-gray-500 group-hover:text-black" />
                            )}
                        </button>

                        <Card className={`h-full w-full flex flex-col bg-card/40 backdrop-blur-3xl border border-white/20 shadow-xl rounded-3xl overflow-hidden transition-all duration-300 ${isAsideOpen ? 'p-4' : 'py-5 px-2 items-center'}`}>

                            {/* Logo*/}
                            <div
                                className={`flex items-center cursor-pointer transition-opacity hover:opacity-80 shrink-0 ${isAsideOpen ? 'mb-1.5 px-1 justify-start' : 'mb-1.5 justify-center'}`}
                                onClick={() => {
                                    selectConversation(null);
                                    setModels([]);
                                    setIsPopoverOpen(false);
                                }}
                            >
                                <div className="flex items-center">
                                    <div className="relative flex items-center justify-center shrink-0">
                                        <Image
                                            src="/kromaticos_logo.svg"
                                            alt="Kromaticos Logo"
                                            width={35}
                                            height={35}
                                            className="object-contain relative z-10"
                                        />
                                        <span className="absolute -top-1.5 -right-3.5 bg-destructive text-white text-[10px] font-bold px-1.5 rounded-sm z-20">IA</span>
                                    </div>


                                    <div className={`overflow-hidden transition-all duration-300 ease-in-out flex items-center ${isAsideOpen ? 'max-w-37.5 opacity-100' : 'max-w-0 opacity-0'}`}>
                                        <span className="text-[26px] font-extrabold text-logo-color tracking-tighter leading-none -ml-0.5 mt-5">romaticos</span>
                                    </div>
                                </div>
                            </div>


                            {/* MENU DE NAVEGACIÓN UNIFICADO */}
                            <div className={`w-full flex flex-col gap-1 bg-background rounded-2xl   px-1 mb-4 mt-2 transition-all duration-300 ${isAsideOpen ? 'items-stretch' : 'items-center'}`}>

                                {/*New Chat */}
                                <Button
                                    onClick={() => setIsCreateConversationOpen(true)}
                                    variant="ghost"
                                    className={`relative flex items-center group cursor-pointer transition-all duration-200 border-0 shadow-none
                            ${isAsideOpen
                                            ? 'w-full h-10 px-3 rounded-xl justify-start hover:bg-gray-100/50'
                                            : 'w-10 h-10 rounded-full justify-center hover:bg-gray-100/50'
                                        }`}
                                >
                                    <SquarePen className={`h-4.5 w-4.5 text-gray-500 group-hover:text-logo-color transition-all shrink-0 ${isAsideOpen ? 'mr-3' : ''}`} />
                                    <div className={`font-medium text-sm text-gray-700 group-hover:text-gray-900 truncate transition-all duration-200 ${isAsideOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>
                                        New chat
                                    </div>
                                </Button>

                                {/*Chat */}
                                <Button
                                    onClick={() => handleTabChange('chat')}
                                    variant="ghost"
                                    className={`relative flex items-center group cursor-pointer transition-all duration-200 border-0 shadow-none
                            ${isAsideOpen
                                            ? `w-full h-10 px-3 rounded-xl justify-start ${activeSidebarTab === 'chat' ? 'bg-secondary-blue/15' : 'hover:bg-gray-100/50'}`
                                            : `w-10 h-10 rounded-full justify-center ${activeSidebarTab === 'chat' ? 'bg-secondary-blue/15' : 'hover:bg-gray-100/50'}`
                                        }`}
                                >
                                    <MessageSquare className={`h-4.5 w-4.5 transition-all shrink-0 ${activeSidebarTab === 'chat' ? 'text-secondary-blue' : 'text-gray-500 group-hover:text-logo-color'} ${isAsideOpen ? 'mr-3' : ''}`} />
                                    <div className={`font-medium text-sm truncate transition-all duration-200 ${activeSidebarTab === 'chat' ? 'text-secondary-blue font-semibold' : 'text-gray-700 group-hover:text-gray-900'} ${isAsideOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>
                                        Chat
                                    </div>
                                </Button>

                                {/*Image */}
                                <Button
                                    onClick={() => handleTabChange('image')}
                                    variant="ghost"
                                    className={`relative flex items-center group cursor-pointer transition-all duration-200 border-0 shadow-none
                            ${isAsideOpen
                                            ? `w-full h-10 px-3 rounded-xl justify-start ${activeSidebarTab === 'image' ? 'bg-secondary-blue/15' : 'hover:bg-gray-100/50'}`
                                            : `w-10 h-10 rounded-full justify-center ${activeSidebarTab === 'image' ? 'bg-secondary-blue/15' : 'hover:bg-gray-100/50'}`
                                        }`}
                                >
                                    <ImageIcon className={`h-4.5 w-4.5 transition-all shrink-0 ${activeSidebarTab === 'image' ? 'text-secondary-blue' : 'text-gray-500 group-hover:text-logo-color'} ${isAsideOpen ? 'mr-3' : ''}`} />
                                    <div className={`font-medium text-sm truncate transition-all duration-200 ${activeSidebarTab === 'image' ? 'text-secondary-blue font-semibold' : 'text-gray-700 group-hover:text-gray-900'} ${isAsideOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>
                                        Image
                                    </div>
                                </Button>

                                {/*Clients */}
                                <Button
                                    onClick={() => handleTabChange('clients')}
                                    variant="ghost"
                                    className={`relative flex items-center group cursor-pointer transition-all duration-200 border-0 shadow-none
                            ${isAsideOpen
                                            ? `w-full h-10 px-3 rounded-xl justify-start ${activeSidebarTab === 'clients' ? 'bg-secondary-blue/15' : 'hover:bg-gray-100/50'}`
                                            : `w-10 h-10 rounded-full justify-center ${activeSidebarTab === 'clients' ? 'bg-secondary-blue/15' : 'hover:bg-gray-100/50'}`
                                        }`}
                                >
                                    <LayoutGrid className={`h-4.5 w-4.5 transition-all shrink-0 ${activeSidebarTab === 'clients' ? 'text-secondary-blue' : 'text-gray-500 group-hover:text-logo-color'} ${isAsideOpen ? 'mr-3' : ''}`} />
                                    <div className={`font-medium text-sm truncate transition-all duration-200 ${activeSidebarTab === 'clients' ? 'text-secondary-blue font-semibold' : 'text-gray-700 group-hover:text-gray-900'} ${isAsideOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>
                                        Clients
                                    </div>
                                </Button>

                                {/* Search Rooms - Hidden in Clients tab */}
                                {activeSidebarTab !== 'clients' && (
                                    <Button
                                        onClick={() => setIsSearchChatActive(true)}
                                        variant="ghost"
                                        className={`relative flex items-center group cursor-text transition-all duration-200 border-0 shadow-none
                                ${isAsideOpen
                                                ? 'w-full h-10 px-3 rounded-xl justify-start bg-background/50 hover:bg-white border border-transparent hover:shadow-sm'
                                                : 'w-10 h-10 rounded-full justify-center hover:bg-gray-100/50'
                                            }`}
                                    >
                                        <Search className={`h-4.5 w-4.5 text-gray-500 group-hover:text-logo-color transition-all shrink-0 ${isAsideOpen ? 'mr-3' : ''}`} />
                                        <div className={`text-sm text-gray-600 truncate transition-all duration-200 ${isAsideOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>
                                            Search rooms...
                                        </div>
                                    </Button>
                                )}
                            </div>

                            {/* Chats & Images History List - Hidden in Clients tab */}
                            {activeSidebarTab !== 'clients' && (
                                <div className={`flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar w-full transition-opacity duration-300 ${isAsideOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>
                                    <h3 className="text-xs font-bold text-logo-color tracking-wider pl-2 mb-2">Active Chats</h3>

                                    {/* Render of Active Chats */}
                                    {isListLoading && activeConversations.length === 0 && (
                                        <div className="flex flex-col gap-2 px-2 animate-pulse">
                                            <p className="text-xs text-font-gray text-center mt-2">Syncing history...</p>
                                        </div>
                                    )}

                                    {/* Empty State */}
                                    {!isLoadingChats && filteredConversations.length === 0 && (
                                        <div className="flex flex-col gap-2 px-2 mt-10 opacity-60">
                                            <p className="text-xs text-font-gray italic text-center">
                                                {activeSidebarTab === 'chat' && "No text conversations found."}
                                                {activeSidebarTab === 'image' && "No image history found."}
                                            </p>
                                        </div>
                                    )}

                                    {activeConversations.length === 0 && (
                                        <p className="text-xs text-white italic pl-2">No active Conversations.</p>
                                    )}

                                    {/* Map through conversations */}
                                    {filteredConversations.map(conversation => (
                                        <div
                                            key={conversation.id}
                                            onClick={() => handleConversationClick(conversation.id)}
                                            className={`group flex items-center justify-between px-3 py-3 rounded-xl cursor-pointer transition-all border border-transparent 
                                            ${selectedConversationId === conversation.id
                                                    ? 'bg-background shadow-md border-white/60'
                                                    : 'bg-background/40 hover:bg-background/70 hover:border-white/50'
                                                }`}
                                        >
                                            <div className="flex flex-col overflow-hidden max-w-[80%]">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-semibold text-logo-color truncate">{conversation.title}</span>
                                                </div>
                                                <span className="text-[10px] text-font-gray pl-6 truncate">
                                                    {conversation.models.length} models
                                                </span>
                                            </div>
                                            <div className="relative">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setActiveMenuId(activeMenuId === conversation.id ? null : conversation.id);
                                                    }}
                                                    className={`p-1.5 rounded-lg transition-all 
                                                        ${activeMenuId === conversation.id
                                                            ? 'bg-gray-200 opacity-100'
                                                            : 'opacity-0 group-hover:opacity-100 hover:bg-white/80 text-font-gray'}`}
                                                >
                                                    <MoreVertical size={16} />
                                                </button>

                                                {/* Floating Menu */}
                                                {activeMenuId === conversation.id && (
                                                    <div
                                                        className="absolute right-0 top-8 w-32 bg-white rounded-xl shadow-xl border border-gray-100 p-1 z-50 animate-in fade-in zoom-in-95 duration-100"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <button
                                                            onClick={() => openRenameModal(conversation.id, conversation.title)}
                                                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-black rounded-lg transition-colors text-left"
                                                        >
                                                            <Pencil size={14} />
                                                            Rename
                                                        </button>

                                                        <div className="h-px bg-gray-100 my-1" />

                                                        <button
                                                            onClick={() => {
                                                                setConversationToDelete(conversation.id);
                                                                setActiveMenuId(null);
                                                            }}
                                                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors text-left"
                                                        >
                                                            <Trash2 size={14} />
                                                            Delete
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Card>
                    </aside>

                    {conversationToDelete && (
                        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/20 backdrop-blur-sm animate-in fade-in duration-200">

                            <div
                                className="bg-background/90 border border-white/50 p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] max-w-xs w-full text-center transform transition-all scale-100 m-4"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
                                    <Trash2 size={24} />
                                </div>

                                <h3 className="text-lg font-bold text-logo-color mb-2">Delete chat?</h3>
                                <p className="text-sm text-font-gray mb-6 leading-relaxed">
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
                                        className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-destructive hover:bg-red-600 shadow-lg shadow-red-500/30 transition-all hover:scale-[1.02]"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="absolute top-4 right-4 lg:top-5 lg:right-6 z-70">
                        <div className="flex items-center gap-3">
                            <div className='relative'>
                                <div
                                    className="flex items-center bg-background rounded-full p-1 pr-3 gap-2.5 shadow-sm cursor-pointer hover:bg-gray-50 transition-all duration-300 ease-in-out"
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                >
                                    <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 flex items-center justify-center">
                                        <Image src="/user_avatar.svg" alt="User" width={48} height={48} className="rounded-full" />
                                    </div>

                                    <div className="flex flex-col text-left justify-center">
                                        <span className="text-[14px] font-bold text-logo-color leading-none whitespace-nowrap mt-0.5">
                                            User {/* PlaceHolder */}
                                        </span>

                                        <div
                                            className={`grid transition-all duration-300 ease-in-out ${isMenuOpen ? 'grid-rows-[1fr] opacity-100 mt-1' : 'grid-rows-[0fr] opacity-0'
                                                }`}
                                        >
                                            <span className="text-[12px] text-gray-500 overflow-hidden whitespace-nowrap leading-none">
                                                {user?.email || 'Loading...'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="shrink-0 flex items-center justify-center ml-0.5 mt-0.5">
                                        <ChevronDown
                                            size={16}
                                            className={`text-gray-400 transition-transform duration-300 ${isMenuOpen ? 'rotate-180' : 'rotate-0'}`}
                                        />
                                    </div>

                                    {isMenuOpen && (
                                        <div className="absolute top-[calc(100%+8px)] right-0 w-48 bg-background rounded-xl shadow-xl border border-gray-100 p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                                            <ul className="flex flex-col gap-0.5">
                                                {['Credits', 'Keys', 'Activity', 'Settings', 'Enterprise'].map((item) => (
                                                    <li key={item} className="px-3 py-1.5 text-sm text-gray-600 hover:text-black hover:bg-gray-50 rounded-lg cursor-pointer transition-colors font-medium">
                                                        {item}
                                                    </li>
                                                ))}

                                                <li
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        logout();
                                                    }}
                                                    className="px-3 py-1.5 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-colors font-medium"
                                                >
                                                    Sign out
                                                </li>
                                            </ul>

                                            <div className="h-px bg-gray-100 my-1.5 mx-1" />

                                            <div className="bg-gray-100 p-0.5 rounded-lg flex items-center justify-between">
                                                <button className="flex-1 flex items-center justify-center py-1 rounded-md bg-background shadow-sm transition-all">
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

                    {/* Main Content Area */}
                    <main className={`flex-1 relative flex flex-col h-full rounded-[2.5rem] overflow-hidden min-w-0 ${activeSidebarTab === 'clients' ? 'p-0 pt-10 2xl:pt-14 pb-0 2xl:pb-0 px-4 md:px-8 2xl:px-16' : 'p-0'}`}>

                        {activeSidebarTab === 'clients' ? (

                            // --- CLIENTS VIEW ---
                            <div className="w-full h-full flex flex-col p-8 bg-card/40 backdrop-blur-md rounded-3xl border border-white/20 shadow-xl animate-in fade-in zoom-in-95 duration-300 overflow-y-auto custom-scrollbar">

                                {isLoadingDetails ? (
                                    // Loader for detail view
                                    <div className="flex flex-col items-center justify-center h-full py-8">
                                        <Loader2 className="animate-spin text-secondary-blue w-8 h-8 mb-4" />
                                        <p className="text-gray-500 font-medium">Loading client profile...</p>
                                    </div>
                                ) : selectedClientDetails ? (

                                    // -- SINGLE CLIENT DETAIL PROFILE --
                                    <div className="w-full max-w-5xl mx-auto flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300">

                                        {/* Back button */}
                                        <Button
                                            variant="ghost"
                                            onClick={clearSelectedClient}
                                            className="w-fit mb-6  hover:text-black hover:bg-background rounded-xl text-logo-color"
                                        >
                                            <ArrowLeft className="mr-2 h-4 w-4 " /> Back to clients
                                        </Button>

                                        {/* Profile Header */}
                                        <div className="flex items-center gap-6 mb-8 bg-white/40 p-6 rounded-3xl border border-white/60 shadow-sm">
                                            <div className="w-24 h-24 rounded-full bg-white shadow-sm flex items-center justify-center overflow-hidden border border-gray-100 shrink-0">
                                                {selectedClientDetails.client.logo_url ? (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img src={selectedClientDetails.client.logo_url} alt="Logo" className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="text-4xl select-none">🏢</span>
                                                )}
                                            </div>
                                            <div className="flex flex-col">
                                                <h2 className="text-3xl font-extrabold text-logo-color tracking-tight">
                                                    {selectedClientDetails.client.name}
                                                </h2>
                                                <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-600 font-medium">
                                                    {selectedClientDetails.client.industry && (
                                                        <span className="flex items-center gap-1.5 bg-white/60 px-3 py-1 rounded-lg border border-white">
                                                            <Building2 size={16} className="text-secondary-blue" /> {selectedClientDetails.client.industry}
                                                        </span>
                                                    )}
                                                    {selectedClientDetails.client.website && (
                                                        <span className="flex items-center gap-1.5 bg-white/60 px-3 py-1 rounded-lg border border-white">
                                                            <Globe size={16} className="text-secondary-blue" /> {selectedClientDetails.client.website}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Grid for details */}
                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                                            {/* Left Column - General Info */}
                                            <div className="lg:col-span-2 space-y-6">
                                                <Card className="p-6 bg-white/50 backdrop-blur-sm border-white/40 shadow-sm rounded-3xl">
                                                    <h3 className="text-lg font-bold text-logo-color mb-3 flex items-center gap-2">
                                                        <FileText size={18} className="text-secondary-blue" /> Description
                                                    </h3>
                                                    <p className="text-gray-600 text-sm leading-relaxed">
                                                        {selectedClientDetails.client.description || "No description provided for this client."}
                                                    </p>
                                                </Card>

                                                <Card className="p-6 bg-white/50 backdrop-blur-sm border-white/40 shadow-sm rounded-3xl">
                                                    <h3 className="text-lg font-bold text-logo-color mb-5 flex items-center gap-2">
                                                        <Palette size={18} className="text-secondary-blue" /> Brand Profile
                                                    </h3>

                                                    {/* Colors Grid */}
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

                                                        {/* Primary Colors */}
                                                        {selectedClientDetails.brand_profile?.primary_colors && selectedClientDetails.brand_profile.primary_colors.length > 0 && (
                                                            <div>
                                                                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 block">Primary Colors</span>
                                                                <div className="flex flex-wrap gap-2">
                                                                    {selectedClientDetails.brand_profile.primary_colors.map((color, i) => (
                                                                        <div key={i} className="flex items-center gap-2 bg-white/70 p-1.5 pr-3 rounded-xl border border-gray-200/80 shadow-sm hover:shadow-md transition-all">
                                                                            <div className="w-6 h-6 rounded-full border-[1.5px] border-white shadow-sm" style={{ backgroundColor: color }}></div>
                                                                            <span className="text-xs font-semibold text-gray-700 font-mono">{color}</span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Secondary Colors */}
                                                        {selectedClientDetails.brand_profile?.secondary_colors && selectedClientDetails.brand_profile.secondary_colors.length > 0 && (
                                                            <div>
                                                                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 block">Secondary Colors</span>
                                                                <div className="flex flex-wrap gap-2">
                                                                    {selectedClientDetails.brand_profile.secondary_colors.map((color, i) => (
                                                                        <div key={i} className="flex items-center gap-2 bg-white/70 p-1.5 pr-3 rounded-xl border border-gray-200/80 shadow-sm hover:shadow-md transition-all">
                                                                            <div className="w-6 h-6 rounded-full border-[1.5px] border-white shadow-sm" style={{ backgroundColor: color }}></div>
                                                                            <span className="text-xs font-semibold text-gray-700 font-mono">{color}</span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Accent Colors */}
                                                        {selectedClientDetails.brand_profile?.accent_colors && selectedClientDetails.brand_profile.accent_colors.length > 0 && (
                                                            <div>
                                                                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 block">Accent Colors</span>
                                                                <div className="flex flex-wrap gap-2">
                                                                    {selectedClientDetails.brand_profile.accent_colors.map((color, i) => (
                                                                        <div key={i} className="flex items-center gap-2 bg-white/70 p-1.5 pr-3 rounded-xl border border-gray-200/80 shadow-sm hover:shadow-md transition-all">
                                                                            <div className="w-6 h-6 rounded-full border-[1.5px] border-white shadow-sm" style={{ backgroundColor: color }}></div>
                                                                            <span className="text-xs font-semibold text-gray-700 font-mono">{color}</span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Forbidden Colors */}
                                                        {selectedClientDetails.brand_profile?.forbidden_colors && selectedClientDetails.brand_profile.forbidden_colors.length > 0 && (
                                                            <div>
                                                                <span className="text-[11px] font-bold text-red-400 uppercase tracking-wider mb-2 block">Forbidden Colors</span>
                                                                <div className="flex flex-wrap gap-2">
                                                                    {selectedClientDetails.brand_profile.forbidden_colors.map((color, i) => (
                                                                        <div key={i} className="flex items-center gap-2 bg-red-50/80 p-1.5 pr-3 rounded-xl border border-red-100/80 shadow-sm hover:shadow-md transition-all group">
                                                                            <div className="w-6 h-6 rounded-full border-[1.5px] border-red-200 shadow-sm relative flex items-center justify-center overflow-hidden" style={{ backgroundColor: color }}>
                                                                                {/* Red strike-through line */}
                                                                                <div className="w-[120%] h-0.5 bg-red-500/80 absolute rotate-45 group-hover:bg-red-600 transition-colors"></div>
                                                                            </div>
                                                                            <span className="text-xs font-semibold text-red-700 font-mono">{color}</span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Typography & Notes */}
                                                    <div className="grid grid-cols-2 gap-6 pt-6 border-t border-gray-200/50">
                                                        <div>
                                                            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Typography Style</span>
                                                            <p className="text-sm text-logo-color mt-1 font-medium">
                                                                {selectedClientDetails.brand_profile?.typography_style || "Not specified"}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Font Preferences</span>
                                                            <p className="text-sm text-logo-color mt-1 font-medium">
                                                                {selectedClientDetails.brand_profile?.font_preferences || "Not specified"}
                                                            </p>
                                                        </div>
                                                        <div className="col-span-2">
                                                            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Style Notes</span>
                                                            <p className="text-sm text-gray-600 mt-1 bg-white/40 p-3 rounded-xl border border-white/60">
                                                                {selectedClientDetails.brand_profile?.style_notes || "No additional style notes."}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </Card>
                                            </div>

                                            {/* Right Column - Stats / Assets */}
                                            <div className="space-y-6">

                                                {/* Edit Client Brand */}
                                                <Button
                                                    onClick={() => {
                                                        if (selectedClientDetails?.client.id) {
                                                            setClientToEditId(selectedClientDetails.client.id);
                                                            setIsEditBrandModalOpen(true);
                                                        }
                                                    }}
                                                    className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-bold text-black bg-background hover:bg-secondary-blue hover:text-white border border-secondary-blue/20 transition-all duration-300 shadow-sm hover:shadow-md"
                                                >
                                                    <Pencil size={16} />
                                                    Edit Client Brand
                                                </Button>

                                                <Card className="p-6 bg-background/50 backdrop-blur-sm border-background/40 shadow-sm rounded-3xl flex flex-col gap-4">
                                                    <h3 className="text-lg font-bold text-logo-color flex items-center gap-2">
                                                        <ImageIcon size={18} className="text-secondary-blue" /> Assets
                                                    </h3>

                                                    <div className="bg-background/60 rounded-2xl p-4 flex items-center justify-between border border-background shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                                                        <span className="text-sm text-gray-700 font-semibold">Reference Images</span>
                                                        <span className="bg-secondary-blue/15 text-secondary-blue px-3 py-1 rounded-full text-sm font-bold">
                                                            {selectedClientDetails.reference_images_count}
                                                        </span>
                                                    </div>
                                                    <div className="bg-background/60 rounded-2xl p-4 flex items-center justify-between border border-background shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                                                        <span className="text-sm text-gray-700 font-semibold">Templates</span>
                                                        <span className="bg-secondary-blue/15 text-secondary-blue px-3 py-1 rounded-full text-sm font-bold">
                                                            {selectedClientDetails.templates_count}
                                                        </span>
                                                    </div>
                                                </Card>
                                            </div>

                                        </div>
                                    </div>

                                ) : isLoadingClients ? (

                                    // Loader for the grid
                                    <div className="flex flex-col items-center justify-center h-full py-8">
                                        <Loader2 className="animate-spin text-secondary-blue w-8 h-8 mb-4" />
                                        <p className="text-gray-500 font-medium">Loading clients...</p>
                                    </div>

                                ) : clients.length === 0 ? (

                                    // Empty state - Create Client
                                    <div className="flex items-center justify-center h-full w-full">
                                        <Card className="w-full max-w-sm aspect-4/3 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:bg-background/40 hover:border-secondary-blue/50 transition-all duration-300 rounded-4xl shadow-none bg-transparent group">
                                            <div className="w-16 h-16 bg-background shadow-sm rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 border border-gray-100">
                                                <UserPlus size={28} className="text-gray-400 group-hover:text-secondary-blue transition-colors" />
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-700 group-hover:text-gray-900 transition-colors">Crear cliente</h3>
                                            <p className="text-sm text-gray-500 mt-2 text-center px-6 leading-relaxed">
                                                Aún no tienes clientes registrados. Añade tu primer cliente para comenzar a trabajar.
                                            </p>
                                        </Card>
                                    </div>

                                ) : (

                                    // Grid of Clients
                                    <div className="w-full max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                        {/* Create new client card inside the grid */}
                                        <Card onClick={() => setIsCreateClientOpen(true)} className="aspect-4/3 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:bg-background/40 hover:border-secondary-blue/50 transition-all duration-300 rounded-4xl shadow-none bg-transparent group">
                                            <div className="w-12 h-12 bg-background shadow-sm rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 border border-gray-100">
                                                <UserPlus size={20} className="text-gray-400 group-hover:text-secondary-blue transition-colors" />
                                            </div>
                                            <h3 className="text-sm font-bold text-gray-700 group-hover:text-gray-900 transition-colors">Añadir cliente</h3>
                                        </Card>

                                        {/* Fetched Clients */}
                                        {clients.map((client) => (
                                            <Card
                                                key={client.id}
                                                onClick={() => loadClientDetails(client.id)} // <-- Fetch details on click
                                                className="aspect-4/3 bg-background/50 backdrop-blur-sm border border-background/60 shadow-sm hover:shadow-lg hover:border-background flex flex-col items-center justify-center cursor-pointer transition-all duration-300 rounded-4xl group hover:-translate-y-1"
                                            >
                                                <div className="w-20 h-20 rounded-full bg-background shadow-sm flex items-center justify-center mb-4 overflow-hidden border border-gray-100 group-hover:scale-105 transition-transform duration-300">
                                                    {client.logo_url ? (
                                                        // eslint-disable-next-line @next/next/no-img-element
                                                        <img src={client.logo_url} alt={client.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <span className="text-4xl select-none">🏢</span>
                                                    )}
                                                </div>
                                                <h3 className="text-lg font-bold text-logo-color group-hover:text-secondary-blue transition-colors text-center px-4 w-full truncate">
                                                    {client.name}
                                                </h3>
                                                {client.industry && (
                                                    <p className="text-xs text-gray-500 mt-1 truncate max-w-[80%] font-medium">{client.industry}</p>
                                                )}
                                            </Card>
                                        ))}
                                    </div>
                                )}
                            </div>

                        ) : (
                            // --- CHAT / IMAGES VIEW ---
                            <>
                                {/* New Conversation & Add Model */}
                                <div className="absolute top-3 left-16 md:left-4 right-48 lg:right-56 2xl:top-6 2xl:left-8 2xl:right-64 flex items-start gap-2 2xl:gap-3 z-30">
                                    {/*Models List*/}

                                    <div className="flex items-center gap-2 overflow-x-auto pr-2 pb-3 w-full [&::-webkit-scrollbar]:h-4  [&::-webkit-scrollbar-thumb]:bg-background [&::-webkit-scrollbar-thumb]:rounded-full">

                                        {activeModels.length === 0 && (
                                            <Button
                                                variant="outline"
                                                className="shrink-0 rounded-full bg-background border-background/40 text-black hover:bg-background/30 px-2 h-10 gap-2 font-medium backdrop-blur-md whitespace-nowrap">
                                                No active models
                                            </Button>
                                        )}

                                        {activeModels.length > 0 && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeAllModels();
                                                    setIsImageMode(false);
                                                }}
                                                className="shrink-0 h-10 group flex items-center gap-1.5 px-2 rounded-full bg-red-50/80 hover:bg-red-100 border border-red-200 text-destructive transition-all shadow-sm backdrop-blur-md"
                                            >
                                                <Trash2 size={14} />
                                                <span className="text-xs font-semibold whitespace-nowrap">Clear all models</span>
                                            </button>
                                        )}

                                        {/* Models mapping */}
                                        {activeModels.map((model) => (
                                            <div
                                                key={model.id}
                                                className="shrink-0 h-10 group flex items-center justify-between px-3 py-2 rounded-full bg-background hover:bg-background/60 cursor-pointer transition-all border border-white/20 hover:border-white/50 shadow-accent-foreground backdrop-blur-md">
                                                <div className="flex items-center gap-2 overflow-hidden">
                                                    {model.id && (
                                                        <ModelIcon modelName={model.id} />
                                                    )}
                                                    <span className="text-xs text-logo-color font-medium whitespace-nowrap">
                                                        {model.title}
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeModel(model.id);
                                                        if (isImageModel(model.id)) {
                                                            setIsImageMode(false);
                                                        }
                                                    }}
                                                    className=" group-hover:opacity-100 ml-2 p-0.5 bg-red-100 rounded-full text-destructive transition-all shrink-0">
                                                    <X size={12} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="shrink-0 flex items-center gap-2 2xl:gap-3 pl-1">
                                        {activeModels.length > 0 && <div className="h-10 w-px bg-gray-400/30 shrink-0 mx-1"></div>}
                                        <div className="shrink-0">
                                            <ModelSelector />
                                        </div>
                                    </div>
                                </div>


                                <div className="flex-1 overflow-y-auto px-4 md:px-8 2xl:px-16 pt-14 2xl:pt-20 pb-8 2xl:pb-24 mt-20 2xl:mt-24 scrollbar-hide [&::-webkit-scrollbar]:hidden! [-ms-overflow-style:none] [scrollbar-width:none]">
                                    {/* A: No chat selected -> Cards */}
                                    {!selectedConversationId ? (
                                        <div className="w-full max-w-4xl 2xl:max-w-5xl mx-auto flex flex-col justify-center h-full pb-4 animate-in fade-in zoom-in-95 duration-300">
                                            {filteredConversations.length > 0 ? (
                                                <>
                                                    <h2 className="font-semibold text-logo-color tracking-wide mb-3 pl-2 uppercase text-3xl">Jump back in!</h2>
                                                    <div className="flex gap-3 2xl:gap-4 w-full overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:h-4 [&::-webkit-scrollbar-thumb]:bg-background [&::-webkit-scrollbar-thumb]:rounded-full">
                                                        {filteredConversations.slice(0, 10).map((conversation) => (
                                                            <Card
                                                                key={conversation.id}
                                                                onClick={() => handleConversationClick(conversation.id)}
                                                                className="group shrink-0 snap-start  md:w-70 2xl:w-[320px] h-40 2xl:h- rounded-3xl 2xl:rounded-4xl bg-background/80 backdrop-blur-md border border-white/40 shadow-sm hover:shadow-lg hover:border-white/80 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between p-4 2xl:p-6"
                                                            >
                                                                <div className="flex justify-between items-start gap-2">
                                                                    <h3 className="font-medium text-logo-color text-sm 2xl:text-base line-clamp-2">
                                                                        {conversation.title}
                                                                    </h3>
                                                                    <MessageSquare size={16} className="text-gray-400 group-hover:text-secondary-blue shrink-0" />
                                                                </div>
                                                                <div className="text-[11px] 2xl:text-xs text-gray-500 font-medium flex items-center gap-1.5">
                                                                    <div className="w-1.5 h-1.5 rounded-full bg-secondary-blue/60 group-hover:bg-secondary-blue transition-colors"></div>
                                                                    {conversation.models.length} {conversation.models.length === 1 ? 'model' : 'models'}
                                                                </div>
                                                            </Card>
                                                        ))}
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center h-full opacity-60">
                                                    <MessageSquare size={32} className="text-gray-400 mb-4" />
                                                    <p className="text-sm text-gray-500 italic text-center">
                                                        No recent conversations. Start a new one below!
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        /* B: chat selected -> messages */
                                        <div className="flex flex-col gap-6 max-w-4xl mx-auto py-4">

                                            {isLoadingMessages ? (
                                                <div className="flex justify-center items-center h-40">
                                                    <Loader2 className="animate-spin text-white w-8 h-8" />
                                                </div>
                                            ) : messages.length === 0 ? (
                                                <div className="text-center text-white italic mt-10 text-3xl">
                                                    No messages yet. Start the conversation!
                                                </div>
                                            ) : (
                                                messages.map((msg) => (
                                                    <div
                                                        key={msg.id}
                                                        className={`group flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                                    >
                                                        <div className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>

                                                            {/* Role + Model Info */}
                                                            <div className="flex items-center gap-2 mb-2 opacity-70 text-xs font-semibold uppercase tracking-wider">
                                                                <span>{msg.role}</span>
                                                                {msg.role === 'user' ? (
                                                                    <Image src="/user_avatar.svg" alt="User" width={30} height={30} />
                                                                ) : (
                                                                    (() => {
                                                                        const modelDetails = getMessageModelDetails(msg.model);
                                                                        return (
                                                                            <>
                                                                                {modelDetails ? (
                                                                                    <div className="w-5 h-5 rounded-full bg-background border border-gray-200 flex items-center justify-center overflow-hidden">
                                                                                        <ModelIcon modelName={modelDetails.id} />
                                                                                    </div>
                                                                                ) : (
                                                                                    <Bot size={14} />
                                                                                )}
                                                                                <span>
                                                                                    {modelDetails ? modelDetails.id : "Assistant"}
                                                                                </span>
                                                                            </>
                                                                        );
                                                                    })()
                                                                )}
                                                            </div>

                                                            {/* Message Bubble*/}
                                                            <div
                                                                className={`rounded-3xl p-5 shadow-sm text-sm leading-relaxed w-full
                                                                    ${msg.role === 'user'
                                                                        ? 'bg-black text-white rounded-tr-sm'
                                                                        : 'bg-background text-gray-900 rounded-tl-sm'
                                                                    }`}
                                                            >
                                                                {isImageMessage(msg.content) ? (
                                                                    <ImageMessage content={msg.content} />
                                                                ) : (
                                                                    <TextMessage content={msg.content} />
                                                                )}
                                                            </div>

                                                            {/* Button zone */}
                                                            {msg.role === 'assistant' && (
                                                                <div className="flex items-center justify-start w-full gap-1 mt-1.5 pl-2 text-gray-400">

                                                                    {/* Placeholder: Like */}
                                                                    <button
                                                                        className="p-1.5 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                                        title="Good response"
                                                                    >
                                                                        <ThumbsUp size={14} />
                                                                    </button>

                                                                    {/* Dislike = remove model */}
                                                                    <button
                                                                        onClick={() => {
                                                                            if (msg.model) {
                                                                                removeModel(msg.model);
                                                                                setAlertMessage(`Modelo ${msg.model} removido`);
                                                                                setShowModelAlert(true);
                                                                                setTimeout(() => setShowModelAlert(false), 2000);
                                                                            }
                                                                        }}
                                                                        className="p-1.5 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                                        title="Bad response (Remove model)"
                                                                    >
                                                                        <ThumbsDown size={14} />
                                                                    </button>

                                                                    {/* Placeholder: Re-send */}
                                                                    <button
                                                                        className="p-1.5 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                                                        title="Forward / Resend"
                                                                    >
                                                                        <CornerUpRight size={14} />
                                                                    </button>

                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))
                                            )}

                                            {/*Typing Indicator*/}
                                            {isBusy && (
                                                <div className="flex w-full justify-start animate-in fade-in duration-300">
                                                    <div className="flex flex-col max-w-[85%] items-start">

                                                        <div className="flex items-center gap-2 mb-2 opacity-70 text-xs font-semibold uppercase tracking-wider">
                                                            {activeModels.length === 0 ? (
                                                                <>
                                                                    <Bot size={14} />
                                                                    <span>Assistant</span>
                                                                </>
                                                            ) : activeModels.length === 1 ? (
                                                                // 1 model active = name + logo
                                                                <>
                                                                    <div className="w-5 h-5 rounded-full bg-background border border-gray-200 flex items-center justify-center overflow-hidden">
                                                                        <ModelIcon modelName={activeModels[0].id} />
                                                                    </div>
                                                                    <span>{activeModels[0].title || activeModels[0].id}</span>
                                                                </>
                                                            ) : (
                                                                // Multiple models active = stack of logos
                                                                <div className="flex items-center -space-x-1.5">
                                                                    {activeModels.map((model, idx) => (
                                                                        <div
                                                                            key={`loading-${model.id}-${idx}`}
                                                                            className="relative w-5 h-5 rounded-full bg-background border border-gray-200 flex items-center justify-center overflow-hidden"
                                                                            style={{ zIndex: activeModels.length - idx }}
                                                                        >
                                                                            <ModelIcon modelName={model.id} />
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className="rounded-3xl px-5 py-4 shadow-sm w-fit bg-background text-gray-900 rounded-tl-sm flex items-center gap-1.5 h-11 border border-white/40">
                                                            {/* Writing docs*/}
                                                            <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                                            <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                                            <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            <div ref={messagesEndRef} />
                                        </div>
                                    )}
                                </div>

                                {/* Input Area */}
                                <div className="w-full h-auto px-4 md:px-8 2xl:px-16 pb-0 z-40 flex justify-center shrink-0 mb-2 2xl:mb-2">

                                    <Card className="w-full max-w-5xl lg:max-w-6xl 2xl:max-w-7xl bg-background/80 backdrop-blur-2xl rounded-3xl 2xl:rounded-4xl shadow-2xl border border-white/60 transition-all duration-200">
                                        {imagePreviews.length > 0 && (
                                            <div className="flex gap-3 px-4 pt-3 pb-1 overflow-x-auto scrollbar-hide animate-in fade-in slide-in-from-bottom-2">
                                                {imagePreviews.map((preview, index) => (
                                                    <div key={index} className="relative group shrink-0">
                                                        <div className="w-14 h-14 rounded-2xl overflow-hidden border border-white/30 shadow-sm bg-black/5">
                                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                                            <img src={preview} alt="preview" className="w-full h-full object-cover" />
                                                        </div>
                                                        <button
                                                            onClick={() => removeImage(index)}
                                                            className="absolute -top-1 -right-1 bg-black/60 backdrop-blur-sm text-white rounded-full p-0.5 shadow-sm hover:bg-red-500 transition-all opacity-0 group-hover:opacity-100"
                                                        >
                                                            <X size={12} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}


                                        <div className="flex gap-3 px-4 mt-3 mb-1">
                                            <div
                                                onClick={() => {
                                                    if (isImageMode) {
                                                        fileInputRef.current?.click()
                                                    } else {
                                                        setAlertMessage("Switch to Image Mode to attach files");
                                                        setShowModelAlert(true);
                                                        setTimeout(() => setShowModelAlert(false), 2000);
                                                    }
                                                }}
                                                className={`mt-1 cursor-pointer transition-colors ${isImageMode ? 'text-black hover:text-secondary-blue' : 'text-gray-300 cursor-not-allowed'}`}
                                            >
                                                <Paperclip size={17} />
                                            </div>

                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={handleToggleImageMode}
                                                className={`h-8 rounded-full border text-xs font-bold gap-2 shadow-sm transition-all ${isImageMode
                                                    ? 'bg-secondary-blue text-white hover:bg-secondary-blue border-border'
                                                    : 'bg-background/80 border-border text-gray-600 hover:bg-background shadow-sm'
                                                    }`}>
                                                <ImageIcon size={14} className={isImageMode ? 'text-white' : 'text-gray-600'} />
                                                Image
                                            </Button>

                                            {isImageMode && (
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={handleToggleEditImageMode}
                                                    className={`h-8 rounded-full border text-xs font-bold gap-2 shadow-sm transition-all animate-in fade-in zoom-in-95 duration-200 ${isEditImageMode
                                                        ? 'bg-secondary-blue text-white hover:bg-secondary-blue border-border'
                                                        : 'bg-background/80 border-border text-gray-600 hover:bg-background shadow-sm'
                                                        }`}
                                                >
                                                    <Wand2 size={14} className={isEditImageMode ? 'text-white' : 'text-gray-600'} />
                                                    Edit
                                                </Button>
                                            )}

                                            <Button
                                                onClick={() => setIsPopoverOpen(!isPopoverOpen)}
                                                className={`h-8 rounded-full border text-xs font-bold gap-2 shadow-sm transition-all relative ${isPopoverOpen
                                                    ? 'bg-secondary-blue text-white hover:bg-secondary-blue border-border'
                                                    : 'bg-background/80 border-border text-gray-600 hover:bg-background shadow-sm'
                                                    }`}
                                            >
                                                <MessageSquare size={18} className={isPopoverOpen ? 'text-white' : 'text-gray-600'} />
                                                <span className="text-sm font-medium">Memory ({memoryValue})</span>
                                                <ChevronDown size={14} className={`transition-transform ${isPopoverOpen ? 'rotate-180 text-white' : 'text-gray-600'}`} />

                                                {isPopoverOpen && (
                                                    <div className="absolute bottom-full mb-2 left-0 w-80 p-4 bg-background rounded-xl shadow-2xl border border-gray-100 z-50 text-left cursor-default" onClick={e => e.stopPropagation()}>
                                                        <div className="flex justify-between items-center mb-4">
                                                            <span className="text-gray-700 font-medium">Chat memory</span>
                                                            <div className="bg-gray-100 px-3 py-1 text-black rounded-md text-sm font-mono min-w-12 text-center">
                                                                {memoryValue}
                                                            </div>
                                                        </div>
                                                        <input
                                                            type="range"
                                                            min="0"
                                                            max="500"
                                                            value={memoryValue}
                                                            onChange={(e) => setMemoryValue(parseInt(e.target.value))}
                                                            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-secondary-blue"
                                                        />
                                                        <p className="mt-3 text-xs text-black leading-relaxed">
                                                            Sends the last {memoryValue} messages from your conversation each request.
                                                        </p>
                                                    </div>
                                                )}
                                            </Button>
                                        </div>


                                        <div className="flex items-end gap-3 px-4 pt-1 pb-4 relative">

                                            <input
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                className="hidden"
                                                ref={fileInputRef}
                                                onChange={handleFileSelect}
                                                // eslint-disable-next-line no-param-reassign
                                                onClick={(e) => (e.currentTarget.value = '')}
                                            />

                                            {showModelAlert && (
                                                <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                                    <div className="flex items-center gap-2 bg-destructive text-white px-4 py-2 rounded-full backdrop-blur-md border border-destructive shadow-lg">
                                                        <span className="text-xs font-semibold whitespace-nowrap">
                                                            {alertMessage}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="flex-1">
                                                <Textarea
                                                    ref={textareaRef}
                                                    value={inputValue}
                                                    onChange={(e) => setInputValue(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter' && !e.shiftKey) {
                                                            e.preventDefault();
                                                            handleSendMessage();
                                                        } else if (e.key === 'Enter' && e.shiftKey) {
                                                            return;
                                                        }
                                                    }}
                                                    disabled={isBusy}
                                                    rows={1}
                                                    className="w-full bg-white border border-gray-200/60 shadow-sm px-5 py-3.5 text-base 2xl:text-lg placeholder:text-gray-400 focus-visible:ring-0 text-logo-color rounded-2xl transition-all focus:border-gray-300 hover:border-gray-300/80 resize-none max-h-50 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full"
                                                    placeholder={
                                                        isEditImageMode
                                                            ? "Describe the edit you want to make..."
                                                            : isImageMode
                                                                ? "Describe the image you want to generate..."
                                                                : "Start a new message..."
                                                    }
                                                />
                                            </div>

                                            <Button
                                                onClick={handleSendMessage}
                                                disabled={isBusy}
                                                size="icon"
                                                className={`rounded-2xl h-12 w-12 shrink-0 shadow-md transition-all hover:-translate-y-0.5 ${isBusy ? 'bg-gray-300 cursor-not-allowed' : 'bg-secondary-blue hover:bg-secondary-blue hover:shadow-lg text-white'
                                                    }`}
                                            >
                                                <ArrowUp size={20} />
                                            </Button>
                                        </div>

                                    </Card>
                                </div>
                            </>
                        )}
                    </main >
                </div >
            </div >
            {/* Create Client Modal */}
            <CreateClientModal
                isOpen={isCreateClientOpen}
                onClose={() => setIsCreateClientOpen(false)}
                onSuccess={() => loadClients()}
            />

            {/* Edit Brand Profile Modal */}
            <CreateClientModal
                isOpen={isEditBrandModalOpen}
                onClose={() => {
                    setIsEditBrandModalOpen(false);
                    setClientToEditId(null);
                }}
                initialStep={2} // Force it to open directly on the Brand step
                clientIdToEdit={clientToEditId} // Pass the ID to update
                onSuccess={() => {
                    // Reload both the grid and the specific client details
                    loadClients();
                    if (clientToEditId) loadClientDetails(clientToEditId);
                }}
            />
        </div >
    );
}