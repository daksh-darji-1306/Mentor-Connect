import React, { useState } from 'react';
import { Search, MoreVertical, Phone, Video, Image, Paperclip, Send } from 'lucide-react';
import { Card } from '../components/dashboard/DashboardWidgets';
import { Button } from "@/components/ui/button";

const MessagesPage = () => {
    const [selectedChat, setSelectedChat] = useState(1);

    const chats = [
        {
            id: 1,
            name: "Dr. Maria Khan",
            role: "Mentor",
            lastMessage: "That sounds like a great plan. Let's review it...",
            time: "10:30 AM",
            unread: 2,
            avatar: "M",
            color: "bg-blue-500",
            online: true
        },
        {
            id: 2,
            name: "Sarah Connor",
            role: "Mentor",
            lastMessage: "Can you send me the updated resume?",
            time: "Yesterday",
            unread: 0,
            avatar: "S",
            color: "bg-purple-500",
            online: false
        },
        {
            id: 3,
            name: "David Chen",
            role: "Mentor",
            lastMessage: "Thanks for the session!",
            time: "Oct 20",
            unread: 0,
            avatar: "D",
            color: "bg-green-500",
            online: false
        }
    ];

    const currentChat = chats.find(c => c.id === selectedChat);

    return (
        <div className="h-[calc(100vh-8rem)] min-h-[600px] flex gap-6">
            {/* Sidebar (Chat List) */}
            <Card className="w-full md:w-80 flex flex-col p-0 overflow-hidden h-full">
                <div className="p-4 border-b border-border/50">
                    <h2 className="font-bold text-lg mb-4">Messages</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search messages..."
                            className="w-full bg-secondary/30 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {chats.map((chat) => (
                        <div
                            key={chat.id}
                            onClick={() => setSelectedChat(chat.id)}
                            className={`p-4 flex gap-3 cursor-pointer transition-colors border-b border-border/30 last:border-0 ${selectedChat === chat.id
                                    ? 'bg-primary/5 border-l-4 border-l-primary'
                                    : 'hover:bg-secondary/20 border-l-4 border-l-transparent'
                                }`}
                        >
                            <div className="relative">
                                <div className={`w-12 h-12 rounded-full ${chat.color} flex items-center justify-center text-white font-bold`}>
                                    {chat.avatar}
                                </div>
                                {chat.online && (
                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline mb-1">
                                    <h4 className={`font-semibold text-sm truncate ${selectedChat === chat.id ? 'text-primary' : 'text-foreground'}`}>
                                        {chat.name}
                                    </h4>
                                    <span className="text-xs text-muted-foreground">{chat.time}</span>
                                </div>
                                <p className={`text-sm truncate ${chat.unread > 0 ? 'font-bold text-foreground' : 'text-muted-foreground'}`}>
                                    {chat.lastMessage}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Chat Window */}
            <Card className="hidden md:flex flex-1 flex-col p-0 overflow-hidden h-full">
                {/* Chat Header */}
                <div className="p-4 border-b border-border/50 flex justify-between items-center bg-secondary/5">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full ${currentChat.color} flex items-center justify-center text-white font-bold`}>
                            {currentChat.avatar}
                        </div>
                        <div>
                            <h3 className="font-bold text-foreground">{currentChat.name}</h3>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                {currentChat.online ? <span className="w-2 h-2 bg-green-500 rounded-full" /> : null}
                                {currentChat.online ? 'Online' : 'Offline'}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon"><Phone className="w-5 h-5 text-muted-foreground" /></Button>
                        <Button variant="ghost" size="icon"><Video className="w-5 h-5 text-muted-foreground" /></Button>
                        <Button variant="ghost" size="icon"><MoreVertical className="w-5 h-5 text-muted-foreground" /></Button>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-background/50">
                    {/* Date Divider */}
                    <div className="flex justify-center">
                        <span className="text-xs font-medium text-muted-foreground bg-secondary/50 px-3 py-1 rounded-full">Today</span>
                    </div>

                    {/* Message Incoming */}
                    <div className="flex gap-4 max-w-[80%]">
                        <div className={`w-8 h-8 rounded-full ${currentChat.color} flex items-center justify-center text-white text-xs font-bold mt-1`}>
                            {currentChat.avatar}
                        </div>
                        <div className="space-y-1">
                            <div className="bg-secondary rounded-2xl rounded-tl-none px-4 py-3 text-sm text-foreground">
                                Hi! I reviewed your project code. It looks solid, but there are a few optimization opportunities in the `useEffect` hooks.
                            </div>
                            <span className="text-xs text-muted-foreground ml-1">10:30 AM</span>
                        </div>
                    </div>

                    {/* Message Outgoing */}
                    <div className="flex flex-col items-end gap-1 max-w-[80%] ml-auto">
                        <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-none px-4 py-3 text-sm">
                            Thanks, Maria! I was actually struggling with the dependency array there. Could we go over that today?
                        </div>
                        <span className="text-xs text-muted-foreground mr-1">10:32 AM</span>
                    </div>
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-border/50 bg-background">
                    <div className="flex items-center gap-2 bg-secondary/30 rounded-xl p-2">
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                            <Paperclip className="w-5 h-5" />
                        </Button>
                        <input
                            type="text"
                            placeholder="Type a message..."
                            className="flex-1 bg-transparent border-none focus:ring-0 text-sm px-2 outline-none h-10"
                        />
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                            <Image className="w-5 h-5" />
                        </Button>
                        <Button size="icon" className="rounded-lg">
                            <Send className="w-4 h-4 ml-0.5" />
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default MessagesPage;
