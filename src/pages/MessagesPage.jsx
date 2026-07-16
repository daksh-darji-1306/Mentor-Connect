import React, { useState, useEffect, useRef } from 'react';
import { Search, MoreVertical, Image as ImageIcon, Paperclip, Send, X, Trash2 } from 'lucide-react';
import { Card } from '../components/dashboard/DashboardWidgets';
import { Button } from "@/components/ui/button";
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { collection, query, where, onSnapshot, addDoc, getDocs, deleteDoc, doc, updateDoc, arrayUnion, setDoc } from 'firebase/firestore';

const MessagesPage = () => {
    const { user } = useAuth();
    const [selectedChat, setSelectedChat] = useState(null);
    const [chats, setChats] = useState([]);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [errorMsg, setErrorMsg] = useState(null);
    const [attachedImage, setAttachedImage] = useState(null);
    const [showMenu, setShowMenu] = useState(false);
    const [showClearModal, setShowClearModal] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (!user) return;
        // Fetch real available users to chat with
        const fetchProfiles = async () => {
            const q = query(collection(db, 'profiles'), where('id', '!=', user.id));
            const snapshot = await getDocs(q);
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            
            if (data.length > 0) {
                const formattedChats = data.map(p => ({
                    id: p.id,
                    name: p.full_name || p.email?.split('@')?.[0] || 'User',
                    role: p.role,
                    lastMessage: 'Tap to view conversation',
                    time: '',
                    unread: 0,
                    avatar: (p.full_name || p.email || 'A')[0].toUpperCase(),
                    color: p.role === 'mentor' ? 'bg-blue-500' : 'bg-green-500',
                    online: true 
                }));
                setChats(formattedChats);
                if (formattedChats.length > 0) {
                    setSelectedChat(formattedChats[0].id);
                }
            }
        };
        fetchProfiles();
    }, [user]);

    const currentChat = chats.find(c => c.id === selectedChat);

    useEffect(() => {
        if (!user || !selectedChat) return;

        // Create a unique, consistent chat ID between the two users
        const chatId = [user.id, selectedChat].sort().join('_');

        // Fetch historical and real-time messages from the specific chat's subcollection
        const q = query(
            collection(db, 'profiles', user.id, 'chats', chatId, 'messages')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            setErrorMsg(null);
            const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            // Filter out messages that this user has "deleted for me"
            const visibleMsgs = msgs.filter(msg => !msg.deleted_by?.includes(user.id));
            
            // Sort in memory to avoid needing a Firestore composite index
            visibleMsgs.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
            setMessages(visibleMsgs);
        }, (error) => {
            console.error("Error fetching real-time messages:", error);
            setErrorMsg("Firebase blocked reading messages. Check Firestore Rules.");
        });

        return () => unsubscribe();
    }, [user, selectedChat]);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        if (!file.type.startsWith('image/')) {
            setErrorMsg('Please select a valid image file.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new window.Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 800;
                let width = img.width;
                let height = img.height;

                if (width > MAX_WIDTH) {
                    height = Math.round((height * MAX_WIDTH) / width);
                    width = MAX_WIDTH;
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                
                // Compress heavily to avoid Firestore 1MB limits
                const dataUrl = canvas.toDataURL('image/jpeg', 0.6);
                setAttachedImage(dataUrl);
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    };

    const handleSendMessage = async (e) => {
        if (e) e.preventDefault();
        setErrorMsg(null);
        
        if ((!newMessage.trim() && !attachedImage) || !user || !selectedChat) return;
        
        const contentToSend = newMessage;
        const imageToSend = attachedImage;
        setNewMessage('');
        setAttachedImage(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        
        const chatId = [user.id, selectedChat].sort().join('_');

        const msgData = {
                sender_id: user.id,
                sender_name: user.full_name || user.email?.split('@')[0] || 'User',
                receiver_id: selectedChat,
                receiver_name: currentChat ? currentChat.name : 'User',
                content: contentToSend,
                ...(imageToSend && { image_data: imageToSend }),
                created_at: new Date().toISOString()
            };
        try {
            const myMsgRef = await addDoc(collection(db, 'profiles', user.id, 'chats', chatId, 'messages'), msgData);
            // Write exact same ID to other user so clearForEveryone works
            await setDoc(doc(db, 'profiles', selectedChat, 'chats', chatId, 'messages', myMsgRef.id), msgData);
        } catch (error) {
            console.error("Error sending message:", error);
            setErrorMsg("Failed to send message: " + error.message);
            setNewMessage(contentToSend); // Restore text so they don't lose it
            setAttachedImage(imageToSend); // Restore image
        }
    };

    const handleClearChat = () => {
        setShowClearModal(true);
        setShowMenu(false);
    };

    const handleClearForMe = async () => {
        if (!user || !selectedChat || messages.length === 0) return;
        try {
            const chatId = [user.id, selectedChat].sort().join('_');
            for (const msg of messages) {
                await updateDoc(doc(db, 'profiles', user.id, 'chats', chatId, 'messages', msg.id), {
                    deleted_by: arrayUnion(user.id)
                });
            }
            setShowClearModal(false);
        } catch (error) {
            console.error("Error clearing chat for me:", error);
            setErrorMsg("Failed to clear chat: " + error.message);
        }
    };

    const handleClearForEveryone = async () => {
        if (!user || !selectedChat || messages.length === 0) return;
        try {
            const chatId = [user.id, selectedChat].sort().join('_');
            for (const msg of messages) {
                await deleteDoc(doc(db, 'profiles', user.id, 'chats', chatId, 'messages', msg.id));
                await deleteDoc(doc(db, 'profiles', selectedChat, 'chats', chatId, 'messages', msg.id));
            }
            setShowClearModal(false);
        } catch (error) {
            console.error("Error clearing chat for everyone:", error);
            setErrorMsg("Failed to clear chat: " + error.message);
        }
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
                {currentChat ? (
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
                        <div className="flex items-center gap-2 relative">
                            <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => setShowMenu(!showMenu)}
                            >
                                <MoreVertical className="w-5 h-5 text-muted-foreground" />
                            </Button>
                            
                            {/* Custom Dropdown Menu */}
                            {showMenu && (
                                <div className="absolute right-0 top-12 w-48 bg-background border border-border/50 rounded-lg shadow-lg py-1 z-50 overflow-hidden">
                                    <button 
                                        onClick={handleClearChat}
                                        className="w-full text-left px-4 py-2 text-sm text-destructive hover:bg-destructive/10 flex items-center gap-2"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Clear Chat
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="p-4 border-b border-border/50 flex justify-between items-center bg-secondary/5">
                        <h3 className="font-bold text-foreground">Select a chat</h3>
                    </div>
                )}

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-background/50 relative">
                    {/* Error Banner */}
                    {errorMsg && (
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-destructive/10 text-destructive border border-destructive/20 px-4 py-2 rounded-lg text-sm font-bold z-10 text-center w-3/4 shadow-sm">
                            {errorMsg}
                        </div>
                    )}
                    
                    {/* Date Divider */}
                    <div className="flex justify-center mt-8">
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
                                {!isOutgoing && currentChat && (
                                    <div className={`w-8 h-8 rounded-full ${currentChat.color} flex items-center justify-center text-white text-xs font-bold mt-1 shrink-0`}>
                                        {currentChat.avatar}
                                    </div>
                                )}
                                <div className="space-y-1">
                                    <div className={`rounded-2xl px-4 py-3 text-sm ${isOutgoing ? 'bg-primary text-primary-foreground rounded-tr-none' : 'bg-secondary text-foreground rounded-tl-none'}`}>
                                        {msg.image_data && (
                                            <img src={msg.image_data} alt="attachment" className="max-w-full rounded-lg mb-2" />
                                        )}
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
                <div className="bg-background border-t border-border/50 flex flex-col">
                    {/* Image Preview Area */}
                    {attachedImage && (
                        <div className="px-4 pt-4 relative inline-block self-start">
                            <div className="relative">
                                <img src={attachedImage} alt="preview" className="h-20 w-auto rounded-md border border-border" />
                                <button 
                                    onClick={() => setAttachedImage(null)}
                                    className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 shadow-md"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    )}
                    
                    <form onSubmit={handleSendMessage} className="p-4">
                        <div className="flex items-center gap-2 bg-secondary/30 rounded-xl p-2">
                            <Button 
                                type="button" 
                                variant="ghost" 
                                size="icon" 
                                className="text-muted-foreground hover:text-foreground"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <Paperclip className="w-5 h-5" />
                            </Button>
                            
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                ref={fileInputRef}
                                onChange={handleImageUpload}
                            />
                            
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type a message..."
                                className="flex-1 bg-transparent border-none focus:ring-0 text-sm px-2 outline-none h-10"
                            />
                            
                            <Button type="submit" onClick={handleSendMessage} size="icon" className="rounded-lg" disabled={!newMessage.trim() && !attachedImage}>
                                <Send className="w-4 h-4 ml-0.5" />
                            </Button>
                        </div>
                    </form>
                </div>
            </Card>

            {/* Clear Chat Modal */}
            {showClearModal && (
                <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <Card className="w-full max-w-md p-6 bg-background border-border shadow-xl space-y-6">
                        <div className="space-y-2 text-center">
                            <h3 className="font-bold text-xl">Clear Chat</h3>
                            <p className="text-muted-foreground text-sm">
                                Do you want to delete these messages just for yourself, or for everyone in the chat?
                            </p>
                        </div>
                        <div className="flex flex-col gap-3">
                            <Button 
                                variant="outline" 
                                className="w-full justify-start text-foreground"
                                onClick={handleClearForMe}
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Clear for me
                            </Button>
                            <Button 
                                variant="destructive" 
                                className="w-full justify-start"
                                onClick={handleClearForEveryone}
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Clear for everyone
                            </Button>
                            <Button 
                                variant="ghost" 
                                className="w-full"
                                onClick={() => setShowClearModal(false)}
                            >
                                Cancel
                            </Button>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default MessagesPage;
