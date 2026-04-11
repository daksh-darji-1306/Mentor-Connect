import React, { useState, useEffect } from 'react';
import { Search, MoreVertical, Phone, Video, Image, Paperclip, Send } from 'lucide-react';
import { Card } from '../components/dashboard/DashboardWidgets';
import { Button } from "@/components/ui/button";
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

const MessagesPage = () => {
    const { user } = useAuth();
    const [selectedChat, setSelectedChat] = useState("dummy-1");
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    const chats = [
        {
            id: "dummy-1",
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
            id: "dummy-2",
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
            id: "dummy-3",
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

    useEffect(() => {
        if (!user || !selectedChat) return;

        // Fetch historical messages
        const fetchMessages = async () => {
            const { data, error } = await supabase
                .from('messages')
                .select('*')
                .or(`and(sender_id.eq.${user.id},receiver_id.eq.${selectedChat}),and(sender_id.eq.${selectedChat},receiver_id.eq.${user.id})`)
                .order('created_at', { ascending: true });
                
            if (data) setMessages(data);
            if (error) console.error("Error fetching messages:", error);
        };
        fetchMessages();

        // Subscribe to real-time incoming messages
        const channel = supabase.channel('public:messages')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
                const newMsg = payload.new;
                if ((newMsg.sender_id === user.id && newMsg.receiver_id === selectedChat) || 
                    (newMsg.sender_id === selectedChat && newMsg.receiver_id === user.id)) {
                    setMessages(prev => [...prev, newMsg]);
                }
            })
            .subscribe();

        return () => supabase.removeChannel(channel);
    }, [user, selectedChat]);

    const handleSendMessage = async (e) => {
        if (e) e.preventDefault();
        if (!newMessage.trim() || !user) return;
        
        const tempMsg = {
            id: Date.now().toString(),
            sender_id: user.id,
            receiver_id: selectedChat,
            content: newMessage,
            created_at: new Date().toISOString()
        };
        
        // Optimistic UI update
        setMessages(prev => [...prev, tempMsg]);
        setNewMessage('');
        
        const { error } = await supabase.from('messages').insert([{
            sender_id: tempMsg.sender_id,
            receiver_id: tempMsg.receiver_id,
            content: tempMsg.content
        }]);
        
        if (error) console.error("Error sending message:", error);
    };

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

                    {/* Dynamic Messages Map */}
                    {messages.length === 0 && (
                        <div className="text-center text-sm text-muted-foreground pt-10">Send a message to start the conversation!</div>
                    )}
                    {messages.map(msg => {
                        const isOutgoing = msg.sender_id === user?.id;
                        return (
                            <div key={msg.id} className={`flex ${isOutgoing ? 'flex-col items-end gap-1 max-w-[80%] ml-auto' : 'gap-4 max-w-[80%]'}`}>
                                {!isOutgoing && (
                                    <div className={`w-8 h-8 rounded-full ${currentChat.color} flex items-center justify-center text-white text-xs font-bold mt-1 shrink-0`}>
                                        {currentChat.avatar}
                                    </div>
                                )}
                                <div className="space-y-1">
                                    <div className={`rounded-2xl px-4 py-3 text-sm ${isOutgoing ? 'bg-primary text-primary-foreground rounded-tr-none' : 'bg-secondary text-foreground rounded-tl-none'}`}>
                                        {msg.content}
                                    </div>
                                    <div className={`text-xs text-muted-foreground ${isOutgoing ? 'text-right mr-1' : 'ml-1'}`}>
                                        {new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Input Area */}
                <form onSubmit={handleSendMessage} className="p-4 border-t border-border/50 bg-background">
                    <div className="flex items-center gap-2 bg-secondary/30 rounded-xl p-2">
                        <Button type="button" variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                            <Paperclip className="w-5 h-5" />
                        </Button>
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 bg-transparent border-none focus:ring-0 text-sm px-2 outline-none h-10"
                        />
                        <Button type="button" variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                            <Image className="w-5 h-5" />
                        </Button>
                        <Button type="submit" size="icon" className="rounded-lg" disabled={!newMessage.trim()}>
                            <Send className="w-4 h-4 ml-0.5" />
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default MessagesPage;
