import { ChatHub } from '@/presentation/components/features/chat/chat-hub';

const ChatHubPage = () => (

    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-zinc-50 to-zinc-100  dark:from-zinc-950 dark:to-black bg-[url('/chat-bg.jpg')] bg-no-repeat">
        <ChatHub />
    </div>
);

export default ChatHubPage;